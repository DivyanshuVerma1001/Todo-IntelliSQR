export interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TodoResponse {
  success: boolean;
  todo: Todo;
  message?: string;
}

export interface TodosResponse {
  success: boolean;
  todos: Todo[];
  count: number;
}

