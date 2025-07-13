
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import axios from 'axios';
// import {
//   LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from 'recharts';
// import { FiUsers, FiSettings, FiFileText, FiPieChart, FiPlus, FiEdit2, FiTrash2, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';

// const MainAdmin = () => {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [admins, setAdmins] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [leaders, setLeaders] = useState([]);
//   const [requestTypes, setRequestTypes] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [stats, setStats] = useState({
//     totalRequests: 0,
//     pendingRequests: 0,
//     finishedRequests: 0
//   });
//   const [newAdmin, setNewAdmin] = useState({
//     username: '',
//     email: '',
//     password_hash: '',
//     role: 'subadmin'
//   });
//   const [newLeader, setNewLeader] = useState({
//     username: '',
//     fullname: '',
//     email: '',
//     password_hash: '',
//     department_id: ''
//   });
//   const [newRequestType, setNewRequestType] = useState({
//     name: ''
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [expandedSections, setExpandedSections] = useState({
//     admins: true,
//     departments: true,
//     requests: true
//   });
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const navigate = useNavigate();

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         duration: 0.5
//       }
//     }
//   };

//   // Fetch all data
//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const fetchAllData = async () => {
//     setIsLoading(true);
//     try {
//       const [
//         adminsRes, 
//         departmentsRes, 
//         leadersRes, 
//         requestTypesRes, 
//         requestsRes
//       ] = await Promise.all([
//         axios.get('/api/admins'),
//         axios.get('/api/departments'),
//         axios.get('/api/leaders'),
//         axios.get('/api/request-types'),
//         axios.get('/api/requests')
//       ]);

//       setAdmins(adminsRes.data);
//       setDepartments(departmentsRes.data);
//       setLeaders(leadersRes.data);
//       setRequestTypes(requestTypesRes.data);
//       setRequests(requestsRes.data);

//       // Calculate stats
//       const total = requestsRes.data.length;
//       const pending = requestsRes.data.filter(r => r.status === 'Pending').length;
//       const finished = requestsRes.data.filter(r => r.status === 'Finished').length;
      
//       setStats({
//         totalRequests: total,
//         pendingRequests: pending,
//         finishedRequests: finished
//       });
//     } catch (err) {
//       setError('Failed to fetch data. Please try again.');
//       console.error('Fetch error:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Toggle section expansion
//   const toggleSection = (section) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   // Handle form changes
//   const handleAdminChange = (e) => {
//     setNewAdmin({
//       ...newAdmin,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleLeaderChange = (e) => {
//     setNewLeader({
//       ...newLeader,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleRequestTypeChange = (e) => {
//     setNewRequestType({
//       ...newRequestType,
//       [e.target.name]: e.target.value
//     });
//   };

//   // Create new admin
//   const createAdmin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('/api/admins', newAdmin);
//       setAdmins([...admins, res.data]);
//       setNewAdmin({ username: '', email: '', password_hash: '', role: 'subadmin' });
//       setSuccess('Subadmin created successfully!');
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create subadmin.');
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   // Create new leader
//   const createLeader = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('/api/leaders', newLeader);
//       setLeaders([...leaders, res.data]);
//       setNewLeader({ username: '', fullname: '', email: '', password_hash: '', department_id: '' });
//       setSuccess('Department leader created successfully!');
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create department leader.');
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   // Create new request type
//   const createRequestType = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('/api/request-types', newRequestType);
//       setRequestTypes([...requestTypes, res.data]);
//       setNewRequestType({ name: '' });
//       setSuccess('Request type created successfully!');
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create request type.');
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   // Edit password for admin or leader
//   const editPassword = async (type, id, newPassword) => {
//     try {
//       const endpoint = type === 'admin' ? '/api/admins' : '/api/leaders';
//       await axios.put(`${endpoint}/${id}/password`, { password: newPassword });
//       setSuccess('Password updated successfully!');
//       setTimeout(() => setSuccess(''), 3000);
//       fetchAllData(); // Refresh data
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update password.');
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   // Update request status
//   const updateRequestStatus = async (requestId, newStatus) => {
//     try {
//       await axios.put(`/api/requests/${requestId}/status`, { status: newStatus });
//       setRequests(requests.map(req => 
//         req.id === requestId ? { ...req, status: newStatus } : req
//       ));
//       setSuccess('Request status updated!');
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update request status.');
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   // Delete item
//   const deleteItem = async (type, id) => {
//     if (!window.confirm('Are you sure you want to delete this item?')) return;
    
//     try {
//       let endpoint = '';
//       if (type === 'admin') endpoint = `/api/admins/${id}`;
//       else if (type === 'leader') endpoint = `/api/leaders/${id}`;
//       else if (type === 'requestType') endpoint = `/api/request-types/${id}`;
      
//       await axios.delete(endpoint);
      
//       // Update state
//       if (type === 'admin') setAdmins(admins.filter(a => a.id !== id));
//       else if (type === 'leader') setLeaders(leaders.filter(l => l.id !== id));
//       else if (type === 'requestType') setRequestTypes(requestTypes.filter(rt => rt.id !== id));
      
//       setSuccess('Item deleted successfully!');
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to delete item.');
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   // Data for charts
//   const requestData = [
//     { name: 'Total', value: stats.totalRequests },
//     { name: 'Pending', value: stats.pendingRequests },
//     { name: 'Finished', value: stats.finishedRequests }
//   ];

//   const departmentRequestData = departments.map(dept => {
//     const deptRequests = requests.filter(req => req.department_id === dept.id);
//     return {
//       name: dept.name,
//       requests: deptRequests.length
//     };
//   });

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

//   return (
//     <motion.div 
//       className="flex flex-col md:flex-row h-screen bg-gray-100"
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//     >
//       {/* Mobile Menu Button */}
//       <button 
//         className="md:hidden fixed top-4 right-4 z-50 p-2 bg-indigo-600 text-white rounded-md"
//         onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//       >
//         {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//       </button>

//       {/* Sidebar */}
//       <motion.div 
//         className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-indigo-800 text-white shadow-lg fixed md:relative z-40 h-full`}
//         variants={itemVariants}
//       >
//         <div className="p-4 border-b border-indigo-700">
//           <h1 className="text-2xl font-bold">Admin Portal</h1>
//           <p className="text-indigo-300">Main Administrator</p>
//         </div>
//         <nav className="p-4">
//           <ul className="space-y-2">
//             <li>
//               <button 
//                 onClick={() => {
//                   setActiveTab('dashboard');
//                   setMobileMenuOpen(false);
//                 }}
//                 className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
//               >
//                 <FiPieChart className="mr-3" />
//                 Dashboard
//               </button>
//             </li>
//             <li>
//               <button 
//                 onClick={() => {
//                   setActiveTab('admins');
//                   setMobileMenuOpen(false);
//                 }}
//                 className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'admins' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
//               >
//                 <FiUsers className="mr-3" />
//                 Manage Admins
//               </button>
//             </li>
//             <li>
//               <button 
//                 onClick={() => {
//                   setActiveTab('departments');
//                   setMobileMenuOpen(false);
//                 }}
//                 className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'departments' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
//               >
//                 <FiSettings className="mr-3" />
//                 Departments & Leaders
//               </button>
//             </li>
//             <li>
//               <button 
//                 onClick={() => {
//                   setActiveTab('requests');
//                   setMobileMenuOpen(false);
//                 }}
//                 className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'requests' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
//               >
//                 <FiFileText className="mr-3" />
//                 Requests Management
//               </button>
//             </li>
//           </ul>
//         </nav>
//       </motion.div>

//       {/* Main Content */}
//       <motion.div 
//         className="flex-1 overflow-y-auto md:ml-64"
//         variants={itemVariants}
//       >
//         <div className="p-4 md:p-8">
//           {/* Loading Indicator */}
//           {isLoading && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="bg-white p-6 rounded-lg shadow-lg">
//                 <p className="text-lg font-semibold">Loading data...</p>
//               </div>
//             </div>
//           )}

//           {/* Notifications */}
//           <AnimatePresence>
//             {error && (
//               <motion.div 
//                 className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700"
//                 initial={{ opacity: 0, x: 50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: 50 }}
//               >
//                 <p>{error}</p>
//               </motion.div>
//             )}
//             {success && (
//               <motion.div 
//                 className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700"
//                 initial={{ opacity: 0, x: 50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: 50 }}
//               >
//                 <p>{success}</p>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Dashboard Tab */}
//           {activeTab === 'dashboard' && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Welcome, Main Administrator</h2>
              
//               {/* Stats Cards */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
//                 <motion.div 
//                   className="bg-white p-4 md:p-6 rounded-xl shadow-md"
//                   whileHover={{ y: -5 }}
//                 >
//                   <h3 className="text-gray-500 font-medium">Total Requests</h3>
//                   <p className="text-2xl md:text-3xl font-bold text-indigo-600">{stats.totalRequests}</p>
//                 </motion.div>
//                 <motion.div 
//                   className="bg-white p-4 md:p-6 rounded-xl shadow-md"
//                   whileHover={{ y: -5 }}
//                 >
//                   <h3 className="text-gray-500 font-medium">Pending Requests</h3>
//                   <p className="text-2xl md:text-3xl font-bold text-yellow-500">{stats.pendingRequests}</p>
//                 </motion.div>
//                 <motion.div 
//                   className="bg-white p-4 md:p-6 rounded-xl shadow-md"
//                   whileHover={{ y: -5 }}
//                 >
//                   <h3 className="text-gray-500 font-medium">Finished Requests</h3>
//                   <p className="text-2xl md:text-3xl font-bold text-green-500">{stats.finishedRequests}</p>
//                 </motion.div>
//               </div>

//               {/* Charts */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
//                 <motion.div 
//                   className="bg-white p-4 md:p-6 rounded-xl shadow-md"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.2 }}
//                 >
//                   <h3 className="text-lg font-semibold mb-4">Requests Overview</h3>
//                   <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={requestData}
//                           cx="50%"
//                           cy="50%"
//                           labelLine={false}
//                           outerRadius={80}
//                           fill="#8884d8"
//                           dataKey="value"
//                           label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                         >
//                           {requestData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                           ))}
//                         </Pie>
//                         <Tooltip />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </motion.div>
//                 <motion.div 
//                   className="bg-white p-4 md:p-6 rounded-xl shadow-md"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.4 }}
//                 >
//                   <h3 className="text-lg font-semibold mb-4">Requests by Department</h3>
//                   <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={departmentRequestData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Bar dataKey="requests" fill="#8884d8" />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </motion.div>
//               </div>
//             </motion.div>
//           )}

//           {/* Admins Tab */}
//           {activeTab === 'admins' && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Management</h2>
//               </div>

//               {/* Create Subadmin */}
//               <motion.div 
//                 className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-6 md:mb-8"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 <div 
//                   className="flex justify-between items-center cursor-pointer"
//                   onClick={() => toggleSection('createAdmin')}
//                 >
//                   <h3 className="text-lg md:text-xl font-semibold">Create New Subadmin</h3>
//                   <FiChevronDown className={`transition-transform ${expandedSections.createAdmin ? 'rotate-180' : ''}`} />
//                 </div>
//                 <AnimatePresence>
//                   {expandedSections.createAdmin && (
//                     <motion.form 
//                       onSubmit={createAdmin}
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: 'auto', opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       className="overflow-hidden"
//                     >
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//                           <input
//                             type="text"
//                             name="username"
//                             value={newAdmin.username}
//                             onChange={handleAdminChange}
//                             className="w-full p-2 border border-gray-300 rounded-md"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                           <input
//                             type="email"
//                             name="email"
//                             value={newAdmin.email}
//                             onChange={handleAdminChange}
//                             className="w-full p-2 border border-gray-300 rounded-md"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                           <input
//                             type="password"
//                             name="password_hash"
//                             value={newAdmin.password_hash}
//                             onChange={handleAdminChange}
//                             className="w-full p-2 border border-gray-300 rounded-md"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//                           <select
//                             name="role"
//                             value={newAdmin.role}
//                             onChange={handleAdminChange}
//                             className="w-full p-2 border border-gray-300 rounded-md"
//                             required
//                           >
//                             <option value="subadmin">Subadmin</option>
//                           </select>
//                         </div>
//                       </div>
//                       <button
//                         type="submit"
//                         className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
//                       >
//                         Create Subadmin
//                       </button>
//                     </motion.form>
//                   )}
//                 </AnimatePresence>
//               </motion.div>

//               {/* Admins List */}
//               <motion.div 
//                 className="bg-white p-4 md:p-6 rounded-xl shadow-md"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//               >
//                 <div 
//                   className="flex justify-between items-center cursor-pointer"
//                   onClick={() => toggleSection('admins')}
//                 >
//                   <h3 className="text-lg md:text-xl font-semibold">All Admins ({admins.length})</h3>
//                   <FiChevronDown className={`transition-transform ${expandedSections.admins ? 'rotate-180' : ''}`} />
//                 </div>
//                 <AnimatePresence>
//                   {expandedSections.admins && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: 'auto', opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       className="overflow-hidden"
//                     >
//                       <div className="mt-4 overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                           <thead className="bg-gray-50">
//                             <tr>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                             </tr>
//                           </thead>
//                           <tbody className="bg-white divide-y divide-gray-200">
//                             {admins.map((admin) => (
//                               <motion.tr
//                                 key={admin.id}
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 transition={{ duration: 0.3 }}
//                               >
//                                 <td className="px-4 py-4 whitespace-nowrap">{admin.username}</td>
//                                 <td className="px-4 py-4 whitespace-nowrap">{admin.email}</td>
//                                 <td className="px-4 py-4 whitespace-nowrap">
//                                   <span className={`px-2 py-1 text-xs rounded-full ${admin.role === 'mainadmin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
//                                     {admin.role}
//                                   </span>
//                                 </td>
//                                 <td className="px-4 py-4 whitespace-nowrap space-x-2">
//                                   <button
//                                     onClick={() => {
//                                       const newPassword = prompt('Enter new password:');
//                                       if (newPassword) editPassword('admin', admin.id, newPassword);
//                                     }}
//                                     className="text-indigo-600 hover:text-indigo-900 text-sm md:text-base"
//                                   >
//                                     Change Password
//                                   </button>
//                                   {admin.role !== 'mainadmin' && (
//                                     <button
//                                       onClick={() => deleteItem('admin', admin.id)}
//                                       className="text-red-600 hover:text-red-900 text-sm md:text-base"
//                                     >
//                                       Delete
//                                     </button>
//                                   )}
//                                 </td>
//                               </motion.tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             </motion.div>
//           )}

//           {/* Departments Tab */}
//           {activeTab === 'departments' && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Departments & Leaders</h2>
//               </div>

//               {/* Create Department Leader */}
//               <motion.div 
//                 className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-6 md:mb-8"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 <div 
//                   className="flex justify-between items-center cursor-pointer"
//                   onClick={() => toggleSection('createLeader')}
//                 >
//                   <h3 className="text-lg md:text-xl font-semibold">Create New Department Leader</h3>
//                   <FiChevronDown className={`transition-transform ${expandedSections.createLeader ? 'rotate-180' : ''}`} />
//                 </div>
//                 <AnimatePresence>
//                   {expandedSections.createLeader && (
//                     <motion.form 
//                       onSubmit={createLeader}
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: 'auto', opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       className="overflow-hidden"
//                     >
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//                           <input
//                             type="text"
//                             name="username"
//                             value={newLeader.username}
//                             onChange={handleLeaderChange}
//                             className="w-full p-2 border border-gray-300 rounded-md"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                           <input
//                             type="text"
//                             name="fullname"
//                             value={newLeader.fullname}
//                             onChange={handleLeaderChange}
//                             className="w-full p-2 border border-gray-300 rounded-md"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                           <input
//                             type="email"
//                             name="email"
//                             value={newLeader.email}
//                             onChange={handleLeaderChange}
//                             className="w-full p-2 border border-gray-300 rounded-md"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                           <input
//                             type="password"
//                             name="password_hash"
//                             value={newLeader.password_hash}
//                             onChange={handleLeaderChange}
//                             className="w-full p-2 border border-gray-300 rounded-md"
//                             required
//                           />
//                         </div>
//                         <div className="md:col-span-2">
//                           <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
//                           <select
//                             name="department_id"
//                             value={newLeader.department_id}
//                             onChange={handleLeaderChange}
//                             className="w-full p-2 border border-gray-300 rounded-md"
//                             required
//                           >
//                             <option value="">Select Department</option>
//                             {departments.map(dept => (
//                               <option key={dept.id} value={dept.id}>{dept.name}</option>
//                             ))}
//                           </select>
//                         </div>
//                       </div>
//                       <button
//                         type="submit"
//                         className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
//                       >
//                         Create Leader
//                       </button>
//                     </motion.form>
//                   )}
//                 </AnimatePresence>
//               </motion.div>

//               {/* Departments List */}
//               <motion.div 
//                 className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-6 md:mb-8"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//               >
//                 <div 
//                   className="flex justify-between items-center cursor-pointer"
//                   onClick={() => toggleSection('departments')}
//                 >
//                   <h3 className="text-lg md:text-xl font-semibold">All Departments ({departments.length})</h3>
//                   <FiChevronDown className={`transition-transform ${expandedSections.departments ? 'rotate-180' : ''}`} />
//                 </div>
//                 <AnimatePresence>
//                   {expandedSections.departments && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: 'auto', opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       className="overflow-hidden"
//                     >
//                       <div className="mt-4 overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                           <thead className="bg-gray-50">
//                             <tr>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leader</th>
//                             </tr>
//                           </thead>
//                           <tbody className="bg-white divide-y divide-gray-200">
//                             {departments.map((dept) => {
//                               const leader = leaders.find(l => l.department_id === dept.id);
//                               return (
//                                 <motion.tr
//                                   key={dept.id}
//                                   initial={{ opacity: 0 }}
//                                   animate={{ opacity: 1 }}
//                                   transition={{ duration: 0.3 }}
//                                 >
//                                   <td className="px-4 py-4 whitespace-nowrap">{dept.name}</td>
//                                   <td className="px-4 py-4 whitespace-nowrap">{dept.description || 'N/A'}</td>
//                                   <td className="px-4 py-4 whitespace-nowrap">
//                                     {leader ? (
//                                       <div>
//                                         <p>{leader.fullname || leader.username}</p>
//                                         <p className="text-sm text-gray-500">{leader.email}</p>
//                                       </div>
//                                     ) : 'No leader assigned'}
//                                   </td>
//                                 </motion.tr>
//                               );
//                             })}
//                           </tbody>
//                         </table>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </motion.div>

//               {/* Leaders List */}
//               <motion.div 
//                 className="bg-white p-4 md:p-6 rounded-xl shadow-md"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.6 }}
//               >
//                 <div 
//                   className="flex justify-between items-center cursor-pointer"
//                   onClick={() => toggleSection('leaders')}
//                 >
//                   <h3 className="text-lg md:text-xl font-semibold">All Department Leaders ({leaders.length})</h3>
//                   <FiChevronDown className={`transition-transform ${expandedSections.leaders ? 'rotate-180' : ''}`} />
//                 </div>
//                 <AnimatePresence>
//                   {expandedSections.leaders && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: 'auto', opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       className="overflow-hidden"
//                     >
//                       <div className="mt-4 overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                           <thead className="bg-gray-50">
//                             <tr>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                             </tr>
//                           </thead>
//                           <tbody className="bg-white divide-y divide-gray-200">
//                             {leaders.map((leader) => {
//                               const department = departments.find(d => d.id === leader.department_id);
//                               return (
//                                 <motion.tr
//                                   key={leader.id}
//                                   initial={{ opacity: 0 }}
//                                   animate={{ opacity: 1 }}
//                                   transition={{ duration: 0.3 }}
//                                 >
//                                   <td className="px-4 py-4 whitespace-nowrap">{leader.fullname || leader.username}</td>
//                                   <td className="px-4 py-4 whitespace-nowrap">{leader.email}</td>
//                                   <td className="px-4 py-4 whitespace-nowrap">
//                                     {department ? department.name : 'Department not found'}
//                                   </td>
//                                   <td className="px-4 py-4 whitespace-nowrap space-x-2">
//                                     <button
//                                       onClick={() => {
//                                         const newPassword = prompt('Enter new password:');
//                                         if (newPassword) editPassword('leader', leader.id, newPassword);
//                                       }}
//                                       className="text-indigo-600 hover:text-indigo-900 text-sm md:text-base"
//                                     >
//                                       Change Password
//                                     </button>
//                                     <button
//                                       onClick={() => deleteItem('leader', leader.id)}
//                                       className="text-red-600 hover:text-red-900 text-sm md:text-base"
//                                     >
//                                       Delete
//                                     </button>
//                                   </td>
//                                 </motion.tr>
//                               );
//                             })}
//                           </tbody>
//                         </table>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             </motion.div>
//           )}

//           {/* Requests Tab */}
//           {activeTab === 'requests' && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Requests Management</h2>
//               </div>

//               {/* Create Request Type */}
//               <motion.div 
//                 className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-6 md:mb-8"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 <div 
//                   className="flex justify-between items-center cursor-pointer"
//                   onClick={() => toggleSection('createRequestType')}
//                 >
//                   <h3 className="text-lg md:text-xl font-semibold">Create New Request Type</h3>
//                   <FiChevronDown className={`transition-transform ${expandedSections.createRequestType ? 'rotate-180' : ''}`} />
//                 </div>
//                 <AnimatePresence>
//                   {expandedSections.createRequestType && (
//                     <motion.form 
//                       onSubmit={createRequestType}
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: 'auto', opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       className="overflow-hidden"
//                     >
//                       <div className="grid grid-cols-1 gap-4 mt-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                           <input
//                             type="text"
//                             name="name"
//                             value={newRequestType.name}
//                             onChange={handleRequestTypeChange}
//                             className="w-full p-2 border border-gray-300 rounded-md"
//                             required
//                           />
//                         </div>
//                       </div>
//                       <button
//                         type="submit"
//                         className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
//                       >
//                         Create Request Type
//                       </button>
//                     </motion.form>
//                   )}
//                 </AnimatePresence>
//               </motion.div>

//               {/* Request Types List */}
//               <motion.div 
//                 className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-6 md:mb-8"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//               >
//                 <div 
//                   className="flex justify-between items-center cursor-pointer"
//                   onClick={() => toggleSection('requestTypes')}
//                 >
//                   <h3 className="text-lg md:text-xl font-semibold">Request Types ({requestTypes.length})</h3>
//                   <FiChevronDown className={`transition-transform ${expandedSections.requestTypes ? 'rotate-180' : ''}`} />
//                 </div>
//                 <AnimatePresence>
//                   {expandedSections.requestTypes && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: 'auto', opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       className="overflow-hidden"
//                     >
//                       <div className="mt-4 overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                           <thead className="bg-gray-50">
//                             <tr>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                             </tr>
//                           </thead>
//                           <tbody className="bg-white divide-y divide-gray-200">
//                             {requestTypes.map((type) => (
//                               <motion.tr
//                                 key={type.id}
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 transition={{ duration: 0.3 }}
//                               >
//                                 <td className="px-4 py-4 whitespace-nowrap">{type.name}</td>
//                                 <td className="px-4 py-4 whitespace-nowrap">
//                                   <button
//                                     onClick={() => deleteItem('requestType', type.id)}
//                                     className="text-red-600 hover:text-red-900 text-sm md:text-base"
//                                   >
//                                     Delete
//                                   </button>
//                                 </td>
//                               </motion.tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </motion.div>

//               {/* Requests List */}
//               <motion.div 
//                 className="bg-white p-4 md:p-6 rounded-xl shadow-md"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.6 }}
//               >
//                 <div 
//                   className="flex justify-between items-center cursor-pointer"
//                   onClick={() => toggleSection('requests')}
//                 >
//                   <h3 className="text-lg md:text-xl font-semibold">All Requests ({requests.length})</h3>
//                   <FiChevronDown className={`transition-transform ${expandedSections.requests ? 'rotate-180' : ''}`} />
//                 </div>
//                 <AnimatePresence>
//                   {expandedSections.requests && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: 'auto', opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       className="overflow-hidden"
//                     >
//                       <div className="mt-4 overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                           <thead className="bg-gray-50">
//                             <tr>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Type</th>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                             </tr>
//                           </thead>
//                           <tbody className="bg-white divide-y divide-gray-200">
//                             {requests.map((request) => {
//                               const requestType = requestTypes.find(rt => rt.id === request.request_type_id);
//                               const department = departments.find(d => d.id === request.department_id);
//                               return (
//                                 <motion.tr
//                                   key={request.id}
//                                   initial={{ opacity: 0 }}
//                                   animate={{ opacity: 1 }}
//                                   transition={{ duration: 0.3 }}
//                                 >
//                                   <td className="px-4 py-4 whitespace-nowrap">
//                                     <p className="font-medium">{request.user_name}</p>
//                                     <p className="text-sm text-gray-500">{request.user_email}</p>
//                                   </td>
//                                   <td className="px-4 py-4 whitespace-nowrap">
//                                     {requestType ? requestType.name : 'Unknown'}
//                                   </td>
//                                   <td className="px-4 py-4 whitespace-nowrap">
//                                     {department ? department.name : 'Unknown'}
//                                   </td>
//                                   <td className="px-4 py-4">
//                                     <div className="max-w-xs truncate" title={request.details}>
//                                       {request.details}
//                                     </div>
//                                   </td>
//                                   <td className="px-4 py-4 whitespace-nowrap">
//                                     <span className={`px-2 py-1 text-xs rounded-full ${
//                                       request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                                       request.status === 'Accepted' ? 'bg-blue-100 text-blue-800' :
//                                       'bg-green-100 text-green-800'
//                                     }`}>
//                                       {request.status}
//                                     </span>
//                                   </td>
//                                   <td className="px-4 py-4 whitespace-nowrap">
//                                     <select
//                                       value={request.status}
//                                       onChange={(e) => updateRequestStatus(request.id, e.target.value)}
//                                       className="p-1 border border-gray-300 rounded-md text-sm"
//                                     >
//                                       <option value="Pending">Pending</option>
//                                       <option value="Accepted">Accepted</option>
//                                       <option value="Finished">Finished</option>
//                                     </select>
//                                   </td>
//                                 </motion.tr>
//                               );
//                             })}
//                           </tbody>
//                         </table>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             </motion.div>
//           )}
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default MainAdmin;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FiUsers, FiSettings, FiFileText, FiPieChart, FiPlus, FiEdit2, FiTrash2, FiChevronDown, FiMenu, FiX, FiCalendar } from 'react-icons/fi';

const MainAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [admins, setAdmins] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [requestTypes, setRequestTypes] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    finishedRequests: 0
  });
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password_hash: '',
    role: 'subadmin'
  });
  const [newLeader, setNewLeader] = useState({
    username: '',
    full_name: '',
    email: '',
    password_hash: '',
    department_id: ''
  });
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    address: ''
  });
  const [newRequestType, setNewRequestType] = useState({
    name: ''
  });
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    admins: true,
    departments: true,
    requests: true,
    reservations: true
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, []);

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
      

      // Calculate stats
      const total = requestsRes.data.length;
      const pending = requestsRes.data.filter(r => r.status === 'Pending').length;
      const finished = requestsRes.data.filter(r => r.status === 'Finished').length;
      
      setStats({
        totalRequests: total,
        pendingRequests: pending,
        finishedRequests: finished
      });
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
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
    console.log('Changed:', e.target.name, e.target.value);
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
      setNewAdmin({ username: '', email: '', password_hash: '', role: 'subadmin' });
      setSuccess('Subadmin created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subadmin.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Create new leader
  const createLeader = async (e) => {
    e.preventDefault();
     console.log('Submitting:', newLeader);
    try {
      const res = await axios.post('/api/leaders', newLeader);
      setLeaders([...leaders, res.data]);
      setNewLeader({ username: '', full_name: '', email: '', password_hash: '', department_id: '' });
      setSuccess('Department leader created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create department leader.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Create new department
  const createDepartment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/departments', newDepartment);
      setDepartments([...departments, res.data]);
      setNewDepartment({ name: '', address: '' });
      setSuccess('Department created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create department.');
      setTimeout(() => setError(''), 3000);
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
      setSuccess('Department updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update department.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Create new request type
  const createRequestType = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/request-types', newRequestType);
      setRequestTypes([...requestTypes, res.data]);
      setNewRequestType({ name: '' });
      setSuccess('Request type created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request type.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Edit password for admin or leader
  const editPassword = async (type, id, newPassword) => {
    try {
      const endpoint = type === 'admin' ? '/api/admins' : '/api/leaders';
      await axios.put(`${endpoint}/${id}/password`, { password: newPassword });
      setSuccess('Password updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchAllData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Update request status
  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      await axios.put(`/api/requests/${requestId}/status`, { status: newStatus });
      setRequests(requests.map(req => 
        req.request_id === requestId ? { ...req, status: newStatus } : req
      ));
      setSuccess('Request status updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update request status.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Delete item
  const deleteItem = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      let endpoint = '';
      if (type === 'admin') endpoint = `/api/admins/${id}`;
      else if (type === 'leader') endpoint = `/api/leaders/${id}`;
      else if (type === 'department') endpoint = `/api/departments/${id}`;
      else if (type === 'requestType') endpoint = `/api/request-types/${id}`;
      
      await axios.delete(endpoint);
      
      // Update state
      if (type === 'admin') setAdmins(admins.filter(a => a.admin_id !== id));
      else if (type === 'leader') setLeaders(leaders.filter(l => l.leader_id !== id));
      else if (type === 'department') setDepartments(departments.filter(d => d.department_id !== id));
      else if (type === 'requestType') setRequestTypes(requestTypes.filter(rt => rt.id !== id));
      
      setSuccess('Item deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete item.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Data for charts
  const requestData = [
    { name: 'Total', value: stats.totalRequests },
    { name: 'Pending', value: stats.pendingRequests },
    { name: 'Finished', value: stats.finishedRequests }
  ];

  const departmentRequestData = departments.map(dept => {
    const deptRequests = requests.filter(req => req.department_id === dept.department_id);
    return {
      name: dept.name,
      requests: deptRequests.length
    };
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <motion.div 
      className="flex flex-col md:flex-row h-screen bg-gray-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-indigo-600 text-white rounded-md"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.div 
        className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-indigo-800 text-white shadow-lg fixed md:relative z-40 h-full`}
        variants={itemVariants}
      >
        <div className="p-4 border-b border-indigo-700">
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <p className="text-indigo-300">Main Administrator</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => {
                  setActiveTab('dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
              >
                <FiPieChart className="mr-3" />
                Dashboard
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setActiveTab('admins');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'admins' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
              >
                <FiUsers className="mr-3" />
                Manage Admins
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setActiveTab('departments');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'departments' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
              >
                <FiSettings className="mr-3" />
                Departments & Leaders
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setActiveTab('requests');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'requests' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
              >
                <FiFileText className="mr-3" />
                Requests Management
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setActiveTab('reservations');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'reservations' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
              >
                <FiCalendar className="mr-3" />
                Hall Reservations
              </button>
            </li>
          </ul>
        </nav>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="flex-1 overflow-y-auto md:ml-64"
        variants={itemVariants}
      >
        <div className="p-4 md:p-8">
          {/* Loading Indicator */}
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-lg font-semibold">Loading data...</p>
              </div>
            </div>
          )}

          {/* Notifications */}
          <AnimatePresence>
            {error && (
              <motion.div 
                className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
              >
                <p>{error}</p>
              </motion.div>
            )}
            {success && (
              <motion.div 
                className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
              >
                <p>{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Welcome, Main Administrator</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                <motion.div 
                  className="bg-white p-4 md:p-6 rounded-xl shadow-md"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-gray-500 font-medium">Total Requests</h3>
                  <p className="text-2xl md:text-3xl font-bold text-indigo-600">{stats.totalRequests}</p>
                </motion.div>
                <motion.div 
                  className="bg-white p-4 md:p-6 rounded-xl shadow-md"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-gray-500 font-medium">Pending Requests</h3>
                  <p className="text-2xl md:text-3xl font-bold text-yellow-500">{stats.pendingRequests}</p>
                </motion.div>
                <motion.div 
                  className="bg-white p-4 md:p-6 rounded-xl shadow-md"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-gray-500 font-medium">Finished Requests</h3>
                  <p className="text-2xl md:text-3xl font-bold text-green-500">{stats.finishedRequests}</p>
                </motion.div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
                <motion.div 
                  className="bg-white p-4 md:p-6 rounded-xl shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold mb-4">Requests Overview</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={requestData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {requestData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-white p-4 md:p-6 rounded-xl shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-lg font-semibold mb-4">Requests by Department</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentRequestData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="requests" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Admins Tab */}
          {activeTab === 'admins' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Management</h2>
              </div>

              {/* Create Subadmin */}
              <motion.div 
                className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-6 md:mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('createAdmin')}
                >
                  <h3 className="text-lg md:text-xl font-semibold">Create New Subadmin</h3>
                  <FiChevronDown className={`transition-transform ${expandedSections.createAdmin ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {expandedSections.createAdmin && (
                    <motion.form 
                      onSubmit={createAdmin}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                          <select
                            name="role"
                            value={newAdmin.role}
                            onChange={handleAdminChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                          >
                            <option value="subadmin">Subadmin</option>
                          </select>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                      >
                        Create Subadmin
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Admins List */}
              <motion.div 
                className="bg-white p-4 md:p-6 rounded-xl shadow-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('admins')}
                >
                  <h3 className="text-lg md:text-xl font-semibold">All Admins ({admins.length})</h3>
                  <FiChevronDown className={`transition-transform ${expandedSections.admins ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {expandedSections.admins && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {admins.map((admin) => (
                              <motion.tr
                                key={admin.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <td className="px-4 py-4 whitespace-nowrap">{admin.username}</td>
                                <td className="px-4 py-4 whitespace-nowrap">{admin.email}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs rounded-full ${admin.role === 'mainadmin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {admin.role}
                                  </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap space-x-2">
                                  <button
                                    onClick={() => {
                                      const newPassword = prompt('Enter new password:');
                                      if (newPassword) editPassword('admin', admin.admin_id, newPassword);
                                    }}
                                    className="text-indigo-600 hover:text-indigo-900 text-sm md:text-base"
                                  >
                                    Change Password
                                  </button>
                                  {admin.role !== 'mainadmin' && (
                                    <button
                                      onClick={() => deleteItem('admin', admin.admin_id)}
                                      className="text-red-600 hover:text-red-900 text-sm md:text-base"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

          {/* Departments Tab */}
          {activeTab === 'departments' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Departments & Leaders</h2>
              </div>

              {/* Create Department */}
              <motion.div 
                className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-6 md:mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('createDepartment')}
                >
                  <h3 className="text-lg md:text-xl font-semibold">
                    {editingDepartment ? 'Edit Department' : 'Create New Department'}
                  </h3>
                  <FiChevronDown className={`transition-transform ${expandedSections.createDepartment ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {expandedSections.createDepartment && (
                    <motion.form 
                      onSubmit={editingDepartment ? updateDepartment : createDepartment}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-4 mt-4">
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
                      <div className="mt-4 space-x-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                        >
                          {editingDepartment ? 'Update Department' : 'Create Department'}
                        </button>
                        {editingDepartment && (
                          <button
                            type="button"
                            onClick={() => setEditingDepartment(null)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Departments List */}
              <motion.div 
                className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-6 md:mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('departments')}
                >
                  <h3 className="text-lg md:text-xl font-semibold">All Departments ({departments.length})</h3>
                  <FiChevronDown className={`transition-transform ${expandedSections.departments ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {expandedSections.departments && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {departments.map((dept) => (
                              <motion.tr
                                key={dept.department_id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <td className="px-4 py-4 whitespace-nowrap">{dept.name}</td>
                                <td className="px-4 py-4 whitespace-nowrap">{dept.address}</td>
                                <td className="px-4 py-4 whitespace-nowrap space-x-2">
                                  <button
                                    onClick={() => setEditingDepartment(dept)}
                                    className="text-indigo-600 hover:text-indigo-900 text-sm md:text-base"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteItem('department', dept.department_id)}
                                    className="text-red-600 hover:text-red-900 text-sm md:text-base"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Create Department Leader */}
              <motion.div 
                className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-6 md:mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('createLeader')}
                >
                  <h3 className="text-lg md:text-xl font-semibold">Create New Department Leader</h3>
                  <FiChevronDown className={`transition-transform ${expandedSections.createLeader ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {expandedSections.createLeader && (
                    <motion.form 
                      onSubmit={createLeader}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                        <div className="md:col-span-2">
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
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                      >
                        Create Leader
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Leaders List */}
              <motion.div 
                className="bg-white p-4 md:p-6 rounded-xl shadow-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('leaders')}
                >
                  <h3 className="text-lg md:text-xl font-semibold">All Department Leaders ({leaders.length})</h3>
                  <FiChevronDown className={`transition-transform ${expandedSections.leaders ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {expandedSections.leaders && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {leaders.map((leader) => {
                              const department = departments.find(d => d.department_id === leader.department_id);
                              return (
                                <motion.tr
                                  key={leader.leader_id}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <td className="px-4 py-4 whitespace-nowrap">{leader.fullname || leader.username}</td>
                                  <td className="px-4 py-4 whitespace-nowrap">{leader.email}</td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    {department ? department.name : 'Department not found'}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap space-x-2">
                                    <button
                                      onClick={() => {
                                        const newPassword = prompt('Enter new password:');
                                        if (newPassword) editPassword('leader', leader.leader_id, newPassword);
                                      }}
                                      className="text-indigo-600 hover:text-indigo-900 text-sm md:text-base"
                                    >
                                      Change Password
                                    </button>
                                    <button
                                      onClick={() => deleteItem('leader', leader.leader_id)}
                                      className="text-red-600 hover:text-red-900 text-sm md:text-base"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </motion.tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Requests Management</h2>
              </div>

              {/* Create Request Type */}
              <motion.div 
                className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-6 md:mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('createRequestType')}
                >
                  <h3 className="text-lg md:text-xl font-semibold">Create New Request Type</h3>
                  <FiChevronDown className={`transition-transform ${expandedSections.createRequestType ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {expandedSections.createRequestType && (
                    <motion.form 
                      onSubmit={createRequestType}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-4 mt-4">
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
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                      >
                        Create Request Type
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Request Types List */}
              <motion.div 
                className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-6 md:mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('requestTypes')}
                >
                  <h3 className="text-lg md:text-xl font-semibold">Request Types ({requestTypes.length})</h3>
                  <FiChevronDown className={`transition-transform ${expandedSections.requestTypes ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {expandedSections.requestTypes && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {requestTypes.map((type) => (
                              <motion.tr
                                key={type.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <td className="px-4 py-4 whitespace-nowrap">{type.name}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <button
                                    onClick={() => deleteItem('requestType', type.id)}
                                    className="text-red-600 hover:text-red-900 text-sm md:text-base"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Requests List */}
              <motion.div 
                className="bg-white p-4 md:p-6 rounded-xl shadow-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('requests')}
                >
                  <h3 className="text-lg md:text-xl font-semibold">All Requests ({requests.length})</h3>
                  <FiChevronDown className={`transition-transform ${expandedSections.requests ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {expandedSections.requests && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Type</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {requests.map((request) => {
                              const requestType = requestTypes.find(rt => rt.id === request.request_type_id);
                              const department = departments.find(d => d.department_id === request.department_id);
                              return (
                                <motion.tr
                                  key={request.request_id}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <td className="px-4 py-4 whitespace-nowrap">{request.title}</td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    {requestType ? requestType.name : 'Unknown'}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    {department ? department.name : 'Unknown'}
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="max-w-xs truncate" title={request.description}>
                                      {request.description}
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                      request.status === 'Accepted' ? 'bg-blue-100 text-blue-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {request.status || 'Pending'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <select
                                      value={request.status || 'Pending'}
                                      onChange={(e) => updateRequestStatus(request.request_id, e.target.value)}
                                      className="p-1 border border-gray-300 rounded-md text-sm"
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Accepted">Accepted</option>
                                      <option value="Finished">Finished</option>
                                    </select>
                                  </td>
                                </motion.tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

          {/* Reservations Tab */}
          {activeTab === 'reservations' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Hall Reservations</h2>
              </div>

              <motion.div 
                className="bg-white p-4 md:p-6 rounded-xl shadow-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('reservations')}
                >
                  <h3 className="text-lg md:text-xl font-semibold">All Reservations ({reservations.length})</h3>
                  <FiChevronDown className={`transition-transform ${expandedSections.reservations ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {expandedSections.reservations && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {reservations.map((reservation) => {
                              const department = departments.find(d => d.department_id === reservation.department_id);
                              return (
                                <motion.tr
                                  key={reservation.reservation_id}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <td className="px-4 py-4 whitespace-nowrap">{reservation.event_name}</td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    {department ? department.name : 'Unknown'}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    {new Date(reservation.start_time).toLocaleString()}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    {new Date(reservation.end_time).toLocaleString()}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      reservation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                      reservation.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {reservation.status}
                                    </span>
                                  </td>
                                </motion.tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MainAdmin;