import { ReactElement, useEffect, useState } from 'react';
import { Client } from '@commercetools/sdk-client-v2';
import { loadProducts } from '../../services/api.service';
import { ProductWithPrice } from '../../interfaces/product/product';

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
    return <div>Загрузка продуктов...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div>
      <h1>Список продуктов</h1>
      {products.length === 0 ? (
        <p>Продуктов не найдено.</p>
      ) : (
        <ul>
          {products.map((product) => {
            const productName = Object.values(product.name)[0] || 'Без названия';

            return (
              <li key={product.id}>
                <h2>{productName}</h2>
                {product.price ? (
                  <>
                    <p>
                      Цена: {product.price.value} {product.price.currency}
                    </p>
                    {product.price.discountedValue && (
                      <p style={{ color: 'green' }}>
                        Скидочная цена: {product.price.discountedValue} {product.price.currency}
                      </p>
                    )}
                  </>
                ) : (
                  <p>Цена не указана</p>
                )}
                <hr />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  ); // I leave it for testing purposes only, when you run the next shuffle, delete this code and comments
}
