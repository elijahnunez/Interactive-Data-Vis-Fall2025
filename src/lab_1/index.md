---
title: "Lab 1: Passing Pollinators"
toc: true
---

# Lab 1: Passing Pollinators

## What is the Bee's Knees?

```js 
const pollinators = FileAttachment("data/pollinator_activity_data.csv").csv({Typed: true})
```

```js
Inputs.table(pollinators)
```

* What is the body mass and wing span distribution of each pollinator species observed?

```js 
Plot.plot({
width: 800,
height: 400,
  x: {
    label: "Average Body Mass (g)",
    ticks: 1,
    grid: true,
   domain: [0, 0.7],
  },
  y: {
    label: "Average Wing Span (mm)",
    ticks: 20,
    grid: true,
     domain: [0, 50]
  },
  color: {
    legend: true,
    label: "Pollinator Species"
  },
  marks: [
    Plot.frame(),
    Plot.dot(pollinators, {
      x: "avg_body_mass_g",
      y: "avg_wing_span_mm",
      fill: "pollinator_species",
      tip: true
    })
  ]
})
```

## What is the ideal weather (conditions, temperature, etc) for pollinating?

### Visit Count by Temperature
All pollinator groups prefer wamer temperatures when pollinating. Larger bees prefer more humid temperatures, while medium and smaller bees, prefer lower humidity. 
```js
Plot.plot({
width: 900,
height: 600,
  facet: {
    data: pollinators,
    y: "pollinator_group",
  },
  x: { label: "Temperature" },
  y: { label: "Humidity" },

  color: {
    legend: true,
    label: "Total Visit Count"
  },
  marks: [
    Plot.frame(),
    Plot.rect(
      pollinators,
      Plot.bin(
        { fill: "sum" },
        {
          x: "temperature",
          y: "humidity",
          fill: "visit_count",
          tip: true
        }
      )
    )
  ]
})
```
### Visit count seperated by pollinator group
Cloudy conditions provided higher visit counts for medium and large bee groups but small bees prefered partly cloudy.
```js
Plot.plot({
  facet: {
    data: pollinators,
    x: "pollinator_group" // creates one small chart per group horizontally
  },
  marks: [
    Plot.barY(pollinators, {
      x: "weather_condition",
      y: "visit_count",
      fill: "weather_condition"
    })
  ],
  y: { grid: true },
  width: 800,
  height: 300,
  marginLeft: 50,
  marginBottom: 50
})
```

* Which flower has the most nectar production?
```js
Plot.plot({
  marks: [
    Plot.barY(pollinators, {x: "flower_species", y: "nectar_production"})
  ]
})
```
Sunflowers have the highest nectar prodcution in the data set.