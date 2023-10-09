function format(date: Date) {
  const now = new Date()
  const isThisYear = date.getFullYear() === now.getFullYear()
  const formatter = new Intl.DateTimeFormat(navigator.language, {
    year: isThisYear ? undefined : 'numeric',
    month: isThisYear ? 'short' : '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
  return formatter.format(date)
}

export function datesString(start: Date, end: Date) {
  return `${format(start)} — ${format(end)}`
}
