import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

// Use the contract address you deployed!
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

// Human-readable ABI for exactly the functions we need
const CONTRACT_ABI = [
  "function mintBond(address investor, string ngoName, uint256 amountInvested) public",
  "function getBondDetails(uint256 tokenId) public view returns (string, uint256, uint256)",
  "event BondMinted(address indexed investor, uint256 indexed tokenId, string ngoName, uint256 amountInvested)"
];

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if wallet is already connected when app loads
  useEffect(() => {
    checkConnection();
    
    // Listen for account changes in MetaMask
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          initContract();
        } else {
          setAccount(null);
          setContract(null);
        }
      });
    }
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
          initContract();
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use Web3 features!");
      return;
    }

    setIsConnecting(true);
    try {
      // Request MetaMask connection
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      await initContract();
    } catch (error) {
      console.error("User rejected connection or error occurred:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const initContract = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const impactBondContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(impactBondContract);
    }
  };

  return (
    <Web3Context.Provider value={{ account, connectWallet, isConnecting, contract }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
