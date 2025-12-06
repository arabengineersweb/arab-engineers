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

  const handlePWASDetailChange = (serviceId, field, value) => {
    setContent(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        services: {
          ...prev[lang].services,
          pwasDetails: {
            ...prev[lang].services?.pwasDetails,
            [serviceId]: {
              ...prev[lang].services?.pwasDetails?.[serviceId],
              [field]: value
            }
          }
        }
      }
    }))
  }

  const handlePWASSpecificationChange = (serviceId, specIndex, value) => {
    setContent(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        services: {
          ...prev[lang].services,
          pwasDetails: {
            ...prev[lang].services?.pwasDetails,
            [serviceId]: {
              ...prev[lang].services?.pwasDetails?.[serviceId],
              specifications: (prev[lang].services?.pwasDetails?.[serviceId]?.specifications || []).map((spec, index) => 
                index === specIndex ? value : spec
              )
            }
          }
        }
      }
    }))
  }

  const handleCameraSpecChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        camera: {
          ...prev[lang].camera,
          [field]: value
        }
      }
    }))
  }

  const handleCameraImageChange = (imageKey, value) => {
    setContent(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        camera: {
          ...prev[lang].camera,
          images: {
            ...prev[lang].camera?.images,
            [imageKey]: value
          }
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
                onClick={() => setActiveTab('pwas')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'pwas' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                PWAS Page
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
                <ImageUpload
                  value={content[lang]?.hero?.backgroundImage || '/assets/hero-background.jpg'}
                  onChange={(value) => handleContentChange('hero', 'backgroundImage', value)}
                  label="Hero Background Image"
                />
                <ImageUpload
                  value={content[lang]?.hero?.engineerImage || '/assets/engineer-hero.jpg'}
                  onChange={(value) => handleContentChange('hero', 'engineerImage', value)}
                  label="Hero Engineer Image (Small Hexagon)"
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
                <ImageUpload
                  value={content[lang]?.about?.engineerImage || '/assets/engineer-about.jpg'}
                  onChange={(value) => handleContentChange('about', 'engineerImage', value)}
                  label="About Engineer Image (Small Hexagon)"
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
                
                {/* PWAS Main Image */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">PWAS Main Image</h3>
                  <ImageUpload
                    value={content[lang]?.services?.pwasMainImage || '/assets/pwas.jpg'}
                    onChange={(value) => handleContentChange('services', 'pwasMainImage', value)}
                    label="PWAS Main Image (Shown in Services Section)"
                  />
                </div>

                {/* PWAS Detailed Content */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">PWAS Detailed Content</h3>
                  {['non-tag-pwas', 'sensor-tag-pwas', 'tag-based-pwas', 'ai-pwas'].map((serviceId) => {
                    const service = content[lang]?.services?.services?.find(s => s.id === serviceId)
                    const pwasDetail = content[lang]?.services?.pwasDetails?.[serviceId] || {}
                    const defaultDescriptions = {
                      'non-tag-pwas': {
                        en: 'The Non-Tag Based Proximity Warning Alert System (PWAS) utilizes a 70GHz MMW radar for its functionality. When any obstacle is detected within a range of 40 meters, the system activates an alarm to warn the operator. Additionally, a camera feed provides a visual reference of the detected object, allowing for precautionary operation of the equipment.',
                        ar: 'يستخدم نظام الإنذار والتحذير من القرب غير القائم على العلامات (PWAS) رادار MMW بتردد 70 جيجاهرتز. عند اكتشاف أي عائق ضمن نطاق 40 مترًا، ينشط النظام إنذارًا لتحذير المشغل. بالإضافة إلى ذلك، توفر تغذية الكاميرا مرجعًا بصريًا للكائن المكتشف، مما يسمح بتشغيل المعدات بشكل احترازي.'
                      },
                      'sensor-tag-pwas': {
                        en: 'The Sensor-Tag PWAS is an advanced system that merges both Tag-Based and Non-Tag-Based technologies, offering significant flexibility to meet diverse project needs. It is designed specifically for industrial use, combining a 24GHz millimeter wave (MMW) radar and a 2.4GHz RF module to detect both tags and various objects within a specified range. This dual functionality enables the system to recognize multiple tags and obstacles simultaneously. Additionally, the Sensor-Tag PWAS records relevant information with timestamps for precise tracking and analysis, while providing real-time alerts to the operator to ensure timely responses. Overall, the system is engineered to enhance safety and improve operational efficiency across a wide range of applications.',
                        ar: 'نظام Sensor-Tag PWAS هو نظام متقدم يجمع بين تقنيات القائمة على العلامات وغير القائمة على العلامات، مما يوفر مرونة كبيرة لتلبية احتياجات المشاريع المتنوعة. تم تصميمه خصيصًا للاستخدام الصناعي، حيث يجمع بين رادار الموجة المليمترية (MMW) بتردد 24 جيجاهرتز ووحدة RF بتردد 2.4 جيجاهرتز لاكتشاف كل من العلامات والأشياء المختلفة ضمن نطاق محدد. تتيح هذه الوظيفة المزدوجة للنظام التعرف على عدة علامات وعوائق في وقت واحد. بالإضافة إلى ذلك، يسجل Sensor-Tag PWAS المعلومات ذات الصلة مع الطوابع الزمنية للتتبع والتحليل الدقيق، مع توفير تنبيهات فورية للمشغل لضمان الاستجابات في الوقت المناسب. بشكل عام، تم تصميم النظام لتعزيز السلامة وتحسين الكفاءة التشغيلية عبر مجموعة واسعة من التطبيقات.'
                      },
                      'tag-based-pwas': {
                        en: 'The Tag-Based Proximity Warning and Alert System (PWAS) operates at 2.4GHz RF frequency. Its main function is to detect tags within a given range and automatically record their values and timestamps upon detection. It then alerts the driver that a person is near the equipment. The system can identify multiple tags simultaneously, ensuring effective monitoring and timely alerts for the operator.',
                        ar: 'يعمل نظام الإنذار والتحذير من القرب القائم على العلامات (PWAS) بتردد RF 2.4 جيجاهرتز. وظيفته الرئيسية هي اكتشاف العلامات ضمن نطاق معين وتسجيل قيمها وطوابعها الزمنية تلقائيًا عند الاكتشاف. ثم ينبه السائق أن شخصًا قريب من المعدات. يمكن للنظام تحديد عدة علامات في وقت واحد، مما يضمن المراقبة الفعالة والتنبيهات في الوقت المناسب للمشغل.'
                      },
                      'ai-pwas': {
                        en: 'The AI Proximity Warning Alert System (AI PWAS) enhances safety by detecting nearby objects and hazards in real time, alerting users to prevent collisions across various environments, including automotive and industrial settings. Using advanced AI algorithms, it offers accurate proximity assessments and facilitates quick responses to improve safety standards. Arab Engineers\' AI PWAS continuously monitors surroundings for potential hazards, helping users stay proactive and reduce risks. This system integrates sensor technology and machine learning, allowing for real-time monitoring and customization of sensitivity and alert thresholds. It also integrates seamlessly with existing security systems to enhance overall safety. With its ability to learn from past incidents, the AI PWAS minimizes false alarms and provides audio and visual alerts to communicate threats effectively. Overall, it is an essential tool for promoting situational awareness and preventing accidents across diverse applications.',
                        ar: 'يعزز نظام الإنذار والتحذير من القرب بالذكاء الاصطناعي (AI PWAS) السلامة من خلال اكتشاف الأجسام والمخاطر القريبة في الوقت الفعلي، وتنبيه المستخدمين لمنع التصادمات عبر بيئات متنوعة، بما في ذلك الإعدادات automotive والصناعية. باستخدام خوارزميات الذكاء الاصطناعي المتقدمة، يقدم تقييمات دقيقة للقرب ويسهل الاستجابات السريعة لتحسين معايير السلامة. يراقب AI PWAS من المهندسين العرب باستمرار المناطق المحيطة بحثًا عن المخاطر المحتملة، مما يساعد المستخدمين على البقاء استباقيين وتقليل المخاطر. يدمج هذا النظام تقنية المستشعرات والتعلم الآلي، مما يسمح بالمراقبة الفورية وتخصيص حساسية وعتبات التنبيه. كما يتكامل بسلاسة مع أنظمة الأمان الموجودة لتعزيز السلامة العامة. مع قدرته على التعلم من الحوادث السابقة، يقلل AI PWAS من الإنذارات الكاذبة ويوفر تنبيهات صوتية وبصرية للتواصل الفعال مع التهديدات. بشكل عام، إنه أداة أساسية لتعزيز الوعي بالموقف ومنع الحوادث عبر تطبيقات متنوعة.'
                      }
                    }
                    const defaultSpecs = {
                      'non-tag-pwas': {
                        en: ['User-defined detection range up to 40 meters for Sensors', 'Data logger', 'Power input range: 12VDC – 36VDC', 'Operating temperature: up to 90°C', 'AHD camera angle: 175°', 'AHD Quad LCD monitor'],
                        ar: ['نطاق اكتشاف محدد من قبل المستخدم يصل إلى 40 مترًا للمستشعرات', 'مسجل البيانات', 'نطاق إدخال الطاقة: 12VDC – 36VDC', 'درجة حرارة التشغيل: تصل إلى 90°C', 'زاوية كاميرا AHD: 175°', 'شاشة LCD رباعية AHD']
                      },
                      'sensor-tag-pwas': {
                        en: ['360° area coverage', 'Based integrated system', 'User-defined detection range: up to 20 meters for Tags, Up to 40 meters for Sensors', 'Built-in antenna (2.4GHz RF range)', 'Data logger', 'Power input range: 12VDC – 36VDC', 'Operating temperature: up to 90°C', 'AHD camera angle: 175°', 'AHD Quad LCD monitor'],
                        ar: ['تغطية منطقة 360°', 'نظام متكامل', 'نطاق اكتشاف محدد من قبل المستخدم: يصل إلى 20 مترًا للعلامات، يصل إلى 40 مترًا للمستشعرات', 'هوائي مدمج (نطاق RF 2.4 جيجاهرتز)', 'مسجل البيانات', 'نطاق إدخال الطاقة: 12VDC – 36VDC', 'درجة حرارة التشغيل: تصل إلى 90°C', 'زاوية كاميرا AHD: 175°', 'شاشة LCD رباعية AHD']
                      },
                      'tag-based-pwas': {
                        en: ['360° area coverage', 'Based integrated system', 'User-defined detection range up to 20 meters', 'Built-in antenna (2.4GHz RF range)', 'Data logger', 'Power input range: 12VDC – 36VDC', 'Operating temperature: up to 90°C', 'AHD camera angle: 175°', 'AHD Quad LCD monitor'],
                        ar: ['تغطية منطقة 360°', 'نظام متكامل', 'نطاق اكتشاف محدد من قبل المستخدم يصل إلى 20 مترًا', 'هوائي مدمج (نطاق RF 2.4 جيجاهرتز)', 'مسجل البيانات', 'نطاق إدخال الطاقة: 12VDC – 36VDC', 'درجة حرارة التشغيل: تصل إلى 90°C', 'زاوية كاميرا AHD: 175°', 'شاشة LCD رباعية AHD']
                      },
                      'ai-pwas': {
                        en: ['360° area coverage with 4 cameras', 'Real-time detection of nearby objects and hazards', 'Memory card for event recording', 'Power input range: 12VDC – 36VDC', 'Operating temperature: up to 90°C', 'AI-AHD camera angle: 175°', 'AI-AHD Quad LCD monitor'],
                        ar: ['تغطية منطقة 360° مع 4 كاميرات', 'اكتشاف فوري للأجسام والمخاطر القريبة', 'بطاقة ذاكرة لتسجيل الأحداث', 'نطاق إدخال الطاقة: 12VDC – 36VDC', 'درجة حرارة التشغيل: تصل إلى 90°C', 'زاوية كاميرا AI-AHD: 175°', 'شاشة LCD رباعية AI-AHD']
                      }
                    }
                    const currentDescription = pwasDetail.description || defaultDescriptions[serviceId]?.[lang] || ''
                    const currentSpecs = pwasDetail.specifications || defaultSpecs[serviceId]?.[lang] || []
                    
                    return (
                      <div key={serviceId} className="border border-gray-200 rounded-lg p-4 mb-4">
                        <h4 className="font-medium mb-3">{service?.title || serviceId}</h4>
                        
                        {/* PWAS Images */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">PWAS Images</label>
                          <ImageUpload
                            value={pwasDetail.image || 
                              (serviceId === 'non-tag-pwas' ? '/assets/non-tag-based.png' :
                               serviceId === 'sensor-tag-pwas' ? '/assets/sensor-tag-based.png' :
                               serviceId === 'tag-based-pwas' ? '/assets/tag-based.png' :
                               serviceId === 'ai-pwas' ? '/assets/ai-based.png' : '')}
                            onChange={(value) => handlePWASDetailChange(serviceId, 'image', value)}
                            label="First Image"
                          />
                          <ImageUpload
                            value={pwasDetail.secondImage || 
                              (serviceId === 'non-tag-pwas' ? '/assets/non-tag-based2.png' :
                               serviceId === 'sensor-tag-pwas' ? '/assets/sensor-tag-based2.png' :
                               serviceId === 'tag-based-pwas' ? '/assets/tag-based2.png' :
                               serviceId === 'ai-pwas' ? '/assets/ai-based2.png' : '')}
                            onChange={(value) => handlePWASDetailChange(serviceId, 'secondImage', value)}
                            label="Second Image"
                          />
                        </div>
                        
                        <TextArea
                          value={currentDescription}
                          onChange={(value) => handlePWASDetailChange(serviceId, 'description', value)}
                          label="Detailed Description"
                          rows={4}
                        />
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
                          {currentSpecs.map((spec, specIndex) => (
                            <TextInput
                              key={specIndex}
                              value={spec}
                              onChange={(value) => handlePWASSpecificationChange(serviceId, specIndex, value)}
                              label={`Specification ${specIndex + 1}`}
                            />
                          ))}
                          <button
                            onClick={() => {
                              setContent(prev => ({
                                ...prev,
                                [lang]: {
                                  ...prev[lang],
                                  services: {
                                    ...prev[lang].services,
                                    pwasDetails: {
                                      ...prev[lang].services?.pwasDetails,
                                      [serviceId]: {
                                        ...prev[lang].services?.pwasDetails?.[serviceId],
                                        specifications: [...(prev[lang].services?.pwasDetails?.[serviceId]?.specifications || currentSpecs), '']
                                      }
                                    }
                                  }
                                }
                              }))
                            }}
                            className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                          >
                            Add Specification
                          </button>
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

            {activeTab === 'pwas' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">PWAS Page</h2>
                
                {/* PWAS Page Header */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">PWAS Page Header</h3>
                  <TextInput
                    value={content[lang]?.pwas?.title || (lang === 'en' ? 'Proximity Warning Alert System (PWAS)' : 'نظام الإنذار والتحذير من القرب (PWAS)')}
                    onChange={(value) => handleContentChange('pwas', 'title', value)}
                    label="PWAS Page Title (Heading)"
                  />
                  <TextInput
                    value={content[lang]?.services?.subtitle || ''}
                    onChange={(value) => handleContentChange('services', 'subtitle', value)}
                    label="PWAS Page Subtitle"
                  />
                </div>

                {/* PWAS Description and Benefits */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">PWAS Description and Benefits</h3>
                  <TextArea
                    value={content[lang]?.pwas?.mainDescription || (() => {
                      const desc = content[lang]?.services?.description || ''
                      const parts = desc.split('\n\n')
                      return parts[0] || ''
                    })()}
                    onChange={(value) => handleContentChange('pwas', 'mainDescription', value)}
                    label="Main Description"
                    rows={4}
                  />
                  <TextInput
                    value={content[lang]?.pwas?.benefitsTitle || (() => {
                      const desc = content[lang]?.services?.description || ''
                      const parts = desc.split('\n\n')
                      const benefitsSection = parts.slice(1).join('\n\n')
                      const benefitsLines = benefitsSection.split('\n').filter(line => line.trim())
                      return benefitsLines[0] || (lang === 'en' ? 'Benefits of the PWAS' : 'فوائد PWAS')
                    })()}
                    onChange={(value) => handleContentChange('pwas', 'benefitsTitle', value)}
                    label="Benefits Title"
                  />
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Benefits List</label>
                    {(content[lang]?.pwas?.benefits || (() => {
                      const desc = content[lang]?.services?.description || ''
                      const parts = desc.split('\n\n')
                      const benefitsSection = parts.slice(1).join('\n\n')
                      const benefitsLines = benefitsSection.split('\n').filter(line => line.trim())
                      return benefitsLines.slice(1) || []
                    })()).map((benefit, index) => (
                      <TextInput
                        key={index}
                        value={benefit}
                        onChange={(value) => {
                          setContent(prev => ({
                            ...prev,
                            [lang]: {
                              ...prev[lang],
                              pwas: {
                                ...prev[lang]?.pwas,
                                benefits: (prev[lang]?.pwas?.benefits || []).map((b, i) => i === index ? value : b)
                              }
                            }
                          }))
                        }}
                        label={`Benefit ${index + 1}`}
                      />
                    ))}
                    <button
                      onClick={() => {
                        setContent(prev => ({
                          ...prev,
                          [lang]: {
                            ...prev[lang],
                            pwas: {
                              ...prev[lang]?.pwas,
                              benefits: [...(prev[lang]?.pwas?.benefits || []), '']
                            }
                          }
                        }))
                      }}
                      className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                    >
                      Add Benefit
                    </button>
                  </div>
                </div>

                {/* PWAS Main Image */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">PWAS Main Image</h3>
                  <ImageUpload
                    value={content[lang]?.services?.pwasMainImage || '/assets/pwas.jpg'}
                    onChange={(value) => handleContentChange('services', 'pwasMainImage', value)}
                    label="PWAS Main Image (Shown in PWAS Page Header)"
                  />
                </div>

                {/* PWAS Detailed Content */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">PWAS Detailed Content</h3>
                  {['non-tag-pwas', 'sensor-tag-pwas', 'tag-based-pwas', 'ai-pwas'].map((serviceId) => {
                    const service = content[lang]?.services?.services?.find(s => s.id === serviceId)
                    const pwasDetail = content[lang]?.services?.pwasDetails?.[serviceId] || {}
                    const defaultDescriptions = {
                      'non-tag-pwas': {
                        en: 'The Non-Tag Based Proximity Warning Alert System (PWAS) utilizes a 70GHz MMW radar for its functionality. When any obstacle is detected within a range of 40 meters, the system activates an alarm to warn the operator. Additionally, a camera feed provides a visual reference of the detected object, allowing for precautionary operation of the equipment.',
                        ar: 'يستخدم نظام الإنذار والتحذير من القرب غير القائم على العلامات (PWAS) رادار MMW بتردد 70 جيجاهرتز. عند اكتشاف أي عائق ضمن نطاق 40 مترًا، ينشط النظام إنذارًا لتحذير المشغل. بالإضافة إلى ذلك، توفر تغذية الكاميرا مرجعًا بصريًا للكائن المكتشف، مما يسمح بتشغيل المعدات بشكل احترازي.'
                      },
                      'sensor-tag-pwas': {
                        en: 'The Sensor-Tag PWAS is an advanced system that merges both Tag-Based and Non-Tag-Based technologies, offering significant flexibility to meet diverse project needs. It is designed specifically for industrial use, combining a 24GHz millimeter wave (MMW) radar and a 2.4GHz RF module to detect both tags and various objects within a specified range. This dual functionality enables the system to recognize multiple tags and obstacles simultaneously. Additionally, the Sensor-Tag PWAS records relevant information with timestamps for precise tracking and analysis, while providing real-time alerts to the operator to ensure timely responses. Overall, the system is engineered to enhance safety and improve operational efficiency across a wide range of applications.',
                        ar: 'نظام Sensor-Tag PWAS هو نظام متقدم يجمع بين تقنيات القائمة على العلامات وغير القائمة على العلامات، مما يوفر مرونة كبيرة لتلبية احتياجات المشاريع المتنوعة. تم تصميمه خصيصًا للاستخدام الصناعي، حيث يجمع بين رادار الموجة المليمترية (MMW) بتردد 24 جيجاهرتز ووحدة RF بتردد 2.4 جيجاهرتز لاكتشاف كل من العلامات والأشياء المختلفة ضمن نطاق محدد. تتيح هذه الوظيفة المزدوجة للنظام التعرف على عدة علامات وعوائق في وقت واحد. بالإضافة إلى ذلك، يسجل Sensor-Tag PWAS المعلومات ذات الصلة مع الطوابع الزمنية للتتبع والتحليل الدقيق، مع توفير تنبيهات فورية للمشغل لضمان الاستجابات في الوقت المناسب. بشكل عام، تم تصميم النظام لتعزيز السلامة وتحسين الكفاءة التشغيلية عبر مجموعة واسعة من التطبيقات.'
                      },
                      'tag-based-pwas': {
                        en: 'The Tag-Based Proximity Warning and Alert System (PWAS) operates at 2.4GHz RF frequency. Its main function is to detect tags within a given range and automatically record their values and timestamps upon detection. It then alerts the driver that a person is near the equipment. The system can identify multiple tags simultaneously, ensuring effective monitoring and timely alerts for the operator.',
                        ar: 'يعمل نظام الإنذار والتحذير من القرب القائم على العلامات (PWAS) بتردد RF 2.4 جيجاهرتز. وظيفته الرئيسية هي اكتشاف العلامات ضمن نطاق معين وتسجيل قيمها وطوابعها الزمنية تلقائيًا عند الاكتشاف. ثم ينبه السائق أن شخصًا قريب من المعدات. يمكن للنظام تحديد عدة علامات في وقت واحد، مما يضمن المراقبة الفعالة والتنبيهات في الوقت المناسب للمشغل.'
                      },
                      'ai-pwas': {
                        en: 'The AI Proximity Warning Alert System (AI PWAS) enhances safety by detecting nearby objects and hazards in real time, alerting users to prevent collisions across various environments, including automotive and industrial settings. Using advanced AI algorithms, it offers accurate proximity assessments and facilitates quick responses to improve safety standards. Arab Engineers\' AI PWAS continuously monitors surroundings for potential hazards, helping users stay proactive and reduce risks. This system integrates sensor technology and machine learning, allowing for real-time monitoring and customization of sensitivity and alert thresholds. It also integrates seamlessly with existing security systems to enhance overall safety. With its ability to learn from past incidents, the AI PWAS minimizes false alarms and provides audio and visual alerts to communicate threats effectively. Overall, it is an essential tool for promoting situational awareness and preventing accidents across diverse applications.',
                        ar: 'يعزز نظام الإنذار والتحذير من القرب بالذكاء الاصطناعي (AI PWAS) السلامة من خلال اكتشاف الأجسام والمخاطر القريبة في الوقت الفعلي، وتنبيه المستخدمين لمنع التصادمات عبر بيئات متنوعة، بما في ذلك الإعدادات automotive والصناعية. باستخدام خوارزميات الذكاء الاصطناعي المتقدمة، يقدم تقييمات دقيقة للقرب ويسهل الاستجابات السريعة لتحسين معايير السلامة. يراقب AI PWAS من المهندسين العرب باستمرار المناطق المحيطة بحثًا عن المخاطر المحتملة، مما يساعد المستخدمين على البقاء استباقيين وتقليل المخاطر. يدمج هذا النظام تقنية المستشعرات والتعلم الآلي، مما يسمح بالمراقبة الفورية وتخصيص حساسية وعتبات التنبيه. كما يتكامل بسلاسة مع أنظمة الأمان الموجودة لتعزيز السلامة العامة. مع قدرته على التعلم من الحوادث السابقة، يقلل AI PWAS من الإنذارات الكاذبة ويوفر تنبيهات صوتية وبصرية للتواصل الفعال مع التهديدات. بشكل عام، إنه أداة أساسية لتعزيز الوعي بالموقف ومنع الحوادث عبر تطبيقات متنوعة.'
                      }
                    }
                    const defaultSpecs = {
                      'non-tag-pwas': {
                        en: ['User-defined detection range up to 40 meters for Sensors', 'Data logger', 'Power input range: 12VDC – 36VDC', 'Operating temperature: up to 90°C', 'AHD camera angle: 175°', 'AHD Quad LCD monitor'],
                        ar: ['نطاق اكتشاف محدد من قبل المستخدم يصل إلى 40 مترًا للمستشعرات', 'مسجل البيانات', 'نطاق إدخال الطاقة: 12VDC – 36VDC', 'درجة حرارة التشغيل: تصل إلى 90°C', 'زاوية كاميرا AHD: 175°', 'شاشة LCD رباعية AHD']
                      },
                      'sensor-tag-pwas': {
                        en: ['360° area coverage', 'Based integrated system', 'User-defined detection range: up to 20 meters for Tags, Up to 40 meters for Sensors', 'Built-in antenna (2.4GHz RF range)', 'Data logger', 'Power input range: 12VDC – 36VDC', 'Operating temperature: up to 90°C', 'AHD camera angle: 175°', 'AHD Quad LCD monitor'],
                        ar: ['تغطية منطقة 360°', 'نظام متكامل', 'نطاق اكتشاف محدد من قبل المستخدم: يصل إلى 20 مترًا للعلامات، يصل إلى 40 مترًا للمستشعرات', 'هوائي مدمج (نطاق RF 2.4 جيجاهرتز)', 'مسجل البيانات', 'نطاق إدخال الطاقة: 12VDC – 36VDC', 'درجة حرارة التشغيل: تصل إلى 90°C', 'زاوية كاميرا AHD: 175°', 'شاشة LCD رباعية AHD']
                      },
                      'tag-based-pwas': {
                        en: ['360° area coverage', 'Based integrated system', 'User-defined detection range up to 20 meters', 'Built-in antenna (2.4GHz RF range)', 'Data logger', 'Power input range: 12VDC – 36VDC', 'Operating temperature: up to 90°C', 'AHD camera angle: 175°', 'AHD Quad LCD monitor'],
                        ar: ['تغطية منطقة 360°', 'نظام متكامل', 'نطاق اكتشاف محدد من قبل المستخدم يصل إلى 20 مترًا', 'هوائي مدمج (نطاق RF 2.4 جيجاهرتز)', 'مسجل البيانات', 'نطاق إدخال الطاقة: 12VDC – 36VDC', 'درجة حرارة التشغيل: تصل إلى 90°C', 'زاوية كاميرا AHD: 175°', 'شاشة LCD رباعية AHD']
                      },
                      'ai-pwas': {
                        en: ['360° area coverage with 4 cameras', 'Real-time detection of nearby objects and hazards', 'Memory card for event recording', 'Power input range: 12VDC – 36VDC', 'Operating temperature: up to 90°C', 'AI-AHD camera angle: 175°', 'AI-AHD Quad LCD monitor'],
                        ar: ['تغطية منطقة 360° مع 4 كاميرات', 'اكتشاف فوري للأجسام والمخاطر القريبة', 'بطاقة ذاكرة لتسجيل الأحداث', 'نطاق إدخال الطاقة: 12VDC – 36VDC', 'درجة حرارة التشغيل: تصل إلى 90°C', 'زاوية كاميرا AI-AHD: 175°', 'شاشة LCD رباعية AI-AHD']
                      }
                    }
                    const currentDescription = pwasDetail.description || defaultDescriptions[serviceId]?.[lang] || ''
                    const currentSpecs = pwasDetail.specifications || defaultSpecs[serviceId]?.[lang] || []
                    
                    return (
                      <div key={serviceId} className="border border-gray-200 rounded-lg p-4 mb-4">
                        <h4 className="font-medium mb-3">{service?.title || serviceId}</h4>
                        
                        {/* PWAS Images */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">PWAS Images</label>
                          <ImageUpload
                            value={pwasDetail.image || 
                              (serviceId === 'non-tag-pwas' ? '/assets/non-tag-based.png' :
                               serviceId === 'sensor-tag-pwas' ? '/assets/sensor-tag-based.png' :
                               serviceId === 'tag-based-pwas' ? '/assets/tag-based.png' :
                               serviceId === 'ai-pwas' ? '/assets/ai-based.png' : '')}
                            onChange={(value) => handlePWASDetailChange(serviceId, 'image', value)}
                            label="First Image"
                          />
                          <ImageUpload
                            value={pwasDetail.secondImage || 
                              (serviceId === 'non-tag-pwas' ? '/assets/non-tag-based2.png' :
                               serviceId === 'sensor-tag-pwas' ? '/assets/sensor-tag-based2.png' :
                               serviceId === 'tag-based-pwas' ? '/assets/tag-based2.png' :
                               serviceId === 'ai-pwas' ? '/assets/ai-based2.png' : '')}
                            onChange={(value) => handlePWASDetailChange(serviceId, 'secondImage', value)}
                            label="Second Image"
                          />
                        </div>
                        
                        <TextArea
                          value={currentDescription}
                          onChange={(value) => handlePWASDetailChange(serviceId, 'description', value)}
                          label="Detailed Description"
                          rows={4}
                        />
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
                          {currentSpecs.map((spec, specIndex) => (
                            <TextInput
                              key={specIndex}
                              value={spec}
                              onChange={(value) => handlePWASSpecificationChange(serviceId, specIndex, value)}
                              label={`Specification ${specIndex + 1}`}
                            />
                          ))}
                          <button
                            onClick={() => {
                              setContent(prev => ({
                                ...prev,
                                [lang]: {
                                  ...prev[lang],
                                  services: {
                                    ...prev[lang].services,
                                    pwasDetails: {
                                      ...prev[lang].services?.pwasDetails,
                                      [serviceId]: {
                                        ...prev[lang].services?.pwasDetails?.[serviceId],
                                        specifications: [...(prev[lang].services?.pwasDetails?.[serviceId]?.specifications || currentSpecs), '']
                                      }
                                    }
                                  }
                                }
                              }))
                            }}
                            className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                          >
                            Add Specification
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Camera Specifications */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Camera Specifications</h3>
                  <TextArea
                    value={content[lang]?.camera?.description || (lang === 'en' ? 'Waterproof IP69K AHD 1080P Reversing Car Camera for vehicles, trucks, and buses.' : 'كاميرا عكسية مقاومة للماء IP69K AHD 1080P للمركبات والشاحنات والحافلات.')}
                    onChange={(value) => handleCameraSpecChange('description', value)}
                    label="Camera Description"
                    rows={2}
                  />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <TextInput
                      value={content[lang]?.camera?.waterproof || 'IP 69K'}
                      onChange={(value) => handleCameraSpecChange('waterproof', value)}
                      label="Waterproof"
                    />
                    <TextInput
                      value={content[lang]?.camera?.voltage || 'DC 12V (24V optional)'}
                      onChange={(value) => handleCameraSpecChange('voltage', value)}
                      label="Voltage"
                    />
                    <TextInput
                      value={content[lang]?.camera?.viewAngle || '135 degrees'}
                      onChange={(value) => handleCameraSpecChange('viewAngle', value)}
                      label="View Angle"
                    />
                    <TextInput
                      value={content[lang]?.camera?.system || 'PAL/NTSC (optional)'}
                      onChange={(value) => handleCameraSpecChange('system', value)}
                      label="System"
                    />
                    <TextInput
                      value={content[lang]?.camera?.resolution || '1080P'}
                      onChange={(value) => handleCameraSpecChange('resolution', value)}
                      label="Resolution"
                    />
                    <TextInput
                      value={content[lang]?.camera?.imageSensor || '1/3" CMOS'}
                      onChange={(value) => handleCameraSpecChange('imageSensor', value)}
                      label="Image Sensor"
                    />
                    <TextInput
                      value={content[lang]?.camera?.pixel || '1920 x 1080 (2,000,000)'}
                      onChange={(value) => handleCameraSpecChange('pixel', value)}
                      label="Pixel"
                    />
                    <TextInput
                      value={content[lang]?.camera?.lens || '2.5 mm'}
                      onChange={(value) => handleCameraSpecChange('lens', value)}
                      label="Lens"
                    />
                    <TextInput
                      value={content[lang]?.camera?.consumption || '180mA'}
                      onChange={(value) => handleCameraSpecChange('consumption', value)}
                      label="Consumption"
                    />
                    <TextInput
                      value={content[lang]?.camera?.videoOutput || '1.0vp-p, 75Ohm'}
                      onChange={(value) => handleCameraSpecChange('videoOutput', value)}
                      label="Video Output"
                    />
                    <TextInput
                      value={content[lang]?.camera?.sn || '>48dB'}
                      onChange={(value) => handleCameraSpecChange('sn', value)}
                      label="S/N"
                    />
                    <TextInput
                      value={content[lang]?.camera?.whiteBalance || 'Auto'}
                      onChange={(value) => handleCameraSpecChange('whiteBalance', value)}
                      label="White Balance"
                    />
                    <TextInput
                      value={content[lang]?.camera?.certification || 'CE, E mark'}
                      onChange={(value) => handleCameraSpecChange('certification', value)}
                      label="Certification"
                    />
                    <TextInput
                      value={content[lang]?.camera?.warranty || '14 months'}
                      onChange={(value) => handleCameraSpecChange('warranty', value)}
                      label="Warranty"
                    />
                    <TextInput
                      value={content[lang]?.camera?.application || (lang === 'en' ? 'Rear view car camera' : 'كاميرا عكسية للمركبات')}
                      onChange={(value) => handleCameraSpecChange('application', value)}
                      label="Application"
                    />
                  </div>
                  
                  {/* Camera Images */}
                  <div className="mt-6">
                    <h4 className="text-md font-medium mb-4">Camera Images</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <ImageUpload
                        value={content[lang]?.camera?.images?.specs1 || '/assets/cam-specs1.jpg'}
                        onChange={(value) => handleCameraImageChange('specs1', value)}
                        label="Camera Specs Image 1"
                      />
                      <ImageUpload
                        value={content[lang]?.camera?.images?.specs2 || '/assets/cam-specs2.jpg'}
                        onChange={(value) => handleCameraImageChange('specs2', value)}
                        label="Camera Specs Image 2"
                      />
                      <ImageUpload
                        value={content[lang]?.camera?.images?.specs3 || '/assets/cam-specs3.jpg'}
                        onChange={(value) => handleCameraImageChange('specs3', value)}
                        label="Camera Specs Image 3"
                      />
                      <ImageUpload
                        value={content[lang]?.camera?.images?.feature1 || '/assets/cam-feature1.jpg'}
                        onChange={(value) => handleCameraImageChange('feature1', value)}
                        label="Camera Feature Image 1"
                      />
                      <ImageUpload
                        value={content[lang]?.camera?.images?.feature2 || '/assets/cam-feature2.jpg'}
                        onChange={(value) => handleCameraImageChange('feature2', value)}
                        label="Camera Feature Image 2"
                      />
                      <ImageUpload
                        value={content[lang]?.camera?.images?.feature3 || '/assets/cam-feature3.jpg'}
                        onChange={(value) => handleCameraImageChange('feature3', value)}
                        label="Camera Feature Image 3"
                      />
                      <ImageUpload
                        value={content[lang]?.camera?.images?.showcase || '/assets/cam-showcase.jpg'}
                        onChange={(value) => handleCameraImageChange('showcase', value)}
                        label="Camera Showcase Image"
                      />
                      <ImageUpload
                        value={content[lang]?.camera?.images?.main || '/assets/camera.jpg'}
                        onChange={(value) => handleCameraImageChange('main', value)}
                        label="Camera Main Image (Above Key Features)"
                      />
                    </div>
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
