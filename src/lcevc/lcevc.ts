import { type Player } from "@flowplayer/player"

type Todo =
  | any

export class LCEVC {
  decoder?: Todo
  canvas: HTMLCanvasElement = document.createElement("canvas")
  hls : typeof window.Hls

  constructor (readonly player: Player, readonly config : any) {
    this.config = {...config, logLevel: 5}
    this.canvas.className = "fp-lcevc-output"
    this.hls = new window.Hls({
      //enableWorker: false
    })
    this.player.root.insertBefore(this.canvas, this.player.nextSibling)
  }

  async load (src: string) {
    await window.LCEVCdec.ready
    this.attachEventHandlers()
    this.hls.attachMedia(this.player)
    this.hls.loadSource(src)

  }

  private attachEventHandlers () {
    this.hls.on(window.Hls.Events.MEDIA_ATTACHING, (_ : any, data : any)=> {
      console.log("creating LCEVC instance")
      this.decoder = new window.LCEVCdec.LCEVCdec(data.media, this.canvas, this.config)
      this.player.setState("is-lcevc", true)
      this.player.setState("is-starting", true)
    })

    this.hls.on(window.Hls.Events.MEDIA_DETACHING, ()=> {
      if (this.decoder) {
        console.log("destroying LCEVC instance")
        this.decoder.close()
        this.decoder = void 0;
      }
    })

    this.hls.on(window.Hls.Events.MANIFEST_LOADING, () => {
        if (this.decoder) {
          console.log("manifest loading - calling resetDecoder()")
          this.decoder.resetDecoder()
        }
      })

      this.hls.on(window.Hls.Events.BUFFER_APPENDING, (_ : any,data : any) => {
        if (!this.decoder) return console.log("buffer available but lcevcDil not initialised")
        switch (data.type) {
          case "audiovideo":
          case "video":
            return this.decoder.appendBuffer(
              data.data,
              data.type,
              data.frag.level
            )
        }
      })

      this.hls.on(window.Hls.Events.BUFFER_FLUSHING, (_ : any,data : any) => {
        if (!this.decoder) return
        console.log("buffer flushing - calling flushBluffer()")
        this.decoder.flushBuffer(data.startOffset, data.endOffset)
      })

      this.hls.on(window.Hls.Events.LEVEL_PTS_UPDATED, (_ : any,data : any) => {
        if (!this.decoder) return
        console.log("pts updated, calling newPts()")
        this.decoder.newPts(data.start, data.end, data.type, data.level.id, data.drift)
      })

      this.hls.on(window.Hls.Events.LEVEL_SWITCHING, (_ : any,data : any) => {
        if (!this.decoder) return
        console.log("level switching, calling resetBuffer() and setLevelSwitching()")
        this.decoder.setLevelSwitching(data.level)
      })

      this.hls.on(window.Hls.Events.LEVEL_SWITCHED, (_ : any, data : any) => {
        if (!this.decoder) return
        console.log("level switched, calling setCurrentLevel())")
        this.decoder.setCurrentLevel(data.level)
      })
  }
}