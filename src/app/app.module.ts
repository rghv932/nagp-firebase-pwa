import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { provideAuth,getAuth} from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    ManagerDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    AngularFireAuthModule,
    BrowserAnimationsModule
  ],
  providers: [DataStorageService,TimeSheetService,AuthService,{provide:HTTP_INTERCEPTORS, useClass:AuthInterceptorService,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
