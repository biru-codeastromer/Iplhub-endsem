"use client";
import { useState, useRef, useEffect } from 'react';
import Image from "next/image";
import styles from '../page.module.css';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiBarChart2, FiUsers, FiAward, FiSend, FiMessageSquare } from "react-icons/fi";
import { poiretOne } from '../layout';

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
    coach: 'Mahela Jawardhene',
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
    captain: 'Ajeenkya Rahane',
    coach: 'Chandrakant Pandit',
    homeGround: 'Eden Gardens',
    founded: 2008,
    trophies: 2,
    primaryColor: '#2E0854',
    secondaryColor: '#F5B412',
    description: 'Known for their aggressive brand of cricket and celebrity ownership.',
    achievements: [
      'Winners: 2012, 2014, 2024',
      'Runners-up: 2021',
      'First team to win twice in three years'
    ]
  },
  {
    id: 'rcb',
    name: 'Royal Challengers Bangalore',
    shortName: 'RCB',
    logo: '/rcb3d.jpg',
    captain: 'Rajat Patidar',
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
    captain: 'Axar Patel',
    coach: 'Hemang Badani',
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
    captain: 'Shreyas Iyer',
    coach: 'Ricky Ponting',
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
    coach: 'Rahul Dravid',
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
    captain: 'Pat Cummins',
    coach: 'Daniel Vettori',
    homeGround: 'Rajiv Gandhi International Stadium',
    founded: 2013,
    trophies: 1,
    primaryColor: '#FF822A',
    secondaryColor: '#000000',
    description: 'Defensive bowling unit that punches above its weight consistently.',
    achievements: [
      'Winners: 2016',
      'Runners-up: 2018, 2024',
      'Consistent playoff appearances'
    ]
  },
  {
    id: 'gt',
    name: 'Gujarat Titans',
    shortName: 'GT',
    logo: '/csk3d.jpg',
    captain: 'Shubman Gill',
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
    captain: 'Rishabh Pant',
    coach: 'Justin Langer',
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



export default function TeamsPage() {
  const [activeTeam, setActiveTeam] = useState(teams[0]);
  const sliderRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeTab, setActiveTab] = useState('teams');

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
          <a href="./teams" className={`${styles.navLink} ${styles.activeLink}`}>Teams</a>
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
            <span className={styles.gradientText}>IPL Teams Hub</span>
          </h1>
          <p className={styles.statsSubtitle}>
            Detailed team profiles, player rosters, and performance statistics
          </p>
        </div>

        <div className={styles.statsTabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'teams' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('teams')}
          >
            <FiUsers /> Teams Overview
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'compare' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('compare')}
          >
            <FiBarChart2 /> Compare Teams
          </button>
        </div>

        {activeTab === 'teams' ? (
          <>
            {/* Teams Slider Section */}
            <div className={styles.sliderContainer} style={{ margin: '40px auto', maxWidth: '1200px' }}>
              <button 
                className={`${styles.sliderButton} ${!canScrollLeft ? styles.disabled : ''}`}
                onClick={() => scrollSlider('left')}
                disabled={!canScrollLeft}
                style={{ left: '-25px' }}
              >
                <FiChevronLeft />
              </button>
              
              <div 
                className={styles.teamsSlider} 
                ref={sliderRef}
                onScroll={handleScroll}
                style={{ display: 'flex', gap: '20px', padding: '20px 0', overflowX: 'auto' }}
              >
                {teams.map((team) => (
                  <div 
                    key={team.id}
                    className={styles.teamCard}
                    onClick={() => setActiveTeam(team)}
                    style={{
                      flex: '0 0 180px',
                      height: '220px',
                      border: `3px solid ${activeTeam.id === team.id ? team.primaryColor : 'transparent'}`,
                      boxShadow: activeTeam.id === team.id ? `0 0 20px ${team.primaryColor}80` : 'none'
                    }}
                  >
                    <div className={styles.teamLogoContainer} style={{ width: '100px', height: '100px', marginBottom: '15px' }}>
                      <Image 
                        src={team.logo} 
                        alt="Team Logo" 
                        width={100}
                        height={100}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </div>
                    <h3 className={styles.teamName} style={{ fontSize: '1.5rem', fontWeight: '700', margin: '10px 0 0' }}>
                      {team.shortName}
                    </h3>
                  </div>
                ))}
              </div>
              
              <button 
                className={`${styles.sliderButton} ${!canScrollRight ? styles.disabled : ''}`}
                onClick={() => scrollSlider('right')}
                disabled={!canScrollRight}
                style={{ right: '-25px' }}
              >
                <FiChevronRight />
              </button>
            </div>

            {/* Active Team Details Section */}
            <div 
              className={styles.statSection} 
              style={{
                background: `linear-gradient(135deg, ${activeTeam.primaryColor}20, ${activeTeam.secondaryColor}20)`,
                border: `1px solid ${activeTeam.primaryColor}`,
                borderRadius: '20px',
                padding: '30px',
                margin: '20px auto',
                maxWidth: '1200px'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ width: '150px', height: '150px', marginBottom: '20px' }}>
                  <Image 
                    src={activeTeam.logo} 
                    alt="Team Logo" 
                    width={150}
                    height={150}
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ 
                    fontSize: '2rem', 
                    fontWeight: '700', 
                    marginBottom: '10px',
                    background: `linear-gradient(to right, ${activeTeam.primaryColor}, ${activeTeam.secondaryColor})`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}>
                    {activeTeam.name}
                  </h2>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'center', 
                    gap: '15px', 
                    marginBottom: '15px',
                    fontSize: '0.9rem'
                  }}>
                    <span>Captain: <strong>{activeTeam.captain}</strong></span>
                    <span>Coach: <strong>{activeTeam.coach}</strong></span>
                    <span>Home: <strong>{activeTeam.homeGround}</strong></span>
                  </div>
                  <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '8px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '9999px',
                    fontWeight: '600'
                  }}>
                    <span>🏆</span>
                    <span>{activeTeam.trophies} IPL Title{activeTeam.trophies !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '30px', fontSize: '1.1rem', lineHeight: '1.6' }}>
                <p>{activeTeam.description}</p>
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '600', 
                  marginBottom: '20px',
                  position: 'relative',
                  display: 'inline-block'
                }}>
                  Key Achievements
                  <span style={{
                    content: '',
                    position: 'absolute',
                    bottom: '-8px',
                    left: '0',
                    width: '50px',
                    height: '3px',
                    background: `linear-gradient(to right, ${activeTeam.primaryColor}, ${activeTeam.secondaryColor})`,
                    borderRadius: '3px'
                  }}></span>
                </h3>
                <ul style={{ listStyle: 'none', padding: '0' }}>
                  {activeTeam.achievements.map((achievement, index) => (
                    <li key={index} style={{ 
                      marginBottom: '12px', 
                      paddingLeft: '25px', 
                      position: 'relative',
                      lineHeight: '1.5'
                    }}>
                      <span style={{ 
                        position: 'absolute',
                        left: '0',
                        top: '8px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: activeTeam.primaryColor
                      }}></span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '600', 
                  marginBottom: '20px',
                  position: 'relative',
                  display: 'inline-block'
                }}>
                  Season Stats
                  <span style={{
                    content: '',
                    position: 'absolute',
                    bottom: '-8px',
                    left: '0',
                    width: '50px',
                    height: '3px',
                    background: `linear-gradient(to right, ${activeTeam.primaryColor}, ${activeTeam.secondaryColor})`,
                    borderRadius: '3px'
                  }}></span>
                </h3>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '15px'
                }}>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '5px' }}>2024</div>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>Current Position</div>
                  </div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '5px' }}>{activeTeam.trophies}</div>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>Titles Won</div>
                  </div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '5px' }}>{2024 - activeTeam.founded}</div>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>Seasons Played</div>
                  </div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '5px' }}>-</div>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>Win Percentage</div>
                  </div>
                </div>
              </div>
            </div>

            {/* All Teams Grid */}
            <div style={{ maxWidth: '1400px', margin: '60px auto', padding: '0 20px' }}>
              <h2 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                All <span style={{
                  background: 'linear-gradient(to right, #6d0f24, #1a2a6c)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}>Teams</span>
              </h2>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px'
              }}>
                {teams.map((team) => (
                  <div 
                    key={team.id} 
                    style={{
                      background: `linear-gradient(135deg, ${team.primaryColor}20, ${team.secondaryColor}20)`,
                      borderTop: `4px solid ${team.primaryColor}`,
                      borderRadius: '16px',
                      padding: '25px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => {
                      setActiveTeam(team);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div style={{ width: '70px', height: '70px', margin: '0 auto 15px' }}>
                      <Image 
                        src={team.logo} 
                        alt="Team Logo" 
                        width={70}
                        height={70}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px', textAlign: 'center' }}>
                      {team.name}
                    </h3>
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '15px'
                    }}>
                      <span>🏆 {team.trophies} Title{team.trophies !== 1 ? 's' : ''}</span>
                      <span>👤 {team.captain}</span>
                    </div>
                    <button style={{
                      width: '100%',
                      padding: '8px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: '9999px',
                      color: 'white',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      cursor: 'pointer'
                    }}>
                      View Team <FiArrowRight />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3>Team Comparison Feature Coming Soon</h3>
            <p>Compare team stats, head-to-head records, and more!</p>
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