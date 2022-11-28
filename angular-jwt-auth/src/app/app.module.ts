import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NavigationComponent } from './pages/navigation/navigation.component';
import { UserEditComponent } from './pages/user-edit/user-edit.component';
import { UsersComponent } from './pages/users/users.component';

@NgModule({
  declarations: [
    AppComponent,
    ForbiddenComponent,
    HomeComponent,
    LoginComponent,
    NavigationComponent,
    UserEditComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
