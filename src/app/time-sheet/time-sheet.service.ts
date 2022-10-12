import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Subject } from "rxjs";
import { User } from "../auth/user.model";

import { TimeSheet, TimeSheetType } from "./time-sheet.model";

interface TimeFireType{
  ownerId:string;
  timeSheets:TimeSheet[]
}

interface TimeFireUserType{
  timeSheetId:string;
}

@Injectable()
export class TimeSheetService{
  timeSheetId:string;
  timeSheetChanged=new Subject<TimeSheet[]>();
  private timeSheets:TimeSheet[]=[
  ];

  user:User;
  
  constructor(private http:HttpClient){}

  //getTimeSheets=()=>this.timeSheets.slice();

  getTimeSheetById(id:number){
    return this.timeSheets[id];
  }

  addTimeSheetFirst(userId:string){    
    const t:TimeFireType={
      ownerId:userId,
      timeSheets:[]
    }
    
    this.http.post('https://pwa-firebase-time-sheet-default-rtdb.firebaseio.com/timesheets.json',t)
    .subscribe(response=>{
      this.timeSheetId=response['name'];
      //console.log(this.timeSheetId);
      
      const userData:TimeFireUserType={
        timeSheetId:this.timeSheetId
      };

      //console.log("user ID:",userId);
      //console.log("user ID:",userData);
      
      const url=`https://pwa-firebase-time-sheet-default-rtdb.firebaseio.com/users/${userId}.json`;
      //console.log("user ID:",url);

      this.http.put(url,userData)
        .subscribe(response=>{
          //console.log(response);
        });
    });

    // const url=`https://pwa-firebase-time-sheet-default-rtdb.firebaseio.com/users/${userId}.json`;
    // this.http.post(url,userData)
    // .subscribe(response=>{
    //   console.log(response);
    // });
  }

  addTimeSheet(timeSheet:TimeSheet){
    //console.log("through userId",userId);
    // this.timeSheets.push(timeSheet);
    // this.timeSheetChanged.next(this.timeSheets.slice());
    // const t:TimeFireType={
    //   ownerId:this.user.id,
    //   timeSheets:[timeSheet]
    // }
    
    const length=this.timeSheets.length;
    this.http.patch(`https://pwa-firebase-time-sheet-default-rtdb.firebaseio.com/timesheets/${this.timeSheetId}/timeSheets/${length}.json`,timeSheet)
      .subscribe(response=>{
        console.log(response);
        this.getTimeSheets();
      });
    
    // this.http.get('https://pwa-firebase-time-sheet-default-rtdb.firebaseio.com/timesheets/something.json')
    //   .subscribe(response=>{
    //     //console.log(response);
    //   });

    
  }

  getTimeSheets(){
    this.http.get(`https://pwa-firebase-time-sheet-default-rtdb.firebaseio.com/timesheets/${this.timeSheetId}.json`)
      .subscribe((response:TimeFireType)=>{
        this.timeSheets=response?.timeSheets ?? [];
        this.timeSheetChanged.next(this.timeSheets.slice());
        console.log("add time sheet first:",this.timeSheets);
      });
    return this.timeSheets;
  }

  getTimeSheetId(){
    const url=`https://pwa-firebase-time-sheet-default-rtdb.firebaseio.com/users/${this.user.id}.json`;
    this.http.get(url)
      .subscribe((response:TimeFireUserType)=>{
        this.timeSheetId=response.timeSheetId;
        console.log(response);
      });
  }

  updateTimeSheet(id:number,newTimeSheet:TimeSheet){
    this.http.patch(`https://pwa-firebase-time-sheet-default-rtdb.firebaseio.com/timesheets/${this.timeSheetId}/timeSheets/${id}.json`,newTimeSheet)
      .subscribe(response=>{
        console.log(response);
      });
    this.timeSheets[id]=newTimeSheet;
    this.timeSheetChanged.next(this.timeSheets.slice());
  }

  deleteTimeSheet(id:number){
    this.timeSheets.splice(id,1);
    this.timeSheetChanged.next(this.timeSheets.slice());
  }

  setTimeSheets(newRecipes:TimeSheet[]){
    this.timeSheets=newRecipes;
    this.timeSheetChanged.next(this.timeSheets.slice());
  }
}