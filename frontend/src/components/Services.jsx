import ServiceCard from './ServiceCard'
import './Services.css'

const Services = () => {
  const services = [
    {
      icon: '🎯',
      title: 'Counseling Sessions',
      description: 'One-on-one professional counseling to address personal and academic concerns'
    },
    {
      icon: '🆘',
      title: 'Crisis Support',
      description: 'Immediate help during mental health emergencies with 24/7 availability'
    },
    {
      icon: '👥',
      title: 'Group Therapy',
      description: 'Supportive group sessions for stress management and peer support'
    },
    {
      icon: '📚',
      title: 'Wellness Programs',
      description: 'Educational workshops on mental health, stress, and wellbeing'
    },
    {
      icon: '🧘',
      title: 'Self-Help Resources',
      description: 'Articles, videos, and tools for self-assessment and personal growth'
    },
    {
      icon: '💬',
      title: 'Peer Support',
      description: 'Connect with trained peer supporters for advice and encouragement'
    }
  ]

  return (
    <section id="services" className="services">
      <div className="container">
        <h2>Our Services</h2>
        <p className="section-subtitle">
          Comprehensive mental health support tailored to your needs
        </p>
        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
