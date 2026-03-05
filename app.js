const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const logMiddleware = require('./middlewares/logMiddleware');
app.use(logMiddleware);

// Public routes
const auth = require('./routes/authRoute');
app.use('/auth', auth);

app.get('/', (req, res) => {
    res.send('hello');
});

// Protected routes
const authMiddleware = require('./middlewares/authMiddleware');
const router = express.Router();

router.get('/dashboard', authMiddleware.protectedRoute, (req, res) => {
    res.send(`hello ${req.user.email}`);
});

app.use(router);

module.exports = app;
