export const notificationStyle = (type) => {
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
