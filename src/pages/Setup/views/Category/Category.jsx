import { useEffect, useState } from 'react'
import style from './Category.module.scss'
import { getCategory, setCategoryUpdate } from '@/pages/Setup/api/CategoryApi'
import { FormInput, FilterWithTags, MainButton, Popup } from 'master-components-react'
import CategoryCard from '@/pages/Setup/components/CategoryCard/CategoryCard'
import CircularLoading from '@/components/CircularLoading/CircularLoading'
import CategoryPopup from '@/pages/Setup/components/CategoryPopup/CategoryPopup'
import { notificationError } from '@/utils/notificationError'

const Category = () => {
  const [Loading, setLoading] = useState(false)
  const [SearchValue, setSearchValue] = useState('')
  const [CategoryList, setCategoryList] = useState([])
  const [OpenPopup, setOpenPopup] = useState(false)
  const [OpenDelete, setOpenDelete] = useState(false)
  const [EditMode, setEditMode] = useState(false)
  const [DeleteLoader, setDeleteLoader] = useState(false)

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
    setCategoryUpdate(params).then((resp) => {
      setDeleteLoader(false)

      if (!resp.data.Error) {
        setOpenDelete(false)
        CategoryGet()
      } else {
        if (resp.data.Error === 'Cant_Delete_Category_With_Products_In_It') {
          notificationError('Cant_Delete_Category_With_Products_In_It', 'The category cannot be deleted because it has products in it')
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

  const CategoryGet = () => {
    setLoading(true)
    getCategory()
      .then((resp) => {
        setCategoryList(resp.data.Categories)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    CategoryGet()
  }, [])

  return (
    <div className={style.categoryContainer}>
      <h2 className={style.categoryTitle}>Category</h2>
      <header className={style.headerContainer}>
        <div className={style.headerLeft}>
          <FormInput placeholder="Search" value={SearchValue} onChange={(value) => setSearchValue(value)} />
          <FilterWithTags buttonLabel={{ style: { fontWeight: 700 } }} filterOptions={[]} />
        </div>
        <div className={style.headerRight}>
          <MainButton label="Create Category" onClick={() => setOpenPopup(true)} />
        </div>
      </header>
      {Loading && <CircularLoading />}
      <div className={style.categoryList}>
        {CategoryList.length > 0
          ? CategoryList.map((product, index) => {
              return <CategoryCard key={index} product={product} onEdit={onEdit} onDelete={onDelete} />
            })
          : !Loading && 'No Products'}
      </div>
      {OpenPopup && <CategoryPopup setOpenPopup={setOpenPopup} listReload={CategoryGet} editMode={EditMode} setEditMode={setEditMode} editData={EditData} />}
      {OpenDelete && (
        <Popup visible={true} options={{ type: 'unsaved', title: 'Are U sure you want to delete this category?' }} popupContainerStyle={{ width: '23.75rem' }}>
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
export default Category
