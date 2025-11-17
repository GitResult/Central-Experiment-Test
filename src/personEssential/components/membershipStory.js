import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight, ChevronLeft, TrendingUp, TrendingDown, Users, Award, ArrowRight, MapPin, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const MembershipStory = () => {
    const [currentChapter, setCurrentChapter] = useState(0);
    const [expandedSection, setExpandedSection] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    // Chapter 3 filters and UI state
    const [selectedMembershipType, setSelectedMembershipType] = useState(null);
    const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [isFilterPanelExpanded, setIsFilterPanelExpanded] = useState(false);
    const [sampleData, setSampleData] = useState(null);
    const [totalMembers, setTotalMembers] = useState(null);
    const [previousYear, setPreviousYear] = useState(null);
    const [growth, setGrowth] = useState(null);
    const [growthPercent, setGrowthPercent] = useState(null);
    const [membershipTypes, setMembershipType] = useState(null);
    const [ageGroups, setAgeGroups] = useState(null);
    const [provinces, setProvinces] = useState(null);
    const [topSections, setTopSections] = useState(null);
    const [allSections, setAllSections] = useState(null);
    const [journeyData, setJourneyData] = useState(null);
    const [chapters, setChapters] = useState(null);
    const [historicalData, setHistoricalData] = useState(null);

    useEffect(() => {
        const loadSampleData = async () => {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/data/membershipStory.json`);
                if (!response.ok) {
                    throw new Error('Failed to load sample sampleData');
                }
                const sampleData = await response.json();
                setTotalMembers(sampleData.summary.totalMembers);
                setPreviousYear(sampleData.summary.previousYear);
                setGrowth(sampleData.summary.growth);
                setGrowthPercent(sampleData.summary.growthPercent);
                setMembershipType(sampleData.membershipTypes);
                setAgeGroups(sampleData.ageGroups);
                setProvinces(sampleData.provinces);
                setTopSections(sampleData.sections.slice(0, 5));
                setAllSections(sampleData.sections);
                setJourneyData(sampleData.journeyData);
                setChapters(sampleData.chapters);
                setHistoricalData(sampleData.historicalData);
                setSampleData(sampleData);
            } catch (error) {
                console.error('Error loading sample sampleData:', error);
                setSampleData(null);
            }
        };

        loadSampleData();
    }, []);

    // Extract sampleData from JSON


    // Filtered sampleData computation for Chapter 3
    const filteredData = useMemo(() => {
        if (sampleData) {
            let filteredTotal = totalMembers;
            let filteredSections = [...allSections];
            let filteredProvinces = [...provinces];
            let filteredTypes = [...membershipTypes];
            let filteredAges = [...ageGroups];

            if (selectedMembershipType || selectedAgeGroup || selectedProvince) {
                if (selectedMembershipType) {
                    const typeData = membershipTypes.find(t => t.name === selectedMembershipType);
                    filteredTotal = typeData.count;
                    filteredSections = filteredSections.map(s => ({
                        ...s,
                        count: Math.round(s.count * (typeData.count / totalMembers))
                    }));
                    filteredProvinces = filteredProvinces.map(p => ({
                        ...p,
                        count: Math.round(p.count * (typeData.count / totalMembers))
                    }));
                    filteredAges = filteredAges.map(a => ({
                        ...a,
                        count: Math.round(a.count * (typeData.count / totalMembers))
                    }));
                }

                if (selectedAgeGroup) {
                    const ageData = ageGroups.find(a => a.name === selectedAgeGroup);
                    if (!selectedMembershipType) {
                        filteredTotal = ageData.count;
                    } else {
                        filteredTotal = Math.round(filteredTotal * (ageData.count / totalMembers));
                    }
                    filteredSections = filteredSections.map(s => ({
                        ...s,
                        count: Math.round(s.count * (ageData.count / totalMembers))
                    }));
                    filteredProvinces = filteredProvinces.map(p => ({
                        ...p,
                        count: Math.round(p.count * (ageData.count / totalMembers))
                    }));
                    filteredTypes = filteredTypes.map(t => ({
                        ...t,
                        count: Math.round(t.count * (ageData.count / totalMembers))
                    }));
                }

                if (selectedProvince) {
                    const provData = provinces.find(p => p.name === selectedProvince);
                    if (!selectedMembershipType && !selectedAgeGroup) {
                        filteredTotal = provData.count;
                    } else {
                        filteredTotal = Math.round(filteredTotal * (provData.count / totalMembers));
                    }
                    filteredSections = filteredSections.map(s => ({
                        ...s,
                        count: Math.round(s.count * (provData.count / totalMembers))
                    }));
                    filteredTypes = filteredTypes.map(t => ({
                        ...t,
                        count: Math.round(t.count * (provData.count / totalMembers))
                    }));
                    filteredAges = filteredAges.map(a => ({
                        ...a,
                        count: Math.round(a.count * (provData.count / totalMembers))
                    }));
                }
            }

            return {
                total: filteredTotal,
                sections: filteredSections.sort((a, b) => b.count - a.count),
                provinces: filteredProvinces.sort((a, b) => b.count - a.count),
                types: filteredTypes.sort((a, b) => b.count - a.count),
                ages: filteredAges
            };
        }
    }, [sampleData, selectedMembershipType, selectedAgeGroup, selectedProvince, allSections, provinces, membershipTypes, ageGroups, totalMembers]);

    const hasActiveFilters = selectedMembershipType || selectedAgeGroup || selectedProvince;

    const resetFilters = () => {
        setSelectedMembershipType(null);
        setSelectedAgeGroup(null);
        setSelectedProvince(null);
    };

    const toggleMembershipType = (typeName) => {
        setSelectedMembershipType(selectedMembershipType === typeName ? null : typeName);
    };

    const toggleAgeGroup = (ageName) => {
        setSelectedAgeGroup(selectedAgeGroup === ageName ? null : ageName);
    };

    const toggleProvince = (provName) => {
        setSelectedProvince(selectedProvince === provName ? null : provName);
    };

    const nextChapter = () => {
        if (currentChapter < chapters.length - 1) {
            setCurrentChapter(currentChapter + 1);
            setExpandedSection(null);
            setSelectedType(null);
        }
    };

    const prevChapter = () => {
        if (currentChapter > 0) {
            setCurrentChapter(currentChapter - 1);
            setExpandedSection(null);
            setSelectedType(null);
        }
    };

    const getMaxCount = () => Math.max(...membershipTypes.map(t => t.count));
    const getMaxProvinceCount = () => Math.max(...filteredData.provinces.map(p => p.count));

    return sampleData && (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Navigation Header */}
            <div className="absolute left-0 right-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-600">
                        {chapters[currentChapter].title}
                    </div>
                    <div className="flex gap-2">
                        {chapters.map((chapter, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setCurrentChapter(idx);
                                    if (idx !== 3) resetFilters();
                                }}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentChapter ? 'bg-gray-900 w-6' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                        {currentChapter + 1} / {chapters.length}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-20 pb-32">
                {/* Opening */}
                {currentChapter === 0 && (
                    <div className="max-w-4xl mx-auto px-6 py-20 min-h-[70vh] flex flex-col justify-center">
                        <div className="text-center space-y-8 animate-fadeIn">
                            <div className="space-y-4">
                                <h1 className="text-8xl font-bold tracking-tight">
                                    {totalMembers.toLocaleString()}
                                </h1>
                                <p className="text-2xl text-gray-600 font-light">{sampleData.summary.recordType}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-center gap-2 text-emerald-600">
                                    <TrendingUp size={24} />
                                    <span className="text-3xl font-semibold">+{growth.toLocaleString()}</span>
                                </div>
                                <p className="text-xl text-gray-500">{sampleData.summary.fromYear}</p>
                            </div>

                            <div className="pt-8">
                                <p className="text-lg text-gray-700 font-medium">
                                    {sampleData.content.opening.headline}
                                </p>
                            </div>

                            {/* Minimal sparkline */}
                            <div className="pt-12 flex justify-center">
                                <svg width="300" height="60" className="text-gray-300">
                                    <polyline
                                        points="0,50 50,45 100,40 150,35 200,25 250,15 300,10"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="text-gray-900"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}

                {/* Chapter 1: Community Strength */}
                {currentChapter === 1 && (
                    <div className="max-w-4xl mx-auto px-6 space-y-16">
                        <div className="text-center py-12">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                {chapters[1].title}
                            </p>
                            <h2 className="text-5xl font-bold">{sampleData.content.chapter1.title}</h2>
                        </div>

                        {/* Card 1.1: Total Membership */}
                        <div className="bg-gray-50 rounded-3xl p-12 space-y-6">
                            <div className="flex items-baseline gap-4">
                                <span className="text-6xl font-bold">{totalMembers.toLocaleString()}</span>
                                <span className="text-3xl font-semibold text-emerald-600">+{growthPercent}%</span>
                            </div>
                            <p className="text-xl text-gray-600">{sampleData.content.chapter1.subtitle}</p>
                            <div className="pt-4 flex gap-8 text-sm">
                                <div>
                                    <div className="text-gray-500">{sampleData.summary.year2024}</div>
                                    <div className="text-2xl font-semibold">{previousYear.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">{sampleData.summary.Growth}</div>
                                    <div className="text-2xl font-semibold text-emerald-600">+{growth.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        {/* Card 1.2: Growth Trajectory */}
                        <div className="space-y-6">
                            <h3 className="text-3xl font-bold">{sampleData.summary.trajectoryTitle}</h3>
                            <div className="bg-gray-50 rounded-3xl p-12">
                                <div className="relative" style={{ height: '300px' }}>
                                    <div className="absolute inset-0 flex flex-col justify-between">
                                        {sampleData.summary.trajectoryData.map((value, idx) => (
                                            <div key={idx} className="flex items-center">
                                                <span className="text-xs text-gray-400 w-16">{value.toLocaleString()}</span>
                                                <div className="flex-1 border-t border-gray-200 ml-4" />
                                            </div>
                                        ))}
                                    </div>

                                    <svg className="absolute inset-0 ml-20" viewBox="0 0 500 300" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#9ca3af" />
                                                <stop offset="80%" stopColor="#4b5563" />
                                                <stop offset="100%" stopColor="#111827" />
                                            </linearGradient>
                                            <filter id="glow">
                                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur" />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>
                                        </defs>

                                        <polyline
                                            points="0,225 125,180 250,135 375,90 500,30"
                                            fill="none"
                                            stroke="url(#lineGradient)"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />

                                        <circle cx="0" cy="225" r="5" fill="#9ca3af" />
                                        <circle cx="125" cy="180" r="5" fill="#6b7280" />
                                        <circle cx="250" cy="135" r="5" fill="#4b5563" />
                                        <circle cx="375" cy="90" r="6" fill="#374151" />
                                        <circle cx="500" cy="30" r="8" fill="#111827" filter="url(#glow)" />
                                    </svg>

                                    <div className="absolute right-0 top-4 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                                        {sampleData.summary.peakYear}
                                    </div>
                                </div>

                                <div className="flex justify-between mt-6 ml-20">
                                    {historicalData.map((yearData, idx) => (
                                        <div key={idx} className="text-center flex-1">
                                            <div className={`text-sm font-semibold mb-1 ${idx === 4 ? 'text-gray-900 text-base' : 'text-gray-600'}`}>
                                                {yearData.year}
                                            </div>
                                            <div className={`text-lg font-bold ${idx === 4 ? 'text-2xl text-gray-900' : 'text-gray-500'}`}>
                                                {yearData.value.toLocaleString()}
                                            </div>
                                            {yearData.growth && (
                                                <div className={`text-xs font-medium mt-1 ${idx === 4 ? 'text-emerald-600 font-semibold' : 'text-gray-400'}`}>
                                                    +{yearData.growth}%
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <p className="text-gray-700 text-lg">
                                        <span className="font-semibold">{sampleData.summary.AcceleratingMomentum}</span> {sampleData.content.chapter1.insights[0].text}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 1.3: Membership Types */}
                        <div className="space-y-6">
                            <h3 className="text-3xl font-bold">{sampleData.summary.MembershipComposition}</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {membershipTypes.map((type, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedType(selectedType === idx ? null : idx)}
                                        className={`${type.color} text-white rounded-2xl p-6 text-left transition-all hover:scale-105 ${selectedType === idx ? 'ring-4 ring-gray-900 ring-offset-4' : ''
                                            }`}
                                        style={{
                                            height: `${80 + (type.count / getMaxCount()) * 120}px`,
                                            opacity: selectedType === null ? 1 : selectedType === idx ? 1 : 0.4
                                        }}
                                    >
                                        <div className="space-y-2">
                                            <div className="text-3xl font-bold">{type.count.toLocaleString()}</div>
                                            <div className="text-sm font-medium opacity-90">{type.name}</div>
                                            {selectedType === idx && (
                                                <div className="text-xs opacity-75 pt-2">
                                                    {type.yoy > 0 ? '+' : ''}{type.yoy}% YoY
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Card 1.4: Top Sections */}
                        <div className="space-y-6">
                            <h3 className="text-3xl font-bold">{sampleData.summary.Sections}</h3>
                            <div className="space-y-3">
                                {topSections.map((section, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-lg font-semibold">{section.name}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-bold">{section.count.toLocaleString()}</span>
                                                <span className={`flex items-center gap-1 text-sm font-medium ${section.yoy > 0 ? 'text-emerald-600' : 'text-red-600'
                                                    }`}>
                                                    {section.yoy > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                                    {Math.abs(section.yoy)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gray-900 rounded-full transition-all"
                                                style={{ width: `${(section.count / topSections[0].count) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setExpandedSection(!expandedSection)}
                                className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 mt-4"
                            >
                                {expandedSection ? 'Show less' : `${sampleData.summary.seeAll} ${allSections.length} ${sampleData.summary.sections}`}
                                <ChevronRight size={20} className={`transition-transform ${expandedSection ? 'rotate-90' : ''}`} />
                            </button>

                            {expandedSection && (
                                <div className="grid grid-cols-2 gap-3 pt-4">
                                    {allSections.slice(5).map((section, idx) => (
                                        <div key={idx} className="bg-gray-50 rounded-xl p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm font-medium text-gray-900">{section.name}</span>
                                                <span className={`text-xs font-semibold ${section.yoy > 0 ? 'text-emerald-600' : section.yoy < 0 ? 'text-red-600' : 'text-gray-500'
                                                    }`}>
                                                    {section.yoy > 0 ? '+' : ''}{section.yoy}
                                                </span>
                                            </div>
                                            <div className="text-xl font-bold">{section.count}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Chapter 2: The Journey */}
                {currentChapter === 2 && (
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center pt-12">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                {chapters[2].title}
                            </p>
                            <h2 className="text-5xl font-bold">{sampleData.content.chapter2.title}</h2>
                            <p className="text-xl text-gray-600 mt-4">{sampleData.content.chapter2.subtitle}</p>
                        </div>
                        <div className="flex justify-end pb-12">
                            <Link to="/demo/flow-analytics" className="no-underline hover:no-underline relative py-2 px-6 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                <span>{sampleData.summary.FlowAnalytics}</span>
                            </Link>
                        </div>
                        {/* Journey Visualization */}
                        <div className="bg-gray-50 rounded-3xl p-12 space-y-12">
                            {/* Stage 1 */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            {sampleData.summary.StudentAffiliate}
                                        </div>
                                        <div className="text-3xl font-bold">{membershipTypes.find(t => t.name === sampleData.summary.StudentAffiliate).count.toLocaleString()}</div>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center px-8">
                                        <ArrowRight size={40} className="text-gray-400 mb-2" />
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-gray-900">{journeyData.saToEcy1.count}</div>
                                            <div className="text-sm text-gray-600 mt-1">advanced to ECY1</div>
                                            <div className="text-xs text-emerald-600 font-semibold mt-2">
                                                +{journeyData.saToEcy1.yoy} {sampleData.summary.vsYear}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            {sampleData.summary.ECY1}
                                        </div>
                                        <div className="text-3xl font-bold">{membershipTypes.find(t => t.name === sampleData.summary.ECY1).count.toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-gray-600 to-gray-500 rounded-full"
                                        style={{ width: `${journeyData.saToEcy1.rate}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 text-center">
                                    {journeyData.saToEcy1.rate}% {sampleData.summary.progressionRate}
                                </p>
                            </div>

                            <div className="border-t border-gray-200" />

                            {/* Stage 2 */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            {sampleData.summary.ECY1}
                                        </div>
                                        <div className="text-3xl font-bold">{membershipTypes.find(t => t.name === sampleData.summary.ECY1).count.toLocaleString()}</div>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center px-8">
                                        <ArrowRight size={40} className="text-gray-400 mb-2" />
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-gray-900">{journeyData.ecy1ToEcy2.count}</div>
                                            <div className="text-sm text-gray-600 mt-1">advanced to ECY2</div>
                                            <div className="text-xs text-emerald-600 font-semibold mt-2">
                                                +{journeyData.ecy1ToEcy2.yoy} {sampleData.summary.vsYear}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            {sampleData.summary.ECY2}
                                        </div>
                                        <div className="text-3xl font-bold">{membershipTypes.find(t => t.name === sampleData.summary.ECY2).count.toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-gray-500 to-gray-400 rounded-full"
                                        style={{ width: `${journeyData.ecy1ToEcy2.rate}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 text-center">
                                    {journeyData.ecy1ToEcy2.rate}% {sampleData.summary.progressionRate}
                                </p>
                            </div>

                            <div className="border-t border-gray-200" />

                            {/* Stage 3 */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            {sampleData.summary.ECY2}
                                        </div>
                                        <div className="text-3xl font-bold">{membershipTypes.find(t => t.name === sampleData.summary.ECY2).count.toLocaleString()}</div>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center px-8">
                                        <ArrowRight size={40} className="text-gray-400 mb-2" />
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-gray-900">{journeyData.ecy2ToFull.count}</div>
                                            <div className="text-sm text-gray-600 mt-1">{sampleData.summary.becameFullMembers}</div>
                                            <div className="text-xs text-emerald-600 font-semibold mt-2">
                                                +{journeyData.ecy2ToFull.yoy} {sampleData.summary.vsYear}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            {sampleData.summary.FullMember}
                                        </div>
                                        <div className="text-3xl font-bold">{membershipTypes.find(t => t.name === sampleData.summary.FullMember).count.toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-gray-400 to-gray-800 rounded-full"
                                        style={{ width: `${journeyData.ecy2ToFull.rate}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 text-center">
                                    {journeyData.ecy2ToFull.rate}% {sampleData.summary.progressionRate}
                                </p>
                            </div>
                        </div>

                        {/* Pipeline Health */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-3xl p-12 text-center space-y-6">
                            <Award size={48} className="mx-auto opacity-90" />
                            <div className="space-y-2">
                                <div className="text-6xl font-bold">
                                    {((journeyData.saToEcy1.count + journeyData.ecy1ToEcy2.count + journeyData.ecy2ToFull.count) /
                                        (membershipTypes.find(t => t.name === sampleData.summary.StudentAffiliate).count +
                                            membershipTypes.find(t => t.name === sampleData.summary.ECY1).count +
                                            membershipTypes.find(t => t.name === sampleData.summary.ECY2).count) * 100).toFixed(0)}%
                                </div>
                                <p className="text-xl opacity-90">{sampleData.summary.OverallProgressionRate}</p>
                            </div>
                            <p className="text-lg opacity-75 max-w-md mx-auto">
                                {Math.round((journeyData.saToEcy1.count + journeyData.ecy1ToEcy2.count + journeyData.ecy2ToFull.count) /
                                    (membershipTypes.find(t => t.name === sampleData.summary.StudentAffiliate).count +
                                        membershipTypes.find(t => t.name === sampleData.summary.ECY1).count +
                                        membershipTypes.find(t => t.name === sampleData.summary.ECY2).count) * 10)} {sampleData.summary.outOf10} {sampleData.summary.membersProgressed}
                            </p>
                        </div>
                    </div>
                )}

                {/* Chapter 3: Where They Are - ANALYTICAL HUB WITH PROGRESSIVE DISCLOSURE */}
                {currentChapter === 3 && (
                    <div className="max-w-6xl mx-auto px-6 space-y-12">
                        <div className="text-center py-12">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                {chapters[3].title}
                            </p>
                            <h2 className="text-5xl font-bold">{sampleData.content.chapter3.title}</h2>
                            <p className="text-xl text-gray-600 mt-4">{sampleData.content.chapter3.subtitle}</p>
                            {!hasActiveFilters && (
                                <p className="text-sm text-gray-500 mt-3 flex items-center justify-center gap-2">
                                    <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    {sampleData.content.chapter3.hint}
                                </p>
                            )}
                        </div>

                        {/* Collapsible Filter Panel */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setIsFilterPanelExpanded(!isFilterPanelExpanded)}
                                    className="flex items-center gap-3 text-gray-900 hover:text-gray-700 transition-colors"
                                >
                                    <Filter size={20} />
                                    <span className="text-lg font-semibold">{sampleData.summary.AnalyzeBySegment}</span>
                                    {isFilterPanelExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                {hasActiveFilters && (
                                    <button
                                        onClick={resetFilters}
                                        className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl font-medium transition-colors"
                                    >
                                        <X size={16} />
                                        {sampleData.summary.ClearFilters}
                                    </button>
                                )}
                            </div>

                            {/* Active Filter Chips (when collapsed) */}
                            {hasActiveFilters && !isFilterPanelExpanded && (
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm text-gray-600 font-medium">{sampleData.summary.filters}</span>
                                    {selectedMembershipType && (
                                        <button
                                            onClick={() => setSelectedMembershipType(null)}
                                            className="flex items-center gap-2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                                        >
                                            {selectedMembershipType}
                                            <X size={14} />
                                        </button>
                                    )}
                                    {selectedProvince && (
                                        <button
                                            onClick={() => setSelectedProvince(null)}
                                            className="flex items-center gap-2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                                        >
                                            {provinces.find(p => p.name === selectedProvince)?.fullName}
                                            <X size={14} />
                                        </button>
                                    )}
                                    {selectedAgeGroup && (
                                        <button
                                            onClick={() => setSelectedAgeGroup(null)}
                                            className="flex items-center gap-2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                                        >
                                            {selectedAgeGroup}
                                            <X size={14} />
                                        </button>
                                    )}
                                    <div className="ml-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold">
                                        {filteredData.total.toLocaleString()} {sampleData.summary.recordType}
                                    </div>
                                </div>
                            )}

                            {/* Expanded Filter Panel */}
                            {isFilterPanelExpanded && (
                                <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-3xl p-8 space-y-6">
                                    {hasActiveFilters && (
                                        <div className="p-4 bg-white/10 rounded-xl">
                                            <div className="text-5xl font-bold mb-2">{filteredData.total.toLocaleString()}</div>
                                            <div className="text-sm opacity-75">{sampleData.summary.membersMatchYourFilters}</div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-3 gap-4">
                                        {/* Membership Type Filter */}
                                        <div>
                                            <label className="text-sm font-semibold opacity-75 uppercase tracking-wider block mb-3">
                                                {sampleData.summary.MembershipType}
                                            </label>
                                            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                                                {membershipTypes.map((type, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => toggleMembershipType(type.name)}
                                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${selectedMembershipType === type.name
                                                            ? 'bg-white text-gray-900 font-semibold'
                                                            : 'bg-white/10 hover:bg-white/20'
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <span>{type.name}</span>
                                                            <span className="text-sm opacity-75">{type.count.toLocaleString()}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Age Group Filter */}
                                        <div>
                                            <label className="text-sm font-semibold opacity-75 uppercase tracking-wider block mb-3">
                                                {sampleData.summary.AgeGroup}
                                            </label>
                                            <div className="space-y-2">
                                                {ageGroups.map((age, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => toggleAgeGroup(age.name)}
                                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${selectedAgeGroup === age.name
                                                            ? 'bg-white text-gray-900 font-semibold'
                                                            : 'bg-white/10 hover:bg-white/20'
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <span>{age.name}</span>
                                                            <span className="text-sm opacity-75">{age.count.toLocaleString()}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Province Filter */}
                                        <div>
                                            <label className="text-sm font-semibold opacity-75 uppercase tracking-wider block mb-3">
                                                {sampleData.summary.Province}
                                            </label>
                                            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                                                {provinces.sort((a, b) => b.count - a.count).map((prov, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => toggleProvince(prov.name)}
                                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${selectedProvince === prov.name
                                                            ? 'bg-white text-gray-900 font-semibold'
                                                            : 'bg-white/10 hover:bg-white/20'
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <span>{prov.fullName}</span>
                                                            <span className="text-sm opacity-75">{prov.count.toLocaleString()}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Canadian Map Visualization - INTERACTIVE */}
                        <div className="bg-gray-50 rounded-3xl p-12">
                            <h3 className="text-2xl font-bold mb-8">{sampleData.summary.GeographicDistribution}</h3>
                            <div className="relative bg-white rounded-2xl p-8" style={{ height: '500px' }}>
                                <svg className="w-full h-full" viewBox="0 0 100 70">
                                    <path
                                        d="M 10,20 Q 15,15 25,15 L 35,20 L 45,15 Q 55,18 65,20 L 75,25 Q 85,30 88,40 L 90,50 Q 88,55 85,58 L 75,60 L 65,58 L 55,60 L 45,58 L 35,60 L 25,58 L 15,55 Q 10,50 10,40 Z"
                                        fill="#f3f4f6"
                                        stroke="#d1d5db"
                                        strokeWidth="0.3"
                                    />

                                    {filteredData.provinces.map((prov, idx) => {
                                        const size = Math.max(2, Math.min(12, (prov.count / getMaxProvinceCount()) * 12));
                                        const isSelected = selectedProvince === prov.name;
                                        const isOtherSelected = selectedProvince && !isSelected;

                                        return (
                                            <g key={idx}>
                                                <circle
                                                    cx={prov.x}
                                                    cy={prov.y}
                                                    r={size}
                                                    fill={isSelected ? '#111827' : '#6b7280'}
                                                    opacity={isOtherSelected ? 0.3 : 0.9}
                                                    className="cursor-pointer transition-all hover:opacity-100 hover:scale-110"
                                                    style={{ transformOrigin: `${prov.x}% ${prov.y}%` }}
                                                    onClick={() => toggleProvince(prov.name)}
                                                />
                                                {isSelected && (
                                                    <circle
                                                        cx={prov.x}
                                                        cy={prov.y}
                                                        r={size + 1.5}
                                                        fill="none"
                                                        stroke="#111827"
                                                        strokeWidth="0.8"
                                                        className="pointer-events-none"
                                                    />
                                                )}
                                                <text
                                                    x={prov.x}
                                                    y={prov.y + size + 3}
                                                    textAnchor="middle"
                                                    fontSize="3"
                                                    fill="#374151"
                                                    fontWeight="bold"
                                                    className="pointer-events-none"
                                                >
                                                    {prov.name}
                                                </text>
                                                <text
                                                    x={prov.x}
                                                    y={prov.y + size + 6.5}
                                                    textAnchor="middle"
                                                    fontSize="2.5"
                                                    fill="#6b7280"
                                                    className="pointer-events-none"
                                                >
                                                    {prov.count.toLocaleString()}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                        </div>

                        {/* Side-by-side breakdowns - INTERACTIVE */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* Membership Type Breakdown */}
                            <div className="bg-gray-50 rounded-3xl p-8">
                                <h3 className="text-xl font-bold mb-6">Membership Type Breakdown</h3>
                                <div className="space-y-3">
                                    {filteredData.types.slice(0, 5).map((type, idx) => {
                                        const isSelected = selectedMembershipType === type.name;
                                        const isOtherSelected = selectedMembershipType && !isSelected;

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => toggleMembershipType(type.name)}
                                                className={`w-full text-left space-y-2 p-3 rounded-xl transition-all ${isSelected ? 'bg-gray-900 text-white ring-2 ring-gray-900 ring-offset-2' : 'hover:bg-gray-100'
                                                    }`}
                                                style={{ opacity: isOtherSelected ? 0.4 : 1 }}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium">{type.name}</span>
                                                    <span className="text-lg font-bold">{type.count.toLocaleString()}</span>
                                                </div>
                                                <div className={`h-2 rounded-full overflow-hidden ${isSelected ? 'bg-white/20' : 'bg-gray-200'}`}>
                                                    <div
                                                        className={`h-full rounded-full transition-all ${isSelected ? 'bg-white' : 'bg-gray-900'}`}
                                                        style={{ width: `${(type.count / filteredData.types[0].count) * 100}%` }}
                                                    />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Age Group Breakdown */}
                            <div className="bg-gray-50 rounded-3xl p-8">
                                <h3 className="text-xl font-bold mb-6">{sampleData.summary.AgeGroupBreakdown}</h3>
                                <div className="space-y-3">
                                    {filteredData.ages.map((age, idx) => {
                                        const isSelected = selectedAgeGroup === age.name;
                                        const isOtherSelected = selectedAgeGroup && !isSelected;

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => toggleAgeGroup(age.name)}
                                                className={`w-full text-left space-y-2 p-3 rounded-xl transition-all ${isSelected ? 'bg-gray-900 text-white ring-2 ring-gray-900 ring-offset-2' : 'hover:bg-gray-100'
                                                    }`}
                                                style={{ opacity: isOtherSelected ? 0.4 : 1 }}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium">{age.name}</span>
                                                    <span className="text-lg font-bold">{age.count.toLocaleString()}</span>
                                                </div>
                                                <div className={`h-2 rounded-full overflow-hidden ${isSelected ? 'bg-white/20' : 'bg-gray-200'}`}>
                                                    <div
                                                        className={`h-full rounded-full transition-all ${isSelected ? 'bg-white' : 'bg-gray-700'}`}
                                                        style={{ width: `${(age.count / filteredData.ages[0].count) * 100}%` }}
                                                    />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Section Distribution */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold">{sampleData.summary.SectionDistribution}</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {filteredData.sections.slice(0, 9).map((section, idx) => (
                                    <div key={idx} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                                        <div className="text-3xl font-bold mb-2">{section.count.toLocaleString()}</div>
                                        <div className="text-sm font-medium text-gray-700">{section.name}</div>
                                        <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gray-900 rounded-full transition-all"
                                                style={{ width: `${(section.count / filteredData.sections[0].count) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Chapter 4: What It Means */}
                {currentChapter === 4 && (
                    <div className="max-w-4xl mx-auto px-6 space-y-16">
                        <div className="text-center py-12">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                {chapters[4].title}
                            </p>
                            <h2 className="text-5xl font-bold">{sampleData.content.chapter4.title}</h2>
                        </div>

                        {/* Key Takeaways */}
                        <div className="space-y-6">
                            <h3 className="text-3xl font-bold">{sampleData.summary.KeyTakeaways}</h3>
                            <div className="space-y-4">
                                {sampleData.content.chapter4.keyTakeaways.map((takeaway, idx) => (
                                    <div key={idx} className={`bg-gray-50 rounded-2xl p-8 border-l-4 border-${takeaway.color}-500`}>
                                        <div className="flex items-start gap-4">
                                            <div className={`w-8 h-8 rounded-full bg-${takeaway.color}-100 flex items-center justify-center flex-shrink-0 mt-1`}>
                                                <span className={`text-${takeaway.color}-700 font-bold`}>{takeaway.number}</span>
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold mb-2">{takeaway.title}</h4>
                                                <p className="text-gray-600">{takeaway.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Looking Forward */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-3xl p-12">
                            <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                <Users size={32} />
                                {sampleData.summary.LookingForward}
                            </h3>
                            <div className="space-y-6">
                                {sampleData.content.chapter4.lookingForward.map((item, idx) => (
                                    <div key={idx} className="bg-white/10 rounded-xl p-6">
                                        <div className="text-5xl font-bold mb-2">{item.metric}</div>
                                        <p className="text-lg opacity-90">{item.description}</p>
                                    </div>
                                ))}
                                <p className="text-sm opacity-75 pt-4">
                                    {sampleData.content.chapter4.projection}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200 z-[53]">
                <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
                    <button
                        onClick={prevChapter}
                        disabled={currentChapter === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${currentChapter === 0
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-900 hover:bg-gray-100'
                            }`}
                    >
                        <ChevronLeft size={20} />
                        {sampleData.summary.Previous}
                    </button>

                    <div className="text-sm text-gray-600 font-medium">
                        {chapters[currentChapter].name}
                    </div>

                    <button
                        onClick={nextChapter}
                        disabled={currentChapter === chapters.length - 1}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${currentChapter === chapters.length - 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                            }`}
                    >
                        {sampleData.summary.Next}
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MembershipStory;