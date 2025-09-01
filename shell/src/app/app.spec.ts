import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { IndexComponent } from './index/index.component';
import { Router, RouterModule } from '@angular/router';

import { AppComponent } from './appComponent';
describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([{ path: '', component: IndexComponent }]),
        AppComponent,
        IndexComponent,
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);
    fixture.ngZone?.run(() => router.navigate(['']));
    tick();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Welcome shell'
    );
  }));
});
