console.log("Hello, Interactive Data Visualization!");

function addName(){
    console.log(document.getElementById("name").value);
    const name = document.getElementById("name").value;
    alert("Hello " + name + "!");
}