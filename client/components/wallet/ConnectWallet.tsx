import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { mockStore, WalletConnection } from "@/lib/mockStore";

function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function ConnectWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletConnection, setWalletConnection] = useState<WalletConnection | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [walletId, setWalletId] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  // Load saved wallet connection on mount
  useEffect(() => {
    const connection = mockStore.getWalletConnection();
    if (connection) {
      setWalletConnection(connection);
      setIsConnected(true);
    }
  }, []);

  const generateWalletAddress = (id: string) => {
    // Generate a mock wallet address based on the ID
    const hash = id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `0x${hex}${'0'.repeat(32 - hex.length)}${hex}`;
  };

  const handleConnect = async () => {
    if (!walletId.trim()) {
      toast.error("Please enter a wallet ID");
      return;
    }

    setIsConnecting(true);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const address = generateWalletAddress(walletId.trim());
    const connection = mockStore.connectWallet(walletId.trim(), address);
    
    setWalletConnection(connection);
    setIsConnected(true);
    setIsDialogOpen(false);
    setWalletId("");
    setIsConnecting(false);
    
    toast.success(`Wallet connected successfully!`);
  };

  const handleDisconnect = () => {
    mockStore.disconnectWallet();
    setWalletConnection(null);
    setIsConnected(false);
    toast.success("Wallet disconnected");
  };

  return (
    <div className="flex items-center gap-2">
      {isConnected && walletConnection ? (
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="rounded-full px-3 py-1 text-xs">
            {short(walletConnection.address)}
          </Button>
          <Button 
            variant="ghost" 
            className="text-red-500 hover:text-red-600 text-xs px-2" 
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              Connect Wallet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Connect Your Wallet</DialogTitle>
              <DialogDescription>
                Enter your wallet ID to connect to the Asimply Pulse platform.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="walletId" className="text-right">
                  Wallet ID
                </Label>
                <Input
                  id="walletId"
                  value={walletId}
                  onChange={(e) => setWalletId(e.target.value)}
                  placeholder="Enter your wallet ID"
                  className="col-span-3"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isConnecting) {
                      handleConnect();
                    }
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground px-4">
                Your wallet ID can be any unique identifier. A mock wallet address will be generated for testing purposes.
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isConnecting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                onClick={handleConnect}
                disabled={isConnecting || !walletId.trim()}
              >
                {isConnecting ? "Connecting..." : "Continue"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
