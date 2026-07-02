// src/components/Login.js
import React, { useEffect, useState } from 'react';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState(localStorage.getItem('rememberedUsername') || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(Boolean(localStorage.getItem('rememberedUsername')));
  const [showPassword, setShowPassword] = useState(false);

  const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/player';

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  const completeLogin = (loginName) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', loginName);

    if (rememberMe) {
      localStorage.setItem('rememberedUsername', loginName);
    } else {
      localStorage.removeItem('rememberedUsername');
    }

    window.location.href = redirectUrl;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password) {
      setError('用户名和密码不能为空');
      return;
    }

    setError('');
    completeLogin(trimmedUsername);
  };

  const handleQuickLogin = (loginName) => {
    setUsername(loginName);
    setPassword('demo123');
    setError('');
    completeLogin(loginName);
  };

  return (
    <main className="music-login-page">
      <section className="music-login-panel" aria-label="登录">
        <div className="music-brand">
          <div className="music-brand-mark" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>Soundify</span>
        </div>

        <h1>登录后开始听歌</h1>

        <div className="music-social-group">
          <button className="music-social-button" type="button" onClick={() => handleQuickLogin('Google User')}>继续使用 Google</button>
          <button className="music-social-button" type="button" onClick={() => handleQuickLogin('Apple User')}>继续使用 Apple</button>
          <button className="music-social-button" type="button" onClick={() => handleQuickLogin('Phone User')}>继续使用手机号</button>
        </div>

        <div className="music-divider" aria-hidden="true"></div>

        <form className="music-login-form" onSubmit={handleSubmit}>
          <div className="music-field">
            <label>用户名或邮箱</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="请输入用户名"
              autoComplete="username"
            />
          </div>
          <div className="music-field">
            <label>密码</label>
            <div className="password-control">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="请输入密码"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
              >
                {showPassword ? '隐藏' : '显示'}
              </button>
            </div>
          </div>

          <label className="music-remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>记住我</span>
          </label>

          {error && <div className="music-error">{error}</div>}

          <button className="music-submit-button" type="submit">
            登录
          </button>
        </form>

        <button className="music-demo-button" type="button" onClick={() => handleQuickLogin('Demo Listener')}>
          快速体验播放器
        </button>

        <p className="music-signup">
          还没有账号？<button type="button" onClick={() => handleQuickLogin('New Listener')}>注册 Soundify</button>
        </p>
      </section>
    </main>
  );
};

export default Login;
