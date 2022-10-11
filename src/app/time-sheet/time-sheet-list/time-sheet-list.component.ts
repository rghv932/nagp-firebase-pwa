import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TimeSheet } from '../time-sheet.model';
import { TimeSheetService } from '../time-sheet.service';

@Component({
  selector: 'app-time-sheet-list',
  templateUrl: './time-sheet-list.component.html',
  styleUrls: ['./time-sheet-list.component.css']
})
export class TimeSheetListComponent implements OnInit {

  timeSheets: TimeSheet[];
  constructor(private tsService:TimeSheetService,private router:Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
    // this.recipeService.recipeChanged.subscribe(
    //   (recipesList:Recipe[])=>{
    //     this.recipes=recipesList;
    //   }
    // );
    this.timeSheets=this.tsService.getTimeSheets();
  }

  onNewTimeSheet(){
    this.router.navigate(['new'],{relativeTo:this.route});
  } 

}
