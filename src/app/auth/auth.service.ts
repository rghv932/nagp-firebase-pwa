import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { BehaviorSubject, throwError, defer, from, of } from 'rxjs';
import firebase from 'firebase/compat/app';

import { TimeSheetService } from '../time-sheet/time-sheet.service';
import { User } from './user.model';

// export interface AuthResponse {
//   kind: string;
//   idToken: string;
//   email: string;
//   refreshToken: string;
//   expiresIn: string;
//   localId: string;
//   registered?: boolean;
// }

@Injectable()
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer:any;
  confirmResult: firebase.auth.ConfirmationResult;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tsService:TimeSheetService,
    private afAuth: AngularFireAuth
  ) {}

  signUpUsingSdk(email: string, password: string){
    return defer(
      ()=> this.afAuth.createUserWithEmailAndPassword(email,password)
      .then(async (userCred)=>{
      const user=userCred.user;
        let token: string=await user.getIdToken();
        this.handleAuth(
          user.email,
          user.uid,
          token,
          3600,
          'employee'
        );
        this.tsService.addTimeSheetFirst(user.uid,'employee');
      }).catch(this.handleError)
    );
    //   .pipe(
    //   catchError(this.handleError),
    //   tap(async (userCred) => {
    //     const user=userCred.user;
    //     let token: string=await user.getIdToken();
    //     this.handleAuth(
    //       user.email,
    //       user.uid,
    //       token,
    //       3600
    //     );
    //     this.tsService.addTimeSheetFirst(user.uid);
    //   })
    // ));
  }

  signInUsingSdk(email: string, password: string){
    return defer(
      () => this.afAuth.signInWithEmailAndPassword(email,password)
      .then(async (userCred)=>{
      const user=userCred.user;
        let token: string=await user.getIdToken();
        const role=await this.tsService.getUserRole(user.uid);
        this.handleAuth(
          user.email,
          user.uid,
          token,
          3600,
          role
        );
        await this.tsService.getTimeSheetId();
      }).catch(this.handleError)
    );
    // return from(this.afAuth.signInWithEmailAndPassword(email,password))
    // .pipe(
    //   catchError(this.handleError),
    //   tap(async (userCred) => {
    //     const user=userCred.user;
    //     let token: string;
    //     token = await user.getIdToken();
    //     this.handleAuth(
    //       user.email,
    //       user.uid,
    //       token,
    //       3600
    //     );
    //     this.tsService.getTimeSheetId();
    //     //this.tsService.addTimeSheetFirst(user.uid);
    //   })
    // );
  }

  // signInusingSdk(email: string,password: string){
  //   this.afAuth.signInWithEmailAndPassword(email,password)
  //     .then(value=>{
  //       console.log("value type:",typeof value, "\n\n\nvalue:",value);
  //       let token: string;
  //       value.user.getIdToken().then(val=>{
  //         token=val;
  //       });
  //       this.handleAuth(value.user.email,value.user.uid,token,3600);
  //     })
  //     .catch(this.handleError);
  // }

  // signUp(email: string, password: string) {
  //   return this.http
  //     .post<AuthResponse>(
  //       'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBELFP4hqtDSeTaNoHmo1FH8_XID7M4Q_Y',
  //       {
  //         email: email,
  //         password: password,
  //         returnSecureToken: true,
  //       }
  //     )
  //     .pipe(
  //       catchError(this.handleError),
  //       tap((resData) => {
  //         this.handleAuth(
  //           resData.email,
  //           resData.localId,
  //           resData.idToken,
  //           +resData.expiresIn
  //         );
  //         this.tsService.addTimeSheetFirst(resData.localId);
  //       })
  //     );
  // }

  // login(email: string, password: string) {
  //   return this.http
  //     .post<AuthResponse>(
  //       'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBELFP4hqtDSeTaNoHmo1FH8_XID7M4Q_Y',
  //       {
  //         email: email,
  //         password: password,
  //         returnSecureToken: true,
  //       }
  //     )
  //     .pipe(
  //       catchError(this.handleError),
  //       tap((resData) => {
  //         this.handleAuth(
  //           resData.email,
  //           resData.localId,
  //           resData.idToken,
  //           +resData.expiresIn
  //         );
  //       })
  //     );
  // }

  async autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
      role: string
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate),
      userData.role
    );

    if(loadedUser.token){
      this.user.next(loadedUser);
      this.tsService.user=loadedUser;
      await this.tsService.getTimeSheetId();
      const expirationDuration=new Date(userData._tokenExpirationDate).getTime()-new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.afAuth.signOut().then(()=>{
      console.log("logged-out");
    });
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    localStorage.removeItem('timeSheetId');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer=null;
  }

  autoLogout(expirationDuration:number){
    this.tokenExpirationTimer=setTimeout(()=>{
      this.logout();
    },
    expirationDuration);
  }

  googleSignIn(){
    return defer(
      () => this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(async (userCred)=>{
      const user=userCred.user;
      console.log(userCred.additionalUserInfo.isNewUser);
        let token: string=await user.getIdToken();
        const role=await this.tsService.getUserRole(user.uid);
        this.handleAuth(
          user.email,
          user.uid,
          token,
          3600,
          role
        );
        if(userCred.additionalUserInfo.isNewUser){
          this.tsService.addTimeSheetFirst(user.uid,'employee');
        }
        else{
          await this.tsService.getTimeSheetId();
        }
      }).catch(this.handleError)
    );
  }

  phoneSignIn(phoneNumber: string,applicationVerifier: firebase.auth.ApplicationVerifier){
    console.log(applicationVerifier);
    return defer(
      ()=> this.afAuth.signInWithPhoneNumber(phoneNumber,applicationVerifier)
      .then(data=>{
        console.log("auth service:",data);
        this.confirmResult=data;
        //return of(data);
      })
      .catch(this.handleError)
    );
  }

  confirmOTP(otp: string){
    console.log(this.confirmResult);
    return defer(
      ()=> this.confirmResult.confirm(otp)
      .then(async (userCred)=>{
        const user=userCred.user;
        console.log(userCred.additionalUserInfo.isNewUser);
          let token: string=await user.getIdToken();
          const role=await this.tsService.getUserRole(user.uid);
          this.handleAuth(
            user.email,
            user.uid,
            token,
            3600,
            role
          );
          if(userCred.additionalUserInfo.isNewUser){
            this.tsService.addTimeSheetFirst(user.uid,'employee');
          }
          else{
            await this.tsService.getTimeSheetId();
          }
        }).catch(this.handleError)
    );
  }

  private handleAuth(
    email: string,
    userId: string,
    token: string,
    expiresIn: number,
    role: string
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate, role);
    this.user.next(user);
    this.tsService.user=user;
    //this.tsService.getTimeSheetId();
    this.autoLogout(expiresIn*1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes) {
    let errorMessage = 'An unknown error occurred!!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(()=>new Error(errorMessage));
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This Email exists already!!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = "Email doesn't exist!";
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Password is not valid!';
    }
    return throwError(()=>new Error(errorMessage));
  }
}
