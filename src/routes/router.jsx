import pathPrefix from '@/utils/pathPrefix'

// setup
import Category from '@/pages/Setup/views/Category/Category'
import CategoryProductSetup from '@/pages/Setup/views/Category/CategoryProductSetup/CategoryProductSetup'
import Products from '@/pages/Setup/views/Products/Products'
import Vendors from '@/pages/Setup/views/Vendors/Vendors'
import Couriers from '@/pages/Setup/views/Couriers/Couriers'

export const routes = [
  {
    path: '/Categories',
    element: <Category />,
  },
  {
    path: '/Categories/ProductSetup',
    element: <CategoryProductSetup />,
  },
  {
    path: '/Products',
    element: <Products />,
  },
  {
    path: '/Vendors',
    element: <Vendors />,
  },
  {
    path: '/Couriers',
    element: <Couriers />,
  },
].map((el) => ({ ...el, path: pathPrefix + el.path }))
