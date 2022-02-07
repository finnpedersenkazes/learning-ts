import { TaskType, formatTaskEntity } from "./task";
import { StateType } from "./state"
import { setAppState, getAppState, initAppState } from "./storage"

// Global Constants
const DEBUGMODE: boolean = false;
const TASKS_API: string = "https://taskmanager01-api.herokuapp.com/tasks";
let TASK_ID: number = 196; // Starting somewhere in the list

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
            let task: TaskType = formatTaskEntity(data);
            newState.app_state = "gotTask";
            newState.current_task = task;
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
        console.log("GetElementById failed in updateView.")
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
        console.log("Run application stopped because no app element was found.");
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
