require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const LogInCollection = require('./routes/mongodb'); // تأكد من صحة المسار
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(session({
  secret: 'dawn-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// صفحة تسجيل الدخول
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// صفحة إنشاء الحساب
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// تسجيل مستخدم جديد
app.post('/signup', async (req, res) => {
  try {
    const existingUser = await LogInCollection.findOne({ name: req.body.name });

    if (existingUser) {
      return res.json({ success: false, message: 'المستخدم موجود من قبل، جرب اسم آخر' });
    }

    const newUser = new LogInCollection({
      name: req.body.name,
      password: req.body.password,
    });

    await newUser.save();
    res.send('success');

  } catch (error) {
    console.error('Error during signup:', error);
    res.json({ success: false, message: 'حدث خطأ أثناء التسجيل، حاول مرة أخرى' });
  }
});

// تسجيل الدخول
app.post('/login', async (req, res) => {
  try {
    const user = await LogInCollection.findOne({ name: req.body.name });

    if (user && user.password === req.body.password) {
      req.session.username = user.name;
      res.redirect('/');
    } else {
      res.send('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.send('حدث خطأ أثناء تسجيل الدخول، حاول مرة أخرى');
  }
});

// تسجيل الخروج
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).send('خطأ أثناء تسجيل الخروج');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

// جلب بيانات المستخدم
app.get('/api/user', (req, res) => {
  if (req.session.username) {
    res.json({ username: req.session.username });
  } else {
    res.json({ username: null });
  }
});

// صفحة الإعدادات
app.get('/setting', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'setting.html'));
});

// استدعاء الذكاء الاصطناعي للاقتراحات
app.post('/api/get-suggestion', async (req, res) => {
  const { taskText } = req.body;

  if (!taskText) {
    return res.status(400).json({ error: 'taskText مطلوب' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "أنت مساعد ذكي يقدم اقتراحات مختصرة وعملية لإنجاز المهام اليومية مثل الدراسة أو التنظيم."
          },
          {
            role: "user",
            content: `كيف أُنهي هذه المهمة بفعالية: ${taskText}`
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    const suggestion = response.data.choices?.[0]?.message?.content || "لم يتم العثور على اقتراح.";
    res.json({ suggestion });
  } catch (error) {
    console.error('Error from OpenAI:', error.response?.data || error.message);
    res.status(500).json({ error: 'فشل الاتصال بالذكاء الاصطناعي' });
  }
});

// تشغيل السيرفر
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
