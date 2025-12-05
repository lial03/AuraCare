const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
require('dotenv').config();

const { sendSupportEmail } = require('./emailService');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'https://auracare-kappa.vercel.app'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(helmet()); 
app.use(cors(corsOptions)); 
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

const SupportContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationSentAt: { type: Date }
});

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: String,
    supportCircle: [SupportContactSchema],
    notificationSettings: {
        emailNotifications: { type: Boolean, default: true },
        moodReminders: { type: Boolean, default: true },
        supportAlerts: { type: Boolean, default: true }
    },
    privacySettings: {
        dataSharing: { type: Boolean, default: false },
        profileVisibility: { type: String, default: 'private', enum: ['private', 'contacts', 'public'] }
    }
}, { timestamps: true });

const MoodLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mood: { type: String, required: true },
    notes: String,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const MoodLog = mongoose.model('MoodLog', MoodLogSchema);


// --- AI Logic (Shared Helper) ---
const formatHistoryForLLM = (moodHistory) => {
    return moodHistory.slice(0, 7).map(entry => 
        `Mood: ${entry.mood}, Notes: "${entry.notes || 'No notes provided.'}", Date: ${new Date(entry.createdAt).toDateString()}`
    ).join('\n');
};

// --- AI Logic (Dashboard/Resources Insight Generation) ---
const generateDynamicInsightsAI = async (moodHistory, userName) => {
    if (moodHistory.length < 3) {
        return { hasData: false };
    }
    const historyPrompt = formatHistoryForLLM(moodHistory);
    
    // Schema definition for the AI's JSON output
    const jsonSchema = {
        type: "object",
        properties: {
            insightText: { type: "string", description: "A concise 1-2 sentence summary of the user's current mood trend or status." },
            patternText: { type: "string", description: "A personalized, actionable, and encouraging recommendation based on the history." },
            actionLink: { type: "string", description: "The most relevant internal link for immediate action. Must be one of: /breathing-exercise, /resources/journaling, or /support-circle." },
            resourceHighlightTag: { type: "string", description: "A tag indicating the top category of resource needed now. Must be one of: breathing, journaling, resilience, music, or support." } 
        },
        required: ["insightText", "patternText", "actionLink", "resourceHighlightTag"]
    };

    const prompt = `
        You are an experienced and empathetic mental health support coach named AuraCare.
        Analyze the mood history provided below for the user, ${userName}.

        History (Most Recent First):
        ---
        ${historyPrompt}
        ---

        1. Identify the most significant recent trend or potential trigger.
        2. Select the single best general resource category to highlight (resourceHighlightTag): breathing, journaling, resilience, music, or support.
        
        The final response MUST be a valid JSON object matching the requested schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: jsonSchema,
            }
        });
        
        const insights = JSON.parse(response.text);

        return { 
            hasData: true, 
            insightText: insights.insightText, 
            patternText: insights.patternText,
            actionLink: insights.actionLink,
            resourceHighlightTag: insights.resourceHighlightTag
        };

    } catch (error) {
        console.error("AI Dashboard Insight Generation Failed:", error.message); 
        return { 
            hasData: true, 
            insightText: "An AI check-in failed, but your data is safe. 🥺", 
            patternText: "Keep logging your moods and notes—you're doing great just by checking in.",
            actionLink: "/resources", 
            resourceHighlightTag: "journaling"
        };
    }
};

// --- AI Logic (Journal Analysis) ---
const analyzeJournalEntryAI = async (notes) => {
    
    const jsonSchema = {
        type: "object",
        properties: {
            tone: { type: "string", description: "The single most dominant emotion or tone in the text (e.g., Anxious, Hopeful, Frustrated, Reflective)." },
            theme: { type: "string", description: "The primary subject or theme of the entry (e.g., Work Stress, Social Life, Self-Care, Personal Growth)." },
            summary: { type: "string", description: "A one-sentence, empathetic summary of the user's entry."}
        },
        required: ["tone", "theme", "summary"]
    };

    const prompt = `
        You are an empathetic listener and mental health analyst for AuraCare.
        Analyze the following user journal entry:
        ---
        ${notes}
        ---

        Return a JSON object with the following analysis:
        1. **tone**: The dominant emotion.
        2. **theme**: The main subject of the entry.
        3. **summary**: A one-sentence, empathetic summary of the content.
        
        The final response MUST be a valid JSON object matching the requested schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: jsonSchema,
            }
        });
        
        return JSON.parse(response.text);

    } catch (error) {
        console.error("Journal Analysis Failed:", error.message); 
        return { 
            tone: "Neutral", 
            theme: "Reflection", 
            summary: "Could not perform in-depth AI analysis, but your entry has been saved securely." 
        };
    }
};

// --- AI Logic (Communication Script) ---
const generateScriptAI = async (userName, moodHistory) => {
    const historyPrompt = moodHistory.length > 0 ? formatHistoryForLLM(moodHistory) : "No recent mood data logged.";
    
    const prompt = `
        You are a supportive, friendly AI. Generate a single, short, casual text message script that the user, ${userName}, can copy and send to a trusted contact to maintain their relationship and check in, without making a crisis alert.

        Base the message on the user's recent history, or just a friendly generic check-in if the data is too complex. 

        Recent History:
        ---
        ${historyPrompt}
        ---

        The script should be one or two short sentences and MUST substitute "[Contact's Name]" where appropriate.

        Return only the text message content as a simple string, with no JSON, quotes, or conversational preamble.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.8,
            }
        });
        
        return response.text;

    } catch (error) {
        console.error("Script Generation Failed:", error.message); 
        return "Hey [Contact's Name], just thinking of you today! Hope you're doing well.";
    }
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

app.post('/api/analyze-journal', authenticateUser, async (req, res) => {
    try {
        const { notes } = req.body;
        if (!notes) { return res.status(400).json({ message: 'No notes provided for analysis.' }); }

        const analysis = await analyzeJournalEntryAI(notes);
        res.status(200).json(analysis);

    } catch (error) {
        res.status(500).json({ message: 'Failed to analyze journal entry.', error: error.message });
    }
});

app.get('/api/generate-script', authenticateUser, async (req, res) => {
    try {
        const moodHistory = await MoodLog.find({ 
            userId: req.userId,
            mood: { $ne: 'Journal Entry' }
        }).sort({ createdAt: -1 }).limit(7);

        const user = await User.findById(req.userId).select('fullName');
        const userName = user ? user.fullName : 'User';
        
        const script = await generateScriptAI(userName, moodHistory);

        res.status(200).json({ script: script });

    } catch (error) {
        console.error('Failed to generate script:', error);
        res.status(500).json({ message: 'Failed to generate communication script.', error: error.message });
    }
});

app.get('/api/insights', authenticateUser, async (req, res) => {
    try {
        const moodHistory = await MoodLog.find({ 
            userId: req.userId,
            mood: { $ne: 'Journal Entry' }
        }).sort({ createdAt: -1 });

        const user = await User.findById(req.userId).select('fullName');
        const userName = user ? user.fullName : 'User';
        
        const insights = await generateDynamicInsightsAI(moodHistory, userName);

        if (!insights.hasData) { return res.status(200).json({ hasData: false }); }
        res.status(200).json({ hasData: true, ...insights });

    } catch (error) {
        res.status(500).json({ message: 'Failed to generate insights', error: error.message });
    }
});

app.get('/api/profile/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) { return res.status(404).json({ message: 'User not found.' }); }
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

// Endpoint to manually mark a contact's email as verified
app.put('/api/support-circle/:contactId/verify', authenticateUser, async (req, res) => {
    try {
        const { contactId } = req.params;
        
        const updatedUser = await User.findOneAndUpdate(
            { "_id": req.userId, "supportCircle._id": contactId },
            { "$set": { "supportCircle.$.emailVerified": true } },
            { new: true }
        ).select('supportCircle');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User or contact not found.' });
        }

        res.status(200).json({ 
            message: 'Contact email marked as verified successfully.',
            supportCircle: updatedUser.supportCircle 
        });
    } catch (error) {
        console.error('Error verifying contact email:', error);
        res.status(500).json({ message: 'Failed to verify contact email: Internal server error', error: error.message });
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
        if (error.name === 'ValidationError') { return res.status(400).json({ message: 'Validation failed: Contact name and email are required.' }); }
        res.status(500).json({ message: 'Failed to add contact: Internal server error' });
    }
});

app.put('/api/support-circle/:contactId', authenticateUser, async (req, res) => {
    try {
        const { contactId } = req.params;
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required.' });
        }

        const user = await User.findById(req.userId);
        if (!user) { return res.status(404).json({ message: 'User not found.' }); }

        const contactIndex = user.supportCircle.findIndex(
            contact => contact._id.toString() === contactId
        );

        if (contactIndex === -1) {
            return res.status(404).json({ message: 'Contact not found.' });
        }

        user.supportCircle[contactIndex].name = name;
        user.supportCircle[contactIndex].email = email;

        await user.save();

        res.status(200).json({ 
            message: 'Contact updated successfully', 
            supportCircle: user.supportCircle 
        });
    } catch (error) {
        if (error.name === 'CastError') { return res.status(400).json({ message: 'Invalid contact ID format.' }); }
        res.status(500).json({ message: 'Failed to update contact: Internal server error', error: error.message });
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


// Notification Settings Endpoints
app.get('/api/notification-settings', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('notificationSettings');
        if (!user) { return res.status(404).json({ message: 'User not found.' }); }
        
        res.status(200).json({ 
            notificationSettings: user.notificationSettings || {
                emailNotifications: true,
                moodReminders: true,
                supportAlerts: true
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve notification settings.', error: error.message });
    }
});

app.put('/api/notification-settings', authenticateUser, async (req, res) => {
    try {
        const { emailNotifications, moodReminders, supportAlerts } = req.body;
        
        const updateFields = {};
        if (emailNotifications !== undefined) updateFields['notificationSettings.emailNotifications'] = emailNotifications;
        if (moodReminders !== undefined) updateFields['notificationSettings.moodReminders'] = moodReminders;
        if (supportAlerts !== undefined) updateFields['notificationSettings.supportAlerts'] = supportAlerts;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('notificationSettings');

        if (!updatedUser) { return res.status(404).json({ message: 'User not found.' }); }

        res.status(200).json({ 
            message: 'Notification settings updated successfully.',
            notificationSettings: updatedUser.notificationSettings
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update notification settings.', error: error.message });
    }
});

// Privacy Settings Endpoints
app.get('/api/privacy-settings', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('privacySettings');
        if (!user) { return res.status(404).json({ message: 'User not found.' }); }
        
        res.status(200).json({ 
            privacySettings: user.privacySettings || {
                dataSharing: false,
                profileVisibility: 'private'
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve privacy settings.', error: error.message });
    }
});

app.put('/api/privacy-settings', authenticateUser, async (req, res) => {
    try {
        const { dataSharing, profileVisibility } = req.body;
        
        const updateFields = {};
        if (dataSharing !== undefined) updateFields['privacySettings.dataSharing'] = dataSharing;
        if (profileVisibility !== undefined) {
            if (!['private', 'contacts', 'public'].includes(profileVisibility)) {
                return res.status(400).json({ message: 'Invalid profile visibility value.' });
            }
            updateFields['privacySettings.profileVisibility'] = profileVisibility;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('privacySettings');

        if (!updatedUser) { return res.status(404).json({ message: 'User not found.' }); }

        res.status(200).json({ 
            message: 'Privacy settings updated successfully.',
            privacySettings: updatedUser.privacySettings
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update privacy settings.', error: error.message });
    }
});

app.post('/api/need-support', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('fullName supportCircle');
        if (!user) { return res.status(404).json({ message: 'User not found.' }); }

        if (user.supportCircle.length === 0) {
            return res.status(400).json({ message: 'No contacts in support circle to notify.' });
        }
        
        const contactReports = [];
        let unverifiedCount = 0;
        const unverifiedContacts = [];
        
        for (const contact of user.supportCircle) {
            const isVerified = contact.emailVerified || false;
            if (!isVerified) {
                unverifiedCount++;
                unverifiedContacts.push(contact.name);
            }
            
            // Send Email Notification
            const emailSent = await sendSupportEmail(contact.email, contact.name, user.fullName);
            
            contactReports.push({
                name: contact.name,
                email: contact.email,
                _id: contact._id,
                emailVerified: isVerified,
                deliveryStatus: emailSent ? 'SENT' : 'FAILED',
            });
        }
        
        const sentEmailCount = contactReports.filter(r => r.deliveryStatus === 'SENT').length;
        
        let message = `Emergency signal sent. ${sentEmailCount} email(s) delivered.`;
        
        const failedEmailCount = contactReports.filter(r => r.deliveryStatus === 'FAILED').length;
        if (failedEmailCount > 0) {
            message += ` ${failedEmailCount} email(s) failed to send.`;
        }
        
        if (unverifiedCount > 0) {
            message += ` Note: ${unverifiedCount} contact(s) have unverified email addresses.`;
        }

        res.status(200).json({ 
            message: message,
            contactReports: contactReports,
            unverifiedContacts: unverifiedContacts
        });

    } catch (error) {
        console.error('Error sending support notification:', error);
        res.status(500).json({ message: 'Failed to send support signal: Internal server error' });
    }
});

// --- New API Endpoint: Delete Account ---
app.delete('/api/profile', authenticateUser, async (req, res) => {
    try {
        // 1. Delete all associated mood logs
        await MoodLog.deleteMany({ userId: req.userId });
        
        // 2. Delete the user document
        const deletedUser = await User.findByIdAndDelete(req.userId);

        if (!deletedUser) { return res.status(404).json({ message: 'User not found.' }); }

        // Success: Account deleted
        res.status(200).json({ message: 'Account and all associated data deleted successfully.' });

    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ message: 'Failed to delete account: Internal server error' });
    }
});

// --- New API Endpoint: Change Password ---
app.put('/api/profile/password', authenticateUser, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Old and new passwords are required.' });
        }
        if (newPassword.length < 6) { // Basic validation
             return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
        }

        // 1. Retrieve the user to compare old password
        // The .select('+password') is necessary if the schema excludes it by default
        const user = await User.findById(req.userId).select('+password');
        if (!user) { return res.status(404).json({ message: 'User not found.' }); }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) { return res.status(401).json({ message: 'Invalid current password.' }); }

        // 2. Hash and save the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'Password updated successfully. Please log in again.' });

    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Failed to change password: Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});