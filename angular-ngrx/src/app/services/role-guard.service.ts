import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {

  constructor(
    public auth: AuthService,
    public router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data.expectedRole;
    const currentUserRole = this.auth.currentUserValue.role as number;

    if (!this.auth.currentUserValue || currentUserRole < expectedRole) {
      this.router.navigate(['forbidden']);
      return false;
    }
    return true;
  }
}
