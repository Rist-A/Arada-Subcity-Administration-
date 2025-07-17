import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEye, FiEyeOff, FiLock, FiMail, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';

// Color Theme
const primaryColor = '#136b5c';
const secondaryColor = '#6d9f9a';
const accentColor = '#18b3ac';
const lightColor = '#f0f9f8';
const darkColor = '#0a2524';

// Enhanced Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const slideInRight = keyframes`
  from { transform: translateX(100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const LoginContainer = styled.div`
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
  position: relative;
  background: ${lightColor};
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FloatingOrbs = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  
  &::before, &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    animation: ${float} 15s ease-in-out infinite;
    opacity: 0.6;
  }
  
  &::before {
    width: 300px;
    height: 300px;
    background: ${primaryColor};
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &::after {
    width: 400px;
    height: 400px;
    background: ${secondaryColor};
    bottom: 10%;
    right: 10%;
    animation-delay: 2.5s;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  background: linear-gradient(135deg, ${primaryColor} 0%, ${darkColor} 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: white;
  position: relative;
  overflow: hidden;
  z-index: 1;
  animation: ${gradientFlow} 10s ease infinite;
  background-size: 200% 200%;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    min-height: 40vh;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const LoginFormContainer = styled.div`
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  animation: ${slideInRight} 0.6s ease-out, ${fadeIn} 0.6s ease-out;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  
  ${props => props.$shake && css`
    animation: ${shake} 0.5s linear, ${fadeIn} 0.6s ease-out;
  `}
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.12);
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Logo = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, ${primaryColor} 0%, ${darkColor} 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  animation: ${pulse} 2s infinite;
  
  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
`;

const Title = styled.h1`
  color: ${darkColor};
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(to right, ${primaryColor}, ${accentColor});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  color: ${secondaryColor};
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  font-weight: 400;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
  animation: ${fadeIn} 0.8s ease-out;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${darkColor};
  font-size: 0.9rem;
  font-weight: 500;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  color: ${secondaryColor};
  font-size: 1.1rem;
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 40px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background-color: #f8fafc;
  color: ${darkColor};
  
  &:focus {
    border-color: ${accentColor};
    box-shadow: 0 0 0 3px rgba(24, 179, 172, 0.2);
    outline: none;
    background-color: white;
  }
  
  &::placeholder {
    color: ${secondaryColor};
    opacity: 0.7;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: ${secondaryColor};
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${accentColor};
    transform: scale(1.1);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(to right, ${primaryColor}, ${accentColor});
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(19, 107, 92, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 20px rgba(19, 107, 92, 0.4);
    background: linear-gradient(to right, #0e5950, #129b8f);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ErrorMessage = styled(MessageContainer)`
  background-color: #fff5f5;
  color: #e53e3e;
  border: 1px solid #fed7d7;
`;

const SuccessMessage = styled(MessageContainer)`
  background-color: #f0fff4;
  color: #38a169;
  border: 1px solid #c6f6d5;
`;

const LockoutMessage = styled(MessageContainer)`
  background-color: #fffaf0;
  color: #dd6b20;
  border: 1px solid #feebc8;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  z-index: 10;
  backdrop-filter: blur(5px);
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(24, 179, 172, 0.2);
  border-top: 4px solid ${accentColor};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin-top: 0.5rem;
`;

const ForgotLink = styled.a`
  color: ${secondaryColor};
  font-size: 0.8rem;
  text-decoration: none;
  transition: color 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    color: ${accentColor};
    text-decoration: underline;
  }
`;

const FeatureTag = styled.div`
  background: rgba(255, 255, 255, 0.15);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  margin: 0.5rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }
`;

const FeatureContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 768px) {
    margin-top: 1.5rem;
  }
`;

const LoginPage = () => {
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
  const navigate = useNavigate();
  const formRef = useRef();

  // Check for existing lockout on component mount
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

  return (
    <LoginContainer>
      <FloatingOrbs />
      
      <LeftPanel>
        <h2 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '1rem', 
          fontWeight: '700',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
          Arada Subcity
        </h2>
        <p style={{ 
          fontSize: '1.2rem', 
          textAlign: 'center', 
          maxWidth: '500px',
          opacity: 0.9,
          lineHeight: '1.6'
        }}>
          Welcome to the official administrative portal for Arada Subcity
        </p>
        <FeatureContainer>
          <FeatureTag>Secure Authentication</FeatureTag>
          <FeatureTag>Role-Based Access</FeatureTag>
          <FeatureTag>Real-Time Updates</FeatureTag>
          <FeatureTag>Modern Interface</FeatureTag>
        </FeatureContainer>
      </LeftPanel>
      
      <RightPanel>
        <LoginFormContainer ref={formRef} $shake={shake}>
          {loading && (
            <LoadingOverlay>
              <LoadingSpinner />
            </LoadingOverlay>
          )}
          
          <FormHeader>
            <Logo>AS</Logo>
            <Title>Administrative Portal</Title>
            <Subtitle>Enter your credentials to access the system</Subtitle>
          </FormHeader>
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <InputLabel>Email Address</InputLabel>
              <InputContainer>
                <InputIcon><FiMail /></InputIcon>
                <InputField
                  type="email"
                  placeholder="official@arada.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLocked || loading}
                />
              </InputContainer>
            </FormGroup>
            
            <FormGroup>
              <InputLabel>Password</InputLabel>
              <InputContainer>
                <InputIcon><FiLock /></InputIcon>
                <InputField
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLocked || loading}
                />
                <PasswordToggle 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLocked || loading}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </PasswordToggle>
              </InputContainer>
              <ForgotPassword>
                <ForgotLink href="/forgot-password">
                  Forgot Password?
                </ForgotLink>
              </ForgotPassword>
            </FormGroup>
            
            <SubmitButton 
              type="submit" 
              disabled={isLocked || loading || !email || !password}
            >
              {isLocked ? (
                <>
                  <FiClock /> Account Locked ({lockoutTime}m)
                </>
              ) : (
                'Login'
              )}
            </SubmitButton>
            
            {error && (
              <ErrorMessage>
                <FiAlertCircle /> {error}
              </ErrorMessage>
            )}
            
            {success && (
              <SuccessMessage>
                <FiCheckCircle /> {success}
              </SuccessMessage>
            )}
            
            {isLocked && (
              <LockoutMessage>
                <FiClock /> For security, your account is temporarily locked after multiple failed attempts.
              </LockoutMessage>
            )}
          </form>
        </LoginFormContainer>
      </RightPanel>
    </LoginContainer>
  );
};

export default LoginPage;