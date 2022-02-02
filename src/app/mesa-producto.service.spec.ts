import { TestBed } from '@angular/core/testing';

import { MesaProductoService } from './mesa-producto.service';

describe('MesaProductoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MesaProductoService = TestBed.get(MesaProductoService);
    expect(service).toBeTruthy();
  });
});
