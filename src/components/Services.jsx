import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getContent } from '../utils/contentLoader'
import { getStyle } from '../utils/styleManager'
import { adminUtils } from '../utils/adminUtils'

export default function Services({lang}){
  const servicesData = getContent('services', lang)
  const primary = getStyle('primaryColor')
  
  // Get PWAS details from admin content or use defaults
  const adminContent = adminUtils.loadContent()
  const adminPWASDetails = adminContent?.[lang]?.services?.pwasDetails || {}
  
  // PWAS detailed content - merge admin content with defaults
  const defaultPWASContent = {
    'non-tag-pwas': {
      description: lang === 'en' 
        ? 'The Non-Tag Based Proximity Warning Alert System (PWAS) utilizes a 70GHz MMW radar for its functionality. When any obstacle is detected within a range of 40 meters, the system activates an alarm to warn the operator. Additionally, a camera feed provides a visual reference of the detected object, allowing for precautionary operation of the equipment.'
        : 'يستخدم نظام الإنذار والتحذير من القرب غير القائم على العلامات (PWAS) رادار MMW بتردد 70 جيجاهرتز. عند اكتشاف أي عائق ضمن نطاق 40 مترًا، ينشط النظام إنذارًا لتحذير المشغل. بالإضافة إلى ذلك، توفر تغذية الكاميرا مرجعًا بصريًا للكائن المكتشف، مما يسمح بتشغيل المعدات بشكل احترازي.',
      specifications: lang === 'en' ? [
        'User-defined detection range up to 40 meters for Sensors',
        'Data logger',
        'Power input range: 12VDC – 36VDC',
        'Operating temperature: up to 90°C',
        'AHD camera angle: 175°',
        'AHD Quad LCD monitor'
      ] : [
        'نطاق اكتشاف محدد من قبل المستخدم يصل إلى 40 مترًا للمستشعرات',
        'مسجل البيانات',
        'نطاق إدخال الطاقة: 12VDC – 36VDC',
        'درجة حرارة التشغيل: تصل إلى 90°C',
        'زاوية كاميرا AHD: 175°',
        'شاشة LCD رباعية AHD'
      ],
      image: '/assets/non-tag-based.png',
      secondImage: '/assets/non-tag-based2.png'
    },
    'sensor-tag-pwas': {
      description: lang === 'en'
        ? 'The Sensor-Tag PWAS is an advanced system that merges both Tag-Based and Non-Tag-Based technologies, offering significant flexibility to meet diverse project needs. It is designed specifically for industrial use, combining a 24GHz millimeter wave (MMW) radar and a 2.4GHz RF module to detect both tags and various objects within a specified range. This dual functionality enables the system to recognize multiple tags and obstacles simultaneously. Additionally, the Sensor-Tag PWAS records relevant information with timestamps for precise tracking and analysis, while providing real-time alerts to the operator to ensure timely responses. Overall, the system is engineered to enhance safety and improve operational efficiency across a wide range of applications.'
        : 'نظام Sensor-Tag PWAS هو نظام متقدم يجمع بين تقنيات القائمة على العلامات وغير القائمة على العلامات، مما يوفر مرونة كبيرة لتلبية احتياجات المشاريع المتنوعة. تم تصميمه خصيصًا للاستخدام الصناعي، حيث يجمع بين رادار الموجة المليمترية (MMW) بتردد 24 جيجاهرتز ووحدة RF بتردد 2.4 جيجاهرتز لاكتشاف كل من العلامات والأشياء المختلفة ضمن نطاق محدد. تتيح هذه الوظيفة المزدوجة للنظام التعرف على عدة علامات وعوائق في وقت واحد. بالإضافة إلى ذلك، يسجل Sensor-Tag PWAS المعلومات ذات الصلة مع الطوابع الزمنية للتتبع والتحليل الدقيق، مع توفير تنبيهات فورية للمشغل لضمان الاستجابات في الوقت المناسب. بشكل عام، تم تصميم النظام لتعزيز السلامة وتحسين الكفاءة التشغيلية عبر مجموعة واسعة من التطبيقات.',
      specifications: lang === 'en' ? [
        '360° area coverage',
        'Based integrated system',
        'User-defined detection range: up to 20 meters for Tags, Up to 40 meters for Sensors',
        'Built-in antenna (2.4GHz RF range)',
        'Data logger',
        'Power input range: 12VDC – 36VDC',
        'Operating temperature: up to 90°C',
        'AHD camera angle: 175°',
        'AHD Quad LCD monitor'
      ] : [
        'تغطية منطقة 360°',
        'نظام متكامل',
        'نطاق اكتشاف محدد من قبل المستخدم: يصل إلى 20 مترًا للعلامات، يصل إلى 40 مترًا للمستشعرات',
        'هوائي مدمج (نطاق RF 2.4 جيجاهرتز)',
        'مسجل البيانات',
        'نطاق إدخال الطاقة: 12VDC – 36VDC',
        'درجة حرارة التشغيل: تصل إلى 90°C',
        'زاوية كاميرا AHD: 175°',
        'شاشة LCD رباعية AHD'
      ],
      image: '/assets/sensor-tag-based.png',
      secondImage: '/assets/sensor-tag-based2.png'
    },
    'tag-based-pwas': {
      description: lang === 'en'
        ? 'The Tag-Based Proximity Warning and Alert System (PWAS) operates at 2.4GHz RF frequency. Its main function is to detect tags within a given range and automatically record their values and timestamps upon detection. It then alerts the driver that a person is near the equipment. The system can identify multiple tags simultaneously, ensuring effective monitoring and timely alerts for the operator.'
        : 'يعمل نظام الإنذار والتحذير من القرب القائم على العلامات (PWAS) بتردد RF 2.4 جيجاهرتز. وظيفته الرئيسية هي اكتشاف العلامات ضمن نطاق معين وتسجيل قيمها وطوابعها الزمنية تلقائيًا عند الاكتشاف. ثم ينبه السائق أن شخصًا قريب من المعدات. يمكن للنظام تحديد عدة علامات في وقت واحد، مما يضمن المراقبة الفعالة والتنبيهات في الوقت المناسب للمشغل.',
      specifications: lang === 'en' ? [
        '360° area coverage',
        'Based integrated system',
        'User-defined detection range up to 20 meters',
        'Built-in antenna (2.4GHz RF range)',
        'Data logger',
        'Power input range: 12VDC – 36VDC',
        'Operating temperature: up to 90°C',
        'AHD camera angle: 175°',
        'AHD Quad LCD monitor'
      ] : [
        'تغطية منطقة 360°',
        'نظام متكامل',
        'نطاق اكتشاف محدد من قبل المستخدم يصل إلى 20 مترًا',
        'هوائي مدمج (نطاق RF 2.4 جيجاهرتز)',
        'مسجل البيانات',
        'نطاق إدخال الطاقة: 12VDC – 36VDC',
        'درجة حرارة التشغيل: تصل إلى 90°C',
        'زاوية كاميرا AHD: 175°',
        'شاشة LCD رباعية AHD'
      ],
      image: '/assets/tag-based.png',
      secondImage: '/assets/tag-based2.png'
    },
    'ai-pwas': {
      description: lang === 'en'
        ? 'The AI Proximity Warning Alert System (AI PWAS) enhances safety by detecting nearby objects and hazards in real time, alerting users to prevent collisions across various environments, including automotive and industrial settings. Using advanced AI algorithms, it offers accurate proximity assessments and facilitates quick responses to improve safety standards. Arab Engineers\' AI PWAS continuously monitors surroundings for potential hazards, helping users stay proactive and reduce risks. This system integrates sensor technology and machine learning, allowing for real-time monitoring and customization of sensitivity and alert thresholds. It also integrates seamlessly with existing security systems to enhance overall safety. With its ability to learn from past incidents, the AI PWAS minimizes false alarms and provides audio and visual alerts to communicate threats effectively. Overall, it is an essential tool for promoting situational awareness and preventing accidents across diverse applications.'
        : 'يعزز نظام الإنذار والتحذير من القرب بالذكاء الاصطناعي (AI PWAS) السلامة من خلال اكتشاف الأجسام والمخاطر القريبة في الوقت الفعلي، وتنبيه المستخدمين لمنع التصادمات عبر بيئات متنوعة، بما في ذلك الإعدادات automotive والصناعية. باستخدام خوارزميات الذكاء الاصطناعي المتقدمة، يقدم تقييمات دقيقة للقرب ويسهل الاستجابات السريعة لتحسين معايير السلامة. يراقب AI PWAS من المهندسين العرب باستمرار المناطق المحيطة بحثًا عن المخاطر المحتملة، مما يساعد المستخدمين على البقاء استباقيين وتقليل المخاطر. يدمج هذا النظام تقنية المستشعرات والتعلم الآلي، مما يسمح بالمراقبة الفورية وتخصيص حساسية وعتبات التنبيه. كما يتكامل بسلاسة مع أنظمة الأمان الموجودة لتعزيز السلامة العامة. مع قدرته على التعلم من الحوادث السابقة، يقلل AI PWAS من الإنذارات الكاذبة ويوفر تنبيهات صوتية وبصرية للتواصل الفعال مع التهديدات. بشكل عام، إنه أداة أساسية لتعزيز الوعي بالموقف ومنع الحوادث عبر تطبيقات متنوعة.',
      specifications: lang === 'en' ? [
        '360° area coverage with 4 cameras',
        'Real-time detection of nearby objects and hazards',
        'Memory card for event recording',
        'Power input range: 12VDC – 36VDC',
        'Operating temperature: up to 90°C',
        'AI-AHD camera angle: 175°',
        'AI-AHD Quad LCD monitor'
      ] : [
        'تغطية منطقة 360° مع 4 كاميرات',
        'اكتشاف فوري للأجسام والمخاطر القريبة',
        'بطاقة ذاكرة لتسجيل الأحداث',
        'نطاق إدخال الطاقة: 12VDC – 36VDC',
        'درجة حرارة التشغيل: تصل إلى 90°C',
        'زاوية كاميرا AI-AHD: 175°',
        'شاشة LCD رباعية AI-AHD'
      ],
      image: '/assets/ai-based.png',
      secondImage: '/assets/ai-based2.png'
    }
  }

  // Merge admin content with defaults
  const pwasContent = Object.keys(defaultPWASContent).reduce((acc, key) => {
    acc[key] = {
      ...defaultPWASContent[key],
      ...adminPWASDetails[key],
      // Merge specifications arrays if they exist
      specifications: adminPWASDetails[key]?.specifications || defaultPWASContent[key].specifications,
      // Use admin images if available, otherwise use defaults
      image: adminPWASDetails[key]?.image || defaultPWASContent[key].image,
      secondImage: adminPWASDetails[key]?.secondImage || defaultPWASContent[key].secondImage
    }
    return acc
  }, {})

  // Preload all service images for faster loading
  useEffect(() => {
    Object.values(pwasContent).forEach((content) => {
      if (content.image && !content.image.startsWith('data:')) {
        const img = new Image()
        img.src = content.image
      }
      if (content.secondImage && !content.secondImage.startsWith('data:')) {
        const img2 = new Image()
        img2.src = content.secondImage
      }
    })
  }, [lang])
  
  return (
    <section id="services" className="pt-32 py-12 relative overflow-hidden" style={{backgroundColor: '#f8eae1'}}>
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10" data-aos="fade-up">
          <h2 className="font-bold mb-6" style={{
            color: primary, 
            // Larger minimum for better readability on mobile
            fontSize: 'clamp(2rem, 5vw, var(--heading-size))'
          }}>
            {servicesData.title}
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed" style={{fontSize: 'clamp(1.3rem, 2.5vw, calc(var(--text-size) * 1.3))'}}>
            {servicesData.subtitle}
          </p>
        </div>

        {/* Description with Image Side by Side */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 mb-12 items-center" data-aos="fade-up">
          <div className="order-1 md:order-none">
            {(() => {
              const descriptionParts = servicesData.description.split('\n\n');
              const mainText = descriptionParts[0];
              const benefitsSection = descriptionParts.slice(1).join('\n\n');
              const benefitsLines = benefitsSection.split('\n').filter(line => line.trim());
              const benefitsTitle = benefitsLines[0];
              const benefitsList = benefitsLines.slice(1);
              
              return (
                <>
                  <p className="text-gray-700 mb-6 leading-relaxed" style={{fontSize: 'var(--text-size)'}}>
                    {mainText}
                  </p>
                  {benefitsTitle && (
                    <>
                      <h3 className="font-semibold mb-4" style={{
                        color: primary,
                        fontSize: 'clamp(1.2rem, 2vw, calc(var(--text-size) * 1.2))'
                      }}>
                        {benefitsTitle}
                      </h3>
                      <ul className="space-y-2">
                        {benefitsList.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-3 text-gray-700" style={{fontSize: 'var(--text-size)'}}>
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor: primary}}></div>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6">
                        <Link 
                          to="/pwas"
                          className="inline-block px-6 py-3 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl"
                          style={{backgroundColor: primary}}
                        >
                          {lang === 'en' ? 'Learn More' : 'اعرف المزيد'}
                        </Link>
                      </div>
                    </>
                  )}
                </>
              );
            })()}
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-lg order-2 md:order-none" data-aos="fade-left">
            <img 
              src={servicesData.pwasMainImage || '/assets/pwas.jpg'} 
              alt="Proximity Warning Alert System (PWAS)"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
        
        {/* PWAS Systems - Full Width Containers */}
        <div className="space-y-8 mb-12">
          {servicesData.services
            .filter(service => service.id.includes('pwas'))
            .map((service, index) => {
              const pwasInfo = pwasContent[service.id]
              const serviceImage = pwasInfo?.image || '/assets/about.jpg'
              const serviceImage2 = pwasInfo?.secondImage || '/assets/about.jpg'
              
              // Layout pattern: alternates by index
              // Index 0, 2: Image1 | Description / Specifications | Image2
              // Index 1, 3: Description | Image1 / Image2 | Specifications
              const layoutType = index % 2 === 0 ? 'image-first' : 'description-first'
              
              return (
                <div 
                  key={service.id}
                  data-aos="fade-up" 
                  data-aos-delay={index * 100}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden"
                >
                  {/* Mobile Layout: heading/description - image 1 - features/specs - image 2 */}
                  <div className="flex flex-col md:hidden">
                    {/* Heading and Description */}
                    <div className="w-full p-6 flex flex-col justify-center bg-gray-50">
                      <h3 className="text-2xl font-bold mb-4" style={{color: primary}}>
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed" style={{fontSize: 'var(--text-size)'}}>
                        {pwasInfo?.description || service.description}
                      </p>
                    </div>
                    
                    {/* Image 1 */}
                    <div className="relative flex items-center justify-center bg-gray-50 p-6" style={{minHeight: '300px'}}>
                      <img 
                        src={serviceImage} 
                        alt={service.title}
                        className="max-w-full h-auto object-contain"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Features and Specifications */}
                    <div className="w-full p-6 flex flex-col justify-center bg-gray-50">
                      <h4 className="font-semibold mb-4 text-gray-800" style={{fontSize: 'calc(var(--text-size) * 1.1)'}}>
                        {lang === 'en' ? 'Device Features and Specifications' : 'ميزات ومواصفات الجهاز'}
                      </h4>
                      <ul className="space-y-2">
                        {(pwasInfo?.specifications || service.features).map((spec, specIndex) => (
                          <li key={specIndex} className="flex items-start gap-2 text-gray-600" style={{fontSize: 'var(--text-size)'}}>
                            <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{backgroundColor: primary}}></div>
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Image 2 */}
                    <div className="relative flex items-center justify-center bg-gray-50 p-6" style={{minHeight: '300px'}}>
                      <img 
                        src={serviceImage2} 
                        alt={`${service.title} - Additional view`}
                        className="max-w-full h-auto object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  
                  {/* Desktop Layout: Original alternating grid */}
                  <div className="hidden md:grid grid-cols-2 gap-0">
                    {/* Top Left */}
                    <div className={`relative flex items-center justify-center bg-gray-50 p-6 ${
                      layoutType === 'image-first' ? '' : ''
                    }`} style={{minHeight: '300px'}}>
                      {layoutType === 'image-first' ? (
                        <img 
                          src={serviceImage} 
                          alt={service.title}
                          className="max-w-full h-auto object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full p-6 flex flex-col justify-center">
                          <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{color: primary}}>
                            {service.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed" style={{fontSize: 'var(--text-size)'}}>
                            {pwasInfo?.description || service.description}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Top Right */}
                    <div className={`relative flex items-center justify-center bg-gray-50 p-6 ${
                      layoutType === 'image-first' ? '' : ''
                    }`} style={{minHeight: '300px'}}>
                      {layoutType === 'image-first' ? (
                        <div className="w-full p-6 flex flex-col justify-center">
                          <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{color: primary}}>
                            {service.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed" style={{fontSize: 'var(--text-size)'}}>
                            {pwasInfo?.description || service.description}
                          </p>
                        </div>
                      ) : (
                        <img 
                          src={serviceImage} 
                          alt={service.title}
                          className="max-w-full h-auto object-contain"
                          loading="lazy"
                        />
                      )}
                    </div>
                    
                    {/* Bottom Left */}
                    <div className={`relative flex items-center justify-center bg-gray-50 p-6 ${
                      layoutType === 'image-first' ? '' : ''
                    }`} style={{minHeight: '300px'}}>
                      {layoutType === 'image-first' ? (
                        <div className="w-full p-6 flex flex-col justify-center">
                          <h4 className="font-semibold mb-4 text-gray-800" style={{fontSize: 'calc(var(--text-size) * 1.1)'}}>
                            {lang === 'en' ? 'Device Features and Specifications' : 'ميزات ومواصفات الجهاز'}
                          </h4>
                          <ul className="space-y-2">
                            {(pwasInfo?.specifications || service.features).map((spec, specIndex) => (
                              <li key={specIndex} className="flex items-start gap-2 text-gray-600" style={{fontSize: 'var(--text-size)'}}>
                                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{backgroundColor: primary}}></div>
                                <span>{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <img 
                          src={serviceImage2} 
                          alt={`${service.title} - Additional view`}
                          className="max-w-full h-auto object-contain"
                          loading="lazy"
                        />
                      )}
                    </div>
                    
                    {/* Bottom Right */}
                    <div className={`relative flex items-center justify-center bg-gray-50 p-6 ${
                      layoutType === 'image-first' ? '' : ''
                    }`} style={{minHeight: '300px'}}>
                      {layoutType === 'image-first' ? (
                        <img 
                          src={serviceImage2} 
                          alt={`${service.title} - Additional view`}
                          className="max-w-full h-auto object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full p-6 flex flex-col justify-center">
                          <h4 className="font-semibold mb-4 text-gray-800" style={{fontSize: 'calc(var(--text-size) * 1.1)'}}>
                            {lang === 'en' ? 'Device Features and Specifications' : 'ميزات ومواصفات الجهاز'}
                          </h4>
                          <ul className="space-y-2">
                            {(pwasInfo?.specifications || service.features).map((spec, specIndex) => (
                              <li key={specIndex} className="flex items-start gap-2 text-gray-600" style={{fontSize: 'var(--text-size)'}}>
                                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{backgroundColor: primary}}></div>
                                <span>{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
        
        {/* Process Section */}
        <div className="bg-white rounded-3xl p-12 shadow-xl" data-aos="fade-up">
          <div className="text-center mb-12">
            <h3 className="font-bold mb-4" style={{
              color: primary, 
              fontSize: 'clamp(1.5rem, 3.5vw, calc(var(--heading-size) * 0.8))'
            }}>
              {servicesData.process?.title || (lang === 'en' ? 'Our Process' : 'عملنا')}
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{fontSize: 'var(--text-size)'}}>
              {servicesData.process?.description || (lang === 'en' 
                ? 'We follow a systematic approach to deliver exceptional results for every project.'
                : 'نتبع نهجًا منهجيًا لتقديم نتائج استثنائية لكل مشروع.'
              )}
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {(servicesData.process?.steps || [
              {
                step: lang === 'en' ? '01' : '٠١',
                title: lang === 'en' ? 'Consultation' : 'الاستشارة',
                description: lang === 'en' ? 'Understanding your needs and project requirements' : 'فهم احتياجاتك ومتطلبات المشروع'
              },
              {
                step: lang === 'en' ? '02' : '٠٢',
                title: lang === 'en' ? 'Planning' : 'التخطيط',
                description: lang === 'en' ? 'Detailed project planning and strategy development' : 'التخطيط التفصيلي للمشروع وتطوير الاستراتيجية'
              },
              {
                step: lang === 'en' ? '03' : '٠٣',
                title: lang === 'en' ? 'Execution' : 'التنفيذ',
                description: lang === 'en' ? 'Professional implementation with quality control' : 'التنفيذ المهني مع ضبط الجودة'
              },
              {
                step: lang === 'en' ? '04' : '٠٤',
                title: lang === 'en' ? 'Support' : 'الدعم',
                description: lang === 'en' ? 'Ongoing maintenance and support services' : 'خدمات الصيانة والدعم المستمر'
              }
            ]).map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{backgroundColor: primary}}>
                  {process.step}
                </div>
                <h4 className="font-semibold mb-2 text-gray-900" style={{fontSize: 'var(--text-size)'}}>
                  {process.title}
                </h4>
                <p className="text-gray-600 leading-relaxed" style={{fontSize: 'var(--text-size)'}}>
                  {process.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-16" data-aos="fade-up">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4" style={{color: primary}}>
              {lang === 'en' ? 'Ready to Start Your Project?' : 'مستعد لبدء مشروعك؟'}
            </h3>
            <p className="text-gray-600 mb-6">
              {lang === 'en' 
                ? 'Contact us today for a free consultation and let us bring your vision to life.'
                : 'تواصل معنا اليوم للحصول على استشارة مجانية ودعنا نحقق رؤيتك.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact"
                className="px-8 py-4 text-white font-semibold rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl" 
                style={{backgroundColor: primary}}
              >
                {lang === 'en' ? 'Get Free Consultation' : 'احصل على استشارة مجانية'}
              </Link>
              <Link 
                to="/pwas"
                className="px-8 py-4 border-2 font-semibold rounded-full text-lg transition-all duration-300 hover:scale-105" 
                style={{borderColor: primary, color: primary}}
              >
                {lang === 'en' ? 'View Our Portfolio' : 'عرض أعمالنا'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
