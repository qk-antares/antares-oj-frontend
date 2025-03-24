import { HOME_URL } from '@/config/config'

const verfyEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

const redirect = () => {
  const redirectUrl = new URLSearchParams(window.location.search).get(
    'redirect_url',
  )

  if (redirectUrl) {
    window.location.href = redirectUrl
  } else {
    window.location.href = HOME_URL
  }
}

export { redirect, verfyEmail }
