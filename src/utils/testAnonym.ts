// src/utils/testAnonymous.ts
import { getAnonymousId, getAnonymousApi } from '../services/authService';

export async function testAnonymousSession() {
  // 1. Посмотрим, какой anonymousId сейчас в localStorage
  const anonId = getAnonymousId();
  console.log('Anonymous ID (из localStorage):', anonId);

  // 2. Построим клиент и сделаем запрос за одним товаром
  const apiRoot = getAnonymousApi();
  try {
    const response = await apiRoot
      .productProjections()
      .get({ queryArgs: { limit: 1 } })
      .execute();

    // 3. Логируем тело и заголовки ответа
    console.log('HTTP Status:', response.statusCode);
    console.log('Body:', response.body);
  } catch (err) {
    console.error('Ошибка анонимного запроса:', err);
  }
}

// Сразу вызываем, чтобы проверить
// void testAnonymousSession();
