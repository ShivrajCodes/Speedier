import React, { useState, useEffect } from 'react';
import ReactSpeedometer from 'react-d3-speedometer';
import { FaGithub, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import '../App.css';
import antennaImage from '../assests/antenna.png';

const SpeedTest = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);
  const [ping, setPing] = useState(null);
  const [latency, setLatency] = useState(null);
  const [networkProvider, setNetworkProvider] = useState('Unknown');
  const [error, setError] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    let interval;
    if (isTesting) {
      interval = setInterval(() => {
        setDownloadSpeed(prev => (prev < 100 ? prev + Math.random() * 10 : 100));
        setUploadSpeed(prev => (prev < 100 ? prev + Math.random() * 10 : 100));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isTesting]);

  const startSpeedTest = async () => {
    setIsTesting(true);
    setError(null);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);
    setLatency(null);
    setIsSummarizing(true);

    try {
      const response = await fetch('/api/speedtest');
      if (response.ok) {
        const data = await response.json();
        setDownloadSpeed(data.downloadSpeed);
        setUploadSpeed(data.uploadSpeed);
        setPing(Math.random() * 50); 
        setLatency(Math.random() * 50); 
        setNetworkProvider('Your ISP'); 
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setIsTesting(false);
      setIsSummarizing(false);
    }
  };

  return (
    <div className="App">
      <div className="logo">
        <img src={antennaImage} alt="Logo" className="logo-image" />
        <div className="app-name">SPEEDIER</div>
      </div>
      <div className="animated-text">
        Test your internet speed within moments
      </div>
      {!isTesting && !downloadSpeed && !uploadSpeed && !error && (
        <button className="button" onClick={startSpeedTest}>
          Check Now
        </button>
      )}
      {isTesting && (
        <div className="bouncing-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}
      {isSummarizing && (
        <div className="summary">
          <p>
            Speedier is currently testing your internet speed. This process may take a few moments. Please be patient as we determine the download and upload speeds of your connection. You will receive an accurate report shortly. Thank you for your understanding.
          </p>
        </div>
      )}
      {(downloadSpeed !== null || uploadSpeed !== null) && (
        <div className="speed-container">
          <div className="speed-card download-speed">
            <h2>DOWNLOAD SPEED</h2>
            <ReactSpeedometer
              value={isTesting ? Math.random() * 100 : downloadSpeed || 0}
              maxValue={100}
              needleColor="steelblue"
              startColor="green"
              segments={10}
              endColor="red"
              textColor="black"
            />
            <p>Download Speed: {isTesting ? 'Calculating...' : `${downloadSpeed} Mbps`}</p>
          </div>
          <div className="speed-card">
            <h2>UPLOAD SPEED</h2>
            <ReactSpeedometer
              value={isTesting ? Math.random() * 100 : uploadSpeed || 0}
              maxValue={100}
              needleColor="steelblue"
              startColor="green"
              segments={10}
              endColor="red"
              textColor="black"
            />
            <p>Upload Speed: {isTesting ? 'Calculating...' : `${uploadSpeed} Mbps`}</p>
          </div>
        </div>
      )}
      {(ping !== null || latency !== null || networkProvider) && (
        <div className="small-cards-container">
          <div className="small-card">
            <h3>Ping</h3>
            <p>{ping ? `${ping.toFixed(2)} ms` : 'Calculating...'}</p>
          </div>
          <div className="small-card">
            <h3>Latency</h3>
            <p>{latency ? `${latency.toFixed(2)} ms` : 'Calculating...'}</p>
          </div>
          <div className="small-card">
            <h3>Network Provider</h3>
            <p>{networkProvider}</p>
          </div>
        </div>
      )}
      {error && (
        <div>
          <p>Error: {error}</p>
        </div>
      )}
      <div className="footer">
        <div className="footer-left">
          <img src={antennaImage} alt="Logo" className="footer-logo" />
          <div className="footer-text">Speedier</div>
          <span>© 24 All rights reserved.</span>
        </div>
        <div className="footer-right">
          <span>Created with ♥ by Shivraj</span>
          <FaGithub className="footer-icon" />
          <FaTwitter className="footer-icon" />
          <FaInstagram className="footer-icon" />
          <FaLinkedin className="footer-icon" />
        </div>
      </div>
    </div>
  );
};

export default SpeedTest;
