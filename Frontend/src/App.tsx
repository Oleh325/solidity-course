import './App.scss';

function App() {


    return (
        <div className="App">
            <header className="App-contents">
                <h1>FundMe</h1>
            </header>
            <div className="App-body">
                <button className="connect button">Connect</button>
                <div className="connected-at">Connected at: 0x...</div>
                <div className="fund-holder">
                    <div className="fund-holder-inputs">
                        <input className="eth-amount-input" placeholder="0.01" />
                        <div className="eth-token">ETH</div>
                    </div>
                    <button className="fund button">Fund</button>
                </div> 
                <div className="balance-and-withdraw">
                    <div className="balance">Balance: 0.0 ETH</div>
                    <div className="withdraw-buttons">
                        <button className="update-balance button">Update balance</button>
                        <button className="withdraw button">Withdraw</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
