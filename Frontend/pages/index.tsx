import Head from "next/head"
import "../src/app/styles/index.scss"
import Header from "../containers/Header"

export default function Index() {


  return (
    <div className="index">
        <div className="index-container">
            <Header />
        </div>
    </div>
  )
}
