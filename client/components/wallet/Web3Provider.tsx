import { ReactNode, useEffect } from "react";
import { WagmiConfig, createConfig, http } from "wagmi";
import { mainnet, polygon, arbitrum, optimism, base } from "wagmi/chains";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string | undefined;

const chains = [mainnet, polygon, base, optimism, arbitrum] as const;

const metadata = {
  name: "Asimply Pluse",
  description: "Asimply Pluse - Web3 Loyalty Dashboard",
  url: "https://asimplypluse.app", // fallback
  icons: ["/logo.svg"],
};

let wagmiConfig = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
  },
});

if (projectId) {
  wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata, enableInjected: true, enableWalletConnect: true });
}

if (projectId) {
  // Initialize Web3Modal only when a valid projectId exists
  createWeb3Modal({ wagmiConfig, projectId, chains, themeMode: "dark" });
}

export function Web3Provider({ children }: { children: ReactNode }) {
  // No side-effects needed beyond initialization above
  useEffect(() => {}, []);
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
