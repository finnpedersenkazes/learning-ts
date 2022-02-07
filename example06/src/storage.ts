import { StateType, State } from "./state"

// This is the key to the storage. It must be unique. Do not change.
const storageKey: string = "app_state";

// The functions we will use in all our applications. Do not change.
export function setAppState(newState: StateType): void {
    switch (newState.app_state) {
        case "start": {
          newState = State.initialize();
          break
        }
        case "fetchingTask": {
          newState = State.fetching();
            break;
        }

        case "gotTask": {
          newState = State.gotTask(newState.current_task);
          break;
        }

        case "error": {
          newState = State.failed(newState.error_message);
          break;
        }
    }

    if (newState.app_state == "error") reportState('setAppState', newState);

    let newStateJSON: string = JSON.stringify(newState);
    sessionStorage.setItem(storageKey,  newStateJSON);
};

export function getAppState(): StateType {
    let failedStateJSON: string = JSON.stringify(State.failed("Did not get state from session storage."));
    let storedState: StateType = JSON.parse(sessionStorage.getItem(storageKey) || failedStateJSON);
    if (storedState.app_state == "error") reportState('getAppState', storedState);
    return storedState;
}

export function initAppState(): void {
    clearAppState();
    setAppState(State.initialize());
}

export function clearAppState(): void {
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

