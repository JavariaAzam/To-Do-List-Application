/**
 * To-Do List Application
 * ----------------------
 * Handles task creation, editing, completion tracking,
 * persistence via localStorage, and progress visualization.
 *
 * Author: Javairia Azam
 * Last Updated: 2026-01-15
 */

const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
let justCompletedAll = false;


/* ================= ADD TASK ================= */

function addTask() {
    if (inputBox.value.trim() === "") {
        alert("You must write something!");
        return;
    }

    const li = document.createElement("li");

    // Checkbox
    const check = document.createElement("span");
    check.className = "check";

    // Task text
    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.innerText = inputBox.value.trim();

    // Edit button
    const edit = document.createElement("span");
    edit.className = "edit";
    edit.innerText = "✏️";

    // Delete button
    const del = document.createElement("span");
    del.className = "delete";
    del.innerText = "×";

    li.append(check, taskText, edit, del);
    listContainer.appendChild(li);

    inputBox.value = "";
    saveData();
    updateProgress();
}

/* ================= EVENT HANDLING ================= */

listContainer.addEventListener("click", function (e) {
    const li = e.target.closest("li");
    if (!li) return;

    // Completion toggle
    if (
        e.target.classList.contains("check") ||
        e.target.classList.contains("task-text")
    ) {
        const wasChecked = li.classList.contains("checked");
        li.classList.toggle("checked");

        // If this action completes all tasks
        if (!wasChecked && isNowFullyCompleted()) {
            justCompletedAll = true;
        }
    }

    // Delete (NO confetti logic here)
    if (e.target.classList.contains("delete")) {
        li.remove();
    }

    // Edit
    if (e.target.classList.contains("edit")) {
        enableEdit(li);
    }

    saveData();
    updateProgress();
});


/* ================= EDIT MODE ================= */

function enableEdit(li) {
    const textSpan = li.querySelector(".task-text");
    const input = document.createElement("input");

    input.type = "text";
    input.value = textSpan.innerText;
    input.className = "edit-input";

    li.replaceChild(input, textSpan);
    input.focus();

    input.addEventListener("blur", () => saveEdit(li, input));
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveEdit(li, input);
        if (e.key === "Escape") cancelEdit(li, input, textSpan.innerText);
    });
}

function saveEdit(li, input) {
    const span = document.createElement("span");
    span.className = "task-text";
    span.innerText = input.value.trim() || "Untitled Task";

    li.replaceChild(span, input);
    saveData();
}

function cancelEdit(li, input, oldText) {
    const span = document.createElement("span");
    span.className = "task-text";
    span.innerText = oldText;

    li.replaceChild(span, input);
}

/* ================= PROGRESS ================= */

function updateProgress() {
    const tasks = listContainer.querySelectorAll("li");
    const completed = listContainer.querySelectorAll("li.checked");

    const percent = tasks.length === 0
        ? 0
        : Math.round((completed.length / tasks.length) * 100);

    progressBar.style.width = percent + "%";
    progressText.innerText = percent + "% completed";

    if (justCompletedAll) {
        launchConfetti();
        justCompletedAll = false; // reset after celebration
    }
}


/* ================= STORAGE ================= */

function saveData() {
    localStorage.setItem("tasks", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("tasks") || "";
    updateProgress();
}

showTask();

/* ================= CONFETTI ================= */

function launchConfetti() {
    if (typeof confetti !== "function") return;

    confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 }
    });
}
function isNowFullyCompleted() {
    const tasks = listContainer.querySelectorAll("li");
    const completed = listContainer.querySelectorAll("li.checked");
    return tasks.length > 0 && tasks.length === completed.length;
}
