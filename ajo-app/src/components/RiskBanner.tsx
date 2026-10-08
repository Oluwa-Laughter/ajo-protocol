'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const RiskBanner = () => {
  return (
    <div className="bg-zinc-900 border-b border-zinc-800 text-zinc-300 px-4 py-2 text-xs font-mono">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-white shrink-0" />
          <span>
            <strong>Experimental Testnet Software:</strong> Ajo Protocol automates ROSCA mechanics. It does <em>not</em> remove member default risk. Testnet USDC only.
          </span>
        </div>
        <a
          href="/DESIGN.md"
          className="underline text-white hover:text-zinc-300 shrink-0 font-medium hidden sm:inline"
        >
          Threat Model
        </a>
      </div>
    </div>
  );
};
