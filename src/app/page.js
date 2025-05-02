"use client";
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import styles from "./page.module.css";
import { FiArrowRight, FiPlay, FiBarChart2, FiUsers, FiAward } from "react-icons/fi";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import './globals.css';
// Register plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Text scrambling effect component
const ScrambleText = ({ children, duration = 2500 }) => {
  const [displayText, setDisplayText] = useState("");
  const [isAnimating, setIsAnimating] = useState(true);
  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    const originalText = children;
    let frame = 0;
    const frames = duration / 100;
    
    const animate = () => {
      frame++;
      const progress = frame / frames;
      
      if (progress < 0.8) {
        let scrambled = "";
        for (let i = 0; i < originalText.length; i++) {
          if (Math.random() < 0.3) {
            scrambled += originalText[i];
          } else {
            scrambled += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        setDisplayText(scrambled);
      } 
      else if (progress < 1) {
        const visibleChars = Math.floor(originalText.length * (progress - 0.8) * 5);
        setDisplayText(
          originalText.substring(0, visibleChars) + 
          chars[Math.floor(Math.random() * chars.length)].repeat(originalText.length - visibleChars)
        );
      } 
      else {
        setDisplayText(originalText);
        setIsAnimating(false);
        return;
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animate);
  }, [children, duration]);

  return (
    <span style={{ 
      display: 'inline-block',
      transform: isAnimating ? `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)` : 'none',
      opacity: isAnimating ? 0.7 : 1,
      transition: isAnimating ? 'none' : 'all 0.5s ease-out'
    }}>
      {displayText}
    </span>
  );
};

const CyberpunkText = ({ text }) => {
  return (
    <div className={`${styles.holographicText}`} data-text={text}>
      <div className={styles.glitchText}>
        {text.split('').map((char, i) => (
          <span 
            key={i} 
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const mainWrapperRef = useRef(null);
  const contentRef = useRef(null);
  const aboutRef = useRef(null);
  const matchesRef = useRef(null);
  const teamsRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // Initialize smooth scrolling
    const smoother = ScrollSmoother.create({
      wrapper: mainWrapperRef.current,
      content: contentRef.current,
      smooth: 1.2,
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
    });

    // Configure ScrollTrigger for better performance
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true
    });

    // Animation setup
    const setupAnimations = () => {
      // About section
      gsap.from(aboutRef.current.querySelector('.image-content'), {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
          markers: false,
          anticipatePin: 1
        }
      });

      gsap.from(aboutRef.current.querySelector('.text-content'), {
        x: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1
        }
      });

      // Matches section
      gsap.from(matchesRef.current.querySelector('.image-content'), {
        x: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: matchesRef.current,
          start: "top 80%",
          scrub: 1
        }
      });

      gsap.from(matchesRef.current.querySelector('.text-content'), {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: matchesRef.current,
          start: "top 80%",
          scrub: 1
        }
      });

      // Teams section
      gsap.from(teamsRef.current.querySelector('.image-content'), {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: teamsRef.current,
          start: "top 80%",
          scrub: 1
        }
      });

      gsap.from(teamsRef.current.querySelector('.text-content'), {
        x: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: teamsRef.current,
          start: "top 80%",
          scrub: 1
        }
      });

      // Stats cards
      gsap.utils.toArray(statsRef.current.querySelectorAll('.statCard')).forEach((card, index) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.5,
          delay: index * 0.1,
          ease: "back.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        });
      });

      // Rainbow effect
      gsap.to(".rainbow-text", {
        backgroundPosition: "200% 0%",
        ease: "none",
        scrollTrigger: {
          trigger: ".rainbow-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    };

    setupAnimations();

    return () => {
      smoother.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isLoading]);

  return (
    <div ref={mainWrapperRef} className={styles.smoothWrapper}>
      <div ref={contentRef} className={styles.smoothContent}>
        {/* Glowing background elements */}
        <div className={styles.glowBackground}>
          <div className={styles.glowPurple}></div>
          <div className={styles.glowBlue}></div>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingParticles}>
              {[...Array(50)].map((_, i) => (
                <div 
                  key={i}
                  className={styles.loadingParticle}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    transform: `scale(${Math.random() * 2 + 0.5})`
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Navbar */}
        <nav className={styles.navbar}>
          <div className={styles.logo}>
            <Image
              src="/IPL.jpeg"
              alt="IPLHub Logo"
              width={20}
              height={20}
              className={`${styles.logoImage} $${styles.optimizedImage}`}
              priority
            />
            <span className={styles.logoText}>
              {isLoading ? <ScrambleText duration={4000}>IPLHub</ScrambleText> : "IPLHub"}
            </span>
          </div>
          <div className={styles.navLinks}>
            <a href="./matches" className={styles.navLink}>
              {isLoading ? <ScrambleText duration={3500}>Matches</ScrambleText> : "Matches"}
            </a>
            <a href="./teams" className={styles.navLink}>
              {isLoading ? <ScrambleText duration={3500}>Teams</ScrambleText> : "Teams"}
            </a>
            <a href="./players" className={styles.navLink}>
              {isLoading ? <ScrambleText duration={3500}>Players</ScrambleText> : "Players"}
            </a>
            <a href="./stats" className={styles.navLink}>
              {isLoading ? <ScrambleText duration={3500}>Stats</ScrambleText> : "Stats"}
            </a>
          </div>
          <a href="./connect">
            <button className={`${styles.connectButton} ${styles.glowHover}`}>
              {isLoading ? <ScrambleText duration={3000}>Connect</ScrambleText> : "Connect"}
            </button>
          </a>
        </nav>

        {/* Hero Section */}
        <main className={styles.hero}>
          <h1 className={styles.heroTitle}>
            <span className={`${styles.gradientText} ${styles.textWave}`}>
              {isLoading ? <ScrambleText duration={4500}>IPL 2025</ScrambleText> : "IPL 2025"}
            </span>
            <br />
            <span className={styles.textFadeIn}>
              {isLoading ? <ScrambleText duration={4500}>Ultimate Cricket Hub</ScrambleText> : "Ultimate Cricket Hub"}
            </span>
          </h1>

          <p
            className={`${styles.heroSubtitle} ${styles.textFadeIn}`}
            style={{
              fontFamily: "var(--font-audiowide), 'Yanone Kaffeesatz', sans-serif",
            }}
          >
            {isLoading ? (
              <>
                <ScrambleText duration={4000}>Experience the thrill of IPL like never before.</ScrambleText>
                <br />
                <ScrambleText duration={4000}>Real-time stats, player analytics,</ScrambleText>
                <br />
                <ScrambleText duration={4000}>match predictions and more - all in one electrifying platform.</ScrambleText>
              </>
            ) : (
              "Experience the thrill of IPL like never before. Real-time stats, player analytics, match predictions and more - all in one electrifying platform."
            )}
          </p>

          <div className={styles.heroButtons}>
            <a href="https://www.cricbuzz.com/cricket-series/9237/indian-premier-league-2025/matches">
              <button className={`${styles.primaryButton} ${styles.buttonHover}`}>
                {isLoading ? <ScrambleText duration={3000}>Live Matches</ScrambleText> : "Live Matches"}
                <FiArrowRight className={styles.buttonIcon} />
              </button>
            </a>
            <a href="https://www.iplt20.com/videos/highlights">
              <button className={`${styles.secondaryButton} ${styles.buttonHover}`}>
                <FiPlay className={styles.buttonIcon} />
                {isLoading ? <ScrambleText duration={3000}>Watch Highlights</ScrambleText> : "Watch Highlights"}
              </button>
            </a>
          </div>
        </main>

        {/* About IPL Section */}
        <section id="about" ref={aboutRef} className={`${styles.section} ${styles.aboutSection} ${styles.parallaxSection} rainbow-section`}>
          <div className={styles.sectionContent}>
            <div className={`${styles.textContent} text-content`}>
              <h2 className={styles.sectionTitle}>
                <CyberpunkText text="ABOUT-IPL" />
              </h2>
              <p className={`${styles.sectionText} ${styles.glitchParagraph}`}>
                The Indian Premier League (IPL) is a professional Twenty20 cricket league in India contested during 
                March or April and May of every year.
              </p>
              <p className={`${styles.sectionText} ${styles.glitchParagraph}`}>
                Founded by BCCI in 2007. The IPL has an exclusive window in ICC Future Tours Programme.
              </p>
              <div className={styles.statsMini}>
                {[
                  { value: "16", label: "Teams" },
                  { value: "74", label: "Matches" },
                  { value: "5x", label: "MI Wins" }
                ].map((stat, i) => (
                  <div key={i} className={styles.statMini}>
                    <div className={`${styles.statMiniValue} ${styles.glitchText}`}>
                      {stat.value.split('').map((char, j) => (
                        <span key={j} style={{ animationDelay: `${j * 0.05 + i * 0.2}s` }}>
                          {char}
                        </span>
                      ))}
                    </div>
                    <div className={styles.statMiniLabel}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${styles.imageContent} image-content`}>
              <div className={styles.imageWrapper}>
                <Image
                  src="/cskstad.png"
                  alt="IPL Stadium"
                  fill
                  className={`${styles.aboutImage} ${styles.optimizedImage}`}
                  priority
                />
                <div className={styles.imageGlow}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Matches Section */}
        <section id="matches" ref={matchesRef} className={`${styles.section} ${styles.matchesSection} rainbow-section`}>
          <div className={styles.sectionContent}>
            <div className={`${styles.imageContent} image-content`}>
              <div className={styles.imageWrapper}>
                <Image
                  src="/rcbstadium.png"
                  alt="IPL Match"
                  fill
                  className={`${styles.matchesImage} ${styles.optimizedImage}`}
                  priority
                />
                <div className={styles.imageGlow}></div>
              </div>
            </div>
            <div className={`${styles.textContent} text-content`}>
              <h2 className={styles.sectionTitle}>
                <CyberpunkText text="MATCHES" />
              </h2>
              <p className={`${styles.sectionText} ${styles.glitchParagraph}`}>
                <span className={styles.highlightWord}>Live scores</span> and match predictions. Never miss a moment with our comprehensive schedule.
              </p>
              <p className={`${styles.sectionText} ${styles.glitchParagraph}`}>
                <span className={styles.highlightWord}>Personalized tracking</span> for your favorite team's matches.
              </p>
              <a href="./matches" className={styles.sectionButton}>
                <button className={`${styles.primaryButton} ${styles.glitchButton}`}>
                  <span>VIEW MATCHES</span>
                  <FiArrowRight className={styles.buttonIcon} />
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* Teams Section */}
        <section id="teams" ref={teamsRef} className={`${styles.section} ${styles.teamsSection} rainbow-section`}>
          <div className={styles.sectionContent}>
            <div className={`${styles.textContent} text-content`}>
              <h2 className={styles.sectionTitle}>
                <CyberpunkText text="TEAMS" />
              </h2>
              <p className={`${styles.sectionText} ${styles.glitchParagraph}`}>
                Discover all <span className={styles.highlightWord}>10 teams</span> competing this season with detailed squad analytics.
              </p>
              <p className={`${styles.sectionText} ${styles.glitchParagraph}`}>
                From <span className={styles.highlightWord}>Mumbai Indians</span> to <span className={styles.highlightWord}>Chennai Super Kings</span> - follow your favorites.
              </p>
            </div>
            <div className={`${styles.imageContent} image-content`}>
              <div className={styles.imageWrapper}>
                <Image
                  src="/mistadium.png"
                  alt="IPL Teams"
                  fill
                  className={`${styles.teamsImage} ${styles.optimizedImage}`}
                  priority
                />
                <div className={styles.imageGlow}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" ref={statsRef} className={`${styles.section} ${styles.statsSection}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={`${styles.gradientText} rainbow-text`}>Statistics</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Dive deep into the numbers that define the IPL
            </p>
          </div>
          <div className={styles.statsGrid}>
            {[
              { icon: <FiBarChart2 className={styles.statIcon} />, value: "1260+", label: "Matches Tracked" },
              { icon: <FiUsers className={styles.statIcon} />, value: "2000+", label: "Players Analyzed" },
              { icon: <FiAward className={styles.statIcon} />, value: "18", label: "Seasons Covered" },
              { icon: <span className={styles.statIcon}>🏆</span>, value: "5B+", label: "Fans Engaged" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className={`${styles.statCard} statCard`}
              >
                <div className={styles.statIconWrapper}>
                  {stat.icon}
                </div>
                <div className={styles.statValue}>
                  {stat.value}
                </div>
                <div className={styles.statLabel}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>
              <Image
                src="/IPL.jpeg"
                alt="IPLHub Logo"
                width={20}
                height={20}
                className={`${styles.logoImage} ${styles.optimizedImage}`}
              />
              <span className={styles.logoText}>IPLHub</span>
            </div>
            <div className={styles.footerLinks}>
              <a href="#about" className={styles.footerLink}>About</a>
              <a href="#matches" className={styles.footerLink}>Matches</a>
              <a href="#teams" className={styles.footerLink}>Teams</a>
              <a href="#stats" className={styles.footerLink}>Stats</a>
            </div>
            <div className={styles.footerCopyright}>
              © {new Date().getFullYear()} IPLHub. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}