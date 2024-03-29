export enum TimeSheetType {
  WorkDay,
  LeaveDay
}

export enum TimeSheetStatus{
  InProgress='InProgress',
  Approved='Approved',
  Rejected='Rejected'
}

export class TimeSheet{
  public type:TimeSheetType;
  public date:string;
  public startTime:string;
  public endTime:string;
  public description:string;
  public status:TimeSheetStatus;
  public imagePath?: string;

  constructor(tp:TimeSheetType,date:string,startTime:string,endTime:string,desc:string, imagePath: string){
    this.type=tp;
    this.date=date;
    this.startTime=startTime;
    this.endTime=endTime;
    this.description=desc;
    this.status=TimeSheetStatus.InProgress;
    this.imagePath=imagePath;
  }
}