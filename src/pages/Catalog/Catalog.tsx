import { ReactElement, useEffect, useState } from 'react';
import { Client } from '@commercetools/sdk-client-v2';
import { loadProducts } from '../../services/api.service';
import { ProductWithPrice } from '../../interfaces/product/product';
import './Catalog.scss';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { Input } from 'antd';

const { Search } = Input;

export default function Catalog({ apiClient }: { apiClient: Client }): ReactElement {
  const [products, setProducts] = useState<ProductWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await loadProducts(apiClient, searchQuery);
        setProducts(productList);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, [apiClient, searchQuery]);

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
