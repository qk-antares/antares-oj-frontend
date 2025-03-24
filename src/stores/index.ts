import { createPinia } from 'pinia'
import useUserStore from './user'

const pinia = createPinia()

export { useUserStore }
export default pinia
