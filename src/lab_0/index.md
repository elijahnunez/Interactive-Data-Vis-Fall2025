---
title: "Lab 0: Getting Started"
toc: true
---

This page is where you can iterate. Follow the lab instructions in the [readme.md](./README.md).


# Bad Bunny is headlining the Superbowl 2026
<img src="Bad Bunny.jpeg" alt="Bad Bunny with PAVA" width="600" height="400">


`
<table style="width:100%; max-width:560px; border-collapse:collapse; font-family:system-ui, sans-serif; font-size:14px;">
  <caption style="caption-side:top; padding:6px 0; font-weight:600;">Bad Bunny — Selected Singles & Release Dates</caption>
  <thead>
    <tr>
      <th style="text-align:left; border-bottom:1px solid #ccc; padding:8px;">Song</th>
      <th style="text-align:left; border-bottom:1px solid #ccc; padding:8px;">Release date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:8px; border-bottom:1px solid #eee;">MIA (feat. Drake)</td>
      <td style="padding:8px; border-bottom:1px solid #eee;">2018-10-11</td>
    </tr>
    <tr>
      <td style="padding:8px; border-bottom:1px solid #eee;">Callaíta</td>
      <td style="padding:8px; border-bottom:1px solid #eee;">2019-05-31</td>
    </tr>
    <tr>
      <td style="padding:8px; border-bottom:1px solid #eee;">Vete</td>
      <td style="padding:8px; border-bottom:1px solid #eee;">2019-11-22</td>
    </tr>
    <tr>
      <td style="padding:8px; border-bottom:1px solid #eee;">Yo Perreo Sola</td>
      <td style="padding:8px; border-bottom:1px solid #eee;">2020-03-27</td>
    </tr>
    <tr>
      <td style="padding:8px; border-bottom:1px solid #eee;">Dákiti (with Jhayco)</td>
      <td style="padding:8px; border-bottom:1px solid #eee;">2020-10-30</td>
    </tr>
    <tr>
      <td style="padding:8px; border-bottom:1px solid #eee;">Yonaguni</td>
      <td style="padding:8px; border-bottom:1px solid #eee;">2021-06-04</td>
    </tr>
    <tr>
      <td style="padding:8px; border-bottom:1px solid #eee;">Tití Me Preguntó</td>
      <td style="padding:8px; border-bottom:1px solid #eee;">2022-06-01</td>
    </tr>
    <tr>
      <td style="padding:8px;">WHERE SHE GOES</td>
      <td style="padding:8px;">2023-05-18</td>
    </tr>
  </tbody>
</table>
`


```js
import * as Plot from "npm:@observablehq/plot";
import { slider } from "npm:@observablehq/inputs";

const minStreamsSlider = view(slider([1.2, 1.9], {
  step: 0.05,
  value: 1.3,
  label: "Minimum Streams (in Billions)"
}));

const minStreams = Generators.input(minStreamsSlider);

const allSongs = [
  { song: "DÁKITI", streams: 1.89 },
  { song: "Tití Me Preguntó", streams: 1.56 },
  { song: "La Canción", streams: 1.48 },
  { song: "Me Porto Bonito", streams: 1.47 },
  { song: "Callaíta", streams: 1.35 },
  { song: "I Like It", streams: 1.34 },
  { song: "Yonaguni", streams: 1.29 }
];

const filteredSongs = allSongs.filter(d => d.streams >= minStreams);

display(minStreamsSlider);
display(Plot.plot({
  title: `Bad Bunny Songs with over ${minStreams} Billion Streams`,
  marks: [
    Plot.barY(filteredSongs, {
      x: "song",
      y: "streams",
      fill: "#FF0050",
      sort: { x: "-y" }
    }),
    Plot.text(filteredSongs, {
      x: "song",
      y: "streams",
      text: d => d.streams.toFixed(2),
      dy: -8,
      fill: "white",
      fontWeight: "bold"
    })
  ],
  y: {
    grid: true,
    label: "Streams (in Billions) on Spotify",
    domain: [0, 2.0]
  },
  x: {
    label: null,
    tickRotate: -30
  },
  marginTop: 40,
  marginLeft: 60,
  marginBottom: 80
}));
```
