/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Public config from the automatic provision
const firebaseConfig = {
  projectId: "stable-haiku-860cq",
  appId: "1:447720280024:web:17d271486be86f67f8acad",
  apiKey: "AIzaSyBjFtAKdoF4yiLp30fagn8feukiXKCvPJA",
  authDomain: "stable-haiku-860cq.firebaseapp.com",
  databaseId: "ai-studio-1fe8e173-efe7-4b07-be86-1fb2e04a039d",
  storageBucket: "stable-haiku-860cq.firebasestorage.app",
  messagingSenderId: "447720280024",
};

let db: any = null;
let isFirebaseConnected = false;

try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  // We specify the custom databaseId provided in config for firestore
  db = getFirestore(app, firebaseConfig.databaseId);
  isFirebaseConnected = true;
  console.log("Firebase Firestore initialized successfully with databaseId:", firebaseConfig.databaseId);
} catch (error) {
  console.error("Firebase initialization failed, falling back to LocalStorage DB:", error);
}

export { db, isFirebaseConnected };
