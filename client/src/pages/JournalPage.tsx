import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Send, Brain, Heart, MessageCircle, Calendar, User } from 'lucide-react';
import { useFamily } from '../contexts/FamilyContext';
import { JournalEntry } from '../contexts/FamilyContext';
import axios from 'axios';
import { format } from 'date-fns';

const JournalPage: React.FC = () => {
  const { familyId } = useParams<{ familyId: string }>();
  const navigate = useNavigate();
  const { currentFamily, journalEntries, setCurrentFamily, setJournalEntries, addJournalEntry } = useFamily();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    author: '',
    content: '',
    mood: 'neutral',
    entryType: 'parent' as 'parent' | 'teen'
  });

  const moods = [
    { value: 'happy', label: '😊 Happy', color: 'bg-green-100 text-green-800' },
    { value: 'sad', label: '😢 Sad', color: 'bg-blue-100 text-blue-800' },
    { value: 'angry', label: '😠 Angry', color: 'bg-red-100 text-red-800' },
    { value: 'anxious', label: '😰 Anxious', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'excited', label: '🤩 Excited', color: 'bg-purple-100 text-purple-800' },
    { value: 'neutral', label: '😐 Neutral', color: 'bg-gray-100 text-gray-800' }
  ];

  useEffect(() => {
    if (familyId) {
      loadFamilyData();
    }
  }, [familyId]);

  const loadFamilyData = async () => {
    try {
      setIsLoading(true);
      
      // Load family info
      const familyResponse = await axios.get(`/api/families/${familyId}`);
      setCurrentFamily(familyResponse.data.family);
      
      // Load journal entries
      const entriesResponse = await axios.get(`/api/families/${familyId}/journal`);
      setJournalEntries(entriesResponse.data.entries);
    } catch (err: any) {
      setError('Failed to load family data. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEntry.content.trim()) return;

    try {
      const response = await axios.post(`/api/families/${familyId}/journal`, newEntry);
      const entry = response.data.entry;
      
      addJournalEntry(entry);
      setNewEntry({ author: '', content: '', mood: 'neutral', entryType: 'parent' });
      setShowNewEntryForm(false);
    } catch (err: any) {
      setError('Failed to create journal entry. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your family journal...</p>
        </div>
      </div>
    );
  }

  if (error || !currentFamily) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error || 'Family not found'}</p>
          <button
            onClick={() => navigate('/setup')}
            className="btn btn-primary"
          >
            Create New Family
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {currentFamily.name} Journal
          </h1>
          <p className="text-lg text-gray-600">
            A safe space for {currentFamily.parent.name} and {currentFamily.teen.name} to connect and understand each other
          </p>
        </motion.div>

        {/* New Entry Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <button
            onClick={() => setShowNewEntryForm(true)}
            className="btn btn-primary text-lg px-8 py-3"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Journal Entry
          </button>
        </motion.div>

        {/* New Entry Form */}
        <AnimatePresence>
          {showNewEntryForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="card mb-8"
            >
              <form onSubmit={handleNewEntrySubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={newEntry.author}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      I am a...
                    </label>
                    <select
                      name="entryType"
                      value={newEntry.entryType}
                      onChange={handleInputChange}
                      className="input"
                      required
                    >
                      <option value="parent">Parent/Guardian</option>
                      <option value="teen">Teenager</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How are you feeling?
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {moods.map((mood) => (
                      <label key={mood.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="mood"
                          value={mood.value}
                          checked={newEntry.mood === mood.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <span className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          newEntry.mood === mood.value 
                            ? mood.color + ' ring-2 ring-offset-2 ring-indigo-500'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>
                          {mood.label.split(' ')[0]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's on your mind?
                  </label>
                  <textarea
                    name="content"
                    value={newEntry.content}
                    onChange={handleInputChange}
                    placeholder="Share your thoughts, feelings, or experiences..."
                    rows={4}
                    className="input resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewEntryForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Share Entry
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Journal Entries */}
        <div className="space-y-6">
          {journalEntries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No entries yet</h3>
              <p className="text-gray-400">Be the first to share your thoughts and feelings!</p>
            </motion.div>
          ) : (
            journalEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card ${
                  entry.entryType === 'parent' 
                    ? 'border-l-4 border-l-indigo-500' 
                    : 'border-l-4 border-l-purple-500'
                }`}
              >
                {/* Entry Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      entry.entryType === 'parent' 
                        ? 'bg-indigo-100 text-indigo-600' 
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{entry.author}</h3>
                      <p className="text-sm text-gray-500">
                        {entry.entryType === 'parent' ? 'Parent/Guardian' : 'Teenager'} • {format(new Date(entry.timestamp), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    moods.find(m => m.value === entry.mood)?.color || 'bg-gray-100 text-gray-800'
                  }`}>
                    {moods.find(m => m.value === entry.mood)?.label.split(' ')[0] || entry.mood}
                  </span>
                </div>

                {/* Entry Content */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{entry.content}</p>
                </div>

                {/* AI Insight */}
                {entry.aiInsight && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-indigo-900 mb-1">AI Therapist Insight</h4>
                        <p className="text-indigo-800 text-sm leading-relaxed">{entry.aiInsight}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalPage;