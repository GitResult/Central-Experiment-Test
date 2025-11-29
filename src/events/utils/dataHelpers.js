// Data Helper Functions

export function computeKpis(attendees) {
  const totalAttendees = attendees.length;
  const currentMembers = attendees.filter((a) => a.membershipStatus === "Current").length;
  const nonMembers = attendees.filter((a) => a.membershipStatus === "Non-member").length;
  const lapsedMembers = attendees.filter((a) => a.membershipStatus === "Lapsed").length;
  const complimentary = attendees.filter((a) => a.isComplimentary).length;

  return {
    totalAttendees,
    currentMembers,
    nonMembers,
    lapsedMembers,
    complimentary,
  };
}

export function groupByField(attendees, field) {
  const map = new Map();
  attendees.forEach((a) => {
    const key = a[field] || "Unknown";
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries()).map(([label, count]) => ({ label, count }));
}

export function filterAttendees(attendees, filters, searchTerm) {
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

export function computeRenewalByProvince(attendees, provinces, showAsShare) {
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

export function computeSegmentsWithPercentage(segments, totalCount) {
  return segments.map((seg) => ({
    ...seg,
    percentage: totalCount > 0 ? ((seg.count / totalCount) * 100).toFixed(1) : 0,
  }));
}

export function transformChartData(originalData, config, attendees) {
  let data = [...originalData];

  // Apply date range filter
  if (config.dateRange === "last4") {
    data = data.slice(-5); // Last 4 weeks + Event
  } else if (config.dateRange === "last2") {
    data = data.slice(-3); // Last 2 weeks + Event
  }

  // Apply membership type filter (affects revenue calculation conceptually)
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

export function computeCorrelation(attendees, dimension, metric) {
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

  // Find key insight
  const significantResults = results.filter((r) => r.total >= 3);
  const insight = significantResults.length >= 2
    ? `${significantResults[0].label} shows ${significantResults[0].renewalRate}% renewal vs ${significantResults[significantResults.length - 1].renewalRate}% for ${significantResults[significantResults.length - 1].label}`
    : significantResults.length === 1
    ? `${significantResults[0].label}: ${significantResults[0].renewalRate}% renewal rate`
    : "Insufficient data for correlation analysis";

  return { results, insight };
}
