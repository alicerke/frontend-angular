import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicComponent {

  dataSource$: Observable<any> = this.userService.get();
  displayedColumns: string[] = [
    'id',
    'first_name',
    'last_name',
    'gender',
    'email',
    'address',
  ]

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }
}

