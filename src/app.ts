import "./app.css"
import flowplayer from "@flowplayer/player"
import QSELPlugin from "@flowplayer/player/plugins/qsel"
import { LCEVC } from "./lcevc/lcevc"
import { useSrc } from "./use-src"

const app = document.querySelector("#app")!
const lcevcPlayerContainer = document.createElement("div")
lcevcPlayerContainer.setAttribute("class", "column.column-50");
const standardPlayerContainer = document.createElement("div")
standardPlayerContainer.setAttribute("class", "column.column-50");
const players = document.createElement("div")
players.classList.add("players")

players.append(lcevcPlayerContainer)
players.append(standardPlayerContainer)

app.append(players)

~(async function main (){

    // Register plugins
    flowplayer(QSELPlugin)

    const lcevcPlayer = flowplayer(lcevcPlayerContainer)
    const lcevc = new LCEVC(lcevcPlayer, {})
    const src = useSrc()
    await lcevc.load(src)

    const player = flowplayer(standardPlayerContainer, {
         //src: "https://d3mfda3gpj3dw1.cloudfront.net/vn23Xq5EQtyGjr0a/master.m3u8"
         src: "https://wv-cdn-00-00.wowza.com/1b73262b-d591-47f7-ae7b-de31305545eb/cmaf/4ef22593-ef9d-42b1-96ff-7daab70792eb/playlist.m3u8"
    })

}())


