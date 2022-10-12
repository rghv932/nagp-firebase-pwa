import { Component, Input, OnInit } from '@angular/core';

import { TimeSheet } from '../../time-sheet.model';

@Component({
  selector: 'app-time-sheet-item',
  templateUrl: './time-sheet-item.component.html',
  styleUrls: ['./time-sheet-item.component.css']
})
export class TimeSheetItemComponent implements OnInit {

  @Input() timeSheet:TimeSheet;
  @Input() index:number;

  ngOnInit(): void {
  }

}