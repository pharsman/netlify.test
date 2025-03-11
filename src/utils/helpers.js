// const __formatDate = (dateOrTimestamp, format) => {
//   let date
//   if (dateOrTimestamp instanceof Date) {
//     date = dateOrTimestamp
//   } else if (typeof dateOrTimestamp === 'number') {
//     date = new Date(dateOrTimestamp)
//   } else if (typeof dateOrTimestamp === 'string') {
//     date = new Date(dateOrTimestamp)
//   } else {
//     throw new Error('Invalid date or timestamp provided.')
//   }

import dayjs from 'dayjs'
import * as XLSX from 'xlsx'

//   const tokens = {
//     YYYY: date.getUTCFullYear().toString(),
//     MM: (date.getUTCMonth() + 1).toString().padStart(2, '0'),
//     DD: date.getUTCDate().toString().padStart(2, '0'),
//     HH: date.getUTCHours().toString().padStart(2, '0'),
//     mm: date.getUTCMinutes().toString().padStart(2, '0'),
//     ss: date.getUTCSeconds().toString().padStart(2, '0'),
//     ms: date.getUTCMilliseconds().toString().padStart(3, '0'),
//   }

//   const formatTokens = Object.keys(tokens).join('|')
//   const formattedString = format.replace(
//     new RegExp(formatTokens, 'g'),
//     (match) => tokens[match],
//   )

//   return formattedString
// }
const __toExcel = (base64String, fileName) => {
  // Decode the Base64 string
  const decodedData = atob(base64String)

  // Convert the decoded data to a Uint8Array
  const arrayBuffer = new ArrayBuffer(decodedData.length)
  const uint8Array = new Uint8Array(arrayBuffer)
  for (let i = 0; i < decodedData.length; i++) {
    uint8Array[i] = decodedData.charCodeAt(i)
  }

  // Create a Blob object from the Uint8Array
  const blob = new Blob([uint8Array], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

  // Create a download link for the Blob object
  const downloadLink = document.createElement('a')
  downloadLink.href = URL.createObjectURL(blob)
  downloadLink.download = fileName + '.xlsx'

  // Trigger the download
  downloadLink.click()
}

const __toWord = (base64String, fileName) => {
  // Decode the Base64 string
  const decodedData = atob(base64String)

  // Convert the decoded data to a Uint8Array
  const arrayBuffer = new ArrayBuffer(decodedData.length)
  const uint8Array = new Uint8Array(arrayBuffer)
  for (let i = 0; i < decodedData.length; i++) {
    uint8Array[i] = decodedData.charCodeAt(i)
  }

  // Create a Blob object from the Uint8Array
  const blob = new Blob([uint8Array], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })

  // Create a download link for the Blob object
  const downloadLink = document.createElement('a')
  downloadLink.href = URL.createObjectURL(blob)
  downloadLink.download = fileName + '.docx'

  // Trigger the download
  downloadLink.click()
}

const __formatDate = (dateOrTimestamp, format) => {
  let date
  if (dateOrTimestamp instanceof Date) {
    date = dateOrTimestamp
  } else if (typeof dateOrTimestamp === 'number') {
    date = new Date(dateOrTimestamp)
  } else if (typeof dateOrTimestamp === 'string') {
    date = new Date(dateOrTimestamp)
  } else {
    throw new Error('Invalid date or timestamp provided.')
  }

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())

  const tokens = {
    YYYY: date.getUTCFullYear().toString(),
    MM: (date.getUTCMonth() + 1).toString().padStart(2, '0'),
    DD: date.getUTCDate().toString().padStart(2, '0'),
  }

  const formattedString = format.replace(/YYYY/g, tokens.YYYY).replace(/MM/g, tokens.MM).replace(/DD/g, tokens.DD)

  return formattedString
}

const __formatStringDate = (dateString) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const date = new Date(dateString)
  const day = date.getDate()
  const monthIndex = date.getMonth()
  const month = months[monthIndex]

  return `${day} ${month}`
}

const __formatDatStringWithWeek = (inputDate, returnWeekDay) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const date = new Date(inputDate)

  const day = date.getDate()
  const month = months[date.getMonth()]
  const dayOfWeek = daysOfWeek[date.getDay()]

  const formattedDate = `${day} ${month}`
  return !returnWeekDay ? formattedDate : dayOfWeek
}

const __scrolltoBottom = (domElement) => {
  let domEl = document.querySelector(domElement)
  domEl.scrollTo({ top: domEl.scrollHeight, behavior: 'smooth' })
}

const __findObjectKeyByValue = (value, object) => {
  const entry = Object.entries(object).find(([key, val]) => val === value)
  return entry ? entry[0] : null
}

const __timeToSeconds = (timeString) => {
  if (!timeString) return
  const [hours, minutes] = timeString.split(':').map(Number)
  const seconds = (hours * 60 + minutes) * 60
  return seconds
}

const __secondsToHours = (seconds) => {
  //returns int
  if (typeof seconds !== 'number' || seconds < 0) {
    throw new Error('Input must be a non-negative number.')
  }

  const hours = Math.floor(seconds / 3600)
  return hours
}

const __timeToTimestamp = (timeString) => {
  if (!timeString) return
  const [hours, minutes] = timeString.split(':').map(Number)
  const dateObj = new Date()
  dateObj.setHours(hours)
  dateObj.setMinutes(minutes)
  dateObj.setSeconds(0)

  const timestamp = Math.floor(dateObj.getTime() / 1000)
  return timestamp
}

const __formatSecondsToHHMM = (seconds) => {
  if (/^\d{2}:\d{2}$/.test(seconds)) {
    return seconds
  }

  if (isNaN(seconds) || seconds < 0) {
    return 'Invalid input'
  }
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  const formattedHours = String(hours).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')

  return `${formattedHours}:${formattedMinutes}`
}

const __formatTimeToHHMM = (time) => {
  if (!time) return
  const [hours, minutes] = time.split(':').map(Number)
  const fHours = String(hours).padStart(2, '0')
  const fMinutes = String(minutes).padStart(2, '0')
  return `${fHours}:${fMinutes}`
}

const __minutesToSeconds = (minutes) => {
  return minutes ? minutes * 60 : null
}

const __secondsToMinutes = (seconds) => {
  return seconds ? seconds / 60 : null
}

const __log = (title, ...args) => {
  console.log(`%c${title} --->> ${typeof args}`, 'background:#3d3d3d;padding: 4px;border-radius: 2px;color:#fff;border: 1px solid #3d3d', ...args)
}

const __roundTimeString = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number)
  const roundedHours = minutes <= 30 ? hours : hours + 1
  const roundedMinutes = minutes < 30 ? 0 : 0
  return `${String(roundedHours).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')}`
}

const __convertToRem = (px, base = 16) => {
  let tempPx = px
  if (typeof px === 'string' || px instanceof String) tempPx = tempPx.replace('px', '')

  tempPx = parseInt(tempPx)
  return (1 / base) * tempPx + 'rem'
}
const __formatSecondsToHoursAndMinutes = (seconds) => {
  // Convert seconds to milliseconds
  const milliseconds = seconds * 1000

  // Create a dayjs duration object from milliseconds
  const duration = dayjs.duration(milliseconds)

  // Get the hours and minutes from the duration
  const hours = duration.hours()
  const minutes = duration.minutes()

  // Format the hours and minutes
  const formattedDuration = `${(hours > 0 ? hours : '') + (hours > 0 ? ' hr' : '')} ${minutes === 0 ? '' : minutes < 10 ? '0' : ''}${
    minutes === 0 ? '' : minutes + ' min'
  }`

  // Return the formatted duration
  return formattedDuration
}

const __toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = (error) => reject(error)
  })

const __calculateDateByCycle = (startDate, cycle) => {
  const startDateObj = new Date(startDate)
  if (isNaN(startDateObj.getTime())) {
    return 'Invalid start date'
  }
  const endDate = new Date(startDateObj.getTime() + cycle * 7 * 24 * 60 * 60 * 1000)
  const endDateFormatted = endDate.toISOString().split('T')[0]
  return endDateFormatted
}

const __getMonthEndDate = (year, month) => {
  console.log(month)
  const date = new Date(year, month, 0)
  const formattedDate = date.toISOString().split('T')[0]
  return formattedDate
}

const __formatMinutesToHoursAndMinutes = (minutes) => {
  const isNegative = minutes < 0
  const absoluteMinutes = Math.abs(minutes)

  const hours = Math.floor(absoluteMinutes / 60)
  const remainingMinutes = absoluteMinutes % 60

  if (hours === 0) {
    if (isNegative) {
      return `-${remainingMinutes} min${remainingMinutes !== 1 ? 's' : ''}`
    }
    return `${remainingMinutes} min${remainingMinutes !== 1 ? 's' : ''}`
  } else if (remainingMinutes === 0) {
    if (isNegative) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    }
    return `${hours} hour${hours !== 1 ? 's' : ''}`
  } else {
    if (isNegative) {
      return `-${hours} hr & ${remainingMinutes} min`
    }
    return `${hours} hr & ${remainingMinutes} min`
  }
}

const __formatTimeStringToHHmm = (inputTimeString, withHM) => {
  var timeParts = inputTimeString.split(':')

  if (timeParts.length >= 2) {
    var hours = parseInt(timeParts[0])
    var minutes = parseInt(timeParts[1])

    if (!isNaN(hours) && !isNaN(minutes)) {
      hours = (hours < 10 ? '0' : '') + hours
      minutes = (minutes < 10 ? '0' : '') + minutes
      return !withHM ? hours + ':' + minutes : hours + 'hr' + ' ' + minutes + 'min'
    }
  }

  return 'Invalid Time Format'
}

const __toLocalDate = (date, withHours, joinSymb) => {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  if (!withHours) {
    return (withHours = [year, month, day].join(joinSymb ? joinSymb : '-'))
  } else {
    return (
      (withHours = [year, month, day].join('-') + 'T' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')) +
      ':' +
      String(d.getMinutes()).padStart(2, '0')
    )
  }
}
const __isMobileOrBelowDesktopSize = () => {
  const screenWidth = window.innerWidth
  const desktopWidth = 768
  const userAgent = navigator.userAgent
  const screenCheck = screenWidth < desktopWidth
  const userAgentCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  return screenCheck || userAgentCheck
}

const __calculateSecondsFromDecimalOrInt = (time) => {
  if (isNaN(time) || typeof time !== 'number') return null
  const timeString = time.toString()
  const hasDecimal = timeString.includes('.')
  let hours, minutes
  if (hasDecimal) {
    const [hoursStr, minutesStr] = timeString.split('.').map((str) => str.trim())
    hours = parseInt(hoursStr, 10)
    minutes = parseInt(minutesStr, 10) || 0
  } else {
    hours = parseInt(timeString, 10)
    minutes = 0
  }
  if (isNaN(hours) || isNaN(minutes)) return null

  const seconds = hours * 3600 + minutes * 60
  return seconds
}

const __secondsToTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
  return `${formattedHours}:${formattedMinutes}`
}

const __debounce = (func, delay) => {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

const s2ab = (s) => {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
  return buf
}

const __downloadExcel = (data, title) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.error('Invalid data format')
    return
  }

  const maxColumns = Math.max(...data.map((row) => row.length))
  const formattedData = data.map((row) => Array.from({ length: maxColumns }, (_, i) => (row[i] !== undefined ? row[i] : '')))

  const ws = XLSX.utils.aoa_to_sheet(formattedData)

  const columnWidths = formattedData[0].map((_, colIndex) => ({
    wch: Math.max(
      ...formattedData.map((row) => (row[colIndex] ? row[colIndex].toString().length : 10)) // Default width 10
    ),
  }))
  ws['!cols'] = columnWidths

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

  const wbBinaryString = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })

  function s2ab(s) {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff
    }
    return buf
  }

  const blob = new Blob([s2ab(wbBinaryString)], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = title + '.xlsx'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  URL.revokeObjectURL(url)
}

const __toFixedNoRounding = (numberPlace, decimalPlaces) => {
  let number = numberPlace

  if (number === 0) return '0'
  if (number === null) return null
  if (number === '') return ''
  if (Number.isInteger(number)) return Math.floor(number)

  number = number
    .toFixed(decimalPlaces + 1)
    .toString()
    .slice(0, -1)

  return number
}

export {
  __formatDate,
  __scrolltoBottom,
  __findObjectKeyByValue,
  __timeToSeconds,
  __toLocalDate,
  __formatTimeStringToHHmm,
  __timeToTimestamp,
  __formatSecondsToHHMM,
  __formatTimeToHHMM,
  __secondsToHours,
  __secondsToMinutes,
  __minutesToSeconds,
  __formatStringDate,
  __log,
  __roundTimeString,
  __convertToRem,
  __toBase64,
  __formatMinutesToHoursAndMinutes,
  __calculateDateByCycle,
  __getMonthEndDate,
  __formatDatStringWithWeek,
  __isMobileOrBelowDesktopSize,
  __calculateSecondsFromDecimalOrInt,
  __secondsToTime,
  __formatSecondsToHoursAndMinutes,
  __debounce,
  __toExcel,
  __toWord,
  __downloadExcel,
  __toFixedNoRounding,
}
