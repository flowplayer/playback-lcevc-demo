import "./app.css"
import { LCEVC } from "./lcevc/lcevc"
import { useSrc } from "./use-src"
import { useFlowplayer } from "./use-flowplayer"
import { createBitrateTimeseries } from "./bitrate-over-time"

// setup globals
const app = document.querySelector("#app")!
const players = document.createElement("div")
players.classList.add("players")
const timeseries = document.createElement("div")
timeseries.id = "timeseries"
app.append(players, timeseries)

const sharedConfig = {
    autoplay: true,
}

async function createLCEVCPlayer () {
    return import("https://esm.run/hls.js@1.0.2").then(async ({default: Hls}) => {
        const flowplayer = useFlowplayer()
        const lcevcPlayerContainer = document.createElement("div")
        lcevcPlayerContainer.classList.add("lcevc-player", "column-50")
        const lcevcPlayer = flowplayer(lcevcPlayerContainer)
        const lcevc = new LCEVC(Hls, lcevcPlayer, sharedConfig)
        const src = useSrc()
        await lcevc.load(src)
        return {container: lcevcPlayerContainer, player: lcevcPlayer}
    })
}

async function createStandardPlayer () {
    const flowplayer = useFlowplayer()
    const standardPlayerContainer = document.createElement("div")
    standardPlayerContainer.classList.add("standard-player",  "column-50")
    players.append(standardPlayerContainer)
    const standardPlayer = flowplayer(standardPlayerContainer, {
        src: "https://wv-cdn-00-00.wowza.com/1b73262b-d591-47f7-ae7b-de31305545eb/cmaf/4ef22593-ef9d-42b1-96ff-7daab70792eb/playlist.m3u8",
        ...sharedConfig
    })
    return {container: standardPlayerContainer, player: standardPlayer}
}



~(async function main (){
    // spawn the 2 players
    const [lcevc, standard] = await Promise.all([createLCEVCPlayer(), createStandardPlayer()])
    players.append(lcevc.container, standard.container)
    createBitrateTimeseries("#timeseries", lcevc.player.hls, standard.player.hls)
}())


