import { Benefit, CurriculumModule, Testimonial, PricingPlan, FAQ, CourseStats, ResultsImage } from '../types';

export const courseTitle = "Premiere Pro Mastery: Create Professional Videos That Captivate and Convert in 2025";
export const courseSubtitle = "Master Adobe Premiere Pro with step-by-step guidance and real-world projects to elevate your video editing skills and launch your career.";

export const courseVideoId = "PvTcmse6DDY";  // Replace with your actual YouTube video ID

export const benefits: Benefit[] = [
  {
    id: 1,
    title: "Learn Cutting-Edge Techniques",
    description: "Master the latest video editing strategies used by top professionals to create stunning, high-impact videos that stand out.",
    icon: "Rocket"
  },
  {
    id: 2,
    title: "Hands-On, Real-World Projects",
    description: "Apply your skills immediately with practical exercises that simulate client work, preparing you for a successful career in video editing.",
    icon: "Briefcase"
  },
  {
    id: 3,
    title: "Earn a Recognized Certification",
    description: "Showcase your expertise to clients and employers with a certification that proves your mastery of Premiere Pro.",
    icon: "Award"
  }
];

export const curriculum: CurriculumModule[] = [
  {
    id: 1,
    title: "Video Editing Essentials: Get Started with Confidence",
    description: "Kickstart your journey with the basics of video editing. Set up your workspace, learn core principles, and maximize your learning experience to create professional-quality videos.",
    duration: "1 week",
    lessons: [
      { id: 101, title: "Welcome to Premiere Pro Mastery", duration: "45 min", previewAvailable: false, videoId: "PvTcmse6DDY" },
      { id: 102, title: "What You'll Achieve in 30 Days", duration: "30 min", previewAvailable: false },
      { id: 103, title: "Software Setup + Download Links", duration: "60 min", previewAvailable: true, videoId: "Ul45Ze-xgSU" },
      { id: 104, title: "How to Maximize Your Learning", duration: "55 min", previewAvailable: false, videoId: "dQw4w9WgXcQ" }
    ]
  },
  {
    id: 2,
    title: "Create Compelling Videos: From Raw Footage to Polished Edits",
    description: "Transform raw footage into captivating stories. Master workspace setup, file organization, timeline tools, and export settings for platforms like Instagram and YouTube.",
    duration: "1 week",
    lessons: [
      { id: 201, title: "Workspace Setup for Efficiency", duration: "50 min", previewAvailable: true, videoId: "O0-fVgbijkY" },
      { id: 202, title: "Importing and Organizing Footage", duration: "65 min", previewAvailable: false },
      { id: 203, title: "Mastering the Timeline and Tools", duration: "40 min", previewAvailable: true,  videoId: "njUO84_ygo0" },
      { id: 204, title: "Your First Edit: Trimming, Cutting, and Arranging Clips", duration: "35 min", previewAvailable: false },
      { id: 205, title: "Adding Music and Voiceovers Like a Pro", duration: "35 min", previewAvailable: false },
      { id: 206, title: "Export Settings for Social Media Success", duration: "35 min", previewAvailable: false }
    ]
  },
  {
    id: 3,
    title: "Advanced Editing Skills: Make Your Videos Stand Out",
    description: "Elevate your edits with pro-level audio, graphics, and effects. Learn to enhance audio, create dynamic titles, apply seamless transitions, and use color grading for maximum impact.",
    duration: "1 week",
    lessons: [
      { id: 301, title: "Cleaning and Enhancing Voice Audio", duration: "40 min", previewAvailable: true, videoId: "jpqETZQZ-mg" },
      { id: 302, title: "Adding Background Music and Sound Effects", duration: "55 min", previewAvailable: false,  },
      { id: 303, title: "Creating Stunning Titles and Lower Thirds", duration: "50 min", previewAvailable: false },
      { id: 304, title: "Smooth Transitions and Time-Saving Presets", duration: "60 min", previewAvailable: false },
      { id: 305, title: "Color Correction, LUTs, and Grading", duration: "60 min", previewAvailable: false },
      { id: 306, title: "Speed Ramping and Creative Time Effects", duration: "60 min", previewAvailable: false }
    ]
  },
  {
    id: 4,
    title: "Tailor Your Videos for Social Media and Clients",
    description: "Produce platform-specific content like Instagram Reels, YouTube vlogs, and client promos. Plus, learn to design eye-catching YouTube thumbnails in Canva.",
    duration: "1 week",
    lessons: [
      { id: 401, title: "Crafting Viral Instagram Reels", duration: "40 min", previewAvailable: false },
      { id: 402, title: "Editing Engaging YouTube Vlogs", duration: "55 min", previewAvailable: true, videoId: "dQw4w9WgXcQ" },
      { id: 403, title: "Creating High-Impact Promo Videos for Clients", duration: "50 min", previewAvailable: false },
      { id: 404, title: "Editing Podcasts and Interviews for Multiple Platforms", duration: "60 min", previewAvailable: false },
      { id: 405, title: "Designing Click-Worthy YouTube Thumbnails in Canva", duration: "50 min", previewAvailable: false }
    ]
  },
  {
    id: 5,
    title: "Launch Your Video Editing Career: Portfolio, Clients, and Success",
    description: "Turn your skills into a thriving career. Build a standout portfolio, price your services, find clients on platforms like Instagram and Upwork, and master project delivery.",
    duration: "1 week",
    lessons: [
      { id: 501, title: "Building a Portfolio That Gets You Hired", duration: "40 min", previewAvailable: false },
      { id: 502, title: "Pricing Your Editing Services for Profit", duration: "55 min", previewAvailable: false, videoId: "dQw4w9WgXcQ" },
      { id: 503, title: "Finding Clients on Instagram, Upwork, and Beyond", duration: "50 min", previewAvailable: false },
      { id: 504, title: "Crafting Winning Pitches and Outreach Scripts", duration: "60 min", previewAvailable: false },
      { id: 505, title: "Delivering Projects and Handling Revisions Like a Pro", duration: "50 min", previewAvailable: false }
    ]
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director",
    content: "This course transformed my editing skills! I went from beginner to confidently creating professional videos for my business in just weeks. Our conversion rates tripled after applying the strategies taught.",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Startup Founder",
    content: "As a complete novice, this course gave me the exact blueprint to create a stunning promo video for my startup—without hiring an expensive editor. The practical projects were a game-changer.",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300",
    rating: 5
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Social Media Manager",
    content: "The platform-specific editing module helped me create viral content for our social channels, boosting engagement by 300%. I'm still amazed at how effective these techniques are!",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300",
    rating: 4
  },
  {
    id: 4,
    name: "David Thompson",
    role: "E-commerce Entrepreneur",
    content: "The career module was a lifesaver! I built a portfolio and landed my first two clients within a month. This course is hands-down the best investment I've made in my business.",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300",
    rating: 5
  }
];

export const pricingPlans: PricingPlan[] = [
  {
    id: 1,
    name: "Basic Plan",
    description: "Perfect for beginners starting their journey",
    price: 4999,
    features: [
      "Full Course Access",
      "30-Day Money Back Guarantee",
      "Basic Support"
    ],
    featured: false,
    cta: "Enroll Now",
    purchaseLink: "https://rzp.io/rzp/premierepro" // Add your actual Stripe/payment link
  },
  {
    id: 2,
    name: "Pro Plan",
    description: "Most popular choice for aspiring editors",
    price: 9999,
    features: [
      "Everything in Basic",
      "1-on-1 Mentoring Session",
      "Priority Support",
      "Project Reviews"
    ],
    featured: true,
    cta: "Get Started",
    purchaseLink: "https://rzp.io/rzp/premierepro" // Add your actual Stripe/payment link
  },
  {
    id: 3,
    name: "Premium Plan",
    description: "For serious editors aiming for excellence",
    price: 14999,
    features: [
      "Everything in Pro",
      "3 Mentoring Sessions",
      "Portfolio Review",
      "Job Assistance",
      "Lifetime Access"
    ],
    featured: false,
    cta: "Enroll Now",
    purchaseLink: "https://rzp.io/rzp/premierepro" // Add your actual Stripe/payment link
  }
];

export const faqs: FAQ[] = [
  {
    id: 1,
    question: "How long do I have access to the course?",
    answer: "With both the Essential and Pro Packs, you get lifetime access to all modules, lessons, and future updates—so you can learn and revisit at your own pace."
  },
  {
    id: 2,
    question: "Do I need any prior video editing experience?",
    answer: "Nope! Whether you're a complete beginner or have some experience, this course takes you from zero to pro with step-by-step guidance tailored to all levels."
  },
  {
    id: 3,
    question: "What makes this course different from others?",
    answer: "We focus on real-world skills and career success. You'll master Premiere Pro, create platform-specific content, and learn to build a portfolio and find clients—setting you up to succeed as an editor."
  },
  {
    id: 4,
    question: "Is there a money-back guarantee?",
    answer: "Yes! Try Module 1 risk-free. If you're not satisfied within 30 days, we'll refund your investment—no questions asked."
  },
  {
    id: 5,
    question: "Can I upgrade my plan later?",
    answer: "Absolutely! Upgrade anytime and only pay the difference to unlock Pro Pack benefits like portfolio reviews and job board access."
  },
  {
    id: 6,
    question: "How much time should I commit each week?",
    answer: "We recommend 4-6 hours per week to fully engage with lessons and projects. But it's self-paced, so you can learn on your schedule."
  },
  {
    id: 7,
    question: "Will this course help me find clients?",
    answer: "Yes! Module 5 teaches you how to build a portfolio, price your services, and find clients on platforms like Instagram and Upwork—everything you need to kickstart your career."
  },
  {
    id: 8,
    question: "Do I need specific software?",
    answer: "We guide you through software setup in Module 1, including free and affordable options, so you can start editing right away—no fancy setup required."
  }
];

export const courseStats: CourseStats = {
  students: 2547,
  lessons: 28,
  hours: 35,
  rating: 4.8
};

export const resultsImages = [
  {
    id: 1,
    image: "https://framerusercontent.com/images/YWQmq3bDrak0r79XuyZBA4gtZGE.png",
    title: "1",
    description: "A vibrant reel created by a student using techniques from Module 4."
  },
  {
    id: 2,
    image: "https://framerusercontent.com/images/8xb7rxMwhL3qRjD9gL958r03nFw.png",
    title: "2",
    description: "A vibrant reel created by a student using techniques from Module 4."
  },
  {
    id: 3,
    image: "https://framerusercontent.com/images/xSIEEZarXTZg69FIhWb8fsyZw.png",
    title: "3",
    description: "A vibrant reel created by a student using techniques from Module 4."
  },
  {
    id: 4,
    image: "https://framerusercontent.com/images/wDL6BS2A0pKjGv2CM2gxGEyfhw.png",
    title: "Professional Instagram Reel",
    description: "A vibrant reel created by a student using techniques from Module 4."
  },
  {
    id: 5,
    image: "https://framerusercontent.com/images/YBpJvkmTipxcmbdfiGbyXjxaAw.png",
    title: "Professional Instagram Reel",
    description: "A vibrant reel created by a student using techniques from Module 4."
  },
  // Add more result objects as needed
];