import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { HighlightText } from './HighlightText';

interface CodePromptBoxProps {
  title: string;
  content: string;
  subtitle?: string;
  searchQuery?: string;
  compact?: boolean;
}

export const CodePromptBox: React.FC<CodePromptBoxProps> = ({
  title,
  content,
  subtitle,
  searchQuery = '',
  compact = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback for restricted clipboard environments
      const textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-[#0B0E14] text-slate-100 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-800/80 dark:bg-[#131822] border-b border-slate-700/70 dark:border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <Terminal className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
          <span className="text-xs font-medium text-slate-200 truncate">{title}</span>
          {subtitle && (
            <>
              <span className="text-slate-600 text-xs hidden sm:inline" aria-hidden="true">
                ·
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline truncate">
                {subtitle}
              </span>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
            copied
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-700/70 hover:bg-slate-700 text-slate-200 border border-slate-600/60'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>복사 완료</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>원클릭 복사</span>
            </>
          )}
        </button>
      </div>
      <pre
        className={`font-mono overflow-x-auto leading-relaxed text-slate-200 whitespace-pre-wrap break-words ${
          compact ? 'px-4 py-3 text-xs' : 'px-4 py-4 text-[13px]'
        }`}
      >
        <code>
          <HighlightText text={content} query={searchQuery} />
        </code>
      </pre>
    </div>
  );
};
