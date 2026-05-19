import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RequestAccess() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!fullName || !email || !reason) {
      alert('Vă rugăm să completați toate câmpurile.');
      return;
    }

    try {
      const res = await fetch('https://chatmedical-api.jollystone-9c72cad8.swedencentral.azurecontainerapps.io/api/access-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, reason })
      });
      
      if (res.ok) {
        alert('Solicitarea a fost trimisă cu succes!');
        navigate('/');
      } else {
        alert('Trimiterea solicitării a eșuat.');
      }
    } catch (e) {
      alert('Nu s-a putut realiza conexiunea cu serverul API.');
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
          <h1 className="medical-title">Solicitare Cont</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Creare Cont Personal</p>
        </div>

        <p className="medical-subtitle">Completați detaliile de mai jos pentru a solicita acces securizat în sistemul medical.</p>

        <div className="medical-input-group">
          <label>Nume Complet</label>
          <div className="medical-input-wrapper">
            <input 
              type="text" 
              placeholder="Ex: Dr. Popescu Andrei" 
              value={fullName}
              onChange={e => setFullName(e.target.value)} 
            />
            <span className="medical-input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
          </div>
        </div>

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
          <label>Motivul accesului / Specialitate sau CNP</label>
          <div className="medical-input-wrapper">
            <input 
              type="text" 
              placeholder="Ex: Medic Cardiolog / Pacient - Diagnosticare" 
              value={reason}
              onChange={e => setReason(e.target.value)} 
            />
            <span className="medical-input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </span>
          </div>
        </div>

        <button className="medical-button" onClick={handleSubmit} style={{ marginTop: '12px' }}>
          <span>Trimite Solicitarea</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        </button>
        
        <div className="medical-link-container">
          <a href="#" className="medical-link" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            <span>Înapoi la Conectare</span>
          </a>
        </div>
      </div>
    </div>
  );
}
