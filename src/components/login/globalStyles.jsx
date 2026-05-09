export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Exo+2:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:           #050b1a;
    --bg3:          #1a2332;
    --border:       rgba(139,148,158,0.15);

    --accent:       #4A9EFF;   /* primary blue */
    --accent2:      #00BCD4;   /* cyan blue */
    --slate:        #93c5fd;   /* highlight blue */

    --text:         #e8f0fe;
    --text-muted:   #8899bb;
    --text-dim:     #334a66;

    --error:        #ff6b6b;
    --error-bg:     rgba(255,107,107,0.08);

    --success:      #22c97a;

    --transition:   0.22s cubic-bezier(.4,0,.2,1);
  }

  html, body {
    height: 100%; min-height: 100vh;
    font-family: 'Exo 2', sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
  }

  input::placeholder { color: var(--text-dim); }

  @keyframes floatY {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-12px); }
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes msgIn {
    from { opacity: 0; transform: translateY(-3px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes panelIn {
    from { opacity: 0; transform: translateX(10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
`