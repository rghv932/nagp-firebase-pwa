import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import {  Subscription } from 'rxjs';
import firebase from 'firebase/compat/app';

import { AuthService } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { WindowService } from '../shared/window.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading=false;
  usingPhone=false;
  error:string=null;
  confirmResult;
  windowRef:any;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  private closeSub:Subscription;

  constructor(private authService: AuthService,private router:Router, private wService:WindowService) { 
    this.windowRef=this.wService.windowRef;
  }

  ngOnInit(): void {
    this.windowRef.RecaptchaVerifier=new firebase.auth.RecaptchaVerifier(
      'recaptcha-container');
  }

  onChangeAuthMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if(!form.valid){
      return;
    }

    let authObs;
    this.isLoading=true;

    if (this.isLoginMode) {
      //authObs=this.authService.login(form.value.email, form.value.password);
      authObs=this.authService.signInUsingSdk(form.value.email, form.value.password);
    }
    else {
      authObs=this.authService.signUpUsingSdk(form.value.email, form.value.password);
    }

    authObs.subscribe({
      next:data=>{
        //console.log("this is the data:",data);
        this.isLoading=false;
        //console.log("here");
        this.router.navigate(['/time-sheet']);
      },
      error:error=>{
        console.log(error);
        this.error=error;
        this.showErrorAlert(error);
        this.isLoading=false;
      }
    });
    
    // authObs.subscribe((data) => {
    //   console.log("this is the data:",data);
    //   this.isLoading=false;
    //   console.log("here");
    //   this.router.navigate(['/time-sheet']);
    // },
    // (error) => {
    //   console.log(error);
    //   this.error=error;
    //   this.showErrorAlert(error);
    //   this.isLoading=false;
    // });
    form.reset();
  }

  signInWithGoogle(){
    let authObs;
    this.isLoading=true;
    authObs=this.authService.googleSignIn();
    authObs.subscribe({
      next:data=>{
        //console.log("this is the data:",data);
        this.isLoading=false;
        //console.log("here");
        this.router.navigate(['/time-sheet']);
      },
      error:error=>{
        console.log(error);
        this.error=error;
        this.showErrorAlert(error);
        this.isLoading=false;
      }
    });
  }

  onSubmitUsingPhone(form: NgForm) {
    if(!form.valid){
      return;
    }

    let authObs;
    this.isLoading=true;
    this.usingPhone=true;
    
    this.windowRef.RecaptchaVerifier.render();
    

    console.log("application verifier in auth.ts"+this.windowRef.RecaptchaVerifier);
    authObs = this.authService.phoneSignIn(form.value.phone,this.windowRef.RecaptchaVerifier);

    authObs.subscribe({
      next:()=>{
        //console.log("this is the submit phone data:",typeof data,"\n"+data);
        this.isLoading=false;
        //console.log("here");
      },
      error:error=>{
        console.log(error);
        this.error=error;
        this.showErrorAlert(error);
        this.isLoading=false;
        this.usingPhone=false;
      }
    });
    form.reset();
  }

  onConfirmOTP(form:NgForm){
    if(!form.valid){
      return;
    }

    let authObs;
    this.isLoading=true;

    authObs = this.authService.confirmOTP(form.value.otp);

    authObs.subscribe({
      next:data=>{
        console.log("this is the otp data:",typeof data,"\n"+data);
        this.isLoading=false;
        //console.log("here");
        this.router.navigate(['/time-sheet']);
      },
      error:error=>{
        console.log(error);
        this.error=error;
        this.showErrorAlert(error);
        this.isLoading=false;
      }
    });
    form.reset();
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
