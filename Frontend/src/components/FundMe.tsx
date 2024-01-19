
import "./FundMe.scss"
import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import { isLocalNetwork } from "../config"
import { MetaMaskInpageProvider } from "@metamask/providers"

interface FundMeProps {
    ethereum: MetaMaskInpageProvider
}

const FundMe = (props: FundMeProps) => {
    const [hidden, setHidden] = useState("")
    const [txStatus, setTxStatus] = useState(<></>)
    const [accounts, setAccounts] = useState([]) as [Array<string>, Function]
    const [balance, setBalance] = useState(0.0) as [number, Function]
    const [fundAmount, setFundAmount] = useState() as [number, Function]
    const ethereum = props.ethereum

    const connect = async () => {
        ethereum.request({ method: "eth_requestAccounts" }).then(async () => {
            const accounts = (await ethereum.request({
                method: "eth_accounts",
            })) as Array<string>
            if (accounts!.length !== 0) {
                setHidden("hidden")
                setAccounts(accounts)
            }
        })
    }

    const getContract = async () => {
        const accounts = (await ethereum.request({
            method: "eth_accounts",
        })) as Array<string>
        if (accounts!.length !== 0) {
            const provider = new ethers.BrowserProvider(ethereum)
            const signer = await provider.getSigner()
            if(isLocalNetwork) {
                const contractAddress = await fetch("fundMeAddress.local.txt").then(addr => addr.text())
                const contractABI = await fetch("fundMeABI.local.json").then(abi => abi.json())
                return new ethers.Contract(contractAddress, contractABI, signer)
            } else {
                const contractAddress = await fetch("fundMeAddress.txt").then(addr => addr.text())
                const contractABI = await fetch("fundMeABI.json").then(abi => abi.json())
                return new ethers.Contract(contractAddress, contractABI, signer)
            }
        }
        return
    }

    const updateBalance = async () => {
        let contractAddress = ""
        if(isLocalNetwork) {
            contractAddress = await fetch("fundMeAddress.local.txt").then(addr => addr.text())
        } else {
            contractAddress = await fetch("fundMeAddress.txt").then(addr => addr.text())
        }
        const provider = new ethers.BrowserProvider(ethereum)
        const balance = await provider.getBalance(contractAddress)
        let formattedBalance = ethers.formatEther(balance)
        if(formattedBalance.length > 8) {
            formattedBalance = formattedBalance.slice(0, 10)
            for(let i = 9; i >= 0; i--) {
                if(formattedBalance[i] === "0") {
                    formattedBalance = formattedBalance.slice(0, i)
                } else {
                    break
                }
            }
            setBalance(formattedBalance)
            return
        }
        if(formattedBalance === "0.0") {
            setBalance("0")
            return
        }
        setBalance(formattedBalance)
    }

    const withdraw = async () => {
        if(accounts!.length === 0) {
            setTxStatus(<div className="fund-status-failed">No connection!</div>)
            return
        }
        const contract = await getContract()
        if(!contract) {
            setTxStatus(<div className="fund-status-failed">No contract found!</div>)
            return
        }
        const transactionResponse = await contract.withdraw().catch((err: any) => {
            let error = ""
            if (err.data && contract) {
                const decodedError = contract.interface.parseError(err.data);
                error = decodedError!.name
            } else {
            error = err.message
            }
            setTxStatus(<div title={error} className="fund-status-failed">Withdraw transaction failed with: "{error.slice(0, 15)}{error.length > 15 ? "..." : ""}"</div>)
        })
        if(!transactionResponse) {
            return
        }
        setTxStatus(<div className="fund-status-pending">Withdraw transaction pending...</div>)
        await transactionResponse.wait(1).then(() => {
            setTxStatus(<div className="fund-status-success">Withdraw transaction successful!</div>)
        }).catch((err: any) => {
            let error = ""
            if (err.data && contract) {
                const decodedError = contract.interface.parseError(err.data);
                error = decodedError!.name
              } else {
                error = err.message
              }
            setTxStatus(<div title={error} className="fund-status-failed">Withdraw transaction failed with: "{error.slice(0, 15)}{error.length > 15 ? "..." : ""}"</div>)
        })
    }

    const fund = async (ethAmount: number) => {
        if(!ethAmount) {
            setTxStatus(<div className="fund-status-failed">Please enter an amount you want to fund.</div>)
            return
        }
        if(accounts!.length === 0) {
            setTxStatus(<div className="fund-status-failed">No connection!</div>)
            return
        }
        const contract = await getContract()
        if(!contract) {
            setTxStatus(<div className="fund-status-failed">No contract found!</div>)
            return
        }
        const transactionResponse = await contract.fund({ value: ethers.parseEther(ethAmount.toString()) }).catch((err: any) => {
            let error = ""
            if (err.data && contract) {
                const decodedError = contract.interface.parseError(err.data);
                error = decodedError!.name
              } else {
                error = err.message
              }
            setTxStatus(<div title={error} className="fund-status-failed">Transaction failed with: "{error.slice(0, 25)}{error.length > 25 ? "..." : ""}"</div>)
        })
        if(!transactionResponse) {
            return
        }
        setTxStatus(<div className="fund-status-pending">Transaction pending...</div>)
        await transactionResponse.wait(1).then(() => {
            setTxStatus(<div className="fund-status-success">Transaction successful!</div>)
        }).catch((err: any) => {
            let error = ""
            if (err.data && contract) {
                const decodedError = contract.interface.parseError(err.data);
                error = decodedError!.name
              } else {
                error = err.message
              }
            setTxStatus(<div title={error} className="fund-status-failed">Transaction failed with: "{error.slice(0, 25)}{error.length > 25 ? "..." : ""}"</div>)
        })
    }
    

    useEffect(() => {
        const checkConnection = async () => {
            const accounts = (await ethereum.request({
                method: "eth_accounts",
            })) as Array<string>
            if (accounts!.length !== 0) {
                setHidden("hidden")
                setAccounts(accounts)
            } else {
                setHidden("")
            }
        }

        checkConnection()

        updateBalance()

        const intervalId = setInterval(async () => {
            checkConnection()
        }, 2000)

        return () => clearInterval(intervalId)
    }, [ethereum])

    const formatInput = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement
        const value = input.value.replace(",", ".").replace(/[^0-9.]/g, "")

        // Set the value back to the input
        input.value = value
    }

    return (
        <div className="App-contents">
            {!hidden && (
                <button className="connect button" onClick={connect}>
                    Connect
                </button>
            )}
            {hidden && (
                <div className="connected-at">Connected at: {accounts[0]}</div>
            )}
            <div className="fund-holder">
                <div className="fund-holder-inputs">
                    <input
                        className="eth-amount-input"
                        type="text"
                        placeholder="0.01"
                        maxLength={20}
                        value={
                            fundAmount < 0.005 &&
                            fundAmount.toString().length >= 5
                                ? 0.005
                                : fundAmount
                        }
                        onChange={(e) => setFundAmount(e.target.value)}
                        onInput={(e) => formatInput(e)}
                    />
                    <div className="eth-token">ETH</div>
                </div>
                {txStatus}
                <button
                    className="fund button"
                    onClick={(e) => fund(fundAmount)}
                >
                    Fund
                </button>
            </div>
            <div className="balance-and-withdraw">
                <div className="balance">Balance: {balance} ETH</div>
                <div className="withdraw-buttons">
                    <button className="update-balance button" onClick={updateBalance}>
                        Update balance
                    </button>
                    <button className="withdraw button" onClick={withdraw}>Withdraw all</button>
                </div>
            </div>
        </div>
    )
}

export default FundMe