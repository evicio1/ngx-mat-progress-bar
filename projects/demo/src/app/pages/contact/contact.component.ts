import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  template: `
    <mat-card class="page-card">
      <mat-card-header>
        <mat-card-title>Contact Page</mat-card-title>
        <mat-card-subtitle>Test HTTP requests from this page</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <p>This page includes HTTP request testing to verify interceptor functionality.</p>
        
        <div class="action-buttons">
          <button mat-raised-button color="primary" (click)="makeHttpRequest()">
            Make HTTP Request
          </button>
          <button mat-raised-button color="accent" (click)="makeSlowRequest()">
            Make Slow Request (3s)
          </button>
        </div>
        
        <div class="nav-buttons">
          <button mat-raised-button color="primary" routerLink="/home">Go to Home</button>
          <button mat-raised-button color="accent" routerLink="/about">Go to About</button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-card {
      margin: 2rem auto;
      max-width: 600px;
    }
    
    .action-buttons, .nav-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .action-buttons button, .nav-buttons button {
      flex: 1;
    }
    
    .nav-buttons {
      margin-top: 2rem;
      border-top: 1px solid #eee;
      padding-top: 1rem;
    }
  `]
})
export class ContactComponent {
  constructor(private http: HttpClient) {}
  
  makeHttpRequest(): void {
    this.http.get('https://jsonplaceholder.typicode.com/posts/1')
      .subscribe({
        next: (data) => console.log('Fast HTTP request completed:', data),
        error: (err) => console.error('HTTP request failed:', err)
      });
  }
  
  makeSlowRequest(): void {
    // Simulate a slow request with delay
    this.http.get('https://httpbin.org/delay/3')
      .subscribe({
        next: (data) => console.log('Slow HTTP request completed:', data),
        error: (err) => console.error('Slow HTTP request failed:', err)
      });
  }
}