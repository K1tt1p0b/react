import './App.css';
import Login from './components/Signin';
import React from 'react';
import Home from './components/Home'; 
import Register from './components/Signup';

import LoginAdmin from './componentsAdmin/LoginAdmin';
import Management from './componentsAdmin/EmployeeManagement'
import AdminDashboard from './componentsAdmin/AdminDashboard';
import Customer from './componentsAdmin/CustomerManagement';

import Index from './customer/Index';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginAdmin />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/loginadmin" element={<LoginAdmin />} />
          <Route path="/Management" element={<Management />} />
          <Route path="/customer" element={<Customer />} />

          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/home' element={<Home />} />     
          <Route path='/index' element={<Index />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
