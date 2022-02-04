// Functions

function non_repeating_character(str: string): string {
    var array: string[];
    array = str.split('');
    for (var i = 0; i < array.length; i++) {
        if (occurences(array[i], array) == 1) {
            return array[i]
        }
    }
    return ""
}

function occurences(element: string, array: string[] ): number {
    var counter: number = 0
    for (var i = 0; i < array.length; i++) {
        if (array[i] == element) {
            counter++
        }
    }
    return counter
}

// Test input and expected results

const input1: string = "agettkgaeee";
const input2: string = "abcdef";
const input3: string = "hello world hi hey";

const expected_output1: string = "k"
const expected_output2: string = "a"
const expected_output3: string = "w"

// Function to present the result og the test

function present_answer(str: string, result: string, expected: string) {
    if (result == expected) {
        return `Success: First non repeating character in ${str} is ${result}. `
    } else {
        return `Failure: Expected first non repeating character in ${str} to be ${expected}, but I found ${result}. `
    }
}

// Manipulating the DOM

// 1. Select the div element using the id property
const app = document.getElementById("app");

// 2. Create a new <p></p> element programmatically
const p1 = document.createElement("p");
const p2 = document.createElement("p");
const p3 = document.createElement("p");

// 3. Add the text content
p1.textContent = present_answer(input1, non_repeating_character(input1), expected_output1);
p2.textContent = present_answer(input2, non_repeating_character(input2), expected_output2);
p3.textContent = present_answer(input3, non_repeating_character(input3), expected_output3);

// 4. Append the p element to the div element
app?.appendChild(p1);
app?.appendChild(p2);
app?.appendChild(p3);