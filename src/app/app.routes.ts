import { Routes } from '@angular/router';
import { HomePage } from './modules/home/components/home';
import { GiftsPage } from './modules/catalog/components/gift-list/gift-list';
import { GiftPage } from './modules/catalog/components/gift-detail/gift-detail';
import { FavoritesPage } from './modules/likes/components/favorites';
import { AuthPage } from './modules/auth/components/auth';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'catalog', component: GiftsPage },
  { path: 'catalog/:id', component: GiftPage },
  { path: 'likes', component: FavoritesPage },
  { path: 'auth', component: AuthPage },
];
