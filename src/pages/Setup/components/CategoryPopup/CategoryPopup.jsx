import { useEffect, useState } from 'react'
import style from './CategoryPopup.module.scss'
import { Popup, MainButton, FormInput, FileUploader, createToastNotification } from 'master-components-react'
import close from '@/assets/icons/close.svg?raw'
import { setCategoryUpdate } from '../../api/CategoryApi'
import { CREATE_CATEGORY } from '../../static/StaticCategory'

const CategoryPopup = ({ setOpenPopup, listReload, editMode, setEditMode, editData }) => {
  const [Flag, setFlag] = useState(false)

  const [ButtonLoader, setButtonLoader] = useState(false)

  const notificationStyle = (type) => {
    if (type === 'error') {
      return {
        contentStyle: {
          backgroundColor: '#FB8383',
          borderLeft: '2px solid #DA1A1C',
        },
        textStyle: { color: '#141719' },
      }
    }
  }

  const onUpdateValue = (value, element) => {
    element.value = value
    setFlag((state) => !state)
  }

  const HandleCreate = () => {
    let fields = CREATE_CATEGORY

    if (editMode) {
      if (fields.some((el) => el.component !== 'FileUploader' && el.value === '')) {
        createToastNotification('Please fill all the fields', 2500, 'bottom-right', null, null, close, notificationStyle('error'))
        return
      }
    } else {
      if (fields.some((el) => el.value === '')) {
        createToastNotification('Please fill all the fields', 2500, 'bottom-right', null, null, close, notificationStyle('error'))
        return
      }
    }

    let name = fields.find((element) => element.key === 'Name').value
    let margin = fields.find((element) => element.key === 'Margin').value
    let image = fields.find((element) => element.key === 'Image')?.value?.[0]?.base64 ?? null

    let params = {
      Name: name,
      Margin: +margin,
    }
    if (image) {
      params.Image = image
    }

    if (editMode) {
      params.ID = editData.ID
    }

    setButtonLoader(true)
    setCategoryUpdate(params).then((resp) => {
      if (!resp.data.Error) {
        setOpenPopup(false)
        listReload()
        CancelPopup()
      }
      setButtonLoader(false)
    })
  }

  const CancelPopup = () => {
    CREATE_CATEGORY.forEach((element) => {
      element.value = ''
    })
    setEditMode(false)
    setOpenPopup(false)
  }

  useEffect(() => {
    if (editMode) {
      CREATE_CATEGORY.forEach((element) => {
        if (element.key === 'Name') {
          element.value = editData.Name
        }
        if (element.key === 'Margin') {
          element.value = editData.Margin
        }
        if (element.key === 'Image') {
          element.required = false
        }
      })
      setFlag((state) => !state)
    }
  }, [editMode])

  return (
    <Popup visible={true} size={'small'} popupContainerStyle={{ width: '31.25rem' }}>
      <div className={style.categoryPopupContainer}>
        <div className={style.categoryPopupTitle}>
          <p>Create Category</p>
        </div>
        <div className={style.categoryPopupContent}>
          {CREATE_CATEGORY.map((element, index) => {
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

export default CategoryPopup
