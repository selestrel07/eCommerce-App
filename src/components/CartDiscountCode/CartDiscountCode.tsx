import { Input } from '@components';
import { Button, Tag } from 'antd';
import { ChangeEvent, FC, ReactElement, useEffect, useState } from 'react';
import { useCart } from '@contexts';
import { Cart, DiscountCode } from '@commercetools/platform-sdk';
import { loadDiscountCodes, updateCart } from '@services';
import { Client } from '@commercetools/sdk-client-v2';
import { composeAddCodeAction, composeRemoveCodeAction } from '@utils';

const getDiscountCodeNames = (discountCodes: DiscountCode[], cartCodes: string[]) => {
  return discountCodes
    .filter((discountCode) => cartCodes.includes(discountCode.id))
    .map((discountCode) => discountCode.code);
};

export const CartDiscountCode: FC<{
  client: Client;
}> = ({ client }): ReactElement => {
  const [code, setCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [codesList, setCodesList] = useState<DiscountCode[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const { cart, setCart } = useCart();

  const updateTags = (cart: Cart | null): void => {
    if (cart) {
      setTags(
        getDiscountCodeNames(
          codesList,
          cart.discountCodes.map((code) => code.discountCode.id)
        )
      );
    }
  };

  const updateData = (cart: Cart): void => {
    setCart(cart);
    updateTags(cart);
  };

  useEffect(() => {
    loadDiscountCodes(client)
      .then((response) => setCodesList(response.results))
      .catch(console.error);
  }, [client]);

  useEffect(() => {
    updateTags(cart);
  }, [codesList]);

  const handleRemove = (tag: string) => {
    updateCart(client, cart?.id ?? '', cart?.version ?? 0, [
      composeRemoveCodeAction(codesList.find((code) => code.code === tag)?.id ?? ''),
    ])
      .then((response) => updateData(response))
      .catch(console.error);
  };

  const handleUpdate = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setCode(e.currentTarget.value);
    setErrorMessage(undefined);
  };

  const handleSubmit = (): void => {
    updateCart(client, cart?.id ?? '', cart?.version ?? 0, [composeAddCodeAction(code)])
      .then((response) => {
        updateData(response);
        setCode('');
      })
      .catch((error: Error): void => setErrorMessage(error.message));
  };

  return (
    <>
      <div className="discount-code-applied">
        {tags.map((tag) => (
          <Tag
            key={tag}
            closable={true}
            onClose={(e) => {
              e.preventDefault();
              handleRemove(tag);
            }}
          >
            {tag}
          </Tag>
        ))}
      </div>
      <div className="discount-code-controls">
        <Input
          placeholder="Enter promocode"
          value={code}
          onChange={handleUpdate}
          errorMessage={errorMessage}
        />
        <Button type="primary" disabled={code.length === 0} onClick={handleSubmit}>
          Apply
        </Button>
      </div>
    </>
  );
};
