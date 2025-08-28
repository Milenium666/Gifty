import { TuiRoot } from "@taiga-ui/core";
import { Component, inject  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HeaderComponent } from './layout/header/header';

@Component({
  imports: [RouterModule, TuiRoot, CommonModule, HeaderComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
  protected title = 'gift-helper';
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  
  readonly user$: Observable<User | null> = this.auth.user$;
  get isHome(): boolean {
    return this.router.url === '/';
  }

  get isAuth(): boolean {
    return this.router.url.startsWith('/auth');
  }
}
