/* eslint-disable max-lines-per-function */
import { ReactElement, useEffect, useState } from 'react';
import { Client } from '@commercetools/sdk-client-v2';
import { loadProducts } from '../../services/api.service';
import { ProductWithPrice } from '../../interfaces/product/product';
import './Catalog.scss';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { Select } from 'antd';

export default function Catalog({ apiClient }: { apiClient: Client }): ReactElement {
  const [products, setProducts] = useState<ProductWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortOption, setSortOption] = useState<string>('');

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productList = await loadProducts(
          apiClient,
          'EUR',
          undefined,
          undefined,
          undefined,
          sortOption
        );
        setProducts(productList);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, [apiClient, sortOption]);

  if (loading) {
    return (
      <div className="catalog-container">
        <h2>Loading products...</h2>
        <p>Please wait</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog-container">
        <div className="catalog-error">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const allVariants = products.flatMap((product) =>
    [product.masterVariant, ...product.variants].map((variant) => ({
      ...variant,
      productName: product.name,
    }))
  );

  const { Option } = Select;

  return (
    <div className="catalog-container">
      <h1 className="catalog-title">List Products</h1>
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

      {allVariants.length === 0 ? (
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
