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
      


  ngOnInit(): void {
    const lsdata = JSON.parse(localStorage.getItem("todo") || '[]');
    this.users = lsdata;
  }


  handle_form(ele: NgForm) {


    let obj = {
        title : ele.value.title,
        description : ele.value.description,
        status : ele.value.status,
        id : Date.now()
    }
    console.log(obj)


      const lsdata = JSON.parse(localStorage.getItem("todo") || '[]')

        if(lsdata) {
          lsdata.push(obj)

          localStorage.setItem("todo", JSON.stringify(lsdata))
        }else{
          localStorage.setItem("todo", JSON.stringify([obj]))

        }
  
    ele.resetForm()
    this.users.push(obj)


  }




  // delete 

handle_delete(id : any) {

  this.users = this.users.filter((ele: any) => ele.id !== id);
  localStorage.setItem("todo", JSON.stringify(this.users)); 



}


// toggle

handle_status(id: number) {

  this.users = this.users.map((ele: TodoTypes) => {
    if (ele.id === id) {
      ele.status = ele.status === 'Completed' ? 'Pending' : 'Completed';
    }
    return ele;
  });
  localStorage.setItem("todo", JSON.stringify(this.users));
}




//  update 

handle_edit() {

}



}
