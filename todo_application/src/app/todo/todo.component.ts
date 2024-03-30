import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TodoTypes } from '../todo-types';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  title: string = '';
  description: string = '';
  status: string = '';
  users: TodoTypes[] = [];

  show_popup: boolean = false;
  selected_todo: any;

  url = 'https://todoapp-41e98-default-rtdb.firebaseio.com/';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
      const lsdata = JSON.parse(localStorage.getItem("todo") || '[]');
      this.users = lsdata;

    this.fetchTodo();
  }

  handle_form(ele: NgForm) {
    let obj = {
      title: ele.value.title,
      description: ele.value.description,
      status: ele.value.status,
      id: Date.now(),
    };
    // console.log(obj)

    if (navigator.onLine) {
      this.http
        .post(
          'https://todoapp-41e98-default-rtdb.firebaseio.com/posts.json',
          obj
        )
        .subscribe((data) => {
          // console.log("data posted", data)

          ele.resetForm();
        });
    } else {
      const lsdata = JSON.parse(localStorage.getItem('todo') || '[]');

      if (lsdata) {
        lsdata.push(obj);

        localStorage.setItem('todo', JSON.stringify(lsdata));
      } else {
        localStorage.setItem('todo', JSON.stringify(obj));
      }

      ele.resetForm();
      this.users.push(obj);
    }
  }

  fetchTodo() {
    this.http
      .get<{ [key: string]: any }>(
        'https://todoapp-41e98-default-rtdb.firebaseio.com/posts.json'
      )
      .subscribe((res) => {
        // console.log('get data', res);

        const newArr = Object.keys(res).map((key) => ({
          _id: key.slice(1),
          ...res[key],
        }));

        // console.log(newArr);
        this.users = newArr;
        this.fetchTodo();
      });
  }

  // delete

  handle_delete(item : any) {
    console.log("ele", item)
    if (navigator.onLine) {
      // Online mode
      this.http.delete(`${this.url}posts/${item._id}.json`).subscribe((deleteddata)=> {
        console.log("daata",deleteddata )
        this.fetchTodo()
        alert("item deleted successfully in online")
      })
    } else {
      // Offline mode
      let lsdata = JSON.parse(localStorage.getItem("todo") || '[]');
      lsdata = lsdata.filter((ele: any) => ele.id !== item.id);
      localStorage.setItem("todo", JSON.stringify(lsdata));
      this.users = lsdata;
      alert("Item deleted successfully in offline mode");
    }
  }



  // toggle

  handle_status(id: number) {
    this.users = this.users.map((ele: TodoTypes) => {
      if (ele.id === id) {
        ele.status = ele.status === 'Completed' ? 'Pending' : 'Completed';
      }
      return ele;
    });
    localStorage.setItem('todo', JSON.stringify(this.users));
  }

  //  update

  edit_popup(ele: TodoTypes) {
    console.log('ele', ele);
    this.selected_todo = ele;
    this.show_popup = true;
  }

  // Update_Todo

  Update_Todo(item: TodoTypes) {
    //      console.log("item", item)

    const indexx = this.users.findIndex((ele) => ele.id == item.id);

    console.log('index', indexx);

    if (indexx !== -1) {
      this.users[indexx] = item;
      localStorage.setItem('todo', JSON.stringify(this.users));
    }

    this.show_popup = false;
  }
}
