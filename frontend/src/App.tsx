import { useState, useEffect } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

type Task = {
  id: number,
  title: string,
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/tasks")
      .then(res => res.json())
      .then(setTasks);
  }, []);

  const handleAdd = () => {
    fetch("http://127.0.0.1:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
      .then(res => res.json())
      .then(newTask => {
        setTasks([...tasks, newTask]);
        setTitle('');
      });
  };

  const handleDelete = (id:number) => {
    fetch(`http://127.0.0.1:5000/tasks/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }).then(() => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    })
  }

  return (
    <div>
      <h1>Tasks</h1>
      <input 
      value={title} 
      onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          handleAdd();
        }
      }} 
      />
      <button onClick={handleAdd}>Add Task</button>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>{t.title}{" "}<button onClick={() => handleDelete(t.id)}>Delete</button></li>
        ))}
      </ul>
    </div>
  );
}

export default App;
