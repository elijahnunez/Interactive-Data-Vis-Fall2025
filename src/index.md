# Interactive Data Visualization (Fall 2025)

Welcome to the CUNY Interactive Data Visualization course repository for fall 2025. This repository will be updated periodically throughout the semester with labs and data.

Labs:

- [Lab 0: Getting Started](/lab_0/readme)

<div><h1>New York and Philly Football teams<h1></div>
<h3>These are the teams:</h3>
<div class="grid grid-cols-3">
<h1 class="card">Eagles</h1>
<h1 class="card">Giants</h1>
<h1 class="card">Jets</h1>
</h1>


<!-- <div class ="tip"> this is a tip</div> -->
```js
//console.log("hello")
//alert("hello")
```
```js
const team = view(
  Inputs.select(
    ["Eagles", "Giants", "Jets"], 
    { label: "select the best team", value: " " }
  )
);
```

the best team is  ${team}