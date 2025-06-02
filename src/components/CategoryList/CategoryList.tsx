import { Category } from '@commercetools/platform-sdk';
import { Context, FC, use, useEffect, useState } from 'react';
import { loadCategories } from '../../services/api.service.ts';
import { Client } from '@commercetools/sdk-client-v2';
import { Menu, MenuProps } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { LevelKeysProps } from '../../interfaces/category/category.ts';
import { CatalogContext, CategoryContext } from '../../contexts/CatalogContexts.tsx';
import {
  CatalogContextType,
  CategoryContextType,
} from '../../interfaces/context/catalog-context.ts';
import { setCategory } from '../../utils/query-params-builder.ts';

const getCategoryIdByKey = (categories: Category[], key: string): string | undefined => {
  return categories.find((category) => category.name['en-US'] === key)?.id;
};

export const CategoryList: FC<{
  client: Client;
}> = ({ client }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<ItemType[] | undefined>([]);
  const {
    stateOpenKeys,
    setStateOpenKeys,
    selectedCategories,
    setSelectedCategories,
    getLevelKeys,
    handleCategoryMenuClick,
  } = use(CategoryContext as Context<CategoryContextType>);
  const { filters, setFilters } = use(CatalogContext as Context<CatalogContextType>);

  const levelKeys = getLevelKeys(items as LevelKeysProps[]);

  const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
    const currentOpenKey = openKeys.find((key) => !stateOpenKeys.includes(key));
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        openKeys
          .filter((_, index) => index !== repeatIndex)
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
      setSelectedCategories([currentOpenKey]);
    } else {
      setSelectedCategories([]);
      setStateOpenKeys(openKeys);
    }
  };

  useEffect(() => {
    loadCategories(client)
      .then((result) => {
        setCategories(result.body.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [client]);

  useEffect(() => {
    setItems(categoriesMenuItems(getCategoriesByAncestor()));
    const category = getCategoryIdByKey(
      categories,
      selectedCategories[selectedCategories.length - 1]
    );
    setFilters(setCategory(filters, category));
  }, [selectedCategories, categories]);

  const getCategoriesByAncestor = (value?: string) => {
    return categories.filter((category) =>
      value ? category.parent?.id === value : category.ancestors.length === 0
    );
  };

  const categoriesMenuItems = (categoryList: Category[]): ItemType[] | undefined => {
    const categoryItems = categoryList
      ? categoryList.map((item): Required<MenuProps>['items'][number] => {
          const categoryName = item.name['en-US'];
          return {
            key: categoryName,
            label: categoryName,
            onClick: () => {
              handleCategoryMenuClick(categories, categoryName);
            },
            children: categoriesMenuItems(getCategoriesByAncestor(item.id)),
          };
        })
      : undefined;
    return categoryItems && categoryItems.length > 0 ? categoryItems : undefined;
  };

  return (
    <div className="category-list">
      <h2>Categories: </h2>
      <Menu
        mode="inline"
        items={items}
        onOpenChange={onOpenChange}
        openKeys={stateOpenKeys}
        selectedKeys={selectedCategories}
      />
    </div>
  );
};
