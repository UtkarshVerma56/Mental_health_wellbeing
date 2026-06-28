import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getEventById } from '../data/events'
import './EventDetailPage.css'

const EventDetailPage = () => {
  const { id } = useParams()
  const event = getEventById(id)

  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  // Reset to first slide if the event changes
  useEffect(() => {
    setCurrent(0)
    setLightbox(false)
  }, [id])

  // Close lightbox on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!event) {
    return (
      <div className="event-detail-page">
        <div className="event-not-found">
          <h2>Event not found</h2>
          <Link to="/event" className="back-link">
            ← Back to Events
          </Link>
        </div>
      </div>
    )
  }

  const media = event.media || []
  const total = media.length
  const currentItem = media[current] || null

  const goTo = (index) => setCurrent((index + total) % total)
  const prev = () => goTo(current - 1)
  const next = () => goTo(current + 1)

  return (
    <div className="event-detail-page">
      <div className="event-detail-container">
        <Link to="/event" className="back-link">
          ← Back to Events
        </Link>

        <h1 className="event-detail-title">{event.title}</h1>

        <div className="event-detail-grid">
          {/* LEFT: details */}
          <div className="event-detail-info">
            <div className="info-block">
              <span className="info-label">Description</span>
              <p className="info-text">{event.description}</p>
            </div>

            <div className="info-block">
              <span className="info-label">Main Guest</span>
              <p className="info-text">{event.guest}</p>
            </div>

            <div className="info-block">
              <span className="info-label">Date</span>
              <p className="info-text">{event.date}</p>
            </div>

            <div className="info-block">
              <span className="info-label">Venue</span>
              <p className="info-text">{event.venue}</p>
            </div>
          </div>

          {/* RIGHT: sliding image box */}
          <div className="event-detail-gallery">
            <div className="gallery-main">
              {currentItem && currentItem.type === 'video' && (
                <iframe
                  className="gallery-video"
                  src={currentItem.src}
                  title={`${event.title} video`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}

              {currentItem && currentItem.type === 'image' && (
                <img
                  src={currentItem.src}
                  alt={`${event.title} ${current + 1}`}
                  className="gallery-image"
                  onClick={() => setLightbox(true)}
                />
              )}

              {total > 1 && (
                <>
                  <button
                    className="gallery-arrow gallery-arrow-left"
                    onClick={prev}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    className="gallery-arrow gallery-arrow-right"
                    onClick={next}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}

              <span className="gallery-counter">
                {current + 1} / {total}
              </span>
            </div>

            {total > 1 && (
              <div className="gallery-thumbs">
                {media.map((item, idx) => (
                  <button
                    key={idx}
                    className={`gallery-thumb ${
                      idx === current ? 'active' : ''
                    }`}
                    onClick={() => goTo(idx)}
                  >
                    <img
                      src={item.type === 'video' ? item.thumb : item.src}
                      alt={`thumb ${idx + 1}`}
                    />
                    {item.type === 'video' && (
                      <span className="gallery-thumb-play">▶</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            <p className="gallery-hint">
              Tap a photo to enlarge · videos play here
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox overlay (images only) */}
      {lightbox && currentItem && currentItem.type === 'image' && (
        <div className="lightbox-overlay" onClick={() => setLightbox(false)}>
          <button
            className="lightbox-close"
            onClick={() => setLightbox(false)}
            aria-label="Close"
          >
            ×
          </button>

          <img
            src={currentItem.src}
            alt={`${event.title} enlarged`}
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />

          {total > 1 && (
            <>
              <button
                className="lightbox-arrow lightbox-arrow-left"
                onClick={(e) => {
                  e.stopPropagation()
                  prev()
                }}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                className="lightbox-arrow lightbox-arrow-right"
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default EventDetailPage
