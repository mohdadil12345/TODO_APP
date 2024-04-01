import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomePageComponent } from './home-page/home-page.component';
import { TodoComponent } from './todo/todo.component';
import { FormsModule } from '@angular/forms';
import { TodoeditpopupComponent } from './todo/todoeditpopup/todoeditpopup.component';
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomePageComponent,
    TodoComponent,
    TodoeditpopupComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CKEditorModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
