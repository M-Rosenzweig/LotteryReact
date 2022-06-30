import React from "react";
import web3 from "./web3";
import lottery from "./lottery";
import { useEffect, useState } from "react";

function LotteryPage() {
  let [manager, setManager] = useState("");
  let [players, setPlayers] = useState([]);
  let [balance, setBalance] = useState("");
  let [ethValue, setEthValue] = useState("");
  let [message, setMessage] = useState("");
  let [pickWinnerMessage, setPickWinnerMessage] = useState("");


  let accounts;

  useEffect(() => {
    async function fetchInfo() {
      const managerData = await lottery.methods.manager().call();
      setManager(managerData);
      // managerData = await managerData.json()?????? I guess it comes through as is.
      const playerData = await lottery.methods.getAllPlayers().call();
      setPlayers(playerData);

      const balanceData = await web3.eth.getBalance(lottery.options.address);
      setBalance(balanceData);
    }
    fetchInfo();
  }, []);

  function ethValueFunction(e) {
    setEthValue(e.target.value);
    // console.log(ethValue);
  }

  async function submitForm(e) {
    e.preventDefault();
    console.log(ethValue);
    setEthValue("");
    // setMessage("Please confirm on Metamask"); not sure how to get this intermediate message. its interesting to me why the last setMessage only hits after success of await/ entering lottery
    accounts = await web3.eth.getAccounts();
    setMessage("Waiting for Transaction Success");
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(ethValue, "ether"),
    });
    setMessage("You have been entered");
  }

  async function pickAWinner() {
    accounts = await web3.eth.getAccounts();
    setPickWinnerMessage("Waiting for Transaction Success...");
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    setPickWinnerMessage('A Winner has been picked');
  }
  return (
    <div className="LotteryPage">
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>
      <p>
        Current amount of players = {players.length} competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>
      <hr></hr>
      <form onSubmit={submitForm}>
        <h4>Want to try your luck?</h4>
        <div>
          <label> Amount of ether to bet </label>
          <input
            value={ethValue}
            onChange={ethValueFunction}
            placeholder="ETH"
          ></input>

          <button>Enter</button>
        </div>
      </form>
      <h2>{message}</h2>
    <hr></hr>
    <h4>Ready to pick a winner? </h4>
    <button onClick={pickAWinner} >Pick A Winner</button>
    <h4>{pickWinnerMessage}</h4>
    </div>
    
  );
}

export default LotteryPage;
