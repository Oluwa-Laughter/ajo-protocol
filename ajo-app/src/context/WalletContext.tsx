'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StellarWalletsKit, Networks } from '@/lib/stellar';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  network: string;
  usdNgnRate: number;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isConnecting: false,
  network: 'TESTNET',
  usdNgnRate: 1550,
  connect: async () => {},
  disconnect: () => {},
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const network = 'TESTNET';
  const usdNgnRate = 1550;

  useEffect(() => {
    const initWallet = async () => {
      if (typeof window !== 'undefined') {
        StellarWalletsKit.init({
          network: Networks.TESTNET,
          modules: [],
        });
        const storedAddr = localStorage.getItem('ajo_wallet_address');
        if (storedAddr) {
          setAddress(storedAddr);
        }
      }
    };
    initWallet();
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    try {
      // Trigger StellarWalletsKit modal UI
      await StellarWalletsKit.authModal();
      const res = await StellarWalletsKit.getAddress();
      const pubKey = typeof res === 'string' ? res : (res as any)?.address;
      if (pubKey) {
        setAddress(pubKey);
        localStorage.setItem('ajo_wallet_address', pubKey);
      }
    } catch (error) {
      console.error('StellarWalletsKit connect error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await StellarWalletsKit.disconnect();
    } catch (e) {
      // Ignore
    }
    setAddress(null);
    localStorage.removeItem('ajo_wallet_address');
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isConnecting,
        network,
        usdNgnRate,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
