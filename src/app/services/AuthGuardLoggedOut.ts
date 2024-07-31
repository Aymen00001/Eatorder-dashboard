import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiServices } from './api';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardLoggedOut implements CanActivate {
  constructor(private authService: ApiServices, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // User is already authenticated, redirect to dashboard or desired page
      this.router.navigateByUrl('/dashboard/analytics');
      return false;
    }
    return true;
  }
}
