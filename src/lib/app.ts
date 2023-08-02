
import { ethers } from "ethers";
import { currentMessage, isApprove, isLoggedin, userId } from "../stores/stores";

import erc20ContractAbi from "../abi/erc20ContractAbi.json";
import simpleContractAbi from "../abi/simpleContractAbi.json";
class App {
  protected erc20ContractAddress: string =
    "0x7e71Bf447c6254EF1FdEd75cAe7b839728e21db2";
  protected simpleContractAddress: string =
    "0xC0abCE15dBEC9706F06cAF06874B33A0496010f5";
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
        // console.log(res)
        if (res) isApprove.update((e) => e = true);
      })
      .catch((err) => {

        addNotification({
          text: 'Notification',
          position: 'bottom-center',
        })
        console.log(err)
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
        alert("Insufficient balance.")
        if (err) isApprove.update((e) => e = false);
      });
  };
}

export { App };

