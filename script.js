let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const toggleButton = document.getElementById('toggle-mode');
const modeText = document.getElementById('mode-text');
const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

function updateDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update timer display
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update tab title based on document visibility
    if (document.hidden && timerId !== null) {
        document.title = `(${timeString}) ${isWorkTime ? 'Work' : 'Break'} - Pomodoro Timer`;
    } else {
        document.title = `${isWorkTime ? 'Work' : 'Break'} - Pomodoro Timer`;
    }
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    modeText.textContent = isWorkTime ? 'Time to Focus!' : 'Take a Break!';
    toggleButton.textContent = isWorkTime ? 'Switch to Break' : 'Switch to Work';
    updateDisplay(timeLeft);
}

function startTimer() {
    if (timerId !== null) {
        // Pause the timer
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
        return;
    }
    
    if (!timeLeft) {
        timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    }

    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);

        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            alert(isWorkTime ? 'Work time is over! Take a break!' : 'Break is over! Back to work!');
            switchMode();
            startButton.textContent = 'Start';
        }
    }, 1000);

    startButton.textContent = 'Pause';
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    updateDisplay(timeLeft);
    startButton.textContent = 'Start';
    clearTasks();
    document.title = 'Pomodoro Timer';  // Reset title
}

function clearTasks() {
    taskList.innerHTML = '';
    taskInput.value = '';
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const li = document.createElement('li');
        
        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', function() {
            li.classList.toggle('completed', checkbox.checked);
        });
        
        // Create text span
        const span = document.createElement('span');
        span.textContent = taskText;
        
        // Add elements to li
        li.appendChild(checkbox);
        li.appendChild(span);
        
        taskList.appendChild(li);
        taskInput.value = '';
    }
}

// Event Listeners
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
toggleButton.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    startButton.textContent = 'Start';
    switchMode();
    clearTasks();
});
addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initialize display
timeLeft = WORK_TIME;
updateDisplay(timeLeft); 

// Add visibility change listener
document.addEventListener('visibilitychange', () => {
    if (timerId !== null) {  // Only update if timer is running
        updateDisplay(timeLeft);
    }
}); 