import { LevelKeysProps, CatalogContextType, CategoryContextType } from '@interfaces';
import { createContext, FC, ReactNode, useState } from 'react';
import { Category } from '@commercetools/platform-sdk';

export const CategoryContext = createContext<CategoryContextType | null>(null);

export const CatalogContext = createContext<CatalogContextType | null>(null);

export const CategoryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const getLevelKeys = (items1: LevelKeysProps[]) => {
    const key: Record<string, number> = {};
    const composeLevelKeys = (items2: LevelKeysProps[], level = 1) => {
      if (items2) {
        items2.forEach((item) => {
          if (item.key) {
            key[item.key] = level;
          }
          if (item.children) {
            composeLevelKeys(item.children, level + 1);
          }
        });
      }
    };
    composeLevelKeys(items1);
    return key;
  };

  const handleCategoryMenuClick = (categories: Category[], key: string): void => {
    const category = categories.find((category) => category.name['en-US'] === key);
    if (category?.parent) {
      const keyIndex = selectedCategories.indexOf(key);
      if (keyIndex !== -1) {
        setSelectedCategories(selectedCategories.splice(0, keyIndex));
      } else if (selectedCategories.length > 1) {
        setSelectedCategories([selectedCategories[0], key]);
      } else {
        setSelectedCategories([...selectedCategories, key]);
      }
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        stateOpenKeys,
        setStateOpenKeys,
        selectedCategories,
        setSelectedCategories,
        getLevelKeys,
        handleCategoryMenuClick,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
