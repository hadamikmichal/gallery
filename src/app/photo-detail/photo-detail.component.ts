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
  templateUrl: './photo-detail.component.html',
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
