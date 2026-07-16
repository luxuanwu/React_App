import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tracks } from '../data/tracks';
import './Player.css';

const categories = ['全部', '流行', '电子', '放松', '民谣', '独立'];

const getDurationSeconds = (duration) => {
  const [minutes, seconds] = duration.split(':').map(Number);
  return minutes * 60 + seconds;
};

const formatTime = (seconds) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = String(safeSeconds % 60).padStart(2, '0');

  return `${minutes}:${remainingSeconds}`;
};

function Player() {
  const navigate = useNavigate();
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  const [likedTracks, setLikedTracks] = useState(() => new Set([1, 3]));
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(72);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const audioContextRef = useRef(null);
  const audioNodesRef = useRef(null);
  const volumeRef = useRef(volume);
  const username = localStorage.getItem('username') || 'Guest';
  const track = tracks[currentTrack];
  const likedCount = likedTracks.size;
  const durationSeconds = getDurationSeconds(track.duration);
  const elapsedSeconds = durationSeconds * (progress / 100);

  const filteredTracks = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return tracks.filter((item) => {
      const matchesCategory = category === '全部' || item.genre === category;
      const matchesQuery = !keyword || [item.title, item.artist, item.album, item.genre]
        .some((value) => value.toLowerCase().includes(keyword));

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const handleLogout = () => {
    stopAudio();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }

    return audioContextRef.current;
  }, []);

  const stopAudio = useCallback(() => {
    if (!audioNodesRef.current) {
      return;
    }

    audioNodesRef.current.oscillators.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch (error) {
        // Oscillators can only be stopped once.
      }
    });

    audioNodesRef.current = null;
  }, []);

  const startAudio = useCallback((item) => {
    const audioContext = getAudioContext();
    audioContext.resume();
    stopAudio();

    const mainOscillator = audioContext.createOscillator();
    const harmonyOscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();

    mainOscillator.type = item.wave;
    mainOscillator.frequency.value = item.frequency;
    harmonyOscillator.type = 'sine';
    harmonyOscillator.frequency.value = item.frequency * 1.5;
    filterNode.type = 'lowpass';
    filterNode.frequency.value = 1200;
    gainNode.gain.value = volumeRef.current / 100 * 0.12;

    mainOscillator.connect(filterNode);
    harmonyOscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    mainOscillator.start();
    harmonyOscillator.start();

    audioNodesRef.current = {
      gainNode,
      oscillators: [mainOscillator, harmonyOscillator]
    };
  }, [getAudioContext, stopAudio]);

  const playPrevious = () => {
    setCurrentTrack((index) => (index === 0 ? tracks.length - 1 : index - 1));
    setProgress(0);
    setIsPlaying(true);
  };

  const playNext = () => {
    if (shuffle) {
      const nextIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrack(nextIndex === currentTrack ? (nextIndex + 1) % tracks.length : nextIndex);
    } else {
      setCurrentTrack((index) => (index === tracks.length - 1 ? 0 : index + 1));
    }
    setProgress(0);
    setIsPlaying(true);
  };

  const selectTrack = (trackId) => {
    const nextIndex = tracks.findIndex((item) => item.id === trackId);
    setCurrentTrack(nextIndex);
    setIsPlaying(true);
    setProgress(0);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    startAudio(track);
    setIsPlaying(true);
  };

  const toggleLike = (trackId) => {
    setLikedTracks((current) => {
      const next = new Set(current);

      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }

      return next;
    });
  };

  useEffect(() => {
    volumeRef.current = volume;

    if (audioNodesRef.current) {
      audioNodesRef.current.gainNode.gain.value = volume / 100 * 0.12;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      startAudio(track);
    } else {
      stopAudio();
    }

    return () => {
      stopAudio();
    };
  }, [currentTrack, isPlaying, startAudio, stopAudio, track]);

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          if (repeat) {
            return 0;
          }

          if (shuffle) {
            const nextIndex = Math.floor(Math.random() * tracks.length);
            setCurrentTrack(nextIndex === currentTrack ? (nextIndex + 1) % tracks.length : nextIndex);
          } else {
            setCurrentTrack((index) => (index === tracks.length - 1 ? 0 : index + 1));
          }

          return 0;
        }

        return Math.min(100, value + 100 / durationSeconds);
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [currentTrack, durationSeconds, isPlaying, repeat, shuffle]);

  useEffect(() => {
    return () => {
      stopAudio();
      audioContextRef.current?.close();
    };
  }, [stopAudio]);

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
          <button type="button">我的收藏 · {likedCount}</button>
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

        <section className="player-tools" aria-label="音乐搜索和分类">
          <label className="player-search">
            <span>搜索</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索歌曲、艺人或专辑"
            />
          </label>

          <div className="category-tabs" aria-label="歌曲分类">
            {categories.map((item) => (
              <button
                className={category === item ? 'is-selected' : ''}
                type="button"
                key={item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="player-hero" aria-label="当前播放">
          <div className="player-cover" style={{ '--cover-color': track.color }}>
            <span>{track.title.slice(0, 1)}</span>
          </div>
          <div className="player-hero-copy">
            <p>{isPlaying ? '正在播放' : '已暂停'}</p>
            <h2>{track.title}</h2>
            <span>{track.artist} · {track.album} · {track.genre}</span>
            <div className="hero-actions">
              <button type="button" onClick={togglePlayback}>
                {isPlaying ? '暂停' : '播放'}
              </button>
              <button
                className={likedTracks.has(track.id) ? 'is-liked' : ''}
                type="button"
                onClick={() => toggleLike(track.id)}
              >
                {likedTracks.has(track.id) ? '已收藏' : '收藏'}
              </button>
            </div>
          </div>
        </section>

        <section className="quick-stats" aria-label="收听概览">
          <div>
            <strong>{tracks.length}</strong>
            <span>曲库歌曲</span>
          </div>
          <div>
            <strong>{likedCount}</strong>
            <span>我的收藏</span>
          </div>
          <div>
            <strong>{category}</strong>
            <span>当前分类</span>
          </div>
        </section>

        <section className="track-section" aria-label="推荐歌曲">
          <div className="section-heading">
            <h2>为你推荐</h2>
            <span>{filteredTracks.length} 首歌曲</span>
          </div>

          <div className="track-list">
            {filteredTracks.map((item) => {
              const trackIndex = tracks.findIndex((trackItem) => trackItem.id === item.id);

              return (
                <div
                  className={`track-row ${trackIndex === currentTrack ? 'is-current' : ''}`}
                  key={item.title}
                >
                  <button className="track-play-button" type="button" onClick={() => navigate(`/track/${item.id}`)}>
                    <span className="track-index">{trackIndex + 1}</span>
                    <span
                      className="track-inline-play"
                      role="button"
                      tabIndex={0}
                      onClick={(event) => {
                        event.stopPropagation();
                        selectTrack(item.id);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.stopPropagation();
                          selectTrack(item.id);
                        }
                      }}
                      aria-label="播放"
                    >
                      ▶
                    </span>
                    <span className="track-art" style={{ background: item.color }}>{item.title.slice(0, 1)}</span>
                    <span className="track-info">
                      <strong>{item.title}</strong>
                      <small>{item.artist}</small>
                    </span>
                    <span className="track-album">{item.album}</span>
                    <span className="track-genre">{item.genre}</span>
                    <span className="track-duration">{item.duration}</span>
                  </button>

                  <button
                    className={`track-like ${likedTracks.has(item.id) ? 'is-liked' : ''}`}
                    type="button"
                    onClick={() => toggleLike(item.id)}
                    aria-label={likedTracks.has(item.id) ? '取消收藏' : '收藏歌曲'}
                  >
                    ♥
                  </button>
                </div>
              );
            })}

            {filteredTracks.length === 0 && (
              <div className="empty-tracks">
                没有找到匹配的歌曲
              </div>
            )}
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
          <button
            className={shuffle ? 'is-enabled' : ''}
            type="button"
            onClick={() => setShuffle((value) => !value)}
            aria-label="随机播放"
          >
            ⇄
          </button>
          <button type="button" onClick={playPrevious} aria-label="上一首">‹</button>
          <button
            className="play-toggle"
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? 'Ⅱ' : '▶'}
          </button>
          <button type="button" onClick={playNext} aria-label="下一首">›</button>
          <button
            className={repeat ? 'is-enabled' : ''}
            type="button"
            onClick={() => setRepeat((value) => !value)}
            aria-label="循环播放"
          >
            ↻
          </button>
        </div>

        <div className="progress-area" aria-label="播放进度">
          <span>{formatTime(elapsedSeconds)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(event) => setProgress(Number(event.target.value))}
            aria-label="调整播放进度"
          />
          <span>{track.duration}</span>
        </div>

        <div className="volume-control" aria-label="音量">
          <span>音量</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            aria-label="调整音量"
          />
          <strong>{volume}</strong>
        </div>
      </footer>
    </main>
  );
}

export default Player;
