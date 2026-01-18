import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import animationData from '../public/assets/Form.json';
import { portalService } from './services/portal.service';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    hasBankSlip: false,
    hasDocuments: false,
    hasCable: false
  });

  const [mode, setMode] = useState('check-in');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sync portal mode on mount
  useEffect(() => {
    const fetchMode = async () => {
      try {
        const response = await portalService.getPortalMode();
        if (response.success && response.mode) {
          setMode(response.mode);
        }
      } catch (err) {
        console.error('Failed to sync portal mode:', err);
        // Fallback to default or show indicator
      }
    };

    fetchMode();
    // Optional: Set up polling or WebSocket for real-time updates
    const interval = setInterval(fetchMode, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSubmitSuccess(false);

    try {
      const response = await portalService.submitEntry({
        ...formData,
        mode
      });

      if (response.success) {
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          name: '',
          hasBankSlip: false,
          hasDocuments: false,
          hasCable: false
        });

        // Show success message (could be a modal or toast)
        alert(response.message || 'Check-in successful!');
      }
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Processing...' : (mode === 'check-in' ? 'Check In' : 'Register Attendance')}
            </button>
          </form>

          <div className="mode-indicator">
            <p>Status: <span className="status-badge">{mode === 'check-in' ? 'Check-In Active' : 'Attendance Active'}</span></p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
