import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { TimeSheetType } from '../time-sheet.model';
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
    let timeSheetType:TimeSheetType;
    let timeSheetDate:Date=null;
    let timeSheetStartTime:Date;
    let timeSheetEndTime:Date;
    let timeSheetDescription='';

    if(this.editMode){
      const recipe=this.tsService.getTimeSheetById(this.id);
      timeSheetType=recipe.type;
      timeSheetDate=recipe.date;
      timeSheetStartTime=recipe.startTime;
      timeSheetEndTime=recipe.endTime;
      timeSheetDescription=recipe.description;
      // if(recipe['ingrediants']){
      //   for(let ing of recipe.ingrediants){
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
      //'ingrediants':ingrediants
    });
  }

  onAddIngrediant(){
    (<FormArray>this.timeSheetForm.get('ingrediants')).push(
      new FormGroup({
        'name':new FormControl(null,Validators.required),
        'amount':new FormControl(null,[
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );  
  }

  onSubmit(){
    if(this.editMode){
      this.tsService.updateTimeSheet(this.id,this.timeSheetForm.value);
    }
    else{
      this.tsService.addTimeSheet(this.timeSheetForm.value);
    }
    this.onCancel();
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo:this.route});
  }

  onDeleteIngrediant(id:number){
    (<FormArray>this.timeSheetForm.get('ingrediants')).removeAt(id);
  }

}