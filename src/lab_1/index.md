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
  marks: [
    Plot.dot(pollinators, {
      x: "avg_body_mass_g",
      y: "avg_wing_span_mm",
      stroke: "pollinator_species"
    })
  ],
  
  // Updated x-axis format
  x: { 
    label: "Average Body Mass (g)",
    ticks: 10,
    tickFormat: ".3f"   // Formats to 3 decimal places
  },
  
  // Updated y-axis format
  y: { 
    label: "Average Wing Span (mm)",
    ticks: 8,
    tickFormat: ".3f"   // Formats to 3 decimal places
  },
  
  grid: true,
  width: window.innerWidth,
  height: 0.6 * window.innerHeight
})
```

## What is the ideal weather (conditions, temperature, etc) for pollinating?

### Visit Count by Temperature
All pollinator groups prefer wamer temperatures when pollinating 
```js
Plot.plot({
  inset: 8,
  grid: true,
  color: { legend: true }, // Will color the dots by pollinator_group

  // --- Y-Axis is now a percentage ---
  y: {
    label: "Proportion of Visits",
    grid: true
  },
  
  x: {
    label: "Temperature (°C)",
    tickFormat: d => `${d}°`,
  },

  marks: [
 
    Plot.dot(pollinators, 
      Plot.normalizeY(
        Plot.binX(
          { y: "total visit" }, 
          {
            x: "temperature",
            y: "visit_count",
            stroke: "pollinator_group" 
          }
        )
      )
    ),
    Plot.ruleY([0, 1]) 
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