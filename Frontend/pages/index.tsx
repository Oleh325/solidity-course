import "../src/app/styles/index.scss"
import Header from "../containers/Header"
import Auth from "../containers/Auth"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import Raffle from "../containers/Raffle"
import { EthereumProvider } from '@walletconnect/ethereum-provider'

export default function Index() {
    if (typeof(window) !== "undefined") {
        if (!window.ethereum) {
            return (
                <>
                    <div className="index">
                        <div className="no-wallet">
                            <div className="no-wallet-text">
                                Please, install a wallet to procced.
                            </div>
                        </div>
                    </div>
                </>
            )
        }
    }
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const [accounts, setAccounts] = useState<string[]>([])
    const [network, setNetwork] = useState("None")
    const [chainId, setChainId] = useState<number>(0)
    const [provider, setProvider] = useState<any>(null)

    const checkAuth = async () => {
        const isTrustWallet = (ethereum: any) => {
            // Identify if Trust Wallet injected provider is present.
            const trustWallet = !!ethereum.isTrust
            return trustWallet
        }

        const isMetamask = !!window.ethereum.isMetaMask

        const retreiveAccounts = async (provider: any) => {
            if (provider) {
                const retreivedAccounts: string[] = await provider.request({ method: 'eth_accounts' })
                const permissions = await provider.request({ method: 'wallet_getPermissions' })
                if (permissions[0] !== undefined) {
                    return retreivedAccounts
                } else {
                    return null
                }
            }
        }

        if (window.ethereum && isMetamask) {
            const retreivedAccounts: string[] = await retreiveAccounts(window.ethereum) || []
            if(retreivedAccounts.length > 0) {
                setAccounts(retreivedAccounts)
                const provider = new ethers.BrowserProvider(window.ethereum)
                const chainId = Number((await provider.getNetwork()).chainId)
                if (chainId === 31337) {
                    setNetwork("localhost")
                } else {
                    const network = (await provider.getNetwork()).name
                    setNetwork(network)
                }
                setChainId(chainId)
                setProvider(provider)
                return
            }
        }
        if (accounts.length === 0) {
            if (window.ethereum?.providers) {
                const provider = window.ethereum.providers.find(isTrustWallet) ?? null
                const retreivedAccounts: string[] = await retreiveAccounts(provider) || []
                if (retreivedAccounts) {
                    if (retreivedAccounts.length > 0) {
                        setAccounts(retreivedAccounts)
                        const chainId = Number((await new ethers.BrowserProvider(provider).getNetwork()).chainId)
                        if (chainId === 31337) {
                            setNetwork("localhost")
                        } else {
                            const network = (await new ethers.BrowserProvider(provider).getNetwork()).name
                            setNetwork(network)
                        }
                        setChainId(chainId)
                        setProvider(provider)
                        return
                    }
                }
            } else {
                const provider = window["trustwallet"]
                const retreivedAccounts: string[] = await retreiveAccounts(provider) || []
                if (retreivedAccounts) {
                    if (retreivedAccounts.length > 0) {
                        setAccounts(retreivedAccounts)
                        const chainId = Number((await new ethers.BrowserProvider(provider).getNetwork()).chainId)
                        if (chainId === 31337) {
                            setNetwork("localhost")
                        } else {
                            const network = (await new ethers.BrowserProvider(provider).getNetwork()).name
                            setNetwork(network)
                        }
                        setChainId(chainId)
                        setProvider(provider)
                        return
                    }
                }
            }
        }

        // if (accounts.length === 0) {
        //     try {
        //         const provider = await EthereumProvider.init({
        //             projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
        //             showQrModal: true,
        //             optionalChains: [1, 5, 31337, 11155111]
        //         })
        //         const retreivedAccounts: any = await provider.request({ method: 'eth_requestAccounts' }) || []
        //         if (retreivedAccounts) {
        //             if (retreivedAccounts.length > 0) {
        //                 setAccounts(retreivedAccounts)
        //                 const chainId = Number((await new ethers.BrowserProvider(provider).getNetwork()).chainId)
        //                 if (chainId === 31337) {
        //                     setNetwork("localhost")
        //                 } else {
        //                     const network = (await new ethers.BrowserProvider(provider).getNetwork()).name
        //                     setNetwork(network)
        //                 }
        //                 setChainId(chainId)
        //                 setProvider(provider)
        //                 return
        //             }
        //         }
        //     } catch (error: any) {
        //         console.log(error)
        //     }
        // }

        if (accounts.length === 0) {
            setAccounts([])
            setNetwork("None")
            setProvider(null)
            setChainId(0)
        }
    }

    // check on load if user is already authenticated
    useEffect(() => { 
        checkAuth()

        const intervalId = setInterval(async () => {
            checkAuth()
        }, 1000)

        return () => clearInterval(intervalId)
    }, [])

    return (
        <>
            <div className="index">
                <div className="index-container">
                    <Header
                        isAuthenticating={isAuthenticating}
                        setIsAuthenticating={setIsAuthenticating}
                        accounts={accounts}
                        network={network}
                    />
                    <Raffle accounts={accounts} provider={provider} chainId={chainId} />
                </div>
            </div>
            {isAuthenticating && <Auth setIsAuthenticating={setIsAuthenticating} setAccounts={setAccounts} setProvider={setProvider} />}
        </>
    )
}
