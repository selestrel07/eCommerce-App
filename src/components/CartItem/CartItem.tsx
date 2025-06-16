import { FC } from 'react';
import { LineItem } from '@commercetools/platform-sdk';
import { formatPrice, keyToNameFormatter } from '@utils';
import { Image, Button } from 'antd';
import { CiSquareMinus } from 'react-icons/ci';
import { CiSquarePlus } from 'react-icons/ci';
import './CartItem.scss';

interface CartItemProps {
  lineItem: LineItem;
  updating: boolean;
  onQuantityChange: (lineItenId: string, mewQty: number) => void;
}

export const CartItem: FC<CartItemProps> = ({ lineItem, updating, onQuantityChange }) => {
  const imageUrl = lineItem.variant.images ? lineItem.variant.images[0].url : '';
  const fractionDigits = lineItem.price.value.fractionDigits;
  const itemCost = formatPrice(lineItem.price.value.centAmount, fractionDigits);
  const quantity = lineItem.quantity;
  const currency = lineItem.price.value.currencyCode;
  const itemDiscountCost = formatPrice(lineItem.price.discounted?.value.centAmount, fractionDigits);
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
          {itemDiscountCost ? (
            <span className="discounted-price">
              <span className="original-price">
                {itemCost} {currency}
              </span>{' '}
              {itemDiscountCost}
            </span>
          ) : (
            itemCost
          )}{' '}
          {currency}
        </p>
        <p>
          <b>Quantity:</b> {quantity}
        </p>
        <p>
          <b>Total cost:</b> {formatPrice(lineItem.totalPrice.centAmount, fractionDigits)}{' '}
          {currency}
        </p>
      </div>
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
          value={lineItem.quantity}
          disabled={updating}
          onChange={(e) => {
            const q = parseInt(e.target.value, 10);
            if (q >= 1) onQuantityChange(lineItem.id, q);
          }}
        />
        <Button
          className="button-quantity-change"
          icon={<CiSquarePlus size={32} />}
          onClick={() => onQuantityChange(lineItem.id, lineItem.quantity + 1)}
          disabled={updating}
          size="small"
        ></Button>
      </div>
    </div>
  );
};
