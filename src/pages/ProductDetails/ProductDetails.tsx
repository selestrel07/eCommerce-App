import './ProductDetails.scss';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { apiRootBuilder } from '../../services/clientBuilder';
import { ProductProjection } from '@commercetools/platform-sdk';
import { Client } from '@commercetools/sdk-client-v2';
import { getProductPrice } from '../../utils/getProductPrice';
import { extractAttributes } from '../../utils/getProductAttributes';
import { IoIosPeople, IoIosColorPalette } from 'react-icons/io';
import { GiRolledCloth } from 'react-icons/gi';
import { Carousel } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

// eslint-disable-next-line max-lines-per-function
const ProductDetails = ({ apiClient }: { apiClient: Client }) => {
  const { key } = useParams();
  const [product, setProduct] = useState<ProductProjection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiRoot = useMemo(() => apiRootBuilder(apiClient), [apiClient]);

  const carouselRef = useRef<CarouselRef>(null);

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

  const attributes = extractAttributes(product);

  return (
    <div className="product-container">
      <div className="product-main">
        <h1 className="product-name">{productName}</h1>
        <div className="carousel-wrapper">
          <button
            type="button"
            className="carousel-arrow left"
            onClick={() => carouselRef.current?.prev()}
          >
            <BsArrowLeftShort />
          </button>
          <Carousel ref={carouselRef} dots effect="scrollx" className="product-carousel">
            {images.map((img) => (
              <div key={img.url} className="carousel-slide">
                <img src={img.url} alt="Product" className="carousel-image" />
              </div>
            ))}
          </Carousel>
          <button
            type="button"
            className="carousel-arrow right"
            onClick={() => carouselRef.current?.next()}
          >
            <BsArrowRightShort />
          </button>
        </div>
      </div>

      <div className="product-general-description">
        <div className="product-price">
          <h2 className="price-text">Price:</h2>
          <p className="price">
            {priceInfo?.amount} {priceInfo?.currency}
          </p>
        </div>
        <div className="product-description">
          <h3>About this item:</h3>
          <p className="product-description">{productDescription}</p>
        </div>
        <div className="product-attributes">
          <h3 className="attribute-title">Product details:</h3>
          <div className="attribute-group">
            <IoIosPeople />
            <div className="attribute-description">
              <h4 className="attribute-name">For:</h4>
              <p className="attribute-value">{attributes.sex}</p>
            </div>
          </div>
          <div className="attribute-group">
            <IoIosColorPalette />
            <div className="attribute-description">
              <h4 className="attribute-name">Color:</h4>
              <p className="attribute-value">{attributes.color}</p>
            </div>
          </div>
          <div className="attribute-group">
            <GiRolledCloth />
            <div className="attribute-description">
              <h4 className="attribute-name">Material:</h4>
              <p className="attribute-value">{attributes.material}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
