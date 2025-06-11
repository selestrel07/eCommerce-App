/* eslint-disable max-lines-per-function */
import { ReactElement, useEffect, useState } from 'react';
import { Client } from '@commercetools/sdk-client-v2';
import { loadProducts } from '@services';
import './Catalog.scss';
import { ProductCard, CategoryList, CatalogBreadcrumbs } from '@components';
import { Input, Select, Button, Pagination, Spin } from 'antd';
import { CatalogContext, CategoryProvider } from '@contexts';
import { ProductVariantWithPriceAndName, QueryParams } from '@interfaces';
import { getVariants } from '@utils';

const { Search } = Input;
const { Option } = Select;

export default function Catalog({ apiClient }: { apiClient: Client }): ReactElement {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<QueryParams>({});
  const [sortOption, setSortOption] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [allVariants, setAllVariants] = useState<ProductVariantWithPriceAndName[]>([]);

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
        const variants = getVariants(productList.results, filters);
        setAllVariants(variants);
        setTotalProducts(variants.length);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, [apiClient, sortOption, searchQuery, filters, pageSize, currentPage]);

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

  const paginatedVariants = allVariants.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
              <div className="catalog-search">
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
                <Search
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  enterButton
                  size="middle"
                  loading={loading}
                />
              </div>

              <div className="catalog-filters">
                <p>Filter by:</p>

                <div className="catalog-filters-row">
                  <div>
                    <label>Color:</label>
                    <Select
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

                <Button type="default" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>

              <div className="page-size-container">
                <p>Page size:</p>
                <Select
                  value={pageSize}
                  onChange={(size) => {
                    setPageSize(() => {
                      setCurrentPage(1);
                      return size;
                    });
                  }}
                  style={{ width: 120, marginLeft: '16px' }}
                >
                  <Select.Option value={4}>4 / page</Select.Option>
                  <Select.Option value={8}>8 / page</Select.Option>
                  <Select.Option value={12}>12 / page</Select.Option>
                </Select>
              </div>

              {loading ? (
                <div className="loading-spinner">
                  <Spin size="large" />
                  <p className="loading-text">Loading products...</p>
                </div>
              ) : error ? (
                <div className="catalog-error">
                  <h2>Error</h2>
                  <p>{error}</p>
                </div>
              ) : allVariants.length === 0 ? (
                <p className="catalog-empty-text">No product variations found.</p>
              ) : (
                <div className="catalog-grid">
                  {paginatedVariants.map((variant) => {
                    const productName = Object.values(variant.productName)[0] || 'Unnamed Product';
                    const productKey = variant.key ?? `variant-${variant.id}`;

                    return <ProductCard key={productKey} variant={variant} name={productName} />;
                  })}
                </div>
              )}
              {!loading && (
                <div className="pagination-controls">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalProducts}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CategoryProvider>
    </CatalogContext>
  );
}
