import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tracks } from '../data/tracks';
import useAudioPlayer from '../hooks/useAudioPlayer';
import './TrackDetail.css';

const formatLyrics = () => [
  '作曲 : Soundify Studio',
  '作词 : Soundify Studio',
  '',
  '夜色温柔 霓虹闪烁',
  '城市的脉搏 在耳边跳动',
  '穿过街道 追逐光影',
  '这一刻 只属于你和我',
  '',
  '让音乐带走所有疲惫',
  '让旋律成为最好的陪伴',
  '在这座城市里流浪',
  '找到属于自己的节奏'
];

const comments = [
  { id: 1, user: '音乐旅人', text: '这首歌真的太有感觉了，循环一整天！', likes: 128 },
  { id: 2, user: '夜行者', text: '编曲很高级，越听越上头。', likes: 86 },
  { id: 3, user: 'Echo', text: '完美适合深夜独处的时候听。', likes: 64 }
];

function TrackDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTrack, isPlaying, playTrack, togglePlayback } = useAudioPlayer();
  const trackId = Number(id);

  const track = useMemo(() => tracks.find((item) => item.id === trackId), [trackId]);
  const isCurrentTrack = currentTrack?.id === track?.id;

  if (!track) {
    return (
      <main className="track-detail-shell">
        <div className="track-detail-empty">
          <p>未找到该歌曲</p>
          <button type="button" onClick={() => navigate('/player')}>返回音乐列表</button>
        </div>
      </main>
    );
  }

  const relatedTracks = tracks.filter((item) => item.id !== track.id).slice(0, 5);

  const handlePlay = () => {
    if (isCurrentTrack) {
      togglePlayback();
    } else {
      playTrack(track);
    }
  };

  const handleSelectRelated = (relatedId) => {
    navigate(`/track/${relatedId}`);
  };

  return (
    <main className="track-detail-shell" style={{ '--theme-color': track.color }}>
      <div className="track-detail-backdrop" />

      <div className="track-detail-content">
        <button className="track-detail-back" type="button" onClick={() => navigate('/player')}>
          ← 返回音乐列表
        </button>

        <section className="track-detail-hero" aria-label="歌曲信息">
          <div className="track-detail-cover">
            <span>{track.title.slice(0, 1)}</span>
          </div>

          <div className="track-detail-info">
            <div className="track-detail-title-row">
              <span className="track-detail-tag">单曲</span>
              <h1>{track.title}</h1>
            </div>

            <div className="track-detail-meta">
              <span className="track-detail-artist">{track.artist}</span>
              <span>专辑：{track.album}</span>
              <span>流派：{track.genre}</span>
              <span>时长：{track.duration}</span>
            </div>

            <div className="track-detail-actions">
              <button className="track-detail-play" type="button" onClick={handlePlay}>
                {isCurrentTrack && isPlaying ? 'Ⅱ 暂停' : '▶ 播放'}
              </button>
              <button className="track-detail-like" type="button">
                ♥ 收藏
              </button>
              <button className="track-detail-share" type="button">
                ⇧ 分享
              </button>
              <button className="track-detail-comment" type="button">
                ✎ 评论
              </button>
            </div>

            <div className="track-detail-counts">
              <span>播放：12,345</span>
              <span>收藏：1,892</span>
              <span>评论：{comments.length}</span>
            </div>
          </div>
        </section>

        <section className="track-detail-body">
          <div className="track-detail-lyrics">
            <h2>歌词</h2>
            <div className="track-detail-lyrics-content">
              {formatLyrics().map((line, index) => (
                <p key={index}>{line || '\u00A0'}</p>
              ))}
            </div>
          </div>

          <aside className="track-detail-sidebar">
            <div className="track-detail-section">
              <h2>相似推荐</h2>
              <div className="track-detail-related">
                {relatedTracks.map((item) => (
                  <button
                    className="related-row"
                    type="button"
                    key={item.id}
                    onClick={() => handleSelectRelated(item.id)}
                  >
                    <span className="related-art" style={{ background: item.color }}>
                      {item.title.slice(0, 1)}
                    </span>
                    <span className="related-info">
                      <strong>{item.title}</strong>
                      <small>{item.artist}</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="track-detail-section">
              <h2>精彩评论</h2>
              <div className="track-detail-comments">
                {comments.map((item) => (
                  <div className="comment-row" key={item.id}>
                    <span className="comment-avatar">{item.user.slice(0, 1)}</span>
                    <div className="comment-body">
                      <strong>{item.user}</strong>
                      <p>{item.text}</p>
                      <span className="comment-likes">♥ {item.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default TrackDetail;
