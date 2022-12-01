import { CanActivate } from '@nestjs/common';

export const MOCK_STRING = 'mock';

export const MOCK_BEERER_TOKEN = { Authorization: 'Beerer mock' };

export const MOCK_GUARD: CanActivate = { canActivate: jest.fn(() => true) };
