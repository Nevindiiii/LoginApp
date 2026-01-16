import React, { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './LoginForm.css';

const LoginForm = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code) {
      fetch(`http://localhost:5000/auth/github/callback?code=${code}`)
        .then(res => res.json())
        .then(data => {
          const userData = { name: data.name, email: data.email, picture: data.avatar_url };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch(() => setError('GitHub authentication failed'));
    }
  }, []);

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const userData = { name: decoded.name, email: decoded.email, picture: decoded.picture };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    fetch('http://localhost:5000/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credentialResponse.credential })
    }).catch(() => setError('Failed to connect to server'));
  };

  const handleGoogleError = () => {
    setError('Google login failed or was cancelled');
  };

  const handleGitHubLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23li6iJGbrWrK5pvxo&scope=user`;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setError('');
  };

  if (user) {
    return (
      <div className="login-container">
        <div className="user-profile">
          <img src={user.picture} alt="Profile" className="profile-pic" />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
        <button className="github-button" onClick={handleGitHubLogin}>
          <svg height="18" width="18" viewBox="0 0 16 16" style={{marginRight: '8px'}}>
            <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
