import { getAnonymousId, getAnonymousApi } from '../services/authService';

export async function testAnonymousSession() {
  const anonId = getAnonymousId();
  console.log('Anonymous ID:', anonId);

  const apiRoot = getAnonymousApi();
  try {
    const response = await apiRoot
      .productProjections()
      .get({ queryArgs: { limit: 1 } })
      .execute();

    console.log('HTTP Status:', response.statusCode);
    console.log('Body:', response.body);
  } catch (err) {
    console.error('Ошибка анонимного запроса:', err);
  }
}
