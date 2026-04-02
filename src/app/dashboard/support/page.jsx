'use client';

import { motion } from 'framer-motion';
import { 
  HelpCircle, MessageCircle, Mail, Smartphone, 
  ChevronRight, Zap, ShieldCheck, Clock, Users,
  ArrowRight, ExternalLink, Bot
} from 'lucide-react';
import { SUPPORT_KNOWLEDGE_BASE } from '@/lib/support-data';
import Button from '@/components/ui/Button';

export default function SupportPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center mx-auto border border-violet-500/20 shadow-glow-sm"
        >
          <HelpCircle size={32} className="text-violet-400" />
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-display text-4xl font-800 text-ink"
        >
          How can we <span className="gradient-text-violet">help you?</span>
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-ink-muted max-w-2xl mx-auto"
        >
          Find answers to common questions or reach out to our dedicated support team for personalized assistance.
        </motion.p>
      </section>

      {/* Quick Contact Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="glass-card p-8 rounded-[2.5rem] border border-glass-border flex flex-col items-center text-center space-y-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <Smartphone size={24} />
          </div>
          <div>
            <h3 className="font-display font-700 text-ink">WhatsApp Support</h3>
            <p className="text-xs text-ink-subtle mt-1">Instant chat with our admin</p>
          </div>
          <a 
            href={`https://wa.me/${SUPPORT_KNOWLEDGE_BASE.admin_whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-full py-2.5 px-4 text-sm gap-2"
          >
            Chat Now <ArrowRight size={14} />
          </a>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="glass-card p-8 rounded-[2.5rem] border border-glass-border flex flex-col items-center text-center space-y-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20 group-hover:bg-violet-500 group-hover:text-white transition-all">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-display font-700 text-ink">AI Assistant</h3>
            <p className="text-xs text-ink-subtle mt-1">Available 24/7 for quick Q&A</p>
          </div>
          <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest mt-2 px-3 py-1 bg-violet-500/10 rounded-full">
            Available Below ↓
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="glass-card p-8 rounded-[2.5rem] border border-glass-border flex flex-col items-center text-center space-y-4 group sm:col-span-2 lg:col-span-1"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-500/20 group-hover:bg-sky-500 group-hover:text-white transition-all">
            <Mail size={24} />
          </div>
          <div>
            <h3 className="font-display font-700 text-ink">Email Support</h3>
            <p className="text-xs text-ink-subtle mt-1">For formal inquiries or issues</p>
          </div>
          <a 
            href={`mailto:${SUPPORT_KNOWLEDGE_BASE.admin_email}`}
            className="btn-secondary w-full py-2.5 px-4 text-sm gap-2"
          >
            Send Email <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-glass-border pb-4">
          <h2 className="font-display text-2xl font-700 text-ink">Frequently Asked Questions</h2>
          <span className="text-xs text-ink-subtle">{SUPPORT_KNOWLEDGE_BASE.faqs.length} articles</span>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-4"
        >
          {SUPPORT_KNOWLEDGE_BASE.faqs.map((faq, i) => (
            <motion.div
              key={i}
              variants={item}
              className="glass-card rounded-3xl border border-glass-border overflow-hidden"
            >
              <div className="p-6 space-y-3">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 shrink-0 border border-violet-500/20">
                    <HelpCircle size={16} />
                  </div>
                  <div>
                    <h4 className="font-display font-700 text-ink text-sm">{faq.question}</h4>
                    <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trust Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="p-12 rounded-[3.5rem] bg-gradient-to-br from-violet-600/10 to-indigo-600/10 border border-violet-500/10 text-center space-y-6"
      >
        <div className="flex justify-center -space-x-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-void bg-glass flex items-center justify-center text-xs font-bold text-violet-400">
              {String.fromCharCode(64 + i)}
            </div>
          ))}
        </div>
        <h3 className="font-display text-xl font-700 text-ink italic">"Empowering students through mutual support."</h3>
        <p className="text-xs text-ink-subtle uppercase tracking-widest font-bold">Trusted by 100+ active students</p>
      </motion.div>
    </div>
  );
}
