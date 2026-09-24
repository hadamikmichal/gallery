import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule],
  template: `
    <div class="app-shell">
      <header class="topbar">
        <a class="wordmark" routerLink="/" aria-label="Stillroom home">
          <span class="wordmark-mark" aria-hidden="true">s.</span>
          <span>stillroom</span>
        </a>
        <nav class="view-switch" aria-label="Photo library views">
          <a mat-button routerLink="/" [routerLinkActiveOptions]="{ exact: true }" routerLinkActive="active" aria-label="Browse photos">Discover</a>
          <a mat-button routerLink="/favorites" [class.active]="router.url.startsWith('/favorites') || router.url.startsWith('/photos/')" aria-label="View favorite photos">Favorites</a>
        </nav>
        <div class="topbar-note"><span class="status-dot"></span> A collection in progress</div>
      </header>
      <main><router-outlet /></main>
      <footer class="site-footer"><span>STILLROOM</span><span>Keep what moves you.</span></footer>
    </div>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent { readonly router = inject(Router); }
