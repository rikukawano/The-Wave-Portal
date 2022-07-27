import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [waveCount, setWaveCount] = useState("");

  const contractAddress = "0xae6098Ae3a4BA6BCD8090B350c20FA02950c2D34";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      // get access to window.ethereum
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      // get ethereum account
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account: ", account)
        setCurrentAccount(account);
      } else {
        console.log("Account not found!");
      }
    } catch (e) {
      console.log(e);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected!", accounts[0])
      setCurrentAccount(accounts[0]);
    } catch (e) {
      console.log(e);
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        // the actual wave
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined!", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

      } else {
        console.log("Ethereum object not found!");
      }

    } catch (e) {
      console.log(e);
    }
  }

  const getWaves = async () => {
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const signerAddress = await signer.getAddress();
        const waveCount = await wavePortalContract.getWaveCount(signerAddress);

        console.log("Your wave count is: ", waveCount.toNumber());
      } else {
        console.log("Ethereum object not found!");
      }
    } catch (e) {
      console.log(e);
    }
  }
  
  useEffect(() => {
    checkIfWalletIsConnected();
    getWaves();
  }, []);


  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          🌊 You have found the Wave Portal!
        </div>

        <div className="bio">
          Connect your Ethereum wallet and hit the button below to send a wave!
        </div>

        <button className="waveButton" onClick={wave}>
          🌊
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            🦊 Connect MetaMask Wallet
          </button>
        )}
      </div>
    </div>
  );
}
