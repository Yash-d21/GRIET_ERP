// Faculty mapping
export const facultyMap: Record<string, string> = {
  'CN': 'Shamila',
  'DBMS': 'Kiranmai',
  'WT': 'Annapurna',
  'DS': 'Dr G Karuna',
  'OS': 'Poornima',
  'DBM': 'Kiranmai', // Alternative code
}

// Room mapping
export const roomMap: Record<string, string> = {
  'CN': 'A101',
  'DBMS': 'A102',
  'WT': 'A103',
  'DS': 'A104',
  'OS': 'A105',
  'DBM': 'A102', // Alternative code
}

export function getFaculty(subject: string): string {
  if (subject === 'Break') return ''
  return facultyMap[subject] || 'TBA'
}

export function getRoom(subject: string): string {
  if (subject === 'Break') return ''
  return roomMap[subject] || 'TBA'
}

