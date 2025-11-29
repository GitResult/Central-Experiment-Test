import React, { useState, useMemo } from "react";
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

// -------------------- Mock Data --------------------

const MOCK_EVENT = {
  id: "cpa-2025",
  name: "2025 CPA Annual National Convention",
  startDate: "2025-06-12",
  endDate: "2025-06-14",
  venue: "St. John’s Convention Centre",
  totalRevenue: 780000,
};

const MOCK_ATTENDEES = [
  {
    id: 1,
    name: "Alice Member",
    memberType: "CPA",
    membershipStatus: "Current",
    isComplimentary: false,
    isMember: true,
    ageGroup: "35-44",
    province: "Newfoundland and Labrador",
    education: "Masters",
    primaryReason: "Networking",
    registrationType: "Full Conference",
    dietary: "None",
    session: "Audit Track",
    ticketType: "Paid",
    renewed: true,
  },
  {
    id: 2,
    name: "Bob NonMember",
    memberType: "Non-member",
    membershipStatus: "Non-member",
    isComplimentary: false,
    isMember: false,
    ageGroup: "25-34",
    province: "Ontario",
    education: "Bachelors",
    primaryReason: "Learning",
    registrationType: "Workshop Only",
    dietary: "Vegetarian",
    session: "Tax Track",
    ticketType: "Paid",
    renewed: false,
  },
  {
    id: 3,
    name: "Carol Lapsed",
    memberType: "CPA",
    membershipStatus: "Lapsed",
    isComplimentary: false,
    isMember: false,
    ageGroup: "45-54",
    province: "Newfoundland and Labrador",
    education: "Bachelors",
    primaryReason: "Networking",
    registrationType: "Full Conference",
    dietary: "None",
    session: "Leadership Track",
    ticketType: "Paid",
    renewed: false,
  },
  {
    id: 4,
    name: "David Complimentary",
    memberType: "CPA",
    membershipStatus: "Current",
    isComplimentary: true,
    isMember: true,
    ageGroup: "55-64",
    province: "Nova Scotia",
    education: "Masters",
    primaryReason: "Speaker",
    registrationType: "Speaker",
    dietary: "Gluten-free",
    session: "Keynote",
    ticketType: "Complimentary",
    renewed: true,
  },
  {
    id: 5,
    name: "Eva Student",
    memberType: "Student",
    membershipStatus: "Current",
    isComplimentary: false,
    isMember: true,
    ageGroup: "18-24",
    province: "Ontario",
    education: "Undergrad",
    primaryReason: "Career",
    registrationType: "Student Pass",
    dietary: "None",
    session: "Student Track",
    ticketType: "Paid",
    renewed: true,
  },
  {
    id: 6,
    name: "Farid Guest",
    memberType: "Guest",
    membershipStatus: "Non-member",
    isComplimentary: true,
    isMember: false,
    ageGroup: "35-44",
    province: "Quebec",
    education: "Bachelors",
    primaryReason: "Guest",
    registrationType: "Guest",
    dietary: "Halal",
    session: "Social Events",
    ticketType: "Complimentary",
    renewed: false,
  },
  {
    id: 7,
    name: "Grace Member",
    memberType: "CPA",
    membershipStatus: "Current",
    isComplimentary: false,
    isMember: true,
    ageGroup: "45-54",
    province: "Newfoundland and Labrador",
    education: "PhD",
    primaryReason: "Thought Leadership",
    registrationType: "Full Conference",
    dietary: "Vegan",
    session: "Research Track",
    ticketType: "Paid",
    renewed: true,
  },
  {
    id: 8,
    name: "Henry Lapsed",
    memberType: "CPA",
    membershipStatus: "Lapsed",
    isComplimentary: false,
    isMember: false,
    ageGroup: "55-64",
    province: "Ontario",
    education: "Masters",
    primaryReason: "Networking",
    registrationType: "Full Conference",
    dietary: "None",
    session: "Audit Track",
    ticketType: "Paid",
    renewed: false,
  },
  {
    id: 9,
    name: "Jasmine Wong",
    memberType: "CPA",
    membershipStatus: "Current",
    isComplimentary: false,
    isMember: true,
    ageGroup: "35-44",
    province: "Ontario",
    education: "Masters",
    primaryReason: "Professional Development",
    registrationType: "Full Conference",
    dietary: "Vegetarian",
    session: "Technology Track",
    ticketType: "Paid",
    renewed: true,
  },
  {
    id: 10,
    name: "Mohammed Hassan",
    memberType: "CPA",
    membershipStatus: "Current",
    isComplimentary: false,
    isMember: true,
    ageGroup: "45-54",
    province: "Newfoundland and Labrador",
    education: "Bachelors",
    primaryReason: "Networking",
    registrationType: "Full Conference",
    dietary: "Halal",
    session: "Audit Track",
    ticketType: "Paid",
    renewed: true,
  },
  {
    id: 11,
    name: "Sarah Chen",
    memberType: "Student",
    membershipStatus: "Current",
    isComplimentary: false,
    isMember: true,
    ageGroup: "25-34",
    province: "Alberta",
    education: "Undergrad",
    primaryReason: "Career",
    registrationType: "Student Pass",
    dietary: "None",
    session: "Student Track",
    ticketType: "Paid",
    renewed: true,
  },
  {
    id: 12,
    name: "Pierre Dubois",
    memberType: "CPA",
    membershipStatus: "Current",
    isComplimentary: false,
    isMember: true,
    ageGroup: "45-54",
    province: "Quebec",
    education: "Masters",
    primaryReason: "Networking",
    registrationType: "Full Conference",
    dietary: "None",
    session: "Leadership Track",
    ticketType: "Paid",
    renewed: false,
  },
  {
    id: 13,
    name: "Priya Patel",
    memberType: "CPA",
    membershipStatus: "Current",
    isComplimentary: false,
    isMember: true,
    ageGroup: "35-44",
    province: "Newfoundland and Labrador",
    education: "Bachelors",
    primaryReason: "Learning",
    registrationType: "Full Conference",
    dietary: "Vegetarian",
    session: "Tax Track",
    ticketType: "Paid",
    renewed: true,
  },
  {
    id: 14,
    name: "James MacLeod",
    memberType: "Non-member",
    membershipStatus: "Non-member",
    isComplimentary: false,
    isMember: false,
    ageGroup: "25-34",
    province: "Nova Scotia",
    education: "Bachelors",
    primaryReason: "Exploring Membership",
    registrationType: "Workshop Only",
    dietary: "None",
    session: "Tax Track",
    ticketType: "Paid",
    renewed: false,
  },
  {
    id: 15,
    name: "Emily Rodriguez",
    memberType: "CPA",
    membershipStatus: "Current",
    isComplimentary: false,
    isMember: true,
    ageGroup: "45-54",
    province: "Ontario",
    education: "PhD",
    primaryReason: "Thought Leadership",
    registrationType: "Full Conference",
    dietary: "Gluten-free",
    session: "Research Track",
    ticketType: "Paid",
    renewed: true,
  },
  {
    id: 16,
    name: "Kevin O'Brien",
    memberType: "CPA",
    membershipStatus: "Lapsed",
    isComplimentary: false,
    isMember: false,
    ageGroup: "55-64",
    province: "Newfoundland and Labrador",
    education: "Bachelors",
    primaryReason: "Networking",
    registrationType: "Full Conference",
    dietary: "None",
    session: "Audit Track",
    ticketType: "Paid",
    renewed: false,
  },
  {
    id: 17,
    name: "Aisha Mohammed",
    memberType: "Student",
    membershipStatus: "Current",
    isComplimentary: false,
    isMember: true,
    ageGroup: "18-24",
    province: "British Columbia",
    education: "Undergrad",
    primaryReason: "Career",
    registrationType: "Student Pass",
    dietary: "Halal",
    session: "Student Track",
    ticketType: "Paid",
    renewed: true,
  },
  {
    id: 18,
    name: "Robert Kim",
    memberType: "CPA",
    membershipStatus: "Current",
    isComplimentary: false,
    isMember: true,
    ageGroup: "35-44",
    province: "Ontario",
    education: "Masters",
    primaryReason: "Professional Development",
    registrationType: "Full Conference",
    dietary: "None",
    session: "Technology Track",
    ticketType: "Paid",
    renewed: true,
  },
  {
    id: 19,
    name: "Marie Tremblay",
    memberType: "Non-member",
    membershipStatus: "Non-member",
    isComplimentary: false,
    isMember: false,
    ageGroup: "25-34",
    province: "Quebec",
    education: "Bachelors",
    primaryReason: "Exploring Membership",
    registrationType: "Workshop Only",
    dietary: "Vegan",
    session: "Ethics Track",
    ticketType: "Paid",
    renewed: false,
  },
  {
    id: 20,
    name: "David Singh",
    memberType: "CPA",
    membershipStatus: "Current",
    isComplimentary: false,
    isMember: true,
    ageGroup: "45-54",
    province: "Alberta",
    education: "Masters",
    primaryReason: "Networking",
    registrationType: "Full Conference",
    dietary: "Vegetarian",
    session: "Leadership Track",
    ticketType: "Paid",
    renewed: true,
  },
  {
    id: 21,
    name: "Lisa Anderson",
    memberType: "CPA",
    membershipStatus: "Lapsed",
    isComplimentary: false,
    isMember: false,
    ageGroup: "45-54",
    province: "Ontario",
    education: "Bachelors",
    primaryReason: "Networking",
    registrationType: "Full Conference",
    dietary: "None",
    session: "Audit Track",
    ticketType: "Paid",
    renewed: false,
  },
  {
    id: 22,
    name: "Michael Nguyen",
    memberType: "Student",
    membershipStatus: "Current",
    isComplimentary: false,
    isMember: true,
    ageGroup: "25-34",
    province: "British Columbia",
    education: "Undergrad",
    primaryReason: "Career",
    registrationType: "Student Pass",
    dietary: "None",
    session: "Student Track",
    ticketType: "Paid",
    renewed: true,
  },
  {
    id: 23,
    name: "Sophie Gagnon",
    memberType: "CPA",
    membershipStatus: "Current",
    isComplimentary: false,
    isMember: true,
    ageGroup: "35-44",
    province: "Quebec",
    education: "Masters",
    primaryReason: "Learning",
    registrationType: "Full Conference",
    dietary: "None",
    session: "Tax Track",
    ticketType: "Paid",
    renewed: false,
  },
  {
    id: 24,
    name: "Thomas Murphy",
    memberType: "CPA",
    membershipStatus: "Current",
    isComplimentary: false,
    isMember: true,
    ageGroup: "55-64",
    province: "Newfoundland and Labrador",
    education: "Masters",
    primaryReason: "Thought Leadership",
    registrationType: "Full Conference",
    dietary: "None",
    session: "Research Track",
    ticketType: "Paid",
    renewed: true,
  },
  {
    id: 25,
    name: "Jennifer Lee",
    memberType: "Non-member",
    membershipStatus: "Non-member",
    isComplimentary: false,
    isMember: false,
    ageGroup: "35-44",
    province: "Alberta",
    education: "Bachelors",
    primaryReason: "Learning",
    registrationType: "Workshop Only",
    dietary: "Vegetarian",
    session: "Technology Track",
    ticketType: "Paid",
    renewed: false,
  },
  {
    id: 26,
    name: "Antoine Levesque",
    memberType: "CPA",
    membershipStatus: "Lapsed",
    isComplimentary: false,
    isMember: false,
    ageGroup: "45-54",
    province: "Quebec",
    education: "Bachelors",
    primaryReason: "Networking",
    registrationType: "Full Conference",
    dietary: "None",
    session: "Leadership Track",
    ticketType: "Paid",
    renewed: false,
  },
  {
    id: 27,
    name: "Rachel Cohen",
    memberType: "CPA",
    membershipStatus: "Current",
    isComplimentary: false,
    isMember: true,
    ageGroup: "35-44",
    province: "Ontario",
    education: "PhD",
    primaryReason: "Professional Development",
    registrationType: "Full Conference",
    dietary: "Kosher",
    session: "Research Track",
    ticketType: "Paid",
    renewed: true,
  },
  {
    id: 28,
    name: "Christopher Taylor",
    memberType: "Student",
    membershipStatus: "Current",
    isComplimentary: false,
    isMember: true,
    ageGroup: "25-34",
    province: "Newfoundland and Labrador",
    education: "Undergrad",
    primaryReason: "Career",
    registrationType: "Student Pass",
    dietary: "None",
    session: "Student Track",
    ticketType: "Paid",
    renewed: true,
  },
  {
    id: 29,
    name: "Natasha Ivanov",
    memberType: "Non-member",
    membershipStatus: "Non-member",
    isComplimentary: false,
    isMember: false,
    ageGroup: "45-54",
    province: "Ontario",
    education: "Masters",
    primaryReason: "Exploring Membership",
    registrationType: "Workshop Only",
    dietary: "None",
    session: "Ethics Track",
    ticketType: "Paid",
    renewed: false,
  },
  {
    id: 30,
    name: "William Fraser",
    memberType: "CPA",
    membershipStatus: "Current",
    isComplimentary: false,
    isMember: true,
    ageGroup: "65+",
    province: "Nova Scotia",
    education: "Masters",
    primaryReason: "Networking",
    registrationType: "Full Conference",
    dietary: "None",
    session: "Audit Track",
    ticketType: "Paid",
    renewed: true,
  },
  {
    id: 31,
    name: "Olivia Martin",
    memberType: "Guest",
    membershipStatus: "Non-member",
    isComplimentary: true,
    isMember: false,
    ageGroup: "35-44",
    province: "Newfoundland and Labrador",
    education: "Bachelors",
    primaryReason: "Guest",
    registrationType: "Guest",
    dietary: "Gluten-free",
    session: "Social Events",
    ticketType: "Complimentary",
    renewed: false,
  },
  {
    id: 32,
    name: "Daniel Park",
    memberType: "CPA",
    membershipStatus: "Lapsed",
    isComplimentary: false,
    isMember: false,
    ageGroup: "55-64",
    province: "Nova Scotia",
    education: "Bachelors",
    primaryReason: "Networking",
    registrationType: "Full Conference",
    dietary: "None",
    session: "Tax Track",
    ticketType: "Paid",
    renewed: false,
  },
];

// -------------------- Attendee Data Enrichment --------------------

const COMPANY_LIST = [
  "Deloitte Canada", "KPMG LLP", "PwC Canada", "Ernst & Young",
  "BDO Canada", "Grant Thornton", "MNP LLP", "RSM Canada",
  "Baker Tilly Canada", "Crowe Soberman", "Collins Barrow", "Richter LLP"
];

function enrichAttendeesWithListData(attendees) {
  return attendees.map((a) => {
    const nameParts = a.name.split(" ");
    const firstName = nameParts[0]?.toLowerCase() || "user";
    const lastName = nameParts[nameParts.length - 1]?.toLowerCase() || "unknown";
    const companyIdx = (a.id * 7) % COMPANY_LIST.length;
    const regDay = 1 + (a.id % 28);
    const regMonth = 3 + Math.floor(a.id / 10);

    return {
      ...a,
      company: a.memberType === "Student" ? "N/A - Student" : COMPANY_LIST[companyIdx],
      email: `${firstName}.${lastName}@example.com`,
      phone: `(${500 + (a.id % 400)}) ${100 + (a.id * 3) % 900}-${1000 + (a.id * 7) % 9000}`,
      confirmationId: `CPA2025-${String(a.id).padStart(4, "0")}`,
      registrationDate: `2025-${String(regMonth).padStart(2, "0")}-${String(regDay).padStart(2, "0")}`,
    };
  });
}

// -------------------- Helper Functions --------------------

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

function computeKpis(attendees) {
  const totalAttendees = attendees.length;
  const currentMembers = attendees.filter((a) => a.membershipStatus === "Current")
    .length;
  const nonMembers = attendees.filter(
    (a) => a.membershipStatus === "Non-member"
  ).length;
  const lapsedMembers = attendees.filter(
    (a) => a.membershipStatus === "Lapsed"
  ).length;
  const complimentary = attendees.filter((a) => a.isComplimentary).length;

  return {
    totalAttendees,
    currentMembers,
    nonMembers,
    lapsedMembers,
    complimentary,
  };
}

function groupByField(attendees, field) {
  const map = new Map();
  attendees.forEach((a) => {
    const key = a[field] || "Unknown";
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries()).map(([label, count]) => ({ label, count }));
}

function filterAttendees(attendees, filters, searchTerm) {
  return attendees.filter((a) => {
    // filters: { field: [values] }
    for (const field of Object.keys(filters)) {
      const values = filters[field];
      if (!values || values.length === 0) continue;
      const val = a[field] || "Unknown";
      if (!values.includes(val)) return false;
    }

    if (searchTerm && searchTerm.trim().length > 0) {
      const term = searchTerm.toLowerCase();
      const haystack =
        (a.name || "") +
        " " +
        (a.province || "") +
        " " +
        (a.memberType || "") +
        " " +
        (a.registrationType || "");
      if (!haystack.toLowerCase().includes(term)) {
        return false;
      }
    }

    return true;
  });
}

function computeRenewalByProvince(attendees, provinces, showAsShare) {
  const filtered = attendees.filter((a) =>
    provinces.length ? provinces.includes(a.province) : true
  );
  const map = new Map();

  filtered.forEach((a) => {
    const prov = a.province || "Unknown";
    const existing = map.get(prov) || { renewed: 0, notRenewed: 0 };
    if (a.renewed) existing.renewed += 1;
    else existing.notRenewed += 1;
    map.set(prov, existing);
  });

  return Array.from(map.entries()).map(([province, { renewed, notRenewed }]) => {
    const total = renewed + notRenewed || 1;
    return {
      province,
      renewed: showAsShare ? (renewed / total) * 100 : renewed,
      notRenewed: showAsShare ? (notRenewed / total) * 100 : notRenewed,
      total,
    };
  });
}

function computeSegmentsWithPercentage(segments, totalCount) {
  return segments.map((seg) => ({
    ...seg,
    percentage: totalCount > 0 ? ((seg.count / totalCount) * 100).toFixed(1) : 0,
  }));
}

function transformChartData(originalData, config, attendees) {
  let data = [...originalData];

  // Apply date range filter
  if (config.dateRange === "last4") {
    data = data.slice(-5); // Last 4 weeks + Event
  } else if (config.dateRange === "last2") {
    data = data.slice(-3); // Last 2 weeks + Event
  }

  // Apply membership type filter (affects revenue calculation conceptually)
  // For demo, we'll adjust proportionally based on attendee mix
  if (config.selectedMembershipTypes.length > 0) {
    const filteredCount = attendees.filter((a) =>
      config.selectedMembershipTypes.includes(a.memberType)
    ).length;
    const ratio = filteredCount / attendees.length;
    data = data.map((item) => ({
      ...item,
      registrations: Math.round(item.registrations * ratio),
      revenue: Math.round(item.revenue * ratio),
    }));
  }

  // Apply view mode transformation
  if (config.viewMode === "percentage") {
    const maxReg = Math.max(...data.map((d) => d.registrations));
    const maxRev = Math.max(...data.map((d) => d.revenue));
    data = data.map((item) => ({
      ...item,
      registrations: maxReg > 0 ? Math.round((item.registrations / maxReg) * 100) : 0,
      revenue: maxRev > 0 ? Math.round((item.revenue / maxRev) * 100) : 0,
    }));
  }

  return data;
}

function computeCorrelation(attendees, dimension, metric) {
  const map = new Map();

  attendees.forEach((a) => {
    const key = a[dimension] || "Unknown";
    const existing = map.get(key) || { total: 0, renewed: 0 };
    existing.total += 1;
    if (metric === "renewal" && a.renewed) {
      existing.renewed += 1;
    }
    map.set(key, existing);
  });

  const results = Array.from(map.entries()).map(([label, { total, renewed }]) => {
    const renewalRate = total > 0 ? (renewed / total) * 100 : 0;
    return {
      label,
      total,
      renewed,
      notRenewed: total - renewed,
      renewalRate: renewalRate.toFixed(1),
    };
  });

  // Sort by renewal rate descending
  results.sort((a, b) => parseFloat(b.renewalRate) - parseFloat(a.renewalRate));

  // Find key insight (highest vs lowest rate with meaningful sample size)
  const significantResults = results.filter((r) => r.total >= 3);
  const insight = significantResults.length >= 2
    ? `${significantResults[0].label} shows ${significantResults[0].renewalRate}% renewal vs ${significantResults[significantResults.length - 1].renewalRate}% for ${significantResults[significantResults.length - 1].label}`
    : significantResults.length === 1
    ? `${significantResults[0].label}: ${significantResults[0].renewalRate}% renewal rate`
    : "Insufficient data for correlation analysis";

  return { results, insight };
}

// -------------------- Top-Level Demo Component --------------------

function CentralEventReportingDemo() {
  const [view, setView] = useState("calendar"); // "calendar" | "event"
  const [showPeek, setShowPeek] = useState(false);
  const [showInsightsPanel, setShowInsightsPanel] = useState(false);
  const [showInsightsSlideout, setShowInsightsSlideout] = useState(false);

  const kpis = useMemo(() => computeKpis(MOCK_ATTENDEES), []);

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "1rem",
        background: "#f5f5f7",
        minHeight: "100vh",
        color: "#111827",
      }}
    >
      <WorkspaceNavigator onOpenCalendar={() => setView("calendar")} />
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
          attendees={enrichAttendeesWithListData(MOCK_ATTENDEES)}
          kpis={kpis}
          onBackToCalendar={() => setView("calendar")}
          showInsightsPanel={showInsightsPanel}
          setShowInsightsPanel={setShowInsightsPanel}
          showInsightsSlideout={showInsightsSlideout}
          setShowInsightsSlideout={setShowInsightsSlideout}
        />
      )}
    </div>
  );
}

// -------------------- Workspace + Calendar --------------------

function WorkspaceNavigator({ onOpenCalendar }) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1rem",
      }}
    >
      <div>
        <h1 style={{ margin: 0 }}>Workspace Navigator</h1>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "#4b5563" }}>
          Access key workspaces including Calendar, Events, and Reporting.
        </p>
      </div>
      <button
        onClick={onOpenCalendar}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "999px",
          border: "none",
          background: "#2563eb",
          color: "white",
          fontSize: "0.875rem",
          cursor: "pointer",
        }}
      >
        Calendar
      </button>
    </header>
  );
}

function CalendarView({ event, onEventClick }) {
  const [mode, setMode] = useState("month"); // "month" | "year"
  return (
    <div
      style={{
        background: "white",
        borderRadius: "0.75rem",
        padding: "1rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <h2 style={{ margin: 0 }}>Calendar</h2>
        <div
          style={{
            display: "inline-flex",
            borderRadius: "999px",
            background: "#e5e7eb",
          }}
        >
          <button
            onClick={() => setMode("month")}
            style={{
              border: "none",
              padding: "0.25rem 0.75rem",
              borderRadius: "999px",
              background: mode === "month" ? "white" : "transparent",
              cursor: "pointer",
              fontSize: "0.75rem",
            }}
          >
            Month
          </button>
          <button
            onClick={() => setMode("year")}
            style={{
              border: "none",
              padding: "0.25rem 0.75rem",
              borderRadius: "999px",
              background: mode === "year" ? "white" : "transparent",
              cursor: "pointer",
              fontSize: "0.75rem",
            }}
          >
            Year
          </button>
        </div>
      </div>
      {mode === "month" ? (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "0.875rem",
          }}
        >
          Month view placeholder (for demo, switch to Year to see event).
        </div>
      ) : (
        <div
          style={{
            padding: "1rem",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>2025</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "0.75rem",
              fontSize: "0.75rem",
            }}
          >
            <div
              style={{
                borderRadius: "0.5rem",
                border: "1px solid #e5e7eb",
                padding: "0.5rem",
              }}
            >
              <strong>June</strong>
              <div
                style={{
                  marginTop: "0.5rem",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  background:
                    "linear-gradient(to right, #2563eb, #0ea5e9, #22c55e)",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={onEventClick}
              >
                <div>{event.name}</div>
                <div style={{ fontSize: "0.7rem" }}>
                  {event.startDate} – {event.endDate}
                </div>
              </div>
            </div>
            <div />
            <div />
            <div />
          </div>
        </div>
      )}
    </div>
  );
}

function EventPeek({ event, kpis, onClose, onViewEvent }) {
  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.4)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 40,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "0.75rem 0.75rem 0 0",
          padding: "1rem 1.25rem",
          width: "100%",
          maxWidth: "960px",
          boxShadow: "0 -10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>{event.name}</h2>
            <p style={{ margin: "0.25rem 0", fontSize: "0.875rem" }}>
              {event.startDate} – {event.endDate} · {event.venue}
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "0.75rem",
                fontSize: "0.875rem",
              }}
            >
              <div>
                <div style={{ color: "#6b7280" }}>Total Attendees</div>
                <strong>{kpis.totalAttendees}</strong>
              </div>
              <div>
                <div style={{ color: "#6b7280" }}>Total Revenue</div>
                <strong>${(event.totalRevenue / 1000).toFixed(1)}k</strong>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "0.875rem",
                color: "#6b7280",
              }}
            >
              Close
            </button>
            <button
              onClick={onViewEvent}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "999px",
                border: "none",
                background: "#2563eb",
                color: "white",
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              View event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------- Event Detail Layout --------------------

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
  const [activeTab, setActiveTab] = useState("profile");
  const [showChartPreview, setShowChartPreview] = useState(false);
  const [chartPreviewData, setChartPreviewData] = useState(null);

  return (
    <div style={{ marginTop: "1rem" }}>
      <button
        onClick={onBackToCalendar}
        style={{
          marginBottom: "0.5rem",
          border: "none",
          padding: "0.25rem 0.75rem",
          borderRadius: "999px",
          fontSize: "0.75rem",
          background: "#e5e7eb",
          cursor: "pointer",
        }}
      >
        ← Back to Calendar
      </button>
      <div
        style={{
          background: "white",
          borderRadius: "0.75rem",
          padding: "1rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>{event.name}</h2>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#4b5563" }}>
              {event.startDate} – {event.endDate} · {event.venue}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Studio Dock Icons */}
            <StudioDock
              onOpenInsights={() => setShowInsightsPanel(true)}
              onOpenExplorer={() => setShowInsightsSlideout(true)}
            />
            {/* Countdown */}
            <div style={{ textAlign: "right", fontSize: "0.75rem" }}>
              <div style={{ color: "#6b7280" }}>Countdown</div>
              <div style={{ fontWeight: 600 }}>
                {(() => {
                  const eventDate = new Date(event.startDate);
                  const today = new Date();
                  const diffTime = eventDate - today;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays > 0) return `${diffDays} days`;
                  if (diffDays === 0) return "Today!";
                  return "Event passed";
                })()}
              </div>
            </div>
          </div>
        </header>

        <EventTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "profile" && (
          <EventProfileTab
            event={event}
            attendees={attendees}
            kpis={kpis}
            onOpenInsights={() => setShowInsightsPanel(true)}
            onOpenChartPreview={(data, title) => {
              setChartPreviewData({ data, title, attendees });
              setShowChartPreview(true);
            }}
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

      {showInsightsPanel && (
        <InsightsBottomPanel
          attendees={attendees}
          onClose={() => setShowInsightsPanel(false)}
        />
      )}

      {showInsightsSlideout && (
        <InsightsConfigSlideout
          attendees={attendees}
          onClose={() => setShowInsightsSlideout(false)}
        />
      )}

      {showChartPreview && chartPreviewData && (
        <ChartPreviewSlideout
          data={chartPreviewData.data}
          title={chartPreviewData.title}
          attendees={chartPreviewData.attendees}
          onClose={() => setShowChartPreview(false)}
        />
      )}
    </div>
  );
}

function StudioDock({ onOpenInsights, onOpenExplorer }) {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const icons = [
    { id: "insights", icon: "📊", label: "Insights", onClick: onOpenInsights, priority: 1 },
    { id: "explorer", icon: "🔍", label: "Explorer", onClick: onOpenExplorer, priority: 2 },
    { id: "reports", icon: "📄", label: "Reports", onClick: () => {}, priority: 3 },
    { id: "timeline", icon: "📅", label: "Timeline", onClick: () => {}, priority: 2 },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.25rem",
        background: "#f3f4f6",
        borderRadius: "0.5rem",
        padding: "0.25rem",
      }}
    >
      {icons.map((item) => (
        <div
          key={item.id}
          style={{ position: "relative" }}
          onMouseEnter={() => setHoveredIcon(item.id)}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          <button
            onClick={item.onClick}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "0.375rem",
              border: "none",
              background: hoveredIcon === item.id ? "#2563eb" : "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              transition: "all 0.15s",
            }}
          >
            {item.icon}
          </button>
          {/* Tooltip */}
          {hoveredIcon === item.id && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                marginTop: "0.35rem",
                background: "#1f2937",
                color: "white",
                padding: "0.25rem 0.5rem",
                borderRadius: "0.25rem",
                fontSize: "0.7rem",
                whiteSpace: "nowrap",
                zIndex: 100,
              }}
            >
              {item.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function EventTabs({ activeTab, onChange }) {
  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "activities", label: "Activities" },
    { id: "more", label: "More ▾" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        borderBottom: "1px solid #e5e7eb",
        marginBottom: "1rem",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            border: "none",
            borderBottom:
              activeTab === tab.id ? "2px solid #2563eb" : "2px solid transparent",
            background: "transparent",
            padding: "0.5rem 0.75rem",
            cursor: "pointer",
            fontSize: "0.875rem",
            color: activeTab === tab.id ? "#111827" : "#6b7280",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// -------------------- Profile Tab --------------------

function EventProfileTab({ event, attendees, kpis, onOpenInsights, onOpenChartPreview }) {
  const fakeTrendData = [
    { label: "Week -6", registrations: 3, revenue: 2400 },
    { label: "Week -5", registrations: 8, revenue: 6400 },
    { label: "Week -4", registrations: 15, revenue: 12000 },
    { label: "Week -3", registrations: 22, revenue: 17600 },
    { label: "Week -2", registrations: 28, revenue: 22400 },
    { label: "Week -1", registrations: 32, revenue: 25600 },
    { label: "Event", registrations: 32, revenue: 26000 },
  ];

  return (
    <div>
      {/* KPIs Row - Full Width */}
      <KpiRow kpis={kpis} />

      {/* Main 2-Column Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {/* Left Column - Charts & Visualizations */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            onClick={() => onOpenChartPreview && onOpenChartPreview(fakeTrendData, "Cumulative Registrations & Revenue")}
            style={{ cursor: onOpenChartPreview ? "pointer" : "default" }}
            onMouseEnter={(e) => {
              if (onOpenChartPreview) {
                e.currentTarget.style.opacity = "0.8";
              }
            }}
            onMouseLeave={(e) => {
              if (onOpenChartPreview) {
                e.currentTarget.style.opacity = "1";
              }
            }}
          >
            <ComboChartWithRecharts data={fakeTrendData} />
          </div>
          <RegistrationFunnel />
          <TypesAndRevenueSection attendees={attendees} />
        </div>

        {/* Right Column - Actions & Info Panels */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <QuickLinksPanel />
          <AlertsPanel />
          <UpcomingViewsPanel />
        </div>
      </div>
    </div>
  );
}

function KpiRow({ kpis }) {
  const items = [
    { label: "Total attendees", value: kpis.totalAttendees },
    { label: "Current members", value: kpis.currentMembers },
    { label: "Non-members", value: kpis.nonMembers },
    { label: "Lapsed members", value: kpis.lapsedMembers },
    { label: "Complimentary", value: kpis.complimentary },
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
        gap: "0.75rem",
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            background: "#f9fafb",
            borderRadius: "0.5rem",
            padding: "0.5rem 0.75rem",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{item.label}</div>
          <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

function ComboChartWithRecharts({ data }) {
  return (
    <div
      style={{
        background: "#f9fafb",
        borderRadius: "0.5rem",
        padding: "0.75rem",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}
      >
        <strong style={{ fontSize: "0.875rem" }}>
          Cumulative Registrations & Revenue
        </strong>
        <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>
          Interactive chart
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            stroke="#9ca3af"
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            stroke="#9ca3af"
            label={{
              value: "Registrations",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 11, fill: "#6b7280" },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            stroke="#9ca3af"
            label={{
              value: "Revenue ($)",
              angle: 90,
              position: "insideRight",
              style: { fontSize: 11, fill: "#6b7280" },
            }}
          />
          <Tooltip
            contentStyle={{
              background: "white",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              fontSize: "0.75rem",
              padding: "0.5rem",
            }}
            formatter={(value, name) => {
              if (name === "Revenue ($)") {
                return `$${value.toLocaleString()}`;
              }
              return value;
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "0.75rem", paddingTop: "0.5rem" }}
            iconType="plainline"
          />
          <Bar
            yAxisId="left"
            dataKey="registrations"
            fill="#2563eb"
            name="Registrations"
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: "#22c55e", r: 4 }}
            name="Revenue ($)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function VitalsRow({ event, kpis, membershipSegments }) {
  return (
    <div
      style={{
        background: "#f9fafb",
        borderRadius: "0.5rem",
        padding: "0.75rem",
        border: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        fontSize: "0.8rem",
      }}
    >
      <div>
        <div style={{ color: "#6b7280" }}>Total revenue</div>
        <div style={{ fontWeight: 600 }}>
          ${event.totalRevenue.toLocaleString()}
        </div>
      </div>
      <div>
        <div style={{ color: "#6b7280" }}>Membership mix</div>
        <ul style={{ paddingLeft: "1rem", margin: 0 }}>
          {membershipSegments.map((seg) => (
            <li key={seg.label}>
              {seg.label}: {seg.count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// -------------------- Registration Funnel --------------------

function RegistrationFunnel() {
  const stages = [
    { id: 1, label: "Registration Page", shortLabel: "Page", value: 500, color: "#1e3a5f" },
    { id: 2, label: "Registration Type", shortLabel: "Type", value: 320, color: "#3b82f6" },
    { id: 3, label: "Registration Options", shortLabel: "Options", value: 180, color: "#f59e0b" },
    { id: 4, label: "Checkout", shortLabel: "Checkout", value: 85, color: "#ef4444" },
    { id: 5, label: "Confirmed", shortLabel: "Confirmed", value: 32, color: "#22c55e" },
  ];

  const baseValue = stages[0].value;

  return (
    <div
      style={{
        background: "#f9fafb",
        borderRadius: "0.5rem",
        padding: "0.75rem",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}
      >
        <strong style={{ fontSize: "0.875rem" }}>Registration Funnel</strong>
        <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>
          Conversion flow
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "0.5rem",
        }}
      >
        {stages.map((stage) => {
          const percentage = ((stage.value / baseValue) * 100).toFixed(1);
          return (
            <div
              key={stage.id}
              style={{
                background: stage.color,
                color: "white",
                borderRadius: "0.5rem",
                padding: "0.75rem 0.5rem",
                textAlign: "center",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = `0 4px 12px ${stage.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {stage.value.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  marginTop: "0.25rem",
                  opacity: 0.9,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={stage.label}
              >
                {stage.shortLabel}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  marginTop: "0.25rem",
                }}
              >
                {percentage}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------- Types and Revenue Section --------------------

function TypesAndRevenueSection({ attendees }) {
  // Color map for registration types
  const COLORS = {
    "Full Conference": "#3b82f6",
    "Workshop Only": "#8b5cf6",
    "Student Pass": "#22c55e",
    "Speaker": "#f59e0b",
    "Guest": "#ec4899",
  };

  // Mock pricing per registration type
  const PRICING = {
    "Full Conference": 800,
    "Workshop Only": 350,
    "Student Pass": 200,
    "Speaker": 0,
    "Guest": 0,
  };

  // Calculate type distribution
  const typeData = useMemo(() => {
    const counts = {};
    attendees.forEach((a) => {
      const type = a.registrationType || "Unknown";
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: COLORS[name] || "#6b7280",
    }));
  }, [attendees]);

  // Calculate revenue by type
  const revenueData = useMemo(() => {
    const revenue = {};
    attendees.forEach((a) => {
      const type = a.registrationType || "Unknown";
      const price = PRICING[type] || 0;
      revenue[type] = (revenue[type] || 0) + price;
    });
    return Object.entries(revenue)
      .map(([name, amount]) => ({
        name,
        amount,
        color: COLORS[name] || "#6b7280",
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [attendees]);

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.amount, 0);
  const maxRevenue = Math.max(...revenueData.map((d) => d.amount), 1);

  return (
    <div
      style={{
        background: "#f9fafb",
        borderRadius: "0.5rem",
        padding: "0.75rem",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}
      >
        {/* Pie Chart Section */}
        <div>
          <div
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              color: "#111827",
            }}
          >
            Registration Types
          </div>
          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} attendees`, name]}
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                    fontSize: "0.75rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "0.5rem",
              justifyContent: "center",
            }}
          >
            {typeData.map((item) => (
              <div
                key={item.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "0.6rem",
                  color: "#374151",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: item.color,
                  }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue List Section */}
        <div>
          <div
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              color: "#111827",
            }}
          >
            Revenue by Type
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {revenueData.map((item) => (
              <div key={item.name}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.75rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  <span style={{ color: "#374151" }}>{item.name}</span>
                  <span style={{ fontWeight: 600, color: "#111827" }}>
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{
                    height: "6px",
                    background: "#e5e7eb",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(item.amount / maxRevenue) * 100}%`,
                      background: item.color,
                      borderRadius: "999px",
                      transition: "width 0.5s ease-out",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Total */}
          <div
            style={{
              marginTop: "0.75rem",
              paddingTop: "0.5rem",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.8rem",
            }}
          >
            <span style={{ fontWeight: 600, color: "#374151" }}>Total</span>
            <span style={{ fontWeight: 700, color: "#111827" }}>
              ${totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------- Quick Links Panel --------------------

function QuickLinksPanel() {
  const actions = [
    {
      id: "add-attendee",
      label: "Add Attendee",
      icon: "+",
      primary: true,
      onClick: () => alert("Add Attendee clicked - implement registration form")
    },
    {
      id: "view-registrations",
      label: "View All Registrations",
      icon: "▤",
      primary: false,
      onClick: () => alert("View All Registrations clicked - navigate to registrations list")
    },
    {
      id: "manage-event",
      label: "Manage Event",
      icon: "⚙",
      primary: false,
      onClick: () => alert("Manage Event clicked - open event settings")
    },
  ];

  return (
    <div
      style={{
        background: "white",
        borderRadius: "0.5rem",
        border: "1px solid #e5e7eb",
        padding: "1rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          fontSize: "0.9rem",
          fontWeight: 600,
          color: "#111827",
          marginBottom: "0.75rem",
        }}
      >
        Quick Actions
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            style={{
              background: action.primary ? "#1e3a5f" : "white",
              color: action.primary ? "white" : "#374151",
              border: action.primary ? "none" : "1px solid #e5e7eb",
              borderRadius: "0.375rem",
              padding: "0.5rem 0.75rem",
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              width: "100%",
              textAlign: "left",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (action.primary) {
                e.currentTarget.style.background = "#2d4a6f";
              } else {
                e.currentTarget.style.background = "#f9fafb";
              }
            }}
            onMouseLeave={(e) => {
              if (action.primary) {
                e.currentTarget.style.background = "#1e3a5f";
              } else {
                e.currentTarget.style.background = "white";
              }
            }}
          >
            <span style={{ fontSize: "1rem", lineHeight: 1 }}>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// -------------------- Alerts Panel --------------------

function AlertsPanel() {
  const alerts = [
    {
      id: 1,
      type: "warning",
      icon: "⚠",
      message: "47 incomplete registrations detected. Follow up to complete checkout.",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      type: "info",
      icon: "ℹ",
      message: "12 new registrations this week! Consider sending welcome details.",
      timestamp: "1 day ago",
    },
    {
      id: 3,
      type: "success",
      icon: "✓",
      message: "Revenue target 85% achieved. Event on track for full capacity.",
      timestamp: "3 days ago",
    },
  ];

  const getIconColor = (type) => {
    switch (type) {
      case "warning":
        return "#f59e0b";
      case "info":
        return "#3b82f6";
      case "success":
        return "#22c55e";
      default:
        return "#6b7280";
    }
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "0.5rem",
        border: "1px solid #e5e7eb",
        padding: "1rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          fontSize: "0.9rem",
          fontWeight: 600,
          color: "#111827",
          marginBottom: "0.75rem",
        }}
      >
        Alerts & Insights
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {alerts.map((alert, index) => (
          <div
            key={alert.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
              padding: "0.5rem 0",
              borderBottom: index < alerts.length - 1 ? "1px solid #f3f4f6" : "none",
            }}
          >
            <span
              style={{
                fontSize: "1rem",
                lineHeight: 1,
                color: getIconColor(alert.type),
                flexShrink: 0,
                marginTop: "0.1rem",
              }}
            >
              {alert.icon}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#374151",
                  lineHeight: 1.4,
                }}
              >
                {alert.message}
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#9ca3af",
                  marginTop: "0.25rem",
                }}
              >
                {alert.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------- Upcoming Views Panel --------------------

function UpcomingViewsPanel() {
  const [currentMonth, setCurrentMonth] = useState(5); // June = 5 (0-indexed)
  const currentYear = 2025;

  // Event dates to highlight (June 12-14, 2025)
  const eventDates = [12, 13, 14];

  // Upcoming sessions/events
  const upcomingEvents = [
    {
      id: 1,
      month: "Jun",
      day: 12,
      dayName: "Thu",
      time: "9:00 AM",
      type: "Session",
      title: "Opening Keynote",
      location: "Main Hall",
      status: "SCHEDULED",
    },
    {
      id: 2,
      month: "Jun",
      day: 12,
      dayName: "Thu",
      time: "12:30 PM",
      type: "Social",
      title: "Networking Lunch",
      location: "Grand Ballroom",
      status: "SCHEDULED",
    },
    {
      id: 3,
      month: "Jun",
      day: 13,
      dayName: "Fri",
      time: "2:00 PM",
      type: "Session",
      title: "Awards Ceremony",
      location: "Main Hall",
      status: "SCHEDULED",
    },
  ];

  // Generate calendar days for the month
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fullMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  // Create calendar grid
  const calendarDays = [];
  // Add empty cells for days before the 1st
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "0.5rem",
        border: "1px solid #e5e7eb",
        padding: "1rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.75rem",
        }}
      >
        <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#111827" }}>
          Upcoming Events
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={handlePrevMonth}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#6b7280",
              fontSize: "0.8rem",
              padding: "0.125rem 0.25rem",
            }}
          >
            ‹
          </button>
          <span style={{ fontSize: "0.75rem", color: "#374151", minWidth: "4rem", textAlign: "center" }}>
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={handleNextMonth}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#6b7280",
              fontSize: "0.8rem",
              padding: "0.125rem 0.25rem",
            }}
          >
            ›
          </button>
        </div>
      </div>

      {/* Mini Calendar */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 500, textAlign: "center", marginBottom: "0.5rem", color: "#374151" }}>
          {fullMonthNames[currentMonth]} {currentYear}
        </div>
        {/* Day headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "0.125rem",
            marginBottom: "0.25rem",
          }}
        >
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div
              key={i}
              style={{
                fontSize: "0.6rem",
                color: "#9ca3af",
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              {day}
            </div>
          ))}
        </div>
        {/* Calendar grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "0.125rem",
          }}
        >
          {calendarDays.map((day, i) => {
            const isEventDate = currentMonth === 5 && eventDates.includes(day); // June only
            const isWeekend = i % 7 === 0 || i % 7 === 6;
            return (
              <div
                key={i}
                style={{
                  fontSize: "0.65rem",
                  textAlign: "center",
                  padding: "0.2rem",
                  borderRadius: "0.25rem",
                  background: isEventDate ? "#3b82f6" : "transparent",
                  color: isEventDate ? "white" : isWeekend ? "#3b82f6" : "#374151",
                  fontWeight: isEventDate ? 600 : 400,
                  cursor: day ? "pointer" : "default",
                }}
              >
                {day || ""}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events List */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {upcomingEvents.map((event, index) => (
          <div
            key={event.id}
            style={{
              display: "flex",
              gap: "0.5rem",
              padding: "0.5rem 0",
              borderBottom: index < upcomingEvents.length - 1 ? "1px solid #f3f4f6" : "none",
            }}
          >
            {/* Date Badge */}
            <div
              style={{
                background: "#3b82f6",
                color: "white",
                borderRadius: "0.375rem",
                padding: "0.25rem 0.4rem",
                textAlign: "center",
                minWidth: "2.25rem",
                flexShrink: 0,
              }}
            >
              <div style={{ fontSize: "0.6rem", fontWeight: 500, textTransform: "uppercase" }}>
                {event.month}
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, lineHeight: 1 }}>
                {event.day}
              </div>
              <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.8)" }}>
                {event.dayName}
              </div>
            </div>
            {/* Event Details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.65rem", color: "#6b7280" }}>
                {event.time} | {event.type}
              </div>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#111827", marginTop: "0.125rem" }}>
                {event.title}
              </div>
              <div style={{ fontSize: "0.65rem", color: "#9ca3af", marginTop: "0.125rem" }}>
                {event.location}
              </div>
            </div>
            {/* Status Badge */}
            <div
              style={{
                alignSelf: "center",
                fontSize: "0.55rem",
                fontWeight: 600,
                background: "#dbeafe",
                color: "#1d4ed8",
                borderRadius: "999px",
                padding: "0.125rem 0.4rem",
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              {event.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------- Activities Tab (stub) --------------------

function EventActivitiesTab() {
  return (
    <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
      Activities timeline could appear here (stub for this prototype).
    </div>
  );
}

// -------------------- More / People Listing --------------------

function EventMoreTab({ attendees, onOpenInsightsSlideout }) {
  const [showCorrelationMenu, setShowCorrelationMenu] = useState(false);
  const [correlationType, setCorrelationType] = useState(null);

  const correlations = [
    { id: "location", label: "Location vs Renewal", dimension: "province", metric: "renewal" },
    { id: "age", label: "Age Group vs Renewal", dimension: "ageGroup", metric: "renewal" },
    { id: "education", label: "Education vs Renewal", dimension: "education", metric: "renewal" },
  ];

  function handleCorrelationSelect(correlation) {
    setCorrelationType(correlation);
    setShowCorrelationMenu(false);
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
          position: "relative",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "0.95rem" }}>People</h3>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowCorrelationMenu(!showCorrelationMenu)}
            style={{
              border: "1px solid #d1d5db",
              background: "white",
              borderRadius: "0.375rem",
              padding: "0.375rem 0.75rem",
              color: "#2563eb",
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            Correlation Insights ▾
          </button>
          {showCorrelationMenu && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "0.25rem",
                background: "white",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 10,
                minWidth: "200px",
              }}
            >
              {correlations.map((corr) => (
                <button
                  key={corr.id}
                  onClick={() => handleCorrelationSelect(corr)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    border: "none",
                    background: "transparent",
                    textAlign: "left",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    color: "#374151",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                  }}
                >
                  {corr.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <MorePeopleListing attendees={attendees} />
      {correlationType && correlationType.id === "location" && (
        <InsightsConfigSlideout
          attendees={attendees}
          onClose={() => setCorrelationType(null)}
        />
      )}
      {correlationType && correlationType.id !== "location" && (
        <CorrelationSlideout
          attendees={attendees}
          dimension={correlationType.dimension}
          dimensionLabel={correlationType.label.split(" vs ")[0]}
          metric={correlationType.metric}
          onClose={() => setCorrelationType(null)}
        />
      )}
    </div>
  );
}

function MorePeopleListing({ attendees }) {
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedView, setSelectedView] = useState("Default");
  const [viewMode, setViewMode] = useState("list"); // "list" | "cards"
  const [selectedCard, setSelectedCard] = useState(null); // active card for vertical nav
  const [peekData, setPeekData] = useState(null); // { field, segment, attendees }
  const [selectedAttendee, setSelectedAttendee] = useState(null); // for attendee peek

  const cards = [
    { title: "Registration Types", field: "registrationType", icon: "📋" },
    { title: "Dietary Restrictions", field: "dietary", icon: "🍽" },
    { title: "Sessions", field: "session", icon: "📅" },
    { title: "Tickets", field: "ticketType", icon: "🎫" },
    { title: "Membership Type", field: "memberType", icon: "👤" },
    { title: "Age Group", field: "ageGroup", icon: "📊" },
    { title: "Province", field: "province", icon: "📍" },
    { title: "Tenure", field: "tenure", icon: "⏱" },
    { title: "Education", field: "education", icon: "🎓" },
  ];

  const colorPalettes = {
    registrationType: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"],
    dietary: ["#22c55e", "#10b981", "#14b8a6", "#06b6d4"],
    session: ["#f59e0b", "#eab308", "#84cc16", "#22c55e"],
    ticketType: ["#3b82f6", "#8b5cf6"],
    memberType: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"],
    ageGroup: ["#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7"],
    province: ["#f43f5e", "#ec4899", "#d946ef", "#a855f7", "#8b5cf6", "#6366f1", "#3b82f6", "#0ea5e9", "#06b6d4"],
    tenure: ["#6b7280", "#9ca3af"],
    education: ["#84cc16", "#22c55e", "#10b981", "#14b8a6"],
  };

  const filteredAttendees = useMemo(
    () => filterAttendees(attendees, filters, searchTerm),
    [attendees, filters, searchTerm]
  );

  function handleToggle(field, segment) {
    setFilters((prev) => {
      const current = prev[field] || [];
      const exists = current.includes(segment);
      const next = exists
        ? current.filter((v) => v !== segment)
        : [...current, segment];
      const updated = { ...prev, [field]: next };
      if (updated[field].length === 0) delete updated[field];
      return updated;
    });
  }

  function handleSaveView() {
    const name = window.prompt("Name for this view?", selectedView);
    if (name) {
      setSelectedView(name);
    }
  }

  function handleCardSelect(cardField) {
    setSelectedCard(selectedCard === cardField ? null : cardField);
    setPeekData(null); // Close peek when changing cards
  }

  function handleSegmentPeek(field, segment) {
    const segmentAttendees = attendees.filter((a) => (a[field] || "Unknown") === segment);
    setPeekData({ field, segment, attendees: segmentAttendees });
    setSelectedAttendee(null);
  }

  function handleAttendeeClick(attendee) {
    setSelectedAttendee(attendee);
  }

  function handleCardFilterClick(field, label) {
    handleToggle(field, label);
  }

  // Determine if peek panel should show
  const showPeek = peekData || selectedAttendee;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: viewMode === "list"
          ? showPeek
            ? "minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1.5fr)"
            : "minmax(0, 1fr) minmax(0, 3fr)"
          : "1fr",
        gap: "1rem",
        marginTop: "0.5rem",
      }}
    >
      {/* Left Column - Vertical Card Navigation */}
      {viewMode === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <ListingFilterHeader selectedView={selectedView} onSaveView={handleSaveView} />
          <ListingSearchInput value={searchTerm} onChange={setSearchTerm} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginTop: "0.5rem",
              maxHeight: "520px",
              overflowY: "auto",
            }}
          >
            {cards.map((card) => {
              const segments = groupByField(attendees, card.field);
              const selectedValues = filters[card.field] || [];
              const isActive = selectedCard === card.field;
              return (
                <VerticalNavCard
                  key={card.title}
                  title={card.title}
                  icon={card.icon}
                  field={card.field}
                  segments={segments}
                  selectedValues={selectedValues}
                  isActive={isActive}
                  onCardClick={() => handleCardSelect(card.field)}
                  onToggle={(segment) => handleToggle(card.field, segment)}
                  onSegmentPeek={(segment) => handleSegmentPeek(card.field, segment)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Middle Column - Attendee List */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.75rem",
          }}
        >
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>
            {viewMode === "cards" ? "Demographic Overview" : `Showing ${filteredAttendees.length} attendee(s)`}
          </div>
          <div
            style={{
              display: "inline-flex",
              borderRadius: "999px",
              background: "#e5e7eb",
              padding: "2px",
            }}
          >
            <button
              onClick={() => setViewMode("list")}
              style={{
                border: "none",
                padding: "0.25rem 0.75rem",
                borderRadius: "999px",
                background: viewMode === "list" ? "white" : "transparent",
                cursor: "pointer",
                fontSize: "0.75rem",
                fontWeight: viewMode === "list" ? 600 : 400,
                color: viewMode === "list" ? "#111827" : "#6b7280",
                transition: "all 0.2s",
              }}
            >
              List
            </button>
            <button
              onClick={() => setViewMode("cards")}
              style={{
                border: "none",
                padding: "0.25rem 0.75rem",
                borderRadius: "999px",
                background: viewMode === "cards" ? "white" : "transparent",
                cursor: "pointer",
                fontSize: "0.75rem",
                fontWeight: viewMode === "cards" ? 600 : 400,
                color: viewMode === "cards" ? "#111827" : "#6b7280",
                transition: "all 0.2s",
              }}
            >
              Cards
            </button>
          </div>
        </div>
        {viewMode === "list" ? (
          <AttendeeList attendees={filteredAttendees} onAttendeeClick={handleAttendeeClick} />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {cards.map((card) => (
              <DemographicCard
                key={card.title}
                title={card.title}
                field={card.field}
                attendees={filteredAttendees}
                colorPalette={colorPalettes[card.field]}
                onFilterClick={handleCardFilterClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Column - Peek Panel */}
      {viewMode === "list" && showPeek && (
        <PeekPanel
          peekData={peekData}
          selectedAttendee={selectedAttendee}
          onClose={() => {
            setPeekData(null);
            setSelectedAttendee(null);
          }}
          onAttendeeClick={handleAttendeeClick}
        />
      )}
    </div>
  );
}

function ListingFilterHeader({ selectedView, onSaveView }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <div style={{ fontSize: "0.8rem" }}>
        View: <strong>{selectedView}</strong>
      </div>
      <button
        onClick={onSaveView}
        style={{
          border: "none",
          background: "#e5e7eb",
          borderRadius: "999px",
          padding: "0.25rem 0.75rem",
          fontSize: "0.75rem",
          cursor: "pointer",
        }}
      >
        Save view
      </button>
    </div>
  );
}

function ListingSearchInput({ value, onChange }) {
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, province, member type, registration..."
        style={{
          width: "100%",
          padding: "0.4rem 0.5rem",
          fontSize: "0.8rem",
          borderRadius: "0.5rem",
          border: "1px solid #d1d5db",
        }}
      />
    </div>
  );
}

function ListingCard({ title, segments, selectedValues, onToggle }) {
  return (
    <div
      style={{
        borderRadius: "0.5rem",
        border: "1px solid #e5e7eb",
        padding: "0.5rem 0.75rem",
        background: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
      }}
    >
      <div
        style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          marginBottom: "0.25rem",
        }}
      >
        {title}
      </div>
      {segments.map((seg) => {
        const isSelected = selectedValues.includes(seg.label);
        return (
          <button
            key={seg.label}
            onClick={() => onToggle(seg.label)}
            style={{
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              padding: "0.15rem 0.5rem",
              fontSize: "0.75rem",
              background: isSelected ? "#2563eb" : "white",
              color: isSelected ? "white" : "#111827",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <span>{seg.label}</span>
            <span
              style={{
                marginLeft: "0.5rem",
                fontSize: "0.7rem",
                opacity: 0.8,
              }}
            >
              {seg.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function VerticalNavCard({ title, icon, field, segments, selectedValues, isActive, onCardClick, onToggle, onSegmentPeek }) {
  return (
    <div
      style={{
        borderRadius: "0.5rem",
        border: isActive ? "2px solid #2563eb" : "1px solid #e5e7eb",
        background: isActive ? "#eff6ff" : "#f9fafb",
        overflow: "hidden",
        transition: "all 0.2s",
      }}
    >
      {/* Card Header - Always Visible */}
      <button
        onClick={onCardClick}
        style={{
          width: "100%",
          padding: "0.5rem 0.75rem",
          border: "none",
          background: "transparent",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: "1rem" }}>{icon}</span>
        <span style={{ flex: 1, fontSize: "0.8rem", fontWeight: 600, color: "#111827" }}>
          {title}
        </span>
        <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>
          {segments.length} options
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            color: "#6b7280",
            transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          ▼
        </span>
      </button>

      {/* Expanded Segments */}
      {isActive && (
        <div
          style={{
            padding: "0.25rem 0.75rem 0.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          {segments.map((seg) => {
            const isSelected = selectedValues.includes(seg.label);
            return (
              <div
                key={seg.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <button
                  onClick={() => onToggle(seg.label)}
                  style={{
                    flex: 1,
                    borderRadius: "0.375rem",
                    border: "1px solid #d1d5db",
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.75rem",
                    background: isSelected ? "#2563eb" : "white",
                    color: isSelected ? "white" : "#111827",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {seg.label}
                  </span>
                  <span
                    style={{
                      marginLeft: "0.5rem",
                      fontSize: "0.7rem",
                      opacity: 0.8,
                      fontWeight: 600,
                    }}
                  >
                    {seg.count}
                  </span>
                </button>
                <button
                  onClick={() => onSegmentPeek(seg.label)}
                  title="Preview"
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "0.25rem",
                    border: "1px solid #d1d5db",
                    background: "#f9fafb",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    color: "#6b7280",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#2563eb";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f9fafb";
                    e.currentTarget.style.color = "#6b7280";
                  }}
                >
                  ▶
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PeekPanel({ peekData, selectedAttendee, onClose, onAttendeeClick }) {
  return (
    <div
      style={{
        borderRadius: "0.5rem",
        border: "1px solid #e5e7eb",
        background: "white",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        maxHeight: "560px",
        overflow: "hidden",
      }}
    >
      {/* Peek Header */}
      <div
        style={{
          padding: "0.75rem",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#f9fafb",
        }}
      >
        <div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {selectedAttendee ? "Attendee Details" : "Segment Preview"}
          </div>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#111827" }}>
            {selectedAttendee ? selectedAttendee.name : peekData?.segment || "—"}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "0.25rem",
            border: "none",
            background: "#e5e7eb",
            cursor: "pointer",
            fontSize: "1rem",
            color: "#6b7280",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>
      </div>

      {/* Peek Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "0.75rem" }}>
        {selectedAttendee ? (
          <AttendeePeekDetails attendee={selectedAttendee} />
        ) : peekData ? (
          <SegmentPeekList attendees={peekData.attendees} onAttendeeClick={onAttendeeClick} />
        ) : null}
      </div>
    </div>
  );
}

function AttendeePeekDetails({ attendee }) {
  const fields = [
    { label: "ID", value: attendee.id },
    { label: "Name", value: attendee.name },
    { label: "Company", value: attendee.company || "—" },
    { label: "Email", value: attendee.email || "—" },
    { label: "Phone", value: attendee.phone || "—" },
    { label: "Confirmation", value: attendee.confirmationId || "—" },
    { label: "Registration Date", value: attendee.registrationDate || "—" },
    { label: "Member Type", value: attendee.memberType },
    { label: "Status", value: attendee.membershipStatus },
    { label: "Province", value: attendee.province },
    { label: "Registration Type", value: attendee.registrationType },
    { label: "Dietary", value: attendee.dietary },
    { label: "Session", value: attendee.session },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {fields.map((f) => (
        <div
          key={f.label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0.35rem 0",
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>{f.label}</span>
          <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "#111827", textAlign: "right" }}>
            {f.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function SegmentPeekList({ attendees, onAttendeeClick }) {
  return (
    <div>
      <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.5rem" }}>
        {attendees.length} attendee(s) in this segment
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {attendees.map((a) => (
          <button
            key={a.id}
            onClick={() => onAttendeeClick(a)}
            style={{
              padding: "0.5rem",
              borderRadius: "0.375rem",
              border: "1px solid #e5e7eb",
              background: "#fafafa",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#eff6ff";
              e.currentTarget.style.borderColor = "#2563eb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fafafa";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "#111827" }}>{a.name}</div>
            <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>
              {a.memberType} · {a.province}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AttendeeList({ attendees, onAttendeeClick }) {
  const columns = [
    { key: "id", label: "ID", width: "60px" },
    { key: "name", label: "Name", width: "150px" },
    { key: "company", label: "Company", width: "140px" },
    { key: "email", label: "Email", width: "180px" },
    { key: "phone", label: "Phone", width: "130px" },
    { key: "confirmationId", label: "Confirmation ID", width: "120px" },
    { key: "registrationDate", label: "Reg. Date", width: "100px" },
  ];

  if (!attendees.length) {
    return (
      <div
        style={{
          borderRadius: "0.5rem",
          border: "1px solid #e5e7eb",
          padding: "0.75rem",
          background: "#f9fafb",
          fontSize: "0.8rem",
          color: "#6b7280",
        }}
      >
        No attendees match the current filters.
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: "0.5rem",
        border: "1px solid #e5e7eb",
        background: "#f9fafb",
        fontSize: "0.75rem",
        maxHeight: "480px",
        overflow: "auto",
      }}
    >
      {/* Table Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: columns.map((c) => c.width).join(" "),
          background: "#f3f4f6",
          borderBottom: "1px solid #d1d5db",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        {columns.map((col) => (
          <div
            key={col.key}
            style={{
              padding: "0.5rem 0.5rem",
              fontWeight: 600,
              color: "#374151",
              borderRight: "1px solid #e5e7eb",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.025em",
            }}
          >
            {col.label}
          </div>
        ))}
      </div>

      {/* Table Body */}
      {attendees.map((a, idx) => (
        <div
          key={a.id}
          onClick={() => onAttendeeClick && onAttendeeClick(a)}
          style={{
            display: "grid",
            gridTemplateColumns: columns.map((c) => c.width).join(" "),
            borderBottom: "1px solid #e5e7eb",
            background: idx % 2 === 0 ? "white" : "#fafafa",
            cursor: onAttendeeClick ? "pointer" : "default",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => {
            if (onAttendeeClick) e.currentTarget.style.background = "#eff6ff";
          }}
          onMouseLeave={(e) => {
            if (onAttendeeClick) e.currentTarget.style.background = idx % 2 === 0 ? "white" : "#fafafa";
          }}
        >
          <div style={{ padding: "0.5rem", color: "#6b7280", borderRight: "1px solid #e5e7eb" }}>
            {a.id}
          </div>
          <div style={{ padding: "0.5rem", fontWeight: 500, color: "#111827", borderRight: "1px solid #e5e7eb", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {a.name}
          </div>
          <div style={{ padding: "0.5rem", color: "#374151", borderRight: "1px solid #e5e7eb", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {a.company || "—"}
          </div>
          <div style={{ padding: "0.5rem", color: "#2563eb", borderRight: "1px solid #e5e7eb", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {a.email || "—"}
          </div>
          <div style={{ padding: "0.5rem", color: "#374151", borderRight: "1px solid #e5e7eb" }}>
            {a.phone || "—"}
          </div>
          <div style={{ padding: "0.5rem", color: "#059669", fontFamily: "monospace", fontSize: "0.7rem", borderRight: "1px solid #e5e7eb" }}>
            {a.confirmationId || "—"}
          </div>
          <div style={{ padding: "0.5rem", color: "#6b7280" }}>
            {a.registrationDate || "—"}
          </div>
        </div>
      ))}
    </div>
  );
}

function DemographicCard({ title, field, attendees, colorPalette, onFilterClick }) {
  const segments = useMemo(() => groupByField(attendees, field), [attendees, field]);
  const totalCount = attendees.length;
  const segmentsWithPercentage = useMemo(
    () => computeSegmentsWithPercentage(segments, totalCount),
    [segments, totalCount]
  );

  const getColor = (idx) => colorPalette[idx % colorPalette.length];

  return (
    <div
      style={{
        borderRadius: "0.75rem",
        border: "1px solid #e5e7eb",
        padding: "0.75rem",
        background: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div
        style={{
          fontSize: "0.85rem",
          fontWeight: 700,
          color: "#111827",
          marginBottom: "0.25rem",
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: "0.7rem", color: "#6b7280", marginBottom: "0.25rem" }}>
        {segments.length} options
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {segmentsWithPercentage.map((seg, idx) => {
          const color = getColor(idx);
          return (
            <div
              key={seg.label}
              style={{
                cursor: onFilterClick ? "pointer" : "default",
                transition: "all 0.2s",
              }}
              onClick={() => onFilterClick && onFilterClick(field, seg.label)}
              onMouseEnter={(e) => {
                if (onFilterClick) {
                  e.currentTarget.style.transform = "scale(1.02)";
                }
              }}
              onMouseLeave={(e) => {
                if (onFilterClick) {
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.72rem",
                  color: "#374151",
                  marginBottom: "0.25rem",
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {seg.label}
                </span>
                <span
                  style={{
                    marginLeft: "0.5rem",
                    fontWeight: 700,
                    color: "#111827",
                    fontSize: "0.75rem",
                  }}
                >
                  {seg.count}
                </span>
                <span
                  style={{
                    marginLeft: "0.35rem",
                    fontSize: "0.7rem",
                    color: "#6b7280",
                  }}
                >
                  ({seg.percentage}%)
                </span>
              </div>
              <div
                style={{
                  height: "6px",
                  borderRadius: "999px",
                  background: "#f3f4f6",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${seg.percentage}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}dd)`,
                    borderRadius: "999px",
                    transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    boxShadow: `0 0 8px ${color}40`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartPreviewSlideout({ data, title, attendees, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState({
    viewMode: "count",
    selectedMembershipTypes: [],
    dateRange: "all",
  });
  const reducedMotion = prefersReducedMotion();

  React.useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (showConfig) {
          setShowConfig(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, showConfig]);

  const transformedData = useMemo(
    () => transformChartData(data, config, attendees),
    [data, config, attendees]
  );

  const totalRegistrations = transformedData[transformedData.length - 1]?.registrations || 0;
  const totalRevenue = transformedData[transformedData.length - 1]?.revenue || 0;
  const avgRevenuePerRegistrant = totalRegistrations > 0 ? (totalRevenue / totalRegistrations).toFixed(0) : 0;
  const peakWeek = transformedData.reduce((max, item) => item.registrations > max.registrations ? item : max, transformedData[0]);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.3)",
          zIndex: 199,
          opacity: isVisible ? 1 : 0,
          transition: reducedMotion ? "opacity 0.01s ease-in-out" : "opacity 0.3s ease-in-out",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "32rem",
          background: "white",
          boxShadow: "-6px 0 15px rgba(0,0,0,0.1)",
          borderLeft: "1px solid #e5e7eb",
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          transform: isVisible ? "translateX(0)" : "translateX(100%)",
          transition: reducedMotion ? "transform 0.01s ease-in-out" : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>
              {title}
            </h3>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "#6b7280" }}>
              Chart Preview & Analysis
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#f3f4f6",
              borderRadius: "0.5rem",
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              cursor: "pointer",
              color: "#374151",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#e5e7eb";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#f3f4f6";
              e.target.style.transform = "scale(1)";
            }}
          >
            Close
          </button>
        </div>

        <div style={{ padding: "1.5rem", flex: 1 }}>
          <div
            style={{
              background: "#f9fafb",
              borderRadius: "0.5rem",
              padding: "1rem",
              border: "1px solid #e5e7eb",
              marginBottom: "1.5rem",
            }}
          >
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart
                data={transformedData}
                margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  stroke="#9ca3af"
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  stroke="#9ca3af"
                  label={{
                    value: "Registrations",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: "#6b7280" },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  stroke="#9ca3af"
                  label={{
                    value: "Revenue ($)",
                    angle: 90,
                    position: "insideRight",
                    style: { fontSize: 11, fill: "#6b7280" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                    padding: "0.5rem",
                  }}
                  formatter={(value, name) => {
                    if (name === "Revenue ($)") {
                      return `$${value.toLocaleString()}`;
                    }
                    return value;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "0.75rem", paddingTop: "0.5rem" }}
                  iconType="plainline"
                />
                <Bar
                  yAxisId="left"
                  dataKey="registrations"
                  fill="#2563eb"
                  name="Registrations"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e", r: 4 }}
                  name="Revenue ($)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              background: "#f0f9ff",
              border: "1px solid #bae6fd",
              borderRadius: "0.75rem",
              padding: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0c4a6e", marginBottom: "0.75rem" }}>
              Summary Statistics
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>Total Registrations</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0c4a6e" }}>
                  {totalRegistrations}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>Total Revenue</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0c4a6e" }}>
                  ${totalRevenue.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>Avg per Registrant</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0c4a6e" }}>
                  ${avgRevenuePerRegistrant}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>Peak Week</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0c4a6e" }}>
                  {peakWeek.label}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => setShowConfig(true)}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid #2563eb",
                background: "white",
                color: "#2563eb",
                fontSize: "0.85rem",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#eff6ff";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "white";
              }}
            >
              Configure Chart
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                border: "none",
                background: "#e5e7eb",
                color: "#374151",
                fontSize: "0.85rem",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#d1d5db";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#e5e7eb";
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
      {showConfig && (
        <ChartConfigPanel
          config={config}
          onConfigChange={setConfig}
          onClose={() => setShowConfig(false)}
          onApply={() => {}}
        />
      )}
    </>
  );
}

function ChartConfigPanel({ onClose, onApply, config, onConfigChange }) {
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = prefersReducedMotion();

  React.useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const membershipTypes = ["CPA", "Student", "Non-member", "Guest"];

  function handleReset() {
    onConfigChange({
      viewMode: "count",
      selectedMembershipTypes: [],
      dateRange: "all",
    });
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "28rem",
        background: "white",
        boxShadow: "-6px 0 15px rgba(0,0,0,0.1)",
        borderLeft: "1px solid #e5e7eb",
        zIndex: 210,
        display: "flex",
        flexDirection: "column",
        transform: isVisible ? "translateX(-32rem)" : "translateX(100%)",
        transition: reducedMotion ? "transform 0.01s ease-in-out" : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "1.5rem",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>
            Chart Configuration
          </h3>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "#6b7280" }}>
            Customize chart display and filters
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "#6b7280",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: "1.5rem", flex: 1 }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
            View Mode
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <label style={{ display: "flex", alignItems: "center", fontSize: "0.8rem", cursor: "pointer" }}>
              <input
                type="radio"
                name="viewMode"
                value="count"
                checked={config.viewMode === "count"}
                onChange={(e) => onConfigChange({ ...config, viewMode: e.target.value })}
                style={{ marginRight: "0.5rem" }}
              />
              Count
            </label>
            <label style={{ display: "flex", alignItems: "center", fontSize: "0.8rem", cursor: "pointer" }}>
              <input
                type="radio"
                name="viewMode"
                value="percentage"
                checked={config.viewMode === "percentage"}
                onChange={(e) => onConfigChange({ ...config, viewMode: e.target.value })}
                style={{ marginRight: "0.5rem" }}
              />
              Percentage
            </label>
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
            Filter by Membership Type
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {membershipTypes.map((type) => {
              const isSelected = config.selectedMembershipTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => {
                    const updated = isSelected
                      ? config.selectedMembershipTypes.filter((t) => t !== type)
                      : [...config.selectedMembershipTypes, type];
                    onConfigChange({ ...config, selectedMembershipTypes: updated });
                  }}
                  style={{
                    padding: "0.4rem 0.75rem",
                    borderRadius: "999px",
                    border: "1px solid #d1d5db",
                    background: isSelected ? "#2563eb" : "white",
                    color: isSelected ? "white" : "#374151",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    fontWeight: isSelected ? 600 : 400,
                    transition: "all 0.2s",
                  }}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
            Date Range
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { value: "all", label: "All Weeks" },
              { value: "last4", label: "Last 4 Weeks" },
              { value: "last2", label: "Last 2 Weeks" },
            ].map((option) => (
              <label
                key={option.value}
                style={{ display: "flex", alignItems: "center", fontSize: "0.8rem", cursor: "pointer" }}
              >
                <input
                  type="radio"
                  name="dateRange"
                  value={option.value}
                  checked={config.dateRange === option.value}
                  onChange={(e) => onConfigChange({ ...config, dateRange: e.target.value })}
                  style={{ marginRight: "0.5rem" }}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "1.5rem",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          gap: "0.75rem",
        }}
      >
        <button
          onClick={handleReset}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid #d1d5db",
            background: "white",
            color: "#374151",
            fontSize: "0.85rem",
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#f9fafb";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "white";
          }}
        >
          Reset
        </button>
        <button
          onClick={() => {
            onApply();
            onClose();
          }}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontSize: "0.85rem",
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#1d4ed8";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#2563eb";
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

// -------------------- Correlation Slideout --------------------

function CorrelationSlideout({ attendees, dimension, dimensionLabel, metric, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [drilldownSegment, setDrilldownSegment] = useState(null);
  const reducedMotion = prefersReducedMotion();

  React.useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (drilldownSegment) {
          setDrilldownSegment(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, drilldownSegment]);

  const { results, insight } = useMemo(
    () => computeCorrelation(attendees, dimension, metric),
    [attendees, dimension, metric]
  );

  const metricLabel = metric === "renewal" ? "Renewal Rate" : metric;

  // Get attendees for drilldown segment
  const drilldownAttendees = useMemo(() => {
    if (!drilldownSegment) return [];
    return attendees.filter((a) => (a[dimension] || "Unknown") === drilldownSegment);
  }, [attendees, dimension, drilldownSegment]);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.3)",
          zIndex: 199,
          opacity: isVisible ? 1 : 0,
          transition: reducedMotion ? "opacity 0.01s ease-in-out" : "opacity 0.3s ease-in-out",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "32rem",
          maxWidth: "90vw",
          background: "white",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          transform: isVisible ? "translateX(0)" : "translateX(100%)",
          transition: reducedMotion
            ? "transform 0.01s ease-in-out"
            : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>
              Correlation Analysis
            </h3>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "#6b7280" }}>
              {dimensionLabel} vs {metricLabel}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#6b7280",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "1.5rem", flex: 1, overflowY: "auto" }}>
          {/* Key Insight Box */}
          <div
            style={{
              padding: "1rem",
              borderRadius: "0.5rem",
              background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              border: "1px solid #fbbf24",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#92400e",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.5rem",
              }}
            >
              Key Insight
            </div>
            <div style={{ fontSize: "0.9rem", color: "#78350f", fontWeight: 500 }}>
              {insight}
            </div>
          </div>

          {/* Correlation Results */}
          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "1rem",
              }}
            >
              Breakdown by {dimensionLabel}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {results.map((result, idx) => {
                const renewalRate = parseFloat(result.renewalRate);
                const colorIntensity = Math.max(0.3, renewalRate / 100);
                const barColor = `rgba(37, 99, 235, ${colorIntensity})`;
                const isSelected = drilldownSegment === result.label;

                return (
                  <button
                    key={result.label}
                    onClick={() => setDrilldownSegment(isSelected ? null : result.label)}
                    style={{
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      border: isSelected ? "2px solid #2563eb" : "1px solid #e5e7eb",
                      background: isSelected ? "#eff6ff" : "#f9fafb",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = "#93c5fd";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = "#e5e7eb";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {result.label}
                        <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>→ View details</span>
                      </div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2563eb" }}>
                        {result.renewalRate}%
                      </div>
                    </div>

                    <div
                      style={{
                        width: "100%",
                        height: "0.5rem",
                        background: "#e5e7eb",
                        borderRadius: "999px",
                        overflow: "hidden",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          width: `${result.renewalRate}%`,
                          height: "100%",
                          background: barColor,
                          borderRadius: "999px",
                          transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        fontSize: "0.75rem",
                        color: "#6b7280",
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600 }}>Total:</span> {result.total}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600 }}>Renewed:</span> {result.renewed}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600 }}>Not Renewed:</span> {result.notRenewed}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "1.5rem",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: "0.75rem",
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              background: "white",
              color: "#374151",
              fontSize: "0.85rem",
              cursor: "pointer",
              fontWeight: 600,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#f9fafb";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "white";
            }}
          >
            Close
          </button>
        </div>
      </div>

      {/* Double Slide Panel - Drilldown Details */}
      {drilldownSegment && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: "26rem",
            maxWidth: "80vw",
            background: "white",
            boxShadow: "-4px 0 20px rgba(0,0,0,0.2)",
            zIndex: 201,
            display: "flex",
            flexDirection: "column",
            transform: drilldownSegment ? "translateX(0)" : "translateX(100%)",
            transition: reducedMotion
              ? "transform 0.01s ease-in-out"
              : "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Nested Panel Header */}
          <div
            style={{
              padding: "1.25rem",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#f9fafb",
            }}
          >
            <div>
              <button
                onClick={() => setDrilldownSegment(null)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  color: "#2563eb",
                  padding: 0,
                  marginBottom: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                ← Back to Analysis
              </button>
              <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
                {drilldownSegment}
              </h4>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "#6b7280" }}>
                {drilldownAttendees.length} attendee(s) in this segment
              </p>
            </div>
            <button
              onClick={() => setDrilldownSegment(null)}
              style={{
                border: "none",
                background: "#e5e7eb",
                fontSize: "1rem",
                cursor: "pointer",
                color: "#6b7280",
                width: "28px",
                height: "28px",
                borderRadius: "0.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>

          {/* Nested Panel Content - Attendee List */}
          <div style={{ flex: 1, overflow: "auto", padding: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {drilldownAttendees.map((attendee) => (
                <div
                  key={attendee.id}
                  style={{
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #e5e7eb",
                    background: "#fafafa",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>
                        {attendee.name}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                        {attendee.memberType} · {attendee.membershipStatus}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "0.15rem 0.5rem",
                        borderRadius: "999px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        background: attendee.renewed ? "#dcfce7" : "#fee2e2",
                        color: attendee.renewed ? "#166534" : "#991b1b",
                      }}
                    >
                      {attendee.renewed ? "Renewed" : "Not Renewed"}
                    </div>
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "0.5rem" }}>
                    {attendee.email || "—"} · {attendee.province}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nested Panel Footer */}
          <div
            style={{
              padding: "1rem",
              borderTop: "1px solid #e5e7eb",
              background: "#f9fafb",
            }}
          >
            <button
              onClick={() => setDrilldownSegment(null)}
              style={{
                width: "100%",
                padding: "0.6rem 1rem",
                borderRadius: "0.375rem",
                border: "1px solid #d1d5db",
                background: "white",
                color: "#374151",
                fontSize: "0.8rem",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// -------------------- Insights Bottom Panel --------------------

function InsightsBottomPanel({ attendees, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = prefersReducedMotion();

  React.useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const membershipTypeSegments = useMemo(
    () => groupByField(attendees, "memberType"),
    [attendees]
  );
  const ageGroupSegments = useMemo(
    () => groupByField(attendees, "ageGroup"),
    [attendees]
  );
  const educationSegments = useMemo(
    () => groupByField(attendees, "education"),
    [attendees]
  );
  const provinceSegments = useMemo(
    () => groupByField(attendees, "province"),
    [attendees]
  );
  const reasonSegments = useMemo(
    () => groupByField(attendees, "primaryReason"),
    [attendees]
  );

  const totalAttendees = attendees.length;

  const colorPalettes = {
    membershipType: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"],
    ageGroup: ["#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6"],
    education: ["#84cc16", "#22c55e", "#10b981", "#14b8a6"],
    province: ["#f43f5e", "#ec4899", "#d946ef", "#a855f7"],
    reason: ["#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981"],
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.3)",
          zIndex: 29,
          opacity: isVisible ? 1 : 0,
          transition: reducedMotion ? "opacity 0.01s ease-in-out" : "opacity 0.3s ease-in-out",
        }}
      />
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(to top, #ffffff, #fefefe)",
          borderTop: "1px solid #d1d5db",
          boxShadow: "0 -10px 40px rgba(0,0,0,0.15)",
          padding: "1.25rem 1.5rem 1.5rem",
          zIndex: 30,
          transform: isVisible ? "translateY(0)" : "translateY(100%)",
          transition: reducedMotion ? "transform 0.01s ease-in-out" : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
            paddingBottom: "0.75rem",
            borderBottom: "2px solid #e5e7eb",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#111827",
                letterSpacing: "-0.01em",
              }}
            >
              Event Insights
            </h3>
            <p
              style={{
                margin: "0.25rem 0 0",
                fontSize: "0.8rem",
                color: "#6b7280",
              }}
            >
              Demographic breakdown of {totalAttendees} attendees
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#f3f4f6",
              borderRadius: "0.5rem",
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              cursor: "pointer",
              color: "#374151",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#e5e7eb";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#f3f4f6";
              e.target.style.transform = "scale(1)";
            }}
          >
            Close
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: "1rem",
          }}
        >
          <DimensionInsight
            title="Membership Type"
            segments={membershipTypeSegments}
            totalCount={totalAttendees}
            colorPalette={colorPalettes.membershipType}
            delay={0}
            reducedMotion={reducedMotion}
          />
          <DimensionInsight
            title="Age Group"
            segments={ageGroupSegments}
            totalCount={totalAttendees}
            colorPalette={colorPalettes.ageGroup}
            delay={0.1}
            reducedMotion={reducedMotion}
          />
          <DimensionInsight
            title="Education"
            segments={educationSegments}
            totalCount={totalAttendees}
            colorPalette={colorPalettes.education}
            delay={0.2}
            reducedMotion={reducedMotion}
          />
          <DimensionInsight
            title="Province"
            segments={provinceSegments}
            totalCount={totalAttendees}
            colorPalette={colorPalettes.province}
            delay={0.3}
            reducedMotion={reducedMotion}
          />
          <DimensionInsight
            title="Primary Reason"
            segments={reasonSegments}
            totalCount={totalAttendees}
            colorPalette={colorPalettes.reason}
            delay={0.4}
            reducedMotion={reducedMotion}
          />
        </div>
      </div>
    </>
  );
}

function DimensionInsight({ title, segments, totalCount, colorPalette, delay, reducedMotion }) {
  const [isAnimated, setIsAnimated] = useState(false);

  React.useEffect(() => {
    setTimeout(() => setIsAnimated(true), delay * 1000 + 100);
  }, [delay]);

  return (
    <div
      style={{
        borderRadius: "0.75rem",
        border: "1px solid #d1d5db",
        padding: "0.75rem",
        background: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        opacity: isAnimated ? 1 : 0,
        transform: isAnimated ? "translateY(0)" : "translateY(10px)",
        transition: reducedMotion ? `all 0.01s ease-out` : `all 0.4s ease-out ${delay}s`,
      }}
    >
      <div
        style={{
          fontSize: "0.8rem",
          fontWeight: 700,
          marginBottom: "0.5rem",
          color: "#111827",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </div>
      <div style={{ marginBottom: "0.5rem" }}>
        {segments.map((s, idx) => {
          const percentage = ((s.count / totalCount) * 100).toFixed(1);
          const color = colorPalette[idx % colorPalette.length];
          return (
            <div
              key={s.label}
              style={{ marginBottom: "0.5rem" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.72rem",
                  color: "#374151",
                  marginBottom: "0.25rem",
                  fontWeight: 500,
                }}
              >
                <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.label}
                </span>
                <span
                  style={{
                    marginLeft: "0.5rem",
                    fontWeight: 700,
                    color: "#111827",
                    fontSize: "0.75rem",
                  }}
                >
                  {s.count}
                </span>
                <span
                  style={{
                    marginLeft: "0.35rem",
                    fontSize: "0.7rem",
                    color: "#6b7280",
                  }}
                >
                  ({percentage}%)
                </span>
              </div>
              <div
                style={{
                  height: "6px",
                  borderRadius: "999px",
                  background: "#f3f4f6",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: isAnimated ? `${percentage}%` : "0%",
                    background: `linear-gradient(90deg, ${color}, ${color}dd)`,
                    borderRadius: "999px",
                    transition: reducedMotion ? "width 0.01s ease-in-out" : "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transitionDelay: reducedMotion ? "0s" : `${delay + idx * 0.05}s`,
                    boxShadow: `0 0 8px ${color}40`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------- Insights Config Slide-out --------------------

function InsightsConfigSlideout({ attendees, onClose }) {
  const [selectedProvinces, setSelectedProvinces] = useState([
    "Newfoundland and Labrador",
  ]);
  const [showAs, setShowAs] = useState("share"); // "raw" | "share"

  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const allProvinces = useMemo(
    () => groupByField(attendees, "province").map((s) => s.label),
    [attendees]
  );

  const results = useMemo(
    () => computeRenewalByProvince(attendees, selectedProvinces, showAs === "share"),
    [attendees, selectedProvinces, showAs]
  );

  function toggleProvince(prov) {
    setSelectedProvinces((prev) =>
      prev.includes(prov) ? prev.filter((p) => p !== prov) : [...prev, prov]
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "360px",
        background: "white",
        borderLeft: "1px solid #e5e7eb",
        boxShadow: "-6px 0 15px rgba(0,0,0,0.1)",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          padding: "0.75rem 1rem",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.85rem",
        }}
      >
        <div>
          <div style={{ fontWeight: 600 }}>Membership insight: NL</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
            Location vs renewal patterns (prototype)
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "1rem",
            cursor: "pointer",
            color: "#6b7280",
          }}
        >
          ×
        </button>
      </header>
      <div
        style={{
          padding: "0.75rem 1rem",
          fontSize: "0.8rem",
          overflowY: "auto",
          flex: 1,
        }}
      >
        <div style={{ marginBottom: "0.5rem" }}>
          <div style={{ color: "#6b7280" }}>What to count</div>
          <select
            disabled
            style={{
              width: "100%",
              borderRadius: "0.4rem",
              border: "1px solid #d1d5db",
              padding: "0.25rem 0.4rem",
              fontSize: "0.8rem",
              background: "#f9fafb",
            }}
          >
            <option>Members</option>
          </select>
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <div style={{ color: "#6b7280" }}>Break down by</div>
          <select
            disabled
            style={{
              width: "100%",
              borderRadius: "0.4rem",
              border: "1px solid #d1d5db",
              padding: "0.25rem 0.4rem",
              fontSize: "0.8rem",
              background: "#f9fafb",
            }}
          >
            <option>Province</option>
          </select>
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <div style={{ color: "#6b7280" }}>Selected provinces</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
            {allProvinces.map((prov) => {
              const selected = selectedProvinces.includes(prov);
              return (
                <button
                  key={prov}
                  onClick={() => toggleProvince(prov)}
                  style={{
                    borderRadius: "999px",
                    border: "1px solid #d1d5db",
                    padding: "0.15rem 0.5rem",
                    fontSize: "0.75rem",
                    background: selected ? "#2563eb" : "white",
                    color: selected ? "white" : "#111827",
                    cursor: "pointer",
                  }}
                >
                  {prov}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <div style={{ color: "#6b7280" }}>Only include</div>
          <select
            disabled
            style={{
              width: "100%",
              borderRadius: "0.4rem",
              border: "1px solid #d1d5db",
              padding: "0.25rem 0.4rem",
              fontSize: "0.8rem",
              background: "#f9fafb",
            }}
          >
            <option>All member types</option>
          </select>
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <div style={{ color: "#6b7280" }}>How far back</div>
          <select
            disabled
            style={{
              width: "100%",
              borderRadius: "0.4rem",
              border: "1px solid #d1d5db",
              padding: "0.25rem 0.4rem",
              fontSize: "0.8rem",
              background: "#f9fafb",
            }}
          >
            <option>5 years</option>
          </select>
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <div style={{ color: "#6b7280", marginBottom: "0.25rem" }}>
            Show as
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <label style={{ fontSize: "0.8rem", cursor: "pointer" }}>
              <input
                type="radio"
                name="showAs"
                value="raw"
                checked={showAs === "raw"}
                onChange={() => setShowAs("raw")}
                style={{ marginRight: "0.25rem" }}
              />
              Raw numbers
            </label>
            <label style={{ fontSize: "0.8rem", cursor: "pointer" }}>
              <input
                type="radio"
                name="showAs"
                value="share"
                checked={showAs === "share"}
                onChange={() => setShowAs("share")}
                style={{ marginRight: "0.25rem" }}
              />
              Share of total
            </label>
          </div>
        </div>

        <div
          style={{
            marginTop: "0.75rem",
            fontSize: "0.8rem",
            color: "#6b7280",
          }}
        >
          Results (computed from mock attendee data):
        </div>
        <div style={{ marginTop: "0.25rem" }}>
          {results.map((r) => (
            <div
              key={r.province}
              style={{
                marginBottom: "0.4rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.8rem",
                }}
              >
                <span>{r.province}</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                  }}
                >
                  Renewed:{" "}
                  {showAs === "share"
                    ? `${r.renewed.toFixed(0)}%`
                    : r.renewed}{" "}
                  · Not renewed:{" "}
                  {showAs === "share"
                    ? `${r.notRenewed.toFixed(0)}%`
                    : r.notRenewed}
                </span>
              </div>
              <div
                style={{
                  height: "6px",
                  borderRadius: "999px",
                  background: "#e5e7eb",
                  overflow: "hidden",
                  marginTop: "0.15rem",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(r.renewed / (r.renewed + r.notRenewed || 1)) *
                      100}%`,
                    background: "#22c55e",
                  }}
                />
                <div
                  style={{
                    height: "100%",
                    flex: 1,
                    background: "transparent",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer
        style={{
          padding: "0.5rem 1rem",
          borderTop: "1px solid #e5e7eb",
          fontSize: "0.8rem",
          textAlign: "right",
        }}
      >
        <button
          onClick={onClose}
          style={{
            border: "none",
            borderRadius: "999px",
            padding: "0.25rem 0.75rem",
            fontSize: "0.8rem",
            background: "#e5e7eb",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </footer>
    </div>
  );
}

export default CentralEventReportingDemo;
