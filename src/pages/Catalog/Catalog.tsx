/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-lines-per-function */
import { ReactElement, useEffect, useState } from 'react';
import { Client } from '@commercetools/sdk-client-v2';
import { loadProducts } from '../../services/api.service';
import { ProductWithPrice } from '../../interfaces/product/product';
import './Catalog.scss';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { Input, Select, Button } from 'antd';
import { FilterState } from '../../interfaces/filter/filter';

const { Search } = Input;
const { Option } = Select;

export default function Catalog({ apiClient }: { apiClient: Client }): ReactElement {
  const [products, setProducts] = useState<ProductWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<Omit<FilterState, 'minPrice' | 'maxPrice'>>({});

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productList = await loadProducts(apiClient, searchQuery, 'EUR', filters);
      setProducts(productList);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProducts();
  }, [apiClient, searchQuery, filters]);

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

  const allVariants = products
    .flatMap((product) => {
      return [product.masterVariant, ...product.variants].map((variant) => {
        const colorAttr = variant.attributes?.color;
        const sexAttr = variant.attributes?.sex;

        const matchesColor = !filters.color || colorAttr === filters.color;
        const matchesSex = !filters.sex || sexAttr === filters.sex;

        return {
          ...variant,
          productName: product.name,
          isMatchingVariant: !!(matchesColor && matchesSex),
        };
      });
    })
    .filter((v) => v.isMatchingVariant);
  return (
    <div className="catalog-container">
      <h1 className="catalog-title">List Products</h1>

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

        <Button type="default" onClick={resetFilters} block style={{ marginTop: '16px' }}>
          Reset Filters
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="catalog-error">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      ) : allVariants.length === 0 ? (
        <p className="catalog-empty-text">No product variations found.</p>
      ) : (
        <div className="catalog-grid">
          {allVariants.map((variant) => {
            const productName = Object.values(variant.productName)[0] || 'Unnamed Product';
            const productKey = variant.key ?? `variant-${variant.id}`;

            return <ProductCard key={productKey} variant={variant} name={productName} />;
          })}
        </div>
      )}
    </div>
  );
}
