import flowplayer from "@flowplayer/player"
import HlsPlugin from "@flowplayer/player/plugins/hls"
import QSELPlugin from "@flowplayer/player/plugins/qsel"
import RTSPlugin from "@flowplayer/player/plugins/rts"

// import Subtitles from "@flowplayer/player/plugins/subtitles";

const flowplayerWithPlugins = flowplayer(HlsPlugin, QSELPlugin, RTSPlugin)

export function useFlowplayer () {
    return flowplayerWithPlugins
}