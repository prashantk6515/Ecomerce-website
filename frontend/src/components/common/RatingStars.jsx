import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 0, numReviews, size = 16 }) => {
  const roundedRating = Math.round(rating * 2) / 2;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <div style={{ display: 'inline-flex', gap: '2px', color: '#f59e0b' }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;
          return (
            <Star
              key={star}
              size={size}
              fill={filled ? '#f59e0b' : half ? 'rgba(245, 158, 11, 0.4)' : 'none'}
              stroke="#f59e0b"
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
        {Number(rating).toFixed(1)}
      </span>
      {numReviews !== undefined && (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          ({numReviews})
        </span>
      )}
    </div>
  );
};
