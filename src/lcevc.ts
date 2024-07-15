import flowplayer, { type Player } from "@flowplayer/player"
import type Hls from "hls.js"
import {Events} from "hls.js"
import { useToken } from "./use-token"
declare const window: Window & {
    Hls: Hls
}

export class LCEVC {
  lcevcDil?: LcevcDil.LcevcDil;
  canvas: HTMLCanvasElement = document.createElement("canvas")
  player : Player
  hls : typeof window.Hls

  constructor (readonly container : HTMLDivElement, readonly config : LcevcDil.LcevcDilConfig  = {}) {
    this.player = flowplayer(container, {token: useToken()})
    this.config = {...config, logLevel: 5}

    this.canvas.className = "fp-lcevc-output"
    this.hls = new (window as any).Hls()
    this.hls.attachMedia(this.player)
    ;(this.hls as any).attachLcevc(this.canvas, this.config);
    this.container.insertBefore(this.canvas, this.player.nextSibling)
  }

  async load (src: string) {
    this.hls.loadSource(src)
    
    this.implementationDetails()

    const attached = new Promise(resolve => this.hls.on(Events.MEDIA_ATTACHED, resolve))

    Promise.all([attached, LcevcDil.ready]).then(() => {
      console.log("creating LCEVC instance")
      this.lcevcDil = new LcevcDil.LcevcDil(this.player, this.canvas, this.config)
      this.player.setState("is-lcevc", true)
      this.player.setState("is-starting", true)
    })
  }

  implementationDetails () {
    this.hls.on(Events.MANIFEST_LOADING, () => {
        if (this.lcevcDil) {
          console.log("manifest loading - calling resetDecoder()")
          this.lcevcDil.resetDecoder()
        }
      })
  
      this.hls.on(Events.BUFFER_APPENDING, (_,data) => {
        if (!this.lcevcDil) return console.log("buffer available but lcevcDil not initialised")
        switch (data.type) {
          case "audiovideo":
          case "video":
            return this.lcevcDil.appendBuffer(
              data.data,
              data.type,
              data.frag.level,
              data.frag.start,
              data.frag.start + data.frag.duration
            )
        }
      })
  
      this.hls.on(Events.BUFFER_FLUSHING, (_,data) => {
        if (!this.lcevcDil) return
        console.log("buffer flushing - calling flushBluffer()")
        this.lcevcDil.flushBuffer(data.startOffset, data.endOffset)
      })
  
      this.hls.on(Events.LEVEL_PTS_UPDATED, (_,data) => {
        if (!this.lcevcDil) return
        console.log("pts updated, calling newPts()")
        this.lcevcDil.newPts(data.start, data.end, data.type, data.level.id, data.drift)
      })
  
      this.hls.on(Events.LEVEL_SWITCHING, (_,data) => {
        if (!this.lcevcDil) return
        console.log("level switching, calling resetBuffer() and setLevelSwitching()")
        this.lcevcDil.resetBuffer()
        this.lcevcDil.setLevelSwitching(data.level)
      })
  
      this.hls.on(Events.LEVEL_SWITCHED, (_, data) => {
        if (!this.lcevcDil) return
        console.log("level switched, calling setCurrentLevel())")
        this.lcevcDil.setCurrentLevel(data.level)
      })
  }
}