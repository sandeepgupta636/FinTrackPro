import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Savings = () => {
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    target_amount: '',
    deadline: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSavingsGoals();
  }, []);

  const fetchSavingsGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/savings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavingsGoals(response.data);
    } catch (error) {
      console.error('Error fetching savings goals:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingId) {
        await axios.put(`/api/savings/${editingId}`, formData, config);
      } else {
        await axios.post('/api/savings', formData, config);
      }

      setFormData({ title: '', target_amount: '', deadline: '' });
      setEditingId(null);
      fetchSavingsGoals();
    } catch (error) {
      console.error('Error saving savings goal:', error);
    }
  };

  const handleEdit = (goal) => {
    setFormData({
      title: goal.title,
      target_amount: goal.target_amount,
      deadline: goal.deadline
    });
    setEditingId(goal.id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/savings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSavingsGoals();
    } catch (error) {
      console.error('Error deleting savings goal:', error);
    }
  };

  const updateProgress = async (id, savedAmount) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/savings/${id}`, { saved_amount: savedAmount }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSavingsGoals();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Savings Goals</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Savings Goal Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Savings Goal' : 'Add Savings Goal'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Target Amount</label>
              <input
                type="number"
                step="0.01"
                value={formData.target_amount}
                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editingId ? 'Update Goal' : 'Add Goal'}
            </button>
          </form>
        </div>

        {/* Savings Goals List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Savings Goals</h2>
          <div className="space-y-4">
            {savingsGoals.map((goal) => {
              const progress = (goal.saved_amount / goal.target_amount) * 100;
              return (
                <div key={goal.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{goal.title}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Saved: ${goal.saved_amount}</span>
                    <span>Target: ${goal.target_amount}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                  <div className="mt-2">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Add to savings"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const amount = parseFloat(e.target.value);
                          if (!isNaN(amount)) {
                            updateProgress(goal.id, goal.saved_amount + amount);
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Savings;