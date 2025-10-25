import content from '../content/content.json'

export const getContent = (section, lang='en') => {
  const data = content[lang] || content['en']
  return data[section] || {}
}
