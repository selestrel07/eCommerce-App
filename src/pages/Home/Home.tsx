import { ReactElement, useEffect } from 'react';
import { Client } from '@commercetools/sdk-client-v2';
import { loadProducts } from '../../services/api.service';

export default function Home({ apiClient }: { apiClient: Client }): ReactElement {
  useEffect(() => {
    void loadProducts(apiClient);
  }, [apiClient]);

  return <></>;
}
