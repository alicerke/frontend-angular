import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { User } from 'src/app/model/user';
import { ConfigService } from 'src/app/services/config.service';
import { UserService } from 'src/app/services/user.service';
import { errorClear, getItems, deleteItem, addItem } from 'src/app/store/user/UserActions';
import { selectError, selectItems } from 'src/app/store/user/UserReducers';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  list$: Observable<User | User[]> | any;
  cols: any[] = this.config.userColumns;
  error$ = this.store.pipe(select(selectError)).pipe(
    tap(error => {
      const to = setTimeout(() => {
        clearTimeout(to);
        this.store.dispatch(errorClear());
      }, 3000);
    })
  )

  constructor(
    private userService: UserService,
    private config: ConfigService,
    private store: Store<any>,
  ) { };

  ngOnInit(): void {
    this.store.dispatch(getItems());
    this.list$ = this.store.pipe(select(selectItems));
  };

  update(user: User): void {
    this.userService.update(user).toPromise().then(
      res => console.log(res),
      err => console.error(err)
    );
  };

  delete(user: User): void {
    if (!confirm('Are you sure?')) {
      return;
    };
    this.store.dispatch(deleteItem({ item: user }));
  };

  create(): void {
    const user = new User();
    user.first_name = 'New';
    user.last_name = 'User';
    user.email = 'test@test.org';
    user.password = 'password';
    this.store.dispatch(addItem({ item: user }));
  };

}
