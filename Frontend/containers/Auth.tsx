import "../src/app/styles/auth.scss"
import metamaskLogo from "../public/metamask.svg"
import trustwalletLogo from "../public/trust-wallet.svg"
import walletConnectLogo from "../public/wallet-connect.svg"
import Image from "next/image"

export default function Auth() {

    return (
        <div className="auth-container">
            <div className="auth-content">
                <div className="content-top">
                    <div className="connect-text">Connect Wallet</div>
                    <button className="close-button">×</button>
                </div>
                <div className="content-options">
                    <button className="option-metamask">
                        <Image
                            priority
                            src={metamaskLogo}
                            alt=""
                        />
                        <div className="option-text">Metamask</div>
                    </button>
                    <button className="option-trust">
                        <Image
                            priority
                            src={trustwalletLogo}
                            alt=""
                        />
                        <div className="option-text">Trust Wallet</div>
                    </button>
                    <button className="option-walletconnect">
                        <Image
                            priority
                            src={walletConnectLogo}
                            alt=""
                        />
                        <div className="option-text">Wallet Connect</div>
                    </button>
                </div>
            </div>
        </div>
    )
}
