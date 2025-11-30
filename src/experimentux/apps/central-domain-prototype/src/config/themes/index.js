/**
 * Theme Registry
 * Exports all available themes
 */

import { defaultTheme } from './defaultTheme';
import { darkTheme } from './darkTheme';

export const themes = {
  default: defaultTheme,
  dark: darkTheme
};

export { defaultTheme, darkTheme };

export default themes;
