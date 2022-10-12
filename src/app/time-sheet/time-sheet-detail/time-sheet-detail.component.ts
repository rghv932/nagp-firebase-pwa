import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { TimeSheet, TimeSheetType } from '../time-sheet.model';
import { TimeSheetService } from '../time-sheet.service';

@Component({
  selector: 'app-time-sheet-detail',
  templateUrl: './time-sheet-detail.component.html',
  styleUrls: ['./time-sheet-detail.component.css']
})
export class TimeSheetDetailComponent implements OnInit {
  timeSheet:TimeSheet;
  id:number;
  constructor(private tsService:TimeSheetService,private route:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params:Params)=>{
        this.id=+params['id'];
        this.timeSheet=this.tsService.getTimeSheetById(this.id);
      }
    );
  }

  onEditSheet(){
    this.router.navigate(['edit'],{relativeTo:this.route});
  }

  onDeleteSheet(){
    // this.tsService.deleteTimeSheet(this.id);
    this.router.navigate(['/time-sheet']);
  }
}
