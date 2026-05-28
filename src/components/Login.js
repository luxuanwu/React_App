// src/components/Login.js
import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('用户名和密码不能为空');
      return;
    }
    
    // 模拟登录成功
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    
    // 返回上一页或进入音乐播放页
    const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/player';
    window.location.href = redirectUrl;
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
          <button className="music-social-button" type="button">继续使用 Google</button>
          <button className="music-social-button" type="button">继续使用 Apple</button>
          <button className="music-social-button" type="button">继续使用手机号</button>
        </div>

        <div className="music-divider" aria-hidden="true"></div>

        <form className="music-login-form" onSubmit={handleSubmit}>
          <div className="music-field">
            <label>用户名或邮箱</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
            />
          </div>
          <div className="music-field">
            <label>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
            />
          </div>

          <label className="music-remember">
            <input type="checkbox" defaultChecked />
            <span>记住我</span>
          </label>

          {error && <div className="music-error">{error}</div>}

          <button className="music-submit-button" type="submit">
            登录
          </button>
        </form>

        <a className="music-forgot-link" href="/login">忘记密码？</a>

        <p className="music-signup">
          还没有账号？<a href="/login">注册 Soundify</a>
        </p>
      </section>
    </main>
  );
};

export default Login;
