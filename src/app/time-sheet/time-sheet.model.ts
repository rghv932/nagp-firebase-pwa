export enum TimeSheetType {
  WorkDay,
  LeaveDay
}

export class TimeSheet{
  public type:TimeSheetType;
  public date:string;
  public startTime:string;
  public endTime:string;
  public description:string;

  constructor(tp:TimeSheetType,date:string,startTime:string,endTime:string,desc:string){
    this.type=tp;
    this.date=date;
    this.startTime=startTime;
    this.endTime=endTime;
    this.description=desc;
  }
}