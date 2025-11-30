/**
 * AnimatedNumber Component
 *
 * Smoothly animates between number values with a counting effect.
 * Apple-inspired with subtle spring physics.
 */

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import PropTypes from 'prop-types';

export function AnimatedNumber({
  value,
  format = 'number',
  duration = 0.5,
  className,
  style
}) {
  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    mass: 1
  });

  const display = useTransform(spring, (current) => {
    const rounded = Math.round(current);

    if (format === 'currency') {
      if (rounded >= 1000) {
        return `$${Math.round(rounded / 1000)}K`;
      }
      return `$${rounded}`;
    }

    if (format === 'percentage') {
      return `${rounded}%`;
    }

    return rounded.toLocaleString();
  });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.span className={className} style={style}>
      {display}
    </motion.span>
  );
}

AnimatedNumber.propTypes = {
  value: PropTypes.number.isRequired,
  format: PropTypes.oneOf(['number', 'currency', 'percentage']),
  duration: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object
};

/**
 * AnimatedValue Component
 *
 * For animating string values that contain numbers (e.g., "$425K", "78%")
 * Parses the value, animates the number, and reformats.
 */
export function AnimatedValue({
  value,
  className,
  style
}) {
  const [numericValue, setNumericValue] = useState(0);
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [multiplier, setMultiplier] = useState(1);

  useEffect(() => {
    if (!value) return;

    // Parse the value string
    const str = String(value);

    // Extract prefix (e.g., "$")
    const prefixMatch = str.match(/^[^0-9]*/);
    const extractedPrefix = prefixMatch ? prefixMatch[0] : '';

    // Extract suffix (e.g., "K", "%")
    const suffixMatch = str.match(/[^0-9.]*$/);
    const extractedSuffix = suffixMatch ? suffixMatch[0] : '';

    // Extract number
    const numMatch = str.match(/[\d.]+/);
    let num = numMatch ? parseFloat(numMatch[0]) : 0;

    // Handle K/M suffixes
    let mult = 1;
    if (extractedSuffix.includes('K')) {
      mult = 1000;
    } else if (extractedSuffix.includes('M')) {
      mult = 1000000;
    }

    setPrefix(extractedPrefix);
    setSuffix(extractedSuffix);
    setMultiplier(mult);
    setNumericValue(num * mult);
  }, [value]);

  const spring = useSpring(numericValue, {
    stiffness: 100,
    damping: 30,
    mass: 1
  });

  const display = useTransform(spring, (current) => {
    let displayNum;
    let displaySuffix = suffix;

    if (multiplier >= 1000000) {
      displayNum = (current / 1000000).toFixed(1);
      displaySuffix = 'M' + suffix.replace('M', '').replace('K', '');
    } else if (multiplier >= 1000 || current >= 1000) {
      displayNum = Math.round(current / 1000);
      displaySuffix = 'K' + suffix.replace('K', '').replace('M', '');
    } else {
      displayNum = Math.round(current);
    }

    return `${prefix}${displayNum}${displaySuffix}`;
  });

  useEffect(() => {
    spring.set(numericValue);
  }, [numericValue, spring]);

  return (
    <motion.span className={className} style={style}>
      {display}
    </motion.span>
  );
}

AnimatedValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  style: PropTypes.object
};
