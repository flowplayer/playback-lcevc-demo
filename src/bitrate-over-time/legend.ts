import type { LineChart } from "chartist";

export function legend (chart : LineChart) {
  const labels = getLabels(chart)
  console.log(chart, labels)
  const ol = document.createElement("ol")
  ol.classList.add("legend")
  ol.append(...labels.map((label : string) => {
    const li = document.createElement("li")
    li.textContent = label
    li.classList.add(label)
    return li
  }))

  chart.on("created", ()=> {
    chart.container.append(ol)
  })

}

function getLabels (chart : any) {
  return chart.data.series.map(({name} : {name: string})=> name)
}