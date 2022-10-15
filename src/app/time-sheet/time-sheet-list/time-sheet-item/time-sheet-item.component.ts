import { Component, Input, OnInit } from '@angular/core';

import { TimeSheet, TimeSheetStatus } from '../../time-sheet.model';

@Component({
  selector: 'app-time-sheet-item',
  templateUrl: './time-sheet-item.component.html',
  styleUrls: ['./time-sheet-item.component.css']
})
export class TimeSheetItemComponent implements OnInit {

  @Input() timeSheet:TimeSheet;
  @Input() index:number;
  status:string;

  ngOnInit(): void {
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

}