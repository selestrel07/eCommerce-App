import './ProductDetails.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiRootBuilder } from '../../services/clientBuilder';
import { ProductProjection } from '@commercetools/platform-sdk';
import { Client } from '@commercetools/sdk-client-v2';
import { useMemo } from 'react';
import { getProductPrice } from '../../utils/getProductPrice';

const ProductDetails = ({ apiClient }: { apiClient: Client }) => {
  const { key } = useParams();
  const [product, setProduct] = useState<ProductProjection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiRoot = useMemo(() => apiRootBuilder(apiClient), [apiClient]);

  useEffect(() => {
    if (!key) return;

    apiRoot
      .productProjections()
      .withKey({ key })
      .get()
      .execute()
      .then((response) => {
        setProduct(response.body);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch product data');
        setLoading(false);
        console.error(err);
      });
  }, [key, apiRoot]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return null;

  const { name, description, masterVariant } = product;
  const images = masterVariant.images ?? [];

  const locale = 'en-US';
  const productName = name[locale];
  const productDescription = description?.[locale] ?? Object.values(description ?? {})[0];

  const priceInfo = getProductPrice(product);

  return (
    <div className="product-container">
      <div className="product-main">
        <h1 className="product-name">{productName}</h1>
        <div className="image-container">
          {images.map((img, index) => (
            <img
              key={img.url}
              src={img.url}
              alt={`Product image ${index + 1}`}
              className="product-image"
            />
          ))}
        </div>
      </div>

      <div className="product-description">
        <h3>Description</h3>
        <p className="product-description">{productDescription}</p>
      </div>
      <div className="product-price">
        <h4 className="price-text">Price:</h4>
        <p className="price">
          {priceInfo?.amount} {priceInfo?.currency}
        </p>
      </div>
    </div>
  );
};

export default ProductDetails;
