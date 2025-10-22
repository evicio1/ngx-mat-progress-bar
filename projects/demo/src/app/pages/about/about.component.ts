import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  template: `
    <mat-card class="page-card">
      <mat-card-header>
        <mat-card-title>About Page</mat-card-title>
        <mat-card-subtitle>Learn about this demo</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <p>This demo showcases a modern Angular progress bar library with:</p>
        <ul>
          <li>HTTP request tracking</li>
          <li>Router navigation tracking</li>
          <li>Manual progress control</li>
          <li>Signal-based reactive state</li>
        </ul>
        
        <div class="nav-buttons">
          <button mat-raised-button color="primary" routerLink="/home">Go to Home</button>
          <button mat-raised-button color="accent" routerLink="/contact">Go to Contact</button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-card {
      margin: 2rem auto;
      max-width: 600px;
    }
    
    .nav-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .nav-buttons button {
      flex: 1;
    }
    
    ul {
      margin: 1rem 0;
    }
    
    li {
      margin: 0.5rem 0;
    }
  `]
})
export class AboutComponent {}