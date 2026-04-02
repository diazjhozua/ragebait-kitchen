import { useState } from 'react';
import { getGifForScore, getGifUrl } from '../../utils/gordonGifs';

interface GordonGifProps {
  score: number;
  scoreColor: string;
}

export default function GordonGif({ score, scoreColor }: GordonGifProps) {
  const [gifId] = useState(() => getGifForScore(score));
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (errored) return null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      style={{
        border: `1px solid ${scoreColor}33`,
        boxShadow: `0 0 24px ${scoreColor}18, 0 4px 16px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Loading skeleton */}
      {!loaded && (
        <div
          className="animate-pulse w-full"
          style={{
            height: '340px',
            background: 'linear-gradient(135deg, rgba(30,0,0,0.8) 0%, rgba(60,10,10,0.6) 100%)',
          }}
        />
      )}

      {/* GIF — capped height, full image visible */}
      <img
        src={getGifUrl(gifId)}
        alt="Gordon Ramsay reacting"
        className={loaded ? 'block w-full' : 'hidden'}
        style={{ maxHeight: '340px', objectFit: 'contain', background: 'rgba(10,0,0,0.8)' }}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
      />

      {/* GIPHY attribution — bottom-right corner overlay */}
      {loaded && (
        <a
          href="https://giphy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-1.5 right-2 text-[10px] text-white/40 hover:text-white/70 transition-colors"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
        >
          GIPHY
        </a>
      )}
    </div>
  );
}
