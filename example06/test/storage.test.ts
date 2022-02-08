import { StateType, AppStates, State, sameState } from "../src/state";
import { setAppState, getAppState, initAppState, clearAppState, existsAppState } from "../src/storage"

describe("State", function() {
  describe("initialize state", function() {
    it('when initializing the app state, it is expected to exist', function() {
      initAppState();
      let stateIsStorred = existsAppState();
      expect(stateIsStorred).toBe(true);

      let state: StateType = getAppState();
      let appState: AppStates = "start";
      expect(state.app_state).toBe(appState);
      expect(state.success).toBe(true);
    })
  });

  describe("setting and getting state", function() {
    it('when setting the app state, it is expected to exist and to return the same', function() {
      let state1 = State.fetching();
      setAppState(state1);
      let stateIsStorred = existsAppState();
      expect(stateIsStorred).toBe(true);

      let state2 = getAppState();
      let isSameState: boolean = sameState(state1, state2);
      expect(isSameState).toBe(true);
    })
  });

  describe("clearing state", function() {
    it('when clearing the state, it is expected to nologer exist', function() {
      clearAppState;
      let stateIsStored = existsAppState();
      expect(stateIsStored).toBe(false);
    })
  });

});
