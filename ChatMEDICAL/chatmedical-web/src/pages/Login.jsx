import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/dashboard');
      } else {
        alert('Login failed. Please enter a valid email.');
      }
    } catch (e) {
      alert('Could not connect to API. Is the backend running?');
    }
  };

  return (
    <div className="medical-container">
      {/* Decorative blurred background circles */}
      <div className="bg-blur-container">
        <div className="bg-blur-circle bg-blur-circle-1"></div>
        <div className="bg-blur-circle bg-blur-circle-2"></div>
      </div>

      <div className="medical-card animate-fade-in">
        <div className="medical-logo-wrapper">
          <div className="medical-logo-circle">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
              <path d="M12 21C12 21 3 16 3 9C3 5.5 5.5 3 9 3C11 3 12 4 12 4C12 4 13 3 15 3C18.5 3 21 5.5 21 9C21 16 12 21 12 21Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 9H9L10.5 12.5L12.5 6L14 9H17.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="medical-title">ChatMEDICAL</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Portal Securizat</p>
        </div>

        <p className="medical-subtitle">Bun venit! Introduceți datele de conectare pentru a accesa platforma medicală.</p>

        <div className="medical-input-group">
          <label>Adresă de Email</label>
          <div className="medical-input-wrapper">
            <input 
              type="email" 
              placeholder="nume@spital.ro" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
            <span className="medical-input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </span>
          </div>
        </div>

        <div className="medical-input-group">
          <label>Parolă</label>
          <div className="medical-input-wrapper">
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
            <span className="medical-input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
          </div>
        </div>

        <button className="medical-button" onClick={handleLogin} style={{ marginTop: '12px' }}>
          <span>Conectare</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" x2="3" y1="12" y2="12"/>
          </svg>
        </button>

        <button 
          className="medical-button-secondary" 
          style={{ marginTop: '16px' }}
          onClick={() => navigate('/request-access')}
        >
          <span>Solicită Cont Nou</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" x2="19" y1="8" y2="14"/>
            <line x1="22" x2="16" y1="11" y2="11"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
