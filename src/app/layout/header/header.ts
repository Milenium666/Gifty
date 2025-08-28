import {
  Component,
  inject,
  HostListener,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton } from '@taiga-ui/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TuiButton],
  templateUrl: './header.html',
  styleUrl: './header.less',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() compact = false;
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user$: Observable<User | null> = this.auth.user$;
  protected isUserMenuOpen = false;

  hideGiftLink = false;

  isCatalog = false;

  currentUser: User | null = null;

  get isLikes(): boolean {
    return this.router.url.startsWith('/likes');
  }

  private routerSub?: Subscription;

  logout() {
    this.auth.signOut();
  }

  ngOnInit(): void {
    this.hideGiftLink = this.router.url.startsWith('/catalog');
    this.isCatalog = this.router.url.startsWith('/catalog');
    this.routerSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((ev: NavigationEnd) => {
        this.hideGiftLink = ev.urlAfterRedirects.startsWith('/catalog');
        this.isCatalog = ev.urlAfterRedirects.startsWith('/catalog');
      });
    this.auth.user$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.isUserMenuOpen = false;
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.className = 'user-menu__avatar-placeholder';
    const name = this.currentUser?.displayName || this.currentUser?.email || 'U';
    placeholder.textContent = name.charAt(0).toUpperCase();
    img.parentElement?.appendChild(placeholder);
  }
}
