import { useEffect } from "react"
import "../src/app/styles/header.scss"
import { useMoralis } from "react-moralis"

export default function Header() {
    const { enableWeb3, web3, account, isWeb3Enabled } = useMoralis()

    const getNetworkName = (networkId: number) => {
        switch (networkId) {
            case 1:
                return "Ethereum Mainnet"
            case 5:
                return "Goerli"
            case 31337:
                return "Localhost"
                case 11155111:
                    return "Sepolia"
            default:
                return "Unknown"
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) return
        const connected = window.localStorage.getItem("connected")
        if (connected === "injected") {
            enableWeb3()
        }
    }, [])

    useEffect(() => {
        if (!account) { 
            window.localStorage.removeItem("connected")
        } else {
            window.localStorage.setItem("connected", "injected")
        }
    }, [account])

    return (
        <div className="index-header">
            <div className="network-info">
                <div className="network-text">Current network: </div>
                <div className="network-name">{getNetworkName(web3?.network.chainId!)}</div>
            </div>
            <div className="app-title">smartRaffle</div>
            <div className="connection-info">
                {account
                ? <>
                    <div className="connected-text">Connected at: </div>
                    <div title={account} className="connected-account">{account.slice(0, 6)}...{account.slice(account.length - 4)}</div>
                </>
                : <button onClick={async () => await enableWeb3()} className="connect-button">Connect</button>}
            </div>
        </div>
    )
}