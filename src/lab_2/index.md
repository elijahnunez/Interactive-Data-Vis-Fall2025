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


<style>
  .card {
    font-family: monospace;
    color: #fefbfbff;
    padding: 10px;
    font-size: 14px;
    font-weight: 400;
  }
</style>

<h1>Lab 2: Crowds, Crises, and Capacity: Manhattan Subways</h1>

<div class="card">
  <h1>How did local events impact ridership in summer 2025? What effect did the July 15th fare increase have?</h1>
  <span>
    ${Plot.plot({
      marginLeft: 100,
      y: { grid: true, label: "Total Daily Ridership" },
      x: { label: "Date" },
      color: { legend: true },
      marks: [
        Plot.ruleY([0]),
        Plot.line(
          ridership,
          Plot.groupX({ y: "sum" }, { x: "date", y: "entrances", tip: true })
        ),
        Plot.line(
          ridership,
          Plot.groupX(
            { y: "sum" },
            { x: "date", y: "exits", stroke: "#9ecae1", tip: true }
          )
        ),
        Plot.ruleX([new Date("2025-07-15")], {
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
    })}
 
  </span>
     <p>
      Almost 100,000 less enterances after the July 15th fare increase.
    </p>
</div>



<div class="card">
  <h1>How do the stations compare when it comes to response time? Which are the best, which are the worst?</h1>
  <span>
    ${Plot.plot({
      marginLeft: 120,
      marks: [
        Plot.ruleX([0]),
        Plot.tickX(incidents, {
          x: "response_time_minutes",
          y: "station",
          strokeOpacity: 0.3,
          tip: true
        }),
        Plot.tickX(
          incidents,
          Plot.groupY(
            { x: "mean" },
            {
              x: "response_time_minutes",
              y: "station",
              stroke: "red",
              strokeWidth: 4,
              sort: { y: "x" }
            }
          )
        )
      ]
    })}

  </span>
  <p>
    Colombus Circle has an average resolution time of 18.9 minutes and higher resolution times overall.
    Fulton St. has the quickest resolution times with an average of 5 minutes and a max of 8.9 minutes.
    This is the best station when it comes to resolutions.
  </p>
</div>

<div class="card">
  <h1>Which three stations need the most staffing help for next summer based on the 2026 event calendar?</h1>
  <h3>If you had to prioritize one station to get increased staffing, which would it be and why?</h3>
  <span>
    ${Plot.plot({
      color: { legend: true, scheme: "Reds" },
      marginBottom: 130,
      x: { tickRotate: 45 },
      marks: [
        Plot.barY(
          combinedData,
          Plot.groupX(
            { y: "sum" },
            { x: "station", y: "staffing", fill: "attendance", tip: true }
          )
        )
      ]
    })}

  </span>
    <p>
      Canal St., 34 St. - Penn Station, and Chambers St. all will have the highest event attendance based on next summer’s projections.
      <br><br>
      Canal Street will have the most event attendance but one of the lowest staffing levels. This station should be prioritized for increased staffing.
    </p>
</div>
