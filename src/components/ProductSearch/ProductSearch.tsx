import { Input } from 'antd';
import './ProductSearch.scss';
import { ProductSearchProps } from '../../interfaces/product/product';

const { Search } = Input;

export const ProductSearch = ({
  onSearch,
  placeholder = 'Search for products...',
  defaultValue = '',
}: ProductSearchProps) => {
  return (
    <div className="product-search">
      <Search
        placeholder={placeholder}
        enterButton="Search"
        size="large"
        defaultValue={defaultValue}
        onSearch={onSearch}
        allowClear
        className="product-search-input"
      />
    </div>
  );
};
