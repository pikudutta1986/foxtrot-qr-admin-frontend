import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrlistComponent } from './qrlist.component';

describe('QrlistComponent', () => {
  let component: QrlistComponent;
  let fixture: ComponentFixture<QrlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
