"use strict";
exports.__esModule = true;
var task_1 = require("../dist/task");
var assert_1 = require("assert");
describe("Tasks", function () {
    describe("initialize", function () {
        it('should return id equal 0 when initializing a task', function () {
            var task = task_1.TaskEntity.initialize();
            (0, assert_1.equal)(task.id, 0);
        });
    });
});
