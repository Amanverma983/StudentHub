'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Download, Eye, ChevronDown, ChevronUp,
  FileText, Briefcase, GraduationCap, Award, Code,
  Phone, Mail, MapPin, Linkedin, Globe, Check, Zap, X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import UPIPaymentModal from '@/components/marketplace/UPIPaymentModal';
import { createClient } from '@/lib/supabase';

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern Dark',
    desc: 'Clean lines, bold accents',
    preview: 'bg-gradient-to-br from-surface-2 to-surface-3',
    accent: '#7C3AED',
  },
  {
    id: 'minimal',
    name: 'Minimal Pro',
    desc: 'Whitespace-first, ATS-safe',
    preview: 'bg-gradient-to-br from-gray-900 to-gray-800',
    accent: '#10B981',
  },
  {
    id: 'executive',
    name: 'Executive',
    desc: 'Premium, two-column layout',
    preview: 'bg-gradient-to-br from-slate-900 to-slate-800',
    accent: '#F59E0B',
  },
];

const EMPTY_RESUME = {
  personal: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  achievements: [],
};

const DEFAULT_RESUME = {
  personal: {
    name: 'Arjun Sharma',
    title: 'Full Stack Developer & ML Enthusiast',
    email: 'arjun@example.com',
    phone: '+91 98765 43210',
    location: 'New Delhi, India',
    linkedin: 'linkedin.com/in/arjunsharma',
    website: 'arjun.dev',
    summary: 'Passionate B.Tech student at IIT Delhi with expertise in React, Node.js, and Python. Built 15+ projects and earned ₹48K+ on StudentHub. Seeking internships in product engineering or ML research.',
  },
  experience: [
    {
      id: '1',
      company: 'TechStartup India',
      role: 'Frontend Intern',
      duration: 'May 2024 – Aug 2024',
      location: 'Remote',
      points: [
        'Built React components serving 50K+ daily users, improving load time by 35%',
        'Implemented design system with Tailwind CSS, reducing CSS bundle by 60%',
        'Collaborated with 5-person team using Agile methodology',
      ],
    },
  ],
  education: [
    {
      id: '1',
      institution: 'Indian Institute of Technology, Delhi',
      degree: 'B.Tech Computer Science',
      duration: '2022 – 2026',
      gpa: '8.9 / 10',
      highlights: 'Machine Learning Club President • Hackathon Winner',
    },
  ],
  skills: [
    { id: '1', category: 'Frontend', items: 'React, Next.js, TypeScript, Tailwind CSS' },
    { id: '2', category: 'Backend', items: 'Node.js, Express, Python, FastAPI' },
    { id: '3', category: 'Database', items: 'PostgreSQL, MongoDB, Redis, Supabase' },
    { id: '4', category: 'Tools', items: 'Git, Docker, Figma, AWS' },
  ],
  projects: [
    {
      id: '1',
      name: 'StudentHub Platform',
      tech: 'Next.js, Supabase, Tailwind CSS',
      link: 'github.com/arjun/studenthub',
      desc: 'Full-stack student marketplace platform with 12K+ users. Implemented auth, real-time gig board, and PDF resume generation.',
    },
  ],
  achievements: [
    { id: '1', text: '🏆 Winner – Smart India Hackathon 2024 (₹1L prize)' },
    { id: '2', text: '⭐ Top 10% Writer on StudentHub (124 gigs completed)' },
    { id: '3', text: '📜 AWS Certified Solutions Architect – Associate' },
  ],
};

// RESUME PREVIEW COMPONENT
function ResumePreview({ data, template, isPremium }) {
  const accent = TEMPLATES.find(t => t.id === template)?.accent || '#7C3AED';

  return (
    <div
      id="resume-preview-container"
      className="bg-white text-gray-900 rounded-2xl overflow-hidden shadow-2xl relative"
      style={{ fontFamily: 'Georgia, serif', fontSize: '11px', lineHeight: '1.5' }}
    >
      {!isPremium && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-50">
          <div className="transform -rotate-45 text-black/10 text-6xl font-black whitespace-nowrap select-none tracking-widest uppercase">
            Made with StudentHub
          </div>
        </div>
      )}
      {/* Header */}
      <div style={{ background: accent, padding: '24px 28px', color: 'white' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 4px', fontFamily: 'Arial, sans-serif', letterSpacing: '-0.3px' }}>
          {data.personal.name || 'Your Name'}
        </h1>
        <p style={{ fontSize: '12px', margin: '0 0 12px', opacity: 0.9, fontFamily: 'Arial, sans-serif' }}>
          {data.personal.title || 'Your Title'}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '10px', opacity: 0.85, fontFamily: 'Arial, sans-serif' }}>
          {data.personal.email && <span>📧 {data.personal.email}</span>}
          {data.personal.phone && <span>📱 {data.personal.phone}</span>}
          {data.personal.location && <span>📍 {data.personal.location}</span>}
          {data.personal.linkedin && <span>💼 {data.personal.linkedin}</span>}
          {data.personal.website && <span>🌐 {data.personal.website}</span>}
        </div>
      </div>

      <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Summary */}
        {data.personal.summary && (
          <div>
            <h2 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginBottom: '8px', fontFamily: 'Arial, sans-serif' }}>
              Professional Summary
            </h2>
            <p style={{ color: '#374151', lineHeight: '1.6' }}>{data.personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div>
            <h2 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginBottom: '10px', fontFamily: 'Arial, sans-serif' }}>
              Experience
            </h2>
            {data.experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                  <div>
                    <strong style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif' }}>{exp.role}</strong>
                    <span style={{ color: '#6B7280' }}> · {exp.company}</span>
                  </div>
                  <span style={{ color: '#9CA3AF', whiteSpace: 'nowrap', marginLeft: '8px' }}>{exp.duration}</span>
                </div>
                <ul style={{ margin: '4px 0 0 16px', padding: 0, color: '#374151' }}>
                  {exp.points.map((point, i) => <li key={i} style={{ marginBottom: '2px' }}>{point}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div>
            <h2 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginBottom: '10px', fontFamily: 'Arial, sans-serif' }}>
              Technical Skills
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {data.skills.map(skill => (
                  <tr key={skill.id}>
                    <td style={{ fontWeight: '600', paddingRight: '12px', paddingBottom: '4px', whiteSpace: 'nowrap', fontFamily: 'Arial, sans-serif', width: '25%' }}>{skill.category}</td>
                    <td style={{ color: '#374151', paddingBottom: '4px' }}>{skill.items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div>
            <h2 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginBottom: '10px', fontFamily: 'Arial, sans-serif' }}>
              Education
            </h2>
            {data.education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontFamily: 'Arial, sans-serif' }}>{edu.institution}</strong>
                  <span style={{ color: '#9CA3AF' }}>{edu.duration}</span>
                </div>
                <p style={{ color: '#6B7280', margin: '2px 0' }}>{edu.degree} {edu.gpa && `· GPA: ${edu.gpa}`}</p>
                {edu.highlights && <p style={{ color: '#374151', fontSize: '10px', marginTop: '2px' }}>{edu.highlights}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div>
            <h2 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginBottom: '10px', fontFamily: 'Arial, sans-serif' }}>
              Projects
            </h2>
            {data.projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontFamily: 'Arial, sans-serif' }}>{proj.name}</strong>
                  <span style={{ color: '#9CA3AF', fontSize: '10px' }}>{proj.link}</span>
                </div>
                <p style={{ color: '#9CA3AF', margin: '1px 0', fontSize: '10px' }}>Tech: {proj.tech}</p>
                <p style={{ color: '#374151', marginTop: '3px' }}>{proj.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {data.achievements.length > 0 && (
          <div>
            <h2 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginBottom: '8px', fontFamily: 'Arial, sans-serif' }}>
              Achievements
            </h2>
            {data.achievements.map(ach => (
              <p key={ach.id} style={{ color: '#374151', marginBottom: '4px' }}>{ach.text}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// SECTION WRAPPER
function Section({ title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-glass transition-colors"
      >
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
            <div className="p-4 pt-0 border-t border-glass-border">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ResumePage() {
  const { user, profile } = useAuth();
  const [resumeData, setResumeData] = useState(DEFAULT_RESUME);
  const [template, setTemplate] = useState('modern');
  const [activeTab, setActiveTab] = useState('edit');
  const [saving, setSaving] = useState(false);
  
  // Premium Features State
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [adTimeLeft, setAdTimeLeft] = useState(0);
  const [isTempPremium, setIsTempPremium] = useState(false);
  
  const hasPermanentPremium = profile?.unlocked_themes?.includes('resume_premium');
  const isPremium = hasPermanentPremium || isTempPremium;
  const supabase = createClient();

  const update = (section, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: field ? { ...prev[section], [field]: value } : value,
    }));
  };

  const addItem = (section, template) => {
    const newItem = { id: Date.now().toString(), ...template };
    setResumeData(prev => ({ ...prev, [section]: [...prev[section], newItem] }));
  };

  const removeItem = (section, id) => {
    setResumeData(prev => ({ ...prev, [section]: prev[section].filter(i => i.id !== id) }));
  };

  const updateItem = (section, id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map(i => i.id === id ? { ...i, [field]: value } : i),
    }));
  };

  const updatePoint = (expId, pointIdx, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(e =>
        e.id === expId ? { ...e, points: e.points.map((p, i) => i === pointIdx ? value : p) } : e
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
  };

  const handleExport = () => {
    window.print();
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

  const handlePaymentSuccess = async (proofUrl, transactionId) => {
    try {
      const { error } = await supabase.from('theme_unlock_requests').insert([{
        user_id: user.id,
        theme_id: 'resume_premium',
        amount: 29,
        payment_proof_url: proofUrl,
        transaction_id: transactionId,
        status: 'pending'
      }]);
      if (error) throw error;
      
      toast.success('Payment submitted! Admin will permanently unlock this feature shortly.');
      setShowUPIModal(false);
      setShowRemoveModal(false);
    } catch (err) {
      toast.error('Failed to submit proof');
    }
  };

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #resume-preview-container, #resume-preview-container * {
            visibility: visible !important;
          }
          #resume-preview-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          @page { margin: 0; }
        }
      `}} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-700 text-ink">Resume Builder</h1>
          <p className="text-sm text-ink-muted mt-1">ATS-optimized templates with real-time preview</p>
        </div>
        <div className="flex gap-3">
          {!isPremium && (
            <Button variant="ghost" size="sm" onClick={() => setShowRemoveModal(true)} className="text-gold-400 hover:text-gold-300">
              <Zap size={14} /> Remove Watermark
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={handleSave} loading={saving}>
            <Check size={14} /> Save
          </Button>
          <Button variant="gold" size="sm" onClick={handleExport}>
            <Download size={14} /> Export PDF
          </Button>
        </div>
      </div>

      {/* Template Selector */}
      <div className="glass-card rounded-2xl p-4">
        <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-4">Choose Template</p>
        <div className="grid grid-cols-3 gap-3">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`p-3 rounded-xl border transition-all text-left ${
                template === t.id
                  ? 'border-violet-500/50 bg-violet-500/10'
                  : 'border-glass-border hover:border-violet-500/25'
              }`}
            >
              <div className={`w-full h-12 ${t.preview} rounded-lg mb-2 relative overflow-hidden`}>
                <div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ background: t.accent }}
                />
              </div>
              <p className="text-xs font-display font-600 text-ink">{t.name}</p>
              <p className="text-xs text-ink-subtle">{t.desc}</p>
              {template === t.id && (
                <div className="flex items-center gap-1 mt-1">
                  <Check size={10} className="text-violet-400" />
                  <span className="text-xs text-violet-400">Active</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex gap-2 p-1 glass rounded-xl w-fit">
        {['edit', 'preview'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-display font-500 transition-all capitalize ${
              activeTab === tab
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/25'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {tab === 'edit' ? '✏️ Editor' : '👁 Preview'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'edit' ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            className="space-y-4"
          >
            {/* Personal Info */}
            <Section title="Personal Information" icon={FileText}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {[
                  { field: 'name', label: 'Full Name', placeholder: 'Arjun Sharma' },
                  { field: 'title', label: 'Professional Title', placeholder: 'Full Stack Developer' },
                  { field: 'email', label: 'Email', placeholder: 'you@example.com' },
                  { field: 'phone', label: 'Phone', placeholder: '+91 98765 43210' },
                  { field: 'location', label: 'Location', placeholder: 'New Delhi, India' },
                  { field: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/you' },
                  { field: 'website', label: 'Website', placeholder: 'yoursite.dev' },
                ].map(({ field, label, placeholder }) => (
                  <div key={field}>
                    <label className="block text-xs text-ink-muted mb-1.5 font-medium">{label}</label>
                    <input
                      className="input-field text-sm py-2"
                      placeholder={placeholder}
                      value={resumeData.personal[field]}
                      onChange={e => update('personal', field, e.target.value)}
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-xs text-ink-muted mb-1.5 font-medium">Professional Summary</label>
                  <textarea
                    className="input-field text-sm resize-none"
                    rows={3}
                    placeholder="Write a compelling 2–3 sentence summary..."
                    value={resumeData.personal.summary}
                    onChange={e => update('personal', 'summary', e.target.value)}
                  />
                </div>
              </div>
            </Section>

            {/* Experience */}
            <Section title="Work Experience" icon={Briefcase}>
              <div className="space-y-4 mt-4">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id} className="p-4 border border-glass-border rounded-xl space-y-3 relative">
                    <button
                      onClick={() => removeItem('experience', exp.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-500/10 text-ink-subtle hover:text-red-400 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-ink-muted mb-1.5">Company</label>
                        <input className="input-field text-sm py-2" value={exp.company} onChange={e => updateItem('experience', exp.id, 'company', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs text-ink-muted mb-1.5">Role / Title</label>
                        <input className="input-field text-sm py-2" value={exp.role} onChange={e => updateItem('experience', exp.id, 'role', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs text-ink-muted mb-1.5">Duration</label>
                        <input className="input-field text-sm py-2" placeholder="May 2024 – Aug 2024" value={exp.duration} onChange={e => updateItem('experience', exp.id, 'duration', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs text-ink-muted mb-1.5">Location</label>
                        <input className="input-field text-sm py-2" placeholder="Remote / City" value={exp.location} onChange={e => updateItem('experience', exp.id, 'location', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-ink-muted mb-1.5">Bullet Points (achievements)</label>
                      {exp.points.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2 mb-2">
                          <span className="text-violet-400 mt-2 text-xs">•</span>
                          <input
                            className="input-field text-xs py-2 flex-1"
                            value={point}
                            onChange={e => updatePoint(exp.id, idx, e.target.value)}
                            placeholder="Quantify your impact..."
                          />
                          <button
                            onClick={() => {
                              const newPoints = exp.points.filter((_, i) => i !== idx);
                              updateItem('experience', exp.id, 'points', newPoints);
                            }}
                            className="mt-2 text-ink-subtle hover:text-red-400 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => updateItem('experience', exp.id, 'points', [...exp.points, ''])}
                        className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 mt-1 transition-colors"
                      >
                        <Plus size={12} /> Add bullet point
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addItem('experience', { company: '', role: '', duration: '', location: '', points: [''] })}
                  className="w-full py-3 border border-dashed border-glass-border rounded-xl text-sm text-ink-subtle hover:text-ink hover:border-violet-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Add Experience
                </button>
              </div>
            </Section>

            {/* Education */}
            <Section title="Education" icon={GraduationCap}>
              <div className="space-y-4 mt-4">
                {resumeData.education.map(edu => (
                  <div key={edu.id} className="p-4 border border-glass-border rounded-xl space-y-3 relative">
                    <button onClick={() => removeItem('education', edu.id)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-500/10 text-ink-subtle hover:text-red-400 transition-all">
                      <Trash2 size={13} />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs text-ink-muted mb-1.5">Institution</label>
                        <input className="input-field text-sm py-2" value={edu.institution} onChange={e => updateItem('education', edu.id, 'institution', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs text-ink-muted mb-1.5">Degree</label>
                        <input className="input-field text-sm py-2" value={edu.degree} onChange={e => updateItem('education', edu.id, 'degree', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs text-ink-muted mb-1.5">Duration</label>
                        <input className="input-field text-sm py-2" value={edu.duration} onChange={e => updateItem('education', edu.id, 'duration', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs text-ink-muted mb-1.5">GPA / Percentage</label>
                        <input className="input-field text-sm py-2" value={edu.gpa} onChange={e => updateItem('education', edu.id, 'gpa', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs text-ink-muted mb-1.5">Highlights / Activities</label>
                        <input className="input-field text-sm py-2" value={edu.highlights} onChange={e => updateItem('education', edu.id, 'highlights', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addItem('education', { institution: '', degree: '', duration: '', gpa: '', highlights: '' })}
                  className="w-full py-3 border border-dashed border-glass-border rounded-xl text-sm text-ink-subtle hover:text-ink hover:border-violet-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Add Education
                </button>
              </div>
            </Section>

            {/* Skills */}
            <Section title="Technical Skills" icon={Code}>
              <div className="space-y-3 mt-4">
                {resumeData.skills.map(skill => (
                  <div key={skill.id} className="flex items-center gap-3">
                    <input className="input-field text-sm py-2 w-32 shrink-0" placeholder="Category" value={skill.category} onChange={e => updateItem('skills', skill.id, 'category', e.target.value)} />
                    <input className="input-field text-sm py-2 flex-1" placeholder="React, Node.js, Python..." value={skill.items} onChange={e => updateItem('skills', skill.id, 'items', e.target.value)} />
                    <button onClick={() => removeItem('skills', skill.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-ink-subtle hover:text-red-400 transition-all shrink-0">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addItem('skills', { category: '', items: '' })}
                  className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                >
                  <Plus size={12} /> Add skill category
                </button>
              </div>
            </Section>

            {/* Projects */}
            <Section title="Projects" icon={Globe} defaultOpen={false}>
              <div className="space-y-4 mt-4">
                {resumeData.projects.map(proj => (
                  <div key={proj.id} className="p-4 border border-glass-border rounded-xl space-y-3 relative">
                    <button onClick={() => removeItem('projects', proj.id)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-500/10 text-ink-subtle hover:text-red-400 transition-all">
                      <Trash2 size={13} />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-ink-muted mb-1.5">Project Name</label>
                        <input className="input-field text-sm py-2" value={proj.name} onChange={e => updateItem('projects', proj.id, 'name', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs text-ink-muted mb-1.5">Tech Stack</label>
                        <input className="input-field text-sm py-2" value={proj.tech} onChange={e => updateItem('projects', proj.id, 'tech', e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-ink-muted mb-1.5">Link</label>
                        <input className="input-field text-sm py-2" value={proj.link} onChange={e => updateItem('projects', proj.id, 'link', e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-ink-muted mb-1.5">Description</label>
                        <textarea className="input-field text-sm resize-none" rows={2} value={proj.desc} onChange={e => updateItem('projects', proj.id, 'desc', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addItem('projects', { name: '', tech: '', link: '', desc: '' })}
                  className="w-full py-3 border border-dashed border-glass-border rounded-xl text-sm text-ink-subtle hover:text-ink hover:border-violet-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>
            </Section>

            {/* Achievements */}
            <Section title="Achievements & Certifications" icon={Award} defaultOpen={false}>
              <div className="space-y-2 mt-4">
                {resumeData.achievements.map(ach => (
                  <div key={ach.id} className="flex items-center gap-3">
                    <input className="input-field text-sm py-2 flex-1" value={ach.text} onChange={e => updateItem('achievements', ach.id, 'text', e.target.value)} />
                    <button onClick={() => removeItem('achievements', ach.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-ink-subtle hover:text-red-400 transition-all shrink-0">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addItem('achievements', { text: '' })}
                  className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 mt-1 transition-colors"
                >
                  <Plus size={12} /> Add achievement
                </button>
              </div>
            </Section>

          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="max-w-2xl mx-auto"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-ink-muted">A4 Preview — Actual PDF may vary slightly</p>
              <div className="flex gap-2">
                {!isPremium && (
                  <Button variant="secondary" size="sm" onClick={() => setShowRemoveModal(true)} className="text-gold-400 border-gold-400/20">
                    <Zap size={14} /> Remove Watermark
                  </Button>
                )}
                <Button variant="gold" size="sm" onClick={handleExport}>
                  <Download size={14} />
                  Export PDF
                </Button>
              </div>
            </div>
            <ResumePreview data={resumeData} template={template} isPremium={isPremium} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRemoveModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" onClick={() => setShowRemoveModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm glass-card rounded-3xl p-8 border border-glass-border shadow-2xl text-center">
              <button onClick={() => setShowRemoveModal(false)} className="absolute top-4 right-4 text-ink-subtle hover:text-ink"><X size={20} /></button>
              <div className="w-16 h-16 rounded-full bg-gold-400/20 flex items-center justify-center mx-auto mb-4 border border-gold-400/30">
                <Zap size={24} className="text-gold-400" />
              </div>
              <h3 className="font-display text-2xl font-800 text-ink mb-2">Remove Watermark</h3>
              <p className="text-sm text-ink-muted mb-6">Support us to export clean, professional resumes without our branding.</p>
              
              <div className="space-y-3">
                <Button 
                  variant="gold" 
                  className="w-full justify-center" 
                  onClick={() => { setShowRemoveModal(false); setShowUPIModal(true); }}
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
            key="upi-resume"
            amount={29}
            gigTitle="Permanent Resume Watermark Removal"
            onClose={() => setShowUPIModal(false)}
            onPaymentComplete={handlePaymentSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
