import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Photo } from '../photo.model';
import { PhotoLibraryService } from '../photo-library.service';

@Component({
  selector: 'app-photo-stream',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <section class="page-intro">
      <p class="eyebrow">THE DAILY EDIT <span>·</span> NO. 001</p>
      <div class="intro-line">
        <div><h1>Find a little <em>inspiration.</em></h1><p class="subtitle">A never-ending collection of moments, places, and things worth keeping.</p></div>
        <p class="photo-count"><span>{{ photos().length }}</span> moments<br>and counting</p>
      </div>
    </section>
    <section class="photo-grid" aria-label="Random photo stream">
      @for (photo of photos(); track photo.id; let index = $index) {
        <article class="photo-card" [class.tall]="index % 5 === 1 || index % 5 === 4">
          <button class="photo-action" type="button" (click)="save(photo)" [attr.aria-label]="savedIds().has(photo.id) ? 'Saved to favorites' : 'Add photo to favorites'">
            <img [src]="photo.url" [alt]="photo.alt" loading="lazy" (error)="markImageUnavailable(photo.id)">
            <span class="image-shade"></span>
            <span class="save-chip" [class.saved]="savedIds().has(photo.id)"><mat-icon>{{ savedIds().has(photo.id) ? 'favorite' : 'add' }}</mat-icon>{{ savedIds().has(photo.id) ? 'Saved' : 'Keep this' }}</span>
            <span class="photo-index">{{ (index + 1).toString().padStart(2, '0') }}</span>
          </button>
        </article>
      }
    </section>
    <div class="loader-area" #sentinel aria-live="polite">
      @if (loading()) { <mat-spinner diameter="27" aria-label="Loading more photos" /><span>Finding more to love</span> }
      @else { <span class="end-mark">✳</span><span>There’s always more to discover</span> }
    </div>
  `,
  styleUrl: './photo-stream.component.scss',
})
export class PhotoStreamComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sentinel') private sentinel?: ElementRef<HTMLElement>;
  readonly photos = signal<Photo[]>([]);
  readonly loading = signal(false);
  readonly savedIds = signal(new Set<number>());
  private observer?: IntersectionObserver;

  constructor(private readonly library: PhotoLibraryService) { this.loadMore(); }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) this.loadMore();
    }, { rootMargin: '500px 0px' });
    if (this.sentinel) this.observer.observe(this.sentinel.nativeElement);
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }

  save(photo: Photo): void {
    this.library.addFavorite(photo);
    this.savedIds.update((ids) => new Set(ids).add(photo.id));
  }

  markImageUnavailable(id: number): void {
    // Picsum occasionally has unavailable IDs; selecting a new valid image keeps the stream flowing.
    const replacement = this.library.createPhoto(Math.floor(Math.random() * 1_000_000_000));
    this.photos.update((photos) => photos.map((photo) => photo.id === id ? replacement : photo));
  }

  private loadMore(): void {
    if (this.loading()) return;
    this.loading.set(true);
    const delay = 200 + Math.floor(Math.random() * 101);
    window.setTimeout(() => {
      const batch = Array.from({ length: 12 }, () => this.library.createPhoto(Math.floor(Math.random() * 1_000_000_000)));
      this.photos.update((photos) => [...photos, ...batch]);
      this.loading.set(false);
    }, delay);
  }
}
