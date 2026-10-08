'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, UserPlus, Coins, Gift, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    icon: PlusCircle,
    title: '1. Create Circle',
    subtitle: 'Admin Setup',
    description: 'Circle creator defines contribution amount in USDC, member limit (e.g. 5 members), and round frequency (e.g. Weekly).',
    badge: 'Soroban Init',
    detail: 'Deploys circle state on-chain with deterministic parameters.',
  },
  {
    id: 2,
    icon: UserPlus,
    title: '2. Join Roster',
    subtitle: 'Member Onboarding',
    description: 'Group members connect Freighter wallet and execute join(circle_id). Membership locks when max limit is reached.',
    badge: 'require_auth()',
    detail: 'Contract verifies unique member addresses & locks rotation.',
  },
  {
    id: 3,
    icon: Coins,
    title: '3. Periodic Contribution',
    subtitle: 'Escrow Pool',
    description: 'Each round, members approve and transfer their fixed contribution into the Soroban smart contract escrow.',
    badge: 'USDC SAC',
    detail: 'Stellar Asset Contract handles token transfers securely.',
  },
  {
    id: 4,
    icon: Gift,
    title: '4. Automated Payout',
    subtitle: 'Round Settlement',
    description: 'Once all contributions arrive, the smart contract disburses the entire round pot (~500 USDC) to the current turn recipient.',
    badge: 'Auto Turn',
    detail: 'Rounds advance automatically until every member receives their turn.',
  },
];

export const WorkflowVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="my-16">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono inline-block mb-2">
          Protocol Architecture
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          How Ajo Protocol Works
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-mono">
          Digitizing traditional ROSCAs on Stellar Soroban with transparent smart contract mechanics.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto mb-6">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-xl text-left border transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-white text-black border-white shadow-lg'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
              }`}
            >
              <div className="relative z-10 flex items-center justify-between mb-2">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                    isActive ? 'bg-black text-white' : 'bg-zinc-800 text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                  isActive ? 'bg-zinc-200 text-black border-zinc-300' : 'bg-black text-zinc-400 border-zinc-800'
                }`}>
                  Step 0{step.id}
                </span>
              </div>

              <div className="relative z-10">
                <h4 className={`font-bold text-sm ${isActive ? 'text-black' : 'text-white'}`}>
                  {step.subtitle}
                </h4>
                <p className={`text-[11px] font-mono mt-0.5 ${isActive ? 'text-zinc-700' : 'text-zinc-400'}`}>
                  {step.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-center justify-between relative overflow-hidden"
          >
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-white text-black font-bold">
                  {STEPS[activeStep].badge}
                </span>
                <span className="text-zinc-400">Phase {activeStep + 1} of 4</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {STEPS[activeStep].title} &mdash; {STEPS[activeStep].subtitle}
              </h3>

              <p className="text-zinc-300 text-sm leading-relaxed">
                {STEPS[activeStep].description}
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs text-white font-mono">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>{STEPS[activeStep].detail}</span>
              </div>
            </div>

            <div className="w-full md:w-64 bg-black border border-zinc-800 p-6 rounded-xl text-center flex flex-col items-center justify-center shrink-0">
              {React.createElement(STEPS[activeStep].icon, {
                className: 'w-12 h-12 text-white mb-3',
              })}
              <span className="text-xs font-bold text-white uppercase tracking-wider block font-mono">
                {STEPS[activeStep].badge}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-1 font-mono">Stellar Testnet Ledger</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
