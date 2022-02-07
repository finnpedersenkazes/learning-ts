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
