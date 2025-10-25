import content from '../content/content.json'
import { adminUtils } from './adminUtils'

export const getContent = (section, lang='en') => {
  // Check for admin overrides first
  const adminContent = adminUtils.loadContent()
  if (adminContent && adminContent[lang] && adminContent[lang][section]) {
    return adminContent[lang][section]
  }
  
  // Fallback to original content
  const data = content[lang] || content['en']
  return data[section] || {}
}
