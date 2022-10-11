import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { TimeSheet, TimeSheetType } from '../time-sheet/time-sheet.model';

import { TimeSheetService } from '../time-sheet/time-sheet.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  isAuthenticated = false;
  private userSub: Subscription;
  user:User;

  constructor(
    private tsService: TimeSheetService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
      if(this.isAuthenticated){
        this.user=user;
      }
    });
  }

  onStoreData() {
    //this.dataService.storeRecipes();
  }

  onFetchData() {
    //this.dataService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  onClick(){
    let value=new TimeSheet(TimeSheetType.WorkHours,new Date().getDate(),new Date().getTime(),new Date().getTime(),"something");
    this.tsService.addTimeSheet(value,this.user.id);
    console.log();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}