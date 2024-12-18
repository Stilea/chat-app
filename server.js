const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const nodemailer = require('nodemailer');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Public papkani ulash
app.use(express.static(path.join(__dirname, 'public')));

// Xabarlarni saqlash uchun massiv
let messages = [];

// Telegram API sozlamalari
const TELEGRAM_BOT_TOKEN = '7069971080:AAHhgW9Sf3SV2NDqmxyCBGTq7SY3pV0iyrw'; // Bot tokeningizni o'rnating
const TELEGRAM_CHAT_ID = '1435626378';    // Telegram chat IDingizni o'rnating

// Email sozlamalari
const transporter = nodemailer.createTransport({
    service: 'gmail', // O'zingizning email provayderingizni kiriting (masalan, Gmail)
    auth: {
        user: 'cool09082007@gmail.com', // O'zingizning email manzilingiz
        pass: 'ikromovich07'  // Email parolingiz
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Foydalanuvchi ismni saqlash
    socket.on('set username', (username) => {
        socket.username = username;
        console.log(`Username set for ${socket.id}: ${username}`);
    });

    // Xabar kelganda massivga saqlash
    socket.on('chat message', (msg) => {
        const message = { username: socket.username || 'Anonymous', text: msg };
        messages.push(message);

        // Xabarlarni butun chatga yuborish
        io.emit('chat message', message);

        // 200 ta xabar yetganda yuborish va massivni tozalash
        if (messages.length >= 200) {
            sendMessages(messages);
            messages = []; // Hotirani tozalash
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Xabarlarni Telegram yoki email orqali yuborish funksiyasi
function sendMessages(messages) {
    const messageText = messages.map((m) => `${m.username}: ${m.text}`).join('\n');

    // Telegramga yuborish
    sendToTelegram(messageText);

    // Email orqali yuborish
    sendToEmail(messageText);
}

// Telegramga xabar yuborish funksiyasi
function sendToTelegram(text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    axios.post(url, {
        chat_id: TELEGRAM_CHAT_ID,
        text: text
    })
    .then(() => console.log('Messages sent to Telegram'))
    .catch((err) => console.error('Error sending messages to Telegram:', err));
}

// Emailga xabar yuborish funksiyasi
function sendToEmail(text) {
    const mailOptions = {
        from: 'YOUR_EMAIL@gmail.com', // Yuboruvchi email
        to: 'RECIPIENT_EMAIL@gmail.com', // Qabul qiluvchi email
        subject: 'Chat App Messages',
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Messages sent to email:', info.response);
        }
    });
}

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
