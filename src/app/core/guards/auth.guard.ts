import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(): Observable<boolean | import('@angular/router').UrlTree> {
    return this.auth.user$.pipe(
      map(user => {
        if (user) {
          return true;
        }
        return this.router.createUrlTree(['/auth'], {
          queryParams: { returnUrl: this.router.url }
        });
      })
    );
  }
}
