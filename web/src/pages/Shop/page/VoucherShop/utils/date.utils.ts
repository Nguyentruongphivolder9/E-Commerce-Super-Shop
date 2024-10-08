export function localToGMTStingTime(localTime: any) {
  const date = localTime ? new Date(localTime) : new Date()
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString()
}

export function GMTToLocalStingTime(GMTTime: any) {
  const date = GMTTime ? new Date(GMTTime) : new Date()
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString()
}
