import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Expenses from './components/Expenses/Expenses';
import Savings from './components/Savings/Savings';
import Investments from './components/Investments/Investments';
import IPOs from './components/IPOs/IPOs';
import Stocks from './components/Stocks/Stocks';
import Reports from './components/Reports/Reports';
import Profile from './components/Profile/Profile';
import Admin from './components/Admin/Admin';
import Navbar from './components/Layout/Navbar';
import PrivateRoute from './components/Auth/PrivateRoute';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} />
        <Route path="/savings" element={<PrivateRoute><Savings /></PrivateRoute>} />
        <Route path="/investments" element={<PrivateRoute><Investments /></PrivateRoute>} />
        <Route path="/ipos" element={<PrivateRoute><IPOs /></PrivateRoute>} />
        <Route path="/stocks" element={<PrivateRoute><Stocks /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;