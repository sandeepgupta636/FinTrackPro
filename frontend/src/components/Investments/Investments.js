import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [portfolioSummary, setPortfolioSummary] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    ticker: '',
    quantity: '',
    buy_price: '',
    buy_date: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [investmentsRes, summaryRes] = await Promise.all([
        axios.get('/api/investments', config),
        axios.get('/api/investments/portfolio/summary', config)
      ]);

      setInvestments(investmentsRes.data);
      setPortfolioSummary(summaryRes.data);
    } catch (error) {
      console.error('Error fetching investments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingId) {
        await axios.put(`/api/investments/${editingId}`, formData, config);
      } else {
        await axios.post('/api/investments', formData, config);
      }

      setFormData({ type: '', name: '', ticker: '', quantity: '', buy_price: '', buy_date: '' });
      setEditingId(null);
      fetchInvestments();
    } catch (error) {
      console.error('Error saving investment:', error);
    }
  };

  const handleEdit = (investment) => {
    setFormData({
      type: investment.type,
      name: investment.name,
      ticker: investment.ticker,
      quantity: investment.quantity,
      buy_price: investment.buy_price,
      buy_date: investment.buy_date
    });
    setEditingId(investment.id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/investments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInvestments();
    } catch (error) {
      console.error('Error deleting investment:', error);
    }
  };

  const types = ['stock', 'mutual', 'crypto', 'etf'];

  // Mock data for chart - in real app, this would come from API
  const chartData = [
    { date: '2023-01', value: 10000 },
    { date: '2023-02', value: 10500 },
    { date: '2023-03', value: 10200 },
    { date: '2023-04', value: 10800 },
    { date: '2023-05', value: 11200 },
    { date: '2023-06', value: 11500 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Investments</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {portfolioSummary.map((item) => (
          <div key={item.type} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 capitalize">{item.type}</h3>
            <p className="text-2xl font-bold text-green-600">${item.current_value?.toFixed(2) || '0.00'}</p>
            <p className="text-sm text-gray-600">Invested: ${item.total_invested?.toFixed(2) || '0.00'}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Portfolio Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Portfolio Value Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Add/Edit Investment Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Investment' : 'Add Investment'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Type</option>
                {types.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Ticker/Symbol</label>
              <input
                type="text"
                value={formData.ticker}
                onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
              <input
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Buy Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.buy_price}
                onChange={(e) => setFormData({ ...formData, buy_price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Buy Date</label>
              <input
                type="date"
                value={formData.buy_date}
                onChange={(e) => setFormData({ ...formData, buy_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editingId ? 'Update Investment' : 'Add Investment'}
            </button>
          </form>
        </div>
      </div>

      {/* Investments List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Investments</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Ticker</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Buy Price</th>
                <th className="px-4 py-2 text-left">Current Value</th>
                <th className="px-4 py-2 text-left">P&L</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((investment) => {
                const currentValue = investment.current_price ? investment.quantity * investment.current_price : investment.quantity * investment.buy_price;
                const invested = investment.quantity * investment.buy_price;
                const pnl = currentValue - invested;
                const pnlPercent = ((currentValue - invested) / invested) * 100;

                return (
                  <tr key={investment.id} className="border-t">
                    <td className="px-4 py-2 capitalize">{investment.type}</td>
                    <td className="px-4 py-2">{investment.name}</td>
                    <td className="px-4 py-2">{investment.ticker}</td>
                    <td className="px-4 py-2">{investment.quantity}</td>
                    <td className="px-4 py-2">${investment.buy_price}</td>
                    <td className="px-4 py-2">${currentValue.toFixed(2)}</td>
                    <td className={`px-4 py-2 ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(investment)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(investment.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Investments;