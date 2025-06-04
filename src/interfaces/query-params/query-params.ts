import { QueryParam } from '@commercetools/platform-sdk';

export interface QueryParams {
  markMatchingVariants?: boolean;
  fuzzy?: boolean;
  fuzzyLevel?: number;
  'filter.query'?: string[];
  filter?: string | string[];
  facet?: string | string[];
  'filter.facets'?: string | string[];
  expand?: string | string[];
  sort?: string | string[];
  limit?: number;
  offset?: number;
  staged?: boolean;
  priceCurrency?: string;
  priceCountry?: string;
  priceCustomerGroup?: string;
  priceCustomerGroupAssignments?: string | string[];
  priceChannel?: string;
  localeProjection?: string | string[];
  storeProjection?: string;
  sex?: string;
  color?: string;

  [key: string]: QueryParam;
}
