import { ReactElement, useEffect, useState } from 'react';
import { Client } from '@commercetools/sdk-client-v2';
import { loadDiscountCodes, loadProducts } from '@services';
import { DiscountCodeCard, ProductCard } from '@components';
import { Carousel } from 'antd';
import { DiscountCode } from '@commercetools/platform-sdk';
import { ProductVariantWithPriceAndName } from '@interfaces';
import { getVariants } from '@utils';
import './Home.scss';

export default function Home({ apiClient }: { apiClient: Client }): ReactElement {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [items, setItems] = useState<ProductVariantWithPriceAndName[]>([]);
  useEffect(() => {
    loadDiscountCodes(apiClient)
      .then((response) => setCodes(response.results))
      .then(() => {
        return loadProducts(apiClient, 'EUR', { scopedPriceDiscounted: true });
      })
      .then((products) =>
        setItems(
          getVariants(products, {}).filter((variant) => variant.price?.discountedValue !== null)
        )
      )
      .catch(console.error);
  }, [apiClient]);

  return (
    <div className="home-container">
      <h2>Our great summer sales:</h2>
      <div className="discount-codes">
        <Carousel autoplay={{ dotDuration: true }} autoplaySpeed={6000}>
          {codes.map((code) => (
            <DiscountCodeCard key={code.id} code={code} />
          ))}
        </Carousel>
      </div>
      <h2>Our best offers:</h2>
      <div className="discount-items">
        {items.map((item) => (
          <ProductCard key={item.sku} variant={item} name={item.productName['en-US']} />
        ))}
      </div>
    </div>
  );
}
