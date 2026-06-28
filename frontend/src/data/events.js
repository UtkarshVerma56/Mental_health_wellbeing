// ---------------------------------------------------------------------------
// EVENTS DATA
// ---------------------------------------------------------------------------
// Photos load AUTOMATICALLY from per-event folders. You do NOT write imports.
// Just drop image files into:
//
//     src/assets/event/<event-id>/   (e.g. src/assets/event/yoga/1.jpg)
//
// Any number of .jpg/.jpeg/.png files is fine. They show up sorted by filename
// (so name them 1.jpg, 2.jpg, 3.png ... to control order).
//
// Videos (YouTube) are listed per event in the `videos: [...]` array below.
// Paste full YouTube URLs — any format works (youtu.be/XXX or watch?v=XXX).
// Leave the array empty ([]) for events with no video.
//
// On the detail page, videos appear FIRST in the carousel, then the photos.
// ---------------------------------------------------------------------------

// Auto-import every image inside src/assets/event/** at build time.
// `eager: true` returns the resolved URLs immediately.
const imageModules = import.meta.glob(
  '../assets/event/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}',
  { eager: true, query: '?url', import: 'default' }
)

// Group the imported image URLs by their folder name (= event id).
const imagesByEvent = {}
for (const path in imageModules) {
  // path looks like: ../assets/event/yoga/1.jpg
  const match = path.match(/\/event\/([^/]+)\//)
  if (!match) continue
  const eventId = match[1]
  if (!imagesByEvent[eventId]) imagesByEvent[eventId] = []
  imagesByEvent[eventId].push({ path, url: imageModules[path] })
}
// Sort each event's images by filename so 1,2,3... order is respected.
for (const id in imagesByEvent) {
  imagesByEvent[id].sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }))
}
const getPhotos = (id) => (imagesByEvent[id] || []).map((x) => x.url)

// Colored placeholder so an event with NO photos yet still shows something.
const placeholder = (label, color) =>
  `https://placehold.co/800x500/${color}/ffffff?text=${encodeURIComponent(label)}`

// ---------------------------------------------------------------------------
// EVENT LIST  (newest-first is computed automatically from sortDate)
// ---------------------------------------------------------------------------
const RAW_EVENTS = [
  {
    id: 'reccb',
    title: 'RECCB 2026 — Research Excellence & Campus Culture Building',
    shortName: 'RECCB',
    date: 'June 22–26, 2026',
    sortDate: '2026-06-22',
    venue: 'Online Mode',
    guest: 'Conveners: Dr. Dinesh Singh & Dr. Rajitha B',
    description:
      'A five-day online Faculty Upgradation Program organised by the Dean (Student Welfare) Office, MNNIT Allahabad. RECCB 2026 was conceptualised to strengthen faculty competencies in building a collaborative, inclusive, and academically enriching campus environment, while enhancing their effectiveness as research mentors and academic leaders. The programme covered campus culture and positive environment building, research supervision, research scholar management, and building an inclusive campus environment. Through expert-led sessions, interactive discussions, and experience-sharing, participants gained practical insights into nurturing research scholars, maintaining academic integrity, promoting diversity, equity and inclusion, and contributing to the holistic development of the institution. An e-certificate was provided to all eligible participants.',
    // PASTE YOUTUBE URL(S) HERE if this event has a video, e.g. 'https://youtu.be/XXXX'
    videos: ['https://www.youtube.com/watch?v=bhS-SXvtv4I&list=PLg0LA_bABYR3OsyXZFOkWhxZoYGgSC45m&index=4'],
    placeholderColor: 'e67e22'
  },
  {
    id: 'idy',
    title: 'International Day of Yoga 2026 — "Yoga Sangam"',
    shortName: 'IDY',
    date: 'June 20–21, 2026',
    sortDate: '2026-06-21',
    venue: 'MP Hall, MNNIT Allahabad',
    guest: 'Dr. Prashanta Majee (Yoga Coordinator) & Dr. Dinesh Singh',
    description:
      'Organised by the Student Activity Centre, MNNIT Allahabad as part of the Ministry of Ayush, Government of India activities, the International Day of Yoga was celebrated under the flagship event "Yoga Sangam" with the theme "Yoga for Healthy Ageing". On 20 June a practice session for the Common Yoga Protocol (CYP) was held from 6:30–7:30 A.M. On 21 June, the celebration began with a live stream of the Honourable Prime Minister\'s address (6:30–7:00 A.M.) followed by the execution of the Common Yoga Protocol (7:00–8:00 A.M.). Faculty members, staff, and students participated to immerse themselves in the celebration and make it a grand success.',
    // PASTE YOUTUBE URL(S) HERE
    videos: [],
    placeholderColor: '27ae60'
  },
  {
    id: 'pewp',
    title: 'PEWP 2026 — Pedagogical Excellence & Wellness Program',
    shortName: 'PEWP',
    date: 'June 15–19, 2026',
    sortDate: '2026-06-15',
    venue: 'Online Mode',
    guest: 'Conveners: Dr. Dinesh Singh & Dr. Rajitha B',
    description:
      'A one-week online Faculty Upgradation Program organised by the Dean (Student Welfare) Office, MNNIT Allahabad. PEWP 2026 was designed to strengthen faculty capabilities in contemporary pedagogical approaches, technology-integrated teaching, and academic leadership. Core themes included Outcome-Based Education (OBE) and active pedagogy, technology integration in teaching (EdTech tools), and mental well-being and emotional intelligence for faculty. The programme emphasised learner-centric instruction, digital assessment methodologies, stress management, resilience, and professional well-being. Through expert deliberations, interactive sessions, and hands-on learning, it aimed to develop competent, reflective, and future-ready educators. Registration was free and online on a first-come, first-served basis.',
    // PASTE YOUTUBE URL(S) HERE
    videos: ['https://www.youtube.com/watch?v=zBFBCncP5Tk&list=PLg0LA_bABYR3TRm4NL3GDwNrtQzk2Nomf&index=5'],
    placeholderColor: '2980b9'
  },
  {
    id: 'surya-namaskar',
    title: 'Surya-Namaskar: A Radiant Way to Healthy Lifestyle',
    shortName: 'Surya Namaskar',
    date: 'June 14, 2026 · 7:00–8:00 A.M.',
    sortDate: '2026-06-14',
    venue: 'MP Hall, MNNIT Allahabad',
    guest: 'Prof. Archana Chahal — Professor & Head, Dept. of Physical Education, University of Allahabad',
    description:
      'A special invited session titled "Surya-namaskar: A Radiant Way to Healthy Lifestyle" delivered by Prof. Archana Chahal, Professor and Head of the Department of Physical Education, University of Allahabad. Hosted by MNNIT Allahabad, the early-morning session guided participants through the practice and benefits of Surya Namaskar, focusing on physical wellness, discipline, and mindfulness as part of a healthy daily lifestyle.',
    // PASTE YOUTUBE URL(S) HERE
    videos: [],
    placeholderColor: 'e74c3c'
  },
  {
    id: 'yoga',
    title: 'Kriyayoga Meditation Session',
    shortName: 'Yoga',
    date: 'June 7, 2026 · 7:00–8:00 A.M.',
    sortDate: '2026-06-07',
    venue: 'MP Hall, MNNIT Allahabad',
    guest: 'Yogi Satyam Ji — Kriyayoga Ashram & Research Institute, Jhunsi, Prayagraj',
    description:
      'A special invited session on Kriyayoga Meditation delivered by Yogi Satyam Ji of the Kriyayoga Ashram & Research Institute, Jhunsi, Prayagraj. Hosted by MNNIT Allahabad, this early-morning session introduced participants to Kriyayoga meditation techniques aimed at deepening mental calm, concentration, and inner well-being, supporting both spiritual and mental wellness of the campus community.',
    // PASTE YOUTUBE URL(S) HERE
    videos: [],
    placeholderColor: '9b59b6'
  },
  {
    id: 'expert-talk',
    title: 'Expert Talk — Motivating Young Engineers for Cyber Excellence',
    shortName: 'Expert Talk',
    date: 'November 17, 2025 · 10:00 A.M.–12:00 Noon',
    sortDate: '2025-11-17',
    venue: 'GS-06, MNNIT Allahabad',
    guest: 'Mr. Gurjit Singh — Senior DGM (Retd.), Bharat Electronics Limited, Noida',
    description:
      'An expert talk on "Motivating Young Engineers for Cyber Excellence", delivered by Mr. Gurjit Singh, Senior DGM (Retired) of Bharat Electronics Limited, Noida. Organised by the Department of Computer Science & Engineering, MNNIT Allahabad under the ISEA-III Project (sponsored by MeitY, Government of India), the session was attended by UG, PG, and PhD students along with faculty members. The talk motivated young engineers towards excellence and awareness in the field of cyber security.',
    // PASTE YOUTUBE URL(S) HERE
    videos: [],
    placeholderColor: '5b3ba6'
  },
  {
    id: 'mhwb',
    title: 'MHWB — Spiritual & Mental Wellbeing Center',
    shortName: 'MHWB',
    date: 'May 2026 (ongoing)',
    sortDate: '2026-05-01',
    venue: 'MNNIT Allahabad Campus',
    guest: 'Health Centre & Spiritual & Mental Wellbeing Center, MNNIT Allahabad',
    description:
      'A campus-wide mental health and wellbeing initiative run jointly by the Institute\'s Health Centre and the Spiritual & Mental Wellbeing Center. Recognising that students\' physical and mental health is essential for concentration and academic success, the initiative provides professional counsellors (for both boys and girls) available at designated hostels and centres on fixed days and times. Counselling support is offered for any anxiety- or stress-related concerns. Beyond scheduled hours, students can reach out to their guardian/HOD, Faculty In-charge (Boys/Girls), the medical officer, or the Dean (Student Welfare) for urgent needs, and may also contact the faculty/associate counsellors via their office email.',
    // PASTE YOUTUBE URL(S) HERE
    videos: ['https://www.youtube.com/watch?v=NvvMBg72JXk&list=PLg0LA_bABYR2gYpbpQtcsLnBE_YBMEePp&index=2'],
    placeholderColor: '34495e'
  }
]

// Extract a YouTube video id from any common URL format.
const youTubeId = (url) => {
  if (!url) return null
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/
  )
  return m ? m[1] : null
}

// Build the final media list for each event: videos first, then photos.
// Each item is { type: 'video'|'image', src, thumb? }.
const buildMedia = (event) => {
  const media = []

  for (const url of event.videos || []) {
    const vid = youTubeId(url)
    if (vid) {
      media.push({
        type: 'video',
        src: `https://www.youtube.com/embed/${vid}`,
        thumb: `https://img.youtube.com/vi/${vid}/hqdefault.jpg`
      })
    }
  }

  const photos = getPhotos(event.id)
  for (const url of photos) {
    media.push({ type: 'image', src: url })
  }

  // Nothing uploaded yet → show a single placeholder so the box isn't empty.
  if (media.length === 0) {
    media.push({
      type: 'image',
      src: placeholder(event.shortName, event.placeholderColor || '5b3ba6')
    })
  }

  return media
}

export const EVENTS = RAW_EVENTS.map((e) => ({ ...e, media: buildMedia(e) }))

// Newest first (by sortDate). Helper used by the timeline page.
export const getEventsNewestFirst = () =>
  [...EVENTS].sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate))

// Lookup used by the detail page.
export const getEventById = (id) => EVENTS.find((e) => e.id === id)
