import { useEffect, useState } from "react";
import { getTodos, type Todo } from "./test"

type ToggleTodo = Omit<Todo, "Title">;

function App() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  
  useEffect(() => {
    getTodos().then((data) => setTodoList(data.data));
  }, []);

  // title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    console.log(title);
  }

  // add
  const handleAddTodo = () => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false
    }

    fetch("http://localhost:4000/todos", {
      method: "POST",
      body: JSON.stringify(newTodo)
    })

    setTodoList((prev) => [...prev, newTodo]);
    setTitle("");
  }  

  // delete
  const handleDeleteTodo = async (id: Todo["id"]) => {
    await fetch(`http://localhost:4000/todos/${id}`, {
      method: "DELETE",      
    });
    setTodoList(prev => prev.filter(todo => todo.id !== id));
  };

  // toggle
  const handleToggleTodo = async ({id, completed} : ToggleTodo) => {
    await fetch(`http://localhost:4000/todos/${id}`, {
      method: "PATCH",      
      body: JSON.stringify({
        completed: !completed,
      })
    });
    setTodoList(prev => prev.map(todo => {
      if(todo.id === id){
        return {
          ...todo,
          completed: !completed
        }
      }
      return todo;
    }));
  }

  return (
    <>
      <div>
        <h1>Todo List</h1>
        <input 
          type="text"
          value={title}
          onChange={handleTitleChange}
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>      
      <TodoList todoList={todoList} onDeleteClick={handleDeleteTodo} onToggleClick={handleToggleTodo}/>
    </>
  )
}

type TodoListProps = {
  todoList: Todo[] ;
  onDeleteClick: (id: Todo["id"]) => void;
  onToggleClick: (toggleTodo: ToggleTodo) => void;
};
function TodoList({ todoList, onDeleteClick, onToggleClick }: TodoListProps){
  return (
    <>
      <ul>
        {
          todoList.map(todo => (
            <TodoItem 
              key={todo.id}
              {...todo}
              onDeleteClick={onDeleteClick}
              onToggleClick={onToggleClick}
            />
          ))
        }
      </ul>
    </>
  )
}
type TodoItemProps = Todo & {
  onDeleteClick: (id:Todo["id"]) => void;
  onToggleClick: (toggleTodo: ToggleTodo) => void;
};
function TodoItem({ id, title, completed, onDeleteClick, onToggleClick }: TodoItemProps) {
  return (
    <li style={{ display: "flex"}}>      
      {/* <p>id: {id}</p> */}
      <p style={completed ? { textDecoration: "line-through" } : {}}>title: {title}</p>
      {/* <p>completed: {`${completed}`}</p> */}
      <button onClick={() => onToggleClick({id, completed})}>{!completed ? "Complete" : "Undo"}</button>
      <button onClick={() => onDeleteClick(id)}>Delete</button>      
    </li>
  )
}

export default App
