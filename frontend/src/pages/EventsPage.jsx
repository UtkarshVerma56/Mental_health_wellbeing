import { Link } from 'react-router-dom'
import { getEventsNewestFirst } from '../data/events'
import './EventsPage.css'

const EventsPage = () => {
  const events = getEventsNewestFirst()

  return (
    <div className="events-page">
      <div className="events-board">
        <div className="events-board-header">
          <h1>Events Notice Board</h1>
          <p>A look back at our past events and programmes</p>
        </div>

        <div className="events-timeline">
          {events.map((event) => (
            <Link
              to={`/event/${event.id}`}
              key={event.id}
              className="event-card"
            >
              <div className="event-card-thumb">
                <img src={event.media[0].thumb || event.media[0].src} alt={event.title} />
                {event.media[0].type === 'video' && (
                  <span className="event-card-play">▶</span>
                )}
              </div>
              <div className="event-card-body">
                <span className="event-card-date">{event.date}</span>
                <h3 className="event-card-title">{event.title}</h3>
                <p className="event-card-desc">{event.description}</p>
                <span className="event-card-link">View details →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EventsPage
