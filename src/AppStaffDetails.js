import React, { useMemo, useState, useRef } from "react";
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
    X,
    User,
    Calendar,
    Check,
    Users,
    FileText,
} from "lucide-react";

// ----------------------- Demo Data -----------------------
const initialConfig = {
    greeting: {
        title: "Good Morning Sally,",
        date: "Wednesday, October 8",
        nextStep: "View today's tasks",
    },
};

const initialTemplates = [
    {
        id: "tpl-notes",
        type: "notes",
        title: "Notes",
        icon: "FileText",
        defaultData: {
            notes: [
                { id: 1, text: "Follow up on Q4 proposal", date: "Oct 15, 2024" },
            ],
        },
    },
];

const initialCards = [
    { id: "greeting", type: "greeting", title: "Greeting", width: "full", data: {} },
    {
        id: "quick-links",
        type: "quickLinks",
        title: "Quick Links",
        width: "half",
        data: {
            links: [
                { icon: "User", label: "View Contacts", action: "contacts" },
                { icon: "Calendar", label: "New event", action: "new-event" },
                { icon: "Check", label: "New task", action: "new-task" },
            ],
        },
    },
    {
        id: "awaiting-action",
        type: "awaitingAction",
        title: "Awaiting Action.",
        subtitle: "A couple of new items for you.",
        width: "half",
        data: {
            items: [
                {
                    id: 1,
                    name: "Michael Scott",
                    task: "Request for membership change - Parental leave",
                    due: "Mon, Oct 13",
                    time: "5 mins",
                    icon: "User",
                },
                {
                    id: 2,
                    name: "Michael Lee",
                    task: "Create report - Member demographics for potential sponsors for annual...",
                    due: "Today at 2:00 pm",
                    badge: "Board of Directors",
                    time: "10 mins",
                    icon: "FileText",
                },
            ],
        },
    },
    {
        id: "upcoming",
        type: "upcoming",
        title: "Upcoming",
        width: "half",
        data: {
            events: [
                {
                    date: "Oct 13",
                    time: "9:00 am EST",
                    title: "Renewals 2026",
                    tag: "Campaign",
                    action: "Review & Approve",
                },
                {
                    date: "Nov 14",
                    time: "Nov 14th and 15th",
                    title: "3rd Annual Conference: AI in Associations",
                    tag: "Conference",
                    action: "Register",
                },
            ],
        },
    },
    {
        id: "insights",
        type: "insights",
        title: "Insights",
        width: "half",
        data: {
            stats: [
                { label: "Current Members", value: "6,234" },
                { label: "Renewed\nThis week", value: "0" },
                { label: "New members\nThis week", value: "10" },
                { label: "New applicants\nThis week", value: "7" },
            ],
        },
    },
];

// ----------------------- Icons -----------------------
const IconMap = { User, Calendar, Check, Users, FileText };

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
    1: "col-span-1", 2: "col-span-2", 3: "col-span-3", 4: "col-span-4",
    5: "col-span-5", 6: "col-span-6", 7: "col-span-7", 8: "col-span-8",
    9: "col-span-9", 10: "col-span-10", 11: "col-span-11", 12: "col-span-12",
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
    const activeH = String(id).startsWith("dz-inline-") ? "h-16" : "h-8";
    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`${spanClass} ${isActive ? `${activeH} opacity-100` : "h-2 opacity-0"} transition-all`}
        >
            <div
                className={`h-full rounded-lg border-2 border-dashed ${isOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
                    }`}
            />
        </div>
    );
}

// ----------------------- Sortable Card -----------------------
function SortableCard({ card, onRemove, onResizeStart, cfg }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: card.id });
    const style = { transform: CSS.Transform.toString(transform) };

    const WrapperClasses =
        card.type === "greeting"
            ? `transition-all ${isDragging ? "opacity-30 scale-95" : ""}`
            : [
                ["quickLinks", "upcoming", "awaitingAction", "insights"].includes(card.type) ? "bg-white border border-gray-200 rounded-xl shadow-sm" : "",
                "transition-all",
                isDragging ? "opacity-30 scale-95" : "hover:shadow-md",
            ].filter(Boolean).join(" ");

    return (
        <div ref={setNodeRef} style={style} className={card.width === "full" ? "col-span-2" : ""}>
            <div className={WrapperClasses}>
                {card.type !== "greeting" ? (
                    <div
                        className={`${sizeText[card.size || "md"]} ${["quickLinks", "upcoming", "awaitingAction", "insights"].includes(card.type) ? "min-h-[180px]" : ""
                            } relative group`}
                    >
                        <div className={`flex items-center justify-between px-4 ${card.type === "quickLinks" ? "pt-3 pb-2" : "pt-4 pb-3"}`}>
                            <div className="flex items-center gap-2">
                                <div
                                    className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                                    {...attributes}
                                    {...listeners}
                                >
                                    <GripVertical className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className={`font-semibold text-gray-900 ${card.type === "quickLinks" ? "text-sm" : "text-xl"}`}>
                                        {card.title}
                                    </h3>
                                    {card.subtitle && (
                                        <p className="text-sm text-gray-600 mt-0.5">{card.subtitle}</p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => onRemove(card.id)}
                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                type="button"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className={card.type === "quickLinks" ? "px-4 pb-4" : "px-6 pb-6"}>
                            <CardContent card={card} />
                        </div>
                        <div
                            className="absolute top-1/2 -right-3 -translate-y-1/2 w-2 h-8 rounded-full bg-gray-300/90 hover:bg-gray-400 border border-white shadow cursor-ew-resize z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                            onPointerDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onResizeStart(card.id, e);
                            }}
                        />
                    </div>
                ) : (
                    <div
                        className={`bg-white rounded-2xl ${sizePad[card.size || "md"]} ${sizeText[card.size || "md"]} shadow-md border border-gray-200 select-none min-h-[220px] relative group`}
                        {...attributes}
                        {...listeners}
                    >
                        <div className="absolute top-4 left-4 z-10 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="w-5 h-5 text-gray-400" />
                        </div>

                        {card.width !== "full" && (
                            <div
                                className="absolute top-1/2 -right-3 -translate-y-1/2 w-2 h-8 rounded-full bg-gray-300/90 hover:bg-gray-400 border border-white shadow cursor-ew-resize z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onResizeStart(card.id, e);
                                }}
                            />
                        )}

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex-1">
                                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] leading-tight font-bold text-gray-900 mb-2">
                                    {cfg?.greeting?.title || "Good Morning"},
                                </h2>
                                <p className="text-sm sm:text-base md:text-md text-gray-600 mb-4">{cfg?.greeting?.date || ""}</p>
                                <div className="mt-2">
                                    <p className="text-sm sm:text-base md:text-md text-gray-700 mb-3">Suggested next step:</p>
                                    <button className="px-4 py-2 border-2 border-[#4b0082] rounded-md text-[14px] font-medium hover:bg-gray-900 hover:text-white transition-colors">
                                        {cfg?.greeting?.nextStep || "Get Started"}
                                    </button>
                                </div>
                            </div>
                            <div className="w-[180px] h-auto">
                                <img src={`${process.env.PUBLIC_URL}/assets/images/sun.png`} className="w-full h-auto object-contain" alt="Sun" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function CardContent({ card }) {
    switch (card.type) {
        case "quickLinks":
            return (
                <div className="space-y-3">
                    {card.data.links.map((link, idx) => {
                        const Icon = IconMap[link.icon] || Users;
                        return (
                            <button
                                key={idx}
                                className="flex items-center gap-3 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-left w-full"
                            >
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-[#4b0082]" />
                                </div>
                                <span className="text-[14px] text-gray-900">{link.label}</span>
                            </button>
                        );
                    })}
                </div>
            );
        case "upcoming":
            return (
                <div className="space-y-4">
                    {card.data.events.map((event, idx) => (
                        <div key={idx} className="space-y-3">
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <div className="text-sm text-gray-600 font-medium">
                                        {event.date.split(' ')[0]}
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {event.date.split(' ')[1]}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs text-gray-600 mb-1">{event.time}</div>
                                    <div className="font-semibold text-gray-900 mb-2">{event.title}</div>
                                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-md font-medium">
                                        {event.tag}
                                    </span>
                                </div>
                            </div>
                            <button className="w-full py-2 border-2 border-gray-900 rounded-lg text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors">
                                {event.action}
                            </button>
                        </div>
                    ))}
                </div>
            );
        case "awaitingAction":
            return (
                <div className="space-y-4">
                    {card.data.items.map((item) => {
                        const Icon = IconMap[item.icon] || User;
                        return (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-1">
                                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                        <span className="text-xs text-gray-500">{item.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-1">{item.task}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <span>Due: {item.due}</span>
                                        {item.badge && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        case "insights":
            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                        {card.data.stats.map((stat, idx) => (
                            <div key={idx} className="text-center p-4 bg-white rounded-lg border border-gray-200">
                                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-xs text-gray-600 whitespace-pre-line">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <svg viewBox="0 0 700 300" className="w-full h-64">
                            {/* Grid lines */}
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                                <line
                                    key={i}
                                    x1="60"
                                    y1={30 + i * 27}
                                    x2="680"
                                    y2={30 + i * 27}
                                    stroke="#e5e7eb"
                                    strokeWidth="1"
                                />
                            ))}
                            
                            {/* Y-axis labels */}
                            {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((val, i) => (
                                <text key={val} x="40" y={35 + i * 27} fontSize="12" fill="#6b7280" textAnchor="end">
                                    {val}
                                </text>
                            ))}
                            
                            {/* X-axis labels */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                                <text key={day} x={95 + i * 85} y="285" fontSize="12" fill="#6b7280" textAnchor="middle">
                                    {day}
                                </text>
                            ))}
                            
                            {/* 2025 Renewed - blue solid */}
                            <polyline
                                points="95,267 180,240 265,132 350,132 435,213 520,240 605,267"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="2"
                            />
                            
                            {/* 2025 New - green solid */}
                            <polyline
                                points="95,267 180,240 265,51 350,267 435,267 520,267 605,267"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="2"
                            />
                            
                            {/* 2025 Applied - dark blue solid */}
                            <polyline
                                points="95,267 180,240 265,132 350,186 435,213 520,240 605,267"
                                fill="none"
                                stroke="#1e40af"
                                strokeWidth="2"
                            />
                            
                            {/* 2024 Renewed - yellow dotted */}
                            <polyline
                                points="95,267 180,267 265,186 350,105 435,186 520,213 605,240"
                                fill="none"
                                stroke="#fbbf24"
                                strokeWidth="2"
                                strokeDasharray="4,4"
                            />
                            
                            {/* 2024 New - gray dotted */}
                            <polyline
                                points="95,267 180,267 265,105 350,78 435,132 520,105 605,213"
                                fill="none"
                                stroke="#9ca3af"
                                strokeWidth="2"
                                strokeDasharray="4,4"
                            />
                            
                            {/* 2024 Applied - purple dotted */}
                            <polyline
                                points="95,267 180,267 265,186 350,105 435,186 520,213 605,240"
                                fill="none"
                                stroke="#8b5cf6"
                                strokeWidth="2"
                                strokeDasharray="4,4"
                            />
                        </svg>
                        
                        {/* Legend */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center mt-4 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-blue-500"></div>
                                <span className="text-gray-600">2025 Renewed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-green-500"></div>
                                <span className="text-gray-600">2025 New</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-blue-900"></div>
                                <span className="text-gray-600">2025 Applied</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-yellow-400 border-t-2 border-dashed border-yellow-400"></div>
                                <span className="text-gray-600">2024 Renewed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-gray-400 border-t-2 border-dashed border-gray-400"></div>
                                <span className="text-gray-600">2024 New</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-purple-500 border-t-2 border-dashed border-purple-500"></div>
                                <span className="text-gray-600">2024 Applied</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        default:
            return <p className="text-gray-500">Unknown card type</p>;
    }
}

// ----------------------- Draggable Template Item -----------------------
function DraggableTemplate({ tpl }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: tpl.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.6 : undefined,
        cursor: "grab",
    };
    const Icon = IconMap[tpl.icon] || User;
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
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <h5 className="font-semibold text-gray-900">{tpl.title}</h5>
                </div>
                <p className="text-xs text-gray-500">Drag to add {tpl.title.toLowerCase()}</p>
            </div>
        </div>
    );
}

// ----------------------- Main Dashboard -----------------------
export default function DashboardHome() {
    const [cfg] = useState(initialConfig);
    const [cards, setCards] = useState(
        initialCards.map((c) => ({
            ...c,
            span:
                c.width === "full"
                    ? 12
                    : c.id === "quick-links"
                        ? 4
                        : c.id === "upcoming"
                            ? 4
                            : c.id === "awaiting-action"
                                ? 8
                                : c.id === "insights"
                                    ? 8
                                    : 6,
        }))
    );
    const [breaks, setBreaks] = useState([]);
    const [showAddPanel, setShowAddPanel] = useState(false);
    const [activeTemplate, setActiveTemplate] = useState(null);
    const [activeCardId, setActiveCardId] = useState(null);

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
        useSensor(KeyboardSensor)
    );

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
        const gap = 24;
        const colWidth = (gridWidth - gap * 11) / 12;
        const deltaCols = Math.round((e.clientX - startX) / colWidth);
        let next = clampSpan((startSpan ?? 8) + deltaCols);

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
            const canPair = i + 1 < list.length && list[i + 1].width === "half" && !breaks.includes(i + 1);
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
                const leftSpan = clampSpan(list[r.start]?.span ?? 8);
                const gapSpan = clampSpan(12 - leftSpan);
                slots.push({ id: `dz-inline-${idx}`, index: r.start + 1, span: gapSpan, inline: true, availableSpan: gapSpan });
            }
            slots.push({ id: `dz-${idx + 1}`, index: r.end + 1, span: 12, availableSpan: 12 });
        });
        return slots;
    }

    const dropSlots = useMemo(() => buildDropSlots(cards), [cards, breaks]);
    const itemsForDnd = useMemo(() => dropSlots.map((s) => s.id), [dropSlots]);

    const collisionStrategy = (args) => {
        const pointerHits = pointerWithin(args);
        if (pointerHits.length) {
            return pointerHits.sort((a, b) => {
                const ai = String(a.id).startsWith("dz-inline-") ? 1 : 0;
                const bi = String(b.id).startsWith("dz-inline-") ? 1 : 0;
                return bi - ai;
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

    function isolatePairedRowBreaks(prevBreaks, leftIndex) {
        const b = new Set(prevBreaks);
        b.delete(leftIndex + 1);
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
                const leftIndex = insertIndex - 1;
                setBreaks((prev) => isolatePairedRowBreaks(prev, leftIndex));
            } else {
                setBreaks((prev) => {
                    const b = new Set(prev);
                    b.add(insertIndex);
                    b.add(insertIndex + 1);
                    return Array.from(b).sort((x, y) => x - y);
                });
            }
            return;
        }

        const oldIndex = cards.findIndex((c) => c.id === active.id);
        if (oldIndex === -1) return;

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
        if (oldIndex < insertIndex) insertIndex -= 1;

        const nextCards = [...cards];
        const [moved] = nextCards.splice(oldIndex, 1);

        const fittedMoved = isInline
            ? { ...moved, span: clampSpan(slot.availableSpan ?? (moved.span ?? 8)) }
            : moved;

        nextCards.splice(insertIndex, 0, fittedMoved);
        setCards(nextCards);

        if (isInline) {
            const leftIndex = insertIndex - 1;
            setBreaks((prev) => {
                let out = isolatePairedRowBreaks(prev, leftIndex);
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

    return (
        <div className="relative min-h-screen">
            {/* Background div that stays behind everything */}
            <div
                className="absolute top-0 left-0 w-full h-[335px] z-0"
                style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/banner.png)`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "auto 370px",
                    backgroundPosition: "top center",
                }}
            ></div>

            <div className={`relative z-10 transition-[padding] duration-300 ${showAddPanel ? "pr-96" : "pr-0"}`}>
                {/* Header with search bar */}
                <div className="bg-transparent px-8 py-6 sticky top-0 z-40">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 flex justify-center">
                                <div className="relative w-full max-w-[560px]">
                                    <input
                                        type="text"
                                        placeholder="Search Central"
                                        className="w-full h-11 pl-10 pr-5 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowAddPanel((v) => !v)}
                                className="ml-4 p-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                type="button"
                            >
                                {showAddPanel ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-[1200px] mx-auto px-8 py-4">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={collisionStrategy}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={itemsForDnd} strategy={rectSortingStrategy}>
                            <div className="grid grid-cols-12 gap-6" ref={gridRef}>
                                {(() => {
                                    const rows = buildRows(cards);
                                    const isDraggingAny = Boolean(activeTemplate || activeCardId);
                                    const pieces = [];
                                    pieces.push(<DropSlot key="dz-0" id="dz-0" isActive={isDraggingAny} />);

                                    rows.forEach((row, i) => {
                                        const a = cards[row.start];
                                        const b = row.end !== row.start ? cards[row.end] : null;

                                        if (a.width === "full") {
                                            pieces.push(
                                                <div key={a.id} className="col-span-12">
                                                    <SortableCard
                                                        card={a}
                                                        onRemove={(id) => setCards((prev) => prev.filter((c) => c.id !== id))}
                                                        onResizeStart={onResizeStart}
                                                        cfg={cfg}
                                                    />
                                                </div>
                                            );
                                        } else {
                                            if (b) {
                                                pieces.push(
                                                    <div key={a.id} className={SPAN_TO_CLASS[a.span || 6]}>
                                                        <SortableCard
                                                            card={a}
                                                            onRemove={(id) => setCards((prev) => prev.filter((c) => c.id !== id))}
                                                            onResizeStart={onResizeStart}
                                                            cfg={cfg}
                                                        />
                                                    </div>
                                                );
                                                pieces.push(
                                                    <div key={b.id} className={SPAN_TO_CLASS[b.span || 6]}>
                                                        <SortableCard
                                                            card={b}
                                                            onRemove={(id) => setCards((prev) => prev.filter((c) => c.id !== id))}
                                                            onResizeStart={onResizeStart}
                                                            cfg={cfg}
                                                        />
                                                    </div>
                                                );
                                            } else {
                                                const leftSpan = a.span || 6;
                                                const gapSpan = clampSpan(12 - leftSpan);
                                                pieces.push(
                                                    <div key={a.id} className={SPAN_TO_CLASS[leftSpan]}>
                                                        <SortableCard
                                                            card={a}
                                                            onRemove={(id) => setCards((prev) => prev.filter((c) => c.id !== id))}
                                                            onResizeStart={onResizeStart}
                                                            cfg={cfg}
                                                        />
                                                    </div>
                                                );
                                                pieces.push(
                                                    <DropSlot key={`dz-inline-${i}`} id={`dz-inline-${i}`} isActive={isDraggingAny} span={gapSpan} />
                                                );
                                            }
                                        }
                                        pieces.push(<DropSlot key={`dz-${i + 1}`} id={`dz-${i + 1}`} isActive={isDraggingAny} />);
                                    });
                                    return pieces;
                                })()}
                            </div>
                        </SortableContext>

                        <DragOverlay>
                            {activeTemplate ? (
                                (() => {
                                    const Icon = IconMap[activeTemplate.icon] || User;
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

                        {showAddPanel && (
                            <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col">
                                <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                                    <h3 className="text-xl font-bold text-gray-900">Add New Card</h3>
                                    <button
                                        onClick={() => setShowAddPanel(false)}
                                        className="text-gray-400 hover:text-gray-600"
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
        </div>
    );
}