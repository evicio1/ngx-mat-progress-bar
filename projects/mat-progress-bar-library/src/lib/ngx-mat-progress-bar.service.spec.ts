import { TestBed } from '@angular/core/testing';
import { NgxMatProgressBarService } from './ngx-mat-progress-bar.service';

describe('NgxMatProgressBarService', () => {
  let service: NgxMatProgressBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxMatProgressBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start progress bar', () => {
    service.start();
    expect(service.isVisible()).toBe(true);
    expect(service.isLoading()).toBe(true);
  });

  it('should complete progress bar', () => {
    service.start();
    service.complete();
    
    // Should still be visible initially with 100% progress
    const config = service.getConfig();
    expect(config.mode).toBe('determinate');
    expect(config.value).toBe(100);
  });

  it('should set progress value', () => {
    service.set(50);
    const config = service.getConfig();
    expect(config.mode).toBe('determinate');
    expect(config.value).toBe(50);
    expect(service.isVisible()).toBe(true);
  });

  it('should increment progress value', () => {
    service.set(50);
    service.inc(10);
    const config = service.getConfig();
    expect(config.value).toBe(60);
  });

  it('should reset progress bar', () => {
    service.start();
    service.reset();
    expect(service.isVisible()).toBe(false);
    expect(service.isLoading()).toBe(false);
  });

  it('should update configuration', () => {
    service.updateConfig({
      color: 'accent',
      mode: 'buffer',
      value: 50
    });
    
    const config = service.config();
    expect(config.color).toBe('accent');
    expect(config.mode).toBe('buffer');
    expect(config.value).toBe(50);
  });

  it('should handle multiple requests correctly', () => {
    service.start(); // First request
    service.start(); // Second request
    
    expect(service.isLoading()).toBe(true);
    
    service.complete(); // Complete first request
    expect(service.isLoading()).toBe(true); // Still loading due to second request
    
    service.complete(); // Complete second request
    // Should complete after delay
  });

  it('should clamp progress values to 0-100 range', () => {
    service.set(-10);
    expect(service.getConfig().value).toBe(0);
    
    service.set(150);
    expect(service.getConfig().value).toBe(100);
  });
});