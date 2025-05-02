"use client";
import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import styles from "../page.module.css";
import playerStyles from "./players.module.css";
import { poiretOne } from '../layout.js';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function PlayersGallery() {
  const containerRef = useRef(null);
  const [activePlayer, setActivePlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useGSAP(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    
    gsap.utils.toArray(`.${playerStyles.playerCard}`).forEach((card, i) => {
      const imageEl = card.querySelector(`.${playerStyles.playerImage}`);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          end: "top 30%",
          toggleActions: "play none none none",
          onEnter: () => setActivePlayer(i),
          onEnterBack: () => setActivePlayer(i)
        }
      });

      tl.from(card, { opacity: 0, y: 100, duration: 0.8, ease: "power4.out" });
      tl.fromTo(imageEl, 
        {
          y: 100,
          scale: 0.85,
          boxShadow: '0 0 0px rgba(255, 255, 255, 0)',
        },
        {
          y: 0,
          scale: 1,
          boxShadow: '0 0 40px rgba(255,255,255,0.25)',
          duration: 1.5,
          ease: "expo.out"
        }, 0
      );
    });

    playerData.forEach((player, i) => {
      ScrollTrigger.create({
        trigger: `.${playerStyles.playerCard}-${i}`,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          gsap.to('body', { 
            backgroundColor: player.bgColor, 
            duration: 0.5 
          });
        },
        onLeaveBack: () => {
          gsap.to('body', { 
            backgroundColor: i > 0 ? playerData[i - 1].bgColor : '#111',
            duration: 0.5 
          });
        }
      });
    });

    ScrollTrigger.refresh();
    return () => clearTimeout(timer);
  }, { scope: containerRef });

  return (
    <div className={`${styles.container} ${poiretOne.className}`} ref={containerRef}>
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

      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>
          <span className={`${styles.gradientText} ${styles.textWave}`}>
            IPL Super Stars
          </span>
          <br />
          <span className={styles.textFadeIn}>
            Player Gallery
          </span>
        </h1>
        
        <p
          className={`${styles.heroSubtitle} ${styles.textFadeIn}`}
          style={{ fontFamily: "var(--font-recursive)" }}
        >
          Scroll to explore the galaxy of IPL superstars
        </p>
      </header>

      <div className={playerStyles.gallery}>
        {playerData.map((player, index) => (
          <PlayerCard 
            key={player.id}
            player={player}
            index={index}
            isActive={activePlayer === index}
          />
        ))}
      </div>

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

const PlayerCard = ({ player, index, isActive }) => {
  const cardRef = useRef(null);

  useGSAP(() => {
    if (isActive) {
      gsap.to(cardRef.current.querySelector(`.${playerStyles.playerDetails}`), {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  }, { dependencies: [isActive], scope: cardRef });

  return (
    <div 
      ref={cardRef}
      className={`${playerStyles.playerCard} ${playerStyles.playerCard}-${index}`}
    >
      <div className={playerStyles.playerImageContainer}>
        <img
          src={player.image}
          alt={player.name}
          className={playerStyles.playerImage}
          onError={(e) => {
            e.target.src = '/fallback-player.jpg';
            e.target.className = `${playerStyles.playerImage} ${playerStyles.fallbackImage}`;
          }}
        />
        <div className={playerStyles.imageOverlay}>
          <h2 className={playerStyles.playerName}>{player.name}</h2>
          <p className={playerStyles.playerRole} style={{ color: player.color }}>
            {player.role}
          </p>
        </div>
      </div>

      <div className={playerStyles.playerDetails}>
        <h3 className={playerStyles.detailsTitle} style={{ color: player.color }}>
          Career Highlights
        </h3>
        <ul className={playerStyles.statsList}>
          {player.stats.map((stat, i) => (
            <li 
              key={i} 
              className={playerStyles.statItem}
              style={{ borderLeftColor: player.color }}
            >
              {stat}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
const playerData = [
  {
    id: 1,
    name: "Virat Kohli",
    role: "King",
    image: "/players/vk.png",
    color: "#ec4899",
    bgColor: "#1a0a14",
    stats: [
      "70+ International Centuries",
      "13000+ ODI Runs",
      "Highest Run-getter in IPL",
      "Former India Captain"
    ]
  },
  {
    id: 2,
    name: "Jasprit Bumrah",
    role: "Bowling Spearhead",
    image: "/players/bumrah.jpeg",
    color: "#8b5cf6",
    bgColor: "#0e0a1a",
    stats: [
      "250+ International Wickets",
      "Best Bowling Economy in T20s",
      "Deadly Yorker Specialist",
      "Fastest to 100 IPL Wickets"
    ]
  },
  {
    id: 3,
    name: "MS Dhoni",
    role: "Captain Cool",
    image: "/players/msdhoni.png",
    color: "#3b82f6",
    bgColor: "#0a121a",
    stats: [
      "3x IPL Championship Winner",
      "5000+ IPL Runs",
      "Best Finisher in Cricket",
      "Most Dismissals as Wicketkeeper"
    ]
  },
  {
    id: 4,
    name: "Rohit Sharma",
    role: "Hitman",
    image: "/players/rohit.jpeg",
    color: "#10b981",
    bgColor: "#0a1a12",
    stats: [
      "5x IPL Title Winner",
      "Most Centuries in T20Is",
      "Only Player with 3 ODI Double Tons",
      "Current India Captain"
    ]
  },
  {
    id: 5,
    name: "Ruturaj Gaikwad",
    role: "Opening Anchor",
    image: "/players/rutu.jpeg",
    color: "#f59e0b",
    bgColor: "#1a120a",
    stats: [
      "Orange Cap Winner 2021",
      "Consistent CSK Opener",
      "Stylish Strokeplay",
      "India Debut in 2021"
    ]
  },
  {
    id: 6,
    name: "Hardik Pandya",
    role: "Dynamic All-Rounder",
    image: "/players/pandya.jpeg",
    color: "#0ea5e9",
    bgColor: "#0a121a",
    stats: [
      "GT’s Title-Winning Captain 2022",
      "Explosive Finisher",
      "Fast Bowling All-Rounder",
      "Vice-Captain of India (T20s)"
    ]
  },
  {
    id: 7,
    name: "Suryakumar Yadav",
    role: "360° Batter",
    image: "/players/sky.jpeg",
    color: "#a855f7",
    bgColor: "#140a1a",
    stats: [
      "Top Ranked T20I Batter",
      "Known for Unorthodox Shots",
      "Strike Rate 170+ in T20Is",
      "Match Winner for India"
    ]
  },
  {
    id: 8,
    name: "Ravindra Jadeja",
    role: "Rockstar All-Rounder",
    image: "/players/jaddu.jpeg",
    color: "#22c55e",
    bgColor: "#0a1a0f",
    stats: [
      "3D Player: Bat, Ball & Field",
      "CSK’s Key Finisher",
      "IPL 2023 Final Hero",
      "3000+ IPL Runs & 150+ Wickets"
    ]
  },
  {
    id: 9,
    name: "Sunil Narine",
    role: "Mystery Spinner",
    image: "/players/narine.jpeg",
    color: "#facc15",
    bgColor: "#1a180a",
    stats: [
      "2x IPL MVP",
      "Economy Under 6 in IPL",
      "Explosive Opener Option",
      "KKR’s Bowling Pillar"
    ]
  },
  {
    id: 10,
    name: "Andre Russell",
    role: "Powerhouse All-Rounder",
    image: "/players/russell.jpeg",
    color: "#ef4444",
    bgColor: "#1a0a0a",
    stats: [
      "Feared T20 Finisher",
      "2x IPL MVP",
      "150+ Sixes in IPL",
      "Wicket-Taking All-Rounder"
    ]
  },
  {
    id: 11,
    name: "Heinrich Klaasen",
    role: "Explosive Keeper-Batter",
    image: "/players/klassen.jpeg",
    color: "#3b82f6",
    bgColor: "#0a0e1a",
    stats: [
      "SRH’s Power Hitter",
      "140+ Strike Rate in T20s",
      "Fearless Spin Hitter",
      "Match-Winning Knocks Globally"
    ]
  },
  {
    id: 12,
    name: "Axar Patel",
    role: "Reliable All-Rounder",
    image: "/players/axar.jpeg",
    color: "#14b8a6",
    bgColor: "#0a1a1a",
    stats: [
      "Accurate Left-Arm Spinner",
      "Handy Lower-Order Batter",
      "Key DC Contributor",
      "Economy King in Powerplays"
    ]
  },
  {
    id: 13,
    name: "Rishabh Pant",
    role: "Fearless Wicketkeeper",
    image: "/players/pant.jpeg",
    color: "#ec4899",
    bgColor: "#1a0a14",
    stats: [
      "Comeback Star of 2024",
      "Explosive IPL Performer",
      "Youngest Test Centurion in AUS",
      "DC Captain & Fan Favorite"
    ]
  },
  {
    id: 14,
    name: "Shreyas Iyer",
    role: "Dependable Top-Order Batter",
    image: "/players/iyer.jpeg",
    color: "#6366f1",
    bgColor: "#0f0a1a",
    stats: [
      "Former DC Captain",
      "Stabilizer in Middle Order",
      "Solid Against Spin",
      "Over 2500 IPL Runs"
    ]
  }  
];