import React from 'react';
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  MainSectionId,
  StageProgressStat,
  getStageProgressStats,
} from '../data/manualData';

interface SidebarProgressChartProps {
  completedIds: string[];
  activeSection: MainSectionId;
  isDark: boolean;
  onSelectStage: (sectionId: MainSectionId) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: StageProgressStat }>;
}

const StageTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const stat = payload[0].payload;

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#151A24] px-3 py-2 shadow-xl text-xs">
      <div className="font-semibold text-slate-900 dark:text-slate-100">
        {stat.stageCode}. {stat.fullTitle}
      </div>
      <div className="mt-1 flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300 font-mono tabular-nums">
        <span>
          완료: {stat.completed} / {stat.total}
        </span>
        <span className="font-bold text-amber-600 dark:text-amber-400">
          {stat.percentage}%
        </span>
      </div>
    </div>
  );
};

export const SidebarProgressChart: React.FC<SidebarProgressChartProps> = ({
  completedIds,
  activeSection,
  isDark,
  onSelectStage,
}) => {
  const data = getStageProgressStats(completedIds);

  const trackFill = isDark ? '#1A202E' : '#E2E8F0';
  const axisColor = isDark ? '#94A3B8' : '#475569';
  const labelColor = isDark ? '#CBD5E1' : '#334155';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
        <span>5단계별 완료율</span>
        <span className="font-mono tabular-nums">0% – 100%</span>
      </div>

      <div className="w-full h-[142px]">
        <ResponsiveContainer width="100%" height={142} minWidth={0}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 2, right: 34, left: 0, bottom: 2 }}
            barCategoryGap={5}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              type="category"
              dataKey="shortLabel"
              width={54}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: axisColor,
                fontSize: 11,
                fontWeight: 500,
              }}
            />
            <Tooltip
              content={<StageTooltip />}
              cursor={{
                fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)',
              }}
            />
            <Bar
              dataKey="percentage"
              barSize={12}
              radius={[4, 4, 4, 4]}
              background={{ fill: trackFill, radius: 4 }}
              isAnimationActive={true}
              animationDuration={250}
              className="cursor-pointer"
              onClick={(entry) => {
                const stat = entry?.payload as StageProgressStat | undefined;
                if (stat?.sectionId) {
                  onSelectStage(stat.sectionId);
                }
              }}
            >
              {data.map((entry) => {
                const isDone = entry.percentage === 100;
                const isCurrent = entry.sectionId === activeSection;
                const fill = isDone
                  ? '#10B981'
                  : entry.percentage > 0
                    ? '#F59E0B'
                    : isCurrent
                      ? '#64748B'
                      : '#475569';

                return (
                  <Cell
                    key={entry.sectionId}
                    fill={fill}
                    fillOpacity={entry.percentage === 0 ? 0.35 : 1}
                  />
                );
              })}
              <LabelList
                dataKey="percentage"
                position="right"
                formatter={(val: unknown) => `${val ?? 0}%`}
                style={{
                  fill: labelColor,
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  fontVariantNumeric: 'tabular-nums',
                  fontWeight: 600,
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
