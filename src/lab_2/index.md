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

```js
const staffingTable = Object.entries(currentStaffing).map(([station, staffing]) => {
  return { station: station, staffing: staffing };
});
```

### How did local events impact ridership in summer 2025? What effect did the July 15th fare increase have?

```js
Plot.plot({
  color:{
    legend: true
  },
  marginLeft: 100,
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
    Plot.line(ridership, Plot.groupX(
      {y: "sum"},
      {
        x: "date",
        y: "entrances",
        tip: true
      }
    )),
    Plot.ruleY([0]),
    Plot.line(ridership, Plot.groupX(
      {y: "sum"},
      {
        x: "date",
        y: "exits",
        stroke: "#9ecae1",
        tip: true,
        legend: true
      }
    )),
    Plot.ruleX( 
      [new Date("2025-07-15")], {
      stroke: "red",
      strokeDasharray: "4,4"
    }),
    Plot.text(
      [{ date: new Date("2025-07-15"), label: "July 15th fare increse" }], 
      {
        x: "date",
        text: "label",
        fill: "red", 
        frameAnchor: "left", 
        dx: 10,
        textBaseline: "top"
      }
    )
    ]
      })
```
Almost 100,000 less enterances occured after the July 15th fare increase.



### How do the stations compare when it comes to response time? Which are the best, which are the worst?
<!-- 
```js
Inputs.table(incidents)
``` -->


```js
const filteredIncidents = selectedSeverity === "All"
    ? incidents // If "All" is selected, use the original data
    : incidents.filter(d => d.severity === selectedSeverity); // Otherwise, filter

  // 2. Return the plot, now using the 'filteredIncidents'
  return Plot.plot({
    marginLeft: 120,
    marks: [
      Plot.ruleX([0]),
      Plot.tickX(
        filteredIncidents, // Use the filtered data
        {x: "response_time_minutes", y: "station", strokeOpacity: 0.3, tip: true}
      ),
      Plot.tickX(
        filteredIncidents, // Use the filtered data
        Plot.groupY(
          {x: "mean"},
          {x: "response_time_minutes", y: "station", stroke: "red", strokeWidth: 4, sort: {y: "x"}}
        )
      )
    ]
  })
```

```js
Plot.plot({
  marginLeft: 120,
  marks: [
    Plot.ruleX([0]),
    Plot.tickX(
      incidents,
      {x: "response_time_minutes", y: "station", strokeOpacity: 0.3,tip: true}
    ),
    Plot.tickX(
      incidents,
      Plot.groupY(
        {x: "mean"},
        {x: "response_time_minutes", y: "station", stroke: "red", strokeWidth: 4, sort: {y: "x"}}
      )
    )
  ]
})
```
<!-- 
```js 
Plot.plot({
  marginLeft: 120,
  color: {
    legend: true,
scheme: "plasma"
  },
  marks:[
    Plot.barX(incidents,
      Plot.groupY(
        {x: "count"},
        {y:"station", x:"severity", fill:"severity", tip: true,
          sort: {x: "y", reverse: true}
        }
    )
)]
})
``` -->


<!-- 
```js
Plot.plot({
    y: {label: "expected_attendance (thousands)", transform: (y) => y / 1000},

  marks: [
    Plot.lineY(upcoming_events, {x: "date", y: "expected_attendance",   channels: {name: "name", sport: "sport"},
tip: true})
  ]
})
``` -->

<!-- ```js
Inputs.table(upcoming_events)
``` -->


<!-- ```js
Plot.plot({
     marginBottom: 130,
     x: {
    tickRotate: 45 // Rotates labels 45 degrees
  },
  marks: [
    Plot.barY(staffingTable, 
    Plot.groupX(
      {y: "sum"},
      {x: "station", y: "staffing",
tip: true}))
  ]
})
```

```js
Plot.plot({
   marginBottom: 130,
    y: {label: "expected_attendance (thousands)", transform: (y) => y / 1000},
    x: {
    tickRotate: 45 // Rotates labels 45 degrees
  },
  marks: [
    Plot.barY(upcoming_events, 
    Plot.groupX(
      {y: "sum"},
      {x: "nearby_station", y: "expected_attendance",
tip: true}))
  ]
})
``` -->

### 3. Which three stations need the most staffing help for next summer based on the 2026 event calendar?
### 3a. If you had to prioritize one station to get increased staffing, which would it be and why?

```js
const attendanceByStation = new Map();
for (const event of upcoming_events) {
  const station = event.nearby_station;
  const attendance = event.expected_attendance;
  attendanceByStation.set(station, (attendanceByStation.get(station) || 0) + attendance);
}

const combinedData = staffingTable.map(d => {
  const station = d.station;
  const staffing = d.staffing;
  const attendance = attendanceByStation.get(station) || 0; 
  
  return {
    station: station,
    staffing: staffing,
    attendance: attendance
  };
});
```
<!-- 
```js
Inputs.table(combinedData)
``` -->

```js

Plot.plot({
  color:{
    legend: true,
    scheme: "Reds"
  },
   marginBottom: 130,
    x: {
    tickRotate: 45 // Rotates labels 45 degrees
  },
  marks: [
    Plot.barY(combinedData, 
    Plot.groupX(
      {y: "sum"},
      {x: "station", y: "staffing", fill: "attendance",
tip: true}))
  ]
})
```

Canal St., 34 St. - Penn Station, and Chambers St. all will the highest event attendence based off next summers event attendence. 

Canal Street, will have the most event attendences but has the one of the lowest staffing, this station should be prioritized in recieveing more staff.


div class="grid grid-cols-4">
<div class="card"><span>a</span></div>
<div class="card"><span>b</span></div>
<div class="card"><span>c</span></div>
<div class="card"><span>d</span></div>
</div>

<style>
  .code {
    font-family: monospace;
    color: #333;
    padding: 10px;
    font-size: 14px;
    font-weight: 400;
  }
  </style>

  <div class="card">
  this is going to have <span class="code"> ${Plot.plot({
  color:{
    legend: true
  },
  marginLeft: 100,
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
    Plot.line(ridership, Plot.groupX(
      {y: "sum"},
      {
        x: "date",
        y: "entrances",
        tip: true
      }
    )),
    Plot.ruleY([0]),
    Plot.line(ridership, Plot.groupX(
      {y: "sum"},
      {
        x: "date",
        y: "exits",
        stroke: "#9ecae1",
        tip: true,
        legend: true
      }
    )),
    Plot.ruleX( 
      [new Date("2025-07-15")], {
      stroke: "red",
      strokeDasharray: "4,4"
    }),
    Plot.text(
      [{ date: new Date("2025-07-15"), label: "July 15th fare increse" }], 
      {
        x: "date",
        text: "label",
        fill: "red", 
        frameAnchor: "left", 
        dx: 10,
        textBaseline: "top"
      }
    )
    ]
      })}</span>
  </div>




