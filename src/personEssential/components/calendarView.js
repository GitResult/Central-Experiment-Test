import React, { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, Users, Clock, FileText, DollarSign, Mail, TrendingUp, BarChart3, Layers, List, MessageSquare, Paperclip, CheckCircle2, AlertCircle, Circle, Edit3, Send, History, ChevronDown, Filter, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tooltip as TooltipHero } from "@heroui/react";

const CalendarView = ({ setViewType }) => {
    const [currentView, setCurrentView] = useState('month');
    const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1));
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [hoveredDate, setHoveredDate] = useState(null);
    const [expandedRhythms, setExpandedRhythms] = useState(['weekly', 'monthly']);
    const [newReply, setNewReply] = useState('');
    const [expandedFilters, setExpandedFilters] = useState([]);
    const [miniCalDate, setMiniCalDate] = useState(new Date(2025, 10, 1));
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [showComparison, setShowComparison] = useState(false);
    const [sampleData, setSampleData] = useState(null);

    useEffect(() => {
        const loadSampleData = async () => {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/data/calendar.json`);
                if (!response.ok) {
                    throw new Error('Failed to load sample data');
                }
                const data = await response.json();
                setSelectedFilters(data.defaultFilters);
                setExpandedFilters(Object.keys(data.filterCategories));
                setSampleData(data);
            } catch (error) {
                console.error('Error loading sample data:', error);
                setSampleData(null);
            }
        };

        loadSampleData();
    }, []);

    // Icon mapping
    const iconMap = {
        FileText, Mail, DollarSign, TrendingUp, BarChart3, Circle, CheckCircle2, Users, Clock
    };

    const getIconComponent = (iconName) => iconMap[iconName] || Circle;

    const eventTypes = sampleData ? Object.entries(sampleData.eventTypes).reduce((acc, [key, value]) => {
        acc[key] = {
            ...value,
            icon: getIconComponent(value.icon)
        };
        return acc;
    }, {}) : {};

    const getEventsForDate = (date) => {
        const dayOfWeek = date.getDay();
        const dayOfMonth = date.getDate();

        return sampleData.events.filter(event => {
            if (event.rhythm === 'weekly') {
                return event.weekday === dayOfWeek;
            }
            if (event.rhythm === 'monthly') {
                return event.date === dayOfMonth;
            }
            if (event.rhythm === 'once') {
                return event.date === dayOfMonth;
            }
            return false;
        });
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const getWeekDates = (date) => {
        const day = date.getDay();
        const diff = date.getDate() - day;
        const sunday = new Date(date);
        sunday.setDate(diff);

        const week = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(sunday);
            d.setDate(sunday.getDate() + i);
            week.push(d);
        }
        return week;
    };

    const getStatusConfig = (status) => {
        return sampleData.ui.statusConfigs[status] || sampleData.ui.statusConfigs['not-started'];
    };

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    const toggleRhythm = (rhythm) => {
        setExpandedRhythms(prev =>
            prev.includes(rhythm) ? prev.filter(r => r !== rhythm) : [...prev, rhythm]
        );
    };

    const toggleFilter = (filterId) => {
        setExpandedFilters(prev =>
            prev.includes(filterId) ? prev.filter(id => id !== filterId) : [...prev, filterId]
        );
    };

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const renderMiniCalendar = () => {
        const { daysInMonth, startingDayOfWeek } = getDaysInMonth(miniCalDate);
        const days = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="w-8 h-7" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(miniCalDate.getFullYear(), miniCalDate.getMonth(), day);
            const isTodayDate = isToday(date);
            const isSelected = date.getDate() === currentDate.getDate() &&
                date.getMonth() === currentDate.getMonth() &&
                date.getFullYear() === currentDate.getFullYear();

            days.push(
                <button
                    key={day}
                    onClick={() => setCurrentDate(date)}
                    className={`w-8 h-7 text-xs rounded-md flex items-center justify-center transition-colors ${isTodayDate ? 'bg-gray-900 text-white font-semibold' :
                        isSelected ? 'bg-blue-600 text-white font-semibold' :
                            'hover:bg-gray-50 text-gray-700'
                        }`}
                >
                    {day}
                </button>
            );
        }

        return (
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3 px-2">
                    <button
                        onClick={() => {
                            const newDate = new Date(miniCalDate);
                            newDate.setMonth(newDate.getMonth() - 1);
                            setMiniCalDate(newDate);
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="text-sm font-semibold text-gray-900">
                        {miniCalDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button
                        onClick={() => {
                            const newDate = new Date(miniCalDate);
                            newDate.setMonth(newDate.getMonth() + 1);
                            setMiniCalDate(newDate);
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-0.5 mb-1 px-2">
                    {sampleData.ui.weekdaysShort.map((day, i) => (
                        <div key={i} className="w-8 h-6 flex items-center justify-center text-[10px] font-medium text-gray-500 uppercase">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5 px-2">
                    {days}
                </div>
                <div className="mt-4 border-t border-gray-200" />
            </div>
        );
    };

    const renderFilterSection = (id, title, items, isLast = false) => {
        const isExpanded = expandedFilters.includes(id);

        return (
            <div className="mb-4">
                <button
                    onClick={() => toggleFilter(id)}
                    className="w-full px-0 py-1.5 flex items-center gap-2 group"
                >
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
                </button>
                {isExpanded && (
                    <div className="mt-1 space-y-0">
                        {items.map((item, index) => {
                            const ItemIcon = item.icon ? getIconComponent(item.icon) : null;
                            return (
                                <label key={index} className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-md px-2 py-1.5 transition-colors group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedFilters[item.label] || false}
                                            onChange={(e) => {
                                                setSelectedFilters(prev => ({
                                                    ...prev,
                                                    [item.label]: e.target.checked
                                                }));
                                            }}
                                            className="w-4 h-4 rounded border-2 border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-0 transition-all cursor-pointer checked:border-gray-900 checked:bg-gray-900"
                                        />
                                    </div>
                                    {ItemIcon && (
                                        <div className="flex-shrink-0">
                                            <ItemIcon className={`w-4 h-4 ${item.color || 'text-gray-600'}`} />
                                        </div>
                                    )}
                                    <span className={`text-sm ${item.textColor || 'text-gray-900'} flex-1`}>
                                        {item.label}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                )}
                {!isLast && <div className="mt-4 border-t border-gray-200" />}
            </div>
        );
    };

    const renderYearView = () => {
        const year = currentDate.getFullYear();
        const months = [];

        for (let month = 0; month < 12; month++) {
            const monthDate = new Date(year, month, 1);
            const { daysInMonth, startingDayOfWeek } = getDaysInMonth(monthDate);
            const days = [];

            for (let i = 0; i < startingDayOfWeek; i++) {
                days.push(<div key={`empty-${i}`} className="w-7 h-7" />);
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const hasEvents = getEventsForDate(date).length > 0;
                const isTodayDate = isToday(date);

                days.push(
                    <div
                        key={day}
                        className={`w-7 h-7 flex items-center justify-center text-xs rounded cursor-pointer transition-colors ${isTodayDate ? 'bg-gray-900 text-white font-semibold' : 'hover:bg-gray-50 text-gray-700'
                            }`}
                        onClick={() => setCurrentDate(date)}
                    >
                        {day}
                        {hasEvents && !isTodayDate && (
                            <div className="absolute w-1 h-1 bg-blue-600 rounded-full mt-4" />
                        )}
                    </div>
                );
            }

            months.push(
                <div key={month} className="bg-white rounded-lg border border-gray-200 p-3">
                    <div className="text-sm font-semibold text-gray-900 mb-2 text-center">
                        {monthDate.toLocaleDateString('en-US', { month: 'long' })}
                    </div>
                    <div className="grid grid-cols-7 gap-0.5 mb-1">
                        {sampleData.ui.weekdaysShort.map((day, i) => (
                            <div key={i} className="w-7 h-7 flex items-center justify-center text-[10px] font-medium text-gray-400 uppercase">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-0.5 relative">
                        {days}
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-4 gap-4">
                {months}
            </div>
        );
    };

    const renderMonthView = () => {
        const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
        const days = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50 border-r border-b border-gray-200" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = getEventsForDate(date);
            const isTodayDate = isToday(date);
            const maxVisible = 3;
            const hasMore = dayEvents.length > maxVisible;

            days.push(
                <div
                    key={day}
                    className={`h-32 border-r border-b border-gray-200 p-2 cursor-pointer transition-colors overflow-hidden ${isTodayDate ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
                        }`}
                    onClick={() => dayEvents.length > 0 && setSelectedEvent(dayEvents[0])}
                >
                    <div className={`text-sm font-semibold mb-2 ${isTodayDate ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                        {day}
                    </div>

                    <div className="space-y-1">
                        {dayEvents.slice(0, maxVisible).map(event => {
                            const EventIcon = eventTypes[event.type].icon;
                            return (
                                <TooltipHero color='secondary' content={event.title} showArrow={true} placement='bottom'>
                                    <div
                                        key={event.id}
                                        className={`${eventTypes[event.type].bgColor} rounded px-2 py-1 text-xs ${eventTypes[event.type].textColor} ${eventTypes[event.type].hoverBg} transition-colors cursor-pointer relative group`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedEvent(event);
                                        }}
                                    >
                                        <div className="flex items-center gap-1">
                                            <EventIcon className="w-3 h-3 flex-shrink-0" />
                                            <span className="truncate font-medium">{event.title}</span>
                                        </div>
                                    </div>
                                </TooltipHero>
                            );
                        })}

                        {hasMore && (
                            <div className="text-xs text-gray-600 pl-1 pt-0.5">
                                +{dayEvents.length - maxVisible} more
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-7">
                    {sampleData.ui.weekdays.map(day => (
                        <div key={day} className="bg-white border-r border-b border-gray-200 last:border-r-0 px-3 py-3 text-center">
                            <div className="text-xs font-semibold text-gray-500 uppercase">{day}</div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {days}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const weekDates = getWeekDates(currentDate);

        return (
            <div
                className="overflow-x-auto -mx-8 px-8 week-scroll"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'transparent transparent'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.scrollbarColor = '#d1d5db #f9fafb';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.scrollbarColor = 'transparent transparent';
                }}
            >
                <style>{`
          .week-scroll::-webkit-scrollbar {
            height: 6px;
          }
          .week-scroll::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 3px;
          }
          .week-scroll::-webkit-scrollbar-thumb {
            background: transparent;
            border-radius: 3px;
          }
          .week-scroll:hover::-webkit-scrollbar-track {
            background: #f9fafb;
          }
          .week-scroll:hover::-webkit-scrollbar-thumb {
            background: #d1d5db;
          }
          .week-scroll:hover::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
        `}</style>
                <div className="inline-grid grid-cols-7 gap-0" style={{ minWidth: '1400px' }}>
                    {weekDates.map((date, dayIndex) => {
                        const dayEvents = getEventsForDate(date);
                        const isTodayDate = isToday(date);

                        return (
                            <div key={date.toISOString()} className={`w-[200px] min-h-[400px] p-4 ${isTodayDate ? 'bg-blue-50 rounded-lg' : ''} ${dayIndex < 6 ? 'border-r border-gray-200' : ''}`}>
                                <div className="text-center mb-4 pb-3 border-b border-gray-200">
                                    <div className="text-xs text-gray-500 mb-1 uppercase font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                    <div className={`text-2xl font-semibold ${isTodayDate ? 'text-blue-600' : 'text-gray-900'}`}>
                                        {date.getDate()}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {dayEvents.map(event => {
                                        const EventIcon = eventTypes[event.type].icon;
                                        return (
                                            <div
                                                key={event.id}
                                                className={`${eventTypes[event.type].bgColor} rounded-lg p-2.5 cursor-pointer ${eventTypes[event.type].hoverBg} transition-colors`}
                                                onClick={() => setSelectedEvent(event)}
                                            >
                                                <div className="flex items-start gap-2 mb-2">
                                                    <EventIcon className={`w-4 h-4 flex-shrink-0 ${eventTypes[event.type].textColor} mt-0.5`} />
                                                    <div className="flex-1 min-w-0">
                                                        <div className={`text-sm font-medium ${eventTypes[event.type].textColor} leading-tight break-words`}>
                                                            {event.title}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {event.assignee && (
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-5 h-5 rounded-full bg-white border border-gray-300 text-gray-700 flex items-center justify-center text-[10px] font-medium">
                                                                {getInitials(event.assignee)}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {event.status && (
                                                        <div className={`w-1.5 h-1.5 rounded-full ${getStatusConfig(event.status).color}`} title={getStatusConfig(event.status).label} />
                                                    )}

                                                    {event.replies > 0 && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-600">
                                                            <MessageSquare className="w-3 h-3" />
                                                            <span>{event.replies}</span>
                                                        </div>
                                                    )}

                                                    {event.attachments > 0 && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-600">
                                                            <Paperclip className="w-3 h-3" />
                                                            <span>{event.attachments}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {dayEvents.length === 0 && (
                                        <div className="text-center py-8 text-gray-400 text-xs">
                                            {sampleData.text.noEventsShort}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderDayView = () => {
        const dayEvents = getEventsForDate(currentDate);

        return (
            <div className="space-y-0">
                <div className="text-center pb-5 border-b border-gray-200 mb-5">
                    <div className="text-sm text-gray-500 uppercase font-medium">{currentDate.toLocaleDateString('en-US', { weekday: 'long' })}</div>
                    <div className="text-3xl font-semibold text-gray-900">{currentDate.getDate()}</div>
                </div>

                {dayEvents.length > 0 ? (
                    <div>
                        {dayEvents.map((event, index) => {
                            const EventIcon = eventTypes[event.type].icon;
                            return (
                                <div key={event.id}>
                                    <div
                                        className="py-5 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => setSelectedEvent(event)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <EventIcon className={`w-5 h-5 ${eventTypes[event.type].textColor} mt-0.5 flex-shrink-0`} />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900">{event.title}</h4>
                                                {event.description && (
                                                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                                )}
                                                <div className="flex items-center gap-4 mt-2">
                                                    {event.assignee && (
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                            <Users className="w-3.5 h-3.5" />
                                                            {event.assignee}
                                                        </div>
                                                    )}
                                                    {event.status && (
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${getStatusConfig(event.status).color}`} />
                                                            {getStatusConfig(event.status).label}
                                                        </div>
                                                    )}
                                                    {event.why && (
                                                        <div className="text-xs text-gray-500">
                                                            {event.why}
                                                        </div>
                                                    )}
                                                    {event.replies > 0 && (
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                            <MessageSquare className="w-3.5 h-3.5" />
                                                            {event.replies}
                                                        </div>
                                                    )}
                                                    {event.attachments > 0 && (
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                            <Paperclip className="w-3.5 h-3.5" />
                                                            {event.attachments}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {index < dayEvents.length - 1 && (
                                        <div className="border-b border-gray-200" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-400">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">{sampleData.text.noEvents}</p>
                    </div>
                )}
            </div>
        );
    };

    const renderRecurringLanes = () => {
        const rhythms = sampleData.rhythms.map(rhythm => ({
            ...rhythm,
            events: sampleData.events.filter(e => e.rhythm === rhythm.id)
        }));

        return (
            <div className="space-y-3">
                {rhythms.map(rhythm => (
                    <div key={rhythm.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div
                            className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between border-b border-gray-200"
                            onClick={() => toggleRhythm(rhythm.id)}
                        >
                            <div className="flex items-center gap-3">
                                <Layers className="w-5 h-5 text-gray-600" />
                                <h3 className="font-semibold text-gray-900">{rhythm.label}</h3>
                                <span className="text-sm text-gray-500">({rhythm.events.length})</span>
                            </div>
                            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedRhythms.includes(rhythm.id) ? 'rotate-90' : ''}`} />
                        </div>

                        {expandedRhythms.includes(rhythm.id) && (
                            <div className="px-4">
                                {rhythm.events.map((event, index) => {
                                    const EventIcon = eventTypes[event.type].icon;
                                    return (
                                        <div key={event.id}>
                                            <div
                                                className="flex items-center gap-3 py-4 hover:bg-gray-50 cursor-pointer transition-colors -mx-4 px-4"
                                                onClick={() => setSelectedEvent(event)}
                                            >
                                                <EventIcon className={`w-5 h-5 ${eventTypes[event.type].textColor}`} />
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900">{event.title}</div>
                                                    <div className="text-sm text-gray-500 mt-0.5">
                                                        {rhythm.id === 'weekly' && `Every ${sampleData.ui.weekdays[event.weekday]}`}
                                                        {rhythm.id === 'monthly' && `Day ${event.date} of each month`}
                                                        {rhythm.id === 'once' && `${event.month} ${event.date}, ${event.year}`}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {event.assignee && (
                                                        <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-300 text-gray-700 flex items-center justify-center text-xs font-medium">
                                                            {getInitials(event.assignee)}
                                                        </div>
                                                    )}
                                                    {event.status && (
                                                        <div className={`w-1.5 h-1.5 rounded-full ${getStatusConfig(event.status).color}`} />
                                                    )}
                                                </div>
                                            </div>
                                            {index < rhythm.events.length - 1 && (
                                                <div className="border-b border-gray-200" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderTimelineView = () => {
        const sortedEvents = [...sampleData.events]
            .filter(e => e.rhythm === 'once')
            .sort((a, b) => a.date - b.date);

        return (
            <div className="space-y-0">
                {sortedEvents.map((event, index) => {
                    const EventIcon = eventTypes[event.type].icon;

                    return (
                        <div key={event.id}>
                            <div className="py-5 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedEvent(event)}>
                                <div className="flex items-start gap-6">
                                    <div className="w-20 text-right flex-shrink-0">
                                        <div className="text-sm font-semibold text-gray-900">Nov {event.date}</div>
                                    </div>

                                    <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${getStatusConfig(event.status).color}`} />

                                    <EventIcon className={`w-5 h-5 ${eventTypes[event.type].textColor} mt-0.5 flex-shrink-0`} />

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                                        {event.description && (
                                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                        )}
                                        <div className="flex items-center gap-4 mt-2">
                                            {event.assignee && (
                                                <div className="text-xs text-gray-500">Assigned: {event.assignee}</div>
                                            )}
                                            {event.why && (
                                                <div className="text-xs text-gray-500">Purpose: {event.why}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={`px-2 py-1 rounded text-xs font-medium text-white flex-shrink-0 ${getStatusConfig(event.status).color}`}>
                                        {getStatusConfig(event.status).label}
                                    </div>
                                </div>
                            </div>
                            {index < sortedEvents.length - 1 && (
                                <div className="border-b border-gray-200" />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return sampleData && (
        <div className="bg-white flex overflow-hidden" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
            {/* Left Filter Panel */}
            {filterPanelOpen && (
                <div
                    className="w-80 p-2 overflow-y-auto flex-shrink-0 border-r border-gray-200 filter-scroll"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'transparent transparent'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.scrollbarColor = '#d1d5db #f9fafb';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.scrollbarColor = 'transparent transparent';
                    }}
                >
                    <style>{`
            .filter-scroll::-webkit-scrollbar {
              width: 6px;
            }
            .filter-scroll::-webkit-scrollbar-track {
              background: transparent;
              border-radius: 3px;
            }
            .filter-scroll::-webkit-scrollbar-thumb {
              background: transparent;
              border-radius: 3px;
            }
            .filter-scroll:hover::-webkit-scrollbar-track {
              background: #f9fafb;
            }
            .filter-scroll:hover::-webkit-scrollbar-thumb {
              background: #d1d5db;
            }
            .filter-scroll:hover::-webkit-scrollbar-thumb:hover {
              background: #9ca3af;
            }
          `}</style>
                    <button className="w-full mb-6 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center gap-2 font-medium text-sm">
                        <Plus className="w-4 h-4" />
                        {sampleData.text.newEvent}
                    </button>

                    <div className="space-y-0">
                        {renderMiniCalendar()}
                        {Object.entries(sampleData.filterCategories).map(([key, items], index) =>
                            renderFilterSection(
                                key,
                                key.charAt(0).toUpperCase() + key.slice(1),
                                items,
                                index === Object.keys(sampleData.filterCategories).length - 1
                            )
                        )}
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-2 relative">
                <div className="max-w-7xl mx-auto">
                    {/* Top Controls - Line 1 */}
                    <div className="flex items-center justify-center mb-4 relative">
                        <button
                            onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                            className="absolute left-0 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            title={filterPanelOpen ? sampleData.text.hideFilters : sampleData.text.showFilters}
                        >
                            <Filter className="w-5 h-5 text-gray-600" />
                        </button>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                {['day', 'week', 'month', 'year'].map((view) => (
                                    <button
                                        key={view}
                                        onClick={() => setCurrentView(view)}
                                        className={`px-4 py-2 text-sm font-medium ${view !== 'day' ? 'border-l border-gray-200' : ''} transition-colors ${currentView === view
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {view.charAt(0).toUpperCase() + view.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setCurrentView(sampleData.text.recurringView)}
                                    className={`p-2.5 transition-colors relative group ${currentView === sampleData.text.recurringView
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    title={sampleData.text.recurring}
                                >
                                    <Clock className="w-4 h-4" />
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        {sampleData.text.recurring}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setCurrentView(sampleData.text.timelineView)}
                                    className={`p-2.5 border-l border-gray-200 transition-colors relative group ${currentView === sampleData.text.timelineView
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    title={sampleData.text.timeline}
                                >
                                    <List className="w-4 h-4" />
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        {sampleData.text.timeline}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Top Controls - Line 2 */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-2xl font-semibold text-gray-900">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </div>

                        <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => {
                                    const newDate = new Date(currentDate);
                                    if (currentView === 'month' || currentView === 'year') newDate.setMonth(newDate.getMonth() - 1);
                                    else if (currentView === 'week') newDate.setDate(newDate.getDate() - 7);
                                    else if (currentView === 'day') newDate.setDate(newDate.getDate() - 1);
                                    setCurrentDate(newDate);
                                }}
                                className="p-2 hover:bg-gray-50 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <button
                                onClick={() => setCurrentDate(new Date())}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border-l border-r border-gray-200 transition-colors"
                            >
                                {sampleData.text.today}
                            </button>
                            <button
                                onClick={() => {
                                    const newDate = new Date(currentDate);
                                    if (currentView === 'month' || currentView === 'year') newDate.setMonth(newDate.getMonth() + 1);
                                    else if (currentView === 'week') newDate.setDate(newDate.getDate() + 7);
                                    else if (currentView === 'day') newDate.setDate(newDate.getDate() + 1);
                                    setCurrentDate(newDate);
                                }}
                                className="p-2 hover:bg-gray-50 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {currentView === 'month' && renderMonthView()}
                    {currentView === 'week' && renderWeekView()}
                    {currentView === 'day' && renderDayView()}
                    {currentView === 'year' && renderYearView()}
                    {currentView === sampleData.text.recurringView && renderRecurringLanes()}
                    {currentView === sampleData.text.timelineView && renderTimelineView()}
                </div>

                {selectedEvent && (
                    <div className="fixed right-0 w-[360px] top-16 h-[calc(100vh-4rem)] w-80 bg-white shadow-2xl z-[51] transform transition-transform duration-300 ease-out flex flex-col">
                        <div className="border-b border-gray-200 p-5 flex items-center justify-between bg-gradient-to-br from-white to-gray-50/50">
                            <h2 className="font-semibold text-gray-900 text-lg tracking-tight">{sampleData.text.eventDetails}</h2>
                            <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5">
                            <div className="mb-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex-shrink-0">
                                        {React.createElement(eventTypes[selectedEvent.type].icon, {
                                            className: `w-6 h-6 ${eventTypes[selectedEvent.type].textColor}`,
                                            strokeWidth: 1.5
                                        })}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 tracking-tight">{selectedEvent.title}</h3>
                                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{eventTypes[selectedEvent.type].label}</span>
                                    </div>
                                </div>
                                {selectedEvent.description && (
                                    <p className="text-sm text-gray-600 mt-3 leading-relaxed">{selectedEvent.description}</p>
                                )}
                            </div>

                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                                {selectedEvent.assignee && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Users className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-600 font-medium">{sampleData.text.AssignedTo}</span>
                                        <span className="font-semibold text-gray-900">{selectedEvent.assignee}</span>
                                    </div>
                                )}

                                {selectedEvent.rhythm && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-600 font-medium">{sampleData.text.Recurrence}</span>
                                        <span className="font-semibold text-gray-900 capitalize">{selectedEvent.rhythm}</span>
                                    </div>
                                )}

                                {selectedEvent.status && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className={`w-3 h-3 rounded-full ${getStatusConfig(selectedEvent.status).color}`} />
                                        <span className="text-gray-600 font-medium">{sampleData.text.Status}</span>
                                        <span className="font-semibold text-gray-900">{getStatusConfig(selectedEvent.status).label}</span>
                                    </div>
                                )}

                                {selectedEvent.why && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="text-gray-600 font-medium">{sampleData.text.Purpose}</span>
                                        <span className="font-semibold text-gray-900">{selectedEvent.why}</span>
                                    </div>
                                )}
                            </div>

                            {selectedEvent.id === 'w1' && (
                                <div className="mb-6 pb-6 border-b border-gray-200">
                                    <button
                                        onClick={() => setShowComparison(true)}
                                        className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        {sampleData.text.viewComparison}
                                    </button>
                                </div>
                            )}

                            {selectedEvent.id === 'm1' && (
                                <div className="mb-6 pb-6 border-b border-gray-200">
                                    <button
                                        onClick={() => setViewType(null)}
                                        className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        {sampleData.text.view}
                                    </button>
                                </div>
                            )}

                            <div className="space-y-4">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{sampleData.text.conversation}</h4>
                                <div className="space-y-3">
                                    {selectedEvent.hasConversation && selectedEvent.conversationData ? (
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                                                    {selectedEvent.conversationData.author}
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{selectedEvent.conversationData.author}</span>
                                                <span className="text-xs text-gray-500">{selectedEvent.conversationData.time}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed">{selectedEvent.conversationData.message}</p>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 leading-relaxed border border-gray-200">
                                            {sampleData.text.conversationPlaceholder}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 p-3 bg-gradient-to-br from-white to-gray-50/50">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newReply}
                                    onChange={(e) => setNewReply(e.target.value)}
                                    placeholder={sampleData.text.addComment}
                                    className="flex-1 border-2 border-gray-200 rounded-lg px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all font-medium"
                                />
                                <button className="w-11 h-11 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Comparison Panel */}
            {showComparison && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowComparison(false)} />
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[51] rounded-t-2xl shadow-2xl" style={{ height: '70vh' }}>
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">{sampleData.text.membershipYoYComparison}</h2>
                                <p className="text-sm text-gray-500 mt-1">{sampleData.text.currentVsPrevious}</p>
                            </div>
                            <button
                                onClick={() => setShowComparison(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto" style={{ height: 'calc(70vh - 88px)' }}>
                            <div className="mb-6">
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={sampleData.membershipData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis
                                            dataKey="type"
                                            tick={{ fill: '#6b7280', fontSize: 12 }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                        />
                                        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                padding: '12px'
                                            }}
                                        />
                                        <Legend
                                            wrapperStyle={{ paddingTop: '20px' }}
                                            iconType="circle"
                                        />
                                        <Bar dataKey="previous" fill="#94a3b8" name="Previous Year" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="current" fill="#3b82f6" name="Current Year" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="space-y-0">
                                {sampleData.membershipData.map((item, index) => {
                                    const change = item.current - item.previous;
                                    const percentChange = ((change / item.previous) * 100).toFixed(1);
                                    const revenueChange = item.currentRevenue - item.previousRevenue;
                                    const isPositive = change > 0;

                                    return (
                                        <div key={index} className="border-b border-gray-200 py-4 last:border-b-0">
                                            <h4 className="font-semibold text-gray-900 mb-3">{item.type}</h4>
                                            <div className="flex items-start gap-8">
                                                <div className="flex gap-6">
                                                    <div>
                                                        <div className="text-gray-500 text-xs mb-1">{sampleData.text.PreviousYear}</div>
                                                        <div className="text-lg font-semibold text-gray-700">{item.previous.toLocaleString()}</div>
                                                        <div className="text-xs text-gray-500 mt-0.5">${(item.previousRevenue / 1000).toFixed(0)}k</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-gray-500 text-xs mb-1">{sampleData.text.CurrentYear}</div>
                                                        <div className="text-lg font-semibold text-blue-600">{item.current.toLocaleString()}</div>
                                                        <div className="text-xs text-blue-500 mt-0.5">${(item.currentRevenue / 1000).toFixed(0)}k</div>
                                                    </div>
                                                </div>

                                                <div className="border-l-2 border-gray-200 pl-6">
                                                    <div className="text-gray-500 text-xs mb-1">{sampleData.text.Change}</div>
                                                    <div className={`text-lg font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                        {isPositive ? '+' : ''}{change.toLocaleString()} <span className="text-sm">({isPositive ? '+' : ''}{percentChange}%)</span>
                                                    </div>
                                                    <div className={`text-xs mt-0.5 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                        {isPositive ? '+' : ''}${(Math.abs(revenueChange) / 1000).toFixed(0)}k
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CalendarView;