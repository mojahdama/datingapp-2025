import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  protected accountService = inject(AccountService);

  Init() {
    const userString = localStorage.getItem('user');
    if (!userString) return of (null);
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user); 

    return of (null);
  }


}
