import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton } from '@taiga-ui/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { take } from 'rxjs';
import { FirebaseError } from '@angular/fire/app';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TuiButton],
  templateUrl: './auth.html',
  styleUrls: ['./auth.less']
})

export class AuthPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  
  loginForm: FormGroup;
  signupForm: FormGroup;
  isLoading = false;
  isSignUp = false;
  errorMessage = '';
  
  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  toggleMode() {
    this.isSignUp = !this.isSignUp;
    this.errorMessage = '';
    this.loginForm.reset();
    this.signupForm.reset();
  }

  ngOnInit() {
    this.auth.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        const url = this.router.parseUrl(this.router.url);
        const returnUrl = (url.queryParams['returnUrl'] as string) || '/';
        const giftId = url.queryParams['giftId'] as string | undefined;
        if (giftId) {
          this.router.navigateByUrl(this.router.createUrlTree([returnUrl], { queryParams: { giftId } }));
        } else {
          this.router.navigateByUrl(returnUrl);
        }
      }
    });
  }
  
  async signInWithEmail() {
    if (this.loginForm.valid) {
      try {
        this.isLoading = true;
        this.errorMessage = '';
        const { email, password } = this.loginForm.value;
        await this.auth.signInWithEmail(email, password);
        const url = this.router.parseUrl(this.router.url);
        const returnUrl = (url.queryParams['returnUrl'] as string) || '/';
        const giftId = url.queryParams['giftId'] as string | undefined;
        if (giftId) {
          this.router.navigateByUrl(this.router.createUrlTree([returnUrl], { queryParams: { giftId } }));
        } else {
          this.router.navigateByUrl(returnUrl);
        }
      } catch (error: unknown) {
        console.error('Email sign in error:', error);
        if (error instanceof FirebaseError) {
          this.errorMessage = this.getErrorMessage(error.code);
        } else {
          this.errorMessage = 'Произошла неизвестная ошибка';
        }
      } finally {
        this.isLoading = false;
      }
    }
  }

  async signUpWithEmail() {
    if (this.signupForm.valid) {
      try {
        this.isLoading = true;
        this.errorMessage = '';
        const { email, password } = this.signupForm.value;
        await this.auth.signUpWithEmail(email, password);
        const url = this.router.parseUrl(this.router.url);
        const returnUrl = (url.queryParams['returnUrl'] as string) || '/';
        const giftId = url.queryParams['giftId'] as string | undefined;
        if (giftId) {
          this.router.navigateByUrl(this.router.createUrlTree([returnUrl], { queryParams: { giftId } }));
        } else {
          this.router.navigateByUrl(returnUrl);
        }
      } catch (error: unknown) {
        console.error('Email sign up error:', error);
        if (error instanceof FirebaseError) {
          this.errorMessage = this.getErrorMessage(error.code);
        } else {
          this.errorMessage = 'Произошла неизвестная ошибка';
        }
      } finally {
        this.isLoading = false;
      }
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Пользователь с таким email не найден';
      case 'auth/wrong-password':
        return 'Неверный пароль';
      case 'auth/email-already-in-use':
        return 'Пользователь с таким email уже существует';
      case 'auth/weak-password':
        return 'Пароль слишком слабый';
      case 'auth/invalid-email':
        return 'Некорректный email';
      case 'auth/too-many-requests':
        return 'Слишком много попыток входа. Попробуйте позже';
      default:
        return 'Произошла ошибка при входе в систему';
    }
  }
}
