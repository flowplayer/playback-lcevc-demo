import "./app.css"
import { LCEVC } from "./lcevc/lcevc"
import { useSrc } from "./use-src"
import { useFlowplayer } from "./use-flowplayer"

// setup globals
const app = document.querySelector("#app")!
const players = document.createElement("div")
players.classList.add("players")
app.append(players)


async function createLCEVCPlayer () {
    return import("https://esm.run/hls.js@1.0.2").then(async ({default: Hls}) => {
        console.log(Hls)
        const flowplayer = useFlowplayer()
        const lcevcPlayerContainer = document.createElement("div")
        lcevcPlayerContainer.setAttribute("class", "column.column-50");
        players.append(lcevcPlayerContainer)
        const lcevcPlayer = flowplayer(lcevcPlayerContainer)
        const lcevc = new LCEVC(Hls, lcevcPlayer, {})
        const src = useSrc()
        return lcevc.load(src)
    })
}

async function createStandardPlayer () {
    const flowplayer = useFlowplayer()
    const standardPlayerContainer = document.createElement("div")
    standardPlayerContainer.setAttribute("class", "column.column-50");
    players.append(standardPlayerContainer)
    const standardPlayer = flowplayer(standardPlayerContainer, {
        src: "https://wv-cdn-00-00.wowza.com/1b73262b-d591-47f7-ae7b-de31305545eb/cmaf/4ef22593-ef9d-42b1-96ff-7daab70792eb/playlist.m3u8",
        hls: {debug: true}
    })

    console.log(standardPlayer)
}



~(async function main (){
    await createLCEVCPlayer()
    await createStandardPlayer()
}())


