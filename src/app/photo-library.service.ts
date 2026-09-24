import { Injectable, signal } from '@angular/core';
import { Photo } from './photo.model';

const FAVORITES_KEY = 'stillroom:favorites';

@Injectable({ providedIn: 'root' })
export class PhotoLibraryService {
  private readonly favoritePhotos = signal<Photo[]>(this.readFavorites());
  readonly favorites = this.favoritePhotos.asReadonly();

  createPhoto(id: number): Photo {
    return {
      id,
      url: `https://picsum.photos/seed/stillroom-${id}/900/1200`,
      alt: `Random photograph ${id}`,
    };
  }

  addFavorite(photo: Photo): void {
    if (this.favoritePhotos().some((favorite) => favorite.id === photo.id)) return;
    this.favoritePhotos.update((favorites) => [photo, ...favorites]);
    this.persist();
  }

  removeFavorite(id: number): void {
    this.favoritePhotos.update((favorites) => favorites.filter((photo) => photo.id !== id));
    this.persist();
  }

  isFavorite(id: number): boolean {
    return this.favoritePhotos().some((photo) => photo.id === id);
  }

  getFavorite(id: number): Photo | undefined {
    return this.favoritePhotos().find((photo) => photo.id === id);
  }

  private readFavorites(): Photo[] {
    try {
      const saved = globalThis.localStorage?.getItem(FAVORITES_KEY);
      if (!saved) return [];
      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((value): value is Photo => {
        if (typeof value !== 'object' || value === null) return false;
        const candidate = value as Record<string, unknown>;
        return typeof candidate['id'] === 'number' && typeof candidate['url'] === 'string' &&
          typeof candidate['alt'] === 'string';
      });
    } catch {
      return [];
    }
  }

  private persist(): void {
    try {
      globalThis.localStorage?.setItem(FAVORITES_KEY, JSON.stringify(this.favoritePhotos()));
    } catch {
      // Keep the in-memory library usable when browser storage is unavailable.
    }
  }
}
