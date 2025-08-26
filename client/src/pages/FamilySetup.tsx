import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Heart, ArrowRight, CheckCircle } from 'lucide-react';
import { useFamily } from '../contexts/FamilyContext';
import axios from 'axios';

const FamilySetup: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentFamily } = useFamily();
  const [formData, setFormData] = useState({
    familyName: '',
    parentName: '',
    teenName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/families', formData);
      const { family } = response.data;
      
      setCurrentFamily(family);
      navigate(`/journal/${family.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create family. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.familyName.trim() && formData.parentName.trim() && formData.teenName.trim();

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-6">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Set Up Your Family
          </h1>
          <p className="text-xl text-gray-600">
            Create a safe space for open communication and understanding between parents and teenagers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Family Name */}
            <div>
              <label htmlFor="familyName" className="block text-sm font-medium text-gray-700 mb-2">
                Family Name
              </label>
              <input
                type="text"
                id="familyName"
                name="familyName"
                value={formData.familyName}
                onChange={handleInputChange}
                placeholder="e.g., The Smith Family"
                className="input"
                required
              />
            </div>

            {/* Parent Name */}
            <div>
              <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-2">
                Parent/Guardian Name
              </label>
              <input
                type="text"
                id="parentName"
                name="parentName"
                value={formData.parentName}
                onChange={handleInputChange}
                placeholder="e.g., Sarah"
                className="input"
                required
              />
            </div>

            {/* Teen Name */}
            <div>
              <label htmlFor="teenName" className="block text-sm font-medium text-gray-700 mb-2">
                Teenager Name
              </label>
              <input
                type="text"
                id="teenName"
                name="teenName"
                value={formData.teenName}
                onChange={handleInputChange}
                placeholder="e.g., Alex"
                className="input"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full btn btn-primary text-lg py-4 ${
                !isFormValid || isLoading 
                  ? 'opacity-50 cursor-not-allowed hover:transform-none' 
                  : 'hover:scale-105'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Family...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Heart className="mr-2 h-5 w-5" />
                  Create Family
                  <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              )}
            </button>
          </form>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
              <Heart className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Safe Space</h3>
            <p className="text-sm text-gray-600">Create a private environment for honest expression</p>
          </div>

          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Guidance</h3>
            <p className="text-sm text-gray-600">Get professional insights and communication tips</p>
          </div>

          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-pink-50 to-white border border-pink-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-lg mb-4">
              <Users className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Family Bonding</h3>
            <p className="text-sm text-gray-600">Strengthen relationships through understanding</p>
          </div>
        </motion.div>

        {/* Privacy Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            🔒 Your family's privacy is important. All data is stored securely and never shared with third parties.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FamilySetup;