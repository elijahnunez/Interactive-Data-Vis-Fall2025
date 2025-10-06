console.log("Hello, Interactive Data Visualization!");
const fruit = "apple";
let transport = "car";
var planet = "Earth";

console.log("______Before Function Call______");
console.log("Fruit:", fruit);
console.log("Transport:", transport);
console.log("Planet:", planet);

var planet = "Mars"; // Re-declaring with var is allowed

console.log("______Before Function Call______");
console.log("Fruit:", fruit);
console.log("Transport:", transport);
console.log("Planet:", planet);

fruit = "banana"; // Re-assigning is allowed
transport = "bike"; // Re-assigning is allowed
planet = "Venus"; // Re-assigning is allowed

console.log("______After Re-assignment______");
console.log("Fruit:", fruit);
console.log("Transport:", transport);
console.log("Planet:", planet);