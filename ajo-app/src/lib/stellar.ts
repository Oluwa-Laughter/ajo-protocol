import { StellarWalletsKit, Networks } from '@creit.tech/stellar-wallets-kit';

export interface CircleData {
  id: number;
  admin: string;
  token: string;
  amount: number; // in USDC
  periodSecs: number;
  maxMembers: number;
  status: 'Created' | 'Active' | 'Completed' | 'Cancelled';
  currentRound: number;
  members: string[];
  payoutOrder: string[];
}

export const formatAddress = (addr: string, chars = 4): string => {
  if (!addr) return '';
  if (addr.length <= chars * 2) return addr;
  return `${addr.substring(0, chars)}...${addr.substring(addr.length - chars)}`;
};

export const formatUSDC = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatNGN = (usdcAmount: number, rate = 1550): string => {
  const ngn = usdcAmount * rate;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(ngn);
};

// Initialize StellarWalletsKit on client side
if (typeof window !== 'undefined') {
  StellarWalletsKit.init({
    network: Networks.TESTNET,
    modules: [],
  });
}

export { StellarWalletsKit, Networks };
