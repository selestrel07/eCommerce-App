import { Context, FC, ReactElement, use, useEffect, useState } from 'react';
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { CategoryContext } from '../../contexts/CatalogContexts.tsx';
import { Breadcrumb } from 'antd';
import { CategoryContextType } from '../../interfaces/context/catalog-context.ts';

const convertSelectedCategoriesToBreadcrumbs = (
  selectedCategories: string[],
  setSelectedCategories: (categories: string[]) => void
) => {
  return selectedCategories.map((category) => {
    return {
      key: category,
      title: category,
      onClick: () =>
        setSelectedCategories(
          selectedCategories.slice(0, selectedCategories.indexOf(category) + 1)
        ),
    };
  });
};

export const CatalogBreadcrumbs: FC = (): ReactElement => {
  const initialBreadcrumbs: BreadcrumbItemType = {
    key: 'products',
    title: 'All Products',
    onClick: () => {
      setSelectedCategories([]);
      setStateOpenKeys([]);
    },
  };
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItemType[]>([initialBreadcrumbs]);
  const { setStateOpenKeys, selectedCategories, setSelectedCategories } = use(
    CategoryContext as Context<CategoryContextType>
  );

  useEffect(() => {
    setBreadcrumbs([
      initialBreadcrumbs,
      ...convertSelectedCategoriesToBreadcrumbs(selectedCategories, setSelectedCategories),
    ]);
  }, [selectedCategories]);

  return <Breadcrumb items={breadcrumbs}></Breadcrumb>;
};
