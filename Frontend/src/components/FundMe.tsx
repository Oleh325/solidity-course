
import "./FundMe.scss"
import React, { useEffect, useState } from "react"
import { toast, Bounce, ToastContainer } from "react-toastify"
import { ethers } from "ethers"
import { isLocalNetwork } from "../config"
import { MetaMaskInpageProvider } from "@metamask/providers"

interface FundMeProps {
    ethereum: MetaMaskInpageProvider
}

const FundMe = (props: FundMeProps) => {
    const [hidden, setHidden] = useState("")
    const [txStatus, setTxStatus] = useState(<></>)
    const [txHash, setTxHash] = useState(<></>)
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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast("Copied to clipboard!", {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
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
            setTxStatus(<div className="tx-status-failed">No connection!</div>)
            return
        }
        const contract = await getContract()
        if(!contract) {
            setTxStatus(<div className="tx-status-failed">No contract found!</div>)
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
            setTxStatus(<div title={error} className="tx-status-failed">Withdraw transaction failed with: "{error.slice(0, 15)}{error.length > 15 ? "..." : ""}"</div>)
        })
        if(!transactionResponse) {
            return
        }
        setTxStatus(<div className="tx-status-pending">Withdraw transaction pending...</div>)
        setTxHash(
            <div className="tx-hash-holder">
                <div className="tx-hash-title">Withdraw transaction hash:</div>
                <div title={transactionResponse.hash} className="tx-hash" onClick={e => copyToClipboard(transactionResponse.hash)}>{transactionResponse.hash.slice(0, 15)}...</div>
            </div>
        )
        await transactionResponse.wait(1).then(() => {
            setTxStatus(<div className="tx-status-success">Withdraw transaction successful!</div>)
        }).catch((err: any) => {
            let error = ""
            if (err.data && contract) {
                const decodedError = contract.interface.parseError(err.data);
                error = decodedError!.name
              } else {
                error = err.message
              }
            setTxStatus(<div title={error} className="tx-status-failed">Withdraw transaction failed with: "{error.slice(0, 15)}{error.length > 15 ? "..." : ""}"</div>)
        })
    }

    const fund = async (ethAmount: number) => {
        if(!ethAmount) {
            setTxStatus(<div className="tx-status-failed">Please enter an amount you want to fund.</div>)
            return
        }
        if(accounts!.length === 0) {
            setTxStatus(<div className="tx-status-failed">No connection!</div>)
            return
        }
        const contract = await getContract()
        if(!contract) {
            setTxStatus(<div className="tx-status-failed">No contract found!</div>)
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
            setTxStatus(<div title={error} className="tx-status-failed">Transaction failed with: "{error.slice(0, 25)}{error.length > 25 ? "..." : ""}"</div>)
        })
        if(!transactionResponse) {
            return
        }
        setTxStatus(<div className="tx-status-pending">Transaction pending...</div>)
        setTxHash(
            <div className="tx-hash-holder">
                <div className="tx-hash-title">Transaction hash:</div>
                <div title={transactionResponse.hash} className="tx-hash" onClick={e => copyToClipboard(transactionResponse.hash)}>{transactionResponse.hash.slice(0, 20)}...</div>
            </div>
        )
        await transactionResponse.wait(1).then(() => {
            setTxStatus(<div className="tx-status-success">Transaction successful!</div>)
        }).catch((err: any) => {
            let error = ""
            if (err.data && contract) {
                const decodedError = contract.interface.parseError(err.data);
                error = decodedError!.name
              } else {
                error = err.message
              }
            setTxStatus(<div title={error} className="tx-status-failed">Transaction failed with: "{error.slice(0, 25)}{error.length > 25 ? "..." : ""}"</div>)
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
                {txHash}
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
            <ToastContainer />
        </div>
    )
}

export default FundMe