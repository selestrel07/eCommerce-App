import { ReactElement, useEffect, useState } from 'react';
import { Client } from '@commercetools/sdk-client-v2';
import { loadProducts } from '../../services/api.service';
import { ProductWithPrice } from '../../interfaces/product/product';
import './Catalog.scss';
import { ProductCard } from '../../components/ProductCard/ProductCard';

export default function Catalog({ apiClient }: { apiClient: Client }): ReactElement {
  const [products, setProducts] = useState<ProductWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await loadProducts(apiClient);
        setProducts(productList);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, [apiClient]);

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

  return (
    <div className="catalog-container">
      <h1 className="catalog-title">Product List</h1>

      {products.length === 0 ? (
        <p className="catalog-empty-text">No products found.</p>
      ) : (
        <div className="catalog-grid">
          {products.map((product) => {
            const productName = Object.values(product.name)[0] || 'Unnamed product';
            const productDescription = Object.values(product.description ?? {})[0];

            return (
              <ProductCard
                key={product.id}
                id={product.id}
                name={productName}
                image={product.image}
                price={product.price}
                description={productDescription}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
