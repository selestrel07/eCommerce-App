import { ReactElement, useEffect, useState } from 'react';
import { Client } from '@commercetools/sdk-client-v2';
import { loadProducts } from '../../services/api.service';
import { ProductWithPrice } from '../../interfaces/product/product';
import './Catalog.scss';

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
      <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>
        <h2>Error</h2>
        <p>{error}</p>
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
            const imageUrl = product.image;

            return (
              <div key={product.id} className="catalog-card">
                <img src={imageUrl} alt={productName} className="catalog-image" />
                <div className="catalog-info">
                  <h3 className="catalog-product-name">{productName}</h3>
                  {product.price ? (
                    <>
                      <p className="catalog-price">
                        Price: {product.price.value} {product.price.currency}
                      </p>
                      {product.price.discountedValue && (
                        <p className="catalog-discounted-price">
                          Discounted Price: {product.price.discountedValue} {product.price.currency}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="catalog-no-price">Price not available</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
