import { Injectable } from "@angular/core";

import { Subject } from "rxjs";
import { TimeSheet } from "./time-sheet.model";

@Injectable()
export class TimeSheetService{

  timeSheetChanged=new Subject<TimeSheet[]>();
  private timeSheets:TimeSheet[]=[];
  // private recipes: Recipe[]=[
  //   new Recipe('A Test Recipe','test','https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',[new Ingrediant('tomato',2),new Ingrediant('potato',3)]),
  //   new Recipe('Chinese Noodles','Just a delicious one!!','https://i1.wp.com/pixahive.com/wp-content/uploads/2020/09/Chinese-Noodles-25786-pixahive.jpg?fit=778%2C1151&ssl=1',[new Ingrediant('Spaghetti',5),new Ingrediant('Carrot',10)]),
  //   //new Recipe('Shakshi','Hot Chocolate',this.imageSource,[new Ingrediant('Hotness',100000),new Ingrediant('Tameez',5)])
  // ];
  constructor(){}

  getTimeSheets=()=>this.timeSheets.slice();

  getTimeSheetById(id:number){
    return this.timeSheets[id];
  }

  addTimeSheet(timeSheet:TimeSheet){
    this.timeSheets.push(timeSheet);
    this.timeSheetChanged.next(this.timeSheets.slice());
  }

  updateTimeSheet(id:number,newTimeSheet:TimeSheet){
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