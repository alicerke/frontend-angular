import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  displayedColumns: string[] = [
    'id',
    'first_name',
    'last_name',
    'gender',
    'email',
    'address',
  ];
  pageSizes: number[] = [5, 10, 20, 50, 100];
  dataSubscription: Subscription;
  currentFilterKey: string = '';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private userService: UserService
  ) { }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSubscription = this.userService.get().subscribe(
      users => this.dataSource.data = (users as unknown as User[])
    );
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const key = this.currentFilterKey || '';
      const source = key ? String(data[key]) : JSON.stringify(data);
      return source.toLowerCase().includes(filter.toLowerCase());
    }
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }
}
