export enum TimeSheetType {
  WorkHours,
  LeaveDay
}

export class TimeSheet{
  public type:TimeSheetType;
  public date:Date;
  public startTime:Date;
  public endTime:Date;
  public description:string;

  constructor(tp:TimeSheetType,date:Date,startTime:Date,endTime:Date,desc:string){
    this.type=tp;
    this.date=date;
    this.startTime=startTime;
    this.endTime=endTime;
    this.description=desc;
  }
}