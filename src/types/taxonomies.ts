export interface TaxonomyDto {
  id: string;
  name: string;
  slug: string;
  taxonomyName: string;
  description?: string;
  count?: number;
  parent?: number;
  meta?: Record<string, unknown>;
  source?: string;
}

