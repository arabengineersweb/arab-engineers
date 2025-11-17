import React, { useState, useEffect, useCallback } from 'react'
import { getContent } from '../utils/contentLoader'
import { getStyle } from '../utils/styleManager'
import { adminUtils } from '../utils/adminUtils'
import originalContent from '../content/content.json'
import originalStyles from '../content/styles.json'

export default function AdminPanel({ onLogout }) {
  const [activeTab, setActiveTab] = useState('styles')
  const [content, setContent] = useState({})
  const [styles, setStyles] = useState({})
  const [lang, setLang] = useState('en')
  const [saveStatus, setSaveStatus] = useState('')
  const [editHistory, setEditHistory] = useState([])
  const [pendingChanges, setPendingChanges] = useState([])

  useEffect(() => {
    // Load current content and styles
    loadData()
    // Load edit history
    const history = adminUtils.loadEditHistory()
    setEditHistory(history)
  }, [])

  const loadData = async () => {
    try {
      // Check for admin overrides first
      const adminContent = adminUtils.loadContent()
      const adminStyles = adminUtils.loadStyles()
      
      if (adminContent) {
        setContent(adminContent)
      } else {
        // Use imported original content as fallback
        setContent(originalContent)
      }
      
      if (adminStyles) {
        setStyles(adminStyles)
      } else {
        // Use imported original styles as fallback
        setStyles(originalStyles)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      // Fallback to imported content if anything fails
      setContent(originalContent)
      setStyles(originalStyles)
    }
  }

  const handleContentChange = useCallback((section, field, value) => {
    const originalValue = getOriginalValue(section, field)
    const oldValue = content[lang]?.[section]?.[field] || ''
    
    setContent(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [section]: {
          ...prev[lang][section],
          [field]: value
        }
      }
    }))
    
    // Only track if value is different from original
    updatePendingChange({
      type: 'content',
      section: section,
      field: field,
      action: `Changed ${section} ${field}`,
      oldValue: originalValue,
      newValue: value,
      originalValue: originalValue
    })
  }, [lang, content])

  const getOriginalValue = (section, field, index = null, subField = null, subIndex = null, subSubField = null) => {
    // Get original value from content.json
    const originalData = originalContent[lang] || originalContent['en']
    
    if (subIndex !== null && subSubField !== null) {
      // Handle deeply nested arrays like services.process.steps[index].subField
      return originalData[section]?.[field]?.[index]?.[subField]?.[subIndex]?.[subSubField] || ''
    } else if (index !== null && subField !== null) {
      // Handle nested arrays like features[index].subField
      return originalData[section]?.[field]?.[index]?.[subField] || ''
    } else if (index !== null) {
      // Handle array items like benefits[index]
      return originalData[section]?.[field]?.[index] || ''
    } else {
      // Handle simple fields
      return originalData[section]?.[field] || ''
    }
  }

  const updatePendingChange = useCallback((change) => {
    setPendingChanges(prev => {
      // Remove any existing change for the same field
      const filtered = prev.filter(c => !(c.section === change.section && c.field === change.field))
      
      // Only add if value is different from original
      if (change.newValue !== change.originalValue) {
        return [...filtered, change]
      } else {
        return filtered
      }
    })
  }, [])

  const handleServiceChange = (serviceIndex, field, value) => {
    setContent(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        services: {
          ...prev[lang].services,
          services: prev[lang].services.services.map((service, index) => 
            index === serviceIndex ? { ...service, [field]: value } : service
          )
        }
      }
    }))
  }

  const handleServiceFeatureChange = (serviceIndex, featureIndex, value) => {
    setContent(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        services: {
          ...prev[lang].services,
          services: prev[lang].services.services.map((service, index) => 
            index === serviceIndex ? {
              ...service,
              features: service.features.map((feature, fIndex) => 
                fIndex === featureIndex ? value : feature
              )
            } : service
          )
        }
      }
    }))
  }

  const handleFeatureChange = (featureIndex, field, value) => {
    const originalValue = getOriginalValue('about', 'features', featureIndex, field)
    
    setContent(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        about: {
          ...prev[lang].about,
          features: prev[lang].about.features.map((feature, index) => 
            index === featureIndex ? { ...feature, [field]: value } : feature
          )
        }
      }
    }))
    
    updatePendingChange({
      type: 'content',
      section: 'about',
      field: `feature_${featureIndex}_${field}`,
      action: `Changed About Feature ${featureIndex + 1} ${field}`,
      oldValue: originalValue,
      newValue: value,
      originalValue: originalValue
    })
  }

  const handleStatChange = (statIndex, field, value) => {
    const originalValue = getOriginalValue('about', 'stats', statIndex, field)
    
    setContent(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        about: {
          ...prev[lang].about,
          stats: prev[lang].about.stats.map((stat, index) => 
            index === statIndex ? { ...stat, [field]: value } : stat
          )
        }
      }
    }))
    
    updatePendingChange({
      type: 'content',
      section: 'about',
      field: `stat_${statIndex}_${field}`,
      action: `Changed About Stat ${statIndex + 1} ${field}`,
      oldValue: originalValue,
      newValue: value,
      originalValue: originalValue
    })
  }

  const handleProcessStepChange = (stepIndex, field, value) => {
    const originalValue = getOriginalValue('services', 'process', 'steps', stepIndex, field)
    
    setContent(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        services: {
          ...prev[lang].services,
          process: {
            ...prev[lang].services.process,
            steps: (prev[lang].services.process?.steps || [
              { step: '01', title: 'Consultation', description: 'Understanding your needs and project requirements' },
              { step: '02', title: 'Planning', description: 'Detailed project planning and strategy development' },
              { step: '03', title: 'Execution', description: 'Professional implementation with quality control' },
              { step: '04', title: 'Support', description: 'Ongoing maintenance and support services' }
            ]).map((step, index) => 
              index === stepIndex ? { ...step, [field]: value } : step
            )
          }
        }
      }
    }))
    
    updatePendingChange({
      type: 'content',
      section: 'services',
      field: `process_step_${stepIndex}_${field}`,
      action: `Changed Process Step ${stepIndex + 1} ${field}`,
      oldValue: originalValue,
      newValue: value,
      originalValue: originalValue
    })
  }

  const handleBenefitChange = (benefitIndex, value) => {
    const originalData = originalContent[lang] || originalContent['en']
    const originalValue = originalData?.contact?.whyChooseUs?.benefits?.[benefitIndex] || ''
    
    setContent(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        contact: {
          ...prev[lang].contact,
          whyChooseUs: {
            ...prev[lang].contact.whyChooseUs,
            benefits: prev[lang].contact.whyChooseUs.benefits.map((benefit, index) => 
              index === benefitIndex ? value : benefit
            )
          }
        }
      }
    }))
    
    updatePendingChange({
      type: 'content',
      section: 'contact',
      field: `benefit_${benefitIndex}`,
      action: `Changed Contact Benefit ${benefitIndex + 1}`,
      oldValue: originalValue,
      newValue: value,
      originalValue: originalValue
    })
  }

  const handleFooterLinkChange = (linkIndex, field, value) => {
    const originalValue = getOriginalValue('footer', 'quickLinks', 'links', linkIndex, field)
    
    setContent(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        footer: {
          ...prev[lang].footer,
          quickLinks: {
            ...prev[lang].footer.quickLinks,
            links: (prev[lang].footer?.quickLinks?.links || [
              { text: 'Home', url: '/' },
              { text: 'About Us', url: '/about' },
              { text: 'Services', url: '/services' },
              { text: 'Contact', url: '/contact' }
            ]).map((link, index) => 
              index === linkIndex ? { ...link, [field]: value } : link
            )
          }
        }
      }
    }))
    
    updatePendingChange({
      type: 'content',
      section: 'footer',
      field: `quickLink_${linkIndex}_${field}`,
      action: `Changed Footer Link ${linkIndex + 1} ${field}`,
      oldValue: originalValue,
      newValue: value,
      originalValue: originalValue
    })
  }

  const handleStyleChange = useCallback((field, value) => {
    const originalValue = getOriginalStyleValue(field)
    const oldValue = styles[field] || ''
    
    setStyles(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Only track if value is different from original
    updatePendingChange({
      type: 'style',
      section: 'styles',
      field: field,
      action: `Changed ${field}`,
      oldValue: originalValue,
      newValue: value,
      originalValue: originalValue
    })
  }, [styles])

  const getOriginalStyleValue = (field) => {
    // Get original value from styles.json
    return originalStyles[field] || ''
  }

  const saveContent = async () => {
    try {
      const contentResult = await adminUtils.saveContent(content)
      const stylesResult = await adminUtils.saveStyles(styles)
      
      if (contentResult.success && stylesResult.success) {
        // Apply styles immediately
        adminUtils.applyStyles(styles)
        
        // Log all pending changes to history
        if (pendingChanges.length > 0) {
          const timestamp = new Date().toISOString()
          const sessionId = Date.now()
          
          // Create a summary entry for this save session
          adminUtils.addEditToHistory({
            type: 'save',
            section: 'all',
            field: 'all',
            action: `Saved ${pendingChanges.length} changes`,
            oldValue: 'Previous state',
            newValue: 'Current state',
            sessionId: sessionId,
            changes: pendingChanges.map(change => ({
              ...change,
              timestamp: timestamp,
              sessionId: sessionId
            }))
          })
          
          // Clear pending changes
          setPendingChanges([])
        }
        
        // Reload history
        const history = adminUtils.loadEditHistory()
        setEditHistory(history)
        
        setSaveStatus(`All changes saved successfully! ${pendingChanges.length > 0 ? `(${pendingChanges.length} changes logged)` : ''}`)
      } else {
        setSaveStatus('Error saving some changes')
      }
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      setSaveStatus('Error saving content')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  const resetToOriginal = async () => {
    if (window.confirm('Are you sure you want to reset all content and styles to original? This action cannot be undone.')) {
      try {
        const result = adminUtils.resetToOriginal()
        
        if (result.success) {
          // Reload data
          await loadData()
          
          // Clear pending changes
          setPendingChanges([])
          
          // Reload history
          const history = adminUtils.loadEditHistory()
          setEditHistory(history)
          
          setSaveStatus(result.message)
        } else {
          setSaveStatus(result.message)
        }
        setTimeout(() => setSaveStatus(''), 3000)
      } catch (error) {
        setSaveStatus('Error resetting content')
        setTimeout(() => setSaveStatus(''), 3000)
      }
    }
  }

  const ColorPicker = useCallback(({ value, onChange, label }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="#000000"
        />
      </div>
    </div>
  ), [])

  const FontSelector = useCallback(({ value, onChange, label }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="Poppins, sans-serif">Poppins</option>
        <option value="Inter, sans-serif">Inter</option>
        <option value="Roboto, sans-serif">Roboto</option>
        <option value="Open Sans, sans-serif">Open Sans</option>
        <option value="Lato, sans-serif">Lato</option>
        <option value="Montserrat, sans-serif">Montserrat</option>
        <option value="Nunito, sans-serif">Nunito</option>
        <option value="Source Sans Pro, sans-serif">Source Sans Pro</option>
      </select>
    </div>
  ), [])

  const SizeInput = useCallback(({ value, onChange, label, min = "0.5", max = "5", step = "0.1" }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
        />
        <span className="text-sm text-gray-500">rem</span>
      </div>
    </div>
  ), [])

  const TextArea = useCallback(({ value, onChange, label, rows = 3 }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  ), [])

  const TextInput = useCallback(({ value, onChange, label, placeholder = "" }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  ), [])

  const ImageUpload = useCallback(({ value, onChange, label, accept = "image/*" }) => {
    const handleFileChange = (e) => {
      const file = e.target.files[0]
      if (file) {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size must be less than 5MB')
          return
        }
        
        const reader = new FileReader()
        reader.onloadend = () => {
          onChange(reader.result) // Store as base64 data URL
        }
        reader.readAsDataURL(file)
      }
    }

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="space-y-3">
          {value && (
            <div className="relative">
              <img 
                src={value} 
                alt="Preview" 
                className="w-full max-w-xs h-48 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}
          <div className="flex gap-3">
            <label className="flex-1 cursor-pointer">
              <input
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center transition-colors">
                {value ? 'Change Image' : 'Upload Image'}
              </div>
            </label>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Or enter image URL:
          </div>
          <input
            type="text"
            value={value && !value.startsWith('data:') ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg or /assets/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    )
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Language:</span>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
              <button
                onClick={saveContent}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
              <button
                onClick={resetToOriginal}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Reset to Original
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
              {saveStatus && (
                <span className={`text-sm ${saveStatus.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                  {saveStatus}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-6">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('styles')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'styles' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Theme & Styling
              </button>
              <button
                onClick={() => setActiveTab('hero')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'hero' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Hero Section
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'about' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                About Section
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'services' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Services Section
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'contact' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Contact Section
              </button>
              <button
                onClick={() => setActiveTab('footer')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'footer' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Footer Section
              </button>
              <button
                onClick={() => setActiveTab('images')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'images' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Images & Assets
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'history' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Edit History
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-6">

            {activeTab === 'styles' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Theme & Styling</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Colors</h3>
                    <ColorPicker
                      value={styles.primaryColor || '#004C97'}
                      onChange={(value) => handleStyleChange('primaryColor', value)}
                      label="Primary Color"
                    />
                    <ColorPicker
                      value={styles.secondaryColor || '#F1F5F9'}
                      onChange={(value) => handleStyleChange('secondaryColor', value)}
                      label="Secondary Color"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Typography</h3>
                    <FontSelector
                      value={styles.fontFamily || 'Poppins, sans-serif'}
                      onChange={(value) => handleStyleChange('fontFamily', value)}
                      label="Font Family"
                    />
                    <SizeInput
                      value={styles.headingSize || '2.5'}
                      onChange={(value) => handleStyleChange('headingSize', value)}
                      label="Heading Size"
                      min="1"
                      max="5"
                    />
                    <SizeInput
                      value={styles.textSize || '1.1'}
                      onChange={(value) => handleStyleChange('textSize', value)}
                      label="Text Size"
                      min="0.8"
                      max="2"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hero' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Hero Section</h2>
                <TextInput
                  value={content[lang]?.hero?.title || ''}
                  onChange={(value) => handleContentChange('hero', 'title', value)}
                  label="Title"
                />
                <TextArea
                  value={content[lang]?.hero?.subtitle || ''}
                  onChange={(value) => handleContentChange('hero', 'subtitle', value)}
                  label="Subtitle"
                  rows={2}
                />
                <TextInput
                  value={content[lang]?.hero?.buttonText || ''}
                  onChange={(value) => handleContentChange('hero', 'buttonText', value)}
                  label="Button Text"
                />
                <ImageUpload
                  value={content[lang]?.hero?.image || ''}
                  onChange={(value) => handleContentChange('hero', 'image', value)}
                  label="Hero Image"
                />
              </div>
            )}

            {activeTab === 'about' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">About Section</h2>
                <TextInput
                  value={content[lang]?.about?.title || ''}
                  onChange={(value) => handleContentChange('about', 'title', value)}
                  label="Title"
                />
                <TextArea
                  value={content[lang]?.about?.text || ''}
                  onChange={(value) => handleContentChange('about', 'text', value)}
                  label="Description"
                  rows={4}
                />
                <ImageUpload
                  value={content[lang]?.about?.image || ''}
                  onChange={(value) => handleContentChange('about', 'image', value)}
                  label="About Image"
                />
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Features</h3>
                  {content[lang]?.about?.features?.map((feature, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium mb-3">Feature {index + 1}</h4>
                      <TextInput
                        value={feature.icon}
                        onChange={(value) => handleFeatureChange(index, 'icon', value)}
                        label="Icon (Emoji)"
                      />
                      <TextInput
                        value={feature.title}
                        onChange={(value) => handleFeatureChange(index, 'title', value)}
                        label="Feature Title"
                      />
                      <TextArea
                        value={feature.description}
                        onChange={(value) => handleFeatureChange(index, 'description', value)}
                        label="Feature Description"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Statistics</h3>
                  {content[lang]?.about?.stats?.map((stat, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium mb-3">Stat {index + 1}</h4>
                      <TextInput
                        value={stat.value}
                        onChange={(value) => handleStatChange(index, 'value', value)}
                        label="Value"
                      />
                      <TextInput
                        value={stat.label}
                        onChange={(value) => handleStatChange(index, 'label', value)}
                        label="Label"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Services Section</h2>
                <TextInput
                  value={content[lang]?.services?.title || ''}
                  onChange={(value) => handleContentChange('services', 'title', value)}
                  label="Section Title"
                />
                <TextInput
                  value={content[lang]?.services?.subtitle || ''}
                  onChange={(value) => handleContentChange('services', 'subtitle', value)}
                  label="Subtitle"
                />
                <TextArea
                  value={content[lang]?.services?.description || ''}
                  onChange={(value) => handleContentChange('services', 'description', value)}
                  label="Description"
                  rows={3}
                />
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Services</h3>
                  {content[lang]?.services?.services?.map((service, index) => {
                    const serviceImageMap = {
                      'non-tag-pwas': 'non-tag-based.jpg',
                      'sensor-tag-pwas': 'sensor-based.jpg',
                      'tag-based-pwas': 'tag-based.jpg',
                      'ai-pwas': 'ai-based.jpg',
                      'safety-consulting': 'safety.jpg',
                      'maintenance-support': 'maintainace.jpg'
                    }
                    const defaultImagePath = `/assets/${serviceImageMap[service.id] || 'about.jpg'}`
                    const serviceImageKey = `serviceImage_${service.id}`
                    const currentImage = content[lang]?.services?.images?.[serviceImageKey] || defaultImagePath
                    
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                        <h4 className="font-medium mb-3">Service {index + 1}</h4>
                        <TextInput
                          value={service.title}
                          onChange={(value) => handleServiceChange(index, 'title', value)}
                          label="Service Title"
                        />
                        <TextArea
                          value={service.description}
                          onChange={(value) => handleServiceChange(index, 'description', value)}
                          label="Service Description"
                          rows={2}
                        />
                        <TextInput
                          value={service.icon}
                          onChange={(value) => handleServiceChange(index, 'icon', value)}
                          label="Icon (Emoji)"
                        />
                        <ImageUpload
                          value={currentImage}
                          onChange={(value) => {
                            setContent(prev => ({
                              ...prev,
                              [lang]: {
                                ...prev[lang],
                                services: {
                                  ...prev[lang].services,
                                  images: {
                                    ...prev[lang].services?.images,
                                    [serviceImageKey]: value
                                  }
                                }
                              }
                            }))
                          }}
                          label={`Service Image (${service.title})`}
                        />
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                          {service.features?.map((feature, featureIndex) => (
                            <TextInput
                              key={featureIndex}
                              value={feature}
                              onChange={(value) => handleServiceFeatureChange(index, featureIndex, value)}
                              label={`Feature ${featureIndex + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Our Process</h3>
                  <TextInput
                    value={content[lang]?.services?.process?.title || 'Our Process'}
                    onChange={(value) => handleContentChange('services', 'process', { 
                      ...(content[lang]?.services?.process || {}), 
                      title: value 
                    })}
                    label="Process Title"
                  />
                  <TextArea
                    value={content[lang]?.services?.process?.description || 'We follow a systematic approach to deliver exceptional results for every project.'}
                    onChange={(value) => handleContentChange('services', 'process', { 
                      ...(content[lang]?.services?.process || {}), 
                      description: value 
                    })}
                    label="Process Description"
                    rows={2}
                  />
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Process Steps</label>
                    {(content[lang]?.services?.process?.steps || [
                      { step: '01', title: 'Consultation', description: 'Understanding your needs and project requirements' },
                      { step: '02', title: 'Planning', description: 'Detailed project planning and strategy development' },
                      { step: '03', title: 'Execution', description: 'Professional implementation with quality control' },
                      { step: '04', title: 'Support', description: 'Ongoing maintenance and support services' }
                    ]).map((step, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                        <h4 className="font-medium mb-3">Step {index + 1}</h4>
                        <TextInput
                          value={step.step}
                          onChange={(value) => handleProcessStepChange(index, 'step', value)}
                          label="Step Number"
                        />
                        <TextInput
                          value={step.title}
                          onChange={(value) => handleProcessStepChange(index, 'title', value)}
                          label="Step Title"
                        />
                        <TextArea
                          value={step.description}
                          onChange={(value) => handleProcessStepChange(index, 'description', value)}
                          label="Step Description"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Contact Section</h2>
                <TextInput
                  value={content[lang]?.contact?.title || ''}
                  onChange={(value) => handleContentChange('contact', 'title', value)}
                  label="Title"
                />
                <TextArea
                  value={content[lang]?.contact?.description || ''}
                  onChange={(value) => handleContentChange('contact', 'description', value)}
                  label="Description"
                  rows={2}
                />
                <TextInput
                  value={content[lang]?.contact?.email || ''}
                  onChange={(value) => handleContentChange('contact', 'email', value)}
                  label="Email"
                />
                <TextInput
                  value={content[lang]?.contact?.phone || ''}
                  onChange={(value) => handleContentChange('contact', 'phone', value)}
                  label="Phone"
                />
                <TextArea
                  value={content[lang]?.contact?.address || ''}
                  onChange={(value) => handleContentChange('contact', 'address', value)}
                  label="Address"
                  rows={2}
                />
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Why Choose Us?</h3>
                  <TextInput
                    value={content[lang]?.contact?.whyChooseUs?.title || ''}
                    onChange={(value) => handleContentChange('contact', 'whyChooseUs', { ...content[lang]?.contact?.whyChooseUs, title: value })}
                    label="Section Title"
                  />
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                    {content[lang]?.contact?.whyChooseUs?.benefits?.map((benefit, index) => (
                      <TextInput
                        key={index}
                        value={benefit}
                        onChange={(value) => handleBenefitChange(index, value)}
                        label={`Benefit ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'footer' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Footer Section</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Company Description</h3>
                  <TextArea
                    value={content[lang]?.footer?.companyDescription || 'Specialized in industrial safety solutions for Saudi Arabia\'s oil, gas, petrochemicals, and energy industries. Implementing industry-approved monitoring and safety plans with cutting-edge PWAS technology.'}
                    onChange={(value) => handleContentChange('footer', 'companyDescription', value)}
                    label="Company Description"
                    rows={3}
                  />
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Quick Links</h3>
                  <TextInput
                    value={content[lang]?.footer?.quickLinks?.title || 'Quick Links'}
                    onChange={(value) => handleContentChange('footer', 'quickLinks', { 
                      ...(content[lang]?.footer?.quickLinks || {}), 
                      title: value 
                    })}
                    label="Quick Links Title"
                  />
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Navigation Links</label>
                    {(content[lang]?.footer?.quickLinks?.links || [
                      { text: 'Home', url: '/' },
                      { text: 'About Us', url: '/about' },
                      { text: 'Services', url: '/services' },
                      { text: 'Contact', url: '/contact' }
                    ]).map((link, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                        <h4 className="font-medium mb-3">Link {index + 1}</h4>
                        <TextInput
                          value={link.text}
                          onChange={(value) => handleFooterLinkChange(index, 'text', value)}
                          label="Link Text"
                        />
                        <TextInput
                          value={link.url}
                          onChange={(value) => handleFooterLinkChange(index, 'url', value)}
                          label="Link URL"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  <TextInput
                    value={content[lang]?.footer?.contactInfo?.title || 'Contact Info'}
                    onChange={(value) => handleContentChange('footer', 'contactInfo', { 
                      ...(content[lang]?.footer?.contactInfo || {}), 
                      title: value 
                    })}
                    label="Contact Info Title"
                  />
                  <TextArea
                    value={content[lang]?.footer?.contactInfo?.address || 'Eastern Region – Al Ahsa – Mubarez – 6856, Kingdom of Saudi Arabia'}
                    onChange={(value) => handleContentChange('footer', 'contactInfo', { 
                      ...(content[lang]?.footer?.contactInfo || {}), 
                      address: value 
                    })}
                    label="Address"
                    rows={2}
                  />
                  <TextInput
                    value={content[lang]?.footer?.contactInfo?.phone || '+966 50 900 9509'}
                    onChange={(value) => handleContentChange('footer', 'contactInfo', { 
                      ...(content[lang]?.footer?.contactInfo || {}), 
                      phone: value 
                    })}
                    label="Phone Number"
                  />
                  <TextInput
                    value={content[lang]?.footer?.contactInfo?.email || 'sales@arabengksa.com'}
                    onChange={(value) => handleContentChange('footer', 'contactInfo', { 
                      ...(content[lang]?.footer?.contactInfo || {}), 
                      email: value 
                    })}
                    label="Email Address"
                  />
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Bottom Bar</h3>
                  <TextInput
                    value={content[lang]?.footer?.bottomBar?.copyright || '© {year} Arab Engineers — All rights reserved.'}
                    onChange={(value) => handleContentChange('footer', 'bottomBar', { 
                      ...(content[lang]?.footer?.bottomBar || {}), 
                      copyright: value 
                    })}
                    label="Copyright Text (use {year} for dynamic year)"
                  />
                  <TextInput
                    value={content[lang]?.footer?.bottomBar?.privacyPolicy || 'Privacy Policy'}
                    onChange={(value) => handleContentChange('footer', 'bottomBar', { 
                      ...(content[lang]?.footer?.bottomBar || {}), 
                      privacyPolicy: value 
                    })}
                    label="Privacy Policy Text"
                  />
                  <TextInput
                    value={content[lang]?.footer?.bottomBar?.termsOfService || 'Terms of Service'}
                    onChange={(value) => handleContentChange('footer', 'bottomBar', { 
                      ...(content[lang]?.footer?.bottomBar || {}), 
                      termsOfService: value 
                    })}
                    label="Terms of Service Text"
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'images' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Images & Assets</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Logo</h3>
                  <ImageUpload
                    value={content[lang]?.images?.logo || '/assets/logo.png'}
                    onChange={(value) => {
                      setContent(prev => ({
                        ...prev,
                        [lang]: {
                          ...prev[lang],
                          images: {
                            ...prev[lang]?.images,
                            logo: value
                          }
                        }
                      }))
                    }}
                    label="Company Logo"
                  />
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Feature Images (Our Features Section)</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload images for the "Our Features" section. These images are displayed in a grid on the Services page.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                      const featureKey = `feature${num}`
                      const defaultPath = `/assets/feature${num}.jpg`
                      const currentImage = content[lang]?.images?.features?.[featureKey] || defaultPath
                      
                      return (
                        <div key={num} className="border border-gray-200 rounded-lg p-4">
                          <ImageUpload
                            value={currentImage}
                            onChange={(value) => {
                              setContent(prev => ({
                                ...prev,
                                [lang]: {
                                  ...prev[lang],
                                  images: {
                                    ...prev[lang]?.images,
                                    features: {
                                      ...prev[lang]?.images?.features,
                                      [featureKey]: value
                                    }
                                  }
                                }
                              }))
                            }}
                            label={`Feature Image ${num}`}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'history' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Edit History</h2>
                <div className="mb-4">
                  <p className="text-gray-600 mb-4">
                    Track all changes made to the website content and styling. This helps you monitor modifications and provides context for reverting changes if needed.
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-sm text-gray-500">
                      Total edits: {editHistory.length}
                    </span>
                    <span className="text-sm text-gray-500">
                      Last 50 edits shown
                    </span>
                  </div>
                </div>
                
                {editHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No edit history available yet.</p>
                    <p className="text-sm text-gray-400">Start making changes to see them tracked here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {editHistory.map((edit) => (
                      <div key={edit.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                edit.type === 'save' ? 'bg-green-100 text-green-800' :
                                edit.type === 'reset' ? 'bg-orange-100 text-orange-800' :
                                edit.type === 'content' ? 'bg-blue-100 text-blue-800' :
                                edit.type === 'style' ? 'bg-purple-100 text-purple-800' :
                                edit.type === 'login' ? 'bg-gray-100 text-gray-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {edit.type === 'save' ? 'Save' :
                                 edit.type === 'reset' ? 'Reset' :
                                 edit.type === 'content' ? 'Content' :
                                 edit.type === 'style' ? 'Style' :
                                 edit.type === 'login' ? 'Login' : 'Edit'}
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {edit.action || `${edit.section} - ${edit.field}`}
                              </span>
                            </div>
                            
                            {/* Show detailed changes for save sessions */}
                            {edit.type === 'save' && edit.changes && edit.changes.length > 0 && (
                              <div className="ml-4 mb-3 p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm font-medium text-gray-700 mb-2">Changes made:</div>
                                <div className="space-y-2">
                                  {edit.changes.map((change, index) => (
                                    <div key={index} className="text-sm text-gray-600">
                                      <span className="font-medium">{change.action}:</span>
                                      <span className="ml-2">"{change.oldValue}" → "{change.newValue}"</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {edit.oldValue && edit.newValue && edit.type !== 'save' && (
                              <div className="text-sm text-gray-600 mb-2">
                                <span className="font-medium">Changed:</span> "{edit.oldValue}" → "{edit.newValue}"
                              </div>
                            )}
                            
                            <div className="text-xs text-gray-500">
                              {new Date(edit.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
