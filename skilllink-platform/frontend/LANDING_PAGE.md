# SkillLink Landing Page

## Overview
A modern, animated landing page inspired by Web3Bridge Africa's design, built with Next.js-style architecture using React, TailwindCSS, and Framer Motion.

## Features

### Sections
1. **Hero Section** - Eye-catching headline with CTA button
2. **Testimonials** - Real user stories with scroll animations
3. **Mission** - Company vision and values
4. **Programs** - Three main offerings (AI Bootcamps, SkillLink Labs, Educator Tools)
5. **Community** - Community engagement section
6. **FAQ** - Accordion-style frequently asked questions
7. **Newsletter** - Email subscription form
8. **Footer** - Links and social media

### Design
- **Colors**: White and Red (#dc2626) brand theme
- **Animations**: Framer Motion for smooth transitions
- **Icons**: React Icons (Font Awesome)
- **Responsive**: Mobile-first design

### Navigation
- Fixed navbar with smooth scroll to sections
- Mobile hamburger menu
- Quick access to login and registration

## Routes
- `/` - Landing page (shown to non-authenticated users)
- `/register/student` - Student registration
- `/login` - Login page

## Components Location
All landing page components are in: `src/components/landing/`
- `Navbar.tsx` - Navigation header
- `HeroSection.tsx` - Main hero section
- `TestimonialsSection.tsx` - User testimonials
- `MissionSection.tsx` - Mission statement
- `ProgramsSection.tsx` - Program cards
- `CommunitySection.tsx` - Community info
- `FAQSection.tsx` - FAQ accordion
- `NewsletterSection.tsx` - Email subscription
- `Footer.tsx` - Footer with links

## Customization

### Images
Replace placeholder images with real assets:
- Hero: `https://via.placeholder.com/1200x600.png?text=SkillLink+Hero+Platform`
- Testimonials: `https://via.placeholder.com/100x100.png?text=XX`
- Programs: `https://via.placeholder.com/400x250.png?text=Program+Name`
- Community: `https://via.placeholder.com/600x400.png?text=Community+Collaboration`

### Content
Update text in each component file to match your actual:
- Testimonials
- Program descriptions
- FAQ questions and answers
- Footer links

### Colors
Brand colors are defined in `tailwind.config.js`:
- `brand-red`: #dc2626
- `brand-white`: #ffffff

## Build Status
✅ TypeScript compilation: Success
✅ Production build: Success
✅ No errors or warnings
