import type Hls from "hls.js"

declare global {
  namespace LcevcDil {
    const ready: Promise<void>
    class LcevcDil {
      constructor(media: HTMLMediaElement, canvas: HTMLCanvasElement, config: LcevcDilConfig)
      public get video(): HTMLMediaElement
      public get isFullscreen(): boolean
      public get isLive(): boolean
      public get isPerformanceScalingEnabled(): boolean
      public enablePerformanceScaling(val: boolean): void
      public get isPerformanceScalingActive(): boolean
      public get isLcevcEnabled(): boolean
      public get lcevcDataDetected(): boolean
      public get frameWidth(): number
      public get frameHeight(): number
      public get currentLevel(): number
      public get firstLcevcSegmentLoaded(): number
      public get aspectRatio(): number
      public get frameRate(): number
      public getConfigOption(key: string): any
      public setConfigOption(key: string, value: any): void
      public get logLevel(): LogLevel
      public set logLevel(val: LogLevel)
      public get profileIn(): string
      public setProfileIn(val: string): void
      public get profileOut(): string
      public setProfileOut(val: string): void
      public onFullscreen(val: boolean): void
      public clearTemporal(): void
      public setCurrentLevel(level: number): void
      public setLevelSwitching(level: number): void
      public appendBuffer(data: Uint8Array, type: "audiovideo" | "video" | "audio", level: number, start?: number, end?: number): void
      public flushBuffer(start: number, end: number): void
      public resetBuffer(): void
      public newPts(start: number, end: number, type: string, level: number, drift: number): void
      public displayError(msg: string): void
      public clearError(): void
      public close(): void
      public resetDecoder(): void
    }
    type LcevcDilConfig = {
      renderAtDisplaySize?: boolean
      logLevel?: LogLevel
      dps?: boolean
    }

    enum LogLevel {
      NONE,
      ERROR,
      WARNING,
      INFO,
      DEBUG,
      VERBOSE
    }

    const DIL_BUILD_DATE: string
  }
}

export interface LCEVCWindow extends Window {
  Hls: Hls
}


export {}