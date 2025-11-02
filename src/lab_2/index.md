---
title: "Lab 2: Subway Staffing"
toc: true
---



<!-- Import Data -->
```js
const incidents = FileAttachment("./data/incidents.csv").csv({ typed: true })
const local_events = FileAttachment("./data/local_events.csv").csv({ typed: true })
const upcoming_events = FileAttachment("./data/upcoming_events.csv").csv({ typed: true })
const ridership = FileAttachment("./data/ridership.csv").csv({ typed: true })
```

<!-- Include current staffing counts from the prompt -->

```js
const currentStaffing = {
  "Times Sq-42 St": 19,
  "Grand Central-42 St": 18,
  "34 St-Penn Station": 15,
  "14 St-Union Sq": 4,
  "Fulton St": 17,
  "42 St-Port Authority": 14,
  "Herald Sq-34 St": 15,
  "Canal St": 4,
  "59 St-Columbus Circle": 6,
  "125 St": 7,
  "96 St": 19,
  "86 St": 19,
  "72 St": 10,
  "66 St-Lincoln Center": 15,
  "50 St": 20,
  "28 St": 13,
  "23 St": 8,
  "Christopher St": 15,
  "Houston St": 18,
  "Spring St": 12,
  "Chambers St": 18,
  "Wall St": 9,
  "Bowling Green": 6,
  "West 4 St-Wash Sq": 4,
  "Astor Pl": 7
}
```

* How did local events impact ridership in summer 2025? What effect did the July 15th fare increase have?
* How do the stations compare when it comes to response time? Which are the best, which are the worst?
* Which three stations need the most staffing help for next summer based on the 2026 event calendar?
* If you had to prioritize one station to get increased staffing, which would it be and why?

```js
Plot.plot({
  y: {
    grid: true,
    label: "Total Daily Ridership"
  },
  x: {
    label: "Date"
  },
  color: {
    legend: true // Legend for Entrances/Exits
  },
  marks: [
    Plot.ruleY([0]),

    // 1. Draw the line for total ENTRANCES
    Plot.line(ridership, Plot.groupX(
      {y: "sum"},
      {
        x: "date",
        y: "entrances",
        stroke: "Entrances",
        tip: true
      }
    )),
    
    // 2. Draw the line for total EXITS
    Plot.line(ridership, Plot.groupX(
      {y: "sum"},
      {
        x: "date",
        y: "exits",
        stroke: "Exits",
        tip: true 
      }
    )),

    // 3. Add a vertical rule for the FARE INCREASE
    Plot.ruleX([new Date("2025-07-15")], {
      stroke: "red",
      strokeDasharray: "4,4"
    }),
    
    // 4. Add a label for the FARE INCREASE
    Plot.text(["July 15th Fare Increase"], {
      x: new Date("2025-07-15"),
      fill: "red",
      textAnchor: "start",
      dy: -10,
      dx: 5
    }),
    
    // 5. NEW: Add vertical rules for LOCAL EVENTS
    Plot.ruleX(local_events, {
      x: "date",
      stroke: "blue",
      strokeDasharray: "2,2",
      strokeOpacity: 0.5
    }),
    
    // 6. NEW: Add text labels for LOCAL EVENTS
    Plot.text(local_events, {
      x: "date",
      text: "event_name",
      fill: "blue",
      rotate: -50,         // Rotate text to prevent overlap
      textAnchor: "start", // Anchor text to the start (bottom) of the label
      y: 1000,             // Place text at a low point on the chart
      fontSize: 10,
      // Add a tip to see event details on hover
      tip: {
        format: {
          x: false, // Don't show the date in the tip (it's redundant)
          y: false,
          text: false,
          fill: false,
          fontSize: false,
          rotate: false,
          textAnchor: false
        }
      }
    })
  ]
})
```