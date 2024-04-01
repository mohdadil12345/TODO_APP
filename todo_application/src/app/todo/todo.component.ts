import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TodoTypes } from '../todo-types';
import { HttpClient } from '@angular/common/http';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { TranslateService } from '@ngx-translate/core';
import { catchError, forkJoin } from 'rxjs';


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

  loading = true;

  globalData: any = [];
  status_fil : string = ""

  descriptionvalue : string = ""
  titlevalue : string = ""

  constructor(private http: HttpClient, private translate : TranslateService) {}

  ngOnInit(): void {
    
    this.translate.setDefaultLang('en');
    this.translate.use(localStorage.getItem("lang") || "en")



    this.fetchTodo();
    window.addEventListener('online', () => {
      this.syn_with_server();
    });
  }



  handle_form(ele: NgForm) {
    let obj = {
      title: this.titlevalue,
      description: this.descriptionvalue,
      status: this.status,
      id: this.selected_todo ? this.selected_todo.id : Date.now(),
    };
    console.log("obj", obj)

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
    }
    
    
    else {
      
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
          this.globalData = newArr
          this.loading = false;
        });
    } else {
      // Fetch tasks from local storage
      const lsdata = JSON.parse(localStorage.getItem('todo') || '[]');
      this.users = lsdata;
    }
  }



  handle_delete(item: any) {
    let elID = item._id;
    // console.log(elID)
  
    if (navigator.onLine) {
        this.http.delete(`${this.url}posts/${elID}.json`).subscribe((data:any)=> {
          //  console.log(data)
           this.fetchTodo()
           alert("todo deleted")
             
      })
     
    } else {
      let lsdata = JSON.parse(localStorage.getItem('todo') || '[]');
      lsdata = lsdata.filter((ele: any) => ele.id !== item.id);
      localStorage.setItem('todo', JSON.stringify(lsdata));
      this.users = lsdata;
      alert('Item deleted successfully in offline mode');
    }
  }
  
  handle_status(item : any) {
    if (navigator.onLine) {
     const  statusUpdated= this.users.map((ele: TodoTypes) => {
        if (ele.id === item.id) {
          ele.status = ele.status === 'Completed' ? 'Pending' : 'Completed';
        }
        return ele;
      });
      this.users = statusUpdated
    } else {
      // Offline mode
      const lsdata = JSON.parse(localStorage.getItem('todo') || '[]');
      const updatedData = lsdata.map((ele: TodoTypes) => {
        if (ele.id === item.id) {
          ele.status = ele.status === 'Completed' ? 'Pending' : 'Completed';
        }
        return ele;
      });
      localStorage.setItem('todo', JSON.stringify(updatedData)); 
      this.users = updatedData; 
    }
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
    const syncRequests = lsdata.map((item: any) => {
        return this.http.post(`${this.url}posts.json`, item);
    });

    forkJoin(syncRequests).subscribe(
        () => {
            localStorage.removeItem('todo');
            this.fetchTodo(); 
        },
        error => {
            console.error('Error syncing item:', error);
           
        }
    );
}



  
  toggleCKEditor(descriptionId: any): void {
    Object.keys(this.editorStates).forEach((key) => {
      this.editorStates[key] = false;
    });
    this.editorStates[descriptionId] = true;
  }


//  sharable link 

  shareable_link() {
      if(navigator.share) {
         navigator.share({
          title : "todo-app",
          url : "https://todo-application-pied-phi.vercel.app/"
         }).then(()=> {
          console.log("share success")
         }).catch((err)=> {
           alert("something error")
         })
      }
  }



  //  select_lang

  select_lang(event : any){
    // console.log(event.target.value)
    const selectedLang = event.target.value;
this.translate.use(selectedLang);
localStorage.setItem("lang", selectedLang);
  }


  //  search by title

  serchfilter: string = '';

  handle_filter() {
    this.users = this.globalData.filter((ele: any) =>
      ele.title.toLowerCase().includes(this.serchfilter.toLowerCase())
    );

  }


//  filter my status
  filter_by_status() {
   if(this.status_fil == "") {
    this.users  = this.globalData
   }else{
    this.users = this.globalData.filter((ele:any) => 
         ele.status.includes(this.status_fil)
      )
    
   }
  }




  descriptionvalueChange(event : any) {
    console.log(event)
    this.descriptionvalue = event
  }


  titleChange(event : any){
    console.log(event)
    this.titlevalue = event
  }


}




