---
title: "Lab 1: Passing Pollinators"
toc: true
---

# Lab 1: Passing Pollinators

<!-- ```js 
const text = view(Inputs.text())
```
this is the value of text: ${text} -->

<!-- 
```js
Plot.plot({
    width:300,
    height: 200,
    marks: [
        Plot.frame(),
        Plot.text(["text"], { frameAnchor: "middle"})
    ]
    })
``` -->
<!-- 
```js
Inputs.table(aapl)
```

```js
Plot.plot({
    hieght: 200, 
    y:{
        grid: true
    },
    marks: [
        Plot.dot(aapl, {x: "Date", y: "Close", stroke: "blue",  r: 1, tip: true}),
        Plot.ruleY([0])
        
    ]})
``` -->

## What is the Bee's Knees?

```js 
const pollinators = FileAttachment("data/pollinator_activity_data.csv").csv()
```

```js
Inputs.table(pollinators)
```

* What is the body mass and wing span distribution of each pollinator species observed?
* What is the ideal weather (conditions, temperature, etc) for pollinating?
* Which flower has the most nectar production?