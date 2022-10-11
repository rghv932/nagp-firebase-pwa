import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { TimeSheetDetailComponent } from './time-sheet/time-sheet-detail/time-sheet-detail.component';
import { TimeSheetEditComponent } from './time-sheet/time-sheet-edit/time-sheet-edit.component';
import { TimeSheetStartComponent } from './time-sheet/time-sheet-start/time-sheet-start.component';
import { TimeSheetComponent } from './time-sheet/time-sheet.component';

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
  { path: 'auth', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
