import { Component, Input, OnInit } from '@angular/core';

import { TimeSheet } from 'src/app/time-sheet/time-sheet.model';

@Component({
  selector: 'app-manager-item',
  templateUrl: './manager-item.component.html',
  styleUrls: ['./manager-item.component.css']
})
export class ManagerItemComponent implements OnInit {

  @Input() timeSheet:TimeSheet;
  @Input() index:number;

  ngOnInit(): void {
  }
}
