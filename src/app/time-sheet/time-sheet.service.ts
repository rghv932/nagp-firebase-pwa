import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';

import { lastValueFrom, Observable, Subject } from "rxjs";

import { User } from "../auth/user.model";
import { TimeSheet } from "./time-sheet.model";

export interface TimeFireType{
  ownerId: string;
  name: string;
  timeSheets: TimeSheet[]
}

export interface TimeFireUserType{
  timeSheetId?:string;
  role: string
}

@Injectable()
export class TimeSheetService{
  timeSheetId:string;
  timeSheetChanged=new Subject<TimeSheet[]>();
  public timeSheets:TimeSheet[]=[
  ];
  itemRef: AngularFireObject<any>;
  item: Observable<any>;
  user:User;
  
  constructor(private http:HttpClient){
    this.timeSheetId=localStorage.getItem('timeSheetId');
    // this.itemRef.snapshotChanges().subscribe(action => {
    //   console.log("the snapshot that changed:",action.payload.val())
    // });
    // this.item.subscribe(value=>{
    //   console.log("this.item=>:",value);
    // });
    
    console.log("constructor timeSheetId:",this.timeSheetId);
  }

  //getTimeSheets=()=>this.timeSheets.slice();

  getTimeSheetById(id:number){
    return this.timeSheets[id];
  }

  addTimeSheetFirst(userId: string,role: string, name: string){    
    const t:TimeFireType={
      ownerId:userId,
      name: name,
      timeSheets:[]
      //timeSheets:[new TimeSheet(TimeSheetType.WorkDay,'2022-01-01','00:00','00:00','Anything Firstly Added')]
    };
    //this.itemRef.set(t);
    
    this.http.post('https://pwa-firebase-time-sheet-default-rtdb.firebaseio.com/timesheets.json',t)
    .subscribe(response=>{
      this.timeSheetId=response['name'];
      //console.log(this.timeSheetId);
      localStorage.setItem('timeSheetId',this.timeSheetId);

      const userData:TimeFireUserType={
        timeSheetId:this.timeSheetId,
        role: role
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
    console.log(timeSheet);
    //console.log("through userId",userId);
    // this.timeSheets.push(timeSheet);
    // this.timeSheetChanged.next(this.timeSheets.slice());
    // const t:TimeFireType={
    //   ownerId:this.user.id,
    //   timeSheets:[timeSheet]
    // }
    
    const length=this.timeSheets.length;
    this.timeSheetId=localStorage.getItem('timeSheetId');
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
    this.timeSheetId=localStorage.getItem('timeSheetId');
    const url=`https://pwa-firebase-time-sheet-default-rtdb.firebaseio.com/timesheets/${this.timeSheetId}.json`;
    //console.log("this is my usrl:",url);
    this.http.get(url)
      .subscribe((response:TimeFireType)=>{
        this.timeSheets=response?.timeSheets ?? [];
        this.timeSheetChanged.next(this.timeSheets.slice());
        //console.log("these are my timesheets:",this.timeSheets);
      });
    return this.timeSheets;
  }

  async getTimeSheetId(){
    const url=`https://pwa-firebase-time-sheet-default-rtdb.firebaseio.com/users/${this.user.id}.json`;
    //console.log("the url:",url);
    await lastValueFrom(this.http.get(url))
      .then((response:TimeFireUserType)=>{
        if(response.role=='admin'){

        }
        localStorage.setItem('timeSheetId',response.timeSheetId);
        this.timeSheetId=localStorage.getItem('timeSheetId');
        //console.log("this is the timeSheetId:",this.timeSheetId);
      })
      // .subscribe();
  }

  async getUserRole(userId: string){
    const url=`https://pwa-firebase-time-sheet-default-rtdb.firebaseio.com/users/${userId}.json`;
    //console.log("the url:",url);
    let response=await lastValueFrom(this.http.get<TimeFireUserType>(url));
    console.log("got role:", response.role);
    return response.role;
  }

  updateTimeSheet(id:number,newTimeSheet:TimeSheet){
    console.log("here------>:",newTimeSheet);
    this.http.patch(`https://pwa-firebase-time-sheet-default-rtdb.firebaseio.com/timesheets/${this.timeSheetId}/timeSheets/${id}.json`,newTimeSheet)
      .subscribe(response=>{
        //(response);
      });
    this.timeSheets[id]=newTimeSheet;
    this.timeSheetChanged.next(this.timeSheets.slice());
  }

  setTimeSheets(newTimeSheets:TimeSheet[]){
    this.timeSheets=newTimeSheets;
    this.timeSheetChanged.next(this.timeSheets.slice());
  }
}