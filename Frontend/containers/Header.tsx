import { useEffect, useState } from "react"
import "../src/app/styles/header.scss"
import { useMoralis } from "react-moralis"
import { ethers } from "ethers"

export default function Header() {
    const [network, setNetwork] = useState("Unknown")
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const { enableWeb3, web3, account, isWeb3Enabled, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis()

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

    const triggerAuth = () => {
        setIsAuthenticating(true)
    }

    useEffect(() => {
        if (isWeb3Enabled) return
        const connected = window.localStorage.getItem("connected")
        if (connected === "injected") {
            enableWeb3()
        }
        const getNetwork = async () => {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const network = await provider.getNetwork()
                setNetwork(getNetworkName(network.chainId))
            }
        }
        getNetwork()
    }, [])

    useEffect(() => {
        if (!account) {
            deactivateWeb3()
            window.localStorage.removeItem("connected")
        } else {
            window.localStorage.setItem("connected", "injected")
        }
    }, [account])

    return (
        <div className="index-header">
            <div className="network-info">
                <div className="network-text">Current network: </div>
                <div className="network-name">{network}</div>
            </div>
            <div className="app-title">smartRaffle</div>
            <div className="connection-info">
                {account ? (
                    <>
                        <div className="connected-text">Connected at: </div>
                        <div title={account} className="connected-account">
                            {account.slice(0, 6)}...{account.slice(account.length - 4)}
                        </div>
                    </>
                ) : (
                    <button
                        onClick={async () => triggerAuth()}
                        className="connect-button"
                        disabled={isAuthenticating}
                    >
                        Connect
                    </button>
                )}
            </div>
        </div>
    )
}
