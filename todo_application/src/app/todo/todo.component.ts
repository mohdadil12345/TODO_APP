import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TodoTypes } from '../todo-types';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent {

  title: string = '';
  description : string  = ""
  status : string = ""

  users: TodoTypes[] = []
      


  handle_form(ele: NgForm) {

    console.log(ele.value)


      const lsdata = JSON.parse(localStorage.getItem("todo") || '[]')

        if(lsdata) {
          lsdata.push(ele.value)

          localStorage.setItem("todo", JSON.stringify(lsdata))
        }else{
          localStorage.setItem("todo", JSON.stringify(ele.value))

        }
  
    ele.resetForm()
  

  }










}
