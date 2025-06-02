import { ReactElement, useEffect, useState } from 'react';
import { Client } from '@commercetools/sdk-client-v2';
import { loadProducts, searchProducts } from '../../services/api.service';
import './Catalog.scss';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { CategoryList } from '../../components/CategoryList/CategoryList.tsx';
import { CatalogContext, CategoryProvider } from '../../contexts/CatalogContexts.tsx';
import { CatalogBreadcrumbs } from '../../components/CatalogBreadcrumbs/CatalogBreadcrumbs.tsx';
import { ProductVariantWithPriceAndName } from '../../interfaces/product/product.ts';
import { getVariants } from '../../utils/map-product.ts';
import { QueryParams } from '../../interfaces/query-params/query-params.ts';

export default function Catalog({ apiClient }: { apiClient: Client }): ReactElement {
  const [products, setProducts] = useState<ProductVariantWithPriceAndName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<QueryParams>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await loadProducts(apiClient);
        setProducts(getVariants(productList));
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, [apiClient]);

  useEffect(() => {
    searchProducts(apiClient, filters)
      .then((response) => {
        setProducts(getVariants(response));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [filters]);

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
    <CatalogContext.Provider
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

              {products.length === 0 ? (
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
    </CatalogContext.Provider>
  );
}
