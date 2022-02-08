import { TaskType, TaskEntity } from "./task";

// Union Type
export type AppStates = "start" | "fetchingTask" | "gotTask" | "error" ;

// The type of the state. This will change from app to app.
export type StateType = {
    success: boolean,
    app_state: AppStates,
    current_task: TaskType,
    error_message: string
};

// Define the initial state that the app is starting in. Change it.
const initialState: StateType = {
    success: true,
    app_state: "start",
    current_task: TaskEntity.initialize(),
    error_message: ""
};

export class State {
    state: StateType;

    constructor(state: StateType) {
        this.state = state;
    }

    static initialize(): StateType {
        return initialState;
    }

    static failed(error_message: string): StateType {
        let state: StateType = initialState;
        state.app_state = "error";
        state.error_message = error_message;
        state.success = false;
        return state;
    }

    static fetching(): StateType {
        let state: StateType = initialState;
        state.app_state = "fetchingTask";
        return state;
    }

    static gotTask(task: TaskType): StateType {
        let state: StateType = initialState;
        state.app_state = "gotTask";
        state.current_task = task;
        return state;
    }
}

export function sameState(state1: StateType, state2: StateType): boolean {
    let condition1 = (state1.success === state2.success);
    if (!condition1) return false;

    let condition2 = (state1.app_state === state2.app_state);
    if (!condition2) return false;

    let condition3 = (state1.error_message === state2.error_message);
    if (!condition3) return false;

    let condition4 = (state1.current_task.id === state2.current_task.id);
    if (!condition4) return false;

    let condition5 = (state1.current_task.updated_at === state2.current_task.updated_at);
    if (!condition5) return false;

    return true;
}