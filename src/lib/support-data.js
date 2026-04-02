export const SUPPORT_KNOWLEDGE_BASE = {
  welcome: "Namaste! Main StudentHub Assistant hoon. Main aapki kaise madad kar sakta hoon? Aap mujhse payment, delivery, ya earnings ke baare mein puch sakte hain.",
  
  categories: [
    { id: 'payments', label: 'Payments & Verification', icon: 'Zap' },
    { id: 'earnings', label: 'Writer Earnings', icon: 'TrendingUp' },
    { id: 'delivery', label: 'Delivery & Shipping', icon: 'Truck' },
    { id: 'role', label: 'Changing Roles', icon: 'Users' }
  ],

  faqs: [
    {
      keywords: ['payment', 'verify', 'verify payment', 'upi', 'screenshot'],
      question: "Payment verify kaise hogi?",
      answer: "Assignment post karne ke baad aapko UPI QR code dikhega. Payment karne ke baad uska screenshot upload karein aur Transaction ID bharein. Admin ise manually verify karega, jiske baad aapka assignment writers ko dikhne lagega."
    },
    {
      keywords: ['earn', 'writer', 'money', 'payout', 'wallet', 'share'],
      question: "Writer ko kitna paisa milega?",
      answer: "StudentHub ka model 90/10 hai. Writer ko assignment ki total price ka 90% milta hai, aur StudentHub sirf 10% service fee charge karta hai."
    },
    {
      keywords: ['when', 'wallet', 'receive', 'credit', 'payout timing'],
      question: "Wallet mein paise kab aayenge?",
      answer: "Jab aap (Writer) assignment mark as 'Delivered' kar denge aur delivery proof (PDF ya Tracking ID) submit karenge, tab raqam turant aapke wallet mein credit ho jayegi."
    },
    {
      keywords: ['shipping', 'delivery charge', 'fees', 'cost', 'digital'],
      question: "Delivery charges kya hain?",
      answer: "Digital delivery (Email/WhatsApp) ki fee sirf ₹10 hai. Local shipping (Same City) ₹35 aur National shipping (Pan India) ₹80 hai."
    },
    {
      keywords: ['writer', 'customer', 'switch', 'role', 'change'],
      question: "Main Writer kaise ban sakta hoon?",
      answer: "Aap Settings mein jaakar 'Switch to Writer' par click kar sakte hain. Aap ek hi account se Customer aur Writer dono roles manage kar sakte hain."
    }
  ],

  fallback: "Maaf kijiye, main iska jawab nahi jaan pa raha hoon. Kya aap humare support team se WhatsApp par baat karna chahenge?",
  admin_whatsapp: "910000000000", // Placeholder - User can update
  admin_email: "support@studenthub.com"
};

export const getBotResponse = (query) => {
  const lowercaseQuery = query.toLowerCase();
  
  // Basic Keyword Matching Logic
  const match = SUPPORT_KNOWLEDGE_BASE.faqs.find(faq => 
    faq.keywords.some(keyword => lowercaseQuery.includes(keyword))
  );

  if (match) return match.answer;
  return SUPPORT_KNOWLEDGE_BASE.fallback;
};
