import Web3 from "web3";
// Constructer function = Uppercase to allow us to use the instance 
 
window.ethereum.request({ method: "eth_requestAccounts" });
 
const web3 = new Web3(window.ethereum);
 
export default web3;