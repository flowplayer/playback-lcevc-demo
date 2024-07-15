import flowplayer from "@flowplayer/player"
import HlsPlugin from "@flowplayer/player/plugins/hls"

flowplayer(HlsPlugin)

export function useFlowplayer () {
    return flowplayer
}