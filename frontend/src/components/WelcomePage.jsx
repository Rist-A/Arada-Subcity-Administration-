// import React, { useState, useEffect, useRef } from 'react';
// import './WelcomePage.css';
// import logo from '../assets/logo.jpg';
// import next from '../assets/next.gif'
// import { useNavigate } from 'react-router-dom';
// import abstract from '../assets/abstract.png'
// import hero from '../assets/A(3).mp4'


// const WelcomePage = ({ onStart }) => {
//   const [showText, setShowText] = useState(false);
//   const buttonRef = useRef(null);
//    const navigate = useNavigate();

//   const onClick = () => {
//     // Navigate to the new route
//     navigate('/login');
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setShowText(prev => !prev);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleButtonClick = () => {
//     if (buttonRef.current) {
//       buttonRef.current.classList.add('clicked');
//       setTimeout(() => {
//         buttonRef.current.classList.remove('clicked');
//         onStart();
//       }, 800);
//     }
//   };

//   return (
//     <div className="modern-container">
       
//         <nav className="main-navbar">
//         <div className="nav-container">
//           <div className={`brand-transition ${showText ? 'show-text' : ''}`}>
//             <div className="logo-wrapper">
//               <img src={logo} alt="Logo" className="round-logo" />
//             </div>
//             <div className="text-wrapper">
//               <div className="brand-text">Innovation and Technology <br/>Development Bureau</div>
//             </div>
//           </div>
//           <div className="nav-links">
//             <button className="nav-link" onClick={() => navigateTo('/about')}>About Us</button>
//             <button className="nav-link" onClick={() => navigateTo('/help')}>Help</button>
//           </div>
//         </div>
//       </nav>
// {/*   
//        <div className="logo-text-container">
//         <div className={`brand-transition ${showText ? 'show-text' : ''}`}>
//           <div className="logo-wrapper">
//             <img src={logo} alt="Logo" className="round-logo" />
//           </div>
//           <div className="text-wrapper">
//             <div className="brand-text">Innovation and Technology <br/>Development Bureau</div>
//           </div>
//         </div>

//       </div>  */}

    
   

//       {/* Main content with side-by-side layout */}
//       <div className="main-content-wrapper">
       
        
//         <div className="text-button-container">
//           <div className="text-content">
//             <h1 className="main-title">
//              <video autoPlay muted loop className="your-video-class">
//   <source src={hero} type="video/mp4" />
//   Your browser does not support the video tag.
// </video>

             
//             </h1>
//           </div>
//          <div className="clickable-container" onClick={onClick}>
//            <div className="text-container">
//             <span className="clickable-text">Start</span>
//              <div className="gif-container">
//               <img src={next} alt="Next icon" className="clickable-gif" />
//              </div>
//           </div>
//          </div>
//         </div>
        
//       </div>
//      <div>
//        <div className="abstract">
//                <img src={abstract} alt="" />
//          </div>
//      </div>

//       {/* Enhanced Footer */}
//       <footer className="enhanced-footer">
//         <div className="footer-content">
//           <div className="footer-logo">
//             <img src={logo} alt="Logo" className="footer-round-logo" />
//           </div>
//           <div className="footer-text">
//             <h3>Innovation and Technology Development Bureau</h3>
//             <p>Transforming ideas into cutting-edge solutions through advanced technology</p>
//             <div className="footer-links">
//               <a href="#about">About Us</a>
//               <a href="#services">Services</a>
//               <a href="#contact">Contact</a>
//             </div>
//           </div>
//         </div>
//         <div className="footer-bottom">
//           © {new Date().getFullYear()} All Rights Reserved
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default WelcomePage;

import React, { useState, useEffect, useRef } from 'react';
import './WelcomePage.css';
import logo from '../assets/logo.jpg';
import next from '../assets/next.gif';
import { useNavigate } from 'react-router-dom';
import abstract from '../assets/abstract.png';
import hero from '../assets/A(3).mp4';
import { FiEye, FiEyeOff, FiLock, FiMail, FiAlertCircle, FiCheckCircle, FiClock, FiX } from 'react-icons/fi';
import axios from 'axios';

const WelcomePage = () => {
  const [showText, setShowText] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  // Handle login modal toggle
  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const closeLogin = () => {
    setShowLogin(false);
    setEmail('');
    setPassword('');
    setError('');
    setSuccess('');
  };

  // Check for existing lockout
  useEffect(() => {
    const storedLockout = localStorage.getItem('loginLockout');
    if (storedLockout) {
      const { timestamp, attempts } = JSON.parse(storedLockout);
      const now = Date.now();
      const elapsed = (now - timestamp) / (1000 * 60); // minutes

      if (elapsed < 30) {
        setIsLocked(true);
        setLockoutTime(Math.ceil(30 - elapsed));
        startCountdown();
      } else {
        localStorage.removeItem('loginLockout');
      }
    }
  }, []);

  const startCountdown = () => {
    const interval = setInterval(() => {
      setLockoutTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsLocked(false);
          localStorage.removeItem('loginLockout');
          return 0;
        }
        return prev - 1;
      });
    }, 60000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isLocked) {
      setError(`Account temporarily locked. Please try again in ${lockoutTime} minutes.`);
      setLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      const response = await axios.post('/api/login', { 
        email: email.trim(),
        password: password.trim()
      });
      
      setSuccess('Login successful! Redirecting...');
      setFailedAttempts(0);
      
      // Store token and user data
      localStorage.setItem('authToken', response.data.token);
      
      // Decode token to get user role
      const tokenData = JSON.parse(atob(response.data.token.split('.')[1]));
      
      // Redirect based on user role
      setTimeout(() => {
        switch(tokenData.role) {
          case 'mainadmin':
            navigate('/main-admin');
            break;
          case 'subadmin':
            navigate('/sub-admin');
            break;
          case 'department_leader':
            navigate('/department');
            break;
          default:
            navigate('/dashboard');
        }
      }, 1500);
      
    } catch (err) {
      setLoading(false);
      
      if (err.response) {
        switch(err.response.status) {
          case 401:
            const newAttempts = failedAttempts + 1;
            setFailedAttempts(newAttempts);
            
            if (newAttempts >= 5) {
              setIsLocked(true);
              setLockoutTime(30);
              localStorage.setItem('loginLockout', JSON.stringify({
                timestamp: Date.now(),
                attempts: newAttempts
              }));
              startCountdown();
              setError('Too many failed attempts. Account locked for 30 minutes.');
            } else {
              setError(`Invalid credentials. ${5 - newAttempts} attempts remaining.`);
            }
            break;
            
          case 404:
            setError('No account found with this email address.');
            break;
            
          case 403:
            setError('Your account is inactive. Please contact support.');
            break;
            
          default:
            setError('An unexpected error occurred. Please try again later.');
        }
        
        setShake(true);
        setTimeout(() => setShake(false), 500);
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setShowText(prev => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="modern-container">
      {/* Blur overlay when login is shown */}
      {showLogin && (
        <div className="blur-overlay" onClick={closeLogin}></div>
      )}
      
      {/* Floating Login Card */}
      {showLogin && (
        <div className={`login-card ${shake ? 'shake' : ''}`}>
          <button className="close-btn" onClick={closeLogin}>
            <FiX />
          </button>
          
          <div className="login-header">
            <div className="login-logo">
              <img src={logo} alt="Logo" />
            </div>
            <h2>Administrative Portal</h2>
            <p>Enter your credentials to access the system</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-container">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  placeholder="official@arada.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLocked || loading}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="input-container">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLocked || loading}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <div className="forgot-password">
                <a href="/forgot-password">Forgot Password?</a>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="login-btn"
              disabled={isLocked || loading || !email || !password}
            >
              {loading ? (
                <span className="spinner"></span>
              ) : isLocked ? (
                <>
                  <FiClock /> Account Locked ({lockoutTime}m)
                </>
              ) : (
                'Login'
              )}
            </button>
            
            {error && (
              <div className="error-message">
                <FiAlertCircle /> {error}
              </div>
            )}
            
            {success && (
              <div className="success-message">
                <FiCheckCircle /> {success}
              </div>
            )}
          </form>
        </div>
      )}
      
      <nav className="main-navbar">
        <div className="nav-container">
          <div className={`brand-transition ${showText ? 'show-text' : ''}`}>
            <div className="logo-wrapper">
              <img src={logo} alt="Logo" className="round-logo" />
            </div>
            <div className="text-wrapper">
              <div className="brand-text">Innovation and Technology <br/>Development Bureau</div>
            </div>
          </div>
          <div className="nav-links">
            <button className="nav-link" onClick={() => navigate('/about')}>About Us</button>
            <button className="nav-link" onClick={() => navigate('/help')}>Help</button>
          </div>
        </div>
      </nav>

      <div className="main-content-wrapper">
        <div className="text-button-container">
          <div className="text-content">
            <h1 className="main-title">
              <video autoPlay muted loop className="your-video-class">
                <source src={hero} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </h1>
          </div>
          <div className="clickable-container" onClick={handleLoginClick} ref={buttonRef}>
            <div className="text-container">
              <span className="clickable-text">Start</span>
              <div className="gif-container">
                <img src={next} alt="Next icon" className="clickable-gif" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="abstract">
        <img src={abstract} alt="" />
      </div>

      <footer className="enhanced-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={logo} alt="Logo" className="footer-round-logo" />
          </div>
          <div className="footer-text">
            <h3>Innovation and Technology Development Bureau</h3>
            <p>Transforming ideas into cutting-edge solutions through advanced technology</p>
            <div className="footer-links">
              <a href="#about">About Us</a>
              <a href="#services">Services</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} All Rights Reserved
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;