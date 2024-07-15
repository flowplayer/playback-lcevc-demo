import "./app.css"
import { LCEVC } from "./lcevc"
import { useSrc } from "./use-src"

const app = document.querySelector("#app")!
const lcevcPlayerContainer = document.createElement("div")
const players = document.createElement("div")
players.classList.add("players")

players.append(lcevcPlayerContainer)

app.append(players)

~(async function main (){
    const lcevc = new LCEVC(lcevcPlayerContainer)
    const src = useSrc()
    await lcevc.load(src)
}())


