import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';

import { Observable, Subject } from 'rxjs';

import { TimeSheet } from '../time-sheet/time-sheet.model';
import { TimeFireType } from '../time-sheet/time-sheet.service';

export interface ValueType{
  timeSheetId: string;
  userData: TimeFireType
}

@Injectable({
  providedIn: 'root'
})
export class ManagerListenerService {

  itemRef: AngularFireObject<any>;
  item: Observable<any>;
  
  timeSheetList: ValueType[]=[];
  timeSheetListChanged=new Subject<ValueType[]>();

  constructor(private db: AngularFireDatabase) {
    console.log(`timesheets`);
    this.itemRef = this.db.object(`timesheets`);
    this.item = this.itemRef.valueChanges();
    this.item.subscribe((value)=>{
      this.timeSheetList=[];
      //console.log("\nproperty:",prop,"value:",typeof value[prop])
      Object.keys(value).forEach((key)=>{
        let ts:ValueType={
          timeSheetId:key,
          userData:{
            ownerId: value[key].ownerId,
            name: value[key].name,
            timeSheets: value[key].timeSheets
          }
        }
        console.log(ts);
        this.timeSheetList.push(ts);
      });
      //this.timeSheetList=value;
      this.timeSheetListChanged.next(this.timeSheetList.slice());
    });
  }

  getTimeSheetByIdAndIdx(timeSheetId: string,id: number){
    return this.timeSheetList.find(x=>x.timeSheetId==timeSheetId).userData.timeSheets[id];
  }

  updateTimeSheet(id:number, timeSheetId:string, newTimeSheet:TimeSheet){
    let timesheet:AngularFireObject<any>= this.db.object(`timesheets/${timeSheetId}/timeSheets/${id}`);
    //const t={1:"timesheetUpdate"};
    timesheet.update(newTimeSheet);
    // this.http.patch(`https://pwa-firebase-time-sheet-default-rtdb.firebaseio.com/timesheets/${timeSheetId}/timeSheets/${id}.json`,newTimeSheet)
    //   .subscribe(response=>{
    //     //(response);
    //   });
    // this.timeSheets[id]=newTimeSheet;
    // this.timeSheetChanged.next(this.timeSheets.slice());
  }
}