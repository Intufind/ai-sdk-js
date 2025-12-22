import type { ApiResponse, ColorSchemeRequest, ColorSchemeResponse } from '../types';
import { BaseService } from './BaseService';

export class ConfigService extends BaseService {
  async generateColorScheme(primaryColor: string, secondaryColor?: string): Promise<ApiResponse<ColorSchemeResponse>> {
    const request: ColorSchemeRequest = {
      primaryColor,
      ...(secondaryColor && { secondaryColor }),
    };
    return this.http.post('/config/color-scheme', request);
  }
}
