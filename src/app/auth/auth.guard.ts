import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
      return this.authService.user.pipe(
        take(1),
        map(user=>{
          const isAuth=!!user;
          //console.log(user.role);
          if(user?.role=='admin'){
            return this.router.createUrlTree(['/manager']);
          }
          if(isAuth){
            return true;
          }
          return this.router.createUrlTree(['/auth']);
        })
      );
  }
}

