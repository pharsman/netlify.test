import { useEffect, useRef, useState } from 'react'
import style from './DropdownAction.module.scss'
import { IconDelete } from '@/assets/svgComponents/IconDelete'
import { IconEdit } from '@/assets/svgComponents/IconEdit'

const DropdownAction = ({ visible, onExpand, actions, itemID, align, ActionPosition = 'right' }) => {
  const ActionButtonRef = useRef(null)
  const ExpandableRef = useRef(null)

  

  const ActionClick = (event, action) => {
    event.stopPropagation()
    if (action.event && typeof action.event === 'function') {
      action.event(action.type, itemID)
    }
  }

  const ToggleExpand = (event) => {
    event.stopPropagation()
    if (onExpand && typeof onExpand === 'function') {
      onExpand(!visible)
    }
  }

  const _getDefaultActionIcon = (action) => {
    let icon
    const defaultActionTypes = ['delete', 'edit']
    if (action.type && defaultActionTypes.includes(action.type)) {
      switch (String(action.type)) {
        case 'delete': {
          icon = <IconDelete />
          break
        }
        case 'edit': {
          icon = <IconEdit />
          break
        }
      }
    } else icon = 'no_icon'

    return icon
  }

  const getActionStyle = () => {
    let style = {}
    if (ActionPosition === 'left') {
      style.left = 'unset'
      style.right = '0'
    }
    return style
  }

  return (
    <div className={style.actionsWrapper}>
      <div className={`${style.moreActionsButton} no-drag`} ref={ActionButtonRef} onClick={ToggleExpand}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <ul style={getActionStyle()} className={align && align === 'right' ? style.alignRight : ''} ref={ExpandableRef}>
        {visible &&
          actions &&
          actions.map((action, ind) => {
            return (
              <li key={ind} onClick={(e) => ActionClick(e, action)} className={'no-drag'}>
                <div className={style.actionIcon}>
                  {_getDefaultActionIcon(action) && _getDefaultActionIcon(action) !== 'no_icon' ? _getDefaultActionIcon(action) : action?.icon()}
                </div>
                <div className={style.actionLabel}>
                  <span style={action?.label == 'Delete' ? { color: '#EF4343', ...action?.style } : { ...action?.style }}>{action?.label}</span>
                </div>
              </li>
            )
          })}
      </ul>
    </div>
  )
}

export default DropdownAction
