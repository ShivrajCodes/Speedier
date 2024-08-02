import React, { useState, useEffect } from 'react';
import ReactSpeedometer from 'react-d3-speedometer';
import { FaGithub, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import '../App.css';
import antennaImage from '../assests/antenna.png';

const SpeedTest = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);
  const [error, setError] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

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
    setTestStarted(true);
    setIsTesting(true);
    setError(null);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setIsSummarizing(true);

    try {
      const response = await fetch('/api/speedtest');
      if (response.ok) {
        const data = await response.json();
        setDownloadSpeed(data.downloadSpeed);
        setUploadSpeed(data.uploadSpeed);
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

  const getSpeedSummary = (speed) => {
    if (speed <= 10) return { class: 'very-slow', text: 'Very Slow: The network speed is extremely sluggish, causing long loading times and frequent buffering. Basic tasks such as browsing and emailing are frustratingly slow, hindering productivity and overall user experience.' };
    if (speed <= 20) return { class: 'slow', text: 'Slow: The network speed is below average, resulting in noticeable delays during online activities. Streaming low-quality videos and simple browsing are possible, but high-bandwidth applications struggle to perform efficiently.' };
    if (speed <= 40) return { class: 'fine', text: 'Fine: The network speed is adequate for everyday use. Basic web browsing, email, and social media activities run smoothly, but high-definition streaming and large file downloads may experience occasional lags.' };
    if (speed <= 60) return { class: 'good', text: 'Good: The network speed is reliable and supports most online activities without significant issues. High-definition video streaming, video conferencing, and moderate downloading are efficient, providing a satisfactory user experience.' };
    if (speed <= 80) return { class: 'great', text: 'Great: The network speed is impressive, ensuring fast and responsive performance for all tasks. Ultra-high-definition streaming, online gaming, and large file transfers occur seamlessly, offering an excellent user experience.' };
    return { class: 'extremely-fast', text: 'Extremely Fast: The network speed is exceptionally high, providing near-instantaneous responses for any online activity. Multiple high-bandwidth applications run simultaneously without any noticeable lag, ensuring an optimal and superior user experience.' };
  };

  const downloadSummary = getSpeedSummary(downloadSpeed);
  const uploadSummary = getSpeedSummary(uploadSpeed);

  return (
    <div className="App">
      <div className="logo">
        <img src={antennaImage} alt="Logo" className="logo-image" />
        <div className="app-name">SPEEDIER</div>
      </div>
      <div className="animated-text">
        Test your internet speed within moments
      </div>
      {!testStarted && !downloadSpeed && !uploadSpeed && !error && (
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
      {downloadSpeed !== null && (
        <div className={`speed-card-summary ${downloadSummary.class}`}>
          <h2>Download Speed Summary</h2>
          <p>{downloadSummary.text}</p>
        </div>
      )}
      {uploadSpeed !== null && (
        <div className={`speed-card-summary ${uploadSummary.class}`}>
          <h2>Upload Speed Summary</h2>
          <p>{uploadSummary.text}</p>
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
          <span>Copyright© 24 All rights reserved.</span>
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
