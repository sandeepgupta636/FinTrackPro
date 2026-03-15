import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [analytics, setAnalytics] = useState({});
  const [users, setUsers] = useState([]);
  const [newIPO, setNewIPO] = useState({
    name: '',
    issue_date: '',
    listing_date: '',
    min_price: '',
    max_price: '',
    lot_size: ''
  });

  useEffect(() => {
    fetchAnalytics();
    fetchUsers();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addIPO = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/ipos', newIPO, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewIPO({
        name: '',
        issue_date: '',
        listing_date: '',
        min_price: '',
        max_price: '',
        lot_size: ''
      });
      alert('IPO added successfully');
    } catch (error) {
      console.error('Error adding IPO:', error);
      alert('Error adding IPO');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-2xl font-bold text-blue-600">{analytics.total_users || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Investments</h3>
          <p className="text-2xl font-bold text-green-600">{analytics.total_investments || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">${analytics.total_expenses?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Active Sessions</h3>
          <p className="text-2xl font-bold text-purple-600">-</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Verified</th>
                  <th className="px-4 py-2 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {user.is_verified ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-2">{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add IPO */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add New IPO</h2>
          <form onSubmit={addIPO}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">IPO Name</label>
              <input
                type="text"
                value={newIPO.name}
                onChange={(e) => setNewIPO({ ...newIPO, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Issue Date</label>
              <input
                type="date"
                value={newIPO.issue_date}
                onChange={(e) => setNewIPO({ ...newIPO, issue_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Listing Date</label>
              <input
                type="date"
                value={newIPO.listing_date}
                onChange={(e) => setNewIPO({ ...newIPO, listing_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Min Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={newIPO.min_price}
                  onChange={(e) => setNewIPO({ ...newIPO, min_price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Max Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={newIPO.max_price}
                  onChange={(e) => setNewIPO({ ...newIPO, max_price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Lot Size</label>
              <input
                type="number"
                value={newIPO.lot_size}
                onChange={(e) => setNewIPO({ ...newIPO, lot_size: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add IPO
            </button>
          </form>
        </div>
      </div>

      {/* System Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-xl font-semibold mb-4">System Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
            Send Notifications
          </button>
          <button className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600">
            Update Market Data
          </button>
          <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
            System Maintenance
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;