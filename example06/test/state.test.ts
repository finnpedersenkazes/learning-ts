import { stat } from "fs";
import { StateType, AppStates, State } from "../src/state";
import { TaskEntity } from "../src/task";

describe("State", function() {
  describe("initialize", function() {
    it('should return app_state equal Start when initializing a state', function() {
      let state = State.initialize();
      let appState: AppStates = "start";
      expect(state.app_state).toBe(appState);
      expect(state.success).toBe(true);
    })
  });

  describe("fetching", function() {
    it('should return app_state equal Fetching when fetching a task', function() {
      let state = State.fetching();
      let appState: AppStates = "fetchingTask";
      expect(state.app_state).toBe(appState);
      expect(state.success).toBe(true);
    })
  });

  describe("got task", function() {
    it('should return app_state equal Got Task when the task has been retreived', function() {
      let task = TaskEntity.initialize();
      task.id = 196;
      let state = State.gotTask(task);
      let appState: AppStates = "gotTask";
      expect(state.app_state).toBe(appState);
      expect(state.success).toBe(true);
      expect(state.current_task.id).toBe(196);
    })
  });

  describe("error", function() {
    it('should return app_state equal error when failing to retreive a task', function() {
      let errorMessage: string = "error message";
      let state = State.failed(errorMessage);
      let appState: AppStates = "error";
      expect(state.app_state).toBe(appState);
      expect(state.error_message).toBe(errorMessage);
      expect(state.success).toBe(false);
    })
  });
});
