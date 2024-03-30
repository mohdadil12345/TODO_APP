import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TodoTypes } from '../todo-types';
import { HttpClient } from '@angular/common/http';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent {
  title: string = '';
  description: string = '';
  status: string = '';
  users: TodoTypes[] = [];
  show_popup: boolean = false;
  selected_todo: any;
  url = 'https://todoapp-41e98-default-rtdb.firebaseio.com/';
  public Editor = ClassicEditor;
  editorStates: { [key: string]: boolean } = {};
  show_form: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchTodo();
    window.addEventListener('online', () => {
      this.syn_with_server();
    });
  }

  handle_form(ele: NgForm) {
    let obj = {
      title: this.title,
      description: this.description,
      status: this.status,
      id: this.selected_todo ? this.selected_todo.id : Date.now(),
    };

    if (navigator.onLine) {
   
      if (!this.selected_todo) {
        // Add new task
        this.http.post(`${this.url}posts.json`, obj).subscribe(() => {
          this.fetchTodo();
        });
      } else {
     
        this.http
          .put(`${this.url}posts/${this.selected_todo.id}.json`, obj)
          .subscribe(() => {
            this.fetchTodo();
          });
      }
    } else {
      
      const lsdata = JSON.parse(localStorage.getItem('todo') || '[]');
      if (this.selected_todo) {
        // Update existing task
        const index = lsdata.findIndex(
          (item: any) => item.id === this.selected_todo.id
        );
        if (index !== -1) {
          lsdata[index] = obj;
          localStorage.setItem('todo', JSON.stringify(lsdata));
        }
      } else {
        // Add new task
        lsdata.push(obj);
        localStorage.setItem('todo', JSON.stringify(lsdata));
      }
      this.fetchTodo();
    }

    ele.resetForm();
  }

  fetchTodo() {
    if (navigator.onLine) {
      // Fetch tasks from the server
      this.http
        .get<{ [key: string]: any }>(`${this.url}posts.json`)
        .subscribe((res) => {
          const newArr = Object.keys(res).map((key) => ({
            _id: key.slice(0),
            ...res[key],
          }));
          this.users = newArr;
        });
    } else {
      // Fetch tasks from local storage
      const lsdata = JSON.parse(localStorage.getItem('todo') || '[]');
      this.users = lsdata;
    }
  }



  handle_delete(item: any) {
    let elID = item._id;
  
    if (navigator.onLine) {
      this.http.delete(`${this.url}posts/${elID}.json`).subscribe(
        () => {
          this.fetchTodo(); // Fetch updated list of tasks after deletion
          alert('Item deleted successfully in online mode');
        },
        (error) => {
          console.error('Error deleting item:', error);
          alert('An error occurred while deleting the item. Please try again later.');
        }
      );
    } else {
      let lsdata = JSON.parse(localStorage.getItem('todo') || '[]');
      lsdata = lsdata.filter((ele: any) => ele.id !== item.id);
      localStorage.setItem('todo', JSON.stringify(lsdata));
      this.users = lsdata;
      alert('Item deleted successfully in offline mode');
    }
  }
  


  handle_status(id: number) {
    this.users = this.users.map((ele: TodoTypes) => {
      if (ele.id === id) {
        ele.status = ele.status === 'Completed' ? 'Pending' : 'Completed';
      }
      return ele;
    });
    localStorage.setItem('todo', JSON.stringify(this.users));
  }

  edit_popup(ele: TodoTypes) {
    this.selected_todo = ele;
    this.title = ele.title;
    this.description = ele.description;
    this.status = ele.status;
    this.show_popup = true;
  }

  Update_Todo(item: TodoTypes) {
    const indexx = this.users.findIndex((ele) => ele.id == item.id);
    if (indexx !== -1) {
      this.users[indexx] = item;
      localStorage.setItem('todo', JSON.stringify(this.users));
    }
    this.show_popup = false;
  }

  syn_with_server() {
    const lsdata = JSON.parse(localStorage.getItem('todo') || '[]');
    lsdata.forEach((item: any) => {
      this.http.post(`${this.url}posts.json`, item).subscribe(() => {
        localStorage.setItem('todo', '[]');
        this.fetchTodo();
      });
    });
  }

  toggleCKEditor(descriptionId: any): void {
    Object.keys(this.editorStates).forEach((key) => {
      this.editorStates[key] = false;
    });
    this.editorStates[descriptionId] = true;
  }
}
