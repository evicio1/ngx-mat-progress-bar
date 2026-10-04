import { Component, Input, OnInit, ChangeDetectionStrategy, computed, effect } from '@angular/core';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxMatProgressBarService, NgxMatProgressBarConfig, ThemePalette } from './ngx-mat-progress-bar.service';

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
export class NgxMatProgressBarComponent implements OnInit {
  @Input() color: ThemePalette = 'primary';

  // Signal-based configuration
  protected readonly config = computed(() => this.progressBarService.config());

  constructor(private progressBarService: NgxMatProgressBarService) {
    // Effect to update service config when input changes
    effect(() => {
      if (this.color) {
        this.progressBarService.updateConfig({ color: this.color });
      }
    });
  }

  ngOnInit(): void {
    // Apply input values to service config
    this.progressBarService.updateConfig({
      color: this.color
    });
  }
}