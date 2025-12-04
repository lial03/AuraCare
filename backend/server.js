const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const helmet = require('helmet'); 
require('dotenv').config(); 

const { sendSupportEmail } = require('./emailService'); // Import email service

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - Added explicit allowed origin to fix CORS error
const allowedOrigin = 'https://auracare-kappa.vercel.app'; // Replace with your actual frontend URL if it changes
const corsOptions = {
    origin: allowedOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(helmet()); 
app.use(cors(corsOptions)); // <-- USING CONFIGURATION TO ALLOW FRONTEND
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

const SupportContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
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

const moodToValue = (mood) => {
    switch (mood) {
        case 'Terrible': return 1;
        case 'Down': return 2;
        case 'Okay': return 3;
        case 'Good': return 4;
        case 'Amazing': return 5;
        case 'Mixed': return 3;
        case 'Journal Entry': return 3;
        default: return 3;
    }
};

const generateDynamicInsights = (moodHistory) => {
    if (moodHistory.length < 3) {
        return null;
    }
    
    // Convert all moods to a numerical value array
    const numericalHistory = moodHistory.map(log => moodToValue(log.mood));
    
    let finalInsight = {};
    let isTrendIdentified = false;

    // --- 1. Recent Trend Analysis (Past 3 days vs. Previous Period) ---
    const recentEntries = numericalHistory.slice(0, 3);
    const earlierEntries = numericalHistory.slice(3, 10);
    
    const avgRecent = recentEntries.reduce((sum, val) => sum + val, 0) / recentEntries.length;

    if (earlierEntries.length >= 3) {
        const avgEarlier = earlierEntries.reduce((sum, val) => sum + val, 0) / earlierEntries.length;
        const trendDifference = avgRecent - avgEarlier;

        if (trendDifference < -0.5) {
            // Significant Downward Trend (High Priority Alert)
            finalInsight = { 
                insightText: "Alert: Your mood is trending DOWN. 😔", 
                patternText: "We recommend taking a break now. Try the breathing exercise!",
            };
            isTrendIdentified = true;
        } else if (trendDifference > 0.5) {
            // Significant Upward Trend
            finalInsight = { 
                insightText: "Great job! Your mood is trending UP! 🎉", 
                patternText: "What are you doing differently? Keep it up and log those details.",
            };
            isTrendIdentified = true;
        }
    }

    // --- 2. Low Mood Trigger Spotting (If no critical trend, check for triggers) ---
    if (!isTrendIdentified) {
        const lowestMoodLogs = moodHistory
            .filter(log => moodToValue(log.mood) <= 2 && log.notes)
            .sort((a, b) => moodToValue(a.mood) - moodToValue(b.mood));

        if (lowestMoodLogs.length > 0) {
            const lowestNote = lowestMoodLogs[0].notes ? lowestMoodLogs[0].notes.toLowerCase() : '';
            let trigger = null;

            if (lowestNote.includes('work') || lowestNote.includes('school') || lowestNote.includes('stress')) {
                trigger = "Stress from responsibilities might be the cause.";
            } else if (lowestNote.includes('social') || lowestNote.includes('friend') || lowestNote.includes('partner')) {
                trigger = "Recent social stress or relationship issues were noted.";
            } else if (lowestNote.includes('tired') || lowestNote.includes('sleep')) {
                trigger = "Fatigue or poor sleep seems to be a recurring factor.";
            }

            if (trigger) { 
                finalInsight = { 
                    insightText: "Potential Trigger Spotted:", 
                    patternText: trigger + " Try journaling about it.",
                };
            }
        }
    }
    
    // --- 3. Weekday/Weekend Structural Analysis (Fallback) ---
    if (Object.keys(finalInsight).length === 0) {
        let totalWeekdayMood = 0;
        let totalWeekendMood = 0;
        let weekdayCount = 0;
        let weekendCount = 0;

        moodHistory.forEach(log => {
            const value = moodToValue(log.mood);
            const dayOfWeek = new Date(log.createdAt).getDay(); 
            
            if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday (0) or Saturday (6)
                totalWeekendMood += value;
                weekendCount++;
            } else {
                totalWeekdayMood += value;
                weekdayCount++;
            }
        });

        const avgWeekday = weekdayCount > 0 ? totalWeekdayMood / weekdayCount : 0;
        const avgWeekend = weekendCount > 0 ? totalWeekendMood / weekendCount : 0;
        
        if (Math.abs(avgWeekday - avgWeekend) > 0.5) { // Significant difference
            if (avgWeekday > avgWeekend) {
                finalInsight = { 
                    insightText: "You thrive on structure! Weekday moods are higher.", 
                    patternText: "Try to plan a social activity or hobby on the weekend.",
                };
            } else {
                finalInsight = { 
                    insightText: "You love relaxation! Weekend moods are highest.", 
                    patternText: "Look for quick 5-minute ways to de-stress during the workweek.",
                };
            }
        } else {
            // Default stable message
            finalInsight = { 
                insightText: "Your mood is stable and consistent!", 
                patternText: "Keep logging notes to find micro-patterns that lead to good days.",
            };
        }
    }
    
    return { hasData: true, insightText: finalInsight.insightText, patternText: finalInsight.patternText };
};


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

// --- API Routes ---

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

app.delete('/api/moodlog/:logId', authenticateUser, async (req, res) => {
    try {
        const { logId } = req.params;
        
        const deletedLog = await MoodLog.findOneAndDelete({ 
            _id: logId, 
            userId: req.userId 
        });

        if (!deletedLog) {
            return res.status(404).json({ message: 'Journal entry not found or unauthorized.' });
        }

        res.status(200).json({ message: 'Journal entry deleted successfully.' });

    } catch (error) {
        if (error.name === 'CastError') { return res.status(400).json({ message: 'Invalid log ID format.' }); }
        res.status(500).json({ message: 'Failed to delete journal entry.', error: error.message });
    }
});


app.get('/api/moodhistory', authenticateUser, async (req, res) => {
    try {
        const history = await MoodLog.find({ 
            userId: req.userId,
            mood: { $ne: 'Journal Entry' }
        })
            .sort({ createdAt: -1 })
            .limit(7)
            .select('mood notes createdAt');
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve mood history', error: error.message });
    }
});

app.get('/api/journalhistory', authenticateUser, async (req, res) => {
    try {
        const history = await MoodLog.find({ userId: req.userId, mood: 'Journal Entry' })
            .sort({ createdAt: -1 })
            .select('notes createdAt _id');
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve journal history', error: error.message });
    }
});

app.get('/api/insights', authenticateUser, async (req, res) => {
    try {
        const moodHistory = await MoodLog.find({ 
            userId: req.userId,
            mood: { $ne: 'Journal Entry' }
        }).sort({ createdAt: -1 });
        
        const insights = generateDynamicInsights(moodHistory);

        if (!insights) { return res.status(200).json({ hasData: false }); }
        res.status(200).json({ hasData: true, ...insights });

    } catch (error) {
        res.status(500).json({ message: 'Failed to generate insights', error: error.message });
    }
});

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

app.post('/api/support-circle', authenticateUser, async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $push: { supportCircle: { name, email } } },
            { new: true, runValidators: true }
        ).select('supportCircle');

        if (!user) { return res.status(404).json({ message: 'Error: Authenticated user not found in database.' }); }

        res.status(200).json({ message: 'Contact added', supportCircle: user.supportCircle });
    } catch (error) {
        if (error.name === 'ValidationError') { return res.status(400).json({ message: 'Validation failed: Contact name and email are required.' }); } // Updated error message
        res.status(500).json({ message: 'Failed to add contact: Internal server error' });
    }
});

app.delete('/api/support-circle/:contactId', authenticateUser, async (req, res) => {
    try {
        const { contactId } = req.params;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $pull: { supportCircle: { _id: contactId } } },
            { new: true, runValidators: true }
        ).select('supportCircle');

        if (!updatedUser) { return res.status(404).json({ message: 'User not found.' }); }
        
        res.status(200).json({ 
            message: 'Contact deleted successfully', 
            supportCircle: updatedUser.supportCircle 
        });
    } catch (error) {
        if (error.name === 'CastError') { return res.status(400).json({ message: 'Invalid contact ID format.' }); }
        res.status(500).json({ message: 'Failed to delete contact: Internal server error', error: error.message });
    }
});


app.post('/api/need-support', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('fullName supportCircle');
        if (!user) { return res.status(404).json({ message: 'User not found.' }); }

        if (user.supportCircle.length === 0) {
            return res.status(400).json({ message: 'No contacts in support circle to notify.' });
        }
        
        let sentCount = 0;
        let failedCount = 0;
        
        for (const contact of user.supportCircle) {
            const emailSent = await sendSupportEmail(contact.email, contact.name, user.fullName);
            
            if (emailSent) {
                sentCount++;
            } else {
                failedCount++;
            }
        }
        
        const message = failedCount > 0 
            ? `Emergency signal sent. ${sentCount} contact(s) notified via email. ${failedCount} email(s) failed to send.`
            : `Emergency signal sent. ${sentCount} contact(s) notified via email.`;

        res.status(200).json({ 
            message: message,
            notifiedContacts: user.supportCircle.map(c => ({ name: c.name, email: c.email, _id: c._id })) // Changed phone to email
        });

    } catch (error) {
        console.error('Error sending support notification:', error);
        res.status(500).json({ message: 'Failed to send support signal: Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});