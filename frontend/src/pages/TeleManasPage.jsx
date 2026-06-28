import { Link } from 'react-router-dom'

const TeleManasPage = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #f3eefc 0%, #ece3f8 100%)'
      }}
    >
      <div
        style={{
          maxWidth: '620px',
          width: '100%',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 12px 40px rgba(91, 59, 166, 0.15)',
          padding: '48px 40px',
          textAlign: 'center',
          borderTop: '6px solid #5b3ba6'
        }}
      >
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>📞</div>

        <h1
          style={{
            color: '#2c1a4d',
            fontSize: '28px',
            marginBottom: '20px',
            lineHeight: 1.3
          }}
        >
          External 24x7 Counselling by Tele MANAS
        </h1>

        <p
          style={{
            color: '#555',
            fontSize: '16px',
            lineHeight: 1.7,
            marginBottom: '28px'
          }}
        >
          Tele-MANAS is a free, 24x7 national mental-health helpline launched by
          the Ministry of Health and Family Welfare under the National Tele
          Mental Health Programme. Anyone can call the toll-free numbers to
          receive counselling, emotional support, and referrals for further
          care. The system offers services in around 20 languages.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '32px'
          }}
        >
          <a
            href="tel:14416"
            style={{
              background: 'linear-gradient(135deg, #5b3ba6 0%, #8b5fbf 100%)',
              color: 'white',
              padding: '14px 28px',
              borderRadius: '10px',
              fontSize: '20px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 6px 16px rgba(91, 59, 166, 0.3)'
            }}
          >
            14416
          </a>
          <a
            href="tel:18008914416"
            style={{
              background: 'white',
              color: '#5b3ba6',
              padding: '14px 28px',
              borderRadius: '10px',
              fontSize: '20px',
              fontWeight: 700,
              textDecoration: 'none',
              border: '2px solid #8b5fbf'
            }}
          >
            1800-891-4416
          </a>
        </div>

        <p style={{ color: '#777', fontSize: '14px', marginBottom: '28px' }}>
          For more information, please visit the official website at{' '}
          <a
            href="https://telemanas.mohfw.gov.in/home"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#5b3ba6', fontWeight: 600 }}
          >
            telemanas.mohfw.gov.in
          </a>
          .
        </p>

        <Link
          to="/"
          style={{
            color: '#8b5fbf',
            fontSize: '15px',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

export default TeleManasPage
