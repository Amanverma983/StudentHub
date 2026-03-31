'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Palette, Eye, Check, Plus, Trash2, ExternalLink,
  Github, Twitter, Linkedin, Mail, Code, Layers, Cpu,
  ChevronDown, ChevronUp, Monitor, Smartphone,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

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
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #4C1D95)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}>
          {data.name[0]}
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
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg,#F59E0B,#D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#0A0A14', fontWeight: 'bold', marginBottom: '8px' }}>{data.name[0]}</div>
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
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'transparent', border: '2px solid #FF0099', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: '#FF0099', boxShadow: '0 0 20px #FF0099, 0 0 40px rgba(255,0,153,0.3)' }}>{data.name[0]}</div>
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

const PREVIEW_COMPONENTS = {
  glassmorphism: GlassmorphismPreview,
  terminal: TerminalPreview,
  bento: BentoPreview,
  neon: NeonPreview,
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

  const update = (field, value) => setData(prev => ({ ...prev, [field]: value }));

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

  const handlePublish = async () => {
    setPublishing(true);
    await new Promise(r => setTimeout(r, 1200));
    setPublishing(false);
    setPublished(true);
  };

  const PreviewComponent = PREVIEW_COMPONENTS[theme];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-700 text-ink">Portfolio Maker</h1>
          <p className="text-sm text-ink-muted mt-1">Build a stunning personal website — no code required</p>
        </div>
        <div className="flex gap-3">
          {published ? (
            <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
              <Check size={15} />
              Published at studenthub.in/{data.name.toLowerCase().replace(/\s+/g, '')}
            </div>
          ) : (
            <Button variant="gold" onClick={handlePublish} loading={publishing}>
              <Globe size={15} />
              {publishing ? 'Publishing...' : 'Publish Site'}
            </Button>
          )}
        </div>
      </div>

      {/* Theme Selector */}
      <div className="glass-card rounded-2xl p-4">
        <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-4">
          <Palette size={12} className="inline mr-1.5" />
          Choose Theme
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`p-3 rounded-xl border transition-all text-left ${
                theme === t.id ? 'border-violet-500/50 bg-violet-500/10' : 'border-glass-border hover:border-violet-500/25'
              }`}
            >
              <div
                className="w-full h-10 rounded-lg mb-2 relative overflow-hidden"
                style={{ background: t.preview.bg, boxShadow: theme === t.id ? `0 0 20px ${t.preview.glow}` : 'none' }}
              >
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: t.preview.accent }} />
                <div className="absolute top-2 left-2 w-4 h-1 rounded" style={{ background: t.preview.accent, opacity: 0.8 }} />
                <div className="absolute top-4 left-2 w-8 h-0.5 rounded bg-white opacity-20" />
                <div className="absolute top-6 left-2 w-6 h-0.5 rounded bg-white opacity-10" />
              </div>
              <p className="text-xs font-display font-600 text-ink">{t.name}</p>
              <p className="text-[10px] text-ink-subtle mt-0.5">{t.desc}</p>
              {theme === t.id && (
                <div className="flex items-center gap-1 mt-1">
                  <Check size={9} className="text-violet-400" />
                  <span className="text-[10px] text-violet-400">Active</span>
                </div>
              )}
            </button>
          ))}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
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
              <div className="glass-card rounded-3xl overflow-hidden border border-glass-border">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-glass-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-gold-500/60" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  </div>
                  <div className="flex-1 mx-4 px-3 py-1 bg-glass rounded-lg text-xs text-ink-subtle font-mono">
                    studenthub.in/{data.name.toLowerCase().replace(/\s+/g, '')}
                  </div>
                  <ExternalLink size={12} className="text-ink-subtle" />
                </div>
                <div className="overflow-y-auto max-h-[600px]">
                  <PreviewComponent data={data} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
