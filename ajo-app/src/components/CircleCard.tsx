'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CircleData, formatAddress, formatUSDC, formatNGN } from '@/lib/stellar';
import { Users, Clock, ArrowUpRight } from 'lucide-react';

interface CircleCardProps {
  circle: CircleData;
  onSelect: (circle: CircleData) => void;
}

export const CircleCard: React.FC<CircleCardProps> = ({ circle, onSelect }) => {
  const potSize = circle.amount * circle.maxMembers;
  const isFull = circle.members.length >= circle.maxMembers;
  const progressPercent = Math.round((circle.members.length / circle.maxMembers) * 100);

  const statusBadges = {
    Created: {
      color: 'bg-zinc-800 text-zinc-300 border-zinc-700',
      dot: 'bg-zinc-400 animate-pulse',
    },
    Active: {
      color: 'bg-white text-black border-white font-bold',
      dot: 'bg-black animate-pulse',
    },
    Completed: {
      color: 'bg-zinc-900 text-zinc-400 border-zinc-800',
      dot: 'bg-zinc-500',
    },
    Cancelled: {
      color: 'bg-zinc-900 text-zinc-500 border-zinc-800 line-through',
      dot: 'bg-zinc-600',
    },
  };

  const badge = statusBadges[circle.status] || statusBadges.Created;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-zinc-900/90 border border-zinc-800 hover:border-white p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group transition-all"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-black border border-zinc-700 flex items-center justify-center text-white font-mono font-bold text-xs">
              #{circle.id}
            </div>
            <div>
              <h3 className="font-bold text-white group-hover:text-zinc-200 transition-colors">
                Circle #{circle.id}
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono">
                Admin: {formatAddress(circle.admin, 5)}
              </p>
            </div>
          </div>

          <span
            className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono border flex items-center gap-1.5 ${badge.color}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            {circle.status}
          </span>
        </div>

        {/* Stats Box */}
        <div className="grid grid-cols-2 gap-3 my-4 bg-black p-3.5 rounded-xl border border-zinc-800">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono block">
              Round Pot
            </span>
            <span className="text-lg font-extrabold text-white font-mono">{formatUSDC(potSize)}</span>
            <span className="text-[10px] text-zinc-400 block font-mono">{formatNGN(potSize)}</span>
          </div>

          <div>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono block">
              Per Member
            </span>
            <span className="text-sm font-semibold text-zinc-300 font-mono">{formatUSDC(circle.amount)}</span>
            <span className="text-[10px] text-zinc-400 block font-mono">{formatNGN(circle.amount)}</span>
          </div>
        </div>

        {/* Roster Progress Bar */}
        <div className="my-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-white" /> Members
            </span>
            <span className="text-xs font-semibold text-white">
              {circle.members.length} / {circle.maxMembers} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </div>

        {/* Info Rows */}
        <div className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-zinc-800 font-mono">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-white" /> Frequency
            </span>
            <span className="font-medium text-white">
              {circle.periodSecs >= 86400
                ? `${Math.round(circle.periodSecs / 86400)} Days`
                : `${Math.round(circle.periodSecs / 3600)} Hours`}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onSelect(circle)}
        className="mt-5 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
      >
        <span>Inspect Circle</span>
        <ArrowUpRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
