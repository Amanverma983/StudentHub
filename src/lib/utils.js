import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function truncate(str, maxLength = 120) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + '…';
}

export const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Computer Science', 'Economics', 'History', 'Geography',
  'English Literature', 'Business Studies', 'Accounting',
  'Psychology', 'Sociology', 'Political Science', 'Law',
  'Engineering', 'Medicine', 'Architecture', 'Design',
];

export const RATES = {
  standard: 15,
  urgent: 20,
  express: 25,
};

export const DELIVERY_RATES = {
  digital: 0,
  local: 45,
  regional: 75,
  national: 110,
};

export const SERVICE_FEE_RATE = 0.10; // 10% Platform Commission

export function calculateGigPrice(pages, urgency = 'standard', deliveryType = 'national') {
  const rate = RATES[urgency] || RATES.standard;
  const deliveryCharge = DELIVERY_RATES[deliveryType] || DELIVERY_RATES.national;
  const base = pages * rate;
  const serviceFee = Math.round(base * SERVICE_FEE_RATE);
  const total = base + deliveryCharge + serviceFee;

  return {
    total,
    base,
    deliveryCharge,
    serviceFee,
  };
}
