import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TimeSheetType } from 'src/app/time-sheet/time-sheet.model';

import { TimeSheetService } from 'src/app/time-sheet/time-sheet.service';

@Component({
  selector: 'app-manager-edit',
  templateUrl: './manager-edit.component.html',
  styleUrls: ['./manager-edit.component.css']
})
export class ManagerEditComponent implements OnInit {
  id:number;
  editMode=false;
  timeSheetForm:FormGroup;
  workDay=TimeSheetType.WorkDay;
  leaveDay=TimeSheetType.LeaveDay;

  constructor(private route:ActivatedRoute,private tsService:TimeSheetService,private router:Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params:Params)=>{
        this.id=+params['id'];
        this.editMode=params['id']!=null;
        this.initForm();
      }
    )
  }

  private initForm(){
    let timeSheetType:TimeSheetType=TimeSheetType.WorkDay;
    let timeSheetDate: any='';
    let timeSheetStartTime:any='';
    let timeSheetEndTime:any='';
    let timeSheetDescription='';

    if(this.editMode){
      const recipe=this.tsService.getTimeSheetById(this.id);
      timeSheetType=recipe.type;
      timeSheetDate=recipe.date;
      timeSheetStartTime=recipe.startTime;
      timeSheetEndTime=recipe.endTime;
      timeSheetDescription=recipe.description;
      
    }

    this.timeSheetForm=new FormGroup({
      'type':new FormControl(timeSheetType,Validators.required),
      'date':new FormControl(timeSheetDate,Validators.required),
      'startTime':new FormControl(timeSheetStartTime,Validators.required),
      'endTime':new FormControl(timeSheetEndTime,Validators.required),
      'description':new FormControl(timeSheetDescription,Validators.required)
    });
  }

  onSubmit(){
    if(this.editMode){
      this.tsService.updateTimeSheet(this.id,this.timeSheetForm.value);
    }
    this.onCancel();
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo:this.route});
  }

}
