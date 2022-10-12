import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { AuthResponse, AuthService } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading=false;
  error:string=null;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  private closeSub:Subscription;

  constructor(private authService: AuthService,private router:Router) { }

  ngOnInit(): void {
  }

  onChangeAuthMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if(!form.valid){
      return;
    }

    let authObs:Observable<AuthResponse>;
    this.isLoading=true;

    if (this.isLoginMode) {
      authObs=this.authService.login(form.value.email, form.value.password);
    }
    else {
      authObs=this.authService.signUp(form.value.email, form.value.password);
    }

    authObs.subscribe((data) => {
      //console.log(data);
      this.isLoading=false;
      this.router.navigate(['/time-sheet']);
    },
    (error) => {
      console.log(error);
      this.error=error;
      this.showErrorAlert(error);
      this.isLoading=false;
    });

    form.reset();
  }

  signInWithGoogle(){
    this.authService.googleSignIn();
  }

  onHandleError(){
    this.error=null;
  }

  ngOnDestroy(): void {
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }
  }

  private showErrorAlert(message:string){
    //Dynamic component creation
    //const alertCmpFactory=this.factory.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef=this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef=hostViewContainerRef.createComponent(AlertComponent);

    componentRef.instance.message=message;
    this.closeSub=componentRef.instance.close.subscribe(()=>{
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

}
