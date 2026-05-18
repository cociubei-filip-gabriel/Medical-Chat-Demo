import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [activeTab, setActiveTab] = useState('Acasă');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));

    fetch('http://localhost:5000/api/specialties')
      .then(res => res.json())
      .then(data => setSpecialties(data))
      .catch(err => console.error(err));
  }, [navigate]);

  useEffect(() => {
    if (selectedSpecialty) {
      fetch(`http://localhost:5000/api/doctors?specialty=${selectedSpecialty}`)
        .then(res => res.json())
        .then(data => setDoctors(data))
        .catch(err => console.error(err));
    } else {
      setDoctors([]);
    }
  }, [selectedSpecialty]);

  const handleBookAppointment = async () => {
    if (!selectedSpecialty || !selectedDoctor || !appointmentDate) {
      alert('Vă rugăm să selectați specialitatea, medicul și data.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientEmail: user.email,
          doctorName: selectedDoctor,
          specialty: selectedSpecialty,
          date: appointmentDate
        })
      });

      if (res.ok) {
        alert('Programarea a fost realizată cu succes!');
        setSelectedSpecialty('');
        setSelectedDoctor('');
        setAppointmentDate('');
      } else {
        alert('Programarea a eșuat.');
      }
    } catch (e) {
      alert('Nu s-a putut conecta la serverul API.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="placeholder-icon animate-pulse" style={{ margin: '0 auto 16px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        </div>
        <p style={{ fontWeight: 600 }}>Se încarcă profilul medical...</p>
      </div>
    </div>
  );

  const getTabIcon = (tabName) => {
    switch (tabName) {
      case 'Acasă':
        return (
          <svg className="sidebar-item-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        );
      case 'Programări':
        return (
          <svg className="sidebar-item-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
            <line x1="16" x2="16" y1="2" y2="6"/>
            <line x1="8" x2="8" y1="2" y2="6"/>
            <line x1="3" x2="21" y1="10" y2="10"/>
          </svg>
        );
      case 'Fișe Medicale':
        return (
          <svg className="sidebar-item-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" x2="8" y1="13" y2="13"/>
            <line x1="16" x2="8" y1="17" y2="17"/>
          </svg>
        );
      case 'Setări':
        return (
          <svg className="sidebar-item-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getPlaceholderDetails = () => {
    switch (activeTab) {
      case 'Programări':
        return {
          title: 'Istoric Programări',
          text: 'Aici veți putea vizualiza calendarul complet al programărilor dumneavoastră viitoare și arhiva celor trecute.'
        };
      case 'Fișe Medicale':
        return {
          title: 'Dosar Medical Securizat',
          text: 'Fisa medicală, fișierul de tratament, rețetele digitale și analizele de laborator vor fi accesibile direct de aici.'
        };
      case 'Setări':
        return {
          title: 'Configurare Cont',
          text: 'Modificați datele personale, parolele de acces și configurați preferințele pentru notificările în timp real.'
        };
      default:
        return { title: 'Meniu în lucru', text: 'Această secțiune este în curs de dezvoltare.' };
    }
  };

  return (
    <div className="dashboard-wrapper">
      
      {/* SIDEBAR */}
      <div className="dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
              <path d="M12 21C12 21 3 16 3 9C3 5.5 5.5 3 9 3C11 3 12 4 12 4C12 4 13 3 15 3C18.5 3 21 5.5 21 9C21 16 12 21 12 21Z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 9H9L10.5 12.5L12.5 6L14 9H17.5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span>ChatMEDICAL</span>
        </div>
        
        <div className="sidebar-menu">
          {['Acasă', 'Programări', 'Fișe Medicale', 'Setări'].map(tab => (
            <div 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`sidebar-item ${activeTab === tab ? 'active' : ''}`}
            >
              {getTabIcon(tab)}
              <span>{tab}</span>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div onClick={handleLogout} className="sidebar-logout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" x2="9" y1="12" y2="12"/>
            </svg>
            <span>Deconectare</span>
          </div>
        </div>
      </div>

      {/* CONTINUTUL PRINCIPAL */}
      <div className="dashboard-content">
        <div className="dashboard-header animate-fade-in">
          <div className="dashboard-header-content">
            <h1>Bine ați venit, {user.displayName}</h1>
            <p>Selectați specialitatea dorită, alegeți medicul specialist și planificați-vă următoarea vizită medicală în doar câteva secunde.</p>
          </div>
        </div>

        {activeTab === 'Acasă' && (
          <div className="dashboard-grid animate-fade-in">
            {/* Card 1: Selectare Specialist */}
            <div className="dashboard-card">
              <h2>
                <svg className="dashboard-card-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                  <path d="M19 8h2"/>
                  <path d="M19 12h2"/>
                </svg>
                <span>Specialist & Medic</span>
              </h2>
              
              <div className="medical-input-group">
                <label>Specialitate Medicală</label>
                <div className="medical-input-wrapper">
                  <select value={selectedSpecialty} onChange={e => setSelectedSpecialty(e.target.value)}>
                    <option value="">Alegeți specialitatea</option>
                    {specialties.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                  <span className="medical-input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                      <circle cx="12" cy="13" r="5"/>
                      <path d="M12 10v3l2 1"/>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="medical-input-group">
                <label>Medic Specialist</label>
                <div className="medical-input-wrapper">
                  <select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} disabled={!selectedSpecialty}>
                    <option value="">Alegeți medicul</option>
                    {doctors.map(doc => (
                      <option key={doc.name} value={doc.name}>{doc.name}</option>
                    ))}
                  </select>
                  <span className="medical-input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Stabilire Dată Programare */}
            <div className="dashboard-card">
              <h2>
                <svg className="dashboard-card-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                  <line x1="16" x2="16" y1="2" y2="6"/>
                  <line x1="8" x2="8" y1="2" y2="6"/>
                  <line x1="3" x2="21" y1="10" y2="10"/>
                  <path d="m9 16 2 2 4-4"/>
                </svg>
                <span>Programare Vizită</span>
              </h2>
              
              <div className="medical-input-group" style={{ marginBottom: '28px' }}>
                <label>Data Programării</label>
                <div className="medical-input-wrapper">
                  <input 
                    type="date" 
                    value={appointmentDate}
                    onChange={e => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <span className="medical-input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                      <line x1="16" x2="16" y1="2" y2="6"/>
                      <line x1="8" x2="8" y1="2" y2="6"/>
                      <line x1="3" x2="21" y1="10" y2="10"/>
                    </svg>
                  </span>
                </div>
              </div>
              
              <button className="medical-button" onClick={handleBookAppointment}>
                <span>Solicită Programare</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </button>
            </div>

            {/* Card 3: Status Chat Medical */}
            <div className="dashboard-card dashboard-card-accent">
              <h2>
                <svg className="dashboard-card-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>Chat Direct cu Medicul</span>
              </h2>
              
              <p>După ce programarea dumneavoastră este procesată și confirmată de clinică, un canal privat de chat securizat cu medicul dumneavoastră va deveni activ instant.</p>
              
              <div className="chat-status-container">
                <span className="chat-status-dot"></span>
                <span className="chat-status-text">Pregătit pentru conexiune</span>
              </div>
              
              <button className="medical-button" style={{ marginTop: '24px' }}>
                <span>Deschide Chat Securizat</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  <path d="M8 10h.01"/>
                  <path d="M12 10h.01"/>
                  <path d="M16 10h.01"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {activeTab !== 'Acasă' && (
          <div className="animate-fade-in" style={{ marginTop: '8px' }}>
            <div className="placeholder-view">
              <div className="placeholder-icon">
                {getTabIcon(activeTab)}
              </div>
              <h3>{getPlaceholderDetails().title}</h3>
              <p>{getPlaceholderDetails().text}</p>
              <button className="medical-button-secondary" style={{ width: 'auto', marginTop: '24px' }} onClick={() => setActiveTab('Acasă')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                <span>Înapoi la Ecranul Principal</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
