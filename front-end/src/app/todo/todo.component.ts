import { Component, OnInit } from '@angular/core';
import { TodoService } from "./todo.service";
import { AuthService } from "../core/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  todos: any[] = [];
  newTask: string = '';
  role = '';
  userId = '';

  total = 0;
  page = 1;
  limit = 5;
  search = '';
  sort = 'createdAt';
  customSearch: any = {};

  editTodoId: string | null = null;
  editTitle: string = '';

  todoFilter = {
    'isDone': '',
    'sortOrder': 'desc',
  };

  constructor(
    private todoService: TodoService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.userId = this.authService.getUser()?.id;
    this.loadTodos();
  }

  loadTodos() {
    this.customSearch = {
      'isDone': this.todoFilter.isDone
    }

    if (this.todoFilter.sortOrder === 'asc') {
      this.sort = this.sort.replace('-', ''); // ascending: remove '-' if present
    } else {
      this.sort = '-' + this.sort.replace('-', ''); // ensure descending has '-'
    }

    this.todoService.getTodos(this.page, this.limit, this.search, this.sort, this.customSearch).subscribe((res) => {
      this.todos = res['data']
      this.total = res['pagination'].totalPages
    });
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadTodos();
  }

  addTask() {
    console.log(this.newTask);
    if (!this.newTask.trim()) return;
    this.todoService.createTodo({'title': this.newTask}).subscribe(() => {
      this.newTask = '';
      this.loadTodos();
    });
  }

  toggleDone(todo: any) {
    this.todoService.updateTodo(todo._id, { isDone: !todo.isDone }).subscribe(() => this.loadTodos());
  }

  canDelete(todo: any) {
    return this.role === 'admin' || (this.role === 'volunteer' && todo.createdBy === this.userId);
  }

  deleteTask(id: string) {
    this.todoService.deleteTodo(id).subscribe(() => this.loadTodos());
  }

  startEdit(todo: any) {
    this.editTodoId = todo._id;
    this.editTitle = todo.title;
  }

  cancelEdit() {
    this.editTodoId = null;
    this.editTitle = '';
  }

  saveEdit(todo: any) {
    if (!this.editTitle.trim()) return;
    this.todoService.updateTodo(todo._id, { title: this.editTitle }).subscribe(() => {
      this.cancelEdit();
      this.loadTodos();
    });
  }

}
