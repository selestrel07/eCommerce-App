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

  const [sortOption, setSortOption] = useState<string>('');

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
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

  return (
    <div className="catalog-container">
      <h1 className="catalog-title">List Products</h1>

      <select className="catalog-sort" value={sortOption} onChange={handleSortChange}>
        <option value="">Sort by:</option>
        <option value="price asc">Price: Low to High</option>
        <option value="price desc">Price: High to Low</option>
        <option value="name.en-US asc">Name: A-Z</option>
        <option value="name.en-US desc">Name: Z-A</option>
      </select>

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
