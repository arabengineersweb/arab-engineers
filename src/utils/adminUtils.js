// Admin utilities for managing content and styles
export const adminUtils = {
  // Save content to localStorage (in production, this would be an API call)
  saveContent: async (content) => {
    try {
      localStorage.setItem('adminContent', JSON.stringify(content))
      return { success: true, message: 'Content saved successfully!' }
    } catch (error) {
      return { success: false, message: 'Error saving content' }
    }
  },

  // Save styles to localStorage (in production, this would be an API call)
  saveStyles: async (styles) => {
    try {
      localStorage.setItem('adminStyles', JSON.stringify(styles))
      return { success: true, message: 'Styles saved successfully!' }
    } catch (error) {
      return { success: false, message: 'Error saving styles' }
    }
  },

  // Save edit history
  saveEditHistory: async (history) => {
    try {
      localStorage.setItem('adminEditHistory', JSON.stringify(history))
      return { success: true }
    } catch (error) {
      return { success: false }
    }
  },

  // Load content from localStorage
  loadContent: () => {
    try {
      const content = localStorage.getItem('adminContent')
      return content ? JSON.parse(content) : null
    } catch (error) {
      console.error('Error loading content:', error)
      return null
    }
  },

  // Load styles from localStorage
  loadStyles: () => {
    try {
      const styles = localStorage.getItem('adminStyles')
      return styles ? JSON.parse(styles) : null
    } catch (error) {
      console.error('Error loading styles:', error)
      return null
    }
  },

  // Load edit history
  loadEditHistory: () => {
    try {
      const history = localStorage.getItem('adminEditHistory')
      return history ? JSON.parse(history) : []
    } catch (error) {
      console.error('Error loading edit history:', error)
      return []
    }
  },

  // Add edit to history
  addEditToHistory: (edit) => {
    try {
      const history = adminUtils.loadEditHistory()
      const newEdit = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...edit
      }
      history.unshift(newEdit) // Add to beginning
      
      // Keep only last 50 edits
      if (history.length > 50) {
        history.splice(50)
      }
      
      adminUtils.saveEditHistory(history)
      return newEdit
    } catch (error) {
      console.error('Error adding edit to history:', error)
      return null
    }
  },

  // Reset to original content and styles
  resetToOriginal: () => {
    try {
      localStorage.removeItem('adminContent')
      localStorage.removeItem('adminStyles')
      localStorage.removeItem('adminEditHistory')
      
      // Add reset action to history
      adminUtils.addEditToHistory({
        type: 'reset',
        section: 'all',
        field: 'all',
        action: 'Reset to original content and styles',
        oldValue: 'Modified content/styles',
        newValue: 'Original content/styles'
      })
      
      return { success: true, message: 'Reset to original content and styles successfully!' }
    } catch (error) {
      return { success: false, message: 'Error resetting content' }
    }
  },

  // Apply styles to the document
  applyStyles: (styles) => {
    const root = document.documentElement
    
    if (styles.primaryColor) {
      root.style.setProperty('--primary', styles.primaryColor)
    }
    
    if (styles.secondaryColor) {
      root.style.setProperty('--secondary', styles.secondaryColor)
    }
    
    if (styles.accentColor) {
      root.style.setProperty('--accent', styles.accentColor)
    }
    
    if (styles.tertiaryColor) {
      root.style.setProperty('--tertiary', styles.tertiaryColor)
    }
    
    if (styles.fontFamily) {
      root.style.setProperty('--font-family', styles.fontFamily)
    }
    
    if (styles.headingSize) {
      root.style.setProperty('--heading-size', `${styles.headingSize}rem`)
    }
    
    if (styles.textSize) {
      root.style.setProperty('--text-size', `${styles.textSize}rem`)
    }
  },

  // Check if user is authenticated as admin
  isAuthenticated: () => {
    return localStorage.getItem('adminAuthenticated') === 'true'
  },

  // Logout admin
  logout: () => {
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminContent')
    localStorage.removeItem('adminStyles')
    localStorage.removeItem('adminEditHistory')
  }
}

// Enhanced content loader that checks for admin overrides
export const getAdminContent = (section, lang = 'en') => {
  const adminContent = adminUtils.loadContent()
  
  if (adminContent && adminContent[lang] && adminContent[lang][section]) {
    return adminContent[lang][section]
  }
  
  // Fallback to original content
  const originalContent = require('../content/content.json')
  return originalContent[lang][section] || {}
}

// Enhanced style manager that checks for admin overrides
export const getAdminStyle = (styleKey) => {
  const adminStyles = adminUtils.loadStyles()
  
  if (adminStyles && adminStyles[styleKey]) {
    return adminStyles[styleKey]
  }
  
  // Fallback to original styles
  const originalStyles = require('../content/styles.json')
  return originalStyles[styleKey] || ''
}
