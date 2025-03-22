export interface Web3Provider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
}

declare global {
  interface Window {
    ethereum?: Web3Provider;
  }
}

export const connectWallet = async (): Promise<string> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error("No Web3 provider detected");
  }
  
  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    return accounts[0]; // First account
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const pinToIPFS = async (data: any): Promise<string> => {
  // In a real implementation, you would use a service like Pinata, nft.storage, or web3.storage
  // This is a mock implementation
  try {
    // Simulate API call
    console.log('Pinning data to IPFS:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a mock IPFS hash
    return 'QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxM';
  } catch (error) {
    console.error('Error pinning to IPFS:', error);
    throw error;
  }
};

export const mintDesignAsNFT = async (
  ipfsHash: string, 
  name: string, 
  description: string
): Promise<string> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error("No Web3 provider detected");
  }
  
  // In a real implementation, you would:
  // 1. Call a smart contract function to mint the NFT
  // 2. Wait for transaction confirmation
  // 3. Return transaction hash or token ID
  
  try {
    // Mock implementation
    console.log('Minting NFT with IPFS hash:', ipfsHash, name, description);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a mock transaction hash
    return '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
};
