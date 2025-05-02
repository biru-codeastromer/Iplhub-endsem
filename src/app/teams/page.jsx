"use client";
import { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import styles from "./teams.module.css";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import * as THREE from 'three';
import dynamic from 'next/dynamic';
import Starfield from '../../components/Starfield';


const VantaBackground = dynamic(
    () => import('../../components/VantaBackground'),
    { ssr: false }
  );

// Team data
const teams = [
  {
    id: 'csk',
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    logo: '/csk3d.jpg',
    captain: 'MS Dhoni',
    coach: 'Stephen Fleming',
    homeGround: 'M. A. Chidambaram Stadium',
    founded: 2008,
    trophies: 5,
    primaryColor: '#FFFF00',
    secondaryColor: '#0080FF',
    description: 'The most consistent team in IPL history with a massive fan following known as "Yellow Brigade".',
    achievements: [
      'Winners: 2010, 2011, 2018, 2021, 2023',
      'Runners-up: 2008, 2012, 2013, 2015, 2019',
      'Most playoff appearances (12)'
    ]
  },
  {
    id: 'mi',
    name: 'Mumbai Indians',
    shortName: 'MI',
    logo: '/mi3d.jpg',
    captain: 'Hardik Pandya',
    coach: 'Mark Boucher',
    homeGround: 'Wankhede Stadium',
    founded: 2008,
    trophies: 5,
    primaryColor: '#004BA0',
    secondaryColor: '#D1AB3E',
    description: 'The most successful IPL team with a strong core of Indian and international stars.',
    achievements: [
      'Winners: 2013, 2015, 2017, 2019, 2020',
      'Runners-up: 2010',
      'First team to win 5 titles'
    ]
  },
  {
    id: 'kkr',
    name: 'Kolkata Knight Riders',
    shortName: 'KKR',
    logo: '/kkr3d.jpg',
    captain: 'Shreyas Iyer',
    coach: 'Chandrakant Pandit',
    homeGround: 'Eden Gardens',
    founded: 2008,
    trophies: 2,
    primaryColor: '#2E0854',
    secondaryColor: '#F5B412',
    description: 'Known for their aggressive brand of cricket and celebrity ownership.',
    achievements: [
      'Winners: 2012, 2014',
      'Runners-up: 2021',
      'First team to win twice in three years'
    ]
  },
  {
    id: 'rcb',
    name: 'Royal Challengers Bangalore',
    shortName: 'RCB',
    logo: '/rcb3d.jpg',
    captain: 'Faf du Plessis',
    coach: 'Andy Flower',
    homeGround: 'M. Chinnaswamy Stadium',
    founded: 2008,
    trophies: 0,
    primaryColor: '#FF0000',
    secondaryColor: '#000000',
    description: 'The perennial underachievers with the most passionate fan base in the IPL.',
    achievements: [
      'Runners-up: 2009, 2011, 2016',
      'Holds record for highest (263) and lowest (49) team totals',
      'Virat Kohli holds record for most runs in a season (973 in 2016)'
    ]
  },
  {
    id: 'dc',
    name: 'Delhi Capitals',
    shortName: 'DC',
    logo: '/dc3d.jpg',
    captain: 'Rishabh Pant',
    coach: 'Ricky Ponting',
    homeGround: 'Arun Jaitley Stadium',
    founded: 2008,
    trophies: 0,
    primaryColor: '#004C93',
    secondaryColor: '#000000',
    description: 'Young and dynamic team that has emerged as strong contenders in recent years.',
    achievements: [
      'Runners-up: 2020',
      'Playoffs: 2019, 2021',
      'First final appearance in 2020 after 12 seasons'
    ]
  },
  {
    id: 'pbks',
    name: 'Punjab Kings',
    shortName: 'PBKS',
    logo: '/pbks3d.jpg',
    captain: 'Shikhar Dhawan',
    coach: 'Trevor Bayliss',
    homeGround: 'PCA Stadium, Mohali',
    founded: 2008,
    trophies: 0,
    primaryColor: '#AA4545',
    secondaryColor: '#FFD700',
    description: 'The underdogs with flashes of brilliance but lacking consistency.',
    achievements: [
      'Runners-up: 2014',
      'Playoffs: 2008',
      'Reached semifinals in inaugural season'
    ]
  },
  {
    id: 'rr',
    name: 'Rajasthan Royals',
    shortName: 'RR',
    logo: '/rr3d.jpg',
    captain: 'Sanju Samson',
    coach: 'Kumar Sangakkara',
    homeGround: 'Sawai Mansingh Stadium',
    founded: 2008,
    trophies: 1,
    primaryColor: '#FFC0CB',
    secondaryColor: '#00008B',
    description: 'The inaugural champions known for discovering young talent.',
    achievements: [
      'Winners: 2008',
      'Runners-up: 2022',
      'First IPL champions'
    ]
  },
  {
    id: 'srh',
    name: 'Sunrisers Hyderabad',
    shortName: 'SRH',
    logo: '/srh3d.jpg',
    captain: 'Aiden Markram',
    coach: 'Brian Lara',
    homeGround: 'Rajiv Gandhi International Stadium',
    founded: 2013,
    trophies: 1,
    primaryColor: '#FF822A',
    secondaryColor: '#000000',
    description: 'Defensive bowling unit that punches above its weight consistently.',
    achievements: [
      'Winners: 2016',
      'Runners-up: 2018',
      'Consistent playoff appearances'
    ]
  },
  {
    id: 'gt',
    name: 'Gujarat Titans',
    shortName: 'GT',
    logo: '/csk3d.jpg',
    captain: 'Hardik Pandya',
    coach: 'Ashish Nehra',
    homeGround: 'Narendra Modi Stadium',
    founded: 2022,
    trophies: 1,
    primaryColor: '#0D223F',
    secondaryColor: '#F46D25',
    description: 'The newest franchise that won the title in their debut season.',
    achievements: [
      'Winners: 2022',
      'Runners-up: 2023',
      'Champions in debut season'
    ]
  },
  {
    id: 'lsg',
    name: 'Lucknow Super Giants',
    shortName: 'LSG',
    logo: '/mi3d.jpg',
    captain: 'KL Rahul',
    coach: 'Andy Flower',
    homeGround: 'BRSABV Ekana Cricket Stadium',
    founded: 2022,
    trophies: 0,
    primaryColor: '#00A6FF',
    secondaryColor: '#FFED00',
    description: 'Promising new team with strong batting lineup.',
    achievements: [
      'Playoffs: 2022, 2023',
      'Strong debut seasons'
    ]
  }
];

// 3D Logo Component
const TeamLogo3D = ({ logo, size = 'medium' }) => {
    const sizeClasses = {
      small: styles.logoSmall,
      medium: styles.logoMedium,
      large: styles.logoLarge
    };
  
    return (
      <div className={`${styles.logo3D} ${sizeClasses[size]}`}>
        <Image 
          src={logo} 
          alt="Team Logo" 
          className={styles.logoImage}
          width={size === 'small' ? 60 : size === 'medium' ? 100 : 150}
          height={size === 'small' ? 60 : size === 'medium' ? 100 : 150}
        />
      </div>
    );
  };
  
  export default function TeamsPage() {
    const [activeTeam, setActiveTeam] = useState(teams[0]);
    const sliderRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const vantaRef = useRef(null);
  
    // Handle slider navigation
    const scrollSlider = (direction) => {
      const container = sliderRef.current;
      const scrollAmount = 300;
      
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
      
      setScrollPosition(container.scrollLeft);
    };
  
    // Update active team based on scroll position
    const handleScroll = () => {
      if (!sliderRef.current) return;
      
      const scrollPos = sliderRef.current.scrollLeft;
      setScrollPosition(scrollPos);
      
      const teamElements = document.querySelectorAll(`.${styles.teamCard}`);
      let mostVisibleIndex = 0;
      let maxVisibility = 0;
      
      teamElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const visibility = Math.min(rect.width, window.innerWidth - rect.left, rect.right);
        
        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisibleIndex = index;
        }
      });
      
      setActiveTeam(teams[mostVisibleIndex]);
    };
  
    // Check if slider can scroll left/right
    const canScrollLeft = scrollPosition > 0;
    const canScrollRight = sliderRef.current && 
      scrollPosition < (sliderRef.current.scrollWidth - sliderRef.current.clientWidth);
  
    return (
        <div className={styles.container}>
        {/* Vanta.js Background */}
        <VantaBackground />
        <Starfield />
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
            <a href="./teams" className={`${styles.navLink} ${styles.activeLink}`}>Teams</a>
            <a href="./players" className={styles.navLink}>Players</a>
            <a href="./stats" className={styles.navLink}>Stats</a>
          </div>
          <a href="./connect">
          <button className={`${styles.connectButton} ${styles.glowHover}`}>Connect</button>
          </a>
        </nav>
  
        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Teams Slider Section */}
          <section className={styles.teamsSliderSection}>
            <h1 className={styles.sectionTitle}>
              <span className={styles.gradientText}>IPL 2025</span> Teams
            </h1>
            
            <div className={styles.sliderContainer}>
              <button 
                className={`${styles.sliderButton} ${styles.leftButton} ${!canScrollLeft ? styles.disabled : ''}`}
                onClick={() => scrollSlider('left')}
                disabled={!canScrollLeft}
              >
                <FiChevronLeft />
              </button>
              
              <div 
                className={styles.teamsSlider} 
                ref={sliderRef}
                onScroll={handleScroll}
              >
                {teams.map((team) => (
                  <div 
                    key={team.id}
                    className={`${styles.teamCard} ${activeTeam.id === team.id ? styles.active : ''}`}
                    onClick={() => setActiveTeam(team)}
                    style={{
                      borderColor: activeTeam.id === team.id ? team.primaryColor : 'transparent',
                      boxShadow: activeTeam.id === team.id ? `0 0 20px ${team.primaryColor}80` : 'none'
                    }}
                  >
                    <div className={styles.teamLogoContainer}>
                      <TeamLogo3D logo={team.logo} />
                    </div>
                    <h3 className={styles.teamName}>{team.shortName}</h3>
                  </div>
                ))}
              </div>
              
              <button 
                className={`${styles.sliderButton} ${styles.rightButton} ${!canScrollRight ? styles.disabled : ''}`}
                onClick={() => scrollSlider('right')}
                disabled={!canScrollRight}
              >
                <FiChevronRight />
              </button>
            </div>
          </section>
  
          {/* Active Team Details Section */}
          <section 
            className={styles.teamDetails}
            style={{
              background: `linear-gradient(135deg, ${activeTeam.primaryColor}20, ${activeTeam.secondaryColor}20)`,
              borderColor: activeTeam.primaryColor
            }}
          >
            <div className={styles.teamHeader}>
              <div className={styles.teamLogoLarge}>
                <TeamLogo3D logo={activeTeam.logo} size="large" />
              </div>
              <div className={styles.teamInfo}>
                <h2 className={styles.teamFullName}>{activeTeam.name}</h2>
                <div className={styles.teamMeta}>
                  <span>Captain: <strong>{activeTeam.captain}</strong></span>
                  <span>Coach: <strong>{activeTeam.coach}</strong></span>
                  <span>Home: <strong>{activeTeam.homeGround}</strong></span>
                </div>
                <div className={styles.trophyCount}>
                  <span className={styles.trophyIcon}>🏆</span>
                  <span>{activeTeam.trophies} IPL Title{activeTeam.trophies !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
            
            <div className={styles.teamDescription}>
              <p>{activeTeam.description}</p>
            </div>
            
            <div className={styles.teamAchievements}>
              <h3 className={styles.subSectionTitle}>Key Achievements</h3>
              <ul className={styles.achievementsList}>
                {activeTeam.achievements.map((achievement, index) => (
                  <li key={index} className={styles.achievementItem}>
                    <span className={styles.bulletPoint} style={{ backgroundColor: activeTeam.primaryColor }}></span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={styles.teamStats}>
              <h3 className={styles.subSectionTitle}>Season Stats</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>2024</div>
                  <div className={styles.statLabel}>Current Position</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{activeTeam.trophies}</div>
                  <div className={styles.statLabel}>Titles Won</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{2024 - activeTeam.founded}</div>
                  <div className={styles.statLabel}>Seasons Played</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>-</div>
                  <div className={styles.statLabel}>Win Percentage</div>
                </div>
              </div>
            </div>
            
            <div className={styles.teamSquad}>
              <h3 className={styles.subSectionTitle}>Featured Players</h3>
              <div className={styles.playersGrid}>
                <div className={styles.playerCard}>
                  <div className={styles.playerImage} style={{ backgroundColor: activeTeam.primaryColor }}></div>
                  <div className={styles.playerName}>Captain</div>
                  <div className={styles.playerRole}>Batsman</div>
                </div>
                <div className={styles.playerCard}>
                  <div className={styles.playerImage} style={{ backgroundColor: activeTeam.primaryColor }}></div>
                  <div className={styles.playerName}>Star Batsman</div>
                  <div className={styles.playerRole}>Batsman</div>
                </div>
                <div className={styles.playerCard}>
                  <div className={styles.playerImage} style={{ backgroundColor: activeTeam.primaryColor }}></div>
                  <div className={styles.playerName}>Lead Bowler</div>
                  <div className={styles.playerRole}>Bowler</div>
                </div>
                <div className={styles.playerCard}>
                  <div className={styles.playerImage} style={{ backgroundColor: activeTeam.primaryColor }}></div>
                  <div className={styles.playerName}>All-Rounder</div>
                  <div className={styles.playerRole}>All-Rounder</div>
                </div>
              </div>
            </div>
          </section>
  
          {/* All Teams Section */}
          <section className={styles.allTeamsSection}>
            <h2 className={styles.sectionTitle}>All <span className={styles.gradientText}>Teams</span></h2>
            
            <div className={styles.allTeamsGrid}>
              {teams.map((team) => (
                <div 
                  key={team.id} 
                  className={styles.teamGridCard}
                  style={{
                    background: `linear-gradient(135deg, ${team.primaryColor}20, ${team.secondaryColor}20)`,
                    borderTop: `4px solid ${team.primaryColor}`
                  }}
                  onClick={() => {
                    setActiveTeam(team);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className={styles.teamGridLogo}>
                    <TeamLogo3D logo={team.logo} size="small" />
                  </div>
                  <h3 className={styles.teamGridName}>{team.name}</h3>
                  <div className={styles.teamGridMeta}>
                    <span>🏆 {team.trophies} Title{team.trophies !== 1 ? 's' : ''}</span>
                    <span>👤 {team.captain}</span>
                  </div>
                  <button className={styles.viewTeamButton}>
                    View Team <FiArrowRight />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }
