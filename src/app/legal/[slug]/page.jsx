'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Zap, Mail, Shield, Scale, HelpCircle, FileText } from 'lucide-react';
import Link from 'next/link';

const LEGAL_CONTENT = {
  terms: {
    title: 'Terms of Service',
    icon: Scale,
    content: `
      # Terms of Service
      Welcome to StudentHub. By using our platform, you agree to these terms...

      ### 1. Platform Role
      StudentHub provides a marketplace for students (Customers) and writers (Writers) to collaborate on educational assignments. StudentHub acts as an escrow service.

      ### 2. User Accounts
      Users must provide accurate information. Brand ownership is held by Aman Verma.

      ### 3. Payments and Commissions
      Payments are processed through Razorpay. A platform commission of 10% is charged on all completed assignments.

      ### 4. Code of Conduct
      Academic integrity is the user's responsibility. Content provided should be for reference or guidance only.
    `
  },
  privacy: {
    title: 'Privacy Policy',
    icon: Shield,
    content: `
      # Privacy Policy
      This policy details how we handle your personal data.

      ### 1. Information We Collect
      We collect names, emails, and payment information needed for assignment delivery and payout processing.

      ### 2. Data Usage
      Your data is used to facilitate marketplace transactions and improve student services.

      ### 3. Data Protection
      We use 256-bit encryption for data security. Payments are handled via Razorpay’s secure gateway.
    `
  },
  refund: {
    title: 'Cancellation & Refund',
    icon: HelpCircle,
    content: `
      # Cancellation & Refund Policy
      We aim for fairness in all student transactions.

      ### 1. Assignment Cancellation
      A Customer can cancel an assignment within 1 hour of posting or if a Writer has not yet been assigned.

      ### 2. Refunds
      Refunds are processed only if a Writer fails to deliver on time or if the quality is found to be significantly below the requirements.

      ### 3. Processing Time
      Refunds are processed within 5-7 business days to the original payment source via Razorpay.
    `
  },
  contact: {
    title: 'Contact Us',
    icon: Mail,
    content: `
      # Contact Us
      Have questions or need help? Reach out to our support team.

      ### 📧 Email
      av5324534@gmail.com

      ### 📍 Office
      Brand owned by Aman Verma. Registered in India to provide student career services.
    `
  }
};

export default function LegalPage() {
  const { slug } = useParams();
  const router = useRouter();
  const data = LEGAL_CONTENT[slug];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void text-white p-6">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Page Not Found</h1>
          <Link href="/" className="text-violet-400 underline uppercase tracking-widest text-xs font-bold">Go Home</Link>
        </div>
      </div>
    );
  }

  const Icon = data.icon;

  return (
    <div className="min-h-screen bg-void pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-ink-subtle hover:text-white transition-colors mb-8 group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest font-display">Go Back</span>
        </button>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[2.5rem] p-10 md:p-16 border border-glass-border">
          <div className="w-16 h-16 rounded-3xl bg-violet-500/10 flex items-center justify-center mb-8 border border-violet-500/20 shadow-glow-sm">
            <Icon size={30} className="text-violet-400" />
          </div>
          
          <div className="prose prose-invert prose-violet max-w-none prose-sm md:prose-base leading-relaxed">
            <h1 className="font-display font-900 text-4xl md:text-5xl text-ink tracking-tight mb-8">
              {data.title}
            </h1>
            <div className="space-y-6 text-ink-subtle font-normal whitespace-pre-line">
              {data.content}
            </div>
          </div>
        </motion.div>

        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap size={14} className="text-violet-500" />
            <span className="text-[10px] uppercase font-black tracking-widest text-ink-subtle">Secure Marketplace by StudentHub</span>
          </div>
        </div>
      </div>
    </div>
  );
}
