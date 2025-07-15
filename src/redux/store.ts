import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './slices/userSlice';
// import cartReducer from './slices/cartSlice';

const persistConfig = {
  key: 'root',
  storage,
};

// const cartPersistConfig = {
//   key: 'cart',
//   storage,
// };

const persistedReducer = persistReducer(persistConfig, userReducer);
// const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    user: persistedReducer,
    // cart: persistedCartReducer,
  },
  middleware: (defaultMiddleware) =>
    defaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


