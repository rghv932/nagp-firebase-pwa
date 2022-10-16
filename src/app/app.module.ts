import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthComponent } from './auth/auth.component';
import { DataStorageService } from './shared/data-storage.service';
import { environment } from '../environments/environment';
import { PlaceholderDirective } from './shared/placeholder/placeholder.directive';
import { AlertComponent } from './shared/alert/alert.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthService } from './auth/auth.service';
import { TimeSheetComponent } from './time-sheet/time-sheet.component';
import { TimeSheetDetailComponent } from './time-sheet/time-sheet-detail/time-sheet-detail.component';
import { TimeSheetEditComponent } from './time-sheet/time-sheet-edit/time-sheet-edit.component';
import { TimeSheetListComponent } from './time-sheet/time-sheet-list/time-sheet-list.component';
import { TimeSheetStartComponent } from './time-sheet/time-sheet-start/time-sheet-start.component';
import { TimeSheetItemComponent } from './time-sheet/time-sheet-list/time-sheet-item/time-sheet-item.component';
import { TimeSheetService } from './time-sheet/time-sheet.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { ManagerComponent } from './manager/manager.component';
import { ManagerListComponent } from './manager/manager-list/manager-list.component';
import { ManagerItemComponent } from './manager/manager-list/manager-item/manager-item.component';
import { ManagerEditComponent } from './manager/manager-edit/manager-edit.component';
import { ManagerDetailComponent } from './manager/manager-detail/manager-detail.component';
import { ManagerStartComponent } from './manager/manager-start/manager-start.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    PlaceholderDirective,
    AlertComponent,
    LoadingSpinnerComponent,
    TimeSheetComponent,
    TimeSheetDetailComponent,
    TimeSheetEditComponent,
    TimeSheetListComponent,
    TimeSheetStartComponent,
    TimeSheetItemComponent,
    ManagerComponent,
    ManagerListComponent,
    ManagerItemComponent,
    ManagerEditComponent,
    ManagerDetailComponent,
    ManagerStartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireStorageModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideAuth(() => getAuth()),
    // provideDatabase(() => getDatabase())
  ],
  providers: [DataStorageService,TimeSheetService,AuthService,{provide:HTTP_INTERCEPTORS, useClass:AuthInterceptorService,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
