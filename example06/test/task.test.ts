import { TaskEntity } from "../src/task";

describe("Tasks", function() {
  describe("initialize", function() {
    it('should return id equal 0 when initializing a task', function() {
      let task = TaskEntity.initialize();
      expect(task.id).toBe(0);
    })
  });
});

