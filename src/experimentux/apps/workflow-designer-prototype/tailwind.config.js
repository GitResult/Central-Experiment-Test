import { colors } from '@central-ux/design-tokens';

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    '../../packages/ui-components/src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        neutral: colors.neutral,
      },
    },
  },
  plugins: [],
};
