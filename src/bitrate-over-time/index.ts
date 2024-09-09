import 'chartist/dist/index.css'
import { LineChart } from 'chartist'

const MAX_OBSERVATIONS = 20

type Instance =
  | typeof window.Hls

type Counter = {
  seconds: number;
  baseline: number;
  lcevc: number;
  series: Array<{x: Date, y: number}>,
}

export function createBitrateTimeseries (container : HTMLElement, lcevc : Instance, standard : Instance) {
  const lcevcSeries = {
    name: "lcevc",
    data: [] as Array<{x: Date, y: number}>,
  }

  const standardSeries = {
    name: "standard",
    data: [] as Array<{x: Date, y: number}>,
  }

  const savedCounter : Counter = {
    seconds: 0,
    baseline: 0,
    lcevc: 0,
    series: [],
  }

  const bitrateComparisonSeries = ()=> ({
    series: [lcevcSeries, standardSeries],
  })

  const bitrateComparison = document.createElement("div")

  container.append(bitrateComparison)

  const chartPadding = {
    right: 50,
    left: 50,
    top: 50
  }

  const comparisonTitle = document.createElement('h5')

  const leftTitle = document.createElement("span")
  leftTitle.textContent = "bitrate over time"

  const totalSaved = document.createElement("span")


  comparisonTitle.append(leftTitle, totalSaved)


  bitrateComparison.append(comparisonTitle)

  const bitrateTimeseriesChart = new LineChart(bitrateComparison, bitrateComparisonSeries(),
    {
      high: 7_500_000,
      low: 0,
      // Remove this configuration to see that chart rendered with cardinal spline interpolation
      // Sometimes, on large jumps in data values, it's better to use simple smoothing.
      //lineSmooth: Interpolation.simple({
      //  divisor: 1_000
      //}),
      fullWidth: true,
      //width: "50%",
      //height: "300px",
      showArea: false,
      showPoint: true,
      showLine: true,
      chartPadding,
      axisY: {
        labelInterpolationFnc: (value : number) => {
          return value / 1_000_000 + "mbps"
        }
      },
      axisX: {
        showLabel: false,
        showGrid: false
      }
    }
  )

  setInterval(function () {
    [lcevcSeries.data, standardSeries.data, savedCounter.series].forEach(series => {
      while (series.length > MAX_OBSERVATIONS) {
        series.shift()
      }
    })

    const lcevcBitrate = lcevc.levels[lcevc.currentLevel]?.bitrate
    const standardBitrate = standard.levels[standard.currentLevel]?.bitrate

    if (lcevcBitrate && standardBitrate) {
      savedCounter.seconds++
      savedCounter.baseline+=standardBitrate
      savedCounter.lcevc+=lcevcBitrate
      const now = new Date(Date.now())

      savedCounter.series.push({
        x: now,
        y: savedCounter.baseline - savedCounter.lcevc,
      })

      lcevcSeries.data.push({
        x: now,
        y: lcevcBitrate
      })

      standardSeries.data.push({
        x: now,
        y: standardBitrate
      })

      bitrateTimeseriesChart.update(bitrateComparisonSeries())
      const bitsSaved = ((savedCounter.baseline - savedCounter.lcevc) / 1_000_000).toFixed(2)
      totalSaved.textContent = bitsSaved + "mb saved"
    }
  }, 1_000)

  return container
}