import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TimeSheet } from 'src/app/time-sheet/time-sheet.model';
import { TimeSheetService } from 'src/app/time-sheet/time-sheet.service';

@Component({
  selector: 'app-manager-list',
  templateUrl: './manager-list.component.html',
  styleUrls: ['./manager-list.component.css']
})
export class ManagerListComponent implements OnInit {

  timeSheets: TimeSheet[];
  constructor(private tsService:TimeSheetService,private router:Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.tsService.timeSheetChanged.subscribe(
      (timeSheetList:TimeSheet[])=>{
        this.timeSheets=timeSheetList;
      }
    );
    this.timeSheets=this.tsService.getTimeSheets();
  }
  
}
