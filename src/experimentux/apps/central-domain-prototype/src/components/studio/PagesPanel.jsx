/**
 * PagesPanel Component
 * Left-docked panel with Pages, Layers, and Lists tabs
 * Includes Quick Access panel at the bottom with adjustable height
 * Supports inline page creation with instant feedback
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Layers,
  List,
  Search,
  Plus,
  ChevronRight,
  ChevronDown,
  Square,
  Diamond,
  Circle,
  ArrowRight,
  Minus,
  Pencil,
  Type,
  ListOrdered,
  Image,
  GripHorizontal,
  File,
  Folder,
  Code,
  Database,
  Settings,
  Workflow,
  LayoutGrid,
  Users,
  Sparkles,
  Award,
  MessageSquareQuote,
  HelpCircle,
  Megaphone,
  Grid3X3
} from 'lucide-react';
import { theme } from '../../config/theme';
import { useStudioDockStore } from '../../store/studioDockStore';
import { usePagesStore } from '../../store/pagesStore';
import { useEditorStore } from '../../store/editorStore';

// Panel animation variants - only animate x and opacity
const panelVariants = {
  hidden: { x: -280, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30
    }
  },
  exit: {
    x: -280,
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

// Tab configuration
const TABS = [
  { id: 'pages', label: 'Pages', icon: FileText },
  { id: 'layers', label: 'Layers', icon: Layers },
  { id: 'lists', label: 'Lists', icon: List }
];

// Mock layers data (tree structure)
const MOCK_LAYERS = [
  {
    id: 'root',
    name: 'Page',
    type: 'page',
    expanded: true,
    children: [
      {
        id: 'header',
        name: 'Header',
        type: 'section',
        expanded: true,
        children: [
          { id: 'logo', name: 'Logo', type: 'image', children: [] },
          { id: 'nav', name: 'Navigation', type: 'nav', expanded: false, children: [
            { id: 'nav-home', name: 'Home Link', type: 'link', children: [] },
            { id: 'nav-about', name: 'About Link', type: 'link', children: [] },
            { id: 'nav-contact', name: 'Contact Link', type: 'link', children: [] }
          ]},
          { id: 'search', name: 'Search Bar', type: 'input', children: [] }
        ]
      },
      {
        id: 'main',
        name: 'Main Content',
        type: 'section',
        expanded: true,
        children: [
          { id: 'hero', name: 'Hero Section', type: 'section', expanded: false, children: [
            { id: 'hero-title', name: 'Title', type: 'text', children: [] },
            { id: 'hero-subtitle', name: 'Subtitle', type: 'text', children: [] },
            { id: 'hero-cta', name: 'CTA Button', type: 'button', children: [] }
          ]},
          { id: 'features', name: 'Features Grid', type: 'grid', children: [] },
          { id: 'testimonials', name: 'Testimonials', type: 'carousel', children: [] }
        ]
      },
      {
        id: 'footer',
        name: 'Footer',
        type: 'section',
        expanded: false,
        children: [
          { id: 'footer-links', name: 'Footer Links', type: 'nav', children: [] },
          { id: 'copyright', name: 'Copyright', type: 'text', children: [] }
        ]
      }
    ]
  }
];

// Mock lists data
const MOCK_LISTS = [
  { id: '1', name: 'User Authentication Flow', type: 'process', icon: Workflow },
  { id: '2', name: 'Data Validation Rules', type: 'process', icon: Workflow },
  { id: '3', name: 'utils/helpers.js', type: 'code', icon: Code },
  { id: '4', name: 'components/Button.jsx', type: 'code', icon: Code },
  { id: '5', name: 'hooks/useAuth.js', type: 'code', icon: Code },
  { id: '6', name: 'Users Collection', type: 'record', icon: Database },
  { id: '7', name: 'Products Collection', type: 'record', icon: Database },
  { id: '8', name: 'Orders Collection', type: 'record', icon: Database },
  { id: '9', name: 'Global Settings', type: 'config', icon: Settings }
];

// Block tools (individual elements)
const BLOCKS = [
  { id: 'rectangle', label: 'Rectangle', icon: Square },
  { id: 'diamond', label: 'Diamond', icon: Diamond },
  { id: 'ellipse', label: 'Ellipse', icon: Circle },
  { id: 'arrow', label: 'Arrow', icon: ArrowRight },
  { id: 'line', label: 'Line', icon: Minus },
  { id: 'draw', label: 'Draw', icon: Pencil },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'list', label: 'List', icon: ListOrdered },
  { id: 'image', label: 'Image', icon: Image }
];

// Combos (pre-built section templates)
const COMBOS = [
  {
    id: 'event-hero',
    label: 'Event Hero',
    description: 'Video/image background with title, date, CTA',
    icon: Sparkles,
    category: 'event'
  },
  {
    id: 'speakers-carousel',
    label: 'Speakers',
    description: 'Horizontal carousel of speaker cards',
    icon: Users,
    category: 'event'
  },
  {
    id: 'logo-strip',
    label: 'Logo Strip',
    description: 'Row of brand/sponsor logos',
    icon: LayoutGrid,
    category: 'event'
  },
  {
    id: 'feature-mosaic',
    label: 'Feature Mosaic',
    description: 'Bento-style grid with content cards',
    icon: Grid3X3,
    category: 'event'
  },
  {
    id: 'sponsor-showcase',
    label: 'Sponsors',
    description: 'Title, CTA, and sponsor logo grid',
    icon: Award,
    category: 'event'
  },
  {
    id: 'pricing-table',
    label: 'Pricing Table',
    description: '3-column pricing comparison',
    icon: LayoutGrid,
    category: 'general'
  },
  {
    id: 'testimonial',
    label: 'Testimonial',
    description: 'Quote with avatar and attribution',
    icon: MessageSquareQuote,
    category: 'general'
  },
  {
    id: 'faq-accordion',
    label: 'FAQ',
    description: 'Expandable Q&A section',
    icon: HelpCircle,
    category: 'general'
  },
  {
    id: 'cta-banner',
    label: 'CTA Banner',
    description: 'Full-width call to action',
    icon: Megaphone,
    category: 'general'
  },
  {
    id: 'card-grid',
    label: 'Card Grid',
    description: 'Responsive grid of content cards',
    icon: Grid3X3,
    category: 'general'
  },
  // Annual Conference-accurate combos
  {
    id: 'summit-marquee',
    label: 'Summit Marquee',
    description: 'Full-width dark hero with gradient, title, dates',
    icon: Sparkles,
    category: 'event'
  },
  {
    id: 'mosaic-featured-left',
    label: 'Mosaic Left',
    description: 'Large gradient card left, white card right',
    icon: Grid3X3,
    category: 'event'
  },
  {
    id: 'mosaic-featured-right',
    label: 'Mosaic Right',
    description: 'White card left, large gradient card right',
    icon: Grid3X3,
    category: 'event'
  },
  {
    id: 'speakers-row',
    label: 'Speakers Row',
    description: 'Horizontal speaker cards with photos',
    icon: Users,
    category: 'event'
  },
  {
    id: 'brands-bar',
    label: 'Brands Bar',
    description: 'Horizontal brand logos with title',
    icon: LayoutGrid,
    category: 'event'
  },
  {
    id: 'sponsor-grid',
    label: 'Sponsor Grid',
    description: 'Sponsor logos in grid with CTA',
    icon: Award,
    category: 'event'
  },
  {
    id: 'two-col-cta',
    label: 'Two Column CTA',
    description: 'Content left, CTA card right',
    icon: LayoutGrid,
    category: 'event'
  },
  {
    id: 'summit-footer',
    label: 'Summit Footer',
    description: 'Dark multi-column footer with links',
    icon: LayoutGrid,
    category: 'event'
  }
];

// Combo element templates - each combo maps to markup elements with 'html' markupType
const COMBO_TEMPLATES = {
  'event-hero': {
    type: 'markup',
    data: {
      content: `<div style="background: linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%); padding: 80px 40px; text-align: center; border-radius: 12px; position: relative; overflow: hidden;">
  <div style="position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80') center/cover; opacity: 0.3;"></div>
  <div style="position: relative; z-index: 1;">
    <p style="color: #ff6b6b; font-size: 14px; font-weight: 600; letter-spacing: 2px; margin-bottom: 16px;">MARCH 18-20, 2025 • LAS VEGAS</p>
    <h1 style="color: white; font-size: 48px; font-weight: 700; margin-bottom: 16px;">Annual Conference</h1>
    <p style="color: rgba(255,255,255,0.8); font-size: 20px; margin-bottom: 32px;">The Digital Experience Conference</p>
    <button style="background: #ff6b6b; color: white; padding: 16px 32px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">Register Now</button>
  </div>
</div>`
    },
    settings: { markup: { markupType: 'html' } }
  },
  'speakers-carousel': {
    type: 'markup',
    data: {
      content: `<div style="padding: 40px; background: #f8f9fa; border-radius: 12px;">
  <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 32px; text-align: center;">Featured Speakers</h2>
  <div style="display: flex; gap: 24px; overflow-x: auto; padding-bottom: 16px;">
    <div style="flex: 0 0 200px; text-align: center; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 16px;"></div>
      <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">Sarah Johnson</h3>
      <p style="font-size: 13px; color: #666;">VP of Product, Organization Name</p>
    </div>
    <div style="flex: 0 0 200px; text-align: center; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 50%; margin: 0 auto 16px;"></div>
      <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">Michael Chen</h3>
      <p style="font-size: 13px; color: #666;">CTO, TechCorp</p>
    </div>
    <div style="flex: 0 0 200px; text-align: center; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 50%; margin: 0 auto 16px;"></div>
      <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">Emily Davis</h3>
      <p style="font-size: 13px; color: #666;">Design Lead, Google</p>
    </div>
  </div>
</div>`
    },
    settings: { markup: { markupType: 'html' } }
  },
  'logo-strip': {
    type: 'markup',
    data: {
      content: `<div style="padding: 32px; background: white; border-radius: 12px; border: 1px solid #e5e7eb;">
  <p style="text-align: center; color: #666; font-size: 13px; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px;">Trusted by leading companies</p>
  <div style="display: flex; justify-content: center; align-items: center; gap: 48px; flex-wrap: wrap;">
    <div style="width: 100px; height: 40px; background: #e5e7eb; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; font-weight: 600;">Logo 1</div>
    <div style="width: 100px; height: 40px; background: #e5e7eb; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; font-weight: 600;">Logo 2</div>
    <div style="width: 100px; height: 40px; background: #e5e7eb; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; font-weight: 600;">Logo 3</div>
    <div style="width: 100px; height: 40px; background: #e5e7eb; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; font-weight: 600;">Logo 4</div>
    <div style="width: 100px; height: 40px; background: #e5e7eb; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; font-weight: 600;">Logo 5</div>
  </div>
</div>`
    },
    settings: { markup: { markupType: 'html' } }
  },
  'feature-mosaic': {
    type: 'markup',
    data: {
      content: `<div style="padding: 40px; background: #f8f9fa; border-radius: 12px;">
  <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 32px; text-align: center;">What You'll Experience</h2>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
    <div style="grid-row: span 2; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 32px; color: white;">
      <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 12px;">300+ Sessions</h3>
      <p style="opacity: 0.9;">Deep-dive into the latest digital experience innovations</p>
    </div>
    <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Hands-on Labs</h3>
      <p style="font-size: 14px; color: #666;">Get practical experience with experts</p>
    </div>
    <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Networking</h3>
      <p style="font-size: 14px; color: #666;">Connect with 10,000+ attendees</p>
    </div>
    <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; padding: 24px; color: white;">
      <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Keynotes</h3>
      <p style="opacity: 0.9; font-size: 14px;">Hear from industry visionaries</p>
    </div>
    <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Community</h3>
      <p style="font-size: 14px; color: #666;">Join a global community</p>
    </div>
  </div>
</div>`
    },
    settings: { markup: { markupType: 'html' } }
  },
  'sponsor-showcase': {
    type: 'markup',
    data: {
      content: `<div style="padding: 48px; background: #1e3a5f; border-radius: 12px; text-align: center;">
  <h2 style="color: white; font-size: 28px; font-weight: 700; margin-bottom: 16px;">Our Sponsors</h2>
  <p style="color: rgba(255,255,255,0.7); margin-bottom: 32px;">Join leading brands at Annual Conference</p>
  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 32px;">
    <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 24px; display: flex; align-items: center; justify-content: center;">
      <span style="color: rgba(255,255,255,0.5); font-weight: 600;">Platinum</span>
    </div>
    <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 24px; display: flex; align-items: center; justify-content: center;">
      <span style="color: rgba(255,255,255,0.5); font-weight: 600;">Gold</span>
    </div>
    <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 24px; display: flex; align-items: center; justify-content: center;">
      <span style="color: rgba(255,255,255,0.5); font-weight: 600;">Silver</span>
    </div>
    <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 24px; display: flex; align-items: center; justify-content: center;">
      <span style="color: rgba(255,255,255,0.5); font-weight: 600;">Bronze</span>
    </div>
  </div>
  <button style="background: #ff6b6b; color: white; padding: 14px 28px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">Become a Sponsor</button>
</div>`
    },
    settings: { markup: { markupType: 'html' } }
  },
  'pricing-table': {
    type: 'markup',
    data: {
      content: `<div style="padding: 40px; background: white; border-radius: 12px;">
  <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 32px; text-align: center;">Choose Your Plan</h2>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
    <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; text-align: center;">
      <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Basic</h3>
      <p style="font-size: 36px; font-weight: 700; margin-bottom: 16px;">$99</p>
      <ul style="text-align: left; list-style: none; padding: 0; margin-bottom: 24px; color: #666; font-size: 14px;">
        <li style="margin-bottom: 8px;">✓ Access to sessions</li>
        <li style="margin-bottom: 8px;">✓ Digital content</li>
        <li style="margin-bottom: 8px;">✓ Community access</li>
      </ul>
      <button style="width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer;">Get Started</button>
    </div>
    <div style="border: 2px solid #667eea; border-radius: 12px; padding: 32px; text-align: center; position: relative;">
      <span style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #667eea; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">Popular</span>
      <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Pro</h3>
      <p style="font-size: 36px; font-weight: 700; margin-bottom: 16px;">$299</p>
      <ul style="text-align: left; list-style: none; padding: 0; margin-bottom: 24px; color: #666; font-size: 14px;">
        <li style="margin-bottom: 8px;">✓ Everything in Basic</li>
        <li style="margin-bottom: 8px;">✓ Hands-on labs</li>
        <li style="margin-bottom: 8px;">✓ Networking events</li>
      </ul>
      <button style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">Get Started</button>
    </div>
    <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; text-align: center;">
      <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Enterprise</h3>
      <p style="font-size: 36px; font-weight: 700; margin-bottom: 16px;">$999</p>
      <ul style="text-align: left; list-style: none; padding: 0; margin-bottom: 24px; color: #666; font-size: 14px;">
        <li style="margin-bottom: 8px;">✓ Everything in Pro</li>
        <li style="margin-bottom: 8px;">✓ VIP access</li>
        <li style="margin-bottom: 8px;">✓ Private sessions</li>
      </ul>
      <button style="width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer;">Contact Sales</button>
    </div>
  </div>
</div>`
    },
    settings: { markup: { markupType: 'html' } }
  },
  'testimonial': {
    type: 'markup',
    data: {
      content: `<div style="padding: 48px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; text-align: center;">
  <div style="max-width: 600px; margin: 0 auto;">
    <p style="font-size: 24px; color: white; font-style: italic; line-height: 1.6; margin-bottom: 24px;">"Annual Conference transformed how we approach digital experiences. The insights and connections we made were invaluable."</p>
    <div style="display: flex; align-items: center; justify-content: center; gap: 16px;">
      <div style="width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 50%;"></div>
      <div style="text-align: left;">
        <p style="color: white; font-weight: 600; margin-bottom: 2px;">Jane Smith</p>
        <p style="color: rgba(255,255,255,0.7); font-size: 14px;">CMO, Innovation Inc.</p>
      </div>
    </div>
  </div>
</div>`
    },
    settings: { markup: { markupType: 'html' } }
  },
  'faq-accordion': {
    type: 'markup',
    data: {
      content: `<div style="padding: 40px; background: white; border-radius: 12px;">
  <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 32px; text-align: center;">Frequently Asked Questions</h2>
  <div style="max-width: 700px; margin: 0 auto;">
    <div style="border-bottom: 1px solid #e5e7eb; padding: 20px 0;">
      <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px; cursor: pointer;">What's included in my registration?</h3>
      <p style="color: #666; font-size: 14px; line-height: 1.6;">Your registration includes access to all keynotes, breakout sessions, hands-on labs, networking events, and meals during the conference.</p>
    </div>
    <div style="border-bottom: 1px solid #e5e7eb; padding: 20px 0;">
      <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px; cursor: pointer;">Is there a virtual attendance option?</h3>
      <p style="color: #666; font-size: 14px; line-height: 1.6;">Yes, we offer a comprehensive virtual experience with live streams of all main stage sessions and virtual networking opportunities.</p>
    </div>
    <div style="border-bottom: 1px solid #e5e7eb; padding: 20px 0;">
      <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px; cursor: pointer;">What's the cancellation policy?</h3>
      <p style="color: #666; font-size: 14px; line-height: 1.6;">Full refunds are available up to 30 days before the event. After that, we offer a 50% refund or the option to transfer your ticket.</p>
    </div>
  </div>
</div>`
    },
    settings: { markup: { markupType: 'html' } }
  },
  'cta-banner': {
    type: 'markup',
    data: {
      content: `<div style="padding: 48px; background: linear-gradient(90deg, #ff6b6b 0%, #ff8e53 100%); border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
  <div>
    <h2 style="color: white; font-size: 28px; font-weight: 700; margin-bottom: 8px;">Ready to Transform Your Digital Experience?</h2>
    <p style="color: rgba(255,255,255,0.9); font-size: 16px;">Join thousands of innovators at Annual Conference 2025</p>
  </div>
  <button style="background: white; color: #ff6b6b; padding: 16px 32px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; white-space: nowrap;">Register Now</button>
</div>`
    },
    settings: { markup: { markupType: 'html' } }
  },
  'card-grid': {
    type: 'markup',
    data: {
      content: `<div style="padding: 40px; background: #f8f9fa; border-radius: 12px;">
  <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 32px; text-align: center;">Explore Topics</h2>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
    <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="height: 140px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
      <div style="padding: 20px;">
        <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Customer Experience</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">Learn to create seamless customer journeys</p>
        <a href="#" style="color: #667eea; font-size: 14px; font-weight: 500;">Learn more →</a>
      </div>
    </div>
    <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="height: 140px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);"></div>
      <div style="padding: 20px;">
        <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Data & Insights</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">Harness the power of your data</p>
        <a href="#" style="color: #667eea; font-size: 14px; font-weight: 500;">Learn more →</a>
      </div>
    </div>
    <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="height: 140px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);"></div>
      <div style="padding: 20px;">
        <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Content Creation</h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">Scale content with AI and automation</p>
        <a href="#" style="color: #667eea; font-size: 14px; font-weight: 500;">Learn more →</a>
      </div>
    </div>
  </div>
</div>`
    },
    settings: { markup: { markupType: 'html' } }
  },

  // Annual Conference-accurate templates
  'summit-marquee': {
    type: 'markup',
    data: {
      content: `<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 80px 60px; position: relative; overflow: hidden;">
  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" style=\"stop-color:%23ff6b6b;stop-opacity:0.1\"/><stop offset=\"100%\" style=\"stop-color:%23764ba2;stop-opacity:0.05\"/></linearGradient></defs><circle cx=\"20\" cy=\"20\" r=\"40\" fill=\"url(%23g)\"/><circle cx=\"80\" cy=\"80\" r=\"60\" fill=\"url(%23g)\"/></svg>') center/cover; opacity: 0.6;"></div>
  <div style="position: relative; z-index: 1; max-width: 900px;">
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
      <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #ff6b6b, #ee5a5a); border-radius: 6px;"></div>
      <span style="color: #ff6b6b; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">ANNUAL CONFERENCE 2025</span>
    </div>
    <h1 style="color: white; font-size: 56px; font-weight: 700; line-height: 1.1; margin-bottom: 16px; letter-spacing: -1px;">The Digital Experience Conference</h1>
    <p style="color: rgba(255,255,255,0.85); font-size: 20px; margin-bottom: 12px; font-weight: 400;">March 18–20 | Las Vegas & Online</p>
    <p style="color: rgba(255,255,255,0.7); font-size: 16px; margin-bottom: 32px; max-width: 600px; line-height: 1.6;">Join 10,000+ digital leaders for three days of innovation, inspiration, and connection.</p>
    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
      <button style="background: linear-gradient(135deg, #ff6b6b, #ee5a5a); color: white; padding: 16px 32px; border: none; border-radius: 30px; font-size: 16px; font-weight: 600; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 20px rgba(255,107,107,0.4);">Register Now</button>
      <button style="background: transparent; color: white; padding: 16px 32px; border: 2px solid rgba(255,255,255,0.3); border-radius: 30px; font-size: 16px; font-weight: 600; cursor: pointer;">Watch Highlights</button>
    </div>
  </div>
</div>`
    },
    settings: { markup: { markupType: 'html' } }
  },

  'mosaic-featured-left': {
    type: 'markup',
    data: {
      content: `<div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; padding: 40px 60px; background: #f5f5f7;">
  <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 24px; padding: 48px; display: flex; flex-direction: column; justify-content: space-between; min-height: 400px; position: relative; overflow: hidden;">
    <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: linear-gradient(135deg, #ff6b6b 0%, #764ba2 100%); border-radius: 50%; opacity: 0.3; filter: blur(40px);"></div>
    <div style="position: relative; z-index: 1;">
      <span style="color: #ff6b6b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Featured Session</span>
      <h2 style="color: white; font-size: 32px; font-weight: 700; margin-top: 16px; line-height: 1.2;">The Future of Customer Experience</h2>
      <p style="color: rgba(255,255,255,0.7); font-size: 16px; margin-top: 16px; line-height: 1.6;">Discover how AI is transforming every touchpoint of the customer journey.</p>
    </div>
    <button style="background: white; color: #1a1a2e; padding: 14px 28px; border: none; border-radius: 30px; font-size: 14px; font-weight: 600; cursor: pointer; align-self: flex-start;">Learn more →</button>
  </div>
  <div style="background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
    <span style="color: #666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">300+ Sessions</span>
    <h3 style="color: #1a1a2e; font-size: 24px; font-weight: 700; margin-top: 16px; line-height: 1.3;">Deep-dive into innovation tracks</h3>
    <p style="color: #666; font-size: 15px; margin-top: 12px; line-height: 1.6;">Explore sessions across Data & Insights, Content Velocity, and Customer Journeys.</p>
    <div style="margin-top: 32px; display: flex; flex-wrap: wrap; gap: 8px;">
      <span style="background: #f0f0f2; color: #1a1a2e; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 500;">Analytics</span>
      <span style="background: #f0f0f2; color: #1a1a2e; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 500;">AI/ML</span>
      <span style="background: #f0f0f2; color: #1a1a2e; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 500;">Commerce</span>
    </div>
  </div>
</div>`
    },
    settings: { markup: { markupType: 'html' } }
  },

  'mosaic-featured-right': {
    type: 'markup',
    data: {
      content: `<div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px; padding: 40px 60px; background: #f5f5f7;">
  <div style="background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
    <span style="color: #666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Hands-on Labs</span>
    <h3 style="color: #1a1a2e; font-size: 24px; font-weight: 700; margin-top: 16px; line-height: 1.3;">Get practical experience</h3>
    <p style="color: #666; font-size: 15px; margin-top: 12px; line-height: 1.6;">Work alongside Organization Name experts in interactive workshops and labs.</p>
    <div style="margin-top: 32px;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 10px;"></div>
        <span style="font-size: 14px; color: #1a1a2e; font-weight: 500;">50+ hands-on sessions</span>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f093fb, #f5576c); border-radius: 10px;"></div>
        <span style="font-size: 14px; color: #1a1a2e; font-weight: 500;">Expert-led guidance</span>
      </div>
    </div>
  </div>
  <div style="background: linear-gradient(135deg, #764ba2 0%, #667eea 100%); border-radius: 24px; padding: 48px; display: flex; flex-direction: column; justify-content: space-between; min-height: 400px; position: relative; overflow: hidden;">
    <div style="position: absolute; bottom: -50px; left: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%; filter: blur(40px);"></div>
    <div style="position: relative; z-index: 1;">
      <span style="color: rgba(255,255,255,0.8); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Networking</span>
      <h2 style="color: white; font-size: 32px; font-weight: 700; margin-top: 16px; line-height: 1.2;">Connect with 10,000+ peers</h2>
      <p style="color: rgba(255,255,255,0.8); font-size: 16px; margin-top: 16px; line-height: 1.6;">Build relationships that last beyond the conference.</p>
    </div>
    <button style="background: white; color: #764ba2; padding: 14px 28px; border: none; border-radius: 30px; font-size: 14px; font-weight: 600; cursor: pointer; align-self: flex-start;">View agenda →</button>
  </div>
</div>`
    },
    settings: { markup: { markupType: 'html' } }
  },

  'speakers-row': {
    type: 'markup',
    data: {
      content: `<div style="padding: 60px; background: white;">
  <div style="text-align: center; margin-bottom: 48px;">
    <span style="color: #ff6b6b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Featured Speakers</span>
    <h2 style="color: #1a1a2e; font-size: 36px; font-weight: 700; margin-top: 12px;">Learn from Industry Leaders</h2>
  </div>
  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px;">
    <div style="text-align: center;">
      <div style="width: 140px; height: 140px; margin: 0 auto 20px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); position: relative; overflow: hidden;">
        <div style="position: absolute; inset: 4px; background: #e0e0e0; border-radius: 50%;"></div>
      </div>
      <h3 style="font-size: 18px; font-weight: 600; color: #1a1a2e; margin-bottom: 4px;">Sarah Johnson</h3>
      <p style="font-size: 14px; color: #666; margin-bottom: 4px;">Chief Product Officer</p>
      <p style="font-size: 13px; color: #999;">Organization Name</p>
    </div>
    <div style="text-align: center;">
      <div style="width: 140px; height: 140px; margin: 0 auto 20px; border-radius: 50%; background: linear-gradient(135deg, #f093fb, #f5576c); position: relative; overflow: hidden;">
        <div style="position: absolute; inset: 4px; background: #e0e0e0; border-radius: 50%;"></div>
      </div>
      <h3 style="font-size: 18px; font-weight: 600; color: #1a1a2e; margin-bottom: 4px;">Michael Chen</h3>
      <p style="font-size: 14px; color: #666; margin-bottom: 4px;">VP of Engineering</p>
      <p style="font-size: 13px; color: #999;">Google</p>
    </div>
    <div style="text-align: center;">
      <div style="width: 140px; height: 140px; margin: 0 auto 20px; border-radius: 50%; background: linear-gradient(135deg, #4facfe, #00f2fe); position: relative; overflow: hidden;">
        <div style="position: absolute; inset: 4px; background: #e0e0e0; border-radius: 50%;"></div>
      </div>
      <h3 style="font-size: 18px; font-weight: 600; color: #1a1a2e; margin-bottom: 4px;">Emily Davis</h3>
      <p style="font-size: 14px; color: #666; margin-bottom: 4px;">Head of Design</p>
      <p style="font-size: 13px; color: #999;">Microsoft</p>
    </div>
    <div style="text-align: center;">
      <div style="width: 140px; height: 140px; margin: 0 auto 20px; border-radius: 50%; background: linear-gradient(135deg, #ff6b6b, #ee5a5a); position: relative; overflow: hidden;">
        <div style="position: absolute; inset: 4px; background: #e0e0e0; border-radius: 50%;"></div>
      </div>
      <h3 style="font-size: 18px; font-weight: 600; color: #1a1a2e; margin-bottom: 4px;">David Kim</h3>
      <p style="font-size: 14px; color: #666; margin-bottom: 4px;">CTO</p>
      <p style="font-size: 13px; color: #999;">Salesforce</p>
    </div>
  </div>
  <div style="text-align: center; margin-top: 40px;">
    <button style="background: transparent; color: #1a1a2e; padding: 14px 28px; border: 2px solid #e0e0e0; border-radius: 30px; font-size: 14px; font-weight: 600; cursor: pointer;">View all speakers →</button>
  </div>
</div>`
    },
    settings: { markup: { markupType: 'html' } }
  },

  'brands-bar': {
    type: 'markup',
    data: {
      content: `<div style="padding: 48px 60px; background: #fafafa; border-top: 1px solid #eee; border-bottom: 1px solid #eee;">
  <p style="text-align: center; color: #888; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 32px;">Trusted by leading brands</p>
  <div style="display: flex; justify-content: center; align-items: center; gap: 60px; flex-wrap: wrap;">
    <div style="width: 120px; height: 48px; background: #e5e5e5; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #aaa; font-weight: 600; font-size: 14px;">Brand</div>
    <div style="width: 120px; height: 48px; background: #e5e5e5; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #aaa; font-weight: 600; font-size: 14px;">Brand</div>
    <div style="width: 120px; height: 48px; background: #e5e5e5; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #aaa; font-weight: 600; font-size: 14px;">Brand</div>
    <div style="width: 120px; height: 48px; background: #e5e5e5; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #aaa; font-weight: 600; font-size: 14px;">Brand</div>
    <div style="width: 120px; height: 48px; background: #e5e5e5; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #aaa; font-weight: 600; font-size: 14px;">Brand</div>
    <div style="width: 120px; height: 48px; background: #e5e5e5; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #aaa; font-weight: 600; font-size: 14px;">Brand</div>
  </div>
</div>`
    },
    settings: { markup: { markupType: 'html' } }
  },

  'sponsor-grid': {
    type: 'markup',
    data: {
      content: `<div style="padding: 60px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">
  <div style="text-align: center; margin-bottom: 48px;">
    <span style="color: #ff6b6b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Partners & Sponsors</span>
    <h2 style="color: white; font-size: 36px; font-weight: 700; margin-top: 12px;">Thank You to Our Sponsors</h2>
  </div>
  <div style="margin-bottom: 40px;">
    <p style="color: rgba(255,255,255,0.5); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px;">Platinum</p>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
      <div style="background: rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; display: flex; align-items: center; justify-content: center; height: 100px;">
        <span style="color: rgba(255,255,255,0.4); font-weight: 600;">Logo</span>
      </div>
      <div style="background: rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; display: flex; align-items: center; justify-content: center; height: 100px;">
        <span style="color: rgba(255,255,255,0.4); font-weight: 600;">Logo</span>
      </div>
      <div style="background: rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; display: flex; align-items: center; justify-content: center; height: 100px;">
        <span style="color: rgba(255,255,255,0.4); font-weight: 600;">Logo</span>
      </div>
    </div>
  </div>
  <div style="margin-bottom: 40px;">
    <p style="color: rgba(255,255,255,0.5); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px;">Gold</p>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
      <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 24px; display: flex; align-items: center; justify-content: center; height: 80px;">
        <span style="color: rgba(255,255,255,0.3); font-weight: 500; font-size: 14px;">Logo</span>
      </div>
      <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 24px; display: flex; align-items: center; justify-content: center; height: 80px;">
        <span style="color: rgba(255,255,255,0.3); font-weight: 500; font-size: 14px;">Logo</span>
      </div>
      <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 24px; display: flex; align-items: center; justify-content: center; height: 80px;">
        <span style="color: rgba(255,255,255,0.3); font-weight: 500; font-size: 14px;">Logo</span>
      </div>
      <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 24px; display: flex; align-items: center; justify-content: center; height: 80px;">
        <span style="color: rgba(255,255,255,0.3); font-weight: 500; font-size: 14px;">Logo</span>
      </div>
    </div>
  </div>
  <div style="text-align: center; margin-top: 48px;">
    <button style="background: linear-gradient(135deg, #ff6b6b, #ee5a5a); color: white; padding: 16px 32px; border: none; border-radius: 30px; font-size: 16px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 20px rgba(255,107,107,0.4);">Become a Sponsor</button>
  </div>
</div>`
    },
    settings: { markup: { markupType: 'html' } }
  },

  'two-col-cta': {
    type: 'markup',
    data: {
      content: `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding: 60px; background: #f5f5f7; align-items: center;">
  <div>
    <span style="color: #ff6b6b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Don't Miss Out</span>
    <h2 style="color: #1a1a2e; font-size: 40px; font-weight: 700; margin-top: 16px; line-height: 1.2;">Ready to transform your digital experience?</h2>
    <p style="color: #666; font-size: 18px; margin-top: 16px; line-height: 1.6;">Join thousands of innovators, creators, and leaders at the premier digital experience conference.</p>
    <div style="margin-top: 32px; display: flex; gap: 12px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 20px; height: 20px; background: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">✓</div>
        <span style="font-size: 14px; color: #666;">300+ sessions</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 20px; height: 20px; background: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">✓</div>
        <span style="font-size: 14px; color: #666;">50+ labs</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 20px; height: 20px; background: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">✓</div>
        <span style="font-size: 14px; color: #666;">Networking</span>
      </div>
    </div>
  </div>
  <div style="background: white; border-radius: 24px; padding: 48px; box-shadow: 0 8px 40px rgba(0,0,0,0.08); text-align: center;">
    <h3 style="font-size: 24px; font-weight: 700; color: #1a1a2e; margin-bottom: 8px;">Register Today</h3>
    <p style="color: #666; font-size: 15px; margin-bottom: 32px;">Early bird pricing ends February 28</p>
    <div style="background: #f5f5f7; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
      <p style="font-size: 14px; color: #666; margin-bottom: 4px;">Starting at</p>
      <p style="font-size: 48px; font-weight: 700; color: #1a1a2e;">$1,299</p>
      <p style="font-size: 14px; color: #888;">Full conference pass</p>
    </div>
    <button style="width: 100%; background: linear-gradient(135deg, #ff6b6b, #ee5a5a); color: white; padding: 18px 32px; border: none; border-radius: 30px; font-size: 16px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 20px rgba(255,107,107,0.4);">Register Now</button>
    <p style="font-size: 13px; color: #999; margin-top: 16px;">Group discounts available</p>
  </div>
</div>`
    },
    settings: { markup: { markupType: 'html' } }
  },

  'summit-footer': {
    type: 'markup',
    data: {
      content: `<div style="background: #0d0d0d; padding: 60px 60px 40px; color: white;">
  <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px;">
    <div>
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #ff6b6b, #ee5a5a); border-radius: 8px;"></div>
        <span style="font-size: 18px; font-weight: 700;">Annual Conference</span>
      </div>
      <p style="color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.6; max-width: 280px;">The Digital Experience Conference. Join us March 18-20, 2025 in Las Vegas and online.</p>
      <div style="display: flex; gap: 12px; margin-top: 24px;">
        <div style="width: 36px; height: 36px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <span style="color: rgba(255,255,255,0.6); font-size: 14px;">in</span>
        </div>
        <div style="width: 36px; height: 36px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <span style="color: rgba(255,255,255,0.6); font-size: 14px;">X</span>
        </div>
        <div style="width: 36px; height: 36px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <span style="color: rgba(255,255,255,0.6); font-size: 14px;">fb</span>
        </div>
      </div>
    </div>
    <div>
      <h4 style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.4); margin-bottom: 20px;">Event</h4>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 12px;"><a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px;">Sessions</a></li>
        <li style="margin-bottom: 12px;"><a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px;">Speakers</a></li>
        <li style="margin-bottom: 12px;"><a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px;">Agenda</a></li>
        <li style="margin-bottom: 12px;"><a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px;">Venue</a></li>
      </ul>
    </div>
    <div>
      <h4 style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.4); margin-bottom: 20px;">Attend</h4>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 12px;"><a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px;">Register</a></li>
        <li style="margin-bottom: 12px;"><a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px;">Pricing</a></li>
        <li style="margin-bottom: 12px;"><a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px;">Hotels</a></li>
        <li style="margin-bottom: 12px;"><a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px;">FAQ</a></li>
      </ul>
    </div>
    <div>
      <h4 style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.4); margin-bottom: 20px;">Partner</h4>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 12px;"><a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px;">Sponsors</a></li>
        <li style="margin-bottom: 12px;"><a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px;">Exhibitors</a></li>
        <li style="margin-bottom: 12px;"><a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px;">Media</a></li>
      </ul>
    </div>
    <div>
      <h4 style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.4); margin-bottom: 20px;">Support</h4>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 12px;"><a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px;">Contact</a></li>
        <li style="margin-bottom: 12px;"><a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px;">Help Center</a></li>
        <li style="margin-bottom: 12px;"><a href="#" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px;">Accessibility</a></li>
      </ul>
    </div>
  </div>
  <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; display: flex; justify-content: space-between; align-items: center;">
    <p style="color: rgba(255,255,255,0.4); font-size: 13px;">© 2025 Organization Name. All rights reserved.</p>
    <div style="display: flex; gap: 24px;">
      <a href="#" style="color: rgba(255,255,255,0.4); text-decoration: none; font-size: 13px;">Privacy</a>
      <a href="#" style="color: rgba(255,255,255,0.4); text-decoration: none; font-size: 13px;">Terms</a>
      <a href="#" style="color: rgba(255,255,255,0.4); text-decoration: none; font-size: 13px;">Cookie Preferences</a>
    </div>
  </div>
</div>`
    },
    settings: { markup: { markupType: 'html' } }
  }
};

// Tab button component - Framer-style pills
function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing[1.5],
        padding: `${theme.spacing[1.5]} ${theme.spacing[3]}`,
        color: active ? theme.colors.text.primary : theme.colors.text.tertiary,
        fontWeight: active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium,
        fontSize: theme.typography.fontSize.sm,
        background: active ? theme.colors.background.primary : 'transparent',
        border: 'none',
        borderRadius: theme.borderRadius.md,
        boxShadow: active ? theme.shadows.sm : 'none',
        cursor: 'pointer',
        transition: `all ${theme.transitions.fast}`
      }}
    >
      <Icon size={14} strokeWidth={active ? 2 : 1.5} />
      <span>{label}</span>
    </button>
  );
}

// Inline page creation row component
function InlinePageCreation({ onConfirm, onCancel }) {
  const inputRef = useRef(null);
  const { creatingPage, updateCreatingPage, confirmCreatePage, cancelCreatePage } = usePagesStore();

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newPage = confirmCreatePage();
      if (newPage && onConfirm) {
        onConfirm(newPage);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelCreatePage();
      if (onCancel) {
        onCancel();
      }
    }
  };

  const handleBlur = () => {
    // Confirm on blur if there's a name, otherwise cancel
    if (creatingPage?.name?.trim()) {
      const newPage = confirmCreatePage();
      if (newPage && onConfirm) {
        onConfirm(newPage);
      }
    } else {
      cancelCreatePage();
      if (onCancel) {
        onCancel();
      }
    }
  };

  if (!creatingPage) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      style={{
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: theme.spacing[2],
          padding: `${theme.spacing[2]} ${theme.spacing[2]}`,
          borderRadius: theme.borderRadius.sm,
          backgroundColor: theme.colors.interactive.selected,
          border: `1px solid ${theme.colors.primary[300]}`,
          margin: `0 ${theme.spacing[2]} ${theme.spacing[1]}`
        }}
      >
        <FileText
          size={14}
          strokeWidth={1.5}
          color={theme.colors.primary[500]}
          style={{ marginTop: '4px', flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            ref={inputRef}
            type="text"
            value={creatingPage.name}
            onChange={(e) => updateCreatingPage(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder="Page name"
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.primary,
              fontWeight: theme.typography.fontWeight.medium,
              fontFamily: theme.typography.fontFamily.sans,
              padding: 0,
              marginBottom: '2px'
            }}
          />
          <div
            style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              fontFamily: theme.typography.fontFamily.mono,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {creatingPage.slug || '/untitled'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Layer tree item component
function LayerItem({ item, depth = 0, onToggle, selectedId, onSelect }) {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = item.expanded;
  const isSelected = selectedId === item.id;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'page': return FileText;
      case 'section': return Folder;
      case 'image': return Image;
      case 'text': return Type;
      case 'button': return Square;
      case 'input': return Square;
      case 'nav': return List;
      case 'link': return ArrowRight;
      case 'grid': return Square;
      case 'carousel': return Square;
      default: return File;
    }
  };

  const TypeIcon = getTypeIcon(item.type);

  return (
    <div>
      <div
        onClick={() => onSelect(item.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing[1],
          padding: `${theme.spacing[1.5]} ${theme.spacing[2]}`,
          paddingLeft: `${8 + depth * 16}px`,
          cursor: 'pointer',
          backgroundColor: isSelected ? theme.colors.interactive.selected : 'transparent',
          borderRadius: theme.borderRadius.sm,
          transition: `background-color ${theme.transitions.fast}`
        }}
        onMouseEnter={(e) => {
          if (!isSelected) e.currentTarget.style.backgroundColor = theme.colors.interactive.hover;
        }}
        onMouseLeave={(e) => {
          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(item.id);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '16px',
              height: '16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: theme.colors.text.tertiary
            }}
          >
            {isExpanded ? (
              <ChevronDown size={12} strokeWidth={2} />
            ) : (
              <ChevronRight size={12} strokeWidth={2} />
            )}
          </button>
        ) : (
          <div style={{ width: '16px' }} />
        )}
        <TypeIcon size={14} strokeWidth={1.5} color={theme.colors.text.secondary} />
        <span
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: isSelected ? theme.colors.text.primary : theme.colors.text.secondary,
            fontWeight: isSelected ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal,
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {item.name}
        </span>
      </div>
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ overflow: 'hidden' }}
          >
            {item.children.map((child) => (
              <LayerItem
                key={child.id}
                item={child}
                depth={depth + 1}
                onToggle={onToggle}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Block tool button (for individual elements)
function BlockTool({ tool, onClick }) {
  const Icon = tool.icon;
  return (
    <button
      onClick={() => onClick(tool.id)}
      title={tool.label}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing[1],
        padding: theme.spacing[1.5],
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        borderRadius: theme.borderRadius.md,
        transition: `all ${theme.transitions.fast}`,
        minWidth: '48px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = theme.colors.interactive.hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <Icon size={18} strokeWidth={1.5} color={theme.colors.text.secondary} />
      <span
        style={{
          fontSize: '10px',
          color: theme.colors.text.tertiary,
          lineHeight: theme.typography.lineHeight.tight
        }}
      >
        {tool.label}
      </span>
    </button>
  );
}

// Combo item (for pre-built sections)
function ComboItem({ combo, onClick }) {
  const Icon = combo.icon;
  return (
    <button
      onClick={() => onClick(combo.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing[2],
        padding: `${theme.spacing[2]} ${theme.spacing[2.5]}`,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        borderRadius: theme.borderRadius.md,
        transition: `all ${theme.transitions.fast}`,
        width: '100%',
        textAlign: 'left'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = theme.colors.interactive.hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          backgroundColor: theme.colors.primary[50],
          borderRadius: theme.borderRadius.md,
          flexShrink: 0
        }}
      >
        <Icon size={16} strokeWidth={1.5} color={theme.colors.primary[600]} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text.primary,
            marginBottom: '2px'
          }}
        >
          {combo.label}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: theme.colors.text.tertiary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {combo.description}
        </div>
      </div>
    </button>
  );
}

// Accordion section for Quick Access
function AccordionSection({ title, count, isExpanded, onToggle, children }) {
  return (
    <div style={{ marginBottom: theme.spacing[1] }}>
      <button
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing[2],
          width: '100%',
          padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <div
          style={{
            transition: `transform ${theme.transitions.fast}`,
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
          }}
        >
          <ChevronRight size={12} strokeWidth={2} color={theme.colors.text.tertiary} />
        </div>
        <span
          style={{
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: theme.typography.letterSpacing.wider,
            flex: 1
          }}
        >
          {title}
        </span>
        {count !== undefined && (
          <span
            style={{
              fontSize: '10px',
              color: theme.colors.text.disabled,
              backgroundColor: theme.colors.background.tertiary,
              padding: `${theme.spacing[0.5]} ${theme.spacing[1.5]}`,
              borderRadius: theme.borderRadius.full
            }}
          >
            {count}
          </span>
        )}
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PagesPanel({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pages');
  const [searchQuery, setSearchQuery] = useState('');
  const [layers, setLayers] = useState(MOCK_LAYERS);
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const [quickAccessHeight, setQuickAccessHeight] = useState(480);
  const [isResizing, setIsResizing] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    blocks: true,
    combos: false
  });
  const resizeRef = useRef(null);
  const panelRef = useRef(null);

  // Toggle accordion section
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const studioOptionsBarOpen = useStudioDockStore((state) => state.panels.studioOptionsBar);

  // Pages store
  const {
    pages,
    creatingPage,
    startCreatingPage,
    selectPage,
    getActivePage,
    markPageHasContent
  } = usePagesStore();

  // Editor store - for adding elements
  const addElement = useEditorStore((state) => state.addElement);
  const currentPageKey = useEditorStore((state) => state.currentPageKey);
  const editorPages = useEditorStore((state) => state.pages);
  const ensurePage = useEditorStore((state) => state.ensurePage);

  // Helper to navigate to page editor
  const navigateToPageEditor = (page) => {
    // Remove leading slash for URL
    const slugPath = page.slug.startsWith('/') ? page.slug.slice(1) : page.slug;
    navigate(`/pages/${slugPath}/edit`);
  };

  // Handle quick access panel resize
  const handleResizeStart = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);

    const startY = e.clientY;
    const startHeight = quickAccessHeight;

    const handleMouseMove = (e) => {
      const deltaY = startY - e.clientY;
      const newHeight = Math.max(startHeight + deltaY, 100); // No upper limit
      setQuickAccessHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [quickAccessHeight]);

  // Filter pages based on search
  const filteredPages = pages.filter(
    (page) =>
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle add page button click
  const handleAddPage = () => {
    startCreatingPage();
  };

  // Handle page creation confirmed
  const handlePageCreated = (newPage) => {
    // Page is already added to store and selected
    // Navigate to the page editor
    navigateToPageEditor(newPage);
  };

  // Handle page click
  const handlePageClick = (pageId) => {
    const page = pages.find(p => p.id === pageId);
    selectPage(pageId);
    if (page) {
      navigateToPageEditor(page);
    }
  };

  // Toggle layer expansion
  const toggleLayer = useCallback((id) => {
    const toggleInTree = (items) => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, expanded: !item.expanded };
        }
        if (item.children && item.children.length > 0) {
          return { ...item, children: toggleInTree(item.children) };
        }
        return item;
      });
    };
    setLayers(toggleInTree(layers));
  }, [layers]);

  // Handle tool click
  const handleToolClick = (toolId) => {
    // TODO: Implement tool actions - add element to canvas
    console.log('Block clicked:', toolId);
  };

  // Handle combo click - add combo element to page
  const handleComboClick = (comboId) => {
    const template = COMBO_TEMPLATES[comboId];
    if (!template) {
      console.warn('No template found for combo:', comboId);
      return;
    }

    // Get the active page from pagesStore
    const activePage = getActivePage();
    if (!activePage) {
      console.warn('No active page to add combo to');
      return;
    }

    // Derive pageKey from slug (remove leading slash)
    const pageKey = activePage.slug.startsWith('/')
      ? activePage.slug.slice(1)
      : activePage.slug;

    // Ensure the page exists in editorStore
    ensurePage(pageKey, activePage.name);

    // Get the page data to find the zone
    const pageData = editorPages[pageKey];
    const zoneId = pageData?.zones?.[0]?.id || 'main-content';

    // Create a deep copy of the template element
    const element = JSON.parse(JSON.stringify(template));

    // Add to the first column of the first row
    addElement(zoneId, 0, 0, element, pageKey);

    // Mark page as having content
    markPageHasContent(activePage.id);

    console.log('Added combo to page:', comboId, 'pageKey:', pageKey);
  };

  // Offset for Studio Options Bar
  const topOffset = studioOptionsBarOpen ? 40 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: 'fixed',
            left: 0,
            top: topOffset,
            width: '280px',
            height: `calc(100vh - ${topOffset}px)`,
            background: theme.colors.background.primary,
            borderRight: `1px solid ${theme.colors.border.default}`,
            boxShadow: theme.shadows.lg,
            zIndex: theme.zIndex.fixed,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: theme.typography.fontFamily.sans
          }}
        >
          {/* Header with pill tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
              borderBottom: `1px solid ${theme.colors.border.subtle}`
            }}
          >
            {/* Pill Tabs */}
            <div
              style={{
                display: 'flex',
                gap: theme.spacing[1],
                padding: theme.spacing[0.5],
                background: theme.colors.background.secondary,
                borderRadius: theme.borderRadius.lg
              }}
            >
              {TABS.map((tab) => (
                <TabButton
                  key={tab.id}
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  icon={tab.icon}
                  label={tab.label}
                />
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div
            style={{
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Pages Tab */}
            {activeTab === 'pages' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Search and Add */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing[2],
                    padding: theme.spacing[3]
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing[2],
                      padding: `${theme.spacing[1.5]} ${theme.spacing[3]}`,
                      backgroundColor: theme.colors.background.secondary,
                      borderRadius: theme.borderRadius.md,
                      border: `1px solid ${theme.colors.border.subtle}`
                    }}
                  >
                    <Search size={14} strokeWidth={2} color={theme.colors.text.tertiary} />
                    <input
                      type="text"
                      placeholder="Search pages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        flex: 1,
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.text.primary,
                        fontFamily: theme.typography.fontFamily.sans
                      }}
                    />
                  </div>
                  <button
                    onClick={handleAddPage}
                    title="New page (⌘N)"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      backgroundColor: 'transparent',
                      border: `1px solid ${theme.colors.border.default}`,
                      borderRadius: theme.borderRadius.md,
                      cursor: 'pointer',
                      color: theme.colors.text.tertiary,
                      transition: `all ${theme.transitions.fast}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.interactive.hover;
                      e.currentTarget.style.borderColor = theme.colors.border.medium;
                      e.currentTarget.style.color = theme.colors.text.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = theme.colors.border.default;
                      e.currentTarget.style.color = theme.colors.text.tertiary;
                    }}
                  >
                    <Plus size={14} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Inline Page Creation */}
                <AnimatePresence>
                  {creatingPage && (
                    <InlinePageCreation
                      onConfirm={handlePageCreated}
                      onCancel={() => {}}
                    />
                  )}
                </AnimatePresence>

                {/* Pages List */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: `0 ${theme.spacing[2]}`
                  }}
                  className="custom-scrollbar"
                >
                  {filteredPages.map((page) => (
                    <div
                      key={page.id}
                      onClick={() => handlePageClick(page.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: theme.spacing[2],
                        padding: `${theme.spacing[2]} ${theme.spacing[2]}`,
                        cursor: 'pointer',
                        borderRadius: theme.borderRadius.sm,
                        backgroundColor: page.isActive ? theme.colors.interactive.selected : 'transparent',
                        transition: `background-color ${theme.transitions.fast}`
                      }}
                      onMouseEnter={(e) => {
                        if (!page.isActive) e.currentTarget.style.backgroundColor = theme.colors.interactive.hover;
                      }}
                      onMouseLeave={(e) => {
                        if (!page.isActive) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <FileText size={14} strokeWidth={1.5} color={theme.colors.text.tertiary} style={{ marginTop: '2px' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: theme.typography.fontSize.sm,
                            color: theme.colors.text.primary,
                            fontWeight: page.isActive ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {page.name}
                        </div>
                        <div
                          style={{
                            fontSize: theme.typography.fontSize.xs,
                            color: theme.colors.text.tertiary,
                            fontFamily: theme.typography.fontFamily.mono,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {page.slug}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Layers Tab */}
            {activeTab === 'layers' && (
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: theme.spacing[2]
                }}
                className="custom-scrollbar"
              >
                {layers.map((layer) => (
                  <LayerItem
                    key={layer.id}
                    item={layer}
                    depth={0}
                    onToggle={toggleLayer}
                    selectedId={selectedLayerId}
                    onSelect={setSelectedLayerId}
                  />
                ))}
              </div>
            )}

            {/* Lists Tab */}
            {activeTab === 'lists' && (
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: `${theme.spacing[2]} ${theme.spacing[2]}`
                }}
                className="custom-scrollbar"
              >
                {/* Group by type */}
                {['process', 'code', 'record', 'config'].map((type) => {
                  const items = MOCK_LISTS.filter((item) => item.type === type);
                  if (items.length === 0) return null;
                  const typeLabels = {
                    process: 'Processes',
                    code: 'Code Files',
                    record: 'Records',
                    config: 'Configuration'
                  };
                  return (
                    <div key={type} style={{ marginBottom: theme.spacing[4] }}>
                      <div
                        style={{
                          fontSize: theme.typography.fontSize.xs,
                          fontWeight: theme.typography.fontWeight.semibold,
                          color: theme.colors.text.tertiary,
                          textTransform: 'uppercase',
                          letterSpacing: theme.typography.letterSpacing.wider,
                          padding: `${theme.spacing[2]} ${theme.spacing[2]}`,
                          marginBottom: theme.spacing[1]
                        }}
                      >
                        {typeLabels[type]}
                      </div>
                      {items.map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <div
                            key={item.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: theme.spacing[2],
                              padding: `${theme.spacing[2]} ${theme.spacing[2]}`,
                              cursor: 'pointer',
                              borderRadius: theme.borderRadius.sm,
                              transition: `background-color ${theme.transitions.fast}`
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = theme.colors.interactive.hover;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <ItemIcon size={14} strokeWidth={1.5} color={theme.colors.text.tertiary} />
                            <span
                              style={{
                                fontSize: theme.typography.fontSize.sm,
                                color: theme.colors.text.secondary,
                                flex: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Access Panel */}
          <div
            style={{
              borderTop: `1px solid ${theme.colors.border.default}`,
              backgroundColor: theme.colors.background.secondary,
              height: quickAccessHeight,
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0
            }}
          >
            {/* Resize Handle */}
            <div
              ref={resizeRef}
              onMouseDown={handleResizeStart}
              style={{
                height: '12px',
                cursor: 'row-resize',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isResizing ? theme.colors.interactive.hover : 'transparent',
                transition: `background-color ${theme.transitions.fast}`
              }}
              onMouseEnter={(e) => {
                if (!isResizing) e.currentTarget.style.backgroundColor = theme.colors.interactive.hover;
              }}
              onMouseLeave={(e) => {
                if (!isResizing) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <GripHorizontal size={14} strokeWidth={1.5} color={theme.colors.text.disabled} />
            </div>

            {/* Accordion Sections */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto'
              }}
              className="custom-scrollbar"
            >
              {/* Blocks Section */}
              <AccordionSection
                title="Blocks"
                count={BLOCKS.length}
                isExpanded={expandedSections.blocks}
                onToggle={() => toggleSection('blocks')}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: theme.spacing[0.5],
                    padding: `0 ${theme.spacing[2]} ${theme.spacing[2]}`
                  }}
                >
                  {BLOCKS.map((tool) => (
                    <BlockTool key={tool.id} tool={tool} onClick={handleToolClick} />
                  ))}
                </div>
              </AccordionSection>

              {/* Combos Section */}
              <AccordionSection
                title="Combos"
                count={COMBOS.length}
                isExpanded={expandedSections.combos}
                onToggle={() => toggleSection('combos')}
              >
                <div style={{ padding: `0 ${theme.spacing[1]} ${theme.spacing[2]}` }}>
                  {COMBOS.map((combo) => (
                    <ComboItem key={combo.id} combo={combo} onClick={handleComboClick} />
                  ))}
                </div>
              </AccordionSection>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
