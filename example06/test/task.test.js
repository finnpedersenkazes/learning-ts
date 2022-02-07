import { TaskEntity } from "./task";

describe("Tasks", function() {
  describe("initialize", function() {
    it('should return id equal 0 when initializing a task', function() {
      let task = TaskEntity.initialize();
      assert.equal(task.id, 0);
    })
  });
});

