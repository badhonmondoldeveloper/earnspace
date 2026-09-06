'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'BN' | 'EN';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  BN: {
    // Navigation & General
    home: 'হোম',
    explore: 'এক্সপ্লোর',
    stories: 'স্টোরিজ',
    reels: 'রিলস',
    blogs: 'ব্লগ',
    messages: 'মেসেজ',
    notifications: 'নোটিফিকেশন',
    wallet: 'ওয়ালেট',
    referrals: 'রেফারাল',
    dashboard: 'ড্যাশবোর্ড',
    creator_studio: 'ক্রিয়েটর স্টুডিও',
    settings: 'সেটিংস',
    admin_panel: 'এডমিন প্যানেল',
    logout: 'লগআউট',
    login: 'লগইন',
    register: 'রেজিস্টার',

    // Content Creation
    create_post: 'পোস্ট তৈরি করুন',
    create_story: 'স্টোরি তৈরি করুন',
    create_reel: 'রিলস আপলোড করুন',
    upload_video: 'ভিডিও আপলোড করুন',
    whats_on_your_mind: 'আপনার মনে কি চলছে?',
    post: 'পোস্ট করুন',
    support_creator: 'ক্রিয়েটরকে সাপোর্ট করুন 💖',
    send_tip: 'টিপ পাঠান',

    // Monetization & Wallet
    available_balance: 'বর্তমান ব্যালেন্স',
    pending_balance: 'পেন্ডিং ব্যালেন্স',
    lifetime_earned: 'মোট উপার্জন',
    withdraw_funds: 'টাকা তুলুন (Withdraw)',
    payout_methods: 'পেমেন্ট মেথড (bKash/Nagad)',
    referral_link: 'আপনার রেফারাল লিংক',
    copy_link: 'লিংক কপি করুন',

    // UI Feedback
    copied: 'কপি করা হয়েছে!',
    loading: 'লোড হচ্ছে...',
    success: 'সফল হয়েছে!',
    error: 'একটি ত্রুটি ঘটেছে',
  },
  EN: {
    // Navigation & General
    home: 'Home',
    explore: 'Explore',
    stories: 'Stories',
    reels: 'Reels',
    blogs: 'Blogs',
    messages: 'Messages',
    notifications: 'Notifications',
    wallet: 'Wallet',
    referrals: 'Referrals',
    dashboard: 'Dashboard',
    creator_studio: 'Creator Studio',
    settings: 'Settings',
    admin_panel: 'Admin Panel',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',

    // Content Creation
    create_post: 'Create Post',
    create_story: 'Create Story',
    create_reel: 'Upload Reel',
    upload_video: 'Upload Video',
    whats_on_your_mind: "What's on your mind?",
    post: 'Post',
    support_creator: 'Support Creator 💖',
    send_tip: 'Send Tip',

    // Monetization & Wallet
    available_balance: 'Available Balance',
    pending_balance: 'Pending Balance',
    lifetime_earned: 'Lifetime Earned',
    withdraw_funds: 'Withdraw Funds',
    payout_methods: 'Payout Methods (bKash/Nagad)',
    referral_link: 'Your Referral Link',
    copy_link: 'Copy Link',

    // UI Feedback
    copied: 'Copied!',
    loading: 'Loading...',
    success: 'Success!',
    error: 'An error occurred',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'EN',
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLangState] = useState<Language>('EN');

  useEffect(() => {
    const saved = localStorage.getItem('earnspace_lang') as Language;
    if (saved === 'BN' || saved === 'EN') {
      setLangState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLangState(lang);
    localStorage.setItem('earnspace_lang', lang);
  };

  const t = (key: string, fallback?: string): string => {
    return translations[language]?.[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
