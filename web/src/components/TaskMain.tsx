import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { initialTasks } from '@/utils/TaskList';
import { completeTask, createTask, deleteTask, initializeTasks, updateTask } from '@/modules/taskManager';
import Task from '@/model/Task';
import { Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';

const TaskMain = () => {
  const { todos, progress, completed, setTodos, setProgress, setCompleted } = useAuth();
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<{ title: string; description: string; persona: string; group: number } | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditTask(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editTask) {
      setEditTask({ ...editTask, [name]: value });
    } else {
      setNewTask(prev => ({ ...prev!, [name]: value }));
    }
  };

  useEffect(() => {
    initializeTasks(setProgress, setCompleted, setTodos);
  }, [setProgress, setTodos, setCompleted]);

  const handleCompleteTask = (taskTitle: string) => {
    completeTask(taskTitle, progress, setProgress, completed, setCompleted, todos, setTodos);
  };

  const handleAddTask = () => {
    const id = todos.length + progress.length + completed.length;
    createTask(id + 1, newTask!.title, newTask!.description, newTask!.persona, newTask!.group, todos, progress, setProgress, setTodos);
    handleClose();
  };

  const handleDelete = (id: number) => {
    deleteTask(id, progress, setProgress, completed, setCompleted, todos, setTodos);
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setOpen(true);
  };

  const handleSaveTask = () => {
    console.log(editTask);
    if (editTask) {
      updateTask(editTask.id, { title: editTask.title, description: editTask.description,group:editTask.group },progress,setProgress,completed,setCompleted,todos,setTodos);
      setEditTask(null);
    }
    handleClose();
  };

  return (
    <div style={{ padding: '50px' }}>
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
        Add New Task
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            value={editTask?.title || newTask?.title || ''}
            // disabled={editTask?.id}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            value={editTask?.description || newTask?.description || ''}
          />
          <TextField
            margin="dense"
            name="persona"
            label="Persona"
            type="text"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            value={editTask?.persona || newTask?.persona || ''}
          />
          <TextField
  margin="dense"
  name="group"
  label="Group"
  type="number"
  fullWidth
  variant="outlined"
  onChange={handleChange}
  value={newTask?.group || ''}
  disabled={editTask ? true : false}
/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={editTask ? handleSaveTask : handleAddTask}>
            {editTask ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        <div style={{display:"flex",flexWrap:"wrap",flexDirection:"column"}}>
          <div>
          <Typography variant='h4'>To Do</Typography>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",flexDirection:"row"}}>

          {todos.map((task: Task) => (
            <Card key={task.id} sx={{ maxWidth: 300,minWidth:300,margin:"10px" }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {task.title}
              </Typography>
              <Typography variant="h5" component="div">
                {task.description}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {task.persona}
              </Typography>
            </CardContent>
            <CardActions>
            <Button  variant="contained" color='error' onClick={() => handleDelete(task.id)}>Delete</Button>
            <Button variant="contained" onClick={() => handleEditTask(task)}>Edit</Button>
            </CardActions>
          </Card>
          ))}
          </div>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",flexDirection:"column"}}>
          <div>
        <Typography variant='h4'>In Progress</Typography>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",flexDirection:"row"}}>

        {progress.map((task: Task) => (
          <Card  key={task.id} sx={{ maxWidth: 300,minWidth:300,margin:"10px" }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {task.title}
              </Typography>
              <Typography variant="h5" component="div">
                {task.description}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {task.persona}
              </Typography>
            </CardContent>
            <CardActions>
            <Button variant='contained' color='success' onClick={() => handleCompleteTask(task.title)}>Done</Button>
            <Button variant="contained" color='error' onClick={() => handleDelete(task.id)}>Delete</Button>
            <Button variant="contained" onClick={() => handleEditTask(task)}>Edit</Button>
            </CardActions>
          </Card>
        ))}
        </div>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",flexDirection:"column"}}>
          <div>
          <Typography variant='h4'>Completed</Typography>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",flexDirection:"row"}}>

          
          {completed.map((task: Task) => (
            <Card  key={task.id} sx={{ maxWidth: 300,minWidth:300,margin:"10px" }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {task.title}
              </Typography>
              <Typography variant="h5" component="div">
                {task.description}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {task.persona}
              </Typography>
            </CardContent>
            <CardActions>
            </CardActions>
          </Card>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskMain;
