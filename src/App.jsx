import { useState } from 'react';
import Lottie from 'lottie-react';
import animationData from '../public/assets/Form.json';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    hasBankSlip: false,
    hasDocuments: false,
    hasCable: false
  });

  // This would be set by admin - for demo purposes, you can toggle it
  const [mode, setMode] = useState('check-in'); // 'check-in' or 'attendance'

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you would send the data to your backend
    console.log('Form submitted:', {
      ...formData,
      mode,
      timestamp: new Date().toISOString()
    });

    // Show success message and proceed to connect to internet
    alert(`${mode === 'check-in' ? 'Check-in' : 'Attendance'} successful! You can now access the internet.`);

    // Reset form
    setFormData({
      name: '',
      hasBankSlip: false,
      hasDocuments: false,
      hasCable: false
    });
  };

  return (
    <>
      <div className="logo-brand">
        <img src="/Logo.png" alt="TapIn" />
      </div>

      <div className="app-container">
        <div className="animation-section">
          <div className="lottie-container">
            <Lottie
              animationData={animationData}
              loop={true}
              autoplay={true}
            />
          </div>
        </div>

        <div className="form-section">
          <div className="form-header">
            <h1>{mode === 'check-in' ? 'Welcome to School' : 'Welcome to Class'}</h1>
            <p>{mode === 'check-in' ? 'Please check in to continue' : 'Register your attendance'}</p>
          </div>

          <form className="check-in-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Only show checkboxes in check-in mode */}
            {mode === 'check-in' && (
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="bankSlip"
                    name="hasBankSlip"
                    checked={formData.hasBankSlip}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="bankSlip">I have my bank slip</label>
                </div>

                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="documents"
                    name="hasDocuments"
                    checked={formData.hasDocuments}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="documents">I have brought the required documents (Lame de papier)</label>
                </div>

                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="cable"
                    name="hasCable"
                    checked={formData.hasCable}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="cable">I have brought my own cable</label>
                </div>
              </div>
            )}

            {/* Show timestamp info in attendance mode */}
            {mode === 'attendance' && (
              <div className="attendance-info">
                <p>Your attendance will be automatically recorded with the current timestamp</p>
              </div>
            )}

            <button type="submit" className="submit-button">
              {mode === 'check-in' ? 'Check In' : 'Register Attendance'}
            </button>
          </form>

          <div className="mode-indicator">
            <p>Mode: {mode === 'check-in' ? 'Check-In' : 'Attendance'}</p>
          </div>

          {/* Admin toggle for demo - remove in production */}
          <div className="admin-toggle">
            <button onClick={() => setMode(mode === 'check-in' ? 'attendance' : 'check-in')}>
              Toggle Mode (Admin)
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
