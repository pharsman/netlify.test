import { useNavigate, useSearchParams } from 'react-router-dom'
import { IconLeftArrow } from '@/assets/svgComponents/IconLeftArrow'
import style from './CategoryProductSetup.module.scss'
import { MainButton, Grid } from 'master-components-react'
import { useMemo, useRef, useState } from 'react'
import axiosInstance from '@/hooks/AxiosInstance'
import { setProductsForSetup } from '@/pages/Setup/api/CategoryApi'

const CategoryProductSetup = () => {
  const navigate = useNavigate()

  const [query] = useSearchParams()

  const CategoryID = +query.get('categoryId')

  const RowData = useRef({}) // Store original row data

  const [Refresh, setRefresh] = useState(false)

  const onSaving = async (type, data) => {
    let updatedRows = []

    if (type === 'onEditingStart') {
      RowData[data.data.ID] = {
        ID: data.data.ProductID,
        Margin: data.data.Margin,
        FixPrice: data.data.FixPrice,
        WarehouseID: data.data.WarehouseID,
      }
    }

    if (type == 'onEditCanceling' || type == 'onSaved') {
      RowData.current = {}
    }

    if (type === 'onSaving') {
      data.cancel = true // Prevent default saving

      if (data.changes && data.changes.length > 0) {
        for (let change of data.changes) {
          let originalRow = RowData[change.key] || {}
          let newRow = { ...originalRow, ...change.data }

          // 🚨 Check if both "Margin" and "FixPrice" are edited
          if ('Margin' in change.data && 'FixPrice' in change.data) {
            console.log(`❌ Not allowed: Cannot edit both "Margin" and "FixPrice" in row ${change.key}`)
            return // Stop execution, prevent saving
          }

          updatedRows.push(newRow)
        }
      }
    }

    // ❌ Stop saving if there are no valid updates
    if (updatedRows.length === 0) return

    // ✅ Proceed with saving if validation passes
    const resp = await setProductsForSetup({ JSON: JSON.stringify(updatedRows) })
    if (!resp.data.Error) {
      setRefresh((state) => !state)
    }
  }

  const getData = async (options) => {
    const resp = await axiosInstance.post('Products/GetForSetup', {
      ...options,
      FunctionParameters: JSON.stringify({
        CategoryID,
      }),
    })
    return resp.data
  }

  let [columns, setColumns] = useState([
    {
      columnName: 'Product Name',
      columnKey: 'Name',
      dataType: 'string',
      allowEditing: false,
      // template: (data) => {
      //   return <div className={style.productTemplate}>
      //     <img src="" alt="" />
      //     <div className={style.productTInfo}>{data.Name}</div>
      //   </div>
      // },
    },
    {
      columnName: 'Margin',
      columnKey: 'Margin',
      dataType: 'number',
      alignment: 'right',
      allowEditing: true,
    },
    {
      columnName: 'Fix Price',
      columnKey: 'FixPrice',
      dataType: 'number',
      alignment: 'right',
      allowEditing: true,
    },
    {
      columnName: 'Currency',
      columnKey: 'Currency',
      dataType: 'string',
      allowEditing: false,
    },
    {
      columnName: 'WareHouse',
      columnKey: 'WarehouseName',
      dataType: 'string',
      allowEditing: false,
    },
    {
      columnName: 'Net Price',
      columnKey: 'NetPrice',
      dataType: 'number',
      alignment: 'right',
      allowEditing: false,
    },
  ])

  const grid = useMemo(() => {
    return (
      <Grid
        withCustomStore={true}
        keyExpr={'ID'}
        storeKey={'ID'}
        loadFunction={getData}
        scrollMode={'none'}
        customColumns={columns}
        focusedRowEnabled={false}
        refresh={Refresh}
        editingOptions={{ mode: 'batch', allowUpdating: true, allowDeleting: false }}
        onEvent={(type, data) => onSaving(type, data)}
        updateFunction={(id) => {
          console.log(`update: ${id}`)
        }}
      />
    )
  }, [Refresh])

  return (
    <div className={style.categorySetupContainer}>
      <h2 className={style.categorySetupTitle}>Category Product Setup</h2>
      <header className={style.headerContainer}>
        <div className={style.headerLeft} onClick={() => navigate('/Categories')}>
          <IconLeftArrow /> Back
        </div>
        <div className={style.headerRight}>
          <MainButton label="Save Category" onClick={() => setOpenPopup(true)} />
        </div>
      </header>
      <div className={style.gridWrapper}>{grid}</div>
    </div>
  )
}

export default CategoryProductSetup
