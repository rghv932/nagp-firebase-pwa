import { Component, OnInit } from '@angular/core';

import { ManagerListenerService, ValueType } from '../manager-listener.service';

@Component({
  selector: 'app-manager-list',
  templateUrl: './manager-list.component.html',
  styleUrls: ['./manager-list.component.css']
})
export class ManagerListComponent implements OnInit{

  timeSheetList: ValueType[]=[];
  constructor(private mgService:ManagerListenerService) {
    this.mgService.timeSheetListChanged.subscribe(
      (timeSheetList:ValueType[])=>{
        this.timeSheetList=timeSheetList;
        console.log(this.timeSheetList);
      }
    );
   }

  
  ngOnInit(): void {
    
    //this.timeSheetList=this.mgService.getTimeSheetList();
  }

  isEmpty(element, index, array)
  { 
    let something=element.userData.timeSheets==null || element.userData.timeSheets.length==0;
    console.log(something);
    return something;
  } 
    
    // Driver code
    // var arr = [ 11, 89, 23, 7, 98 ]; 
      
    // // Check for positive number 
    // var value = arr.every(ispositive); 
    // console.log( value );
}
