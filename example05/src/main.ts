// Global Constants
const DEBUGMODE: boolean = false;
const TASKS_API: string = "https://taskmanager01-api.herokuapp.com/tasks";
let TASK_ID: number = 196; // Starting somewhere in the list

// Managing State in the App

// Task entity
type TaskEntity = {
    id: number,
    title: string,
    description: string,
    urgency: number,
    duration_minutes: number,
    attention_date: string,
    deadline: string,
    planned_date: string,
    planned_starting_time: string,
    status: number,
    created_at: string,
    updated_at: string
}

const initialTask: TaskEntity = {
    id: 0,
    title: "",
    description: "",
    urgency: 0,
    duration_minutes: 0,
    attention_date: "",
    deadline: "",
    planned_date: "",
    planned_starting_time: "",
    status: 0,
    created_at: "",
    updated_at: ""
}

function formatTaskEntity(task: any): TaskEntity {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        urgency: task.urgency,
        duration_minutes: task.duration_minutes,
        attention_date: task.attention_date,
        deadline: task.deadline,
        planned_date: task.planned_date,
        planned_starting_time: task.planned_starting_time,
        status: task.status,
        created_at: task.created_at,
        updated_at: task.updated_at,
    };
  }


// Union Type
type AppStates = "start" | "fetchingTask" | "gotTask" | "error" ;

// The type of the state. This will change from app to app.

type State = {
    success: boolean,
    app_state: AppStates,
    current_task: TaskEntity,
    error_message: string
};

// Define the failed states the app can be in.
const failedState: State = {
    success: false,
    app_state: "error",
    current_task: initialTask,
    error_message: "Did not get state from session storage."
};

// Define the initial state that the app is starting in. Change it.
const initialState: State = {
    success: true,
    app_state: "start",
    current_task: initialTask,
    error_message: ""
};

// STORAGE FUNCTIONS

// This is the key to the storage. It must be unique. Do not change.
const storageKey: string = "app_state";

// The functions we will use in all our applications. Do not change.
function setAppState(newState: State): void {
    switch (newState.app_state) {
        case "start":
        case "fetchingTask": {
            newState.success = true;
            newState.error_message = "";
            newState.current_task = initialTask;
            break;
        }

        case "gotTask": {
            newState.success = true;
            newState.error_message = "";
            break;
        }

        case "error": {
            newState.success = false;
            newState.current_task = initialTask;
            break;
        }
    }

    if (DEBUGMODE || newState.app_state == "error") reportState('setAppState', newState);

    let newStateJSON: string = JSON.stringify(newState);
    sessionStorage.setItem(storageKey,  newStateJSON);
};

function getAppState(): State {
    let failedStateJSON: string = JSON.stringify(failedState);
    let storedState: State = JSON.parse(sessionStorage.getItem(storageKey) || failedStateJSON);
    if (storedState.app_state == "error") reportState('getAppState', storedState);
    return storedState;
}

function initAppState(): void {
    clearAppState();
    setAppState(initialState);
}

function clearAppState(): void {
    sessionStorage.removeItem(storageKey);
}

function reportState(where: string, state: State): void {
    console.log("----------------------------------------")
    console.log(`${where}:`);
    console.log(`        Success..: ${state.success}`);
    console.log(`        State....: ${state.app_state}`);
    console.log(`        Error....: ${state.error_message}`);
    console.log(`        Task ID..: ${state.current_task.id}`);
    console.log(`        Title....: ${state.current_task.title}`);
}

// ---------------------------------------------------------------------------------------------------------------------

// Update function

function loadTask(id: number): void {
    let url: string = `${TASKS_API}/${TASK_ID}`;
    let newState: State = getAppState();
    newState.app_state = "fetchingTask";
    setAppState(newState);
    updateView(newState);

    fetch(url, {
        method: 'GET', // default
    })
        .then(function(response: Response): Promise<object> {
            return response.json()
        })
        .then(function(data: object): void {
            let taskEntity: TaskEntity = formatTaskEntity(data);
            newState.app_state = "gotTask";
            newState.current_task = taskEntity;
            setAppState(newState);
            updateView(newState);
        })
        .catch(function(error): void {
            newState.app_state = "error";
            newState.error_message = error;
            setAppState(newState);
            updateView(newState);
        })
}

function getTask(): void {
    loadTask(TASK_ID);
    TASK_ID++ // Look for next task
}

function updateView(currentState: State): void {
    let new_title_text: HTMLElement | null = document.getElementById("display_title")
    let new_body_text: HTMLElement | null = document.getElementById("display_description")

    if (new_title_text && new_body_text) {
        switch (currentState.app_state) {
            case "start": {
                new_title_text.textContent = "Welcome again";
                new_body_text.textContent = "Press the button to get a task.";
                break;
            }

            case "fetchingTask": {
                new_title_text.textContent = "Fetching Task";
                new_body_text.textContent = "Please be patient.";
                break;
            }

            case "gotTask": {
                new_title_text.textContent = currentState.current_task.title;
                new_body_text.textContent = currentState.current_task.description;
                break;
            }

            case "error": {
                new_title_text.textContent = "Ups ...";
                new_body_text.textContent = currentState.error_message;
                break;
            }
        }
    } else {
        reportState('updateView', currentState);
    }
}

// BUILDING OUR WEB PAGE

function mkButton(element: HTMLElement, text: string, action: () => void): void {
    element.textContent = text;
    element.addEventListener("click", action);
    element.setAttribute("type", "button");
    element.setAttribute("class", "btn btn-primary");
    element.setAttribute("style", "margin:15px;");
}

function mkContainer(element: HTMLElement): void {
    element.setAttribute("class", "container");
}

function mkCard(element: HTMLElement): void {
    element.setAttribute("class", "card");
}

function mkCardBody(element: HTMLElement): void {
    element.setAttribute("class", "card-body");
}

function mkCardTitle(element: HTMLElement, text: string): void {
    element.setAttribute("id", "display_title");
    element.setAttribute("class", "card-title");
    element.textContent = text;
}

function mkCardDescription(element: HTMLElement, text: string): void {
    element.setAttribute("id", "display_description")
    element.setAttribute("class", "card-text");
    element.textContent = text;
}

// Initialize the application
initAppState();

// 1. Select the div element using the id property
const app = document.getElementById("app");

// 2. Create new elements programmatically
const top_div: HTMLElement = document.createElement("div");
const main_div: HTMLElement = document.createElement("div");
const title_h1: HTMLElement = document.createElement("h1");
const body_div: HTMLElement = document.createElement("div");
const body_text: HTMLElement = document.createElement("h2");
const button: HTMLElement = document.createElement("button");

// 3. Add the text content and attributes
mkContainer(top_div);
mkCard(main_div);
mkCardBody(body_div);
mkCardTitle(title_h1, "Welcome!");
mkCardDescription(body_text, "Press the button to get a task.");
mkButton(button, "Get Task", getTask);

// 4. Append the elements together
body_div.appendChild(title_h1);
body_div.appendChild(body_text);
body_div.appendChild(button);
main_div.appendChild(body_div);
top_div.appendChild(main_div);
app?.appendChild(top_div);
