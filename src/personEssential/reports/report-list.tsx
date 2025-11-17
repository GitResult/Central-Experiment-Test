import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, X, Eye, EyeOff, Search, ChevronRight, Settings, Play, Download, Calendar, Save, Grid3x3, List, Filter, Users, Mail, MapPin, Database, Crown, DollarSign, Share2, ChevronDown, Check, ArrowUpDown, Hash, UserPlus, UserMinus, Building2, Map, Globe, Award, Target, HelpCircle, TrendingUp, Briefcase, GraduationCap, School, Star, Gift, Receipt, Heart, FileText, CreditCard, Users2, Megaphone, BookOpen, Newspaper, UserCheck, Layers, Sparkles, MoveLeft, FileUp, Edit2 } from 'lucide-react';




interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  index: number;
  isDragStarted?: boolean;
  isActiveItem?: boolean;
}

const SortableItem = ({ id, children, index, isDragStarted, isActiveItem }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 9999 : 'auto',
    position: 'relative' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`h-full transition-all duration-200`}
    >
      {/* {
        isDragStarted && !isActiveItem ?
          <div className={`
            border-2 border-dashed min-h-[40px] w-full
            ${isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
            `}></div>
          : ''
      } */}
      <div className="flex items-center gap-2">
       { isDragStarted && !isActiveItem ? <div className={`self-stretch w-1 rounded-full border-2  ${isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}`}></div> : ''}
        {children}
      </div>
    </div>
  );
};


const AnimationStyles = () => (
  <style>{`
    @keyframes barRise {
      0% { opacity: 0; transform: translateY(12px) scaleY(0.6); }
      60% { opacity: 1; transform: translateY(-4px) scaleY(1.02); }
      100% { opacity: 0.85; transform: translateY(0) scaleY(1); }
    }
    @keyframes drawLine {
      from { stroke-dashoffset: 280; }
      to { stroke-dashoffset: 0; }
    }
    @keyframes dotAppear {
      0% { opacity: 0; transform: translateY(6px); }
      60% { opacity: 1; transform: translateY(-2px); }
      100% { opacity: 0.9; transform: translateY(0); }
    }
    @keyframes slicePop {
      0% { opacity: 0; transform: scale(0.8) rotate(-6deg); }
      60% { opacity: 1; transform: scale(1.05) rotate(2deg); }
      100% { opacity: 0.85; transform: scale(1) rotate(0deg); }
    }
    @keyframes abstractFadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes abstractFadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(20px); }
    }
    @keyframes slideInDown {
      from { opacity: 0; transform: translate(-50%, -20px); }
      to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(100%); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slideIn { animation: slideInDown 300ms cubic-bezier(0.2, 0.8, 0.2, 1); }
    .animate-slideInRight { animation: slideInRight 300ms cubic-bezier(0.2, 0.8, 0.2, 1); }
    .animate-slideUp { animation: slideUp 400ms cubic-bezier(0.2, 0.8, 0.2, 1); }
    .bar-animate { animation: barRise 1400ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .bar-animate-delay-1 { animation-delay: 80ms; }
    .bar-animate-delay-2 { animation-delay: 160ms; }
    .line-animate { animation: drawLine 1100ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards 120ms; }
    .dot-animate { animation: dotAppear 800ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .dot-animate-delay-1 { animation-delay: 120ms; }
    .dot-animate-delay-2 { animation-delay: 240ms; }
    .dot-animate-delay-3 { animation-delay: 360ms; }
    .dot-animate-delay-4 { animation-delay: 480ms; }
    .slice-animate { animation: slicePop 900ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards 280ms; }
    .slice-animate-delay-1 { animation-delay: 320ms; }
    .slice-animate-delay-2 { animation-delay: 360ms; }
    .abstract-container-in { animation: abstractFadeIn 400ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .abstract-container-out { animation: abstractFadeOut 400ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .welcome-card {
      transition: all 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .welcome-card:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      border-color: #3B82F6;
    }
    .welcome-card:hover svg {
      color: #3B82F6;
    }
    [draggable="true"] {
      cursor: move;
    }
    [draggable="true"]:active {
      cursor: grabbing;
    }
    .drop-line {
      width: 4px;
      background: linear-gradient(180deg, #3B82F6 0%, #8B5CF6 100%);
      border-radius: 2px;
      box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
      animation: dropLinePulse 1s ease-in-out infinite;
      position: absolute;
      top: 0;
      bottom: 0;
      z-index: 10;
    }
    .drop-line-before {
      left: -10px;
    }
    .drop-line-after {
      top: -10px;
    }
    .drop-line::before {
      content: '';
      position: absolute;
      left: 50%;
      top: -8px;
      transform: translateX(-50%);
      width: 12px;
      height: 12px;
      background: #3B82F6;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
    }
    .drop-line::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: -8px;
      transform: translateX(-50%);
      width: 12px;
      height: 12px;
      background: #8B5CF6;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(139, 92, 246, 0.6);
    }
    @keyframes dropLinePulse {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 1; }
    }
    .card-flip-container {
      perspective: 1000px;
      position: relative;
      transition: all 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .card-flip-inner {
      position: relative;
      width: 100%;
      transition: transform 0.6s;
      transform-style: preserve-3d;
    }
    .card-flip-inner.flipped {
      transform: rotateY(180deg);
    }
    .card-flip-front,
    .card-flip-back {
      width: 100%;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
    .card-flip-back {
      position: absolute;
      top: 0;
      left: 0;
      transform: rotateY(180deg);
    }
  `}</style>
);

const COMBOS = {
  'Current Members Demographics': {
    description: 'Member profile and demographic information for reporting and analysis',
    fields: ['Career Stage', 'Occupation', 'Workplace Setting', 'Education Received', 'Area of Interest', 'New Member (Y/N)'],
    filters: [{ category: 'Current Members', value: 'All Current Members' }],
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500'
  },
  'Current Members Essentials': {
    description: 'Core member identification and status information',
    fields: ['Member ID', 'Join / Renewed Date', 'Status', 'Membership Type', 'Expiry Date', 'New Member (Y/N)'],
    filters: [{ category: 'Current Members', value: 'All Current Members' }],
    icon: Database,
    color: 'from-blue-500 to-cyan-500'
  },
  'Current Members Filter': {
    description: 'Pre-filtered active members with basic contact details',
    fields: ['Member ID', 'Status', 'Join / Renewed Date', 'New Member (Y/N)'],
    filters: [{ category: 'Current Members', value: 'All Current Members' }],
    icon: Filter,
    color: 'from-green-500 to-emerald-500'
  },
  'Current Members Email List': {
    description: 'Email contact information for communications and campaigns',
    fields: ['Member ID', 'Membership Type', 'Communications', 'New Member (Y/N)'],
    filters: [{ category: 'Current Members', value: 'All Current Members' }],
    icon: Mail,
    color: 'from-orange-500 to-red-500'
  },
  'Current Members Mailing List': {
    description: 'Physical mailing addresses for correspondence and materials',
    fields: ['Member ID', 'Membership Type', 'Address Line 1', 'Address Line 2', 'City', 'Province / State', 'Country', 'Postal / Zip Code', 'Phone Number', 'Email Address', 'New Member (Y/N)'],
    filters: [{ category: 'Current Members', value: 'All Current Members' }],
    icon: MapPin,
    color: 'from-indigo-500 to-purple-500'
  }
};

const CATEGORIES = {
  'Starting Data': ['Combos', 'New Members', 'Lapsed Members', 'Contacts', 'Other'],
  'Location': ['Proximity', 'In City', 'In Region', 'In Country'],
  'Membership': ['Membership Type', 'Code of Ethics', 'Primary Reason for Joining', 'Reason Not Full Member/Affiliate', 'Joined/Renewed'],
  'Demographics': ['Career Stage', 'Occupation', 'Workplace Setting', 'Education Received', 'Education Current', 'Area of Interest'],
  'Commerce': ['Membership Benefits', 'Membership Discounts', 'Donation', 'Invoices', 'Payments'],
  'Communities': ['Committees', 'Events', 'Sections', 'Regulatory Body', 'Professional Associations'],
  'Communications': ['Journals', 'Psygnature', 'CPA National Convention', 'CPA Member Benefit', 'Psychology in the News', 'Psynopsis Magazine', 'Volunteer Availability']
};

const CATEGORY_FIELDS = {
  'Membership Type': ['Start Date', 'End Date', 'Renewal Date', 'Invoice ID', 'Payment Status', 'Member ID', 'Type Code'],
  'Career Stage': ['Stage Start Date', 'Years in Stage', 'Previous Stage', 'Transition Date'],
  'In City': ['City Name', 'Province/State', 'Postal Code', 'Country', 'Latitude', 'Longitude'],
  'Current Members': ['Member ID', 'Join Date', 'Status', 'Type', 'Expiry Date'],
  'New Members': ['Join Date', 'Registration Date', 'Source', 'Welcome Email Sent'],
  'Occupation': ['Job Title', 'Industry', 'Years Experience', 'Employment Type', 'Organization'],
  'Code of Ethics': ['Acceptance Date', 'Version', 'Signed By', 'Document ID'],
  'Primary Reason for Joining': ['Reason Category', 'Detail Notes', 'Survey Date'],
  'Reason Not Full Member/Affiliate': ['Reason Code', 'Explanation', 'Review Date'],
  'Joined/Renewed': ['Action Date', 'Action Type', 'Processing Date', 'Payment Method'],
  'Workplace Setting': ['Setting Type', 'Organization Name', 'Department', 'Start Date'],
  'Education Received': ['Degree', 'Institution', 'Year Completed', 'Field of Study'],
  'Education Current': ['Program', 'Institution', 'Expected Completion', 'Enrollment Status'],
  'Area of Interest': ['Interest Category', 'Specialization', 'Years Active', 'Certification'],
  'Membership Benefits': ['Benefit Name', 'Activation Date', 'Usage Count', 'Expiry Date'],
  'Membership Discounts': ['Discount Type', 'Percentage', 'Valid From', 'Valid To', 'Code'],
  'Donation': ['Amount', 'Date', 'Campaign', 'Receipt Number', 'Tax Deductible'],
  'Invoices': ['Invoice Number', 'Date', 'Amount', 'Status', 'Due Date', 'Line Items'],
  'Payments': ['Payment ID', 'Date', 'Amount', 'Method', 'Transaction ID', 'Status'],
  'Committees': ['Committee Name', 'Role', 'Join Date', 'Term End', 'Status'],
  'Events': ['Event Name', 'Date', 'Registration Date', 'Attendance Status', 'Fee Paid'],
  'Sections': ['Section Name', 'Membership Type', 'Join Date', 'Status'],
  'Regulatory Body': ['Body Name', 'Registration Number', 'Registration Date', 'Status'],
  'Professional Associations': ['Association Name', 'Membership Number', 'Join Date', 'Status'],
  'Journals': ['Journal Name', 'Subscription Start', 'Subscription End', 'Format', 'Issues Received'],
  'Psygnature': ['Subscription Status', 'Frequency', 'Last Issue', 'Delivery Method'],
  'CPA National Convention': ['Year', 'Registration Status', 'Sessions Attended', 'Certificate'],
  'CPA Member Benefit': ['Benefit Name', 'Enrollment Date', 'Status', 'Usage'],
  'Psychology in the News': ['Subscription Status', 'Frequency', 'Last Sent', 'Click Rate'],
  'Psynopsis Magazine': ['Subscription Status', 'Issues Received', 'Format', 'Delivery Address'],
  'Volunteer Availability': ['Available', 'Areas of Interest', 'Hours Available', 'Last Updated']
};

const DEFAULT_FIELDS = ['Record ID', 'Created Date', 'Updated Date', 'Status', 'Notes'];

const SAMPLE_VALUES = {
  'Membership Type': ['Fellow', 'Life Fellow', 'Life Member', 'Member', 'International Affiliate', 'Member Early Career Year 1', 'Member Early Career Year 2', 'Section Associate'],
  'Career Stage': ['Student', 'Early Career Year 1', 'Early Career Year 2', 'Early Career', 'Mid to Late Career', 'Late Career'],
  'In City': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'],
  'Current Members': ['All Current Members'],
  'New Members': ['Members joined in last 30 days', 'Members joined in last 90 days', 'Members joined this year'],
  'Occupation': ['Researcher', 'Practitioner', 'Educator/Supervisor', 'Consultant', 'Advocacy', 'Administrator', 'Student', 'Other']
};

Object.entries(CATEGORIES).forEach(([section, cats]) => {
  cats.forEach(cat => {
    if (!SAMPLE_VALUES[cat] && cat !== 'Combos') {
      SAMPLE_VALUES[cat] = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6'];
    }
  });
});

const SECTION_ICONS = {
  'Starting Data': Database,
  'Location': MapPin,
  'Membership': Crown,
  'Demographics': Users,
  'Commerce': DollarSign,
  'Communities': Share2,
  'Communications': Mail
};

const SECTION_COLORS = {
  'Starting Data': { header: 'text-blue-700', icon: 'text-blue-400', bg: 'bg-blue-50', border: 'border-blue-200' },
  'Location': { header: 'text-green-700', icon: 'text-green-400', bg: 'bg-green-50', border: 'border-green-200' },
  'Membership': { header: 'text-purple-700', icon: 'text-purple-400', bg: 'bg-purple-50', border: 'border-purple-200' },
  'Demographics': { header: 'text-orange-700', icon: 'text-orange-400', bg: 'bg-orange-50', border: 'border-orange-200' },
  'Commerce': { header: 'text-emerald-700', icon: 'text-emerald-400', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  'Communities': { header: 'text-pink-700', icon: 'text-pink-400', bg: 'bg-pink-50', border: 'border-pink-200' },
  'Communications': { header: 'text-indigo-700', icon: 'text-indigo-400', bg: 'bg-indigo-50', border: 'border-indigo-200' }
};

const CATEGORY_ICONS = {
  'Combos': Layers,
  'Current Members': Users,
  'New Members': UserPlus,
  'Lapsed Members': UserMinus,
  'Contacts': Mail,
  'Other': Database,
  'Proximity': MapPin,
  'In City': Building2,
  'In Region': Map,
  'In Country': Globe,
  'Membership Type': Crown,
  'Code of Ethics': Award,
  'Primary Reason for Joining': Target,
  'Reason Not Full Member/Affiliate': HelpCircle,
  'Joined/Renewed': Calendar,
  'Career Stage': TrendingUp,
  'Occupation': Briefcase,
  'Workplace Setting': Building2,
  'Education Received': GraduationCap,
  'Education Current': School,
  'Area of Interest': Star,
  'Membership Benefits': Gift,
  'Membership Discounts': Receipt,
  'Donation': Heart,
  'Invoices': FileText,
  'Payments': CreditCard,
  'Committees': Users2,
  'Events': Calendar,
  'Sections': Grid3x3,
  'Regulatory Body': Award,
  'Professional Associations': Briefcase,
  'Journals': BookOpen,
  'Psygnature': Mail,
  'CPA National Convention': Megaphone,
  'CPA Member Benefit': Gift,
  'Psychology in the News': Newspaper,
  'Psynopsis Magazine': BookOpen,
  'Volunteer Availability': UserCheck
};

const ReportBuilder = ({
  onStateChange
}) => {
  const [stage, setStage] = useState('select');
  const [showAbstract, setShowAbstract] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [selections, setSelections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  const [savedViews, setSavedViews] = useState(['All']);
  const [activeView, setActiveView] = useState('All');
  const [showLeftFilterPanel, setShowLeftFilterPanel] = useState(false);
  const [sectionFilters, setSectionFilters] = useState([]);
  const [displayMode, setDisplayMode] = useState('both');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [bulkSelected, setBulkSelected] = useState([]);
  const [cardOrder, setCardOrder] = useState({});
  // const [draggedCard, setDraggedCard] = useState(null);
  // const [dragOverCard, setDragOverCard] = useState(null);
  // const [dropLinePosition, setDropLinePosition] = useState(null);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [items, setItems] = useState<string[]>([]);
  const [isDragStarted, setIsDragStarted] = useState(false);

  const [flippedCards, setFlippedCards] = useState({});
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [currentMode, setCurrentMode] = useState('List');
  const [selectedFieldDetail, setSelectedFieldDetail] = useState(null);
  const [fieldDetailTab, setFieldDetailTab] = useState('overview');
  const [fieldsPanel, setFieldsPanel] = useState(null);
  const [fieldSettings, setFieldSettings] = useState({});
  const [fieldsPanelTab, setFieldsPanelTab] = useState('fields');
  const [combosExpanded, setCombosExpanded] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [selectedSecondaryValue, setSelectedSecondaryValue] = useState(null);
  const [showDeltas, setShowDeltas] = useState(false);
  const [waterfallFromFilter, setWaterfallFromFilter] = useState(null);
  const [detailFromWaterfall, setDetailFromWaterfall] = useState(null);
  const [waterfallSelectedValues, setWaterfallSelectedValues] = useState([]);
  const [recordsPanel, setRecordsPanel] = useState(null);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [recordSearchTerm, setRecordSearchTerm] = useState('');
  const [showIslandActions, setShowIslandActions] = useState(false);
  const [filterRecordsContext, setFilterRecordsContext] = useState(null);

  // Browse mode features
  const [showSaveQueryPanel, setShowSaveQueryPanel] = useState(false);
  const [showLoadQueryDropdown, setShowLoadQueryDropdown] = useState(false);
  const [savedQueryName, setSavedQueryName] = useState('');
  const [savedQueryDescription, setSavedQueryDescription] = useState('');
  const [savedQueries, setSavedQueries] = useState([]);
  const [editingSelection, setEditingSelection] = useState(null);

  const filteredFields = useMemo(() => {
    const allFields = Object.entries(CATEGORIES).flatMap(([section, categories]) =>
      categories.filter(cat => cat !== 'Combos').map(cat => ({ section, category: cat }))
    );

    let filtered = allFields;
    if (sectionFilters.length > 0) {
      filtered = filtered.filter(f => sectionFilters.includes(f.section));
    }

    if (searchTerm) {
      filtered = filtered.filter(f =>
        f.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.section.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const currentOrder = cardOrder[activeView] || {};
    if (Object.keys(currentOrder).length > 0) {
      filtered.sort((a, b) => {
        const orderA = currentOrder[a.category] ?? 999999;
        const orderB = currentOrder[b.category] ?? 999999;
        return orderA - orderB;
      });
    }

    return filtered;
  }, [sectionFilters, searchTerm, cardOrder, activeView]); // Dependencies that affect the result

  // Natural language query builder (from Browse mode)
  const buildNaturalLanguageQuery = () => {
    if (selections.length === 0) return '';

    const startingDataCategories = ['Current Members', 'New Members', 'Lapsed Members', 'Contacts', '2024 Members', '2023 Members', '2022 Members', '2021 Members', '2020 Members', '2019 Members'];
    const yearCohorts = ['2024 Members', '2023 Members', '2022 Members', '2021 Members', '2020 Members', '2019 Members'];

    let query = '';

    // Find starting data (Member Year or Starting Data category)
    const memberYearSel = selections.find(s => s.category === 'Member Year');
    const startingDataSel = selections.find(s => startingDataCategories.includes(s.category));

    if (memberYearSel) {
      query = `${memberYearSel.value} members`;
    } else if (startingDataSel) {
      if (yearCohorts.includes(startingDataSel.category)) {
        query = startingDataSel.category.replace(' Members', ' members');
      } else {
        query = startingDataSel.category.toLowerCase();
      }
    }

    // Process remaining filters with connectors
    const filterSelections = selections.filter(s =>
      s.category !== 'Member Year' && !startingDataCategories.includes(s.category) && s.type === 'filter'
    );

    if (filterSelections.length > 0) {
      const parts = [];
      let i = 0;

      // Helper function to get proper connector phrase for each category
      const getConnectorPhrase = (category, value) => {
        let val = value;
        if (category === 'Membership Type' && val.includes(' - ')) val = val.split(' - ')[0];

        if (category === 'Renewal Month') return `who renewed in ${val}`;
        if (category === 'Renewal Year') return `who renewed in ${val}`;
        if (category === 'Membership Type') return `that are member type ${val}`;
        if (category === 'Tenure') return `that have been members for ${val}`;
        if (category === 'Occupation') return `and occupation is ${val}`;
        if (category === 'Degree') return `with a Degree: ${val}`;
        if (category === 'Province/State') return `from province/state ${val}`;
        return `with ${category.toLowerCase()} ${val}`;
      };

      while (i < filterSelections.length) {
        const sel = filterSelections[i];
        const nextSel = filterSelections[i + 1];

        // Check if this is a BETWEEN scenario
        if (nextSel && nextSel.connector === 'BETWEEN' && sel.category === nextSel.category) {
          const val2 = sel.category === 'Membership Type' && nextSel.value.includes(' - ')
            ? nextSel.value.split(' - ')[0]
            : nextSel.value;

          const phrase = getConnectorPhrase(sel.category, sel.value);
          parts.push(phrase.replace(sel.value, `${sel.value} and ${val2}`));
          i += 2;
        } else {
          // Check for OR connectors with same category
          let j = i + 1;
          const orValues = [sel.value];
          while (j < filterSelections.length &&
                 filterSelections[j].connector === 'OR' &&
                 filterSelections[j].category === sel.category) {
            orValues.push(filterSelections[j].value);
            j++;
          }

          if (orValues.length > 1) {
            // Multiple values with OR
            const formattedValues = orValues.map(v =>
              sel.category === 'Membership Type' && v.includes(' - ') ? v.split(' - ')[0] : v
            ).join(' or ');

            const phrase = getConnectorPhrase(sel.category, sel.value);
            parts.push(phrase.replace(sel.value, formattedValues));
          } else {
            // Single value
            parts.push(getConnectorPhrase(sel.category, sel.value));
          }

          i = j;
        }
      }

      if (parts.length > 0) {
        // Join all parts with proper spacing
        query += ' ' + parts.join(' ');
      }
    }

    return query.trim();
  };

  const getValueCount = (category, value) => {
    const hash = (category + value).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Math.floor(300 + (hash % 3000));
  };

  const getCategoryTotal = (category) => {
    const values = SAMPLE_VALUES[category] || [];
    return values.reduce((sum, val) => sum + getValueCount(category, val), 0);
  };

  const generateMockRecords = (category, value, count) => {
    const records = [];
    for (let i = 0; i < count; i++) {
      records.push({
        id: `REC-${Math.floor(10000 + Math.random() * 90000)}`,
        name: `${['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Jennifer'][i % 8]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][Math.floor(Math.random() * 8)]}`,
        status: ['Active', 'Active', 'Active', 'Pending', 'Inactive'][Math.floor(Math.random() * 5)],
        categoryValue: value,
        email: `member${i}@example.com`
      });
    }
    return records;
  };

  const calculateFilterImpact = (tempSelections = []) => {
    const activeFilters = tempSelections.filter(s => s.type === 'filter');
    if (activeFilters.length === 0) return 7100;

    let result = 7100;
    activeFilters.forEach(() => {
      result = Math.floor(result * (0.3 + Math.random() * 0.4));
    });
    return Math.max(50, result);
  };

  const calculateSequentialTotals = () => {
    const filters = selections.filter(s => s.type === 'filter');
    let runningTotal = 7100;
    const totals = [runningTotal];

    filters.forEach(() => {
      runningTotal = Math.floor(runningTotal * (0.4 + Math.random() * 0.4));
      totals.push(runningTotal);
    });

    return totals;
  };

  const [activePanel, setActivePanel] = useState(null);
  const [reportTitle, setReportTitle] = useState('New Report');
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [sortConfig, setSortConfig] = useState([]);
  const [groupConfig, setGroupConfig] = useState([]);
  const [limitConfig, setLimitConfig] = useState({ enabled: false, value: 100 });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [valueSearchTerm, setValueSearchTerm] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');

  const [proximityLocation, setProximityLocation] = useState('');
  const [proximityRadius, setProximityRadius] = useState(25);

  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');

  useEffect(() => {
    if (stage === 'welcome') {
      setShowAbstract(true);
      setTimeout(() => setShowAbstract(false), 1600);
      setTimeout(() => setShowPanel(true), 1700);
    }
  }, [stage]);

  // useEffect(() => {
  //   return () => {
  //     // ensure RAF cancelled on unmount
  //     stopAutoScroll();
  //   };
  // }, [stopAutoScroll]);

  const addSelection = (category, value, type = 'filter') => {
    const newSelection = {
      id: Date.now(),
      category,
      value,
      type,
      connector: selections.length > 0 ? 'AND' : null
    };
    setSelections([...selections, newSelection]);
  };

  const removeSelection = (id) => {
    const updatedSelections = selections.filter(s => s.id !== id);
    setSelections(updatedSelections);
    if (stage === 'browse') {
      setCurrentDescription(generateReportDescription(updatedSelections));
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const generateReportDescription = (selectionsArray) => {
    const filters = selectionsArray.filter(s => s.type === 'filter');
    const fields = selectionsArray.filter(s => s.type === 'field');

    if (filters.length === 0 && fields.length === 0) {
      return '';
    }

    let description = '';

    if (filters.length > 0) {
      description = filters.map((f, idx) => {
        if (idx === 0) {
          return f.value;
        } else if (f.connector === 'OR') {
          return `or ${f.value}`;
        } else {
          return `that are ${f.value}`;
        }
      }).join(' ');
    } else {
      description = 'All records';
    }

    if (fields.length > 0) {
      const fieldNames = fields.map(f => f.category).join(', ');
      description += `, showing ${fieldNames}`;
    }

    return description;
  };

  const handleCategorySelect = (category, section) => {
    if (category === 'Combos') {
      setCombosExpanded(!combosExpanded);
      return;
    }

    setSelectedCategory(category);
    setValueSearchTerm('');

    if (category === 'Proximity' || category === 'Joined/Renewed') {
      return;
    }

    const values = SAMPLE_VALUES[category] || [];
    if (values.length === 1) {
      if (section === 'Starting Data') {
        addField(category, values[0]);
      } else {
        addFilter(category, values[0]);
      }
    }
  };

  const handleValueSelect = (category, value) => {
    setSelectedValue({ category, value });
  };

  const addFilter = (category, value) => {
    const newSelection = {
      id: Date.now(),
      category,
      value,
      type: 'filter',
      connector: selections.length > 0 ? 'AND' : null
    };
    const updatedSelections = [...selections, newSelection];
    setSelections(updatedSelections);
    setCurrentDescription(generateReportDescription(updatedSelections));
    showToast(`Filter added: ${value}`);
  };

  const addField = (category, value) => {
    const newSelection = {
      id: Date.now(),
      category,
      value: value || 'All Values',
      type: 'field',
      connector: null
    };
    const updatedSelections = [...selections, newSelection];
    setSelections(updatedSelections);
    setCurrentDescription(generateReportDescription(updatedSelections));
    showToast(`Field added: ${category}`);
  };

  const addComboFields = (comboName) => {
    const combo = COMBOS[comboName];
    if (!combo) return;

    const newSelections = [];
    let timestamp = Date.now();

    combo.filters.forEach((filter, idx) => {
      newSelections.push({
        id: timestamp + idx,
        category: filter.category,
        value: filter.value,
        type: 'filter',
        connector: (selections.length + newSelections.length) > 0 ? 'AND' : null
      });
    });

    combo.fields.forEach((fieldName, idx) => {
      newSelections.push({
        id: timestamp + combo.filters.length + idx,
        category: fieldName,
        value: 'All Values',
        type: 'field',
        connector: null
      });
    });

    setSelections([...selections, ...newSelections]);
    showToast(`Added ${combo.fields.length} fields and ${combo.filters.length} filter${combo.filters.length !== 1 ? 's' : ''}`);
  };

  const toggleSectionFilter = (section) => {
    setSectionFilters(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const toggleCategoryExpanded = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const toggleBulkSelect = (category) => {
    setBulkSelected(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const applyBulkAction = (action) => {
    bulkSelected.forEach(category => {
      if (action === 'field') {
        addSelection(category, 'All Values', 'field');
      } else if (action === 'filter') {
        const values = SAMPLE_VALUES[category] || [];
        if (values.length > 0) {
          addSelection(category, values[0], 'filter');
        }
      }
    });
    setBulkSelected([]);
    setBulkSelectMode(false);
    showToast(`${action === 'field' ? 'Fields' : 'Filters'} added for ${bulkSelected.length} categories`);
  };

  const applyDateRange = (type) => {
    const today = new Date();
    let start, end, label;

    if (type === 'last30') {
      start = new Date(today.setDate(today.getDate() - 30));
      end = new Date();
      label = 'Last 30 days';
    } else if (type === 'last60') {
      start = new Date(today.setDate(today.getDate() - 60));
      end = new Date();
      label = 'Last 60 days';
    } else if (type === 'last90') {
      start = new Date(today.setDate(today.getDate() - 90));
      end = new Date();
      label = 'Last 90 days';
    } else if (type === 'first30') {
      label = 'First 30 days of membership';
    } else if (type === 'first60') {
      label = 'First 60 days of membership';
    } else if (type === 'first90') {
      label = 'First 90 days of membership';
    }

    addFilter('Joined/Renewed', label);
    setSelectedCategory(null);
  };

  const applyProximityFilter = () => {
    if (proximityLocation) {
      const filterValue = `Within ${proximityRadius} miles of ${proximityLocation}`;
      addFilter('Proximity', filterValue);
      setSelectedCategory(null);
      setProximityLocation('');
      setProximityRadius(25);
    }
  };

  // const getFilteredFields = () => {
  //   const allFields = Object.entries(CATEGORIES).flatMap(([section, categories]) =>
  //     categories.filter(cat => cat !== 'Combos').map(cat => ({ section, category: cat }))
  //   );

  //   let filtered = allFields;
  //   if (sectionFilters.length > 0) {
  //     filtered = filtered.filter(f => sectionFilters.includes(f.section));
  //   }

  //   if (searchTerm) {
  //     filtered = filtered.filter(f =>
  //       f.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       f.section.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   }

  //   // Apply custom order if exists for current view
  //   const currentOrder = cardOrder[activeView] || {};
  //   if (Object.keys(currentOrder).length > 0) {
  //     filtered.sort((a, b) => {
  //       const orderA = currentOrder[a.category] ?? 999999;
  //       const orderB = currentOrder[b.category] ?? 999999;
  //       return orderA - orderB;
  //     });
  //   }

  //   return filtered;
  // };

  // const handleDragStart = (e, category, index) => {
  //   if (bulkSelectMode) {
  //     e.preventDefault();
  //     return;
  //   }
  //   setDraggedCard({ category, index });
  //   e.dataTransfer.effectAllowed = 'move';
  //   e.dataTransfer.setData('text/html', e.currentTarget);
  //   e.currentTarget.style.opacity = '0.4';
  // };

  // const handleDragStart = (e, category, index) => {
  //   if (bulkSelectMode) {
  //     e.preventDefault();
  //     // ensure no auto-scroll
  //     stopAutoScroll();
  //     return;
  //   }
  //   setDraggedCard({ category, index });
  //   e.dataTransfer.effectAllowed = 'move';
  //   e.dataTransfer.setData('text/html', e.currentTarget);
  //   e.currentTarget.style.opacity = '0.4';
  // };


  // const handleDragEnd = (e) => {
  //   e.currentTarget.style.opacity = '1';
  //   setDraggedCard(null);
  //   setDragOverCard(null);
  //   setDropLinePosition(null);
  // };

  // const handleDragEnd = (e) => {
  //   e.currentTarget.style.opacity = '1';
  //   setDraggedCard(null);
  //   setDragOverCard(null);
  //   setDropLinePosition(null);
  //   // stop any running auto-scroll loop
  //   stopAutoScroll();
  // };


  // const handleDragOver = (e) => {
  //   e.preventDefault();
  //   e.dataTransfer.dropEffect = 'move';
  //   return false;
  // };

  // const handleDragOver = (e) => {
  //   // keep original behaviour
  //   e.preventDefault();
  //   try {
  //     if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  //   } catch (err) {
  //     // ignore cross-browser variations
  //   }

  //   // If bulkSelectMode or no dragging, don't attempt reorder or scroll
  //   if (bulkSelectMode || !draggedCard) {
  //     // ensure auto-scroll is stopped if not dragging
  //     stopAutoScroll();
  //     return false;
  //   }

  //   // --- existing logic you might have for drag-over reordering/visuals ---
  //   // (keep any logic you already had that updates dragOverCard / drop line)
  //   // NOTE: leave that code here (if present). After running your existing logic,
  //   // run the auto-scroll check below.
  //   //
  //   // (If your handleDragOver previously updated state like setDragOverCard or setDropLinePosition,
  //   // keep those lines exactly as they were above / below. We're not removing them.)

  //   // --- auto-scroll trigger logic ---
  //   const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  //   const y = (e.clientY ?? (e.touches && e.touches[0] && e.touches[0].clientY)) || 0;
  //   const threshold = Math.floor(viewportHeight * 0.2); // top/bottom 20%

  //   if (y <= threshold) {
  //     // near the top 20% -> scroll up
  //     startAutoScroll(-1);
  //   } else if (y >= viewportHeight - threshold) {
  //     // near the bottom 20% -> scroll down
  //     startAutoScroll(1);
  //   } else {
  //     // in the middle region -> stop auto-scroll
  //     stopAutoScroll();
  //   }

  //   return false;
  // };


  // const handleDragEnter = (e, category, index) => {
  //   if (bulkSelectMode || !draggedCard) return;

  //   setDragOverCard({ category, index });

  //   // Determine if drop line should appear before or after this card
  //   if (draggedCard.index < index) {
  //     // Dragging down - show line after target
  //     setDropLinePosition({ index: index, position: 'after' });
  //   } else if (draggedCard.index > index) {
  //     // Dragging up - show line before target
  //     setDropLinePosition({ index: index, position: 'before' });
  //   }
  // };

  // const handleDrop = (e, targetCategory, targetIndex) => {
  //   e.stopPropagation();
  //   e.preventDefault();

  //   if (!draggedCard || bulkSelectMode) return;

  //   const filtered = getFilteredFields();
  //   const newOrder = { ...(cardOrder[activeView] || {}) };

  //   // Rebuild order based on new positions
  //   filtered.forEach((field, idx) => {
  //     if (field.category === draggedCard.category) {
  //       newOrder[field.category] = targetIndex;
  //     } else if (draggedCard.index < targetIndex) {
  //       // Dragging down
  //       if (idx > draggedCard.index && idx <= targetIndex) {
  //         newOrder[field.category] = idx - 1;
  //       } else {
  //         newOrder[field.category] = idx;
  //       }
  //     } else {
  //       // Dragging up
  //       if (idx >= targetIndex && idx < draggedCard.index) {
  //         newOrder[field.category] = idx + 1;
  //       } else {
  //         newOrder[field.category] = idx;
  //       }
  //     }
  //   });

  //   setCardOrder({ ...cardOrder, [activeView]: newOrder });

  //   stopAutoScroll();

  //   setDraggedCard(null);
  //   setDragOverCard(null);
  //   setDropLinePosition(null);
  //   showToast('Card order saved to current view');

  //   return false;
  // };

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragStarted(true);
    if (bulkSelectMode) {
      event.preventDefault();
      return;
    }
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragStarted(false);
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update card order for current view
        const newOrder: { [key: string]: number } = {};
        newItems.forEach((itemId, index) => {
          const fieldIndex = parseInt(itemId.split('-')[1]);
          const field = filteredFields[fieldIndex];
          if (field) {
            newOrder[field.category] = index;
          }
        });

        setCardOrder({ ...cardOrder, [activeView]: newOrder });

        return newItems;
      });
    }

    setActiveId(null);
    // stopAutoScroll();
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (bulkSelectMode || !activeId) {
      // stopAutoScroll();
      return;
    }

    // Auto-scroll logic (keep your existing auto-scroll code)
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const y = event.over?.rect?.top ?? 0;
    const threshold = Math.floor(viewportHeight * 0.2);

    if (y <= threshold) {
      // startAutoScroll(-1);
    } else if (y >= viewportHeight - threshold) {
      // startAutoScroll(1);
    } else {
      // stopAutoScroll();
    }
  };

  const toggleCardFlip = (category) => {
    setFlippedCards(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const clearAllSelections = () => {
    setSelections([]);
    showToast('All selections cleared');
  };

  const clearFields = () => {
    const newSelections = selections.filter(s => s.type !== 'field');
    setSelections(newSelections);
    showToast('All fields cleared');
  };

  const clearFilters = () => {
    const newSelections = selections.filter(s => s.type !== 'filter');
    setSelections(newSelections);
    showToast('All filters cleared');
  };

  // const filteredFields = getFilteredFields();
  const TOP_VALUES_DISPLAY = 5;

  // Initialize items based on filtered fields
  // useEffect(() => {
  //   const newItems = filteredFields.map((field, index) => `field-${index}-${field.category}`);
  //   setItems(newItems);
  // }, [filteredFields]);

  useEffect(() => {
    const newItems = filteredFields.map((field, index) => `field-${index}-${field.category}`);
    setItems(newItems);
  }, [filteredFields]);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="max-h-[calc(100vh-115px)] overflow-y-auto bg-gray-50 flex flex-col">
      <AnimationStyles />

      {filterRecordsContext && (
        <div
          className="absolute top-0 h-full flex flex-col bg-white border-l border-gray-200 shadow-2xl"
          style={{
            right: '0px',
            width: '600px',
            zIndex: 52,
            backgroundColor: 'white'
          }}
        >
          <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button onClick={() => {
                  setFilterRecordsContext(null);
                  setSelectedRecords([]);
                  setRecordSearchTerm('');
                  setShowIslandActions(false);
                }} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <ChevronRight className="w-5 h-5 rotate-180" strokeWidth={1.5} />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 truncate">{filterRecordsContext.label}</h3>
                  <p className="text-xs text-gray-500 truncate">
                    {filterRecordsContext.description} • {filterRecordsContext.count.toLocaleString()} records
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFilterRecordsContext(null);
                  setSelectedRecords([]);
                  setRecordSearchTerm('');
                  setShowIslandActions(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex gap-1 border-b border-gray-200 mb-4">
              <button className="px-3 py-1.5 text-xs font-medium text-blue-600 border-b-2 border-blue-600 -mb-px">Records</button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
              <input
                type="text"
                value={recordSearchTerm}
                onChange={(e) => setRecordSearchTerm(e.target.value)}
                placeholder="Search records..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => {
                  const visibleRecords = filterRecordsContext.records
                    .filter(record =>
                      !recordSearchTerm ||
                      record.name.toLowerCase().includes(recordSearchTerm.toLowerCase()) ||
                      record.id.toLowerCase().includes(recordSearchTerm.toLowerCase())
                    )
                    .slice(0, 100)
                    .map(r => r.id);
                  setSelectedRecords(visibleRecords);
                  showToast(`Selected ${visibleRecords.length} records`);
                }}
                className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Select All
              </button>
              {selectedRecords.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedRecords([]);
                    showToast('Selection cleared');
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4" style={{ backgroundColor: 'white' }}>
            <div className="max-h-[calc(100vh-220px)] overflow-auto">
              {filterRecordsContext.records
                .filter(record =>
                  !recordSearchTerm ||
                  record.name.toLowerCase().includes(recordSearchTerm.toLowerCase()) ||
                  record.id.toLowerCase().includes(recordSearchTerm.toLowerCase())
                )
                .slice(0, 100)
                .map((record, idx) => (
                  <div key={idx}>
                    <div className="flex items-center gap-2 py-3 hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedRecords.includes(record.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRecords([...selectedRecords, record.id]);
                          } else {
                            setSelectedRecords(selectedRecords.filter(id => id !== record.id));
                          }
                        }}
                        className="rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 grid grid-cols-3 gap-3 items-center text-xs">
                        <div className="truncate font-mono text-gray-600">{record.id}</div>
                        <div className="truncate font-medium text-gray-900">{record.name}</div>
                        <div className="truncate text-gray-600">{record.categoryValue}</div>
                      </div>
                    </div>
                    {idx < filterRecordsContext.records.filter(record =>
                      !recordSearchTerm ||
                      record.name.toLowerCase().includes(recordSearchTerm.toLowerCase()) ||
                      record.id.toLowerCase().includes(recordSearchTerm.toLowerCase())
                    ).slice(0, 100).length - 1 && (
                        <div className="border-t border-gray-200"></div>
                      )}
                  </div>
                ))}
            </div>
            {filterRecordsContext.records.length > 100 && (
              <div className="text-center mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                Showing first 100 of {filterRecordsContext.records.length} records
              </div>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slideIn">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl">
            <span className="text-sm font-medium">{toast}</span>
          </div>
        </div>
      )}

      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="flex items-center gap-2">
                <button onClick={() => onStateChange('welcome')} className="text-blue-500 hover:text-blue-600 text-sm">← Back</button>
                <button
                  onClick={() => setShowModeDropdown(!showModeDropdown)}
                  className="flex items-center gap-2 group"
                >
                  <h1 className="text-2xl font-light">{currentMode}</h1>
                  <ChevronDown className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-transform ${showModeDropdown ? 'rotate-180' : ''}`} strokeWidth={1.5} />
                </button>
              </div>

              {showModeDropdown && (
                <>
                  <div
                    className="absolute inset-0 z-10"
                    onClick={() => setShowModeDropdown(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 animate-slideIn">
                    <button
                      onClick={() => {
                        setCurrentMode('List');
                        onStateChange('select');
                        setShowModeDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${currentMode === 'List'
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      List
                    </button>
                    <button
                      onClick={() => {
                        setCurrentMode('Browse');
                        onStateChange('browse');
                        setShowModeDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${currentMode === 'Browse'
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      Browse
                    </button>
                    {/* <button
                      onClick={() => {
                        setCurrentMode('Phrase');
                        onStateChange('phrase');
                        setShowModeDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${currentMode === 'Phrase'
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      Phrase
                    </button> */}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {savedViews.map(view => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`px-3 py-1 text-sm font-medium transition-colors ${activeView === view
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {view}
                </button>
              ))}
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">+ Save View</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-8 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLeftFilterPanel(!showLeftFilterPanel)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${showLeftFilterPanel || sectionFilters.length > 0
              ? 'text-blue-600 hover:bg-blue-50'
              : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <Filter className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm font-medium">Filter</span>
            {sectionFilters.length > 0 && (
              <span className="px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full font-medium">{sectionFilters.length}</span>
            )}
          </button>

          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search fields, categories, or values..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 shadow-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
              </button>
            )}
          </div>

          <button
            onClick={() => { setBulkSelectMode(!bulkSelectMode); setBulkSelected([]); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${bulkSelectMode
              ? 'text-green-600 hover:bg-green-50'
              : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            {bulkSelectMode ? '✓ Bulk Select' : 'Bulk Select'}
          </button>

          {Object.keys(cardOrder[activeView] || {}).length > 0 && !bulkSelectMode && (
            <button
              onClick={() => {
                const newOrder = { ...cardOrder };
                delete newOrder[activeView];
                setCardOrder(newOrder);
                showToast('Card order reset to default');
              }}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              title="Reset to default order"
            >
              Reset Order
            </button>
          )}
        </div>

        {bulkSelectMode && bulkSelected.length > 0 && (
          <div className="flex items-center gap-2 mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <span className="text-sm font-medium text-green-900">{bulkSelected.length} selected</span>
            <button onClick={() => applyBulkAction('field')} className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600">Add as Fields</button>
            <button onClick={() => applyBulkAction('filter')} className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">Add as Filters</button>
            <button onClick={() => setBulkSelected([])} className="ml-auto text-sm text-gray-600 hover:text-gray-800">Clear</button>
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {showLeftFilterPanel && (
          <div className="w-64 bg-white border-r border-gray-200 overflow-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Sections</h3>
                <button onClick={() => setShowLeftFilterPanel(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>

              <div className="space-y-1">
                {Object.keys(CATEGORIES).map(section => {
                  const colors = SECTION_COLORS[section];
                  const SectionIcon = SECTION_ICONS[section];
                  const isActive = sectionFilters.includes(section);

                  return (
                    <button key={section} onClick={() => toggleSectionFilter(section)} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? `${colors.bg} border-2 ${colors.border}` : 'hover:bg-gray-50 border-2 border-transparent'}`}>
                      <SectionIcon className={`w-5 h-5 ${colors.icon}`} strokeWidth={1.5} />
                      <span className={`text-sm font-medium flex-1 text-left ${colors.header}`}>{section}</span>
                      {isActive && <Check className="w-4 h-4 text-blue-500" strokeWidth={2} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto p-8 pb-32">
          {filteredFields.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" strokeWidth={1} />
              <p className="text-gray-500 text-lg">No fields found</p>
            </div>
          ) : (
            <div>


              {/* {filteredFields.map((field, idx) => {
                const values = SAMPLE_VALUES[field.category] || [];
                const colors = SECTION_COLORS[field.section];
                const CategoryIcon = CATEGORY_ICONS[field.category] || Database;
                const isExpanded = expandedCategories[field.category];
                const displayValues = isExpanded ? values : values.slice(0, TOP_VALUES_DISPLAY);
                const hasMore = values.length > TOP_VALUES_DISPLAY;
                const isBulkSelected = bulkSelected.includes(field.category);
                const totalCount = getCategoryTotal(field.category);
                const isFlipped = flippedCards[field.category];
                const categoryFields = CATEGORY_FIELDS[field.category] || DEFAULT_FIELDS;
                const showDropLineBefore = dropLinePosition && dropLinePosition.index === idx && dropLinePosition.position === 'before';
                const showDropLineAfter = dropLinePosition && dropLinePosition.index === idx && dropLinePosition.position === 'after';

                return (
                 
                );
              })} */}

              {/* // Replace the entire filteredFields.map section with: */}

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
              >
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                  <div
                    // style={{
                    //   display: 'grid',
                    //   gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    //   gap: '1.5rem',
                    //   alignItems: 'start'
                    // }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                  >
                    {/* Your Combos section remains here */}
                    {(sectionFilters.length === 0 || sectionFilters.includes('Starting Data')) && !searchTerm && (
                      <div className="bg-white rounded-lg transition-all hover:shadow-lg">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="text-left w-full">
                                <div className="flex items-center gap-2">
                                  <Layers className="w-4 h-4 text-blue-400 flex-shrink-0" strokeWidth={1.5} />
                                  <h4 className="font-semibold text-gray-900 truncate">
                                    Combos
                                  </h4>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">5 options • Pre-configured sets</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="space-y-2">
                            {Object.entries(COMBOS).map(([comboName, combo]) => {
                              const ComboIcon = combo.icon;
                              return (
                                <div key={comboName} className="group">
                                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <ComboIcon className="w-5 h-5 text-gray-400 flex-shrink-0" strokeWidth={1.5} />
                                    <button
                                      onClick={() => setSelectedCombo(comboName)}
                                      className="flex-1 text-left min-w-0"
                                    >
                                      <div className="text-sm text-gray-900 hover:text-blue-600 transition-colors truncate">{comboName}</div>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <div className="text-xs text-gray-500">{combo.fields.length} {combo.fields.length === 1 ? 'Field' : 'Fields'} • {combo.filters.length} {combo.filters.length === 1 ? 'Filter' : 'Filters'}</div>
                                      </div>
                                    </button>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => { addComboFields(comboName); }}
                                        className="p-1.5 hover:bg-blue-50 rounded transition-colors flex-shrink-0"
                                        title="Add all"
                                      >
                                        <Plus className="w-4 h-4 text-blue-600" strokeWidth={2} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Map through filteredFields with SortableItem */}
                    {filteredFields.map((field, idx) => {
                      const itemId = `field-${idx}-${field.category}`;

                      const values = SAMPLE_VALUES[field.category] || [];
                      const colors = SECTION_COLORS[field.section];
                      const CategoryIcon = CATEGORY_ICONS[field.category] || Database;
                      const isExpanded = expandedCategories[field.category];
                      const displayValues = isExpanded ? values : values.slice(0, TOP_VALUES_DISPLAY);
                      const hasMore = values.length > TOP_VALUES_DISPLAY;
                      const isBulkSelected = bulkSelected.includes(field.category);
                      const totalCount = getCategoryTotal(field.category);
                      const isFlipped = flippedCards[field.category];
                      const categoryFields = CATEGORY_FIELDS[field.category] || DEFAULT_FIELDS;

                      return (
                        <SortableItem
                          key={itemId}
                          id={itemId}
                          index={idx}
                          isDragStarted={isDragStarted}
                          isActiveItem={activeId === itemId}
                        >
                          <div
                            key={idx}
                            className={`card-flip-container`}
                            style={{ position: 'relative' }}
                          >
                            <div className={`card-flip-inner ${isFlipped ? 'flipped' : ''}`}>

                              <div className="card-flip-front bg-white rounded-lg transition-all hover:shadow-lg">
                                <div className="px-4 py-3 border-b border-gray-100">
                                  <div className="flex items-start gap-3">
                                    {!bulkSelectMode && (
                                      <button
                                        className="cursor-move text-gray-400 hover:text-gray-600 mt-1 flex-shrink-0"
                                        title="Drag to reorder"
                                        onMouseDown={(e) => e.stopPropagation()}
                                      >
                                        <span className="text-base leading-none">⋮⋮</span>
                                      </button>
                                    )}
                                    {bulkSelectMode && (
                                      <input type="checkbox" checked={isBulkSelected} onChange={() => toggleBulkSelect(field.category)} className="rounded mt-1" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setFieldsPanel({ category: field.category, section: field.section, values });
                                          setFieldsPanelTab('fields');
                                        }}
                                        className="text-left w-full group"
                                      >
                                        <div className="flex items-center gap-2">
                                          <CategoryIcon className={`w-4 h-4 ${colors.icon} flex-shrink-0`} strokeWidth={1.5} />
                                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                            {field.category}
                                          </h4>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{values.length} values • {totalCount.toLocaleString()} records</p>
                                      </button>
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCardFlip(field.category);
                                      }}
                                      className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0 text-blue-600"
                                      title="Flip to see fields"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                      </svg>
                                    </button>
                                    {!bulkSelectMode && (
                                      <button
                                        onClick={() => { addSelection(field.category, 'All Values', 'field'); showToast(`${field.category} added`); }}
                                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                                        title="Add as field"
                                      >
                                        <Plus className="w-4 h-4 text-gray-600" strokeWidth={2} />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <div className="p-4">
                                  <div className="space-y-2">
                                    {displayValues.map((value, vIdx) => {
                                      const count = getValueCount(field.category, value);
                                      const percentage = ((count / totalCount) * 100).toFixed(1);

                                      return (
                                        <div key={vIdx} className="group">
                                          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                            <button
                                              onClick={() => {
                                                if (selectedFieldDetail && selectedFieldDetail.category === field.category) {
                                                  setSelectedSecondaryValue({
                                                    category: field.category,
                                                    section: field.section,
                                                    values: values,
                                                    selectedValue: value
                                                  });
                                                } else {
                                                  setSelectedFieldDetail({
                                                    category: field.category,
                                                    section: field.section,
                                                    values: values,
                                                    selectedValue: value
                                                  });
                                                  setSelectedSecondaryValue(null);
                                                  setFieldDetailTab('overview');
                                                }
                                              }}
                                              className="flex-1 text-left min-w-0"
                                            >
                                              <div className="text-sm text-gray-900 hover:text-blue-600 transition-colors truncate">{value}</div>
                                              <div className="flex items-center gap-2 mt-1">
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedFieldDetail({
                                                      category: field.category,
                                                      section: field.section,
                                                      values: values,
                                                      selectedValue: value
                                                    });
                                                    setSelectedSecondaryValue(null);
                                                    setFieldDetailTab('records');
                                                  }}
                                                  className="text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors"
                                                >
                                                  {count.toLocaleString()}
                                                </button>
                                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                                                  <div className={`h-full ${colors.bg.replace('bg-', 'bg-').replace('-50', '-400')}`} style={{ width: `${percentage}%` }} />
                                                </div>
                                                <div className="text-xs text-gray-500">{percentage}%</div>
                                              </div>
                                            </button>
                                            {!bulkSelectMode && (
                                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    addSelection(field.category, value, 'field');
                                                    showToast(`Field: ${field.category}`);
                                                  }}
                                                  className="p-1.5 hover:bg-purple-50 rounded transition-colors flex-shrink-0"
                                                  title="Add as field"
                                                >
                                                  <Eye className="w-3 h-3 text-purple-600" strokeWidth={2} />
                                                </button>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    addSelection(field.category, value, 'filter');
                                                    showToast(`Filter: ${value}`);
                                                  }}
                                                  className="p-1.5 hover:bg-blue-50 rounded transition-colors flex-shrink-0"
                                                  title="Add as filter"
                                                >
                                                  <Filter className="w-3 h-3 text-blue-600" strokeWidth={2} />
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}

                                    {hasMore && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setFieldsPanel({ category: field.category, section: field.section, values });
                                          setFieldsPanelTab('values');
                                        }}
                                        className="w-full text-center py-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                                      >
                                        View all {values.length} options →
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="card-flip-back bg-white rounded-lg shadow-lg">
                                <div className="px-4 py-3 border-b border-gray-100">
                                  <div className="flex items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <CategoryIcon className={`w-4 h-4 ${colors.icon} flex-shrink-0`} strokeWidth={1.5} />
                                        <h4 className="font-semibold text-gray-900 truncate">
                                          {field.category}
                                        </h4>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1">{categoryFields.length} fields available</p>
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCardFlip(field.category);
                                      }}
                                      className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0 text-blue-600"
                                      title="Flip to see values"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        categoryFields.forEach(fieldName => {
                                          const isAdded = selections.some(s => s.type === 'field' && s.category === field.category && s.value === fieldName);
                                          if (!isAdded) {
                                            addSelection(field.category, fieldName, 'field');
                                          }
                                        });
                                        showToast(`Added all ${field.category} fields`);
                                      }}
                                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                                      title="Add all fields"
                                    >
                                      <Plus className="w-4 h-4 text-gray-600" strokeWidth={2} />
                                    </button>
                                  </div>
                                </div>

                                <div className="p-4">
                                  <div className="mb-3">
                                    <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                                      <Eye className="w-3 h-3" strokeWidth={2} />
                                      Report Fields
                                    </h5>
                                  </div>
                                  <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
                                    {categoryFields.map((fieldName, fIdx) => {
                                      const isAdded = selections.some(s => s.type === 'field' && s.category === field.category && s.value === fieldName);
                                      return (
                                        <div key={fIdx} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors">
                                          <input
                                            type="checkbox"
                                            checked={isAdded}
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              if (isAdded) {
                                                const sel = selections.find(s => s.type === 'field' && s.category === field.category && s.value === fieldName);
                                                if (sel) removeSelection(sel.id);
                                              } else {
                                                addSelection(field.category, fieldName, 'field');
                                              }
                                            }}
                                            className="rounded flex-shrink-0"
                                          />
                                          <span className="text-sm text-gray-700 flex-1 truncate">{fieldName}</span>
                                          {!isAdded && (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                addSelection(field.category, fieldName, 'field');
                                                showToast(`Added field: ${fieldName}`);
                                              }}
                                              className="p-1 hover:bg-purple-50 rounded transition-colors flex-shrink-0"
                                              title="Add field"
                                            >
                                              <Plus className="w-3 h-3 text-purple-600" strokeWidth={2} />
                                            </button>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        categoryFields.forEach(fieldName => {
                                          const isAdded = selections.some(s => s.type === 'field' && s.category === field.category && s.value === fieldName);
                                          if (!isAdded) {
                                            addSelection(field.category, fieldName, 'field');
                                          }
                                        });
                                        showToast(`Added all ${field.category} fields`);
                                      }}
                                      className="flex-1 px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors"
                                    >
                                      Add All Fields
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCardFlip(field.category);
                                      }}
                                      className="flex-1 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </SortableItem>
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
      </div>

      {selectedCombo && (
        <div
          className="absolute top-0 h-full flex flex-col"
          style={{
            right: '0px',
            width: '320px',
            backgroundColor: '#F9FAFB',
            borderLeft: '2px solid #E5E7EB',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            zIndex: 50,
            animation: 'slideInRight 300ms cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
        >
          <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0" style={{ backgroundColor: 'white' }}>
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => { setSelectedCombo(null); }} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <ChevronRight className="w-5 h-5 rotate-180" strokeWidth={1.5} />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 truncate">{selectedCombo}</h3>
                <p className="text-xs text-gray-500 truncate">Pre-configured field set</p>
              </div>
              <button onClick={() => { setSelectedCombo(null); }} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex gap-1 border-b border-gray-200">
              <button className="px-3 py-1.5 text-xs font-medium text-blue-600 border-b-2 border-blue-600 -mb-px">Overview</button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900">Timeline</button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900">More</button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-white rounded-lg border border-blue-100 shadow-sm">
                  <div className="text-xl font-bold text-blue-600">{COMBOS[selectedCombo].fields.length}</div>
                  <div className="text-xs text-gray-600 mt-0.5">Fields</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-green-100 shadow-sm">
                  <div className="text-xl font-bold text-green-600">{COMBOS[selectedCombo].filters.length}</div>
                  <div className="text-xs text-gray-600 mt-0.5">Filters</div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                <h4 className="text-xs font-semibold text-gray-900 mb-1.5">Description</h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {COMBOS[selectedCombo].description}
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                <h4 className="text-xs font-semibold text-gray-900 mb-2">Quick Actions</h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      addComboFields(selectedCombo);
                      setSelectedCombo(null);
                    }}
                    className="w-full flex items-center gap-2 p-2.5 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors border border-blue-100"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" strokeWidth={1.5} />
                    <span className="text-xs font-medium text-blue-900">Add All to Report</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                <h4 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-purple-600" strokeWidth={1.5} />
                  Included Fields
                </h4>
                <div className="space-y-1">
                  {COMBOS[selectedCombo].fields.slice(0, 5).map((field, idx) => (
                    <div key={idx} className="text-xs text-gray-700 px-2 py-1 bg-gray-50 rounded">
                      {field}
                    </div>
                  ))}
                  {COMBOS[selectedCombo].fields.length > 5 && (
                    <div className="text-xs text-gray-500 px-2 py-1">
                      +{COMBOS[selectedCombo].fields.length - 5} more...
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                <h4 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-blue-600" strokeWidth={1.5} />
                  Applied Filters
                </h4>
                <div className="space-y-1">
                  {COMBOS[selectedCombo].filters.map((filter, idx) => (
                    <div key={idx} className="text-xs text-gray-700 px-2 py-1 bg-gray-50 rounded">
                      <div className="font-medium">{filter.category}</div>
                      <div className="text-gray-500">{filter.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedFieldDetail && (
        <>
          <div className="absolute inset-0 bg-black bg-opacity-10 z-40" onClick={() => { setSelectedFieldDetail(null); setSelectedSecondaryValue(null); setRecordSearchTerm(''); setSelectedRecords([]); }} />
          <div
            className="absolute top-0 h-full flex flex-col"
            style={{
              right: selectedSecondaryValue ? '280px' : '0px',
              width: '420px',
              backgroundColor: '#F9FAFB',
              borderLeft: '2px solid #E5E7EB',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              zIndex: 50,
              transition: 'right 300ms ease-in-out'
            }}
          >
            <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0" style={{ backgroundColor: 'white' }}>
              <div className="flex items-center gap-2 mb-3">
                <button onClick={() => { setSelectedFieldDetail(null); setSelectedSecondaryValue(null); setRecordSearchTerm(''); setSelectedRecords([]); }} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <ChevronRight className="w-5 h-5 rotate-180" strokeWidth={1.5} />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 truncate">{selectedFieldDetail.selectedValue}</h3>
                  <p className="text-xs text-gray-500 truncate">{selectedFieldDetail.category}</p>
                </div>
                <button onClick={() => { setSelectedFieldDetail(null); setSelectedSecondaryValue(null); setRecordSearchTerm(''); setSelectedRecords([]); }} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex gap-1 border-b border-gray-200">
                <button
                  onClick={() => setFieldDetailTab('overview')}
                  className={`px-3 py-1.5 text-xs font-medium ${fieldDetailTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600 -mb-px' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setFieldDetailTab('records')}
                  className={`px-3 py-1.5 text-xs font-medium ${fieldDetailTab === 'records' ? 'text-blue-600 border-b-2 border-blue-600 -mb-px' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Records
                </button>
                <button
                  onClick={() => setFieldDetailTab('timeline')}
                  className={`px-3 py-1.5 text-xs font-medium ${fieldDetailTab === 'timeline' ? 'text-blue-600 border-b-2 border-blue-600 -mb-px' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setFieldDetailTab('more')}
                  className={`px-3 py-1.5 text-xs font-medium ${fieldDetailTab === 'more' ? 'text-blue-600 border-b-2 border-blue-600 -mb-px' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  More
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4" style={{ backgroundColor: 'white' }}>
              {fieldDetailTab === 'overview' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-white rounded-lg border border-blue-100 shadow-sm">
                      <div className="text-xl font-bold text-blue-600">{getValueCount(selectedFieldDetail.category, selectedFieldDetail.selectedValue).toLocaleString()}</div>
                      <div className="text-xs text-gray-600 mt-0.5">Total Members</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-green-100 shadow-sm">
                      <div className="text-xl font-bold text-green-600">
                        {((getValueCount(selectedFieldDetail.category, selectedFieldDetail.selectedValue) / getCategoryTotal(selectedFieldDetail.category)) * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">Of Total</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-900 mb-1.5">Description</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      This value represents members in the category &quot;{selectedFieldDetail.category}&quot; with the specific
                      attribute &quot;{selectedFieldDetail.selectedValue}&quot;. Use this filter to narrow your report results to only
                      include records matching this criteria.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-900 mb-2">Quick Actions</h4>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => {
                          addSelection(selectedFieldDetail.category, selectedFieldDetail.selectedValue, 'filter');
                          showToast(`Filter: ${selectedFieldDetail.selectedValue}`);
                        }}
                        className="w-full flex items-center gap-2 p-2.5 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors border border-blue-100"
                      >
                        <Filter className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-xs font-medium text-blue-900">Add as Filter</span>
                      </button>
                      <button
                        onClick={() => {
                          addSelection(selectedFieldDetail.category, selectedFieldDetail.selectedValue, 'field');
                          showToast(`Field: ${selectedFieldDetail.category}`);
                        }}
                        className="w-full flex items-center gap-2 p-2.5 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors border border-purple-100"
                      >
                        <Eye className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-xs font-medium text-purple-900">Add as Field</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-900 mb-2">Related Values</h4>
                    <div className="space-y-0.5">
                      {(selectedFieldDetail.values || [])
                        .filter(v => v !== selectedFieldDetail.selectedValue)
                        .slice(0, 3)
                        .map((relatedValue, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedSecondaryValue({
                              category: selectedFieldDetail.category,
                              section: selectedFieldDetail.section,
                              values: selectedFieldDetail.values,
                              selectedValue: relatedValue
                            })}
                            className="w-full text-left px-2 py-1.5 hover:bg-gray-50 rounded-lg text-xs text-gray-700 hover:text-blue-600 transition-colors"
                          >
                            {relatedValue}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {fieldDetailTab === 'records' && (
                <div className="space-y-3">
                  <div className="p-3">
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
                      <input
                        type="text"
                        value={recordSearchTerm}
                        onChange={(e) => setRecordSearchTerm(e.target.value)}
                        placeholder="Search records..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={() => {
                          const count = getValueCount(selectedFieldDetail.category, selectedFieldDetail.selectedValue);
                          const records = generateMockRecords(selectedFieldDetail.category, selectedFieldDetail.selectedValue, count);
                          const allIds = records.slice(0, 100).map(r => r.id);
                          setSelectedRecords(allIds);
                          showToast(`Selected ${allIds.length} records`);
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Select All
                      </button>
                      {selectedRecords.length > 0 && (
                        <button
                          onClick={() => {
                            setSelectedRecords([]);
                            showToast('Selection cleared');
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    <div className="max-h-[calc(100vh-280px)] overflow-auto">
                      {(() => {
                        const count = getValueCount(selectedFieldDetail.category, selectedFieldDetail.selectedValue);
                        const records = generateMockRecords(selectedFieldDetail.category, selectedFieldDetail.selectedValue, count);
                        const filtered = records.filter(record =>
                          !recordSearchTerm ||
                          record.name.toLowerCase().includes(recordSearchTerm.toLowerCase()) ||
                          record.id.toLowerCase().includes(recordSearchTerm.toLowerCase())
                        ).slice(0, 100);

                        return filtered.map((record, idx) => (
                          <div key={idx}>
                            <div className="flex items-center gap-2 py-3 hover:bg-gray-50 transition-colors">
                              <input
                                type="checkbox"
                                checked={selectedRecords.includes(record.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedRecords([...selectedRecords, record.id]);
                                  } else {
                                    setSelectedRecords(selectedRecords.filter(id => id !== record.id));
                                  }
                                }}
                                className="rounded flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0 grid grid-cols-3 gap-2 items-center text-xs">
                                <div className="truncate font-mono text-gray-600">{record.id}</div>
                                <div className="truncate font-medium text-gray-900">{record.name}</div>
                                <div className="truncate text-gray-600">{selectedFieldDetail.selectedValue}</div>
                              </div>
                            </div>
                            {idx < filtered.length - 1 && (
                              <div className="border-t border-gray-200"></div>
                            )}
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {fieldDetailTab === 'timeline' && (
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center text-gray-400">
                  <p className="text-sm">Timeline view coming soon</p>
                </div>
              )}

              {fieldDetailTab === 'more' && (
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center text-gray-400">
                  <p className="text-sm">Additional options coming soon</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {selectedSecondaryValue && (
        <>
          <div
            className="absolute top-0 h-full flex flex-col"
            style={{
              right: '0px',
              width: '320px',
              backgroundColor: '#F9FAFB',
              borderLeft: '2px solid #E5E7EB',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              zIndex: 51,
              animation: 'slideInRight 300ms cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
          >
            <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0" style={{ backgroundColor: 'white' }}>
              <div className="flex items-center gap-2 mb-3">
                <button onClick={() => { setSelectedSecondaryValue(null); setRecordSearchTerm(''); setSelectedRecords([]); }} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <ChevronRight className="w-5 h-5 rotate-180" strokeWidth={1.5} />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 truncate">{selectedSecondaryValue.selectedValue}</h3>
                  <p className="text-xs text-gray-500 truncate">{selectedSecondaryValue.category}</p>
                </div>
                <button onClick={() => { setSelectedSecondaryValue(null); setRecordSearchTerm(''); setSelectedRecords([]); }} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex gap-1 border-b border-gray-200">
                <button
                  onClick={() => setFieldDetailTab('overview')}
                  className={`px-3 py-1.5 text-xs font-medium ${fieldDetailTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600 -mb-px' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setFieldDetailTab('records')}
                  className={`px-3 py-1.5 text-xs font-medium ${fieldDetailTab === 'records' ? 'text-blue-600 border-b-2 border-blue-600 -mb-px' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Records
                </button>
                <button
                  onClick={() => setFieldDetailTab('timeline')}
                  className={`px-3 py-1.5 text-xs font-medium ${fieldDetailTab === 'timeline' ? 'text-blue-600 border-b-2 border-blue-600 -mb-px' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setFieldDetailTab('more')}
                  className={`px-3 py-1.5 text-xs font-medium ${fieldDetailTab === 'more' ? 'text-blue-600 border-b-2 border-blue-600 -mb-px' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  More
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4" style={{ backgroundColor: 'white' }}>
              {fieldDetailTab === 'overview' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-white rounded-lg border border-blue-100 shadow-sm">
                      <div className="text-xl font-bold text-blue-600">{getValueCount(selectedSecondaryValue.category, selectedSecondaryValue.selectedValue).toLocaleString()}</div>
                      <div className="text-xs text-gray-600 mt-0.5">Total Members</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-green-100 shadow-sm">
                      <div className="text-xl font-bold text-green-600">
                        {((getValueCount(selectedSecondaryValue.category, selectedSecondaryValue.selectedValue) / getCategoryTotal(selectedSecondaryValue.category)) * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">Of Total</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-900 mb-1.5">Description</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      This value represents members in the category &quot;{selectedSecondaryValue.category}&quot; with the specific
                      attribute &quot;{selectedSecondaryValue.selectedValue}&quot;. Use this filter to narrow your report results to only
                      include records matching this criteria.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-900 mb-2">Quick Actions</h4>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => {
                          addSelection(selectedSecondaryValue.category, selectedSecondaryValue.selectedValue, 'filter');
                          showToast(`Filter: ${selectedSecondaryValue.selectedValue}`);
                        }}
                        className="w-full flex items-center gap-2 p-2.5 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors border border-blue-100"
                      >
                        <Filter className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-xs font-medium text-blue-900">Add as Filter</span>
                      </button>
                      <button
                        onClick={() => {
                          addSelection(selectedSecondaryValue.category, selectedSecondaryValue.selectedValue, 'field');
                          showToast(`Field: ${selectedSecondaryValue.category}`);
                        }}
                        className="w-full flex items-center gap-2 p-2.5 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors border border-purple-100"
                      >
                        <Eye className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-xs font-medium text-purple-900">Add as Field</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {fieldDetailTab === 'records' && (
                <div className="space-y-3">
                  <div className="p-3">
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
                      <input
                        type="text"
                        value={recordSearchTerm}
                        onChange={(e) => setRecordSearchTerm(e.target.value)}
                        placeholder="Search records..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={() => {
                          const count = getValueCount(selectedSecondaryValue.category, selectedSecondaryValue.selectedValue);
                          const records = generateMockRecords(selectedSecondaryValue.category, selectedSecondaryValue.selectedValue, count);
                          const allIds = records.slice(0, 100).map(r => r.id);
                          setSelectedRecords(allIds);
                          showToast(`Selected ${allIds.length} records`);
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Select All
                      </button>
                      {selectedRecords.length > 0 && (
                        <button
                          onClick={() => {
                            setSelectedRecords([]);
                            showToast('Selection cleared');
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    <div className="max-h-[calc(100vh-280px)] overflow-auto">
                      {(() => {
                        const count = getValueCount(selectedSecondaryValue.category, selectedSecondaryValue.selectedValue);
                        const records = generateMockRecords(selectedSecondaryValue.category, selectedSecondaryValue.selectedValue, count);
                        const filtered = records.filter(record =>
                          !recordSearchTerm ||
                          record.name.toLowerCase().includes(recordSearchTerm.toLowerCase()) ||
                          record.id.toLowerCase().includes(recordSearchTerm.toLowerCase())
                        ).slice(0, 100);

                        return filtered.map((record, idx) => (
                          <div key={idx}>
                            <div className="flex items-center gap-2 py-3 hover:bg-gray-50 transition-colors">
                              <input
                                type="checkbox"
                                checked={selectedRecords.includes(record.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedRecords([...selectedRecords, record.id]);
                                  } else {
                                    setSelectedRecords(selectedRecords.filter(id => id !== record.id));
                                  }
                                }}
                                className="rounded flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0 grid grid-cols-3 gap-2 items-center text-xs">
                                <div className="truncate font-mono text-gray-600">{record.id}</div>
                                <div className="truncate font-medium text-gray-900">{record.name}</div>
                                <div className="truncate text-gray-600">{selectedSecondaryValue.selectedValue}</div>
                              </div>
                            </div>
                            {idx < filtered.length - 1 && (
                              <div className="border-t border-gray-200"></div>
                            )}
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {fieldDetailTab === 'timeline' && (
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center text-gray-400">
                  <p className="text-sm">Timeline view coming soon</p>
                </div>
              )}

              {fieldDetailTab === 'more' && (
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center text-gray-400">
                  <p className="text-sm">Additional options coming soon</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {fieldsPanel && (
        <>
          <div className="absolute inset-0 bg-black bg-opacity-20 z-40" onClick={() => { setFieldsPanel(null); setSelectedFieldDetail(null); setSelectedSecondaryValue(null); setRecordSearchTerm(''); setSelectedRecords([]); }} />

          <div
            className="absolute top-0 h-full bg-white border-l border-gray-200 shadow-2xl flex flex-col animate-slideInRight"
            style={{
              right: selectedFieldDetail ? (selectedSecondaryValue ? '620px' : '340px') : '0px',
              width: '480px',
              zIndex: 49,
              transition: 'right 300ms ease-in-out'
            }}
          >
            <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0" style={{ backgroundColor: 'white' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${SECTION_COLORS[fieldsPanel.section]?.bg || 'bg-gray-100'}`}>
                    {(() => {
                      const Icon = CATEGORY_ICONS[fieldsPanel.category] || Database;
                      return <Icon className={`w-4 h-4 ${SECTION_COLORS[fieldsPanel.section]?.icon || 'text-gray-600'}`} strokeWidth={1.5} />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{fieldsPanel.category}</h3>
                    <p className="text-xs text-gray-500">{fieldsPanel.section}</p>
                  </div>
                </div>
                <button
                  onClick={() => setFieldsPanel(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex gap-1 border-b border-gray-200 mb-4">
                <button
                  onClick={() => setFieldsPanelTab('fields')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${fieldsPanelTab === 'fields'
                    ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Fields
                </button>
                <button
                  onClick={() => setFieldsPanelTab('values')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${fieldsPanelTab === 'values'
                    ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Values
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder={fieldsPanelTab === 'fields' ? "Search fields..." : "Search values..."}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-gray-50" style={{ minWidth: 0 }}>
              {fieldsPanelTab === 'fields' ? (
                <div className="space-y-3">
                  {(CATEGORY_FIELDS[fieldsPanel.category] || DEFAULT_FIELDS).map((fieldName, idx) => {
                    const fieldKey = `${fieldsPanel.category}-field-${fieldName}`;
                    const settings = fieldSettings[fieldKey] || { visible: true, filtered: false, filterValue: '' };

                    return (
                      <div key={idx} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="p-3">
                          <div className="flex items-center gap-2">
                            <button className="cursor-move text-gray-400 hover:text-gray-600" title="Drag to reorder">
                              <span className="text-lg">⋮⋮</span>
                            </button>

                            <div className="flex-1 min-w-0 group relative">
                              <div className="font-medium text-sm text-gray-900 truncate">
                                {fieldName}
                              </div>
                              <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                                <div className="font-medium">Text • Data field</div>
                                <div className="text-gray-300 mt-0.5">Column: {fieldName}</div>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                const newSettings = { ...fieldSettings };
                                newSettings[fieldKey] = { ...settings, visible: !settings.visible };
                                setFieldSettings(newSettings);
                                if (!settings.visible) {
                                  addSelection(fieldsPanel.category, fieldName, 'field');
                                }
                              }}
                              className={`p-1.5 rounded transition-colors ${settings.visible ? 'bg-purple-50 text-purple-600' : 'text-gray-400 hover:bg-gray-100'}`}
                              title={settings.visible ? "Hide field" : "Show field"}
                            >
                              {settings.visible ? <Eye className="w-4 h-4" strokeWidth={1.5} /> : <EyeOff className="w-4 h-4" strokeWidth={1.5} />}
                            </button>

                            <button
                              onClick={() => {
                                const newSettings = { ...fieldSettings };
                                newSettings[fieldKey] = { ...settings, filtered: !settings.filtered };
                                setFieldSettings(newSettings);
                                if (!settings.filtered) {
                                  addSelection(fieldsPanel.category, fieldName, 'filter');
                                }
                              }}
                              className={`p-1.5 rounded transition-colors ${settings.filtered ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                              title="Add filter"
                            >
                              <Filter className="w-4 h-4" strokeWidth={1.5} />
                            </button>

                            <div className="relative group/menu">
                              <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded transition-colors" title="More options">
                                <span className="text-lg leading-none">…</span>
                              </button>
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover/menu:block z-10">
                                <div className="py-1">
                                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Sort Ascending</button>
                                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Sort Descending</button>
                                  <div className="border-t border-gray-100 my-1"></div>
                                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Group By</button>
                                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Aggregate</button>
                                  <div className="border-t border-gray-100 my-1"></div>
                                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Rename</button>
                                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Permissions</button>
                                  <div className="border-t border-gray-100 my-1"></div>
                                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Remove Field</button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {settings.filtered && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <input
                                type="text"
                                placeholder="Enter filter value..."
                                value={settings.filterValue || ''}
                                onChange={(e) => {
                                  const newSettings = { ...fieldSettings };
                                  newSettings[fieldKey] = { ...settings, filterValue: e.target.value };
                                  setFieldSettings(newSettings);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {(fieldsPanel.values || []).map((value, idx) => {
                    const count = getValueCount(fieldsPanel.category, value);
                    const totalCount = getCategoryTotal(fieldsPanel.category);
                    const percentage = ((count / totalCount) * 100).toFixed(1);

                    return (
                      <div key={idx} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors p-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              if (selectedFieldDetail && selectedFieldDetail.category === fieldsPanel.category) {
                                setSelectedSecondaryValue({
                                  category: fieldsPanel.category,
                                  section: fieldsPanel.section,
                                  values: fieldsPanel.values,
                                  selectedValue: value
                                });
                              } else {
                                setSelectedFieldDetail({
                                  category: fieldsPanel.category,
                                  section: fieldsPanel.section,
                                  values: fieldsPanel.values,
                                  selectedValue: value
                                });
                                setSelectedSecondaryValue(null);
                                setFieldDetailTab('overview');
                              }
                            }}
                            className="flex-1 min-w-0 text-left"
                          >
                            <div className="font-medium text-sm text-gray-900 truncate hover:text-blue-600 transition-colors">{value}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedFieldDetail({
                                    category: fieldsPanel.category,
                                    section: fieldsPanel.section,
                                    values: fieldsPanel.values,
                                    selectedValue: value
                                  });
                                  setSelectedSecondaryValue(null);
                                  setFieldDetailTab('records');
                                }}
                                className="text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors"
                              >
                                {count.toLocaleString()}
                              </button>
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
                                <div className={`h-full ${SECTION_COLORS[fieldsPanel.section]?.bg.replace('-50', '-400') || 'bg-blue-400'}`} style={{ width: `${percentage}%` }} />
                              </div>
                              <div className="text-xs text-gray-500">{percentage}%</div>
                            </div>
                          </button>
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addSelection(fieldsPanel.category, value, 'filter');
                                showToast(`Filter: ${value}`);
                              }}
                              className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                              title="Add as filter"
                            >
                              <Filter className="w-3.5 h-3.5 text-blue-600" strokeWidth={2} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addSelection(fieldsPanel.category, value, 'field');
                                showToast(`Field: ${fieldsPanel.category}`);
                              }}
                              className="p-1.5 hover:bg-purple-50 rounded transition-colors"
                              title="Add as field"
                            >
                              <Eye className="w-3.5 h-3.5 text-purple-600" strokeWidth={2} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white flex gap-2">
              {fieldsPanelTab === 'fields' ? (
                <>
                  <button
                    onClick={() => {
                      const fields = CATEGORY_FIELDS[fieldsPanel.category] || DEFAULT_FIELDS;
                      fields.forEach(fieldName => {
                        addSelection(fieldsPanel.category, fieldName, 'field');
                      });
                      setFieldsPanel(null);
                      showToast(`Added ${fields.length} fields`);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    Add All as Fields
                  </button>
                  <button
                    onClick={() => setFieldsPanel(null)}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
                  >
                    Done
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      (fieldsPanel.values || []).forEach(value => {
                        addSelection(fieldsPanel.category, value, 'filter');
                      });
                      setFieldsPanel(null);
                      showToast(`Added ${fieldsPanel.values?.length || 0} filters`);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    Add All as Filters
                  </button>
                  <button
                    onClick={() => setFieldsPanel(null)}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
                  >
                    Done
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-30" style={{ height: '88px' }}>
        <div className="h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-3" style={{ flex: '0 0 auto' }}>
            <button onClick={() => setPreviewExpanded(!previewExpanded)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors group" title="Toggle Preview">
              <ChevronRight className={`w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-transform ${previewExpanded ? 'rotate-90' : '-rotate-90'}`} strokeWidth={1} />
            </button>

            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
            </div>

            <div className="flex-1 max-w-2xl">
              <div className="text-sm font-semibold text-gray-900">{reportTitle}</div>
              <div className="text-xs text-gray-500">JD • {calculateFilterImpact(selections).toLocaleString()} records</div>
              {buildNaturalLanguageQuery() && (
                <div className="text-xs text-blue-700 mt-1 font-medium italic">
                  "{buildNaturalLanguageQuery()}"
                </div>
              )}
            </div>

            {selections.length > 0 && (
              <button
                onClick={clearAllSelections}
                className="ml-3 p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                title="Clear all selections"
              >
                <X className="w-4 h-4 text-gray-400 group-hover:text-red-500" strokeWidth={1.5} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2" style={{ flex: '0 0 auto' }}>
            {/* Load Query Button */}
            <div className="relative">
              <button
                onClick={() => setShowLoadQueryDropdown(!showLoadQueryDropdown)}
                className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group"
                title="Load Query"
              >
                <FileUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
              </button>

              {/* Load Query Dropdown */}
              {showLoadQueryDropdown && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowLoadQueryDropdown(false)} />
                  <div className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-40 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">Saved Queries</h3>
                      <p className="text-xs text-gray-500 mt-1">Select a query to load</p>
                    </div>
                    <div className="p-2">
                      {savedQueries.length > 0 ? (
                        savedQueries.map((query) => (
                          <button
                            key={query.id}
                            onClick={() => {
                              setSelections(query.selections.map(sel => ({ ...sel, id: Date.now() + Math.random() })));
                              setReportTitle(query.name);
                              setShowLoadQueryDropdown(false);
                              showToast(`Loaded: ${query.name}`);
                            }}
                            className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {query.name}
                                </div>
                                {query.description && (
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {query.description}
                                  </div>
                                )}
                                <div className="text-xs text-gray-400 mt-1">
                                  {query.selections.length} filter{query.selections.length !== 1 ? 's' : ''}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0 mt-0.5" />
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-8 text-center">
                          <p className="text-sm text-gray-500">No saved queries yet</p>
                          <p className="text-xs text-gray-400 mt-1">Create a query and click Save</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Export">
              <Download className="w-5 h-5 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
            </button>
            <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Schedule">
              <Calendar className="w-5 h-5 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
            </button>
            <button disabled={selections.length === 0} className={`p-4 rounded-full transition-all mx-2 ${selections.length > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`} title="Run Report">
              <Play className="w-6 h-6" strokeWidth={1.5} fill="currentColor" />
            </button>
            <button
              onClick={() => setShowSaveQueryPanel(true)}
              disabled={selections.length === 0}
              className={`p-2.5 rounded-lg transition-colors group ${selections.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              title="Save Query"
            >
              <Save className="w-5 h-5 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
            </button>
            <button onClick={() => setActivePanel('more')} className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="More Settings">
              <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex items-center gap-2" style={{ flex: '0 0 auto' }}>
            <button onClick={() => setActivePanel('fields')} className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Fields">
              <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
              {selections.filter(s => s.type === 'field').length > 0 && (
                <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {selections.filter(s => s.type === 'field').length}
                </div>
              )}
            </button>

            <button onClick={() => setActivePanel('filters')} className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Filters">
              <Filter className="w-4 h-4 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
              {selections.filter(s => s.type === 'filter').length > 0 && (
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {selections.filter(s => s.type === 'filter').length}
                </div>
              )}
            </button>

            <button onClick={() => setActivePanel('sort')} className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Sort">
              <ArrowUpDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
            </button>

            <button onClick={() => setActivePanel('grouping')} className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Grouping">
              <Grid3x3 className="w-4 h-4 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
            </button>

            <button onClick={() => setActivePanel('limits')} className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Row Limits">
              <Hash className="w-4 h-4 text-gray-400 group-hover:text-gray-600" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {activePanel && (
        <>
          <div className="absolute inset-0 bg-black bg-opacity-20 z-40" onClick={() => { setActivePanel(null); setWaterfallFromFilter(null); setDetailFromWaterfall(null); }} />

          <div
            className="absolute right-0 top-0 h-full min-w-max bg-white border-l border-gray-200 shadow-2xl flex flex-col animate-slideInRight"
            style={{
              right: (waterfallFromFilter || filterRecordsContext) ? (detailFromWaterfall ? '660px' : '550px') : '0px',
              zIndex: 49,
              transition: 'right 300ms ease-in-out'
            }}
          >
            <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {activePanel === 'fields' && 'Fields Configuration'}
                  {activePanel === 'filters' && 'Filters Builder'}
                  {activePanel === 'sort' && 'Sort Configuration'}
                  {activePanel === 'grouping' && 'Grouping Configuration'}
                  {activePanel === 'limits' && 'Limit Settings'}
                  {activePanel === 'settings' && 'Report Settings'}
                  {activePanel === 'more' && 'More Options'}
                </h3>
                <button onClick={() => setActivePanel(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#F9FAFB' }}>
              {activePanel === 'fields' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Manage which fields appear in your report output. Drag to reorder.
                    </p>
                    {selections.filter(s => s.type === 'field').length > 0 && (
                      <button
                        onClick={clearFields}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Clear All Fields
                      </button>
                    )}
                  </div>
                  {selections.filter(s => s.type === 'field').length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Eye className="w-12 h-12 mx-auto mb-2 opacity-20" strokeWidth={1.5} />
                      <p className="text-sm">No fields selected</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selections.filter(s => s.type === 'field').map((sel) => (
                        <div key={sel.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200">
                          <div className="cursor-move text-gray-400">::</div>
                          <Eye className="w-4 h-4 text-purple-600 flex-shrink-0" strokeWidth={1.5} />
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900">{sel.category}</div>
                            <div className="text-xs text-gray-600">{sel.value}</div>
                          </div>
                          <button onClick={() => removeSelection(sel.id)} className="text-gray-400 hover:text-red-500">
                            <X className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activePanel === 'filters' && (
                <div className="space-y-4 min-w-max">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-600">
                      Build filter logic with transparent impact analysis.
                    </p>
                    <div className="flex items-center gap-2">
                      {selections.filter(s => s.type === 'filter').length > 0 && (
                        <button
                          onClick={clearFilters}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Clear All Filters
                        </button>
                      )}
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showDeltas}
                          onChange={(e) => setShowDeltas(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-gray-700">Show impact analysis</span>
                      </label>
                    </div>
                  </div>

                  {selections.filter(s => s.type === 'filter').length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Filter className="w-12 h-12 mx-auto mb-2 opacity-20" strokeWidth={1.5} />
                      <p className="text-sm">No filters applied</p>
                      <p className="text-xs mt-1">Add filters from the main grid to see them here</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100 pr-10">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Starting Point</div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const records = generateMockRecords('All Members', 'Base Dataset', 7100);
                              setFilterRecordsContext({
                                label: 'Starting Point',
                                description: 'All members before filters applied',
                                count: 7100,
                                records: records
                              });
                            }}
                            className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            7,100
                          </button>
                        </div>

                        {(() => {
                          const filters = selections.filter(s => s.type === 'filter');
                          const totals = calculateSequentialTotals();

                          return filters.map((sel, idx) => {
                            const prevTotal = totals[idx];
                            const currentTotal = totals[idx + 1];
                            const delta = currentTotal - prevTotal;
                            const deltaPercent = ((delta / prevTotal) * 100).toFixed(1);

                            return (
                              <div key={sel.id}>
                                {idx > 0 && sel.connector && (
                                  <div className="flex items-center py-2">
                                    <select
                                      value={sel.connector || 'AND'}
                                      onChange={(e) => {
                                        setSelections(selections.map(s =>
                                          s.id === sel.id ? { ...s, connector: e.target.value } : s
                                        ));
                                      }}
                                      className="px-2 py-1 text-xs font-semibold bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    >
                                      <option value="AND">AND</option>
                                      <option value="OR">OR</option>
                                      <option value="BETWEEN">BETWEEN</option>
                                    </select>
                                  </div>
                                )}

                                <div className="flex items-center gap-3 py-2 group pr-10 relative">
                                  <div className="flex-1 min-w-max">
                                    <div className="flex items-center gap-2">
                                      <Filter className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" strokeWidth={1.5} />
                                      <button
                                        onClick={() => {
                                          const newWaterfall = {
                                            category: sel.category,
                                            value: sel.value,
                                            filterIndex: idx,
                                            values: SAMPLE_VALUES[sel.category] || []
                                          };

                                          if (!waterfallFromFilter || waterfallFromFilter.category !== sel.category) {
                                            const currentValues = sel.value.includes(',')
                                              ? sel.value.split(',').map(v => v.trim())
                                              : [sel.value];
                                            setWaterfallSelectedValues(currentValues);
                                          }

                                          setWaterfallFromFilter(newWaterfall);
                                        }}
                                        className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                      >
                                        {sel.category}
                                      </button>
                                      <select className="text-xs border-0 bg-transparent text-gray-500 px-1 py-0 focus:outline-none focus:ring-0">
                                        <option>{sel.value.includes(',') ? 'in' : 'equals'}</option>
                                        <option>not equals</option>
                                        <option>contains</option>
                                        <option>greater than</option>
                                        <option>less than</option>
                                      </select>
                                      <span className="text-sm text-gray-700">{sel.value}</span>
                                    </div>

                                    {showDeltas && (
                                      <div className="flex items-center gap-2 mt-1.5 ml-5">
                                        <span className="text-xs font-medium text-blue-600">
                                          {delta.toLocaleString()} ({deltaPercent}%)
                                        </span>
                                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[320px]">
                                          <div
                                            className="h-full bg-blue-400"
                                            style={{ width: `${Math.abs(parseFloat(deltaPercent))}%` }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <div className="text-sm font-bold text-gray-900">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const appliedFilters = selections
                                          .filter(s => s.type === 'filter')
                                          .slice(0, idx + 1)
                                          .map(f => `${f.category}: ${f.value}`)
                                          .join(', ');
                                        const records = generateMockRecords('Filtered', appliedFilters, currentTotal);
                                        setFilterRecordsContext({
                                          label: `After ${idx + 1} filter${idx === 0 ? '' : 's'}`,
                                          description: appliedFilters,
                                          count: currentTotal,
                                          records: records
                                        });
                                      }}
                                      className="hover:text-blue-600 transition-colors"
                                    >
                                      {currentTotal.toLocaleString()}
                                    </button>
                                  </div>

                                  <button
                                    onClick={() => removeSelection(sel.id)}
                                    className="absolute right-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                                  >
                                    <X className="w-4 h-4" strokeWidth={1.5} />
                                  </button>
                                </div>
                              </div>
                            );
                          });
                        })()}

                        <div className="mt-4 pt-4 border-t-2 border-gray-900 pr-10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" strokeWidth={2} />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">Final Result</div>
                                <div className="text-xs text-gray-500">Records matching all criteria</div>
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const finalCount = calculateSequentialTotals()[selections.filter(s => s.type === 'filter').length];
                                  const appliedFilters = selections
                                    .filter(s => s.type === 'filter')
                                    .map(f => `${f.category}: ${f.value}`)
                                    .join(', ');
                                  const records = generateMockRecords('Final Result', appliedFilters, finalCount);
                                  setFilterRecordsContext({
                                    label: 'Final Result',
                                    description: appliedFilters || 'All filters applied',
                                    count: finalCount,
                                    records: records
                                  });
                                }}
                                className="hover:text-blue-600 transition-colors"
                              >
                                {calculateSequentialTotals()[selections.filter(s => s.type === 'filter').length].toLocaleString()}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activePanel === 'sort' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Configure multi-level sorting for your report results.
                  </p>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="text-sm font-semibold mb-3">Sort Levels</h4>
                    {sortConfig.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">No sort configured</p>
                    ) : (
                      <div className="space-y-2">
                        {sortConfig.map((sort, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <span className="text-xs font-medium text-gray-500">#{idx + 1}</span>
                            <span className="text-sm flex-1">{sort.field}</span>
                            <button className="px-2 py-1 text-xs bg-white border rounded">
                              {sort.direction}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button className="mt-3 w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                      + Add Sort Level
                    </button>
                  </div>
                </div>
              )}

              {activePanel === 'grouping' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Group results and apply aggregations (count, sum, average).
                  </p>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="text-sm font-semibold mb-3">Group By</h4>
                    {groupConfig.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">No grouping configured</p>
                    ) : (
                      <div className="space-y-2">
                        {groupConfig.map((group, idx) => (
                          <div key={idx} className="p-2 bg-gray-50 rounded">
                            <div className="text-sm font-medium">{group.field}</div>
                            <div className="text-xs text-gray-500">{group.aggregation}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <button className="mt-3 w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                      + Add Grouping
                    </button>
                  </div>
                </div>
              )}

              {activePanel === 'limits' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Control how many results are returned.
                  </p>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <label className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        checked={limitConfig.enabled}
                        onChange={(e) => setLimitConfig({ ...limitConfig, enabled: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Enable row limit</span>
                    </label>
                    {limitConfig.enabled && (
                      <div>
                        <label className="text-sm text-gray-700 mb-2 block">Maximum rows</label>
                        <input
                          type="number"
                          value={limitConfig.value}
                          onChange={(e) => setLimitConfig({ ...limitConfig, value: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          min="1"
                          max="10000"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activePanel === 'settings' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Report Name</label>
                    <input
                      type="text"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={3}
                      placeholder="Optional description..."
                    />
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Base Dataset</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Current Members</option>
                      <option>All Contacts</option>
                      <option>Lapsed Members</option>
                    </select>
                  </div>
                </div>
              )}

              {activePanel === 'more' && (
                <div className="space-y-2">
                  <button onClick={() => setActivePanel('settings')} className="w-full flex items-center gap-3 p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors text-left">
                    <Settings className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Settings</div>
                      <div className="text-xs text-gray-500">Report name and configuration</div>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors text-left">
                    <Download className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Export</div>
                      <div className="text-xs text-gray-500">Download as CSV, Excel, or PDF</div>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors text-left">
                    <Calendar className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Schedule</div>
                      <div className="text-xs text-gray-500">Run automatically on a schedule</div>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors text-left">
                    <Save className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Save As</div>
                      <div className="text-xs text-gray-500">Create a copy of this report</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {(activePanel === 'settings' || activePanel === 'sort' || activePanel === 'grouping' || activePanel === 'limits') && (
              <div className="p-4 border-t border-gray-200 bg-white flex gap-2">
                <button onClick={() => setActivePanel(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={() => setActivePanel(null)} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">
                  Apply
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {waterfallFromFilter && (
        <div
          className="absolute top-0 h-full flex flex-col"
          style={{
            right: detailFromWaterfall ? '320px' : '0px',
            width: '360px',
            backgroundColor: '#F9FAFB',
            borderLeft: '2px solid #E5E7EB',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            zIndex: 50,
            transition: 'right 300ms ease-in-out'
          }}
        >
          <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => { setWaterfallFromFilter(null); setDetailFromWaterfall(null); }} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <ChevronRight className="w-5 h-5 rotate-180" strokeWidth={1.5} />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 truncate">{waterfallFromFilter.category}</h3>
                <p className="text-xs text-gray-500 truncate">From Filter Row #{waterfallFromFilter.filterIndex + 1}</p>
              </div>
              <button onClick={() => { setWaterfallFromFilter(null); setDetailFromWaterfall(null); }} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex gap-1 border-b border-gray-200">
              <button className="px-3 py-1.5 text-xs font-medium text-blue-600 border-b-2 border-blue-600 -mb-px">Distribution</button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900">Composition</button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="space-y-3">
              <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                <h4 className="text-xs font-semibold text-gray-900 mb-3">Value Distribution</h4>
                <div className="space-y-2">
                  {waterfallFromFilter.values.map((value, idx) => {
                    const count = getValueCount(waterfallFromFilter.category, value);
                    const totalCount = getCategoryTotal(waterfallFromFilter.category);
                    const percentage = ((count / totalCount) * 100).toFixed(1);
                    const isSelected = waterfallSelectedValues.includes(value);

                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setWaterfallSelectedValues([...waterfallSelectedValues, value]);
                            } else {
                              setWaterfallSelectedValues(waterfallSelectedValues.filter(v => v !== value));
                            }
                          }}
                          className="mt-1 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <button
                              onClick={() => {
                                setDetailFromWaterfall({
                                  category: waterfallFromFilter.category,
                                  value: value,
                                  count: count,
                                  percentage: percentage,
                                  filterIndex: waterfallFromFilter.filterIndex
                                });
                              }}
                              className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors truncate"
                            >
                              {value}
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs font-medium text-gray-600">{count.toLocaleString()}</div>
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-400" style={{ width: `${percentage}%` }} />
                            </div>
                            <div className="text-xs text-gray-500">{percentage}%</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                <h4 className="text-xs font-semibold text-gray-900 mb-2">Quick Actions</h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      if (waterfallSelectedValues.length === 0) {
                        showToast('Please select at least one value');
                        return;
                      }

                      const filters = selections.filter(s => s.type === 'filter');
                      const targetFilter = filters[waterfallFromFilter.filterIndex];
                      if (targetFilter) {
                        const newValue = waterfallSelectedValues.length === 1
                          ? waterfallSelectedValues[0]
                          : waterfallSelectedValues.join(', ');

                        const newSelections = selections.map(s =>
                          s.id === targetFilter.id ? { ...s, value: newValue } : s
                        );
                        setSelections(newSelections);
                        showToast(`Filter updated with ${waterfallSelectedValues.length} value(s)`);
                        setWaterfallFromFilter(null);
                        setWaterfallSelectedValues([]);
                      }
                    }}
                    disabled={waterfallSelectedValues.length === 0}
                    className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-lg text-left transition-colors border ${waterfallSelectedValues.length === 0
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-50 hover:bg-blue-100 border-blue-100 text-blue-900'
                      }`}
                  >
                    <Check className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
                    <span className="text-xs font-medium">
                      Apply Selection ({waterfallSelectedValues.length})
                    </span>
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    {waterfallSelectedValues.length > 1 ? 'Operator will change to IN' : 'Click value names to view details'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {detailFromWaterfall && (
        <div
          className="absolute top-0 h-full flex flex-col"
          style={{
            right: '0px',
            width: '360px',
            backgroundColor: '#F9FAFB',
            borderLeft: '2px solid #E5E7EB',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            zIndex: 51,
            animation: 'slideInRight 300ms cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
        >
          <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => { setDetailFromWaterfall(null); }} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <ChevronRight className="w-5 h-5 rotate-180" strokeWidth={1.5} />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 truncate">{detailFromWaterfall.value}</h3>
                <p className="text-xs text-gray-500 truncate">{detailFromWaterfall.category}</p>
              </div>
              <button onClick={() => { setDetailFromWaterfall(null); }} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex gap-1 border-b border-gray-200">
              <button className="px-3 py-1.5 text-xs font-medium text-blue-600 border-b-2 border-blue-600 -mb-px">Overview</button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900">Composition</button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-white rounded-lg border border-blue-100 shadow-sm">
                  <div className="text-xl font-bold text-blue-600">{detailFromWaterfall.count.toLocaleString()}</div>
                  <div className="text-xs text-gray-600 mt-0.5">Total Records</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-green-100 shadow-sm">
                  <div className="text-xl font-bold text-green-600">{detailFromWaterfall.percentage}%</div>
                  <div className="text-xs text-gray-600 mt-0.5">Of Total</div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                <h4 className="text-xs font-semibold text-gray-900 mb-1.5">Description</h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  This value represents records in &quot;{detailFromWaterfall.category}&quot; with the attribute &quot;{detailFromWaterfall.value}&quot;.
                  Review the composition below to understand what this segment contains before applying it to your filter.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                <h4 className="text-xs font-semibold text-gray-900 mb-2">Composition Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Career Stage:</span>
                    <span className="font-medium text-gray-900">Mixed distribution</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Geographic:</span>
                    <span className="font-medium text-gray-900">Multiple regions</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Workplace:</span>
                    <span className="font-medium text-gray-900">Varied settings</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                <h4 className="text-xs font-semibold text-gray-900 mb-2">Quick Actions</h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      if (waterfallSelectedValues.includes(detailFromWaterfall.value)) {
                        setWaterfallSelectedValues(waterfallSelectedValues.filter(v => v !== detailFromWaterfall.value));
                        showToast(`Removed from selection: ${detailFromWaterfall.value}`);
                      } else {
                        setWaterfallSelectedValues([detailFromWaterfall.value]);
                        showToast(`Selected: ${detailFromWaterfall.value}`);
                      }
                      setDetailFromWaterfall(null);
                    }}
                    className="w-full flex items-center gap-2 p-2.5 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors border border-blue-100"
                  >
                    <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" strokeWidth={1.5} />
                    <span className="text-xs font-medium text-blue-900">
                      {waterfallSelectedValues.includes(detailFromWaterfall.value) ? 'Deselect this value' : 'Select only this value'}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      addSelection(detailFromWaterfall.category, detailFromWaterfall.value, 'filter');
                      showToast(`Added as additional filter: ${detailFromWaterfall.value}`);
                    }}
                    className="w-full flex items-center gap-2 p-2.5 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors border border-purple-100"
                  >
                    <Plus className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" strokeWidth={1.5} />
                    <span className="text-xs font-medium text-purple-900">Add as additional filter</span>
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Return to distribution view to apply your selection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {recordsPanel && (
        <>
          <div className="absolute inset-0 bg-black bg-opacity-20 z-40" onClick={() => {
            setRecordsPanel(null);
            setSelectedRecords([]);
            setRecordSearchTerm('');
            setShowIslandActions(false);
          }} />

          <div
            className="absolute top-0 h-full bg-white border-l border-gray-200 shadow-2xl flex flex-col animate-slideInRight"
            style={{
              right: '0px',
              width: '600px',
              zIndex: 52
            }}
          >
            <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Records</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {recordsPanel.category}: {recordsPanel.value} ({recordsPanel.count.toLocaleString()} records)
                  </p>
                </div>
                <button
                  onClick={() => {
                    setRecordsPanel(null);
                    setSelectedRecords([]);
                    setRecordSearchTerm('');
                    setShowIslandActions(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex gap-1 border-b border-gray-200 mb-4">
                <button className="px-3 py-1.5 text-xs font-medium text-blue-600 border-b-2 border-blue-600 -mb-px">Records</button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
                <input
                  type="text"
                  value={recordSearchTerm}
                  onChange={(e) => setRecordSearchTerm(e.target.value)}
                  placeholder="Search records..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => {
                    const visibleRecords = recordsPanel.records
                      .filter(record =>
                        !recordSearchTerm ||
                        record.name.toLowerCase().includes(recordSearchTerm.toLowerCase()) ||
                        record.id.toLowerCase().includes(recordSearchTerm.toLowerCase()) ||
                        record.email.toLowerCase().includes(recordSearchTerm.toLowerCase())
                      )
                      .slice(0, 100)
                      .map(r => r.id);
                    setSelectedRecords(visibleRecords);
                    showToast(`Selected ${visibleRecords.length} records`);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Select All
                </button>
                {selectedRecords.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedRecords([]);
                      showToast('Selection cleared');
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-gray-50">
              <div className="p-4">
                <div className="space-y-2">
                  {recordsPanel.records
                    .filter(record =>
                      !recordSearchTerm ||
                      record.name.toLowerCase().includes(recordSearchTerm.toLowerCase()) ||
                      record.id.toLowerCase().includes(recordSearchTerm.toLowerCase()) ||
                      record.email.toLowerCase().includes(recordSearchTerm.toLowerCase())
                    )
                    .slice(0, 100)
                    .map((record, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors p-3"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedRecords.includes(record.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRecords([...selectedRecords, record.id]);
                              } else {
                                setSelectedRecords(selectedRecords.filter(id => id !== record.id));
                              }
                            }}
                            className="rounded"
                          />
                          <div className="flex-1 min-w-0 grid grid-cols-4 gap-3 items-center">
                            <div className="truncate">
                              <div className="text-sm font-medium text-gray-900">{record.name}</div>
                            </div>
                            <div className="truncate">
                              <div className="text-xs text-gray-500">{record.id}</div>
                            </div>
                            <div className="truncate">
                              <div className="text-xs text-gray-600">{record.email}</div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${record.status === 'Active' ? 'bg-green-100 text-green-700' :
                                record.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                {record.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                {recordsPanel.records.length > 100 && (
                  <div className="text-center mt-4 text-sm text-gray-500">
                    Showing first 100 of {recordsPanel.records.length} records
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {selectedRecords.length > 0 && (
        <>
          {showIslandActions && (
            <div
              className="absolute inset-0 z-50"
              onClick={() => setShowIslandActions(false)}
            />
          )}

          <div
            className="absolute left-1/2 transform -translate-x-1/2 bg-gray-900 text-white rounded-full shadow-2xl transition-all duration-300 ease-out"
            style={{
              bottom: showIslandActions ? '220px' : '110px',
              zIndex: 53,
              minWidth: showIslandActions ? '320px' : '200px'
            }}
          >
            {!showIslandActions ? (
              <button
                onClick={() => setShowIslandActions(true)}
                className="flex items-center gap-3 px-6 py-3 w-full hover:bg-gray-800 rounded-full transition-colors"
              >
                <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
                  <Check className="w-4 h-4" strokeWidth={2} />
                </div>
                <span className="font-semibold">{selectedRecords.length} record{selectedRecords.length !== 1 ? 's' : ''} selected</span>
                <ChevronDown className="w-4 h-4 ml-auto rotate-180" strokeWidth={2} />
              </button>
            ) : (
              <div className="p-2">
                <button
                  onClick={() => setShowIslandActions(false)}
                  className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-800 rounded-lg transition-colors mb-1"
                >
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
                    <Check className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <span className="font-semibold">{selectedRecords.length} record{selectedRecords.length !== 1 ? 's' : ''} selected</span>
                  <ChevronDown className="w-4 h-4 ml-auto" strokeWidth={2} />
                </button>

                <div className="border-t border-gray-700 my-1"></div>

                <button
                  onClick={() => {
                    showToast(`Exporting ${selectedRecords.length} records...`);
                    setShowIslandActions(false);
                  }}
                  className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-800 rounded-lg transition-colors text-left"
                >
                  <Download className="w-4 h-4" strokeWidth={1.5} />
                  <span className="text-sm">Export Selected</span>
                </button>

                <button
                  onClick={() => {
                    showToast(`Adding ${selectedRecords.length} records to list...`);
                    setShowIslandActions(false);
                  }}
                  className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-800 rounded-lg transition-colors text-left"
                >
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                  <span className="text-sm">Add to List</span>
                </button>

                <button
                  onClick={() => {
                    showToast(`Preparing email for ${selectedRecords.length} records...`);
                    setShowIslandActions(false);
                  }}
                  className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-800 rounded-lg transition-colors text-left"
                >
                  <Mail className="w-4 h-4" strokeWidth={1.5} />
                  <span className="text-sm">Send Email</span>
                </button>

                <div className="border-t border-gray-700 my-1"></div>

                <button
                  onClick={() => {
                    setSelectedRecords([]);
                    setShowIslandActions(false);
                    showToast('Selection cleared');
                  }}
                  className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-800 rounded-lg transition-colors text-left text-red-400"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                  <span className="text-sm">Clear Selection</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Save Query Panel */}
      {showSaveQueryPanel && (
        <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-xl z-50 flex flex-col border-l border-gray-200">
          <div className="border-b border-gray-200 bg-white px-6 py-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Save Query</h2>
              <button
                onClick={() => setShowSaveQueryPanel(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Current Query Display */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Current Query
              </label>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex flex-wrap gap-2">
                  {selections.map((sel) => (
                    <div
                      key={sel.id}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${
                        sel.type === 'filter'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {sel.type === 'filter' ? <Filter className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{sel.category}: {sel.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Query Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={savedQueryName}
                onChange={(e) => setSavedQueryName(e.target.value)}
                placeholder="e.g., 2019 Members - December Renewals"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Description Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-gray-400 text-xs font-normal">(Optional)</span>
              </label>
              <textarea
                value={savedQueryDescription}
                onChange={(e) => setSavedQueryDescription(e.target.value)}
                placeholder="Add a description for this saved query..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Info Box */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600">
                <strong>Tip:</strong> Saved queries can be quickly accessed from the Load Query button and reused across sessions.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSaveQueryPanel(false);
                  setSavedQueryName('');
                  setSavedQueryDescription('');
                }}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (savedQueryName.trim()) {
                    const newQuery = {
                      id: Date.now(),
                      name: savedQueryName,
                      description: savedQueryDescription,
                      selections: selections.map(sel => ({ ...sel }))
                    };
                    setSavedQueries([...savedQueries, newQuery]);
                    setShowSaveQueryPanel(false);
                    setSavedQueryName('');
                    setSavedQueryDescription('');
                    showToast(`Query saved: ${savedQueryName}`);
                  }
                }}
                disabled={!savedQueryName.trim()}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  savedQueryName.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Save Query
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportBuilder;