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
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative rounded-xl overflow-hidden w-full"
        style={{
          maxWidth: '340px',
          border: `1px solid ${scoreColor}33`,
          boxShadow: `0 0 24px ${scoreColor}18, 0 4px 16px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Loading skeleton */}
        {!loaded && (
          <div
            className="animate-pulse"
            style={{
              height: '200px',
              background: 'linear-gradient(135deg, rgba(30,0,0,0.8) 0%, rgba(60,10,10,0.6) 100%)',
            }}
          />
        )}

        {/* GIF — kept in DOM while loading so the browser fetches it */}
        <img
          src={getGifUrl(gifId)}
          alt="Gordon Ramsay reacting"
          className={loaded ? 'block w-full' : 'hidden'}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      </div>

      {loaded && (
        <a
          href="https://giphy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-steel-600 hover:text-steel-500 transition-colors"
        >
          Powered by GIPHY
        </a>
      )}
    </div>
  );
}
