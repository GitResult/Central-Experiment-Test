import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState('clarity'); // 'clarity' or 'minimalist'
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('clickRate');
  const [expandedCampaigns, setExpandedCampaigns] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const metrics = [
    { label: 'Total Sends', value: '47,250', trend: '▲ 15%', positive: true },
    { label: 'New Subscribers', value: '142', trend: '▲ this week', positive: true },
    { label: 'Open Rate', value: '22.1%', trend: '▲ 2.3%', positive: true },
    { label: 'Click Rate', value: '4.1%', trend: '▲ 0.8%', positive: true },
    { label: 'Unsubscribe Rate', value: '0.08%', trend: '▼ 0.02%', positive: false },
  ];

  const funnelStages = [
    { label: 'Delivered', value: '47,250', percentage: 100 },
    { label: 'Opened', value: '10,442', percentage: 22.1 },
    { label: 'Clicked', value: '1,937', percentage: 4.1 },
    { label: 'Converted', value: '387', percentage: 0.82 },
  ];

  const campaigns = [
    {
      id: 1,
      name: 'Summer Conference Early Bird',
      time: 'Today 2:00 PM',
      status: 'inprogress',
      statusLabel: 'IN PROGRESS',
      quickStats: { sent: '12,450', opened: '26.6%', clicked: '4.8%' },
      detailStats: { totalSent: '12,450', opens: '3,312', clicks: '598', revenue: '$4,280' }
    },
    {
      id: 2,
      name: 'Welcome Series Step 2',
      time: 'Today 6:00 AM',
      status: 'automated',
      statusLabel: 'AUTOMATED',
      quickStats: { sent: '8,920', opened: '24.3%', clicked: '3.2%' },
      detailStats: { totalSent: '8,920', opens: '2,167', clicks: '285', conversions: '42' }
    },
    {
      id: 3,
      name: 'Monthly Newsletter June',
      time: 'Yesterday 10:00 AM',
      status: 'sent',
      statusLabel: 'SENT',
      quickStats: { sent: '15,680', opened: '19.7%', clicked: '2.1%' },
      detailStats: { totalSent: '15,680', opens: '3,089', clicks: '329', unsubscribes: '12' }
    },
  ];

  const alerts = [
    { type: 'warning', message: 'High bounce rate detected. 47 emails bounced in your last campaign.', time: '2 hours ago' },
    { type: 'info', message: '142 new subscribers this week! Consider a special welcome email.', time: '1 day ago' },
    { type: 'success', message: 'Your recent newsletter achieved a 26.6% open rate, well above average.', time: '3 days ago' },
  ];

  const upcomingCampaigns = [
    { name: 'Summer Sale Promotion', date: 'Jul 5', day: 'Fri', time: '10:00 AM', type: 'Promotional', recipients: '50,000' },
    { name: 'Monthly Product Update', date: 'Jul 12', day: 'Fri', time: '09:00 AM', type: 'Newsletter', recipients: '80,000' },
    { name: 'Back-to-School Special', date: 'Aug 1', day: 'Thu', time: '02:30 PM', type: 'Promotional', recipients: '35,000' },
  ];

  const chartData = [
    { date: 'May 12', value: 4.0 },
    { date: 'May 19', value: 5.0 },
    { date: 'May 26', value: 5.8 },
    { date: 'Jun 2', value: 6.2 },
    { date: 'Jun 9', value: 6.8 },
    { date: 'Today', value: 7.5 },
  ];

  const toggleCampaign = (id) => {
    setExpandedCampaigns(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      inprogress: { bg: 'rgba(0, 122, 255, 0.1)', text: '#007AFF' },
      automated: { bg: 'rgba(52, 199, 89, 0.1)', text: '#34C759' },
      sent: { bg: 'rgba(100, 100, 100, 0.1)', text: '#6e6e73' },
      scheduled: { bg: 'rgba(255, 149, 0, 0.1)', text: '#FF9500' },
    };
    return colors[status] || colors.sent;
  };

  const getAccentColor = () => {
    if (theme === 'minimalist') {
      return darkMode ? '#f0f0f0' : '#1d1d1f';
    }
    return darkMode ? '#55b4ff' : '#007AFF';
  };

  const getTrendColor = (positive) => {
    if (theme === 'minimalist') {
      return positive ? (darkMode ? '#66ff8c' : '#30d158') : (darkMode ? '#ff6666' : '#ff3b30');
    }
    return positive ? (darkMode ? '#66ff8c' : '#30d158') : (darkMode ? '#ffc266' : '#ff9f0a');
  };

  // Calendar generation
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#2a2a2a] text-neutral-100' : 'bg-white text-neutral-900'}`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b ${darkMode ? 'border-neutral-700' : 'border-neutral-200'}`}
              style={{ background: darkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Communications</h1>

            <div className="flex items-center gap-4">
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-neutral-700 border-neutral-600 text-neutral-100' : 'bg-white border-neutral-300 text-neutral-900'} focus:outline-none focus:ring-2`}
                style={{ focusRingColor: getAccentColor() }}
              >
                <option value="all">All Campaigns</option>
                <option value="newsletter">Newsletter</option>
                <option value="promotional">Promotional</option>
                <option value="automation">Automation</option>
              </select>

              <div className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-neutral-700 border-neutral-600' : 'bg-white border-neutral-300'} flex items-center gap-2`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <span className="text-sm">Last 30 days</span>
              </div>

              {/* Theme Toggle */}
              <div className="flex items-center gap-2">
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className={`px-3 py-2 text-sm rounded-lg border ${darkMode ? 'bg-neutral-700 border-neutral-600 text-neutral-100' : 'bg-white border-neutral-300 text-neutral-900'}`}
                >
                  <option value="clarity">Clarity</option>
                  <option value="minimalist">Minimalist</option>
                </select>

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-100 hover:bg-neutral-200'}`}
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Key Metrics */}
              <section>
                <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-neutral-100' : 'text-neutral-900'}`}>
                  Key Metrics
                </h2>
                <div className="flex flex-wrap gap-1">
                  {metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className={`flex-1 min-w-[140px] p-5 rounded-xl text-center transition-all duration-200 cursor-pointer ${
                        darkMode
                          ? 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]'
                          : 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
                      } hover:-translate-y-0.5`}
                      style={{
                        background: darkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
                        border: 'none',
                      }}
                    >
                      <div className={`text-[28px] font-bold mb-1.5 leading-tight tracking-tight`}
                           style={{ color: theme === 'minimalist' ? (darkMode ? '#f0f0f0' : '#1d1d1f') : getAccentColor() }}>
                        {metric.value}
                      </div>
                      <div className={`text-[13px] mb-0.5 ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {metric.label}
                      </div>
                      <div className={`text-xs font-medium`}
                           style={{ color: getTrendColor(metric.positive) }}>
                        {metric.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Performance Trend */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-lg font-semibold ${darkMode ? 'text-neutral-100' : 'text-neutral-900'}`}>
                    Performance Trend
                  </h2>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedMetric}
                      onChange={(e) => setSelectedMetric(e.target.value)}
                      className={`px-3 py-1 text-sm rounded-lg border ${darkMode ? 'bg-neutral-700 border-neutral-600 text-neutral-100' : 'bg-white border-neutral-300 text-neutral-900'}`}
                    >
                      <option value="clickRate">Click Rate</option>
                      <option value="openRate">Open Rate</option>
                      <option value="revenue">Revenue</option>
                      <option value="subscribers">Subscribers</option>
                    </select>
                    <select className={`px-3 py-1 text-sm rounded-lg border ${darkMode ? 'bg-neutral-700 border-neutral-600 text-neutral-100' : 'bg-white border-neutral-300 text-neutral-900'}`}>
                      <option value="7">Last 7 Days</option>
                      <option value="30">Last 30 Days</option>
                      <option value="90">Last 90 Days</option>
                    </select>
                  </div>
                </div>
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-neutral-800' : 'bg-neutral-50'}`} style={{ height: '320px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={getAccentColor()} stopOpacity={0.2}/>
                          <stop offset="100%" stopColor={getAccentColor()} stopOpacity={0.02}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="0"
                        stroke={darkMode ? '#3a3a3a' : '#e5e5e7'}
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: darkMode ? '#b0b0b0' : '#6e6e73', fontSize: 11 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: darkMode ? '#b0b0b0' : '#6e6e73', fontSize: 11 }}
                        tickFormatter={(value) => `${value}%`}
                        domain={[0, 8]}
                        ticks={[0, 2, 4, 6, 8]}
                        dx={-10}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#2a2a2a' : '#ffffff',
                          border: `1px solid ${darkMode ? '#3a3a3a' : '#e5e5e7'}`,
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                        labelStyle={{ color: darkMode ? '#f0f0f0' : '#1d1d1f' }}
                        formatter={(value) => [`${value}%`, 'Rate']}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={getAccentColor()}
                        strokeWidth={3}
                        fill="url(#colorValue)"
                        dot={{ fill: getAccentColor(), r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Email Conversion Funnel */}
              <section>
                <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-neutral-100' : 'text-neutral-900'}`}>
                  Email Conversion Funnel
                </h2>
                <div className={`p-8 rounded-2xl ${darkMode ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
                  <div className="flex items-center justify-center gap-2">
                    {funnelStages.map((stage, index) => {
                      const widths = [100, 85, 70, 65]; // Decreasing widths for funnel effect
                      const width = widths[index];
                      const nextWidth = widths[index + 1] || width;
                      const heightDiff = (100 - width) / 2;
                      const nextHeightDiff = (100 - nextWidth) / 2;

                      // Green gradient colors
                      const greenColors = darkMode
                        ? ['#ffffff', '#d4edda', '#7ec688', '#4caf50'] // Light mode greens
                        : ['#ffffff', '#d4edda', '#7ec688', '#4caf50'];

                      const textColors = darkMode
                        ? ['#1d1d1f', '#1d1d1f', '#1d1d1f', '#ffffff'] // Dark text for first 3, white for last
                        : ['#1d1d1f', '#1d1d1f', '#1d1d1f', '#ffffff'];

                      return (
                        <div
                          key={stage.label}
                          className="relative"
                          style={{
                            width: `${width * 2.5}px`,
                            height: '140px'
                          }}
                        >
                          <div
                            className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer hover:opacity-90`}
                            style={{
                              clipPath: `polygon(0 ${heightDiff}%, 100% ${nextHeightDiff}%, 100% ${100 - nextHeightDiff}%, 0 ${100 - heightDiff}%)`,
                              background: greenColors[index],
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)'
                            }}
                          >
                            <div className={`text-2xl font-bold mb-1 tracking-tight`} style={{ color: textColors[index] }}>
                              {stage.value}
                            </div>
                            <div className={`text-xs font-medium mb-0.5`} style={{ color: index === 3 ? 'rgba(255, 255, 255, 0.9)' : 'rgba(29, 29, 31, 0.7)' }}>
                              {stage.label}
                            </div>
                            <div className={`text-xs font-semibold`} style={{ color: textColors[index] }}>
                              {stage.percentage}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Recent Campaigns */}
              <section>
                <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-neutral-100' : 'text-neutral-900'}`}>
                  Recent Campaigns
                </h2>
                <div className="space-y-3">
                  {campaigns.map((campaign) => {
                    const isExpanded = expandedCampaigns.includes(campaign.id);
                    const statusColor = getStatusColor(campaign.status);

                    return (
                      <div
                        key={campaign.id}
                        className={`rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                          darkMode ? 'bg-neutral-800 hover:bg-neutral-750' : 'bg-neutral-50 hover:bg-neutral-100'
                        } hover:-translate-y-0.5`}
                        onClick={() => toggleCampaign(campaign.id)}
                      >
                        {/* Campaign Main Info */}
                        <div className="flex items-start gap-3">
                          <svg
                            className={`w-4 h-4 mt-1 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                            fill="none"
                            stroke={darkMode ? '#b0b0b0' : '#6e6e73'}
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                          <div className="flex-1">
                            <div className={`text-xs mb-1 ${darkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
                              {campaign.time}
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className={`text-base font-semibold ${darkMode ? 'text-neutral-200' : 'text-neutral-900'}`}>
                                {campaign.name}
                              </h3>
                              <span
                                className="text-[10px] font-bold px-2 py-1 rounded-lg uppercase ml-3"
                                style={{
                                  background: statusColor.bg,
                                  color: statusColor.text
                                }}
                              >
                                {campaign.statusLabel}
                              </span>
                            </div>
                            <div className={`flex gap-3 text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                              <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                {campaign.quickStats.sent} sent
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {campaign.quickStats.opened} opened
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                                </svg>
                                {campaign.quickStats.clicked} clicked
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-neutral-700' : 'border-neutral-200'}`}>
                            <div className="grid grid-cols-4 gap-4">
                              {Object.entries(campaign.detailStats).map(([key, value]) => (
                                <div
                                  key={key}
                                  className={`text-center p-3 rounded-lg ${darkMode ? 'bg-neutral-900' : 'bg-white'}`}
                                >
                                  <div className={`text-lg font-bold ${darkMode ? 'text-neutral-100' : 'text-neutral-900'}`}>
                                    {value}
                                  </div>
                                  <div className={`text-xs mt-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                                    {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <section>
                <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-neutral-100' : 'text-neutral-900'}`}>
                  Quick Actions
                </h2>
                <div className="space-y-2.5 flex flex-col">
                  <button
                    className={`w-full text-sm px-4 py-3.5 rounded-lg font-medium transition-colors flex items-center gap-2.5 ${
                      darkMode
                        ? 'bg-neutral-800 text-neutral-100 hover:bg-neutral-700'
                        : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>Create Campaign</span>
                  </button>
                  <button
                    className={`w-full text-sm px-4 py-3.5 rounded-lg font-medium transition-colors flex items-center gap-2.5 ${
                      darkMode
                        ? 'bg-neutral-800 text-neutral-100 hover:bg-neutral-700'
                        : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                    </svg>
                    <span>View All Campaigns</span>
                  </button>
                  <button
                    className={`w-full text-sm px-4 py-3.5 rounded-lg font-medium transition-colors flex items-center gap-2.5 ${
                      darkMode
                        ? 'bg-neutral-800 text-neutral-100 hover:bg-neutral-700'
                        : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                    <span>Manage Subscribers</span>
                  </button>
                </div>
              </section>

              {/* Alerts & Insights */}
              <section>
                <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-neutral-100' : 'text-neutral-900'}`}>
                  Alerts & Insights
                </h2>
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-r-lg border-l-4 ${
                        darkMode ? 'bg-neutral-800' : 'bg-white'
                      } ${
                        alert.type === 'warning'
                          ? 'border-l-[#ff9f0a]'
                          : alert.type === 'success'
                          ? 'border-l-[#30d158]'
                          : 'border-l-[#007AFF]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {alert.type === 'warning' ? (
                          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="#ff9f0a" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                          </svg>
                        ) : alert.type === 'success' ? (
                          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="#30d158" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="#007AFF" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                          </svg>
                        )}
                        <div className="flex-1">
                          <p className={`text-sm ${darkMode ? 'text-neutral-200' : 'text-neutral-900'}`}>
                            {alert.message}
                          </p>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
                            {alert.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Upcoming Campaigns with Mini Calendar */}
              <section>
                <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-neutral-100' : 'text-neutral-900'}`}>
                  Upcoming Campaigns
                </h2>
                <div className="rounded-xl">
                  {/* Mini Calendar */}
                  <div className={`p-4 border-b ${darkMode ? 'border-neutral-700' : 'border-neutral-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-sm font-semibold ${darkMode ? 'text-neutral-100' : 'text-neutral-900'}`}>
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                          className={`w-6 h-6 rounded text-xs ${darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-200 hover:bg-neutral-300'}`}
                        >
                          ‹
                        </button>
                        <button
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                          className={`w-6 h-6 rounded text-xs ${darkMode ? 'bg-neutral-700 hover:bg-neutral-600' : 'bg-neutral-200 hover:bg-neutral-300'}`}
                        >
                          ›
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className={`text-center text-xs font-medium ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          {day}
                        </div>
                      ))}
                      {getDaysInMonth(currentMonth).map((day, i) => (
                        <div
                          key={i}
                          className={`text-center text-xs py-1 rounded ${
                            day
                              ? darkMode
                                ? 'text-neutral-300 hover:bg-neutral-700'
                                : 'text-neutral-700 hover:bg-neutral-200'
                              : ''
                          }`}
                        >
                          {day || ''}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Campaign List */}
                  <div className="px-2 py-4 space-y-2">
                    {upcomingCampaigns.map((campaign, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 px-2 py-3 rounded-lg transition-opacity hover:opacity-70 ${
                          darkMode ? 'bg-neutral-900' : 'bg-white'
                        }`}
                      >
                        <div className={`text-center px-3 py-2 rounded min-w-[60px] ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
                          <div className={`text-[10px] ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            {campaign.date.split(' ')[0]}
                          </div>
                          <div className={`text-xl font-bold ${darkMode ? 'text-neutral-100' : 'text-neutral-900'}`}>
                            {campaign.date.split(' ')[1]}
                          </div>
                          <div className={`text-[10px] ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            {campaign.day}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className={`text-xs mb-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            {campaign.time} | {campaign.type}
                          </div>
                          <div className={`text-sm font-medium ${darkMode ? 'text-neutral-200' : 'text-neutral-900'}`}>
                            {campaign.name}
                          </div>
                          <div className={`text-xs mt-1 ${darkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
                            Recipients: {campaign.recipients}
                          </div>
                        </div>
                        <span
                          className="text-[10px] font-bold px-2 py-1 rounded-lg uppercase self-start"
                          style={{
                            background: getStatusColor('scheduled').bg,
                            color: getStatusColor('scheduled').text
                          }}
                        >
                          Scheduled
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
