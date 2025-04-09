const express = require('express');
const bodyParser = require('body-parser');
const { sendApplication, sendReview } = require('./bot');

const app = express();
app.use(bodyParser.json());

// Маршрут для отправки заявок
app.post('/api/send-application', (req, res) => {
    sendApplication(req.body);
    res.json({ success: true });
});

// Маршрут для отправки отзывов
app.post('/api/send-review', (req, res) => {
    sendReview(req.body);
    res.json({ success: true });
});

// Раздача статических файлов
app.use(express.static('.'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
}); 