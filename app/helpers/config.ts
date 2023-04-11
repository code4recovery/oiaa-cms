export const config = {
  aboutUrl: "https://code4recovery.org",
  batchSize: 25,
  checkboxClassNames: "h-4 w-4 rounded border-neutral-500 m-0 mt-0.5",
  days: [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ],
  defaultTheme: "indigo",
  fieldClassNames:
    "bg-white dark:bg-black block border-0 leading-6 py-1.5 rounded-md ring-1 ring-neutral-300 dark:ring-neutral-700 ring-inset shadow-sm w-full placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:ring-2 focus:ring-inset",
  home: "/groups",
  themes: {
    slate: {
      label: "Slate",
      background: "bg-slate-600 dark:bg-slate-400",
      backgroundHover: "hover:bg-slate-500",
      border: "border-slate-500",
      focusOutline:
        "focus-visible:outline-slate-600 dark:focus-visible:outline-slate-400",
      focusRing: "focus:ring-slate-500 checked:ring-slate-500",
      text: "text-slate-600 dark:text-slate-400",
      accentColor: "#1e293b",
    },
    gray: {
      label: "Gray",
      background: "bg-gray-600 dark:bg-gray-400",
      backgroundHover: "hover:bg-gray-500",
      border: "border-gray-500",
      focusOutline:
        "focus-visible:outline-gray-600 dark:focus-visible:outline-gray-400",
      focusRing: "focus:ring-neutral-500 checked:ring-gray-500",
      text: "text-gray-600 dark:text-gray-600",
      accentColor: "#1f2937",
    },
    zinc: {
      label: "Zinc",
      background: "bg-zinc-600 dark:bg-zinc-400",
      backgroundHover: "hover:bg-zinc-500",
      border: "border-zinc-500",
      focusOutline:
        "focus-visible:outline-zinc-600 dark:focus-visible:outline-zinc-400",
      focusRing: "focus:ring-zinc-500 checked:ring-zinc-500",
      text: "text-zinc-600 dark:text-zinc-400",
      accentColor: "#27272a",
    },
    neutral: {
      label: "Neutral",
      background: "bg-neutral-600 dark:bg-neutral-400",
      backgroundHover: "hover:bg-neutral-500",
      border: "border-neutral-500",
      focusOutline:
        "focus-visible:outline-neutral-600 dark:focus-visible:outline-neutral-400",
      focusRing: "focus:ring-neutral-500 checked:ring-neutral-500",
      text: "text-neutral-600 dark:text-neutral-400",
      accentColor: "#27272a",
    },
    stone: {
      label: "Stone",
      background: "bg-stone-600 dark:bg-stone-400",
      backgroundHover: "hover:bg-stone-500",
      border: "border-stone-500",
      focusOutline:
        "focus-visible:outline-stone-600 dark:focus-visible:outline-stone-400",
      focusRing: "focus:ring-stone-500 checked:ring-stone-500",
      text: "text-stone-600 dark:text-stone-400",
      accentColor: "#1c1917",
    },
    red: {
      label: "Red",
      background: "bg-red-600 dark:bg-red-400",
      backgroundHover: "hover:bg-red-500",
      border: "border-red-500",
      focusOutline:
        "focus-visible:outline-red-600 dark:focus-visible:outline-red-400",
      focusRing: "focus:ring-red-500 checked:ring-red-500",
      text: "text-red-600 dark:text-red-400",
      accentColor: "#991b1b",
    },
    orange: {
      label: "Orange",
      background: "bg-orange-600 dark:bg-orange-400",
      backgroundHover: "hover:bg-orange-500",
      border: "border-orange-500",
      focusOutline:
        "focus-visible:outline-orange-600 dark:focus-visible:outline-orange-400",
      focusRing: "focus:ring-orange-500 checked:ring-orange-500",
      text: "text-orange-600 dark:text-orange-400",
      accentColor: "#9a3412",
    },
    amber: {
      label: "Amber",
      background: "bg-amber-600 dark:bg-amber-400",
      backgroundHover: "hover:bg-amber-500",
      border: "border-amber-500",
      focusOutline:
        "focus-visible:outline-amber-600 dark:focus-visible:outline-amber-400",
      focusRing: "focus:ring-amber-500 checked:ring-amber-500",
      text: "text-amber-600 dark:text-amber-400",
      accentColor: "#92400e",
    },
    yellow: {
      label: "Yellow",
      background: "bg-yellow-600 dark:bg-yellow-400",
      backgroundHover: "hover:bg-yellow-500",
      border: "border-yellow-500",
      focusOutline:
        "focus-visible:outline-yellow-600 dark:focus-visible:outline-yellow-400",
      focusRing: "focus:ring-yellow-500 checked:ring-yellow-500",
      text: "text-yellow-600 dark:text-yellow-400",
      accentColor: "#854d0e",
    },
    lime: {
      label: "Lime",
      background: "bg-lime-600 dark:bg-lime-400",
      backgroundHover: "hover:bg-lime-500",
      border: "border-lime-500",
      focusOutline:
        "focus-visible:outline-lime-600 dark:focus-visible:outline-lime-400",
      focusRing: "focus:ring-lime-500 checked:ring-lime-500",
      text: "text-lime-600 dark:text-lime-400",
      accentColor: "#3f6212",
    },
    green: {
      label: "Green",
      background: "bg-green-600 dark:bg-green-400",
      backgroundHover: "hover:bg-green-500",
      border: "border-green-500",
      focusOutline:
        "focus-visible:outline-green-600 dark:focus-visible:outline-green-400",
      focusRing: "focus:ring-green-500 checked:ring-green-500",
      text: "text-green-600 dark:text-green-400",
      accentColor: "#166534",
    },
    emerald: {
      label: "Emerald",
      background: "bg-emerald-600 dark:bg-emerald-400",
      backgroundHover: "hover:bg-emerald-500",
      border: "border-emerald-500",
      focusOutline:
        "focus-visible:outline-emerald-600 dark:focus-visible:outline-emerald-400",
      focusRing: "focus:ring-emerald-500 checked:ring-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
      accentColor: "#065f46",
    },
    teal: {
      label: "Teal",
      background: "bg-teal-600 dark:bg-teal-400",
      backgroundHover: "hover:bg-teal-500",
      border: "border-teal-500",
      focusOutline: "focus-visible:outline-teal-500",
      focusRing: "focus:ring-teal-500 checked:ring-teal-500",
      text: "text-teal-600 dark:text-teal-400",
      accentColor: "#115e59",
    },
    cyan: {
      label: "Cyan",
      background: "bg-cyan-600 dark:bg-cyan-400",
      backgroundHover: "hover:bg-cyan-500",
      border: "border-cyan-500",
      focusOutline:
        "focus-visible:outline-cyan-600 dark:focus-visible:outline-cyan-400",
      focusRing: "focus:ring-cyan-500 checked:ring-cyan-500",
      text: "text-cyan-600 dark:text-cyan-400",
      accentColor: "#155e75",
    },
    sky: {
      label: "Sky",
      background: "bg-sky-600 dark:bg-sky-400",
      backgroundHover: "hover:bg-sky-500",
      border: "border-sky-500",
      focusOutline:
        "focus-visible:outline-sky-600 dark:focus-visible:outline-sky-400",
      focusRing: "focus:ring-sky-500 checked:ring-sky-500",
      text: "text-sky-600 dark:text-sky-400",
      accentColor: "#075985",
    },
    blue: {
      label: "Blue",
      background: "bg-blue-600 dark:bg-blue-400",
      backgroundHover: "hover:bg-blue-500",
      border: "border-blue-500",
      focusOutline:
        "focus-visible:outline-blue-600 dark:focus-visible:outline-blue-400",
      focusRing: "focus:ring-blue-500 checked:ring-blue-500",
      text: "text-blue-600 dark:text-blue-400",
      accentColor: "#1e40af",
    },
    indigo: {
      label: "Indigo",
      background: "bg-indigo-600 dark:bg-indigo-400",
      backgroundHover: "hover:bg-indigo-500",
      border: "border-indigo-500",
      focusOutline:
        "focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400",
      focusRing: "focus:ring-indigo-500 checked:ring-indigo-500",
      text: "text-indigo-600 dark:text-indigo-400",
      accentColor: "#3730a3",
    },
    violet: {
      label: "Violet",
      background: "bg-violet-600 dark:bg-violet-600",
      backgroundHover: "hover:bg-violet-500",
      border: "border-violet-500",
      focusOutline:
        "focus-visible:outline-violet-600 dark:focus-visible:outline-violet-400",
      focusRing: "focus:ring-violet-500 checked:ring-violet-500",
      text: "text-violet-600 dark:text-violet-400",
      accentColor: "#5b21b6",
    },
    purple: {
      label: "Purple",
      background: "bg-purple-600 dark:bg-purple-400",
      backgroundHover: "hover:bg-purple-500",
      border: "border-purple-500",
      focusOutline:
        "focus-visible:outline-purple-600 dark:focus-visible:outline-purple-400",
      focusRing: "focus:ring-purple-500 checked:ring-purple-500",
      text: "text-purple-600 dark:text-purple-400",
      accentColor: "#6b21a8",
    },
    fuchsia: {
      label: "Fuchsia",
      background: "bg-fuchsia-600 dark:bg-fuchsia-400",
      backgroundHover: "hover:bg-fuchsia-500",
      border: "border-fuchsia-500",
      focusOutline:
        "focus-visible:outline-fuchsia-600 dark:focus-visible:outline-fuchsia-400",
      focusRing: "focus:ring-fuchsia-500 checked:ring-fuchsia-500",
      text: "text-fuchsia-600 dark:text-fuchsia-400",
      accentColor: "#86198f",
    },
    pink: {
      label: "Pink",
      background: "bg-pink-600 dark:bg-pink-400",
      backgroundHover: "hover:bg-pink-500",
      border: "border-pink-500",
      focusOutline:
        "focus-visible:outline-pink-600 dark:focus-visible:outline-pink-400",
      focusRing: "focus:ring-pink-500 checked:ring-pink-500",
      text: "text-pink-600 dark:text-pink-400",
      accentColor: "#9d174d",
    },
    rose: {
      label: "Rose",
      background: "bg-rose-600 dark:bg-rose-400",
      backgroundHover: "hover:bg-rose-500",
      border: "border-rose-500",
      focusOutline:
        "focus-visible:outline-rose-600 dark:focus-visible:outline-rose-400",
      focusRing: "focus:ring-rose-500 checked:ring-rose-500",
      text: "text-rose-600 dark:text-rose-400",
      accentColor: "#9f1239",
    },
  },
  timezones: [
    "Africa/Abidjan",
    "Africa/Accra",
    "Africa/Addis_Ababa",
    "Africa/Algiers",
    "Africa/Asmara",
    "Africa/Bamako",
    "Africa/Bangui",
    "Africa/Banjul",
    "Africa/Bissau",
    "Africa/Blantyre",
    "Africa/Brazzaville",
    "Africa/Bujumbura",
    "Africa/Cairo",
    "Africa/Casablanca",
    "Africa/Ceuta",
    "Africa/Conakry",
    "Africa/Dakar",
    "Africa/Dar_es_Salaam",
    "Africa/Djibouti",
    "Africa/Douala",
    "Africa/El_Aaiun",
    "Africa/Freetown",
    "Africa/Gaborone",
    "Africa/Harare",
    "Africa/Johannesburg",
    "Africa/Juba",
    "Africa/Kampala",
    "Africa/Khartoum",
    "Africa/Kigali",
    "Africa/Kinshasa",
    "Africa/Lagos",
    "Africa/Libreville",
    "Africa/Lome",
    "Africa/Luanda",
    "Africa/Lubumbashi",
    "Africa/Lusaka",
    "Africa/Malabo",
    "Africa/Maputo",
    "Africa/Maseru",
    "Africa/Mbabane",
    "Africa/Mogadishu",
    "Africa/Monrovia",
    "Africa/Nairobi",
    "Africa/Ndjamena",
    "Africa/Niamey",
    "Africa/Nouakchott",
    "Africa/Ouagadougou",
    "Africa/Porto-Novo",
    "Africa/Sao_Tome",
    "Africa/Timbuktu",
    "Africa/Tripoli",
    "Africa/Tunis",
    "Africa/Windhoek",
    "America/Adak",
    "America/Anchorage",
    "America/Anguilla",
    "America/Antigua",
    "America/Araguaina",
    "America/Argentina/Buenos_Aires",
    "America/Argentina/Catamarca",
    "America/Argentina/ComodRivadavia",
    "America/Argentina/Cordoba",
    "America/Argentina/Jujuy",
    "America/Argentina/La_Rioja",
    "America/Argentina/Mendoza",
    "America/Argentina/Rio_Gallegos",
    "America/Argentina/Salta",
    "America/Argentina/San_Juan",
    "America/Argentina/San_Luis",
    "America/Argentina/Tucuman",
    "America/Argentina/Ushuaia",
    "America/Aruba",
    "America/Asuncion",
    "America/Atikokan",
    "America/Bahia",
    "America/Bahia_Banderas",
    "America/Barbados",
    "America/Belem",
    "America/Belize",
    "America/Blanc-Sablon",
    "America/Boa_Vista",
    "America/Bogota",
    "America/Boise",
    "America/Cambridge_Bay",
    "America/Campo_Grande",
    "America/Cancun",
    "America/Caracas",
    "America/Cayenne",
    "America/Cayman",
    "America/Chicago",
    "America/Chihuahua",
    "America/Ciudad_Juarez",
    "America/Coral_Harbour",
    "America/Costa_Rica",
    "America/Creston",
    "America/Cuiaba",
    "America/Curacao",
    "America/Danmarkshavn",
    "America/Dawson",
    "America/Dawson_Creek",
    "America/Denver",
    "America/Detroit",
    "America/Dominica",
    "America/Edmonton",
    "America/Eirunepe",
    "America/El_Salvador",
    "America/Ensenada",
    "America/Fort_Nelson",
    "America/Fortaleza",
    "America/Glace_Bay",
    "America/Goose_Bay",
    "America/Grand_Turk",
    "America/Grenada",
    "America/Guadeloupe",
    "America/Guatemala",
    "America/Guayaquil",
    "America/Guyana",
    "America/Halifax",
    "America/Havana",
    "America/Hermosillo",
    "America/Indiana/Indianapolis",
    "America/Indiana/Knox",
    "America/Indiana/Marengo",
    "America/Indiana/Petersburg",
    "America/Indiana/Tell_City",
    "America/Indiana/Vevay",
    "America/Indiana/Vincennes",
    "America/Indiana/Winamac",
    "America/Inuvik",
    "America/Iqaluit",
    "America/Jamaica",
    "America/Juneau",
    "America/Kentucky/Louisville",
    "America/Kentucky/Monticello",
    "America/La_Paz",
    "America/Lima",
    "America/Los_Angeles",
    "America/Maceio",
    "America/Managua",
    "America/Manaus",
    "America/Martinique",
    "America/Matamoros",
    "America/Mazatlan",
    "America/Menominee",
    "America/Merida",
    "America/Metlakatla",
    "America/Mexico_City",
    "America/Miquelon",
    "America/Moncton",
    "America/Monterrey",
    "America/Montevideo",
    "America/Montreal",
    "America/Montserrat",
    "America/Nassau",
    "America/New_York",
    "America/Nipigon",
    "America/Nome",
    "America/Noronha",
    "America/North_Dakota/Beulah",
    "America/North_Dakota/Center",
    "America/North_Dakota/New_Salem",
    "America/Nuuk",
    "America/Ojinaga",
    "America/Panama",
    "America/Pangnirtung",
    "America/Paramaribo",
    "America/Phoenix",
    "America/Port-au-Prince",
    "America/Port_of_Spain",
    "America/Porto_Velho",
    "America/Puerto_Rico",
    "America/Punta_Arenas",
    "America/Rainy_River",
    "America/Rankin_Inlet",
    "America/Recife",
    "America/Regina",
    "America/Resolute",
    "America/Rio_Branco",
    "America/Rosario",
    "America/Santarem",
    "America/Santiago",
    "America/Santo_Domingo",
    "America/Sao_Paulo",
    "America/Scoresbysund",
    "America/Sitka",
    "America/St_Johns",
    "America/St_Kitts",
    "America/St_Lucia",
    "America/St_Thomas",
    "America/St_Vincent",
    "America/Swift_Current",
    "America/Tegucigalpa",
    "America/Thule",
    "America/Thunder_Bay",
    "America/Tijuana",
    "America/Toronto",
    "America/Tortola",
    "America/Vancouver",
    "America/Whitehorse",
    "America/Winnipeg",
    "America/Yakutat",
    "America/Yellowknife",
    "Antarctica/Casey",
    "Antarctica/Davis",
    "Antarctica/DumontDUrville",
    "Antarctica/Macquarie",
    "Antarctica/Mawson",
    "Antarctica/McMurdo",
    "Antarctica/Palmer",
    "Antarctica/Rothera",
    "Antarctica/Syowa",
    "Antarctica/Troll",
    "Antarctica/Vostok",
    "Asia/Aden",
    "Asia/Almaty",
    "Asia/Amman",
    "Asia/Anadyr",
    "Asia/Aqtau",
    "Asia/Aqtobe",
    "Asia/Ashgabat",
    "Asia/Atyrau",
    "Asia/Baghdad",
    "Asia/Bahrain",
    "Asia/Baku",
    "Asia/Bangkok",
    "Asia/Barnaul",
    "Asia/Beirut",
    "Asia/Bishkek",
    "Asia/Brunei",
    "Asia/Chita",
    "Asia/Choibalsan",
    "Asia/Chongqing",
    "Asia/Colombo",
    "Asia/Damascus",
    "Asia/Dhaka",
    "Asia/Dili",
    "Asia/Dubai",
    "Asia/Dushanbe",
    "Asia/Famagusta",
    "Asia/Gaza",
    "Asia/Harbin",
    "Asia/Hebron",
    "Asia/Ho_Chi_Minh",
    "Asia/Hong_Kong",
    "Asia/Hovd",
    "Asia/Irkutsk",
    "Asia/Jakarta",
    "Asia/Jayapura",
    "Asia/Jerusalem",
    "Asia/Kabul",
    "Asia/Kamchatka",
    "Asia/Karachi",
    "Asia/Kashgar",
    "Asia/Kathmandu",
    "Asia/Khandyga",
    "Asia/Kolkata",
    "Asia/Krasnoyarsk",
    "Asia/Kuala_Lumpur",
    "Asia/Kuching",
    "Asia/Kuwait",
    "Asia/Macau",
    "Asia/Magadan",
    "Asia/Makassar",
    "Asia/Manila",
    "Asia/Muscat",
    "Asia/Nicosia",
    "Asia/Novokuznetsk",
    "Asia/Novosibirsk",
    "Asia/Omsk",
    "Asia/Oral",
    "Asia/Phnom_Penh",
    "Asia/Pontianak",
    "Asia/Pyongyang",
    "Asia/Qatar",
    "Asia/Qostanay",
    "Asia/Qyzylorda",
    "Asia/Riyadh",
    "Asia/Sakhalin",
    "Asia/Samarkand",
    "Asia/Seoul",
    "Asia/Shanghai",
    "Asia/Singapore",
    "Asia/Srednekolymsk",
    "Asia/Taipei",
    "Asia/Tashkent",
    "Asia/Tbilisi",
    "Asia/Tehran",
    "Asia/Tel_Aviv",
    "Asia/Thimphu",
    "Asia/Tokyo",
    "Asia/Tomsk",
    "Asia/Ulaanbaatar",
    "Asia/Urumqi",
    "Asia/Ust-Nera",
    "Asia/Vientiane",
    "Asia/Vladivostok",
    "Asia/Yakutsk",
    "Asia/Yangon",
    "Asia/Yekaterinburg",
    "Asia/Yerevan",
    "Atlantic/Azores",
    "Atlantic/Bermuda",
    "Atlantic/Canary",
    "Atlantic/Cape_Verde",
    "Atlantic/Faroe",
    "Atlantic/Jan_Mayen",
    "Atlantic/Madeira",
    "Atlantic/Reykjavik",
    "Atlantic/South_Georgia",
    "Atlantic/St_Helena",
    "Atlantic/Stanley",
    "Australia/Adelaide",
    "Australia/Brisbane",
    "Australia/Broken_Hill",
    "Australia/Currie",
    "Australia/Darwin",
    "Australia/Eucla",
    "Australia/Hobart",
    "Australia/Lindeman",
    "Australia/Lord_Howe",
    "Australia/Melbourne",
    "Australia/Perth",
    "Australia/Sydney",
    "Europe/Amsterdam",
    "Europe/Andorra",
    "Europe/Astrakhan",
    "Europe/Athens",
    "Europe/Belfast",
    "Europe/Belgrade",
    "Europe/Berlin",
    "Europe/Brussels",
    "Europe/Bucharest",
    "Europe/Budapest",
    "Europe/Chisinau",
    "Europe/Copenhagen",
    "Europe/Dublin",
    "Europe/Gibraltar",
    "Europe/Guernsey",
    "Europe/Helsinki",
    "Europe/Isle_of_Man",
    "Europe/Istanbul",
    "Europe/Jersey",
    "Europe/Kaliningrad",
    "Europe/Kirov",
    "Europe/Kyiv",
    "Europe/Lisbon",
    "Europe/Ljubljana",
    "Europe/London",
    "Europe/Luxembourg",
    "Europe/Madrid",
    "Europe/Malta",
    "Europe/Minsk",
    "Europe/Monaco",
    "Europe/Moscow",
    "Europe/Oslo",
    "Europe/Paris",
    "Europe/Prague",
    "Europe/Riga",
    "Europe/Rome",
    "Europe/Samara",
    "Europe/Sarajevo",
    "Europe/Saratov",
    "Europe/Simferopol",
    "Europe/Skopje",
    "Europe/Sofia",
    "Europe/Stockholm",
    "Europe/Tallinn",
    "Europe/Tirane",
    "Europe/Tiraspol",
    "Europe/Ulyanovsk",
    "Europe/Uzhgorod",
    "Europe/Vaduz",
    "Europe/Vienna",
    "Europe/Vilnius",
    "Europe/Volgograd",
    "Europe/Warsaw",
    "Europe/Zagreb",
    "Europe/Zaporozhye",
    "Europe/Zurich",
    "Indian/Antananarivo",
    "Indian/Chagos",
    "Indian/Christmas",
    "Indian/Cocos",
    "Indian/Comoro",
    "Indian/Kerguelen",
    "Indian/Mahe",
    "Indian/Maldives",
    "Indian/Mauritius",
    "Indian/Mayotte",
    "Indian/Reunion",
    "Pacific/Apia",
    "Pacific/Auckland",
    "Pacific/Bougainville",
    "Pacific/Chatham",
    "Pacific/Chuuk",
    "Pacific/Easter",
    "Pacific/Efate",
    "Pacific/Enderbury",
    "Pacific/Fakaofo",
    "Pacific/Fiji",
    "Pacific/Funafuti",
    "Pacific/Galapagos",
    "Pacific/Gambier",
    "Pacific/Guadalcanal",
    "Pacific/Guam",
    "Pacific/Honolulu",
    "Pacific/Johnston",
    "Pacific/Kanton",
    "Pacific/Kiritimati",
    "Pacific/Kosrae",
    "Pacific/Kwajalein",
    "Pacific/Majuro",
    "Pacific/Marquesas",
    "Pacific/Midway",
    "Pacific/Nauru",
    "Pacific/Niue",
    "Pacific/Norfolk",
    "Pacific/Noumea",
    "Pacific/Pago_Pago",
    "Pacific/Palau",
    "Pacific/Pitcairn",
    "Pacific/Pohnpei",
    "Pacific/Port_Moresby",
    "Pacific/Rarotonga",
    "Pacific/Saipan",
    "Pacific/Tahiti",
    "Pacific/Tarawa",
    "Pacific/Tongatapu",
    "Pacific/Wake",
    "Pacific/Wallis",
  ],
};
