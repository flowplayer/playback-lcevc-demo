import "./app.css"
import { LCEVC } from "./lcevc/lcevc"
import { useSrcLCEVC } from "./use-src-lcevc"
import { useSrcH264 } from "./use-src-h264"
import { useToken } from "./use-token"
import { useFlowplayer } from "./use-flowplayer"
import { createBitrateTimeseries } from "./bitrate-over-time"

// setup globals
const app = document.querySelector("#app")!
const players = document.createElement("div")
const labels = document.createElement("div")
players.classList.add("players")
const timeseries = document.createElement("div")
timeseries.id = "timeseries"
app.append(players, labels, timeseries)

const sharedConfig = {
    autoplay: true,
}

async function createLCEVCPlayer () {
    return import("https://esm.run/hls.js@1.0.2").then(async ({default: Hls}) => {
        const flowplayer = useFlowplayer()
        const lcevcPlayerContainer = document.createElement("div")
        lcevcPlayerContainer.classList.add("lcevc-player", "column-50")
        const token = useToken()
        const lcevcPlayer = flowplayer(lcevcPlayerContainer, {
            token: token
            })
        const lcevc = new LCEVC(Hls, lcevcPlayer, sharedConfig)
        const src = useSrcLCEVC()
        await lcevc.load(src)
        return {container: lcevcPlayerContainer, player: lcevcPlayer}
    })
}

async function createStandardPlayer () {
    const flowplayer = useFlowplayer()
    const standardPlayerContainer = document.createElement("div")
    standardPlayerContainer.classList.add("standard-player",  "column-50")
    players.append(standardPlayerContainer)
    const src = useSrcH264()
    const token = useToken()
    const standardPlayer = flowplayer(standardPlayerContainer, {
        token: token,
        src: src,
        ...sharedConfig
    })
    
    return {container: standardPlayerContainer, player: standardPlayer}
}



~(async function main (){
    // spawn the 2 players
    const [lcevc, standard] = await Promise.all([createLCEVCPlayer(), createStandardPlayer()])
    players.append(lcevc.container, standard.container)

    //add labels here
    labels.append("anything")
    createBitrateTimeseries("#timeseries", lcevc.player.hls, standard.player.hls)
}())


