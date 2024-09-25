export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export type Paginate<T> = {
  data: T[];
  first: number;
  items: number;
  last: number;
  next: number | null;
  pages: number;
  prev: number | null;
}

export async function getTodos (){ // async function getTodos():Promise<todo[]>
  const res = await fetch("http://localhost:4000/todos?_page=1&_per_page=5");
  const data: Paginate<Todo> = await res.json();
  return data;
}