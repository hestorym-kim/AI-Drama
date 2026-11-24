import React from 'react';

interface HighlightTextProps {
  text: string;
  query: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({ text, query }) => {
  const trimmed = query.trim();
  if (!trimmed) {
    return <>{text}</>;
  }

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const splitRegex = new RegExp(`(${escaped})`, 'gi');
  const exactRegex = new RegExp(`^${escaped}$`, 'i');
  const parts = text.split(splitRegex);

  return (
    <>
      {parts.map((part, idx) =>
        exactRegex.test(part) ? (
          <mark key={idx} className="search-hit">
            {part}
          </mark>
        ) : (
          <React.Fragment key={idx}>{part}</React.Fragment>
        )
      )}
    </>
  );
};
