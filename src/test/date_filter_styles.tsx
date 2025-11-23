import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const MemberRenewalFilters = () => {
  const [activeStyle, setActiveStyle] = useState(1);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = ['2023', '2024', '2025'];
  
  // Extended years for Month Grid (2010-2030)
  const extendedYears = Array.from({ length: 21 }, (_, i) => (2010 + i).toString());

  // Style 1: Airbnb-inspired Circular Range Selector
  const Style1 = () => {
    const [fromMonth, setFromMonth] = useState(0);
    const [fromYear, setFromYear] = useState('2024');
    const [toMonth, setToMonth] = useState(5);
    const [toYear, setToYear] = useState('2025');

    return (
      <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">Member Renewal Period</h3>
        
        <div className="flex items-center justify-center gap-12 mb-8">
          {/* From Date */}
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-3">From</div>
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center">
                  <select 
                    value={fromMonth}
                    onChange={(e) => setFromMonth(Number(e.target.value))}
                    className="text-lg font-bold border-none bg-transparent text-center appearance-none cursor-pointer text-gray-800"
                  >
                    {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                  </select>
                  <select 
                    value={fromYear}
                    onChange={(e) => setFromYear(e.target.value)}
                    className="text-sm text-gray-600 border-none bg-transparent text-center appearance-none cursor-pointer"
                  >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="text-2xl text-gray-400">→</div>

          {/* To Date */}
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-3">To</div>
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center">
                  <select 
                    value={toMonth}
                    onChange={(e) => setToMonth(Number(e.target.value))}
                    className="text-lg font-bold border-none bg-transparent text-center appearance-none cursor-pointer text-gray-800"
                  >
                    {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                  </select>
                  <select 
                    value={toYear}
                    onChange={(e) => setToYear(e.target.value)}
                    className="text-sm text-gray-600 border-none bg-transparent text-center appearance-none cursor-pointer"
                  >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600">
          {months[fromMonth]} {fromYear} - {months[toMonth]} {toYear}
        </div>
      </div>
    );
  };

  // Style 2: Minimalist Dropdown Pills
  const Style2 = () => {
    const [fromMonth, setFromMonth] = useState('Jan');
    const [fromYear, setFromYear] = useState('2024');
    const [toMonth, setToMonth] = useState('Jun');
    const [toYear, setToYear] = useState('2025');

    return (
      <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">Renewal Period</h3>
        
        <div className="flex items-center justify-center gap-4">
          <div className="flex gap-2">
            <select 
              value={fromMonth}
              onChange={(e) => setFromMonth(e.target.value)}
              className="px-4 py-2 rounded-full border-2 border-gray-300 bg-white text-sm font-medium focus:border-blue-500 focus:outline-none cursor-pointer hover:border-blue-400 transition-colors text-gray-700"
            >
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select 
              value={fromYear}
              onChange={(e) => setFromYear(e.target.value)}
              className="px-4 py-2 rounded-full border-2 border-gray-300 bg-white text-sm font-medium focus:border-blue-500 focus:outline-none cursor-pointer hover:border-blue-400 transition-colors text-gray-700"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="w-8 h-0.5 bg-gray-400"></div>

          <div className="flex gap-2">
            <select 
              value={toMonth}
              onChange={(e) => setToMonth(e.target.value)}
              className="px-4 py-2 rounded-full border-2 border-gray-300 bg-white text-sm font-medium focus:border-blue-500 focus:outline-none cursor-pointer hover:border-blue-400 transition-colors text-gray-700"
            >
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select 
              value={toYear}
              onChange={(e) => setToYear(e.target.value)}
              className="px-4 py-2 rounded-full border-2 border-gray-300 bg-white text-sm font-medium focus:border-blue-500 focus:outline-none cursor-pointer hover:border-blue-400 transition-colors text-gray-700"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>
    );
  };

  // Style 3: Card-based Month Grid with Year Navigation
  const Style3 = () => {
    const [fromMonth, setFromMonth] = useState(null);
    const [fromYear, setFromYear] = useState(null);
    const [toMonth, setToMonth] = useState(null);
    const [toYear, setToYear] = useState(null);
    const [viewYear, setViewYear] = useState('2024');
    const [selectionState, setSelectionState] = useState('none'); // none, start, complete
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [viewMode, setViewMode] = useState('month'); // day, week, month, quarter, year
    
    // Day selection states
    const [fromDay, setFromDay] = useState(null);
    const [toDay, setToDay] = useState(null);
    const [viewMonth1, setViewMonth1] = useState(new Date().getMonth());
    const [viewYear1, setViewYear1] = useState(new Date().getFullYear());
    const [viewMonth2, setViewMonth2] = useState(new Date().getMonth() + 1);
    const [viewYear2, setViewYear2] = useState(new Date().getFullYear());
    const [showYearDropdown1, setShowYearDropdown1] = useState(false);
    const [showYearDropdown2, setShowYearDropdown2] = useState(false);
    
    // Quarter selection states
    const [fromQuarter, setFromQuarter] = useState(null);
    const [fromQuarterYear, setFromQuarterYear] = useState(null);
    const [toQuarter, setToQuarter] = useState(null);
    const [toQuarterYear, setToQuarterYear] = useState(null);
    const [quarterViewStartYear, setQuarterViewStartYear] = useState('2024');
    
    // Year selection states
    const [fromYearOnly, setFromYearOnly] = useState(null);
    const [toYearOnly, setToYearOnly] = useState(null);
    const [yearDecadeStart, setYearDecadeStart] = useState('2021');
    const [showMonthYearDropdown, setShowMonthYearDropdown] = useState(false);

    // Week selection states
    const [fromWeek, setFromWeek] = useState(null);
    const [toWeek, setToWeek] = useState(null);
    const [weekViewYear, setWeekViewYear] = useState('2024');
    const [weekViewQuarter, setWeekViewQuarter] = useState(1); // Start with Q1
    const [showWeekYearDropdown, setShowWeekYearDropdown] = useState(false);

    const handlePrevYear = () => {
      const idx = extendedYears.indexOf(viewYear);
      if (idx > 0) setViewYear(extendedYears[idx - 1]);
    };

    const handleNextYear = () => {
      const idx = extendedYears.indexOf(viewYear);
      if (idx < extendedYears.length - 1) setViewYear(extendedYears[idx + 1]);
    };

    const handleYearClick = () => {
      setShowYearPicker(!showYearPicker);
    };

    const handleYearSelect = (year) => {
      setViewYear(year);
      setShowYearPicker(false);
    };

    const getCurrentYearGroup = () => {
      const currentIdx = extendedYears.indexOf(viewYear);
      const groupStart = Math.floor(currentIdx / 8) * 8;
      return extendedYears.slice(groupStart, groupStart + 8);
    };

    const canGoPrevYearGroup = () => {
      const currentIdx = extendedYears.indexOf(viewYear);
      return currentIdx >= 8;
    };

    const canGoNextYearGroup = () => {
      const currentIdx = extendedYears.indexOf(viewYear);
      return currentIdx < extendedYears.length - 8;
    };

    const handlePrevYearGroup = () => {
      const currentIdx = extendedYears.indexOf(viewYear);
      const newIdx = Math.max(0, currentIdx - 8);
      setViewYear(extendedYears[newIdx]);
    };

    const handleNextYearGroup = () => {
      const currentIdx = extendedYears.indexOf(viewYear);
      const newIdx = Math.min(extendedYears.length - 1, currentIdx + 8);
      setViewYear(extendedYears[newIdx]);
    };

    const getYearRangeLabel = () => {
      const yearGroup = getCurrentYearGroup();
      return `${yearGroup[0]} - ${yearGroup[yearGroup.length - 1]}`;
    };

    const formatDateRange = () => {
      if (viewMode === 'day') {
        if (fromDay && toDay) {
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          return `${monthNames[fromDay.month]} ${String(fromDay.day).padStart(2, '0')}, ${fromDay.year} to ${monthNames[toDay.month]} ${String(toDay.day).padStart(2, '0')}, ${toDay.year}`;
        } else if (fromDay) {
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          return `${monthNames[fromDay.month]} ${String(fromDay.day).padStart(2, '0')}, ${fromDay.year} - Select end date`;
        }
        return 'Select start date';
      } else if (viewMode === 'week') {
        if (fromWeek && toWeek) {
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          return `${monthNames[fromWeek.startMonth]} ${String(fromWeek.startDay).padStart(2, '0')}, ${fromWeek.year} to ${monthNames[toWeek.endMonth]} ${String(toWeek.endDay).padStart(2, '0')}, ${toWeek.year}`;
        } else if (fromWeek) {
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          return `${monthNames[fromWeek.startMonth]} ${String(fromWeek.startDay).padStart(2, '0')}, ${fromWeek.year} - Select end week`;
        }
        return 'Select start week';
      } else if (viewMode === 'month') {
        if (fromYear && fromMonth !== null && toYear && toMonth !== null) {
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          const fromDate = new Date(parseInt(fromYear), fromMonth, 1);
          const toDate = new Date(parseInt(toYear), toMonth + 1, 0);
          return `${monthNames[fromMonth]} ${String(fromDate.getDate()).padStart(2, '0')}, ${fromYear} to ${monthNames[toMonth]} ${String(toDate.getDate()).padStart(2, '0')}, ${toYear}`;
        } else if (fromYear && fromMonth !== null) {
          return `${months[fromMonth]} 01, ${fromYear} - Select end date`;
        }
        return 'Select start date';
      } else if (viewMode === 'quarter') {
        if (fromQuarter !== null && toQuarter !== null) {
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          
          // Q1: Jan-Mar, Q2: Apr-Jun, Q3: Jul-Sep, Q4: Oct-Dec
          const fromMonthIdx = (fromQuarter - 1) * 3;
          const toMonthIdx = (toQuarter - 1) * 3 + 2;
          
          const fromDate = new Date(parseInt(fromQuarterYear), fromMonthIdx, 1);
          const toDate = new Date(parseInt(toQuarterYear), toMonthIdx + 1, 0);
          
          return `${monthNames[fromMonthIdx]} ${String(fromDate.getDate()).padStart(2, '0')}, ${fromQuarterYear} to ${monthNames[toMonthIdx]} ${String(toDate.getDate()).padStart(2, '0')}, ${toQuarterYear}`;
        } else if (fromQuarter !== null) {
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          const fromMonthIdx = (fromQuarter - 1) * 3;
          return `${monthNames[fromMonthIdx]} 01, ${fromQuarterYear} - Select end quarter`;
        }
        return 'Select start quarter';
      } else if (viewMode === 'year') {
        if (fromYearOnly && toYearOnly) {
          return `January 01, ${fromYearOnly} to December 31, ${toYearOnly}`;
        } else if (fromYearOnly) {
          return `${fromYearOnly} - Select end year`;
        }
        return 'Select start year';
      }
      return 'Select start date';
    };

    const isInRange = (monthIdx, year) => {
      if (!fromYear || !toYear || fromMonth === null || toMonth === null) return false;
      const fromDate = new Date(parseInt(fromYear), fromMonth);
      const toDate = new Date(parseInt(toYear), toMonth);
      const currentDate = new Date(parseInt(year), monthIdx);
      return currentDate >= fromDate && currentDate <= toDate;
    };

    const isStartPoint = (monthIdx, year) => {
      return monthIdx === fromMonth && year === fromYear;
    };

    const isEndPoint = (monthIdx, year) => {
      return monthIdx === toMonth && year === toYear;
    };

    const handleMonthClick = (monthIdx) => {
      const clickedYear = viewYear;
      
      if (selectionState === 'none') {
        setFromMonth(monthIdx);
        setFromYear(clickedYear);
        setToMonth(null);
        setToYear(null);
        setSelectionState('start');
      } else if (selectionState === 'start') {
        const startDate = new Date(parseInt(fromYear), fromMonth);
        const clickedDate = new Date(parseInt(clickedYear), monthIdx);
        
        if (clickedDate >= startDate) {
          setToMonth(monthIdx);
          setToYear(clickedYear);
          setSelectionState('complete');
        } else {
          setFromMonth(monthIdx);
          setFromYear(clickedYear);
        }
      } else {
        setFromMonth(monthIdx);
        setFromYear(clickedYear);
        setToMonth(null);
        setToYear(null);
        setSelectionState('start');
      }
    };

    const handleQuickSelect = (monthsToAdd) => {
      if (fromYear && fromMonth !== null) {
        const startDate = new Date(parseInt(fromYear), fromMonth);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + monthsToAdd);
        
        setToMonth(endDate.getMonth());
        setToYear(endDate.getFullYear().toString());
        setSelectionState('complete');
      }
    };

    const handleClear = () => {
      setFromMonth(null);
      setFromYear(null);
      setToMonth(null);
      setToYear(null);
      setFromDay(null);
      setToDay(null);
      setFromQuarter(null);
      setFromQuarterYear(null);
      setToQuarter(null);
      setToQuarterYear(null);
      setFromYearOnly(null);
      setToYearOnly(null);
      setFromWeek(null);
      setToWeek(null);
      setSelectionState('none');
    };

    const handleViewModeChange = (mode) => {
      setViewMode(mode);
      handleClear();
    };

    // Week helper functions
    const getWeeksInYear = (year) => {
      const weeks = [];
      const jan1 = new Date(year, 0, 1);
      
      // Find first Monday on or before Jan 1
      let currentDate = new Date(jan1);
      const dayOfWeek = currentDate.getDay();
      const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      currentDate.setDate(currentDate.getDate() + daysToMonday);
      
      let weekNum = 1;
      
      // Generate 52 weeks
      for (let i = 0; i < 52; i++) {
        const monday = new Date(currentDate);
        const sunday = new Date(currentDate);
        sunday.setDate(sunday.getDate() + 6);
        
        weeks.push({
          weekNum: weekNum,
          year: year,
          startDay: monday.getDate(),
          startMonth: monday.getMonth(),
          startYear: monday.getFullYear(),
          endDay: sunday.getDate(),
          endMonth: sunday.getMonth(),
          endYear: sunday.getFullYear()
        });
        
        currentDate.setDate(currentDate.getDate() + 7);
        weekNum++;
      }
      
      return weeks;
    };

    const handleWeekClick = (week) => {
      if (selectionState === 'none') {
        setFromWeek(week);
        setToWeek(null);
        setSelectionState('start');
      } else if (selectionState === 'start') {
        const fromVal = parseInt(fromWeek.year) * 53 + fromWeek.weekNum;
        const toVal = parseInt(week.year) * 53 + week.weekNum;
        
        if (toVal >= fromVal) {
          setToWeek(week);
          setSelectionState('complete');
        } else {
          setFromWeek(week);
        }
      } else {
        setFromWeek(week);
        setToWeek(null);
        setSelectionState('start');
      }
    };

    const isWeekInRange = (week) => {
      if (!fromWeek || !toWeek) return false;
      const fromVal = parseInt(fromWeek.year) * 53 + fromWeek.weekNum;
      const toVal = parseInt(toWeek.year) * 53 + toWeek.weekNum;
      const currentVal = parseInt(week.year) * 53 + week.weekNum;
      return currentVal >= fromVal && currentVal <= toVal;
    };

    const isWeekStart = (week) => {
      return fromWeek && fromWeek.weekNum === week.weekNum && fromWeek.year === week.year;
    };

    const isWeekEnd = (week) => {
      return toWeek && toWeek.weekNum === week.weekNum && toWeek.year === week.year;
    };

    const handlePrevWeekYear = () => {
      if (weekViewQuarter === 3) {
        setWeekViewQuarter(1);
      } else {
        const idx = extendedYears.indexOf(weekViewYear);
        if (idx > 0) {
          setWeekViewYear(extendedYears[idx - 1]);
          setWeekViewQuarter(3);
        }
      }
    };

    const handleNextWeekYear = () => {
      if (weekViewQuarter === 1) {
        setWeekViewQuarter(3);
      } else {
        const idx = extendedYears.indexOf(weekViewYear);
        if (idx < extendedYears.length - 1) {
          setWeekViewYear(extendedYears[idx + 1]);
          setWeekViewQuarter(1);
        }
      }
    };

    const getWeeksForQuarters = (year, startQuarter) => {
      const allWeeks = getWeeksInYear(parseInt(year));
      
      // Each quarter is approximately 13 weeks
      // Q1-Q2: weeks 1-26, Q3-Q4: weeks 27-52
      if (startQuarter === 1) {
        return allWeeks.slice(0, 26);
      } else {
        return allWeeks.slice(26, 52);
      }
    };

    const handleQuickSelectWeeks = (weeksToAdd) => {
      if (fromWeek) {
        const year1Weeks = getWeeksInYear(parseInt(weekViewYear));
        const year2Weeks = getWeeksInYear(parseInt(weekViewYear) + 1);
        const allWeeks = [...year1Weeks, ...year2Weeks];
        
        const fromIdx = allWeeks.findIndex(w => 
          w.weekNum === fromWeek.weekNum && 
          w.year === fromWeek.year
        );
        
        if (fromIdx !== -1 && fromIdx + weeksToAdd < allWeeks.length) {
          setToWeek(allWeeks[fromIdx + weeksToAdd]);
          setSelectionState('complete');
        }
      }
    };

    // Day calendar functions
    const getDaysInMonth = (month, year) => {
      return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
      return new Date(year, month, 1).getDay();
    };

    const handleDayClick = (day, month, year) => {
      if (selectionState === 'none') {
        setFromDay({ day, month, year });
        setToDay(null);
        setSelectionState('start');
      } else if (selectionState === 'start') {
        const startDate = new Date(fromDay.year, fromDay.month, fromDay.day);
        const clickedDate = new Date(year, month, day);
        
        if (clickedDate >= startDate) {
          setToDay({ day, month, year });
          setSelectionState('complete');
        } else {
          setFromDay({ day, month, year });
        }
      } else {
        setFromDay({ day, month, year });
        setToDay(null);
        setSelectionState('start');
      }
    };

    const isDayInRange = (day, month, year) => {
      if (!fromDay || !toDay) return false;
      const currentDate = new Date(year, month, day);
      const startDate = new Date(fromDay.year, fromDay.month, fromDay.day);
      const endDate = new Date(toDay.year, toDay.month, toDay.day);
      return currentDate >= startDate && currentDate <= endDate;
    };

    const isDayStart = (day, month, year) => {
      return fromDay && fromDay.day === day && fromDay.month === month && fromDay.year === year;
    };

    const isDayEnd = (day, month, year) => {
      return toDay && toDay.day === day && toDay.month === month && toDay.year === year;
    };

    const renderCalendar = (month, year, isFirst) => {
      const daysInMonth = getDaysInMonth(month, year);
      const firstDay = getFirstDayOfMonth(month, year);
      const days = [];
      
      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-8"></div>);
      }
      
      for (let day = 1; day <= daysInMonth; day++) {
        const isInRange = isDayInRange(day, month, year);
        const isStart = isDayStart(day, month, year);
        const isEnd = isDayEnd(day, month, year);
        
        days.push(
          <button
            key={day}
            onClick={() => handleDayClick(day, month, year)}
            className={`
              h-8 rounded-lg text-xs font-medium transition-all
              ${isInRange ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}
              ${isStart || isEnd ? 'ring-2 ring-blue-600 ring-offset-1' : ''}
            `}
          >
            {day}
          </button>
        );
      }
      
      return (
        <div className="flex-1">
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-xs text-gray-500 text-center font-medium h-6 flex items-center justify-center">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days}
          </div>
        </div>
      );
    };

    const handlePrevMonth1 = () => {
      if (viewMonth1 === 0) {
        setViewMonth1(11);
        setViewYear1(viewYear1 - 1);
        setViewMonth2(0);
        setViewYear2(viewYear1);
      } else {
        setViewMonth1(viewMonth1 - 1);
        setViewMonth2(viewMonth1);
        setViewYear2(viewYear1);
      }
    };

    const handleNextMonth2 = () => {
      if (viewMonth2 === 11) {
        setViewMonth2(0);
        setViewYear2(viewYear2 + 1);
        setViewMonth1(11);
        setViewYear1(viewYear2);
      } else {
        setViewMonth2(viewMonth2 + 1);
        setViewMonth1(viewMonth2);
        setViewYear1(viewYear2);
      }
    };

    const handleQuickSelectDays = (daysToAdd) => {
      if (fromDay) {
        const startDate = new Date(fromDay.year, fromDay.month, fromDay.day);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + daysToAdd);
        
        setToDay({
          day: endDate.getDate(),
          month: endDate.getMonth(),
          year: endDate.getFullYear()
        });
        setSelectionState('complete');
      }
    };

    const handleYearChange1 = (direction) => {
      if (direction === 'prev') {
        setViewYear1(viewYear1 - 1);
      } else {
        setViewYear1(viewYear1 + 1);
      }
    };

    const handleYearChange2 = (direction) => {
      if (direction === 'prev') {
        setViewYear2(viewYear2 - 1);
      } else {
        setViewYear2(viewYear2 + 1);
      }
    };

    const handleYearSelect1 = (year) => {
      setViewYear1(parseInt(year));
      setShowYearDropdown1(false);
    };

    const handleYearSelect2 = (year) => {
      setViewYear2(parseInt(year));
      setShowYearDropdown2(false);
    };

    const getYearOptions = () => {
      return Array.from({ length: 21 }, (_, i) => 2010 + i);
    };

    const scrollToYear = (year, dropdownElement) => {
      if (dropdownElement) {
        const yearButton = dropdownElement.querySelector(`[data-year="${year}"]`);
        if (yearButton) {
          yearButton.scrollIntoView({ block: 'center', behavior: 'instant' });
        }
      }
    };

    // Quarter functions
    const handleQuarterClick = (quarter, year) => {
      if (selectionState === 'none') {
        setFromQuarter(quarter);
        setFromQuarterYear(year);
        setToQuarter(null);
        setToQuarterYear(null);
        setSelectionState('start');
      } else if (selectionState === 'start') {
        const startVal = parseInt(fromQuarterYear) * 4 + fromQuarter;
        const clickedVal = parseInt(year) * 4 + quarter;
        
        if (clickedVal >= startVal) {
          setToQuarter(quarter);
          setToQuarterYear(year);
          setSelectionState('complete');
        } else {
          setFromQuarter(quarter);
          setFromQuarterYear(year);
        }
      } else {
        setFromQuarter(quarter);
        setFromQuarterYear(year);
        setToQuarter(null);
        setToQuarterYear(null);
        setSelectionState('start');
      }
    };

    const isQuarterInRange = (quarter, year) => {
      if (fromQuarter === null || toQuarter === null) return false;
      const currentVal = parseInt(year) * 4 + quarter;
      const startVal = parseInt(fromQuarterYear) * 4 + fromQuarter;
      const endVal = parseInt(toQuarterYear) * 4 + toQuarter;
      return currentVal >= startVal && currentVal <= endVal;
    };

    const isQuarterStart = (quarter, year) => {
      return quarter === fromQuarter && year === fromQuarterYear;
    };

    const isQuarterEnd = (quarter, year) => {
      return quarter === toQuarter && year === toQuarterYear;
    };

    const handlePrevQuarterYear = () => {
      const currentYear = parseInt(quarterViewStartYear);
      if (currentYear > 2010) {
        setQuarterViewStartYear((currentYear - 4).toString());
      }
    };

    const handleNextQuarterYear = () => {
      const currentYear = parseInt(quarterViewStartYear);
      if (currentYear < 2027) {
        setQuarterViewStartYear((currentYear + 4).toString());
      }
    };

    const handleQuickSelectQuarters = (quartersToAdd) => {
      if (fromQuarter !== null && fromQuarterYear) {
        const fromVal = parseInt(fromQuarterYear) * 4 + fromQuarter;
        const toVal = fromVal + quartersToAdd;
        
        const toYear = Math.floor((toVal - 1) / 4);
        const toQ = ((toVal - 1) % 4) + 1;
        
        setToQuarter(toQ);
        setToQuarterYear(toYear.toString());
        setSelectionState('complete');
      }
    };

    // Year selection functions
    const handleYearOnlyClick = (year) => {
      if (selectionState === 'none') {
        setFromYearOnly(year);
        setToYearOnly(null);
        setSelectionState('start');
      } else if (selectionState === 'start') {
        if (parseInt(year) >= parseInt(fromYearOnly)) {
          setToYearOnly(year);
          setSelectionState('complete');
        } else {
          setFromYearOnly(year);
        }
      } else {
        setFromYearOnly(year);
        setToYearOnly(null);
        setSelectionState('start');
      }
    };

    const isYearInRange = (year) => {
      if (!fromYearOnly || !toYearOnly) return false;
      return parseInt(year) >= parseInt(fromYearOnly) && parseInt(year) <= parseInt(toYearOnly);
    };

    const isYearStart = (year) => {
      return year === fromYearOnly;
    };

    const isYearEnd = (year) => {
      return year === toYearOnly;
    };

    const getDecadeYears = () => {
      const startYear = parseInt(yearDecadeStart);
      return Array.from({ length: 10 }, (_, i) => (startYear + i).toString());
    };

    const handlePrevDecade = () => {
      const currentStart = parseInt(yearDecadeStart);
      if (currentStart > 2010) {
        setYearDecadeStart((currentStart - 10).toString());
      }
    };

    const handleNextDecade = () => {
      const currentStart = parseInt(yearDecadeStart);
      if (currentStart < 2021) {
        setYearDecadeStart((currentStart + 10).toString());
      }
    };

    const getDecadeLabel = () => {
      const start = parseInt(yearDecadeStart);
      return `${start} - ${start + 9}`;
    };

    const handleQuickSelectYears = (yearsToAdd) => {
      if (fromYearOnly) {
        const toYear = (parseInt(fromYearOnly) + yearsToAdd).toString();
        if (extendedYears.includes(toYear)) {
          setToYearOnly(toYear);
          setSelectionState('complete');
        }
      }
    };

    const handleWeekYearSelect = (year) => {
      setWeekViewYear(year);
      setShowWeekYearDropdown(false);
    };

    const handleMonthYearSelect = (year) => {
      setViewYear(year);
      setShowMonthYearDropdown(false);
    };

    return (
      <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Select date range</h3>
          {(fromMonth !== null || toMonth !== null || fromDay || toDay || fromQuarter !== null || fromYearOnly || fromWeek) && (
            <button
              onClick={handleClear}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* View Mode Selector */}
        <div className="flex gap-2 mb-6 justify-center">
          {['day', 'week', 'month', 'quarter', 'year'].map((mode) => (
            <button
              key={mode}
              onClick={() => handleViewModeChange(mode)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize
                ${viewMode === mode 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {mode}
            </button>
          ))}
        </div>
        
        {/* DAY VIEW */}
        {viewMode === 'day' && (
          <>
            <div className="mb-3 text-sm text-gray-500 text-center">
              {selectionState === 'none' && 'Click to select start date'}
              {selectionState === 'start' && 'Click to select end date'}
              {selectionState === 'complete' && 'Click any day to reset and start new selection'}
            </div>

            <div className="flex gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2 px-1">
                  <button onClick={handlePrevMonth1} className="p-1 hover:bg-gray-100 rounded">
                    <ChevronLeft size={18} className="text-gray-700" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowYearDropdown1(!showYearDropdown1);
                        setShowYearDropdown2(false);
                      }}
                      className="text-center font-semibold text-sm text-gray-800 px-3 py-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                    >
                      {months[viewMonth1]} {viewYear1}
                    </button>
                    {showYearDropdown1 && (
                      <div 
                        className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-xl z-50 w-32"
                        onClick={(e) => e.stopPropagation()}
                        ref={(el) => {
                          if (el) scrollToYear(viewYear1, el);
                        }}
                      >
                        <div className="max-h-48 overflow-y-auto py-1">
                          {getYearOptions().map((year) => (
                            <button
                              key={year}
                              data-year={year}
                              onClick={() => handleYearSelect1(year)}
                              className={`
                                block w-full px-4 py-2 text-sm text-left hover:bg-blue-50 transition-colors
                                ${year === viewYear1 ? 'bg-blue-500 text-white font-semibold' : 'text-gray-700'}
                              `}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-7"></div>
                </div>
                {renderCalendar(viewMonth1, viewYear1, true)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="w-7"></div>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowYearDropdown2(!showYearDropdown2);
                        setShowYearDropdown1(false);
                      }}
                      className="text-center font-semibold text-sm text-gray-800 px-3 py-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                    >
                      {months[viewMonth2]} {viewYear2}
                    </button>
                    {showYearDropdown2 && (
                      <div 
                        className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-xl z-50 w-32"
                        onClick={(e) => e.stopPropagation()}
                        ref={(el) => {
                          if (el) scrollToYear(viewYear2, el);
                        }}
                      >
                        <div className="max-h-48 overflow-y-auto py-1">
                          {getYearOptions().map((year) => (
                            <button
                              key={year}
                              data-year={year}
                              onClick={() => handleYearSelect2(year)}
                              className={`
                                block w-full px-4 py-2 text-sm text-left hover:bg-blue-50 transition-colors
                                ${year === viewYear2 ? 'bg-blue-500 text-white font-semibold' : 'text-gray-700'}
                              `}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button onClick={handleNextMonth2} className="p-1 hover:bg-gray-100 rounded">
                    <ChevronRight size={18} className="text-gray-700" />
                  </button>
                </div>
                {renderCalendar(viewMonth2, viewYear2, false)}
              </div>
            </div>

            {selectionState === 'start' && fromDay && (
              <div className="mb-3 flex justify-center gap-2">
                <button
                  onClick={() => handleQuickSelectDays(1)}
                  className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  +1 day
                </button>
                <button
                  onClick={() => handleQuickSelectDays(2)}
                  className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  +2 days
                </button>
                <button
                  onClick={() => handleQuickSelectDays(3)}
                  className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  +3 days
                </button>
                <button
                  onClick={() => handleQuickSelectDays(7)}
                  className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  +7 days
                </button>
              </div>
            )}

            <div className="text-center text-sm text-gray-600 bg-gray-50 py-3 rounded-lg">
              {formatDateRange()}
            </div>
          </>
        )}

        {/* WEEK VIEW */}
        {viewMode === 'week' && (
          <>
            <div className="mb-3 text-sm text-gray-500 text-center">
              {selectionState === 'none' && 'Click to select start week'}
              {selectionState === 'start' && 'Click to select end week'}
              {selectionState === 'complete' && 'Click any week to reset and start new selection'}
            </div>

            <div className="mb-4 flex items-center justify-center gap-4">
              <button
                onClick={handlePrevWeekYear}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>
              
              <div className="relative flex items-center gap-2">
                <div className="px-4 py-2 rounded-lg bg-gray-100 font-semibold text-gray-800 text-center">
                  Q{weekViewQuarter}-Q{weekViewQuarter + 1}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowWeekYearDropdown(!showWeekYearDropdown);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-100 font-semibold text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {weekViewYear}
                </button>
                {showWeekYearDropdown && (
                  <div 
                    className="absolute top-full mt-1 right-0 bg-white border border-gray-300 rounded-lg shadow-xl z-50 w-32"
                    onClick={(e) => e.stopPropagation()}
                    ref={(el) => {
                      if (el) scrollToYear(parseInt(weekViewYear), el);
                    }}
                  >
                    <div className="max-h-48 overflow-y-auto py-1">
                      {getYearOptions().map((year) => (
                        <button
                          key={year}
                          data-year={year}
                          onClick={() => handleWeekYearSelect(year.toString())}
                          className={`
                            block w-full px-4 py-2 text-sm text-left hover:bg-blue-50 transition-colors
                            ${year === parseInt(weekViewYear) ? 'bg-blue-500 text-white font-semibold' : 'text-gray-700'}
                          `}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleNextWeekYear}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight size={20} className="text-gray-700" />
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2 mb-3">
              {(() => {
                const weeks = getWeeksForQuarters(weekViewYear, weekViewQuarter);
                const monthAbbrev = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                
                return weeks.map((week, idx) => {
                  const selected = isWeekInRange(week);
                  const isStart = isWeekStart(week);
                  const isEnd = isWeekEnd(week);
                  
                  return (
                    <button
                      key={`${week.year}-w${week.weekNum}-${idx}`}
                      onClick={() => handleWeekClick(week)}
                      className={`
                        px-2 py-2 rounded-lg text-xs font-medium transition-all
                        ${selected 
                          ? 'bg-blue-500 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                        ${isStart || isEnd ? 'ring-2 ring-blue-600 ring-offset-1' : ''}
                      `}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-semibold">W{week.weekNum}</span>
                        <span className="opacity-80">{week.year.toString().slice(-2)}</span>
                      </div>
                      <div className="text-xs opacity-70 mt-0.5">
                        {monthAbbrev[week.startMonth]} {week.startDay}
                      </div>
                    </button>
                  );
                });
              })()}
            </div>

            {selectionState === 'start' && fromWeek && (
              <div className="mb-3 flex justify-center gap-2">
                <button
                  onClick={() => handleQuickSelectWeeks(1)}
                  className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  +1 week
                </button>
                <button
                  onClick={() => handleQuickSelectWeeks(2)}
                  className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  +2 weeks
                </button>
                <button
                  onClick={() => handleQuickSelectWeeks(4)}
                  className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  +4 weeks
                </button>
                <button
                  onClick={() => handleQuickSelectWeeks(8)}
                  className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  +8 weeks
                </button>
              </div>
            )}

            <div className="text-center text-sm text-gray-600 bg-gray-50 py-3 rounded-lg">
              {formatDateRange()}
            </div>
          </>
        )}

        {/* MONTH VIEW */}
        {viewMode === 'month' && !showYearPicker && (
          <>
            <div className="mb-3 text-sm text-gray-500 text-center">
              {selectionState === 'none' && 'Click to select start date'}
              {selectionState === 'start' && 'Click to select end date'}
              {selectionState === 'complete' && 'Click any month to reset and start new selection'}
            </div>
            
            <div className="mb-4 flex items-center justify-center gap-4">
              <button
                onClick={handlePrevYear}
                disabled={extendedYears.indexOf(viewYear) === 0}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>
              
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMonthYearDropdown(!showMonthYearDropdown);
                  }}
                  className="px-6 py-2 rounded-lg bg-gray-100 font-semibold text-gray-800 min-w-[120px] text-center hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {viewYear} - {parseInt(viewYear) + 1}
                </button>
                {showMonthYearDropdown && (
                  <div 
                    className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-xl z-50 w-32"
                    onClick={(e) => e.stopPropagation()}
                    ref={(el) => {
                      if (el) scrollToYear(parseInt(viewYear), el);
                    }}
                  >
                    <div className="max-h-48 overflow-y-auto py-1">
                      {getYearOptions().map((year) => (
                        <button
                          key={year}
                          data-year={year}
                          onClick={() => handleMonthYearSelect(year.toString())}
                          className={`
                            block w-full px-4 py-2 text-sm text-left hover:bg-blue-50 transition-colors
                            ${year === parseInt(viewYear) ? 'bg-blue-500 text-white font-semibold' : 'text-gray-700'}
                          `}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleNextYear}
                disabled={extendedYears.indexOf(viewYear) === extendedYears.length - 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} className="text-gray-700" />
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2 mb-3">
              {[0, 1].map((yearOffset) => {
                const year = (parseInt(viewYear) + yearOffset).toString();
                return months.map((month, idx) => {
                  const selected = isInRange(idx, year);
                  const isStart = isStartPoint(idx, year);
                  const isEnd = isEndPoint(idx, year);
                  
                  return (
                    <button
                      key={`${year}-${month}`}
                      onClick={() => {
                        if (selectionState === 'none') {
                          setFromMonth(idx);
                          setFromYear(year);
                          setToMonth(null);
                          setToYear(null);
                          setSelectionState('start');
                        } else if (selectionState === 'start') {
                          const startDate = new Date(parseInt(fromYear), fromMonth);
                          const clickedDate = new Date(parseInt(year), idx);
                          
                          if (clickedDate >= startDate) {
                            setToMonth(idx);
                            setToYear(year);
                            setSelectionState('complete');
                          } else {
                            setFromMonth(idx);
                            setFromYear(year);
                          }
                        } else {
                          setFromMonth(idx);
                          setFromYear(year);
                          setToMonth(null);
                          setToYear(null);
                          setSelectionState('start');
                        }
                      }}
                      className={`
                        px-2 py-2 rounded-lg text-xs font-medium transition-all
                        ${selected 
                          ? 'bg-blue-500 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                        ${isStart || isEnd ? 'ring-2 ring-blue-600 ring-offset-1' : ''}
                      `}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-semibold">{month}</span>
                        <span className="opacity-80">{year.slice(-2)}</span>
                      </div>
                    </button>
                  );
                });
              }).flat()}
            </div>

            {selectionState === 'start' && (
              <div className="mb-3 flex justify-center gap-2">
                <button
                  onClick={() => handleQuickSelect(1)}
                  className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  +1 month
                </button>
                <button
                  onClick={() => handleQuickSelect(2)}
                  className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  +2 months
                </button>
                <button
                  onClick={() => handleQuickSelect(3)}
                  className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  +3 months
                </button>
              </div>
            )}

            <div className="text-center text-sm text-gray-600 bg-gray-50 py-3 rounded-lg">
              {formatDateRange()}
            </div>
          </>
        )}

        {/* MONTH VIEW - YEAR PICKER */}
        {viewMode === 'month' && showYearPicker && (
          <>
            <div className="mb-6 flex items-center justify-center gap-4">
              <button
                onClick={handlePrevYearGroup}
                disabled={!canGoPrevYearGroup()}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>
              
              <div className="px-6 py-2 rounded-lg bg-gray-100 font-semibold text-gray-800 min-w-[140px] text-center">
                {getYearRangeLabel()}
              </div>

              <button
                onClick={handleNextYearGroup}
                disabled={!canGoNextYearGroup()}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} className="text-gray-700" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-6">
              {getCurrentYearGroup().map((year) => {
                const isSelected = year === viewYear;
                const isInCurrentDecade = parseInt(year) >= 2020 && parseInt(year) <= 2029;
                
                return (
                  <button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className={`
                      px-4 py-4 rounded-lg text-sm font-medium transition-all
                      ${isSelected 
                        ? 'bg-blue-500 text-white shadow-md ring-2 ring-blue-600 ring-offset-2' 
                        : isInCurrentDecade
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }
                    `}
                  >
                    {year}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowYearPicker(false)}
              className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back to months
            </button>
          </>
        )}

        {/* QUARTER VIEW */}
        {viewMode === 'quarter' && (
          <>
            <div className="mb-3 text-sm text-gray-500 text-center">
              {selectionState === 'none' && 'Click to select start quarter'}
              {selectionState === 'start' && 'Click to select end quarter'}
              {selectionState === 'complete' && 'Click any quarter to reset and start new selection'}
            </div>

            <div className="mb-4 flex items-center justify-center gap-4">
              <button
                onClick={handlePrevQuarterYear}
                disabled={parseInt(quarterViewStartYear) <= 2010}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>
              
              <div className="px-6 py-2 rounded-lg bg-gray-100 font-semibold text-gray-800 min-w-[140px] text-center">
                {quarterViewStartYear} - {parseInt(quarterViewStartYear) + 3}
              </div>

              <button
                onClick={handleNextQuarterYear}
                disabled={parseInt(quarterViewStartYear) >= 2027}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} className="text-gray-700" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {[0, 1, 2, 3].map((yearOffset) => {
                const year = (parseInt(quarterViewStartYear) + yearOffset).toString();
                return [1, 2, 3, 4].map((q) => {
                  const selected = isQuarterInRange(q, year);
                  const isStart = isQuarterStart(q, year);
                  const isEnd = isQuarterEnd(q, year);
                  
                  return (
                    <button
                      key={`${year}-q${q}`}
                      onClick={() => handleQuarterClick(q, year)}
                      className={`
                        px-2 py-3 rounded-lg text-xs font-medium transition-all
                        ${selected 
                          ? 'bg-blue-500 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                        ${isStart || isEnd ? 'ring-2 ring-blue-600 ring-offset-1' : ''}
                      `}
                    >
                      <div className="font-semibold">Q{q}</div>
                      <div className="text-xs mt-0.5 opacity-80">{year}</div>
                    </button>
                  );
                });
              }).flat()}
            </div>

            {selectionState === 'start' && fromQuarter !== null && (
              <div className="mb-3 flex justify-center gap-2">
                <button
                  onClick={() => handleQuickSelectQuarters(1)}
                  className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  +1 quarter
                </button>
                <button
                  onClick={() => handleQuickSelectQuarters(2)}
                  className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  +2 quarters
                </button>
                <button
                  onClick={() => handleQuickSelectQuarters(3)}
                  className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  +3 quarters
                </button>
                <button
                  onClick={() => handleQuickSelectQuarters(4)}
                  className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  +4 quarters
                </button>
              </div>
            )}

            <div className="text-center text-sm text-gray-600 bg-gray-50 py-3 rounded-lg">
              {formatDateRange()}
            </div>
          </>
        )}

        {/* YEAR VIEW */}
        {viewMode === 'year' && (
          <>
            <div className="mb-4 text-sm text-gray-500 text-center">
              {selectionState === 'none' && 'Click to select start year'}
              {selectionState === 'start' && 'Click to select end year'}
              {selectionState === 'complete' && 'Click any year to reset and start new selection'}
            </div>

            <div className="mb-6 flex items-center justify-center gap-4">
              <button
                onClick={handlePrevDecade}
                disabled={parseInt(yearDecadeStart) <= 2010}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>
              
              <div className="px-6 py-2 rounded-lg bg-gray-100 font-semibold text-gray-800 min-w-[140px] text-center">
                {getDecadeLabel()}
              </div>

              <button
                onClick={handleNextDecade}
                disabled={parseInt(yearDecadeStart) >= 2021}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} className="text-gray-700" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-3 mb-3">
              {getDecadeYears().map((year) => {
                const selected = isYearInRange(year);
                const isStart = isYearStart(year);
                const isEnd = isYearEnd(year);
                
                return (
                  <button
                    key={year}
                    onClick={() => handleYearOnlyClick(year)}
                    className={`
                      px-4 py-4 rounded-lg text-sm font-medium transition-all
                      ${selected 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                      ${isStart || isEnd ? 'ring-2 ring-blue-600 ring-offset-1' : ''}
                    `}
                  >
                    {year}
                  </button>
                );
              })}
            </div>

            {selectionState === 'start' && fromYearOnly && (
              <div className="mb-3 flex justify-center gap-2">
                <button
                  onClick={() => handleQuickSelectYears(1)}
                  className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  +1 year
                </button>
                <button
                  onClick={() => handleQuickSelectYears(2)}
                  className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  +2 years
                </button>
                <button
                  onClick={() => handleQuickSelectYears(3)}
                  className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  +3 years
                </button>
              </div>
            )}

            <div className="text-center text-sm text-gray-600 bg-gray-50 py-3 rounded-lg">
              {formatDateRange()}
            </div>
          </>
        )}
      </div>
    );
  };

  // Style 4: Inline Range Selector
  const Style4 = () => {
    const [fromMonth, setFromMonth] = useState('Jan');
    const [fromYear, setFromYear] = useState('2024');
    const [toMonth, setToMonth] = useState('Jun');
    const [toYear, setToYear] = useState('2025');

    return (
      <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="flex items-center gap-6">
          <Calendar className="text-blue-500" size={24} />
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg border border-gray-300">
              <span className="text-xs text-gray-600 uppercase font-medium">From</span>
              <select 
                value={fromMonth}
                onChange={(e) => setFromMonth(e.target.value)}
                className="bg-transparent border-none text-sm font-semibold cursor-pointer focus:outline-none text-gray-800"
              >
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select 
                value={fromYear}
                onChange={(e) => setFromYear(e.target.value)}
                className="bg-transparent border-none text-sm font-semibold cursor-pointer focus:outline-none text-gray-800"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg border border-gray-300">
              <span className="text-xs text-gray-600 uppercase font-medium">To</span>
              <select 
                value={toMonth}
                onChange={(e) => setToMonth(e.target.value)}
                className="bg-transparent border-none text-sm font-semibold cursor-pointer focus:outline-none text-gray-800"
              >
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select 
                value={toYear}
                onChange={(e) => setToYear(e.target.value)}
                className="bg-transparent border-none text-sm font-semibold cursor-pointer focus:outline-none text-gray-800"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Style 5: Slider-based Range with Extended Timeline
  const Style5 = () => {
    const allMonths = [
      'Dec 23', 'Jan 24', 'Feb 24', 'Mar 24', 'Apr 24', 'May 24', 'Jun 24',
      'Jul 24', 'Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24',
      'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25',
      'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25'
    ];

    const [fromIdx, setFromIdx] = useState(0); // Dec 23
    const [toIdx, setToIdx] = useState(14); // Feb 25
    const [isDragging, setIsDragging] = useState(null);

    const handleMouseDown = (handle) => {
      setIsDragging(handle);
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = x / rect.width;
      const newIdx = Math.round(percentage * (allMonths.length - 1));

      if (isDragging === 'from') {
        setFromIdx(Math.min(newIdx, toIdx));
      } else {
        setToIdx(Math.max(newIdx, fromIdx));
      }
    };

    return (
      <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">Member Renewal Timeline</h3>
        
        <div 
          className="relative pt-8 pb-12 cursor-pointer select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div 
              className="absolute h-2 bg-blue-500 rounded-full transition-all duration-150"
              style={{
                left: `${(fromIdx / (allMonths.length - 1)) * 100}%`,
                width: `${((toIdx - fromIdx) / (allMonths.length - 1)) * 100}%`
              }}
            />

            <div 
              className="absolute w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-lg -mt-1.5 cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
              style={{ 
                left: `${(fromIdx / (allMonths.length - 1)) * 100}%`, 
                transform: 'translateX(-50%)' 
              }}
              onMouseDown={() => handleMouseDown('from')}
            />
            <div 
              className="absolute w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-lg -mt-1.5 cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
              style={{ 
                left: `${(toIdx / (allMonths.length - 1)) * 100}%`, 
                transform: 'translateX(-50%)' 
              }}
              onMouseDown={() => handleMouseDown('to')}
            />
          </div>

          {/* Timeline markers */}
          <div className="absolute w-full top-6 flex justify-between px-2">
            {allMonths.filter((_, i) => i % 3 === 0).map((month, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-px h-2 bg-gray-300"></div>
                <span className="text-xs text-gray-500 mt-1">{month}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-16 px-2">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1 uppercase font-medium">From</div>
              <div className="text-sm font-semibold text-gray-800 bg-gray-100 px-4 py-2 rounded-lg">
                {allMonths[fromIdx]}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1 uppercase font-medium">To</div>
              <div className="text-sm font-semibold text-gray-800 bg-gray-100 px-4 py-2 rounded-lg">
                {allMonths[toIdx]}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const styles = [
    { id: 1, name: 'Circular Range', component: Style1, desc: 'Bold circular selectors with blue gradient accent' },
    { id: 2, name: 'Pill Dropdowns', component: Style2, desc: 'Clean pill-shaped dropdowns with minimal design' },
    { id: 3, name: 'Month Grid', component: Style3, desc: 'Visual month selection from 2010 to 2030' },
    { id: 4, name: 'Inline Compact', component: Style4, desc: 'Space-efficient inline format with icon' },
    { id: 5, name: 'Timeline Slider', component: Style5, desc: 'Draggable timeline spanning Dec 2023 to Dec 2025' }
  ];

  const ActiveComponent = styles.find(s => s.id === activeStyle)?.component || Style1;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Member Renewal Date Filter</h1>
          <p className="text-gray-600">5 elegant UI style options • White, Ash & Blue color scheme</p>
        </div>

        {/* Style Selector */}
        <div className="grid grid-cols-5 gap-3 mb-8">
          {styles.map(style => (
            <button
              key={style.id}
              onClick={() => setActiveStyle(style.id)}
              className={`
                p-4 rounded-xl text-left transition-all border-2
                ${activeStyle === style.id 
                  ? 'bg-blue-500 text-white border-blue-600 shadow-lg scale-105' 
                  : 'bg-white text-gray-700 border-gray-200 hover:shadow-md hover:border-blue-300'
                }
              `}
            >
              <div className="font-semibold mb-1">{style.name}</div>
              <div className={`text-xs ${activeStyle === style.id ? 'text-blue-100' : 'text-gray-500'}`}>
                Style {style.id}
              </div>
            </button>
          ))}
        </div>

        {/* Active Style Preview */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900">
              {styles.find(s => s.id === activeStyle)?.name}
            </h3>
            <p className="text-sm text-gray-600">
              {styles.find(s => s.id === activeStyle)?.desc}
            </p>
          </div>
          <ActiveComponent />
        </div>

        {/* Design Notes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Design Characteristics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Style 1:</span>
              <span className="text-gray-600"> Bold visual impact with blue gradient</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Style 2:</span>
              <span className="text-gray-600"> Maximum simplicity, minimal space</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Style 3:</span>
              <span className="text-gray-600"> Interactive grid with year navigation arrows</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Style 4:</span>
              <span className="text-gray-600"> Compact, professional, efficient</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Style 5:</span>
              <span className="text-gray-600"> Smooth draggable timeline Dec 2023-Dec 2025</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberRenewalFilters;