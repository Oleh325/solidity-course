import "../src/app/styles/index.scss"
import Header from "../containers/Header"
import Auth from "../containers/Auth"

export default function Index() {
    return (
        <>
            <div className="index">
                <div className="index-container">
                    <Header />
                </div>
            </div>
            <Auth />
        </>
    )
}
