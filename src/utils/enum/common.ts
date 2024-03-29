export const getDay = (dateString: string): string => {
  const date = new Date(dateString)
  const options = { weekday: 'short' as const }
  return new Intl.DateTimeFormat('en-US', options).format(date)
}
