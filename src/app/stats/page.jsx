"use client";
import { useState, useRef, useEffect } from 'react';
import styles from '../page.module.css';
import { FiBarChart2, FiUsers, FiAward, FiSend, FiMessageSquare } from "react-icons/fi";
import { poiretOne } from '../layout';
import Image from 'next/image';

export default function StatsPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Welcome to IPLHub AI! I can help you analyze IPL stats, predict match outcomes, and provide player insights. Ask me anything about IPL!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [statsData, setStatsData] = useState({
    topPlayers: [],
    teamStats: [],
    recentMatches: []
  });

  // Sample stats data
  useEffect(() => {
    setStatsData({
      topPlayers: [
        { name: 'Suryakumar Yadav', team: 'MI', runs: 475 },
        { name: 'Sai Sudharsan', team: 'GT', runs: 456 },
        { name: 'Virat Kohli', team: 'RCB', runs: 443 }
      ],
      teamStats: [
        { team: 'MI', wins: 7, losses: 4, points: 14 },
        { team: 'RCB', wins: 7, losses: 3, points: 14 },
        { team: 'PBKS', wins: 6, losses: 3, points: 12 }
      ],
      recentMatches: [
        { teams: 'RR vs MI', result: 'MI won by 100 runs' },
        { teams: 'CSK vs PBKS', result: 'PBKS won by 4 wkts' },
        { teams: 'KKR vs DC', result: 'KKR won by 14 runs' }
      ]
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
  
    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input })
      });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
  
      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: data.reply || "I couldn't generate a response. Please try again." 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `Error: ${error.message}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.container} ${poiretOne.className}`}>
      {/* Glowing background elements */}
      <div className={styles.glowBackground}>
        <div className={styles.glowPurple}></div>
        <div className={styles.glowBlue}></div>
      </div>

      {/* Navbar */}
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
        <div className={styles.navLinks}>
          <a href="./matches" className={styles.navLink}>Matches</a>
          <a href="./teams" className={styles.navLink}>Teams</a>
          <a href="./players" className={styles.navLink}>Players</a>
          <a href="./stats" className={styles.navLink}>Stats</a>
        </div>
        <a href="./connect">
          <button className={`${styles.connectButton} ${styles.glowHover}`}>Connect</button>
        </a>
      </nav>

      {/* Main Content */}
      <main className={styles.statsMain}>
        <div className={styles.statsHeader}>
          <h1 className={styles.statsTitle}>
            <span className={styles.gradientText}>IPL Statistics Hub</span>
          </h1>
          <p className={styles.statsSubtitle}>
            Advanced analytics, AI-powered insights, and real-time IPL statistics
          </p>
        </div>

        <div className={styles.statsTabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'chat' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <FiMessageSquare /> AI Assistant
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'stats' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <FiBarChart2 /> Quick Stats
          </button>
        </div>

        {activeTab === 'chat' ? (
          <div className={styles.chatContainer}>
            <div className={styles.chatMessages}>
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`${styles.message} ${message.role === 'ai' ? styles.aiMessage : styles.userMessage}`}
                >
                  <div className={styles.messageContent}>
                    {message.content}
                  </div>
                  <div className={styles.messageRole}>
                    {message.role === 'ai' ? 'IPL AI' : 'You'}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className={`${styles.message} ${styles.aiMessage}`}>
                  <div className={styles.messageContent}>
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className={styles.chatInputContainer}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about IPL stats, predictions, or analysis..."
                className={styles.chatInput}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className={`${styles.chatSendButton} ${styles.glowHover}`}
                disabled={isLoading}
              >
                <FiSend />
              </button>
            </form>
          </div>
        ) : (
          <div className={styles.statsGrid}>
            <div className={styles.statSection}>
              <h3 className={styles.statSectionTitle}>
                <FiAward /> Top Players
              </h3>
              <div className={styles.statTable}>
                {statsData.topPlayers.map((player, index) => (
                  <div key={index} className={styles.statRow}>
                    <div className={styles.statCell}>{player.name}</div>
                    <div className={styles.statCell}>{player.team}</div>
                    <div className={styles.statCell}>{player.runs} runs</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.statSection}>
              <h3 className={styles.statSectionTitle}>
                <FiUsers /> Team Standings
              </h3>
              <div className={styles.statTable}>
                {statsData.teamStats.map((team, index) => (
                  <div key={index} className={styles.statRow}>
                    <div className={styles.statCell}>{team.team}</div>
                    <div className={styles.statCell}>{team.wins}-{team.losses}</div>
                    <div className={styles.statCell}>{team.points} pts</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.statSection}>
              <h3 className={styles.statSectionTitle}>
                <FiBarChart2 /> Recent Results
              </h3>
              <div className={styles.statTable}>
                {statsData.recentMatches.map((match, index) => (
                  <div key={index} className={styles.statRow}>
                    <div className={styles.statCell}>{match.teams}</div>
                    <div className={styles.statCell}>{match.result}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
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
    </div>
  );
}