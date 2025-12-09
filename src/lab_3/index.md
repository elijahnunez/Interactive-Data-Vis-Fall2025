---
title: "Lab 3: Mayoral Mystery"
toc: false
---

<!-- Import Data -->
```js
const nyc = await FileAttachment("data/nyc.json").json();
const results = await FileAttachment("data/election_results.csv").csv({ typed: true});
const survey = await FileAttachment("data/survey_responses.csv").csv({ typed: true });
const events = await FileAttachment("data/campaign_events.csv").csv({ typed: true });

// // NYC geoJSON data
// display(nyc)
// // Campaign data (first 10 objects)
// display(results.slice(0,10))
// display(survey.slice(0,10))
// display(events.slice(0,10))
```

```js
// The nyc file is saved in data as a topoJSON instead of a geoJSON. Thats primarily for size reasons -- it saves us 3MB of data. For Plot to render it, we have to convert it back to its geoJSON feature collection. 
const districts = topojson.feature(nyc, nyc.objects.districts)
```
<!-- 
```js
const resultsMap = new Map(results.map(d => [+d.boro_cd, 
+d.median_household_income]))

display(resultsMap)
```

```js
const turnoutsMap = new Map(results.map(d => [+d.boro_cd, 
+d.turnout_rate]))

display(turnoutsMap)
```


```js
const eventsClean = events.map(d => ({
  boro_cd: +d.boro_cd,
  event_type: d.event_type,
  latitude: +d.latitude,
  longitude: +d.longitude,
  attendance: +d.estimated_attendance
}));

display(eventsClean.slice(0, 5));
```

```js 
const eventColorMap = {
  "Canvassing Kickoff": "#FFFF00",  
  "Community Meeting":   "#FF6600", 
  "Rally":               "#FEC085", 
  "Roundtable":          "#D94801", 
  "Town Hall":           "#F46A25", 
  "Volunteer Training":  "#FFBF00", 
  "undefined":           "#BBBBBB"  
};

```

```js 
const attendanceScale = Plot.scale({
  type: "sqrt",
  domain: d3.extent(eventsClean, d => d.attendance),
  range: [4, 25]  // adjust bubble size here
});

```

```js
Plot.plot({
  width: 900,
  height: 700,
  projection: {
    type: "mercator",
    domain: districts
  },
  color: {
    legend: true,
    scheme: "blues",
    label: "Turnout Rate (%)"
  },
  marks: [
    // Choropleth base
    Plot.geo(districts, {
      fill: d => turnoutsMap.get(+d.properties.BoroCD),
      stroke: "white",
      tip: true
    }),

    // Event bubbles
    Plot.dot(eventsClean, {
      x: "longitude",
      y: "latitude",
      r: d => attendanceScale(d.attendance),   // <-- FIXED
      fill: d => eventColorMap[d.event_type],  // <-- custom colors
      stroke: "black",
      strokeWidth: 0.5,
      opacity: 0.85,
      tip: true,
      channels: {
        "Event Type": d => d.event_type,
        "Attendance": d => d.attendance
      }
    })
  ]
})

``` -->



<!-- 

```js
Plot.plot({
  projection: {
    domain: districts,
    type: "mercator",
  },
  color: { 
    scheme: "blues", 
    label: "Median Household Income", 
    legend: true
  },
  marks: [
    Plot.geo(districts, { 
      fill: (d) => {
        const income = resultsMap.get(d.properties.BoroCD); // BoroCD is a number
        console.log(d.properties.BoroCD, income);
        return income;
      },
      stroke: "black",
      tip: true,
      channels: {
        "BoroCD": "BoroCD",
        "Median Household Income": (d) => resultsMap.get(d.properties.BoroCD)
      }
    }),
  ]
})
``` -->


# What About the Mayor?

To explore voter behavior, campaign strategy, and policy sentiment, I analyzed district-level turnout, event activity, and survey responses. The visuals below help illustrate where the campaign was active, how communities responded, and which issues resonated most strongly with voters.



```js
const turnoutsMap = new Map(results.map(d => [+d.boro_cd, +d.turnout_rate]));
```

```js
const eventsClean = events.map(d => ({
  boro_cd: +d.boro_cd,
  event_type: d.event_type ?? "undefined",
  latitude: +d.latitude,
  longitude: +d.longitude,
  attendance: +d.estimated_attendance
}));

```

```js
const attendanceScale = d => 25 * Math.sqrt(d);
```

```js
const turnoutColor = d3.scaleSequential()
  .domain(d3.extent([...turnoutsMap.values()]))
  .interpolator(d3.interpolateBlues);
```

```js
const eventColorMap = {
  "Canvassing Kickoff": "#FFFF00",
  "Community Meeting":   "#FF6600",
  "Rally":               "#FEC085",
  "Roundtable":          "#D94801",
  "Town Hall":           "#F46A25",
  "Volunteer Training":  "#FFBF00",
  "undefined":           "#BBBBBB"
};
```

### Events vs Voter Turnout Rate (%)

```js

Plot.plot({
  width: 900,
  height: 700,
  projection: {
    type: "mercator",
    domain: districts
  },
  color: {
    legend: true,
    domain: Object.keys(eventColorMap),
    range: Object.values(eventColorMap),
    label: "Event Type"
  },
  r: {
    range: [2, 8], // Adjust these values to control min/max circle sizes
    label: "Attendance"
  },
  marks: [
    Plot.geo(districts, {
      fill: d => turnoutColor(turnoutsMap.get(+d.properties.BoroCD)),
      stroke: "white",
      tip: true,
      channels: { "Turnout rate%": d => turnoutsMap.get(+d.properties.BoroCD) }
    }),
    Plot.dot(eventsClean, {
      x: "longitude",
      y: "latitude",
      r: "attendance", // Use the field name, not a function
      fill: d => eventColorMap[d.event_type],
      stroke: "black",
      strokeWidth: 0.5,
      opacity: 0.85,
      tip: true,
      channels: { "Event Type": d => d.event_type, "Attendance": d => d.attendance }
    }),
    Plot.text([{x: 0, y: 0, text: "Events vs Turnout Rate%"}], {
      frameAnchor: "top",
      dy: -20,
      fontSize: 24,
      fontWeight: "bold"
    })
  ]
})

```

Voter turnout was generally higher in districts where more campaign events took place, especially in central and northern Manhattan, parts of Brooklyn, and sections of Queens. The concentration of events in these areas corresponds with deeper blue shades on the map, indicating stronger participation. However, several districts with few or no events still showed moderate turnout, suggesting additional factors also influenced voter engagement. Overall, the map shows that while events helped boost turnout in targeted areas, they were not the sole driver of participation across the city.


```js 
const policyColumns = [
  "affordable_housing_alignment",
  "public_transit_alignment",
  "childcare_support_alignment",
  "small_business_tax_alignment",
  "police_reform_alignment"
];

const surveyLong = survey.flatMap(d =>
  policyColumns.map(policy => ({
    respondent_id: d.respondent_id,
    policy: policy.replace("_alignment", "").replaceAll("_", " "),
    alignment: d[policy],
    voted_for: d.voted_for
  }))
);
```


```js

const likertGrid = d3.rollups(
  surveyLong,
  v => v.length,
  d => d.policy,
  d => d.alignment
).flatMap(([policy, entries]) =>
  entries.map(([alignment, count]) => ({
    policy,
    alignment,
    count
  }))
);

```

```js 

Plot.plot({
  width: 900,
  height: 450,
  marginLeft: 140,
   marginBottom: 50,  
  title: "Post-Election Survey Responses and Policy Alignment Results",
  style: { fontFamily: "Inter, sans-serif", fontSize: 14 },

  x: {
    label: "Agrees with Policy",
    domain: [1, 2, 3, 4, 5],
    padding: 0.1
  },

  y: {
    label: "",
    domain: [
      "affordable housing",
      "public transit",
      "childcare support",
      "small business tax",
      "police reform"
    ]
  },

  color: {
    legend: true,
    type: "linear",
    scheme: "blues",
    label: "Number of Respondents"
  },

  marks: [
    Plot.rect(
      likertGrid,
      {
        x: "alignment",
        y: "policy",
        fill: "count",
        inset: 1,
        tip: true,
        channels: {
          "Policy": d => d.policy,
          "Alignment": d => d.alignment,
          "Count": d => d.count
        }
      }
    ),

    // Optional value labels inside each cell
   Plot.text(likertGrid, {
  x: "alignment",
  y: "policy",
  text: d => d.count,
  fill: d => d.count > 25 ? "#ffffff" : "#1A1A1A",   // adjust threshold as needed
  fontSize: 12,
  dy: 4
})

  ]
})

```

The heatmap illustrates how respondents rated their agreement with each policy across a 1–5 scale. Affordable housing, public transit, childcare support, and small business tax policies show strong clustering in the higher agreement categories (4 and 5), indicating broad support. In contrast, police reform stands out with the greatest concentration of low agreement responses (1 and 2), making it the most polarizing or least supported policy in the survey.

#### Key Takeaways

High support: Housing, transit, and childcare policies receive the strongest agreement, with most respondents selecting 4 or 5.

Moderate support: Small business tax policy shows a more balanced mix but still trends toward agreement.

Low support: Police reform has the highest share of disagreement responses, signaling limited alignment with respondents.

Overall pattern: Respondents favor social and economic support policies far more than enforcement-related policy.