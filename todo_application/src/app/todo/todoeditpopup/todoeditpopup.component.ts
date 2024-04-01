import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoTypes } from '../../todo-types';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-todoeditpopup',
  templateUrl: './todoeditpopup.component.html',
  styleUrl: './todoeditpopup.component.scss'
})
export class TodoeditpopupComponent {

  @Input() todo: any
  public Editor = ClassicEditor;
  editorStates: { [key: string]: boolean } = {};

  edited_todo : any = []
  descriptionvalue : string = ""
  titlevalue : string = ""
  

  showPopup : boolean = true


    
  @Output() editTodo: EventEmitter<TodoTypes> = new EventEmitter<TodoTypes>();

 constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    // console.log("todo", this.todo);
     this.edited_todo = {...this.todo}
  }


  handleEdit_form(): void {
      // console.log(this.edited_todo.title, this.edited_todo.description)
      this.toastr.success("Todo Edited Succcefully in offline mode ")

    this.editTodo.emit(this.edited_todo)


  }



  descriptionvalueChange(event : any) {
    console.log(event)
    this.descriptionvalue = event
    this.edited_todo.description = event
  }


  titleChange(event : any){
    console.log(event)
    this.titlevalue = event
    this.edited_todo.title = event
  }


  editor_cancel() {


    this.showPopup = false

  }


}

