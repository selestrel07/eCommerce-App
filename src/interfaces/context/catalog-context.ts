import { Category } from '@commercetools/platform-sdk';
import { LevelKeysProps } from '../category/category.ts';
import { QueryParams } from '../query-params/query-params.ts';

export interface CategoryContextType {
  stateOpenKeys: string[];
  setStateOpenKeys: (keys: string[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (keys: string[]) => void;
  getLevelKeys: (items: LevelKeysProps[]) => Record<string, number>;
  handleCategoryMenuClick: (categories: Category[], key: string) => void;
}

export interface CatalogContextType {
  filters: QueryParams;
  setFilters: (queryParams: QueryParams) => void;
}
