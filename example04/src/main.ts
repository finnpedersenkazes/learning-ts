
// Managing State in the App

// The type of the state. This will change from app to app. 
type State = { 
    success: boolean,
    favorite_language: string,
    error_message: string
};

// Define the only possible states the app can be in. 
const legalState1: State = { success: true, favorite_language: "JavaScript", error_message: "" };
const legalState2: State = { success: true, favorite_language: "Python", error_message: "" };
const failedState: State = { success: false, favorite_language: "", error_message: "Did not get state from session storage." };

// Define the initial state that the app is starting in. Change it. 
const initialState: State = legalState1;


// STORAGE FUNCTIONS

// This is the key to the storage. It must be unique. Do not change.
const storageKey: string = "app_state"; 

// The functions we will use in all our applications. Do not change.
function setAppState(newState: State): void {
    let newStateJSON: string = JSON.stringify(newState);
    sessionStorage.setItem(storageKey,  newStateJSON);
};

function getAppState(): State {
    let failedStateJSON: string = JSON.stringify(failedState);
    let storedState: State = JSON.parse(sessionStorage.getItem(storageKey) || failedStateJSON);
    if (!storedState.success) {
        reportState('getAppState', storedState);
    }
    return storedState
}

function initAppState(): void {
    clearAppState();
    setAppState(initialState);
}

function clearAppState(): void {
    sessionStorage.removeItem(storageKey);
}

function reportState(where: string, state: State): void {
    if (!state.success) {
        console.log(`${where}: Error state detected. Error message: ${state.error_message}`);
    } else {
        console.log(`${where}: Everyting is fine. Favorite Language: ${state.favorite_language}`);
    }
}

// ---------------------------------------------------------------------------------------------------------------------

// Update function

function sameState(state1: State, state2: State): boolean {
    if (state1.success == state2.success) {
        if (state1.success) {
            return (state1.favorite_language == state2.favorite_language);
        } else {
            return (state1.error_message == state2.error_message)
        }
    } else {
        return false
    }
}

function updateState(): void {
    let currentState: State = getAppState();

    if (currentState.success) {
        if (sameState(currentState, legalState1)) {
            setAppState(legalState2);
        };
    
        if (sameState(currentState, legalState2)) {
            setAppState(legalState1);
        };
    } else {
        reportState('updateState', currentState);
        setAppState(initialState);
    }

    updateView();
}

function initView(): void {
    let currentState: State = getAppState();
    if (body_text) {
        body_text.textContent = currentState.favorite_language;
    } else {
        reportState('initView', currentState);
    };
}

function updateView(): void {
    let currentState: State = getAppState();
    let new_body_text = document.getElementById("display_state")
    if (new_body_text) {
        new_body_text.textContent = currentState.favorite_language;
    } else {
        reportState('updateView', currentState);
    };
}

// BUILDING OUR WEB PAGE
// Initialize the application
initAppState();

// 1. Select the div element using the id property
const app = document.getElementById("app");

// 2. Create new elements programmatically
const top_div = document.createElement("div");
const main_div = document.createElement("div");
const title_h1 = document.createElement("h1");
const body_div = document.createElement("div");
const button = document.createElement("button");
const body_text = document.createElement("h2");
body_text.setAttribute("id", "display_state")

// 3. Add the text content
title_h1.textContent = "Your TypeScript App is working!";
button.textContent = "Toggle";
button.addEventListener("click", updateState);
button.setAttribute("type", "button");
button.setAttribute("class", "btn btn-primary");
button.setAttribute("style", "margin:15px;");
main_div.setAttribute("class", "card");
body_div.setAttribute("class", "card-body");
title_h1.setAttribute("class", "card-title");
body_text.setAttribute("class", "card-text");
top_div.setAttribute("class", "container");

initView();

// 4. Append the elements together
body_div.appendChild(title_h1);
body_div.appendChild(body_text);
body_div.appendChild(button);
main_div.appendChild(body_div);
top_div.appendChild(main_div);
app?.appendChild(top_div);

