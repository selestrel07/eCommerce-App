import { ReactElement, useEffect, useState } from 'react';
import { Client } from '@commercetools/sdk-client-v2';
import { loadProducts } from '../../services/api.service';
import { ProductWithPrice } from '../../interfaces/product/product';
import './Catalog.scss';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { ProductSearch } from '../../components/ProductSearch/ProductSearch';

export default function Catalog({ apiClient }: { apiClient: Client }): ReactElement {
  const [products, setProducts] = useState<ProductWithPrice[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await loadProducts(apiClient);
        setProducts(productList);
        setFilteredProducts(productList);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, [apiClient]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const normalizedQuery = searchQuery.toLowerCase();

    const filtered = products.filter((product) => {
      const name = Object.values(product.name).find(Boolean)?.toLowerCase() || '';
      const description =
        Object.values(product.description ?? {})
          .find(Boolean)
          ?.toLowerCase() || '';
      const keywords = Object.values(product.searchKeywords ?? {})
        .flat()
        .map((kw) => kw.text.toLowerCase());

      return (
        name.includes(normalizedQuery) ||
        description.includes(normalizedQuery) ||
        keywords.some((kw) => kw.includes(normalizedQuery))
      );
    });

    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

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

      <ProductSearch onSearch={handleSearch} />

      {searchQuery && (
        <p className="search-info">
          Found {filteredProducts.length} results for "{searchQuery}"
        </p>
      )}

      {filteredProducts.length === 0 ? (
        <p className="catalog-empty-text">
          {searchQuery ? `No products found for "${searchQuery}"` : 'No products found.'}
        </p>
      ) : (
        <div className="catalog-grid">
          {filteredProducts.map((product) => {
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
