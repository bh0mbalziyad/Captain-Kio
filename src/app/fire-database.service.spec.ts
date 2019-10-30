import { TestBed } from '@angular/core/testing';

import { FireDatabaseService } from './fire-database.service';

describe('FireDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FireDatabaseService = TestBed.get(FireDatabaseService);
    expect(service).toBeTruthy();
  });
});
