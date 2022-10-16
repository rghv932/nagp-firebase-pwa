import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { TimeSheet, TimeSheetStatus } from 'src/app/time-sheet/time-sheet.model';
import { ManagerListenerService } from '../manager-listener.service';

@Component({
  selector: 'app-manager-detail',
  templateUrl: './manager-detail.component.html',
  styleUrls: ['./manager-detail.component.css']
})
export class ManagerDetailComponent implements OnInit {
  
  timeSheet:TimeSheet;
  id:number;
  status:string;
  timeSheetId:string;
  constructor(private mgService:ManagerListenerService,private route:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params:Params)=>{
        this.id=+params['id'];
        this.timeSheetId=params['timeSheetId'];
        this.timeSheet=this.mgService.getTimeSheetByIdAndIdx(this.timeSheetId,this.id);
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
