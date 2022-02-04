function greeter(person: string) {
    return "Hello, " + person;
}
var user = "James Webb";

// 1. Select the div element using the id property
const app = document.getElementById("app");

// 2. Create a new <p></p> element programmatically
const p = document.createElement("p");

// 3. Add the text content
p.textContent = greeter(user);

// 4. Append the p element to the div element
app?.appendChild(p);