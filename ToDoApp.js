(function() {
var app = angular.module("toDoList", []);

app.controller("ToDoListController", function() {
	this.tasks = tasks;

	this.addTask = function(newTask) {
		var task = {task: newTask, complete: false};
		tasks.push(this.task);
		this.task = {};
	};

	this.toggleCheck = function(task) {
		if(task.complete == false)
		{
			task.complete = !task.complete;
		}
		if(task.complete)
		{
			task.complete = !task.complete;
		}
	}

	this.deleteTask = function(task) {
		const index = this.tasks.indexOf(task)
		this.tasks.splice(index, 1)
	}

});

var tasks = [ 
	{
		task: "Default task",
		complete: false
	},
	{
		task: "Default task 2",
		complete: false
	}
];
})();