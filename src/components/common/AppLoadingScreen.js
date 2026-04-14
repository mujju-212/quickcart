import React from 'react';
import './AppLoadingScreen.css';

const AppLoadingScreen = ({
  message = 'Preparing your cart experience',
  fullScreen = true,
  overlay = false,
}) => {
  return (
    <div className={`app-loading-screen ${fullScreen ? 'fullscreen' : 'inline'} ${overlay ? 'overlay' : ''}`}>
      <div className="app-loading-bg-orb orb-a" />
      <div className="app-loading-bg-orb orb-b" />
      <div className="app-loading-bg-orb orb-c" />

      <div className="app-loading-card" role="status" aria-live="polite" aria-label="Loading">
        <div className="loader-logo-wrap">
          <div className="loader-ring loader-ring-outer" />
          <div className="loader-ring loader-ring-inner" />
          <div className="loader-core">
            <span>QC</span>
          </div>
        </div>

        <h2 className="loader-title">QuickCart</h2>
        <p className="loader-message">{message}</p>

        <div className="loader-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
};

export default AppLoadingScreen;
