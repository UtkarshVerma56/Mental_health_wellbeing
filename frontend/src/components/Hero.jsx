import { Link } from 'react-router-dom'
import './Hero.css'

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Your Mental Health Matters</h1>
          <p>
            Comprehensive mental health support and counseling services for MNNIT Allahabad students.
            We're here to help you navigate challenges and thrive.
          </p>
          <div className="hero-buttons">
            <Link to="/login/student" className="btn btn-primary">
              Book Appointment
            </Link>
            <a href="#services" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-illustration">
            
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
