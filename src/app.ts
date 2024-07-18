import "./app.css"
import flowplayer from "@flowplayer/player"
import { LCEVC } from "./lcevc/lcevc"
import { useSrc } from "./use-src"

const app = document.querySelector("#app")!
const lcevcPlayerContainer = document.createElement("div")
const players = document.createElement("div")
players.classList.add("players")

players.append(lcevcPlayerContainer)

app.append(players)

~(async function main (){
    const lcevcPlayer = flowplayer(lcevcPlayerContainer)
    const lcevc = new LCEVC(lcevcPlayer, {})
    const src = useSrc()
    await lcevc.load(src)
}())


