const IconSeedling = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22V12"/>
    <path d="M12 12C12 8 9 4 4 4c0 4 2.5 7.5 8 8z"/>
    <path d="M12 12c0-4 3-8 8-8 0 4-2.5 7.5-8 8z"/>
  </svg>
);
const IconZap = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconFlame = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.8-1.5-3-1.5-5 0 2-3 3.5-3 5z"/>
    <path d="M12 22c4.42 0 8-3.58 8-8 0-4-2.5-6.5-4-8-1 2.5-2 3.5-3.5 5C11 13 9 14.5 9 17c0 2.76 1.34 4.5 3 5z"/>
  </svg>
);

const LEVEL_ICONS = { beginner: IconSeedling, medium: IconZap, advanced: IconFlame };


export { IconSeedling, IconZap, IconFlame, LEVEL_ICONS };
