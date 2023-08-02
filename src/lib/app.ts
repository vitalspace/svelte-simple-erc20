
import { ethers } from "ethers";
import { currentMessage, isApprove, isLoggedin, userId, addNotification, showNotification } from "../stores/stores";

import erc20ContractAbi from "../abi/erc20ContractAbi.json";
import simpleContractAbi from "../abi/simpleContractAbi.json";


interface Notification {
  message: string
  type: string
  removeAfther: number
}

class App {
  protected erc20ContractAddress: string =
    "0x8EFE9F0f71650B3E77952e257B226ae822Bb6CB1";
  protected simpleContractAddress: string =
    "0x54BC71d75D55947e524131F5D81e249E18E9074c";
  protected erc20Contract: ethers.Contract | undefined;
  protected simpleContract: ethers.Contract | undefined;
  constructor() {
    this.init();
  }
  async init() {
    this.existWeb3();
  }
  async existWeb3() {
    if (window.ethereum) {
      await this.isLoggedin();
      return;
    }
    return alert("Please install Metamask");
  }
  async isLoggedin() {
    const account = await window.ethereum.request({
      method: "eth_accounts",
    });

    if (account.length > 0) {
      userId.update((e) => (e = account[0]));
      isLoggedin.update((e) => (e = true));
      await this.loadContracts();
      await this.currentMessage();
    }
  }

  async login() {
    const provide = new ethers.BrowserProvider(window.ethereum);
    provide
      .getSigner()
      .then(async (res) => {
        isLoggedin.update((e) => (e = true));
        userId.update((e) => (e = res.address));
        await this.loadContracts();
        await this.currentMessage();
      })
      .catch((err) => {
        alert("You have canceled the login");
      });
  }

  private async signer(): Promise<ethers.Provider | any> {
    const provide = new ethers.BrowserProvider(window.ethereum);
    return provide.getSigner();
  }
  async loadContracts() {
    this.erc20Contract = new ethers.Contract(
      this.erc20ContractAddress,
      erc20ContractAbi,
      await this.signer()
    );

    this.simpleContract = new ethers.Contract(
      this.simpleContractAddress,
      simpleContractAbi,
      await this.signer()
    );
  }

  async approveContract() {
    this.erc20Contract.approve(this.simpleContractAddress, "2000000000000000000")
      .then((res) => {
        if (res) isApprove.update((e) => e = true);
        this.createNotification({ 
          message: "You have successfully approved the contract.", 
          removeAfter: 4000, 
          type: "success", 
        });
      })
      .catch((err) => {
        this.createNotification({ 
          message: "You have canceled the transaction.", 
          removeAfter: 4000, 
          type: "error", 
        });
      })
  }

  async currentMessage() {
    this.simpleContract
      .message()
      .then((res) => {
        currentMessage.update((e) => (e = res));
      })
      .catch((err) => {
        console.error(err);
      });
  }

  changeMessage = async (message: string) => {
    this.simpleContract
      .changeMessage(message)
      .then(async (transaction) => {
        if (await transaction.wait()) {
          this.currentMessage();
        }
      })
      .catch((err) => {
        this.createNotification({ 
          message: "Insufficient balance.", 
          removeAfter: 4000, 
          type: "error", 
        });
        if (err) isApprove.update((e) => e = false);
      });
  };

  createNotification(obj: Notification | any) {
    obj.showNotification = true;
    addNotification.set(obj);
    setTimeout(() => {
      addNotification.update(e => {
        return {
          ...e,
          showNotification: false
        }
      })
    }, obj.removeAfter);
  }
}

export { App };

