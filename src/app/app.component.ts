import { HttpClient } from '@angular/common/http';
import { Component, VERSION } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { delay, map, startWith, tap } from 'rxjs/operators';
export interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  public options: User[];
  public loading = false;
  private getDataSubscription: Subscription;
  public userFormControl = new FormControl();
  public inputChanged: Observable<User[]>;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getData();
    this.inputChanged = this.userFormControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value as User ? value.name : ''),
      map(name => name ? this.filterData(name) : this.options.slice())
    );
  }

  getData() {
    this.options = [];
    const dataUrl = '../../assets/data.json';
    this.getDataSubscription = this.http.get<User[]>(dataUrl)
    .pipe(tap(() => this.loading = true), delay(5000))
    .subscribe((data) => {
      this.loading = false;
      this.options = data;
    });
  }

  display(user: User) {
    return user && user.name ? user.name : '';
  }

  filterData(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(el => el.name.toLowerCase().indexOf(filterValue) === 0);
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    if (this.getDataSubscription) {
      this.getDataSubscription.unsubscribe();
    }
  }
}
