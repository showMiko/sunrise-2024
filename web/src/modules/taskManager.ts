
import Task from "@/model/Task";
import { initialTasks } from "@/utils/TaskList";

let tasks: Task[] = [...initialTasks];

export function initializeTasks(
    setProgress: React.Dispatch<React.SetStateAction<Task[]>>,
    setCompleted: React.Dispatch<React.SetStateAction<Task[]>>,
    setTodos: React.Dispatch<React.SetStateAction<Task[]>>
): void {
    const progressTasks = initialTasks.filter(task => task.group === 1);
    const todoTasks = initialTasks.filter(task => task.group !== 1);

    setProgress(progressTasks);
    setTodos(todoTasks);
}
export function updatedTask() {

}

function moveNextGroupToProgress(
    todos: Task[],
    setTodos: React.Dispatch<React.SetStateAction<Task[]>>,
    setProgress: React.Dispatch<React.SetStateAction<Task[]>>
): void {

    const nextGroup = Math.min(...todos.map(task => task.group));


    if (!isNaN(nextGroup)) {
        const nextProgressTasks = todos.filter(task => task.group === nextGroup);
        const remainingTodos = todos.filter(task => task.group !== nextGroup);

        setProgress(nextProgressTasks);
        setTodos(remainingTodos);
    }
}
export function completeTask(
    taskTitle: string,
    progress: Task[],
    setProgress: React.Dispatch<React.SetStateAction<Task[]>>,
    completed: Task[],
    setCompleted: React.Dispatch<React.SetStateAction<Task[]>>,
    todos: Task[],
    setTodos: React.Dispatch<React.SetStateAction<Task[]>>
): void {

    const taskToComplete = progress.find(task => task.title === taskTitle);

    if (taskToComplete) {

        const updatedProgress = progress.filter(task => task.title !== taskTitle);
        setProgress(updatedProgress);

        setCompleted([...completed, { ...taskToComplete, completed: true }]);


        if (updatedProgress.length === 0) {
            moveNextGroupToProgress(todos, setTodos, setProgress);
        }
    }
}





export function getAllTasks(todo: Task[], progress: Task[], completed: Task[]): Task[] {
    const allTasks = []
    allTasks.push(...todo)
    allTasks.push(...progress)
    allTasks.push(...completed);
    return allTasks;
}





export function createTask(
    id: number,
    title: string,
    description: string,
    persona: string,
    group: number,
    todos: Task[],
    progress: Task[],
    setProgress: React.Dispatch<React.SetStateAction<Task[]>>,
    setTodos: React.Dispatch<React.SetStateAction<Task[]>>
): void {
    const task = new Task(id, title, description, persona, group);
    initialTasks.push(task);

    if (progress.length === 0) {
        setProgress([...progress, task]);
        return;
    }
    setProgress(prev => [...prev, task]);

}




function moveTasksToProgress(todos: Task[], progress: Task[], setProgress: React.Dispatch<React.SetStateAction<Task[]>>, setTodos: React.Dispatch<React.SetStateAction<Task[]>>): void {
    const newProgressTasks = todos.filter(todo =>
        progress.some(existingTask => todo.group <= existingTask.group)
    );

    if (newProgressTasks.length > 0) {
        setProgress(prev => [...prev, ...newProgressTasks]);
        setTodos(prev => prev.filter(todo => !newProgressTasks.includes(todo)));
    }
}


export function updateTask(
    taskId: number,
    updatedTask: Partial<Omit<Task, 'id'>>,
    progress: Task[],
    setProgress: React.Dispatch<React.SetStateAction<Task[]>>,
    completed: Task[],
    setCompleted: React.Dispatch<React.SetStateAction<Task[]>>,
    todos: Task[],
    setTodos: React.Dispatch<React.SetStateAction<Task[]>>,


): void {
    const taskIndexInProgress = progress.findIndex(task => task.id === taskId);
    const taskIndexInCompleted = completed.findIndex(task => task.id === taskId);
    const taskIndexInTodos = todos.findIndex(task => task.id === taskId);

    if (taskIndexInProgress !== -1) {
        const updatedProgress = [...progress];
        updatedProgress[taskIndexInProgress] = { ...progress[taskIndexInProgress], ...updatedTask };
        setProgress(updatedProgress);
    } else if (taskIndexInCompleted !== -1) {
        const updatedCompleted = [...completed];
        updatedCompleted[taskIndexInCompleted] = { ...completed[taskIndexInCompleted], ...updatedTask };
        setCompleted(updatedCompleted);
    } else if (taskIndexInTodos !== -1) {
        const updatedTodos = [...todos];
        updatedTodos[taskIndexInTodos] = { ...todos[taskIndexInTodos], ...updatedTask };
        setTodos(updatedTodos);
    } else {
        console.error(`Task with ID ${taskId} not found`);
    }
}

export function deleteTask(taskId: number, progress: Task[],
    setProgress: React.Dispatch<React.SetStateAction<Task[]>>,
    completed: Task[],
    setCompleted: React.Dispatch<React.SetStateAction<Task[]>>,
    todos: Task[],
    setTodos: React.Dispatch<React.SetStateAction<Task[]>>): void {

    const deleteProgress = progress.find(task => task.id === taskId);
    console.log(deleteProgress)
    const deleteTodo = todos.find(task => task.id === taskId);
    console.log(deleteTodo)

    if (deleteProgress) {

        const updatedProgress = progress.filter(task => task.id !== taskId);
        setProgress(updatedProgress);

        if (updatedProgress.length === 0) {
            moveNextGroupToProgress(todos, setTodos, setProgress);
        }
        return;
    }

    if (deleteTodo) {

        const updatedProgress = todos.filter(task => task.id !== taskId);
        setTodos(updatedProgress);

        if (updatedProgress.length === 0) {
            moveNextGroupToProgress(todos, setTodos, setProgress);
        }
        return;
    }

}


export function getActiveTasks(progress: Task[]): Task[] {
    return progress;
}

export function getCompletedTasks(completed: Task[]): Task[] {
    return completed;
}
