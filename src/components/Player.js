import React, { useState } from 'react';
import './Player.css';

const tracks = [
  {
    title: 'Midnight Pulse',
    artist: 'Luna Park',
    album: 'After Hours',
    duration: '3:42',
    color: '#1ed760'
  },
  {
    title: 'Neon Drive',
    artist: 'City Echo',
    album: 'Night Route',
    duration: '4:08',
    color: '#ff7a59'
  },
  {
    title: 'Ocean Static',
    artist: 'Wave Room',
    album: 'Blue Signal',
    duration: '2:57',
    color: '#4da3ff'
  },
  {
    title: 'Soft Gravity',
    artist: 'Mira Vale',
    album: 'Low Light',
    duration: '3:29',
    color: '#f2c94c'
  }
];

function Player() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const username = localStorage.getItem('username') || 'Guest';
  const track = tracks[currentTrack];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  const playPrevious = () => {
    setCurrentTrack((index) => (index === 0 ? tracks.length - 1 : index - 1));
  };

  const playNext = () => {
    setCurrentTrack((index) => (index === tracks.length - 1 ? 0 : index + 1));
  };

  return (
    <main className="player-shell">
      <aside className="player-sidebar">
        <div className="player-brand">
          <div className="player-brand-mark" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>Soundify</span>
        </div>

        <nav className="player-nav" aria-label="音乐导航">
          <button className="is-active" type="button">首页</button>
          <button type="button">搜索</button>
          <button type="button">音乐库</button>
        </nav>

        <div className="player-playlists">
          <p>播放列表</p>
          <button type="button">每日推荐</button>
          <button type="button">夜间驾驶</button>
          <button type="button">流行热歌</button>
        </div>
      </aside>

      <section className="player-main">
        <header className="player-topbar">
          <div>
            <p>欢迎回来，{username}</p>
            <h1>今天想听什么？</h1>
          </div>
          <button className="player-logout" type="button" onClick={handleLogout}>退出</button>
        </header>

        <section className="player-hero" aria-label="当前播放">
          <div className="player-cover" style={{ '--cover-color': track.color }}>
            <span>{track.title.slice(0, 1)}</span>
          </div>
          <div className="player-hero-copy">
            <p>正在播放</p>
            <h2>{track.title}</h2>
            <span>{track.artist} · {track.album}</span>
          </div>
        </section>

        <section className="track-section" aria-label="推荐歌曲">
          <div className="section-heading">
            <h2>为你推荐</h2>
            <span>{tracks.length} 首歌曲</span>
          </div>

          <div className="track-list">
            {tracks.map((item, index) => (
              <button
                className={`track-row ${index === currentTrack ? 'is-current' : ''}`}
                type="button"
                key={item.title}
                onClick={() => {
                  setCurrentTrack(index);
                  setIsPlaying(true);
                }}
              >
                <span className="track-index">{index + 1}</span>
                <span className="track-art" style={{ background: item.color }}>{item.title.slice(0, 1)}</span>
                <span className="track-info">
                  <strong>{item.title}</strong>
                  <small>{item.artist}</small>
                </span>
                <span className="track-album">{item.album}</span>
                <span className="track-duration">{item.duration}</span>
              </button>
            ))}
          </div>
        </section>
      </section>

      <footer className="now-playing-bar">
        <div className="now-track">
          <span className="mini-cover" style={{ background: track.color }}>{track.title.slice(0, 1)}</span>
          <span>
            <strong>{track.title}</strong>
            <small>{track.artist}</small>
          </span>
        </div>

        <div className="player-controls">
          <button type="button" onClick={playPrevious} aria-label="上一首">‹</button>
          <button
            className="play-toggle"
            type="button"
            onClick={() => setIsPlaying((value) => !value)}
            aria-label={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? 'Ⅱ' : '▶'}
          </button>
          <button type="button" onClick={playNext} aria-label="下一首">›</button>
        </div>

        <div className="progress-area" aria-label="播放进度">
          <span>1:18</span>
          <div className="progress-track">
            <div className="progress-fill"></div>
          </div>
          <span>{track.duration}</span>
        </div>
      </footer>
    </main>
  );
}

export default Player;
