import { Component, ChangeDetectionStrategy, computed, effect, input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxMatProgressBarService, ThemePalette } from './ngx-mat-progress-bar.service';

@Component({
  selector: 'ngx-mat-progress-bar',
  standalone: true,
  imports: [MatProgressBarModule],
  template: `
    @if (config().visible) {
      <mat-progress-bar
        [color]="config().color"
        [mode]="config().mode || 'indeterminate'"
        [value]="config().value"
        [bufferValue]="config().bufferValue">
      </mat-progress-bar>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxMatProgressBarComponent {
  /** Overrides the color set with provideNgxMatProgressBar(). Leave unbound to keep that color. */
  readonly color = input<ThemePalette>();

  // Signal-based configuration
  protected readonly config = computed(() => this.progressBarService.config());

  constructor(private progressBarService: NgxMatProgressBarService) {
    // Effect to update service config when input changes
    effect(() => {
      const color = this.color();
      if (color) {
        this.progressBarService.updateConfig({ color });
      }
    });
  }
}
