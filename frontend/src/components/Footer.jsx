import { Link } from 'react-router-dom'
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3>About MHC</h3>
          <p>
            Mental Health & Wellbeing Center at MNNIT Allahabad provides comprehensive
            mental health support and counseling services to our student community.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#team">Team</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <div className="contact-info">
            <p>
              <FaPhone /> +91-512-259-xxxx
            </p>
            <p>
              <FaEnvelope /> mhc@mnnit.ac.in
            </p>
            <p>
              <FaMapMarkerAlt /> MNNIT Allahabad, Prayagraj - 211004
            </p>
          </div>
        </div>

        <div className="footer-section">
          <h3>Emergency</h3>
          <p className="emergency-contact">
            <strong>24/7 Crisis Hotline:</strong><br />
            +91-XXXX-XXXX-XXXX
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Mental Health Center, MNNIT Allahabad. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
