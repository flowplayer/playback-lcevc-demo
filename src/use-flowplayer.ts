import flowplayer from "@flowplayer/player"
import HlsPlugin from "@flowplayer/player/plugins/hls"
import QSELPlugin from "@flowplayer/player/plugins/qsel"

flowplayer(HlsPlugin, QSELPlugin)

export function useFlowplayer () {
    return flowplayer
}