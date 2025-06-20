/* eslint-disable max-lines-per-function */
import { FC } from 'react';
import { LineItem } from '@commercetools/platform-sdk';
import { formatPrice, keyToNameFormatter } from '@utils';
import { Image, Button } from 'antd';
import './CartItem.scss';
import { DeleteFromCartButton } from '@components';
import { CiSquareMinus, CiSquarePlus } from 'react-icons/ci';
import './CartItem.scss';
import { Client } from '@commercetools/sdk-client-v2';

interface CartItemProps {
  lineItem: LineItem;
  client: Client;
  updating: boolean;
  onCartUpdate: () => void;
  availableStock: number;
  onQuantityChange: (lineItemId: string, mewQty: number) => void;
}

export const CartItem: FC<CartItemProps> = ({
  lineItem,
  client,
  onCartUpdate,
  updating,
  availableStock,
  onQuantityChange,
}) => {
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
          <div className="stock-quantity-container">
            <b>Quantity:</b>
            <div className="cart-item-controls">
              <Button
                className="button-quantity-change"
                icon={<CiSquareMinus size={32} />}
                onClick={() => onQuantityChange(lineItem.id, lineItem.quantity - 1)}
                disabled={updating || lineItem.quantity <= 1}
                size="small"
              ></Button>
              <input
                className="input-quantity"
                type="number"
                min={1}
                max={availableStock}
                value={lineItem.quantity}
                disabled={updating}
                onChange={(e) => {
                  let q = parseInt(e.target.value, 10);
                  if (Number.isNaN(q)) return;

                  if (q < 1) q = 1;
                  if (q > availableStock) q = availableStock;

                  if (q !== lineItem.quantity) {
                    onQuantityChange(lineItem.id, q);
                  }
                }}
              />
              <Button
                className="button-quantity-change"
                icon={<CiSquarePlus size={32} />}
                onClick={() => onQuantityChange(lineItem.id, lineItem.quantity + 1)}
                disabled={updating || lineItem.quantity >= availableStock}
                size="small"
              ></Button>
            </div>
            <p className="stock-info">In stock: {availableStock}</p>
          </div>
        </p>
        <p>
          <b>Total cost:</b> {formatPrice(itemTotalCost, fractionDigits)} {currency}
        </p>
      </div>
      <DeleteFromCartButton lineItemId={lineItem.id} client={client} onCartUpdate={onCartUpdate} />
    </div>
  );
};
