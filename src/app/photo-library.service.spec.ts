import { TestBed } from '@angular/core/testing';
import { PhotoLibraryService } from './photo-library.service';

describe('PhotoLibraryService', () => {
  let service: PhotoLibraryService;

  beforeEach(() => {
    localStorage.removeItem('stillroom:favorites');
    TestBed.configureTestingModule({ providers: [PhotoLibraryService] });
    service = TestBed.inject(PhotoLibraryService);
  });

  it('creates stable Picsum photo metadata', () => {
    expect(service.createPhoto(42)).toEqual({
      id: 42,
      url: 'https://picsum.photos/seed/stillroom-42/900/1200',
      alt: 'Random photograph 42',
    });
  });

  it('adds favorites once and persists them', () => {
    const photo = service.createPhoto(18);
    service.addFavorite(photo);
    service.addFavorite(photo);

    expect(service.favorites()).toEqual([photo]);
    expect(JSON.parse(localStorage.getItem('stillroom:favorites') ?? '[]')).toEqual([photo]);
    expect(service.isFavorite(18)).toBe(true);
  });

  it('loads persisted favorites after service recreation', () => {
    const photo = service.createPhoto(27);
    service.addFavorite(photo);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [PhotoLibraryService] });

    expect(TestBed.inject(PhotoLibraryService).getFavorite(27)).toEqual(photo);
  });

  it('removes a favorite and updates persisted state', () => {
    const photo = service.createPhoto(5);
    service.addFavorite(photo);
    service.removeFavorite(5);

    expect(service.favorites()).toEqual([]);
    expect(service.isFavorite(5)).toBe(false);
    expect(localStorage.getItem('stillroom:favorites')).toBe('[]');
  });
});
