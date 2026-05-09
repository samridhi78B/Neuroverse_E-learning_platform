import { useState } from "react";

const NeuroVerseAuth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just simulate successful authentication
    // You can add real authentication logic later
    onAuthSuccess({ email, name: name || email.split('@')[0] });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0823 0%, #1a1147 50%, #2d1b69 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Exo 2', sans-serif"
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #7C4DFF 0%, #00BCD4 100%)',
            borderRadius: '15px',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(124, 77, 255, 0.3)'
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.2)"/>
              <circle cx="6" cy="16" r="2" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.2)"/>
              <circle cx="18" cy="16" r="2" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.2)"/>
              <line x1="12" y1="11" x2="7" y2="14.5" stroke="white" strokeWidth="1" opacity="0.7"/>
              <line x1="12" y1="11" x2="17" y2="14.5" stroke="white" strokeWidth="1" opacity="0.7"/>
              <line x1="8" y1="16" x2="16" y2="16" stroke="white" strokeWidth="1" opacity="0.4"/>
            </svg>
          </div>
          <h1 style={{
            color: '#ffffff',
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '10px',
            letterSpacing: '0.1em'
          }}>
            NEUROVERSE
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px'
          }}>
            {isLogin ? 'Welcome back to the galaxy' : 'Join the learning revolution'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                placeholder="Enter your name"
              />
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              placeholder="Enter your email"
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #7C4DFF 0%, #00BCD4 100%)',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(124, 77, 255, 0.3)',
              marginBottom: '20px'
            }}
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '14px'
          }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: '#7C4DFF',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginLeft: '8px',
                textDecoration: 'underline'
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NeuroVerseAuth;
