/**
 * Central Events Dashboard - Refactored Entry Point
 *
 * This is the main entry point for the Events Dashboard, using a modular architecture.
 * All reusable components, hooks, utilities, and design tokens have been extracted
 * into their respective modules.
 *
 * Module Structure:
 * - design-system/: Tokens, themes, icons
 * - hooks/: Custom React hooks
 * - utils/: Utility functions
 * - components/: Reusable UI components
 * - features/: Feature-specific components (toast, accessibility, calendar, etc.)
 * - data/: Mock data and constants
 */

import React, { useState, useMemo, useEffect } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Design System
import {
  SPACING,
  ICONS,
  ThemeProvider,
  useTheme,
} from './design-system';

// Hooks
import { useFocusRing } from './hooks';

// Utils
import {
  getTransition,
  prefersReducedMotion,
  computeKpis,
  groupByField,
  filterAttendees,
  computeRenewalByProvince,
  injectAnimations,
} from './utils';

// Components
import {
  SkeletonLoader,
  TableSkeleton,
  CardSkeleton,
  ChartSkeleton,
  EmptyState,
  ErrorBoundary,
  GlobalTopNavBar,
} from './components';

// Features
import {
  ToastProvider,
  useToast,
  SkipLink,
  LiveRegion,
  CommandPalette,
  SaveViewModal,
  ExportMenu,
  ListingFilterHeader,
  WorkspaceNavigator,
  CalendarView,
  EventPeek,
} from './features';

// Data
import {
  MOCK_EVENT,
  MOCK_ATTENDEES,
  enrichAttendeesWithListData,
} from './data';

// Inject CSS animations
injectAnimations();

// ==================== MAIN APP COMPONENT ====================

function CentralEventReportingDemoInner() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [view, setView] = useState("calendar");
  const [showPeek, setShowPeek] = useState(false);
  const [showInsightsPanel, setShowInsightsPanel] = useState(false);
  const [showInsightsSlideout, setShowInsightsSlideout] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const enrichedAttendees = useMemo(() => enrichAttendeesWithListData(MOCK_ATTENDEES), []);
  const kpis = useMemo(() => computeKpis(MOCK_ATTENDEES), []);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Command palette keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommandNavigate = (item) => {
    if (item.type === 'tab') {
      setView("event");
    } else if (item.type === 'action') {
      if (item.id === 'action-insights') {
        setShowInsightsSlideout(true);
      }
    }
  };

  return (
    <>
      <SkipLink targetId="main-content" />
      <GlobalTopNavBar onOpenCommandPalette={() => setShowCommandPalette(true)} />

      <div
        id="main-content"
        style={{
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          paddingTop: "48px",
          background: theme.backgroundPage,
          minHeight: "100vh",
          color: theme.textPrimary,
          transition: getTransition(["background", "color"], "normal"),
        }}
      >
        {/* Theme Toggle */}
        <div style={{ position: "fixed", bottom: SPACING.lg, right: SPACING.lg, zIndex: 50 }}>
          <button
            onClick={toggleTheme}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: `1px solid ${theme.border}`,
              background: theme.background,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.textMuted,
              boxShadow: theme.shadowMd,
              transition: getTransition(["background", "color", "transform"], "fast"),
            }}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <ICONS.sun size={18} /> : <ICONS.moon size={18} />}
          </button>
        </div>

        {view === "calendar" && <WorkspaceNavigator onOpenCalendar={() => setView("calendar")} />}

        {isLoading ? (
          <div style={{ marginTop: SPACING.xl }}>
            <ChartSkeleton height="300px" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: SPACING.lg, marginTop: SPACING.lg }}>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        ) : (
          <>
            {view === "calendar" && (
              <CalendarView
                event={MOCK_EVENT}
                onEventClick={() => setShowPeek(true)}
              />
            )}

            {showPeek && (
              <EventPeek
                event={MOCK_EVENT}
                kpis={kpis}
                onClose={() => setShowPeek(false)}
                onViewEvent={() => {
                  setShowPeek(false);
                  setView("event");
                }}
              />
            )}

            {view === "event" && (
              <EventDetailLayout
                event={MOCK_EVENT}
                attendees={enrichedAttendees}
                kpis={kpis}
                onBackToCalendar={() => setView("calendar")}
                showInsightsPanel={showInsightsPanel}
                setShowInsightsPanel={setShowInsightsPanel}
                showInsightsSlideout={showInsightsSlideout}
                setShowInsightsSlideout={setShowInsightsSlideout}
              />
            )}
          </>
        )}

        <CommandPalette
          isOpen={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          onNavigate={handleCommandNavigate}
          attendees={enrichedAttendees}
        />
      </div>
    </>
  );
}

// Main App Component with Providers
function CentralEventReportingDemo() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ErrorBoundary>
          <CentralEventReportingDemoInner />
        </ErrorBoundary>
      </ToastProvider>
    </ThemeProvider>
  );
}

// ==================== EVENT DETAIL LAYOUT ====================
// Note: This is a large component that could be further extracted into features/event-detail

function EventDetailLayout({
  event,
  attendees,
  kpis,
  onBackToCalendar,
  showInsightsPanel,
  setShowInsightsPanel,
  showInsightsSlideout,
  setShowInsightsSlideout,
}) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [showChartPreview, setShowChartPreview] = useState(false);
  const [chartPreviewData, setChartPreviewData] = useState(null);

  const isPastEvent = new Date(event.endDate) < new Date();

  return (
    <div>
      {/* Hero Header */}
      <div
        style={{
          position: "relative",
          background: "#4b5563",
          minHeight: "180px",
          overflow: "hidden",
        }}
      >
        {/* Map Background Pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cpath d='M50 150 Q100 100 150 120 T250 100 T350 130' stroke='%23fff' fill='none' stroke-width='2'/%3E%3C/svg%3E")`,
            backgroundSize: "cover",
          }}
        />

        {/* City Name Watermark */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "10%",
            transform: "translateY(-50%)",
            fontSize: "3rem",
            fontWeight: 300,
            color: "rgba(255, 255, 255, 0.08)",
            letterSpacing: "0.5rem",
            textTransform: "uppercase",
            pointerEvents: "none",
          }}
        >
          ST. JOHN'S
        </div>

        {/* Back Button */}
        <button
          onClick={onBackToCalendar}
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            border: "none",
            color: "#d1d5db",
            fontSize: "13px",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          <ICONS.arrowLeft size={16} color="#d1d5db" />
          Back to Calendar
        </button>

        {/* Past Event Badge */}
        {isPastEvent && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "#3b82f6",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 500,
              padding: "6px 14px",
              borderRadius: "4px",
            }}
          >
            Past Event
          </div>
        )}

        {/* Event Info */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ICONS.calendar size={24} color="#ffffff" />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, color: "#ffffff", fontSize: "1.5rem", fontWeight: 600 }}>
                {event.name}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#9ca3af", fontSize: "0.875rem" }}>
                <ICONS.calendar size={14} color="#9ca3af" />
                <span>June 12 - 14, 2025</span>
                <span style={{ margin: "0 4px" }}>·</span>
                <ICONS.mapPin size={14} color="#9ca3af" />
                <span>St. John's, NL</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", marginTop: "16px" }}>
            {[
              { id: "profile", label: "Profile" },
              { id: "activities", label: "Activities" },
              { id: "more", label: "More" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: activeTab === tab.id ? 500 : 400,
                  color: activeTab === tab.id ? "#ffffff" : "#9ca3af",
                  borderBottom: activeTab === tab.id ? "2px solid #ffffff" : "2px solid transparent",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ background: theme.background, padding: "24px", minHeight: "calc(100vh - 228px)" }}>
        {activeTab === "profile" && (
          <EventProfileTab
            event={event}
            attendees={attendees}
            kpis={kpis}
            onOpenInsights={() => setShowInsightsPanel(true)}
          />
        )}
        {activeTab === "activities" && <EventActivitiesTab />}
        {activeTab === "more" && (
          <EventMoreTab
            attendees={attendees}
            onOpenInsightsSlideout={() => setShowInsightsSlideout(true)}
          />
        )}
      </div>
    </div>
  );
}

// ==================== EVENT TABS ====================

function EventProfileTab({ event, attendees, kpis, onOpenInsights }) {
  const { theme } = useTheme();

  const registrationData = [
    { date: "Apr 1", registrations: 45, revenue: 22500 },
    { date: "Apr 8", registrations: 78, revenue: 39000 },
    { date: "Apr 15", registrations: 120, revenue: 60000 },
    { date: "May 1", registrations: 180, revenue: 90000 },
    { date: "May 15", registrations: 250, revenue: 125000 },
    { date: "Jun 1", registrations: 320, revenue: 160000 },
  ];

  const funnelData = [
    { stage: "Registration Page", count: 2450, percent: 100 },
    { stage: "Type Selection", count: 1960, percent: 80 },
    { stage: "Options", count: 1470, percent: 60 },
    { stage: "Checkout", count: 980, percent: 40 },
    { stage: "Confirmed", count: 847, percent: 35 },
  ];

  const typeData = groupByField(attendees, "memberType");

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: "24px" }}>
      {/* Left Column */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* KPIs */}
        <KeyMetricsPanel kpis={kpis} />

        {/* Chart */}
        <div style={{ background: theme.background, borderRadius: SPACING.sm, padding: SPACING.lg, border: `1px solid ${theme.border}` }}>
          <h3 style={{ margin: 0, marginBottom: SPACING.lg, fontSize: "1rem", color: theme.textPrimary }}>
            Cumulative Registrations & Revenue
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={registrationData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
              <XAxis dataKey="date" tick={{ fill: theme.textMuted, fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fill: theme.textMuted, fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: theme.textMuted, fontSize: 12 }} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="registrations" fill={theme.primary} name="Registrations" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke={theme.success} strokeWidth={2} name="Revenue" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Funnel */}
        <div style={{ background: theme.background, borderRadius: SPACING.sm, padding: SPACING.lg, border: `1px solid ${theme.border}` }}>
          <h3 style={{ margin: 0, marginBottom: SPACING.lg, fontSize: "1rem", color: theme.textPrimary }}>
            Registration Funnel
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: SPACING.sm }}>
            {funnelData.map((stage, idx) => (
              <div key={stage.stage} style={{ display: "flex", alignItems: "center", gap: SPACING.md }}>
                <div style={{ width: "140px", fontSize: "0.8rem", color: theme.textSecondary }}>{stage.stage}</div>
                <div style={{ flex: 1, height: "24px", background: theme.backgroundTertiary, borderRadius: SPACING.xs, overflow: "hidden" }}>
                  <div style={{ width: `${stage.percent}%`, height: "100%", background: `linear-gradient(90deg, ${theme.primary}, #0ea5e9)`, transition: "width 0.5s ease" }} />
                </div>
                <div style={{ width: "60px", fontSize: "0.8rem", color: theme.textPrimary, textAlign: "right" }}>{stage.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Types & Revenue */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: SPACING.lg }}>
          <div style={{ background: theme.background, borderRadius: SPACING.sm, padding: SPACING.lg, border: `1px solid ${theme.border}` }}>
            <h3 style={{ margin: 0, marginBottom: SPACING.lg, fontSize: "1rem", color: theme.textPrimary }}>
              Attendee Types
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={typeData} dataKey="count" nameKey="label" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                  {typeData.map((entry, idx) => (
                    <Cell key={idx} fill={["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"][idx % 5]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: theme.background, borderRadius: SPACING.sm, padding: SPACING.lg, border: `1px solid ${theme.border}` }}>
            <h3 style={{ margin: 0, marginBottom: SPACING.lg, fontSize: "1rem", color: theme.textPrimary }}>
              Revenue by Type
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: SPACING.sm }}>
              {typeData.slice(0, 4).map((type, idx) => (
                <div key={type.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: theme.textSecondary }}>{type.label}</span>
                  <span style={{ fontWeight: 600, color: theme.textPrimary }}>${(type.count * 500).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <QuickLinksPanel onOpenInsights={onOpenInsights} />
        <AlertsPanel />
        <UpcomingViewsPanel />
      </div>
    </div>
  );
}

function KeyMetricsPanel({ kpis }) {
  const { theme } = useTheme();
  const metrics = [
    { label: "Total Attendees", value: kpis.totalAttendees, change: "+12%", positive: true },
    { label: "Total Revenue", value: `$${(kpis.totalRevenue / 1000).toFixed(0)}k`, change: "+8%", positive: true },
    { label: "Avg per Attendee", value: `$${Math.round(kpis.totalRevenue / kpis.totalAttendees)}`, change: "-2%", positive: false },
    { label: "Members", value: kpis.members, change: "+15%", positive: true },
    { label: "Non-Members", value: kpis.nonMembers, change: "+5%", positive: true },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: SPACING.md }}>
      {metrics.map((metric) => (
        <div
          key={metric.label}
          style={{
            background: theme.background,
            borderRadius: SPACING.sm,
            padding: SPACING.md,
            border: `1px solid ${theme.border}`,
          }}
        >
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: theme.textPrimary }}>{metric.value}</div>
          <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginTop: SPACING.xs }}>{metric.label}</div>
          <div style={{ fontSize: "0.7rem", color: metric.positive ? theme.success : theme.error, marginTop: SPACING.xs }}>
            {metric.change}
          </div>
        </div>
      ))}
    </div>
  );
}

function QuickLinksPanel({ onOpenInsights }) {
  const { theme } = useTheme();
  const links = [
    { icon: ICONS.users, label: "Manage Attendees", description: "View and edit attendee list" },
    { icon: ICONS.insights, label: "Insights Studio", description: "Analyze attendee data", onClick: onOpenInsights },
    { icon: ICONS.reports, label: "Generate Report", description: "Create custom reports" },
    { icon: ICONS.settings, label: "Event Settings", description: "Configure event options" },
  ];

  return (
    <div style={{ background: theme.background, borderRadius: SPACING.sm, padding: SPACING.lg, border: `1px solid ${theme.border}` }}>
      <h3 style={{ margin: 0, marginBottom: SPACING.lg, fontSize: "1rem", color: theme.textPrimary }}>Quick Links</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: SPACING.sm }}>
        {links.map((link) => (
          <button
            key={link.label}
            onClick={link.onClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: SPACING.md,
              padding: SPACING.sm,
              border: "none",
              background: "transparent",
              borderRadius: SPACING.xs,
              cursor: "pointer",
              textAlign: "left",
              transition: getTransition("background", "fast"),
            }}
          >
            <link.icon size={20} color={theme.primary} />
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 500, color: theme.textPrimary }}>{link.label}</div>
              <div style={{ fontSize: "0.7rem", color: theme.textMuted }}>{link.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AlertsPanel() {
  const { theme } = useTheme();
  const alerts = [
    { type: "warning", message: "5 registrations pending review" },
    { type: "info", message: "New payment received" },
  ];

  return (
    <div style={{ background: theme.background, borderRadius: SPACING.sm, padding: SPACING.lg, border: `1px solid ${theme.border}` }}>
      <h3 style={{ margin: 0, marginBottom: SPACING.lg, fontSize: "1rem", color: theme.textPrimary }}>Alerts</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: SPACING.sm }}>
        {alerts.map((alert, idx) => (
          <div
            key={idx}
            style={{
              padding: SPACING.sm,
              background: alert.type === "warning" ? theme.warningLight : theme.primaryLight,
              borderRadius: SPACING.xs,
              fontSize: "0.8rem",
              color: theme.textPrimary,
            }}
          >
            {alert.message}
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingViewsPanel() {
  const { theme } = useTheme();
  const views = [
    { name: "All Attendees", count: 847 },
    { name: "Members Only", count: 623 },
    { name: "Pending Payment", count: 24 },
  ];

  return (
    <div style={{ background: theme.background, borderRadius: SPACING.sm, padding: SPACING.lg, border: `1px solid ${theme.border}` }}>
      <h3 style={{ margin: 0, marginBottom: SPACING.lg, fontSize: "1rem", color: theme.textPrimary }}>Saved Views</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: SPACING.sm }}>
        {views.map((view) => (
          <div key={view.name} style={{ display: "flex", justifyContent: "space-between", padding: SPACING.sm, cursor: "pointer" }}>
            <span style={{ fontSize: "0.85rem", color: theme.textPrimary }}>{view.name}</span>
            <span style={{ fontSize: "0.75rem", color: theme.textMuted }}>{view.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventActivitiesTab() {
  const { theme } = useTheme();
  return (
    <div style={{ textAlign: "center", padding: SPACING.xxl }}>
      <EmptyState
        variant="activities"
        title="No recent activities"
        description="Activities will appear here as attendees interact with your event."
      />
    </div>
  );
}

function EventMoreTab({ attendees, onOpenInsightsSlideout }) {
  const { theme } = useTheme();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: SPACING.lg }}>
      <div style={{ background: theme.background, borderRadius: SPACING.sm, padding: SPACING.lg, border: `1px solid ${theme.border}` }}>
        <h4 style={{ margin: 0, marginBottom: SPACING.md, color: theme.textPrimary }}>Tools</h4>
        <button
          onClick={onOpenInsightsSlideout}
          style={{
            width: "100%",
            padding: SPACING.md,
            border: `1px solid ${theme.border}`,
            borderRadius: SPACING.sm,
            background: theme.background,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <ICONS.insights size={20} color={theme.primary} />
          <div style={{ marginTop: SPACING.sm, fontWeight: 500, color: theme.textPrimary }}>Insights Studio</div>
          <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>Analyze data patterns</div>
        </button>
      </div>
    </div>
  );
}

export default CentralEventReportingDemo;
