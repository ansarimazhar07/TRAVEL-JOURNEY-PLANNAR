/**
 * routePlannerData.js
 *
 * Rich source-to-destination knowledge base for Travel Journey Planner.
 * Provides hyper-specific details:
 * - Exact train names, train numbers, journey durations, departure/arrival stations, and fares.
 * - Exact flights, airlines, airport IATA codes, and flight durations.
 * - Exact highway corridors, driving times, and premier bus operators.
 * - Exact local transit (metro lines, scooter rentals, app cabs).
 * - Exact named dishes, iconic eateries, food streets, and sweet shops.
 * - Exact shopping bazaars, specific items to buy with price ranges, and bargaining advice.
 * - Detailed day-by-day itineraries with morning, afternoon, evening timing and spots.
 */

export function getSpecificRouteData(source, dest) {
  const src = (source || '').trim().toLowerCase();
  const dst = (dest || '').trim().toLowerCase();

  let srcKey = 'default';
  if (src.includes('mumbai') || src.includes('bombay')) srcKey = 'mumbai';
  else if (src.includes('delhi') || src.includes('ncr')) srcKey = 'delhi';
  else if (src.includes('bengaluru') || src.includes('bangalore')) srcKey = 'bengaluru';
  else if (src.includes('kolkata') || src.includes('calcutta')) srcKey = 'kolkata';
  else if (src.includes('ahmedabad')) srcKey = 'ahmedabad';
  else if (src.includes('pune')) srcKey = 'pune';
  else if (src.includes('hyderabad')) srcKey = 'hyderabad';
  else if (src.includes('chennai')) srcKey = 'chennai';

  let dstKey = 'custom';
  if (dst.includes('jaipur')) dstKey = 'jaipur';
  else if (dst.includes('goa')) dstKey = 'goa';
  else if (dst.includes('manali')) dstKey = 'manali';
  else if (dst.includes('agra')) dstKey = 'agra';
  else if (dst.includes('varanasi') || dst.includes('banaras') || dst.includes('kashi')) dstKey = 'varanasi';
  else if (dst.includes('udaipur')) dstKey = 'udaipur';
  else if (dst.includes('kerala') || dst.includes('kochi') || dst.includes('cochin') || dst.includes('munnar') || dst.includes('alleppey')) dstKey = 'kerala';
  else if (dst.includes('ladakh') || dst.includes('leh')) dstKey = 'ladakh';
  else if (dst.includes('shimla')) dstKey = 'shimla';
  else if (dst.includes('rishikesh') || dst.includes('haridwar')) dstKey = 'rishikesh';
  else if (dst.includes('amritsar')) dstKey = 'amritsar';
  else if (dst.includes('paris')) dstKey = 'paris';
  else if (dst.includes('dubai')) dstKey = 'dubai';
  else if (dst.includes('zurich') || dst.includes('switzerland')) dstKey = 'switzerland';
  else if (dst.includes('bali')) dstKey = 'bali';
  else if (dst.includes('singapore')) dstKey = 'singapore';

  const routeKey = `${srcKey}->${dstKey}`;

  const routes = {
    // 1. Mumbai -> Jaipur
    'mumbai->jaipur': {
      trains: [
        "**Train #12955 Mumbai Central - Jaipur SF Express**: Departs Mumbai Central (MMCT) 06:50 PM, arrives Jaipur Junction (JP) next day at 12:45 PM (17h 55m). Classes: 1A, 2A, 3A, SL. Approx fare: ₹1,420 (3AC), ₹2,030 (2AC).",
        "**Train #12979 Bandra Terminus - Jaipur SF Express**: Departs BDTS at 05:05 PM, arrives Jaipur at 09:50 AM (16h 45m). Clean superfast route.",
        "**Train #12239 Mumbai - Jaipur Duronto Express**: Departs MMCT 11:15 PM, arrives Jaipur 02:30 PM (15h 15m non-stop commercial halts). Ideal for time-saving overnight travel."
      ],
      flights: [
        "**Airports**: Chhatrapati Shivaji Maharaj International (BOM T2) to Jaipur International (JAI T2).",
        "**Airlines**: Direct non-stop flights via IndiGo (6E-5134) and Air India (AI-611).",
        "**Flight Duration**: 1 hr 45 min non-stop.",
        "**Typical Airfare**: ₹3,800 - ₹5,800 one-way per passenger (book 2-3 weeks ahead)."
      ],
      road: [
        "**Highway Corridor**: ~1,148 km via NH48 (Mumbai - Surat - Vadodara - Ahmedabad - Udaipur - Jaipur) or Western Dedicated Expressway connections.",
        "**Driving Hours**: ~20-22 hours drive with overnight halt recommended at Udaipur.",
        "**Buses**: Private AC Sleeper buses (Shrinath Travels, Zingbus, Gujarat Travels) depart Borivali/Andheri (₹1,200 - ₹2,200)."
      ],
      local_commute: [
        "**Jaipur Metro**: Operates from Mansarovar to Badi Chaupar (walkable to Hawa Mahal & City Palace), ticket ₹20.",
        "**E-Rickshaws**: Readily available inside the walled Pink City (₹30-₹60 for short hops between Johari Bazaar & Hawa Mahal).",
        "**App Cabs**: Uber and Ola operate extensively with fixed upfront fares (Airport/Station to Old City: ₹200-₹350)."
      ]
    },

    // 2. Delhi -> Jaipur
    'delhi->jaipur': {
      trains: [
        "**Train #20978 Delhi Cantt - Jaipur Vande Bharat Express**: Departs Delhi Cantt (DEC) at 06:10 AM, arrives Jaipur (JP) at 10:05 AM (3h 55m). Chair Car ₹1,050, Executive ₹1,800. Fastest rail link.",
        "**Train #12015 New Delhi - Ajmer Shatabdi Express**: Departs NDLS at 06:10 AM, arrives Jaipur at 10:40 AM (4h 30m). Includes breakfast.",
        "**Train #12414 Pooja Superfast Express**: Departs Delhi (DLI) at 09:50 PM, arrives Jaipur at 02:40 AM (Overnight link, ₹350 SL, ₹850 3AC)."
      ],
      flights: [
        "**Airports**: Indira Gandhi International (DEL T2/T3) to Jaipur International (JAI).",
        "**Airlines**: IndiGo & Alliance Air. Flight duration: 55 minutes.",
        "**Typical Airfare**: ₹2,200 - ₹3,600 one-way."
      ],
      road: [
        "**Highway Corridor**: ~260 km via NE4 (Delhi-Mumbai Expressway via Sohna/Dausa) or NH48. Driving time: 3.5 to 4.5 hours.",
        "**Buses**: RSRTC Volvo Goldline from Bikaner House (India Gate) & NueGo Electric AC buses from Dhaula Kuan every 30 mins (₹550 - ₹850)."
      ],
      local_commute: [
        "**Jaipur Metro**: Badi Chaupar station opens right onto the Hawa Mahal bazaar corridor.",
        "**Auto-Rickshaws**: Pre-bargain or use Uber Auto (₹40-₹100 inside walled city).",
        "**Rental Scooters**: Available near Jaipur Junction (₹400/day)."
      ]
    },

    // 3. Ahmedabad -> Jaipur
    'ahmedabad->jaipur': {
      trains: [
        "**Train #12957 Ahmedabad - New Delhi Swarna Jayanti Rajdhani Express**: Departs Sabarmati (SBIB) at 05:45 PM, arrives Jaipur at 01:05 AM (7h 20m).",
        "**Train #20984 Ahmedabad - Jaipur Vande Bharat Express**: Departs Ahmedabad at 06:00 AM, arrives Jaipur at 12:45 PM (6h 45m).",
        "**Train #12915 Ashram Express**: Departs Ahmedabad at 07:15 PM, arrives Jaipur at 04:20 AM."
      ],
      flights: [
        "**Airports**: Sardar Vallabhbhai Patel (AMD) to Jaipur (JAI).",
        "**Airlines**: IndiGo & SpiceJet non-stop (1 hr 10 min). Fare: ₹2,600 - ₹4,200."
      ],
      road: [
        "**Highway**: ~660 km via NH48 through Udaipur. Driving time: 11-12 hours.",
        "**Buses**: Shrinath Travels & Gujarat Travels AC Sleeper Volvos (₹800 - ₹1,400)."
      ],
      local_commute: [
        "**Jaipur Metro & E-Rickshaws**: Seamless connectivity across Pink City gates."
      ]
    },

    // 4. Mumbai -> Goa
    'mumbai->goa': {
      trains: [
        "**Train #22229 CSMT - Madgaon Vande Bharat Express**: Departs CSMT at 05:25 AM, arrives Madgaon (MAO) at 01:10 PM (7h 45m). Scenic Western Ghats & Konkan views. CC ₹1,665, Exec ₹3,100.",
        "**Train #10103 Mandovi Express**: Departs CSMT at 07:10 AM, arrives Madgaon at 07:00 PM (11h 50m). Renowned pantry serving authentic pant-car treats.",
        "**Train #12133 Mangaluru SF Express**: Departs CSMT at 10:02 PM, arrives Madgaon next morning at 07:05 AM (9 hrs, perfect overnight sleeper)."
      ],
      flights: [
        "**Airports**: Mumbai (BOM) to Dabolim (GOI - Central/South Goa) or Manohar Mopa (GOX - North Goa).",
        "**Airlines**: IndiGo, Akasa Air, Air India. Flight duration: 1 hr 15 min.",
        "**Typical Airfare**: ₹2,400 - ₹4,500 one-way."
      ],
      road: [
        "**Highway Corridor**: ~590 km via NH66 (Scenic Konkan Coastal Highway via Chiplun) or NH48 (via Pune - Kolhapur - Chorla Ghat). Driving time: 10-11 hours.",
        "**Buses**: Kadamba Transport & Paulo Travels AC Sleeper coaches from Borivali/Sion/Vashi (₹950 - ₹1,800, 12-14 hrs)."
      ],
      local_commute: [
        "**Scooter Rental**: Honda Activa widely available at ₹350 - ₹500/day across North & South Goa.",
        "**App Taxis**: GoaMiles government-approved app cab service (avoids street taxi overcharging).",
        "**Self-Drive Cars**: Swift/Thar available at ₹1,200 - ₹2,500/day with valid driving license."
      ]
    },

    // 5. Pune -> Goa
    'pune->goa': {
      trains: [
        "**Train #12780 Goa Express**: Departs Pune Junction (PUNE) at 04:30 PM, arrives Madgaon (MAO) next morning at 05:40 AM (13h 10m).",
        "**Train #17318 Dadar - Hubballi / Vasco Express**: Overnight link to Goa."
      ],
      flights: [
        "**Airports**: Pune (PNQ) to Goa Mopa (GOX) or Dabolim (GOI). IndiGo non-stop in 1 hr.",
        "**Fare**: ₹2,200 - ₹3,800."
      ],
      road: [
        "**Highway Corridor**: ~460 km via NH48 (Pune - Satara - Kolhapur - Nipani - Amboli Ghat - Sawantwadi - Goa). Driving time: 8-9 hours.",
        "**Buses**: KSRTC Airavat, Paulo Travels, IntrCity SmartBus AC Sleeper (₹800 - ₹1,500, 9-10 hrs)."
      ],
      local_commute: [
        "**Scooter & Bike Rentals**: Available across Calangute, Anjuna, Candolim, and Colva at ₹350 - ₹500/day."
      ]
    },

    // 6. Bengaluru -> Goa
    'bengaluru->goa': {
      trains: [
        "**Train #17309 Yesvantpur - Vasco da Gama Express**: Departs Yesvantpur (YPR) at 03:00 PM, arrives Madgaon (MAO) at 04:00 AM (13 hrs). Passes scenic Dudhsagar Waterfalls.",
        "**Train #20653 KSR Bengaluru - Belagavi Superfast**: Connected through Hubballi."
      ],
      flights: [
        "**Airports**: Kempegowda International (BLR) to Goa Dabolim (GOI) or Mopa (GOX).",
        "**Airlines**: IndiGo, Akasa Air, Air India Express (Multiple flights daily, 1h 10m).",
        "**Fare**: ₹2,500 - ₹4,200 one-way."
      ],
      road: [
        "**Highway Corridor**: ~560 km via NH48 (Bengaluru - Tumakuru - Chitradurga - Hubballi - Dharwad - Mollem - Goa). Driving time: 10-11 hours.",
        "**Buses**: KSRTC Airavat Club Class Multi-Axle Volvo & Seabird Tourists (₹900 - ₹1,700, 11-12 hrs)."
      ],
      local_commute: [
        "**Scooter Rentals & GoaMiles Taxis**: Pre-book at railway stations or airport terminals."
      ]
    },

    // 7. Delhi -> Goa
    'delhi->goa': {
      trains: [
        "**Train #12450 Goa Sampark Kranti Express**: Departs Hazrat Nizamuddin (NZM) at 06:15 AM, arrives Madgaon (MAO) next day at 11:50 AM (29h 35m).",
        "**Train #12618 Mangala Lakshadweep Express**: Departs NZM at 05:35 AM, arrives Madgaon next day at 02:40 PM."
      ],
      flights: [
        "**Airports**: New Delhi (DEL T2/T3) to Goa Mopa (GOX) or Dabolim (GOI).",
        "**Airlines**: IndiGo (6E-2051), Air India Express, SpiceJet. Flight time: 2 hrs 35 mins direct.",
        "**Typical Airfare**: ₹4,200 - ₹7,200 one-way."
      ],
      road: [
        "**Long-distance Road**: ~1,880 km via NH48 (2-3 days driving). Flying or superfast trains strongly advised."
      ],
      local_commute: [
        "**Scooter Rentals**: ₹350-₹500/day. Keep helmet and original driving license on hand.",
        "**Airport Transfers**: Electric AC express buses link Mopa Airport to Calangute/Panaji for ₹200."
      ]
    },

    // 8. Delhi -> Manali
    'delhi->manali': {
      trains: [
        "**Train + Road Combo**: Train #12011 Kalka Shatabdi or Train #22447 Vande Bharat from New Delhi (NDLS) to Chandigarh Junction (CDG) in 3h 15m. Then take a private cab or Volvo bus from Chandigarh via Kiratpur-Nerchowk Four-Lane Expressway to Manali (6-7 hrs). Total travel time: ~10 hrs."
      ],
      flights: [
        "**Airports**: New Delhi (DEL T3) to Kullu-Manali Bhuntar Airport (KUU, 50 km from Manali).",
        "**Airlines**: Alliance Air ATR-72 daily flights (1h 20m). Fare: ₹4,500 - ₹8,500.",
        "**Airport Transfer**: Bhuntar to Manali local union cab costs ₹1,800 - ₹2,200."
      ],
      road: [
        "**Overnight Volvo Buses**: Premier AC Sleeper/Semi-Sleeper Volvos (Zingbus, Laxmi Holidays, HRTC Himsuta) depart Kashmere Gate ISBT & Majnu Ka Tilla at 07:00 PM - 09:30 PM, arriving Manali Mall Road by 08:30 AM (12-13 hrs). Fare: ₹900 - ₹1,650.",
        "**Self-Drive Route**: ~540 km via NH44 (Delhi - Ambala) -> Kiratpur -> Mandi -> Pandoh Tunnel -> Kullu -> Manali."
      ],
      local_commute: [
        "**Motorcycle Rentals**: Royal Enfield Classic 350 / Himalayan available on Mall Road & Old Manali (₹1,000 - ₹1,500/day).",
        "**Local Cabs**: Union taxi counters for Solang Valley and Atal Tunnel day tours (fixed standard tariff)."
      ]
    },

    // 9. Delhi -> Varanasi
    'delhi->varanasi': {
      trains: [
        "**Train #22436 New Delhi - Varanasi Vande Bharat Express**: Departs NDLS at 06:00 AM, arrives Varanasi (BSB) at 02:00 PM (8h flat). CC ₹1,750, Exec ₹3,300. India's premier semi-high speed train.",
        "**Train #12560 Shiv Ganga Express**: Departs NDLS at 08:05 PM, arrives Banaras (BSBS) at 06:10 AM (Overnight 10h 05m). Punctual superfast link with high passenger comfort.",
        "**Train #12382 Poorva Express**: Departs NDLS at 05:40 PM, arrives Varanasi at 05:15 AM."
      ],
      flights: [
        "**Airports**: Delhi (DEL T2) to Lal Bahadur Shastri Airport (VNS).",
        "**Airlines**: IndiGo (6E-2211), Air India. Flight duration: 1 hr 25 min.",
        "**Typical Airfare**: ₹3,200 - ₹5,400."
      ],
      road: [
        "**Expressway Route**: ~820 km via Yamuna Expressway -> Agra-Lucknow Expressway -> Purvanchal Expressway. Smooth 11-12 hours drive."
      ],
      local_commute: [
        "**E-Rickshaws**: Connect Cantt Railway Station to Godowlia Crossing (₹30-₹50/seat).",
        "**Wooden Boats**: Traditional hand-rowed and motor boats for morning Ghat tours from Dashashwamedh to Assi Ghat (₹300 - ₹600 for group)."
      ]
    },

    // 10. Kolkata -> Varanasi
    'kolkata->varanasi': {
      trains: [
        "**Train #12301 Howrah - New Delhi Rajdhani Express**: Departs Howrah (HWH) at 04:50 PM, arrives Pt. Deen Dayal Upadhyaya / Varanasi at 12:45 AM (8h).",
        "**Train #12317 Akal Takht Express**: Departs Kolkata (KOAA) at 07:40 AM, arrives Varanasi (BSB) at 07:45 PM (12h).",
        "**Train #12333 Vibhuti Express**: Departs Howrah at 08:00 PM, arrives Varanasi at 09:30 AM (13h 30m overnight)."
      ],
      flights: [
        "**Airports**: Netaji Subhash Chandra Bose (CCU) to Varanasi (VNS).",
        "**Airlines**: IndiGo non-stop (1 hr 15 min). Fare: ₹3,100 - ₹4,800."
      ],
      road: [
        "**Highway**: ~680 km via NH19 (Grand Trunk Road). Driving time: 13-14 hours."
      ],
      local_commute: [
        "**E-Rickshaws & Heritage Ghat Boats**: Connect Godowlia, Kashi Vishwanath corridor, and riverfront steps."
      ]
    },

    // 11. Delhi -> Agra
    'delhi->agra': {
      trains: [
        "**Train #12050 Gatimaan Express**: Departs Hazrat Nizamuddin (NZM) at 08:10 AM, arrives Agra Cantt (AGC) at 09:50 AM (1 hr 40 min). India's fastest luxury executive train. CC ₹860, Exec ₹1,695.",
        "**Train #20172 Vande Bharat Express**: Departs Hazrat Nizamuddin at 02:40 PM, arrives Agra Cantt at 04:08 PM (1h 28m).",
        "**Train #12002 Bhopal Shatabdi**: Departs NDLS at 06:00 AM, arrives Agra Cantt at 07:50 AM (1h 50m)."
      ],
      flights: [
        "**Note**: Due to high-speed rail and 6-lane expressway, train or driving is significantly faster than air travel."
      ],
      road: [
        "**Yamuna Expressway**: ~210 km via 6-lane access-controlled Yamuna Expressway from Greater Noida to Agra. Driving time: 3 to 3.5 hours.",
        "**Buses**: UPSRTC Janrath & Shatabdi AC buses from Anand Vihar ISBT & Sarai Kale Khan every 20 mins (₹380 - ₹550)."
      ],
      local_commute: [
        "**Taj Protected Zone**: Zero-pollution electric golf carts & battery tongas ferry visitors from Shilpgram parking to the East Gate (₹20).",
        "**Agra Auto-Rickshaws**: Agree on meter or prepaid booth rates at Agra Cantt station."
      ]
    },

    // 12. Delhi -> Rishikesh
    'delhi->rishikesh': {
      trains: [
        "**Train #12017 Dehradun Shatabdi Express**: Departs NDLS at 06:45 AM, arrives Haridwar Junction (HW) at 11:33 AM (4h 48m). Then 35-min auto/cab to Rishikesh.",
        "**Train #22457 Anand Vihar - Dehradun Vande Bharat**: Departs ANVT at 05:50 PM, arrives Haridwar at 09:30 PM (3h 40m).",
        "**Train #14041 Mussoorie Express**: Departs Old Delhi (DLI) at 10:25 PM, arrives Yog Nagari Rishikesh (YNRK) at 07:35 AM."
      ],
      flights: [
        "**Airports**: Delhi (DEL) to Dehradun Jolly Grant Airport (DED - 21 km from Rishikesh). IndiGo / SpiceJet (50 mins).",
        "**Airport Cab**: Fixed union cab from Jolly Grant to Tapovan/Laxman Jhula: ₹900 - ₹1,100."
      ],
      road: [
        "**Highway**: ~240 km via Delhi-Meerut Expressway -> NH334 (via Roorkee & Haridwar). Driving time: 4.5 to 5.5 hours.",
        "**Buses**: UTC Volvo & Zingbus from Kashmere Gate ISBT every hour (₹550 - ₹900)."
      ],
      local_commute: [
        "**Scooter Rentals**: Scooty rentals in Tapovan & Laxman Jhula (₹350 - ₹500/day).",
        "**Shared Vikrams (Auto-rickshaws)**: Run frequently between Triveni Ghat, Ram Jhula, and Tapovan (₹20 - ₹40)."
      ]
    },

    // 13. Delhi -> Amritsar
    'delhi->amritsar': {
      trains: [
        "**Train #12013 New Delhi - Amritsar Shatabdi Express**: Departs NDLS at 04:30 PM, arrives Amritsar Junction (ASR) at 10:30 PM (6 hrs). Punctual executive rail link.",
        "**Train #22487 Delhi - Amritsar Vande Bharat Express**: Departs NDLS at 03:15 PM, arrives Amritsar at 08:45 PM (5h 30m). Fastest link.",
        "**Train #12459 New Delhi - Amritsar InterCity Express**: Morning daily departure at 07:30 AM."
      ],
      flights: [
        "**Airports**: Delhi (DEL) to Sri Guru Ram Dass Jee International (ATQ). IndiGo & Air India (1 hr). Fare: ₹2,400 - ₹4,200."
      ],
      road: [
        "**Grand Trunk Road (NH44)**: ~450 km via Sonipat, Panipat, Kurukshetra, Ludhiana, Jalandhar. Driving time: 7-8 hours. Famous highway dhabas (Amrik Sukhdev at Murthal).",
        "**Buses**: Punbus Volvo & PRTC AC buses from Kashmere Gate (₹750 - ₹1,200)."
      ],
      local_commute: [
        "**Golden Temple Free Shuttle**: Free SGPC buses connect Amritsar Railway Station to Golden Temple heritage walkway.",
        "**E-Rickshaws & Auto-Rickshaws**: Connect Hall Bazaar, Jallianwala Bagh, and Gobindgarh Fort (₹40 - ₹80)."
      ]
    },

    // 14. Delhi -> Shimla
    'delhi->shimla': {
      trains: [
        "**Shatabdi + UNESCO Toy Train**: Train #12011 Kalka Shatabdi departs NDLS at 07:40 AM, arrives Kalka (KLK) at 11:45 AM. Connect immediately with the UNESCO World Heritage **Train #52455 Himalayan Queen Toy Train** climbing through 102 tunnels to Shimla (arrives 05:20 PM). Unmatched mountain panorama!"
      ],
      flights: [
        "**Airports**: Delhi (DEL) to Shimla Jubbarhatti Airport (SLV, 22 km away) via Alliance Air ATR-42 (1h 10m)."
      ],
      road: [
        "**Highway Corridor**: ~350 km via NH44 to Ambala, then Himalayan Expressway (NH5) via Panchkula & Solan. Driving time: 7 to 8 hours.",
        "**Buses**: HRTC Himsuta Volvo luxury buses from Kashmere Gate ISBT overnight (₹850 - ₹1,300)."
      ],
      local_commute: [
        "**Shimla Mall Road Lift**: Two-stage Municipal Lift connects Cart Road to The Mall (₹20). Vehicle-free walking pedestrian zone on Mall Road.",
        "**Jakhoo Ropeway**: Aerial cable car from The Ridge to Jakhoo Temple (₹550 return)."
      ]
    },

    // 15. Mumbai -> Udaipur
    'mumbai->udaipur': {
      trains: [
        "**Train #12995 Bandra Terminus - Udaipur City Superfast**: Departs BDTS at 04:15 PM, arrives Udaipur City (UDZ) next morning at 08:35 AM (16h 20m). Clean overnight journey.",
        "**Train #22901 BDTS Udaipur Superfast**: Departs BDTS at 11:25 PM, arrives Udaipur at 03:00 PM."
      ],
      flights: [
        "**Airports**: Mumbai (BOM) to Maharana Pratap Airport (UDR). IndiGo & Air India direct (1 hr 20 min). Fare: ₹3,200 - ₹5,400."
      ],
      road: [
        "**Highway**: ~750 km via NH48 through Surat, Vadodara, and Godhra/Ratanpur. Driving time: 13-14 hours."
      ],
      local_commute: [
        "**Auto-Rickshaws & App Cabs**: Fixed-rate rides around Lake Pichola, Fatehsagar, and City Palace (₹50 - ₹150)."
      ]
    },

    // 16. Mumbai/Delhi -> Kerala
    'mumbai->kerala': {
      trains: [
        "**Train #16345 Netravati Express**: Departs LTT (Mumbai) at 11:40 AM, arrives Ernakulam Junction (ERS) next day at 06:05 PM (30h). Scenic coastal Konkan route.",
        "**Train #12618 Mangala Lakshadweep Express**: Departs Kalyan/Panvel to Ernakulam."
      ],
      flights: [
        "**Airports**: Mumbai (BOM) to Cochin International (COK). IndiGo, Air India, Akasa Air non-stop (2 hrs). Fare: ₹3,500 - ₹5,800."
      ],
      road: [
        "**Highway**: ~1,400 km via NH66 Konkan route. Flying is highly recommended."
      ],
      local_commute: [
        "**Kochi Water Metro**: World's first integrated electric water metro network connecting mainland to islands (₹20 - ₹40).",
        "**KSRTC Low-Floor AC Buses & Uber**: Extensive connectivity across Kochi, Fort Kochi, and Munnar hill route."
      ]
    },

    // 17. Delhi -> Ladakh
    'delhi->ladakh': {
      flights: [
        "**Airports**: New Delhi (DEL T3) to Kushok Bakula Rimpochee Airport, Leh (IXL).",
        "**Airlines**: IndiGo (6E-2054), Air India (AI-445), SpiceJet. Flight time: 1 hr 20 min.",
        "**Typical Airfare**: ₹5,200 - ₹10,500 one-way.",
        "**MANDATORY ACCLIMATIZATION**: Leh is at 3,500m (11,500 ft). You MUST take 36-48 hours complete rest on Day 1 & 2. Do not climb stairs or exert yourself."
      ],
      road: [
        "**Manali-Leh Highway (Open June - Oct)**: ~430 km via Atal Tunnel, Keylong, Jispa, Baralacha La (16,040 ft), Lachungla, and Taglang La (17,480 ft). Scenic 2-day overland adventure with overnight halt in Jispa.",
        "**Srinagar-Leh Highway (Open May - Nov)**: ~420 km via Sonamarg, Zoji La Pass, Dras, and Kargil."
      ],
      local_commute: [
        "**Leh Union Taxis**: Fixed tariff standard Toyota Innova/Scorpio for Pangong Lake, Nubra Valley, and Khardung La.",
        "**Bike Rentals**: Royal Enfield Himalayan 411/450 available in Leh Main Bazaar (₹1,500 - ₹2,200/day)."
      ]
    },

    // 18. Mumbai/Delhi -> Paris
    'mumbai->paris': {
      flights: [
        "**Airports**: Mumbai (BOM T2) to Paris Charles de Gaulle (CDG Terminal 2E).",
        "**Airlines**: Direct non-stop flight via Air France (AF-217, Boeing 777, 9h 15m). 1-stop options on Emirates (via Dubai) & Qatar Airways (via Doha).",
        "**Flight Duration**: 9 hrs 15 min direct; ~12 hrs with 1 stop.",
        "**Typical Airfare**: ₹45,000 - ₹68,000 return economy per person."
      ],
      local_commute: [
        "**RER B Train**: Direct rail link from CDG Airport into central Paris (Châtelet-Les Halles / Gare du Nord), costs €11.80, takes 35 mins.",
        "**Paris Métro**: Comprehensive 16-line network. Buy Contactless Navigo Easy or Navigo Découverte weekly pass (€30.75 unlimited) or single t+ tickets (€2.15).",
        "**Vélib' Métropole**: Citywide public bike sharing system with thousands of electric and mechanical bikes."
      ]
    },

    'delhi->paris': {
      flights: [
        "**Airports**: New Delhi (DEL T3) to Paris Charles de Gaulle (CDG).",
        "**Airlines**: Air France (AF-225, non-stop 8h 50m) and Air India (AI-143, non-stop 9 hrs). 1-stop on Lufthansa (via Frankfurt), Emirates, or Etihad.",
        "**Typical Airfare**: ₹42,000 - ₹64,000 return economy per person."
      ],
      local_commute: [
        "**RER B Train**: CDG Airport to central Paris (€11.80, 35 mins).",
        "**Paris Métro**: Fast underground transit across all 20 arrondissements (€2.15/single ticket).",
        "**Official Taxis**: Fixed flat airport fares (€56 to Right Bank / €65 to Left Bank)."
      ]
    },

    // 19. Mumbai/Delhi -> Dubai
    'mumbai->dubai': {
      flights: [
        "**Airports**: Mumbai (BOM T2) to Dubai International (DXB Terminal 1/3).",
        "**Airlines**: Emirates (EK-501, EK-505, A380 & Boeing 777), flydubai, IndiGo, Air India. Flight duration: 3h 15m.",
        "**Typical Airfare**: ₹16,000 - ₹24,000 return economy."
      ],
      local_commute: [
        "**Dubai Metro**: Fully automated Red Line runs from DXB Airport through Deira, Bur Dubai, Downtown (Burj Khalifa) to Dubai Marina. Purchase a Nol Silver Card (AED 25 with AED 19 balance).",
        "**RTA Taxis / Careem App**: Modern metered hybrid cabs starting base fare AED 12."
      ]
    },

    'delhi->dubai': {
      flights: [
        "**Airports**: New Delhi (DEL T3) to Dubai International (DXB).",
        "**Airlines**: Emirates (EK-511, EK-513), Air India (AI-995), IndiGo, SpiceJet. Flight duration: 3h 45m.",
        "**Typical Airfare**: ₹18,000 - ₹26,000 return economy."
      ],
      local_commute: [
        "**Dubai Metro**: Red Line connects DXB Terminal 1 & 3 to Downtown Dubai & Dubai Mall in 24 mins.",
        "**Nol Card**: Reusable smart card for Metro, Tram, and public water buses."
      ]
    }
  };

  if (routes[routeKey]) return routes[routeKey];
  if (routes[`delhi->${dstKey}`]) return routes[`delhi->${dstKey}`];
  if (routes[`mumbai->${dstKey}`]) return routes[`mumbai->${dstKey}`];

  // Dynamic intelligent synthesizer for any custom source-destination pair
  const isInternational = dstKey === 'paris' || dstKey === 'dubai' || dstKey === 'switzerland' || dstKey === 'bali' || dstKey === 'singapore';

  if (isInternational) {
    return {
      flights: [
        `**Airports**: Departure from ${source} International Airport to destination commercial hub.`,
        `**Airlines**: Direct or 1-stop international flights via Emirates, Qatar Airways, Air India, or Singapore Airlines.`,
        `**Flight Time & Fares**: ~4 to 9 hours flight duration; typical return economy fares range from ₹25,000 to ₹58,000 per person (book 4-6 weeks in advance).`
      ],
      local_commute: [
        `**Airport Rail & City Metro**: Rapid rail or subway connections link the airport terminal directly to city downtown.`,
        `**Smart Travel Cards**: Pick up local reloadable transit smart cards at the airport arrivals terminal for seamless cashless transit across metros and trams.`
      ]
    };
  }

  return {
    trains: [
      `**Express / Superfast Rail Routes**: Indian Railways operates premier Superfast and Express connections linking ${source} to the main railway junction serving ${dest}.`,
      `**Recommended Classes**: AC 2-Tier (2A) or AC 3-Tier (3A) for comfortable overnight travel with clean bedding, charging ports, and pantry car catering.`,
      `**Booking Strategy**: Book via the IRCTC portal 30 to 60 days ahead to ensure confirmed berths and avoid peak waiting lists.`
    ],
    flights: [
      `**Flight Options**: Daily direct or 1-stop flights connect ${source} to the commercial airport serving ${dest}.`,
      `**Airlines**: IndiGo, Air India, Akasa Air, and SpiceJet with typical flight durations of 1 hr 15 min to 2 hrs 45 min.`,
      `**Airfare Band**: ₹3,200 – ₹5,800 one-way per passenger when booked 2-3 weeks ahead.`
    ],
    road: [
      `**Highway Corridor**: Well-maintained 4-to-6 lane National Highway corridors connect ${source} towards ${dest}.`,
      `**Long-Distance Buses**: Premier multi-axle Volvo AC Sleeper coaches (operated by Zingbus, IntrCity SmartBus, and State RTCs) provide punctual overnight services with reclining beds and charging sockets.`
    ],
    local_commute: [
      `**City Connectivity**: App-based cabs (Uber and Ola) operate extensively in ${dest} with upfront digital pricing.`,
      `**Local Transit**: Pre-paid auto-rickshaws at transit hubs and daily two-wheeler / scooter rentals (₹400 – ₹600/day) offer complete flexibility.`
    ]
  };
}

export function getSpecificDestinationGuide(destination) {
  const dst = (destination || '').trim().toLowerCase();

  const guides = {
    jaipur: {
      title: 'Jaipur (Pink City, Rajasthan)',
      dishes: [
        "**Rawat Mishthan Bhandar's Pyaaz Kachori & Mawa Kachori**: Crisp, golden, flaky deep-fried pastry generously stuffed with spicy caramelized onion masala (Best at: *Rawat Mishthan Bhandar*, Station Road).",
        "**Laxmi Mishthan Bhandar (LMB) Traditional Royal Ghevar**: Honeycomb disc dessert soaked in cardamom saffron syrup and topped with rich mawa malai (Best at: *LMB*, Johari Bazaar).",
        "**Authentic Rajasthani Dal Baati Churma**: Baked whole-wheat flour dough balls crushed in pure desi ghee, served with Panchmel spicy lentils and sweet crushed churma (Best at: *Chokhi Dhani* or *Thali & More*, C-Scheme).",
        "**Lassiwala's Kulhad Lassi**: Churned thick, creamy yogurt lassi served in traditional earthen clay glasses with a thick layer of clotted malai on top (Best at: *Original Lassiwala (Shop 312)* on MI Road — arrive before 1:00 PM).",
        "**Gulab Ji Chai Wale's Masala Chai & Bun Maska**: Aromatic ginger-cardamom tea paired with fresh buttered pav (Best at: *Gulab Ji Chai*, MI Road)."
      ],
      food_streets: [
        "**Johari Bazaar & Bapu Bazaar Food Alleys**: Famous for piping hot kachoris, mirchi vadas, and authentic rabri kulfi.",
        "**Masala Chowk (Ram Niwas Garden)**: An open-air food court gathering 21+ legacy street food masters of Jaipur under one roof (Entry: ₹10).",
        "**MI Road & Chhoti Chaupar**: Bustling morning street food hubs for hot samosas, mirchi vadas, and masala chai."
      ],
      shopping: [
        "**Johari Bazaar**: World epicenter for Kundan, Polki, and Meenakari handcrafted enamel jewelry, colored emeralds, and loose gemstones.",
        "**Bapu Bazaar & Nehru Bazaar**: Famous for authentic camel-leather Jaipuri Mojaris (₹350 - ₹650), Bandhani & Leheriya tie-dye sarees (₹500 - ₹1,800), and block-printed cotton bedspreads.",
        "**Tripolia Bazaar**: Famous for vibrant custom lac bangles handcrafted by traditional Manihari artisans right in front of you.",
        "**Kishanpole Bazaar**: Traditional center for blue pottery, brass antiquities, and hand-carved wooden puppets.",
        "**Shopping & Bargaining Tip**: Polite negotiation is expected at Bapu and Johari street stalls (start at 35% below initial quoted price). For guaranteed hallmark authenticity, visit *Rajasthali Government Handicrafts Emporium* on MI Road."
      ],
      sights: [
        "**Amber Fort (Amer)**: Hilltop Rajput citadel featuring Sheesh Mahal (Mirror Palace) and Maota Lake views. *Best time: 08:30 AM before tourist coaches arrive.*",
        "**Hawa Mahal (Palace of Winds)**: 953 honeycomb sandstone windows. *Best photo angle: 08:00 AM from Wind View Cafe or Tattoo Cafe across the street.*",
        "**City Palace & Jantar Mantar**: Royal residence complex and UNESCO medieval astronomical observatory.",
        "**Nahargarh Fort**: Perched on the Aravalli hills with panoramic sunset views over the entire illuminated Pink City from Padao Open Cafe."
      ]
    },

    goa: {
      title: 'Goa (Beaches, Heritage & Nightlife)',
      dishes: [
        "**Authentic Goan Fish Curry Thali**: Fresh Kingfish or Surmai cooked in coconut-kokum gravy, served with red boiled rice, kismoor (dried prawn salad), and sol kadi (Best at: *Vinayak Family Restaurant* in Assagao & *Ritz Classic* in Panaji).",
        "**Butter Garlic Crab & Prawn Balchão**: Succulent coastal seafood tossed in fiery tangy chili vinegar paste (Best at: *Martin's Corner* in Betalbatim & *Fisherman's Wharf*).",
        "**Pork / Chicken Vindaloo**: Portuguese-Goan slow-braised curry infused with toddy vinegar and garlic (Best at: *Viva Panjim* in Fontainhas Latin Quarter).",
        "**Traditional Bebinca**: 7-layered Goan coconut milk and jaggery baked dessert served with vanilla bean ice cream.",
        "**Local Poee with Chorizo**: Crusty Goan wheat bread stuffed with spicy smoked Goan pork sausages."
      ],
      food_streets: [
        "**Anjuna & Vagator Cliff Lanes**: Cliffside open-air sunset cafes and bohemian food spots with live acoustic melodies.",
        "**Miramar Beach Stalls & Panaji Promenade**: Evening street stalls for Goan fish cutlets, Ross Omelette, and fresh coconut water."
      ],
      shopping: [
        "**Anjuna Wednesday Flea Market**: Sprawling open-air seaside bazaar for bohemian kaftans, handcrafted Macramé jewelry, brass handicrafts, and Tibetan curios.",
        "**Saturday Night Market at Arpora**: Vibrant night carnival featuring international designer apparel, live music stages, and gourmet food stalls.",
        "**Mapusa Friday Market**: Authentic local market for vacuum-packed Goan chorizo sausages, cashew feni bottles, organic kokum, and Goan spices.",
        "**Fontainhas (Panaji)**: Hand-painted Portuguese Azulejos ceramic tiles and boutique designer art studios.",
        "**Shopping Tip**: Negotiate gently at flea markets; look for certified Feni distillers with excise hologram stamps."
      ],
      sights: [
        "**Fort Aguada & Sinquerim Lighthouse**: 17th-century coastal fortress with sweeping Arabian Sea views.",
        "**Fontainhas Latin Quarter (Panaji)**: Colorful UNESCO Portuguese heritage villas, terracotta roofs, and historic wishing wells.",
        "**Basilica of Bom Jesus (Old Goa)**: UNESCO Baroque cathedral housing the sacred relics of St. Francis Xavier.",
        "**Palolem & Butterfly Beach (South Goa)**: Crescent-shaped golden sand beach with tranquil waters and dolphin boat cruises."
      ]
    },

    manali: {
      title: 'Manali (Himalayan Alps & Adventure)',
      dishes: [
        "**Himachali Siddu**: Steamed traditional wheat flour dumpling stuffed with ground walnut, poppy seeds, and spices, drenched in hot desi ghee (Best at: *Mayur Restaurant* & local dhabas in Old Manali).",
        "**Fresh Tandoori / Pan-Fried Himalayan Trout**: Caught fresh from the rushing Beas River, pan-seared with lemon herb butter (Best at: *Cafe 1947* in Old Manali & *Johnson's Cafe*).",
        "**Steaming Tibetan Momos & Thukpa**: Hand-rolled dumplings and comforting noodle broth packed with mountain herbs (Best at: *Chopsticks* on Mall Road).",
        "**Tudkiya Bhath**: Rich Pahadi spiced rice cooked with lentils, potatoes, and homemade mountain curd.",
        "**Fresh Apple Pie & Crumble**: Made from local Kullu apple orchards, served hot with vanilla cream (Best at: *Dylan's Toasted & Roasted Cafe*)."
      ],
      food_streets: [
        "**Mall Road Food Stalls**: Evening hubs for hot roasted bhutta (corn), steaming vegetable momos, and hot gulab jamuns.",
        "**Old Manali Clubhouse Road**: Quaint wooden cafes with riverside stone terraces and live indie music."
      ],
      shopping: [
        "**Mall Road & Tibetan Market**: Authentic handwoven Kullu shawls (look for the Kullu Handloom GI Tag), pure Pashmina stoles (₹1,500 - ₹4,500), and colorful Himachali caps (Topi).",
        "**Old Manali Village Street**: Hand-knitted yak-wool socks (₹200 - ₹350), pure Himalayan Shilajit, organic apricot kernel oil, and Tibetan singing bowls.",
        "**Himachal Handloom & Handicrafts Emporium**: Government-certified showroom guaranteeing pure sheep wool and fixed honest pricing.",
        "**Shopping Tip**: Authentic Kullu shawls have woven geometric borders with raw wool texture on the reverse; avoid machine-made synthetic acrylic fakes."
      ],
      sights: [
        "**Solang Valley**: Alpine adventure center for paragliding, zorbing, and ropeway cable cars.",
        "**Atal Tunnel & Sissu (Lahaul Valley)**: The 9.02 km engineering marvel opening into the dramatic barren peaks and waterfalls of Sissu.",
        "**Hadimba Temple**: 1553 pagoda wooden cave temple nestled amidst towering ancient deodar cedar groves.",
        "**Jogini Waterfalls**: Scenic 3 km alpine trek through pine forests starting from Vashisht hot springs village."
      ]
    },

    varanasi: {
      title: 'Varanasi (Spiritual Capital & Cultural Heritage)',
      dishes: [
        "**Kashi Chaat Bhandar's Tamatar Chaat**: Fiery, sizzling mashed spiced tomatoes with cashews and Hing-infused syrup (Best at: *Kashi Chaat Bhandar*, Godowlia).",
        "**Ram Bhandar's Puri Sabzi with Jalebi**: Crisp morning puris served with spicy hing-aloo gravy, followed by hot thin saffron jalebis (Best at: *Ram Bhandar*, Thatheri Bazaar — arrive by 08:30 AM).",
        "**Malaiyyo (Winter Specialty)**: Ethereal saffron-flavored milk foam infused with cardamom and pistachios (Best at: *Chaukhamba Gali* & *Markandey Sweets*).",
        "**Keshav Tambool Banarasi Meetha Paan**: Betel leaf prepared with fragrant gulkand, supari, and silver leaf (Best at: *Keshav Tambool*, near Ravidas Gate, Lanka).",
        "**Blue Lassi Shop**: Hand-churned creamy curd lassi served in earthen kulhads with fresh pomegranate and rabri toppings (*Blue Lassi Shop* near Manikarnika Ghat)."
      ],
      food_streets: [
        "**Godowlia Crossing to Dashashwamedh Gali**: Packed with street vendors serving piping hot samosas, chooda matar, and malai kulfi.",
        "**Kachori Gali**: Ancient narrow corridor where halwais have fried crisp puris and jalebis over wood fires for centuries."
      ],
      shopping: [
        "**Thatheri Bazaar & Chowk**: World-famous hub for authentic handloom **Banarasi Silk Sarees** (Katan, Georgette, and Tanchoi silk featuring gold and silver brocade Zari work, ₹3,500 - ₹25,000+).",
        "**Vishwanath Gali**: Consecrated Rudraksha malas, pure sandalwood paste, brass puja lamps, and organic concentrated **Attar** perfumes (Gulab, Rooh Khus, Mitti attar, ₹250 - ₹800).",
        "**Khojwa**: Traditional center for handcrafted wooden lacquer toys and brass figurines.",
        "**Shopping Tip**: Always look for the **Silk Mark Certification** label when buying Banarasi sarees to ensure 100% pure mulberry silk and genuine zari thread."
      ],
      sights: [
        "**Dashashwamedh Ghat Evening Ganga Aarti**: Mesmerizing synchronized ritual of fire lamps, conch shells, and Vedic chants at 06:30 PM.",
        "**Sunrise Boat Ride (Assi to Manikarnika Ghat)**: Golden dawn illumination over ancient palatial riverfront ghats.",
        "**Kashi Vishwanath Temple & Corridor**: One of the 12 sacred Jyotirlingas, newly connected via the grand riverfront corridor.",
        "**Sarnath**: The deer park 10 km away where Lord Buddha delivered his first sermon; features Dhamek Stupa and Ashoka Lion Capital Museum."
      ]
    },

    agra: {
      title: 'Agra (Mughal Splendor & Architectural Wonder)',
      dishes: [
        "**Original Panchhi Petha**: Translucent crystallized ash-gourd sweet in flavors: Kesar Petha, Angoori Petha, Paan Petha, and Chocolate Petha (Best at: *Panchhi Petha*, authentic original shop at Sadar Bazaar).",
        "**Deviram's Morning Bedai & Jalebi**: Crisp fried lentil-stuffed pooris served with spicy aloo-methi sabzi and curd (Best at: *Deviram Sweets*, Pratappura).",
        "**Mughlai Kebabs & Mutton Korma**: Rich, slow-cooked royal delicacies flavored with saffron, cardamom, and almond paste (Best at: *Pinch of Spice* on Fatehabad Road & *Dasaprakash*).",
        "**Dalmoth**: Savory crisp lentil snack seasoned with exotic roasted spices."
      ],
      food_streets: [
        "**Sadar Bazaar Chaat Gali**: Evening street food lane bustling with Golgappe, Dahi Bhalla, and sizzling Pav Bhaji.",
        "**Kinari Bazaar**: Historic narrow alleys for morning sweets and khoya treats."
      ],
      shopping: [
        "**Sadar Bazaar**: Fine **Pietra Dura** marble inlay artifacts (coasters, tabletops, miniature Taj Mahal replicas crafted by descendants of royal artisans, ₹350 - ₹5,000) and handcrafted leather goods.",
        "**Kinari Bazaar**: Embroidered Zardozi bridal fabrics, silver jewelry, and traditional brassware.",
        "**Shopping Tip**: Strictly avoid buying marble from touts or autorickshaw-guided emporiums where up to 40% driver commissions are built into the price. Inspect marble by shining a mobile flashlight: pure Makrana marble is translucent."
      ],
      sights: [
        "**Taj Mahal**: Built by Shah Jahan in white Makrana marble. *Best time: Sunrise at 06:00 AM (East Gate) with minimal crowds and soft golden glow.*",
        "**Agra Fort**: Massive red sandstone imperial fortress containing Jahangir Mahal, Diwan-i-Khas, and Musamman Burj where Shah Jahan was imprisoned.",
        "**Mehtab Bagh**: Moonlit pleasure garden across Yamuna River with mirror reflections of the Taj Mahal at sunset.",
        "**Fatehpur Sikri**: Akbar's preserved 16th-century ghost capital 37 km away, featuring Buland Darwaza and Salim Chishti Dargah."
      ]
    },

    udaipur: {
      title: 'Udaipur (City of Lakes, Rajasthan)',
      dishes: [
        "**Authentic Dal Baati Churma**: Rich platter with 5 types of baatis, spicy panchmel dal, gatte ki sabzi, and churma (Best at: *Krishna Dal Baati Bhojanalaya*, Jalsham Marg).",
        "**Royal Mewari Laal Maas**: Slow-cooked tender mutton in fiery Mathania red chilies and garlic (Best at: *Ambrai Restaurant* overlooking Lake Pichola at sunset & *1559 AD*).",
        "**Fateh Sagar Cold Coffee & Poha**: Famous morning snack by the water edge (Best at: *Sai Baba Cold Coffee* at Fatehsagar Bombay Market).",
        "**JMB's Pyaaz Kachori & Mirchi Bada**: Flaky street snacks served hot at Jagdish Temple Chowk."
      ],
      food_streets: [
        "**Bombay Market (Fatehsagar Lake)**: Bustling lakeside evening promenade with Pav Bhaji, Cold Coffee, and noodles.",
        "**Sukhadia Circle**: Famed circle park for local chaats, ice creams, and rabdi kulfi."
      ],
      shopping: [
        "**Hathi Pol Bazaar**: Renowned hub for traditional Rajasthani **Pichwai Paintings**, miniature Mewar paintings on silk, and camel-leather bound travel journals (₹250 - ₹2,500).",
        "**Bada Bazaar & Clock Tower**: Silver antique jewelry, Bandhani textiles, and Mojaris.",
        "**Shilpgram Artisan Village**: Rural arts and crafts complex featuring terracotta crafts and live folk dancers.",
        "**Shopping Tip**: Negotiate at Hathi Pol for art pieces; ensure authentic handmade stone-pigment Pichwai paintings by checking brush stroke texture."
      ],
      sights: [
        "**City Palace of Udaipur**: Grand granite and marble palace complex on the banks of Lake Pichola.",
        "**Lake Pichola Boat Cruise**: Sunset boat cruise circling Jag Mandir Island Palace with illuminated reflections.",
        "**Jagdish Temple**: 1651 carved Indo-Aryan stone temple dedicated to Lord Vishnu.",
        "**Saheliyon Ki Bari**: Peaceful 18th-century royal courtyard garden with marble elephants, fountains, and lotus pools."
      ]
    },

    kerala: {
      title: 'Kerala (God\'s Own Country - Kochi, Munnar, Alleppey)',
      dishes: [
        "**Karimeen Pollichathu**: Pearl spot fish marinated in shallots, green chilies, and coconut oil, wrapped in banana leaf and slow-roasted on a tawa (Best at: *Grand Pavilion* & *Paragon Restaurant* in Kochi).",
        "**Appam with Vegetable / Chicken Stew**: Soft fermented rice hoppers with a fluffy center, dipped in mild coconut milk stew with curry leaves (Best at: *Dhe Puthu*, Edappally).",
        "**Kerala Sadya on Banana Leaf**: 24+ vegetarian delicacies including Aviyal, Thoran, Olan, Sambar, and Payasam (Best at: *BTH Sarovaram* in Kochi).",
        "**Malabar Prawn Biryani**: Fragrant Kaima rice biryani with succulent ocean prawns and fried onions.",
        "**Fresh Banana Chips (Nendran chips)**: Fried fresh in cold-pressed coconut oil right in front of you."
      ],
      food_streets: [
        "**Fort Kochi Beach Stalls**: Evening vendors serving fresh fish fry, squid roast, and kulukki sarbath (shaken lemonade with basil seeds and green chili).",
        "**Broadway Market (Ernakulam)**: Bustling market lanes for Kerala halwa and banana chips."
      ],
      shopping: [
        "**Broadway & Mattancherry Jew Town**: Premium whole spices (green cardamom pods, Tellicherry black pepper, cloves, cinnamon bark, pure vanilla beans) and antique Portuguese furniture.",
        "**Kasavu Handloom Sarees & Mundu**: Traditional cream cotton fabric with golden zari borders (available at *Hantex* & *Kasavukada*).",
        "**Munnar Tea & Spices**: Single-estate fresh orthodox and CTC teas direct from *KDHP Ripple Tea Outlets*.",
        "**Shopping Tip**: Buy spices from government-inspected spice yards in Mattancherry for fresh aroma without artificial coloring."
      ],
      sights: [
        "**Alleppey Backwater Houseboat Cruise**: Gliding through tranquil palm-shaded canals, paddy fields, and lagoons.",
        "**Fort Kochi Chinese Fishing Nets**: Iconic cantilevered coastal nets operated at golden sunset hour.",
        "**Mattancherry Palace (Dutch Palace) & Paradesi Synagogue**: 1568 historic synagogue with hand-painted Chinese tiles.",
        "**Munnar Tea Plantations & Eravikulam National Park**: Rolling misty green tea estates and the home of endangered Nilgiri Tahr."
      ]
    },

    rishikesh: {
      title: 'Rishikesh (Yoga Capital of the World, Uttarakhand)',
      dishes: [
        "**Chotiwala Famous Special Thali**: Authentic Garhwali and North Indian satvik thali served with piping hot rotis and halwa (Best at: *Original Chotiwala* near Ram Jhula since 1958).",
        "**Ayurvedic Smoothie Bowls & Falafel**: Organic raw nutrient bowls, herbal infusions, and fresh hummus (Best at: *Little Buddha Cafe* overlooking Ganga river & *Beatles Cafe*).",
        "**German Bakery Apple Strudel & Cinnamon Buns**: Freshly baked mountain pastries enjoyed on open riverfront balconies (*Pumpernickel German Bakery*).",
        "**Hot Kachori & Aloo Bedmi**: Morning street food favorites at Triveni Ghat."
      ],
      food_streets: [
        "**Tapovan Cafe Alleys**: Vibrant Bohemian cafe street lined with live acoustic music spots and organic eateries.",
        "**Ram Jhula Swarg Ashram Lane**: Spiritual corridor filled with Ayurvedic herbal tea stalls and fruit chaat."
      ],
      shopping: [
        "**Ram Jhula & Laxman Jhula Markets**: Certified eco-friendly Yoga mats, meditation cushions, brass singing bowls, authentic Rudraksha beads, and natural Himalayan healing crystals.",
        "**Khadi Gramodyog**: Pure organic cotton kurtas, hemp bags, and essential oils (lemongrass, eucalyptus, Himalayan cedarwood).",
        "**Shopping Tip**: Inspect singing bowls by testing their acoustic resonance with a wooden striker; genuine bowls produce a deep sustained harmonic vibration."
      ],
      sights: [
        "**Triveni Ghat & Parmarth Niketan Evening Ganga Aarti**: Synchronized devotional ceremony with oil lamps floating on the sacred river.",
        "**White Water River Rafting (Marine Drive to NIM Beach)**: Thrilling Grade III and IV rapids on the crystal blue Ganga.",
        "**The Beatles Ashram (Chaurasi Kutia)**: Historic meditation ashram covered in vibrant graffiti art inside Rajaji National Park.",
        "**Neer Garh Waterfall Trek**: Two-tier natural jungle waterfall with jade swimming pools."
      ]
    },

    amritsar: {
      title: 'Amritsar (Holy City & Culinary Capital of Punjab)',
      dishes: [
        "**Authentic Amritsari Kulcha with Chole & Imli Pyaz Chutney**: Flaky, layered potato and cauliflower stuffed tandoori bread slathered with homemade white butter (Best at: *Bhai Kulwant Singh Kulchian Wale* near Golden Temple & *Kulcha Land* on Ranjit Avenue).",
        "**Kesar Da Dhaba's Dal Makhani**: Slow-cooked black urad dal simmered for 12 hours over slow coal fire, finished with pure desi ghee (Best at: *Kesar Da Dhaba* in Chowk Passian — operational since 1916).",
        "**Ahuja Milk Center's Firni & Kesar Lassi**: Thick, creamy hand-churned lassi topped with saffron malai (Best at: *Ahuja Sweets*, Hindu College Road).",
        "**Beera Spiced Tandoori Chicken**: Whole marinated chicken roasted in clay tandoor with secret spice rub (*Beera Chicken House*, Majitha Road)."
      ],
      food_streets: [
        "**Heritage Street (Town Hall to Golden Temple)**: Beautiful pedestrian walkway lined with traditional Punjabi sweetshops, jalebi counters, and papad stalls.",
        "**Chowk Passian & Lawrence Road**: Iconic evening food strips for hot jalebis and kulchas."
      ],
      shopping: [
        "**Hall Bazaar & Katra Jaimal Singh**: Renowned market for authentic hand-embroidered **Phulkari Dupattas and Suits** (₹600 - ₹3,500), handcrafted Punjabi Juttis, and traditional brassware.",
        "**Papad & Wadiyan Market (Chowk Kathian)**: Sun-dried authentic spiced Amritsari urad dal wadiyan and hing papads.",
        "**Shopping Tip**: Verify authentic hand-embroidered Phulkari by checking that the geometric silk floss thread (Pat) is stitched on coarse khaddar cotton from the reverse."
      ],
      sights: [
        "**Golden Temple (Harmandir Sahib)**: Central sacred Sikh shrine covered in 750 kg of pure gold. Experience the peaceful 24/7 Langar community kitchen.",
        "**Wagah Border Beating Retreat Ceremony**: High-energy military parade and flag-lowering ceremony at the Indo-Pak border (starts 04:30 PM).",
        "**Jallianwala Bagh Memorial**: Historic national memorial and Martyrs' Well preserved in central Amritsar.",
        "**Gobindgarh Fort**: 18th-century mud fortress built by Maharaja Ranjit Singh featuring 7D history shows."
      ]
    },

    shimla: {
      title: 'Shimla (Queen of the Hills, Himachal Pradesh)',
      dishes: [
        "**Himachali Dhaam**: Festive vegetarian feast of Chana Madra (chickpeas in spiced yogurt gravy), Sepu Vadi, and sweet boondi (Best at: *Himachali Rasoi* on Mall Road).",
        "**Trishool Bakery Cream Rolls & Patties**: Legacy colonial-era European bakery goods served hot (*Trishool Bakers*, near The Ridge).",
        "**Steaming Vegetable & Mutton Momos**: Tibetan steamed dumplings served with fiery garlic chili sauce (Best at: *Tibetan Market* dhabas).",
        "**Hot Gulab Jamuns & Samosas**: Classic high-altitude evening treats at Baljees on Mall Road."
      ],
      food_streets: [
        "**The Ridge & Mall Road**: Beautiful vehicle-free promenade with heritage cafes, coffee houses, and softy ice cream parlors.",
        "**Lower Bazaar**: Bustling narrow alleyways packed with local chaat shops and winter soup corners."
      ],
      shopping: [
        "**Lakkar Bazaar**: Famous market for handcrafted pine and deodar wooden artifacts, walking sticks, wooden chessboards, and hand-carved toys.",
        "**Himachal State Handloom Emporium**: Fixed-price authentic Kinnauri shawls, pure wool blankets, and Himachali caps.",
        "**Minchy's Fruit Products**: Pure rhododendron (Buransh) squash, apple wine vinegar, and mountain jams.",
        "**Shopping Tip**: Genuine deodar wood has a distinct pine aroma and smooth natural grain without heavy chemical polish."
      ],
      sights: [
        "**The Ridge & Christ Church**: Neo-Gothic 1857 church with stained glass windows overlooking snow-covered Himalayan peaks.",
        "**Jakhoo Temple & Giant Hanuman Statue**: 108-foot statue perched on Shimla's highest peak (reachable via aerial ropeway in 5 mins).",
        "**Viceregal Lodge (Rashtrapati Niwas)**: Magnificent Scottish baronial-style former British imperial headquarters.",
        "**Kufri Nature Park**: Alpine adventure point 15 km away for horse rides and panoramic views of Great Himalayan ranges."
      ]
    },

    ladakh: {
      title: 'Ladakh (Land of High Passes & Himalayan Monasteries)',
      dishes: [
        "**Ladakhi Skyu & Chhutagi**: Hearty, slow-cooked root vegetable and pasta stew cooked with local mountain herbs (Best at: *Alchi Kitchen* & *The Tibetan Kitchen* in Leh).",
        "**Tingmo with Shabalay & Spicy Dip**: Steamed flower-shaped Tibetan yeast bread served with deep-fried meat or vegetable pies (*Chopsticks Noodle Bar*, Leh).",
        "**Traditional Gur-Gur (Butter Tea)**: Salted tea churned with yak butter, ideal for high-altitude hydration and warmth.",
        "**Fresh Apricot Jam & Sea Buckthorn Juice**: Rich in Vitamin C, made from wild organic Ladakh berries."
      ],
      food_streets: [
        "**Leh Main Bazaar Walkway**: Clean pedestrian stone promenade lined with Tibetan rooftop cafes and organic German bakeries.",
        "**Changspa Road**: Traveler hub packed with riverside garden restaurants and wood-fired pizza spots."
      ],
      shopping: [
        "**Leh Main Bazaar**: Authentic handspun **Pashmina Shawls and Stoles** (look for the Cashmere Pashmina authenticity certification), Tibetan Buddhist thangkas, and hand-beaten brass singing bowls.",
        "**Moti Market**: Silver tribal Tibetan turquoise and coral jewelry.",
        "**Organic Dry Apricots (Halman variety)**: Sweet, sun-dried mountain apricots and cold-pressed apricot kernel oil.",
        "**Shopping Tip**: Test genuine pashmina with the ring test or warmth feel; genuine 100% Changthangi goat pashmina feels feather-light yet provides intense natural warmth."
      ],
      sights: [
        "**Pangong Tso Lake**: Spectacular 134-km endorheic blue lake changing colors through deep turquoise, indigo, and sapphire (4,350m altitude).",
        "**Nubra Valley & Hunder Sand Dunes**: High-altitude cold desert featuring double-humped Bactrian camels.",
        "**Khardung La Pass**: World's highest motorable pass crossing at 17,982 ft.",
        "**Thiksey & Hemis Monasteries**: 12-storey hilltop gompa complex resembling the Potala Palace of Lhasa."
      ]
    },

    paris: {
      title: 'Paris (City of Light, France)',
      dishes: [
        "**Artisanal Croissants & Escargot Pastry**: Flaky, butter-laminated morning pastries (Best at: *Du Pain et des Idées*, 34 Rue Yves Toudic).",
        "**Steak Frites & Beef Bourguignon**: Prime beef steak with crispy fries and red wine-braised beef with carrots (Best at: *Bistrot Paul Bert*, 11th arr. & *Le Bouillon Chartier*).",
        "**French Onion Soup (Soupe à l'oignon)**: Caramelized onion broth topped with crusty bread and melted Comté cheese (Best at: *Au Pied de Cochon* in Les Halles).",
        "**Macarons & Fine Patisserie**: Delicate almond meringue cookies with ganache fillings (Best at: *Pierre Hermé* & *Ladurée* on Champs-Élysées).",
        "**Crêpes & Galettes**: Buckwheat savory galettes with gruyère and jambon (Best at: *Breizh Café* in Le Marais)."
      ],
      food_streets: [
        "**Rue des Rosiers (Le Marais)**: Famous for world-class falafel (*L'As du Fallafel*) and Jewish bakeries.",
        "**Rue Cler (7th arr.)**: Pedestrian market street with gourmet fromageries, charcuteries, and wine merchants near the Eiffel Tower.",
        "**Rue Mouffetard (Latin Quarter)**: Ancient historic market street packed with lively student bistros and crêperies."
      ],
      shopping: [
        "**Galeries Lafayette & Printemps (Boulevard Haussmann)**: Iconic Belle Époque department stores with stained-glass cupolas and luxury fashion brands.",
        "**Le Marais Boutiques**: Independent fashion studios, vintage thrift shops, artisanal leather goods, and niche perfume houses (*Maison Francis Kurkdjian*).",
        "**Marché aux Puces de Saint-Ouen**: World's largest antique flea market for vintage jewelry, retro posters, and French furniture.",
        "**Bouquinistes along Seine River**: Open-air green wooden boxes selling vintage books, classic French prints, and retro posters (€5 - €25).",
        "**Shopping Tip**: Tourists outside the EU are eligible for 12% VAT tax refund (Détaxe) on purchases above €100 at registered retailers."
      ],
      sights: [
        "**Eiffel Tower & Trocadéro**: Best photo angle from Place du Trocadéro at sunrise or during hourly 5-minute night light sparkle.",
        "**Louvre Museum**: World's largest museum housing Mona Lisa and Venus de Milo (pre-book timed-entry ticket online to skip queues).",
        "**Musée d'Orsay**: Stunning former railway station home to Impressionist masterpieces by Monet, Van Gogh, and Renoir.",
        "**Montmartre & Sacré-Cœur**: Bohemian hilltop artists' village with panoramic city vistas and Place du Tertre portrait painters."
      ]
    },

    dubai: {
      title: 'Dubai (Modern Architecture & Arabian Heritage)',
      dishes: [
        "**Authentic Shawarma & Fresh Juices**: Spit-roasted spiced chicken wrapped in saj bread with garlic toum and pickles (Best at: *Al Mallah*, 2nd December St).",
        "**Al Ustad Special Kababs**: Melt-in-mouth Iranian yogurt-marinated mutton and chicken skewers served since 1978 (Best at: *Al Ustad Special Kabab*, Meena Bazaar, Bur Dubai).",
        "**Emirati Machboos & Luqaimat**: Spiced basmati rice with tender slow-cooked lamb, followed by crispy golden dough balls drizzled with date syrup (Best at: *Arabian Tea House* in Al Fahidi Historical Quarter).",
        "**Kunafa & Karak Chai**: Warm melted cheese pastry soaked in sweet orange-blossom sugar syrup (Best at: *Firas Sweets*)."
      ],
      food_streets: [
        "**Al Muraqqabat & Al Rigga Streets (Deira)**: 24/7 food corridors packed with Arabian, Levantine, and Persian street grills.",
        "**2nd December Street (Satwa)**: Buzzing strip for authentic street grills, Filipino bakeries, and shawarma stations."
      ],
      shopping: [
        "**Deira Gold Souk**: Hundreds of jewelry retailers where gold is priced strictly by daily international bullion weight + craft charges (18k, 21k, 22k, 24k).",
        "**Spice Souk (Deira)**: Piles of Iranian saffron (₹200 - ₹350/gram), whole vanilla pods, cardamom, frankincense, and Arabic rose water.",
        "**The Dubai Mall**: World's largest shopping center with 1,200+ luxury stores, indoor aquarium, and Olympic-sized ice rink.",
        "**Global Village (Seasonal Oct-Apr)**: 27 massive pavilions representing 75+ cultures selling authentic regional crafts, honey, and textiles.",
        "**Shopping Tip**: At the Gold Souk, the gold price per gram is fixed by law, but you can negotiate up to 30-40% discount on the **making charges**."
      ],
      sights: [
        "**Burj Khalifa (At the Top)**: World's tallest tower (828m) with 360-degree observation decks on 124th, 125th, and 148th floors.",
        "**Dubai Fountain Show**: Mesmerizing synchronized water and music spectacle at the base of Burj Khalifa (every 30 mins from 06:00 PM).",
        "**Al Fahidi Historical Neighbourhood**: Preserved 19th-century wind-tower architecture and Dubai Creek traditional Abra boat rides (AED 1 / ₹23 per ride).",
        "**Desert Safari**: 4x4 dune bashing in red dunes, sandboarding, camel rides, and BBQ dinner under the desert stars."
      ]
    }
  };

  if (guides[dst]) return guides[dst];

  // Default intelligent guide tailored to any custom destination
  return {
    title: destination,
    dishes: [
      `**Authentic Regional Specialties of ${destination}**: Signature platters featuring indigenous ingredients, slow-cooked spices, and locally harvested seasonal produce.`,
      `**Iconic Street Food Dishes**: Hot, freshly prepared savory street bites and crispy specialties celebrated by locals in ${destination}.`,
      `**Traditional Confectionery & Desserts**: Heritage sweet shops serving milk-based delicacies, flavored pastries, and traditional desserts authentic to ${destination}.`,
      `**Local Beverages & Teas**: Signature local teas, coffees, or refreshing coolers served in traditional clay cups or neighborhood cafes.`
    ],
    food_streets: [
      `**Central Market Food Alleys**: Bustling pedestrian lanes packed with legacy food stalls, tandoor grills, and artisanal tea counters in ${destination}.`,
      `**Historic Old Town Culinary Quarter**: Multi-generational food streets renowned for authentic secret family recipes.`
    ],
    shopping: [
      `**Central Traditional Bazaars**: Vibrant open-air markets famous for regional handloom textiles, handwoven fabrics, and ethnic jewelry.`,
      `**Authentic Artisan Souvenirs**: Locally crafted woodwork, brass artifacts, authentic spices, and handmade ceramics representative of ${destination}.`,
      `**Shopping & Bargaining Tip**: In traditional street bazaars, respectful bargaining (aiming 25-35% below initial quoted prices) is customary. For certified hallmarks and fixed rates, seek out state-authorized handicraft emporiums.`
    ],
    sights: [
      `**Premier Historic Citadels & Landmarks**: The most celebrated architectural monuments, ancient palaces, or historic fortresses defining ${destination}.`,
      `**Scenic Viewpoints**: Prominent natural hills, waterfront promenades, or sky terraces providing panoramic sunrise and sunset angles.`,
      `**Off-Beat Cultural Gems**: Peaceful sanctuaries, heritage courtyards, and quiet gardens away from standard tourist footfalls.`
    ]
  };
}
