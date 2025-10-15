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
```