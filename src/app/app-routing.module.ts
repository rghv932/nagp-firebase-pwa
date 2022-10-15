import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { TimeSheetDetailComponent } from './time-sheet/time-sheet-detail/time-sheet-detail.component';
import { TimeSheetEditComponent } from './time-sheet/time-sheet-edit/time-sheet-edit.component';
import { TimeSheetStartComponent } from './time-sheet/time-sheet-start/time-sheet-start.component';
import { TimeSheetComponent } from './time-sheet/time-sheet.component';
import { ManagerComponent } from './manager/manager.component';
import { ManagerStartComponent } from './manager/manager-start/manager-start.component';
import { ManagerEditComponent } from './manager/manager-edit/manager-edit.component';
import { ManagerDetailComponent } from './manager/manager-detail/manager-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/time-sheet', pathMatch: 'full' },
  { 
    path: 'time-sheet',
    component:TimeSheetComponent,
    canActivate:[AuthGuard],
    children:[
      { path: '', component: TimeSheetStartComponent },
      { path: 'new', component: TimeSheetEditComponent },
      {
        path: ':id',
        component: TimeSheetDetailComponent,
      },
      {
        path: ':id/edit',
        component: TimeSheetEditComponent,
      },
    ],
  },
  { 
    path: 'manager',
    component:ManagerComponent,
    //canActivate:[AuthGuard],
    children:[
      { path: '', component: ManagerStartComponent },
      { path: 'new', component: ManagerEditComponent },
      {
        path: ':id',
        component: ManagerDetailComponent,
      },
      {
        path: ':id/edit',
        component: ManagerEditComponent,
      },
    ],
  },
  { path: 'auth', component: AuthComponent },
  { path: '**', component: TimeSheetComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
