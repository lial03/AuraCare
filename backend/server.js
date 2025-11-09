// server/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const helmet = require('helmet'); 
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(helmet()); 
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests


// --- 1. MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));


// --- 2. Schemas and Models ---

const SupportContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: String,
    supportCircle: [SupportContactSchema],
}, { timestamps: true });

const MoodLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mood: { type: String, required: true },
    notes: String,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const MoodLog = mongoose.model('MoodLog', MoodLogSchema);


// Helper functions
const moodToValue = (mood) => {
    switch (mood) {
        case 'Terrible': return 1;
        case 'Down': return 2;
        case 'Okay': return 3;
        case 'Good': return 4;
        case 'Amazing': return 5;
        default: return 3;
    }
};

const generateDynamicInsights = (moodHistory) => {
    if (moodHistory.length < 3) {
        return null;
    }
    
    let totalWeekdayMood = 0;
    let totalWeekendMood = 0;
    let weekdayCount = 0;
    let weekendCount = 0;

    moodHistory.forEach(log => {
        const value = moodToValue(log.mood);
        const dayOfWeek = new Date(log.createdAt).getDay(); 
        
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            totalWeekendMood += value;
            weekendCount++;
        } else {
            totalWeekdayMood += value;
            weekdayCount++;
        }
    });

    const avgWeekday = weekdayCount > 0 ? totalWeekdayMood / weekdayCount : 0;
    const avgWeekend = weekendCount > 0 ? totalWeekendMood / weekendCount : 0;
    
    let insightText = "Focus on consistency this week!";
    let patternText = "Try a 5-minute break around 3 PM.";

    if (avgWeekday > avgWeekend + 0.5) {
        insightText = "You thrive on structure! Weekday moods are higher. Try to plan activities on weekends.";
        patternText = "Your mood dips on the weekend. Plan a social call on Saturday!";
    } else if (avgWeekend > avgWeekday + 0.5) {
        insightText = "You love relaxation! Weekend moods are highest. Look for quick ways to de-stress during the week.";
        patternText = "Your mood dips during the workweek. Take a short walk at lunch.";
    } else {
        insightText = "Your mood is stable! Keep up the good work and log those notes.";
        patternText = "Focus on logging notes to find micro-patterns!";
    }

    return { insightText, patternText };
};


// --- 3. Authentication Middleware ---

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; 
        next();
    } catch (ex) {
        return res.status(400).json({ message: 'Invalid token or session expired.' });
    }
};

// --- 4. API Routes ---

// POST /api/signup
app.post('/api/signup', async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber } = req.body;
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ fullName, email, password: hashedPassword, phoneNumber });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', userId: newUser._id });
    } catch (error) {
        if (error.code === 11000) { return res.status(409).json({ message: 'Sign up failed: This email is already registered.' }); }
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
    const { identifier, password } = req.body; 
    try {
        const user = await User.findOne({ 
            $or: [{ email: identifier }, { phoneNumber: identifier }] 
        });

        if (!user) { return res.status(401).json({ message: 'Invalid credentials' }); }
        
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) { return res.status(401).json({ message: 'Invalid credentials' }); }
        
        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );
        
        res.status(200).json({ message: 'Login successful', token: token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// POST /api/moodlog
app.post('/api/moodlog', authenticateUser, async (req, res) => {
    try {
        const { mood, notes } = req.body;
        const newMoodLog = new MoodLog({ userId: req.userId, mood, notes });
        await newMoodLog.save();
        res.status(201).json({ message: 'Mood logged successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to log mood', error: error.message });
    }
});

// GET /api/moodhistory
app.get('/api/moodhistory', authenticateUser, async (req, res) => {
    try {
        const history = await MoodLog.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(7)
            .select('mood createdAt');
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve mood history', error: error.message });
    }
});

// GET /api/insights
app.get('/api/insights', authenticateUser, async (req, res) => {
    try {
        const moodHistory = await MoodLog.find({ userId: req.userId }).sort({ createdAt: -1 });
        const insights = generateDynamicInsights(moodHistory);

        if (!insights) { return res.status(200).json({ hasData: false }); }
        res.status(200).json({ hasData: true, ...insights });

    } catch (error) {
        res.status(500).json({ message: 'Failed to generate insights', error: error.message });
    }
});

// GET /api/profile/:userId (Used by frontend to fetch profile details after login)
app.get('/api/profile/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) { return res.status(404).json({ message: 'User not found' }); }
        res.status(200).json(user);
    } catch (error) {
        if (error.name === 'CastError') { return res.status(400).json({ message: 'Invalid user ID format.' }); }
        res.status(500).json({ message: 'Failed to retrieve profile.', error: error.message });
    }
}); 

// PUT /api/profile (Protected Route for editing profile)
app.put('/api/profile', authenticateUser, async (req, res) => {
    try {
        const { fullName, phoneNumber } = req.body;
        const updateFields = {};
        if (fullName) updateFields.fullName = fullName;
        if (phoneNumber) updateFields.phoneNumber = phoneNumber;

        if (Object.keys(updateFields).length === 0) { return res.status(400).json({ message: 'No fields provided for update.' }); }

        const updatedUser = await User.findByIdAndUpdate(
            req.userId, 
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password'); 

        if (!updatedUser) { return res.status(404).json({ message: 'User not found.' }); }

        res.status(200).json({ message: 'Profile updated successfully.', user: updatedUser });

    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile.', error: error.message });
    }
});

// POST /api/support-circle
app.post('/api/support-circle', authenticateUser, async (req, res) => {
    try {
        const { name, phone } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $push: { supportCircle: { name, phone } } },
            { new: true, runValidators: true }
        ).select('supportCircle');

        if (!user) { return res.status(404).json({ message: 'Error: Authenticated user not found in database.' }); }

        res.status(200).json({ message: 'Contact added', supportCircle: user.supportCircle });
    } catch (error) {
        if (error.name === 'ValidationError') { return res.status(400).json({ message: 'Validation failed: Contact name and phone are required.' }); }
        res.status(500).json({ message: 'Failed to add contact: Internal server error' });
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});