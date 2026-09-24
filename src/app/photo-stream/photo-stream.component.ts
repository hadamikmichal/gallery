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
  templateUrl: './photo-stream.component.html',
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
