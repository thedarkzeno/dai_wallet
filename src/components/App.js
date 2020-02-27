import React, { useState, useEffect } from "react";
import logo from "../logo.png";
import "./App.css";
import Web3 from "web3";
import DaiToken from "../abis/DaiToken.json";

function App() {
  const [state, setState] = useState({
    account: null,
    DaiToken: null,
    balance: 0,
    transactions: [],
    recipient: "",
    amount: 0
  });
  const [time, setTime] = useState(0);
  useEffect(() => {
    async function update() {
      await loadBlockchainData();
    }
    async function load() {
      await loadWeb3();
      await loadBlockchainData();
    }
    load();
    setTimeout(async function() {
      const accounts = await window.web3.eth.getAccounts();
      const account = accounts[0];
      if (account !== state.account) {
        update();
      }
      setTime(time + 1);
    }, 2000);
  }, [time]);

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      alert("Install metamask!");
    }
  }

  async function loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const daiTokenAddress = "0xF1D896ef4ae382A097A6C7E6B1C03341C93A3C8F";
    const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenAddress);
    const balance = await daiToken.methods.balanceOf(accounts[0]).call();
    const transactions = await daiToken.getPastEvents("Transfer", {
      fromBlock: 0,
      toBlock: "latest",
      filter: {
        from: accounts[0]
      }
    });
    if(accounts[0]!==state.account){
      console.log("change account")
      setState(prevState => ({
        ...prevState,
        account: accounts[0],
        transactions
      }));
    }
    if(transactions.length!==state.transactions.length){
      console.log("change transactions")
      setState(prevState => ({
        ...prevState,
        transactions
      }));
    }
    if(web3.utils.fromWei(balance.toString(), "Ether")!==state.balance){
      console.log("change balance")
      setState(prevState => ({
        ...prevState,
        balance: web3.utils.fromWei(balance.toString(), "Ether")
      }));
    }
    if(!state.DaiToken || daiToken.address!==state.DaiToken.address){
      console.log("change dai")
      setState(prevState => ({
        ...prevState,
        DaiToken: daiToken
      }));
    }
  }
  function transfer(recipient, amount) {
    state.DaiToken.methods
      .transfer(recipient, amount)
      .send({ from: state.account });
  }

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <div className="navbar-brand col-sm-3 col-md-2 mr-0">DAI Wallet</div>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto" style={{ width: "500px" }}>
              <a
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={logo} width="150" alt="logo" />
              </a>
              <h1>{state.balance} DAI</h1>
              <form
                onSubmit={event => {
                  event.preventDefault();
                  const recipient = state.recipient;
                  const amount = window.web3.utils.toWei(state.amount, "Ether");
                  transfer(recipient, amount);
                }}
              >
                <div className="form-group mr-sm-2">
                  <input
                    id="recipient"
                    type="text"
                    onChange={e => {
                      let value = e.target.value;
                      setState(prevState => ({
                        ...prevState,
                        recipient: value
                      }));
                    }}
                    className="form-control"
                    placeholder="Address"
                    required
                  />
                </div>
                <div className="form-group mr-sm-2">
                  <input
                    id="amount"
                    type="text"
                    onChange={e => {
                      let value = e.target.value;
                      setState(prevState => ({
                        ...prevState,
                        amount: value
                      }));
                    }}
                    className="form-control"
                    placeholder="Amount"
                    required
                  />
                </div>
                <button className="btn btn-primary btn-block" type="submit">
                  Send
                </button>
              </form>
              <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Recipient</th>
                      <th scope="col">value</th>
                    </tr>
                  </thead>
                  <tbody>
                    { state.transactions.map((tx, key) => {
                      return (
                        <tr key={key} >
                          <td>{tx.returnValues.to}</td>
                          <td>{window.web3.utils.fromWei(tx.returnValues.value.toString(), 'Ether')}</td>
                        </tr>
                      )
                    }) }
                  </tbody>
                </table>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
