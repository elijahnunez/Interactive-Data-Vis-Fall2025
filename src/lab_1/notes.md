<!-- ```js
view(Inputs.table(diamonds))
```

```js
  Plot.plot({
    hieght: 200,
    color: {
      scheme:"YlOrRd",
      legend: true
    },
    marks:[
      Plot.barY(diamonds,
        Plot.groupX(
        {y: "count", fill: "mean"},
        {x:"cut", y: "count", fill: "price", tip: true}
      )
      )]
      }) 
```

```js
Plot.plot({
  marks:[
    Plot.frame(),
    Plot.cell(diamonds.filter((d, i) => i < 100),{
      x: "color",
      y: "cut"
    })
  ]
})
```

```js
Plot.plot({
  marks:[
    Plot.frame(),
    Plot.text(diamonds, 
      Plot.group(
        {text:"count"},
        {x:"color", y:"cut", text: "count"}
      )
    )
  ]
})
```
```js
Plot.plot({
color: {
      scheme:"YlOrRd",
      legend: true,
      label: "average price"
    },
  marks:[
    Plot.frame(),
    Plot.cell(diamonds, 
      Plot.group(
        {fill:"mean"},
        {x:"color", y:"cut", fill: "price", tip: true}
      )
    )
  ]
})
``` -->
<!DOCTYPE html>
<meta charset="utf-8">
<body>
<script src="https://d3js.org/d3.v7.min.js"></script>
<script>

// Your data
const data = [
  { Year: 2026, ProgramCycle: "Career Launch GOAL", PriorityApps: 5000, TotalNotPriorityApps: 2700 },
  { Year: 2026, ProgramCycle: "Spring Forward", PriorityApps: 5792, TotalNotPriorityApps: 3258 },
  { Year: 2025, ProgramCycle: "Spring Forward", PriorityApps: 5688, TotalNotPriorityApps: 3307 },
  { Year: 2025, ProgramCycle: "Career Launch", PriorityApps: 4051, TotalNotPriorityApps: 2933 },
  { Year: 2024, ProgramCycle: "Spring Forward", PriorityApps: 3756, TotalNotPriorityApps: 3909 },
  { Year: 2024, ProgramCycle: "Career Launch", PriorityApps: 3009, TotalNotPriorityApps: 3260 },
  { Year: 2023, ProgramCycle: "Spring Forward", PriorityApps: 2758, TotalNotPriorityApps: 1358 },
  { Year: 2023, ProgramCycle: "Career Launch", PriorityApps: 3621, TotalNotPriorityApps: 2219 }
];

// Prepare data for 100% stacked layout
data.forEach(d => {
  const total = d.PriorityApps + d.TotalNotPriorityApps;
  d.PriorityPct = (d.PriorityApps / total) * 100;
  d.NotPriorityPct = (d.TotalNotPriorityApps / total) * 100;
});

// Stack keys
const keys = ["PriorityPct", "NotPriorityPct"];

// Set colors
const color = d => {
  if (d === "NotPriorityPct") return "#CCCCCC";
  return d3.select(this).data()?.[0]?.ProgramCycle?.includes("Spring Forward")
    ? "#00E0CC"
    : "#F7C305";
};

// Chart dimensions
const margin = { top: 40, right: 20, bottom: 80, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// SVG setup
const svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// X scale: program + year
const x = d3.scaleBand()
  .domain(data.map(d => `${d.Year} ${d.ProgramCycle}`))
  .range([0, width])
  .padding(0.2);

// Y scale: 0–100%
const y = d3.scaleLinear()
  .domain([0, 100])
  .range([height, 0]);

// Color scale for each stack segment
const colorScale = d3.scaleOrdinal()
  .domain(["Career Launch", "Career Launch GOAL", "Spring Forward", "NotPriorityPct"])
  .range(["#F7C305", "#F7C305", "#00E0CC", "#CCCCCC"]);

// Stack generator
const stack = d3.stack()
  .keys(keys);

const stackedSeries = stack(data);

// Draw bars
svg.selectAll("g.layer")
  .data(stackedSeries)
  .join("g")
  .attr("class", "layer")
  .attr("fill", (d, i) => i === 1 ? "#CCCCCC" : null) // gray for not priority
  .selectAll("rect")
  .data(d => d.map(v => ({ ...v.data, y0: v[0], y1: v[1], key: d.key })))
  .join("rect")
  .attr("x", d => x(`${d.Year} ${d.ProgramCycle}`))
  .attr("y", d => y(d.y1))
  .attr("height", d => y(d.y0) - y(d.y1))
  .attr("width", x.bandwidth())
  .attr("fill", d =>
    d.key === "NotPriorityPct"
      ? "#CCCCCC"
      : d.ProgramCycle.includes("Spring Forward")
      ? "#00E0CC"
      : "#F7C305"
  );

// X-axis
svg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "rotate(-25)")
  .style("text-anchor", "end");

// Y-axis
svg.append("g")
  .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + "%"));

// Chart title
svg.append("text")
  .attr("x", width / 2)
  .attr("y", -10)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("font-weight", "bold")
  .text("100% Stacked Bar Chart — Priority vs Not Priority Apps");

</script>
</body>
</html>