import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';
import { 
  FiMenu, FiX, FiChevronDown, FiChevronUp, FiRefreshCw, 
  FiEdit, FiTrash2, FiCheck, FiClock, FiSlash, FiUser, 
  FiUsers, FiSettings, FiFileText, FiPieChart, FiPlus, 
  FiCalendar, FiHome, FiKey, FiPhone, FiShield
} from 'react-icons/fi';
import Chart from 'chart.js/auto';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const MainAdmin = () => {
  // State for all data
  const [admins, setAdmins] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [requestTypes, setRequestTypes] = useState([]);
  const [requests, setRequests] = useState([]);
  
  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [expandedSections, setExpandedSections] = useState({
    admins: true,
    departments: true,
    leaders: true,
    requests: true,
    requestTypes: true
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Form states
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password_hash: '',
    phone_number: '',
    role: 'subadmin'
  });
  const [newLeader, setNewLeader] = useState({
    username: '',
    full_name: '',
    email: '',
    password_hash: '',
    phone_number: '',
    department_id: ''
  });
  const [newDepartment, setNewDepartment] = useState({ name: '', address: '' });
  const [newRequestType, setNewRequestType] = useState({ name: '' });
  const [editingDepartment, setEditingDepartment] = useState(null);
  
  // Dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteItemType, setDeleteItemType] = useState('');
  const [deleteItemId, setDeleteItemId] = useState('');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    id: '',
    type: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
    total: 0
  });

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Load Calendly script when reservations section is active
  useEffect(() => {
    if (activeSection === 'reservations') {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [activeSection]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [
        adminsRes, 
        departmentsRes, 
        leadersRes, 
        requestTypesRes, 
        requestsRes
      ] = await Promise.all([
        axios.get('/api/admins'),
        axios.get('/api/departments'),
        axios.get('/api/leaders'),
        axios.get('/api/request-types'),
        axios.get('/api/requests')
      ]);

      setAdmins(adminsRes.data);
      setDepartments(departmentsRes.data);
      setLeaders(leadersRes.data);
      setRequestTypes(requestTypesRes.data);
      setRequests(requestsRes.data);
      calculateStats(requestsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
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

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle form changes
  const handleAdminChange = (e) => {
    setNewAdmin({
      ...newAdmin,
      [e.target.name]: e.target.value
    });
  };

  const handleLeaderChange = (e) => {
    setNewLeader({
      ...newLeader,
      [e.target.name]: e.target.value
    });
  };

  const handleDepartmentChange = (e) => {
    if (editingDepartment) {
      setEditingDepartment({
        ...editingDepartment,
        [e.target.name]: e.target.value
      });
    } else {
      setNewDepartment({
        ...newDepartment,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleRequestTypeChange = (e) => {
    setNewRequestType({
      ...newRequestType,
      [e.target.name]: e.target.value
    });
  };

  // Create new admin
  const createAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admins', newAdmin);
      setAdmins([...admins, res.data]);
      setNewAdmin({ 
        username: '', 
        email: '', 
        password_hash: '', 
        phone_number: '',
        role: 'subadmin' 
      });
      // Show success message
    } catch (err) {
      console.error('Error creating admin:', err);
      // Show error message
    }
  };

  // Create new leader
  const createLeader = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/leaders', newLeader);
      setLeaders([...leaders, res.data]);
      setNewLeader({ 
        username: '', 
        full_name: '', 
        email: '', 
        password_hash: '', 
        phone_number: '',
        department_id: '' 
      });
      // Show success message
    } catch (err) {
      console.error('Error creating leader:', err);
      // Show error message
    }
  };

  // Create new department
  const createDepartment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/departments', newDepartment);
      setDepartments([...departments, res.data]);
      setNewDepartment({ name: '', address: '' });
      // Show success message
    } catch (err) {
      console.error('Error creating department:', err);
      // Show error message
    }
  };

  // Update department
  const updateDepartment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/departments/${editingDepartment.department_id}`, editingDepartment);
      setDepartments(departments.map(dept => 
        dept.department_id === editingDepartment.department_id ? res.data : dept
      ));
      setEditingDepartment(null);
      // Show success message
    } catch (err) {
      console.error('Error updating department:', err);
      // Show error message
    }
  };

  // Create new request type
  const createRequestType = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/request-types', newRequestType);
      setRequestTypes([...requestTypes, res.data]);
      setNewRequestType({ name: '' });
      // Show success message
    } catch (err) {
      console.error('Error creating request type:', err);
      // Show error message
    }
  };

  // Update request status
  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      await axios.put(`/api/requests/${requestId}`, { status: newStatus });
      setRequests(requests.map(req => 
        req.request_id === requestId ? { ...req, status: newStatus } : req
      ));
      calculateStats(requests.map(req => 
        req.request_id === requestId ? { ...req, status: newStatus } : req
      ));
      // Show success message
    } catch (err) {
      console.error('Error updating request status:', err);
      // Show error message
    }
  };

  // Open delete confirmation dialog
  const confirmDelete = (type, id) => {
    setDeleteItemType(type);
    setDeleteItemId(id);
    setIsDeleteDialogOpen(true);
  };

  // Delete item after confirmation
  const deleteItem = async () => {
    try {
      let endpoint = '';
      if (deleteItemType === 'admin') endpoint = `/api/admins/${deleteItemId}`;
      else if (deleteItemType === 'leader') endpoint = `/api/leaders/${deleteItemId}`;
      else if (deleteItemType === 'department') endpoint = `/api/departments/${deleteItemId}`;
      else if (deleteItemType === 'requestType') endpoint = `/api/request-types/${deleteItemId}`;
      
      await axios.delete(endpoint);
      
      // Update state
      if (deleteItemType === 'admin') setAdmins(admins.filter(a => a.admin_id !== deleteItemId));
      else if (deleteItemType === 'leader') setLeaders(leaders.filter(l => l.leader_id !== deleteItemId));
      else if (deleteItemType === 'department') setDepartments(departments.filter(d => d.department_id !== deleteItemId));
      else if (deleteItemType === 'requestType') setRequestTypes(requestTypes.filter(rt => rt.request_type_id !== deleteItemId));
      
      // Show success message
    } catch (err) {
      console.error('Error deleting item:', err);
      // Show error message
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  // Open password change dialog
  const openPasswordDialog = (type, id) => {
    setPasswordForm({
      id,
      type,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setIsPasswordDialogOpen(true);
  };

  // Handle password change
  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      const endpoint = passwordForm.type === 'admin' ? '/api/admins' : '/api/leaders';
      await axios.put(`${endpoint}/${passwordForm.id}`, {
        password: passwordForm.currentPassword,
        newpassword: passwordForm.newPassword
      });
      
      setIsPasswordDialogOpen(false);
      // Show success message
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    }
  };

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

  // Spring animations
  const sidebarAnimation = useSpring({
    width: isSidebarOpen ? 280 : 0,
    opacity: isSidebarOpen ? 1 : 0
  });

  const cardAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
  });

  // Function to open Calendly widget
   const handleCalendlyClick = () => {
    setActiveSection('reservations'); // Optional: update your section state
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/ristwubrist/new-meeting',
      });
    } else {
      alert("Calendly is not loaded. Please check your internet or script.");
    }
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
              className="space-y-2"
            >
              <li>
                <button 
                  onClick={() => setActiveSection('dashboard')}
                  className={`flex items-center w-full p-3 rounded-lg transition ${activeSection === 'dashboard' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                >
                  <FiHome className="mr-3" />
                  Dashboard
                </button>
              </li>
              
              {/* Admin Management Section */}
              <li>
                <div 
                  className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-indigo-700"
                  onClick={() => toggleSection('admins')}
                >
                  <div className="flex items-center">
                    <FiUser className="mr-3" />
                    <span>Admin Management</span>
                  </div>
                  {expandedSections.admins ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                <AnimatePresence>
                  {expandedSections.admins && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-8 mt-1 space-y-1 overflow-hidden"
                    >
                      <li>
                        <button 
                          onClick={() => setActiveSection('createAdmin')}
                          className="flex items-center w-full p-2 rounded-lg hover:bg-indigo-600"
                        >
                          <FiPlus className="mr-2" />
                          Create Admin
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => setActiveSection('adminList')}
                          className="flex items-center w-full p-2 rounded-lg hover:bg-indigo-600"
                        >
                          <FiUsers className="mr-2" />
                          Admin List
                        </button>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
              
              {/* Department Management Section */}
              <li>
                <div 
                  className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-indigo-700"
                  onClick={() => toggleSection('departments')}
                >
                  <div className="flex items-center">
                    <FiSettings className="mr-3" />
                    <span>Departments</span>
                  </div>
                  {expandedSections.departments ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                <AnimatePresence>
                  {expandedSections.departments && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-8 mt-1 space-y-1 overflow-hidden"
                    >
                      <li>
                        <button 
                          onClick={() => setActiveSection('createDepartment')}
                          className="flex items-center w-full p-2 rounded-lg hover:bg-indigo-600"
                        >
                          <FiPlus className="mr-2" />
                          Create Department
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => setActiveSection('departmentList')}
                          className="flex items-center w-full p-2 rounded-lg hover:bg-indigo-600"
                        >
                          <FiHome className="mr-2" />
                          Department List
                        </button>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
              
              {/* Leaders Management Section */}
              <li>
                <div 
                  className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-indigo-700"
                  onClick={() => toggleSection('leaders')}
                >
                  <div className="flex items-center">
                    <FiUsers className="mr-3" />
                    <span>Leaders</span>
                  </div>
                  {expandedSections.leaders ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                <AnimatePresence>
                  {expandedSections.leaders && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-8 mt-1 space-y-1 overflow-hidden"
                    >
                      <li>
                        <button 
                          onClick={() => setActiveSection('createLeader')}
                          className="flex items-center w-full p-2 rounded-lg hover:bg-indigo-600"
                        >
                          <FiPlus className="mr-2" />
                          Create Leader
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => setActiveSection('leaderList')}
                          className="flex items-center w-full p-2 rounded-lg hover:bg-indigo-600"
                        >
                          <FiUsers className="mr-2" />
                          Leader List
                        </button>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
              
              {/* Requests Management Section */}
              <li>
                <div 
                  className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-indigo-700"
                  onClick={() => toggleSection('requests')}
                >
                  <div className="flex items-center">
                    <FiFileText className="mr-3" />
                    <span>Requests</span>
                  </div>
                  {expandedSections.requests ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                <AnimatePresence>
                  {expandedSections.requests && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-8 mt-1 space-y-1 overflow-hidden"
                    >
                      <li>
                        <button 
                          onClick={() => setActiveSection('requestList')}
                          className="flex items-center w-full p-2 rounded-lg hover:bg-indigo-600"
                        >
                          <FiFileText className="mr-2" />
                          All Requests
                        </button>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
              
              {/* Request Types Section */}
              <li>
                <div 
                  className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-indigo-700"
                  onClick={() => toggleSection('requestTypes')}
                >
                  <div className="flex items-center">
                    <FiFileText className="mr-3" />
                    <span>Request Types</span>
                  </div>
                  {expandedSections.requestTypes ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                <AnimatePresence>
                  {expandedSections.requestTypes && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-8 mt-1 space-y-1 overflow-hidden"
                    >
                      <li>
                        <button 
                          onClick={() => setActiveSection('createRequestType')}
                          className="flex items-center w-full p-2 rounded-lg hover:bg-indigo-600"
                        >
                          <FiPlus className="mr-2" />
                          Create Type
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => setActiveSection('requestTypeList')}
                          className="flex items-center w-full p-2 rounded-lg hover:bg-indigo-600"
                        >
                          <FiFileText className="mr-2" />
                          Type List
                        </button>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
              
              {/* Hall Reservations */}
              <li>
                <button 
                 onClick={handleCalendlyClick}
                  className={`flex items-center w-full p-3 rounded-lg transition ${activeSection === 'reservations' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                >
                  <FiCalendar className="mr-3" />
                  Hall Reservations
                </button>
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
                onClick={fetchAllData}
                whileHover={{ rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-gray-100"
              >
                <FiRefreshCw size={20} />
              </motion.button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>
              
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

              {/* Chart */}
              <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-1 mb-8">
                <h3 className="text-lg font-semibold mb-4">Request Status Distribution</h3>
                <div className="h-64">
                  <canvas id="requestChart"></canvas>
                </div>
              </div>
            </motion.div>
          )}

          {/* Create Admin Section */}
          {activeSection === 'createAdmin' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Create New Admin</h2>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <form onSubmit={createAdmin}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={newAdmin.username}
                        onChange={handleAdminChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={newAdmin.email}
                        onChange={handleAdminChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        name="password_hash"
                        value={newAdmin.password_hash}
                        onChange={handleAdminChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={newAdmin.phone_number}
                        onChange={handleAdminChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select
                        name="role"
                        value={newAdmin.role}
                        onChange={handleAdminChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="subadmin">Subadmin</option>
                        <option value="mainadmin">Main Admin</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Create Admin
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Admin List Section */}
          {activeSection === 'adminList' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Admin List</h2>
              
              <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {admins.map((admin) => (
                      <tr key={admin.admin_id}>
                        <td className="px-6 py-4 whitespace-nowrap">{admin.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{admin.phone_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            admin.role === 'mainadmin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {admin.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <button
                            onClick={() => openPasswordDialog('admin', admin.admin_id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <FiKey className="inline mr-1" /> Change Password
                          </button>
                          {admin.role !== 'mainadmin' && (
                            <button
                              onClick={() => confirmDelete('admin', admin.admin_id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FiTrash2 className="inline mr-1" /> Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Create Department Section */}
          {activeSection === 'createDepartment' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
                {editingDepartment ? 'Edit Department' : 'Create New Department'}
              </h2>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <form onSubmit={editingDepartment ? updateDepartment : createDepartment}>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editingDepartment ? editingDepartment.name : newDepartment.name}
                        onChange={handleDepartmentChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={editingDepartment ? editingDepartment.address : newDepartment.address}
                        onChange={handleDepartmentChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-6 space-x-3">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                      {editingDepartment ? 'Update Department' : 'Create Department'}
                    </button>
                    {editingDepartment && (
                      <button
                        type="button"
                        onClick={() => setEditingDepartment(null)}
                        className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* Department List Section */}
          {activeSection === 'departmentList' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Department List</h2>
              
              <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {departments.map((department) => (
                      <tr key={department.department_id}>
                        <td className="px-6 py-4 whitespace-nowrap">{department.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{department.address}</td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <button
                            onClick={() => setEditingDepartment(department)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <FiEdit className="inline mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => confirmDelete('department', department.department_id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="inline mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Create Leader Section */}
          {activeSection === 'createLeader' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Create New Department Leader</h2>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <form onSubmit={createLeader}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={newLeader.username}
                        onChange={handleLeaderChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="full_name"
                        value={newLeader.full_name}
                        onChange={handleLeaderChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={newLeader.email}
                        onChange={handleLeaderChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={newLeader.phone_number}
                        onChange={handleLeaderChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        name="password_hash"
                        value={newLeader.password_hash}
                        onChange={handleLeaderChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <select
                        name="department_id"
                        value={newLeader.department_id}
                        onChange={handleLeaderChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.department_id} value={dept.department_id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Create Leader
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Leader List Section */}
          {activeSection === 'leaderList' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Department Leaders</h2>
              
              <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaders.map((leader) => {
                      const department = departments.find(d => d.department_id === leader.department_id);
                      return (
                        <tr key={leader.leader_id}>
                          <td className="px-6 py-4 whitespace-nowrap">{leader.full_name || leader.username}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{leader.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{leader.phone_number}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {department ? department.name : 'Not assigned'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap space-x-2">
                            <button
                              onClick={() => openPasswordDialog('leader', leader.leader_id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <FiKey className="inline mr-1" /> Change Password
                            </button>
                            <button
                              onClick={() => confirmDelete('leader', leader.leader_id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FiTrash2 className="inline mr-1" /> Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Request List Section */}
          {activeSection === 'requestList' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">All Requests</h2>
              
              <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((request) => {
                      const requestType = requestTypes.find(rt => rt.request_type_id === request.request_type_id);
                      const department = departments.find(d => d.department_id === request.department_id);
                      return (
                        <tr key={request.request_id}>
                          <td className="px-6 py-4 whitespace-nowrap">{request.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {requestType ? requestType.name : 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {department ? department.name : 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={request.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={request.status}
                              onChange={(e) => updateRequestStatus(request.request_id, e.target.value)}
                              className="p-2 border border-gray-300 rounded-md"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Accepted">Accepted</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Create Request Type Section */}
          {activeSection === 'createRequestType' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Create New Request Type</h2>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <form onSubmit={createRequestType}>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={newRequestType.name}
                        onChange={handleRequestTypeChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Create Request Type
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Request Type List Section */}
          {activeSection === 'requestTypeList' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Request Types</h2>
              
              <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requestTypes.map((type) => (
                      <tr key={type.request_type_id}>
                        <td className="px-6 py-4 whitespace-nowrap">{type.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => confirmDelete('requestType', type.request_type_id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="inline mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Hall Reservations Section */}
          {activeSection === 'reservations' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Hall Reservations</h2>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="mb-6">
                  <button
                    onClick={openCalendlyWidget}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center"
                  >
                    <FiCalendar className="mr-2" />
                    Schedule Hall Reservation
                  </button>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Reservation Instructions</h3>
                  <div className="prose">
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Click the button above to select an available time slot</li>
                      <li>Fill in your department name and purpose of reservation</li>
                      <li>Submit the form to reserve the hall</li>
                      <li>You will receive a confirmation email with reservation details</li>
                    </ol>
                    <p className="mt-4 text-sm text-gray-600">
                      Note: Each department can reserve the hall for a maximum of 4 hours per day.
                      Double bookings are automatically prevented by the system.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <Transition appear show={isDeleteDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsDeleteDialogOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Confirm Deletion
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this {deleteItemType}? This action cannot be undone.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={deleteItem}
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Password Change Dialog */}
      <Transition appear show={isPasswordDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsPasswordDialogOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Change Password
                  </Dialog.Title>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    {passwordError && (
                      <div className="text-red-500 text-sm">{passwordError}</div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setIsPasswordDialogOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      onClick={changePassword}
                    >
                      Change Password
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default MainAdmin;
