const toggelTasks = document.getElementById('tasks-menu-toggle');
toggelTasks.addEventListener('click', () => {
    const taskMenu = document.getElementById('task-menu');
    taskMenu.classList.toggle('task-menu-toggle');
});
// Task Management
document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const currentTask = document.getElementById('current-task');
    const taskDesc = document.getElementById('task-desc');
    const submitTaskButton = document.getElementById('submit-task');
    const showHintButton = document.getElementById('show-hint');
    const taskHint = document.getElementById('task-hint');
    const taskCompletionIndicator = document.getElementById('task-completion-indicator');
    let activeTask = null;
    const userId = 1;

    // Load tasks into the task menu
    fetch(`/tasks?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            data.tasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.textContent = task[1];
                taskItem.dataset.taskId = task[0]; // Add task ID as a data attribute

                // Add completion indicator
                const completionIndicator = document.createElement('span');
                completionIndicator.textContent = task[4] ? '✔️' : '❌'; // Assumes task[4] holds completion status
                completionIndicator.style.margin = '0 10px';
                taskItem.appendChild(completionIndicator);

                // Click event to set active task
                taskItem.addEventListener('click', () => {
                    activeTask = {
                        id: task[0],
                        description: task[1],
                        expected_query: task[2],
                        hint: task[3]
                    };
                    taskDesc.textContent = activeTask.description;
                    currentTask.style.display = 'block';
                    taskHint.style.display = 'none';
                });
                taskList.appendChild(taskItem);
            });

            // Update task completion indicator
            taskCompletionIndicator.textContent = `Completed ${data.completed_count} out of ${data.total_count} tasks`;
        });

    // Handle task submission
    submitTaskButton.addEventListener('click', () => {
        // Ensure activeTask is set
        //console.log("Current activeTask:", activeTask); // Log activeTask state
        
        if (activeTask) { // Check if there is an active task
            const userQuery = ace.edit("editor").getValue().trim();
            if (userQuery.toLowerCase() === activeTask.expected_query.toLowerCase()) {
                alert('Task completed successfully!');
                fetch('/complete_task', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ user_id: userId, task_id: activeTask.id })
                }).then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            const taskItems = document.querySelectorAll('#task-list li');
                            taskItems.forEach(li => {
                                //console.log('Checking task ID:', li.dataset.taskId); // Log each task ID

                                // Ensure we check against activeTask before accessing its properties
                                if (activeTask && li.dataset.taskId == activeTask.id) {
                                    li.querySelector('span').textContent = '✔️'; // Update only the completed task
                                }
                            });

                            // Fetch updated task counts
                            fetch(`/tasks?user_id=${userId}`)
                                .then(response => response.json())
                                .then(data => {
                                    taskCompletionIndicator.textContent = `Completed ${data.completed_count} out of ${data.total_count} tasks`;
                                });
                        }
                    });

                // Clear the active task only after processing completion
                activeTask = null; 
                currentTask.style.display = 'none'; // Hide the current task details
            } else {
                alert('Incorrect query. Please try again.');
            }
        } else {
            alert('Please select a task to complete.'); // Feedback if no task is selected
        }
    });

    // Show hint
    showHintButton.addEventListener('click', () => {
        if (activeTask) {
            taskHint.textContent = activeTask.hint;
            taskHint.style.display = 'block';
        }
    });
});
