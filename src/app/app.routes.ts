import { Routes } from '@angular/router';
import { FavoritesComponent } from './favorites/favorites.component';
import { PhotoDetailComponent } from './photo-detail/photo-detail.component';
import { PhotoStreamComponent } from './photo-stream/photo-stream.component';

export const routes: Routes = [
  { path: '', component: PhotoStreamComponent, title: 'Discover — Stillroom' },
  { path: 'favorites', component: FavoritesComponent, title: 'Your favorites — Stillroom' },
  { path: 'photos/:id', component: PhotoDetailComponent, title: 'A closer look — Stillroom' },
  { path: '**', redirectTo: '' },
];
