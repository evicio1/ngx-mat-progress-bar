import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  template: `
    <mat-card class="page-card">
      <mat-card-header>
        <mat-card-title>Home Page</mat-card-title>
        <mat-card-subtitle>Welcome to the progress bar demo</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <p>This is the home page. Navigate to other pages to test router progress tracking.</p>
        
        <div class="nav-buttons">
          <button mat-raised-button color="primary" routerLink="/about">Go to About</button>
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
  `]
})
export class HomeComponent {}