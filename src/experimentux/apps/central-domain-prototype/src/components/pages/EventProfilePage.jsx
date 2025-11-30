/**
 * EventProfilePage Component
 *
 * Displays the profile of an event with tabs for Profile, Activities, and More.
 * The More tab shows a collapsible vertical menu with People as first option.
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, Users, DollarSign, ArrowLeft,
  FileText, Leaf, Building2, Settings, Clock,
  CreditCard, Ticket, Utensils, MessageSquare,
  PanelLeftClose, PanelLeft, Presentation, MapPinned,
  TrendingUp, UserPlus, UserMinus, UserCheck,
  Download, Mail, AlertCircle, CheckCircle, Info,
  Search, StickyNote, ListTodo, Share2, Star, MoreHorizontal,
  PanelRightOpen, X, Filter, User, Briefcase, Plus, Check,
  Bed, ScrollText, Mic2, Award, HeartHandshake,
  ClipboardCheck, ClipboardList, LayoutTemplate, Image, Globe,
  ChevronRight, Eye, Edit3, Send, XCircle, RotateCcw,
  MessageCircle, Paperclip, Tag, Hash, Square, CheckSquare,
  ChevronDown, ChevronUp, Phone, AtSign, GraduationCap,
  ZoomIn, ZoomOut, RotateCw, FileCheck, Minus,
  UsersRound, CalendarDays, PartyPopper, CalendarMinus, CalendarPlus,
  Plane, Car, Wrench, ShoppingCart, Receipt, Undo2,
  Building, Route, DoorOpen
} from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { theme } from '../../config/theme';
import { FacetCard } from '../facets/FacetCard';
import { RecordSlideOut } from '../facets/RecordSlideOut';
import { FloatingPanel } from '../common/FloatingPanel';
import { FilterSummaryBar } from '../common/FilterSummaryBar';
import { useStudioDockStore } from '../../store/studioDockStore';

// Custom marker icon for the map
const markerIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z" fill="white"/>
      <circle cx="16" cy="16" r="6" fill="#121933"/>
    </svg>
  `),
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40]
});

// Event data
const EVENT_DATA = {
  'cpa-convention-2025': {
    id: 'cpa-convention-2025',
    title: 'CPA 2025: 86th Annual National Convention',
    startDate: new Date(2025, 5, 12),
    endDate: new Date(2025, 5, 14),
    venue: "St. John's Convention Centre",
    city: "St. John's, NL",
    coordinates: [47.5615, -52.7126], // St. John's, Newfoundland
    participants: 847,
    revenue: 425000,
    description: 'The premier annual gathering for psychologists across Canada, featuring keynote speakers, scientific sessions, workshops, poster presentations, and professional development opportunities.',
    color: theme.colors.primary[500],
    status: 'past'
  }
};

// KPI Metrics for Event Dashboard
const EVENT_METRICS = [
  { label: 'Total Attendees', value: '847', trend: '▲ 12%', positive: true, icon: Users },
  { label: 'Current Members', value: '612', trend: '▲ 8%', positive: true, icon: UserCheck },
  { label: 'Non-Members', value: '156', trend: '▲ 23%', positive: true, icon: UserPlus },
  { label: 'Lapsed Members', value: '52', trend: '▼ 15%', positive: false, icon: UserMinus },
  { label: 'First Time Attendee', value: '189', trend: '▲ 31%', positive: true, icon: TrendingUp },
];

// Chart data - Cumulative registrations and revenue by week
const REGISTRATION_CHART_DATA = [
  { week: 'Week 1', registrations: 45, revenue: 22500, cumRegistrations: 45, cumRevenue: 22500 },
  { week: 'Week 2', registrations: 78, revenue: 39000, cumRegistrations: 123, cumRevenue: 61500 },
  { week: 'Week 3', registrations: 112, revenue: 56000, cumRegistrations: 235, cumRevenue: 117500 },
  { week: 'Week 4', registrations: 156, revenue: 78000, cumRegistrations: 391, cumRevenue: 195500 },
  { week: 'Week 5', registrations: 189, revenue: 94500, cumRegistrations: 580, cumRevenue: 290000 },
  { week: 'Week 6', registrations: 134, revenue: 67000, cumRegistrations: 714, cumRevenue: 357000 },
  { week: 'Week 7', registrations: 98, revenue: 49000, cumRegistrations: 812, cumRevenue: 406000 },
  { week: 'Week 8', registrations: 35, revenue: 19000, cumRegistrations: 847, cumRevenue: 425000 },
];

// Registration funnel stages
const REGISTRATION_FUNNEL = [
  { label: 'Registration Page', value: '3,842', percentage: 100 },
  { label: 'Registration Type', value: '2,156', percentage: 56.1 },
  { label: 'Registration Options', value: '1,423', percentage: 37.0 },
  { label: 'Checkout', value: '978', percentage: 25.5 },
  { label: 'Confirmed', value: '847', percentage: 22.0 },
];

// Recent Registrations
const RECENT_REGISTRATIONS = [
  { id: 1, name: 'Sarah Chen', type: 'VIP', status: 'confirmed', time: '2 hours ago', company: 'Deloitte Canada' },
  { id: 2, name: 'Michael Torres', type: 'Full Conference', status: 'confirmed', time: '4 hours ago', company: 'KPMG' },
  { id: 3, name: 'Emily Watson', type: 'Early Bird', status: 'pending', time: 'Yesterday', company: 'PwC' },
  { id: 4, name: 'James Liu', type: 'Student', status: 'confirmed', time: 'Yesterday', company: 'University of Toronto' },
  { id: 5, name: 'Amanda Foster', type: 'Full Conference', status: 'confirmed', time: '2 days ago', company: 'EY Canada' },
];

// Quick Links for Event
const QUICK_LINKS = [
  { label: 'Manage Registrations', icon: 'users' },
  { label: 'View Schedule', icon: 'calendar' },
  { label: 'Export Attendee List', icon: 'download' },
  { label: 'Send Communication', icon: 'mail' },
];

// Alerts & Insights
const EVENT_ALERTS = [
  { type: 'success', message: 'Registration target of 800 attendees exceeded! Currently at 847.', time: '1 day ago' },
  { type: 'info', message: '189 first-time attendees registered. Consider a welcome orientation session.', time: '2 days ago' },
  { type: 'warning', message: '52 lapsed members registered. Great opportunity for re-engagement.', time: '3 days ago' },
];

// Color palettes for each card - using shades of the same color
const CARD_COLORS = {
  // Registration - Blue palette
  registration: {
    shade1: '#2563EB', // blue-600
    shade2: '#3B82F6', // blue-500
    shade3: '#60A5FA', // blue-400
    shade4: '#93C5FD', // blue-300
    shade5: '#BFDBFE'  // blue-200
  },
  // Dietary - Green palette
  dietary: {
    shade1: '#059669', // emerald-600
    shade2: '#10B981', // emerald-500
    shade3: '#34D399', // emerald-400
    shade4: '#6EE7B7', // emerald-300
    shade5: '#A7F3D0'  // emerald-200
  },
  // Speakers - Purple palette
  speakers: {
    shade1: '#7C3AED', // violet-600
    shade2: '#8B5CF6', // violet-500
    shade3: '#A78BFA', // violet-400
    shade4: '#C4B5FD', // violet-300
    shade5: '#DDD6FE'  // violet-200
  },
  // Sponsors - Amber palette
  sponsors: {
    shade1: '#D97706', // amber-600
    shade2: '#F59E0B', // amber-500
    shade3: '#FBBF24', // amber-400
    shade4: '#FCD34D', // amber-300
    shade5: '#FDE68A'  // amber-200
  },
  // Sessions - Teal palette
  sessions: {
    shade1: '#0D9488', // teal-600
    shade2: '#14B8A6', // teal-500
    shade3: '#2DD4BF', // teal-400
    shade4: '#5EEAD4', // teal-300
    shade5: '#99F6E4'  // teal-200
  },
  // Venue Rooms - Slate palette
  venueRooms: {
    shade1: '#475569', // slate-600
    shade2: '#64748B', // slate-500
    shade3: '#94A3B8', // slate-400
    shade4: '#CBD5E1', // slate-300
    shade5: '#E2E8F0'  // slate-200
  }
};

// Collections data for People tab
const PEOPLE_COLLECTIONS = [
  {
    id: 'registration',
    title: 'Registration Types',
    type: 'Profile',
    count: '847 registrations',
    icon: <FileText size={16} strokeWidth={1.5} />,
    primaryColor: CARD_COLORS.registration.shade1,
    defaultFacet: 'list',
    summary: {
      stats: [
        { value: '$425K', label: 'Total Revenue' },
        { value: '78%', label: 'Capacity' }
      ],
      segments: [
        { pct: 45, color: CARD_COLORS.registration.shade1, label: 'Full $599' },
        { pct: 30, color: CARD_COLORS.registration.shade2, label: 'Early $449' },
        { pct: 15, color: CARD_COLORS.registration.shade3, label: 'Student $199' },
        { pct: 10, color: CARD_COLORS.registration.shade4, label: 'VIP $999' }
      ]
    },
    list: [
      { name: 'Full Conference', count: 381, pct: 45, color: CARD_COLORS.registration.shade1 },
      { name: 'Early Bird', count: 254, pct: 30, color: CARD_COLORS.registration.shade2 },
      { name: 'Student', count: 127, pct: 15, color: CARD_COLORS.registration.shade3 },
      { name: 'VIP', count: 85, pct: 10, color: CARD_COLORS.registration.shade4 }
    ],
    timeline: [
      { label: 'Week 1', dateRange: 'Apr 7-13', count: 45 },
      { label: 'Week 2', dateRange: 'Apr 14-20', count: 78 },
      { label: 'Week 3', dateRange: 'Apr 21-27', count: 112 },
      { label: 'Week 4', dateRange: 'Apr 28-May 4', count: 156 },
      { label: 'Week 5', dateRange: 'May 5-11', count: 189 },
      { label: 'Week 6', dateRange: 'May 12-18', count: 134 },
      { label: 'Week 7', dateRange: 'May 19-25', count: 98 },
      { label: 'Week 8', dateRange: 'May 26-Jun 1', count: 35 }
    ]
  },
  {
    id: 'dietary',
    title: 'Dietary Restrictions',
    type: 'Profile',
    count: '312 attendees',
    icon: <Leaf size={16} strokeWidth={1.5} />,
    primaryColor: CARD_COLORS.dietary.shade1,
    defaultFacet: 'list',
    summary: {
      stats: [
        { value: '37%', label: 'Have Restrictions' },
        { value: '8', label: 'Categories' }
      ],
      segments: [
        { pct: 35, color: CARD_COLORS.dietary.shade1, label: 'Vegetarian' },
        { pct: 25, color: CARD_COLORS.dietary.shade2, label: 'Vegan' },
        { pct: 20, color: CARD_COLORS.dietary.shade3, label: 'Gluten-Free' },
        { pct: 20, color: CARD_COLORS.dietary.shade4, label: 'Allergies' }
      ]
    },
    list: [
      { name: 'Vegetarian', count: 109, pct: 35, color: CARD_COLORS.dietary.shade1 },
      { name: 'Vegan', count: 78, pct: 25, color: CARD_COLORS.dietary.shade2 },
      { name: 'Gluten-Free', count: 62, pct: 20, color: CARD_COLORS.dietary.shade3 },
      { name: 'Nut Allergy', count: 38, pct: 12, color: CARD_COLORS.dietary.shade4 },
      { name: 'Kosher / Halal', count: 25, pct: 8, color: CARD_COLORS.dietary.shade5 }
    ],
    timeline: [
      { label: 'Week 1', dateRange: 'Apr 7-13', count: 18 },
      { label: 'Week 2', dateRange: 'Apr 14-20', count: 32 },
      { label: 'Week 3', dateRange: 'Apr 21-27', count: 45 },
      { label: 'Week 4', dateRange: 'Apr 28-May 4', count: 58 },
      { label: 'Week 5', dateRange: 'May 5-11', count: 72 },
      { label: 'Week 6', dateRange: 'May 12-18', count: 52 },
      { label: 'Week 7', dateRange: 'May 19-25', count: 28 },
      { label: 'Week 8', dateRange: 'May 26-Jun 1', count: 7 }
    ]
  },
  {
    id: 'speakers',
    title: 'Speakers',
    type: 'Profile',
    count: '28 speakers',
    icon: <Users size={16} strokeWidth={1.5} />,
    primaryColor: CARD_COLORS.speakers.shade1,
    defaultFacet: 'list',
    summary: {
      stats: [
        { value: '28', label: 'Total Speakers' },
        { value: '92%', label: 'Confirmed' }
      ],
      segments: [
        { pct: 92, color: CARD_COLORS.speakers.shade1, label: 'Confirmed' },
        { pct: 8, color: CARD_COLORS.speakers.shade4, label: 'Pending' }
      ]
    },
    list: [
      { name: 'Keynote', count: 4, pct: 14, color: CARD_COLORS.speakers.shade1 },
      { name: 'Breakout', count: 16, pct: 57, color: CARD_COLORS.speakers.shade2 },
      { name: 'Workshop', count: 6, pct: 21, color: CARD_COLORS.speakers.shade3 },
      { name: 'Panelist', count: 2, pct: 7, color: CARD_COLORS.speakers.shade4 }
    ],
    timeline: [
      { label: 'Week 1', dateRange: 'Apr 7-13', count: 2 },
      { label: 'Week 2', dateRange: 'Apr 14-20', count: 5 },
      { label: 'Week 3', dateRange: 'Apr 21-27', count: 8 },
      { label: 'Week 4', dateRange: 'Apr 28-May 4', count: 6 },
      { label: 'Week 5', dateRange: 'May 5-11', count: 4 },
      { label: 'Week 6', dateRange: 'May 12-18', count: 3 }
    ]
  },
  {
    id: 'sponsors',
    title: 'Sponsors',
    type: 'Profile',
    count: '12 sponsors',
    icon: <Building2 size={16} strokeWidth={1.5} />,
    primaryColor: CARD_COLORS.sponsors.shade1,
    defaultFacet: 'list',
    summary: {
      stats: [
        { value: '$180K', label: 'Total Sponsorship' },
        { value: '12', label: 'Partners' }
      ],
      segments: [
        { pct: 50, color: CARD_COLORS.sponsors.shade1, label: 'Platinum' },
        { pct: 33, color: CARD_COLORS.sponsors.shade2, label: 'Gold' },
        { pct: 17, color: CARD_COLORS.sponsors.shade3, label: 'Silver' }
      ]
    },
    list: [
      { name: 'Platinum', count: 2, pct: 50, color: CARD_COLORS.sponsors.shade1 },
      { name: 'Gold', count: 4, pct: 33, color: CARD_COLORS.sponsors.shade2 },
      { name: 'Silver', count: 6, pct: 17, color: CARD_COLORS.sponsors.shade3 }
    ],
    timeline: [
      { label: 'Week 1', dateRange: 'Apr 7-13', count: 1 },
      { label: 'Week 2', dateRange: 'Apr 14-20', count: 2 },
      { label: 'Week 3', dateRange: 'Apr 21-27', count: 3 },
      { label: 'Week 4', dateRange: 'Apr 28-May 4', count: 4 },
      { label: 'Week 5', dateRange: 'May 5-11', count: 2 }
    ]
  },
  {
    id: 'sessions',
    title: 'Sessions',
    type: 'Profile',
    count: '42 sessions',
    icon: <Presentation size={16} strokeWidth={1.5} />,
    primaryColor: CARD_COLORS.sessions.shade1,
    defaultFacet: 'list',
    summary: {
      stats: [
        { value: '42', label: 'Total Sessions' },
        { value: '3', label: 'Days' }
      ],
      segments: [
        { pct: 40, color: CARD_COLORS.sessions.shade1, label: 'Breakout' },
        { pct: 25, color: CARD_COLORS.sessions.shade2, label: 'Workshop' },
        { pct: 20, color: CARD_COLORS.sessions.shade3, label: 'Keynote' },
        { pct: 15, color: CARD_COLORS.sessions.shade4, label: 'Panel' }
      ]
    },
    list: [
      { name: 'Breakout', count: 17, pct: 40, color: CARD_COLORS.sessions.shade1 },
      { name: 'Workshop', count: 10, pct: 25, color: CARD_COLORS.sessions.shade2 },
      { name: 'Keynote', count: 8, pct: 20, color: CARD_COLORS.sessions.shade3 },
      { name: 'Panel', count: 4, pct: 10, color: CARD_COLORS.sessions.shade4 },
      { name: 'Networking', count: 3, pct: 5, color: CARD_COLORS.sessions.shade5 }
    ],
    timeline: [
      { label: 'Day 1', dateRange: 'Jun 12', count: 14 },
      { label: 'Day 2', dateRange: 'Jun 13', count: 16 },
      { label: 'Day 3', dateRange: 'Jun 14', count: 12 }
    ]
  },
  {
    id: 'venue-rooms',
    title: 'Venue Rooms',
    type: 'Profile',
    count: '18 rooms',
    icon: <MapPinned size={16} strokeWidth={1.5} />,
    primaryColor: CARD_COLORS.venueRooms.shade1,
    defaultFacet: 'list',
    summary: {
      stats: [
        { value: '18', label: 'Total Rooms' },
        { value: '85%', label: 'Utilized' }
      ],
      segments: [
        { pct: 45, color: CARD_COLORS.venueRooms.shade1, label: 'Meeting' },
        { pct: 30, color: CARD_COLORS.venueRooms.shade2, label: 'Ballroom' },
        { pct: 25, color: CARD_COLORS.venueRooms.shade3, label: 'Exhibit' }
      ]
    },
    list: [
      { name: 'Meeting Room', count: 8, pct: 45, color: CARD_COLORS.venueRooms.shade1 },
      { name: 'Ballroom', count: 3, pct: 17, color: CARD_COLORS.venueRooms.shade2 },
      { name: 'Exhibit Hall', count: 2, pct: 11, color: CARD_COLORS.venueRooms.shade3 },
      { name: 'Breakout Room', count: 4, pct: 22, color: CARD_COLORS.venueRooms.shade4 },
      { name: 'Lounge', count: 1, pct: 5, color: CARD_COLORS.venueRooms.shade5 }
    ],
    timeline: [
      { label: 'Day 1', dateRange: 'Jun 12', count: 16 },
      { label: 'Day 2', dateRange: 'Jun 13', count: 18 },
      { label: 'Day 3', dateRange: 'Jun 14', count: 14 }
    ]
  }
];

// More menu items - organized by category with section headers
const MORE_MENU_SECTIONS = [
  {
    id: 'people',
    label: 'People',
    items: [
      { id: 'participants', label: 'Participants', icon: Users },
      { id: 'attendees', label: 'Attendees', icon: UserCheck },
      { id: 'companions', label: 'Companions', icon: UsersRound },
      { id: 'speakers', label: 'Speakers', icon: Mic2 },
      { id: 'sponsors', label: 'Sponsors', icon: Award },
      { id: 'volunteers', label: 'Volunteers', icon: HeartHandshake }
    ]
  },
  {
    id: 'program-content',
    label: 'Program & Content',
    items: [
      { id: 'abstracts', label: 'Abstracts', icon: ScrollText },
      { id: 'schedule', label: 'Schedule', icon: CalendarDays },
      { id: 'social-activities', label: 'Social Activities', icon: PartyPopper },
      { id: 'pre-conference', label: 'Pre-Conference', icon: CalendarMinus },
      { id: 'post-conference', label: 'Post-Conference', icon: CalendarPlus }
    ]
  },
  {
    id: 'logistics',
    label: 'Logistics',
    items: [
      { id: 'venue-rooms', label: 'Venue & Rooms', icon: DoorOpen },
      { id: 'accommodations', label: 'Accommodations', icon: Bed },
      { id: 'flights', label: 'Flights', icon: Plane },
      { id: 'car-rentals', label: 'Car Rentals', icon: Car },
      { id: 'equipment', label: 'Equipment', icon: Wrench },
      { id: 'catering-meals', label: 'Catering/Meals', icon: Utensils }
    ]
  },
  {
    id: 'commerce',
    label: 'Commerce',
    items: [
      { id: 'fees', label: 'Fees', icon: Receipt },
      { id: 'orders', label: 'Orders', icon: ShoppingCart },
      { id: 'tickets', label: 'Tickets', icon: Ticket },
      { id: 'payments', label: 'Payments', icon: CreditCard },
      { id: 'refunds', label: 'Refunds', icon: Undo2 }
    ]
  },
  {
    id: 'communications',
    label: 'Communications',
    items: [
      { id: 'certificates', label: 'Certificates', icon: Award },
      { id: 'emails', label: 'Emails', icon: Mail },
      { id: 'evaluations', label: 'Evaluations', icon: ClipboardCheck },
      { id: 'journeys', label: 'Journeys', icon: Route },
      { id: 'media-assets', label: 'Media Assets', icon: Image },
      { id: 'surveys', label: 'Surveys', icon: ClipboardList }
    ]
  },
  {
    id: 'digital-presence',
    label: 'Digital Presence',
    items: [
      { id: 'landing-page', label: 'Landing Page', icon: LayoutTemplate },
      { id: 'website', label: 'Web Site', icon: Globe }
    ]
  }
];

// Flat list for lookups
const MORE_MENU_ITEMS = MORE_MENU_SECTIONS.flatMap(section => section.items);

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'activities', label: 'Activities' },
  { id: 'more', label: 'More' }
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Abstract status configurations
const ABSTRACT_STATUSES = {
  submitted: { label: 'Submitted', color: theme.colors.primary[500], bg: theme.colors.primary[50] },
  'under-review': { label: 'Under Review', color: '#F59E0B', bg: '#FEF3C7' },
  'revision-required': { label: 'Revision Required', color: '#EF4444', bg: '#FEE2E2' },
  accepted: { label: 'Accepted', color: '#10B981', bg: '#D1FAE5' },
  rejected: { label: 'Rejected', color: '#6B7280', bg: '#F3F4F6' },
  scheduled: { label: 'Scheduled', color: '#8B5CF6', bg: '#EDE9FE' },
  withdrawn: { label: 'Withdrawn', color: '#9CA3AF', bg: '#F9FAFB' }
};

// Abstract tracks/topics - CPA Psychology Sections
const ABSTRACT_TRACKS = [
  { id: 'clinical', label: 'Clinical Psychology', color: '#2563EB' },
  { id: 'counselling', label: 'Counselling Psychology', color: '#7C3AED' },
  { id: 'health', label: 'Health Psychology', color: '#0891B2' },
  { id: 'developmental', label: 'Developmental Psychology', color: '#059669' },
  { id: 'indigenous', label: 'Indigenous Peoples\' Psychology', color: '#DC2626' },
  { id: 'social', label: 'Social & Personality', color: '#16A34A' }
];

// CPA Presentation Types
const PRESENTATION_TYPES = {
  // Workshops
  'workshop': { label: 'Workshop', shortLabel: 'Workshop', duration: '85 min', category: 'Workshop', color: '#7C3AED', icon: 'workshop' },
  'workshop-precon-3h': { label: 'Pre-Conference Workshop (3h)', shortLabel: '3h Workshop', duration: '3 hours', category: 'Workshop', color: '#7C3AED', icon: 'workshop' },
  'workshop-precon-6h': { label: 'Pre-Conference Workshop (6h)', shortLabel: '6h Workshop', duration: '6 hours', category: 'Workshop', color: '#7C3AED', icon: 'workshop' },
  // Spoken Individual
  'snapshot': { label: 'Snapshot', shortLabel: 'Snapshot', duration: '5 min', category: 'Spoken Individual', color: '#0891B2', icon: 'talk' },
  '12-min-talk': { label: '12-Minute Talk', shortLabel: '12-Min Talk', duration: '12 min', category: 'Spoken Individual', color: '#0891B2', icon: 'talk' },
  'review-session': { label: 'Review Session', shortLabel: 'Review', duration: '25 min', category: 'Spoken Individual', color: '#0891B2', icon: 'talk' },
  'conversation': { label: 'Round Table Conversation', shortLabel: 'Conversation', duration: '25 min', category: 'Spoken Individual', color: '#0891B2', icon: 'talk' },
  // Spoken Group
  'panel': { label: 'Panel Discussion', shortLabel: 'Panel', duration: '55 min', category: 'Spoken Group', color: '#059669', icon: 'group' },
  'symposium': { label: 'Symposium', shortLabel: 'Symposium', duration: '55 min', category: 'Spoken Group', color: '#059669', icon: 'group' },
  // Posters
  'poster': { label: 'Traditional Poster', shortLabel: 'Poster', duration: '55 min', category: 'Poster', color: '#F59E0B', icon: 'poster' },
  'virtual-poster': { label: 'Virtual Poster', shortLabel: 'Virtual Poster', duration: '5 min', category: 'Poster', color: '#F59E0B', icon: 'poster' }
};

// Evaluation criteria for abstract review
const EVALUATION_CRITERIA = [
  { id: 'action-impact', label: 'Action/Impact', description: 'Practical implications and potential impact of the research' },
  { id: 'background', label: 'Background', description: 'Quality of literature review and theoretical foundation' },
  { id: 'conclusions', label: 'Conclusions & Interpretations', description: 'Validity and appropriateness of conclusions drawn from results' },
  { id: 'methods', label: 'Methods', description: 'Rigor and appropriateness of research methodology' },
  { id: 'clarity', label: 'Overall Clarity', description: 'Clear and well-organized presentation of ideas' },
  { id: 'significance', label: 'Psychological Significance', description: 'Contribution to psychological science and practice' },
  { id: 'results', label: 'Results', description: 'Quality and presentation of findings' }
];

// Rejection reasons
const REJECTION_REASONS = [
  { id: 'flawed-approach', label: 'The research approach and/or analyses were flawed' },
  { id: 'not-novel', label: 'The results are not novel' },
  { id: 'incomplete', label: 'The submission is incomplete or missing key information' },
  { id: 'out-of-scope', label: 'The topic is outside the scope of the conference' },
  { id: 'ethical-concerns', label: 'There are ethical concerns with the research' }
];

// Sample reviewers - Psychology experts
const REVIEWERS = [
  { id: 'r1', name: 'Dr. Patricia Furer', avatar: 'PF', specialty: 'Clinical Psychology' },
  { id: 'r2', name: 'Prof. David Dozois', avatar: 'DD', specialty: 'Clinical Psychology' },
  { id: 'r3', name: 'Dr. Colleen Cannon', avatar: 'CC', specialty: 'Counselling Psychology' },
  { id: 'r4', name: 'Prof. Kim Bhardwaj', avatar: 'KB', specialty: 'Health Psychology' },
  { id: 'r5', name: 'Dr. Susan Bhardwaj', avatar: 'SB', specialty: 'Indigenous Peoples\' Psychology' }
];

// Comprehensive abstract data - Psychology research
const ABSTRACTS_DATA = [
  {
    id: 'ABS-001',
    title: 'Efficacy of Virtual Reality Exposure Therapy for Treatment-Resistant PTSD in Canadian Veterans',
    authors: [
      { name: 'Dr. Jennifer Bhardwaj', affiliation: 'University of Toronto', isPresenting: true, registered: true },
      { name: 'Dr. Michael Chen', affiliation: 'Veterans Affairs Canada', isPresenting: false, registered: true }
    ],
    track: 'clinical',
    status: 'accepted',
    submittedDate: '2025-02-15',
    abstract: 'This randomized controlled trial examined the effectiveness of virtual reality exposure therapy (VRET) for Canadian veterans with treatment-resistant PTSD. Participants (N=124) were assigned to either VRET or traditional prolonged exposure therapy. Results showed significant reductions in PTSD symptom severity in both conditions, with VRET demonstrating faster symptom improvement and higher treatment completion rates.',
    keywords: ['PTSD', 'Virtual Reality', 'Exposure Therapy', 'Veterans', 'Trauma'],
    reviewers: [REVIEWERS[0], REVIEWERS[1]],
    reviews: [
      { reviewer: REVIEWERS[0], score: 4.7, recommendation: 'accept', comments: 'Rigorous methodology and clinically significant findings. Important contribution to trauma treatment literature.' },
      { reviewer: REVIEWERS[1], score: 4.5, recommendation: 'accept', comments: 'Well-designed RCT with meaningful implications for veteran mental health services.' }
    ],
    averageScore: 4.6,
    session: { id: 'S-101', name: 'Clinical Innovations in Trauma Treatment', time: 'June 12, 9:00 AM', room: 'Atlantic Hall A' },
    presentationType: '12-min-talk',
    attachments: [{ name: 'Full Paper.pdf', size: '2.4 MB' }, { name: 'Presentation.pptx', size: '5.1 MB' }]
  },
  {
    id: 'ABS-002',
    title: 'Correlates of PTSD Symptom Severity in Homeless-Shelter Support Staff',
    authors: [
      { name: 'Dr. Sarah Mitchell', affiliation: 'McGill University', isPresenting: true, registered: true }
    ],
    track: 'counselling',
    status: 'accepted',
    submittedDate: '2025-02-18',
    abstract: 'This study examined secondary traumatic stress and PTSD symptoms among shelter workers serving homeless populations in three Canadian cities. Survey data from 286 frontline staff revealed significant correlations between exposure to client trauma, organizational support, and symptom severity. Findings highlight the need for trauma-informed workplace policies and regular clinical supervision.',
    keywords: ['Secondary Trauma', 'Homelessness', 'Occupational Stress', 'Burnout', 'Shelter Workers'],
    reviewers: [REVIEWERS[2], REVIEWERS[3]],
    reviews: [
      { reviewer: REVIEWERS[2], score: 4.8, recommendation: 'accept', comments: 'Addresses a critical gap in occupational mental health research. Timely and relevant.' },
      { reviewer: REVIEWERS[3], score: 4.4, recommendation: 'accept', comments: 'Strong mixed-methods approach with clear practice implications.' }
    ],
    averageScore: 4.6,
    session: { id: 'S-102', name: 'Counselling Psychology Symposium', time: 'June 12, 2:00 PM', room: 'Atlantic Hall B' },
    presentationType: 'poster',
    attachments: [{ name: 'Presentation.pdf', size: '3.2 MB' }]
  },
  {
    id: 'ABS-003',
    title: 'Exploring Priorities for Nature Connection Interventions in Curve Lake First Nation',
    authors: [
      { name: 'Dr. Amanda Meawasige', affiliation: 'Trent University', isPresenting: true, registered: false },
      { name: 'Elder Mary Taylor', affiliation: 'Curve Lake First Nation', isPresenting: false, registered: false },
      { name: 'Dr. Elena Nightingale', affiliation: 'University of British Columbia', isPresenting: false, registered: true }
    ],
    track: 'indigenous',
    status: 'under-review',
    submittedDate: '2025-03-01',
    abstract: 'Using Indigenous research methodologies including talking circles and land-based learning, this community-based participatory research explored how Curve Lake First Nation community members define and prioritize nature connection for mental wellness. Findings emphasize the integration of traditional ecological knowledge with contemporary psychology practice and the importance of land-based healing approaches.',
    keywords: ['Indigenous Mental Health', 'Nature Connection', 'Land-Based Healing', 'Community Psychology', 'Reconciliation'],
    reviewers: [REVIEWERS[4], REVIEWERS[2]],
    reviews: [
      { reviewer: REVIEWERS[4], score: 4.3, recommendation: 'minor-revision', comments: 'Exemplary community-engaged research. Minor revisions needed to strengthen methodology section.' }
    ],
    averageScore: 4.3,
    session: null,
    presentationType: 'conversation',
    attachments: [{ name: 'Draft Paper.docx', size: '1.8 MB' }]
  },
  {
    id: 'ABS-004',
    title: 'Digital Cognitive Behavioral Therapy for Adolescent Depression: A Canadian Multi-Site Trial',
    authors: [
      { name: 'Dr. Robert Bhardwaj', affiliation: 'University of Calgary', isPresenting: true, registered: false }
    ],
    track: 'clinical',
    status: 'revision-required',
    submittedDate: '2025-02-20',
    abstract: 'This multi-site randomized trial evaluated the efficacy of a Canadian-developed digital CBT program for adolescents with moderate depression. While preliminary results show promise, reviewers have requested additional analysis of moderator variables and longer-term follow-up data before final acceptance.',
    keywords: ['Digital Therapeutics', 'Adolescent Depression', 'CBT', 'E-Mental Health', 'Youth'],
    reviewers: [REVIEWERS[0], REVIEWERS[1]],
    reviews: [
      { reviewer: REVIEWERS[0], score: 3.4, recommendation: 'major-revision', comments: 'Promising intervention but methodology section needs strengthening. More detail on randomization procedures required.' },
      { reviewer: REVIEWERS[1], score: 3.2, recommendation: 'major-revision', comments: 'Include 6-month follow-up data and address attrition rates more thoroughly.' }
    ],
    averageScore: 3.3,
    session: null,
    presentationType: 'symposium',
    attachments: [{ name: 'Paper Draft v2.pdf', size: '2.1 MB' }]
  },
  {
    id: 'ABS-005',
    title: 'Integrating Mindfulness-Based Interventions in Primary Care: A Collaborative Care Model',
    authors: [
      { name: 'Dr. Michelle Wong', affiliation: 'University of Ottawa', isPresenting: true, registered: true },
      { name: 'Dr. Andrew Bhardwaj', affiliation: 'The Ottawa Hospital', isPresenting: true, registered: true }
    ],
    track: 'health',
    status: 'accepted',
    submittedDate: '2025-02-22',
    abstract: 'This workshop presents a collaborative care model for integrating mindfulness-based interventions into primary care settings. Drawing on three years of implementation experience, we discuss practical strategies for psychologist-physician collaboration, patient screening protocols, and outcome measurement. Participants will learn adaptable frameworks for their own practice settings.',
    keywords: ['Mindfulness', 'Primary Care', 'Integrated Care', 'Health Psychology', 'Collaborative Practice'],
    reviewers: [REVIEWERS[3]],
    reviews: [
      { reviewer: REVIEWERS[3], score: 4.5, recommendation: 'accept', comments: 'Excellent practical workshop with strong evidence base. Highly relevant for health psychologists.' }
    ],
    averageScore: 4.5,
    session: { id: 'S-201', name: 'Health Psychology Workshop Series', time: 'June 13, 10:30 AM', room: 'Signal Hill Room' },
    presentationType: 'workshop',
    attachments: [{ name: 'Workshop Materials.zip', size: '8.5 MB' }]
  },
  {
    id: 'ABS-006',
    title: 'Methods of Weaving Reconciliation Promotion in Psychology Curriculum',
    authors: [
      { name: 'Prof. Daniel Neegan', affiliation: 'University of Alberta', isPresenting: true, registered: false }
    ],
    track: 'indigenous',
    status: 'submitted',
    submittedDate: '2025-03-10',
    abstract: 'This presentation examines approaches to integrating reconciliation-focused content throughout psychology training programs. Drawing on consultations with Indigenous Elders, community members, and psychology educators, we propose a framework for curriculum transformation that moves beyond single-course add-ons toward systemic integration of Indigenous perspectives and healing practices.',
    keywords: ['Reconciliation', 'Psychology Education', 'Curriculum Development', 'Indigenous Knowledge', 'Decolonization'],
    reviewers: [],
    reviews: [],
    averageScore: null,
    session: null,
    presentationType: 'review-session',
    attachments: [{ name: 'Abstract.pdf', size: '0.5 MB' }]
  },
  {
    id: 'ABS-007',
    title: 'Attachment Patterns and Relationship Satisfaction Across the Lifespan: A Longitudinal Study',
    authors: [
      { name: 'Dr. Lisa Bhardwaj', affiliation: 'University of Waterloo', isPresenting: true, registered: true },
      { name: 'Dr. Christopher Adams', affiliation: 'Western University', isPresenting: false, registered: true }
    ],
    track: 'developmental',
    status: 'accepted',
    submittedDate: '2025-02-25',
    abstract: 'This 20-year longitudinal study tracked attachment patterns and relationship outcomes in 342 Canadian adults from early adulthood through midlife. Results reveal significant stability in attachment patterns while also identifying key life transitions associated with attachment change. Implications for couples therapy and developmental theory are discussed.',
    keywords: ['Attachment Theory', 'Relationship Satisfaction', 'Longitudinal Research', 'Adult Development', 'Couples'],
    reviewers: [REVIEWERS[1], REVIEWERS[2]],
    reviews: [
      { reviewer: REVIEWERS[1], score: 4.6, recommendation: 'accept', comments: 'Impressive longitudinal dataset with sophisticated analysis. Major contribution to attachment literature.' },
      { reviewer: REVIEWERS[2], score: 4.4, recommendation: 'accept', comments: 'Excellent integration of developmental and clinical perspectives.' }
    ],
    averageScore: 4.5,
    session: { id: 'S-103', name: 'Developmental Psychology Symposium', time: 'June 13, 2:00 PM', room: 'Atlantic Hall A' },
    presentationType: 'symposium',
    attachments: [{ name: 'Full Paper.pdf', size: '3.8 MB' }, { name: 'Supplementary Data.pdf', size: '1.2 MB' }]
  },
  {
    id: 'ABS-008',
    title: 'Experiences of Women and Gender Diverse Individuals At-Risk for Homelessness',
    authors: [
      { name: 'Dr. Stephanie Moreau', affiliation: 'Simon Fraser University', isPresenting: true, registered: false }
    ],
    track: 'counselling',
    status: 'scheduled',
    submittedDate: '2025-02-12',
    abstract: 'Using interpretive phenomenological analysis, this qualitative study explored the lived experiences of 28 women and gender diverse individuals navigating housing instability in Vancouver. Themes of systemic barriers, trauma histories, and resilience emerged. Findings inform trauma-informed approaches to housing support services and highlight the need for gender-responsive interventions.',
    keywords: ['Homelessness', 'Gender', 'Qualitative Research', 'Trauma-Informed Care', 'Housing Instability'],
    reviewers: [REVIEWERS[2], REVIEWERS[4]],
    reviews: [
      { reviewer: REVIEWERS[2], score: 4.7, recommendation: 'accept', comments: 'Powerful qualitative work with clear policy implications. Excellent use of IPA methodology.' },
      { reviewer: REVIEWERS[4], score: 4.5, recommendation: 'accept', comments: 'Important contribution to understanding intersectionality in housing insecurity.' }
    ],
    averageScore: 4.6,
    session: { id: 'S-301', name: 'Social Justice in Psychology', time: 'June 14, 9:00 AM', room: 'Cabot Tower Room' },
    presentationType: '12-min-talk',
    attachments: [{ name: 'Presentation.pptx', size: '4.2 MB' }, { name: 'Interview Guide.pdf', size: '0.8 MB' }]
  },
  {
    id: 'ABS-009',
    title: 'Social Media Use and Body Image in Canadian Adolescents: A Mixed-Methods Investigation',
    authors: [
      { name: 'Dr. Mark Williams', affiliation: 'York University', isPresenting: true, registered: false },
      { name: 'Jennifer Lee', affiliation: 'University of Guelph', isPresenting: false, registered: false }
    ],
    track: 'social',
    status: 'under-review',
    submittedDate: '2025-03-05',
    abstract: 'This mixed-methods study examined relationships between social media use patterns and body image concerns among Canadian adolescents (N=1,247). Quantitative findings revealed significant associations between appearance-focused platform use and body dissatisfaction. Qualitative interviews (n=42) provided nuanced understanding of how adolescents navigate online appearance culture.',
    keywords: ['Social Media', 'Body Image', 'Adolescence', 'Mixed Methods', 'Digital Health'],
    reviewers: [REVIEWERS[1]],
    reviews: [],
    averageScore: null,
    session: null,
    presentationType: 'poster',
    attachments: [{ name: 'Draft Presentation.pptx', size: '3.5 MB' }]
  },
  {
    id: 'ABS-010',
    title: 'Culturally Adapted Cognitive Processing Therapy for Refugee Trauma Survivors',
    authors: [
      { name: 'Dr. Fatima Hassan', affiliation: 'University of Manitoba', isPresenting: true, registered: true },
      { name: 'Dr. Maria Santos', affiliation: 'Mount Sinai Hospital', isPresenting: true, registered: false }
    ],
    track: 'clinical',
    status: 'accepted',
    submittedDate: '2025-02-14',
    abstract: 'This presentation describes the cultural adaptation process and preliminary efficacy data for a modified Cognitive Processing Therapy protocol developed for Arabic-speaking refugee trauma survivors. Adaptations addressed cultural expressions of distress, religious coping, and collective trauma experiences. Pilot data (N=48) showed significant symptom reduction and high treatment acceptability.',
    keywords: ['Refugee Mental Health', 'Cultural Adaptation', 'Trauma Treatment', 'CPT', 'Multicultural Psychology'],
    reviewers: [REVIEWERS[0], REVIEWERS[2]],
    reviews: [
      { reviewer: REVIEWERS[0], score: 4.9, recommendation: 'accept', comments: 'Critical work addressing a major gap in culturally responsive trauma care. Exemplary adaptation process.' },
      { reviewer: REVIEWERS[2], score: 4.7, recommendation: 'accept', comments: 'Impressive community engagement and rigorous methodology.' }
    ],
    averageScore: 4.8,
    session: { id: 'S-104', name: 'Clinical Psychology Plenary', time: 'June 12, 11:00 AM', room: 'Grand Ballroom' },
    presentationType: 'panel',
    attachments: [{ name: 'Treatment Manual Excerpt.pdf', size: '1.5 MB' }]
  },
  {
    id: 'ABS-011',
    title: 'Pandemic-Era Telepsychology: Lessons Learned and Future Directions',
    authors: [
      { name: 'Dr. Catherine O\'Brien', affiliation: 'Dalhousie University', isPresenting: true, registered: false }
    ],
    track: 'counselling',
    status: 'rejected',
    submittedDate: '2025-02-28',
    abstract: 'This presentation reviews the rapid adoption of telepsychology during the COVID-19 pandemic and evaluates client and provider experiences with virtual care delivery. Recommendations for hybrid practice models are provided.',
    keywords: ['Telepsychology', 'Virtual Care', 'Pandemic', 'Service Delivery', 'Technology'],
    reviewers: [REVIEWERS[2]],
    reviews: [
      { reviewer: REVIEWERS[2], score: 2.5, recommendation: 'reject', comments: 'While the topic was highly relevant in 2021-2022, the field has moved significantly forward. Recommend resubmission with updated literature review and focus on current hybrid practice innovations.' }
    ],
    averageScore: 2.5,
    session: null,
    presentationType: 'snapshot',
    attachments: [{ name: 'Submission.pdf', size: '1.8 MB' }]
  },
  {
    id: 'ABS-012',
    title: 'Neuropsychological Profiles in Long COVID: Implications for Rehabilitation',
    authors: [
      { name: 'Dr. Kevin Zhang', affiliation: 'Baycrest Health Sciences', isPresenting: true, registered: true },
      { name: 'Dr. Emily Watson', affiliation: 'University of Toronto', isPresenting: false, registered: true }
    ],
    track: 'health',
    status: 'scheduled',
    submittedDate: '2025-02-10',
    abstract: 'This study characterized neuropsychological profiles in 156 patients with post-acute sequelae of SARS-CoV-2 (Long COVID). Comprehensive assessment revealed distinct patterns of cognitive impairment, with executive function and processing speed most commonly affected. Findings inform targeted cognitive rehabilitation protocols and return-to-work accommodations.',
    keywords: ['Long COVID', 'Neuropsychology', 'Cognitive Rehabilitation', 'Health Psychology', 'Assessment'],
    reviewers: [REVIEWERS[3], REVIEWERS[0]],
    reviews: [
      { reviewer: REVIEWERS[3], score: 4.6, recommendation: 'accept', comments: 'Timely and clinically important research with clear rehabilitation implications.' },
      { reviewer: REVIEWERS[0], score: 4.8, recommendation: 'accept', comments: 'Rigorous neuropsychological assessment methodology. Important contribution to emerging Long COVID literature.' }
    ],
    averageScore: 4.7,
    session: { id: 'S-105', name: 'Health Psychology & Neuropsychology', time: 'June 13, 9:00 AM', room: 'Atlantic Hall A' },
    presentationType: '12-min-talk',
    attachments: [{ name: 'Full Paper.pdf', size: '2.9 MB' }, { name: 'Assessment Protocol.pdf', size: '0.8 MB' }]
  },
  {
    id: 'ABS-013',
    title: 'The Role of Self-Compassion in Burnout Prevention Among Healthcare Workers',
    authors: [
      { name: 'Dr. Rachel Thompson', affiliation: 'University of Victoria', isPresenting: true, registered: false }
    ],
    track: 'health',
    status: 'submitted',
    submittedDate: '2025-03-12',
    abstract: 'This study investigates the protective role of self-compassion against burnout in Canadian healthcare workers. Using a longitudinal design, we tracked 450 nurses and physicians over 18 months, measuring self-compassion levels, burnout symptoms, and workplace stressors. Preliminary analyses suggest that self-compassion training may serve as a cost-effective intervention for healthcare systems.',
    keywords: ['Self-Compassion', 'Burnout', 'Healthcare Workers', 'Occupational Health', 'Prevention'],
    reviewers: [],
    reviews: [],
    averageScore: null,
    session: null,
    presentationType: '12-min-talk',
    attachments: [{ name: 'Abstract.pdf', size: '0.4 MB' }]
  },
  {
    id: 'ABS-014',
    title: 'Parental Smartphone Use and Child Attention Development: A Prospective Cohort Study',
    authors: [
      { name: 'Dr. Nathan Park', affiliation: 'McMaster University', isPresenting: true, registered: false },
      { name: 'Dr. Linda Chen', affiliation: 'SickKids Hospital', isPresenting: false, registered: false }
    ],
    track: 'developmental',
    status: 'submitted',
    submittedDate: '2025-03-14',
    abstract: 'This prospective study examines associations between parental smartphone use during caregiver-child interactions and subsequent attention development in toddlers. We followed 320 parent-child dyads from 12 to 36 months, using behavioral observations and standardized attention assessments. Results have implications for digital wellness guidelines for families.',
    keywords: ['Parenting', 'Smartphone Use', 'Attention Development', 'Early Childhood', 'Screen Time'],
    reviewers: [],
    reviews: [],
    averageScore: null,
    session: null,
    presentationType: 'poster',
    attachments: [{ name: 'Abstract.pdf', size: '0.3 MB' }]
  },
  {
    id: 'ABS-015',
    title: 'Effectiveness of Group Therapy for Social Anxiety in University Students: A Waitlist-Controlled Trial',
    authors: [
      { name: 'Dr. Samantha Liu', affiliation: 'University of British Columbia', isPresenting: true, registered: false }
    ],
    track: 'clinical',
    status: 'submitted',
    submittedDate: '2025-03-15',
    abstract: 'Social anxiety disorder is highly prevalent among university students and often goes untreated. This waitlist-controlled trial evaluated a 10-week cognitive-behavioral group therapy program at three Canadian universities (N=186). We assessed social anxiety symptoms, academic functioning, and quality of life at pre-treatment, post-treatment, and 3-month follow-up.',
    keywords: ['Social Anxiety', 'Group Therapy', 'University Students', 'CBT', 'RCT'],
    reviewers: [],
    reviews: [],
    averageScore: null,
    session: null,
    presentationType: 'symposium',
    attachments: [{ name: 'Abstract.pdf', size: '0.5 MB' }]
  },
  {
    id: 'ABS-016',
    title: 'Two-Eyed Seeing: Integrating Indigenous and Western Approaches to Youth Mental Health',
    authors: [
      { name: 'Dr. Michael Blackwater', affiliation: 'University of Saskatchewan', isPresenting: true, registered: false },
      { name: 'Elder Rose Cardinal', affiliation: 'File Hills Qu\'Appelle Tribal Council', isPresenting: true, registered: false }
    ],
    track: 'indigenous',
    status: 'submitted',
    submittedDate: '2025-03-16',
    abstract: 'Using the Two-Eyed Seeing framework, this presentation describes a community-developed mental health program for Indigenous youth in Saskatchewan. The program integrates traditional healing practices with evidence-based psychological interventions. We share preliminary outcomes from the first two years of implementation and lessons learned about ethical collaboration.',
    keywords: ['Two-Eyed Seeing', 'Indigenous Youth', 'Mental Health', 'Traditional Healing', 'Community Psychology'],
    reviewers: [],
    reviews: [],
    averageScore: null,
    session: null,
    presentationType: 'panel',
    attachments: [{ name: 'Abstract.pdf', size: '0.6 MB' }]
  },
  {
    id: 'ABS-017',
    title: 'Moral Injury in First Responders: Prevalence and Treatment Implications',
    authors: [
      { name: 'Dr. James Morrison', affiliation: 'Carleton University', isPresenting: true, registered: false }
    ],
    track: 'clinical',
    status: 'submitted',
    submittedDate: '2025-03-18',
    abstract: 'Moral injury—psychological distress from actions that violate moral beliefs—is increasingly recognized in first responder populations. This cross-sectional study surveyed 892 Canadian paramedics, firefighters, and police officers to assess moral injury prevalence and its relationship to PTSD, depression, and suicidal ideation. Findings inform specialized treatment approaches.',
    keywords: ['Moral Injury', 'First Responders', 'PTSD', 'Occupational Trauma', 'Emergency Services'],
    reviewers: [],
    reviews: [],
    averageScore: null,
    session: null,
    presentationType: 'snapshot',
    attachments: [{ name: 'Abstract.pdf', size: '0.4 MB' }]
  }
];

// Track floating panel positions to offset new ones
let panelCounter = 0;

export function EventProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [moreMenuItem, setMoreMenuItem] = useState('participants');
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState(() =>
    MORE_MENU_SECTIONS.reduce((acc, section) => ({ ...acc, [section.id]: true }), {})
  );
  // Support multiple floating panels
  const [floatingPanels, setFloatingPanels] = useState([]);

  // Search state
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSlideOutOpen, setSearchSlideOutOpen] = useState(false);
  const [peopleSearchQuery, setPeopleSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const slideOutSearchRef = useRef(null);
  const peopleSearchRef = useRef(null);

  // Saved views state for People tab
  const [savedViews, setSavedViews] = useState([]);
  const [activeViewId, setActiveViewId] = useState('all');
  const [isNamingView, setIsNamingView] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const saveViewInputRef = useRef(null);

  // Abstracts state
  const [abstracts, setAbstracts] = useState(ABSTRACTS_DATA);
  const [abstractStatusFilter, setAbstractStatusFilter] = useState('all');
  const [abstractTrackFilter, setAbstractTrackFilter] = useState('all');
  const [abstractSearchQuery, setAbstractSearchQuery] = useState('');
  const [selectedAbstract, setSelectedAbstract] = useState(null);
  const [abstractDetailOpen, setAbstractDetailOpen] = useState(false);

  // Multi-select and review mode state
  const [selectedAbstractIds, setSelectedAbstractIds] = useState(new Set());
  const [reviewMode, setReviewMode] = useState(false);
  const [activeReviewAbstractId, setActiveReviewAbstractId] = useState(null);
  const [dataExplorerExpanded, setDataExplorerExpanded] = useState(true);
  const [dataExplorerHeight, setDataExplorerHeight] = useState(200);
  const [isResizingDataExplorer, setIsResizingDataExplorer] = useState(false);
  const dataExplorerResizeStartY = useRef(0);
  const dataExplorerResizeStartHeight = useRef(200);
  const [canvasZoom, setCanvasZoom] = useState(100);

  // PDF viewer state - floating panel
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfPanelPosition, setPdfPanelPosition] = useState({ x: 100, y: 80 });
  const [pdfPanelSize, setPdfPanelSize] = useState({ width: 700, height: 600 });
  const [pdfPanelMinimized, setPdfPanelMinimized] = useState(false);
  const [pdfPanelMaximized, setPdfPanelMaximized] = useState(false);
  const [isDraggingPdfPanel, setIsDraggingPdfPanel] = useState(false);
  const [isResizingPdfPanel, setIsResizingPdfPanel] = useState(false);
  const [pdfResizeDirection, setPdfResizeDirection] = useState(null);
  const pdfDragStart = useRef({ x: 0, y: 0 });
  const pdfPreMaxState = useRef({ position: { x: 100, y: 80 }, size: { width: 700, height: 600 } });

  // Studio Dock integration for Data Explorer
  const { panels: studioPanels, togglePanel: toggleStudioPanel, openPanel: openStudioPanel, closePanel: closeStudioPanel } = useStudioDockStore();

  // Evaluation form state
  const [evaluationScores, setEvaluationScores] = useState({});
  const [evaluationComments, setEvaluationComments] = useState('');
  const [selectedRejectionReason, setSelectedRejectionReason] = useState(null);

  // Handle click outside and Esc to close search
  useEffect(() => {
    if (!searchActive) return;

    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchActive(false);
        setSearchQuery('');
      }
    };

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setSearchActive(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [searchActive]);

  // Auto-focus input when search becomes active
  useEffect(() => {
    if (searchActive) {
      // Small delay to ensure input is mounted after AnimatePresence transition
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [searchActive]);

  // Sync Data Explorer state with Studio Dock explorer panel
  useEffect(() => {
    if (studioPanels.explorer !== dataExplorerExpanded) {
      setDataExplorerExpanded(studioPanels.explorer);
    }
  }, [studioPanels.explorer]);

  // Update Studio Dock when Data Explorer state changes locally
  useEffect(() => {
    if (dataExplorerExpanded && !studioPanels.explorer) {
      openStudioPanel('explorer');
    } else if (!dataExplorerExpanded && studioPanels.explorer) {
      closeStudioPanel('explorer');
    }
  }, [dataExplorerExpanded, studioPanels.explorer, openStudioPanel, closeStudioPanel]);

  // PDF panel drag and resize effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingPdfPanel) {
        const newX = Math.max(0, Math.min(e.clientX - pdfDragStart.current.x, window.innerWidth - 100));
        const newY = Math.max(0, Math.min(e.clientY - pdfDragStart.current.y, window.innerHeight - 40));
        setPdfPanelPosition({ x: newX, y: newY });
      } else if (isResizingPdfPanel && pdfResizeDirection) {
        const deltaX = e.clientX - pdfDragStart.current.x;
        const deltaY = e.clientY - pdfDragStart.current.y;

        let newWidth = pdfDragStart.current.width;
        let newHeight = pdfDragStart.current.height;
        let newX = pdfDragStart.current.posX;
        let newY = pdfDragStart.current.posY;

        if (pdfResizeDirection.includes('e')) {
          newWidth = Math.max(400, pdfDragStart.current.width + deltaX);
        }
        if (pdfResizeDirection.includes('w')) {
          const widthDelta = Math.min(deltaX, pdfDragStart.current.width - 400);
          newWidth = pdfDragStart.current.width - widthDelta;
          newX = pdfDragStart.current.posX + widthDelta;
        }
        if (pdfResizeDirection.includes('s')) {
          newHeight = Math.max(300, pdfDragStart.current.height + deltaY);
        }
        if (pdfResizeDirection.includes('n')) {
          const heightDelta = Math.min(deltaY, pdfDragStart.current.height - 300);
          newHeight = pdfDragStart.current.height - heightDelta;
          newY = pdfDragStart.current.posY + heightDelta;
        }

        setPdfPanelSize({ width: newWidth, height: newHeight });
        setPdfPanelPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDraggingPdfPanel(false);
      setIsResizingPdfPanel(false);
      setPdfResizeDirection(null);
    };

    if (isDraggingPdfPanel || isResizingPdfPanel) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingPdfPanel, isResizingPdfPanel, pdfResizeDirection]);

  const event = EVENT_DATA[id] || EVENT_DATA['cpa-convention-2025'];

  // Filter people collections based on search query
  const filteredPeopleCollections = useMemo(() => {
    if (!peopleSearchQuery.trim()) return PEOPLE_COLLECTIONS;
    const query = peopleSearchQuery.toLowerCase();
    return PEOPLE_COLLECTIONS.filter(collection =>
      collection.title.toLowerCase().includes(query) ||
      collection.list.some(item => item.name.toLowerCase().includes(query))
    );
  }, [peopleSearchQuery]);

  // Handle switching between views
  const handleViewChange = useCallback((viewId) => {
    setActiveViewId(viewId);
    if (viewId === 'all') {
      setPeopleSearchQuery('');
    } else {
      const view = savedViews.find(v => v.id === viewId);
      if (view) {
        setPeopleSearchQuery(view.filterQuery);
      }
    }
  }, [savedViews]);

  // Handle saving a new view
  const handleSaveView = useCallback(() => {
    if (!newViewName.trim() || !peopleSearchQuery.trim()) return;

    const newView = {
      id: `view-${Date.now()}`,
      name: newViewName.trim(),
      filterQuery: peopleSearchQuery
    };

    setSavedViews(prev => [...prev, newView]);
    setActiveViewId(newView.id);
    setIsNamingView(false);
    setNewViewName('');
  }, [newViewName, peopleSearchQuery]);

  // Handle deleting a saved view
  const handleDeleteView = useCallback((viewId) => {
    setSavedViews(prev => prev.filter(v => v.id !== viewId));
    if (activeViewId === viewId) {
      setActiveViewId('all');
      setPeopleSearchQuery('');
    }
  }, [activeViewId]);

  // Auto-focus save view input when naming mode is active
  useEffect(() => {
    if (isNamingView && saveViewInputRef.current) {
      saveViewInputRef.current.focus();
    }
  }, [isNamingView]);

  const formatDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const month = MONTHS[startDate.getMonth()];
    return `${month} ${startDate.getDate()} - ${endDate.getDate()}, ${startDate.getFullYear()}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Multi-select handlers
  const toggleAbstractSelection = useCallback((abstractId, e) => {
    e?.stopPropagation();
    setSelectedAbstractIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(abstractId)) {
        newSet.delete(abstractId);
      } else {
        newSet.add(abstractId);
      }
      return newSet;
    });
  }, []);

  const selectAllAbstracts = useCallback((filteredAbstracts) => {
    setSelectedAbstractIds(new Set(filteredAbstracts.map(a => a.id)));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedAbstractIds(new Set());
  }, []);

  // Enter review mode with selected abstracts
  const enterReviewMode = useCallback(() => {
    if (selectedAbstractIds.size > 0) {
      setReviewMode(true);
      setAbstractDetailOpen(false);
      // Set first selected abstract as active
      const firstId = Array.from(selectedAbstractIds)[0];
      setActiveReviewAbstractId(firstId);
      // Reset evaluation form
      setEvaluationScores({});
      setEvaluationComments('');
      setSelectedRejectionReason(null);
    }
  }, [selectedAbstractIds]);

  const exitReviewMode = useCallback(() => {
    setReviewMode(false);
    setActiveReviewAbstractId(null);
    setEvaluationScores({});
    setEvaluationComments('');
    setSelectedRejectionReason(null);
  }, []);

  // Data Explorer resize handlers
  const handleDataExplorerResizeStart = useCallback((e) => {
    e.preventDefault();
    setIsResizingDataExplorer(true);
    dataExplorerResizeStartY.current = e.clientY;
    dataExplorerResizeStartHeight.current = dataExplorerHeight;
  }, [dataExplorerHeight]);

  useEffect(() => {
    if (!isResizingDataExplorer) return;

    const handleMouseMove = (e) => {
      const deltaY = dataExplorerResizeStartY.current - e.clientY;
      const newHeight = Math.max(100, Math.min(500, dataExplorerResizeStartHeight.current + deltaY));
      setDataExplorerHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizingDataExplorer(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingDataExplorer]);

  // PDF viewer handlers
  const openPdfViewer = useCallback((pdf) => {
    setSelectedPdf(pdf);
    setPdfViewerOpen(true);
    setPdfPanelMinimized(false);
  }, []);

  const closePdfViewer = useCallback(() => {
    setPdfViewerOpen(false);
    setSelectedPdf(null);
    setPdfPanelMinimized(false);
    setPdfPanelMaximized(false);
  }, []);

  const handlePdfPanelDragStart = useCallback((e) => {
    if (pdfPanelMaximized) return;
    e.preventDefault();
    setIsDraggingPdfPanel(true);
    pdfDragStart.current = {
      x: e.clientX - pdfPanelPosition.x,
      y: e.clientY - pdfPanelPosition.y
    };
  }, [pdfPanelMaximized, pdfPanelPosition]);

  const handlePdfPanelResizeStart = useCallback((e, direction) => {
    if (pdfPanelMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizingPdfPanel(true);
    setPdfResizeDirection(direction);
    pdfDragStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: pdfPanelSize.width,
      height: pdfPanelSize.height,
      posX: pdfPanelPosition.x,
      posY: pdfPanelPosition.y
    };
  }, [pdfPanelMaximized, pdfPanelSize, pdfPanelPosition]);

  const handlePdfPanelMinimize = useCallback(() => {
    setPdfPanelMinimized(!pdfPanelMinimized);
    if (pdfPanelMaximized) {
      setPdfPanelMaximized(false);
      setPdfPanelPosition(pdfPreMaxState.current.position);
      setPdfPanelSize(pdfPreMaxState.current.size);
    }
  }, [pdfPanelMinimized, pdfPanelMaximized]);

  const handlePdfPanelMaximize = useCallback(() => {
    if (pdfPanelMinimized) {
      setPdfPanelMinimized(false);
      return;
    }
    if (pdfPanelMaximized) {
      setPdfPanelPosition(pdfPreMaxState.current.position);
      setPdfPanelSize(pdfPreMaxState.current.size);
    } else {
      pdfPreMaxState.current = { position: pdfPanelPosition, size: pdfPanelSize };
      setPdfPanelPosition({ x: 0, y: 0 });
      setPdfPanelSize({ width: window.innerWidth, height: window.innerHeight });
    }
    setPdfPanelMaximized(!pdfPanelMaximized);
  }, [pdfPanelMinimized, pdfPanelMaximized, pdfPanelPosition, pdfPanelSize]);

  // Get active review abstract
  const activeReviewAbstract = useMemo(() => {
    return abstracts.find(a => a.id === activeReviewAbstractId);
  }, [abstracts, activeReviewAbstractId]);

  // Calculate total score and average
  const totalScore = useMemo(() => {
    const scores = Object.values(evaluationScores);
    if (scores.length === 0) return 0;
    return scores.reduce((sum, score) => sum + score, 0);
  }, [evaluationScores]);

  const averageScore = useMemo(() => {
    const scores = Object.values(evaluationScores);
    if (scores.length === 0) return 0;
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }, [evaluationScores]);

  const criteriaRatedCount = Object.keys(evaluationScores).length;

  const maxPossibleScore = EVALUATION_CRITERIA.length * 5;

  const handlePopOut = useCallback((collection) => {
    // Create a new floating panel with offset position
    const offset = (panelCounter % 5) * 40; // Cascade effect
    panelCounter++;

    const newPanel = {
      id: `panel-${Date.now()}`,
      collection,
      initialPosition: { x: 120 + offset, y: 80 + offset },
      zIndex: 1000 + floatingPanels.length
    };

    setFloatingPanels(prev => [...prev, newPanel]);
  }, [floatingPanels.length]);

  const closeFloatingPanel = useCallback((panelId) => {
    setFloatingPanels(prev => prev.filter(p => p.id !== panelId));
  }, []);

  // Helper function to get icon for quick links
  const getQuickLinkIcon = (iconName) => {
    const icons = {
      users: <Users size={16} strokeWidth={1.5} />,
      calendar: <Calendar size={16} strokeWidth={1.5} />,
      download: <Download size={16} strokeWidth={1.5} />,
      mail: <Mail size={16} strokeWidth={1.5} />
    };
    return icons[iconName] || null;
  };

  const renderProfileTab = () => (
    <div style={{ padding: '24px' }}>
      {/* Two Column Layout - responsive to sidebar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) clamp(280px, 30%, 380px)',
        gap: '24px'
      }}>
        {/* Left Column - Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Key Metrics - KPI Cards */}
          <section>
            <h2 style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              marginBottom: '16px'
            }}>
              Key Metrics
            </h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              {EVENT_METRICS.map((metric) => (
                <motion.div
                  key={metric.label}
                  whileHover={{ y: -2, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}
                  style={{
                    flex: '1 1 140px',
                    minWidth: '140px',
                    padding: '20px',
                    borderRadius: theme.borderRadius.xl,
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#ffffff',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    fontSize: '28px',
                    fontWeight: theme.typography.fontWeight.bold,
                    marginBottom: '6px',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    color: theme.colors.primary[500]
                  }}>
                    {metric.value}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: theme.colors.text.tertiary,
                    marginBottom: '4px'
                  }}>
                    {metric.label}
                  </div>
                  <div style={{
                    fontSize: theme.typography.fontSize.xs,
                    fontWeight: theme.typography.fontWeight.medium,
                    color: metric.positive ? '#30d158' : '#ff9f0a'
                  }}>
                    {metric.trend}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Registration & Revenue Chart */}
          <section>
            <h2 style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              marginBottom: '16px'
            }}>
              Registration & Revenue Trend
            </h2>
            <div style={{
              padding: '24px',
              borderRadius: theme.borderRadius.xl,
              background: '#ffffff',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03)',
              height: '320px',
              contain: 'layout',
              overflow: 'hidden'
            }}>
              <ResponsiveContainer width="100%" height="100%" debounce={100}>
                <ComposedChart data={REGISTRATION_CHART_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={theme.colors.primary[500]} stopOpacity={0.3}/>
                      <stop offset="100%" stopColor={theme.colors.primary[500]} stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="0" stroke="#e5e5e7" horizontal={true} vertical={false} />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#6e6e73', fontSize: 11 }} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#6e6e73', fontSize: 11 }} dx={-10} tickFormatter={(value) => value.toLocaleString()} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#6e6e73', fontSize: 11 }} dx={10} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e7', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value, name) => {
                      if (name === 'cumRevenue') return [`$${value.toLocaleString()}`, 'Cumulative Revenue'];
                      if (name === 'cumRegistrations') return [value.toLocaleString(), 'Cumulative Registrations'];
                      return [value, name];
                    }}
                  />
                  <Legend verticalAlign="top" height={36} formatter={(value) => value === 'cumRegistrations' ? 'Cumulative Registrations' : value === 'cumRevenue' ? 'Cumulative Revenue' : value} />
                  <Bar yAxisId="left" dataKey="cumRegistrations" fill="url(#colorRegistrations)" radius={[4, 4, 0, 0]} barSize={40} />
                  <Line yAxisId="right" type="monotone" dataKey="cumRevenue" stroke="#30d158" strokeWidth={3} dot={{ fill: '#30d158', r: 4 }} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Registration Funnel */}
          <section>
            <h2 style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              marginBottom: '16px'
            }}>
              Registration Funnel
            </h2>
            <div style={{
              padding: '32px',
              borderRadius: theme.borderRadius.xl,
              background: '#ffffff',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                {REGISTRATION_FUNNEL.map((stage, index) => {
                  const widths = [100, 88, 76, 68, 64];
                  const width = widths[index];
                  const nextWidth = widths[index + 1] || width;
                  const heightDiff = (100 - width) / 2;
                  const nextHeightDiff = (100 - nextWidth) / 2;
                  const blueColors = ['#ffffff', '#e0f2fe', '#7dd3fc', '#38bdf8', '#0ea5e9'];
                  const textColors = ['#1d1d1f', '#1d1d1f', '#1d1d1f', '#1d1d1f', '#ffffff'];

                  return (
                    <motion.div key={stage.label} whileHover={{ opacity: 0.9 }} style={{ position: 'relative', width: `${width * 2.2}px`, height: '130px', cursor: 'pointer' }}>
                      <div style={{
                        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        clipPath: `polygon(0 ${heightDiff}%, 100% ${nextHeightDiff}%, 100% ${100 - nextHeightDiff}%, 0 ${100 - heightDiff}%)`,
                        background: blueColors[index], boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)', transition: 'all 0.2s ease'
                      }}>
                        <div style={{ fontSize: '20px', fontWeight: theme.typography.fontWeight.bold, marginBottom: '4px', letterSpacing: '-0.02em', color: textColors[index] }}>{stage.value}</div>
                        <div style={{ fontSize: '11px', fontWeight: theme.typography.fontWeight.medium, marginBottom: '2px', color: index === 4 ? 'rgba(255, 255, 255, 0.9)' : 'rgba(29, 29, 31, 0.7)', textAlign: 'center', padding: '0 8px' }}>{stage.label}</div>
                        <div style={{ fontSize: '11px', fontWeight: theme.typography.fontWeight.semibold, color: textColors[index] }}>{stage.percentage}%</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Recent Registrations */}
          <section>
            <h2 style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              marginBottom: '16px'
            }}>
              Recent Registrations
            </h2>
            <div style={{
              padding: '20px',
              background: '#ffffff',
              borderRadius: theme.borderRadius.xl,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {RECENT_REGISTRATIONS.map((registration) => (
                  <motion.div
                    key={registration.id}
                    whileHover={{ background: theme.colors.background.tertiary }}
                    style={{
                      padding: '14px 16px',
                      borderRadius: theme.borderRadius.lg,
                      background: 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: theme.borderRadius.full,
                        background: theme.colors.primary[100],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: theme.colors.primary[600],
                        fontWeight: theme.typography.fontWeight.semibold,
                        fontSize: theme.typography.fontSize.sm
                      }}>
                        {registration.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{
                          fontSize: theme.typography.fontSize.sm,
                          fontWeight: theme.typography.fontWeight.medium,
                          color: theme.colors.text.primary,
                          marginBottom: '2px'
                        }}>
                          {registration.name}
                        </div>
                        <div style={{
                          fontSize: theme.typography.fontSize.xs,
                          color: theme.colors.text.tertiary
                        }}>
                          {registration.company}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: theme.typography.fontWeight.bold,
                        padding: '4px 8px',
                        borderRadius: theme.borderRadius.md,
                        background: registration.status === 'confirmed' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 149, 0, 0.1)',
                        color: registration.status === 'confirmed' ? '#34C759' : '#FF9500',
                        textTransform: 'uppercase'
                      }}>
                        {registration.status}
                      </span>
                      <div style={{
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: '4px'
                      }}>
                        {registration.type} · {registration.time}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Quick Actions */}
          <section>
            <h2 style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              marginBottom: '16px'
            }}>
              Quick Actions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {QUICK_LINKS.map((link) => (
                <motion.button
                  key={link.label}
                  whileHover={{ x: 2 }}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: theme.borderRadius.lg,
                    border: 'none',
                    background: theme.colors.background.tertiary,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.text.primary,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ color: theme.colors.text.tertiary }}>
                    {getQuickLinkIcon(link.icon)}
                  </span>
                  {link.label}
                </motion.button>
              ))}
            </div>
          </section>

          {/* Alerts & Insights */}
          <section>
            <h2 style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              marginBottom: '16px'
            }}>
              Alerts & Insights
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {EVENT_ALERTS.map((alert, index) => (
                <div
                  key={index}
                  style={{
                    padding: '16px',
                    borderRadius: '0 12px 12px 0',
                    background: theme.colors.background.secondary,
                    borderLeft: `4px solid ${alert.type === 'warning' ? '#ff9f0a' : alert.type === 'success' ? '#30d158' : '#007AFF'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    {alert.type === 'warning' ? (
                      <AlertCircle size={20} style={{ color: '#ff9f0a', flexShrink: 0, marginTop: '1px' }} />
                    ) : alert.type === 'success' ? (
                      <CheckCircle size={20} style={{ color: '#30d158', flexShrink: 0, marginTop: '1px' }} />
                    ) : (
                      <Info size={20} style={{ color: '#007AFF', flexShrink: 0, marginTop: '1px' }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.text.primary,
                        margin: 0,
                        lineHeight: theme.typography.lineHeight.relaxed
                      }}>
                        {alert.message}
                      </p>
                      <p style={{
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.text.tertiary,
                        margin: '8px 0 0 0'
                      }}>
                        {alert.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* About This Event */}
          <section>
            <h2 style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              marginBottom: '16px'
            }}>
              About This Event
            </h2>
            <p style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              lineHeight: theme.typography.lineHeight.relaxed,
              marginBottom: '16px'
            }}>
              {event.description}
            </p>

            {/* Venue Card */}
            <div style={{
              padding: '16px',
              background: theme.colors.background.tertiary,
              borderRadius: theme.borderRadius.lg
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={18} style={{ color: theme.colors.text.tertiary, marginTop: '2px' }} />
                <div>
                  <div style={{
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text.primary,
                    marginBottom: '4px'
                  }}>
                    {event.venue}
                  </div>
                  <div style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.tertiary
                  }}>
                    {event.city}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  const renderActivitiesTab = () => (
    <div style={{ padding: '32px' }}>
      <h2 style={{
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.colors.text.primary,
        marginBottom: '24px'
      }}>
        Recent Activity
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { action: 'New registration', detail: 'Sarah Chen (VIP)', time: '2 hours ago' },
          { action: '12 Early Bird converted to Full', detail: 'Batch upgrade', time: 'Yesterday' },
          { action: 'Speaker confirmed', detail: 'Dr. Maya Johnson', time: '2 days ago' },
          { action: 'Sponsor upgraded', detail: 'TechCorp → Platinum', time: '3 days ago' },
          { action: 'Session room changed', detail: '"AI in Practice" → Room 104', time: '4 days ago' }
        ].map((activity, index) => (
          <div
            key={index}
            style={{
              padding: '16px',
              background: theme.colors.background.tertiary,
              borderRadius: theme.borderRadius.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.text.primary,
                marginBottom: '4px'
              }}>
                {activity.action}
              </div>
              <div style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.tertiary
              }}>
                {activity.detail}
              </div>
            </div>
            <span style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary
            }}>
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const renderMoreTab = () => (
    <div style={{ display: 'flex', height: 'calc(100vh - 280px)', minHeight: '400px' }}>
      {/* Modern scrollbar styles for more menu nav */}
      <style>{`
        .more-menu-nav {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }
        .more-menu-nav:hover {
          scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        }
        .more-menu-nav::-webkit-scrollbar {
          width: 6px;
        }
        .more-menu-nav::-webkit-scrollbar-track {
          background: transparent;
        }
        .more-menu-nav::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 3px;
          transition: background 0.2s ease;
        }
        .more-menu-nav:hover::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
        }
        .more-menu-nav::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.35);
        }
      `}</style>
      {/* Left Menu - Collapsible - No background/border */}
      <motion.div
        animate={{ width: menuCollapsed ? '56px' : '240px' }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        style={{
          padding: menuCollapsed ? '0 8px' : '0 16px 0 0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flexShrink: 0
        }}
      >
        <nav
          className="more-menu-nav"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingRight: '4px'
          }}>
          {MORE_MENU_SECTIONS.map((section, sectionIndex) => {
            const isExpanded = expandedSections[section.id];
            return (
              <div key={section.id} style={{ marginBottom: sectionIndex < MORE_MENU_SECTIONS.length - 1 ? '4px' : 0 }}>
                {/* Section Header */}
                {!menuCollapsed && (
                  <button
                    onClick={() => toggleSection(section.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px 6px',
                      width: '100%',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.text.tertiary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginTop: sectionIndex > 0 ? '4px' : 0,
                      textAlign: 'left'
                    }}
                  >
                    <motion.span
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.15 }}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <ChevronRight size={14} strokeWidth={2} />
                    </motion.span>
                    {section.label}
                  </button>
                )}
                {menuCollapsed && sectionIndex > 0 && (
                  <div style={{
                    height: '1px',
                    background: theme.colors.neutral[200],
                    margin: '8px 4px'
                  }} />
                )}
                {/* Section Items */}
                <AnimatePresence initial={false}>
                  {(menuCollapsed || isExpanded) && (
                    <motion.div
                      initial={menuCollapsed ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = moreMenuItem === item.id;

                          return (
                            <motion.button
                              key={item.id}
                              onClick={() => setMoreMenuItem(item.id)}
                              title={menuCollapsed ? item.label : undefined}
                              whileHover={{ x: 2 }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: menuCollapsed ? '10px' : '10px 12px',
                                border: 'none',
                                background: isActive ? theme.colors.primary[50] : 'transparent',
                                borderRadius: `${theme.borderRadius.md} 0 0 ${theme.borderRadius.md}`,
                                cursor: 'pointer',
                                fontSize: theme.typography.fontSize.sm,
                                fontWeight: isActive ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal,
                                color: isActive ? theme.colors.primary[600] : theme.colors.text.secondary,
                                textAlign: 'left',
                                width: '100%',
                                transition: `all ${theme.transitions.fast}`,
                                justifyContent: menuCollapsed ? 'center' : 'flex-start',
                                minHeight: '36px',
                                borderRight: isActive ? `2px solid ${theme.colors.primary[500]}` : '2px solid transparent'
                              }}
                            >
                              <Icon size={18} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                              {!menuCollapsed && <span>{item.label}</span>}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Sticky Footer - Event Settings and Collapse */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '8px',
          borderTop: `1px solid ${theme.colors.neutral[200]}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          paddingRight: '4px'
        }}>
          {/* Event Settings - shows in both collapsed and expanded states */}
          <button
            onClick={() => setMoreMenuItem('event-settings')}
            title="Event Settings"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: menuCollapsed ? 'center' : 'flex-start',
              gap: '10px',
              padding: menuCollapsed ? '10px' : '10px 12px',
              border: 'none',
              background: moreMenuItem === 'event-settings' ? theme.colors.primary[50] : 'transparent',
              borderRadius: `${theme.borderRadius.md} 0 0 ${theme.borderRadius.md}`,
              cursor: 'pointer',
              color: moreMenuItem === 'event-settings' ? theme.colors.primary[600] : theme.colors.text.tertiary,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: moreMenuItem === 'event-settings' ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal,
              width: '100%',
              transition: `all ${theme.transitions.fast}`,
              borderRight: moreMenuItem === 'event-settings' ? `2px solid ${theme.colors.primary[500]}` : '2px solid transparent'
            }}
          >
            <Settings size={18} strokeWidth={1.5} />
            {!menuCollapsed && <span>Event Settings</span>}
          </button>

          {/* Collapse / Expand button */}
          <button
            onClick={() => setMenuCollapsed(!menuCollapsed)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: menuCollapsed ? 'center' : 'flex-start',
              gap: '10px',
              padding: menuCollapsed ? '10px' : '10px 12px',
              border: 'none',
              background: 'transparent',
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.tertiary,
              width: '100%',
              transition: `all ${theme.transitions.fast}`
            }}
            title={menuCollapsed ? 'Expand menu' : 'Collapse menu'}
          >
            {menuCollapsed ? (
              <PanelLeft size={16} strokeWidth={1.5} />
            ) : (
              <PanelLeftClose size={16} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </motion.div>

      {/* Content Area - No container background */}
      <div style={{ flex: 1, paddingLeft: '24px', overflowY: 'auto', overflowX: 'hidden' }}>
        {(moreMenuItem === 'participants' || moreMenuItem === 'attendees') && (
          <>
            {/* Header with tabs and filter */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '20px'
            }}>
              {/* Left side: Tabs */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {/* All tab */}
                <motion.button
                  whileHover={{ background: activeViewId === 'all' ? theme.colors.primary[100] : theme.colors.neutral[100] }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleViewChange('all')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: theme.borderRadius.full,
                    border: 'none',
                    background: activeViewId === 'all' ? theme.colors.primary[100] : 'transparent',
                    color: activeViewId === 'all' ? theme.colors.primary[700] : theme.colors.text.secondary,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: activeViewId === 'all' ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  All
                </motion.button>

                {/* Saved view tabs */}
                <AnimatePresence>
                  {savedViews.map((view) => (
                    <motion.div
                      key={view.id}
                      initial={{ opacity: 0, scale: 0.9, width: 0 }}
                      animate={{ opacity: 1, scale: 1, width: 'auto' }}
                      exit={{ opacity: 0, scale: 0.9, width: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                    >
                      <motion.button
                        whileHover={{ background: activeViewId === view.id ? theme.colors.primary[100] : theme.colors.neutral[100] }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleViewChange(view.id)}
                        style={{
                          padding: '8px 12px',
                          paddingRight: '28px',
                          borderRadius: theme.borderRadius.full,
                          border: 'none',
                          background: activeViewId === view.id ? theme.colors.primary[100] : 'transparent',
                          color: activeViewId === view.id ? theme.colors.primary[700] : theme.colors.text.secondary,
                          fontSize: theme.typography.fontSize.sm,
                          fontWeight: activeViewId === view.id ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {view.name}
                      </motion.button>
                      {/* Delete button on saved tabs */}
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        whileHover={{ opacity: 1, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteView(view.id);
                        }}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          width: '16px',
                          height: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          color: theme.colors.text.tertiary
                        }}
                        title="Remove view"
                      >
                        <X size={12} />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Save view button/input - only show when filtering and not on a saved view */}
                <AnimatePresence>
                  {peopleSearchQuery && activeViewId === 'all' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, width: 0 }}
                      animate={{ opacity: 1, scale: 1, width: 'auto' }}
                      exit={{ opacity: 0, scale: 0.9, width: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    >
                      {isNamingView ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          background: '#ffffff',
                          borderRadius: theme.borderRadius.full,
                          border: `1px solid ${theme.colors.primary[300]}`,
                          boxShadow: `0 0 0 2px ${theme.colors.primary[100]}`
                        }}>
                          <input
                            ref={saveViewInputRef}
                            type="text"
                            value={newViewName}
                            onChange={(e) => setNewViewName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveView();
                              if (e.key === 'Escape') {
                                setIsNamingView(false);
                                setNewViewName('');
                              }
                            }}
                            placeholder="View name..."
                            style={{
                              width: '100px',
                              padding: '4px 8px',
                              border: 'none',
                              background: 'transparent',
                              outline: 'none',
                              fontSize: theme.typography.fontSize.sm,
                              color: theme.colors.text.primary
                            }}
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleSaveView}
                            disabled={!newViewName.trim()}
                            style={{
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: newViewName.trim() ? theme.colors.primary[500] : theme.colors.neutral[200],
                              border: 'none',
                              borderRadius: '50%',
                              cursor: newViewName.trim() ? 'pointer' : 'not-allowed',
                              color: newViewName.trim() ? '#ffffff' : theme.colors.text.tertiary
                            }}
                          >
                            <Check size={14} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setIsNamingView(false);
                              setNewViewName('');
                            }}
                            style={{
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: theme.colors.neutral[100],
                              border: 'none',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              color: theme.colors.text.secondary
                            }}
                          >
                            <X size={14} />
                          </motion.button>
                        </div>
                      ) : (
                        <motion.button
                          whileHover={{ background: theme.colors.neutral[100] }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsNamingView(true)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 12px',
                            borderRadius: theme.borderRadius.full,
                            border: `1px dashed ${theme.colors.border.default}`,
                            background: 'transparent',
                            color: theme.colors.text.tertiary,
                            fontSize: theme.typography.fontSize.sm,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Plus size={14} />
                          Save view
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right side: Filter input */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '240px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 14px',
                  background: '#ffffff',
                  borderRadius: theme.borderRadius.full,
                  border: `1px solid ${theme.colors.border.default}`,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.2s ease'
                }}>
                  <Filter size={14} style={{ color: theme.colors.text.tertiary, flexShrink: 0 }} />
                  <input
                    ref={peopleSearchRef}
                    type="text"
                    value={peopleSearchQuery}
                    onChange={(e) => {
                      setPeopleSearchQuery(e.target.value);
                      // When user types, switch to "All" view but keep the filter
                      if (activeViewId !== 'all') {
                        setActiveViewId('all');
                      }
                    }}
                    placeholder="Filter..."
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.text.primary
                    }}
                  />
                  <AnimatePresence>
                    {peopleSearchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setPeopleSearchQuery('');
                          setActiveViewId('all');
                          peopleSearchRef.current?.focus();
                        }}
                        style={{
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: theme.colors.neutral[200],
                          border: 'none',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          color: theme.colors.text.secondary
                        }}
                      >
                        <X size={10} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
                {/* Results count when filtering */}
                <AnimatePresence>
                  {peopleSearchQuery && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      style={{
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.text.tertiary,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {filteredPeopleCollections.length} of {PEOPLE_COLLECTIONS.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Filtered cards grid with animations */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              paddingBottom: '40px'
            }}>
              <AnimatePresence mode="popLayout">
                {filteredPeopleCollections.map((collection) => (
                  <motion.div
                    key={collection.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30
                    }}
                  >
                    <FacetCard
                      collection={collection}
                      defaultFacet={collection.defaultFacet}
                      onPopOut={() => handlePopOut(collection)}
                      onMenuClick={() => console.log('Menu for', collection.id)}
                      noBorder
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty state when no results */}
            <AnimatePresence>
              {peopleSearchQuery && filteredPeopleCollections.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 24px',
                    color: theme.colors.text.tertiary
                  }}
                >
                  <Search size={48} strokeWidth={1} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <div style={{
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: theme.typography.fontWeight.medium,
                    marginBottom: '8px'
                  }}>
                    No collections found
                  </div>
                  <div style={{ fontSize: theme.typography.fontSize.sm }}>
                    Try a different search term
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Abstracts Section */}
        {moreMenuItem === 'abstracts' && (
          <div style={{ padding: '8px 0' }}>
            {/* Header with Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <div>
                <h2 style={{
                  fontSize: theme.typography.fontSize['2xl'],
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text.primary,
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  Abstract Management
                </h2>
                <p style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  margin: 0
                }}>
                  {abstracts.length} submissions • Call for papers closes March 31, 2025
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <motion.button
                  whileHover={{ background: theme.colors.neutral[100] }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    border: `1px solid ${theme.colors.neutral[200]}`,
                    background: 'white',
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={16} strokeWidth={1.5} />
                  Export
                </motion.button>
                <motion.button
                  whileHover={{ background: theme.colors.primary[600] }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    border: 'none',
                    background: theme.colors.primary[500],
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} strokeWidth={2} />
                  Add Abstract
                </motion.button>
              </div>
            </div>

            {/* Stats Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '12px',
              marginBottom: '24px'
            }}>
              {[
                { key: 'all', label: 'Total', value: abstracts.length, color: theme.colors.text.primary },
                { key: 'submitted', label: 'Submitted', value: abstracts.filter(a => a.status === 'submitted').length, color: ABSTRACT_STATUSES.submitted.color },
                { key: 'under-review', label: 'Under Review', value: abstracts.filter(a => a.status === 'under-review').length, color: ABSTRACT_STATUSES['under-review'].color },
                { key: 'revision-required', label: 'Revision Required', value: abstracts.filter(a => a.status === 'revision-required').length, color: ABSTRACT_STATUSES['revision-required'].color },
                { key: 'accepted', label: 'Accepted', value: abstracts.filter(a => a.status === 'accepted').length, color: ABSTRACT_STATUSES.accepted.color },
                { key: 'scheduled', label: 'Scheduled', value: abstracts.filter(a => a.status === 'scheduled').length, color: ABSTRACT_STATUSES.scheduled.color },
                { key: 'unregistered', label: 'Unregistered', value: abstracts.filter(a => (a.status === 'accepted' || a.status === 'scheduled') && a.authors.some(author => author.isPresenting && !author.registered)).length, color: '#EF4444' }
              ].map((stat) => (
                <motion.button
                  key={stat.key}
                  onClick={() => setAbstractStatusFilter(stat.key)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: abstractStatusFilter === stat.key ? 'white' : 'rgba(255,255,255,0.6)',
                    borderRadius: theme.borderRadius.lg,
                    padding: '16px',
                    border: abstractStatusFilter === stat.key ? `2px solid ${stat.color}` : '2px solid transparent',
                    boxShadow: abstractStatusFilter === stat.key ? '0 4px 12px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{
                    fontSize: theme.typography.fontSize.xl,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: stat.color,
                    marginBottom: '2px'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.tertiary
                  }}>
                    {stat.label}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Filters & Search */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              {/* Search */}
              <div style={{
                position: 'relative',
                flex: 1,
                maxWidth: '320px'
              }}>
                <Search
                  size={16}
                  strokeWidth={1.5}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: theme.colors.text.tertiary
                  }}
                />
                <input
                  type="text"
                  placeholder="Search abstracts..."
                  value={abstractSearchQuery}
                  onChange={(e) => setAbstractSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    border: `1px solid ${theme.colors.neutral[200]}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.sm,
                    background: 'white',
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                />
              </div>

              {/* Track Filter */}
              <select
                value={abstractTrackFilter}
                onChange={(e) => setAbstractTrackFilter(e.target.value)}
                style={{
                  padding: '10px 32px 10px 12px',
                  border: `1px solid ${theme.colors.neutral[200]}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.sm,
                  background: 'white',
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center'
                }}
              >
                <option value="all">All Tracks</option>
                {ABSTRACT_TRACKS.map(track => (
                  <option key={track.id} value={track.id}>{track.label}</option>
                ))}
              </select>

              {/* Clear Filters */}
              {(abstractStatusFilter !== 'all' || abstractTrackFilter !== 'all' || abstractSearchQuery) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => {
                    setAbstractStatusFilter('all');
                    setAbstractTrackFilter('all');
                    setAbstractSearchQuery('');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 12px',
                    border: 'none',
                    background: theme.colors.neutral[100],
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary,
                    cursor: 'pointer'
                  }}
                >
                  <X size={14} strokeWidth={2} />
                  Clear
                </motion.button>
              )}
            </div>

            {/* Abstract List */}
            <div style={{
              background: 'white',
              borderRadius: theme.borderRadius.xl,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 120px 120px 130px 80px 50px',
                gap: '12px',
                padding: '12px 20px',
                background: theme.colors.neutral[50],
                borderBottom: `1px solid ${theme.colors.neutral[100]}`,
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.text.tertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                alignItems: 'center'
              }}>
                {/* Select All Checkbox */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    const filteredAbstracts = abstracts.filter(abstract => {
                      const matchesStatus = abstractStatusFilter === 'all'
                        || (abstractStatusFilter === 'unregistered'
                            ? (abstract.status === 'accepted' || abstract.status === 'scheduled') && abstract.authors.some(author => author.isPresenting && !author.registered)
                            : abstract.status === abstractStatusFilter);
                      const matchesTrack = abstractTrackFilter === 'all' || abstract.track === abstractTrackFilter;
                      const matchesSearch = !abstractSearchQuery ||
                        abstract.title.toLowerCase().includes(abstractSearchQuery.toLowerCase()) ||
                        abstract.authors.some(a => a.name.toLowerCase().includes(abstractSearchQuery.toLowerCase())) ||
                        abstract.id.toLowerCase().includes(abstractSearchQuery.toLowerCase());
                      return matchesStatus && matchesTrack && matchesSearch;
                    });
                    const allSelected = filteredAbstracts.every(a => selectedAbstractIds.has(a.id));
                    if (allSelected) {
                      clearSelection();
                    } else {
                      selectAllAbstracts(filteredAbstracts);
                    }
                  }}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {(() => {
                    const filteredAbstracts = abstracts.filter(abstract => {
                      const matchesStatus = abstractStatusFilter === 'all'
                        || (abstractStatusFilter === 'unregistered'
                            ? (abstract.status === 'accepted' || abstract.status === 'scheduled') && abstract.authors.some(author => author.isPresenting && !author.registered)
                            : abstract.status === abstractStatusFilter);
                      const matchesTrack = abstractTrackFilter === 'all' || abstract.track === abstractTrackFilter;
                      const matchesSearch = !abstractSearchQuery ||
                        abstract.title.toLowerCase().includes(abstractSearchQuery.toLowerCase()) ||
                        abstract.authors.some(a => a.name.toLowerCase().includes(abstractSearchQuery.toLowerCase())) ||
                        abstract.id.toLowerCase().includes(abstractSearchQuery.toLowerCase());
                      return matchesStatus && matchesTrack && matchesSearch;
                    });
                    const allSelected = filteredAbstracts.length > 0 && filteredAbstracts.every(a => selectedAbstractIds.has(a.id));
                    const someSelected = filteredAbstracts.some(a => selectedAbstractIds.has(a.id));
                    if (allSelected) {
                      return <CheckSquare size={16} strokeWidth={1.5} color={theme.colors.primary[500]} />;
                    } else if (someSelected) {
                      return <Minus size={16} strokeWidth={1.5} color={theme.colors.primary[500]} style={{ padding: '2px', background: theme.colors.primary[100], borderRadius: '3px' }} />;
                    }
                    return <Square size={16} strokeWidth={1.5} />;
                  })()}
                </div>
                <div>Abstract</div>
                <div>Type</div>
                <div>Track</div>
                <div>Status</div>
                <div>Score</div>
                <div></div>
              </div>

              {/* Abstract Rows */}
              <div>
                {abstracts
                  .filter(abstract => {
                    const matchesStatus = abstractStatusFilter === 'all'
                      || (abstractStatusFilter === 'unregistered'
                          ? (abstract.status === 'accepted' || abstract.status === 'scheduled') && abstract.authors.some(author => author.isPresenting && !author.registered)
                          : abstract.status === abstractStatusFilter);
                    const matchesTrack = abstractTrackFilter === 'all' || abstract.track === abstractTrackFilter;
                    const matchesSearch = !abstractSearchQuery ||
                      abstract.title.toLowerCase().includes(abstractSearchQuery.toLowerCase()) ||
                      abstract.authors.some(a => a.name.toLowerCase().includes(abstractSearchQuery.toLowerCase())) ||
                      abstract.id.toLowerCase().includes(abstractSearchQuery.toLowerCase());
                    return matchesStatus && matchesTrack && matchesSearch;
                  })
                  .map((abstract, index, arr) => {
                    const track = ABSTRACT_TRACKS.find(t => t.id === abstract.track);
                    const status = ABSTRACT_STATUSES[abstract.status];
                    const presentationType = PRESENTATION_TYPES[abstract.presentationType];
                    const isDetailSelected = abstractDetailOpen && selectedAbstract?.id === abstract.id;
                    const isChecked = selectedAbstractIds.has(abstract.id);
                    return (
                      <motion.div
                        key={abstract.id}
                        onClick={() => {
                          setSelectedAbstract(abstract);
                          setAbstractDetailOpen(true);
                        }}
                        whileHover={{ background: isDetailSelected || isChecked ? theme.colors.primary[50] : theme.colors.neutral[50] }}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '40px 1fr 120px 120px 130px 80px 50px',
                          gap: '12px',
                          padding: '16px 20px',
                          borderBottom: index < arr.length - 1 ? `1px solid ${theme.colors.neutral[100]}` : 'none',
                          cursor: 'pointer',
                          alignItems: 'center',
                          transition: 'all 0.15s ease',
                          background: isChecked ? `${theme.colors.primary[50]}` : (isDetailSelected ? theme.colors.primary[50] : 'transparent'),
                          borderLeft: isDetailSelected ? `3px solid ${theme.colors.primary[500]}` : (isChecked ? `3px solid ${theme.colors.primary[300]}` : '3px solid transparent'),
                          marginLeft: isDetailSelected || isChecked ? '-3px' : '0'
                        }}
                      >
                        {/* Checkbox */}
                        <div
                          onClick={(e) => toggleAbstractSelection(abstract.id, e)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          {isChecked ? (
                            <CheckSquare size={18} strokeWidth={1.5} color={theme.colors.primary[500]} />
                          ) : (
                            <Square size={18} strokeWidth={1.5} color={theme.colors.text.tertiary} />
                          )}
                        </div>

                        {/* Title & Authors */}
                        <div>
                          <div style={{
                            fontSize: theme.typography.fontSize.sm,
                            fontWeight: theme.typography.fontWeight.medium,
                            color: theme.colors.text.primary,
                            marginBottom: '4px',
                            lineHeight: 1.4
                          }}>
                            {abstract.title}
                          </div>
                          <div style={{
                            fontSize: theme.typography.fontSize.xs,
                            color: theme.colors.text.tertiary
                          }}>
                            {abstract.id} • {abstract.authors.map(a => a.name).join(', ')}
                          </div>
                        </div>

                        {/* Type */}
                        <div>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            borderRadius: theme.borderRadius.md,
                            background: `${presentationType?.color}15`,
                            color: presentationType?.color,
                            fontSize: theme.typography.fontSize.xs,
                            fontWeight: theme.typography.fontWeight.medium
                          }}>
                            {presentationType?.shortLabel}
                          </span>
                        </div>

                        {/* Track */}
                        <div>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            borderRadius: theme.borderRadius.full,
                            background: `${track?.color}15`,
                            color: track?.color,
                            fontSize: theme.typography.fontSize.xs,
                            fontWeight: theme.typography.fontWeight.medium
                          }}>
                            {track?.label.split(' ')[0]}
                          </span>
                        </div>

                        {/* Status */}
                        <div>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: theme.borderRadius.full,
                            background: status?.bg,
                            color: status?.color,
                            fontSize: theme.typography.fontSize.xs,
                            fontWeight: theme.typography.fontWeight.medium
                          }}>
                            {status?.label}
                          </span>
                        </div>

                        {/* Score */}
                        <div>
                          {abstract.averageScore ? (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <Star size={14} strokeWidth={1.5} fill="#FBBF24" color="#FBBF24" />
                              <span style={{
                                fontSize: theme.typography.fontSize.sm,
                                fontWeight: theme.typography.fontWeight.medium,
                                color: theme.colors.text.primary
                              }}>
                                {abstract.averageScore.toFixed(1)}
                              </span>
                              <span style={{
                                fontSize: theme.typography.fontSize.xs,
                                color: theme.colors.text.tertiary
                              }}>
                                / 5
                              </span>
                            </div>
                          ) : (
                            <span style={{
                              fontSize: theme.typography.fontSize.xs,
                              color: theme.colors.text.tertiary
                            }}>
                              —
                            </span>
                          )}
                        </div>

                        {/* Arrow */}
                        <div style={{ textAlign: 'right' }}>
                          <ChevronRight size={18} strokeWidth={1.5} color={theme.colors.text.tertiary} />
                        </div>
                      </motion.div>
                    );
                  })}

                {/* Empty State */}
                {abstracts.filter(abstract => {
                  const matchesStatus = abstractStatusFilter === 'all'
                    || (abstractStatusFilter === 'unregistered'
                        ? (abstract.status === 'accepted' || abstract.status === 'scheduled') && abstract.authors.some(author => author.isPresenting && !author.registered)
                        : abstract.status === abstractStatusFilter);
                  const matchesTrack = abstractTrackFilter === 'all' || abstract.track === abstractTrackFilter;
                  const matchesSearch = !abstractSearchQuery ||
                    abstract.title.toLowerCase().includes(abstractSearchQuery.toLowerCase()) ||
                    abstract.authors.some(a => a.name.toLowerCase().includes(abstractSearchQuery.toLowerCase()));
                  return matchesStatus && matchesTrack && matchesSearch;
                }).length === 0 && (
                  <div style={{
                    padding: '48px 20px',
                    textAlign: 'center',
                    color: theme.colors.text.tertiary
                  }}>
                    <ScrollText size={32} strokeWidth={1} style={{ marginBottom: '12px', opacity: 0.5 }} />
                    <div style={{ fontSize: theme.typography.fontSize.sm, marginBottom: '4px' }}>
                      No abstracts found
                    </div>
                    <div style={{ fontSize: theme.typography.fontSize.xs }}>
                      Try adjusting your filters
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Abstract Detail Slide-out - No backdrop, allows interaction with list */}
            <AnimatePresence>
              {abstractDetailOpen && selectedAbstract && (
                  <motion.div
                    key={selectedAbstract.id}
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    style={{
                      position: 'fixed',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: '560px',
                      background: 'white',
                      boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
                      borderLeft: `1px solid ${theme.colors.neutral[200]}`,
                      zIndex: 1000,
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Panel Header */}
                    <div style={{
                      padding: '20px 24px',
                      borderBottom: `1px solid ${theme.colors.neutral[100]}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: theme.borderRadius.md,
                          background: theme.colors.neutral[100],
                          fontSize: theme.typography.fontSize.xs,
                          fontWeight: theme.typography.fontWeight.medium,
                          color: theme.colors.text.secondary
                        }}>
                          {selectedAbstract.id}
                        </span>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: theme.borderRadius.full,
                          background: ABSTRACT_STATUSES[selectedAbstract.status]?.bg,
                          color: ABSTRACT_STATUSES[selectedAbstract.status]?.color,
                          fontSize: theme.typography.fontSize.xs,
                          fontWeight: theme.typography.fontWeight.medium
                        }}>
                          {ABSTRACT_STATUSES[selectedAbstract.status]?.label}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ background: theme.colors.neutral[100] }}
                        onClick={() => setAbstractDetailOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          border: 'none',
                          background: 'transparent',
                          borderRadius: theme.borderRadius.md,
                          cursor: 'pointer'
                        }}
                      >
                        <X size={18} strokeWidth={1.5} color={theme.colors.text.secondary} />
                      </motion.button>
                    </div>

                    {/* Panel Content */}
                    <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
                      {/* Title */}
                      <h3 style={{
                        fontSize: theme.typography.fontSize.lg,
                        fontWeight: theme.typography.fontWeight.semibold,
                        color: theme.colors.text.primary,
                        margin: 0,
                        marginBottom: '16px',
                        lineHeight: 1.4
                      }}>
                        {selectedAbstract.title}
                      </h3>

                      {/* Authors */}
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{
                          fontSize: theme.typography.fontSize.xs,
                          fontWeight: theme.typography.fontWeight.medium,
                          color: theme.colors.text.tertiary,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '8px'
                        }}>
                          Authors
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {selectedAbstract.authors.map((author, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: theme.colors.primary[100],
                                color: theme.colors.primary[700],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: theme.typography.fontSize.xs,
                                fontWeight: theme.typography.fontWeight.medium
                              }}>
                                {author.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div style={{
                                  fontSize: theme.typography.fontSize.sm,
                                  fontWeight: theme.typography.fontWeight.medium,
                                  color: theme.colors.text.primary,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  flexWrap: 'wrap'
                                }}>
                                  {author.name}
                                  {author.isPresenting && (
                                    <span style={{
                                      padding: '2px 6px',
                                      borderRadius: theme.borderRadius.sm,
                                      background: theme.colors.primary[50],
                                      color: theme.colors.primary[600],
                                      fontSize: '10px',
                                      fontWeight: theme.typography.fontWeight.medium
                                    }}>
                                      Presenting
                                    </span>
                                  )}
                                  {author.isPresenting && author.registered === false && (
                                    <span style={{
                                      padding: '2px 6px',
                                      borderRadius: theme.borderRadius.sm,
                                      background: '#FEE2E2',
                                      color: '#DC2626',
                                      fontSize: '10px',
                                      fontWeight: theme.typography.fontWeight.medium
                                    }}>
                                      Not Registered
                                    </span>
                                  )}
                                  {author.isPresenting && author.registered === true && (
                                    <span style={{
                                      padding: '2px 6px',
                                      borderRadius: theme.borderRadius.sm,
                                      background: '#D1FAE5',
                                      color: '#059669',
                                      fontSize: '10px',
                                      fontWeight: theme.typography.fontWeight.medium
                                    }}>
                                      Registered
                                    </span>
                                  )}
                                </div>
                                <div style={{
                                  fontSize: theme.typography.fontSize.xs,
                                  color: theme.colors.text.tertiary
                                }}>
                                  {author.affiliation}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Track & Type */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div>
                          <div style={{
                            fontSize: theme.typography.fontSize.xs,
                            fontWeight: theme.typography.fontWeight.medium,
                            color: theme.colors.text.tertiary,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '6px'
                          }}>
                            Track
                          </div>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: theme.borderRadius.md,
                            background: `${ABSTRACT_TRACKS.find(t => t.id === selectedAbstract.track)?.color}15`,
                            color: ABSTRACT_TRACKS.find(t => t.id === selectedAbstract.track)?.color,
                            fontSize: theme.typography.fontSize.sm,
                            fontWeight: theme.typography.fontWeight.medium
                          }}>
                            <Tag size={14} strokeWidth={2} />
                            {ABSTRACT_TRACKS.find(t => t.id === selectedAbstract.track)?.label}
                          </span>
                        </div>
                        <div>
                          <div style={{
                            fontSize: theme.typography.fontSize.xs,
                            fontWeight: theme.typography.fontWeight.medium,
                            color: theme.colors.text.tertiary,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '6px'
                          }}>
                            Presentation Type
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              borderRadius: theme.borderRadius.md,
                              background: `${PRESENTATION_TYPES[selectedAbstract.presentationType]?.color}15`,
                              color: PRESENTATION_TYPES[selectedAbstract.presentationType]?.color,
                              fontSize: theme.typography.fontSize.sm,
                              fontWeight: theme.typography.fontWeight.medium,
                              width: 'fit-content'
                            }}>
                              {PRESENTATION_TYPES[selectedAbstract.presentationType]?.label}
                            </span>
                            <span style={{
                              fontSize: theme.typography.fontSize.xs,
                              color: theme.colors.text.tertiary
                            }}>
                              {PRESENTATION_TYPES[selectedAbstract.presentationType]?.duration} • {PRESENTATION_TYPES[selectedAbstract.presentationType]?.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Abstract Content */}
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{
                          fontSize: theme.typography.fontSize.xs,
                          fontWeight: theme.typography.fontWeight.medium,
                          color: theme.colors.text.tertiary,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '8px'
                        }}>
                          Abstract
                        </div>
                        <p style={{
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.text.secondary,
                          lineHeight: 1.7,
                          margin: 0
                        }}>
                          {selectedAbstract.abstract}
                        </p>
                      </div>

                      {/* Keywords */}
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{
                          fontSize: theme.typography.fontSize.xs,
                          fontWeight: theme.typography.fontWeight.medium,
                          color: theme.colors.text.tertiary,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '8px'
                        }}>
                          Keywords
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {selectedAbstract.keywords.map((keyword, i) => (
                            <span key={i} style={{
                              padding: '4px 10px',
                              borderRadius: theme.borderRadius.full,
                              background: theme.colors.neutral[100],
                              fontSize: theme.typography.fontSize.xs,
                              color: theme.colors.text.secondary
                            }}>
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Attachments */}
                      {selectedAbstract.attachments?.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                          <div style={{
                            fontSize: theme.typography.fontSize.xs,
                            fontWeight: theme.typography.fontWeight.medium,
                            color: theme.colors.text.tertiary,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '8px'
                          }}>
                            Attachments
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {selectedAbstract.attachments.map((file, i) => (
                              <motion.div
                                key={i}
                                whileHover={{ background: theme.colors.neutral[50] }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '10px 12px',
                                  borderRadius: theme.borderRadius.md,
                                  border: `1px solid ${theme.colors.neutral[200]}`,
                                  cursor: 'pointer'
                                }}
                              >
                                <Paperclip size={16} strokeWidth={1.5} color={theme.colors.text.tertiary} />
                                <span style={{ flex: 1, fontSize: theme.typography.fontSize.sm, color: theme.colors.text.primary }}>
                                  {file.name}
                                </span>
                                <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.tertiary }}>
                                  {file.size}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reviews Section */}
                      {selectedAbstract.reviews?.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                          <div style={{
                            fontSize: theme.typography.fontSize.xs,
                            fontWeight: theme.typography.fontWeight.medium,
                            color: theme.colors.text.tertiary,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '12px'
                          }}>
                            Reviews ({selectedAbstract.reviews.length})
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {selectedAbstract.reviews.map((review, i) => (
                              <div key={i} style={{
                                padding: '16px',
                                borderRadius: theme.borderRadius.lg,
                                background: theme.colors.neutral[50],
                                border: `1px solid ${theme.colors.neutral[100]}`
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                      width: '28px',
                                      height: '28px',
                                      borderRadius: '50%',
                                      background: theme.colors.primary[100],
                                      color: theme.colors.primary[700],
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '10px',
                                      fontWeight: theme.typography.fontWeight.medium
                                    }}>
                                      {review.reviewer.avatar}
                                    </div>
                                    <div>
                                      <div style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.medium, color: theme.colors.text.primary }}>
                                        {review.reviewer.name}
                                      </div>
                                      <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.tertiary }}>
                                        {review.reviewer.specialty}
                                      </div>
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Star size={14} fill="#FBBF24" color="#FBBF24" />
                                    <span style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold }}>
                                      {review.score}
                                    </span>
                                  </div>
                                </div>
                                <p style={{
                                  fontSize: theme.typography.fontSize.sm,
                                  color: theme.colors.text.secondary,
                                  lineHeight: 1.6,
                                  margin: 0
                                }}>
                                  "{review.comments}"
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Session Assignment */}
                      {selectedAbstract.session && (
                        <div style={{
                          padding: '16px',
                          borderRadius: theme.borderRadius.lg,
                          background: theme.colors.primary[50],
                          border: `1px solid ${theme.colors.primary[100]}`
                        }}>
                          <div style={{
                            fontSize: theme.typography.fontSize.xs,
                            fontWeight: theme.typography.fontWeight.medium,
                            color: theme.colors.primary[600],
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '8px'
                          }}>
                            Scheduled Session
                          </div>
                          <div style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.medium, color: theme.colors.text.primary, marginBottom: '4px' }}>
                            {selectedAbstract.session.name}
                          </div>
                          <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary }}>
                            {selectedAbstract.session.time} • {selectedAbstract.session.room}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Panel Footer - Actions */}
                    <div style={{
                      padding: '16px 24px',
                      borderTop: `1px solid ${theme.colors.neutral[100]}`,
                      display: 'flex',
                      gap: '8px'
                    }}>
                      {selectedAbstract.status === 'submitted' && (
                        <>
                          <motion.button
                            whileHover={{ background: theme.colors.primary[600] }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setAbstracts(prev => prev.map(a =>
                                a.id === selectedAbstract.id ? { ...a, status: 'under-review' } : a
                              ));
                              setSelectedAbstract(prev => ({ ...prev, status: 'under-review' }));
                            }}
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '10px 16px',
                              border: 'none',
                              background: theme.colors.primary[500],
                              borderRadius: theme.borderRadius.md,
                              fontSize: theme.typography.fontSize.sm,
                              fontWeight: theme.typography.fontWeight.medium,
                              color: 'white',
                              cursor: 'pointer'
                            }}
                          >
                            <Send size={16} strokeWidth={1.5} />
                            Send for Review
                          </motion.button>
                        </>
                      )}
                      {selectedAbstract.status === 'under-review' && (
                        <>
                          <motion.button
                            whileHover={{ background: '#059669' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setAbstracts(prev => prev.map(a =>
                                a.id === selectedAbstract.id ? { ...a, status: 'accepted' } : a
                              ));
                              setSelectedAbstract(prev => ({ ...prev, status: 'accepted' }));
                            }}
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '10px 16px',
                              border: 'none',
                              background: '#10B981',
                              borderRadius: theme.borderRadius.md,
                              fontSize: theme.typography.fontSize.sm,
                              fontWeight: theme.typography.fontWeight.medium,
                              color: 'white',
                              cursor: 'pointer'
                            }}
                          >
                            <CheckCircle size={16} strokeWidth={1.5} />
                            Accept
                          </motion.button>
                          <motion.button
                            whileHover={{ background: '#DC2626' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setAbstracts(prev => prev.map(a =>
                                a.id === selectedAbstract.id ? { ...a, status: 'revision-required' } : a
                              ));
                              setSelectedAbstract(prev => ({ ...prev, status: 'revision-required' }));
                            }}
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '10px 16px',
                              border: 'none',
                              background: '#EF4444',
                              borderRadius: theme.borderRadius.md,
                              fontSize: theme.typography.fontSize.sm,
                              fontWeight: theme.typography.fontWeight.medium,
                              color: 'white',
                              cursor: 'pointer'
                            }}
                          >
                            <RotateCcw size={16} strokeWidth={1.5} />
                            Request Revision
                          </motion.button>
                        </>
                      )}
                      {selectedAbstract.status === 'accepted' && (
                        <motion.button
                          whileHover={{ background: '#7C3AED' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setAbstracts(prev => prev.map(a =>
                              a.id === selectedAbstract.id ? { ...a, status: 'scheduled' } : a
                            ));
                            setSelectedAbstract(prev => ({ ...prev, status: 'scheduled' }));
                          }}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '10px 16px',
                            border: 'none',
                            background: '#8B5CF6',
                            borderRadius: theme.borderRadius.md,
                            fontSize: theme.typography.fontSize.sm,
                            fontWeight: theme.typography.fontWeight.medium,
                            color: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          <Calendar size={16} strokeWidth={1.5} />
                          Schedule Session
                        </motion.button>
                      )}
                      {selectedAbstract.status === 'revision-required' && (
                        <motion.button
                          whileHover={{ background: theme.colors.primary[600] }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setAbstracts(prev => prev.map(a =>
                              a.id === selectedAbstract.id ? { ...a, status: 'under-review' } : a
                            ));
                            setSelectedAbstract(prev => ({ ...prev, status: 'under-review' }));
                          }}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '10px 16px',
                            border: 'none',
                            background: theme.colors.primary[500],
                            borderRadius: theme.borderRadius.md,
                            fontSize: theme.typography.fontSize.sm,
                            fontWeight: theme.typography.fontWeight.medium,
                            color: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          <Send size={16} strokeWidth={1.5} />
                          Re-submit for Review
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ background: theme.colors.neutral[100] }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '10px 16px',
                          border: `1px solid ${theme.colors.neutral[200]}`,
                          background: 'white',
                          borderRadius: theme.borderRadius.md,
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.text.secondary,
                          cursor: 'pointer'
                        }}
                      >
                        <Mail size={16} strokeWidth={1.5} />
                        Email Author
                      </motion.button>
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>

            {/* Dynamic Island-inspired Selection Bar */}
            <AnimatePresence>
              {selectedAbstractIds.size > 0 && !reviewMode && (
                <motion.div
                  initial={{ y: 100, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 100, opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  style={{
                    position: 'fixed',
                    bottom: '32px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1100,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '12px 20px',
                    background: 'rgba(18, 25, 51, 0.95)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '40px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset',
                    color: 'white'
                  }}
                >
                  {/* Selection Count */}
                  <motion.div
                    key={selectedAbstractIds.size}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      paddingRight: '16px',
                      borderRight: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: theme.colors.primary[500],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.semibold
                    }}>
                      {selectedAbstractIds.size}
                    </div>
                    <span style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.medium }}>
                      {selectedAbstractIds.size === 1 ? 'abstract' : 'abstracts'} selected
                    </span>
                  </motion.div>

                  {/* Review Button */}
                  <motion.button
                    whileHover={{ scale: 1.02, background: theme.colors.primary[400] }}
                    whileTap={{ scale: 0.98 }}
                    onClick={enterReviewMode}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      background: theme.colors.primary[500],
                      border: 'none',
                      borderRadius: '24px',
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <FileCheck size={18} strokeWidth={2} />
                    Review
                  </motion.button>

                  {/* More Actions */}
                  <motion.button
                    whileHover={{ background: 'rgba(255,255,255,0.15)' }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      color: 'white'
                    }}
                  >
                    <MoreHorizontal size={18} strokeWidth={2} />
                  </motion.button>

                  {/* Clear Selection */}
                  <motion.button
                    whileHover={{ background: 'rgba(255,255,255,0.15)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearSelection}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      color: 'rgba(255,255,255,0.7)'
                    }}
                  >
                    <X size={18} strokeWidth={2} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Review Mode Full-Screen Layout */}
        <AnimatePresence>
          {reviewMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: theme.colors.neutral[50],
                zIndex: 2000,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Review Mode Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                background: 'white',
                borderBottom: `1px solid ${theme.colors.neutral[200]}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <motion.button
                    whileHover={{ background: theme.colors.neutral[100] }}
                    whileTap={{ scale: 0.95 }}
                    onClick={exitReviewMode}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      background: 'transparent',
                      border: `1px solid ${theme.colors.neutral[200]}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.text.secondary,
                      cursor: 'pointer'
                    }}
                  >
                    <ArrowLeft size={16} strokeWidth={2} />
                    Exit Review
                  </motion.button>
                  <div>
                    <h2 style={{
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.text.primary,
                      margin: 0
                    }}>
                      Abstract Review
                    </h2>
                    <p style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.text.tertiary,
                      margin: 0
                    }}>
                      Reviewing {selectedAbstractIds.size} {selectedAbstractIds.size === 1 ? 'submission' : 'submissions'}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    padding: '6px 12px',
                    background: activeReviewAbstract ? ABSTRACT_STATUSES[activeReviewAbstract.status]?.bg : theme.colors.neutral[100],
                    color: activeReviewAbstract ? ABSTRACT_STATUSES[activeReviewAbstract.status]?.color : theme.colors.text.secondary,
                    borderRadius: theme.borderRadius.full,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium
                  }}>
                    {activeReviewAbstract ? ABSTRACT_STATUSES[activeReviewAbstract.status]?.label : 'Unknown'}
                  </span>
                </div>
              </div>

              {/* 3-Pane Layout */}
              <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: '280px 1fr 400px',
                minHeight: 0,
                overflow: 'hidden'
              }}>
                {/* Left Pane - Author Info */}
                <div style={{
                  background: 'white',
                  borderRight: `1px solid ${theme.colors.neutral[200]}`,
                  overflow: 'auto',
                  padding: '24px'
                }}>
                  {activeReviewAbstract && (
                    <>
                      <h3 style={{
                        fontSize: theme.typography.fontSize.xs,
                        fontWeight: theme.typography.fontWeight.semibold,
                        color: theme.colors.text.tertiary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '16px'
                      }}>
                        Authors & Contact
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {activeReviewAbstract.authors.map((author, i) => (
                          <div key={i} style={{
                            padding: '16px',
                            background: author.isPresenting ? theme.colors.primary[50] : theme.colors.neutral[50],
                            borderRadius: theme.borderRadius.lg,
                            border: author.isPresenting ? `1px solid ${theme.colors.primary[200]}` : `1px solid ${theme.colors.neutral[200]}`
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: author.isPresenting ? theme.colors.primary[500] : theme.colors.neutral[300],
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: theme.typography.fontSize.sm,
                                fontWeight: theme.typography.fontWeight.semibold
                              }}>
                                {author.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{
                                  fontSize: theme.typography.fontSize.sm,
                                  fontWeight: theme.typography.fontWeight.semibold,
                                  color: theme.colors.text.primary,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}>
                                  {author.name}
                                  {author.isPresenting && (
                                    <span style={{
                                      padding: '2px 6px',
                                      background: theme.colors.primary[500],
                                      color: 'white',
                                      borderRadius: theme.borderRadius.sm,
                                      fontSize: '9px',
                                      fontWeight: theme.typography.fontWeight.semibold,
                                      textTransform: 'uppercase'
                                    }}>
                                      Presenter
                                    </span>
                                  )}
                                </div>
                                <div style={{
                                  fontSize: theme.typography.fontSize.xs,
                                  color: theme.colors.text.tertiary
                                }}>
                                  {author.affiliation}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <GraduationCap size={14} strokeWidth={1.5} color={theme.colors.text.tertiary} />
                                <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary }}>
                                  {author.isPresenting ? 'Full Member' : 'Student Member'}
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AtSign size={14} strokeWidth={1.5} color={theme.colors.text.tertiary} />
                                <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.primary[600] }}>
                                  {author.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 8)}@{author.affiliation.toLowerCase().includes('university') ? 'university.edu' : 'organization.ca'}
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Phone size={14} strokeWidth={1.5} color={theme.colors.text.tertiary} />
                                <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary }}>
                                  +1 (416) 555-{String(1000 + i * 111).slice(0, 4)}
                                </span>
                              </div>
                              {author.isPresenting && (
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  marginTop: '4px',
                                  padding: '6px 10px',
                                  background: author.registered ? '#D1FAE5' : '#FEE2E2',
                                  borderRadius: theme.borderRadius.md
                                }}>
                                  {author.registered ? (
                                    <>
                                      <CheckCircle size={14} strokeWidth={2} color="#059669" />
                                      <span style={{ fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.medium, color: '#059669' }}>
                                        Registered for Event
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <AlertCircle size={14} strokeWidth={2} color="#DC2626" />
                                      <span style={{ fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.medium, color: '#DC2626' }}>
                                        Not Yet Registered
                                      </span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Submission Details */}
                      <h3 style={{
                        fontSize: theme.typography.fontSize.xs,
                        fontWeight: theme.typography.fontWeight.semibold,
                        color: theme.colors.text.tertiary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginTop: '24px',
                        marginBottom: '12px'
                      }}>
                        Submission Details
                      </h3>
                      <div style={{
                        background: theme.colors.neutral[50],
                        borderRadius: theme.borderRadius.lg,
                        padding: '16px'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.tertiary }}>ID</span>
                            <span style={{ fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.medium, color: theme.colors.text.primary }}>{activeReviewAbstract.id}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.tertiary }}>Type</span>
                            <span style={{ fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.medium, color: PRESENTATION_TYPES[activeReviewAbstract.presentationType]?.color }}>
                              {PRESENTATION_TYPES[activeReviewAbstract.presentationType]?.shortLabel}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.tertiary }}>Track</span>
                            <span style={{ fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.medium, color: ABSTRACT_TRACKS.find(t => t.id === activeReviewAbstract.track)?.color }}>
                              {ABSTRACT_TRACKS.find(t => t.id === activeReviewAbstract.track)?.label.split(' ')[0]}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.tertiary }}>Submitted</span>
                            <span style={{ fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.medium, color: theme.colors.text.primary }}>
                              {new Date(activeReviewAbstract.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Center Pane - Canvas Viewport */}
                <div style={{
                  background: theme.colors.neutral[100],
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Canvas Toolbar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    background: 'white',
                    borderBottom: `1px solid ${theme.colors.neutral[200]}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.medium, color: theme.colors.text.primary }}>
                        Submission Preview
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <motion.button
                        whileHover={{ background: theme.colors.neutral[100] }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCanvasZoom(z => Math.max(50, z - 25))}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          background: 'transparent',
                          border: `1px solid ${theme.colors.neutral[200]}`,
                          borderRadius: theme.borderRadius.md,
                          cursor: 'pointer'
                        }}
                      >
                        <ZoomOut size={16} strokeWidth={1.5} color={theme.colors.text.secondary} />
                      </motion.button>
                      <span style={{
                        padding: '6px 12px',
                        background: theme.colors.neutral[100],
                        borderRadius: theme.borderRadius.md,
                        fontSize: theme.typography.fontSize.xs,
                        fontWeight: theme.typography.fontWeight.medium,
                        color: theme.colors.text.secondary,
                        minWidth: '50px',
                        textAlign: 'center'
                      }}>
                        {canvasZoom}%
                      </span>
                      <motion.button
                        whileHover={{ background: theme.colors.neutral[100] }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCanvasZoom(z => Math.min(200, z + 25))}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          background: 'transparent',
                          border: `1px solid ${theme.colors.neutral[200]}`,
                          borderRadius: theme.borderRadius.md,
                          cursor: 'pointer'
                        }}
                      >
                        <ZoomIn size={16} strokeWidth={1.5} color={theme.colors.text.secondary} />
                      </motion.button>
                      <motion.button
                        whileHover={{ background: theme.colors.neutral[100] }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCanvasZoom(100)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          background: 'transparent',
                          border: `1px solid ${theme.colors.neutral[200]}`,
                          borderRadius: theme.borderRadius.md,
                          cursor: 'pointer'
                        }}
                      >
                        <RotateCw size={16} strokeWidth={1.5} color={theme.colors.text.secondary} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Canvas Content */}
                  <div style={{
                    flex: 1,
                    overflow: 'auto',
                    padding: '32px',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    {activeReviewAbstract && (
                      <motion.div
                        animate={{ scale: canvasZoom / 100 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                        style={{
                          width: '700px',
                          background: 'white',
                          borderRadius: theme.borderRadius.xl,
                          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                          padding: '48px',
                          transformOrigin: 'top center'
                        }}
                      >
                        {/* Abstract Document */}
                        <div style={{ textAlign: 'center', marginBottom: '32px', paddingBottom: '24px', borderBottom: `1px solid ${theme.colors.neutral[200]}` }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '6px 16px',
                            background: `${PRESENTATION_TYPES[activeReviewAbstract.presentationType]?.color}15`,
                            color: PRESENTATION_TYPES[activeReviewAbstract.presentationType]?.color,
                            borderRadius: theme.borderRadius.full,
                            fontSize: theme.typography.fontSize.sm,
                            fontWeight: theme.typography.fontWeight.semibold,
                            marginBottom: '16px'
                          }}>
                            {PRESENTATION_TYPES[activeReviewAbstract.presentationType]?.label}
                          </span>
                          <h1 style={{
                            fontSize: '24px',
                            fontWeight: theme.typography.fontWeight.bold,
                            color: theme.colors.text.primary,
                            lineHeight: 1.3,
                            margin: 0,
                            marginBottom: '16px'
                          }}>
                            {activeReviewAbstract.title}
                          </h1>
                          <div style={{
                            fontSize: theme.typography.fontSize.base,
                            color: theme.colors.text.secondary,
                            marginBottom: '8px'
                          }}>
                            {activeReviewAbstract.authors.map((a, i) => (
                              <span key={i}>
                                {a.name}
                                {a.isPresenting && <sup style={{ color: theme.colors.primary[500] }}>*</sup>}
                                {i < activeReviewAbstract.authors.length - 1 && ', '}
                              </span>
                            ))}
                          </div>
                          <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.tertiary, fontStyle: 'italic' }}>
                            {[...new Set(activeReviewAbstract.authors.map(a => a.affiliation))].join('; ')}
                          </div>
                        </div>

                        {/* Abstract Body */}
                        <div style={{ marginBottom: '24px' }}>
                          <h2 style={{
                            fontSize: theme.typography.fontSize.sm,
                            fontWeight: theme.typography.fontWeight.bold,
                            color: theme.colors.text.primary,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '12px'
                          }}>
                            Abstract
                          </h2>
                          <p style={{
                            fontSize: theme.typography.fontSize.base,
                            color: theme.colors.text.secondary,
                            lineHeight: 1.8,
                            textAlign: 'justify',
                            margin: 0
                          }}>
                            {activeReviewAbstract.abstract}
                          </p>
                        </div>

                        {/* Keywords */}
                        <div>
                          <h2 style={{
                            fontSize: theme.typography.fontSize.sm,
                            fontWeight: theme.typography.fontWeight.bold,
                            color: theme.colors.text.primary,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '12px'
                          }}>
                            Keywords
                          </h2>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {activeReviewAbstract.keywords.map((keyword, i) => (
                              <span key={i} style={{
                                padding: '6px 14px',
                                background: theme.colors.neutral[100],
                                borderRadius: theme.borderRadius.full,
                                fontSize: theme.typography.fontSize.sm,
                                color: theme.colors.text.secondary
                              }}>
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Attachments */}
                        {activeReviewAbstract.attachments?.length > 0 && (
                          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${theme.colors.neutral[200]}` }}>
                            <h2 style={{
                              fontSize: theme.typography.fontSize.sm,
                              fontWeight: theme.typography.fontWeight.bold,
                              color: theme.colors.text.primary,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              marginBottom: '12px'
                            }}>
                              Attachments
                            </h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {activeReviewAbstract.attachments.map((file, i) => {
                                const isPdf = file.name.toLowerCase().endsWith('.pdf');
                                return (
                                  <motion.div
                                    key={i}
                                    whileHover={{ background: theme.colors.neutral[100] }}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      padding: '10px 14px',
                                      border: `1px solid ${theme.colors.neutral[200]}`,
                                      borderRadius: theme.borderRadius.md,
                                      background: 'white'
                                    }}
                                  >
                                    <Paperclip size={14} strokeWidth={1.5} color={theme.colors.text.tertiary} />
                                    <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.primary }}>{file.name}</span>
                                    <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.tertiary }}>{file.size}</span>
                                    {isPdf && (
                                      <motion.button
                                        whileHover={{ background: theme.colors.primary[600] }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openPdfViewer(file);
                                        }}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          padding: '4px 10px',
                                          background: theme.colors.primary[500],
                                          border: 'none',
                                          borderRadius: theme.borderRadius.md,
                                          fontSize: theme.typography.fontSize.xs,
                                          fontWeight: theme.typography.fontWeight.medium,
                                          color: 'white',
                                          cursor: 'pointer',
                                          marginLeft: '4px'
                                        }}
                                      >
                                        <Eye size={12} strokeWidth={2} />
                                        View
                                      </motion.button>
                                    )}
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Right Pane - Evaluation Form */}
                <div style={{
                  background: 'white',
                  borderLeft: `1px solid ${theme.colors.neutral[200]}`,
                  overflow: 'auto',
                  padding: '24px'
                }}>
                  <h3 style={{
                    fontSize: theme.typography.fontSize.xs,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text.tertiary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '20px'
                  }}>
                    Evaluation Form
                  </h3>

                  {/* Score Summary */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: theme.colors.primary[50],
                    borderRadius: theme.borderRadius.lg,
                    marginBottom: '24px'
                  }}>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end' }}>
                      <div>
                        <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.tertiary, marginBottom: '4px' }}>
                          Running Total
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                          <span style={{ fontSize: '32px', fontWeight: theme.typography.fontWeight.bold, color: theme.colors.primary[600] }}>
                            {totalScore}
                          </span>
                          <span style={{ fontSize: theme.typography.fontSize.base, color: theme.colors.text.tertiary }}>
                            / {maxPossibleScore}
                          </span>
                        </div>
                      </div>
                      <div style={{ paddingBottom: '4px' }}>
                        <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.tertiary, marginBottom: '4px' }}>
                          Avg Score
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                          <span style={{ fontSize: '24px', fontWeight: theme.typography.fontWeight.bold, color: theme.colors.primary[600] }}>
                            {averageScore.toFixed(1)}
                          </span>
                          <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.tertiary }}>
                            / 5
                          </span>
                          {criteriaRatedCount > 0 && (
                            <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.tertiary, marginLeft: '4px' }}>
                              ({criteriaRatedCount}/{EVALUATION_CRITERIA.length})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: `conic-gradient(${theme.colors.primary[500]} ${(totalScore / maxPossibleScore) * 360}deg, ${theme.colors.neutral[200]} 0deg)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.bold,
                        color: theme.colors.primary[600]
                      }}>
                        {maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0}%
                      </div>
                    </div>
                  </div>

                  {/* Criteria Ratings */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    {EVALUATION_CRITERIA.map((criterion) => (
                      <div key={criterion.id} style={{
                        padding: '12px',
                        background: theme.colors.neutral[50],
                        borderRadius: theme.borderRadius.lg
                      }}>
                        <div style={{
                          fontSize: theme.typography.fontSize.sm,
                          fontWeight: theme.typography.fontWeight.medium,
                          color: theme.colors.text.primary,
                          marginBottom: '4px'
                        }}>
                          {criterion.label}
                        </div>
                        <div style={{
                          fontSize: theme.typography.fontSize.xs,
                          color: theme.colors.text.tertiary,
                          marginBottom: '10px'
                        }}>
                          {criterion.description}
                        </div>
                        {/* Likert Scale */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '10px', color: theme.colors.text.tertiary, width: '32px' }}>Poor</span>
                          <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
                            {[1, 2, 3, 4, 5].map((score) => (
                              <motion.button
                                key={score}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setEvaluationScores(prev => ({ ...prev, [criterion.id]: score }))}
                                style={{
                                  flex: 1,
                                  height: '32px',
                                  border: 'none',
                                  borderRadius: theme.borderRadius.md,
                                  background: evaluationScores[criterion.id] === score
                                    ? theme.colors.primary[500]
                                    : evaluationScores[criterion.id] > score
                                      ? theme.colors.primary[100]
                                      : 'white',
                                  color: evaluationScores[criterion.id] === score ? 'white' : theme.colors.text.secondary,
                                  fontSize: theme.typography.fontSize.sm,
                                  fontWeight: theme.typography.fontWeight.medium,
                                  cursor: 'pointer',
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}
                              >
                                {score}
                              </motion.button>
                            ))}
                          </div>
                          <span style={{ fontSize: '10px', color: theme.colors.text.tertiary, width: '50px', textAlign: 'right' }}>Excellent</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Comments */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.primary,
                      display: 'block',
                      marginBottom: '8px'
                    }}>
                      Comments for Authors
                    </label>
                    <textarea
                      value={evaluationComments}
                      onChange={(e) => setEvaluationComments(e.target.value)}
                      placeholder="Provide constructive feedback for the authors..."
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '12px',
                        border: `1px solid ${theme.colors.neutral[200]}`,
                        borderRadius: theme.borderRadius.md,
                        fontSize: theme.typography.fontSize.sm,
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Rejection Reasons */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.primary,
                      display: 'block',
                      marginBottom: '4px'
                    }}>
                      Possible Reasons for NOT Accepting
                    </label>
                    <p style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.text.tertiary,
                      margin: 0,
                      marginBottom: '12px'
                    }}>
                      Select if applicable
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {REJECTION_REASONS.map((reason) => (
                        <label
                          key={reason.id}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            padding: '10px 12px',
                            background: selectedRejectionReason === reason.id ? '#FEE2E2' : theme.colors.neutral[50],
                            borderRadius: theme.borderRadius.md,
                            cursor: 'pointer',
                            border: selectedRejectionReason === reason.id ? '1px solid #FECACA' : '1px solid transparent'
                          }}
                        >
                          <input
                            type="radio"
                            name="rejectionReason"
                            checked={selectedRejectionReason === reason.id}
                            onChange={() => setSelectedRejectionReason(prev => prev === reason.id ? null : reason.id)}
                            style={{ marginTop: '2px' }}
                          />
                          <span style={{
                            fontSize: theme.typography.fontSize.sm,
                            color: selectedRejectionReason === reason.id ? '#DC2626' : theme.colors.text.secondary,
                            lineHeight: 1.4
                          }}>
                            {reason.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <motion.button
                      whileHover={{ background: '#059669' }}
                      whileTap={{ scale: 0.98 }}
                      disabled={Object.keys(evaluationScores).length < EVALUATION_CRITERIA.length}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '12px 16px',
                        background: Object.keys(evaluationScores).length < EVALUATION_CRITERIA.length ? theme.colors.neutral[300] : '#10B981',
                        border: 'none',
                        borderRadius: theme.borderRadius.md,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.medium,
                        color: 'white',
                        cursor: Object.keys(evaluationScores).length < EVALUATION_CRITERIA.length ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <CheckCircle size={16} strokeWidth={2} />
                      Submit Review
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Data Explorer Panel */}
              <motion.div
                animate={{ height: dataExplorerExpanded ? `${dataExplorerHeight}px` : '48px' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                style={{
                  background: 'white',
                  borderTop: `1px solid ${theme.colors.neutral[200]}`,
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Resize Handle */}
                {dataExplorerExpanded && (
                  <div
                    onMouseDown={handleDataExplorerResizeStart}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '6px',
                      cursor: 'ns-resize',
                      background: isResizingDataExplorer ? theme.colors.primary[100] : 'transparent',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.neutral[200]}
                    onMouseLeave={(e) => e.currentTarget.style.background = isResizingDataExplorer ? theme.colors.primary[100] : 'transparent'}
                  >
                    <div style={{
                      width: '40px',
                      height: '4px',
                      borderRadius: '2px',
                      background: theme.colors.neutral[300]
                    }} />
                  </div>
                )}
                {/* Panel Header */}
                <div
                  onClick={() => setDataExplorerExpanded(!dataExplorerExpanded)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 24px',
                    cursor: 'pointer',
                    background: theme.colors.neutral[50],
                    borderBottom: dataExplorerExpanded ? `1px solid ${theme.colors.neutral[200]}` : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ScrollText size={18} strokeWidth={1.5} color={theme.colors.text.secondary} />
                    <span style={{
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.primary
                    }}>
                      Selected Abstracts ({selectedAbstractIds.size})
                    </span>
                  </div>
                  {dataExplorerExpanded ? (
                    <ChevronDown size={18} strokeWidth={1.5} color={theme.colors.text.tertiary} />
                  ) : (
                    <ChevronUp size={18} strokeWidth={1.5} color={theme.colors.text.tertiary} />
                  )}
                </div>

                {/* Panel Grid */}
                {dataExplorerExpanded && (
                  <div style={{ overflow: 'auto', height: 'calc(100% - 48px)' }}>
                    {/* Grid Header */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr 100px 100px 100px 100px 80px',
                      gap: '12px',
                      padding: '10px 24px',
                      background: theme.colors.neutral[50],
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.tertiary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      position: 'sticky',
                      top: 0
                    }}>
                      <div>ID</div>
                      <div>Title</div>
                      <div>Type</div>
                      <div>Track</div>
                      <div>Status</div>
                      <div>Submitted</div>
                      <div>Score</div>
                    </div>
                    {/* Grid Rows */}
                    {Array.from(selectedAbstractIds).map((id) => {
                      const abstract = abstracts.find(a => a.id === id);
                      if (!abstract) return null;
                      const isActive = activeReviewAbstractId === id;
                      return (
                        <motion.div
                          key={id}
                          onClick={() => {
                            setActiveReviewAbstractId(id);
                            setEvaluationScores({});
                            setEvaluationComments('');
                            setSelectedRejectionReason(null);
                          }}
                          whileHover={{ background: theme.colors.neutral[50] }}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '80px 1fr 100px 100px 100px 100px 80px',
                            gap: '12px',
                            padding: '12px 24px',
                            fontSize: theme.typography.fontSize.sm,
                            cursor: 'pointer',
                            background: isActive ? theme.colors.primary[50] : 'transparent',
                            borderLeft: isActive ? `3px solid ${theme.colors.primary[500]}` : '3px solid transparent'
                          }}
                        >
                          <div style={{ fontWeight: theme.typography.fontWeight.medium, color: theme.colors.text.secondary }}>
                            {abstract.id}
                          </div>
                          <div style={{
                            fontWeight: theme.typography.fontWeight.medium,
                            color: theme.colors.text.primary,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {abstract.title}
                          </div>
                          <div>
                            <span style={{
                              padding: '2px 6px',
                              borderRadius: theme.borderRadius.sm,
                              background: `${PRESENTATION_TYPES[abstract.presentationType]?.color}15`,
                              color: PRESENTATION_TYPES[abstract.presentationType]?.color,
                              fontSize: theme.typography.fontSize.xs
                            }}>
                              {PRESENTATION_TYPES[abstract.presentationType]?.shortLabel}
                            </span>
                          </div>
                          <div style={{ color: ABSTRACT_TRACKS.find(t => t.id === abstract.track)?.color }}>
                            {ABSTRACT_TRACKS.find(t => t.id === abstract.track)?.label.split(' ')[0]}
                          </div>
                          <div>
                            <span style={{
                              padding: '2px 6px',
                              borderRadius: theme.borderRadius.full,
                              background: ABSTRACT_STATUSES[abstract.status]?.bg,
                              color: ABSTRACT_STATUSES[abstract.status]?.color,
                              fontSize: theme.typography.fontSize.xs
                            }}>
                              {ABSTRACT_STATUSES[abstract.status]?.label}
                            </span>
                          </div>
                          <div style={{ color: theme.colors.text.tertiary }}>
                            {new Date(abstract.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {abstract.averageScore ? (
                              <>
                                <Star size={12} fill="#FBBF24" color="#FBBF24" />
                                <span style={{ fontWeight: theme.typography.fontWeight.medium }}>{abstract.averageScore.toFixed(1)}</span>
                              </>
                            ) : (
                              <span style={{ color: theme.colors.text.tertiary }}>—</span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              {/* PDF Viewer Floating Panel - Non-blocking, resizable, repositionable */}
              <AnimatePresence>
                {pdfViewerOpen && selectedPdf && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: pdfPanelMaximized ? 0 : pdfPanelPosition.x,
                      y: pdfPanelMaximized ? 0 : pdfPanelPosition.y,
                      width: pdfPanelMaximized ? window.innerWidth : pdfPanelSize.width,
                      height: pdfPanelMinimized ? 40 : (pdfPanelMaximized ? window.innerHeight : pdfPanelSize.height)
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      zIndex: 2500,
                      background: theme.colors.background.elevated,
                      borderRadius: pdfPanelMaximized ? 0 : theme.borderRadius.lg,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
                      border: `1px solid ${theme.colors.border.default}`,
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      userSelect: isDraggingPdfPanel || isResizingPdfPanel ? 'none' : 'auto'
                    }}
                  >
                    {/* Resize Handles */}
                    {!pdfPanelMaximized && !pdfPanelMinimized && (
                      <>
                        {['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].map((dir) => {
                          const handleStyles = {
                            n: { top: 0, left: 8, right: 8, height: 4, cursor: 'n-resize' },
                            s: { bottom: 0, left: 8, right: 8, height: 4, cursor: 's-resize' },
                            e: { right: 0, top: 8, bottom: 8, width: 4, cursor: 'e-resize' },
                            w: { left: 0, top: 8, bottom: 8, width: 4, cursor: 'w-resize' },
                            ne: { top: 0, right: 0, width: 12, height: 12, cursor: 'ne-resize' },
                            nw: { top: 0, left: 0, width: 12, height: 12, cursor: 'nw-resize' },
                            se: { bottom: 0, right: 0, width: 12, height: 12, cursor: 'se-resize' },
                            sw: { bottom: 0, left: 0, width: 12, height: 12, cursor: 'sw-resize' }
                          };
                          return (
                            <div
                              key={dir}
                              style={{ position: 'absolute', zIndex: 10, ...handleStyles[dir] }}
                              onMouseDown={(e) => handlePdfPanelResizeStart(e, dir)}
                            />
                          );
                        })}
                      </>
                    )}

                    {/* Title Bar - Draggable */}
                    <div
                      onMouseDown={handlePdfPanelDragStart}
                      onDoubleClick={handlePdfPanelMaximize}
                      style={{
                        height: '40px',
                        minHeight: '40px',
                        padding: '0 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: theme.colors.background.tertiary,
                        borderBottom: pdfPanelMinimized ? 'none' : `1px solid ${theme.colors.border.subtle}`,
                        cursor: pdfPanelMaximized ? 'default' : 'move'
                      }}
                    >
                      {/* Title */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, overflow: 'hidden' }}>
                        <FileText size={16} strokeWidth={1.5} color={theme.colors.primary[500]} />
                        <span style={{
                          fontSize: theme.typography.fontSize.sm,
                          fontWeight: theme.typography.fontWeight.medium,
                          color: theme.colors.text.primary,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {selectedPdf.name}
                        </span>
                        <span style={{
                          fontSize: theme.typography.fontSize.xs,
                          color: theme.colors.text.tertiary
                        }}>
                          {selectedPdf.size}
                        </span>
                      </div>

                      {/* Window Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        {/* Download */}
                        <motion.button
                          whileHover={{ background: theme.colors.neutral[200] }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: theme.borderRadius.sm,
                            cursor: 'pointer',
                            color: theme.colors.text.secondary
                          }}
                          title="Download"
                        >
                          <Download size={14} strokeWidth={1.5} />
                        </motion.button>
                        {/* Minimize */}
                        <motion.button
                          whileHover={{ background: theme.colors.neutral[200] }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handlePdfPanelMinimize}
                          style={{
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: theme.borderRadius.sm,
                            cursor: 'pointer',
                            color: theme.colors.text.secondary
                          }}
                          title="Minimize"
                        >
                          <Minus size={14} />
                        </motion.button>
                        {/* Maximize/Restore */}
                        <motion.button
                          whileHover={{ background: theme.colors.neutral[200] }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handlePdfPanelMaximize}
                          style={{
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: theme.borderRadius.sm,
                            cursor: 'pointer',
                            color: theme.colors.text.secondary
                          }}
                          title={pdfPanelMaximized ? "Restore" : "Maximize"}
                        >
                          {pdfPanelMaximized ? <Minus size={14} /> : <Square size={12} />}
                        </motion.button>
                        {/* Close */}
                        <motion.button
                          whileHover={{ background: theme.colors.error[500], color: '#fff' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={closePdfViewer}
                          style={{
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: theme.borderRadius.sm,
                            cursor: 'pointer',
                            color: theme.colors.text.secondary
                          }}
                          title="Close"
                        >
                          <X size={14} />
                        </motion.button>
                      </div>
                    </div>

                    {/* PDF Content Area - Hidden when minimized */}
                    {!pdfPanelMinimized && (
                      <>
                        <div style={{
                          flex: 1,
                          overflow: 'auto',
                          background: theme.colors.neutral[100],
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '24px'
                        }}>
                          {/* Simulated PDF Page */}
                          <div style={{
                            background: 'white',
                            width: '100%',
                            maxWidth: '700px',
                            minHeight: pdfPanelMaximized ? '900px' : '600px',
                            borderRadius: theme.borderRadius.lg,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            padding: pdfPanelMaximized ? '48px' : '32px',
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            {/* Mock PDF Content - Document Header */}
                            <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '20px', borderBottom: `1px solid ${theme.colors.neutral[200]}` }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                background: `${PRESENTATION_TYPES[activeReviewAbstract?.presentationType]?.color}15`,
                                color: PRESENTATION_TYPES[activeReviewAbstract?.presentationType]?.color,
                                borderRadius: theme.borderRadius.full,
                                fontSize: theme.typography.fontSize.xs,
                                fontWeight: theme.typography.fontWeight.semibold,
                                marginBottom: '12px'
                              }}>
                                {PRESENTATION_TYPES[activeReviewAbstract?.presentationType]?.label}
                              </span>
                              <h1 style={{
                                fontSize: pdfPanelMaximized ? '22px' : '18px',
                                fontWeight: theme.typography.fontWeight.bold,
                                color: theme.colors.text.primary,
                                lineHeight: 1.3,
                                margin: 0,
                                marginBottom: '12px'
                              }}>
                                {activeReviewAbstract?.title}
                              </h1>
                              <div style={{
                                fontSize: theme.typography.fontSize.sm,
                                color: theme.colors.text.secondary,
                                marginBottom: '6px'
                              }}>
                                {activeReviewAbstract?.authors.map((a, i) => (
                                  <span key={i}>
                                    {a.name}
                                    {a.isPresenting && <sup style={{ color: theme.colors.primary[500] }}>*</sup>}
                                    {i < activeReviewAbstract.authors.length - 1 && ', '}
                                  </span>
                                ))}
                              </div>
                              <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.tertiary, fontStyle: 'italic' }}>
                                {[...new Set(activeReviewAbstract?.authors.map(a => a.affiliation) || [])].join('; ')}
                              </div>
                            </div>

                            {/* Abstract Section */}
                            <div style={{ marginBottom: '20px' }}>
                              <h2 style={{
                                fontSize: theme.typography.fontSize.xs,
                                fontWeight: theme.typography.fontWeight.bold,
                                color: theme.colors.text.primary,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '10px'
                              }}>
                                Abstract
                              </h2>
                              <p style={{
                                fontSize: theme.typography.fontSize.sm,
                                color: theme.colors.text.secondary,
                                lineHeight: 1.7,
                                textAlign: 'justify',
                                margin: 0
                              }}>
                                {activeReviewAbstract?.abstract}
                              </p>
                            </div>

                            {/* Keywords Section */}
                            <div style={{ marginBottom: '20px' }}>
                              <h2 style={{
                                fontSize: theme.typography.fontSize.xs,
                                fontWeight: theme.typography.fontWeight.bold,
                                color: theme.colors.text.primary,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '10px'
                              }}>
                                Keywords
                              </h2>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {activeReviewAbstract?.keywords.map((keyword, i) => (
                                  <span key={i} style={{
                                    padding: '4px 10px',
                                    background: theme.colors.neutral[100],
                                    borderRadius: theme.borderRadius.full,
                                    fontSize: theme.typography.fontSize.xs,
                                    color: theme.colors.text.secondary
                                  }}>
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Page Indicator */}
                            <div style={{
                              marginTop: 'auto',
                              paddingTop: '16px',
                              borderTop: `1px solid ${theme.colors.neutral[200]}`,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.tertiary }}>
                                {selectedPdf.name}
                              </div>
                              <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.tertiary }}>
                                Page 1 of 1
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Viewer Footer */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '8px 16px',
                          borderTop: `1px solid ${theme.colors.neutral[200]}`,
                          background: 'white',
                          gap: '12px'
                        }}>
                          <motion.button
                            whileHover={{ background: theme.colors.neutral[100] }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '32px',
                              height: '32px',
                              background: 'transparent',
                              border: `1px solid ${theme.colors.neutral[200]}`,
                              borderRadius: theme.borderRadius.md,
                              cursor: 'pointer'
                            }}
                          >
                            <ZoomOut size={14} strokeWidth={1.5} color={theme.colors.text.secondary} />
                          </motion.button>
                          <span style={{
                            padding: '4px 12px',
                            background: theme.colors.neutral[100],
                            borderRadius: theme.borderRadius.md,
                            fontSize: theme.typography.fontSize.xs,
                            color: theme.colors.text.secondary,
                            minWidth: '60px',
                            textAlign: 'center'
                          }}>
                            100%
                          </span>
                          <motion.button
                            whileHover={{ background: theme.colors.neutral[100] }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '32px',
                              height: '32px',
                              background: 'transparent',
                              border: `1px solid ${theme.colors.neutral[200]}`,
                              borderRadius: theme.borderRadius.md,
                              cursor: 'pointer'
                            }}
                          >
                            <ZoomIn size={14} strokeWidth={1.5} color={theme.colors.text.secondary} />
                          </motion.button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Landing Page Section */}
        {moreMenuItem === 'landing-page' && (
          <div style={{ padding: '8px 0' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: theme.typography.fontSize['2xl'],
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                margin: 0,
                marginBottom: '8px'
              }}>
                Event Landing Page
              </h2>
              <p style={{
                fontSize: theme.typography.fontSize.base,
                color: theme.colors.text.secondary,
                margin: 0,
                maxWidth: '600px'
              }}>
                Create stunning, conversion-optimized landing pages that capture your event's essence.
              </p>
            </div>

            {/* Preview + Controls Layout */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 320px',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {/* Landing Page Preview */}
              <div style={{
                background: 'white',
                borderRadius: theme.borderRadius.xl,
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}>
                {/* Browser Chrome */}
                <div style={{
                  background: '#F5F5F7',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderBottom: '1px solid rgba(0,0,0,0.06)'
                }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F57' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28CA41' }} />
                  </div>
                  <div style={{
                    flex: 1,
                    background: 'white',
                    borderRadius: theme.borderRadius.md,
                    padding: '6px 12px',
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.tertiary,
                    marginLeft: '8px'
                  }}>
                    cpa-convention-2025.events.yourorg.com
                  </div>
                </div>
                {/* Page Preview */}
                <div style={{ padding: '24px' }}>
                  {/* Hero Mock */}
                  <div style={{
                    background: 'linear-gradient(135deg, #121933 0%, #2D3A5C 100%)',
                    borderRadius: theme.borderRadius.lg,
                    padding: '40px 32px',
                    textAlign: 'center',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      fontSize: theme.typography.fontSize.xl,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: 'white',
                      marginBottom: '8px'
                    }}>
                      CPA 2025: 86th Annual Convention
                    </div>
                    <div style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: 'rgba(255,255,255,0.7)',
                      marginBottom: '16px'
                    }}>
                      June 12-14, 2025 • St. John's, NL
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        background: 'white',
                        color: '#121933',
                        border: 'none',
                        borderRadius: theme.borderRadius.full,
                        padding: '10px 24px',
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.medium,
                        cursor: 'pointer'
                      }}
                    >
                      Register Now
                    </motion.button>
                  </div>
                  {/* Content Blocks Mock */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {['Speakers', 'Agenda', 'Venue'].map((block, i) => (
                      <div key={i} style={{
                        background: '#F5F5F7',
                        borderRadius: theme.borderRadius.md,
                        padding: '16px',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: theme.typography.fontSize.sm,
                          fontWeight: theme.typography.fontWeight.medium,
                          color: theme.colors.text.secondary
                        }}>
                          {block}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Controls Panel */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {/* Status Card */}
                <div style={{
                  background: 'white',
                  borderRadius: theme.borderRadius.xl,
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#10B981'
                    }} />
                    <span style={{
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.primary
                    }}>
                      Published
                    </span>
                  </div>
                  <div style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.tertiary
                  }}>
                    Last updated 2 hours ago
                  </div>
                </div>

                {/* Quick Actions */}
                <div style={{
                  background: 'white',
                  borderRadius: theme.borderRadius.xl,
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                }}>
                  <div style={{
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text.primary,
                    marginBottom: '12px'
                  }}>
                    Quick Actions
                  </div>
                  {[
                    { label: 'Edit Page', icon: FileText },
                    { label: 'Preview', icon: PanelRightOpen },
                    { label: 'SEO Settings', icon: Search },
                    { label: 'Analytics', icon: TrendingUp }
                  ].map((action, i) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={i}
                        whileHover={{ background: theme.colors.neutral[50] }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          width: '100%',
                          padding: '10px 12px',
                          border: 'none',
                          background: 'transparent',
                          borderRadius: theme.borderRadius.md,
                          cursor: 'pointer',
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.text.secondary,
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Icon size={16} strokeWidth={1.5} />
                        {action.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Feature Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px'
            }}>
              {[
                { icon: LayoutTemplate, title: 'Drag & Drop Builder', description: 'Visual editor with pre-built blocks' },
                { icon: Globe, title: 'Custom Domain', description: 'Use your own branded URL' },
                { icon: Search, title: 'SEO Optimized', description: 'Meta tags and structured data' },
                { icon: TrendingUp, title: 'Conversion Tracking', description: 'Registration funnel analytics' }
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} style={{
                    background: 'white',
                    borderRadius: theme.borderRadius.lg,
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                  }}>
                    <Icon size={20} strokeWidth={1.5} color={theme.colors.primary[600]} style={{ marginBottom: '12px' }} />
                    <div style={{
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.primary,
                      marginBottom: '4px'
                    }}>
                      {feature.title}
                    </div>
                    <div style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.text.tertiary
                    }}>
                      {feature.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Default Coming Soon for other menu items */}
        {moreMenuItem !== 'participants' && moreMenuItem !== 'attendees' && moreMenuItem !== 'abstracts' && moreMenuItem !== 'landing-page' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '300px',
            color: theme.colors.text.tertiary
          }}>
            <div style={{
              fontSize: theme.typography.fontSize.lg,
              marginBottom: '8px'
            }}>
              {MORE_MENU_ITEMS.find(m => m.id === moreMenuItem)?.label}
            </div>
            <div style={{ fontSize: theme.typography.fontSize.sm }}>
              Coming soon
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{
      background: '#F5F5F7',
      minHeight: '100vh'
    }}>
      {/* Full-width Cover Image Header - extends behind GlobalBar */}
      <div style={{
        width: '100%',
        height: '296px',
        marginTop: '-56px',
        paddingTop: '56px',
        background: '#121933',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Leaflet Map Background */}
        {event.coordinates && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0
          }}>
            <MapContainer
              center={event.coordinates}
              zoom={13}
              style={{ width: '100%', height: '100%' }}
              zoomControl={false}
              attributionControl={false}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              touchZoom={false}
              keyboard={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              <Marker position={[event.coordinates[0] + 0.012, event.coordinates[1]]} icon={markerIcon} />
            </MapContainer>
          </div>
        )}

        {/* Color overlay to colorize the map */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#121933',
          opacity: 0.35,
          zIndex: 1,
          mixBlendMode: 'multiply'
        }} />

        {/* Second overlay for better blending */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(18, 25, 51, 0.15) 0%, rgba(18, 25, 51, 0.5) 100%)',
          zIndex: 2
        }} />

        {/* Fixed width container for header content */}
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '0 48px',
          height: '100%',
          position: 'relative',
          zIndex: 3
        }}>
          {/* Back Button */}
          <button
            onClick={() => navigate('/calendar')}
            style={{
              position: 'absolute',
              top: '24px',
              left: '48px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.sm,
              color: 'white',
              borderRadius: theme.borderRadius.md
            }}
          >
            <ArrowLeft size={18} />
            Back to Calendar
          </button>

          {/* Event info - aligned with body content */}
          <div style={{
            position: 'absolute',
            bottom: '76px',
            left: '48px',
            right: '48px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              {/* Ticket icon in margin - aligned with event title */}
              <div style={{
                position: 'absolute',
                left: '-44px',
                top: '2px',
                width: '28px',
                height: '28px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                borderRadius: theme.borderRadius.md,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <Ticket size={16} />
              </div>
              <div>
                <h1 style={{
                  fontSize: theme.typography.fontSize['2xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: 'white',
                  margin: 0,
                  marginBottom: '8px'
                }}>
                  {event.title}
                </h1>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  fontSize: theme.typography.fontSize.sm,
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    {formatDateRange(event.startDate, event.endDate)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} />
                    {event.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Icons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              {/* Expandable Search */}
              <div ref={searchContainerRef} style={{ position: 'relative' }}>
                <AnimatePresence mode="wait">
                  {searchActive ? (
                    <motion.div
                      key="search-input"
                      initial={{ width: 36, opacity: 0.7 }}
                      animate={{ width: 280, opacity: 1 }}
                      exit={{ width: 36, opacity: 0.7 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      style={{
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '18px',
                        overflow: 'hidden',
                        paddingLeft: '12px',
                        paddingRight: '6px',
                        gap: '8px'
                      }}
                    >
                      <Search size={16} strokeWidth={1.5} style={{ color: 'rgba(255, 255, 255, 0.8)', flexShrink: 0 }} />
                      <input
                        ref={searchInputRef}
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search this event..."
                        style={{
                          flex: 1,
                          border: 'none',
                          background: 'transparent',
                          outline: 'none',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 400,
                          caretColor: 'white'
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && searchQuery.trim()) {
                            // Open slide-out with search query
                            setSearchSlideOutOpen(true);
                          }
                        }}
                      />
                      {searchQuery && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSearchQuery('')}
                          title="Clear search"
                          style={{
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            color: 'white',
                            fontSize: '12px',
                            flexShrink: 0
                          }}
                        >
                          ✕
                        </motion.button>
                      )}
                      {/* Expand to slide-out panel */}
                      <motion.button
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 0.6 }}
                        whileHover={{ opacity: 1, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSearchSlideOutOpen(true);
                        }}
                        title="Expand search panel"
                        style={{
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: 'rgba(255, 255, 255, 0.8)',
                          flexShrink: 0
                        }}
                      >
                        <PanelRightOpen size={16} strokeWidth={1.5} />
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="search-icon"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 }}
                      whileHover={{
                        scale: 1.05,
                        opacity: 1,
                        borderColor: 'rgba(255, 255, 255, 0.5)'
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSearchActive(true)}
                      title="Search"
                      style={{
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        color: 'rgba(255, 255, 255, 0.6)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Search size={16} strokeWidth={1.5} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Other Action Icons */}
              {[
                { icon: StickyNote, label: 'Note' },
                { icon: ListTodo, label: 'Task' },
                { icon: Share2, label: 'Share' },
                { icon: Star, label: 'Favorite' },
                { icon: MoreHorizontal, label: 'More' }
              ].map(({ icon: Icon, label }) => (
                <motion.button
                  key={label}
                  whileHover={{
                    scale: 1.05,
                    opacity: 1,
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  title={label}
                  style={{
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    color: 'rgba(255, 255, 255, 0.6)',
                    opacity: 0.7,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={16} strokeWidth={1.5} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tabs - inside cover */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '48px',
            right: '48px'
          }}>
            <div style={{
              display: 'flex',
              gap: '4px'
            }}>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    color: activeTab === tab.id ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                    borderBottom: activeTab === tab.id ? '2px solid #ffffff' : '2px solid transparent',
                    transition: `all ${theme.transitions.fast}`
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Separator line */}
            <div style={{
              height: '1px',
              background: 'rgba(255, 255, 255, 0.2)',
              marginTop: '0'
            }} />
          </div>
        </div>
      </div>

      {/* Fixed Container for Content */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '0 48px'
      }}>
        {/* Tab Content */}
        <div style={{ minHeight: '400px', paddingTop: '8px' }}>
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'activities' && renderActivitiesTab()}
          {activeTab === 'more' && renderMoreTab()}
        </div>
      </div>

      {/* Record Slide Out for List facet */}
      <RecordSlideOut />

      {/* Floating Panels (Windows-like) */}
      {floatingPanels.map((panel) => (
        <FloatingPanel
          key={panel.id}
          isOpen={true}
          onClose={() => closeFloatingPanel(panel.id)}
          title={panel.collection.title}
          icon={panel.collection.icon}
          collection={panel.collection}
          initialPosition={panel.initialPosition}
          initialSize={{ width: 420, height: 520 }}
          zIndex={panel.zIndex}
        >
          <div style={{ padding: '16px' }}>
            <FacetCard
              collection={panel.collection}
              defaultFacet={panel.collection.defaultFacet}
              onPopOut={() => {}}
              onMenuClick={() => console.log('Menu for', panel.collection.id)}
            />
          </div>
        </FloatingPanel>
      ))}

      {/* Persistent Filter Summary Bar */}
      <FilterSummaryBar />

      {/* Search Slide-Out Panel */}
      <AnimatePresence>
        {searchSlideOutOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setSearchSlideOutOpen(false);
              }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(4px)',
                zIndex: theme.zIndex.modalBackdrop
              }}
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '480px',
                maxWidth: '90vw',
                background: theme.colors.background.elevated,
                borderLeft: `1px solid ${theme.colors.border.default}`,
                boxShadow: '-16px 0 48px rgba(0, 0, 0, 0.12)',
                zIndex: theme.zIndex.modal,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: `1px solid ${theme.colors.border.default}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: theme.colors.background.tertiary
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Search size={20} style={{ color: theme.colors.text.secondary }} />
                  <span style={{
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text.primary
                  }}>
                    Search Event
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, background: theme.colors.neutral[200] }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchSlideOutOpen(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: theme.colors.neutral[100],
                    border: 'none',
                    borderRadius: theme.borderRadius.md,
                    cursor: 'pointer',
                    color: theme.colors.text.secondary
                  }}
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Search Input */}
              <div style={{ padding: '16px 24px', borderBottom: `1px solid ${theme.colors.border.subtle}` }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: theme.colors.background.tertiary,
                  borderRadius: theme.borderRadius.lg,
                  border: `1px solid ${theme.colors.border.default}`
                }}>
                  <Search size={18} style={{ color: theme.colors.text.tertiary, flexShrink: 0 }} />
                  <input
                    ref={slideOutSearchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search registrants, sessions, speakers..."
                    autoFocus
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      fontSize: theme.typography.fontSize.base,
                      color: theme.colors.text.primary
                    }}
                  />
                  {searchQuery && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSearchQuery('')}
                      style={{
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: theme.colors.neutral[200],
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        color: theme.colors.text.secondary
                      }}
                    >
                      <X size={14} />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Content Area */}
              <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
                {searchQuery ? (
                  /* Search Results */
                  <div>
                    <div style={{
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.tertiary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '12px'
                    }}>
                      Results for "{searchQuery}"
                    </div>
                    {/* Mock search results */}
                    {[
                      { type: 'person', name: 'John Smith', detail: 'Full Conference • Acme Corp', icon: User },
                      { type: 'person', name: 'Sarah Johnson', detail: 'Workshop Only • Tech Inc', icon: User },
                      { type: 'session', name: 'Opening Keynote', detail: 'May 15, 9:00 AM • Main Hall', icon: Presentation },
                      { type: 'company', name: 'Acme Corporation', detail: '12 registrants', icon: Briefcase }
                    ].filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery.length < 3).map((result, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ background: theme.colors.interactive.hover, x: 2 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          borderRadius: theme.borderRadius.lg,
                          cursor: 'pointer',
                          marginBottom: '4px'
                        }}
                      >
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: theme.borderRadius.md,
                          background: theme.colors.neutral[100],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: theme.colors.text.secondary
                        }}>
                          <result.icon size={18} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: theme.typography.fontSize.sm,
                            fontWeight: theme.typography.fontWeight.medium,
                            color: theme.colors.text.primary
                          }}>
                            {result.name}
                          </div>
                          <div style={{
                            fontSize: theme.typography.fontSize.xs,
                            color: theme.colors.text.tertiary
                          }}>
                            {result.detail}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  /* Browse Cards */
                  <div>
                    <div style={{
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.tertiary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '12px'
                    }}>
                      Browse by Category
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {[
                        { label: 'People', count: '2,847', icon: Users, color: theme.colors.primary[500] },
                        { label: 'Sessions', count: '48', icon: Presentation, color: theme.colors.success[500] },
                        { label: 'Companies', count: '342', icon: Briefcase, color: theme.colors.warning[500] },
                        { label: 'Speakers', count: '24', icon: User, color: theme.colors.error[500] }
                      ].map((card, idx) => (
                        <motion.div
                          key={card.label}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                          whileTap={{ scale: 0.98 }}
                          style={{
                            padding: '16px',
                            background: theme.colors.background.primary,
                            borderRadius: theme.borderRadius.xl,
                            border: `1px solid ${theme.colors.border.default}`,
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: theme.borderRadius.lg,
                            background: `${card.color}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: card.color,
                            marginBottom: '12px'
                          }}>
                            <card.icon size={20} />
                          </div>
                          <div style={{
                            fontSize: theme.typography.fontSize.sm,
                            fontWeight: theme.typography.fontWeight.medium,
                            color: theme.colors.text.primary,
                            marginBottom: '2px'
                          }}>
                            {card.label}
                          </div>
                          <div style={{
                            fontSize: theme.typography.fontSize.xs,
                            color: theme.colors.text.tertiary
                          }}>
                            {card.count} items
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Recent Searches */}
                    <div style={{
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.tertiary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginTop: '24px',
                      marginBottom: '12px'
                    }}>
                      Recent Searches
                    </div>
                    {['John Smith', 'Workshop sessions', 'Acme Corp'].map((term, idx) => (
                      <motion.div
                        key={term}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + idx * 0.05 }}
                        whileHover={{ background: theme.colors.interactive.hover }}
                        onClick={() => setSearchQuery(term)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: theme.borderRadius.md,
                          cursor: 'pointer',
                          marginBottom: '2px'
                        }}
                      >
                        <Clock size={14} style={{ color: theme.colors.text.tertiary }} />
                        <span style={{
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.text.secondary
                        }}>
                          {term}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{
                padding: '16px 24px',
                borderTop: `1px solid ${theme.colors.border.default}`,
                background: theme.colors.background.tertiary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.tertiary
                }}>
                  Press <kbd style={{
                    padding: '2px 6px',
                    background: theme.colors.neutral[200],
                    borderRadius: '4px',
                    fontSize: '11px'
                  }}>⌘K</kbd> to search anywhere
                </span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '8px 16px',
                    background: theme.colors.primary[500],
                    color: 'white',
                    border: 'none',
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    cursor: 'pointer'
                  }}
                >
                  Advanced Search
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
