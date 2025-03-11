import { useEffect, useState } from 'react'
import style from './Products.module.scss'
import { getAllCategories, getProducts, setProductsUpdate } from '@/pages/Setup/api/ProductsApi'
import { FormInput, FilterWithTags, MainButton, Popup } from 'master-components-react'
import ProductsCard from '@/pages/Setup/components/ProductsCard/ProductsCard'
import CircularLoading from '@/components/CircularLoading/CircularLoading'
import ProductsPopup from '@/pages/Setup/components/ProductsPopup/ProductsPopup'
import { CREATE_PRODUCT } from '@/pages/Setup/static/StaticProducts'
import { notificationError } from '@/utils/notificationError'

const Products = () => {
  const [Loading, setLoading] = useState(false)
  const [SearchValue, setSearchValue] = useState('')
  const [ProductsList, setProductsList] = useState([])
  const [OpenPopup, setOpenPopup] = useState(false)
  const [OpenDelete, setOpenDelete] = useState(false)
  const [EditMode, setEditMode] = useState(false)
  const [DeleteLoader, setDeleteLoader] = useState(false)
  const [Categories, setCategories] = useState([])

  const [EditData, setEditData] = useState(null)

  const onEdit = (data) => {
    setEditMode(true)
    setOpenPopup(true)
    setEditData(data)
  }

  const DeleteCard = () => {
    let params = {
      ID: EditData.ID,
      Delete: true,
    }
    setDeleteLoader(true)
    setProductsUpdate(params).then((resp) => {
      setDeleteLoader(false)

      if (!resp.data.Error) {
        setOpenDelete(false)
        ProductsGet()
      } else {
        if (resp.data.Error === 'Cannot_Be_Deleted') {
          notificationError('Cannot_Be_Deleted', 'The product cannot be deleted because it has already successfully received before')
        } else {
          notificationError()
        }
      }
    })
  }

  const onDelete = (data) => {
    setOpenDelete(true)
    setEditData(data)
  }

  const ProductsGet = () => {
    setLoading(true)
    getProducts()
      .then((resp) => {
        setProductsList(resp.data.Products)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    ProductsGet()
    getAllCategories().then((resp) => {
      CREATE_PRODUCT.find((el) => el.key === 'CategoryID').data = resp.data.map((el) => ({ id: el.ID, label: el.Name }))
      setCategories(resp.data.map((el) => ({ id: el.ID, label: el.Name })))
    })
  }, [])

  return (
    <div className={style.productsContainer}>
      <h2 className={style.productsTitle}>Products</h2>
      <header className={style.headerContainer}>
        <div className={style.headerLeft}>
          <FormInput placeholder="Search" value={SearchValue} onChange={(value) => setSearchValue(value)} />
          <FilterWithTags buttonLabel={{ style: { fontWeight: 700 } }} filterOptions={[]} />
        </div>
        <div className={style.headerRight}>
          <MainButton label="Create Product" onClick={() => setOpenPopup(true)} />
        </div>
      </header>
      {Loading && <CircularLoading />}
      <div className={style.productsList}>
        {ProductsList.length > 0
          ? ProductsList.map((product, index) => {
              return <ProductsCard key={index} product={product} onEdit={onEdit} onDelete={onDelete} />
            })
          : !Loading && 'No Products'}
      </div>
      {OpenPopup && (
        <ProductsPopup
          setOpenPopup={setOpenPopup}
          listReload={ProductsGet}
          editMode={EditMode}
          setEditMode={setEditMode}
          editData={EditData}
          categories={Categories}
        />
      )}
      {OpenDelete && (
        <Popup visible={true} options={{ type: 'unsaved', title: 'Are U sure you want to delete this product?' }} popupContainerStyle={{ width: '23.75rem' }}>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignContent: 'center', marginTop: '40px' }}>
            <MainButton
              label={'Cancel'}
              buttonStyle={{ backgroundColor: 'transparent', border: '1px solid rgb(239, 67, 67)' }}
              labelStyle={{ fontWeight: 700, color: 'rgb(239, 67, 67)' }}
              onClick={() => setOpenDelete(false)}
            />
            <MainButton label="Delete" onClick={DeleteCard} loading={DeleteLoader} />
          </div>
        </Popup>
      )}
    </div>
  )
}
export default Products
