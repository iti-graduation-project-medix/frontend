import { Scale, ArrowLeftRight, CheckCircle, DollarSign, Bell, BarChart3 } from "lucide-react";

import { UserPlus, ClipboardList, Award, Package } from "lucide-react";

export const features = [
  {
    icon: Scale,
    title: "Secure Bidding System",
    description: "A transparent auction system ensures fair market value for your surplus stock."
  },
  {
    icon: ArrowLeftRight,
    title: "Medicine Exchange",
    description: "Easily list medications you have or find those you need for direct exchange."
  },
  {
    icon: CheckCircle,
    title: "Verified Users Only",
    description: "Strict verification process ensures all participants hold valid licenses."
  },
  {
    icon: DollarSign,
    title: "Ad Space for Companies",
    description: "Promote your products or services directly to a targeted pharmacy audience."
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    description: "Stay updated on new listings, bids, and messages instantly."
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description:
      "Track your listing performance, bids, and exchange history for informed decisions."
  }
];

export const howWeWorkSteps = [
  {
    number: "01",
    icon: <UserPlus />,
    image: "/imgs/steps.png",
    alt: "Doctor writing on a clipboard",
    title: "Register Account",
    description: "Sign up as a Pharmacy or a Company to get started."
  },
  {
    number: "02",
    icon: <ClipboardList />,
    image: "/imgs/steps.png",
    alt: "Two women consulting",
    title: "Post Deals",
    description:
      "List medications you want to sell/exchange or post specific requests for stock you need."
  },
  {
    number: "03",
    icon: <Award />,
    image: "/imgs/steps.png",
    alt: "Doctors performing surgery",
    title: "Receive Offers",
    description: "Engage with interested parties through our secure messaging and bidding system."
  },
  {
    number: "04",
    icon: <Package />,
    image: "/imgs/steps.png",
    alt: "Elderly couple smiling",
    title: "Complete Transaction",
    description: "Arrange for the compliant transfer and logistics of the medications."
  }
];

export const faqs = [
  {
    question: "What is dental care?",
    answer:
      "Tooth valuable resources, dental care should take us regularly to stay healthy. Oral Health Overview. Good dental or oral care is important to maintaining healthy teeth, gums, and tongue. Oral problems, including bad breath, dry mouth, canker or cold sores, TMD, tooth decay, or thrush are all treatable with proper diagnosis and care."
  },
  {
    question: "Does offer emergency care?",
    answer:
      "Yes, we offer emergency dental care during our regular business hours. Please call us immediately if you have a dental emergency, and we will do our best to see you as soon as possible."
  },
  {
    question: "Online live support",
    answer:
      "Our online live support is available 24/7 to answer your questions, assist with appointments, and provide information. Look for the chat icon on our website to connect with a representative."
  },
  {
    question: "What insurance plans do you accept?",
    answer:
      "We accept most major dental insurance plans. Please contact our office with your insurance details, and our staff will be happy to verify your coverage."
  }
];

export const faqItems = [
  {
    question: "🩺 Expert Doctors in Every Department",
    answer: "Each department is staffed with specialists to ensure optimal care and expertise."
  },
  {
    question: "🚑 24/7 Emergency & Ambulance Services",
    answer: "Our ambulance fleet is always ready. Trauma care and ICU are available day and night."
  },
  {
    question: "💊 Affordable Costs & 24/7 Pharmacy",
    answer:
      "We ensure affordable treatment with full-time pharmacy support and transparent pricing."
  }
];

export const hoursData = [
  { day: "Monday - Friday", open: "8:00 - 18:00" },
  { day: "Saturday", open: "9:00 - 18:00" },
  { day: "Sunday", open: "Closed" }
];

export const whyChooseUsFeatures = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-10 h-10 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.016-.098 2.007-.294 2.96L21 12zM3 12c0-1.016.098-2.007.294-2.96L3 12zM12 2.25c-5.32 0-9.753 3.42-10.96 8.16C.767 12.19 1.156 12 1.5 12c.5 0 .973.064 1.42.188A3.75 3.75 0 005.25 12h13.5a3.75 3.75 0 003.707-3.812C21.753 5.67 17.32 2.25 12 2.25z"
        />
      </svg>
    ),
    title: "Certified Professionals",
    description:
      "Our team comprises highly qualified and experienced experts dedicated to providing top-notch services."
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-10 h-10 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.815-1.624v.75c0 .762.321 1.465.842 1.94l.08.077c.621.579 1.45 1.012 2.394 1.172.7.124 1.42.232 2.158.337a.75.75 0 00.745-.733v-.721a.75.75 0 00-.737-.737c-1.216-.165-2.42-.348-3.6-1.002a11.21 11.21 0 00-2.348-1.597 6.336 6.336 0 00-1.088-.884c-.45-.423-.861-.834-1.215-1.289a1.94 1.94 0 01-.264-.315 2.16 2.16 0 01-.112-.274c-.04-.15-.067-.3-.083-.448a2.152 2.152 0 00-.2-1.392 3.09 3.09 0 00-.638-1.077A4.715 4.715 0 003 6.75h-.75a.75.75 0 00-.75.75v3c0 .247.086.483.242.668.083.1.18.175.29.227.185.088.397.168.618.25.353.125.71.246 1.067.362.464.154.94.275 1.417.366A6.299 6.299 0 006.633 10.25z"
        />
      </svg>
    ),
    title: "Customer Satisfaction",
    description:
      "We prioritize your needs, offering personalized solutions and dedicated support to ensure your complete satisfaction."
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-10 h-10 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.75c0 .666-.318 1.31-.859 1.748l-4.577 3.05a1.2 1.2 0 01-1.348 0l-4.577-3.05A1.5 1.5 0 014.5 18.75V8.25a.75.75 0 011.5 0v10.5h12v-10.5a.75.75 0 011.5 0v10.5z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 12c-2.4 0-4.332-1.89-4.332-4.25S9.6 3.5 12 3.5c2.4 0 4.332 1.89 4.332 4.25S14.4 12 12 12z"
        />
      </svg>
    ),
    title: "Collaborative Approach",
    description:
      "We work closely with clients, fostering open communication and partnership to achieve shared goals effectively."
  }
];

export const testimonials = [
  {
    id: 1,
    text: `"Flowbite is just awesome. It contains tons of predesigned components and pages starting from login screen to complex dashboard. Perfect choice for your next SaaS application."`,
    name: "Michael Gough",
    role: "CEO at Google",
    img: "/avatars/client1.webp"
  },
  {
    id: 2,
    text: `"Shadecn UI components help me build fast and beautiful interfaces with less effort."`,
    name: "John Doe",
    role: "Designer at ABC",
    img: "/avatars/client2.webp"
  },
  {
    id: 3,
    text: `"I use Flowbite in every project I do. It's beautiful, responsive and user-friendly."`,
    name: "Jane Smith",
    role: "CEO at XYZ",
    img: "/avatars/client3.webp"
  }
];
