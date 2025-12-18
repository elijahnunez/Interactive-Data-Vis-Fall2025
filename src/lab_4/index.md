---
title: "Lab 4: Clearwater Crisis"
toc: false
---

```js
const fish = await FileAttachment("data/fish_surveys.csv").csv({ typed: true});;
const stations = await FileAttachment("data/monitoring_stations.csv").csv({ typed: true});
const suspect = await FileAttachment("data/suspect_activities.csv").csv({ typed: true });
const water = await FileAttachment("data/water_quality.csv").csv({ typed: true });


// display(fish.slice(0,10))
// display(stations)
// display(suspect.slice(0,10))
// display(water.slice(0,10))
```

```js
const waterWithStations = water.map(w => {
  const station = stations.find(s => s.station_id === w.station_id);
  return {
    ...w,
    ...station
  };
});

const fishWithStations = fish.map(f => {
  const station = stations.find(s => s.station_id === f.station_id);
  return {
    ...f,
    ...station
  };
});

function getQuarter(date) {
  const d = new Date(date);
  return `Q${Math.floor(d.getMonth() / 3) + 1}-${d.getFullYear()}`;
}

const waterQuarterly = water.map(d => ({
  ...d,
  date: new Date(d.date),
  quarter: getQuarter(d.date)
}));

const waterByQuarter = Array.from(
  d3.group(waterQuarterly, d => d.station_id, d => d.quarter),
  ([station_id, quarters]) =>
    Array.from(quarters, ([quarter, rows]) => ({
      station_id,
      quarter,
      unhealthy_weeks: rows.filter(r => r.water_quality_status !== "Healthy").length,
      total_weeks: rows.length,
      violation_weeks: rows.filter(r => r.water_quality_status === "Violation").length,
      avg_heavy_metals: d3.mean(rows, r => r.heavy_metals_ppb),
      avg_nitrogen: d3.mean(rows, r => r.nitrogen_mg_per_L),
      avg_dissolved_oxygen: d3.mean(rows, r => r.dissolved_oxygen_mg_per_L)
    }))
).flat();

const fishWithWater = fishWithStations.map(f => {
  const quarter = getQuarter(f.date);
  const waterMatch = waterByQuarter.find(
    w => w.station_id === f.station_id && w.quarter === quarter
  );

  return {
    ...f,
    quarter,
    ...waterMatch
  };
});

const suspectTimeline = suspect.map(d => ({
  ...d,
  start: new Date(d.date),
  end: new Date(new Date(d.date).getTime() + d.duration_days * 86400000)
}));

```

```js
const fishTimeline = fish.map(d => ({
  ...d,
  date: new Date(d.date)
}));
```

```js
const stationColors = {
  domain: ["North", "East", "South", "West"],
  range: ["#4269d0", "#efb118", "#ff725c", "#6cc5b0"]
};
```


```js
const fishTime = fish.map(d => ({
  ...d,
  date: new Date(d.date),
  species_label: `${d.species} (${d.pollution_sensitivity})`
}));
```

```js
// Create a mapping of each suspect to their nearest station
const suspectToNearestStation = [
  {
    suspect: "ChemTech Industries",
    nearest_station: stations.reduce((closest, station) => 
      station.distance_to_chemtech_m < closest.distance_to_chemtech_m ? station : closest
    ),
    distance_field: "distance_to_chemtech_m"
  },
  {
    suspect: "Riverside Farm",
    nearest_station: stations.reduce((closest, station) => 
      station.distance_to_farm_m < closest.distance_to_farm_m ? station : closest
    ),
    distance_field: "distance_to_farm_m"
  },
  {
    suspect: "Lakeview Resort",
    nearest_station: stations.reduce((closest, station) => 
      station.distance_to_resort_m < closest.distance_to_resort_m ? station : closest
    ),
    distance_field: "distance_to_resort_m"
  },
  {
    suspect: "Clearwater Fishing Lodge",
    nearest_station: stations.reduce((closest, station) => 
      station.distance_to_lodge_m < closest.distance_to_lodge_m ? station : closest
    ),
    distance_field: "distance_to_lodge_m"
  }
];
```



```js
const stationDistances = stations.flatMap(station => [
  { station_id: station.station_id, station_name: station.station_name, suspect: "ChemTech Industries", distance_m: station.distance_to_chemtech_m },
  { station_id: station.station_id, station_name: station.station_name, suspect: "Riverside Farm", distance_m: station.distance_to_farm_m },
  { station_id: station.station_id, station_name: station.station_name, suspect: "Lakeview Resort", distance_m: station.distance_to_resort_m },
  { station_id: station.station_id, station_name: station.station_name, suspect: "Clearwater Fishing Lodge", distance_m: station.distance_to_lodge_m }
]);
```


```js
const westStationData = waterWithStations.filter(d => d.station_id === "West");
const chemtechActivities = suspectTimeline.filter(d => 
  d.suspect === "ChemTech Industries" && d.intensity === "High"
);
```


```js
const violations = waterWithStations.map(d => ({
  ...d,
  is_violation: d.heavy_metals_ppb > 30
}));

const violationsByStation = Array.from(
  d3.group(violations, d => d.station_id),
  ([station, data]) => ({
    station,
    total_violations: data.filter(d => d.is_violation).length,
    pct_violations: (data.filter(d => d.is_violation).length / data.length) * 100
  })
);
```



<H1>Like a Fish out of water</H1>


<div class="card">
  <h1>Heavy Metal Concentration vs Distance to ChemTech</h1>
  <span>
    ${Plot.plot({
  width: 700,
  height: 400,
  x: {
    label: "Distance to ChemTech (meters)"
  },
  y: {
    label: "Heavy Metals (ppb)"
  },
  color: {
    ...stationColors,
    legend: true,
    label: "Station"
  },
  marks: [
    Plot.dot(
      waterWithStations,
      {
        x: "distance_to_chemtech_m",
        y: "heavy_metals_ppb",
        fill: "station_id",
        r: 6,
        opacity: 0.6,
        tip: {
          channels: {
            "Station": "station_name",
            "Heavy Metals (ppb)": d => d.heavy_metals_ppb.toFixed(1),
            "Water Status": "water_quality_status",
            "Distance (m)": "distance_to_chemtech_m"
          }
        }
      }
    ),
    // Concern threshold line
    Plot.ruleY([20], {
      stroke: "orange",
      strokeDasharray: "4,4",
      strokeWidth: 2
    }),
    Plot.text(
      [{ y: 20, label: "Concern Threshold (20 ppb)" }],
      {
        x: 0,
        y: "y",
        text: "label",
        dy: -8,
        dx: 5,
        fill: "orange",
        textAnchor: "start",
        fontSize: 11
      }
    ),
    // Regulatory limit line
    Plot.ruleY([30], {
      stroke: "red",
      strokeWidth: 2
    }),
    Plot.text(
      [{ y: 30, label: "Regulatory Limit (30 ppb)" }],
      {
        x: 0,
        y: "y",
        text: "label",
        dy: -8,
        dx: 5,
        fill: "red",
        textAnchor: "start",
        fontSize: 11
      }
    )
  ]
})}

  </span>

</div>


 <p> Here we are looking at the stattions and thier contaminents relative to thier proxitimity to chem centers. as you can see the West district is the closest and is consistently the location where the heavy metal contaminates are highest. This is relevant as we see how the heavy metals affect the fishes in the areas. 
    </p>

<div class="card">
  <h1>Fish Health Over Time by Species</h1>
  <h3></h3>
  <span>
    ${Plot.plot({
  width: 800,
  height: 600,
  facet: {
    data: fishTime,
    y: "species_label",
    marginRight: 80,
    marginLeft: 80
  },
  x: {
    type: "time",
    label: "Date"
  },
  y: {
    label: "Average Length (cm)",
    axis: "right"
  },
  color: {
    ...stationColors,
    legend: true,
    label: "Station"
  },
  r: {
    range: [1, 12],
    label: "Fish Count"
  },
  marks: [
    Plot.frame({stroke: "black", strokeWidth: 2}),
    Plot.dot(
      fishTime,
      {
        x: "date",
        y: "avg_length_cm",
        r: "count",
        fill: "station_id",
        tip: {
          channels: {
            "Species": "species",
            "Station": "station_id",
            "Count": "count",
            "Avg Length (cm)": d => d.avg_length_cm.toFixed(1),
            "Date": d => d.date.toLocaleDateString()
          }
        }
      }
    ),
    // Average trend line per species
    Plot.line(
      fishTime,
      Plot.groupX(
        { y: "mean" },
        {
          x: "date",
          y: "avg_length_cm",
          stroke: "#1357eaff",
          strokeWidth: 2
        }
      )
    )
  ]
})}

  </span>
  
</div>

  <p> If you look at the west fishes comparison, fishes like bass and trout who are more senstitive compares to the carp are below average in terms of size and are less often caught probably from nto being able to reproduce at the same rate as the carp. 
    </p>

<div class="card">
  <h1>ChemTech Activity Periods vs Heavy Metals at West Station</h1>
  <h3></h3>
  <span>
    ${Plot.plot({
  width: 900,
  height: 400,
  x: { 
    type: "time", 
    label: "Date",
    domain: [new Date("2023-01-01"), new Date("2024-12-31")]
  },
  y: { 
    label: "Heavy Metals (ppb)",
    domain: [0, 80]  // Set explicit range
  },
  marks: [
    // Background shading for ChemTech high-intensity periods
    Plot.rect(
      chemtechActivities,
      {
        x1: "start",
        x2: "end",
        y1: 0,
        y2: 80,
        fill: "red",
        fillOpacity: 0.15
      }
    ),
    // Regulatory limit lines
    Plot.ruleY([30], { 
      stroke: "red", 
      strokeWidth: 2,
      strokeDasharray: "none"
    }),
    Plot.ruleY([20], { 
      stroke: "orange", 
      strokeWidth: 2,
      strokeDasharray: "4,4"
    }),
    // West station heavy metals as dots AND line
    Plot.dot(
      westStationData,
      {
        x: d => new Date(d.date),
        y: "heavy_metals_ppb",
        fill: "#6cc5b0",
        r: 5,
        tip: {
          channels: {
            "Date": d => new Date(d.date).toLocaleDateString(),
            "Heavy Metals (ppb)": d => d.heavy_metals_ppb.toFixed(1),
            "Status": "water_quality_status"
          }
        }
      }
    ),
    Plot.line(
      westStationData,
      {
        x: d => new Date(d.date),
        y: "heavy_metals_ppb",
        stroke: "#6cc5b0",
        strokeWidth: 2
      }
    ),
    // Add labels for thresholds
    Plot.text(
      [{ y: 30, label: "Regulatory Limit (30 ppb)" }],
      {
        x: new Date("2023-01-15"),
        y: "y",
        text: "label",
        dy: -8,
        fill: "red",
        textAnchor: "start",
        fontSize: 11
      }
    ),
    Plot.text(
      [{ y: 20, label: "Concern Threshold (20 ppb)" }],
      {
        x: new Date("2023-01-15"),
        y: "y",
        text: "label",
        dy: -8,
        fill: "orange",
        textAnchor: "start",
        fontSize: 11
      }
    )
  ]
})}

  </span>

</div>

<p> If you look at the west fishes comparison, fishes like bass and trout who are more senstitive compares to the carp are below average in terms of size and are less often caught probably from nto being able to reproduce at the same rate as the carp. 
 </p>

<div class="card">
  <h1></h1>
  <h3></h3>
  <span>
    ${Plot.plot({
  title: "Nitrogen Levels by Station (Farm Impact Assessment)",
  width: 800,
  height: 600,
  facet: { 
    data: waterWithStations, 
    y: "station_id",
    marginLeft: 80,
    marginRight: 80
  },
  x: { 
    type: "time", 
    label: "Date" 
  },
  y: { 
    label: "Nitrogen (mg/L)" 
  },
  color: {
    ...stationColors,
    legend: true,
    label: "Station"
  },
  marks: [
    Plot.frame({stroke: "black", strokeWidth: 2}),
    Plot.ruleY([1.5], { 
      stroke: "orange", 
      strokeDasharray: "4,4",
      strokeWidth: 2
    }),
    Plot.ruleY([2.0], { 
      stroke: "red",
      strokeWidth: 2
    }),
    Plot.line(
      waterWithStations, 
      { 
        x: d => new Date(d.date),
        y: "nitrogen_mg_per_L",  // Fixed: removed the "I"
        stroke: "station_id"
      }
    ),
    // Add threshold labels
    Plot.text(
      [{ y: 1.5, label: "Concern (1.5 mg/L)" }],
      {
        x: new Date("2023-01-15"),
        y: "y",
        text: "label",
        dy: -8,
        fill: "orange",
        textAnchor: "start",
        fontSize: 10
      }
    ),
    Plot.text(
      [{ y: 2.0, label: "Limit (2.0 mg/L)" }],
      {
        x: new Date("2023-01-15"),
        y: "y",
        text: "label",
        dy: -8,
        fill: "red",
        textAnchor: "start",
        fontSize: 10
      }
    )
  ]
})}

  </span>

</div>


 <p> With this graph we see that althouh the north may be fubming due to activities happening at the the farm it never supassed regulatory limits, and the firsh cought in the north we not any less bigger. 
</p>

