import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { TimeSheetStatus, TimeSheetType } from '../time-sheet.model';
import { TimeSheetService } from '../time-sheet.service';

@Component({
  selector: 'app-time-sheet-edit',
  templateUrl: './time-sheet-edit.component.html',
  styleUrls: ['./time-sheet-edit.component.css']
})
export class TimeSheetEditComponent implements OnInit {
  id:number;
  editMode=false;
  timeSheetForm:FormGroup;
  workDay=TimeSheetType.WorkDay;
  leaveDay=TimeSheetType.LeaveDay;
  imagePath: any;
  myDatePicker: any;

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
    let timeSheetStatus:TimeSheetStatus=TimeSheetStatus.InProgress;
    let timeSheetDate: any='2000-01-01';
    let timeSheetStartTime:any='00:00';
    let timeSheetEndTime='00:00';
    let timeSheetDescription='';
    let images=new FormArray([]);

    if(this.editMode){
      const timeSheet=this.tsService.getTimeSheetById(this.id);
      timeSheetType=timeSheet.type;
      timeSheetDate=timeSheet.date;
      timeSheetStartTime=timeSheet.startTime;
      timeSheetEndTime=timeSheet.endTime;
      timeSheetDescription=timeSheet.description;
      timeSheetStatus=TimeSheetStatus.InProgress;
      // if(timeSheet['ingrediants']){
      //   for(let ing of timeSheet.ingrediants){
      //     ingrediants.push(
      //       new FormGroup({
      //         'name':new FormControl(ing.name,Validators.required),
      //         'amount':new FormControl(ing.amount,[
      //           Validators.required,
      //           Validators.pattern(/^[1-9]+[0-9]*$/)
      //         ])
      //       })
      //     );
      //   }
      // }
    }

    this.timeSheetForm=new FormGroup({
      'type':new FormControl(timeSheetType,Validators.required),
      'date':new FormControl(timeSheetDate,Validators.required),
      'startTime':new FormControl(timeSheetStartTime,Validators.required),
      'endTime':new FormControl(timeSheetEndTime,Validators.required),
      'description':new FormControl(timeSheetDescription,Validators.required),
      'images':images,
      'timeSheetStatus':new FormControl(timeSheetStatus)
    });
  }

  onSubmit(){
    if(this.editMode){
      this.tsService.updateTimeSheet(this.id,this.timeSheetForm.value);
    }
    else{
      //console.log(this.timeSheetForm.value.date);
      this.tsService.addTimeSheet(this.timeSheetForm.value);
    }
    this.onCancel();
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo:this.route});
  }

  onTypeChange(e){
    if(e.target.value!=0){
      (<FormArray>this.timeSheetForm.get('images')).push(
        new FormGroup({
          'image':new FormControl(null,Validators.required)
        })
      );
    }
    else {
      (<FormArray>this.timeSheetForm.get('images')).removeAt(0);
    }   
  }
}
