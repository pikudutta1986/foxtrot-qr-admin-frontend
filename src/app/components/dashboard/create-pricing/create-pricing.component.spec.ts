import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePricingComponent } from './create-pricing.component';

describe('CreatePricingComponent', () => {
  let component: CreatePricingComponent;
  let fixture: ComponentFixture<CreatePricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePricingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
