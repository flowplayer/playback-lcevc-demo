import "./app.css"
import { LCEVC } from "./lcevc/lcevc"
import { useSrcLCEVC } from "./use-src-lcevc"
import { useSrcH264 } from "./use-src-h264"
import { useToken } from "./use-token"
import { useFlowplayer } from "./use-flowplayer"
import { createBitrateTimeseries } from "./bitrate-over-time"

// setup globals
const app = document.getElementById("app")!
const players = document.createElement("div")

const sharedConfig = {
    autoplay: true,
}

function layout () {
    const labels = document.createElement("div")
    players.classList.add("players")
    const timeseries = document.createElement("div")
    timeseries.id = "timeseries"
    app.append(players, labels, timeseries)
    return {players, timeseries, labels}
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

async function dual (){
    const {timeseries} = layout()
    // spawn the 2 players
    const [lcevc, standard] = await Promise.all([createLCEVCPlayer(), createStandardPlayer()])
    players.append(lcevc.container, standard.container)

    //add chart here
    createBitrateTimeseries(timeseries, lcevc.player.hls, standard.player.hls)
}

async function single (){
    layout()
    // spawn the single player
    const [standard] = await Promise.all([createStandardPlayer()])
    players.append(standard.container)
}

const obj = JSON.parse(app.dataset.json!)
const mode = obj.mode

if (mode==1)
    single()
else
    dual()


