import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoTypes } from '../../todo-types';

@Component({
  selector: 'app-todoeditpopup',
  templateUrl: './todoeditpopup.component.html',
  styleUrl: './todoeditpopup.component.scss'
})
export class TodoeditpopupComponent {

  @Input() todo: any

  edited_todo : any = []

    
  @Output() editTodo: EventEmitter<TodoTypes> = new EventEmitter<TodoTypes>();

 constructor() {}

  ngOnInit(): void {
    // console.log("todo", this.todo);
     this.edited_todo = {...this.todo}
  }


  handleEdit_form(): void {
      // console.log(this.edited_todo.title, this.edited_todo.description)
    alert("item edited successfull")
    this.editTodo.emit(this.edited_todo)


  }


}