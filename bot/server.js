import express from 'express';
import cors from 'cors';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import db from './db.js';
import { authMiddleware, generateToken } from './middleware/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const token = process.env.TELEGRAM_BOT_TOKEN;
const adminChatId = process.env.ADMIN_CHAT_ID;

// Enable CORS with credentials for React app
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

const bot = new TelegramBot(token, { polling: true });

// Basic rate limiting map (IP -> timestamp array)
const rateLimits = new Map();

// --- PUBLIC ROUTES ---
app.post('/api/book', async (req, res) => {
  try {
    const { name, phone, date, time, guests, comment } = req.body;
    
    // Simple rate limiting (max 3 req per hour per IP)
    const ip = req.ip || req.socket.remoteAddress;
    const now = Date.now();
    const timestamps = rateLimits.get(ip) || [];
    const validTimestamps = timestamps.filter(t => now - t < 3600000); // 1 hour
    
    if (validTimestamps.length >= 3) {
      return res.status(429).json({ error: 'Слишком много запросов. Попробуйте позже.' });
    }
    
    validTimestamps.push(now);
    rateLimits.set(ip, validTimestamps);

    // Insert into DB
    const stmt = db.prepare(`
      INSERT INTO bookings (name, phone, date, time, guests, comment)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name, phone, date, time, guests, comment);
    const bookingId = info.lastInsertRowid;

    // Format the date/time string
    const currentDateTime = new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date());

    const messageText = `
🧖 <b>НОВАЯ ЗАЯВКА #${bookingId}</b>

👤 <b>Гость:</b> ${name}
📞 <b>Контакт:</b> ${phone}
📅 <b>Дата:</b> ${date}
🕐 <b>Время:</b> ${time}
👥 <b>Гостей:</b> ${guests} чел.
💬 <b>Комментарий:</b> ${comment || '—'}

🕒 <b>Получена:</b> ${currentDateTime}
`;

    // Send the message to the Admin Chat with Inline Keyboard Buttons
    await bot.sendMessage(adminChatId, messageText, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Подтвердить', callback_data: `conf_${bookingId}` },
            { text: '❌ Отклонить', callback_data: `rejin_${bookingId}` }
          ]
        ]
      }
    });

    res.status(200).json({ success: true, message: 'Заявка отправлена', bookingId });
  } catch (error) {
    console.error('Error handling booking:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// --- ADMIN AUTH ROUTES ---
app.post('/api/admin/login', (req, res) => {
  const { login, password } = req.body;
  
  if (login === process.env.ADMIN_LOGIN && password === process.env.ADMIN_PASSWORD) {
    const token = generateToken({ login });
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Неверный логин или пароль' });
  }
});

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.json({ success: true });
});

// --- ADMIN API ROUTES (Protected) ---
app.get('/api/admin/stats', authMiddleware, (req, res) => {
  try {
    const revenueRow = db.prepare("SELECT SUM(amount) as total FROM bookings WHERE status = 'Закрыта'").get();
    const totalRevenue = revenueRow.total || 0;

    const bookingsCountRow = db.prepare("SELECT COUNT(*) as count FROM bookings").get();
    const bookingsCount = bookingsCountRow.count;
    
    const activeCountRow = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status IN ('Новая', 'Подтверждена')").get();
    const activeCount = activeCountRow.count;
    
    const uniqueGuestsRow = db.prepare("SELECT COUNT(DISTINCT phone) as count FROM bookings").get();
    const uniqueGuests = uniqueGuestsRow.count;

    const revenueByDay = db.prepare(`
      SELECT date, SUM(amount) as total 
      FROM bookings 
      WHERE status = 'Закрыта' 
      GROUP BY date 
      ORDER BY date ASC 
      LIMIT 14
    `).all();

    const statusCounts = db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM bookings 
      GROUP BY status
    `).all();

    res.json({
      cards: {
        revenue: totalRevenue,
        bookings: bookingsCount,
        active: activeCount,
        uniqueGuests
      },
      charts: {
        revenueByDay,
        statusCounts
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/admin/bookings', authMiddleware, (req, res) => {
  try {
    const bookings = db.prepare("SELECT * FROM bookings ORDER BY id DESC").all();
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.put('/api/admin/bookings/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { status, amount, notes, date, time, guests } = req.body;
    
    let updateSql = [];
    let params = [];
    
    if (status !== undefined) {
      updateSql.push("status = ?");
      params.push(status);
    }
    if (amount !== undefined) {
      updateSql.push("amount = ?");
      params.push(amount);
    }
    if (notes !== undefined) {
      updateSql.push("notes = ?");
      params.push(notes);
    }
    if (date !== undefined) {
      updateSql.push("date = ?");
      params.push(date);
    }
    if (time !== undefined) {
      updateSql.push("time = ?");
      params.push(time);
    }
    if (guests !== undefined) {
      updateSql.push("guests = ?");
      params.push(guests);
    }
    
    if (updateSql.length === 0) return res.status(400).json({ error: 'Нет данных для обновления' });
    
    params.push(id);
    const stmt = db.prepare(`UPDATE bookings SET ${updateSql.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
    stmt.run(...params);
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/admin/guests', authMiddleware, (req, res) => {
  try {
    const guests = db.prepare(`
      SELECT 
        name, 
        phone, 
        COUNT(*) as visits, 
        MAX(date) as lastVisit, 
        SUM(amount) as totalSpent 
      FROM bookings 
      GROUP BY phone 
      ORDER BY lastVisit DESC
    `).all();
    res.json({ guests });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// --- TELEGRAM BOT WEBHOOK/POLLING HANDLERS ---
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;
  const originalText = query.message.text || ''; 
  const adminUsername = query.from.username ? `@${query.from.username}` : query.from.first_name;
  
  const currentDateTime = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit', minute: '2-digit'
  }).format(new Date());

  try {
    const parts = data.split('_');
    const action = parts[0];
    const bookingId = parts[1];

    if (action === 'conf') {
      const newText = `<b>${originalText}</b>\n\n✅ <b>ПОДТВЕРЖДЕНО</b> ${adminUsername} в ${currentDateTime}`;
      
      db.prepare(`UPDATE bookings SET status = 'Подтверждена', updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(bookingId);

      await bot.editMessageText(newText, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: [] } 
      });
      await bot.answerCallbackQuery(query.id, { text: 'Заявка подтверждена' });
      
    } else if (action === 'rejin') {
      await bot.editMessageReplyMarkup({
        inline_keyboard: [
          [
            { text: 'Занято', callback_data: `rej_${bookingId}_bust` },
            { text: 'Тех. работы', callback_data: `rej_${bookingId}_tech` },
            { text: 'Другое', callback_data: `rej_${bookingId}_oth` }
          ],
          [
            { text: '⬅️ Назад', callback_data: `back_${bookingId}` }
          ]
        ]
      }, {
        chat_id: chatId,
        message_id: messageId
      });
      await bot.answerCallbackQuery(query.id);
      
    } else if (action === 'back') {
      await bot.editMessageReplyMarkup({
        inline_keyboard: [
          [
            { text: '✅ Подтвердить', callback_data: `conf_${bookingId}` },
            { text: '❌ Отклонить', callback_data: `rejin_${bookingId}` }
          ]
        ]
      }, {
        chat_id: chatId,
        message_id: messageId
      });
      await bot.answerCallbackQuery(query.id);
      
    } else if (action === 'rej') {
      const reasonCode = parts[2];
      const reasonMap = { 'bust': 'Занято', 'tech': 'Технические работы', 'oth': 'Другое' };
      const reason = reasonMap[reasonCode] || 'Отклонено';
      
      const newText = `<b>${originalText}</b>\n\n❌ <b>ОТКЛОНЕНО:</b> ${reason} — ${adminUsername} в ${currentDateTime}`;
      
      db.prepare(`UPDATE bookings SET status = 'Отклонена', updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(bookingId);

      await bot.editMessageText(newText, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: [] } 
      });
      await bot.answerCallbackQuery(query.id, { text: `Отклонено по причине: ${reason}` });
    }
  } catch (error) {
    console.error('Callback error:', error);
    await bot.answerCallbackQuery(query.id, { text: 'Произошла ошибка, попробуйте позже.' });
  }
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "👋 Привет! Я SaunaRelax Admin Bot.\n\nКоманды:\n/help - Список команд");
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, "Доступные команды:\n/start - Перезапустить бота\n/help - Справка");
});

app.listen(port, () => {
  console.log(`SaunaRelax Backend / Bot is running on http://localhost:${port}`);
  console.log('Telegram Bot API polling started successfully.');
});
