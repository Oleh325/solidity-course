import "./App.scss"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { isLocalNetwork } from "./config"
import FundMe from "./components/FundMe"

function App() {
    const [contents, setContents] = useState(
        <div className="App-contents">
            <div className="waiting-network">
                <div className="waiting-network-text">
                    Waiting for network...
                </div>
            </div>
        </div>
    )
    const { ethereum } = window

        useEffect(() => {
            if(!ethereum) {
                return
            }
            const checkNetworks = async () => {
                const provider = new ethers.BrowserProvider(ethereum)
                const network = await provider.getNetwork()
            
                if(isLocalNetwork && network.chainId !== BigInt(31337)) {
                    setContents (
                        <div className="App-contents">
                            <div className="wrong-network">
                                <div className="wrong-network-text">
                                    Please switch to local network!
                                </div>
                            </div>
                        </div>
                    )
                    return
                }
            
                if(!isLocalNetwork && network.chainId !== BigInt(11155111)) {
                    setContents (
                        <div className="App-contents">
                            <div className="wrong-network">
                                <div className="wrong-network-text">
                                    Please switch to Sepolia network!
                                </div>
                            </div>
                        </div>
                    )
                    return
                }
                setContents(<FundMe ethereum={ethereum} />)
            }
            
            checkNetworks()

            const intervalId = setInterval(async () => {
                checkNetworks()
            }, 2000)
    
            return () => clearInterval(intervalId)
        }, [ethereum])

    

    return (
        <div className="App">
            <header className="App-header">
                <h1>FundMe</h1>
            </header>
            {ethereum 
            ? contents
            : <div className="App-contents">
                  <div className="no-metamask">
                      <div className="no-metamask-text">
                          Please install Metamask wallet
                      </div>
                  </div>
              </div>
            }
        </div>
    )
}

export default App
