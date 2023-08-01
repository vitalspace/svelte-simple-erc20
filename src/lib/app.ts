import { ethers } from "ethers";
import { isLoggedin, userId, currentMessage } from "../stores/stores";
import erc20ContractAbi from "../abi/erc20ContractAbi.json";
import simpleContractAbi from "../abi/simpleContractAbi.json";
class App {
  protected erc20ContractAddress: string =
    "0x71C1F8acdB8105eAd0fcA8D05B8E77185eEd7bd6";
  protected simpleContractAddress: string =
    "0xdb28BBb69b7b106209E009D43C0b94bee173d897";
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





    //     this.erc20Contract.approve(this.simpleContractAddress, "1000000000000000000")
    // // .send({ from: (await this.signer()).address })
    // .then((receipt) => {
    //   // La transacción se realizó correctamente y el contrato ahora tiene permiso para gastar la cantidad especificada en tu nombre
    //   console.log('Transacción completada:', receipt);
    // })
    // .catch((error) => {
    //   // Manejar errores
    //   console.error('Error al realizar la transacción:', error);
    // });

    // this.simpleContract.changeMessage("la concha tu madre").then((res) => {
    //   console.log(res);
    // })
    // .catch((err) => {
    //     console.error(err)
    // })

    // const allowanceAmount = ethers.parseUnits('1', 'ether');

    // this.erc20Contract.approve((await this.signer()).address, 1)
    // .then((transaction) => {
    //   // La transacción ha sido enviada, ahora esperar a que se confirme
    //   return transaction.wait();
    // })
    // .then((receipt) => {
    //   // La transacción se ha confirmado y el contrato ahora tiene permiso para gastar la cantidad especificada en tu nombre
    //   console.log('Transacción completada:', receipt);
    // })
    // .catch((error) => {
    //   // Manejar errores
    //   console.error('Error al realizar la transacción:', error);
    // });

    this.simpleContract = new ethers.Contract(
      this.simpleContractAddress,
      simpleContractAbi,
      await this.signer()
    );
  }

  async approveContract() {
    this.erc20Contract.approve(this.simpleContractAddress, "")
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
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
      .catch((err) => console.log(err));
  };
}

export { App };
