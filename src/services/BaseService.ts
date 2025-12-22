import type { HttpClient } from '../http/HttpClient';

export abstract class BaseService {
  constructor(protected http: HttpClient) {}
}
