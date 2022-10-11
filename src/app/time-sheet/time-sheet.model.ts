export enum TimeSheetType {
  WorkHours,
  LeaveDay
}

export class TimeSheet{
  public type:TimeSheetType;
  public date:number;
  public startTime:number;
  public endTime:number;
  public description:string;

  constructor(tp:TimeSheetType,date:number,startTime:number,endTime:number,desc:string){
    this.type=tp;
    this.date=date;
    this.startTime=startTime;
    this.endTime=endTime;
    this.description=desc;
  }
}