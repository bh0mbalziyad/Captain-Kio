import { TestBed } from '@angular/core/testing';

import { DishesFireServiceService } from './dishes-fire-service.service';

describe('DishesFireServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DishesFireServiceService = TestBed.get(DishesFireServiceService);
    expect(service).toBeTruthy();
  });
});
