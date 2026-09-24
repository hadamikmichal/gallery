import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PhotoLibraryService } from '../photo-library.service';

@Component({
  selector: 'app-photo-detail',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <section class="detail-page">
      <a class="back-link" routerLink="/favorites"><mat-icon>arrow_back</mat-icon> Back to your collection</a>
      @if (photo(); as image) {
        <div class="photo-view"><img [src]="image.url" [alt]="image.alt"><div class="photo-caption"><span class="eyebrow">A MOMENT WORTH KEEPING</span><h1>Photo no. {{ image.id }}</h1><button mat-flat-button (click)="remove(image.id)"><mat-icon>favorite</mat-icon>Remove from favorites</button></div></div>
      } @else {
        <div class="missing-photo"><h1>This photo isn’t in your collection.</h1><a mat-button routerLink="/favorites">Return to favorites</a></div>
      }
    </section>
  `,
  styleUrl: './photo-detail.component.scss',
})
export class PhotoDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly library = inject(PhotoLibraryService);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  readonly photo = computed(() => {
    const id = Number(this.params().get('id'));
    return Number.isFinite(id) ? this.library.getFavorite(id) : undefined;
  });

  remove(id: number): void {
    this.library.removeFavorite(id);
    void this.router.navigate(['/favorites']);
  }
}
