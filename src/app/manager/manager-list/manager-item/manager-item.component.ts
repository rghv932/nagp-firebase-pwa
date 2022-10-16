import { Component, Input, OnInit } from '@angular/core';

import { TimeSheet, TimeSheetStatus } from 'src/app/time-sheet/time-sheet.model';

@Component({
  selector: 'app-manager-item',
  templateUrl: './manager-item.component.html',
  styleUrls: ['./manager-item.component.css']
})
export class ManagerItemComponent implements OnInit {

  @Input() timeSheet:TimeSheet;
  @Input() index:number;
  @Input() timeSheetId: string;
  status: string;

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
