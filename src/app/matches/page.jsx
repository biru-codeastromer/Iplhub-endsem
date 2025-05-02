"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiSearch, FiX } from "react-icons/fi";
import styles from "../page.module.css";
import { poiretOne } from '../layout.js';

function Stars(props) {
    const ref = useRef();
    const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));
    
    useFrame((state, delta) => {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    });
  
    return (
      <group rotation={[0, 0, Math.PI / 4]}>
        <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
          <PointMaterial
            transparent
            color="#ffa3e0"
            size={0.005}
            sizeAttenuation={true}
            depthWrite={false}
          />
        </Points>
      </group>
    );
}

function SpaceLoader() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => Math.min(prev + 2, 100));
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        textAlign: 'center'
      }}>
        <div style={{
          position: 'relative',
          width: '80px',
          height: '80px',
          margin: '0 auto 20px'
        }}>
          {/* Sun */}
          <div style={{
            position: 'absolute',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ffeb3b, #ff9800)',
            boxShadow: '0 0 20px #ff9800',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'pulse 2s infinite'
          }}></div>
          
          {/* Orbiting planets */}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              position: 'absolute',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: i === 0 ? '#4fc3f7' : i === 1 ? '#ff5722' : '#8bc34a',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${i * 120}deg) translate(35px) rotate(${-i * 120}deg)`,
              animation: `orbit ${3 + i}s linear infinite`
            }}></div>
          ))}
        </div>
        <p style={{
          color: '#fff',
          fontSize: '1.2rem',
          marginTop: '20px',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
        }}>Preparing Galactic IPL Match Schedule...</p>
        
        {/* Progress Bar */}
        <div style={{
          width: '200px',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '2px',
          margin: '20px auto',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
            transition: 'width 0.3s ease',
            borderRadius: '2px'
          }}></div>
        </div>
        
        <style jsx>{`
          @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.1); }
            100% { transform: translate(-50%, -50%) scale(1); }
          }
          @keyframes orbit {
            from { transform: translate(-50%, -50%) rotate(0deg) translate(35px) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg) translate(35px) rotate(-360deg); }
          }
        `}</style>
      </div>
    );
}

export default function MatchesPage() {
    const [matchesData, setMatchesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLoader, setShowLoader] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const [flipDirection, setFlipDirection] = useState('right');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [selectedVenues, setSelectedVenues] = useState([]);
    const bookRef = useRef();


  // Sample data structure that matches your provided schedule
  const sampleMatchesData = [
        {
          matchNumber: "1st Match",
          date: "Sat, 22 Mar '25",
          result: "RCB won by 7 wickets (with 22 balls remaining)",
          venue: "Eden Gardens",
          team1: "Kolkata Knight Riders",
          team1Score: "174/8",
          team2: "Royal Challengers Bengaluru",
          team2Score: "177/3 (16.2/20 ov, T:175)",
          matchStatus: "completed"
        },
        {
          matchNumber: "2nd Match",
          date: "Sun, 23 Mar '25",
          result: "SRH won by 44 runs",
          venue: "Hyderabad",
          team1: "Sunrisers Hyderabad",
          team1Score: "286/6",
          team2: "Rajasthan Royals",
          team2Score: "242/6 (20 ov, T:287)",
          matchStatus: "completed"
        },
        {
          matchNumber: "3rd Match",
          date: "Sun, 23 Mar '25",
          result: "CSK won by 4 wickets (with 5 balls remaining)",
          venue: "Chennai",
          team1: "Mumbai Indians",
          team1Score: "155/9",
          team2: "Chennai Super Kings",
          team2Score: "158/6 (19.1/20 ov, T:156)",
          matchStatus: "completed"
        },
        {
          matchNumber: "4th Match",
          date: "Mon, 24 Mar '25",
          result: "DC won by 1 wicket (with 3 balls remaining)",
          venue: "Visakhapatnam",
          team1: "Lucknow Super Giants",
          team1Score: "209/8",
          team2: "Delhi Capitals",
          team2Score: "211/9 (19.3/20 ov, T:210)",
          matchStatus: "completed"
        },
        {
          matchNumber: "5th Match",
          date: "Tue, 25 Mar '25",
          result: "PBKS won by 11 runs",
          venue: "Ahmedabad",
          team1: "Punjab Kings",
          team1Score: "243/5",
          team2: "Gujarat Titans",
          team2Score: "232/5 (20 ov, T:244)",
          matchStatus: "completed"
        },
        {
          matchNumber: "6th Match",
          date: "Wed, 26 Mar '25",
          result: "KKR won by 8 wickets (with 15 balls remaining)",
          venue: "Guwahati",
          team1: "Rajasthan Royals",
          team1Score: "151/9",
          team2: "Kolkata Knight Riders",
          team2Score: "153/2 (17.3/20 ov, T:152)",
          matchStatus: "completed"
        },
        {
          matchNumber: "7th Match",
          date: "Thu, 27 Mar '25",
          result: "LSG won by 5 wickets (with 23 balls remaining)",
          venue: "Hyderabad",
          team1: "Sunrisers Hyderabad",
          team1Score: "190/9",
          team2: "Lucknow Super Giants",
          team2Score: "193/5 (16.1/20 ov, T:191)",
          matchStatus: "completed"
        },
        {
          matchNumber: "8th Match",
          date: "Fri, 28 Mar '25",
          result: "RCB won by 50 runs",
          venue: "Chennai",
          team1: "Royal Challengers Bengaluru",
          team1Score: "196/7",
          team2: "Chennai Super Kings",
          team2Score: "146/8 (20 ov, T:197)",
          matchStatus: "completed"
        },
        {
          matchNumber: "9th Match",
          date: "Sat, 29 Mar '25",
          result: "GT won by 36 runs",
          venue: "Ahmedabad",
          team1: "Gujarat Titans",
          team1Score: "196/8",
          team2: "Mumbai Indians",
          team2Score: "160/6 (20 ov, T:197)",
          matchStatus: "completed"
        },
        {
          matchNumber: "10th Match",
          date: "Sun, 30 Mar '25",
          result: "DC won by 7 wickets (with 24 balls remaining)",
          venue: "Visakhapatnam",
          team1: "Sunrisers Hyderabad",
          team1Score: "163",
          team2: "Delhi Capitals",
          team2Score: "166/3 (16/20 ov, T:164)",
          matchStatus: "completed"
        },
        {
          matchNumber: "11th Match",
          date: "Sun, 30 Mar '25",
          result: "RR won by 6 runs",
          venue: "Guwahati",
          team1: "Rajasthan Royals",
          team1Score: "182/9",
          team2: "Chennai Super Kings",
          team2Score: "176/6 (20 ov, T:183)",
          matchStatus: "completed"
        },
        {
          matchNumber: "12th Match",
          date: "Mon, 31 Mar '25",
          result: "MI won by 8 wickets (with 43 balls remaining)",
          venue: "Wankhede",
          team1: "Kolkata Knight Riders",
          team1Score: "116",
          team2: "Mumbai Indians",
          team2Score: "121/2 (12.5/20 ov, T:117)",
          matchStatus: "completed"
        },
        {
          matchNumber: "13th Match",
          date: "Tue, 01 Apr '25",
          result: "PBKS won by 8 wickets (with 22 balls remaining)",
          venue: "Lucknow",
          team1: "Lucknow Super Giants",
          team1Score: "171/7",
          team2: "Punjab Kings",
          team2Score: "177/2 (16.2/20 ov, T:172)",
          matchStatus: "completed"
        },
        {
          matchNumber: "14th Match",
          date: "Wed, 02 Apr '25",
          result: "GT won by 8 wickets (with 13 balls remaining)",
          venue: "Bengaluru",
          team1: "Royal Challengers Bengaluru",
          team1Score: "169/8",
          team2: "Gujarat Titans",
          team2Score: "170/2 (17.5/20 ov, T:170)",
          matchStatus: "completed"
        },
        {
          matchNumber: "15th Match",
          date: "Thu, 03 Apr '25",
          result: "KKR won by 80 runs",
          venue: "Eden Gardens",
          team1: "Kolkata Knight Riders",
          team1Score: "200/6",
          team2: "Sunrisers Hyderabad",
          team2Score: "120 (16.4/20 ov, T:201)",
          matchStatus: "completed"
        },
        {
          matchNumber: "16th Match",
          date: "Fri, 04 Apr '25",
          result: "LSG won by 12 runs",
          venue: "Lucknow",
          team1: "Lucknow Super Giants",
          team1Score: "203/8",
          team2: "Mumbai Indians",
          team2Score: "191/5 (20 ov, T:204)",
          matchStatus: "completed"
        },
        {
          matchNumber: "17th Match",
          date: "Sat, 05 Apr '25",
          result: "DC won by 25 runs",
          venue: "Chennai",
          team1: "Delhi Capitals",
          team1Score: "183/6",
          team2: "Chennai Super Kings",
          team2Score: "158/5 (20 ov, T:184)",
          matchStatus: "completed"
        },
        {
          matchNumber: "18th Match",
          date: "Sat, 05 Apr '25",
          result: "RR won by 50 runs",
          venue: "Mullanpur",
          team1: "Rajasthan Royals",
          team1Score: "205/4",
          team2: "Punjab Kings",
          team2Score: "155/9 (20 ov, T:206)",
          matchStatus: "completed"
        },
        {
          matchNumber: "19th Match",
          date: "Sun, 06 Apr '25",
          result: "GT won by 7 wickets (with 20 balls remaining)",
          venue: "Hyderabad",
          team1: "Sunrisers Hyderabad",
          team1Score: "152/8",
          team2: "Gujarat Titans",
          team2Score: "153/3 (16.4/20 ov, T:153)",
          matchStatus: "completed"
        },
        {
          matchNumber: "20th Match",
          date: "Mon, 07 Apr '25",
          result: "RCB won by 12 runs",
          venue: "Wankhede",
          team1: "Royal Challengers Bengaluru",
          team1Score: "221/5",
          team2: "Mumbai Indians",
          team2Score: "209/9 (20 ov, T:222)",
          matchStatus: "completed"
        },
        {
          matchNumber: "21st Match",
          date: "Tue, 08 Apr '25",
          result: "LSG won by 4 runs",
          venue: "Eden Gardens",
          team1: "Lucknow Super Giants",
          team1Score: "238/3",
          team2: "Kolkata Knight Riders",
          team2Score: "234/7 (20 ov, T:239)",
          matchStatus: "completed"
        },
        {
          matchNumber: "22nd Match",
          date: "Tue, 08 Apr '25",
          result: "PBKS won by 18 runs",
          venue: "Mullanpur",
          team1: "Punjab Kings",
          team1Score: "219/6",
          team2: "Chennai Super Kings",
          team2Score: "201/5 (20 ov, T:220)",
          matchStatus: "completed"
        },
        {
          matchNumber: "23rd Match",
          date: "Wed, 09 Apr '25",
          result: "GT won by 58 runs",
          venue: "Ahmedabad",
          team1: "Gujarat Titans",
          team1Score: "217/6",
          team2: "Rajasthan Royals",
          team2Score: "159 (19.2/20 ov, T:218)",
          matchStatus: "completed"
        },
        {
          matchNumber: "24th Match",
          date: "Thu, 10 Apr '25",
          result: "DC won by 6 wickets (with 13 balls remaining)",
          venue: "Bengaluru",
          team1: "Royal Challengers Bengaluru",
          team1Score: "163/7",
          team2: "Delhi Capitals",
          team2Score: "169/4 (17.5/20 ov, T:164)",
          matchStatus: "completed"
        },
        {
          matchNumber: "25th Match",
          date: "Fri, 11 Apr '25",
          result: "KKR won by 8 wickets (with 59 balls remaining)",
          venue: "Chennai",
          team1: "Chennai Super Kings",
          team1Score: "103/9",
          team2: "Kolkata Knight Riders",
          team2Score: "107/2 (10.1/20 ov, T:104)",
          matchStatus: "completed"
        },
        {
          matchNumber: "26th Match",
          date: "Sat, 12 Apr '25",
          result: "LSG won by 6 wickets (with 3 balls remaining)",
          venue: "Lucknow",
          team1: "Gujarat Titans",
          team1Score: "180/6",
          team2: "Lucknow Super Giants",
          team2Score: "186/4 (19.3/20 ov, T:181)",
          matchStatus: "completed"
        },
        {
          matchNumber: "27th Match",
          date: "Sat, 12 Apr '25",
          result: "SRH won by 8 wickets (with 9 balls remaining)",
          venue: "Hyderabad",
          team1: "Punjab Kings",
          team1Score: "245/6",
          team2: "Sunrisers Hyderabad",
          team2Score: "247/2 (18.3/20 ov, T:246)",
          matchStatus: "completed"
        },
        {
          matchNumber: "28th Match",
          date: "Sun, 13 Apr '25",
          result: "RCB won by 9 wickets (with 15 balls remaining)",
          venue: "Jaipur",
          team1: "Rajasthan Royals",
          team1Score: "173/4",
          team2: "Royal Challengers Bengaluru",
          team2Score: "175/1 (17.3/20 ov, T:174)",
          matchStatus: "completed"
        },
        {
          matchNumber: "29th Match",
          date: "Sun, 13 Apr '25",
          result: "MI won by 12 runs",
          venue: "Delhi",
          team1: "Mumbai Indians",
          team1Score: "205/5",
          team2: "Delhi Capitals",
          team2Score: "193 (19/20 ov, T:206)",
          matchStatus: "completed"
        },
        {
          matchNumber: "30th Match",
          date: "Mon, 14 Apr '25",
          result: "CSK won by 5 wickets (with 3 balls remaining)",
          venue: "Lucknow",
          team1: "Lucknow Super Giants",
          team1Score: "166/7",
          team2: "Chennai Super Kings",
          team2Score: "168/5 (19.3/20 ov, T:167)",
          matchStatus: "completed"
        },
        {
          matchNumber: "31st Match",
          date: "Tue, 15 Apr '25",
          result: "PBKS won by 16 runs",
          venue: "Mullanpur",
          team1: "Punjab Kings",
          team1Score: "111",
          team2: "Kolkata Knight Riders",
          team2Score: "95 (15.1/20 ov, T:112)",
          matchStatus: "completed"
        },
        {
          matchNumber: "32nd Match",
          date: "Wed, 16 Apr '25",
          result: "Match tied (DC won the Super Over)",
          venue: "Delhi",
          team1: "Delhi Capitals",
          team1Score: "188/5",
          team2: "Rajasthan Royals",
          team2Score: "188/4 (20 ov, T:189)",
          matchStatus: "completed"
        },
        {
          matchNumber: "33rd Match",
          date: "Thu, 17 Apr '25",
          result: "MI won by 4 wickets (with 11 balls remaining)",
          venue: "Wankhede",
          team1: "Sunrisers Hyderabad",
          team1Score: "162/5",
          team2: "Mumbai Indians",
          team2Score: "166/6 (18.1/20 ov, T:163)",
          matchStatus: "completed"
        },
        {
          matchNumber: "34th Match",
          date: "Fri, 18 Apr '25",
          result: "PBKS won by 5 wickets (with 11 balls remaining)",
          venue: "Bengaluru",
          team1: "Royal Challengers Bengaluru",
          team1Score: "95/9 (14/14 ov)",
          team2: "Punjab Kings",
          team2Score: "98/5 (12.1/14 ov, T:96)",
          matchStatus: "completed"
        },
        {
          matchNumber: "35th Match",
          date: "Sat, 19 Apr '25",
          result: "GT won by 7 wickets (with 4 balls remaining)",
          venue: "Ahmedabad",
          team1: "Delhi Capitals",
          team1Score: "203/8",
          team2: "Gujarat Titans",
          team2Score: "204/3 (19.2/20 ov, T:204)",
          matchStatus: "completed"
        },
        {
          matchNumber: "36th Match",
          date: "Sat, 19 Apr '25",
          result: "LSG won by 2 runs",
          venue: "Jaipur",
          team1: "Lucknow Super Giants",
          team1Score: "180/5",
          team2: "Rajasthan Royals",
          team2Score: "178/5 (20 ov, T:181)",
          matchStatus: "completed"
        },
        {
          matchNumber: "37th Match",
          date: "Sun, 20 Apr '25",
          result: "RCB won by 7 wickets (with 7 balls remaining)",
          venue: "Mullanpur",
          team1: "Punjab Kings",
          team1Score: "157/6",
          team2: "Royal Challengers Bengaluru",
          team2Score: "159/3 (18.5/20 ov, T:158)",
          matchStatus: "completed"
        },
        {
          matchNumber: "38th Match",
          date: "Sun, 20 Apr '25",
          result: "MI won by 9 wickets (with 26 balls remaining)",
          venue: "Wankhede",
          team1: "Chennai Super Kings",
          team1Score: "176/5",
          team2: "Mumbai Indians",
          team2Score: "177/1 (15.4/20 ov, T:177)",
          matchStatus: "completed"
        },
        {
          matchNumber: "39th Match",
          date: "Mon, 21 Apr '25",
          result: "GT won by 39 runs",
          venue: "Eden Gardens",
          team1: "Gujarat Titans",
          team1Score: "198/3",
          team2: "Kolkata Knight Riders",
          team2Score: "159/8 (20 ov, T:199)",
          matchStatus: "completed"
        },
        {
          matchNumber: "40th Match",
          date: "Tue, 22 Apr '25",
          result: "DC won by 8 wickets (with 13 balls remaining)",
          venue: "Lucknow",
          team1: "Lucknow Super Giants",
          team1Score: "159/6",
          team2: "Delhi Capitals",
          team2Score: "161/2 (17.5/20 ov, T:160)",
          matchStatus: "completed"
        },
        {
          matchNumber: "41st Match",
          date: "Wed, 23 Apr '25",
          result: "MI won by 7 wickets (with 26 balls remaining)",
          venue: "Hyderabad",
          team1: "Sunrisers Hyderabad",
          team1Score: "143/8",
          team2: "Mumbai Indians",
          team2Score: "146/3 (15.4/20 ov, T:144)",
          matchStatus: "completed"
        },
        {
          matchNumber: "42nd Match",
          date: "Thu, 24 Apr '25",
          result: "RCB won by 11 runs",
          venue: "Bengaluru",
          team1: "Royal Challengers Bengaluru",
          team1Score: "205/5",
          team2: "Rajasthan Royals",
          team2Score: "194/9 (20 ov, T:206)",
          matchStatus: "completed"
        },
        {
          matchNumber: "43rd Match",
          date: "Fri, 25 Apr '25",
          result: "SRH won by 5 wickets (with 8 balls remaining)",
          venue: "Chennai",
          team1: "Chennai Super Kings",
          team1Score: "154",
          team2: "Sunrisers Hyderabad",
          team2Score: "155/5 (18.4/20 ov, T:155)",
          matchStatus: "completed"
        },
        {
          matchNumber: "44th Match",
          date: "Sat, 26 Apr '25",
          result: "No result",
          venue: "Eden Gardens",
          team1: "Punjab Kings",
          team1Score: "201/4",
          team2: "Kolkata Knight Riders",
          team2Score: "7/0 (1/20 ov, T:202)",
          matchStatus: "completed"
        },
        {
          matchNumber: "45th Match",
          date: "Sun, 27 Apr '25",
          venue: "Wankhede",
          team1: "Mumbai Indians",
          team2: "Lucknow Super Giants",
          time: "3:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "46th Match",
          date: "Sun, 27 Apr '25",
          venue: "Delhi",
          team1: "Delhi Capitals",
          team2: "Royal Challengers Bengaluru",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "47th Match",
          date: "Mon, 28 Apr '25",
          venue: "Jaipur",
          team1: "Rajasthan Royals",
          team2: "Gujarat Titans",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "48th Match",
          date: "Tue, 29 Apr '25",
          venue: "Delhi",
          team1: "Delhi Capitals",
          team2: "Kolkata Knight Riders",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "49th Match",
          date: "Wed, 30 Apr '25",
          venue: "Chennai",
          team1: "Chennai Super Kings",
          team2: "Punjab Kings",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "50th Match",
          date: "Thu, 01 May '25",
          venue: "Jaipur",
          team1: "Rajasthan Royals",
          team2: "Mumbai Indians",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "51st Match",
          date: "Fri, 02 May '25",
          venue: "Ahmedabad",
          team1: "Gujarat Titans",
          team2: "Sunrisers Hyderabad",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "52nd Match",
          date: "Sat, 03 May '25",
          venue: "Bengaluru",
          team1: "Royal Challengers Bengaluru",
          team2: "Chennai Super Kings",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "53rd Match",
          date: "Sun, 04 May '25",
          venue: "Eden Gardens",
          team1: "Kolkata Knight Riders",
          team2: "Rajasthan Royals",
          time: "3:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "54th Match",
          date: "Sun, 04 May '25",
          venue: "Dharamsala",
          team1: "Punjab Kings",
          team2: "Lucknow Super Giants",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "55th Match",
          date: "Mon, 05 May '25",
          venue: "Hyderabad",
          team1: "Sunrisers Hyderabad",
          team2: "Delhi Capitals",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "56th Match",
          date: "Tue, 06 May '25",
          venue: "Wankhede",
          team1: "Mumbai Indians",
          team2: "Gujarat Titans",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "57th Match",
          date: "Wed, 07 May '25",
          venue: "Eden Gardens",
          team1: "Kolkata Knight Riders",
          team2: "Chennai Super Kings",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "58th Match",
          date: "Thu, 08 May '25",
          venue: "Dharamsala",
          team1: "Punjab Kings",
          team2: "Delhi Capitals",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "59th Match",
          date: "Fri, 09 May '25",
          venue: "Lucknow",
          team1: "Lucknow Super Giants",
          team2: "Royal Challengers Bengaluru",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "60th Match",
          date: "Sat, 10 May '25",
          venue: "Hyderabad",
          team1: "Sunrisers Hyderabad",
          team2: "Kolkata Knight Riders",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "61st Match",
          date: "Sun, 11 May '25",
          venue: "Dharamsala",
          team1: "Punjab Kings",
          team2: "Mumbai Indians",
          time: "3:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "62nd Match",
          date: "Sun, 11 May '25",
          venue: "Delhi",
          team1: "Delhi Capitals",
          team2: "Gujarat Titans",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "63rd Match",
          date: "Mon, 12 May '25",
          venue: "Chennai",
          team1: "Chennai Super Kings",
          team2: "Rajasthan Royals",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "64th Match",
          date: "Tue, 13 May '25",
          venue: "Bengaluru",
          team1: "Royal Challengers Bengaluru",
          team2: "Sunrisers Hyderabad",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "65th Match",
          date: "Wed, 14 May '25",
          venue: "Ahmedabad",
          team1: "Gujarat Titans",
          team2: "Lucknow Super Giants",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "66th Match",
          date: "Thu, 15 May '25",
          venue: "Wankhede",
          team1: "Mumbai Indians",
          team2: "Delhi Capitals",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "67th Match",
          date: "Fri, 16 May '25",
          venue: "Jaipur",
          team1: "Rajasthan Royals",
          team2: "Punjab Kings",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "68th Match",
          date: "Sat, 17 May '25",
          venue: "Bengaluru",
          team1: "Royal Challengers Bengaluru",
          team2: "Kolkata Knight Riders",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "69th Match",
          date: "Sun, 18 May '25",
          venue: "Ahmedabad",
          team1: "Gujarat Titans",
          team2: "Chennai Super Kings",
          time: "3:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "70th Match",
          date: "Sun, 18 May '25",
          venue: "Lucknow",
          team1: "Lucknow Super Giants",
          team2: "Sunrisers Hyderabad",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "Qualifier 1",
          date: "Tue, 20 May '25",
          venue: "Hyderabad",
          team1: "TBA",
          team2: "TBA",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "Eliminator",
          date: "Wed, 21 May '25",
          venue: "Hyderabad",
          team1: "TBA",
          team2: "TBA",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "Qualifier 2",
          date: "Fri, 23 May '25",
          venue: "Eden Gardens",
          team1: "TBA",
          team2: "TBA",
          time: "7:30 PM",
          matchStatus: "upcoming"
        },
        {
          matchNumber: "Final",
          date: "Sun, 25 May '25",
          venue: "Eden Gardens",
          team1: "TBA",
          team2: "TBA",
          time: "7:30 PM",
          matchStatus: "upcoming"
        }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setMatchesData(sampleMatchesData);
      setLoading(false);
      setTimeout(() => setShowLoader(false), 500);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Get unique teams and venues for filters
  const allTeams = [...new Set(
    sampleMatchesData.flatMap(match => [match.team1, match.team2])
  )].sort();

  const allVenues = [...new Set(
    sampleMatchesData.map(match => match.venue)
  )].sort();

  // Filter matches based on search and filters
  const filteredMatches = matchesData.filter(match => {
    const matchesSearch = match.matchNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         match.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.team1.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.team2.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTeams = selectedTeams.length === 0 || 
                        selectedTeams.includes(match.team1) || 
                        selectedTeams.includes(match.team2);

    const matchesVenues = selectedVenues.length === 0 || 
                         selectedVenues.includes(match.venue);

    return matchesSearch && matchesTeams && matchesVenues;
  });

  const getTeamLogo = (teamName) => {
    const logos = {
      "Kolkata Knight Riders": "/kkr.jpeg",
      "Royal Challengers Bengaluru": "/rcb.jpeg",
      "Sunrisers Hyderabad": "/srh.jpeg",
      "Rajasthan Royals": "/rr.jpeg",
      "Mumbai Indians": "/mi.jpeg",
      "Chennai Super Kings": "/csk.jpeg",
      "Lucknow Super Giants": "/lsg.jpeg",
      "Delhi Capitals": "/dc.jpeg",
      "Punjab Kings": "/pbks.jpeg",
      "Gujarat Titans": "/gt.jpeg"
    };
    return logos[teamName] || "/IPL.jpeg";
  };

  const toggleTeamFilter = (team) => {
    setSelectedTeams(prev => 
      prev.includes(team) 
        ? prev.filter(t => t !== team) 
        : [...prev, team]
    );
    setCurrentPage(0);
  };

  const toggleVenueFilter = (venue) => {
    setSelectedVenues(prev => 
      prev.includes(venue) 
        ? prev.filter(v => v !== venue) 
        : [...prev, venue]
    );
    setCurrentPage(0);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedTeams([]);
    setSelectedVenues([]);
    setCurrentPage(0);
  };

  const flipPage = (direction) => {
    if (isFlipping || filteredMatches.length === 0) return;
    
    setIsFlipping(true);
    setFlipDirection(direction);
    
    setTimeout(() => {
      setCurrentPage(prev => {
        const newPage = direction === 'next' 
          ? Math.min(prev + 1, filteredMatches.length - 1)
          : Math.max(prev - 1, 0);
        return newPage;
      });
      setIsFlipping(false);
    }, 500);
  };

  const MatchCard = ({ match }) => {
    return (
      <div className="match-card" style={{
        backgroundColor: 'rgba(15, 15, 25, 0.9)',
        borderRadius: '12px',
        padding: '30px',
        border: '1px solid rgba(255, 235, 59, 0.2)',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Match header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          fontSize: '1rem',
          color: 'rgba(255,255,255,0.8)',
          fontFamily: 'var(--font-recursive), sans-serif'
        }}>
          <span>{match.matchNumber} • {match.venue}</span>
          <span>{match.date}</span>
        </div>
        
        {/* Teams */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            gap: '15px',
            width: '40%'
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              position: 'relative',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Image 
                src={getTeamLogo(match.team1)} 
                alt={match.team1} 
                layout="fill"
                objectFit="cover"
              />
            </div>
            <span style={{ 
              fontFamily: 'var(--font-recursive), sans-serif',
              fontSize: '1.1rem',
              textAlign: 'center'
            }}>
              {match.team1}
            </span>
          </div>
          
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600',
            fontFamily: 'var(--font-poiret), sans-serif',
            color: '#ffeb3b',
            margin: '0 20px'
          }}>
            vs
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            gap: '15px',
            width: '40%'
          }}>
            <span style={{ 
              fontFamily: 'var(--font-recursive), sans-serif',
              fontSize: '1.1rem',
              textAlign: 'center'
            }}>
              {match.team2}
            </span>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              position: 'relative',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Image 
                src={getTeamLogo(match.team2)} 
                alt={match.team2} 
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        </div>
        
        {/* Match details */}
        {match.matchStatus === 'completed' ? (
          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '20px',
            borderRadius: '12px',
            marginTop: '20px',
            fontFamily: 'var(--font-recursive), sans-serif'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '10px',
              fontSize: '1.1rem'
            }}>
              <span>{match.team1}</span>
              <span>{match.team1Score}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '10px',
              fontSize: '1.1rem'
            }}>
              <span>{match.team2}</span>
              <span>{match.team2Score}</span>
            </div>
            <div style={{ 
              textAlign: 'center', 
              marginTop: '15px',
              color: '#8b5cf6',
              fontWeight: '600',
              fontSize: '1.1rem'
            }}>
              {match.result}
            </div>
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center',
            color: 'rgba(255,255,255,0.7)',
            marginTop: '20px',
            fontFamily: 'var(--font-recursive), sans-serif',
            fontSize: '1.1rem'
          }}>
            {match.time || 'Time TBD'}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`${styles.container} ${poiretOne.className}`}>
      {/* Glowing background elements */}
      <div className={styles.glowBackground}>
        <div className={styles.glowPurple}></div>
        <div className={styles.glowBlue}></div>
      </div>

      {/* Loading overlay */}
      {showLoader && (
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

      {/* Main content */}
      <div style={{
          position: 'relative',
          minHeight: '100vh',
          color: '#fafafa',
          fontFamily: 'var(--font-recursive), sans-serif',
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
      
        {/* Darker content background */}
        <div style={{
          borderRadius: '12px',
          padding: '20px',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              margin: 0,
              textShadow: '0 0 8px rgba(255, 235, 59, 0.3)',
              fontFamily: 'var(--font-poiret), sans-serif'
            }}>
              IPL 2025 Schedule
            </h1>
          </div>

          {/* Search and Filters Section */}
          <div className="filters-section">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search matches..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                }}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="clear-search"
                >
                  <FiX />
                </button>
              )}
            </div>

            <div className="filter-groups">
              <div className="filter-group">
                <h3>Filter by Team:</h3>
                <div className="filter-options">
                  {allTeams.map(team => (
                    <button
                      key={team}
                      onClick={() => toggleTeamFilter(team)}
                      className={`filter-option ${selectedTeams.includes(team) ? 'active' : ''}`}
                    >
                      {team}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <h3>Filter by Venue:</h3>
                <div className="filter-options">
                  {allVenues.map(venue => (
                    <button
                      key={venue}
                      onClick={() => toggleVenueFilter(venue)}
                      className={`filter-option ${selectedVenues.includes(venue) ? 'active' : ''}`}
                    >
                      {venue}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {(searchTerm || selectedTeams.length > 0 || selectedVenues.length > 0) && (
              <div className="active-filters">
                <span>Active filters:</span>
                {searchTerm && (
                  <span className="active-filter">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')}>
                      <FiX size={14} />
                    </button>
                  </span>
                )}
                {selectedTeams.map(team => (
                  <span key={team} className="active-filter">
                    Team: {team}
                    <button onClick={() => toggleTeamFilter(team)}>
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
                {selectedVenues.map(venue => (
                  <span key={venue} className="active-filter">
                    Venue: {venue}
                    <button onClick={() => toggleVenueFilter(venue)}>
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
                <button 
                  onClick={clearAllFilters}
                  className="clear-all"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <SpaceLoader />
        ) : filteredMatches.length > 0 ? (
          <div className="book-container">
            <div className="book-controls">
              <button 
                className={`flip-button prev ${currentPage === 0 ? 'disabled' : ''}`}
                onClick={() => flipPage('prev')}
                disabled={currentPage === 0 || isFlipping}
              >
                <FiChevronLeft size={24} />
              </button>
              
              <div className="page-indicator">
                Match {currentPage + 1} of {filteredMatches.length}
                {filteredMatches.length !== matchesData.length && (
                  <span className="filtered-count">
                    (Filtered from {matchesData.length})
                  </span>
                )}
              </div>
              
              <button 
                className={`flip-button next ${currentPage >= filteredMatches.length - 1 ? 'disabled' : ''}`}
                onClick={() => flipPage('next')}
                disabled={currentPage >= filteredMatches.length - 1 || isFlipping}
              >
                <FiChevronRight size={24} />
              </button>
            </div>
            
            <div 
              className={`book ${isFlipping ? `flipping-${flipDirection}` : ''}`} 
              ref={bookRef}
            >
              <div className="book-page">
                <MatchCard match={filteredMatches[currentPage]} />
              </div>
            </div>
          </div>
        ) : (
          <div className="no-results">
            <h3>No matches found matching your filters</h3>
            <button 
              onClick={clearAllFilters}
              className="clear-filters-button"
            >
              Clear all filters
            </button>
          </div>
        )}
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

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes orbit {
          from { transform: translate(-50%, -50%) rotate(0deg) translate(35px) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translate(35px) rotate(-360deg); }
        }
        
        .book-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 30px;
          perspective: 2000px;
        }
        
        .book {
          position: relative;
          width: 100%;
          max-width: 700px;
          height: 500px;
          transform-style: preserve-3d;
          transition: transform 0.8s ease;
        }
        
        .book.flipping-next {
          animation: flipNext 0.8s ease forwards;
        }
        
        .book.flipping-prev {
          animation: flipPrev 0.8s ease forwards;
        }
        
        @keyframes flipNext {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(-90deg); }
          100% { transform: rotateY(-180deg); }
        }
        
        @keyframes flipPrev {
          0% { transform: rotateY(-180deg); }
          50% { transform: rotateY(-90deg); }
          100% { transform: rotateY(0deg); }
        }
        
        .book-page {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .book-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 30px;
          margin-bottom: 30px;
          width: 100%;
        }
        
        .flip-button {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        
        .flip-button:hover:not(.disabled) {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }
        
        .flip-button.disabled {
          opacity: 0.3;
          cursor: not-allowed;
          transform: none !important;
        }
        
        .page-indicator {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
          font-family: var(--font-recursive), sans-serif;
          min-width: 150px;
          text-align: center;
        }
        
        .match-card {
          position: relative;
          z-index: 1;
          transform-style: preserve-3d;
          transition: transform 0.5s ease, box-shadow 0.5s ease;
        }
        
        .match-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6) !important;
        }
        .filters-section {
          margin-bottom: 30px;
        }
        
        .search-box {
          position: relative;
          margin-bottom: 20px;
          width: 100%;
          max-width: 500px;
        }
        
        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.7);
        }
        
        .search-input {
          width: 100%;
          padding: 12px 20px 12px 45px;
          border-radius: 25px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(0, 0, 0, 0.3);
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }
        
        .clear-search {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          padding: 5px;
        }
        
        .filter-groups {
          display: flex;
          gap: 30px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .filter-group {
          flex: 1;
          min-width: 250px;
        }
        
        .filter-group h3 {
          margin-bottom: 10px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
        }
        
        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .filter-option {
          padding: 8px 15px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(0, 0, 0, 0.3);
          color: white;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .filter-option:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .filter-option.active {
          background: #8b5cf6;
          border-color: #8b5cf6;
          color: white;
        }
        
        .active-filters {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          margin-top: 15px;
          font-size: 0.9rem;
        }
        
        .active-filters span:first-child {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .active-filter {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.1);
        }
        
        .active-filter button {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        
        .clear-all {
          margin-left: 10px;
          padding: 5px 10px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #ff5252;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .clear-all:hover {
          background: rgba(255, 82, 82, 0.2);
        }
        
        .filtered-count {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
          margin-left: 8px;
        }
        
        .no-results {
          text-align: center;
          padding: 40px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          margin-top: 30px;
        }
        
        .no-results h3 {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 20px;
        }
        
        .clear-filters-button {
          padding: 10px 20px;
          border-radius: 25px;
          background: #8b5cf6;
          border: none;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .clear-filters-button:hover {
          background: #7c4dff;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
        }
      `}</style>
    </div>
  );
}