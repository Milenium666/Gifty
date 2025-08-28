import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut, 
  user, 
  User 
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);

  readonly user$: Observable<User | null> = user(this.auth);

  signInWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signUpWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signOut() {
    return signOut(this.auth);
  }
}


