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

// -------------------- Helper Functions --------------------

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
          attendees={MOCK_ATTENDEES}
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
          <div style={{ textAlign: "right", fontSize: "0.75rem" }}>
            <div style={{ color: "#6b7280" }}>Countdown</div>
            <div style={{ fontWeight: 600 }}>~ X days (demo)</div>
          </div>
        </header>

        <EventTabs activeTab={activeTab} onChange={setActiveTab} />

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

function EventProfileTab({ event, attendees, kpis, onOpenInsights }) {
  const membershipSegments = useMemo(
    () => groupByField(attendees, "membershipStatus"),
    [attendees]
  );

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
      <KpiRow kpis={kpis} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <ComboChartWithRecharts data={fakeTrendData} />
        <VitalsRow event={event} kpis={kpis} membershipSegments={membershipSegments} />
      </div>

      <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
        <button
          onClick={onOpenInsights}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "999px",
            border: "1px solid #2563eb",
            background: "white",
            color: "#2563eb",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          Open Insights
        </button>
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
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "0.95rem" }}>People</h3>
        <button
          onClick={onOpenInsightsSlideout}
          style={{
            border: "none",
            background: "transparent",
            color: "#2563eb",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          Open location vs renewal insights
        </button>
      </div>
      <MorePeopleListing attendees={attendees} />
    </div>
  );
}

function MorePeopleListing({ attendees }) {
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedView, setSelectedView] = useState("Default");

  const cards = [
    { title: "Registration Types", field: "registrationType" },
    { title: "Dietary Restrictions", field: "dietary" },
    { title: "Sessions", field: "session" },
    { title: "Tickets", field: "ticketType" },
    { title: "Membership Type", field: "memberType" },
    { title: "Age Group", field: "ageGroup" },
    { title: "Province", field: "province" },
    { title: "Tenure", field: "tenure" }, // not in mock, will show "Unknown"
    { title: "Education", field: "education" },
  ];

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
      // Remove empty arrays to keep object clean
      if (updated[field].length === 0) delete updated[field];
      return updated;
    });
  }

  function handleSaveView() {
    // Basic stub: simply record the name in state; in real app this would persist.
    const name = window.prompt("Name for this view?", selectedView);
    if (name) {
      setSelectedView(name);
    }
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)",
        gap: "1rem",
        marginTop: "0.5rem",
      }}
    >
      <div>
        <ListingFilterHeader selectedView={selectedView} onSaveView={handleSaveView} />
        <ListingSearchInput value={searchTerm} onChange={setSearchTerm} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "0.75rem",
            marginTop: "0.5rem",
          }}
        >
          {cards.map((card) => {
            const segments = groupByField(attendees, card.field);
            const selectedValues = filters[card.field] || [];
            return (
              <ListingCard
                key={card.title}
                title={card.title}
                segments={segments}
                selectedValues={selectedValues}
                onToggle={(segment) => handleToggle(card.field, segment)}
              />
            );
          })}
        </div>
      </div>
      <div>
        <AttendeeList attendees={filteredAttendees} />
      </div>
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

function AttendeeList({ attendees }) {
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
        padding: "0.75rem",
        background: "#f9fafb",
        fontSize: "0.8rem",
        maxHeight: "420px",
        overflow: "auto",
      }}
    >
      <div
        style={{
          marginBottom: "0.5rem",
          fontSize: "0.8rem",
          color: "#6b7280",
        }}
      >
        Showing {attendees.length} attendee(s)
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {attendees.map((a) => (
          <li
            key={a.id}
            style={{
              padding: "0.4rem 0.35rem",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              gap: "0.5rem",
            }}
          >
            <div>
              <div style={{ fontWeight: 500 }}>{a.name}</div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                {a.memberType} · {a.membershipStatus}
              </div>
            </div>
            <div style={{ fontSize: "0.7rem", textAlign: "right" }}>
              <div>{a.province}</div>
              <div>{a.registrationType}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// -------------------- Insights Bottom Panel --------------------

function InsightsBottomPanel({ attendees, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

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
          transition: "opacity 0.3s ease-in-out",
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
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
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
          />
          <DimensionInsight
            title="Age Group"
            segments={ageGroupSegments}
            totalCount={totalAttendees}
            colorPalette={colorPalettes.ageGroup}
            delay={0.1}
          />
          <DimensionInsight
            title="Education"
            segments={educationSegments}
            totalCount={totalAttendees}
            colorPalette={colorPalettes.education}
            delay={0.2}
          />
          <DimensionInsight
            title="Province"
            segments={provinceSegments}
            totalCount={totalAttendees}
            colorPalette={colorPalettes.province}
            delay={0.3}
          />
          <DimensionInsight
            title="Primary Reason"
            segments={reasonSegments}
            totalCount={totalAttendees}
            colorPalette={colorPalettes.reason}
            delay={0.4}
          />
        </div>
      </div>
    </>
  );
}

function DimensionInsight({ title, segments, totalCount, colorPalette, delay }) {
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
        transition: `all 0.4s ease-out ${delay}s`,
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
                    transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transitionDelay: `${delay + idx * 0.05}s`,
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
