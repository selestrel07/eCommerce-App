import { FC } from 'react';
import { LineItem } from '@commercetools/platform-sdk';
import { formatPrice, keyToNameFormatter } from '@utils';
import { Image } from 'antd';

export const CartItem: FC<{
  lineItem: LineItem;
}> = ({ lineItem }: { lineItem: LineItem }) => {
  const imageUrl = lineItem.variant.images ? lineItem.variant.images[0].url : '';
  const fractionDigits = lineItem.price.value.fractionDigits;
  const itemCost = formatPrice(lineItem.price.value.centAmount, fractionDigits);
  const quantity = lineItem.quantity;
  const currency = lineItem.price.value.currencyCode;
  return (
    <div className="cart-item-container">
      <div className="cart-item-info">
        <Image src={imageUrl} alt="No image" />
        <p>
          <b>Name:</b> {keyToNameFormatter(lineItem.variant.key)}
        </p>
      </div>
      <div className="cart-item-price">
        <p>
          <b>Price:</b> {itemCost} {currency}
        </p>
        <p>
          <b>Quantity:</b> {quantity}
        </p>
        <p>
          <b>Total cost:</b> {formatPrice(parseInt(itemCost) * quantity)} {currency}
        </p>
      </div>
    </div>
  );
};
