import './ProductDetails.scss';
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ProductProjection,
  ProductProjectionPagedQueryResponse,
} from '@commercetools/platform-sdk';
import { Client } from '@commercetools/sdk-client-v2';
import { getProductPrice, extractAttributes } from '@utils';
import { IoIosPeople, IoIosColorPalette } from 'react-icons/io';
import { GiRolledCloth } from 'react-icons/gi';
import { Carousel } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';
import { Modal } from 'antd';
import { getProductByKey } from '@services';
import NotFound from '../NotFound/NotFound';
import AddCartButton from '../../components/AddCartButton/AddCartButton';

// eslint-disable-next-line max-lines-per-function
const ProductDetails = ({ apiClient }: { apiClient: Client }) => {
  const { key } = useParams();
  const [product, setProduct] = useState<ProductProjection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carouselRef = useRef<CarouselRef>(null);

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalSlideIndex, setModalSlideIndex] = useState(0);
  const [isNotFound, setIsNotFound] = useState(false);
  const modalCarouselRef = useRef<CarouselRef>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!key) return;

    getProductByKey(apiClient, key)
      .then((body: ProductProjectionPagedQueryResponse) => {
        if (body.results.length > 0) {
          setProduct(body.results[0]);
        } else {
          setIsNotFound(true);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch product data:', err);
        setError('Failed to fetch product data');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [key, apiClient, navigate]);

  useEffect(() => {
    if (isModalOpen && modalCarouselRef.current) {
      modalCarouselRef.current.goTo(modalSlideIndex);
    }
  }, [isModalOpen, modalSlideIndex]);

  const findVariantByKey = (product: ProductProjection, key: string) => {
    if (product.masterVariant.key === key) {
      return product.masterVariant;
    }
    const variant = product.variants.find((v) => v.key === key);
    return variant ?? product.masterVariant;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (isNotFound) return <NotFound />;
  if (!product) return null;

  const { name, description } = product;
  const selectedVariant = findVariantByKey(product, key ?? '');
  const images = selectedVariant.images ?? [];

  const locale = 'en-US';
  const productName = name[locale];
  const productDescription = description?.[locale] ?? Object.values(description ?? {})[0];

  const priceInfo = getProductPrice(product, selectedVariant);

  const attributes = extractAttributes(product, selectedVariant);

  return (
    <>
      <Modal
        open={isModalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
        className="product-modal"
      >
        <div className="modal-carousel-wrapper">
          {images.length > 1 ? (
            <button
              type="button"
              className="carousel-arrow left"
              onClick={() => modalCarouselRef.current?.prev()}
            >
              <BsArrowLeftShort />
            </button>
          ) : undefined}

          <Carousel
            ref={modalCarouselRef}
            dots
            initialSlide={modalSlideIndex}
            className="product-carousel"
          >
            {images.map((img) => (
              <div key={img.url}>
                <img src={img.url} alt="Product" className="carousel-image" />
              </div>
            ))}
          </Carousel>

          {images.length > 1 ? (
            <button
              type="button"
              className="carousel-arrow right"
              onClick={() => modalCarouselRef.current?.next()}
            >
              <BsArrowRightShort />
            </button>
          ) : undefined}
        </div>
        {images.length > 1 ? (
          <div className="mobile-arrows">
            <button
              type="button"
              className="mobile-arrow left"
              onClick={() => modalCarouselRef.current?.prev()}
            >
              <BsArrowLeftShort />
            </button>
            <button
              type="button"
              className="mobile-arrow rigth"
              onClick={() => modalCarouselRef.current?.next()}
            >
              <BsArrowRightShort />
            </button>
          </div>
        ) : undefined}
      </Modal>

      <div className="product-container">
        <div className="product-main">
          <h1 className="product-name">{productName}</h1>
          <div className="carousel-wrapper">
            {images.length > 1 ? (
              <button
                type="button"
                className="carousel-arrow left"
                onClick={() => carouselRef.current?.prev()}
              >
                <BsArrowLeftShort />
              </button>
            ) : undefined}
            <Carousel ref={carouselRef} dots effect="scrollx" className="product-carousel">
              {images.map((img, index) => (
                <div key={img.url} className="carousel-slide">
                  <img
                    src={img.url}
                    alt="Product"
                    className="carousel-image"
                    onClick={() => {
                      setModalSlideIndex(index);
                      setModalOpen(true);
                    }}
                  />
                </div>
              ))}
            </Carousel>
            {images.length > 1 ? (
              <button
                type="button"
                className="carousel-arrow right"
                onClick={() => carouselRef.current?.next()}
              >
                <BsArrowRightShort />
              </button>
            ) : undefined}
          </div>
        </div>

        <div className="product-general-description">
          <div className="product-price">
            <div className="product-price-info">
              <h2 className="price-text">Price:</h2>
              {priceInfo?.originalAmount ? (
                <>
                  <p className="price old-price">
                    {priceInfo.originalAmount} {priceInfo.currency}
                  </p>
                  <p className="price discounted-price">
                    {priceInfo.amount} {priceInfo.currency}
                  </p>
                </>
              ) : (
                <p className="price">
                  {priceInfo?.amount} {priceInfo?.currency}
                </p>
              )}
            </div>

            <div className="product-button">
              <AddCartButton key="cart" />
            </div>
          </div>
          <div className="product-description-container">
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
    </>
  );
};

export default ProductDetails;
