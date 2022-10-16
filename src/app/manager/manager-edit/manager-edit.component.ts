import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { TimeSheetStatus, TimeSheetType } from 'src/app/time-sheet/time-sheet.model';
import { ManagerListenerService } from '../manager-listener.service';

@Component({
  selector: 'app-manager-edit',
  templateUrl: './manager-edit.component.html',
  styleUrls: ['./manager-edit.component.css']
})
export class ManagerEditComponent implements OnInit {
  id:number;
  editMode=false;
  timeSheetId:string;
  timeSheetForm:FormGroup;
  //imagePath?:string;
  workDay=TimeSheetType.WorkDay;
  leaveDay=TimeSheetType.LeaveDay;
  inProgress=TimeSheetStatus.InProgress;
  approved=TimeSheetStatus.Approved;
  rejected=TimeSheetStatus.Rejected;

  constructor(private route:ActivatedRoute,private mgService:ManagerListenerService,private router:Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params:Params)=>{
        this.timeSheetId=params['timeSheetId'];
        this.id=+params['id'];
        this.editMode=params['id']!=null;
        this.initForm();
      }
    )
  }

  private initForm(){
    let timeSheetType:TimeSheetType=TimeSheetType.WorkDay;
    let timeSheetStatus:TimeSheetStatus=TimeSheetStatus.InProgress;
    let timeSheetDate: any='';
    let timeSheetStartTime:any='';
    let timeSheetEndTime:any='';
    let timeSheetDescription='';
    let timeSheetImagePath:string | null =null;

    if(this.editMode){
      const timeSheet=this.mgService.getTimeSheetByIdAndIdx(this.timeSheetId,this.id);
      timeSheetType=timeSheet.type;
      timeSheetStatus=timeSheet.status;
      timeSheetDate=timeSheet.date;
      timeSheetStartTime=timeSheet.startTime;
      timeSheetEndTime=timeSheet.endTime;
      timeSheetDescription=timeSheet.description;
      timeSheetImagePath=timeSheet.imagePath?? null;
    }

    this.timeSheetForm=new FormGroup({
      'type':new FormControl(timeSheetType,Validators.required),
      'status':new FormControl(timeSheetStatus,Validators.required),
      'date':new FormControl(timeSheetDate,Validators.required),
      'startTime':new FormControl(timeSheetStartTime,Validators.required),
      'endTime':new FormControl(timeSheetEndTime,Validators.required),
      'description':new FormControl(timeSheetDescription,Validators.required),
      'imagePath':new FormControl(timeSheetImagePath,Validators.required)
    });
  }

  onSubmit(){
    if(this.editMode){
      console.log("to be updated:",this.timeSheetForm.value);
      this.mgService.updateTimeSheet(this.id, this.timeSheetId, this.timeSheetForm.value);
    }
    this.onCancel();
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo:this.route});
  }

}
