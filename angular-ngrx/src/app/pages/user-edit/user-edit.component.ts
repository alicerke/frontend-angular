import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, switchMap, take } from 'rxjs';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import { getOneItem, updateItem } from 'src/app/store/user/UserActions';
import { selectOneItem } from 'src/app/store/user/UserReducers';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  user$: Observable<User> | undefined;
  userID: number | undefined;
  serverError: string = '';

  constructor(
    private userService: UserService,
    private ar: ActivatedRoute,
    private store: Store<any>,
  ) { }

  ngOnInit(): void {
    this.userID = parseInt(this.ar.snapshot.params.id, 10);
    this.store.dispatch(getOneItem({ id: this.userID }));
    this.user$ = this.store.pipe(select(selectOneItem));
  }

  onSubmit(ngForm: NgForm): void {
    const user: User = ({ ...ngForm.value, id: this.userID });
    this.store.dispatch(updateItem({ item: user }));
    history.back();
  }

}
