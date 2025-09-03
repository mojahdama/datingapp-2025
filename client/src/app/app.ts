import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Nav } from "../layout/nav/nav";
import { AccountService } from '../core/services/account-service';
import { Home } from "../features/home/home";
import { User } from '../types/user';

@Component({
  selector: 'app-root',
  imports: [Nav, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {


  protected accountService = inject(AccountService);
  private http =inject(HttpClient);
  protected  title = 'Dating app';
  protected members = signal<User[]>([]) ;

  async ngOnInit(){
    this.members.set(await this.getMember());
    this.setCurrentUser();
    
    // this.http.get('https://localhost:5001/api/members').subscribe({
    //   next : response => this.members.set(response),
    //   error : error => console.log(error),
    //   complete : () => console.log('the http is completed ')
    // })
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }

  async getMember ()
  {
    try
    {
      return lastValueFrom(this.http.get<User[]>('https://localhost:5001/api/members'));   
    }
    catch(error)
    {
      console.log(error);
      throw error;
    }
  }

}
