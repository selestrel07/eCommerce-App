import { QueryParams } from '@interfaces';

const FILTER_QUERY = 'filter.query';
const CATEGORIES_ID = 'categories.id';

export const setCategory = (paramsObject: QueryParams, category?: string): QueryParams => {
  const newParamsObject = JSON.parse(JSON.stringify(paramsObject)) as QueryParams;
  const filters = paramsObject[FILTER_QUERY]
    ? paramsObject[FILTER_QUERY].filter((filter: string) => !filter.includes(CATEGORIES_ID))
    : [];
  if (category) {
    filters.push(`${CATEGORIES_ID}:"${category}"`);
  }
  newParamsObject[FILTER_QUERY] = filters;
  return newParamsObject;
};
