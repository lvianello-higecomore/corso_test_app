export function minutesAgo(n) { return new Date(Date.now() - n * 60 * 1000) }
export function hoursAgo(n) { return new Date(Date.now() - n * 60 * 60 * 1000) }

export function formatTimeAgo(date) {
  if (!date) return ''
  const diffInMinutes = Math.floor((Date.now() - date.getTime()) / 60000)
  if (diffInMinutes < 1) return 'Adesso'
  if (diffInMinutes < 60) return `${diffInMinutes} minuti fa`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} ore fa`
  return `${Math.floor(diffInHours / 24)} giorni fa`
}

export function formatDateTime(date) {
  if (!date) return ''
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(date)
}

export const users = [
  { id: 1, username: 'marco', password: 'Marco2024!', name: 'Marco Rossi', role: 'automobilista' },
  { id: 2, username: 'lucia', password: 'Lucia2024!', name: 'Lucia Bianchi', role: 'automobilista' },
  { id: 3, username: 'giuseppe', password: 'Giuseppe2024!', name: 'Giuseppe Verdi', role: 'tecnico', location: { lat: 45.4642, lng: 9.1900 } },
  { id: 4, username: 'anna', password: 'Anna2024!', name: 'Anna Neri', role: 'tecnico', location: { lat: 45.4800, lng: 9.2100 } },
  { id: 5, username: 'roberto', password: 'Roberto2024!', name: 'Roberto Esposito', role: 'operatore' },
  { id: 7, username: 'robert2o', password: 'Roberto2024!', name: 'Roberto Gustativi', role: 'operatore' },
  { id: 6, username: 'admin', password: 'Admin2024!', name: 'Admin Sistema', role: 'operatore' }
]

export function getInitialStations() {
  return [
    { id: 1, name: 'COL-001', location: 'Parcheggio Centro', address: 'Via Roma 1, Milano', coordinates: { lat: 45.4654, lng: 9.1859 }, status: 'disponibile', power: 22, connector: 'Type 2', lastTelemetry: minutesAgo(5), offlineSince: null },
    { id: 2, name: 'COL-002', location: 'Parcheggio Centro', address: 'Via Roma 1, Milano', coordinates: { lat: 45.4655, lng: 9.1860 }, status: 'occupata', power: 50, connector: 'CCS', lastTelemetry: minutesAgo(2), offlineSince: null },
    { id: 3, name: 'COL-003', location: 'Parcheggio Stazione', address: "Piazza Duca d'Aosta 1, Milano", coordinates: { lat: 45.4847, lng: 9.2027 }, status: 'guasta', power: 22, connector: 'Type 2', lastTelemetry: minutesAgo(35), offlineSince: minutesAgo(35) },
    { id: 4, name: 'COL-004', location: 'Parcheggio Stazione', address: "Piazza Duca d'Aosta 1, Milano", coordinates: { lat: 45.4848, lng: 9.2028 }, status: 'disponibile', power: 150, connector: 'CCS', lastTelemetry: minutesAgo(1), offlineSince: null },
    { id: 5, name: 'COL-005', location: 'Azienda TechCorp', address: 'Via Innovazione 10, Milano', coordinates: { lat: 45.4780, lng: 9.2300 }, status: 'offline', power: 22, connector: 'Type 2', lastTelemetry: minutesAgo(20), offlineSince: minutesAgo(20) },
    { id: 6, name: 'COL-006', location: 'Azienda TechCorp', address: 'Via Innovazione 10, Milano', coordinates: { lat: 45.4781, lng: 9.2301 }, status: 'disponibile', power: 50, connector: 'CCS', lastTelemetry: minutesAgo(0.5), offlineSince: null },
    { id: 7, name: 'COL-007', location: 'Parcheggio Aeroporto', address: "Via dell'Aeroporto 5, Milano", coordinates: { lat: 45.4500, lng: 9.2800 }, status: 'offline', power: 50, connector: 'CCS', lastTelemetry: minutesAgo(4), offlineSince: minutesAgo(4) },
    { id: 8, name: 'COL-008', location: 'Parcheggio Aeroporto', address: "Via dell'Aeroporto 5, Milano", coordinates: { lat: 45.4501, lng: 9.2801 }, status: 'disponibile', power: 22, connector: 'Type 2', lastTelemetry: minutesAgo(1), offlineSince: null }
  ]
}

export function getInitialTariffs() {
  return [
    { id: 1, locationName: 'Parcheggio Centro', timeSlots: [
      { label: 'Diurna (8-20)', startHour: 8, endHour: 20, pricePerKWh: 0.45 },
      { label: 'Notturna (20-8)', startHour: 20, endHour: 8, pricePerKWh: 0.30 }
    ]},
    { id: 2, locationName: 'Parcheggio Stazione', timeSlots: [
      { label: 'Diurna (7-22)', startHour: 7, endHour: 22, pricePerKWh: 0.50 },
      { label: 'Notturna (22-7)', startHour: 22, endHour: 7, pricePerKWh: 0.35 }
    ]},
    { id: 3, locationName: 'Azienda TechCorp', timeSlots: [
      { label: 'Orario lavoro (8-18)', startHour: 8, endHour: 18, pricePerKWh: 0.40 },
      { label: 'Fuori orario (18-8)', startHour: 18, endHour: 8, pricePerKWh: 0.25 }
    ]},
    { id: 4, locationName: 'Parcheggio Aeroporto', timeSlots: [
      { label: 'Diurna (6-23)', startHour: 6, endHour: 23, pricePerKWh: 0.55 },
      { label: 'Notturna (23-6)', startHour: 23, endHour: 6, pricePerKWh: 0.38 }
    ]}
  ]
}

export function getInitialTickets() {
  return [
    { id: 1, stationId: 3, stationName: 'COL-003', locationName: 'Parcheggio Stazione', description: 'Connettore danneggiato, non aggancia il veicolo', priority: 'alta', status: 'assegnato', assignedTo: 3, createdAt: hoursAgo(2), updatedAt: hoursAgo(1) },
    { id: 2, stationId: 5, stationName: 'COL-005', locationName: 'Azienda TechCorp', description: 'Display non funzionante, errore E45', priority: 'media', status: 'assegnato', assignedTo: 4, createdAt: hoursAgo(5), updatedAt: hoursAgo(3) },
    { id: 3, stationId: 5, stationName: 'COL-005', locationName: 'Azienda TechCorp', description: 'Nessuna risposta dal modulo di comunicazione', priority: 'alta', status: 'aperto', assignedTo: 3, createdAt: hoursAgo(1), updatedAt: hoursAgo(1) },
    { id: 4, stationId: 7, stationName: 'COL-007', locationName: 'Parcheggio Aeroporto', description: 'Errore di alimentazione intermittente', priority: 'bassa', status: 'assegnato', assignedTo: 3, createdAt: hoursAgo(24), updatedAt: hoursAgo(12) },
    { id: 5, stationId: 2, stationName: 'COL-002', locationName: 'Parcheggio Centro', description: 'Lettore RFID non funzionante', priority: 'media', status: 'risolto', assignedTo: 4, createdAt: hoursAgo(48), updatedAt: hoursAgo(24) }
  ]
}

export function getInitialSessions() {
  return [
    { id: 1, stationId: 2, stationName: 'COL-002', userId: 1, startTime: hoursAgo(1), endTime: null, kWh: 15.3, tariffAtStart: { pricePerKWh: 0.45, label: 'Diurna' }, totalCost: 6.89, paid: false, paymentMethod: null, status: 'in_corso' },
    { id: 2, stationId: 1, stationName: 'COL-001', userId: 2, startTime: hoursAgo(3), endTime: hoursAgo(2), kWh: 22.5, tariffAtStart: { pricePerKWh: 0.45, label: 'Diurna' }, totalCost: 10.13, paid: true, paymentMethod: 'Visa', status: 'completata' },
    { id: 3, stationId: 4, stationName: 'COL-004', userId: 1, startTime: hoursAgo(25), endTime: hoursAgo(24), kWh: 45.0, tariffAtStart: { pricePerKWh: 0.50, label: 'Diurna' }, totalCost: 22.50, paid: true, paymentMethod: 'PayPal', status: 'completata' }
  ]
}

export function getInitialNotifications() {
  return [
    { id: 1, type: 'offline', message: 'COL-003 offline da 35 minuti', stationId: 3, timestamp: minutesAgo(30), read: false },
    { id: 2, type: 'offline', message: 'COL-005 offline da 20 minuti', stationId: 5, timestamp: minutesAgo(15), read: false },
    { id: 3, type: 'guasto', message: 'COL-003 segnalata come guasta', stationId: 3, timestamp: hoursAgo(2), read: true },
    { id: 4, type: 'ticket_update', message: 'Ticket #5 risolto da Anna Neri', ticketId: 5, timestamp: hoursAgo(24), read: true }
  ]
}
