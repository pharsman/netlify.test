import DropdownAction from '@/components/DropdownActions/DropdownAction'
import style from './CategoryCard.module.scss'
import { useRef, useState, useEffect } from 'react'
import blank from '@/assets/images/blank.jpg'
import { createSearchParams, useNavigate } from 'react-router-dom'

const CategoryCard = ({ product, onEdit, onDelete }) => {
  const [OpenActions, setOpenActions] = useState(false)
  const dropdownRef = useRef(null)

  const navigate = useNavigate()
  const params = createSearchParams({
    categoryId: product.ID,
  })

  const Actions = useRef([
    {
      label: 'Edit',
      type: 'edit',
      event: (type, data) => {
        if (onEdit && typeof onEdit === 'function') onEdit(product)
      },
    },

    {
      label: 'Delete',
      type: 'delete',
      event: (type, data) => {
        if (onDelete && typeof onDelete === 'function') onDelete(product)
      },
    },
  ])

  const HandleNavigation = () => {
    navigate({
      pathname: '/Categories/ProductSetup',
      search: `?${params}`,
    })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenActions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const onActionsExpand = (val) => {
    setOpenActions((state) => !state)
  }

  return (
    <div className={style.categoryCard}>
      <div className={style.categoryCardTitle}>
        <h3 title={product?.Name ?? ''}>{product?.Name ?? ''}</h3>
        <div ref={dropdownRef}>
          <DropdownAction
            visible={OpenActions}
            ActionPosition={'left'}
            actions={Actions.current}
            onExpand={(state) => onActionsExpand(state)}
            itemID={product.ID}
            align={'right'}
          />
        </div>
      </div>
      <div style={{ cursor: 'pointer' }} onClick={HandleNavigation}>
        <div className={style.productCount}>
          <p title={`${product?.ProductCount ?? '0'} Products`}>{product?.ProductCount ?? '0'} Products</p>
        </div>
        <div className={style.productImage}>
          <img src={product?.ImageUrl ?? blank} alt={'Product Image'} />
        </div>
        <div className={style.productMargin}>
          <p>{product?.Margin ? `Margin: ${product?.Margin}%` : ''}</p>
        </div>
      </div>
    </div>
  )
}
export default CategoryCard
