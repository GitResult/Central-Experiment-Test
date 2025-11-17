import React, { useMemo, useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  closestCenter,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDraggable,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Plus,
  Minus,
  X,
  Cloud,
  Music,
  MapPin,
  Users,
  Calendar,
  Check,
  TrendingUp,
  Sun,
  Contact,
  CloudRain,
  Trash2,
  Layers,
  AppWindow,
  CaseUpper,
  Search,
  MoveLeft,
  MoveRight,
} from "lucide-react";
import ReviewTask from "./components/reviewTask";
import { updateDemoState } from "../redux/demo/actions";
import ReportBuilder from "./reports/report-browse.tsx";
import Breadcrumb from "../components/UI/Breadcrumb.jsx";

/**
 * Fix pack:
 * - Pointer-first collision (prefers inline slots) + taller inline hit areas.
 * - When pairing inline, remove the internal boundary and isolate the two-half row (add breaks at row start/end).
 * - Isolate the old partner when moving out of a paired row.
 * - Auto-fit span when dropping into inline gap (both template and existing card).
 */

// ----------------------- Demo Data -----------------------
const initialTemplates = [
  {
    id: "tpl-communities",
    type: "cpaCommunities",
    title: "CPA Communities",
    icon: "Users",
    defaultData: {
      communities: [
        {
          title: "Community Psychology",
          image: "/assets/images/community-psychology.jpg"
        },
        {
          title: "Environmental Psychology",
          image: "/assets/images/environmental-psychology.jpg"
        }
      ]
    },
  },
];

const initialCards = [
  {
    id: "contact-card",
    type: "contact",
    title: "Contact",
    width: "half",
    data: {
      name: "Michael Scott",
      memberId: "7293787",
      memberType: "Full Time Member",
      location: "California",
      role: "Regional Manager",
      email: "michael.scott@email.com",
      phone: "207-555-1234",
      image: "/assets/images/profile image.png"
    },
  },
  {
    id: "essentials",
    type: "essentials",
    title: "Essentials",
    width: "half",
    data: {},
  },
  {
    id: "membership-info",
    type: "membership",
    title: "Membership",
    width: "half",
    data: {
      joinedYear: "2010",
      yearsActive: "15",
      memberships: [
        {
          year: "2026",
          type: "Full-Time Member",
          status: "pending",
          amount: "$355.00",
          detail: "Pending Renewal"
        },
        {
          year: "2025",
          type: "Full-Time Member",
          status: "renewed",
          renewedDate: "Dec 20, 2024",
          invoice: "#541234",
          amount: "$355.00"
        },
        {
          year: "2024",
          type: "Student",
          status: "renewed",
          renewedDate: "Dec 12, 2023",
          invoice: "#541234",
          amount: "$175.00"
        }
      ]
    },
  },
  {
    id: "upcoming-events",
    type: "upcomingEvents",
    title: "Upcoming Events",
    width: "half",
    data: {
      events: [
        {
          month: "Aug",
          day: "6",
          time: "9:00 am - 4:00 pm",
          timezone: "EST",
          title: "Conflict management skills",
          type: "Webinar"
        },
        {
          month: "Nov",
          day: "14",
          time: "Nov 14th and 15th",
          timezone: "",
          title: "1st Annual CPA Satellite Conference: AI in Psychology",
          type: "Conference"
        }
      ]
    },
  },
  {
    id: "cpa-communities",
    type: "cpaCommunities",
    title: "CPA Communities",
    width: "half",
    data: {
      communities: [
        {
          title: "Community Psychology",
          image: "/assets/images/hand in tree.jpg"
        },
        {
          title: "Environmental Psychology",
          image: "/assets/images/tree in hand.jpg"
        }
      ]
    },
  },
];

const initialTasks = [
  {
    id: "task-1",
    personName: "Michael Scott",
    title: "Request for membership change - Parental leave",
    dueDate: "Mon, Oct 6",
    submittedDate: "Fri, Oct 3 9:25 am",
    submittedTime: "10 mins",
    tag: null,
    message: `Hi Sally,

We are expecting our first child in November.

I would like to apply for parent leave.

Please let me know why I may need to do.

Thanks!
Michael`,
    approvalForm: {
      changeEffective: "2025/10/03",
      refund: "credit-card",
      message: "Congratulations!\n\nThis is an exciting time for you and Dana.\nTake care and keep in touch!"
    }
  },
  {
    id: "task-2",
    personName: "Michael Lee",
    title: "Create report - Member demographics for potential sponsors for annual...",
    dueDate: "Today at 2:00 pm",
    submittedDate: "Today at 10:00 am",
    submittedTime: "4 hours",
    tag: "Board of Directors",
    message: `Hi Sally,

We need a report that covers the following:
Current members that are ECY1 and practitioners with a Masters Degree from BC.

Thanks!
Michael`,
    approvalForm: null
  },
  {
    id: "task-3",
    personName: "Renewals 2026",
    title: "Renew and approve plan for membership renewals 2026",
    dueDate: "Mon, Oct 6 at 10:00 am",
    submittedDate: "Fri, Oct 3 9:25 am",
    submittedTime: "10 mins",
    tag: "Membership Campaign 2026",
    message: `There are currently:
3 phases
11 tasks`,
    approvalForm: {
      message: "Approved to launch."
    }
  }
];

// ----------------------- Icons -----------------------
const IconMap = { Users, Calendar, Check, TrendingUp, Cloud, Music, MapPin, Sun, CloudRain, Contact };

// ----------------------- Size helpers -----------------------
const SIZE_ORDER = ["sm", "md", "lg"];
const sizePad = { sm: "p-4", md: "p-6", lg: "p-8" };
const sizeText = { sm: "text-[13px]", md: "text-[14px]", lg: "text-[15px]" };
function nextSize(cur, dir) {
  const i = SIZE_ORDER.indexOf(cur || "md");
  if (dir === "inc") return SIZE_ORDER[Math.min(i + 1, SIZE_ORDER.length - 1)];
  if (dir === "dec") return SIZE_ORDER[Math.max(i - 1, 0)];
  return cur || "md";
}

// ----------------------- Span helpers -----------------------
const SPAN_TO_CLASS = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};
const clampSpan = (n) => Math.max(2, Math.min(10, n | 0));

// ----------------------- Drop Slot -----------------------
function DropSlot({ id, isActive, span = 12 }) {
  const { setNodeRef, transform, transition, isOver } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const spanClass = SPAN_TO_CLASS[span] || "col-span-12";
  // Taller active hit area improves pointerWithin reliability on inline slots
  const activeH = String(id).startsWith("dz-inline-") ? "h-16" : "h-8";
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${spanClass} ${isActive ? `${activeH} opacity-100` : "h-2 opacity-0"} transition-all px-3`}
    >
      <div
        className={`h-full rounded-lg border-2 border-dashed ${isOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
          }`}
      />
    </div>
  );
}

// ----------------------- Sortable Card -----------------------
function SortableCard({ card, onToggleWidth, onRemove, onSizeChange, onResizeStart, cfg, onContextMenu, onTaskClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: card.id });
  const style = { transform: CSS.Transform.toString(transform) };

  return (
    <div ref={setNodeRef} style={style} className={`${card.width === "full" ? "col-span-2" : ""} px-3 mb-6`}>
      <div className={`transition-all ${isDragging ? "opacity-30 scale-95" : ""}`}>
        <div className="relative group">
          <div className="absolute top-3 -left-7 z-10">
            <div
              className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => onContextMenu(e, card.id)}
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <CardContent card={card} onTaskClick={onTaskClick} />

          <div
            className="absolute top-1/2 -right-3 -translate-y-1/2 w-2 h-8 rounded-full bg-gray-300/90 hover:bg-gray-400 border border-white shadow cursor-ew-resize z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onResizeStart(card.id, e);
            }}
          />
        </div>
      </div>
    </div>
  );
}

function CardContent({ card, onTaskClick }) {

  switch (card.type) {
    case "contact":
      return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          {/* Header breadcrumb */}
          <div className="mb-2.5">
            <Breadcrumb
              items={[
                { label: "Contacts", url: "/demo/contact-list" },
                { label: "Essentials" }
              ]}
            />
          </div>
          {/* <div className="text-sm text-gray-500 mb-2">
             {"Contacts -> Michael Scott -> Essentials"}
          </div> */}

          {/* Main content */}
          <div className="flex gap-4 mb-6">
            {/* Profile image */}
            <div className="flex-shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-100">
                <img
                  src={card.data.image ? process.env.PUBLIC_URL + card.data.image : `${process.env.PUBLIC_URL}/assets/images/default-avatar.png`}
                  alt={card.data.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = `${process.env.PUBLIC_URL}/assets/images/default-avatar.png` }}
                />
              </div>
            </div>

            {/* Contact info */}
            <div className="flex-1 min-w-0 ml-3">
              <h2 className="text-2xl text-black font-thin mb-1">
                {card.data.name}
              </h2>
              <div className="text-lg text-gray-900 mb-1">
                #{card.data.memberId} <span>{card.data.memberType}</span>
              </div>
              <div className="text-sm text-gray-700 mb-1">
                <span>{card.data.location}</span> | <span>{card.data.role}</span>
              </div>
              <div className="text-sm text-gray-700">
                <a href={`mailto:${card.data.email}`} className="hover:underline">
                  {card.data.email}
                </a>
                {' | '}
                <a href={`tel:${card.data.phone}`} className="hover:underline">
                  {card.data.phone}
                </a>
              </div>
              {/* Action buttons */}
              <div className="flex gap-4 flex-wrap mt-2">
                {[
                  { label: "Note", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
                  { label: "Email", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                  { label: "Task", icon: "M5 13l4 4L19 7" },
                  { label: "Event", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                  {
                    label: "More",
                    icon: "M12 5a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  }
                ].map((item) => (
                  <button
                    key={item.label}
                    className="flex flex-col items-center gap-1"
                    onClick={item.label === "Task" ? onTaskClick : undefined}
                  >
                    <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={item.icon}
                        />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case "essentials":
      return (
        <div className="p-6 hover:bg-gray-100 hover:rounded-2xl hover:shadow-sm mt-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 mt-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="text-black font-thin text-2xl font-serif">i</span>
            </div>
            <h3 className="text-lg font-thin text-gray-700 border-black border-b-1">Essentials</h3>
          </div>

          {/* Menu Items */}
          <div className="space-y-3">
            {/* Profile */}
            <button
              className="flex items-center justify-between pl-3 py-2.5 rounded-full border-2 border-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-all group"
              onClick={() => console.log('Navigate to contact profile')}
            >

              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="9" y1="9" x2="15" y2="9" strokeWidth="2" strokeLinecap="round" />
                    <line x1="9" y1="15" x2="15" y2="15" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-base font-medium text-gray-900">Profile</span>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors ml-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Enterprise */}
            <button
              className="flex items-center justify-between pl-3 py-2.5 rounded-full border-2 border-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-all group"
              onClick={() => console.log('Navigate to contact enterprise')}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
                    <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
                    <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
                    <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
                  </svg>
                </div>
                <span className="text-base font-medium text-gray-900">Enterprise</span>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors ml-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      );

    case "membership":
      return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-3 gap-2">
            {/* Quick Facts Section */}
            <div>
              <h3 className="text-xl text-gray-900 mb-4">Quick Facts</h3>

              {/* Status items with checkmarks */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">Paid</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">Renewal Form</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">Good-Standing</span>
                </div>
              </div>

              {/* Joined info */}
              <div className="pt-2 ml-4">
                <div className="text-sm text-gray-700">Joined {card.data.joinedYear || "2010"}</div>
                <div className="text-sm text-gray-700">{card.data.yearsActive || "15"} years</div>
              </div>
            </div>

            {/* Membership Section */}
            <div className="col-span-2 mb-6">
              <h3 className="text-xl text-gray-900 mb-4">Membership</h3>

              {/* Timeline */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[11px] top-0 h-[calc(100%-4rem)] w-0.5 bg-gray-200"></div>

                {/* Timeline items */}
                <div className="space-y-6">
                  {/* 2026 - Pending */}
                  <div className="relative flex gap-4">
                    <div className="relative z-10 w-6 h-6 rounded-full border-4 border-gray-300 bg-white flex-shrink-0"></div>
                    <div className="flex gap-8">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-base font-semibold text-gray-900">2026</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-700">Full-Time Member</span>
                        <div className="text-sm text-gray-600">
                          Pending Renewal <span className="text-gray-900">$355.00</span>
                          <span className="text-gray-400 ml-1">+ tax</span>
                        </div>
                        <button className="text-sm text-blue-500 hover:text-blue-600 font-medium mt-1">
                          Renew
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 2025 - Renewed */}
                  <div className="relative flex gap-4">
                    <div className="relative z-10 w-6 h-6 rounded-full border-4 border-green-500 bg-white flex-shrink-0"></div>
                    <div className="flex gap-8">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-base font-semibold text-gray-900">2025</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-700">Full-Time Member</span>
                        <div className="text-sm text-gray-600 mb-0.5">
                          Renewed Dec 20, 2024
                        </div>
                        <div className="text-sm text-gray-600">
                          INV #541234 <span className="text-gray-900">$355.00</span>
                          <span className="text-gray-400 ml-1">+ tax</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 2024 - Student */}
                  <div className="relative flex gap-4">
                    <div className="relative z-10 w-6 h-6 rounded-full border-4 border-green-500 bg-white flex-shrink-0"></div>
                    <div className="flex gap-8">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-base font-semibold text-gray-900">2024</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-700">Student</span>
                        <div className="text-sm text-gray-600 mb-0.5">
                          Renewed Dec 12, 2023
                        </div>
                        <div className="text-sm text-gray-600">
                          INV #541234 <span className="text-gray-900">$175.00</span>
                          <span className="text-gray-400 ml-1">+ tax</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case "upcomingEvents":
      return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl text-gray-900 mb-6">Upcoming Events</h3>

          <div className="space-y-6">
            {card.data.events.map((event, idx) => (
              <div key={idx}>
                <div className="flex gap-4">
                  {/* Date box */}
                  <div className="flex-shrink-0 text-center bg-gray-50 rounded-lg px-4 py-3 w-20">
                    <div className="text-sm text-gray-600 font-medium">{event.month}</div>
                    <div className="text-3xl text-gray-900">{event.day}</div>
                  </div>

                  {/* Event details */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">
                      {event.time} {event.timezone}
                    </div>
                    <h4 className="text-sm text-gray-900 mb-2 leading-snug">
                      {event.title}
                    </h4>
                    <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${event.type === 'Webinar'
                      ? 'bg-cyan-100 text-cyan-800'
                      : 'bg-cyan-100 text-cyan-800'
                      }`}>
                      {event.type}
                    </span>
                  </div>
                </div>

                {/* Register button */}
                <button className="w-full mt-3 px-6 py-2.5 rounded-full border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all text-sm font-medium text-gray-900 flex items-center justify-center gap-2 group">
                  Register
                  <svg className="w-4 h-4 text-gray-600 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>


                {/* Divider (except for last item) */}
                {idx < card.data.events.length - 1 && (
                  <div className="mt-3 border-t border-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case "cpaCommunities":
      return (
        <div style={{ marginTop: "-80px" }}>
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              CPA Communities.
              <span className="text-sm text-gray-600 font-normal">
                Committees, Work Groups, Sections and more.
              </span>
            </h3>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {/* Community cards */}
            {card.data.communities.map((community, idx) => (
              <div
                key={idx}
                className="relative flex-shrink-0 w-48 h-80 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
              >
                <img
                  src={`${process.env.PUBLIC_URL}${community.image}`}
                  alt={community.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h4 className="text-white font-semibold text-lg leading-tight">
                    {community.title}
                  </h4>
                </div>
              </div>
            ))}

            {/* Add another button */}
            <button className="bg-white flex-shrink-0 w-48 h-80 rounded-2xl border-1 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-base font-semibold text-gray-900">Add another</span>
            </button>
          </div>
        </div>
      );

    default:
      return <p className="text-gray-500">Unknown card type</p>;
  }
}

// ----------------------- Task Panel Component -----------------------
function TaskPanel({ updateDemoStateAction, tasks, selectedTask, searchQuery, onSearchChange, filter, onFilterChange, isCollapsed, onToggleCollapse }) {
  const filteredTasks = tasks.filter(task =>
    task.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {isCollapsed && selectedTask && (
        <button
          onClick={onToggleCollapse}
          className="absolute top-9 left-4 z-50 p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="Show Task panel"
        >
          <MoveRight className="w-5 h-5 text-gray-600" />
        </button>
      )}

      <div
        className={`pt-2.5 h-[calc(100vh-4rem)] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${selectedTask && !isCollapsed ? 'translate-x-0 min-w-[360px]' : '-translate-x-[500px] w-0 mx-auto'
          }`}
      >
        {/* Header */}
        <div className="p-2 flex-shrink-0 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleCollapse}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Hide Task panel"
              >
                <MoveLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => updateDemoStateAction({ selectedTask: null })}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close Task panel"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search tasks,,,"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-4 pr-1 py-2 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Dropdown */}
          <select
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="most-recent">View most recently created</option>
            <option value="due-date">View by due date</option>
            <option value="priority">View by priority</option>
          </select>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => updateDemoStateAction({ selectedTask: task.id, showTaskDetailPanel: true })}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${selectedTask === task.id
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
              >
                <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                  {task.personName}
                </h3>
                <p className="text-gray-800 mb-2 line-clamp-2">
                  {task.title}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800">Due: {task.dueDate}</span>
                </div>
                {task.tag && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {task.tag}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Icon */}
        {/* <div className="p-4 flex justify-start">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Layers width={20} color="gray" />
          </button>
        </div> */}
      </div>
    </>
  );
}

// ----------------------- Task Detail Panel Component -----------------------
function TaskDetailPanel({ updateDemoStateAction, approvalFormOpen, setApprovalFormOpen, insightsOpen, setInsightsOpen, workflowOpen, setWorkflowOpen, repliesOpen, setRepliesOpen, selectedTask, showTaskDetailPanel, isCollapsed, onToggleCollapse }) {
  const task = initialTasks.find(t => t.id === selectedTask);
  if (!task) return null;
  // if (!task) return (
  //   <div>
  //     <p>Task not found</p>
  //   </div>
  // );
  return (
    <>
      {/* Backdrop */}
      {showTaskDetailPanel && (!selectedTask || selectedTask === "task-1") && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-10 transition-opacity"
          onClick={() => updateDemoStateAction({ showTaskDetailPanel: false })}
        />
      )}

      {isCollapsed && showTaskDetailPanel && (
        <button
          onClick={onToggleCollapse}
          className="fixed right-7 top-[108px] z-20 p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="Show Task Detail panel"
        >
          <MoveLeft className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Task Detail Panel */}
      <div
        className={`pt-2.5 h-[calc(100vh-4rem)] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${showTaskDetailPanel && !isCollapsed ? 'translate-x-0 min-w-[360px] ' : 'translate-x-[500px] hidden w-0'
          }`}
      >
        {/* Header */}
        <div className="px-6 pt-2 flex-shrink-0 mt-4">
          <div className="flex items-start justify-between">
            <h2 className="text-lg text-black leading-tight pr-4">
              {task.title}
            </h2>
            <div className="flex items-center gap-2">
              {/* Toggle Collapse Button */}
              <button
                onClick={onToggleCollapse}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Hide Task Detail panel"
              >
                <MoveRight className="w-6 h-6" />
              </button>
              {/* Close Button */}
              <button
                onClick={() => updateDemoStateAction({ showTaskDetailPanel: false })}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                aria-label="Close Task Detail panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-4 text-[15px] mt-2 text-gray-900">
            <div>
              <span>For: </span>
              <span>{task.personName}</span>
            </div>
            <div>
              <span>Submitted: </span>
              <span>{task.submittedDate}</span>
              <span className="text-gray-500 ml-1">({task.submittedTime})</span>
            </div>
            <div>
              <span>Due: </span>
              <span>{task.dueDate}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Message */}
          <div className="px-6 pt-6">
            <div className="border-b border-gray-200 pb-4">
              <div className="text-sm text-gray-700 whitespace-pre-line">
                {task.message}
              </div>
            </div>
          </div>


          {/* Approval Form */}
          {task.approvalForm && (
            <div className="border-b border-gray-200">
              <button
                onClick={() => setApprovalFormOpen(!approvalFormOpen)}
                className="w-full px-6 py-4 flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <svg
                  className={`w-5 h-5 text-gray-600 transform transition-transform ${approvalFormOpen ? 'rotate-90' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-semibold text-gray-900">Approval Form</span>
              </button>

              {approvalFormOpen && (
                <div className="px-6 pb-6 space-y-4">
                  {/* Change Effective */}
                  {task.id !== "task-3" &&
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Change Effective
                      </label>
                      <input
                        type="text"
                        value={task.approvalForm.changeEffective}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                      />
                    </div>
                  }

                  {/* Refund */}
                  {task.id !== "task-3" &&
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Refund
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="refund"
                            value="credit-card"
                            checked={task.approvalForm.refund === "credit-card"}
                            className="mr-2"
                            readOnly
                          />
                          <span className="text-sm text-gray-700">Yes, process refund to credit card</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="refund"
                            value="credit-on-file"
                            checked={task.approvalForm.refund === "credit-on-file"}
                            className="mr-2"
                            readOnly
                          />
                          <span className="text-sm text-gray-700">No, leave credit on file</span>
                        </label>
                      </div>
                    </div>
                  }

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={task.approvalForm.message}
                      className="w-full px-3 py-2 border border-gray-300 rounded-2xl text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Enter your message..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button className="flex-1 px-5 py-2 border-2 border-gray-300 rounded-full text-sm font-medium text-red-800 hover:bg-gray-50 transition-colors">
                      Reject
                    </button>
                    <button className="flex-1 px-5 py-2 bg-[#169BD5] text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors">
                      Approve
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Insights */}
          {task.id !== "task-2" &&
            <div className="border-b border-gray-200">
              <button
                onClick={() => setInsightsOpen(!insightsOpen)}
                className="w-full px-6 py-4 flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <svg
                  className={`w-5 h-5 text-gray-600 transform transition-transform ${insightsOpen ? 'rotate-90' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-semibold text-gray-900">Insights</span>
              </button>
              {insightsOpen && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-800">
                    Michael has never requested a membership change.
                  </p>
                </div>
              )}
            </div>
          }

          {/* Workflow */}
          {task.id !== "task-2" &&
            <div className="border-b border-gray-200">
              <button
                onClick={() => setWorkflowOpen(!workflowOpen)}
                className="w-full px-6 py-4 flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <svg
                  className={`w-5 h-5 text-gray-600 transform transition-transform ${workflowOpen ? 'rotate-90' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-semibold text-gray-900">Workflow</span>
              </button>
              {workflowOpen && (
                <div className="px-6 pb-4 space-y-3">
                  <p className="text-sm text-gray-800 mb-3">
                    Once the request is approved, the following tasks will be completed automatically:
                  </p>

                  {/* Workflow tasks */}
                  <div className="space-y-2">
                    {[
                      "Create credit memo for $355.00",
                      "Update the membership type to parental leave effective Fri, Oct 3",
                      "Create new invoice for $175.00",
                      "Apply the credit memo to the new invoice",
                      "Refund $180 to the credit card.",
                      "Send email informing Michael about the request being approved",
                    ].map((text, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="relative w-4 h-4 mt-0.5 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                          <Check className="w-3 h-3 text-gray-400" />
                        </div>
                        <span className="text-sm text-gray-600">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          }

          {/* Replies */}
          {task.id !== "task-3" &&
            <div className="mb-6">
              <button
                onClick={() => setRepliesOpen(!repliesOpen)}
                className="w-full px-6 py-4 flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <svg
                  className={`w-5 h-5 text-gray-600 transform transition-transform ${repliesOpen ? 'rotate-90' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-semibold text-gray-900">Replies</span>
              </button>
              {repliesOpen && (
                <div className="px-6 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#4B7902] flex items-center justify-center text-white text-sm flex-shrink-0">
                      SS
                    </div>
                    <input
                      type="text"
                      placeholder="Post a reply to Michael..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          }

          {task.id == "task-2" &&
            <div className="flex gap-3 pt-2 px-4">
              <button className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-full text-sm text-gray-400 hover:bg-gray-50 transition-colors">
                Close
              </button>
              <button className="flex-1 px-3 py-2 bg-[#169BD5] text-white rounded-full text-sm hover:bg-blue-600 transition-colors">
                Mark as Complete
              </button>
            </div>
          }
        </div>
      </div>
    </>
  );
}


// ----------------------- Draggable Template Item -----------------------
function DraggableTemplate({ tpl }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: tpl.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.6 : undefined,
    cursor: "grab",
  };
  const Icon = IconMap[tpl.icon] || Users;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-start gap-4"
    >
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <GripVertical className="w-5 h-5 text-gray-400" />
          <h5 className="font-semibold text-gray-900">{tpl.title}</h5>
        </div>
        <p className="text-xs text-gray-500">Drag to add {tpl.title.toLowerCase()}</p>
      </div>
    </div>
  );
}

// ----------------------- Main Dashboard -----------------------
const EssentialPage = (props) => {
  const { selectedTask, showTaskDetailPanel, isTaskPanelCollapsed, isTaskDetailPanelCollapsed, updateDemoStateAction } = props;
  // const [, setIsTaskPanelCollapsed] = useState(false);
  // const [, setIsTaskDetailPanelCollapsed] = useState(false);

  const [cards, setCards] = useState(
    initialCards.map((c) => ({
      ...c,
      span:
        c.width === "full"
          ? 12
          : c.id === "contact-card"
            ? 8
            : c.id === "essentials"
              ? 4
              : c.id === "membership-info"
                ? 8
                : c.id === "upcoming-events"
                  ? 4
                  : c.id === "cpa-communities"
                    ? 8
                    : 6,
    }))
  );
  const [breaks, setBreaks] = useState([]);   // row boundaries
  const [anchors] = useState({});             // render-only
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [activeCardId, setActiveCardId] = useState(null);

  // Added for grip context menu 
  const [contextMenu, setContextMenu] = useState({ show: false, cardId: null, x: 0, y: 0 });

  // Task panel state
  const [taskSearchQuery, setTaskSearchQuery] = useState("");
  const [taskFilter, setTaskFilter] = useState("most-recent");

  // Task detail panel state
  const [approvalFormOpen, setApprovalFormOpen] = useState(true);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [repliesOpen, setRepliesOpen] = useState(false);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  );

  // Resize plumbing
  const gridRef = useRef(null);
  const resizingRef = useRef({ id: null, startX: 0, startSpan: 8 });

  function onResizeStart(id, e) {
    const card = cards.find((c) => c.id === id);
    if (!card || card.width === "full") return;
    const t = e.currentTarget;
    t.setPointerCapture?.(e.pointerId);
    resizingRef.current = { id, startX: e.clientX, startSpan: card.span ?? 8 };
    window.addEventListener("pointermove", onResizeMove);
    window.addEventListener("pointerup", onResizeEnd, { once: true });
  }
  function onResizeMove(e) {
    const { id, startX, startSpan } = resizingRef.current || {};
    if (!id) return;
    const grid = gridRef.current;
    if (!grid) return;
    const rect = grid.getBoundingClientRect();
    const gridWidth = rect.width;
    const gap = 0; // No gap in grid
    const colWidth = (gridWidth - gap * 11) / 12;
    const deltaCols = Math.round((e.clientX - startX) / colWidth);
    let next = clampSpan((startSpan ?? 8) + deltaCols);

    // Cap within pair
    const idx = cards.findIndex((c) => c.id === id);
    if (idx !== -1) {
      const rowsNow = buildRows(cards);
      const row = rowsNow.find((r) => idx >= r.start && idx <= r.end);
      if (row && row.end !== row.start) {
        const partner = idx === row.start ? cards[row.end] : cards[row.start];
        const partnerSpan = partner?.span ?? 4;
        const maxAllowed = Math.max(2, Math.min(10, 12 - partnerSpan));
        next = Math.min(next, maxAllowed);
      }
    }
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, span: next } : c)));
  }
  function onResizeEnd() {
    resizingRef.current = { id: null, startX: 0, startSpan: 8 };
    window.removeEventListener("pointermove", onResizeMove);
  }

  // Build rows: [full] or [half, half] or [half]
  function buildRows(list) {
    const rows = [];
    let i = 0;
    while (i < list.length) {
      const cur = list[i];
      if (cur.width === "full") {
        rows.push({ start: i, end: i });
        i += 1;
        continue;
      }
      // For half-width cards, check if they can pair based on available space
      const currentSpan = cur.span || 6;
      const remainingSpan = 12 - currentSpan;

      const canPair = i + 1 < list.length &&
        list[i + 1].width === "half" &&
        !breaks.includes(i + 1) &&
        (list[i + 1].span || 6) <= remainingSpan;

      if (canPair) {
        rows.push({ start: i, end: i + 1 });
        i += 2;
      } else {
        rows.push({ start: i, end: i });
        i += 1;
      }
    }
    return rows;
  }

  function buildDropSlots(list) {
    const rows = buildRows(list);
    const slots = [{ id: "dz-0", index: 0, span: 12, availableSpan: 12 }];

    rows.forEach((r, idx) => {
      const singleHalf = r.start === r.end && list[r.start].width === "half";

      if (singleHalf) {
        const leftSpan = clampSpan(list[r.start]?.span || 6);
        const gapSpan = clampSpan(12 - leftSpan);
        // Inline gap next to the single half
        slots.push({
          id: `dz-inline-${idx}`,
          index: r.start + 1,
          span: gapSpan,
          inline: true,
          availableSpan: gapSpan
        });
      }

      // Full-width gap after each row
      slots.push({
        id: `dz-${idx + 1}`,
        index: r.end + 1,
        span: 12,
        availableSpan: 12
      });
    });

    return slots;
  }
  const dropSlots = useMemo(() => buildDropSlots(cards), [cards, breaks]);
  const itemsForDnd = useMemo(() => dropSlots.map((s) => s.id), [dropSlots]);

  // Pointer-first collision that prioritizes inline slots
  const collisionStrategy = (args) => {
    const pointerHits = pointerWithin(args);
    if (pointerHits.length) {
      return pointerHits.sort((a, b) => {
        const ai = String(a.id).startsWith("dz-inline-") ? 1 : 0;
        const bi = String(b.id).startsWith("dz-inline-") ? 1 : 0;
        return bi - ai; // inline first
      });
    }
    return closestCenter(args);
  };

  function handleDragStart(event) {
    const { active } = event;
    if (!active) return;
    const isTemplate = String(active.id).startsWith("tpl-");
    if (isTemplate) {
      setActiveTemplate(initialTemplates.find((t) => t.id === active.id) || null);
      setActiveCardId(null);
    } else {
      setActiveTemplate(null);
      setActiveCardId(active.id);
    }
  }

  // Utility: isolate a two-half row at positions p (left) and p+1 (right)
  function isolatePairedRowBreaks(prevBreaks, leftIndex) {
    const b = new Set(prevBreaks);
    // Remove internal boundary between the two halves
    b.delete(leftIndex + 1);
    // Add row-start and row-end boundaries to keep the pair stable
    b.add(leftIndex);
    b.add(leftIndex + 2);
    return Array.from(b).sort((x, y) => x - y);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveTemplate(null);
    setActiveCardId(null);
    if (!over) return;

    const slotsSnapshot = buildDropSlots(cards);
    const slot = typeof over.id === "string" ? slotsSnapshot.find((s) => s.id === over.id) : null;
    if (!slot) return;

    const isInline = String(slot.id).startsWith("dz-inline-");
    const isTemplate = String(active.id).startsWith("tpl-");

    if (isTemplate) {
      const tpl = initialTemplates.find((t) => t.id === active.id);
      if (!tpl) return;

      const insertIndex = slot.index;
      const fittedSpan = clampSpan(isInline ? (slot.availableSpan ?? 4) : 8);

      const newCard = {
        id: `${tpl.type}-${Date.now()}`,
        type: tpl.type,
        title: tpl.title,
        width: "half",
        span: fittedSpan,
        data: tpl.defaultData,
      };

      const nextCards = [...cards];
      nextCards.splice(insertIndex, 0, newCard);
      setCards(nextCards);

      if (isInline) {
        // New pair formed: compute left index of the pair and isolate the row
        const leftIndex = insertIndex - 1; // the existing single-half sits left, we inserted to its right
        setBreaks((prev) => isolatePairedRowBreaks(prev, leftIndex));
      } else {
        // Isolate a single-half row around the new card
        setBreaks((prev) => {
          const b = new Set(prev);
          b.add(insertIndex);
          b.add(insertIndex + 1);
          return Array.from(b).sort((x, y) => x - y);
        });
      }
      return;
    }

    // Move existing card
    const oldIndex = cards.findIndex((c) => c.id === active.id);
    if (oldIndex === -1) return;

    // Capture partner (from source row) before move
    const rowsBefore = buildRows(cards);
    let partnerId = null;
    for (const r of rowsBefore) {
      if (oldIndex >= r.start && oldIndex <= r.end) {
        if (r.end !== r.start) {
          partnerId = oldIndex === r.start ? cards[r.end]?.id : cards[r.start]?.id;
        }
        break;
      }
    }

    let insertIndex = slot.index;
    if (oldIndex < insertIndex) insertIndex -= 1; // account for removal above target

    const nextCards = [...cards];
    const [moved] = nextCards.splice(oldIndex, 1);

    const fittedMoved = isInline
      ? { ...moved, span: clampSpan(slot.availableSpan ?? (moved.span ?? 8)) }
      : moved;

    nextCards.splice(insertIndex, 0, fittedMoved);
    setCards(nextCards);

    if (isInline) {
      // Pair into same row: the left item is now at insertIndex - 1
      const leftIndex = insertIndex - 1;
      setBreaks((prev) => {
        let out = isolatePairedRowBreaks(prev, leftIndex);
        // Also isolate the old partner so it won't auto-pair elsewhere
        if (partnerId) {
          const pi = nextCards.findIndex((c) => c.id === partnerId);
          if (pi !== -1) {
            const b = new Set(out);
            b.add(pi);
            b.add(pi + 1);
            out = Array.from(b).sort((x, y) => x - y);
          }
        }
        return out;
      });
    } else {
      // Non-inline: isolate moved card, and also isolate the old partner if it existed
      setBreaks((prev) => {
        const b = new Set(prev);
        b.add(slot.index);
        b.add(slot.index + 1);
        if (partnerId) {
          const pi = nextCards.findIndex((c) => c.id === partnerId);
          if (pi !== -1) {
            b.add(pi);
            b.add(pi + 1);
          }
        }
        return Array.from(b).sort((x, y) => x - y);
      });
    }
  }

  // grip context menu related function
  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setContextMenu({ show: false, cardId: null, x: 0, y: 0 });
    if (contextMenu.show) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu.show]);

  const openContextMenu = (e, cardId) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenu({
      show: true,
      cardId,
      x: rect.left - 160, // Position to the left of the icon
      y: rect.top
    });
  };

  // const handleRemoveCard = (cardId) => {
  //     setCards((prev) => prev.filter((c) => c.id !== cardId));
  //     setContextMenu({ show: false, cardId: null, x: 0, y: 0 });
  // };


  const handleRemoveCard = (cardId) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    // Force breaks recalculation
    setBreaks((prev) => [...prev]);
    setContextMenu({ show: false, cardId: null, x: 0, y: 0 });
  };

  const handleOpenTaskDetail = (task) => {
    updateDemoStateAction({ selectedTaskDetail: task });
  };

  const handleCloseTaskDetail = () => {
    updateDemoStateAction({ selectedTaskDetail: null });
    setApprovalFormOpen(true);
    setInsightsOpen(false);
    setWorkflowOpen(false);
    setRepliesOpen(false);
  };

  return (
    <div className="flex items-start justify-center space-x-5 max-h-screen overflow-y-auto w-full absolute left-0 top-0">

      {/* Context Menu */}
      {contextMenu.show && (
        <div
          className="fixed text-black bg-white border border-slate-200 rounded-lg shadow-xl z-[9999] py-1 min-w-[150px]"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleRemoveCard(contextMenu.cardId)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2"
          >
            <span><Trash2 color="red" className="w-4 h-4" /></span>
            <span>Trash</span>
          </button>
        </div>
      )}

      {/* Task Panel */}
      <TaskPanel
        updateDemoStateAction={updateDemoStateAction}
        tasks={initialTasks}
        selectedTask={selectedTask}
        searchQuery={taskSearchQuery}
        onSearchChange={setTaskSearchQuery}
        filter={taskFilter}
        onFilterChange={setTaskFilter}
        onOpenDetail={handleOpenTaskDetail}
        isCollapsed={isTaskPanelCollapsed}
        onToggleCollapse={() => updateDemoStateAction({ isTaskPanelCollapsed: !isTaskPanelCollapsed })}
      />

      {!selectedTask || selectedTask === 'task-1' ? (
        <div
          className={`relative z-10 transition-[padding] mt-1 duration-300 ${showAddPanel ? "pr-96" : "pr-[227px]"
            }`}
        >
          {/* Main Content with a single SortableContext */}
          <div className="max-w-[1200px] mx-auto px-8 py-4">
            <DndContext
              sensors={sensors}
              collisionDetection={collisionStrategy}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={itemsForDnd} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-12" ref={gridRef}>
                  {(() => {
                    // Build rows on the fly for rendering
                    const rows = (function build() {
                      const acc = [];
                      let i = 0;
                      while (i < cards.length) {
                        const cur = cards[i];
                        if (cur.width === "full") {
                          acc.push({ start: i, end: i });
                          i += 1;
                          continue;
                        }
                        const canPair = i + 1 < cards.length && cards[i + 1].width === "half" && !breaks.includes(i + 1);
                        if (canPair) {
                          acc.push({ start: i, end: i + 1 });
                          i += 2;
                        } else {
                          acc.push({ start: i, end: i });
                          i += 1;
                        }
                      }
                      return acc;
                    })();

                    const isDraggingAny = Boolean(activeTemplate || activeCardId);
                    const pieces = [];
                    // Top dropzone
                    pieces.push(<DropSlot key="dz-0" id="dz-0" isActive={isDraggingAny} />);

                    // In the main DashboardDndKit component, replace the card rendering section:
                    rows.forEach((row, i) => {
                      const a = cards[row.start];
                      const b = row.end !== row.start ? cards[row.end] : null;

                      if (a.width === "full") {
                        pieces.push(
                          <div key={a.id} className="col-span-12">
                            <SortableCard
                              card={a}
                              onToggleWidth={() => { }}
                              onRemove={(id) => setCards((prev) => prev.filter((c) => c.id !== id))}
                              onSizeChange={(id, dir) =>
                                setCards((prev) => prev.map((c) => (c.id === id ? { ...c, size: nextSize(c.size || "md", dir) } : c)))
                              }
                              onResizeStart={onResizeStart}
                              onContextMenu={openContextMenu}
                              onTaskClick={() => updateDemoStateAction({ selectedTask: 'task-1', showTaskDetailPanel: true })}
                            />
                          </div>
                        );
                      } else {
                        if (b) {
                          // Two-half row - render both cards with their respective spans
                          pieces.push(
                            <div key={a.id} className={SPAN_TO_CLASS[a.span || 6]}>
                              <SortableCard
                                card={a}
                                onToggleWidth={() => { }}
                                onRemove={(id) => setCards((prev) => prev.filter((c) => c.id !== id))}
                                onSizeChange={(id, dir) =>
                                  setCards((prev) => prev.map((c) => (c.id === id ? { ...c, size: nextSize(c.size || "md", dir) } : c)))
                                }
                                onResizeStart={onResizeStart}
                                onContextMenu={openContextMenu}
                                onTaskClick={() => updateDemoStateAction({ selectedTask: 'task-1', showTaskDetailPanel: true })}
                              />
                            </div>
                          );
                          pieces.push(
                            <div key={b.id} className={SPAN_TO_CLASS[b.span || 6]}>
                              <SortableCard
                                card={b}
                                onToggleWidth={() => { }}
                                onRemove={(id) => setCards((prev) => prev.filter((c) => c.id !== id))}
                                onSizeChange={(id, dir) =>
                                  setCards((prev) => prev.map((c) => (c.id === id ? { ...c, size: nextSize(c.size || "md", dir) } : c)))
                                }
                                onResizeStart={onResizeStart}
                                onContextMenu={openContextMenu}
                                onTaskClick={() => updateDemoStateAction({ selectedTask: 'task-1', showTaskDetailPanel: true })}
                              />
                            </div>
                          );
                        } else {
                          // Single-half row - render the card and its inline gap
                          const leftSpan = a.span || 6;
                          const gapSpan = clampSpan(12 - leftSpan);

                          pieces.push(
                            <div key={a.id} className={SPAN_TO_CLASS[leftSpan]}>
                              <SortableCard
                                card={a}
                                onToggleWidth={() => { }}
                                onRemove={(id) => setCards((prev) => prev.filter((c) => c.id !== id))}
                                onSizeChange={(id, dir) =>
                                  setCards((prev) => prev.map((c) => (c.id === id ? { ...c, size: nextSize(c.size || "md", dir) } : c)))
                                }
                                onResizeStart={onResizeStart}
                                onContextMenu={openContextMenu}
                                onTaskClick={() => updateDemoStateAction({ selectedTask: 'task-1', showTaskDetailPanel: true })}
                              />
                            </div>
                          );
                          pieces.push(
                            <DropSlot key={`dz-inline-${i}`} id={`dz-inline-${i}`} isActive={isDraggingAny} span={gapSpan} />
                          );
                        }
                      }

                      // Full-width slot after each row
                      pieces.push(<DropSlot key={`dz-${i + 1}`} id={`dz-${i + 1}`} isActive={isDraggingAny} />);
                    });
                    return pieces;
                  })()}
                </div>
              </SortableContext>

              <DragOverlay>
                {activeTemplate ? (
                  (() => {
                    const Icon = IconMap[activeTemplate.icon] || Users;
                    return (
                      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-[320px] flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold">{activeTemplate.title}</div>
                          <div className="text-xs text-gray-500">Drop to add</div>
                        </div>
                      </div>
                    );
                  })()
                ) : activeCardId ? (
                  <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-[600px]">
                    <div className="flex items-center gap-2 mb-2">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                      <span className="font-semibold">Moving card…</span>
                    </div>
                    <div className="h-3 w-2/3 bg-gray-100 rounded" />
                  </div>
                ) : null}
              </DragOverlay>

              {/* Right panel */}
              {showAddPanel && (
                <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                    <h3 className="text-xl font-bold text-gray-900">Add New Card</h3>
                    <button
                      onClick={() => setShowAddPanel(false)}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Close Add Card panel"
                      type="button"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    <p className="text-sm text-gray-600 mb-4">Drag a card into the dashboard</p>
                    <div className="space-y-3">
                      {initialTemplates.map((tpl) => (
                        <DraggableTemplate key={tpl.id} tpl={tpl} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </DndContext>
          </div>
        </div>
      ) : selectedTask === 'task-2' ?
        <div
          // className={`w-full min-h-scren mt-5 ${!isTaskPanelCollapsed ? "ml-[290px]":""} ${isTaskPanelCollapsed && isTaskDetailPanelCollapsed ? 'w-[calc(100vw-30px)]' :  isTaskPanelCollapsed || isTaskDetailPanelCollapsed ? 'w-[calc(100vw-450px)]' : 'max-w-[calc(100vw-750px)]'}`}
          className="w-[calc(100vw-120px)] mx-auto mr-4 relative min-h-scren mt-5 overflow-y-hidden"
        >
          <ReportBuilder></ReportBuilder>
        </div>
        : <ReviewTask></ReviewTask>}

      <TaskDetailPanel
        updateDemoStateAction={updateDemoStateAction}
        approvalFormOpen={approvalFormOpen}
        setApprovalFormOpen={setApprovalFormOpen}
        insightsOpen={insightsOpen}
        setInsightsOpen={setInsightsOpen}
        workflowOpen={workflowOpen}
        setWorkflowOpen={setWorkflowOpen}
        repliesOpen={repliesOpen}
        setRepliesOpen={setRepliesOpen}
        selectedTask={selectedTask}
        showTaskDetailPanel={showTaskDetailPanel}
        isCollapsed={isTaskDetailPanelCollapsed}
        onToggleCollapse={() => updateDemoStateAction({ isTaskDetailPanelCollapsed: !isTaskDetailPanelCollapsed })}
      />
    </div>
  );
}

const mapStateToProps = ({ demo }) => {
  const { selectedTask, showTaskDetailPanel, isTaskPanelCollapsed, isTaskDetailPanelCollapsed } = demo;
  return { selectedTask, showTaskDetailPanel, isTaskPanelCollapsed, isTaskDetailPanelCollapsed };
};

const mapActionToProps = {
  updateDemoStateAction: updateDemoState
};

export default connect(mapStateToProps, mapActionToProps)(EssentialPage);