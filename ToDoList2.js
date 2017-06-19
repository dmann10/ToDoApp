$(function() {
	
	var taskList = $('#taskList');
	getTasks();
	var updatedTask = {};

	function getTasks() {
		$.ajax({
			type: 'GET',
			url: '/tasks',
			success: function(tasks) {
				$.each(tasks, function(i, task) {
					addTask(task);
				});	
			},
			error: function() {
				alert("Error loading task list");
			}
		});
	};	

	function addTask(task) {
		var newListItem = $("<li data-id='" + task.taskId + "'></li>");
		newListItem.append("<input type='checkbox' class='checkbox' data-complete='" + task.complete + "'></input>");
		newListItem.append("<p class='task noEdit'>" + task.task + "</p>");
		newListItem.append("<input class='editMode task' value='" + task.task + "'></input>")
		newListItem.append("<a href='#' class='editLink noEdit'>edit</a>");
		newListItem.append("<a href='#' id='saveBtn' class='editLink editMode'>save</a>");
		newListItem.append("<a href='#' class='deleteLink noEdit'>delete</a>");
		newListItem.append("<a href='#' id='cancelBtn' class='editMode'>cancel</a>")
		if(newListItem.find('.checkbox').data('complete') == true)
		{
			newListItem.find('p.task').addClass('checkItemOff');
			newListItem.find('.checkbox').attr('checked', true);
		}
		
		taskList.append(newListItem);
	};

	//Enter new task 
	// Press Enter
	$("#txtbxNewTask").keypress(function(ev) {
		if(ev.keyCode == 13) 
		{
			ev.preventDefault();
			if($(this).val() != "")
			{
				postTask($(this).val());
				$(this).val("");
				$(this).focus();
			}
		}
	});
	
	//Press Add Button
	$("#btnAddNewTask").click(function() {
		postTask($('#txtbxNewTask').val());
		$("#txtbxNewTask").val("");
		$('#txtbxNewTask').focus();
	});
	
	function postTask(newTask) {
		var task = {
			task: newTask,
			complete: false,
			inEdit: false,
			taskCopy: ""	
		};
		
		$.ajax({
			type: 'POST',
			url: '/tasks',
			contentType: 'application/JSON',
			data: JSON.stringify(task),
			success: function(newTask) {
				addTask(newTask);
			}
		});
	};
	
	// Check off task when checkbox is clicked 
	$("#taskList").on("click", ".checkbox", function() {
		var listItem = $(this).closest('li');
		listItem.find('p.task').toggleClass('checkItemOff');
		
		if(listItem.find('.checkbox').data('complete') == false)
			listItem.find('.checkbox').data('complete', true);
		else if(listItem.find('.checkbox').data('complete') == true)
			listItem.find('.checkbox').data('complete', false);
		
		getSingleTask(listItem);
	});

	
	// Allow user to edit a task after the edit link is clicked 
	$("#taskList").on("click", ".editLink", function(ev) {
		ev.preventDefault();
		var listItem = $(this).closest('li');
		listItem.addClass('editMode');
	});
	
	$("#taskList").on("click", "#saveBtn", function() {
		var listItem = $(this).closest('li');
		getSingleTask(listItem);
	});
	
	$("#taskList").on("keypress", "input.task", function(ev) {
		if(ev.keyCode == '13')
		{
			ev.preventDefault();
			$(this).closest('li').find('#saveBtn').click();
		}
	});
	
	function getSingleTask(listItem) {
		$.ajax({
			type: 'GET',
			url: '/tasks/' + listItem.data('id'),
			success: function(task) {
				updatedTask = task;
				updatedTask.task = listItem.find('input.task').val();
				updatedTask.complete = listItem.find('.checkbox').data('complete');
				putTask(updatedTask, listItem);
			}
		});
	};
	
	function putTask(task, listItem) {
		$.ajax({
			type: 'POST',
			url: '/tasks',
			contentType: 'application/JSON',
			data: JSON.stringify(task),
			success: function(task) {
				listItem.find('p.task').html(task.task);
				listItem.removeClass('editMode');
			}
		});
	};
	
	$('#taskList').on('click', '#cancelBtn', function(ev) {
		ev.preventDefault();
		var listItem = $(this).closest('li');
		var taskCopy = listItem.find('p.task').html();
		listItem.removeClass('editMode');
		listItem.find('input.task').val(taskCopy);
	});
	
	// Deletes task if user clicks the delete link 
	$("#taskList").on("click", ".deleteLink", function(ev) {
		ev.preventDefault();
		var listItem = $(this).closest('li');
		deleteTask(listItem);
	});

	function deleteTask(listItem) {
		$.ajax({
			type: 'DELETE',
			url: '/tasks/' + listItem.data('id'),
			success: function(task) {
				taskList.find(listItem).remove();
			}
		});
	};
	
	$('#removeAllBtn').click(function() {
		var tasks = $('li');
		
		for(var i = 0; i < tasks.length; i++)
		{
			var task = tasks.eq(i);
			if(task.find('.checkbox').data('complete') == true)
				deleteTask(task);
		}
	});
	
});