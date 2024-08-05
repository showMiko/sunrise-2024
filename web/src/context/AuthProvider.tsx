import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Task from '@/model/Task'; // Adjust the import path
import { initialTasks } from '@/utils/TaskList';
interface AuthContextType {
  todos: Task[];
  progress: Task[];
  completed: Task[];
  setTodos: React.Dispatch<React.SetStateAction<Task[]>>;
  setProgress: React.Dispatch<React.SetStateAction<Task[]>>;
  setCompleted: React.Dispatch<React.SetStateAction<Task[]>>;
}

type Props = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Task[]>([]);
  const [progress, setProgress] = useState<Task[]>([]);
  const [completed, setCompleted] = useState<Task[]>([]);
  const tempProgress=[];
  const tempTodo=[];

  useEffect(()=>{
    initialTasks.forEach((task)=>{
        if(task.group===1)
            tempProgress.push(task);
        else
            tempTodo.push(task);
    })
  })

  const value: AuthContextType = {
    todos,
    setTodos,
    progress,
    setProgress,
    completed,
    setCompleted,
  };
  // console.log(todos,"from the Auth Context")

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
