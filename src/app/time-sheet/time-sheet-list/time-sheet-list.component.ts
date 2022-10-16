import { Component, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMapTo } from 'rxjs';

import { TimeSheet } from '../time-sheet.model';
import { TimeSheetService } from '../time-sheet.service';
import { UserListenerService } from './user-listener.service';

@Component({
  selector: 'app-time-sheet-list',
  templateUrl: './time-sheet-list.component.html',
  styleUrls: ['./time-sheet-list.component.css']
})
export class TimeSheetListComponent implements OnInit {

  timeSheets: TimeSheet[];
  constructor(private tsService:TimeSheetService,private router:Router,private route:ActivatedRoute,private afMessaging: AngularFireMessaging) { }

  ngOnInit(): void {
    this.tsService.timeSheetChanged.subscribe(
      (timeSheetList:TimeSheet[])=>{
        this.timeSheets=timeSheetList;
      }
    );
    this.timeSheets=this.tsService.getTimeSheets();

    // this.afMessaging.messages
    //   .subscribe((message) => { console.log(message); });
  }

  // requestPermission() {
  //   this.afMessaging.requestToken
  //     .subscribe(
  //       (token) => { console.log('Permission granted! Save to the server!', token); },
  //       (error) => { console.error(error); },  
  //     );
  // }

  onNewTimeSheet(){
    this.router.navigate(['new'],{relativeTo:this.route});
  }

}
