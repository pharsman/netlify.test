import { useEffect, useState } from 'react'
import style from './ProductsPopup.module.scss'
import { Popup, MainButton, FormInput, FileUploader, createToastNotification, Dropdown, Radio } from 'master-components-react'
import close from '@/assets/icons/close.svg?raw'
import { setProductsUpdate } from '@/pages/Setup/api/ProductsApi'
import { CREATE_PRODUCT } from '../../static/StaticProducts'
import { notificationStyle } from '@/utils/notificationStyle'

const ProductsPopup = ({ setOpenPopup, listReload, editMode, setEditMode, editData, categories }) => {
  const [Flag, setFlag] = useState(false)

  const [ButtonLoader, setButtonLoader] = useState(false)

  const onSearch = (value, element) => {
    let filteredData = categories.filter((el) => el.label.toLowerCase().includes(value.toLowerCase()))

    element.data = filteredData
    if (value === '') {
      element.data = categories
    }

    setFlag((state) => !state)
  }

  const hasEmptyRequiredFields = (fields) => {
    return fields.some((field) => {
      if (field.component === 'Group' && Array.isArray(field.fields)) {
        return field.fields.some((subField) => subField.required === true && subField.value === '')
      }

      if (field.required in field && field.value === '') {
        return true
      }

      return false
    })
  }

  const onUpdateValue = (value, element, group = false, otherElement) => {
    if (group) {
      element.subField.checked = true
      element.value = element.subField.checked ? element.value : ''
      element.required = element.subField.checked
      otherElement.subField.checked = false
      otherElement.value = otherElement.subField.checked ? otherElement.value : ''
      otherElement.required = otherElement.subField.checked
    } else {
      if (Object.keys(value).length === 0) {
        element.value = ''
      } else {
        element.value = value
      }
    }
    setFlag((state) => !state)
  }

  const HandleCreate = () => {
    let fields = CREATE_PRODUCT

    if (hasEmptyRequiredFields(CREATE_PRODUCT)) {
      createToastNotification('Please fill all the fields', 2500, 'bottom-right', null, null, close, notificationStyle('error'))
      return
    }

    let name = fields.find((element) => element.key === 'Name').value
    let categoryID = fields.find((element) => element.key === 'CategoryID').value.id
    let image = fields.find((element) => element.key === 'Image')?.value?.[0]?.base64 ?? null
    let weight = fields.find((element) => element.component === 'Group').fields[0].value
    let volume = fields.find((element) => element.component === 'Group').fields[1].value

    let params = {
      Name: name,
      CategoryID: +categoryID,
      Inactive: false,
      Weight: +weight !== 0 ? +weight : null,
      Volume: +volume !== 0 ? +volume : null,
    }

    if (image) {
      params.Image = image
    }

    if (editMode) {
      params.ID = editData.ID
    }

    setButtonLoader(true)
    setProductsUpdate(params).then((resp) => {
      if (!resp.data.Error) {
        CancelPopup()
        setOpenPopup(false)
        listReload()
      }
      setButtonLoader(false)
    })
  }

  const CancelPopup = () => {
    CREATE_PRODUCT.forEach((element) => {
      if (element.component === 'Group') {
        element.fields[0].subField.checked = true
        element.fields[0].value = ''
        element.fields[1].subField.checked = false
        element.fields[1].value = ''
      }
      element.value = ''
      element.selectedOptionID = null
    })
    setEditMode(false)
    setOpenPopup(false)
  }

  useEffect(() => {
    if (editMode) {
      CREATE_PRODUCT.forEach((element) => {
        if (element.key === 'Name') {
          element.value = editData.ProductName
        }
        if (element.key === 'CategoryID') {
          element.value = { id: editData.CategoryID, label: editData.CategoryName }
          element.selectedOptionID = editData.CategoryID
        }
        if (element.component === 'Group' && element.fields[0].key === 'Weight') {
          element.fields[0].value = editData?.Weight ?? ''
          element.fields[0].subField.checked = editData?.Weight ? true : false
          element.fields[0].subField.required = editData?.Weight ? true : false
        }
        if (element.component === 'Group' && element.fields[1].key === 'Volume') {
          element.fields[1].value = editData?.Volume ?? ''
          element.fields[1].subField.checked = editData?.Volume ? true : false
          element.fields[1].subField.required = editData?.Volume ? true : false
        }
        if (element.key === 'Image') {
          element.required = false
        }
      })
      setFlag((state) => !state)
    } else {
      CREATE_PRODUCT.forEach((element) => {
        if (element.key === 'Image') {
          element.required = true
        }
      })
      setFlag((state) => !state)
    }
  }, [editMode])

  return (
    <Popup visible={true} size={'small'} popupContainerStyle={{ width: '36.25rem' }}>
      <div className={style.categoryPopupContainer}>
        <div className={style.categoryPopupTitle}>
          <p>Create Category</p>
        </div>
        <div className={style.categoryPopupContent}>
          {CREATE_PRODUCT.map((element, index) => {
            return (
              <div key={index}>
                {element.component === 'FormInput' ? (
                  <FormInput
                    label={element.label}
                    placeholder={element.placeholder}
                    value={element.value}
                    type={element.inputType}
                    required={element.required}
                    onChange={(value) => onUpdateValue(value, element)}
                  />
                ) : element.component === 'Dropdown' ? (
                  <Dropdown
                    label={element.label}
                    placeholder={element.placeholder}
                    value={element.value}
                    data={element.data}
                    type={element.inputType}
                    required={element.required}
                    selectedOptionID={element.selectedOptionID}
                    onSelect={(value) => onUpdateValue(value, element)}
                    onSearch={(value) => onSearch(value, element)}
                  />
                ) : element.component === 'Group' ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', width: '11.25rem', flexShrink: 0 }}>
                      <div>
                        <Radio checked={element.fields[0].subField.checked} change={() => onUpdateValue(null, element.fields[0], true, element.fields[1])} />
                      </div>
                      <div>
                        <FormInput
                          label={element.fields[0].label}
                          placeholder={element.fields[0].placeholder}
                          value={element.fields[0].value}
                          type={element.fields[0].inputType}
                          required={element.fields[0].subField.checked}
                          disabled={element.fields[1].subField.checked}
                          inputContainerStyle={{ marginBottom: 0 }}
                          onChange={(value) => onUpdateValue(value, element.fields[0])}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', width: '11.25rem' }}>
                      <div>
                        <Radio checked={element.fields[1].subField.checked} change={() => onUpdateValue(null, element.fields[1], true, element.fields[0])} />
                      </div>
                      <div>
                        <FormInput
                          label={element.fields[1].label}
                          placeholder={element.fields[1].placeholder}
                          value={element.fields[1].value}
                          type={element.fields[1].inputType}
                          required={element.fields[1].subField.checked}
                          disabled={element.fields[0].subField.checked}
                          inputContainerStyle={{ marginBottom: 0 }}
                          onChange={(value) => onUpdateValue(value, element.fields[1])}
                        />
                      </div>
                    </div>
                  </div>
                ) : element.component === 'FileUploader' ? (
                  <FileUploader
                    title={() => <p className={style.fileUploaderTitle}>Upload Files {element.required ? <span className={'required'}>*</span> : null}</p>}
                    subTitle={() => <p className={style.fileUploaderSubTitle}>Only .jpg and .png files. 25 MB max file size.</p>}
                    withFileValidation={true}
                    acceptedFileFormats={['jpg', 'png']}
                    maxSize={25000000}
                    onChange={(value) => onUpdateValue(value, element)}
                    onMaxSizeError={() =>
                      createToastNotification('File size is too large', 2500, 'bottom-right', null, null, close, notificationStyle('error'))
                    }
                    onFormatError={() => createToastNotification('Invalid file format', 2500, 'bottom-right', null, null, close, notificationStyle('error'))}
                    multiple={false}
                  />
                ) : null}
              </div>
            )
          })}
        </div>
        <div className={style.buttons}>
          <MainButton
            label={'Cancel'}
            buttonStyle={{ backgroundColor: 'transparent', border: '1px solid #141719', color: '#141719' }}
            labelStyle={{ fontWeight: 700, color: '#141719' }}
            onClick={CancelPopup}
          />
          <MainButton label={'Confirm'} onClick={HandleCreate} loading={ButtonLoader} />
        </div>
      </div>
    </Popup>
  )
}

export default ProductsPopup
