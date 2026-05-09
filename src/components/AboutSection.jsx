import { useState, useEffect, useRef } from 'react';

export default function AboutSection() {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    {
      title: "QUANTUM LEAP",
      subtitle: "Beyond Traditional Education",
      content: "NeuroVerse transforms complex subjects into explorable worlds where knowledge becomes treasure. Each algorithm, each concept, each discovery is a step in your journey through the universe of learning.",
      icon: "⚡",
      color: "#4A9EFF"
    },
    {
      title: "NEURAL SYNAPSES",
      subtitle: "Connected Knowledge Networks",
      content: "We believe in breaking down the walls between subjects. DSA flows into AI, which connects to Web Development, creating a unified learning ecosystem where concepts reinforce each other.",
      icon: "🧠",
      color: "#1a4a9a"
    },
    {
      title: "COSMIC EXPLORATION",
      subtitle: "Gamified Learning Experience",
      content: "Every XP point, every badge, every planet conquered is backed by cognitive science. We make learning addictive by tapping into your natural curiosity and competitive spirit.",
      icon: "🚀",
      color: "#0d2a5e"
    },
    {
      title: "INFINITE FRONTIERS",
      subtitle: "Ever-Expanding Knowledge Universe",
      content: "This is just the beginning. AI-powered mentors, collaborative projects, real-world challenges - the NeuroVerse evolves with you as you evolve into a master of your craft.",
      icon: "∞",
      color: "#4A9EFF"
    }
  ];

  const metrics = [
    { value: "∞", label: "Knowledge Horizons", delay: 0 },
    { value: "7", label: "Subject Worlds", delay: 200 },
    { value: "24K+", label: "Neural Explorers", delay: 400 },
    { value: "2.4M", label: "Experience Points", delay: 600 }
  ];

  const principles = [
    {
      title: "Curiosity-Driven",
      description: "Questions before answers, exploration before explanation",
      angle: -15
    },
    {
      title: "Fail Forward",
      description: "Mistakes are experience points, failures are level-ups",
      angle: 10
    },
    {
      title: "Connect Everything",
      description: "Knowledge is a network, not isolated islands",
      angle: -8
    },
    {
      title: "Play Seriously",
      description: "Fun is the fuel for deep, lasting learning",
      angle: 12
    }
  ];

  return (
    <div id="about-section" style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(180deg, #050b1a 0%, #07101f 50%, #05080f 100%)',
      position: 'relative',
      fontFamily: "'Exo 2', sans-serif",
      color: '#e8f0fe',
      overflow: 'hidden'
    }}>
      {/* Dynamic Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 20%, rgba(74, 158, 255, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(26, 74, 154, 0.02) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />

      {/* Neural Network Animation */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none'
      }}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: `rgba(74, 158, 255, ${0.3 + i * 0.05})`,
              top: `${10 + i * 7}%`,
              left: `${5 + i * 8}%`,
              animation: `neuralPulse ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
        
        {/* Connection Lines */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`line-${i}`}
            style={{
              position: 'absolute',
              width: `${80 + i * 30}px`,
              height: '1px',
              background: `linear-gradient(90deg, transparent, rgba(74, 158, 255, 0.3), transparent)`,
              top: `${15 + i * 10}%`,
              left: `${10 + i * 12}%`,
              transform: `rotate(${i * 15}deg)`,
              animation: `lineFlow ${8 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      <div ref={containerRef} style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        padding: '120px 0 80px'
      }}>

        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '100px',
          maxWidth: '1400px',
          margin: '0 auto',
          paddingLeft: '40px',
          paddingRight: '40px'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 20px',
            borderRadius: '30px',
            background: 'rgba(74, 158, 255, 0.1)',
            border: '1px solid rgba(74, 158, 255, 0.2)',
            color: '#4A9EFF',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            fontWeight: 600,
            marginBottom: '32px',
            textTransform: 'uppercase',
            animation: 'glowPulse 2s ease-in-out infinite'
          }}>
            NEUROVERSE
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #4A9EFF 0%, #1a4a9a 50%, #0d2a5e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% 200%',
            animation: 'gradientShift 4s ease-in-out infinite',
            letterSpacing: '0.02em'
          }}>
            REDEFINE<br/>POSSIBILITY
          </h1>
          
          <p style={{
            fontSize: '1.1rem',
            color: '#8899bb',
            maxWidth: '900px',
            margin: '0 auto',
            lineHeight: 1.8,
            fontWeight: 400
          }}>
            Where knowledge transcends traditional boundaries and learning becomes an infinite journey through interconnected worlds of discovery.
          </p>
        </div>

        {/* Interactive Timeline */}
        <div style={{
          marginBottom: '100px',
          maxWidth: '1400px',
          margin: '0 auto',
          paddingLeft: '40px',
          paddingRight: '40px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            marginBottom: '60px'
          }}>
            {/* Timeline Line */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '0',
              right: '0',
              height: '2px',
              background: 'linear-gradient(90deg, #4A9EFF, #1a4a9a, #0d2a5e)',
              transform: 'translateY(-50%)',
              zIndex: 0
            }} />
            
            {/* Timeline Points */}
            {sections.map((section, index) => (
              <div
                key={index}
                onClick={() => setActiveSection(index)}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  width: activeSection === index ? '60px' : '40px',
                  height: activeSection === index ? '60px' : '40px',
                  borderRadius: '50%',
                  background: activeSection === index ? section.color : 'rgba(255, 255, 255, 0.1)',
                  border: `2px solid ${section.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: activeSection === index ? '1.2rem' : '0.9rem',
                  transition: 'all 0.3s ease',
                  boxShadow: activeSection === index ? `0 0 30px ${section.color}66` : 'none'
                }}>
                  {section.icon}
                </div>
                <div style={{
                  position: 'absolute',
                  top: activeSection === index ? '80px' : '60px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  opacity: activeSection === index ? 1 : 0.7,
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: section.color,
                    marginBottom: '4px'
                  }}>
                    {section.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Active Section Content */}
          <div style={{
            background: 'rgba(74, 158, 255, 0.05)',
            border: '1px solid rgba(74, 158, 255, 0.1)',
            borderRadius: '20px',
            padding: '48px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            textAlign: 'center',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            animation: 'contentFade 0.5s ease'
          }}>
            <h3 style={{
              fontSize: '2.2rem',
              fontWeight: 700,
              color: sections[activeSection].color,
              marginBottom: '12px',
              letterSpacing: '0.05em'
            }}>
              {sections[activeSection].title}
            </h3>
            <h4 style={{
              fontSize: '1.1rem',
              color: '#8899bb',
              marginBottom: '24px',
              fontWeight: 400
            }}>
              {sections[activeSection].subtitle}
            </h4>
            <p style={{
              fontSize: '1rem',
              color: '#e8f0fe',
              lineHeight: 1.7,
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              {sections[activeSection].content}
            </p>
          </div>
        </div>

        {/* Principles Grid */}
        <div style={{
          marginBottom: '100px',
          maxWidth: '1400px',
          margin: '0 auto',
          paddingLeft: '40px',
          paddingRight: '40px'
        }}>
          <h2 style={{
            fontSize: '2.2rem',
            fontWeight: 700,
            color: '#e8f0fe',
            textAlign: 'center',
            marginBottom: '60px',
            letterSpacing: '0.05em'
          }}>
            Core Principles
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            perspective: '1000px'
          }}>
            {principles.map((principle, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(5, 11, 26, 0.6)',
                  border: '1px solid rgba(74, 158, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '32px',
                  transform: `rotateY(${principle.angle}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'rotateY(0deg) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(74, 158, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = `rotateY(${principle.angle}deg) scale(1)`;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: `conic-gradient(from ${index * 90}deg, transparent, rgba(74, 158, 255, 0.1), transparent)`,
                  animation: `rotate ${10 + index * 2}s linear infinite`
                }} />
                
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: '#4A9EFF',
                  marginBottom: '16px',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {principle.title}
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: '#8899bb',
                  lineHeight: 1.6,
                  position: 'relative',
                  zIndex: 1
                }}>
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div style={{
          marginBottom: '80px',
          maxWidth: '1400px',
          margin: '0 auto',
          paddingLeft: '40px',
          paddingRight: '40px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px'
          }}>
            {metrics.map((stat, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  padding: '32px',
                  background: 'rgba(5, 11, 26, 0.6)',
                  border: '1px solid rgba(74, 158, 255, 0.1)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  animation: `slideUp 0.6s ease ${stat.delay}ms both`
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #4A9EFF, #1a4a9a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '12px',
                  lineHeight: 1
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#8899bb',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontFamily: "'Rajdhani', sans-serif"
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          textAlign: 'center',
          padding: '60px 40px',
          maxWidth: '1000px',
          margin: '0 auto',
          paddingLeft: '40px',
          paddingRight: '40px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(74, 158, 255, 0.1), rgba(26, 74, 154, 0.05))',
            border: '1px solid rgba(74, 158, 255, 0.2)',
            borderRadius: '24px',
            padding: '48px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(74, 158, 255, 0.1) 0%, transparent 70%)',
              animation: 'pulseGlow 3s ease-in-out infinite'
            }} />
            
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#e8f0fe',
              marginBottom: '16px',
              position: 'relative',
              zIndex: 1
            }}>
              Your Journey Awaits
            </h2>
            
            <p style={{
              fontSize: '1rem',
              color: '#8899bb',
              marginBottom: '32px',
              lineHeight: 1.6,
              position: 'relative',
              zIndex: 1
            }}>
              The NeuroVerse is more than a platform — it's a new dimension of learning. 
              Start your exploration today and discover where curiosity can take you.
            </p>
            
            <div style={{
              display: 'inline-flex',
              gap: '20px',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #4A9EFF, #1a4a9a)',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 32px rgba(74, 158, 255, 0.3)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                Begin Exploration
              </div>
              <div style={{
                padding: '16px 32px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(74, 158, 255, 0.2)',
                borderRadius: '12px',
                color: '#4A9EFF',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                letterSpacing: '0.05em'
              }}>
                Learn More
              </div>
            </div>
          </div>
        </div>

        {/* Subtle scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          opacity: 0.6
        }}>
          <div style={{
            width: '2px',
            height: '30px',
            background: 'linear-gradient(to bottom, #4A9EFF, transparent)',
            borderRadius: '2px'
          }} />
          <div style={{
            fontSize: '0.7rem',
            color: '#4A9EFF',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: "'Rajdhani', sans-serif"
          }}>
            Continue
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes neuralPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes lineFlow {
          0% { opacity: 0; transform: translateX(-100%) rotate(var(--rotation)); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateX(100%) rotate(var(--rotation)); }
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes contentFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(74, 158, 255, 0.3); }
          50% { box-shadow: 0 0 40px rgba(74, 158, 255, 0.6); }
        }
      `}</style>
    </div>
  );
}
