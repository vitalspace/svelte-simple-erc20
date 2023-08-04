import { ethers } from "ethers";
import {
  addNotification,
  currentMessage,
  isApprove,
  isLoggedin,
  userId,
  userBalance,
  tokenSymbol,
} from "../stores/stores";
import erc20ContractAbi from "../abi/erc20ContractAbi.json";
import simpleContractAbi from "../abi/simpleContractAbi.json";
import {
  ERC_20_CONTRACT_ADDRESS,
  SIMPLE_CONTACT_ADDRESS,
} from "../costanst/contants";

interface Notification {
  message: string;
  type: string;
  removeAfther: number;
}
class App {
  protected erc20ContractAddress: string = ERC_20_CONTRACT_ADDRESS;
  protected simpleContractAddress: string = SIMPLE_CONTACT_ADDRESS;
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
      await this.getUserBalance();
      await this.getTokenSymbol();
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
        await this.getUserBalance();
        await this.getTokenSymbol();
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
    this.erc20Contract
      .approve(this.simpleContractAddress, "2000000000000000000")
      .then((res) => {
        if (res) isApprove.update((e) => (e = true));
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
      });
  }

  async getUserBalance() {
    this.erc20Contract
      .balanceOf((await this.signer()).address)
      .then((res) => {
        userBalance.set(
          parseInt(res).toLocaleString().replaceAll(",", "").slice(0, 6)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getTokenSymbol() {
    this.erc20Contract
      .symbol()
      .then((res) => {
        tokenSymbol.set(res);
      })
      .catch((err) => {
        console.log(err);
      });
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
    if (message !== undefined) {
      this.simpleContract
        .changeMessage(message)
        .then(async (transaction) => {
          if (await transaction.wait()) {
            await this.currentMessage();
            await this.getUserBalance();
          }
        })
        .catch((err) => {
          if (err.code === "ACTION_REJECTED") {
            this.createNotification({
              message: "You have canceled the transaction.",
              removeAfter: 4000,
              type: "error",
            });
          }
          if (err.code === "CALL_EXCEPTION") {
            this.createNotification({
              message: "Insufficient balance.",
              removeAfter: 4000,
              type: "error",
            });
          }
          if (err) isApprove.update((e) => (e = false));
        });
    } else {
      this.createNotification({
        message: "the message must contain at least one word.",
        removeAfter: 4000,
        type: "error",
      });
    }
  };

  createNotification(obj: Notification | any) {
    obj.showNotification = true;
    addNotification.set(obj);
    setTimeout(() => {
      addNotification.update((e) => {
        return {
          ...e,
          showNotification: false,
        };
      });
    }, obj.removeAfter);
  }
}

export { App };
