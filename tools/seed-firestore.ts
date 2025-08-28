#!/usr/bin/env node

import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';

// === Определение источника сервисного аккаунта ===
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  console.error(
    '❌ No service account provided. Use:\n' +
      '  FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/service-account.json'
  );
  process.exit(1);
}

// === Чтение и парсинг файла сервисного аккаунта ===
let serviceAccount: ServiceAccount;

try {
  const rawData = fs.readFileSync(serviceAccountPath, 'utf8');
  const raw = JSON.parse(rawData);

  const projectId = raw.project_id;
  const clientEmail = raw.client_email;
  let privateKey = raw.private_key || raw.privateKey;

  if (!projectId) throw new Error('Missing "project_id" in service account');
  if (!clientEmail)
    throw new Error('Missing "client_email" in service account');
  if (!privateKey) throw new Error('Missing "private_key" in service account');

  privateKey = privateKey.replace(/\\n/g, '\n');

  serviceAccount = {
    projectId,
    clientEmail,
    privateKey,
  };

  console.log(`✅ Loaded service account from file: ${serviceAccountPath}`);
} catch (err) {
  console.error(`❌ Failed to read or parse service account file:`, err);
  process.exit(1);
}

// === Инициализация Firebase ===
try {
  initializeApp({ credential: cert(serviceAccount) });
  console.log('✅ Firebase Admin SDK initialized');
} catch (err) {
  console.error('❌ Failed to initialize Firebase:', err);
  process.exit(1);
}

const db = getFirestore();

// === Типы и данные ===
type Gift = {
  title: string;
  description: string;
  category: string;
  priceRange: string;
  imageUrl?: string;
};

const gifts: Array<Gift & { id: string }> = [

 
]





// === Загрузка данных в Firestore ===
async function main() {
  const batch = db.batch();
  for (const gift of gifts) {
    const ref = db.collection('gifts').doc(gift.id);
    batch.set(ref, {
      title: gift.title,
      description: gift.description,
      category: gift.category,
      priceRange: gift.priceRange,
      imageUrl: gift.imageUrl ?? '',
    });
  }

  await batch.commit();
  console.log(`✅ Seeded ${gifts.length} gifts into Firestore`);
}

// === Запуск ===
main()
  .then(() => {
    console.log('🎉 Seed completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
