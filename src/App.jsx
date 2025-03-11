import { Route, Routes, useNavigate, useLocation, createSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { SetTheme } from './redux/Theme/ThemeStore'
import { routes } from './routes/router.jsx'

function App() {
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const location = useLocation()

  const postMessageToParent = () => {
    const routeObj = {}
    const queryObj = {}

    if (location.search.length) {
      const cleanedString = location.search.substring(1)
      const keyValuePairs = cleanedString.split('&')
      keyValuePairs.forEach((pair) => {
        const [key, value] = pair.split('=')
        const cleanedValue = value.replace(/\+/g, ' ')
        queryObj[key] = cleanedValue
      })
    }

    routeObj.query = queryObj
    routeObj.path = location.pathname

    try {
      window.parent.postMessage(
        {
          action: 'navigationFromChild',
          value: routeObj,
        },

        '*'
      )
    } catch (e) {
      console.log('navigation From child error', e)
    }
  }

  useEffect(() => {
    const body = document.querySelector('body')

    const html = document.querySelector('html')

    try {
      window.parent.postMessage(
        {
          action: 'childProjectLoaded',
          value: 'child Project loadeeed',
        },
        '*'
      )
    } catch (e) {
      console.log('Child Project not Loaded', e)
    }

    const themeChangedHandler = (theme) => {
      theme === 'dark'
        ? (body.classList.add('theme_dark'), html.classList.add('theme_dark'), setThemeLight(false))
        : (body.classList.remove('theme_dark'), html.classList.remove('theme_dark'), setThemeLight(true))
      try {
        window.parent.postMessage(
          {
            action: 'theme-changed',
            value: theme,
          },

          '*'
        )
      } catch (e) {
        console.log('theme-errorr', e)
      }
    }

    const messageHandler = (event) => {
      const { data } = event

      switch (data.action) {
        case 'navigation':
          const { url } = data.payload

          try {
            window.parent.postMessage(
              {
                action: 'childProjectCheck',
                value: url,
              },

              '*'
            )
          } catch (e) {
            console.log('childCheck error', e)
          }

          if (data.payload.query) {
            navigate({
              pathname: `/vending/oneadmin/front${url}`,
              search: createSearchParams({
                ...data.payload.query,
              }).toString(),
            })
          } else {
            navigate({
              pathname: `/vending/oneadmin/front${url}`,
              replace: true,
            })
          }
          break

        case 'settings':
          if (data.payload.theme === 'light') {
            themeChangedHandler('light')
            dispatch(SetTheme('light'))
          } else {
            themeChangedHandler('light')
            dispatch(SetTheme('dark'))
          }

          break
        default:
      }
    }

    window.addEventListener('message', messageHandler)

    return () => {
      window.removeEventListener('message', messageHandler)
    }
  }, [])

  useEffect(() => {
    postMessageToParent()
  }, [location])

  return (
    <div id="mainContainer" className={`main-container`}>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  )
}

export default App
