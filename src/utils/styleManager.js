import styles from '../content/styles.json'
import { adminUtils } from './adminUtils'

export const getStyle = (key) => {
  // Check for admin overrides first
  const adminStyles = adminUtils.loadStyles()
  if (adminStyles && adminStyles[key]) {
    return adminStyles[key]
  }
  
  // Fallback to original styles
  return styles[key]
}
