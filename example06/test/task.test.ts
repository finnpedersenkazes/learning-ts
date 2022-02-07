import { TaskEntity } from "../dist/task";
import { equal } from "assert";

describe("Tasks", function() {
  describe("initialize", function() {
    it('should return id equal 0 when initializing a task', function() {
      let task = TaskEntity.initialize();
      equal(task.id, 0);
    })
  });
});

