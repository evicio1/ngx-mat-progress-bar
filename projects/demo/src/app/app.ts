import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgxMatProgressBarComponent, NgxMatProgressBarService } from 'mat-progress-bar-library';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, MatButtonModule, MatCardModule, NgxMatProgressBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('NgxMatProgressBar Demo - Signals & Modern Angular');
  
  // Signal to track demo state
  private readonly _isWorking = signal(false);
  protected readonly isWorking = this._isWorking.asReadonly();
  
  // Computed signal for button states
  protected readonly buttonState = computed(() => ({
    disabled: this.isWorking(),
    text: this.isWorking() ? 'Working...' : 'Start Work'
  }));

  // Make progressBar service public for template access
  constructor(
    public progressBar: NgxMatProgressBarService,
    private http: HttpClient
  ) {
    // Example: Configure progress bar options for this demo
    this.progressBar.configureOptions({
      hideDelay: 500, // Wait 500ms before hiding (instead of default 300ms)
      minDisplayTime: 300, // Show for at least 300ms (instead of default 200ms)
      enableSmartBatching: true, // Enable smart batching for HTTP requests
      enableDebugLogs: true // Enable debug logs to see what's happening
    });
    
    console.log('Progress bar configured with custom options:', this.progressBar.getOptions());
  }

  startProgress(): void {
    this.progressBar.start();
  }

  setProgress(value: number): void {
    this.progressBar.set(value);
  }

  completeProgress(): void {
    this.progressBar.complete();
  }

  resetProgress(): void {
    this.progressBar.reset();
  }

  async simulateWork(): Promise<void> {
    this._isWorking.set(true);
    
    try {
      console.log('Starting work simulation...');
      
      // Reset any existing state and start fresh
      this.progressBar.reset();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Start manual progress
      this.progressBar.start();
      console.log('Started:', this.progressBar.getDebugState());
      
      // Simulate work with progress updates every 300ms
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        this.progressBar.set(i);
        console.log(`Progress ${i}%:`, this.progressBar.getDebugState());
      }
      
      // Small delay before completion
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Complete the work
      this.progressBar.complete();
      console.log('Completed:', this.progressBar.getDebugState());
      
    } catch (error) {
      console.error('Error during work simulation:', error);
      this.progressBar.reset();
    } finally {
      this._isWorking.set(false);
    }
  }

  simulateHttpRequest(): void {
    // Make a real HTTP request to test the interceptor
    console.log('Starting HTTP request...');
    this.http.get('https://jsonplaceholder.typicode.com/posts/1')
      .subscribe({
        next: (data) => console.log('HTTP request completed:', data),
        error: (err) => console.error('HTTP request failed:', err)
      });
  }

  simulateMultipleHttpRequests(): void {
    // Simulate multiple rapid HTTP requests like when loading a page
    console.log('Starting multiple HTTP requests (simulating page load)...');
    
    // Request 1: User data
    this.http.get('https://jsonplaceholder.typicode.com/users/1')
      .subscribe({
        next: (data) => console.log('User data loaded:', data),
        error: (err) => console.error('User request failed:', err)
      });
    
    // Request 2: Posts (slight delay)
    setTimeout(() => {
      this.http.get('https://jsonplaceholder.typicode.com/posts?userId=1')
        .subscribe({
          next: (data) => console.log('Posts loaded:', data),
          error: (err) => console.error('Posts request failed:', err)
        });
    }, 100);
    
    // Request 3: Comments (another delay)
    setTimeout(() => {
      this.http.get('https://jsonplaceholder.typicode.com/comments?postId=1')
        .subscribe({
          next: (data) => console.log('Comments loaded:', data),
          error: (err) => console.error('Comments request failed:', err)
        });
    }, 200);
    
    // Request 4: Albums (final request)
    setTimeout(() => {
      this.http.get('https://jsonplaceholder.typicode.com/albums?userId=1')
        .subscribe({
          next: (data) => console.log('Albums loaded:', data),
          error: (err) => console.error('Albums request failed:', err)
        });
    }, 50);
    
    console.log('All HTTP requests initiated - watch for smooth progress bar');
  }

  testRouterWithManualProgress(): void {
    // Start manual progress at 50% then navigate to test router override
    console.log('Testing router override of manual progress...');
    this.progressBar.start();
    this.progressBar.set(50);
    
    setTimeout(() => {
      console.log('Manual progress at 50%, now navigating...');
      // Navigation will be triggered by user clicking links
    }, 1000);
  }

  testConfiguration(): void {
    // Test different configuration options
    console.log('Testing different configuration options...');
    
    // Configure for very slow hiding (2 seconds delay)
    this.progressBar.configureOptions({
      hideDelay: 2000,
      minDisplayTime: 500,
      enableDebugLogs: true
    });
    
    console.log('New configuration applied:', this.progressBar.getOptions());
    
    // Start an HTTP request to see the slow hiding effect
    this.http.get('https://jsonplaceholder.typicode.com/posts/1')
      .subscribe({
        next: (data) => console.log('HTTP completed - should hide slowly:', data),
        error: (err) => console.error('HTTP failed:', err)
      });
  }
}
