/**
 * InsightsCard Component
 * Apple-inspired data visualization
 */

import { motion } from 'framer-motion';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { theme } from '../../config/theme';

export function InsightsCard() {
  // Generate weekly activity data (last 7 days up to today)
  const getWeekData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekData = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dayName = days[date.getDay()];
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      const isToday = i === 0;

      // Generate mock data - only for past days and today
      const count = Math.floor(Math.random() * 80) + 20; // Random data between 20-100

      weekData.push({
        day: dayName,
        date: dateStr,
        count,
        isToday,
        label: `${dayName}\n${dateStr}`
      });
    }

    return weekData;
  };

  const weekData = getWeekData();

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: theme.colors.background.primary,
            padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
            borderRadius: theme.borderRadius.sm,
            boxShadow: theme.shadows.sm,
            border: `1px solid ${theme.colors.border.default}`
          }}
        >
          <p style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.primary,
            fontWeight: theme.typography.fontWeight.semibold,
            margin: 0
          }}>
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom X-axis tick component
  const CustomXAxisTick = ({ x, y, payload }) => {
    const dataPoint = weekData.find(d => d.day === payload.value.split('\n')[0]);
    const isToday = dataPoint?.isToday;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill={isToday ? theme.colors.text.primary : theme.colors.text.tertiary}
          style={{
            fontSize: theme.typography.fontSize.xs,
            fontWeight: isToday ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium
          }}
        >
          {payload.value.split('\n')[0]}
        </text>
        <text
          x={0}
          y={0}
          dy={28}
          textAnchor="middle"
          fill={theme.colors.text.tertiary}
          style={{
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.normal
          }}
        >
          {payload.value.split('\n')[1]}
        </text>
      </g>
    );
  };

  // Custom bar shape to highlight today
  const CustomBar = (props) => {
    const { fill, x, y, width, height, payload } = props;

    if (payload.isToday) {
      // Today: outlined in green (hollow bar)
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="transparent"
          stroke={theme.colors.success[500]}
          strokeWidth={2}
          rx={4}
        />
      );
    } else {
      // Past days: filled in light green
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={theme.colors.success[50]}
          rx={4}
        />
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
      style={{
        background: theme.colors.background.primary,
        borderRadius: theme.borderRadius.xl,
        boxShadow: theme.shadows.elevated,
        padding: theme.components.card.padding.lg
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 style={{fontSize: theme.typography.fontSize.xl, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text.primary}}>Insights</h3>
        <button style={{fontSize: theme.typography.fontSize.sm, color: theme.colors.primary[500], fontWeight: theme.typography.fontWeight.medium, background: 'none', border: 'none', cursor: 'pointer'}}>View All</button>
      </div>

      {/* Weekly Activity Combo Chart */}
      <div>
        <h4
          style={{
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing[6],
            textTransform: 'uppercase',
            letterSpacing: theme.typography.letterSpacing.wide
          }}
        >
          This Week's Activity
        </h4>

        {/* Recharts container */}
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart
            data={weekData}
            margin={{ top: 20, right: 10, left: -20, bottom: 40 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.colors.border.light}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={<CustomXAxisTick />}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: theme.colors.text.tertiary,
                fontSize: theme.typography.fontSize.xs
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar
              dataKey="count"
              fill={theme.colors.success[100]}
              shape={<CustomBar />}
              radius={[4, 4, 0, 0]}
              animationDuration={500}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={theme.colors.primary[500]}
              strokeWidth={2}
              dot={{
                fill: theme.colors.background.primary,
                stroke: theme.colors.primary[500],
                strokeWidth: 2,
                r: 4
              }}
              activeDot={{
                r: 6,
                fill: theme.colors.primary[500]
              }}
              animationDuration={1000}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
