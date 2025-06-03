/* eslint-disable max-lines-per-function */
import { ReactElement, useEffect, useState } from 'react';
import { Client } from '@commercetools/sdk-client-v2';
import { loadProducts } from '../../services/api.service';
import './Catalog.scss';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { Input, Select, Button } from 'antd';
import { CategoryList } from '../../components/CategoryList/CategoryList.tsx';
import { CatalogContext, CategoryProvider } from '../../contexts/CatalogContexts.tsx';
import { CatalogBreadcrumbs } from '../../components/CatalogBreadcrumbs/CatalogBreadcrumbs.tsx';
import { ProductVariantWithPriceAndName } from '../../interfaces/product/product.ts';
import { getVariants } from '../../utils/map-product.ts';
import { QueryParams } from '../../interfaces/query-params/query-params.ts';

const { Search } = Input;
const { Option } = Select;

export default function Catalog({ apiClient }: { apiClient: Client }): ReactElement {
  const [products, setProducts] = useState<ProductVariantWithPriceAndName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<QueryParams>({});
  const [sortOption, setSortOption] = useState<string>('');

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const productList = await loadProducts(
          apiClient,
          'EUR',
          filters,
          undefined,
          undefined,
          undefined,
          sortOption,
          filters['filter.query'],
          searchQuery
        );
        setProducts(getVariants(productList, filters));
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, [apiClient, sortOption, searchQuery, filters]);

  const handleColorChange = (value: string) => {
    setFilters((prev) => ({ ...prev, color: value }));
  };

  const handleSexChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sex: value }));
  };

  const resetFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <CatalogContext
      value={{
        filters,
        setFilters,
      }}
    >
      <CategoryProvider>
        <div className="catalog-container">
          <CategoryList client={apiClient} />
          <div className="catalog-products">
            <CatalogBreadcrumbs />
            <div className="product-list">
              <h1 className="catalog-title">Product List</h1>
              <div className="sort-container">
                <p className="sort-text">Sort by:</p>
                <Select<string>
                  className="catalog-sort"
                  value={sortOption}
                  onChange={handleSortChange}
                  placeholder="Sort by:"
                >
                  <Option value="">Default</Option>
                  <Option value="price asc">Price: Low to High</Option>
                  <Option value="price desc">Price: High to Low</Option>
                  <Option value="name.en-US asc">Name: A-Z</Option>
                  <Option value="name.en-US desc">Name: Z-A</Option>
                </Select>
              </div>

              <div className="catalog-search">
                <Search
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  enterButton
                  size="large"
                  loading={loading}
                />
              </div>

              <div className="catalog-filters">
                <h3>Filters</h3>

                <div className="catalog-filters-row">
                  <div>
                    <label>Color:</label>
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Choose a color"
                      onChange={handleColorChange}
                      value={filters.color}
                      allowClear
                    >
                      <Option value="red">Red</Option>
                      <Option value="white">White</Option>
                      <Option value="orange">Orange</Option>
                      <Option value="denim">Denim</Option>
                      <Option value="yellow">Yellow</Option>
                      <Option value="brown">Brown</Option>
                      <Option value="pink">Pink</Option>
                      <Option value="green">Green</Option>
                      <Option value="black">Black</Option>
                    </Select>
                  </div>

                  <div>
                    <label>Gender:</label>
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Choose gender"
                      onChange={handleSexChange}
                      value={filters.sex}
                      allowClear
                    >
                      <Option value="men">Male</Option>
                      <Option value="women">Female</Option>
                      <Option value="unisex">Unisex</Option>
                    </Select>
                  </div>
                </div>

                <Button type="default" onClick={resetFilters} block style={{ marginTop: '16px' }}>
                  Reset Filters
                </Button>
              </div>

              {loading ? (
                <div className="catalog-container">
                  <h2>Loading products...</h2>
                  <p>Please wait</p>
                </div>
              ) : error ? (
                <div className="catalog-container">
                  <div className="catalog-error">
                    <h2>Error</h2>
                    <p>{error}</p>
                  </div>
                </div>
              ) : products.length === 0 ? (
                <p className="catalog-empty-text">No product variations found.</p>
              ) : (
                <div className="catalog-grid">
                  {products.map((variant) => {
                    const productName = Object.values(variant.productName)[0] || 'Unnamed Product';
                    const productKey = variant.key ?? `variant-${variant.id}`;

                    return <ProductCard key={productKey} variant={variant} name={productName} />;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </CategoryProvider>
    </CatalogContext>
  );
}
