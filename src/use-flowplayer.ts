import flowplayer from "@flowplayer/player"
import HlsPlugin from "@flowplayer/player/plugins/hls"
import QSELPlugin from "@flowplayer/player/plugins/qsel"

const flowplayerWithPlugins = flowplayer(HlsPlugin, QSELPlugin)

export function useFlowplayer () {
    return flowplayerWithPlugins
}