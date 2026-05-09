import { useState, useEffect, useRef } from "react";

export default function NeuroVerseAuth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Simulate authentication
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        email,
        name: name || email.split('@')[0],
        avatar: name ? name.substring(0, 2).toUpperCase() : email.substring(0, 2).toUpperCase()
      };
      
      onAuthSuccess(userData);
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: `
        radial-gradient(ellipse at 20% 10%, rgba(124, 77, 255, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 90%, rgba(0, 188, 212, 0.12) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 50%, rgba(168, 216, 234, 0.08) 0%, transparent 70%),
        linear-gradient(135deg, #050b1a 0%, #07101f 50%, #05080f 100%)
      `,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        {/* Floating Orbs */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${i % 2 === 0 ? 'rgba(124, 77, 255, 0.1)' : 'rgba(0, 188, 212, 0.08)'} 0%, transparent 70%)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${15 + i * 3}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
        
        {/* Grid Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(74, 158, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 158, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1200px',
        padding: '40px 20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'center'
      }}>
        
        {/* Left Side - Branding */}
        <div style={{
          textAlign: 'left',
          color: '#e8f0fe'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '32px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7C4DFF 0%, #00BCD4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 8px 32px rgba(124, 77, 255, 0.3)'
            }}>◎</div>
            <span style={{
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              background: 'linear-gradient(90deg, #E1BEE7 0%, #B388FF 50%, #00BCD4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>NEUROVERSE</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: '24px',
            letterSpacing: '-0.02em'
          }}>
            THE FUTURE OF<br/>
            <span style={{
              background: 'linear-gradient(90deg, #00BCD4 0%, #B388FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>LEARNING</span><br/>
            IS HERE
          </h1>

          <p style={{
            fontSize: '1.1rem',
            lineHeight: 1.6,
            color: '#8899bb',
            marginBottom: '40px',
            maxWidth: '500px'
          }}>
            Navigate through subject planets. Master skills through interactive challenges. 
            Earn XP and rise through the neuroverse of knowledge.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {[
              { icon: '🌍', title: 'EXPLORE PLANETS', desc: '7 unique subject worlds' },
              { icon: '🎯', title: 'MASTER SKILLS', desc: 'Interactive challenges' },
              { icon: '🏆', title: 'EARN REWARDS', desc: 'XP, badges & gems' },
              { icon: '🚀', title: 'TRACK PROGRESS', desc: 'Analytics & streaks' }
            ].map((feature, i) => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '20px',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{feature.icon}</div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#4A9EFF',
                  marginBottom: '4px'
                }}>{feature.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#8899bb' }}>{feature.desc}</div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            fontSize: '0.9rem',
            color: '#8899bb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}/>
              <span>24,891 Active Learners</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4A9EFF' }}/>
              <span>2.4M XP Awarded</span>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '48px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              color: '#e8f0fe',
              marginBottom: '8px'
            }}>
              {isLogin ? 'Welcome Back' : 'Join the Revolution'}
            </h2>
            <p style={{ color: '#8899bb', fontSize: '0.9rem' }}>
              {isLogin ? 'Continue your learning journey' : 'Start your adventure in the NeuroVerse'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  color: '#8899bb',
                  fontSize: '0.85rem',
                  marginBottom: '8px',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: '#e8f0fe',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(74, 158, 255, 0.4)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#8899bb',
                fontSize: '0.85rem',
                marginBottom: '8px',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: '#e8f0fe',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(74, 158, 255, 0.4)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                placeholder="your@email.com"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: '#8899bb',
                fontSize: '0.85rem',
                marginBottom: '8px',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: '#e8f0fe',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(74, 158, 255, 0.4)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(255, 68, 68, 0.1)',
                border: '1px solid rgba(255, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                color: '#ff6b6b',
                fontSize: '0.85rem',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px',
                background: isLoading 
                  ? 'rgba(74, 158, 255, 0.3)' 
                  : 'linear-gradient(135deg, #4A9EFF 0%, #00BCD4 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isLoading ? 'none' : '0 8px 32px rgba(74, 158, 255, 0.3)',
                marginBottom: '20px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 40px rgba(74, 158, 255, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 32px rgba(74, 158, 255, 0.3)';
                }
              }}
            >
              {isLoading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#8899bb', fontSize: '0.9rem' }}>
              {isLogin ? "New to NeuroVerse?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4A9EFF',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginLeft: '8px',
                  textDecoration: 'underline',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#00BCD4'}
                onMouseLeave={(e) => e.target.style.color = '#4A9EFF'}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(10px) rotate(-1deg); }
        }
      `}</style>
    </div>
  );
}
