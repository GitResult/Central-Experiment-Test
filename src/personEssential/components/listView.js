import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronDown, Clock, Users, Calendar, History, Edit3, Check, X, ExternalLink, CheckCircle2, Circle, Sparkles, Paperclip, MessageSquare, ListChecks, Send } from 'lucide-react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ListView = () => {
    const [expandedSections, setExpandedSections] = useState(['pre-launch']);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [selectedHistoryYear, setSelectedHistoryYear] = useState(null);
    const [bottomPanelOpen, setBottomPanelOpen] = useState(false);
    const [aiDraft, setAiDraft] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [newReply, setNewReply] = useState('');
    const [feeAdjustment, setFeeAdjustment] = useState(0);
    const [selectedFeeType, setSelectedFeeType] = useState('all');
    const [countChange, setCountChange] = useState(0);
    const [selectedCountType, setSelectedCountType] = useState('all');
    const [manualCountChange, setManualCountChange] = useState(false);
    const [showRevenueAnalysis, setShowRevenueAnalysis] = useState(false);
    const [focusMode, setFocusMode] = useState(false);
    const [selectedSubtask, setSelectedSubtask] = useState(null);
    const [sampleData, setSampleData] = useState(null);
    const [editedFees, setEditedFees] = useState({});
    const [taskReplies, setTaskReplies] = useState({});
    const [baseFees, setBaseFees] = useState({});
    const [memberCounts, setMemberCounts] = useState({});

    useEffect(() => {
        const loadSampleData = async () => {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/data/tasks.json`);
                if (!response.ok) {
                    throw new Error('Failed to load sample data');
                }
                const data = await response.json();
                setEditedFees(data.fees.baseFees);
                setTaskReplies(data.initialReplies);
                setBaseFees(data.fees.baseFees);
                setMemberCounts(data.fees.memberCounts);
                setSampleData(data);
            } catch (error) {
                console.error('Error loading sample data:', error);
                setSampleData(null);
            }
        };

        loadSampleData();
    }, []);


    const getStatusConfig = (status) => {
        if (sampleData && sampleData.ui && sampleData.ui.statusConfigs) {
            return sampleData.ui.statusConfigs[status] || sampleData.ui.statusConfigs['not-started'];
        }
    };

    const getPriorityBorder = (priority) => {
        if (sampleData && sampleData.ui && sampleData.ui.priorityBorders) {
            return sampleData.ui.priorityBorders[priority] || '';
        }
    };

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]);
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setShowHistory(false);
        setBottomPanelOpen(false);
        setAiDraft('');
        setFocusMode(false);
    };

    const handleEditFees = () => {
        setBottomPanelOpen(true);
    };

    const handleFeeChange = (type, value) => {
        const newFees = { ...editedFees, [type]: parseFloat(value) || 0 };
        setEditedFees(newFees);
        const oldFee = baseFees[type];
        const increase = ((newFees[type] - oldFee) / oldFee * 100).toFixed(1);
        if (newFees[type] !== oldFee) {
            setAiDraft(`${sampleData.campaign.MembershipFeesUpdated} ${type.charAt(0).toUpperCase() + type.slice(1)} ${sampleData.campaign.membership} ${newFees[type] > oldFee ? 'increased' : 'decreased'} to $${newFees[type]} (${increase > 0 ? '+' : ''}${increase}% ${sampleData.campaign.From2025}). ${sampleData.campaign.Rationale}`);
        }
    };

    const handleSaveComplete = () => {
        setCompletedTasks(prev => [...prev, 'fees']);
        setShowSuccess(true);
        setTimeout(() => { setBottomPanelOpen(false); setShowSuccess(false); }, 2000);
    };

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    const handlePostReply = () => {
        if (!newReply.trim() || !selectedTask) return;
        const reply = { id: Date.now(), author: sampleData.campaign.author, text: newReply, timestamp: 'Just now', isCurrentUser: true };
        setTaskReplies(prev => ({ ...prev, [selectedTask.id]: [...(prev[selectedTask.id] || []), reply] }));
        setNewReply('');
    };

    const handleSliderChange = (value) => {
        setFeeAdjustment(value);
        const adjustmentFactor = 1 + (value / 100);
        if (!manualCountChange) {
            const calculatedChange = value > 0 ? -Math.min(99, Math.pow(Math.abs(value) / 10, 1.3) * 1.2) : 0;
            setCountChange(Math.round(calculatedChange * 10) / 10);
        }
        const newFees = { ...editedFees };
        if (selectedFeeType === 'all') {
            Object.keys(baseFees).forEach(type => { if (type !== sampleData.campaign.lifetime) newFees[type] = Math.round(baseFees[type] * adjustmentFactor); });
        } else {
            newFees[selectedFeeType] = Math.round(baseFees[selectedFeeType] * adjustmentFactor);
        }
        setEditedFees(newFees);
        if (Math.abs(value) > 2) {
            const changeType = value > 0 ? 'increased' : 'decreased';
            const affectedTypes = selectedFeeType === 'all' ? `all ${sampleData.campaign.membership} ${sampleData.campaign.tiers}` : `${selectedFeeType} ${sampleData.campaign.membership}`;
            setAiDraft(`${sampleData.campaign.MembershipFees} ${changeType} by ${Math.abs(value)}% for ${affectedTypes}. ${sampleData.campaign.Rationale}`);
        } else {
            setAiDraft('');
        }
    };

    const handleCountChangeSlider = (value) => {
        setCountChange(value);
        setManualCountChange(true);
    };

    const getProjectedMemberCounts = () => {
        const changeFactor = 1 + (countChange / 100);
        if (selectedCountType === 'all') {
            return {
                individual: Math.max(0, Math.round(memberCounts.individual * changeFactor)),
                student: Math.max(0, Math.round(memberCounts.student * changeFactor)),
                corporate: Math.max(0, Math.round(memberCounts.corporate * changeFactor * 0.95)),
                lifetime: memberCounts.lifetime
            };
        } else {
            const result = { ...memberCounts };
            if (selectedCountType !== sampleData.campaign.lifetime) {
                result[selectedCountType] = Math.max(0, Math.round(memberCounts[selectedCountType] * changeFactor));
            }
            return result;
        }
    };

    const getRevenueData = () => {
        const projectedCounts = getProjectedMemberCounts();
        return [
            { type: sampleData.campaign.types[0], current: memberCounts.lifetime, projected: projectedCounts.lifetime, currentRevenue: baseFees.lifetime * memberCounts.lifetime, projectedRevenue: baseFees.lifetime * Math.max(0, projectedCounts.lifetime - memberCounts.lifetime) },
            { type: sampleData.campaign.types[1], current: memberCounts.student, projected: projectedCounts.student, currentRevenue: baseFees.student * memberCounts.student, projectedRevenue: editedFees.student * projectedCounts.student },
            { type: sampleData.campaign.types[2], current: memberCounts.corporate, projected: projectedCounts.corporate, currentRevenue: baseFees.corporate * memberCounts.corporate, projectedRevenue: editedFees.corporate * projectedCounts.corporate },
            { type: sampleData.campaign.types[3], current: memberCounts.individual, projected: projectedCounts.individual, currentRevenue: baseFees.individual * memberCounts.individual, projectedRevenue: editedFees.individual * projectedCounts.individual }
        ];
    };

    return (
        <div className='p-2'>
            {sampleData ? (
                <div className="bg-white flex flex-col overflow-hidden mt-2">
                    <div className="flex-1 flex overflow-hidden relative">
                        {!focusMode ? (
                            <div className="flex-1 overflow-y-auto">
                                <div className="">
                                    {sampleData.sections.map(section => (
                                        <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                            <div className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleSection(section.id)}>
                                                <div className="flex items-center gap-3 flex-1">
                                                    {expandedSections.includes(section.id) ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-gray-900">{section.title}</h3>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" />{section.dueDate}</span>
                                                            <span className="text-xs text-gray-500">{section.completion}% complete</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-24 bg-gray-100 rounded-full h-2">
                                                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${section.completion}%` }} />
                                                </div>
                                            </div>

                                            {expandedSections.includes(section.id) && (
                                                <div className="border-t border-gray-100 py-1">
                                                    {section.tasks.map((task) => (
                                                        <div key={task.id} className={`mx-2 my-1 px-4 py-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors group ${getPriorityBorder(task.priority)}`} onClick={() => handleTaskClick(task)}>
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${completedTasks.includes(task.id) || task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                                                {(completedTasks.includes(task.id) || task.completed) && <Check className="w-3 h-3 text-white" />}
                                                            </div>
                                                            {task.assignee && <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium flex-shrink-0" title={task.assignee}>{getInitials(task.assignee)}</div>}
                                                            {!task.assignee && <div className="w-6"></div>}
                                                            <span className={`flex-1 min-w-0 ${completedTasks.includes(task.id) || task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{task.title}</span>
                                                            <div className="flex items-center gap-4 flex-shrink-0">
                                                                <div className="w-6 flex items-center justify-center">{task.status && <div className={`w-2 h-2 rounded-full ${getStatusConfig(task.status).color}`} title={getStatusConfig(task.status).label} />}</div>
                                                                <div className="w-20 flex items-center justify-end">{task.dueDate && <div className="flex items-center gap-1 text-xs text-gray-500"><Calendar className="w-3.5 h-3.5" /><span>{task.dueDate.split(',')[0]}</span></div>}</div>
                                                                <div className="w-10 flex items-center justify-center">{task.subtasks && <div className="flex items-center gap-1 text-xs text-gray-500"><ListChecks className="w-3.5 h-3.5" /><span>{task.subtasks}</span></div>}</div>
                                                                <div className="w-10 flex items-center justify-center">{task.replies && <div className="flex items-center gap-1 text-xs text-gray-500"><MessageSquare className="w-3.5 h-3.5" /><span>{task.replies}</span></div>}</div>
                                                                <div className="w-10 flex items-center justify-center">{task.attachments && <div className="flex items-center gap-1 text-xs text-gray-500"><Paperclip className="w-3.5 h-3.5" /><span>{task.attachments}</span></div>}</div>
                                                                <div className="w-12 flex items-center justify-center">{task.hasHistory && <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium"><History className="w-3 h-3" />{task.historyCount}</div>}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto">
                                <div className="max-w-4xl mx-auto p-6">
                                    <div className="mb-4">
                                        <button
                                            onClick={() => { setFocusMode(false); setSelectedSubtask(null); }}
                                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-4"
                                        >
                                            <ChevronRight className="w-4 h-4 rotate-180" />
                                            {sampleData.campaign.backLinkText}
                                        </button>
                                    </div>

                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="px-6 py-4 border-b border-gray-200">
                                            <div className="flex items-center gap-3">
                                                {selectedTask.assignee && (
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium" title={selectedTask.assignee}>
                                                        {getInitials(selectedTask.assignee)}
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <h2 className="text-xl font-semibold text-gray-900">{selectedTask.title}</h2>
                                                    {selectedTask.description && <p className="text-sm text-gray-600 mt-1">{selectedTask.description}</p>}
                                                </div>
                                                {selectedTask.status && (
                                                    <div className={`w-3 h-3 rounded-full ${getStatusConfig(selectedTask.status).color}`} title={getStatusConfig(selectedTask.status).label} />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                                                {selectedTask.dueDate && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{sampleData.campaign.Due} {selectedTask.dueDate}</span>
                                                    </div>
                                                )}
                                                {selectedTask.subtasksList && (
                                                    <div className="flex items-center gap-1">
                                                        <ListChecks className="w-4 h-4" />
                                                        <span>{selectedTask.subtasksList.filter(st => st.completed).length}/{selectedTask.subtasksList.length} {sampleData.campaign.subtasksCompleted}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {selectedTask.subtasksList && selectedTask.subtasksList.length > 0 && (
                                            <div className="py-1">
                                                {selectedTask.subtasksList.map((subtask) => (
                                                    <div
                                                        key={subtask.id}
                                                        className="mx-2 my-1 px-4 py-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors group"
                                                        onClick={() => setSelectedSubtask(subtask)}
                                                    >
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${subtask.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                                            {subtask.completed && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <span className={`flex-1 min-w-0 ${subtask.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{subtask.title}</span>
                                                        <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {(selectedTask && !focusMode) && (
                            <div className="fixed right-0 w-[360px] top-16 h-[calc(100vh-4rem)] w-80 bg-white shadow-2xl z-[51] transform transition-transform duration-300 ease-out flex flex-col">
                                <div className="border-b border-gray-200 p-4 flex items-center justify-between">
                                    <h2 className="font-semibold text-gray-900">{sampleData.campaign.TaskDetails}</h2>
                                    <div className="flex items-center gap-2">
                                        {selectedTask.subtasksList && selectedTask.subtasksList.length > 0 && (
                                            <button
                                                onClick={() => setFocusMode(true)}
                                                className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                                                title={sampleData.campaign.FocusOnSubtasks}
                                            >
                                                {sampleData.campaign.Focus}
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button onClick={() => setSelectedTask(null)} className="p-1 hover:bg-gray-100 rounded transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 flex flex-col">
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-900">{selectedTask.title}</h3>
                                        {selectedTask.description && <p className="text-sm text-gray-600 mt-2">{selectedTask.description}</p>}
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        {selectedTask.assignee && <div className="flex items-center gap-2 text-sm"><Users className="w-4 h-4 text-gray-400" /><span className="text-gray-600">{sampleData.campaign.AssignedTo}</span><span className="font-medium text-gray-900">{selectedTask.assignee}</span></div>}
                                        {selectedTask.dueDate && <div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-gray-400" /><span className="text-gray-600">{sampleData.campaign.Due}</span><span className="font-medium text-gray-900">{selectedTask.dueDate}</span></div>}
                                        {selectedTask.status && <div className="flex items-center gap-2 text-sm"><div className={`w-2 h-2 rounded-full ${getStatusConfig(selectedTask.status).color}`} /><span className="text-gray-600">Status</span><span className="font-medium text-gray-900">{getStatusConfig(selectedTask.status).label}</span></div>}
                                    </div>

                                    {selectedTask.subtasksList && selectedTask.subtasksList.length > 0 && (
                                        <div className="border-t border-gray-200 pt-4 mb-6">
                                            <div className="flex items-center gap-2 mb-3"><ListChecks className="w-4 h-4 text-gray-400" /><span className="text-sm font-medium text-gray-700">Subtasks ({selectedTask.subtasksList.filter(st => st.completed).length}/{selectedTask.subtasksList.length})</span></div>
                                            <div className="space-y-2">
                                                {selectedTask.subtasksList.map(subtask => (
                                                    <div key={subtask.id} className="flex items-center gap-2 text-sm">
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${subtask.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>{subtask.completed && <Check className="w-3 h-3 text-white" />}</div>
                                                        <span className={subtask.completed ? 'text-gray-400 line-through' : 'text-gray-700'}>{subtask.title}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedTask.id === 'fees' && (
                                        <div className="border-t border-gray-200 pt-4 mb-6">
                                            <button onClick={handleEditFees} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"><Edit3 className="w-4 h-4" />{sampleData.campaign.ViewFees}</button>
                                        </div>
                                    )}

                                    {selectedTask.hasHistory && (
                                        <div className="border-t border-gray-200 pt-4 mb-6">
                                            <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"><History className="w-4 h-4" />{showHistory ? 'Hide' : 'Show'} {sampleData.campaign.history} ({selectedTask.historyCount} {sampleData.campaign.previousYears})</button>
                                            {showHistory && (
                                                <div className="mt-4 space-y-3">
                                                    {sampleData.historyData.map(year => (
                                                        <div key={year.year} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all" onClick={() => setSelectedHistoryYear(year)}>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="font-semibold text-gray-900">{year.year}</span>
                                                                <span className="text-xs text-gray-500">{year.completedDate}</span>
                                                            </div>
                                                            <p className="text-sm text-gray-700 font-medium mb-1">{year.outcome}</p>
                                                            <p className="text-xs text-gray-600">{year.conversationCount} replies</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {aiDraft && (
                                        <div className="border-t border-gray-200 pt-4 mb-6">
                                            <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-purple-500" /><span className="text-sm font-medium text-gray-700">{sampleData.campaign.AIDraft}</span></div>
                                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                                <textarea value={aiDraft} onChange={(e) => setAiDraft(e.target.value)} className="w-full text-sm text-gray-700 bg-transparent border-none focus:outline-none resize-none" rows={4} />
                                            </div>
                                            <button onClick={handleSaveComplete} className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"><CheckCircle2 className="w-4 h-4" />{sampleData.campaign.SaveComplete}</button>
                                        </div>
                                    )}

                                    <div className="flex-1" />

                                    <div className="border-t border-gray-200 pt-4">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{sampleData.campaign.Conversation}</h4>
                                        <div className="space-y-2 mb-4">
                                            {(taskReplies[selectedTask.id] || []).map(reply => (
                                                <div key={reply.id}>
                                                    {reply.isCurrentUser ? (
                                                        <div className="flex justify-end mb-1"><div style={{ maxWidth: '220px' }} className="bg-blue-500 text-white rounded-lg rounded-br px-3 py-2"><p className="text-sm">{reply.text}</p></div></div>
                                                    ) : (
                                                        <div className="flex justify-start mb-1"><div style={{ maxWidth: '220px' }} className="bg-gray-200 text-gray-900 rounded-lg rounded-bl px-3 py-2"><p className="text-sm">{reply.text}</p></div></div>
                                                    )}
                                                    <div className={`text-xs text-gray-400 mb-2 ${reply.isCurrentUser ? 'text-right pr-1' : 'text-left pl-1'}`}>{reply.author} · {reply.timestamp}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 p-3">
                                    <div className="flex gap-2">
                                        <input type="text" value={newReply} onChange={(e) => setNewReply(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePostReply(); } }} placeholder={sampleData.campaign.Type_a_message} className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                        <button onClick={handlePostReply} disabled={!newReply.trim()} className="w-9 h-9 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"><Send className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(focusMode && selectedSubtask) && (
                            <div className="fixed right-0 w-[360px] top-16 h-[calc(100vh-4rem)] w-80 bg-white shadow-2xl z-[51] transform transition-transform duration-300 ease-out flex flex-col">
                                <div className="border-b border-gray-200 p-4 flex items-center justify-between">
                                    <h2 className="font-semibold text-gray-900">{sampleData.campaign.SubtaskDetails}</h2>
                                    <button onClick={() => setSelectedSubtask(null)} className="p-1 hover:bg-gray-100 rounded transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 flex flex-col">
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-900">{selectedSubtask.title}</h3>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className={`w-3 h-3 rounded-full ${selectedSubtask.completed ? 'bg-green-500' : 'bg-gray-400'}`} />
                                            <span className="text-gray-600">Status</span>
                                            <span className="font-medium text-gray-900">{selectedSubtask.completed ? 'Completed' : 'Not Started'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">Parent Task</span>
                                            <span className="font-medium text-gray-900">{selectedTask.title}</span>
                                        </div>
                                    </div>

                                    <div className="flex-1" />

                                    <div className="border-t border-gray-200 pt-4">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{sampleData.campaign.Conversation}</h4>
                                        <p className="text-sm text-gray-500 italic">{sampleData.campaign.NoConversationYet}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 p-3">
                                    <div className="flex gap-2">
                                        <input type="text" placeholder={sampleData.campaign.Type_a_message} className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                        <button className="w-9 h-9 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center flex-shrink-0"><Send className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {bottomPanelOpen && (
                        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-2xl transition-all duration-300 z-[52]" style={{ height: '70%' }}>
                            <div className="h-full flex flex-col">
                                <div className="border-b border-gray-200 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2"><Edit3 className="w-5 h-5 text-gray-400" /><h3 className="font-semibold text-gray-900">{sampleData.campaign.MembershipFeeEditor}</h3></div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 hover:bg-gray-100 rounded transition-colors"><ExternalLink className="w-4 h-4 text-gray-400" /></button>
                                        <button onClick={() => setBottomPanelOpen(false)} className="p-2 hover:bg-gray-100 rounded transition-colors"><X className="w-4 h-4 text-gray-400" /></button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6">
                                    <div className="max-w-6xl mx-auto">
                                        <div className="mb-6 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                            <button onClick={() => setShowRevenueAnalysis(!showRevenueAnalysis)} className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors">
                                                <h4 className="text-sm font-semibold text-gray-700">{sampleData.campaign.RevenueAnalysis}</h4>
                                                {showRevenueAnalysis ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                                            </button>

                                            {showRevenueAnalysis && (
                                                <div className="p-4 border-t border-gray-200">
                                                    <ResponsiveContainer width="100%" height={250}>
                                                        <ComposedChart data={getRevenueData()}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                            <XAxis dataKey="type" stroke="#6b7280" style={{ fontSize: '12px' }} />
                                                            <YAxis yAxisId="left" stroke="#6b7280" style={{ fontSize: '12px' }} label={{ value: sampleData.campaign.Members, angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }} />
                                                            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" style={{ fontSize: '12px' }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} label={{ value: sampleData.campaign.Revenue, angle: 90, position: 'insideRight', style: { fontSize: '12px' } }} />
                                                            <Tooltip formatter={(value, name) => { if (name === sampleData.campaign.CurrentMembers2025) return [value, sampleData.campaign.CurrentMembers]; if (name === sampleData.campaign.ProjectedMembers2026) return [value, sampleData.campaign.ProjectedMembers]; if (name.includes(sampleData.campaign.Revenue)) return [`$${value.toLocaleString()}`, name]; return [value, name]; }} contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                                                            <Legend />
                                                            <Bar yAxisId="left" dataKey="current" fill="#3b82f6" name={sampleData.campaign.CurrentMembers2025} radius={[4, 4, 0, 0]} />
                                                            <Bar yAxisId="left" dataKey="projected" fill="none" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name={sampleData.campaign.ProjectedMembers2026} radius={[4, 4, 0, 0]} />
                                                            <Line yAxisId="right" type="monotone" dataKey="currentRevenue" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} name={sampleData.campaign.CurrentRevenue2025} />
                                                            <Line yAxisId="right" type="monotone" dataKey="projectedRevenue" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#10b981', r: 4 }} name={sampleData.campaign.ProjectedRevenue2025} />
                                                        </ComposedChart>
                                                    </ResponsiveContainer>

                                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                                                            <div className="text-xs text-gray-500 mb-1">{sampleData.campaign.TotalMembers}</div>
                                                            <div className="flex items-baseline gap-2">
                                                                <span className="text-2xl font-semibold text-gray-900">{Object.values(memberCounts).reduce((a, b) => a + b, 0)}</span>
                                                                <span className="text-sm text-gray-400">→</span>
                                                                <span className={`text-lg font-semibold ${Object.values(getProjectedMemberCounts()).reduce((a, b) => a + b, 0) < Object.values(memberCounts).reduce((a, b) => a + b, 0) ? 'text-red-600' : 'text-gray-900'}`}>{Object.values(getProjectedMemberCounts()).reduce((a, b) => a + b, 0)}</span>
                                                                {countChange !== 0 && <span className={`text-xs ${countChange < 0 ? 'text-red-600' : 'text-green-600'}`}>({countChange > 0 ? '+' : ''}{Object.values(getProjectedMemberCounts()).reduce((a, b) => a + b, 0) - Object.values(memberCounts).reduce((a, b) => a + b, 0)})</span>}
                                                            </div>
                                                        </div>
                                                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                                                            <div className="text-xs text-gray-500 mb-1">{sampleData.campaign.TotalRevenue}</div>
                                                            <div className="flex items-baseline gap-2">
                                                                <span className="text-2xl font-semibold text-gray-900">${((baseFees.individual * memberCounts.individual + baseFees.student * memberCounts.student + baseFees.corporate * memberCounts.corporate + baseFees.lifetime * memberCounts.lifetime) / 1000).toFixed(0)}k</span>
                                                                <span className="text-sm text-gray-400">→</span>
                                                                {(() => {
                                                                    const projected = getProjectedMemberCounts();
                                                                    const currentTotal = baseFees.individual * memberCounts.individual + baseFees.student * memberCounts.student + baseFees.corporate * memberCounts.corporate + baseFees.lifetime * memberCounts.lifetime;
                                                                    const lifetimeRevenue = baseFees.lifetime * Math.max(0, projected.lifetime - memberCounts.lifetime);
                                                                    const projectedTotal = editedFees.individual * projected.individual + editedFees.student * projected.student + editedFees.corporate * projected.corporate + lifetimeRevenue;
                                                                    const diff = projectedTotal - currentTotal;
                                                                    return (
                                                                        <>
                                                                            <span className={`text-lg font-semibold ${projectedTotal > currentTotal ? 'text-green-600' : projectedTotal < currentTotal ? 'text-red-600' : 'text-gray-900'}`}>${(projectedTotal / 1000).toFixed(0)}k</span>
                                                                            {diff !== 0 && <span className={`text-xs ${diff > 0 ? 'text-green-600' : 'text-red-600'}`}>({diff > 0 ? '+' : ''}${(diff / 1000).toFixed(1)}k)</span>}
                                                                        </>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-6 bg-blue-50 rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-4">{sampleData.campaign.QuickAdjustment}</h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <label className="text-sm text-gray-600 w-24">{sampleData.campaign.FeeChange}</label>
                                                    <select value={selectedFeeType} onChange={(e) => setSelectedFeeType(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                        <option value="all">{sampleData.campaign.AllTypes}</option>
                                                        <option value="individual">{sampleData.campaign.types[3]}</option>
                                                        <option value="student">{sampleData.campaign.types[1]}</option>
                                                        <option value="corporate">{sampleData.campaign.types[2]}</option>
                                                    </select>
                                                    <div className="flex-1 flex items-center gap-4">
                                                        <span className="text-sm text-gray-600 whitespace-nowrap">-100%</span>
                                                        <input type="range" min="-100" max="100" value={feeAdjustment} onChange={(e) => handleSliderChange(Number(e.target.value))} className="flex-1" style={{ background: `linear-gradient(to right, #ef4444 0%, #f59e0b 25%, #eab308 50%, #84cc16 75%, #22c55e 100%)` }} />
                                                        <span className="text-sm text-gray-600 whitespace-nowrap">+100%</span>
                                                    </div>
                                                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-300 min-w-[80px] text-center">
                                                        <span className={`text-lg font-semibold ${feeAdjustment > 0 ? 'text-green-600' : feeAdjustment < 0 ? 'text-red-600' : 'text-gray-900'}`}>{feeAdjustment > 0 ? '+' : ''}{feeAdjustment}%</span>
                                                    </div>
                                                    <button onClick={() => { setFeeAdjustment(0); setEditedFees({ ...baseFees }); setCountChange(0); setManualCountChange(false); setAiDraft(''); }} className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">{sampleData.campaign.Reset}</button>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <label className="text-sm text-gray-600 w-24">Count Change:</label>
                                                    <select value={selectedCountType} onChange={(e) => setSelectedCountType(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                        <option value="all">{sampleData.campaign.AllTypes}</option>
                                                        <option value="individual">{sampleData.campaign.types[3]}</option>
                                                        <option value="student">{sampleData.campaign.types[1]}</option>
                                                        <option value="corporate">{sampleData.campaign.types[2]}</option>
                                                    </select>
                                                    <div className="flex-1 flex items-center gap-4">
                                                        <span className="text-sm text-gray-600 whitespace-nowrap">-100%</span>
                                                        <input type="range" min="-100" max="100" value={countChange} onChange={(e) => handleCountChangeSlider(Number(e.target.value))} className="flex-1" />
                                                        <span className="text-sm text-gray-600 whitespace-nowrap">+100%</span>
                                                    </div>
                                                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-300 min-w-[80px] text-center">
                                                        <span className={`text-lg font-semibold ${countChange > 0 ? 'text-green-600' : countChange < 0 ? 'text-red-600' : 'text-gray-900'}`}>{countChange > 0 ? '+' : ''}{countChange}%</span>
                                                    </div>
                                                    <button onClick={() => { setManualCountChange(false); handleSliderChange(feeAdjustment); }} className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title={sampleData.campaign.ResetAutoCalculate}>{sampleData.campaign.Auto}</button>
                                                </div>
                                                {!manualCountChange && countChange !== 0 && <div className="text-xs text-gray-500 ml-28">{sampleData.campaign.AutoCalculate}</div>}
                                            </div>
                                        </div>

                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">{sampleData.campaign.MembershipType}</th>
                                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">{sampleData.campaign.Current}</th>
                                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">{sampleData.campaign.Projected}</th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">{sampleData.campaign.Fee2025}</th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">{sampleData.campaign.Fee2026}</th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">{sampleData.campaign.Change}</th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">{sampleData.campaign.Impact}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sampleData.membershipTypes.map(row => {
                                                    const projectedCounts = getProjectedMemberCounts();
                                                    const projectedMembers = projectedCounts[row.type];
                                                    const change = ((editedFees[row.type] - row.current) / row.current * 100).toFixed(1);
                                                    const currentRev = row.current * row.members;
                                                    const projectedFee = row.type === 'lifetime' ? baseFees.lifetime : editedFees[row.type];
                                                    const projectedRev = row.type === 'lifetime' ? projectedFee * Math.max(0, projectedMembers - row.members) : projectedFee * projectedMembers;
                                                    const revenueImpact = projectedRev - currentRev;
                                                    const memberLoss = row.members - projectedMembers;

                                                    return (
                                                        <tr key={row.type} className="border-b border-gray-100 hover:bg-gray-50">
                                                            <td className="py-3 px-4 text-gray-900">{row.label}</td>
                                                            <td className="py-3 px-4 text-center text-gray-600">{row.members}</td>
                                                            <td className="py-3 px-4 text-center">
                                                                <span className={memberLoss > 0 ? 'text-red-600 font-medium' : memberLoss < 0 ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                                                    {projectedMembers}
                                                                    {memberLoss !== 0 && <span className="text-xs ml-1">({memberLoss > 0 ? '-' : '+'}{Math.abs(memberLoss)})</span>}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-4 text-right text-gray-600">${row.current.toFixed(2)}</td>
                                                            <td className="py-3 px-4 text-right">
                                                                {row.locked ? (
                                                                    <span className="text-gray-400">${editedFees[row.type].toFixed(2)}</span>
                                                                ) : (
                                                                    <input type="number" value={editedFees[row.type]} onChange={(e) => handleFeeChange(row.type, e.target.value)} className="w-24 px-2 py-1 text-right border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                                )}
                                                            </td>
                                                            <td className="py-3 px-4 text-right">
                                                                {editedFees[row.type] !== row.current && !row.locked && <span className={`font-medium ${parseFloat(change) > 0 ? 'text-green-600' : 'text-red-600'}`}>{parseFloat(change) > 0 ? '+' : ''}{change}%</span>}
                                                                {(editedFees[row.type] === row.current || row.locked) && <span className="text-gray-400">—</span>}
                                                            </td>
                                                            <td className="py-3 px-4 text-right">
                                                                {Math.abs(revenueImpact) > 0 && !row.locked && <span className={`font-medium ${revenueImpact > 0 ? 'text-green-600' : 'text-red-600'}`}>{revenueImpact > 0 ? '+' : ''}${revenueImpact.toLocaleString()}</span>}
                                                                {(Math.abs(revenueImpact) === 0 || row.locked) && <span className="text-gray-400">—</span>}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                <tr className="font-semibold bg-gray-50">
                                                    <td className="py-4 px-4 text-gray-900">Total</td>
                                                    <td className="py-4 px-4 text-center text-gray-900">{Object.values(memberCounts).reduce((a, b) => a + b, 0)}</td>
                                                    <td className="py-4 px-4 text-center text-gray-900">
                                                        {(() => {
                                                            const projected = getProjectedMemberCounts();
                                                            const total = Object.values(projected).reduce((a, b) => a + b, 0);
                                                            const change = total - Object.values(memberCounts).reduce((a, b) => a + b, 0);
                                                            return (
                                                                <span className={change < 0 ? 'text-red-600' : change > 0 ? 'text-green-600' : 'text-gray-900'}>
                                                                    {total}
                                                                    {change !== 0 && <span className="text-xs ml-1">({change > 0 ? '+' : ''}{change})</span>}
                                                                </span>
                                                            );
                                                        })()}
                                                    </td>
                                                    <td className="py-4 px-4 text-right text-gray-900">${(baseFees.individual * memberCounts.individual + baseFees.student * memberCounts.student + baseFees.corporate * memberCounts.corporate + baseFees.lifetime * memberCounts.lifetime).toLocaleString()}</td>
                                                    <td className="py-4 px-4 text-right text-gray-900">
                                                        ${(() => {
                                                            const projected = getProjectedMemberCounts();
                                                            const lifetimeRevenue = baseFees.lifetime * Math.max(0, projected.lifetime - memberCounts.lifetime);
                                                            return (editedFees.individual * projected.individual + editedFees.student * projected.student + editedFees.corporate * projected.corporate + lifetimeRevenue).toLocaleString();
                                                        })()}
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        {(() => {
                                                            const projected = getProjectedMemberCounts();
                                                            const currentTotal = baseFees.individual * memberCounts.individual + baseFees.student * memberCounts.student + baseFees.corporate * memberCounts.corporate + baseFees.lifetime * memberCounts.lifetime;
                                                            const lifetimeRevenue = baseFees.lifetime * Math.max(0, projected.lifetime - memberCounts.lifetime);
                                                            const projectedTotal = editedFees.individual * projected.individual + editedFees.student * projected.student + editedFees.corporate * projected.corporate + lifetimeRevenue;
                                                            const totalChange = ((projectedTotal - currentTotal) / currentTotal * 100).toFixed(1);
                                                            return Math.abs(projectedTotal - currentTotal) > 0 ? <span className={`font-medium ${parseFloat(totalChange) > 0 ? 'text-green-600' : 'text-red-600'}`}>{parseFloat(totalChange) > 0 ? '+' : ''}{totalChange}%</span> : <span className="text-gray-400">—</span>;
                                                        })()}
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        {(() => {
                                                            const projected = getProjectedMemberCounts();
                                                            const currentTotal = baseFees.individual * memberCounts.individual + baseFees.student * memberCounts.student + baseFees.corporate * memberCounts.corporate + baseFees.lifetime * memberCounts.lifetime;
                                                            const lifetimeRevenue = baseFees.lifetime * Math.max(0, projected.lifetime - memberCounts.lifetime);
                                                            const projectedTotal = editedFees.individual * projected.individual + editedFees.student * projected.student + editedFees.corporate * projected.corporate + lifetimeRevenue;
                                                            const impact = projectedTotal - currentTotal;
                                                            return Math.abs(impact) > 0 ? <span className={`font-medium ${impact > 0 ? 'text-green-600' : 'text-red-600'}`}>{impact > 0 ? '+' : ''}${impact.toLocaleString()}</span> : <span className="text-gray-400">—</span>;
                                                        })()}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedHistoryYear && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
                            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                                <div className="border-b border-gray-200 p-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">{selectedHistoryYear.year} {sampleData.campaign.Campaign}</h2>
                                        <p className="text-sm text-gray-500 mt-1">Completed {selectedHistoryYear.completedDate}</p>
                                    </div>
                                    <button onClick={() => setSelectedHistoryYear(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
                                </div>
                                <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)] space-y-6">
                                    <div><h3 className="text-sm font-semibold text-gray-700 mb-2">{sampleData.campaign.Outcome}</h3><p className="text-gray-900">{selectedHistoryYear.outcome}</p></div>
                                    <div><h3 className="text-sm font-semibold text-gray-700 mb-2">{sampleData.campaign.KeyDecision}</h3><p className="text-gray-700 italic">"{selectedHistoryYear.decision}"</p></div>
                                    <div><h3 className="text-sm font-semibold text-gray-700 mb-2">{sampleData.campaign.AssignedTo}</h3><p className="text-gray-900">{selectedHistoryYear.assignee}</p></div>
                                    {selectedHistoryYear.changes && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Fee Changes</h3>
                                            <div className="space-y-2">
                                                {Object.entries(selectedHistoryYear.changes).map(([type, data]) => (
                                                    <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <span className="font-medium text-gray-900 capitalize">{type}</span>
                                                        <div className="text-right">
                                                            {data.new ? <span className="text-green-600 font-medium">New tier: ${data.to}</span> : <span className="text-gray-600">${data.from.toFixed(2)} → <span className="font-medium text-gray-900">${data.to.toFixed(2)}</span></span>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div><h3 className="text-sm font-semibold text-gray-700 mb-2">{sampleData.campaign.Conversation}</h3><p className="text-gray-600">{selectedHistoryYear.conversationCount} {sampleData.campaign.RepliesInDiscussionThread}</p></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {showSuccess && (
                        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-medium">{sampleData.campaign.TaskCompletedSuccessfully}</span>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default ListView;