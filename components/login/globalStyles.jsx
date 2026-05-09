export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

 :root {
  --bg:           #0d1117;
  --bg3:          #1c2333;
  --border:       rgba(139,148,158,0.15);

  --accent:       #3b82f6;   /* primary blue */
  --accent2:      #60a5fa;   /* lighter blue */
  --slate:        #93c5fd;   /* highlight blue */

  --text:         #e6edf3;
  --text-muted:   #7d8590;
  --text-dim:     #4d5566;

  --error:        #e05252;
  --error-bg:     rgba(224,82,82,0.08);

  --success:      #4caf88;

  --transition:   0.22s cubic-bezier(.4,0,.2,1);
}

  html, body {
    height: 100%; min-height: 100vh;
    font-family: 'Sora', sans-serif;
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