import { useEffect, useState } from "react"
import "../src/app/styles/raffle.scss"
import { abi, contractAddresses } from "../constants"
import { ethers } from "ethers"

interface RaffleProps {
    accounts: string[]
    provider: any
    chainId: number
}

interface contractAddressesInterface {
    [key: string]: string[]
}

export default function Raffle(props: RaffleProps) {
    if (props.chainId === 0) {
        return (
            <div className="raffle-no-network-container">
                <div className="raffle-no-network-text">Please, connect your wallet!</div>
            </div>
        )
    }
    const addresses: contractAddressesInterface = contractAddresses
    const raffleAddress = props.chainId in addresses ? addresses[props.chainId][0] : null
    if (raffleAddress === null) {
        return (
            <div className="raffle-not-deployed-container">
                <div className="raffle-not-deployed-text">Raffle not deployed on the selected network!</div>
            </div>
        )
    }
    const abiEthers: ethers.Interface = new ethers.Interface(abi)
    const contract: ethers.Contract = new ethers.Contract(raffleAddress!, abiEthers, props.provider)
    const [playersAmount, setPlayersAmount] = useState<string>("0")
    const [prizePool, setPrizePool] = useState<string>("0.0")
    const [previousWinner, setPreviousWinner] = useState<string>("None")
    const [raffleCountdown, setRaffleCountdown] = useState<string>("00:00:00")
    const [hasEntered, setHasEntered] = useState<boolean>(false)
    let timeLeftFetched = 0
    let timeLeftInternal = 0

    const enterRaffle = async () => {
        try {
            const signer = await props.provider.getSigner()
            const contract = new ethers.Contract(raffleAddress!, abiEthers, signer)
            const entranceFee = await contract.getEntranceFee()
            await contract.enterRaffle({ value: entranceFee })
        } catch (error: any) {
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const playersAmount = await contract.getNumberOfPlayers()
                setPlayersAmount(String(playersAmount))
                const prizePool = await contract.getPrizePool()
                setPrizePool(ethers.formatEther(prizePool))
                const previousWinner = await contract.getRecentWinner()
                if (previousWinner === "0x0000000000000000000000000000000000000000") {
                    setPreviousWinner("None")
                } else {
                    setPreviousWinner(previousWinner)
                }
                const signer = await props.provider.getSigner()
                const hasEntered = await contract.hasAlreadyEntered(signer.getAddress())
                setHasEntered(hasEntered)
                const timeLeft = await contract.getTimeLeft()
                if (Number(timeLeft) !== timeLeftFetched) {
                    timeLeftFetched = Number(timeLeft)
                    timeLeftInternal = Number(timeLeft)
                } else {
                    if (timeLeftInternal > 0) {
                        timeLeftInternal -= 1
                    }
                }
                const timeLeftString = new Date(timeLeftInternal * 1000).toISOString().substring(11, 19)
                if (timeLeftString === "00:00:00") {
                    setRaffleCountdown("Not active")
                } else {
                    setRaffleCountdown(timeLeftString)
                }
            } catch (error: any) {
                if (error.toString().includes("network changed")) {
                    window.location.reload()
                } else if (error.toString().includes("OVERFLOW")) {
                    setRaffleCountdown("Calculating...")
                } else {
                    console.log(error)
                }
            }
        }

        fetchData()

        const intervalId = setInterval(async () => {
            fetchData()
        }, 1000)

        return () => clearInterval(intervalId)
    }, [])

    return (
    <div className="raffle-container">
        <div className="current-players-container">
            <div className="current-players">Current players:</div>
            <div className="current-players-number">{playersAmount}</div>
        </div>
        <div className="prize-pool-container">
            <div className="prize-pool">Prize pool:</div>
            <div className="prize-pool-amount">{prizePool} ETH</div>
        </div>
        <div className="previous-winner-container">
            <div className="previous-winner">Previous winner:</div>
            <div className="previous-winner-address">{previousWinner}</div>
        </div>
        <div className="raffle-countdown-container">
            <div className="raffle-countdown">Raffle ends in:</div>
            <div className="raffle-countdown-time">{raffleCountdown}</div>
        </div>
        <button title={hasEntered ? "Already entered!" : ""} className="enter-raffle" onClick={() => enterRaffle()} disabled={hasEntered}>Enter raffle</button>
    </div>
    )
}