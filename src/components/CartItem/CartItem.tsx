import { FC } from 'react';
import { LineItem } from '@commercetools/platform-sdk';
import { formatPrice, keyToNameFormatter } from '@utils';
import { Image } from 'antd';

export const CartItem: FC<{
  lineItem: LineItem;
}> = ({ lineItem }: { lineItem: LineItem }) => {
  const imageUrl = lineItem.variant.images ? lineItem.variant.images[0].url : '';
  const fractionDigits = lineItem.price.value.fractionDigits;
  const itemCost = lineItem.price.value.centAmount;
  const quantity = lineItem.quantity;
  const currency = lineItem.price.value.currencyCode;
  const itemDiscountCost = lineItem.price.discounted
    ? formatPrice(lineItem.price.discounted?.value.centAmount, fractionDigits)
    : undefined;
  const itemTotalCost = lineItem.totalPrice.centAmount;
  const itemDiscountCodeCost =
    itemTotalCost / quantity < itemCost
      ? formatPrice(itemTotalCost / quantity, fractionDigits)
      : undefined;
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
          <b>Price:</b>{' '}
          {itemDiscountCost || itemDiscountCodeCost ? (
            <span className="discounted-price">
              <span className="original-price">
                {formatPrice(itemCost, fractionDigits)} {currency}
              </span>{' '}
              {itemDiscountCost ?? itemDiscountCodeCost}
            </span>
          ) : (
            formatPrice(itemCost, fractionDigits)
          )}{' '}
          {currency}
        </p>
        <p>
          <b>Quantity:</b> {quantity}
        </p>
        <p>
          <b>Total cost:</b> {formatPrice(itemTotalCost, fractionDigits)} {currency}
        </p>
      </div>
    </div>
  );
};
