import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';

import { Observable } from "rxjs";

import { TimeSheet } from '../time-sheet.model';
import { TimeSheetService } from '../time-sheet.service';

@Injectable({
  providedIn: 'root'
})
export class UserListenerService {

  itemRef: AngularFireObject<TimeSheet[]>;
  item: Observable<TimeSheet[]>;

  constructor(private tsService:TimeSheetService,private db: AngularFireDatabase) {
    console.log(`timesheets/${this.tsService.timeSheetId}/timeSheets`);
    this.itemRef = this.db.object(`timesheets/${this.tsService.timeSheetId}/timeSheets`);
    this.item = this.itemRef.valueChanges();
    this.item.subscribe((value:TimeSheet[])=>{
      console.log("user timesheets:",value);
      console.log([].slice());
      if(value==null){
      this.tsService.timeSheets=[];
      this.tsService.timeSheetChanged.next(this.tsService.timeSheets.slice());
      }
      else{
        this.tsService.timeSheets=value;
        this.tsService.timeSheetChanged.next(this.tsService.timeSheets.slice());
      }
    });
  }

}
