import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { TimeSheet, TimeSheetStatus, TimeSheetType } from '../time-sheet.model';
import { TimeSheetService } from '../time-sheet.service';

@Component({
  selector: 'app-time-sheet-detail',
  templateUrl: './time-sheet-detail.component.html',
  styleUrls: ['./time-sheet-detail.component.css']
})
export class TimeSheetDetailComponent implements OnInit {
  timeSheet:TimeSheet;
  id:number;
  status:string;
  constructor(private tsService:TimeSheetService,private route:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params:Params)=>{
        this.id=+params['id'];
        this.timeSheet=this.tsService.getTimeSheetById(this.id);
        if(this.timeSheet.status==TimeSheetStatus.Rejected){
          this.status="Rejected";
        }
        else if(this.timeSheet.status==TimeSheetStatus.Approved){
          this.status="Approved";
        }
        else{
          this.status="In Progress";
        }
      }
    );
  }

  onEditSheet(){
    this.router.navigate(['edit'],{relativeTo:this.route});
  }
  
}
