import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IPOs = () => {
  const [upcomingIPOs, setUpcomingIPOs] = useState([]);
  const [appliedIPOs, setAppliedIPOs] = useState([]);
  const [selectedIPO, setSelectedIPO] = useState(null);
  const [applicationData, setApplicationData] = useState({
    applied_shares: '',
    applied_price: ''
  });

  useEffect(() => {
    fetchIPOs();
  }, []);

  const fetchIPOs = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [upcomingRes, appliedRes] = await Promise.all([
        axios.get('/api/ipos/upcoming'),
        axios.get('/api/ipos/applied', config)
      ]);

      setUpcomingIPOs(upcomingRes.data);
      setAppliedIPOs(appliedRes.data);
    } catch (error) {
      console.error('Error fetching IPOs:', error);
    }
  };

  const handleApply = async (ipoId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/ipos/apply/${ipoId}`, applicationData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedIPO(null);
      setApplicationData({ applied_shares: '', applied_price: '' });
      fetchIPOs();
    } catch (error) {
      console.error('Error applying for IPO:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">IPOs</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming IPOs */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upcoming IPOs</h2>
          <div className="space-y-4">
            {upcomingIPOs.map((ipo) => (
              <div key={ipo.id} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold">{ipo.name}</h3>
                <div className="text-sm text-gray-600 mb-2">
                  <p>Issue Date: {ipo.issue_date}</p>
                  <p>Listing Date: {ipo.listing_date}</p>
                  <p>Price Range: ${ipo.min_price} - ${ipo.max_price}</p>
                  <p>Lot Size: {ipo.lot_size} shares</p>
                </div>
                <button
                  onClick={() => setSelectedIPO(ipo)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Applied IPOs */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Applied IPOs</h2>
          <div className="space-y-4">
            {appliedIPOs.map((application) => (
              <div key={application.id} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold">{application.name}</h3>
                <div className="text-sm text-gray-600">
                  <p>Applied Shares: {application.applied_shares}</p>
                  <p>Applied Price: ${application.applied_price}</p>
                  <p>Status: <span className={`font-semibold ${
                    application.status === 'allotted' ? 'text-green-600' :
                    application.status === 'applied' ? 'text-yellow-600' : 'text-gray-600'
                  }`}>{application.status}</span></p>
                  {application.allotted_shares > 0 && (
                    <p>Allotted Shares: {application.allotted_shares}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* IPO Application Modal */}
      {selectedIPO && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Apply for {selectedIPO.name}</h3>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Number of Shares</label>
                <input
                  type="number"
                  value={applicationData.applied_shares}
                  onChange={(e) => setApplicationData({ ...applicationData, applied_shares: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter number of shares"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Applied Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={applicationData.applied_price}
                  onChange={(e) => setApplicationData({ ...applicationData, applied_price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter applied price"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setSelectedIPO(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApply(selectedIPO.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IPOs;