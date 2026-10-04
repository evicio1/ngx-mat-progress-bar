import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxMatProgressBarComponent } from './ngx-mat-progress-bar.component';
import { NgxMatProgressBarService } from './ngx-mat-progress-bar.service';
import { provideNgxMatProgressBar } from './ngx-mat-progress-bar.providers';

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
    jasmine.clock().install();

    service.start();
    service.complete();
    fixture.detectChanges();
    expect(service.config().value).toBe(100);

    // Hidden once the completion animation has had time to show
    jasmine.clock().tick(300);
    fixture.detectChanges();
    
    const config = service.config();
    expect(config.visible).toBe(false);
    expect(fixture.nativeElement.querySelector('mat-progress-bar')).toBeNull();

    jasmine.clock().uninstall();
  });

  it('should apply a bound color and follow later changes', () => {
    service.start();
    fixture.componentRef.setInput('color', 'accent');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-progress-bar').classList).toContain('mat-accent');

    fixture.componentRef.setInput('color', 'warn');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-progress-bar').classList).toContain('mat-warn');
  });
});

describe('NgxMatProgressBarComponent with provideNgxMatProgressBar', () => {
  it('should use the provided color when none is bound', () => {
    TestBed.configureTestingModule({
      imports: [NgxMatProgressBarComponent],
      providers: [provideNgxMatProgressBar({ color: 'warn' })]
    });
    const fixture = TestBed.createComponent(NgxMatProgressBarComponent);
    TestBed.inject(NgxMatProgressBarService).start();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('mat-progress-bar').classList).toContain('mat-warn');
  });
});