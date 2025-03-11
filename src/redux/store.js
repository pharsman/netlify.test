import { configureStore } from '@reduxjs/toolkit'
import ThemeStore from './Theme/ThemeStore'
export default configureStore({
  reducer: {
    ThemeStore: ThemeStore,
  },
})
