import 'chartist/dist/index.css'
import { LineChart, Interpolation } from 'chartist'

const MAX_OBSERVATIONS = 60

type Instance =
  | typeof window.Hls

type Timeseries = {
  time: Date,
  values: Array<number>,
}

export function createBitrateTimeseries (id : string, lcevc : Instance, standard : Instance) {
  const lcevcSeries = {
    name: "lcevc",
    data: [] as Array<{x: Date, y: number}>,
  }

  const standardSeries = {
    name: "standard",
    data: [] as Array<{x: Date, y: number}>,
  }

  const series = ()=> ({
    series: [lcevcSeries, standardSeries],

  })

  const chart = new LineChart(id, series(),
    {
      high: 7_500_000,
      low: 0,
      // Remove this configuration to see that chart rendered with cardinal spline interpolation
      // Sometimes, on large jumps in data values, it's better to use simple smoothing.
      lineSmooth: Interpolation.simple({
        divisor: 1_000
      }),
      fullWidth: true,
      showArea: true,
      showPoint: false,
      showLine: false,
      chartPadding: {
        right: 20
      },
      axisY: {
        labelInterpolationFnc: (value : number) => {
          return value / 1_000_000 + "mbps"
        }
      }
    }
  )

  setInterval(function () {
    while (lcevcSeries.data.length > MAX_OBSERVATIONS) {
      lcevcSeries.data.shift()
    }

    while (standardSeries.data.length > MAX_OBSERVATIONS) {
      standardSeries.data.shift()
    }

    const lcevcBitrate = lcevc.levels[lcevc.currentLevel]?.bitrate
    const standardBitrate = standard.levels[standard.currentLevel]?.bitrate

    console.log("{lcevc=%s, standard=%s}", lcevcBitrate, standardBitrate)

    if (lcevcBitrate && standardBitrate) {
      const now = new Date(Date.now())

      lcevcSeries.data.push({
        x: now,
        y: lcevcBitrate
      })
      standardSeries.data.push({
        x: now,
        y: standardBitrate
      })

      chart.update(series())
    }
  }, 1_000)

  return chart
}