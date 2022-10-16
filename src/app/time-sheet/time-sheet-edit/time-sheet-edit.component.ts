import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FileUpload } from 'src/app/shared/file-upload.model';

import { TimeSheetStatus, TimeSheetType } from '../time-sheet.model';
import { TimeSheetService } from '../time-sheet.service';
import { FileUploadService } from './file-upload.service';

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
  isLeaveDay:boolean=false;
  percentage = 0;
  
  selectedFile?: File;
  currentFileUpload?: FileUpload;

  photoUploaded:boolean=false;

  constructor(private route:ActivatedRoute,private tsService:TimeSheetService,private router:Router, private fupService:FileUploadService) { }

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
    let timeSheetPath='';

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
      'imagePath':new FormControl(timeSheetPath),
      'status':new FormControl(timeSheetStatus)
    });
  }

  uploadPhoto(){
    if (this.selectedFile) {
      console.log("inside if");
      const file: File | null = this.selectedFile;
      //this.selectedFile = undefined;

      if (file) {
        console.log("inside if File");
        this.currentFileUpload = new FileUpload(file);
        this.fupService.pushFileToStorage(this.currentFileUpload).subscribe(
          percentage => {
            console.log(percentage);
            if(percentage==100){
              this.photoUploaded=true;
            }
            //this.percentage = Math.round(percentage ? percentage : 0);
          },
          error => {
            console.log(error);
          }
        );
        console.log(this.currentFileUpload);
        this.timeSheetForm.value.imagePath=this.currentFileUpload.url;
      }
    }    
   
  }

  onSubmit(){
    //let imageUrl;
    this.timeSheetForm.value.imagePath=this.fupService.url;
    if(this.editMode){
      this.tsService.updateTimeSheet(this.id,this.timeSheetForm.value);
    }
    else{
      console.log("image path:",this.timeSheetForm.value.imagePath);
      this.tsService.addTimeSheet(this.timeSheetForm.value);
    }
    this.onCancel();
  }

  selectFile(event: any): void {
    this.selectedFile = event.target.files[0];
  }


  onCancel(){
    this.router.navigate(['../'], {relativeTo:this.route});
  }

  onTypeChange(e){
    console.log("changed:",e.target.value);
    if(e.target.value!=0){
      this.isLeaveDay=true;
      this.photoUploaded=false;
    }
    else {
      this.isLeaveDay=false;
    }   
  }
}
