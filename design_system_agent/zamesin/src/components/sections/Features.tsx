import Image from 'next/image'

const features = [
  {
    id: 'organize-campaigns',
    title: 'Organize your campaigns',
    description: 'With lots of unique blocks, you can easily build a page without coding. Build your next landing page.',
    icon: {
      width: 35,
      height: 37,
      marginTop: '9px',
      images: [
        { src: '/images/layers-icon-overlay.svg', width: 35, height: 27, top: '0px', left: '0px' },
        { src: '/images/layers-icon.svg', width: 35, height: 16, top: '21px', left: '0px' }
      ]
    },
    content: {
      width: '344px',
      titleWidth: '240px',
      descWidth: '283px'
    }
  },
  {
    id: 'manage-customers',
    title: 'Manage customers',
    description: 'With lots of unique blocks, you can easily build a page without coding. Build your next landing page.',
    icon: {
      width: 37,
      height: 38,
      marginTop: '9px',
      images: [
        { src: '/images/sync-icon-main.svg', width: 18, height: 21, top: '0px', left: '8px' },
        { src: '/images/sync-icon-part1.svg', width: 13, height: 7, top: '23px', left: '24px' },
        { src: '/images/sync-icon-part2.svg', width: 13, height: 7, top: '31px', left: '24px' },
        { src: '/images/sync-icon-base.svg', width: 25, height: 12, top: '24px', left: '0px' }
      ]
    },
    content: {
      width: '341px',
      titleWidth: '179px',
      descWidth: '275px'
    }
  },
  {
    id: 'track-progress',
    title: 'Track progress fast',
    description: 'With lots of unique blocks, you can easily build a page without coding. Build your next landing page.',
    icon: {
      width: 34,
      height: 34,
      marginTop: '9px',
      images: [
        { src: '/images/chart-bar-1.svg', width: 7, height: 15, top: '19px', left: '14px' },
        { src: '/images/chart-bar-2.svg', width: 7, height: 7, top: '27px', left: '0px' },
        { src: '/images/chart-bar-3.svg', width: 7, height: 22, top: '12px', left: '27px' },
        { src: '/images/chart-bar-base.svg', width: 25, height: 13, top: '0px', left: '3px' }
      ]
    },
    content: {
      width: '353px',
      titleWidth: '175px',
      descWidth: '292px'
    }
  }
]

export default function Features() {
  return (
    <section className="bg-white py-12 px-4 sm:py-20 lg:py-[120px] sm:px-8 lg:px-[164px]" aria-labelledby="features-heading">
      {/* Visually hidden section heading for screen readers */}
      <h2 id="features-heading" className="sr-only">Key Features</h2>
      
      <div className="flex flex-col md:flex-row items-start justify-center gap-6 lg:gap-[24px] max-w-[1112px] mx-auto" role="list">
        {features.map((feature, index) => (
          <article 
            key={feature.id}
            className="flex items-start w-full md:flex-1" 
            role="listitem"
          >
            {/* Icon Container */}
            <div 
              className="relative flex-shrink-0 mr-4 lg:mr-[25px] mt-2" 
              style={{ 
                width: `${Math.min(feature.icon.width, 32)}px`, 
                height: `${Math.min(feature.icon.height, 32)}px`,
              }} 
              aria-hidden="true"
            >
              <div className="absolute inset-0">
                {feature.icon.images.map((img, imgIndex) => (
                  <Image
                    key={imgIndex}
                    src={img.src}
                    alt=""
                    width={Math.min(img.width, 32)}
                    height={Math.min(img.height, 32)}
                    style={{ 
                      position: 'absolute', 
                      top: `${Math.round((parseInt(img.top) / feature.icon.height) * Math.min(feature.icon.height, 32))}px`, 
                      left: `${Math.round((parseInt(img.left) / feature.icon.width) * Math.min(feature.icon.width, 32))}px` 
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 
                className="mb-3 lg:mb-[15px]"
                style={{
                  color: '#161C2D',
                  fontFamily: 'Gilroy',
                  fontWeight: 700,
                  fontSize: 'clamp(18px, 4vw, 21px)',
                  lineHeight: 'clamp(24px, 5vw, 32px)',
                  letterSpacing: '-0.5px',
                }}
              >
                {feature.title}
              </h3>
              <p 
                style={{
                  color: '#161C2D',
                  opacity: 0.7,
                  fontFamily: 'Gilroy',
                  fontWeight: 400,
                  fontSize: 'clamp(14px, 3.5vw, 17px)',
                  lineHeight: 'clamp(22px, 5vw, 29px)',
                  letterSpacing: '-0.2px',
                }}
              >
                {feature.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}