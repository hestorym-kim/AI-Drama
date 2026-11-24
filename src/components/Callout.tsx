import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';

type CalloutVariant = 'tip' | 'warning' | 'info' | 'success';

interface CalloutProps {
  variant?: CalloutVariant;
  title: string;
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<
  CalloutVariant,
  {
    wrapper: string;
    titleColor: string;
    icon: React.ReactNode;
  }
> = {
  tip: {
    wrapper:
      'bg-amber-50/70 dark:bg-amber-500/[0.07] border border-amber-200 dark:border-amber-500/25',
    titleColor: 'text-amber-900 dark:text-amber-300',
    icon: <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
  },
  warning: {
    wrapper:
      'bg-rose-50/70 dark:bg-rose-500/[0.07] border border-rose-200 dark:border-rose-500/25',
    titleColor: 'text-rose-900 dark:text-rose-300',
    icon: <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
  },
  info: {
    wrapper:
      'bg-sky-50/70 dark:bg-sky-500/[0.07] border border-sky-200 dark:border-sky-500/25',
    titleColor: 'text-sky-900 dark:text-sky-300',
    icon: <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />,
  },
  success: {
    wrapper:
      'bg-emerald-50/70 dark:bg-emerald-500/[0.07] border border-emerald-200 dark:border-emerald-500/25',
    titleColor: 'text-emerald-900 dark:text-emerald-300',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
  },
};

export const Callout: React.FC<CalloutProps> = ({
  variant = 'tip',
  title,
  children,
}) => {
  const style = VARIANT_STYLES[variant];
  return (
    <div className={`rounded-xl p-4 sm:p-5 ${style.wrapper}`}>
      <div className="flex items-center gap-2 mb-2">
        {style.icon}
        <h4 className={`text-sm font-semibold ${style.titleColor}`}>{title}</h4>
      </div>
      <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </div>
  );
};
