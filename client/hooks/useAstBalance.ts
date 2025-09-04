import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { ERC20_ABI } from "@/lib/erc20";

const tokenAddress = (import.meta.env.VITE_AST_TOKEN_ADDRESS as `0x${string}` | undefined) || undefined;

export function useAstBalance() {
  const { address } = useAccount();

  const { data: balanceRaw, isLoading: loadingBal } = useReadContract({
    abi: ERC20_ABI,
    address: tokenAddress,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!tokenAddress },
  });

  const { data: decimals } = useReadContract({
    abi: ERC20_ABI,
    address: tokenAddress,
    functionName: "decimals",
    args: [],
    query: { enabled: !!address && !!tokenAddress },
  });

  const { data: symbol } = useReadContract({
    abi: ERC20_ABI,
    address: tokenAddress,
    functionName: "symbol",
    args: [],
    query: { enabled: !!address && !!tokenAddress },
  });

  if (!address) return { connected: false, loading: false, symbol: "AST", balance: "0" } as const;

  if (!tokenAddress) {
    // Fallback mock for demo - shows 0 when no token configured
    return { connected: true, loading: false, symbol: "AST", balance: "0" } as const;
  }

  const bal = balanceRaw && decimals != null ? formatUnits(balanceRaw as bigint, Number(decimals)) : undefined;
  return { connected: true, loading: loadingBal, symbol: (symbol as string) || "AST", balance: bal || "0" } as const;
}
