'use client';

import { useState, useEffect } from 'react';
import styles from "../page.module.css";
import Image from "next/image";

export default function Connect() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    wantsToConnect: null,
    name: '',
    email: '',
    message: ''
  });

  const questions = [
    {
      text: "Do you want to connect with me?",
      type: 'yesno',
      field: 'wantsToConnect'
    },
    {
      text: "Great! What's your name?",
      type: 'text',
      field: 'name',
      showIf: formData.wantsToConnect === 'yes'
    },
    {
      text: "What's your email address?",
      type: 'email',
      field: 'email',
      showIf: formData.name
    },
    {
      text: "What would you like to tell me?",
      type: 'textarea',
      field: 'message',
      showIf: formData.email
    },
    {
      text: "Thanks! I'll be in touch soon.",
      type: 'completion',
      showIf: formData.message
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    }
  };

  const currentQuestion = questions[currentStep];

  useEffect(() => {
    if (currentQuestion?.showIf === false && currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    }
  }, [formData, currentStep]);

  return (
    <div className="connect-container">
      {/* Background elements from your homepage theme */}
      <div className="glowBackground">
        <div className="glowPurple"></div>
        <div className="glowBlue"></div>
      </div>

      <div className="content-wrapper" style={{ pointerEvents: 'none' }}>
        <nav className={styles.navbar}>
          <a href="/">
            <div className={styles.logo}>
              <Image
                src="/IPL.jpeg"
                alt="IPLHub Logo"
                width={20}
                height={20}
                className={styles.logoImage}
              />
              <span className={styles.logoText}>IPLHub</span>
            </div>
          </a>
          <div 
            className={styles.navLinksConnect}           
            style={{ 
              pointerEvents: 'auto', 
              display: 'flex',
              gap: '32px',
            }}
          >
            <a href="./matches" className={styles.navLink}>Matches</a>
            <a href="./teams" className={styles.navLink}>Teams</a>
            <a href="./players" className={styles.navLink}>Players</a>
            <a href="./stats" className={styles.navLink}>Stats</a>
          </div>
          <button 
            className={`${styles.connectButton} ${styles.glowHover}`} 
            style={{ pointerEvents: 'auto' }}
          >
            Connect
          </button>
        </nav>

        {currentQuestion?.showIf !== false && (
          <div className="question-box visible">
            <h2>{currentQuestion.text}</h2>

            {currentQuestion.type === 'yesno' && (
              <div className="button-group" style={{ pointerEvents: 'auto' }}>
                <button
                  onClick={() => handleInputChange(currentQuestion.field, 'yes')}
                  className="yes-button"
                >
                  YES
                </button>
                <button
                  onClick={() => handleInputChange(currentQuestion.field, 'no')}
                  className="no-button"
                >
                  NO
                </button>
              </div>
            )}

            {currentQuestion.type === 'text' && (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && formData.name && handleInputChange(currentQuestion.field, formData.name)}
                placeholder="Type your answer here..."
                className="question-input"
                style={{ pointerEvents: 'auto' }}
              />
            )}

            {currentQuestion.type === 'email' && (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && formData.email && handleInputChange(currentQuestion.field, formData.email)}
                placeholder="Type your email here..."
                className="question-input"
                style={{ pointerEvents: 'auto' }}
              />
            )}

            {currentQuestion.type === 'textarea' && (
              <>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows="4"
                  placeholder="Type your message here..."
                  className="question-textarea"
                  style={{ pointerEvents: 'auto' }}
                />
                <button
                  onClick={() => formData.message && handleInputChange(currentQuestion.field, formData.message)}
                  className="submit-button"
                  style={{ pointerEvents: 'auto' }}
                >
                  SEND MESSAGE
                </button>
              </>
            )}

            {currentQuestion.type === 'completion' && (
              <div className="completion-message">
                <p>Thank you, {formData.name}! Your message has been received.</p>
                <button
                  onClick={() => {
                    setCurrentStep(0);
                    setFormData({
                      wantsToConnect: null,
                      name: '',
                      email: '',
                      message: ''
                    });
                  }}
                  className="restart-button"
                  style={{ pointerEvents: 'auto' }}
                >
                  START OVER
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className={styles.footer} style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 20,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)'
      }}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <Image
              src="/IPL.jpeg"
              alt="IPLHub Logo"
              width={20}
              height={20}
              className={styles.logoImage}
            />
            <span className={styles.logoText}>IPLHub</span>
          </div>
          <div className={styles.footerCopyright}>
            © {new Date().getFullYear()} IPLHub. All rights reserved.
          </div>
        </div>
      </footer>

      <style jsx>{`
        .connect-container {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        /* Background styles from your homepage */
        .glowBackground {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          opacity: 0.2;
          z-index: 0;
        }
        
        .glowPurple {
          position: absolute;
          top: 80px;
          left: 40px;
          width: 320px;
          height: 320px;
          background-color: var(--primary);
          border-radius: 50%;
          filter: blur(100px);
        }
        
        .glowBlue {
          position: absolute;
          bottom: 40px;
          right: 40px;
          width: 384px;
          height: 384px;
          background-color: var(--secondary);
          border-radius: 50%;
          filter: blur(120px);
        }
        
        .content-wrapper {
          position: relative;
          z-index: 10;
          flex: 1;
          display: flex;
          flex-direction: column;
          padding-bottom: 80px;
        }
        
        .question-box {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.7);
          padding: 2rem;
          border-radius: 15px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 15;
          opacity: 1; /* Changed from 0 to 1 since we removed the loading state */
        }
        
        .question-box h2 {
          color: #fff;
          margin-bottom: 1.5rem;
          text-align: center;
          font-size: 1.5rem;
        }
        
        .button-group {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        
        .yes-button, .no-button, .submit-button, .restart-button {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: none;
          color: #fff;
          cursor: pointer;
          font-size: 1rem;
          font-weight: bold;
          transition: all 0.3s;
        }
        
        .yes-button {
          background: #4CAF50;
        }
        
        .no-button {
          background: #F44336;
        }
        
        .submit-button {
          background: #007BFF;
          width: 100%;
        }
        
        .restart-button {
          background: #9C27B0;
        }
        
        .question-input, .question-textarea {
          padding: 0.75rem;
          border-radius: 8px;
          border: none;
          outline: none;
          color: white;
          background: rgba(255, 255, 255, 0.2);
          width: 100%;
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        
        .question-textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .completion-message {
          text-align: center;
        }
        
        .completion-message p {
          color: #fff;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}