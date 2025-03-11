import style from './Vendors.module.scss'
import { MainButton, Grid } from 'master-components-react'
import { useMemo } from 'react'
import axiosInstance from '@/hooks/AxiosInstance'
import { getVendors, setVendorUpdate } from '@/pages/Setup/api/VendorApi'

const Vendors = () => {
  const StatusTemplate = (data) => {
    return (
      <div key={data.data.ID}>
        <Toggle checked={!data.data.Inactive} change={() => changeStatus(data.data.Inactive)} />
      </div>
    )
  }

  const changeStatus = (active) => {
    setVendorUpdate({ ID: product.ID, Inactive: !active }).then((res) => {
      if (!res.data.Error) {
        setToggleState((state) => !state)
      } else {
        if (res.data.Error === 'Cannot_Be_Deleted') {
          notificationError('Cannot_Be_Deleted', 'The product cannot be disabled because it is on stock')
        } else {
          notificationError()
        }
      }
    })
  }

  const getData = async (options) => {
    const resp = await getVendors({...options, })
    return resp.data
  }

  let columns = [
    {
      columnName: 'Vendor ID',
      columnKey: 'ID',
      dataType: 'number',
      alignment: 'right',
    },
    {
      columnName: 'Vendor Name',
      columnKey: 'Name',
      dataType: 'string',
    },
    {
      columnName: 'Identification Code',
      columnKey: 'IdentificationCode',
      dataType: 'number',
      alignment: 'right',
    },
    {
      columnKey: 'VendingStatus',
      columnName: 'Status',
      dataType: 'boolean',
      allowFiltering: false,
      template: StatusTemplate,
    },
  ]

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
        filterOptions={{ filterRow: true, headerFilter: false }}
        withCustomActions={true}
        editingOptions={{ allowUpdating: false, allowDeleting: false }}
        onEdit={(data) => console.log('edit', data)}
        onDelete={(data) => console.log('delete', data)}
      />
    )
  }, [])

  return (
    <div className={style.vendorsContainer}>
      <header className={style.headerContainer}>
        <h2 className={style.vendorsTitle}>Vendors</h2>
        <MainButton label="Save Category" onClick={() => setOpenPopup(true)} />
      </header>
      <div className={style.gridWrapper}>{grid}</div>
    </div>
  )
}

export default Vendors
