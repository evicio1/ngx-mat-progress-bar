import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxMatProgressBarComponent } from './ngx-mat-progress-bar.component';
import { NgxMatProgressBarService } from './ngx-mat-progress-bar.service';

describe('NgxMatProgressBarComponent', () => {
  let component: NgxMatProgressBarComponent;
  let fixture: ComponentFixture<NgxMatProgressBarComponent>;
  let service: NgxMatProgressBarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMatProgressBarComponent, MatProgressBarModule],
      providers: [NgxMatProgressBarService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxMatProgressBarComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(NgxMatProgressBarService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start progress on service call', () => {
    service.start();
    fixture.detectChanges();
    
    const config = service.config();
    expect(config.visible).toBe(true);
    expect(config.mode).toBe('indeterminate');
  });

  it('should set progress value', () => {
    service.set(75);
    fixture.detectChanges();
    
    const config = service.config();
    expect(config.visible).toBe(true);
    expect(config.mode).toBe('determinate');
    expect(config.value).toBe(75);
  });

  it('should complete and hide progress', () => {
    service.start();
    service.complete();
    fixture.detectChanges();
    
    const config = service.config();
    expect(config.visible).toBe(false);
  });
});