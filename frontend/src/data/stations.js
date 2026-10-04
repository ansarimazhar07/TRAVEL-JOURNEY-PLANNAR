/**
 * stations.js
 * 
 * Curated dataset of major Indian Railways stations with codes, names, cities, and states.
 * Used for instant autocomplete and suggestions in the Train Search form.
 */

export const INDIAN_STATIONS = [
  // Major Metros & Hubs
  { code: 'NDLS', name: 'New Delhi', city: 'Delhi', state: 'Delhi' },
  { code: 'DLI',  name: 'Old Delhi Junction', city: 'Delhi', state: 'Delhi' },
  { code: 'NZM',  name: 'Hazrat Nizamuddin', city: 'Delhi', state: 'Delhi' },
  { code: 'ANVT', name: 'Anand Vihar Terminal', city: 'Delhi', state: 'Delhi' },
  { code: 'CSMT', name: 'Mumbai CSMT', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'BDTS', name: 'Bandra Terminus', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'LTT',  name: 'Lokmanya Tilak Terminus', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra' },
  { code: 'HWH',  name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal' },
  { code: 'SDAH', name: 'Sealdah', city: 'Kolkata', state: 'West Bengal' },
  { code: 'KOAA', name: 'Kolkata Railway Station', city: 'Kolkata', state: 'West Bengal' },
  { code: 'MAS',  name: 'MGR Chennai Central', city: 'Chennai', state: 'Tamil Nadu' },
  { code: 'MS',   name: 'Chennai Egmore', city: 'Chennai', state: 'Tamil Nadu' },
  { code: 'SBC',  name: 'KSR Bengaluru City', city: 'Bengaluru', state: 'Karnataka' },
  { code: 'YPR',  name: 'Yesvantpur Junction', city: 'Bengaluru', state: 'Karnataka' },
  { code: 'SMVB', name: 'SMVT Bengaluru', city: 'Bengaluru', state: 'Karnataka' },
  { code: 'HYB',  name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana' },
  { code: 'SC',   name: 'Secunderabad Junction', city: 'Hyderabad', state: 'Telangana' },
  { code: 'ADI',  name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat' },

  // Madhya Pradesh / Malwa Region
  { code: 'UJN',  name: 'Ujjain Junction', city: 'Ujjain', state: 'Madhya Pradesh' },
  { code: 'INDB', name: 'Indore Junction', city: 'Indore', state: 'Madhya Pradesh' },
  { code: 'BPL',  name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh' },
  { code: 'RKMP', name: 'Rani Kamlapati', city: 'Bhopal', state: 'Madhya Pradesh' },
  { code: 'GWL',  name: 'Gwalior Junction', city: 'Gwalior', state: 'Madhya Pradesh' },
  { code: 'JBP',  name: 'Jabalpur Junction', city: 'Jabalpur', state: 'Madhya Pradesh' },
  { code: 'NAD',  name: 'Nagda Junction', city: 'Nagda', state: 'Madhya Pradesh' },
  { code: 'RTM',  name: 'Ratlam Junction', city: 'Ratlam', state: 'Madhya Pradesh' },

  // Rajasthan & Golden Triangle
  { code: 'JP',   name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan' },
  { code: 'AII',  name: 'Ajmer Junction', city: 'Ajmer', state: 'Rajasthan' },
  { code: 'JU',   name: 'Jodhpur Junction', city: 'Jodhpur', state: 'Rajasthan' },
  { code: 'UDZ',  name: 'Udaipur City', city: 'Udaipur', state: 'Rajasthan' },
  { code: 'BKN',  name: 'Bikaner Junction', city: 'Bikaner', state: 'Rajasthan' },
  { code: 'KOTA', name: 'Kota Junction', city: 'Kota', state: 'Rajasthan' },
  { code: 'AGC',  name: 'Agra Cantt', city: 'Agra', state: 'Uttar Pradesh' },
  { code: 'AF',   name: 'Agra Fort', city: 'Agra', state: 'Uttar Pradesh' },

  // Uttar Pradesh & North India
  { code: 'BSB',  name: 'Varanasi Junction', city: 'Varanasi', state: 'Uttar Pradesh' },
  { code: 'DDU',  name: 'Pt. Deen Dayal Upadhyaya Jn', city: 'Mughalsarai', state: 'Uttar Pradesh' },
  { code: 'LKO',  name: 'Lucknow Charbagh', city: 'Lucknow', state: 'Uttar Pradesh' },
  { code: 'LJN',  name: 'Lucknow Junction NER', city: 'Lucknow', state: 'Uttar Pradesh' },
  { code: 'CNB',  name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh' },
  { code: 'PRYJ', name: 'Prayagraj Junction', city: 'Prayagraj', state: 'Uttar Pradesh' },
  { code: 'GKP',  name: 'Gorakhpur Junction', city: 'Gorakhpur', state: 'Uttar Pradesh' },
  { code: 'AY',   name: 'Ayodhya Dham Junction', city: 'Ayodhya', state: 'Uttar Pradesh' },
  { code: 'MTC',  name: 'Meerut City', city: 'Meerut', state: 'Uttar Pradesh' },
  { code: 'HW',   name: 'Haridwar Junction', city: 'Haridwar', state: 'Uttarakhand' },
  { code: 'DDN',  name: 'Dehradun', city: 'Dehradun', state: 'Uttarakhand' },
  { code: 'CDG',  name: 'Chandigarh Junction', city: 'Chandigarh', state: 'Punjab/Haryana' },
  { code: 'ASR',  name: 'Amritsar Junction', city: 'Amritsar', state: 'Punjab' },
  { code: 'JAT',  name: 'Jammu Tawi', city: 'Jammu', state: 'Jammu & Kashmir' },
  { code: 'SVDK', name: 'Shri Mata Vaishno Devi Katra', city: 'Katra', state: 'Jammu & Kashmir' },

  // Goa & Coastal Destinations
  { code: 'MAO',  name: 'Madgaon Junction', city: 'Goa', state: 'Goa' },
  { code: 'THVM', name: 'Thivim', city: 'North Goa', state: 'Goa' },
  { code: 'KRMI', name: 'Karmali', city: 'Old Goa', state: 'Goa' },
  { code: 'ST',   name: 'Surat', city: 'Surat', state: 'Gujarat' },
  { code: 'BRC',  name: 'Vadodara Junction', city: 'Vadodara', state: 'Gujarat' },
  { code: 'RJT',  name: 'Rajkot Junction', city: 'Rajkot', state: 'Gujarat' },
  { code: 'NGP',  name: 'Nagpur Junction', city: 'Nagpur', state: 'Maharashtra' },

  // South India Destinations
  { code: 'MYS',  name: 'Mysuru Junction', city: 'Mysuru', state: 'Karnataka' },
  { code: 'MAQ',  name: 'Mangaluru Central', city: 'Mangaluru', state: 'Karnataka' },
  { code: 'UBL',  name: 'SSS Hubballi Junction', city: 'Hubballi', state: 'Karnataka' },
  { code: 'CBE',  name: 'Coimbatore Junction', city: 'Coimbatore', state: 'Tamil Nadu' },
  { code: 'MDU',  name: 'Madurai Junction', city: 'Madurai', state: 'Tamil Nadu' },
  { code: 'TPJ',  name: 'Tiruchchirappalli Junction', city: 'Tiruchirappalli', state: 'Tamil Nadu' },
  { code: 'RU',   name: 'Renigunta Junction', city: 'Tirupati', state: 'Andhra Pradesh' },
  { code: 'TPTY', name: 'Tirupati', city: 'Tirupati', state: 'Andhra Pradesh' },
  { code: 'BZA',  name: 'Vijayawada Junction', city: 'Vijayawada', state: 'Andhra Pradesh' },
  { code: 'VSKP', name: 'Visakhapatnam Junction', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { code: 'TVC',  name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram', state: 'Kerala' },
  { code: 'ERS',  name: 'Ernakulam South', city: 'Kochi', state: 'Kerala' },
  { code: 'ERN',  name: 'Ernakulam Town', city: 'Kochi', state: 'Kerala' },
  { code: 'CLT',  name: 'Kozhikode Main', city: 'Kozhikode', state: 'Kerala' },

  // East & North East
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar' },
  { code: 'GAYA', name: 'Gaya Junction', city: 'Gaya', state: 'Bihar' },
  { code: 'RNC',  name: 'Ranchi Junction', city: 'Ranchi', state: 'Jharkhand' },
  { code: 'DHN',  name: 'Dhanbad Junction', city: 'Dhanbad', state: 'Jharkhand' },
  { code: 'TATA', name: 'Tatanagar Junction', city: 'Jamshedpur', state: 'Jharkhand' },
  { code: 'BBS',  name: 'Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha' },
  { code: 'PURI', name: 'Puri Terminus', city: 'Puri', state: 'Odisha' },
  { code: 'R',    name: 'Raipur Junction', city: 'Raipur', state: 'Chhattisgarh' },
  { code: 'DURG', name: 'Durg Junction', city: 'Durg/Bhilai', state: 'Chhattisgarh' },
  { code: 'BSP',  name: 'Bilaspur Junction', city: 'Bilaspur', state: 'Chhattisgarh' },
  { code: 'GHY',  name: 'Guwahati', city: 'Guwahati', state: 'Assam' },
  { code: 'NJP',  name: 'New Jalpaiguri', city: 'Siliguri', state: 'West Bengal' }
]

/**
 * Filter stations by search term across code, name, city, and state
 */
export function filterStations(query, limit = 8) {
  if (!query || typeof query !== 'string') {
    // Return major popular hubs when empty
    return INDIAN_STATIONS.slice(0, limit)
  }

  const clean = query.trim().toLowerCase()
  if (clean === '') {
    return INDIAN_STATIONS.slice(0, limit)
  }

  // Exact code matches first
  const exactCodeMatches = []
  // Code starts-with matches
  const codePrefixMatches = []
  // Name starts-with matches
  const namePrefixMatches = []
  // Other matches (city, substring, etc.)
  const otherMatches = []

  const seen = new Set()

  for (const st of INDIAN_STATIONS) {
    const code = st.code.toLowerCase()
    const name = st.name.toLowerCase()
    const city = st.city.toLowerCase()
    const state = st.state.toLowerCase()

    if (code === clean) {
      exactCodeMatches.push(st)
      seen.add(st.code)
    } else if (code.startsWith(clean)) {
      codePrefixMatches.push(st)
      seen.add(st.code)
    } else if (name.startsWith(clean) || city.startsWith(clean)) {
      if (!seen.has(st.code)) {
        namePrefixMatches.push(st)
        seen.add(st.code)
      }
    } else if (name.includes(clean) || city.includes(clean) || state.includes(clean) || code.includes(clean)) {
      if (!seen.has(st.code)) {
        otherMatches.push(st)
        seen.add(st.code)
      }
    }
  }

  return [...exactCodeMatches, ...codePrefixMatches, ...namePrefixMatches, ...otherMatches].slice(0, limit)
}
