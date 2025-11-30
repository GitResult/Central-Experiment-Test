/**
 * useHelp5Analytics Hook
 * Calculates Help5 coverage statistics for DEPTH containers
 */

import { useMemo } from 'react';

/**
 * Calculate Help5 analytics across DEPTH containers
 * @param {Array} help5Records - All Help5 records
 * @param {Array} allElements - All elements/pages in the system
 * @returns {Object} Analytics data
 */
export function useHelp5Analytics(help5Records = [], allElements = []) {
  return useMemo(() => {
    // Calculate overall coverage
    const totalElements = allElements.length;
    const elementsWithHelp5 = allElements.filter(element =>
      help5Records.some(h5 => h5.parent_id === element.id)
    ).length;
    const overallCoverage = totalElements > 0
      ? Math.round((elementsWithHelp5 / totalElements) * 100)
      : 0;

    // Calculate coverage by container
    const containerCoverage = {
      strategy: calculateContainerCoverage(help5Records, allElements, 'strategy'),
      processes: calculateContainerCoverage(help5Records, allElements, 'processes'),
      experience: calculateContainerCoverage(help5Records, allElements, 'experience'),
      operations: calculateContainerCoverage(help5Records, allElements, 'operations'),
      governance: calculateContainerCoverage(help5Records, allElements, 'governance')
    };

    // Find missing Help5 items
    const missingHelp5 = allElements
      .filter(element => !help5Records.some(h5 => h5.parent_id === element.id))
      .map(element => ({
        id: element.id,
        name: element.title || element.name,
        container: element.container || 'unknown',
        priority: element.priority || 'medium'
      }))
      .slice(0, 10); // Top 10

    // Find outdated Help5 (>6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const outdatedHelp5 = help5Records
      .filter(h5 => {
        const createdDate = new Date(h5.created_at || Date.now());
        return createdDate < sixMonthsAgo;
      })
      .map(h5 => ({
        id: h5.record_id,
        title: h5.title,
        age: getAgeInMonths(h5.created_at)
      }))
      .slice(0, 5); // Top 5 oldest

    // Find incomplete Help5 (low completion score)
    const incompleteHelp5 = help5Records
      .filter(h5 => (h5.completionScore || 0) < 100)
      .map(h5 => ({
        id: h5.record_id,
        title: h5.title,
        completionScore: h5.completionScore || 0
      }))
      .sort((a, b) => a.completionScore - b.completionScore)
      .slice(0, 5); // Top 5 least complete

    // Calculate trend (mock for now - would need historical data)
    const trend = calculateTrend(help5Records, allElements);

    return {
      overall: {
        coverage: overallCoverage,
        total: totalElements,
        documented: elementsWithHelp5,
        missing: totalElements - elementsWithHelp5,
        trend
      },
      byContainer: containerCoverage,
      missingItems: missingHelp5,
      outdatedItems: outdatedHelp5,
      incompleteItems: incompleteHelp5,

      // Helper methods
      getCoverageLevel: (coverage) => {
        if (coverage >= 90) return 'high';
        if (coverage >= 70) return 'medium';
        return 'low';
      },
      getCoverageColor: (coverage, colors) => {
        if (coverage >= 90) return colors.success[500];
        if (coverage >= 70) return colors.warning[500];
        return colors.error[500];
      }
    };
  }, [help5Records, allElements]);
}

/**
 * Calculate coverage for a specific container
 */
function calculateContainerCoverage(help5Records, allElements, containerName) {
  const containerElements = allElements.filter(el => el.container === containerName);
  const total = containerElements.length;

  if (total === 0) {
    return { coverage: 0, total: 0, documented: 0, missing: 0 };
  }

  const documented = containerElements.filter(element =>
    help5Records.some(h5 => h5.parent_id === element.id)
  ).length;

  return {
    coverage: Math.round((documented / total) * 100),
    total,
    documented,
    missing: total - documented
  };
}

/**
 * Calculate age in months
 */
function getAgeInMonths(dateString) {
  if (!dateString) return 0;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  return diffMonths;
}

/**
 * Calculate trend (simplified - mock implementation)
 */
function calculateTrend(help5Records, allElements) {
  // In a real implementation, this would compare current vs historical data
  // For now, return neutral
  const recentHelp5 = help5Records.filter(h5 => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const createdDate = new Date(h5.created_at || Date.now());
    return createdDate >= oneMonthAgo;
  });

  if (recentHelp5.length > help5Records.length * 0.1) return 'improving';
  if (recentHelp5.length < help5Records.length * 0.05) return 'declining';
  return 'stable';
}

export default useHelp5Analytics;
