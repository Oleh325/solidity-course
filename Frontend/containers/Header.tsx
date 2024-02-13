import { Dispatch, SetStateAction, useEffect, useState } from "react"
import "../src/app/styles/header.scss"
import { Bounce, ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface HeaderProps {
    isAuthenticating: boolean
    setIsAuthenticating: Dispatch<SetStateAction<boolean>>
    accounts: string[]
    network: string
}

export default function Header(props: HeaderProps) {
    const accounts = props.accounts

    const copyToClipboard = (context: string) => {
        navigator.clipboard.writeText(context)
        toast("Copied to clipboard!", {
            position: "bottom-center",
            autoClose: 2000,
            type: "success",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            containerId: "header",
        })
    }

    return (
        <>
            <div className="index-header">
                <div className="network-info">
                    <div className="network-text">Current network: </div>
                    <div className="network-name">{props.network}</div>
                </div>
                <div className="app-title">smartRaffle</div>
                <div className="connection-info">
                    {accounts[0] !== undefined ? (
                        <>
                            <div className="connected-text">Connected at: </div>
                            <div title={accounts[0]} className="connected-account" onClick={() => copyToClipboard(accounts[0])}>
                                {accounts[0].slice(0, 6)}...{accounts[0].slice(accounts[0].length - 4)}
                            </div>
                        </>
                    ) : (
                        <button
                            onClick={async () => props.setIsAuthenticating(true)}
                            className="connect-button"
                            disabled={props.isAuthenticating}
                        >
                            Connect
                        </button>
                    )}
                </div>
            </div>
            <ToastContainer containerId="header" />
        </>
    )
}
