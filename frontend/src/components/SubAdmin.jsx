import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';
import { FiMenu, FiX, FiChevronDown, FiChevronUp, FiRefreshCw, FiEdit, FiTrash2, FiCheck, FiClock, FiSlash } from 'react-icons/fi';
import Chart from 'chart.js/auto';

const SubAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Stats
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
    total: 0
  });

  // Fetch requests
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/requests');
      setRequests(response.data);
      calculateStats(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setIsLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (data) => {
    const pending = data.filter(req => req.status === 'Pending').length;
    const accepted = data.filter(req => req.status === 'Accepted').length;
    const rejected = data.filter(req => req.status === 'Rejected').length;
    
    setStats({
      pending,
      accepted,
      rejected,
      total: data.length
    });

    // Update chart if it exists
    if (window.requestChart) {
      window.requestChart.data.datasets[0].data = [pending, accepted, rejected];
      window.requestChart.update();
    } else {
      renderChart(pending, accepted, rejected);
    }
  };

  // Render chart
  const renderChart = (pending, accepted, rejected) => {
    const ctx = document.getElementById('requestChart');
    if (ctx) {
      window.requestChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Pending', 'Accepted', 'Rejected'],
          datasets: [{
            data: [pending, accepted, rejected],
            backgroundColor: [
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(255, 99, 132, 0.7)'
            ],
            borderColor: [
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  family: "'Poppins', sans-serif",
                  size: 12
                }
              }
            }
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
    }
  };

  // Update request status
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/requests/${id}`, { status: newStatus });
      fetchRequests();
      // Close the detail view if open
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Spring animations
  const sidebarAnimation = useSpring({
    width: isSidebarOpen ? 280 : 0,
    opacity: isSidebarOpen ? 1 : 0
  });

  const cardAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
  });

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor, icon;
    
    switch(status) {
      case 'Pending':
        bgColor = 'bg-yellow-100 text-yellow-800';
        icon = <FiClock className="mr-1" />;
        break;
      case 'Accepted':
        bgColor = 'bg-green-100 text-green-800';
        icon = <FiCheck className="mr-1" />;
        break;
      case 'Rejected':
        bgColor = 'bg-red-100 text-red-800';
        icon = <FiSlash className="mr-1" />;
        break;
      default:
        bgColor = 'bg-gray-100 text-gray-800';
    }

    return (
      <motion.span 
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {icon} {status}
      </motion.span>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Animated Sidebar */}
      <animated.div 
        style={sidebarAnimation}
        className="bg-gradient-to-b from-indigo-900 to-purple-800 shadow-xl relative"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <motion.h2 
              className="text-white text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Admin Portal
            </motion.h2>
            <motion.button
              onClick={() => setIsSidebarOpen(false)}
              whileHover={{ rotate: 90 }}
              className="text-white"
            >
              <FiX size={24} />
            </motion.button>
          </div>

          <nav className="flex-1">
            <motion.ul 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <li className="mb-4">
                <motion.button
                  whileHover={{ x: 5 }}
                  className="flex items-center text-white w-full p-3 rounded-lg bg-white bg-opacity-10"
                >
                  <span className="mr-3">📊</span>
                  <span>Dashboard</span>
                </motion.button>
              </li>
              <li className="mb-4">
                <motion.button
                  whileHover={{ x: 5 }}
                  className="flex items-center text-white w-full p-3 rounded-lg hover:bg-white hover:bg-opacity-10"
                >
                  <span className="mr-3">📝</span>
                  <span>Requests</span>
                </motion.button>
              </li>
              <li className="mb-4">
                <motion.button
                  whileHover={{ x: 5 }}
                  className="flex items-center text-white w-full p-3 rounded-lg hover:bg-white hover:bg-opacity-10"
                >
                  <span className="mr-3">👥</span>
                  <span>Users</span>
                </motion.button>
              </li>
              <li className="mb-4">
                <motion.button
                  whileHover={{ x: 5 }}
                  className="flex items-center text-white w-full p-3 rounded-lg hover:bg-white hover:bg-opacity-10"
                >
                  <span className="mr-3">⚙️</span>
                  <span>Settings</span>
                </motion.button>
              </li>
            </motion.ul>
          </nav>

          <motion.div 
            className="mt-auto bg-white bg-opacity-10 p-4 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-white text-sm">
              <p className="font-medium">Need help?</p>
              <p className="text-white text-opacity-70">Contact our support team</p>
            </div>
          </motion.div>
        </div>
      </animated.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg bg-gray-100"
            >
              <FiMenu size={20} />
            </motion.button>

            <div className="flex items-center space-x-4">
              <motion.button
                onClick={fetchRequests}
                whileHover={{ rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-gray-100"
              >
                <FiRefreshCw size={20} />
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search requests..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  🔍
                </span>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <animated.div 
              style={cardAnimation}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total Requests</p>
                  <h3 className="text-3xl font-bold text-indigo-600">{stats.total}</h3>
                </div>
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  📋
                </div>
              </div>
            </animated.div>

            <animated.div 
              style={cardAnimation}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Pending</p>
                  <h3 className="text-3xl font-bold text-yellow-600">{stats.pending}</h3>
                </div>
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <FiClock size={24} />
                </div>
              </div>
            </animated.div>

            <animated.div 
              style={cardAnimation}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Accepted</p>
                  <h3 className="text-3xl font-bold text-green-600">{stats.accepted}</h3>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <FiCheck size={24} />
                </div>
              </div>
            </animated.div>

            <animated.div 
              style={cardAnimation}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Rejected</p>
                  <h3 className="text-3xl font-bold text-red-600">{stats.rejected}</h3>
                </div>
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <FiSlash size={24} />
                </div>
              </div>
            </animated.div>
          </div>

          {/* Chart and Requests */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Request Status</h3>
              <div className="h-64">
                <canvas id="requestChart"></canvas>
              </div>
            </div>

            {/* Requests List */}
            <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Recent Requests</h3>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1 rounded-lg ${statusFilter === 'All' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100'}`}
                    onClick={() => setStatusFilter('All')}
                  >
                    All
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1 rounded-lg ${statusFilter === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'}`}
                    onClick={() => setStatusFilter('Pending')}
                  >
                    Pending
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1 rounded-lg ${statusFilter === 'Accepted' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}
                    onClick={() => setStatusFilter('Accepted')}
                  >
                    Accepted
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1 rounded-lg ${statusFilter === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}
                    onClick={() => setStatusFilter('Rejected')}
                  >
                    Rejected
                  </motion.button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRequests.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No requests found
                    </div>
                  ) : (
                    filteredRequests.map((request) => (
                      <motion.div
                        key={request.request_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.01 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-lg">{request.title}</h4>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                              {request.description}
                            </p>
                          </div>
                          <StatusBadge status={request.status} />
                        </div>
                        <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                          <span>#{request.request_id.substring(0, 8)}</span>
                          <span>{new Date(request.created_at).toLocaleDateString()}</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Request Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold">{selectedRequest.title}</h3>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Description</h4>
                    <p className="mt-1 text-gray-700">{selectedRequest.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <div className="mt-1">
                        <StatusBadge status={selectedRequest.status} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Created At</h4>
                      <p className="mt-1 text-gray-700">
                        {new Date(selectedRequest.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Scheduled Date</h4>
                      <p className="mt-1 text-gray-700">
                        {selectedRequest.scheduled_date ? 
                          new Date(selectedRequest.scheduled_date).toLocaleDateString() : 
                          'Not scheduled'}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Request ID</h4>
                      <p className="mt-1 text-gray-700 font-mono">
                        {selectedRequest.request_id}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Update Status</h4>
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg ${selectedRequest.status === 'Pending' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800'}`}
                        onClick={() => updateStatus(selectedRequest.request_id, 'Pending')}
                      >
                        <FiClock className="inline mr-2" />
                        Pending
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg ${selectedRequest.status === 'Accepted' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800'}`}
                        onClick={() => updateStatus(selectedRequest.request_id, 'Accepted')}
                      >
                        <FiCheck className="inline mr-2" />
                        Accept
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg ${selectedRequest.status === 'Rejected' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800'}`}
                        onClick={() => updateStatus(selectedRequest.request_id, 'Rejected')}
                      >
                        <FiSlash className="inline mr-2" />
                        Reject
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubAdmin;