const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// In-memory storage (in production, use a proper database)
let families = new Map();
let journalEntries = new Map();

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Family Connect API is running' });
});

// Create or get family
app.post('/api/families', (req, res) => {
  try {
    const { familyName, parentName, teenName } = req.body;
    
    if (!familyName || !parentName || !teenName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const familyId = uuidv4();
    const family = {
      id: familyId,
      name: familyName,
      parent: { name: parentName, role: 'parent' },
      teen: { name: teenName, role: 'teen' },
      createdAt: new Date().toISOString()
    };

    families.set(familyId, family);
    journalEntries.set(familyId, []);

    res.status(201).json({ family, message: 'Family created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get family by ID
app.get('/api/families/:familyId', (req, res) => {
  try {
    const { familyId } = req.params;
    const family = families.get(familyId);
    
    if (!family) {
      return res.status(404).json({ error: 'Family not found' });
    }

    res.json({ family });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add journal entry
app.post('/api/families/:familyId/journal', async (req, res) => {
  try {
    const { familyId } = req.params;
    const { author, content, mood, entryType } = req.body;

    if (!families.has(familyId)) {
      return res.status(404).json({ error: 'Family not found' });
    }

    if (!author || !content || !mood || !entryType) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const entry = {
      id: uuidv4(),
      familyId,
      author,
      content,
      mood,
      entryType, // 'parent' or 'teen'
      timestamp: new Date().toISOString(),
      aiInsight: null
    };

    // Get AI insight
    try {
      const aiResponse = await getAIInsight(content, mood, entryType);
      entry.aiInsight = aiResponse;
    } catch (aiError) {
      console.error('AI insight error:', aiError);
      entry.aiInsight = "AI insight temporarily unavailable. Please try again later.";
    }

    const familyEntries = journalEntries.get(familyId) || [];
    familyEntries.push(entry);
    journalEntries.set(familyId, familyEntries);

    res.status(201).json({ entry, message: 'Journal entry added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get journal entries for a family
app.get('/api/families/:familyId/journal', (req, res) => {
  try {
    const { familyId } = req.params;
    
    if (!families.has(familyId)) {
      return res.status(404).json({ error: 'Family not found' });
    }

    const entries = journalEntries.get(familyId) || [];
    res.json({ entries });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI insight function using OpenRouter
async function getAIInsight(content, mood, entryType) {
  try {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const prompt = `As a family therapist, provide a brief, supportive insight (2-3 sentences) for this journal entry. 
    
Entry: "${content}"
Mood: ${mood}
Author: ${entryType === 'parent' ? 'Parent' : 'Teenager'}

Focus on:
- Understanding the emotions expressed
- Suggesting ways to bridge communication gaps
- Offering gentle guidance for better understanding
- Being supportive and non-judgmental

Keep the response warm, empathetic, and actionable.`;

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: 'You are a compassionate family therapist who helps parents and teenagers understand each other better. You provide gentle, supportive insights that encourage open communication and mutual understanding.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://family-connect-app.com',
        'X-Title': 'Family Connect App'
      }
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw new Error('Failed to get AI insight');
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Family Connect Server running on port ${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api/health`);
});