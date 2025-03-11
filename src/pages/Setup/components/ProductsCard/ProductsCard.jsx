import DropdownAction from '@/components/DropdownActions/DropdownAction'
import style from './ProductsCard.module.scss'
import { useRef, useState, useEffect } from 'react'
import blank from '@/assets/images/blank.jpg'
import { Toggle, createToastNotification } from 'master-components-react'
import { setProductsUpdate } from '@/pages/Setup/api/ProductsApi'
import { notificationStyle } from '@/utils/notificationStyle'
import close from '@/assets/icons/close.svg?raw'
import { notificationError } from '@/utils/notificationError'

const CategoryCard = ({ product, onEdit, onDelete }) => {
  const [OpenActions, setOpenActions] = useState(false)
  const dropdownRef = useRef(null)

  const [ToggleState, setToggleState] = useState(!product.IsInactive)

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

  const onActionsExpand = (val) => {
    setOpenActions((state) => !state)
  }

  const ChangeToggle = (val) => {
    setProductsUpdate({ ID: product.ID, Inactive: !product.IsInactive }).then((res) => {
      if (!res.data.Error) {
        setToggleState((state) => !state)
      } else {
        if (res.data.Error === 'Cannot_Be_Disabled') {
          notificationError('Cannot_Be_Disabled', 'The product cannot be disabled because it is on stock')
        } else {
          notificationError()
        }
      }
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

  return (
    <div className={style.categoryCard}>
      <div className={style.categoryCardTitle}>
        <div className={style.productImage}>
          <img src={product?.ImageUrl ?? blank} alt={'Product Image'} />
        </div>
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
      <div className={style.productDetails}>
        <h3 title={product?.ProductName ?? ''}>{product?.ProductName ?? ''}</h3>

        <div className={style.productCount}>
          <p title={`${product?.CategoryName ?? '0'} Products`}>{product?.CategoryName ?? '0'} </p>
        </div>

        <div className={style.productCount}>
          <p>{product?.Weight ? 'Weight: ' + product?.Weight : 'Volume: ' + product?.Volume}</p>
        </div>
      </div>
      <Toggle checked={ToggleState} change={ChangeToggle} />
    </div>
  )
}
export default CategoryCard
