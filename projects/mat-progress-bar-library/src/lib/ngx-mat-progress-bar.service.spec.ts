import { TestBed } from '@angular/core/testing';
import { NgxMatProgressBarService } from './ngx-mat-progress-bar.service';
import { provideNgxMatProgressBar } from './ngx-mat-progress-bar.providers';

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
    // isLoading only counts HTTP requests, not manual progress
    expect(service.isLoading()).toBe(false);
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
    jasmine.clock().install();
    jasmine.clock().mockDate();

    service.startHttp(); // First request
    service.startHttp(); // Second request
    
    expect(service.isLoading()).toBe(true);
    expect(service.activeRequests()).toBe(2);
    
    service.completeHttp(); // Complete first request
    expect(service.isLoading()).toBe(true); // Still loading due to second request
    
    service.completeHttp(); // Complete second request
    expect(service.isLoading()).toBe(false);
    expect(service.isVisible()).toBe(true); // Stays up for minDisplayTime + hideDelay

    jasmine.clock().tick(500);
    expect(service.isVisible()).toBe(false);

    jasmine.clock().uninstall();
  });

  it('should clamp progress values to 0-100 range', () => {
    service.set(-10);
    expect(service.getConfig().value).toBe(0);
    
    service.set(150);
    expect(service.getConfig().value).toBe(100);
  });
});

describe('NgxMatProgressBarService with provideNgxMatProgressBar', () => {
  it('should apply the provided UI configuration and options', () => {
    TestBed.configureTestingModule({
      providers: [provideNgxMatProgressBar({ color: 'warn', mode: 'buffer', value: 40, bufferValue: 60, hideDelay: 50 })]
    });
    const service = TestBed.inject(NgxMatProgressBarService);

    expect(service.getConfig()).toEqual({ color: 'warn', mode: 'buffer', value: 40, bufferValue: 60, visible: false });
    expect(service.getOptions().hideDelay).toBe(50);
  });

  it('should keep the defaults for settings that are not provided', () => {
    TestBed.configureTestingModule({
      providers: [provideNgxMatProgressBar({ visible: true })]
    });
    const service = TestBed.inject(NgxMatProgressBarService);

    expect(service.getConfig()).toEqual({ color: 'primary', mode: 'indeterminate', value: 0, bufferValue: 0, visible: true });
    expect(service.getOptions().hideDelay).toBe(300);
  });
});