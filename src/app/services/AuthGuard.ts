import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiServices } from './api';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: ApiServices, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return this.checkUserLogin(next, state.url);
      return true; // User is authenticated, allow access to the route
    } else {
      return this.router.createUrlTree(['/auth/sign-in'], { queryParams: { returnUrl: state.url } });
    }
  }
  checkUserLogin(route: ActivatedRouteSnapshot,url: any): boolean {
     
      const userRole = this.authService.getRole();
      // console.log (userRole);
      // console.log(route.data.role);
      if (route.data.role && route.data.role.indexOf(userRole) === -1) {
        this.router.navigate(['/']);
        return false;
    
      }return true;   
   

  }
}
