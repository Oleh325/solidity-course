import "../src/app/styles/auth.scss"
import metamaskLogo from "../public/metamask.svg"
import trustwalletLogo from "../public/trust-wallet.svg"
import walletConnectLogo from "../public/wallet-connect.svg"
import Image from "next/image"
import { Dispatch, SetStateAction, useState } from "react"
import { Bounce, ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { EthereumProvider } from '@walletconnect/ethereum-provider'

interface AuthProps {
    setIsAuthenticating: Dispatch<SetStateAction<boolean>>
    setAccounts: Dispatch<SetStateAction<string[]>>
    setProvider: Dispatch<SetStateAction<any>> // this one is for WalletConnect
}

export default function Auth(props: AuthProps) {
    const [isAuthenticatingInternal, setIsAuthenticatingInternal] = useState(false)

    const connectToWallet = async (desiredProvider: string) => {
        setIsAuthenticatingInternal(true)
        try {
            if (desiredProvider === "metamask") {
                const isMetamask = !!window.ethereum.isMetaMask
                if (window.ethereum && isMetamask) {
                    const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
                    props.setAccounts(accounts)
                    props.setIsAuthenticating(false)
                }
            } else if (desiredProvider === "trustwallet") {
                const provider = await getTrustWalletInjectedProvider()
                if (provider) {
                    const accounts = await provider.request({ method: 'eth_requestAccounts' })
                    props.setAccounts(accounts)
                    props.setIsAuthenticating(false)
                } else {
                    throw new Error("Trust Wallet not detected.")
                }
            } else if (desiredProvider === "walletconnect") {
                const provider = await EthereumProvider.init({
                    projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
                    showQrModal: true,
                    optionalChains: [1, 5, 31337, 11155111]
                })
                await provider.connect()
                const accounts: any = await provider.request({ method: 'eth_requestAccounts' })
                props.setAccounts(accounts)  
                props.setProvider(provider)
                props.setIsAuthenticating(false)
            }
        } catch (error: any) {
            toast(error.message, {
                position: "bottom-center",
                autoClose: 4000,
                type: "error",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
                containerId: "auth",
            })
        } finally {
            setIsAuthenticatingInternal(false)
        }
    }

    async function getTrustWalletInjectedProvider(
        { timeout } = { timeout: 3000 }
    ) {
        const provider = getTrustWalletFromWindow()
        if (provider) {
            return provider
        }
        return listenForTrustWalletInitialized({ timeout })
    }
      
    async function listenForTrustWalletInitialized(
        { timeout } = { timeout: 3000 }
    ) {
        return new Promise((resolve) => {
            const handleInitialization = () => {
                resolve(getTrustWalletFromWindow())
            }
            window.addEventListener("trustwallet#initialized", handleInitialization, {
                once: true,
            })
      
            setTimeout(() => {
                window.removeEventListener(
                    "trustwallet#initialized",
                    handleInitialization,
                    true
                )
            resolve(null)
            }, timeout)
        })
    }
      
    function getTrustWalletFromWindow() {
        const isTrustWallet = (ethereum: any) => {
            // Identify if Trust Wallet injected provider is present.
            const trustWallet = !!ethereum.isTrust
            return trustWallet
        }
      
        const injectedProviderExist =
            typeof window !== "undefined" && typeof window.ethereum !== "undefined"

        // No injected providers exist.
        if (!injectedProviderExist) {
            return null
        }
      
        // Trust Wallet was injected into window.ethereum.
        if (isTrustWallet(window.ethereum)) {
            return window.ethereum
        }
      
        // Trust Wallet provider might be replaced by another
        // injected provider, check the providers array.
        if (window.ethereum?.providers) {
          // ethereum.providers array is a non-standard way to
          // preserve multiple injected providers. Eventually, EIP-5749
          // will become a living standard and we will have to update this.
            return window.ethereum.providers.find(isTrustWallet) ?? null
        }
      
        // Trust Wallet injected provider is available in the global scope.
        // There are cases that some cases injected providers can replace window.ethereum
        // without updating the ethereum.providers array. To prevent issues where
        // the TW connector does not recognize the provider when TW extension is installed,
        // we begin our checks by relying on TW's global object.
        return window["trustwallet"] ?? null
    }

    

    return (
        <div className="auth-container">
            <div className="auth-content">
                <div className="content-top">
                    <div className="connect-text">Connect Wallet</div>
                    <button
                        className="close-button"
                        onClick={() => {
                            props.setIsAuthenticating(false)
                        }}
                    >
                        ×
                    </button>
                </div>
                <div className="content-options">
                    <button
                        className="option-metamask"
                        onClick={() => connectToWallet("metamask")}
                        disabled={isAuthenticatingInternal}
                    >
                        <Image priority src={metamaskLogo} alt="" />
                        <div className="option-text">Metamask</div>
                    </button>
                    <button
                        className="option-trust"
                        onClick={() => connectToWallet("trustwallet")}
                        disabled={isAuthenticatingInternal}
                    >
                        <Image priority src={trustwalletLogo} alt="" />
                        <div className="option-text">Trust Wallet</div>
                    </button>
                    <button
                        className="option-walletconnect"
                        onClick={() => connectToWallet("walletconnect")}
                        disabled={isAuthenticatingInternal}
                    >
                        <Image priority src={walletConnectLogo} alt="" />
                        <div className="option-text">Wallet Connect</div>
                    </button>
                </div>
            </div>
            <ToastContainer containerId="auth" />
        </div>
    )
}
