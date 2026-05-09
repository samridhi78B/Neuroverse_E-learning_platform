const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neuroverse', {
  serverSelectionTimeoutMS: 5000,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'ME' },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  planetXP: { type: Map, of: Number, default: {} },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const JWT_SECRET = process.env.JWT_SECRET || 'neuroverse_secret_key_2024';

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  console.log(`JWT Token generated for user ${userId}: ${token}`);
  return token;
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters' });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      avatar: name.substring(0, 2).toUpperCase()
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
        planetXP: user.planetXP || {}
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
        planetXP: user.planetXP || {}
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
        planetXP: user.planetXP || {},
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/api/user/update-xp', authenticateToken, async (req, res) => {
  try {
    const { xp } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.xp += xp;
    
    user.level = Math.floor(user.xp / 1000) + 1;

    await user.save();

    res.json({
      message: 'XP updated successfully',
      xp: user.xp,
      level: user.level
    });
  } catch (error) {
    console.error('XP update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/user/update-planet-xp', authenticateToken, async (req, res) => {
  try {
    const { planetId, xp } = req.body;
    if (!planetId || typeof xp !== 'number') {
      return res.status(400).json({ error: 'planetId and xp are required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.planetXP) {
      user.planetXP = new Map();
    }
    
    // Add XP to the specific planet
    const currentPlanetXP = user.planetXP.get(planetId) || 0;
    user.planetXP.set(planetId, currentPlanetXP + xp);
    
    // Calculate total XP across all planets
    let totalXP = 0;
    for (const [key, value] of user.planetXP.entries()) {
      totalXP += value;
    }
    
    user.xp = totalXP;
    user.level = Math.floor(user.xp / 1000) + 1;

    await user.save();

    res.json({
      message: 'Planet XP updated successfully',
      xp: user.xp,
      level: user.level,
      planetXP: user.planetXP
    });
  } catch (error) {
    console.error('Planet XP update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/user/reset-xp', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.xp = 0;
    user.level = 1;
    user.planetXP = new Map();

    await user.save();

    res.json({
      message: 'XP reset successfully',
      xp: 0,
      level: 1,
      planetXP: {}
    });
  } catch (error) {
    console.error('XP reset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const users = await User.find({})
      .select('name avatar xp level createdAt')
      .sort({ xp: -1 })
      .limit(20);
    
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      xp: user.xp,
      planets: Math.min(Math.floor(user.level / 2), 8), 
      avatar: user.avatar,
      streak: Math.max(1, Math.floor(Math.random() * 50)), 
      isUser: false 
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/send-welcome-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let transporter;
    
    if (process.env.NODE_ENV === 'production') {
      transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      let testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const welcomeMessage = `
🚀 Welcome to EduGalaxy, ${email}!

Thank you for joining our mission to master the universe of coding and technology! 

🎯 Your Journey Begins:
• Explore 7 subject planets (DSA, AI, Web Dev, OS, Databases, Networks, Cybersecurity)
• Track your progress with XP and levels
• Connect with thousands of learners
• Unlock new challenges as you advance

📚 How We Can Help:
• Personalized learning paths tailored to your goals
• Interactive coding challenges and quizzes
• Real-time progress tracking
• Community of fellow explorers

🔗 Next Steps:
1. Complete your profile to personalize your experience
2. Start with your first subject planet
3. Join our community Discord for support
4. Track your daily learning streak

Ready to begin your adventure? The universe of knowledge awaits!

🌟 EduGalaxy Team
Learning Beyond Boundaries
`;

    const mailOptions = {
      from: '"EduGalaxy Team" <welcome@edugalaxy.com>',
      to: email,
      subject: '🚀 Welcome to EduGalaxy - Your Learning Adventure Begins!',
      text: welcomeMessage,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #050b1a 0%, #07101f 50%, #05080f 100%); color: #e8f0fe;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4A9EFF; font-size: 2.5em; margin-bottom: 10px;">🚀 Welcome to EduGalaxy</h1>
            <p style="font-size: 1.2em; color: #8899bb;">${email}</p>
          </div>
          
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(74,158,255,0.2); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <p style="font-size: 1.1em; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining our mission to master the universe of coding and technology!
            </p>
            
            <h2 style="color: #4A9EFF; font-size: 1.4em; margin-bottom: 15px;">🎯 Your Journey Begins:</h2>
            <ul style="color: #e8f0fe; line-height: 1.8;">
              <li>Explore 7 subject planets (DSA, AI, Web Dev, OS, Databases, Networks, Cybersecurity)</li>
              <li>Track your progress with XP and levels</li>
              <li>Connect with thousands of learners</li>
              <li>Unlock new challenges as you advance</li>
            </ul>
          </div>
          
          <div style="background: rgba(74,158,255,0.1); border: 1px solid rgba(74,158,255,0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #4A9EFF; font-size: 1.4em; margin-bottom: 15px;">📚 How We Can Help:</h2>
            <ul style="color: #e8f0fe; line-height: 1.8;">
              <li>Personalized learning paths tailored to your goals</li>
              <li>Interactive coding challenges and quizzes</li>
              <li>Real-time progress tracking</li>
              <li>Community of fellow explorers</li>
            </ul>
          </div>
          
          <div style="background: rgba(168,216,234,0.1); border: 1px solid rgba(168,216,234,0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #A8D8EA; font-size: 1.4em; margin-bottom: 15px;">🔗 Next Steps:</h2>
            <ol style="color: #e8f0fe; line-height: 1.8;">
              <li>Complete your profile to personalize your experience</li>
              <li>Start with your first subject planet</li>
              <li>Join our community Discord for support</li>
              <li>Track your daily learning streak</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="font-size: 1.1em; color: #4A9EFF; margin-bottom: 10px;">Ready to begin your adventure? The universe of knowledge awaits!</p>
            <p style="color: #8899bb;">🌟 EduGalaxy Team<br>Learning Beyond Boundaries</p>
          </div>
        </div>
      `
    };

    let info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent: ', info.messageId);
    
    res.json({ 
      success: true, 
      message: 'Welcome email sent successfully!',
      preview: process.env.NODE_ENV !== 'production' ? nodemailer.getTestMessageUrl(info) : null
    });
    
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
