'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Palette, Eye, Check, Plus, Trash2, ExternalLink,
  Github, Twitter, Linkedin, Mail, Code, Layers, Cpu,
  ChevronDown, ChevronUp, Monitor, Smartphone, Lock, Sparkles,
  Diamond, CreditCard, Upload, Camera, Loader2, Image as ImageIcon,
  Copy, X, Star, Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase';
import UPIPaymentModal from '@/components/marketplace/UPIPaymentModal';
import toast from 'react-hot-toast';

const THEMES = [
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    desc: 'Dark glass with aurora gradients',
    preview: {
      bg: 'linear-gradient(135deg, #04040A 0%, #0D0D1F 100%)',
      accent: '#7C3AED',
      glow: 'rgba(124,58,237,0.3)',
    },
  },
  {
    id: 'terminal',
    name: 'Terminal',
    desc: 'Hacker aesthetic with green on black',
    preview: {
      bg: 'linear-gradient(135deg, #0A0A0A 0%, #111 100%)',
      accent: '#00FF41',
      glow: 'rgba(0,255,65,0.2)',
    },
  },
  {
    id: 'bento',
    name: 'Bento Grid',
    desc: 'Card-based minimal layout',
    preview: {
      bg: 'linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 100%)',
      accent: '#F59E0B',
      glow: 'rgba(245,158,11,0.2)',
    },
  },
  {
    id: 'neon',
    name: 'Neon City',
    desc: 'Cyberpunk neon on dark',
    preview: {
      bg: 'linear-gradient(135deg, #050010 0%, #100020 100%)',
      accent: '#FF0099',
      glow: 'rgba(255,0,153,0.3)',
    },
  },
  {
    id: '3d-glass',
    name: '3D Modern Glass',
    desc: 'Premium depth with glass cards',
    premium: true,
    price: 299,
    preview: {
      bg: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
      accent: '#FFFFFF',
      glow: 'rgba(255,255,255,0.4)',
    },
  },
  {
    id: '3d-cyber',
    name: '3D Cyber Neon',
    desc: 'Glowing 3D cyberpunk grid',
    premium: true,
    price: 299,
    preview: {
      bg: 'linear-gradient(135deg, #000 0%, #050510 100%)',
      accent: '#00FFFF',
      glow: 'rgba(0,255,255,0.5)',
    },
  },
  {
    id: 'anime-midnight',
    name: 'Anime Midnight',
    desc: 'Cyberpunk dark with neon pink & purple',
    premium: true,
    price: 299,
    preview: {
      bg: 'linear-gradient(135deg, #0B0E14 0%, #1A1A2E 100%)',
      accent: '#FF0099',
      glow: 'rgba(255,0,153,0.3)',
    },
  },
];

const DEFAULT_PORTFOLIO = {
  name: 'Arjun Sharma',
  title: 'Full Stack Developer',
  tagline: 'I build things for the web 🚀',
  bio: "Hey! I'm a B.Tech CS student at IIT Delhi. I love building web apps, exploring ML, and contributing to open source. Currently working on StudentHub.",
  avatar: '',
  location: 'New Delhi, India',
  email: 'arjun@example.com',
  github: 'github.com/arjunsharma',
  linkedin: 'linkedin.com/in/arjunsharma',
  twitter: '@arjun_dev',
  website: 'arjun.dev',
  skills: ['React', 'Next.js', 'TypeScript', 'Python', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 'AWS'],
  projects: [
    { id: '1', name: 'StudentHub', desc: 'Full-stack student gig marketplace', tech: ['Next.js', 'Supabase'], link: '#', stars: 142 },
    { id: '2', name: 'ML Price Predictor', desc: 'Housing price prediction using XGBoost', tech: ['Python', 'sklearn'], link: '#', stars: 87 },
    { id: '3', name: 'DevFlow CLI', desc: 'Developer productivity CLI tool', tech: ['Node.js', 'Commander'], link: '#', stars: 56 },
  ],
  stats: [
    { label: 'GitHub Stars', value: '285' },
    { label: 'Open Source Contributions', value: '47' },
    { label: 'Projects Built', value: '18' },
    { label: 'Cups of Coffee', value: '∞' },
  ],
};

// THEME PREVIEWS
function GlassmorphismPreview({ data }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, #04040A 0%, #0D0D1F 100%)', padding: '32px 24px', fontFamily: 'system-ui', minHeight: '500px', position: 'relative', overflow: 'hidden' }}>
      {/* Orbs */}
      <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'rgba(124,58,237,0.2)', filter: 'blur(60px)', top: '-50px', left: '-50px', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', width: '150px', height: '150px', background: 'rgba(245,158,11,0.1)', filter: 'blur(40px)', bottom: '20px', right: '-20px', borderRadius: '50%' }} />

      {/* Hero */}
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 0 30px rgba(124,58,237,0.4)', overflow: 'hidden' }}>
          {data.avatar ? (
            <img src={data.avatar} alt={data.name} style={{ width: '100%', height: '100%', objectCover: 'cover' }} />
          ) : (
            data.name[0]
          )}
        </div>
        <h1 style={{ color: '#F8F8FF', fontSize: '22px', fontWeight: '700', margin: '0 0 4px' }}>{data.name}</h1>
        <p style={{ color: '#8B5CF6', fontSize: '13px', margin: '0 0 8px' }}>{data.title}</p>
        <p style={{ color: '#9BA3B5', fontSize: '11px', margin: 0 }}>{data.tagline}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '20px' }}>
        {data.stats.slice(0, 4).map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
            <div style={{ color: '#8B5CF6', fontSize: '16px', fontWeight: '700' }}>{s.value}</div>
            <div style={{ color: '#9BA3B5', fontSize: '9px', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ color: '#9BA3B5', fontSize: '10px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Skills</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {data.skills.slice(0, 6).map((skill, i) => (
            <span key={i} style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#C4B5FD', borderRadius: '100px', padding: '3px 10px', fontSize: '10px' }}>{skill}</span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div>
        <p style={{ color: '#9BA3B5', fontSize: '10px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Projects</p>
        {data.projects.slice(0, 2).map((proj, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '10px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ color: '#F8F8FF', fontSize: '12px', fontWeight: '600' }}>{proj.name}</span>
              <span style={{ color: '#F59E0B', fontSize: '10px' }}>⭐ {proj.stars}</span>
            </div>
            <p style={{ color: '#9BA3B5', fontSize: '10px', margin: '0 0 6px' }}>{proj.desc}</p>
            <div style={{ display: 'flex', gap: '4px' }}>
              {proj.tech.map((t, j) => <span key={j} style={{ background: 'rgba(255,255,255,0.06)', color: '#9BA3B5', borderRadius: '4px', padding: '1px 6px', fontSize: '9px' }}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TerminalPreview({ data }) {
  return (
    <div style={{ background: '#0A0A0A', padding: '24px', fontFamily: '"Courier New", monospace', minHeight: '500px', color: '#00FF41' }}>
      {/* Terminal header */}
      <div style={{ background: '#1A1A1A', borderRadius: '8px 8px 0 0', padding: '8px 12px', display: 'flex', gap: '6px', marginBottom: '0' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F57' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28CA41' }} />
        <span style={{ color: '#666', fontSize: '11px', marginLeft: '8px' }}>~/portfolio</span>
      </div>
      <div style={{ background: '#111', padding: '20px', borderRadius: '0 0 8px 8px' }}>
        <p style={{ margin: '0 0 8px', opacity: 0.5, fontSize: '11px' }}># Last login: {new Date().toDateString()}</p>
        <p style={{ margin: '0 0 16px', fontSize: '11px' }}>$ whoami</p>
        <p style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 'bold' }}>{data.name}</p>
        <p style={{ margin: '0 0 16px', opacity: 0.7, fontSize: '11px' }}>{data.title} @ {data.location}</p>
        <p style={{ margin: '0 0 16px', fontSize: '11px' }}>$ cat bio.txt</p>
        <p style={{ margin: '0 0 16px', opacity: 0.8, fontSize: '11px', lineHeight: '1.6' }}>{data.bio}</p>
        <p style={{ margin: '0 0 8px', fontSize: '11px' }}>$ ls ./skills</p>
        <p style={{ margin: '0 0 16px', opacity: 0.8, fontSize: '11px' }}>{data.skills.join('  ')}</p>
        <p style={{ margin: '0 0 8px', fontSize: '11px' }}>$ ls ./projects</p>
        {data.projects.map((p, i) => (
          <p key={i} style={{ margin: '0 0 4px', opacity: 0.8, fontSize: '11px' }}>drwxr-xr-x  {p.name}/   <span style={{ opacity: 0.5 }}>{p.desc}</span></p>
        ))}
        <p style={{ margin: '16px 0 0', fontSize: '11px' }}>$ <span style={{ animation: 'blink 1s step-end infinite' }}>█</span></p>
      </div>
    </div>
  );
}

function BentoPreview({ data }) {
  return (
    <div style={{ background: '#0F0F1A', padding: '20px', minHeight: '500px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto', gap: '12px' }}>
      {/* Name card - spans 2 cols */}
      <div style={{ gridColumn: 'span 2', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '16px', padding: '20px' }}>
        <div style={{ fontSize: '22px', fontWeight: '800', color: '#F8F8FF', fontFamily: 'system-ui', marginBottom: '4px' }}>{data.name}</div>
        <div style={{ fontSize: '13px', color: '#F59E0B', fontFamily: 'system-ui', marginBottom: '8px' }}>{data.title}</div>
        <div style={{ fontSize: '11px', color: '#9BA3B5', fontFamily: 'system-ui' }}>{data.tagline}</div>
      </div>
      {/* Avatar/location */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#F59E0B', fontWeight: 'bold', marginBottom: '8px', overflow: 'hidden' }}>
          {data.avatar ? (
            <img src={data.avatar} alt={data.name} style={{ width: '100%', height: '100%', objectCover: 'cover' }} />
          ) : (
            data.name[0]
          )}
        </div>
        <div style={{ fontSize: '10px', color: '#9BA3B5', fontFamily: 'system-ui', textAlign: 'center' }}>📍 {data.location}</div>
      </div>
      {/* Bio - spans full width */}
      <div style={{ gridColumn: 'span 3', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '16px' }}>
        <div style={{ fontSize: '10px', color: '#F59E0B', fontFamily: 'system-ui', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>About</div>
        <div style={{ fontSize: '11px', color: '#9BA3B5', fontFamily: 'system-ui', lineHeight: '1.6' }}>{data.bio}</div>
      </div>
      {/* Skills */}
      <div style={{ gridColumn: 'span 2', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px' }}>
        <div style={{ fontSize: '10px', color: '#F59E0B', fontFamily: 'system-ui', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Skills</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {data.skills.slice(0, 5).map((s, i) => <span key={i} style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)', color: '#FDE68A', borderRadius: '100px', padding: '3px 10px', fontSize: '10px', fontFamily: 'system-ui' }}>{s}</span>)}
        </div>
      </div>
      {/* Stats */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px' }}>
        {data.stats.slice(0, 2).map((s, i) => (
          <div key={i} style={{ marginBottom: '12px' }}>
            <div style={{ color: '#F59E0B', fontSize: '18px', fontWeight: '700', fontFamily: 'system-ui' }}>{s.value}</div>
            <div style={{ color: '#9BA3B5', fontSize: '9px', fontFamily: 'system-ui' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NeonPreview({ data }) {
  return (
    <div style={{ background: '#050010', padding: '28px 24px', fontFamily: 'system-ui', minHeight: '500px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'transparent', border: '2px solid #FF0099', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: '#FF0099', boxShadow: '0 0 20px #FF0099, 0 0 40px rgba(255,0,153,0.3)', overflow: 'hidden' }}>
          {data.avatar ? (
            <img src={data.avatar} alt={data.name} style={{ width: '100%', height: '100%', objectCover: 'cover' }} />
          ) : (
            data.name[0]
          )}
        </div>
        <h1 style={{ color: '#FF0099', fontSize: '22px', fontWeight: '700', margin: '0 0 4px', textShadow: '0 0 20px rgba(255,0,153,0.8)' }}>{data.name}</h1>
        <p style={{ color: '#00FFFF', fontSize: '12px', margin: '0 0 6px', textShadow: '0 0 10px rgba(0,255,255,0.6)' }}>{data.title}</p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>{data.tagline}</p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '20px' }}>
        {data.skills.slice(0, 7).map((s, i) => (
          <span key={i} style={{ border: `1px solid ${i % 2 === 0 ? '#FF0099' : '#00FFFF'}`, color: i % 2 === 0 ? '#FF0099' : '#00FFFF', borderRadius: '4px', padding: '3px 10px', fontSize: '10px', boxShadow: `0 0 8px ${i % 2 === 0 ? 'rgba(255,0,153,0.3)' : 'rgba(0,255,255,0.3)'}` }}>{s}</span>
        ))}
      </div>
      {data.projects.slice(0, 2).map((proj, i) => (
        <div key={i} style={{ border: '1px solid rgba(255,0,153,0.3)', borderRadius: '8px', padding: '12px', marginBottom: '10px', background: 'rgba(255,0,153,0.05)' }}>
          <div style={{ color: '#FF0099', fontSize: '13px', fontWeight: '600', marginBottom: '4px', textShadow: '0 0 8px rgba(255,0,153,0.5)' }}>{proj.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px' }}>{proj.desc}</div>
        </div>
      ))}
    </div>
  );
}

function Glass3DPreview({ data }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', padding: '32px 24px', minHeight: '550px', perspective: '1000px', overflow: 'hidden' }}>
      <motion.div 
        initial={{ rotateX: 15, y: 20, opacity: 0 }}
        animate={{ rotateX: 5, y: 0, opacity: 1 }}
        style={{ transformStyle: 'preserve-3d', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '24px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
      >
        <div style={{ transform: 'translateZ(40px)', textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '20px', background: 'white', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.5)' }}>
            {data.avatar ? (
              <img src={data.avatar} alt={data.name} style={{ width: '100%', height: '100%', objectCover: 'cover' }} />
            ) : (
              data.name[0]
            )}
          </div>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>{data.name}</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>{data.title}</p>
        </div>
        <div style={{ transform: 'translateZ(20px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {data.stats.slice(0, 2).map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function Cyber3DPreview({ data }) {
  return (
    <div style={{ background: '#000', padding: '32px 24px', minHeight: '550px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px', transform: 'perspective(500px) rotateX(60deg) translateY(-100px)', opacity: 0.3 }} />
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'relative', background: 'rgba(0,255,255,0.05)', border: '2px solid #00FFFF', borderRadius: '4px', padding: '24px', boxShadow: '0 0 20px rgba(0,255,255,0.2), inset 0 0 20px rgba(0,255,255,0.1)' }}
      >
        <h1 style={{ color: '#00FFFF', fontSize: '28px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', textShadow: '0 0 10px #00FFFF' }}>{data.name}</h1>
        <p style={{ color: '#FF0099', fontSize: '14px', fontWeight: '600', marginBottom: '20px' }}>// {data.title}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {data.skills.slice(0, 5).map((s, i) => (
            <span key={i} style={{ background: 'transparent', border: '1px solid #FF0099', color: '#FF0099', padding: '4px 12px', fontSize: '10px', textTransform: 'uppercase' }}>{s}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function AnimeMidnightPreview({ data }) {
  return (
    <div style={{ background: '#0B0E14', padding: '0', minHeight: '550px', position: 'relative', overflow: 'hidden', fontFamily: 'system-ui' }}>
      {/* Anime-inspired background orbs */}
      <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,0,153,0.1) 0%, transparent 70%)', top: '-100px', right: '-100px', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', bottom: '50px', left: '-100px', borderRadius: '50%' }} />

      {/* Persistent Floating Chat Bubble (FAB) */}
      <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '48px', height: '48px', background: 'linear-gradient(to bottom right, #FF0099, #7C3AED)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 15px rgba(255,0,153,0.4)', zIndex: 10, cursor: 'pointer' }}>
        <Mail size={20} />
      </div>

      {/* Hero Header */}
      <div style={{ padding: '40px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(45deg, #FF0099, #7C3AED)', margin: '0 auto 20px', padding: '3px', boxShadow: '0 0 20px rgba(255,0,153,0.3)' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '22px', background: '#0B0E14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', color: '#F8F8FF', overflow: 'hidden' }}>
            {data.avatar ? (
              <img src={data.avatar} alt={data.name} style={{ width: '100%', height: '100%', objectCover: 'cover' }} />
            ) : (
              (data.name || 'U')[0]
            )}
          </div>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#F8F8FF', marginBottom: '8px', letterSpacing: '-0.5px' }}>
          {(data.name || 'User').split(' ')[0]} <span style={{ background: 'linear-gradient(to right, #FF0099, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{(data.name || '').split(' ').slice(1).join(' ')}</span>
        </h1>
        <p style={{ color: '#9BA3B5', fontSize: '14px', maxWidth: '300px', margin: '0 auto 24px', lineHeight: '1.5' }}>{data.tagline}</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(to right, #FF0099, #7C3AED)', padding: '1px', borderRadius: '12px' }}>
            <div style={{ background: '#0B0E14', color: '#F8F8FF', padding: '8px 20px', borderRadius: '11px', fontSize: '13px', fontWeight: '700' }}>Contact Me</div>
          </div>
        </div>
      </div>

      {/* Simple Stats Row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', padding: '0 24px 32px' }}>
        {data.stats.slice(0, 2).map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ color: '#FF0099', fontSize: '20px', fontWeight: '900' }}>{s.value}</div>
            <div style={{ color: '#9BA3B5', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Experience Bars Section */}
      <div style={{ padding: '0 24px 32px' }}>
        <p style={{ color: '#F8F8FF', fontSize: '12px', fontWeight: '800', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Skill Mastery</p>
        <div style={{ spaceY: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.skills.slice(0, 3).map((skill, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#F8F8FF', fontSize: '11px', fontWeight: '600' }}>{skill}</span>
                <span style={{ color: '#FF0099', fontSize: '11px', fontWeight: '700' }}>{85 - (i * 5)}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${85 - (i * 5)}%`, background: 'linear-gradient(to right, #FF0099, #7C3AED)', borderRadius: '100px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Cards Section */}
      <div style={{ padding: '0 24px 40px' }}>
        <p style={{ color: '#F8F8FF', fontSize: '12px', fontWeight: '800', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Top Case Studies</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.projects.slice(0, 2).map((proj, i) => (
            <div key={i} style={{ background: '#131822', borderRadius: '20px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ color: '#F8F8FF', fontSize: '14px', fontWeight: '700' }}>{proj.name}</h4>
                <div style={{ color: '#FF0099', fontSize: '10px' }}>
                  <Star size={10} fill="currentColor" /> {proj.stars}
                </div>
              </div>
              <p style={{ color: '#9BA3B5', fontSize: '11px', lineHeight: '1.5', marginBottom: '12px' }}>{proj.desc}</p>
              <div style={{ display: 'flex', gap: '6px' }}>
                {proj.tech.slice(0, 3).map((t, j) => (
                  <span key={j} style={{ background: 'rgba(255,255,255,0.03)', color: '#FF0099', border: '1px solid rgba(255,0,153,0.1)', padding: '2px 8px', borderRadius: '6px', fontSize: '9px', fontWeight: '600' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PREVIEW_COMPONENTS = {
  glassmorphism: GlassmorphismPreview,
  terminal: TerminalPreview,
  bento: BentoPreview,
  neon: NeonPreview,
  '3d-glass': Glass3DPreview,
  '3d-cyber': Cyber3DPreview,
  'anime-midnight': AnimeMidnightPreview,
};

function Section({ title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 hover:bg-glass transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
            <Icon size={15} className="text-violet-400" />
          </div>
          <span className="font-display font-600 text-sm text-ink">{title}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-ink-subtle" /> : <ChevronDown size={16} className="text-ink-subtle" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-glass-border">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PortfolioPage() {
  const { user } = useAuth();
  const [data, setData] = useState(DEFAULT_PORTFOLIO);
  const [theme, setTheme] = useState('glassmorphism');
  const [activeTab, setActiveTab] = useState('edit');
  const [device, setDevice] = useState('desktop');
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [unlockedThemes, setUnlockedThemes] = useState(user?.unlocked_themes || []);
  const [unlocking, setUnlocking] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [upiModalData, setUpiModalData] = useState({ amount: 0, note: '', themeId: '' });

  // Watermark Freemium State
  const [isTempPremium, setIsTempPremium] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [adTimeLeft, setAdTimeLeft] = useState(0);

  // Sync unlocked themes
  useEffect(() => {
    if (user?.unlocked_themes) setUnlockedThemes(user.unlocked_themes);
  }, [user]);

  const supabase = createClient();

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolios')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolios')
        .getPublicUrl(filePath);

      update('avatar', publicUrl);
      toast.success('Photo uploaded!');
    } catch (err) {
      toast.error('Upload failed. Check bucket policies.');
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = async () => {
    const currentTheme = THEMES.find(t => t.id === theme);
    const isLocked = currentTheme?.premium && !unlockedThemes.includes(theme);

    if (isLocked) {
      setUpiModalData({ 
        amount: currentTheme.price, 
        note: `Unlock Theme: ${currentTheme.name}`,
        themeId: theme 
      });
      setShowUPIModal(true);
      return;
    }

    setPublishing(true);
    await new Promise(r => setTimeout(r, 1200));
    setPublishing(false);
    setPublished(true);
    toast.success('Portfolio Published Live! 🚀');
  };

  const [showCodeModal, setShowCodeModal] = useState(false);

  const handleExportCode = async () => {
    const currentTheme = THEMES.find(t => t.id === theme);
    const isLocked = currentTheme?.premium && !unlockedThemes.includes(theme);

    if (isLocked) {
      setUpiModalData({ 
        amount: currentTheme.price, 
        note: `Unlock Code: ${currentTheme.name}`,
        themeId: theme 
      });
      setShowUPIModal(true);
      return;
    } else {
      setShowCodeModal(true);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard! 📋');
  };

  const getSourceCode = () => {
    return `
import React from 'react';
import { motion } from 'framer-motion';

// ${theme.toUpperCase()} PORTFOLIO COMPONENT
// Premium Portfolio Template for ${data.name}

export default function Portfolio() {
  const data = ${JSON.stringify(data, null, 2)};

  return (
    <div className="portfolio-container">
      {/* Porting the ${theme} template here... */}
      <h1>{data.name}</h1>
      <p>{data.title}</p>
      {/* Full CSS and Framework details included in pro package */}
    </div>
  );
}`;
  };

  const handleUnlockBundle = async () => {
    setUpiModalData({ 
      amount: 499, 
      note: 'Unlock 3D Template Bundle',
      themeId: 'bundle' 
    });
    setShowUPIModal(true);
  };

  const update = (field, value) => setData(prev => ({ ...prev, [field]: value }));

  const handlePaymentSuccess = async (proofUrl, transactionId) => {
    setUnlocking(true);
    try {
      // Create a theme unlock request in database
      const { error } = await supabase.from('theme_unlock_requests').insert([{
        user_id: user.id,
        theme_id: upiModalData.themeId,
        amount: upiModalData.amount,
        payment_proof_url: proofUrl,
        transaction_id: transactionId,
        status: 'pending'
      }]);

      if (error) throw error;
      
      toast.success(
        upiModalData.themeId === 'portfolio_premium' 
          ? 'Payment submitted! Admin will permanently remove watermarks shortly.' 
          : 'Payment proof submitted! Admin will unlock this theme shortly.'
      );
      setShowUPIModal(false);
      setShowRemoveModal(false);
    } catch (err) {
      toast.error('Failed to submit proof');
    } finally {
      setUnlocking(false);
    }
  };

  const handleWatchAd = () => {
    setAdTimeLeft(15);
    const interval = setInterval(() => {
      setAdTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTempPremium(true);
          setShowRemoveModal(false);
          toast.success('Watermark removed for this session!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      update('skills', [...data.skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (idx) => update('skills', data.skills.filter((_, i) => i !== idx));

  const addProject = () => {
    update('projects', [...data.projects, { id: Date.now().toString(), name: '', desc: '', tech: [], link: '', stars: 0 }]);
  };

  const updateProject = (id, field, value) => {
    update('projects', data.projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removeProject = (id) => update('projects', data.projects.filter(p => p.id !== id));

  const PreviewComponent = PREVIEW_COMPONENTS[theme];
  const currentThemeData = THEMES.find(t => t.id === theme);
  const isCurrentlyLocked = currentThemeData?.premium && !unlockedThemes.includes(theme);

  // Watermark Logic
  const hasPortfolioPremium = unlockedThemes.includes('portfolio_premium');
  const isPremium = hasPortfolioPremium || isTempPremium;
  const showWatermark = !currentThemeData?.premium && !isPremium;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-700 text-ink">Portfolio Maker</h1>
          <p className="text-sm text-ink-muted mt-1">Build a stunning personal website — no code required</p>
        </div>
        <div className="flex gap-3">
          {showWatermark && (
            <Button variant="ghost" className="text-gold-400 hover:text-gold-300 hidden md:flex" onClick={() => setShowRemoveModal(true)}>
              <Zap size={15} />
              Remove Watermark
            </Button>
          )}
          <Button variant="secondary" onClick={handleExportCode}>
            <Code size={15} />
            Export Code
          </Button>
          {published ? (
            <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
              <Check size={15} />
              Published at studenthub.in/{data.name.toLowerCase().replace(/\s+/g, '')}
            </div>
          ) : (
            <Button variant={isCurrentlyLocked ? 'gold' : 'gold'} onClick={handlePublish} loading={publishing || unlocking}>
              <Globe size={15} />
              {publishing ? 'Publishing...' : unlocking ? 'Unlocking...' : isCurrentlyLocked ? 'Unlock & Publish' : 'Publish Site'}
            </Button>
          )}
        </div>
      </div>

      {/* Theme Selector */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest flex items-center">
            <Palette size={12} className="mr-1.5" />
            Choose Theme
          </p>
          {(!unlockedThemes.includes('3d-glass') || !unlockedThemes.includes('3d-cyber')) && (
            <button 
              onClick={handleUnlockBundle}
              className="text-[10px] font-bold text-gold-400 bg-gold-400/10 px-3 py-1 rounded-lg border border-gold-400/20 hover:bg-gold-400/20 transition-all flex items-center gap-1.5"
            >
              <Sparkles size={10} />
              Unlock 3D Bundle (₹499)
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {THEMES.map(t => {
            const isLocked = t.premium && !unlockedThemes.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-3 rounded-xl border transition-all text-left relative overflow-hidden group ${
                  theme === t.id ? 'border-violet-500/50 bg-violet-500/10' : 'border-glass-border hover:border-violet-500/25'
                }`}
              >
                {t.premium && (
                  <div className="absolute top-1 right-1 z-10">
                    <div className={`p-1 rounded-md ${isLocked ? 'bg-gold-500/20 text-gold-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {isLocked ? <Lock size={10} /> : <Diamond size={10} />}
                    </div>
                  </div>
                )}
                <div
                  className="w-full h-10 rounded-lg mb-2 relative overflow-hidden"
                  style={{ background: t.preview.bg, boxShadow: theme === t.id ? `0 0 20px ${t.preview.glow}` : 'none' }}
                >
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: t.preview.accent }} />
                </div>
                <p className="text-xs font-display font-600 text-ink line-clamp-1">{t.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9px] text-ink-subtle">{t.premium ? `₹${t.price}` : 'Free'}</span>
                  {theme === t.id && <Check size={9} className="text-violet-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex items-center gap-4">
        <div className="flex gap-2 p-1 glass rounded-xl w-fit">
          {['edit', 'preview'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-display font-500 transition-all capitalize ${
                activeTab === tab ? 'bg-violet-500/20 text-violet-300 border border-violet-500/25' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {tab === 'edit' ? '✏️ Editor' : '👁 Preview'}
            </button>
          ))}
        </div>
        {activeTab === 'preview' && (
          <div className="flex gap-2 p-1 glass rounded-xl">
            {[['desktop', Monitor], ['mobile', Smartphone]].map(([d, Icon]) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`p-2 rounded-lg transition-all ${device === d ? 'bg-violet-500/20 text-violet-300' : 'text-ink-subtle hover:text-ink'}`}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'edit' ? (
          <motion.div key="edit" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="space-y-4">

            {/* Personal */}
            <Section title="Personal Info" icon={Globe}>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Photo Upload Zone */}
                <div className="sm:col-span-2">
                  <label className="block text-xs text-ink-muted mb-2 font-medium">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-glass-border bg-glass/20 flex items-center justify-center relative overflow-hidden group">
                      {data.avatar ? (
                        <img src={data.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <Camera size={24} className="text-ink-subtle" />
                      )}
                      {uploading ? (
                        <div className="absolute inset-0 bg-void/60 flex items-center justify-center">
                          <Loader2 size={16} className="text-white animate-spin" />
                        </div>
                      ) : (
                        <label className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 bg-void/40 transition-opacity flex items-center justify-center text-[10px] text-white font-bold">
                          Change
                          <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                        </label>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-ink-subtle mb-2">Drag and drop or click to upload. Max 5MB (JPG, PNG, WebP)</p>
                      <input 
                        className="input-field text-[10px] py-1.5" 
                        placeholder="Or paste image URL..." 
                        value={data.avatar} 
                        onChange={e => update('avatar', e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
                {[
                  { field: 'name', label: 'Full Name' },
                  { field: 'title', label: 'Professional Title' },
                  { field: 'tagline', label: 'Catchy Tagline', span: true },
                  { field: 'location', label: 'Location' },
                  { field: 'email', label: 'Email' },
                  { field: 'github', label: 'GitHub URL' },
                  { field: 'linkedin', label: 'LinkedIn URL' },
                  { field: 'twitter', label: 'Twitter Handle' },
                  { field: 'website', label: 'Personal Website' },
                ].map(({ field, label, span }) => (
                  <div key={field} className={span ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs text-ink-muted mb-1.5 font-medium">{label}</label>
                    <input className="input-field text-sm py-2" value={data[field]} onChange={e => update(field, e.target.value)} />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-xs text-ink-muted mb-1.5 font-medium">Bio</label>
                  <textarea className="input-field text-sm resize-none" rows={3} value={data.bio} onChange={e => update('bio', e.target.value)} />
                </div>
              </div>
            </Section>

            {/* Skills */}
            <Section title="Skills" icon={Code}>
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium">
                      {skill}
                      <button onClick={() => removeSkill(i)} className="hover:text-red-400 transition-colors">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    className="input-field text-sm py-2 flex-1"
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSkill()}
                  />
                  <Button variant="secondary" size="sm" onClick={addSkill}>
                    <Plus size={14} />
                    Add
                  </Button>
                </div>
              </div>
            </Section>

            {/* Projects */}
            <Section title="Projects" icon={Layers}>
              <div className="space-y-4 mt-4">
                {data.projects.map(proj => (
                  <div key={proj.id} className="p-4 border border-glass-border rounded-xl space-y-3 relative">
                    <button onClick={() => removeProject(proj.id)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-500/10 text-ink-subtle hover:text-red-400 transition-all">
                      <Trash2 size={13} />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-ink-muted mb-1.5">Project Name</label>
                        <input className="input-field text-sm py-2" value={proj.name} onChange={e => updateProject(proj.id, 'name', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs text-ink-muted mb-1.5">GitHub Stars</label>
                        <input className="input-field text-sm py-2" type="number" value={proj.stars} onChange={e => updateProject(proj.id, 'stars', e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-ink-muted mb-1.5">Description</label>
                        <input className="input-field text-sm py-2" value={proj.desc} onChange={e => updateProject(proj.id, 'desc', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs text-ink-muted mb-1.5">Tech (comma-separated)</label>
                        <input className="input-field text-sm py-2" value={Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech} onChange={e => updateProject(proj.id, 'tech', e.target.value.split(',').map(s => s.trim()))} />
                      </div>
                      <div>
                        <label className="block text-xs text-ink-muted mb-1.5">Project Link</label>
                        <input className="input-field text-sm py-2" value={proj.link} onChange={e => updateProject(proj.id, 'link', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addProject}
                  className="w-full py-3 border border-dashed border-glass-border rounded-xl text-sm text-ink-subtle hover:text-ink hover:border-violet-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>
            </Section>

            {/* Stats */}
            <Section title="Stats & Numbers" icon={Cpu}>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {data.stats.map((stat, i) => (
                  <div key={i} className="p-3 border border-glass-border rounded-xl">
                    <input className="input-field text-sm py-1.5 mb-2" placeholder="Value (e.g. 285)" value={stat.value} onChange={e => update('stats', data.stats.map((s, j) => j === i ? { ...s, value: e.target.value } : s))} />
                    <input className="input-field text-xs py-1.5" placeholder="Label" value={stat.label} onChange={e => update('stats', data.stats.map((s, j) => j === i ? { ...s, label: e.target.value } : s))} />
                  </div>
                ))}
              </div>
            </Section>

          </motion.div>
        ) : (
          <motion.div key="preview" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <div className={`mx-auto transition-all duration-300 ${device === 'mobile' ? 'max-w-sm' : 'max-w-full'}`}>
                <div className="glass-card rounded-3xl overflow-hidden border border-glass-border relative group">
                  {/* Browser chrome */}
                  <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-glass-border bg-void/20">
                    <div className="flex items-center gap-2 w-full max-w-full">
                      <div className="flex gap-1.5 shrink-0">
                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                        <div className="w-3 h-3 rounded-full bg-gold-500/60" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                      </div>
                      <div className="flex-1 mx-4 px-3 py-1 bg-glass rounded-lg text-xs text-ink-subtle font-mono text-center truncate">
                        studenthub.in/{data.name.toLowerCase().replace(/\s+/g, '')}
                      </div>
                      {showWatermark && (
                        <button onClick={() => setShowRemoveModal(true)} className="shrink-0 text-gold-400 hover:text-gold-300 md:hidden bg-gold-500/10 p-1.5 rounded-md" title="Remove Watermark">
                          <Zap size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Watermark Overlay for Free Themes */}
                  {showWatermark && (
                    <div className="absolute inset-0 z-[40] pointer-events-none flex items-center justify-center overflow-hidden">
                      <div className="transform -rotate-45 text-white/5 text-[min(8vw,4rem)] font-black whitespace-nowrap select-none tracking-widest uppercase mix-blend-overlay">
                        Made with StudentHub
                      </div>
                    </div>
                  )}

                  {/* Watermark Overlay for Locked Themes */}
                  {isCurrentlyLocked && (
                    <div className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center overflow-hidden">
                      <div className="grid grid-cols-3 gap-12 rotate-[-35deg] opacity-[0.03]">
                        {Array(30).fill(0).map((_, i) => (
                          <span key={i} className="text-4xl font-black whitespace-nowrap">PREVIEW MODE</span>
                        ))}
                      </div>
                      <div className="pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2 bg-gold-400 text-void font-bold px-4 py-2 rounded-full text-xs shadow-2xl flex items-center gap-2 animate-bounce">
                        <Lock size={12} /> Unlock this theme to Publish Live
                      </div>
                    </div>
                  )}

                  <div className={`overflow-y-auto max-h-[600px] ${isCurrentlyLocked ? 'grayscale-[0.2]' : ''}`}>
                    <PreviewComponent data={data} />
                  </div>
                </div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Source Code Modal */}
      <AnimatePresence>
        {showCodeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCodeModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[80vh] overflow-hidden rounded-3xl border border-white/10 bg-[#0f172a] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#1e293b]">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Code className="text-blue-400" />
                    Source Code: {theme}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Copy and paste this into early React projects</p>
                </div>
                <button onClick={() => setShowCodeModal(false)} className="p-2 rounded-xl hover:bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-[#020617]">
                <pre className="text-sm font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap">
                  {getSourceCode()}
                </pre>
              </div>
              <div className="p-6 border-t border-white/10 bg-[#1e293b] flex items-center justify-end gap-4">
                <p className="text-xs text-slate-500">Include Framer Motion and Tailwind CSS for full effects</p>
                <Button variant="gold" onClick={() => copyCode(getSourceCode())}>
                  <Copy size={16} className="mr-2" />
                  Copy to Clipboard
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Portfolio Share Modal */}
      <AnimatePresence>
        {showRemoveModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" onClick={() => setShowRemoveModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm glass-card rounded-3xl p-8 border border-glass-border shadow-2xl text-center">
              <button onClick={() => setShowRemoveModal(false)} className="absolute top-4 right-4 text-ink-subtle hover:text-ink"><X size={20} /></button>
              <div className="w-16 h-16 rounded-full bg-gold-400/20 flex items-center justify-center mx-auto mb-4 border border-gold-400/30">
                <Zap size={24} className="text-gold-400" />
              </div>
              <h3 className="font-display text-2xl font-800 text-ink mb-2">Remove Watermark</h3>
              <p className="text-sm text-ink-muted mb-6">Support us to publish clean portfolios without our branding across all your free themes!</p>
              
              <div className="space-y-3">
                <Button 
                  variant="gold" 
                  className="w-full justify-center" 
                  onClick={() => { 
                    setShowRemoveModal(false); 
                    setUpiModalData({ amount: 29, note: 'Permanent Portfolio Watermark Removal', themeId: 'portfolio_premium' });
                    setShowUPIModal(true); 
                  }}
                >
                  Pay ₹29 (Permanent Unlock)
                </Button>
                
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-glass-border"></div>
                  <span className="flex-shrink-0 mx-4 text-xs text-ink-subtle">or</span>
                  <div className="flex-grow border-t border-glass-border"></div>
                </div>

                <Button 
                  variant="secondary" 
                  className="w-full justify-center relative overflow-hidden" 
                  onClick={handleWatchAd} 
                  disabled={adTimeLeft > 0}
                >
                  {adTimeLeft > 0 ? (
                    <span className="text-amber-400 font-bold tracking-widest">{adTimeLeft}s remaining...</span>
                  ) : (
                    <>Watch Ad (Free Temp Unlock)</>
                  )}
                  {adTimeLeft > 0 && (
                    <div className="absolute bottom-0 left-0 h-1 bg-amber-400 transition-all duration-1000 ease-linear" style={{ width: `${(adTimeLeft / 15) * 100}%` }} />
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {showUPIModal && (
          <UPIPaymentModal
            amount={upiModalData.amount}
            note={upiModalData.note}
            onClose={() => setShowUPIModal(false)}
            onPaymentComplete={handlePaymentSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
