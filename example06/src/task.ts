// Global Constants
const DEBUGMODE: boolean = false;
const TASKS_API: string = "https://taskmanager01-api.herokuapp.com/tasks";
let TASK_ID: number = 196; // Starting somewhere in the list

// Task entity
type TaskType = {
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

const initialTask: TaskType = {
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

// Union Type
type AppStates = "start" | "fetchingTask" | "gotTask" | "error" ;

// The type of the state. This will change from app to app.

type StateType = {
    success: boolean,
    app_state: AppStates,
    current_task: TaskType,
    error_message: string
};


// Define the failed states the app can be in.
const failedState: StateType = {
    success: false,
    app_state: "error",
    current_task: initialTask,
    error_message: "Did not get state from session storage."
};


// Define the initial state that the app is starting in. Change it.
const initialState: StateType = {
    success: true,
    app_state: "start",
    current_task: initialTask,
    error_message: ""
};


function formatTaskEntity(task: any): TaskType {
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


// STORAGE FUNCTIONS

// This is the key to the storage. It must be unique. Do not change.
const storageKey: string = "app_state";

// The functions we will use in all our applications. Do not change.
function setAppState(newState: StateType): void {
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

function getAppState(): StateType {
    let failedStateJSON: string = JSON.stringify(failedState);
    let storedState: StateType = JSON.parse(sessionStorage.getItem(storageKey) || failedStateJSON);
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

function reportState(where: string, state: StateType): void {
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
    let newState: StateType = getAppState();
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
            let taskEntity: TaskType = formatTaskEntity(data);
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

function updateView(currentState: StateType): void {
    let new_title_text: HTMLElement | null = document.getElementById("display_title")
    let new_body_text: HTMLElement | null = document.getElementById("display_description")
    let button: HTMLButtonElement | null = document.getElementById("display-button") as HTMLButtonElement;

    if (new_title_text && new_body_text && button) {
        switch (currentState.app_state) {
            case "start": {
                new_title_text.textContent = "Welcome again";
                new_body_text.textContent = "Press the button to get a task.";
                button.disabled = false;
                break;
            }

            case "fetchingTask": {
                new_title_text.textContent = "Fetching Task";
                new_body_text.textContent = "Please be patient.";
                button.disabled = true;
                break;
            }

            case "gotTask": {
                new_title_text.textContent = currentState.current_task.title;
                new_body_text.textContent = currentState.current_task.description;
                button.disabled = false;
                break;
            }

            case "error": {
                new_title_text.textContent = "Ups ...";
                new_body_text.textContent = currentState.error_message;
                button.disabled = false;
                break;
            }
        }
    } else {
        reportState('updateView', currentState);
    }
}

// BUILDING OUR WEB PAGE

function mkButton(text: string, action: () => void): HTMLElement {
    let element: HTMLElement = document.createElement("button");
    element.textContent = text;
    element.addEventListener("click", action);
    element.setAttribute("id", "display-button");
    element.setAttribute("type", "button");
    element.setAttribute("class", "btn btn-primary");
    element.setAttribute("style", "margin:15px;");
    return element;
}

function mkApplication(container: HTMLElement): void {
    let element: HTMLElement | null = document.getElementById("app");
    if (element) {
        element.appendChild(container);
    } else {
        console.log("Run application stopped because no app element was found.")
    }
}

function mkContainer(card: HTMLElement): HTMLElement {
    let element: HTMLElement = document.createElement("div");
    element.setAttribute("class", "container");
    element.appendChild(card);
    return element;
}

function mkCard(cardBody: HTMLElement): HTMLElement {
    let element: HTMLElement = document.createElement("div");
    element.setAttribute("class", "card");
    element.appendChild(cardBody);
    return element;
}

function mkCardBody(
    title: HTMLElement,
    body: HTMLElement,
    button: HTMLElement
): HTMLElement {
    let element: HTMLElement = document.createElement("div");
    element.setAttribute("class", "card-body");
    element.appendChild(title);
    element.appendChild(body);
    element.appendChild(button);
    return element;
}

function mkCardTitle(text: string): HTMLElement {
    let element: HTMLElement = document.createElement("h1");
    element.setAttribute("id", "display_title");
    element.setAttribute("class", "card-title");
    element.textContent = text;
    return element;
}

function mkCardDescription(text: string): HTMLElement {
    let element: HTMLElement = document.createElement("h2");
    element.setAttribute("id", "display_description")
    element.setAttribute("class", "card-text");
    element.textContent = text;
    return element;
}

export function runApplication() {
    // Initialize the application
    initAppState();

    // Create new elements programmatically
    const title: HTMLElement = mkCardTitle("Welcome!");
    const description: HTMLElement = mkCardDescription("Press the button to get a task.");
    const button: HTMLElement = mkButton("Get Task", getTask);

    const cardBody: HTMLElement = mkCardBody(title, description, button);
    const card: HTMLElement = mkCard(cardBody);
    const container: HTMLElement = mkContainer(card);

    mkApplication(container);
}
