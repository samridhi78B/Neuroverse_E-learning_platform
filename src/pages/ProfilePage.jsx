import { useState, useEffect, useRef } from "react";
import { PLANETS, BADGES } from "../App";
import authService from "../services/authService";

const CSS = `
@keyframes avatarRotate{0%,100%{transform:perspective(500px) rotateY(0deg) rotateX(0deg)}25%{transform:perspective(500px) rotateY(8deg) rotateX(-4deg)}75%{transform:perspective(500px) rotateY(-8deg) rotateX(4deg)}}
@keyframes ringRotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes ringRotateR{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
@keyframes statCount{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes badgePop{from{opacity:0;transform:scale(.4) rotate(-15deg)}to{opacity:1;transform:scale(1) rotate(0deg)}}
@keyframes badgeShine{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes profileIn{from{opacity:0;transform:translateY(30px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes activityBar{from{height:0}to{height:var(--h)}}
@keyframes lockedShake{0%,100%{transform:rotate(0)}25%{transform:rotate(-5deg)}75%{transform:rotate(5deg)}}
@keyframes glassReveal{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes orbitDot{0%{transform:rotate(0deg) translateX(28px) rotate(0deg)}100%{transform:rotate(360deg) translateX(28px) rotate(-360deg)}}
@keyframes badgePopup{0%{opacity:0;transform:translate(-50%, -50%) scale(0.8)}100%{opacity:1;transform:translate(-50%, -50%) scale(1)}}
@keyframes badgeGlow{0%,100%{box-shadow:0 0 20px rgba(255,215,0,0.8),0 0 40px rgba(255,215,0,0.4)}50%{box-shadow:0 0 30px rgba(255,215,0,1),0 0 60px rgba(255,215,0,0.6)}}
@keyframes confetti{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(300px) rotate(720deg);opacity:0}}
.badge-item{animation:badgePop .5s cubic-bezier(.34,1.56,.64,1) both}
.stat-panel{animation:profileIn .6s cubic-bezier(.22,1,.36,1) both}
.prog-reveal{animation:glassReveal .5s ease both}
.badge-popup-overlay{position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)}
.badge-popup{animation:badgePopup 0.8s cubic-bezier(.34,1.56,.64,1) both}
.badge-glow{animation:badgeGlow 2s ease-in-out infinite}
.confetti{position:absolute;width:10px;height:10px;animation:confetti 3s ease-in-out}
`;

const RARITY_COLORS={common:"#4A9EFF",rare:"#A8D8EA",epic:"#C8A2FF",legendary:"#FFD54F"};
const RARITY_GLOW={common:"rgba(74,158,255,.4)",rare:"rgba(168,216,234,.4)",epic:"rgba(200,162,255,.5)",legendary:"rgba(255,213,79,.6)"};

function AvatarOrb({name}){
  const [hov,setHov]=useState(false);
  const [tilt,setTilt]=useState({x:0,y:0});
  const ref=useRef();
  const handleMM=(e)=>{
    const rect=ref.current.getBoundingClientRect();
    const dx=(e.clientX-rect.left)/rect.width-.5;
    const dy=(e.clientY-rect.top)/rect.height-.5;
    setTilt({x:dy*-20,y:dx*20});
  };
  return(
    <div ref={ref} style={{position:"relative",width:160,height:160,margin:"0 auto",cursor:"pointer",
      transform:`perspective(600px) rotateX(${hov?tilt.x:0}deg) rotateY(${hov?tilt.y:0}deg)`,
      transition:hov?"transform .1s ease":"transform .5s ease",
      animation:hov?"none":"avatarRotate 6s ease-in-out 1s infinite",
    }}
      onMouseMove={handleMM} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>{setHov(false);setTilt({x:0,y:0});}}
    >
      {/* Outer rings */}
      {[{r:78,spd:"18s",col:"rgba(74,158,255,.15)",dash:"12 8"},{r:66,spd:"12s",col:"rgba(74,158,255,.2)",dash:"8 6",rev:true}].map((ring,i)=>(
        <div key={i} style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:ring.r*2,height:ring.r*2,borderRadius:"50%",animation:`${ring.rev?"ringRotateR":"ringRotate"} ${ring.spd} linear infinite`,zIndex:i+1}}>
          <svg width={ring.r*2} height={ring.r*2} viewBox={`0 0 ${ring.r*2} ${ring.r*2}`}>
            <circle cx={ring.r} cy={ring.r} r={ring.r-2} fill="none" stroke={ring.col} strokeWidth="1.5" strokeDasharray={ring.dash}/>
          </svg>
        </div>
      ))}
      {/* Glow halo */}
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:140,height:140,borderRadius:"50%",background:"radial-gradient(circle,rgba(74,158,255,.2) 0%,transparent 70%)",animation:"orbFloat 3s ease-in-out infinite"}}/>
      {/* Avatar circle */}
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:5,
        width:100,height:100,borderRadius:"50%",
        background:"linear-gradient(135deg,rgba(74,158,255,.35),rgba(74,158,255,.08))",
        border:"2px solid rgba(74,158,255,.6)",
        boxShadow:`0 0 30px rgba(74,158,255,.35),inset 0 1px 0 rgba(255,255,255,.2)`,
        display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:2,
      }}>
        <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.3rem",color:"#4A9EFF",letterSpacing:".08em"}}>ME</span>
        <span style={{fontSize:".45rem",color:"rgba(74,158,255,.7)",letterSpacing:".1em"}}>PILOT</span>
      </div>
      {/* Online dot */}
      <div style={{position:"absolute",bottom:24,right:22,zIndex:10,width:14,height:14,borderRadius:"50%",background:"#4ade80",border:"2px solid #050b1a",boxShadow:"0 0 8px #4ade80"}}/>
      {/* Orbiting dot */}
      <div style={{position:"absolute",top:"50%",left:"50%",width:10,height:10,marginTop:-5,marginLeft:-5,zIndex:6,animation:"orbitDot 4s linear infinite"}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:"#FFB347",boxShadow:"0 0 6px #FFB347"}}/>
      </div>
    </div>
  );
}

function BadgePopup({badge,onClose}){
  // Use the same consistent popup function
  useEffect(() => {
    // Create a temporary showBadgePopup function for this component
    const col = RARITY_COLORS[badge.rarity];
    const glow = RARITY_GLOW[badge.rarity];
    
    const badgePopup = document.createElement('div');
    badgePopup.className = 'badge-popup';
    badgePopup.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.85);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(12px);
    `;
    
    badgePopup.innerHTML = `
      <div style="
        width: 380px;
        padding: 36px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
        border: 1px solid ${col}66;
        box-shadow: 0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
        text-align: center;
        position: relative;
        backdrop-filter: blur(12px);
        animation: badgePopup 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      ">
        <div style="
          width: 88px;
          height: 88px;
          border-radius: 16px;
          background: linear-gradient(135deg, ${col}33, ${col}18);
          border: 2px solid ${col};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.8rem;
          margin: 0 auto 24px;
          box-shadow: 0 6px 20px ${col}55, inset 0 1px 0 rgba(255,255,255,0.2);
          position: relative;
          animation: pulse 2s ease infinite;
        ">
          ${badge.icon}
          <div style="
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border-radius: 16px;
            background: linear-gradient(135deg, ${col}44, transparent);
            z-index: -1;
            opacity: 0.6;
          "></div>
        </div>
        
        <div style="
          font-size: 1rem;
          color: ${col};
          font-family: 'Rajdhani',sans-serif;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 12px;
        ">Badge Unlocked!</div>
        
        <div style="
          font-size: 1.8rem;
          color: #ffffff;
          font-family: 'Rajdhani',sans-serif;
          font-weight: 700;
          margin-bottom: 16px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">${badge.name}</div>
        
        <div style="
          font-size: 0.8rem;
          color: ${col};
          font-family: 'Rajdhani',sans-serif;
          font-weight: 600;
          letter-spacing: 0.05em;
          padding: 6px 16px;
          border-radius: 20px;
          background: ${col}18;
          border: 1px solid ${col}33;
          display: inline-block;
          margin-bottom: 20px;
          text-transform: uppercase;
        ">${badge.rarity}</div>
        
        <div style="
          font-size: 0.95rem;
          color: #c4bdb4;
          font-family: 'Rajdhani',sans-serif;
          line-height: 1.5;
          margin-bottom: 28px;
          font-weight: 500;
        ">Nice work! You've earned this badge through your achievements.</div>
        
        <button id="closeBadgePopup" style="
          padding: 12px 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, ${col}, ${col}dd);
          border: 1px solid ${col}88;
          color: white;
          font-family: 'Rajdhani',sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all .2s;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 12px ${col}44;
        " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px ${col}66'" 
           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px ${col}44'">Awesome!</button>
      </div>
    `;
    
    document.body.appendChild(badgePopup);
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes badgePopup {
        0% { transform: scale(0.9); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    `;
    document.head.appendChild(style);
    
    // Close function
    const closePopup = () => {
      if (document.body.contains(badgePopup)) {
        document.body.removeChild(badgePopup);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      onClose();
    };
    
    // Add event listener to close button
    const closeButton = document.getElementById('closeBadgePopup');
    if (closeButton) {
      closeButton.addEventListener('click', closePopup);
    }
    
        
    // Auto close after 4 seconds
    setTimeout(closePopup, 4000);
    
    return () => {
      if (document.body.contains(badgePopup)) {
        document.body.removeChild(badgePopup);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [badge, onClose]);
  
  return null; // This component now renders its own popup
}

function BadgeCard({badge,index}){
  const [hov,setHov]=useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const col=RARITY_COLORS[badge.rarity];
  const glow=RARITY_GLOW[badge.rarity];
  
  const showBadgePopup = (badge, isUnlock = false) => {
    const col = RARITY_COLORS[badge.rarity];
    const glow = RARITY_GLOW[badge.rarity];
    
    const badgePopup = document.createElement('div');
    badgePopup.className = 'badge-popup';
    badgePopup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      animation: badgePopup 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      width: 380px;
      padding: 36px;
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
      border: 1px solid ${col}66;
      box-shadow: 0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
      text-align: center;
      backdrop-filter: blur(12px);
    `;
    
    const headerText = isUnlock ? "Badge Unlocked!" : "Badge Details";
    const messageText = isUnlock 
      ? "Nice work! You've earned this badge through your achievements."
      : getBadgeDescription(badge);
    const buttonText = isUnlock ? "Awesome!" : "Close";
    
    badgePopup.innerHTML = `
        <div style="
          width: 88px;
          height: 88px;
          border-radius: 16px;
          background: linear-gradient(135deg, ${col}33, ${col}18);
          border: 2px solid ${col};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.8rem;
          margin: 0 auto 24px;
          box-shadow: 0 6px 20px ${col}55, inset 0 1px 0 rgba(255,255,255,0.2);
          position: relative;
          ${isUnlock ? 'animation: pulse 2s ease infinite;' : ''}
        ">
          ${badge.icon}
          <div style="
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border-radius: 16px;
            background: linear-gradient(135deg, ${col}44, transparent);
            z-index: -1;
            opacity: 0.6;
          "></div>
        </div>
        
        <div style="
          font-size: 1rem;
          color: ${col};
          font-family: 'Rajdhani',sans-serif;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 12px;
        ">${headerText}</div>
        
        <div style="
          font-size: 1.8rem;
          color: #ffffff;
          font-family: 'Rajdhani',sans-serif;
          font-weight: 700;
          margin-bottom: 16px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">${badge.name}</div>
        
        <div style="
          font-size: 0.8rem;
          color: ${col};
          font-family: 'Rajdhani',sans-serif;
          font-weight: 600;
          letter-spacing: 0.05em;
          padding: 6px 16px;
          border-radius: 20px;
          background: ${col}18;
          border: 1px solid ${col}33;
          display: inline-block;
          margin-bottom: 20px;
          text-transform: uppercase;
        ">${badge.rarity}</div>
        
        ${!isUnlock ? `
        <div style="
          font-size: 0.85rem;
          color: #8899bb;
          font-family: 'Rajdhani',sans-serif;
          line-height: 1.5;
          margin-bottom: 16px;
          font-weight: 500;
        ">
          <div style="color: ${col}; font-weight: 600; margin-bottom: 4px;">Requirement:</div>
          ${getBadgeRequirement(badge)}
        </div>
        ` : ''}
        
        <div style="
          font-size: 0.95rem;
          color: #c4bdb4;
          font-family: 'Rajdhani',sans-serif;
          line-height: 1.5;
          margin-bottom: 28px;
          font-weight: 500;
        ">${messageText}</div>
        
        <button id="closeBadgePopup" style="
          padding: 12px 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, ${col}, ${col}dd);
          border: 1px solid ${col}88;
          color: white;
          font-family: 'Rajdhani',sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all .2s;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 12px ${col}44;
        " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px ${col}66'" 
           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px ${col}44'">${buttonText}</button>
      </div>
    `;
    
    document.body.appendChild(badgePopup);
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes badgePopup {
        0% { transform: scale(0.9); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    `;
    document.head.appendChild(style);
    
    // Close function
    const closePopup = () => {
      if (document.body.contains(badgePopup)) {
        document.body.removeChild(badgePopup);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
    
    // Add event listener to close button
    const closeButton = document.getElementById('closeBadgePopup');
    if (closeButton) {
      closeButton.addEventListener('click', closePopup);
    }
    
        
    // Auto close after 4 seconds for unlock, 6 seconds for details
    setTimeout(closePopup, isUnlock ? 4000 : 6000);
  };

  const handleBadgeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (badge.earned) {
      // Show badge details popup (not unlock)
      showBadgePopup(badge, false);
    }
  };
  
  const getBadgeDescription = (badge) => {
    const descriptions = {
      "First Star": "Awarded for completing your first quiz. Every journey begins with a single step!",
      "Algorithm Ace": "Master complex algorithms and data structures with ease.",
      "Neural Pioneer": "Explore the frontiers of machine learning and AI.",
      "Web Weaver": "Create stunning web applications with modern technologies.",
      "Streak Master": "Maintain consistent daily learning habits.",
      "XP Hunter": "Accumulate substantial experience points through dedication.",
      "Speed Coder": "Solve challenges with remarkable speed and accuracy.",
      "Galaxy Brain": "Achieve mastery across multiple domains."
    };
    return descriptions[badge.name] || "A mysterious achievement waiting to be discovered.";
  };
  
  const getBadgeRequirement = (badge) => {
    const requirements = {
      "First Star": "Complete any quiz",
      "Algorithm Ace": "Master DSA algorithms",
      "Neural Pioneer": "Explore ML/AI concepts",
      "Web Weaver": "Complete web development",
      "Streak Master": "7-day streak",
      "XP Hunter": "1000 total XP",
      "Speed Coder": "Fast problem solving",
      "Galaxy Brain": "Complete all domains"
    };
    return requirements[badge.name] || "Complete specific challenges";
  };
  
  return(
    <>
      <div className="badge-item" style={{animationDelay:`${index*.06}s`,textAlign:"center",cursor:badge.earned?"pointer":"not-allowed",
        transform:hov?"translateY(-8px) scale(1.08)":"none",
        transition:"transform .3s cubic-bezier(.34,1.5,.64,1)",
        opacity:badge.earned?1:.25,
        filter:badge.earned?"none":"grayscale(0.8)"
      }} 
      onMouseEnter={()=>setHov(true)} 
      onMouseLeave={()=>setHov(false)}
      onClick={handleBadgeClick}>
        
        {/* Enhanced badge container */}
        <div style={{
          width:64,
          height:64,
          borderRadius:16,
          margin:"0 auto 8px",
          position:"relative",
          overflow:"hidden",
          background:badge.earned
            ?`linear-gradient(135deg,${col}25,${col}10,${col}05)`
            :"linear-gradient(135deg,rgba(255,255,255,.08),rgba(255,255,255,.02))",
          border:`2px solid ${badge.earned?col+"66":"rgba(255,255,255,.15)"}`,
          boxShadow:hov&&badge.earned
            ?`0 8px 32px ${glow},0 0 48px ${col}33,inset 0 2px 0 rgba(255,255,255,.2)`
            :badge.earned
            ?`0 4px 16px ${col}22,inset 0 1px 0 rgba(255,255,255,.15)`
            :"0 2px 8px rgba(0,0,0,.3)",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          fontSize:"1.8rem",
          transition:"all .3s",
        }}>
          
          {/* Animated shine effect for earned badges */}
          {badge.earned&&(
            <div style={{
              position:"absolute",
              inset:0,
              background:`linear-gradient(135deg,transparent,${col}20,transparent)`,
              backgroundSize:"200% 100%",
              animation:hov?"badgeShine 1s ease infinite":"none",
            }}/>
          )}
          
          {/* Lock overlay for unearned badges */}
          {!badge.earned&&(
            <div style={{
              position:"absolute",
              inset:0,
              background:"rgba(0,0,0,.6)",
              backdropFilter:"blur(2px)",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              zIndex:2,
              borderRadius:14
            }}>
              <span style={{fontSize:"1rem",opacity:0.7}}>🔒</span>
            </div>
          )}
          
          {/* Badge icon */}
          <span style={{
            position:"relative",
            zIndex:1,
            filter:badge.earned?"drop-shadow(0 0 8px "+col+"66)":"grayscale(1)",
            transform:hov?"scale(1.1)":"scale(1)",
            transition:"all .3s"
          }}>{badge.icon}</span>
          
          {/* Earned indicator */}
          {badge.earned&&(
            <div style={{
              position:"absolute",
              top:6,
              right:6,
              width:8,
              height:8,
              borderRadius:"50%",
              background:col,
              boxShadow:`0 0 12px ${col}`,
              animation:"pulse 2s ease infinite"
            }}/>
          )}
          
          {/* Hover glow */}
          {hov&&badge.earned&&(
            <div style={{
              position:"absolute",
              inset:-4,
              borderRadius:20,
              background:`radial-gradient(circle,${col}22,transparent 70%)`,
              zIndex:-1
            }}/>
          )}
        </div>
        
        {/* Badge info */}
        <div style={{
          fontSize:".6rem",
          color:badge.earned?col:"#8899bb",
          fontFamily:"'Rajdhani',sans-serif",
          fontWeight:700,
          letterSpacing:".06em",
          lineHeight:1.3,
          textShadow:badge.earned?`0 0 8px ${col}44`:"none"
        }}>{badge.name}</div>
        
        <div style={{
          fontSize:".48rem",
          color:badge.earned?col+"aa":"rgba(255,255,255,.3)",
          letterSpacing:".08em",
          marginTop:2,
          textTransform:"uppercase",
          fontWeight:600
        }}>{badge.rarity}</div>
      </div>
      
      {/* Badge Detail Popup */}
      {showDetails && badge.earned && (
        <div style={{
          position:"fixed",
          top:0,
          left:0,
          width:"100vw",
          height:"100vh",
          background:"rgba(0,0,0,0.85)",
          zIndex:10000,
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          backdropFilter:"blur(12px)"
        }} onClick={() => setShowDetails(false)}>
          
          <div style={{
            width:380,
            padding:40,
            borderRadius:24,
            background:"linear-gradient(135deg,rgba(255,255,255,0.15),rgba(255,255,255,0.08))",
            border:`2px solid ${col}`,
            boxShadow:`0 0 60px ${glow},0 0 120px ${col}44, inset 0 0 40px rgba(255,255,255,0.1)`,
            textAlign:"center",
            position:"relative",
            backdropFilter:"blur(24px)",
            zIndex:10001,
            color: "#ffffff"
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Close button */}
            <button
              onClick={() => setShowDetails(false)}
              style={{
                position:"absolute",
                top:16,
                right:16,
                width:32,
                height:32,
                borderRadius:8,
                background:"rgba(255,255,255,0.1)",
                border:"1px solid rgba(255,255,255,0.2)",
                color:"#ffffff",
                fontSize:"1.2rem",
                cursor:"pointer",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                transition:"all .2s"
              }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.2)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";}}
            >
              ×
            </button>
            
            {/* Large badge icon */}
            <div style={{
              width:100,
              height:100,
              borderRadius:24,
              background:`linear-gradient(135deg,${col}25,${col}10)`,
              border:`3px solid ${col}`,
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              fontSize:"3.5rem",
              margin:"0 auto 20px",
              boxShadow:`0 8px 32px ${col}66`,
              animation:"pulse 2s ease infinite"
            }}>
              {badge.icon}
            </div>
            
            {/* Badge name */}
            <div style={{
              fontSize:"1.8rem",
              color:"#e8f0fe",
              fontFamily:"'Rajdhani',sans-serif",
              fontWeight:800,
              marginBottom:8,
              textShadow:`0 0 16px ${col}66`
            }}>
              {badge.name}
            </div>
            
            {/* Rarity */}
            <div style={{
              fontSize:"1rem",
              color:col,
              fontFamily:"'Rajdhani',sans-serif",
              fontWeight:700,
              letterSpacing:".1em",
              textTransform:"uppercase",
              padding:"6px 16px",
              borderRadius:20,
              background:`${col}18`,
              border:`1px solid ${col}44`,
              display:"inline-block",
              marginBottom:16
            }}>
              ⭐ {badge.rarity} ⭐
            </div>
            
            {/* Description */}
            <div style={{
              fontSize:"0.95rem",
              color:"#c4bdb4",
              fontFamily:"'Rajdhani',sans-serif",
              lineHeight:1.6,
              fontWeight:600,
              marginBottom:16
            }}>
              {getBadgeDescription(badge)}
            </div>
            
            {/* Requirement */}
            <div style={{
              fontSize:"0.85rem",
              color:"#8899bb",
              fontFamily:"'Rajdhani',sans-serif",
              lineHeight:1.5,
              marginBottom:20
            }}>
              <div style={{fontWeight:700,marginBottom:4, color:col}}>Requirement:</div>
              {getBadgeRequirement(badge)}
            </div>
            
            {/* Status */}
            <div style={{
              padding:"8px 16px",
              borderRadius:12,
              background:`${col}12`,
              border:`1px solid ${col}33`,
              display:"inline-block"
            }}>
              <div style={{fontSize:"0.8rem",color:"#4ade80",fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>
                ✓ EARNED
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ActivityHeatmap({ userData }){
  const weeks=12;
  const days=7;
  const totalDays = weeks*days;
  const data=Array.from({length:totalDays},()=>0);
  
  if (userData) {
    const now = new Date();
    const createdAt = new Date(userData.createdAt || Date.now());
    
    // Check if user is new (account created today or yesterday)
    const accountAgeDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
    const isNewUser = accountAgeDays <= 1;
    
    // For new users, only show today's activity
    if (isNewUser) {
      const todayIndex = totalDays - 1;
      const hasAnyXP = Object.values(userData.planetXP || {}).some(xp => xp > 0);
      
      if (hasAnyXP) {
        data[todayIndex] = 1; // Blue for today only
      }
    } else {
      // For existing users, show full activity history
      // Get activity dates from localStorage (quiz completions, module completions, etc.)
      const activityDates = [];
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('quiz_score_') || key.startsWith('module_completed_') || key.startsWith('activity_')) {
          const timestamp = localStorage.getItem(`${key}_timestamp`);
          if (timestamp) {
            activityDates.push(new Date(parseInt(timestamp)));
          }
        }
      });
      
      // Mark activity days (blue if worked, no color if no activity)
      activityDates.forEach(date => {
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < totalDays) {
          const index = totalDays - 1 - diffDays;
          if (index >= 0 && index < totalDays) {
            data[index] = 1; // Blue for activity day
          }
        }
      });
      
      // Mark account creation day
      const accountDiffDays = Math.floor(Math.abs(now - createdAt) / (1000 * 60 * 60 * 24));
      if (accountDiffDays < totalDays) {
        const creationIndex = totalDays - 1 - accountDiffDays;
        if (creationIndex >= 0 && creationIndex < totalDays) {
          data[creationIndex] = 1; // Blue for account creation
        }
      }
    }
  }
  
  // Simple color scheme: no color (0) or blue (1) like LeetCode
  const cols=["#0f172a","#1d4ed8"];
  
  return(
    <div>
      <div style={{display:"flex",gap:2,flexWrap:"wrap",marginBottom:8}}>
        {data.map((v,i)=>(
          <div 
            key={i} 
            style={{
              width:11,
              height:11,
              borderRadius:2,
              background:cols[v],
              transition:"all .2s",
              cursor:"pointer",
              border: v === 1 ? "1px solid rgba(29,78,216,0.3)" : "1px solid rgba(255,255,255,0.1)"
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.transform="scale(1.3)";
              e.currentTarget.style.boxShadow=v === 1 ? "0 0 8px rgba(29,78,216,0.6)" : "none";
            }} 
            onMouseLeave={e=>{
              e.currentTarget.style.transform="scale(1)";
              e.currentTarget.style.boxShadow="none";
            }}
            title={v === 1 ? "Active day" : "No activity"}
          />
        ))}
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center",fontSize:".45rem",color:"#8899bb"}}>
        <span>Day-wise activity</span>
        <div style={{display:"flex",gap:2,alignItems:"center"}}>
          <div style={{width:8,height:8,borderRadius:1,background:cols[0],border:"1px solid rgba(255,255,255,0.1)"}}/>
          <span>No activity</span>
        </div>
        <div style={{display:"flex",gap:2,alignItems:"center"}}>
          <div style={{width:8,height:8,borderRadius:1,background:cols[1],border:"1px solid rgba(29,78,216,0.3)"}}/>
          <span>Active</span>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage({setPage}){
  const [ed,setEd]=useState(false);
  const [name,setName]=useState("Neuroverse Pilot");
  const [visible,setVisible]=useState(false);
  const [userData, setUserData] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBadgePopup, setShowBadgePopup] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);

  const checkForFirstBadge = (profile) => {
    // Check for any progress > 0 in any planet (even 1 XP or 1%)
    const hasAnyProgress = profile?.planetXP && 
      Object.values(profile.planetXP).some(xp => xp > 0);
    
    // Check for any quiz activity (even partial progress)
    const hasQuizActivity = localStorage.getItem('quiz_score_beginner') || 
                           localStorage.getItem('quiz_score_medium') || 
                           localStorage.getItem('quiz_score_advanced') ||
                           localStorage.getItem('module_score_beginner') ||
                           localStorage.getItem('module_score_medium') ||
                           localStorage.getItem('module_score_advanced');
    
    // Always ensure the First Star badge is earned if there's any progress
    const firstStarBadge = BADGES.find(b => b.id === 1);
    if (firstStarBadge && (hasAnyProgress || hasQuizActivity)) {
      // Always set as earned when progress exists
      firstStarBadge.earned = true;
      setEarnedBadge(firstStarBadge);
      
      // Show popup if it was just earned (check if it wasn't earned before)
      const wasNotEarned = !localStorage.getItem('firstStarBadgeEarned');
      if (wasNotEarned) {
        localStorage.setItem('firstStarBadgeEarned', 'true');
        setTimeout(() => {
          setShowBadgePopup(true);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          setName(user.name);
          const profile = await authService.getProfile();
          setUserData(profile.user);
          
          const leaderboard = await authService.getLeaderboard();
          const userEntry = leaderboard.find(entry => entry.name === user.name);
          setUserRank(userEntry ? userEntry.rank : null);
          
          // Check for badge unlock
          checkForFirstBadge(profile.user);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
        setTimeout(() => setVisible(true), 100);
      }
    };

    fetchUserData();
  }, []);

  // Ensure badge stays unlocked whenever userData changes
  useEffect(() => {
    if (userData) {
      checkForFirstBadge({ user: userData });
    }
  }, [userData]);

  const totalXP = userData?.xp || 0;
  const startedPlanets = Object.keys(userData?.planetXP || {}).length;
  
  // Create dynamic recent sessions
  const recentSessions = [];
  if (userData?.planetXP) {
    Object.entries(userData.planetXP).forEach(([pid, xp]) => {
      const p = PLANETS.find(pl => pl.id === pid);
      if (p && xp > 0) {
        let label = p.currentQuest || `${p.name} Activity`;
        // Show "Algorithms" for DSA instead of specific implementations
        if (pid === 'dsa') {
          label = 'Algorithms';
        }
        recentSessions.push({
          label: label,
          planet: p.shortName,
          xp: `+${xp} XP`,
          ago: "Recently",
          color: p.color
        });
      }
    });
  }
  // Add a fallback if no activity
  if (recentSessions.length === 0) {
    recentSessions.push({
      label: "Profile Created",
      planet: "Neuroverse",
      xp: "+0 XP",
      ago: "Recently",
      color: "#4A9EFF"
    });
  }

  const badgesEarned = BADGES.filter(b=>b.earned).length;
  const stats=[
    {l:"TOTAL XP",v:totalXP.toLocaleString(),color:"#4A9EFF"},{l:"STREAK",v:"1 ",color:"#FFB347"},
    {l:"BADGES",v:badgesEarned.toString(),color:"#C8A2FF"},{l:"LESSONS",v:"0",color:"#4DFFC3"},
    {l:"QUIZZES",v:"0",color:"#FF6B9D"},{l:"PLANETS",v:`${startedPlanets}/${PLANETS.length}`,color:"#A8D8EA"},
  ];

  if (loading) {
    return <div style={{padding:"90px 28px", textAlign:"center", color:"#8899bb"}}>Loading profile...</div>;
  }

  return(
    <div style={{minHeight:"100vh",paddingTop:90,paddingBottom:60,padding:"90px 28px 60px",maxWidth:1200,margin:"0 auto"}}>
      <style>{CSS}</style>
      
      {/* Badge Popup */}
      {showBadgePopup && earnedBadge && (
        <BadgePopup 
          badge={earnedBadge} 
          onClose={() => setShowBadgePopup(false)} 
        />
      )}
      {/* Header */}
      <div style={{marginBottom:32,animation:"fiu .5s ease forwards"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"4px 14px",borderRadius:20,background:"rgba(74,158,255,.08)",border:"1px solid rgba(74,158,255,.22)",marginBottom:12}}>
          <span style={{fontSize:".6rem",letterSpacing:".2em",color:"#4A9EFF",fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>◎ PILOT PROFILE</span>
        </div>
        <h1 style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"clamp(2rem,4vw,3.4rem)",letterSpacing:".04em",background:"linear-gradient(135deg,#e8f0fe 0%,#4A9EFF 60%,#A8D8EA 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>YOUR COMMAND CENTER</h1>
      </div>
      {/* Top layout */}
      <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:22,marginBottom:22}}>
        {/* Left: Avatar panel */}
        <div className="stat-panel" style={{animationDelay:".05s",borderRadius:24,padding:"32px 20px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",backdropFilter:"blur(14px)",textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#4A9EFF,#A8D8EA,#4DFFC3)",borderRadius:"24px 24px 0 0"}}/>
          <div style={{position:"absolute",top:"10%",left:"50%",transform:"translate(-50%,-50%)",width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(74,158,255,.08) 0%,transparent 70%)",pointerEvents:"none"}}/>
          <AvatarOrb name={name}/>
          <div style={{marginTop:20}}>
            {ed
              ?<input value={name} onChange={e=>setName(e.target.value)} onBlur={()=>setEd(false)} autoFocus style={{background:"transparent",border:"none",borderBottom:"1px solid rgba(74,158,255,.5)",textAlign:"center",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.2rem",color:"#e8f0fe",width:"100%",outline:"none",marginBottom:4}}/>
              :<h3 style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.2rem",letterSpacing:".06em",marginBottom:4,color:"#e8f0fe"}}>{name}</h3>
            }
            <div style={{fontSize:".65rem",color:"#8899bb",marginBottom:18}}>Neuroverse Pilot · Level {userData?.level || 1}</div>
            {/* Mini stat grid */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:18}}>
              {stats.slice(0,3).map((s,i)=>(
                <div key={s.l} style={{padding:"10px 6px",borderRadius:12,background:`${s.color}0a`,border:`1px solid ${s.color}20`,animation:`statCount .5s ease ${.2+i*.08}s both`}}>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1rem",color:s.color}}>{s.v}</div>
                  <div style={{fontSize:".46rem",color:"#8899bb",letterSpacing:".08em"}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
              {stats.slice(3).map((s,i)=>(
                <div key={s.l} style={{padding:"10px 6px",borderRadius:12,background:`${s.color}0a`,border:`1px solid ${s.color}20`,animation:`statCount .5s ease ${.35+i*.08}s both`}}>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1rem",color:s.color}}>{s.v}</div>
                  <div style={{fontSize:".46rem",color:"#8899bb",letterSpacing:".08em"}}>{s.l}</div>
                </div>
              ))}
            </div>
            <button onClick={()=>setEd(true)} style={{width:"100%",padding:"9px 0",borderRadius:12,background:"rgba(74,158,255,.08)",border:"1px solid rgba(74,158,255,.25)",color:"#4A9EFF",fontSize:".65rem",fontFamily:"'Rajdhani',sans-serif",letterSpacing:".15em",cursor:"pointer",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(74,158,255,.16)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(74,158,255,.08)";}}>
              ✎ EDIT PROFILE
            </button>
          </div>
        </div>
        {/* Right: Planet progress */}
        <div className="stat-panel" style={{animationDelay:".12s",borderRadius:24,padding:"24px 22px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",backdropFilter:"blur(14px)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#C8A2FF,#FF6B9D,#4DFFC3)",borderRadius:"24px 24px 0 0"}}/>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".72rem",letterSpacing:".15em",color:"#8899bb",marginBottom:18}}>SUBJECT MASTERY</div>
          {PLANETS.map((planet,i)=>{
            const pXP = (userData?.planetXP && userData.planetXP[planet.id]) || 0;
            const pLevel = Math.floor(pXP / 1000) + 1;
            const done = Math.min(pLevel, planet.checkpoints.length);
            const total = planet.checkpoints.length;
            const pct = pXP > 0 ? Math.round(((pXP % 1000) / 1000) * 100) : 0;
            
            return(
              <div key={planet.id} className="prog-reveal" style={{animationDelay:`${.15+i*.07}s`,marginBottom:13,cursor:"pointer"}}
                onClick={()=>setPage&&setPage("subjects")}
              >
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:planet.color,boxShadow:`0 0 6px ${planet.color}`,flexShrink:0,animation:`orbFloat ${4+i*.3}s ease-in-out ${i*.2}s infinite`}}/>
                    <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:".78rem",color:"#e8f0fe"}}>{planet.name}</span>
                    <span style={{fontSize:".48rem",color:planet.color,padding:"1px 5px",borderRadius:8,background:`${planet.color}18`,border:`1px solid ${planet.color}25`}}>{pXP > 0 ? `${badgesEarned} 🏆` : '0 🏆'}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:".6rem",color:planet.color,fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>{pct}%</span>
                    <span style={{fontSize:".52rem",color:"#8899bb"}}>{done}/{total}</span>
                  </div>
                </div>
                <div style={{height:5,borderRadius:3,background:"rgba(255,255,255,.06)",overflow:"hidden",position:"relative"}}>
                  <div style={{width:visible?`${pct}%`:"0%",height:"100%",borderRadius:3,
                    background:`linear-gradient(90deg,${planet.color}77,${planet.color},${planet.color}cc)`,
                    boxShadow:`0 0 10px ${planet.color}66`,
                    transition:`width 1.2s cubic-bezier(.4,0,.2,1) ${.2+i*.1}s`,
                    position:"relative",overflow:"hidden",
                  }}>
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent)",animation:"shimmer 2s infinite"}}/>
                  </div>
                  {/* Segment marks */}
                  {[25,50,75].map(m=>(
                    <div key={m} style={{position:"absolute",top:0,left:`${m}%`,width:1,height:"100%",background:"rgba(0,0,0,.25)"}}/>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Bottom layout: Badges + Activity */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:22}}>
        {/* Badges */}
        <div className="stat-panel" style={{animationDelay:".2s",borderRadius:24,padding:"24px 22px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",backdropFilter:"blur(14px)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#FFD54F,#C8A2FF,#FF6B9D,#FFD54F)",backgroundSize:"200%",animation:"badgeShine 3s linear infinite",borderRadius:"24px 24px 0 0"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".72rem",letterSpacing:".15em",color:"#8899bb"}}>ACHIEVEMENT BADGES</div>
            <div style={{fontSize:".55rem",color:"#8899bb",fontFamily:"'Rajdhani',sans-serif"}}>{BADGES.filter(b=>b.earned).length}/{BADGES.length} EARNED</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
            {BADGES.map((b,i)=><BadgeCard key={b.id} badge={b} index={i}/>)}
          </div>
          {/* Rarity legend */}
          <div style={{marginTop:18,display:"flex",gap:12,flexWrap:"wrap"}}>
            {Object.entries(RARITY_COLORS).map(([r,c])=>(
              <div key={r} style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:c}}/>
                <span style={{fontSize:".48rem",color:"#8899bb",textTransform:"uppercase",letterSpacing:".08em"}}>{r}</span>
              </div>
            ))}
          </div>
                  </div>
        {/* Activity */}
        <div className="stat-panel" style={{animationDelay:".28s",borderRadius:24,padding:"24px 22px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",backdropFilter:"blur(14px)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#4ade80,#4A9EFF,#4ade80)",backgroundSize:"200%",animation:"badgeShine 3s linear infinite",borderRadius:"24px 24px 0 0"}}/>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".72rem",letterSpacing:".15em",color:"#8899bb",marginBottom:18,marginTop:32}}>LEARNING ACTIVITY</div>
          <ActivityHeatmap userData={userData} />
          {/* Recent activity list */}
          <div style={{marginTop:22}}>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:".62rem",letterSpacing:".12em",color:"#8899bb",marginBottom:12}}>RECENT SESSIONS</div>
            {recentSessions.map((a,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<recentSessions.length-1?"1px solid rgba(255,255,255,.05)":"none"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:a.color,flexShrink:0,boxShadow:`0 0 6px ${a.color}`,animation:`orbFloat ${3+i*.5}s ease-in-out ${i*.3}s infinite`}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:".72rem",color:"#e8f0fe"}}>{a.label}</div>
                  <div style={{fontSize:".52rem",color:"#8899bb"}}>{a.planet}</div>
                </div>
                <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".68rem",color:a.color}}>{a.xp}</span>
                <span style={{fontSize:".5rem",color:"rgba(255,255,255,.25)"}}>{a.ago}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
