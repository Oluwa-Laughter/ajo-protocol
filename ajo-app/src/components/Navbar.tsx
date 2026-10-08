'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import { formatAddress } from '@/lib/stellar';
import { Wallet, LogOut, Globe, PlusCircle } from 'lucide-react';

export const Navbar = ({ onOpenCreate }: { onOpenCreate: () => void }) => {
  const { address, isConnected, isConnecting, connect, disconnect, network } = useWallet();

  return (
    <header className="border-b border-zinc-800/80 bg-black/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-zinc-700 relative group-hover:border-white transition-colors">
            <Image
              src="/logo.jpg"
              alt="Ajo Protocol"
              width={36}
              height={36}
              className="object-cover"
            />
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5 font-mono">
              AJO <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">Soroban</span>
            </span>
          </div>
        </Link>

        {/* Action Buttons & Wallet Connection */}
        <div className="flex items-center gap-3">
          {/* Network Indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800 font-mono">
            <Globe className="w-3.5 h-3.5 text-white" />
            <span>Stellar {network}</span>
          </div>

          {/* Create Circle Button */}
          <button
            onClick={onOpenCreate}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 transition"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Create Circle</span>
          </button>

          {/* Wallet Button */}
          {isConnected ? (
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-mono text-sm font-medium text-white">{formatAddress(address!)}</span>
              <button
                onClick={disconnect}
                className="text-zinc-400 hover:text-white p-1 transition"
                title="Disconnect Wallet"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold rounded-lg bg-white text-black hover:bg-zinc-200 transition shadow-md"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
