import { Paths } from '@enums';
import { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@contexts';
import { CartDiscountCode, CartItem } from '@components';
import { Flex } from 'antd';
import { Client } from '@commercetools/sdk-client-v2';
import { updateCart } from '@services';
import { useState, useEffect } from 'react';
import { fetchInventoryBySKU } from '@services';

export const Cart: FC<{
  client: Client;
}> = ({ client }): ReactElement => {
  // const { cart } = useCart();

  const { cart, setCart, cartTotal } = useCart();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [stockMap, setStockMap] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!cart) return;

    // параллельно запрашиваем все inventory
    Promise.all(
      cart.lineItems.map((li) =>
        fetchInventoryBySKU(client, li.variant.sku ?? '').then((entry) => ({
          sku: li.variant.sku,
          available: entry?.availableQuantity ?? 0,
        }))
      )
    )
      .then((results) => {
        const map: Record<string, number> = {};
        results.forEach((r) => {
          if (r.sku) map[r.sku] = r.available;
        });
        setStockMap(map);
      })
      .catch((err: unknown) => console.error('Inventory load error', err));
  }, [cart, client]);

  // const handleQuantityChange = async (lineItemId: string, newQty: number) => {
  //   if (!cart || newQty < 1) return;
  //   setUpdatingId(lineItemId);
  //   try {
  //     const updated = await updateCart(client, cart.id, cart.version, [
  //       { action: 'changeLineItemQuantity', lineItemId, quantity: newQty },
  //     ]);
  //     setCart(updated);
  //   } catch (err) {
  //     console.error('Failed to update cart:', err);
  //   } finally {
  //     setUpdatingId(null);
  //   }
  // };

  const handleQuantityChange = async (id: string, qty: number) => {
    if (!cart) return;

    // получаем sku и извлекаем из map остаток
    const li = cart.lineItems.find((x) => x.id === id);
    const sku = li?.variant.sku ?? '';
    const max = stockMap[sku] ?? 0;
    if (qty < 1 || qty > max) return; // запрещаем

    setUpdatingId(id);
    try {
      const updated = await updateCart(client, cart.id, cart.version, [
        { action: 'changeLineItemQuantity', lineItemId: id, quantity: qty },
      ]);
      setCart(updated);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!cart || cart.lineItems.length === 0) {
    return (
      <h2>
        There are no items in your cart. Please proceed with <Link to={Paths.CATALOG}>Catalog</Link>{' '}
        to add items.
      </h2>
    );
  }

  return (
    <Flex gap="middle" vertical align="center">
      {cart.lineItems.map((item) => {
        const sku = item.variant.sku ?? '';
        const availableStock = stockMap[sku] ?? 0;
        return (
          <CartItem
            key={item.id}
            lineItem={item}
            updating={updatingId === item.id}
            availableStock={availableStock}
            onQuantityChange={(id, qty) => void handleQuantityChange(id, qty)}
          />
        );
      })}
      <CartDiscountCode client={client} />
      <div className="cart-total">
        <strong>Total:</strong> {(cartTotal / 100).toFixed(2)} {cart.totalPrice.currencyCode}
      </div>
    </Flex>
  );
};

//   return (
//     <>
//       {cart === null || cart?.lineItems.length === 0 ? (
//         <h2>
//           There are no items in your cart. Please proceed with{' '}
//           <Link to={Paths.CATALOG}>Catalog</Link> to add items.
//         </h2>
//       ) : (
//         <>
//           <Flex gap="middle" vertical align="center">
//             {cart.lineItems.map((item) => (
//               <CartItem
//                 key={item.id}
//                 lineItem={item}
//                 updating={updatingId === item.id}
//                 availableStock={stock}
//                 onQuantityChange={(id, qty) => {
//                   void handleQuantityChange(id, qty);
//                 }}
//               />
//             ))}
//             <CartDiscountCode client={client} />
//           </Flex>
//         </>
//       )}
//     </>
//   );
// };
