const isLocal = location.href.includes('localhost')
const pathPrefix = isLocal ? '' : '/vending/oneadmin/front'
export const blankPathPrefix = isLocal ? '' : '/p/vending'
export default pathPrefix
