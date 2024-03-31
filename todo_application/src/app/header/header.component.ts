import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {


  lang = ""
  constructor(private translateService : TranslateService) {
       
  }

  ngOnInit(): void {
     this.lang = localStorage.getItem("lang") || "en"
  }


  ChangeLang(Lang : any) {
    // console.log(Lang.target.value)

     const selLang = Lang.target.value

      localStorage.setItem("lang", selLang)
       
      this.translateService.use(selLang)

  }



}
