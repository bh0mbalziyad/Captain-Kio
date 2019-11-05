import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDishesComponent } from './create-dishes.component';

describe('CreateDishesComponent', () => {
  let component: CreateDishesComponent;
  let fixture: ComponentFixture<CreateDishesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDishesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
