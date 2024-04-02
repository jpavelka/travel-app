import { readable, writable, get } from "svelte/store";
import dayjs from "dayjs";

const getTripData = () => {
  let tripDataRaw = `
  date,activity,miles,campground,city,elevation,nights,site,electric,sewer,laundry,showers,lat,lng,timezone,mapSearchExtra,mapSearchReplace
  "Sunday, March 10, 2024",Driving,211,Panhandle Lodging RV Park,"Canyon, TX",3466,3,1,50A,Yes,Yes,Yes,34.9649238,-101.8832092,CDT (GMT-5),,
  "Wednesday, March 13, 2024",Driving,214,Bottomless Lakes SP,"Roswell, NM",3602,3,28,50A,No,No,Yes,33.3164453,-104.3308359,MDT (GMT-6),Bottomless Lakes Park Campground,
  "Saturday, March 16, 2024",Driving,66,Brantley Lake SP,"Carlsbad, NM",3313,3,24,50A,No,No,Yes,32.5640317,-104.3806931,MDT (GMT-6),limestone campground,
  "Tuesday, March 19, 2024",Driving,221,Rio Grande Winery,"Las Cruces, NM",3500,1,n/a,No,No,No,No,32.236348,-106.7590752,MDT (GMT-6),,
  "Wednesday, March 20, 2024",Driving,10,Las Cruces KOA Journey,"Las Cruces, NM",3500,1,52,50A,Yes,Yes,Yes,32.2924695,-106.8596845,MDT (GMT-6),,
  "Thursday, March 21, 2024",Driving,197,Cattlerest Saloon,"Willcox, AZ",4179,1,2,50A,DS,No,No,32.2365566,-109.8505589,MST (GMT-7),,
  "Friday, March 22, 2024",Driving,3,Grand Vista RV Park,"Willcox, AZ",5397,2,TBD,50A,Yes,Yes,Yes,32.2620407,-109.8338428,MST (GMT-7),,
  "Sunday, March 24, 2024",Driving,85,Kartchner Caverns SP,"Benson, AZ",4559,3,KTC-55,50A,No,Yes,Yes,31.836596,-110.3488848,MST (GMT-7),,
  "Wednesday, March 27, 2024",Driving,54,Catalina SP,"Tucson, AZ",2654,9,CLT-B-25,50A,No,Yes,Yes,32.4265434,-110.9253819,MST (GMT-7),catalina state park campground b,
  "Friday, April 05, 2024",Driving,245,Pilot Knob RV Resort,"Winterhaven, CA",272,2,TBD,50A,Yes,Yes,Yes,32.747145,-114.7636939,PDT (GMT-7),Encore,
  "Sunday, April 07, 2024",Driving,141,1000 Trails Palm Springs,"Palm Desert, CA",119,7,TBD,50A,Yes,Yes,Yes,33.7634686,-116.3109684,PDT (GMT-7),,
  "Sunday, April 14, 2024",Driving,180,North Ranch RV Park,"Congress, AZ",2801,2,TBD,50A,Yes,Yes,Yes,34.104932,-112.8309524,MST (GMT-7),,
  "Tuesday, April 16, 2024",Driving,93,Dead Horse Ranch SP,"Cottonwood, AZ",3320,3,DHR-87,50A,No,Yes,Yes,34.7537237,-112.0215606,MST (GMT-7),,
  "Friday, April 19, 2024",Driving,129,Homolovi State Park,"Winslow, AZ",4888,3,HLR-20,50A,No,No,Yes,35.0464771,-110.6527338,MST (GMT-7),,
  "Monday, April 22, 2024",Driving,148,Grand Canyon Trailer Village,"Grand Canyon, AZ",7021,3,TBD,50A,Yes,Yes,Yes,36.0528892,-112.1150912,MST (GMT-7),,
  "Thursday, April 25, 2024",Driving,57,Navajo Land Hotel,"Tuba City, AZ",4941,2,TBD,50A,Yes,No,No,36.1306034,-111.2420668,MDT (GMT-6),NavajoLand Tuba City R.V. Park,
  "Saturday, April 27, 2024",Driving,82,Waheap RV Park Lower CG,"Page, AZ",3732,3,TBD,50A,Yes,Yes,Yes,36.997326,-111.4990853,MST (GMT-7),,
  "Tuesday, April 30, 2024",Driving,151,Zion Canyon CG,"Springdale, UT",3921,7,E36,50A,Yes,Yes,Yes,37.1929646,-112.9912374,MDT (GMT-6),,
  "Tuesday, May 07, 2024",Driving,118,Dixie Forest RV Resort,"Panguitch, UT",6633,7,38D,50A,Yes,Yes,Yes,37.8146135,-112.4346644,MDT (GMT-6),,
  "Tuesday, May 14, 2024",Driving,256,Moab KOA,"Moab, UT",4607,7,TBD,50A,Yes,Yes,Yes,38.523874,-109.4963551,MDT (GMT-6),,
  "Tuesday, May 21, 2024",Driving,223,Vernal KOA,"Vernal, UT",5318,3,TBD,50A,Yes,Yes,Yes,40.4694307,-109.5285888,MDT (GMT-6),,
  "Friday, May 24, 2024",Driving,311,Gros Ventre CG,Grand Teton NP,6568,7,99,No,No,No,No,43.6159427,-110.6658657,MDT (GMT-6),gros ventre campground,
  "Friday, May 31, 2024",Driving,98,Fishing Bridge RV,Yellowstone NP,7770,14,TBD,50A,Yes,Yes,Yes,44.5657137,-110.3660453,MDT (GMT-6),,
  "Friday, June 14, 2024",Driving,162,Bridger Brewing,"Three Forks, MT",4075,1,n/a,No,No,No,No,45.9202897,-111.5901746,MDT (GMT-6),,
  "Saturday, June 15, 2024",Driving,239,Lewis & Clark RV Park,"Shelby, MT",3314,1,TBD,50A,Yes,Yes,Yes,48.5240978,-111.8591962,MDT (GMT-6),,
  "Sunday, June 16, 2024",Driving,195,George Lane Memorial Park,"High River, AB",3402,2,TBD,30A,No,No,Yes,50.5784315,-113.8751605,MDT (GMT-6),,
  "Tuesday, June 18, 2024",Driving,115,Tunnel Mountain Trailer Court,"Banff, AB",4717,10,343/236/143,50A,Yes,???,Yes,51.190485,-115.5344935,MDT (GMT-6),,
  "Friday, June 28, 2024",Driving,41,Lake Louise Tent Trailer CG,"Lake Louise, AB",5118,4,132,30A,No,No,Yes,51.4176144,-116.1734193,MDT (GMT-6),soft sided,
  "Tuesday, July 02, 2024",Driving,144,Whistler's Campground,"Jasper, AB",3461,4,51O/51N/51D,50A,Yes,No,Yes,52.8504957,-118.0774499,MDT (GMT-6),,
  "Saturday, July 06, 2024",Driving,257,Hawk Tail Brewery,"Rimbey, AB",3051,1,n/a,No,No,No,No,52.6522102,-114.2424545,MDT (GMT-6),,
  "Sunday, July 07, 2024",Driving,255,Lethbridge KOA,"Lethbridge, AB",2715,1,TBD,50A,Yes,Yes,Yes,49.711501,-112.872927,MDT (GMT-6),,
  "Monday, July 08, 2024",Driving,191,Big Sky Deli and Bakery,"Vaughn, MT",3500,1,n/a,No,No,No,No,47.5536727,-111.5612945,MDT (GMT-6),,
  "Tuesday, July 09, 2024",Driving,287,7th Ranch RV Camp,"Garryowen, MT",3198,1,TBD,50A,Yes,No,No,45.4919436,-107.3776587,MDT (GMT-6),,
  "Wednesday, July 10, 2024",Driving,215,Cedar Ridge RV Park,"Pine Haven, WY",4242,2,TBD,50A,Yes,Yes,Yes,44.3578215,-104.8174857,MDT (GMT-6),,
  "Friday, July 12, 2024",Driving,103,Buffalo Ridge Camp Resort,"Custer, SD",5312,8,TBD,50A,Yes,Yes,Yes,43.7584652,-103.6128112,MDT (GMT-6),,
  "Saturday, July 20, 2024",Driving,178,Papa Moon Winery & Cider House,"Scottsbluff, NE",3888,1,n/a,Yes,No,No,No,41.8877158,-103.6176699,MDT (GMT-6),,
  "Saturday, April 06, 2024",Diversion,162,Inn at the Park,"San Diego, CA",62,4,TBD,Yes,Yes,Yes,Yes,32.7385226,-117.1597926,PDT (GMT-7),,
  "Monday, April 29, 2024",Diversion,274,Luxor Hotel & Casino,"Las Vegas, NV",2001,1,TBD,Yes,Yes,Yes,Yes,36.09551,-115.1760672,PDT (GMT-7),,
  "Sunday, May 5, 2024",Diversion,156,Paris Las Vegas,"Las Vegas, NV",2001,2,TBD,Yes,Yes,Yes,Yes,36.112462,-115.1707075,PDT (GMT-7),,
  "Friday, May 24, 2024",Diversion,210,Ogden AirBnB,"Ogden, UT",4300,3,n/a,Yes,Yes,Yes,Yes,41.2209588,-111.9739393,MDT (GMT-6),272 25th Street,
  "Saturday, June 15, 2024",Diversion,27,Tonya to Dance Camp,"Bozeman, MT",4473,0,n/a,Yes,Yes,Yes,Yes,45.7784043,-111.1612273,MDT (GMT-6),,Bozeman airport
  "Friday, June 21, 2024",Diversion,90,Tonya Returns!,"Calgary, AB",3428,0,n/a,Yes,Yes,Yes,Yes,51.1325928,-114.0138904,MDT (GMT-6),,Calgary airport
  `.split('\n').filter(s => s.trim() !== '');
  const tripDataHeaders = tripDataRaw[0].split(',').map(s => s.trim());
  tripDataRaw = tripDataRaw.slice(1);
  const tripData = {
    tripData: [],
    diversions: []
  }
  tripDataRaw.map((s, i) => {
    let arr = s.split(",").map(s => s.trim());
    let checkMerge = true;
    while (checkMerge) {
      let i = 0;
      while (i < arr.length - 1) {
        i = parseInt(i);
        const s = arr[i];
        if (s[0] === '"' && s[s.length - 1] !== '"') {
          arr = arr.slice(0, i).concat([arr[i] + ', ' + arr[i + 1]]).concat(arr.slice(i + 2));
          continue
        } else {
          i += 1;

        }
      }
      checkMerge = false;
    }
    let obj = Object({});
    for (const i in arr) {
      const hdr = tripDataHeaders[i];
      let s = arr[i];
      if (s[0] === '"'){
        s = s.slice(1);
      }
      if (s[s.length -1 ] === '"') {
        s = s.slice(0, s.length - 1)
      }
      if (["miles", "elevation", "lat", "lng", "nights"].includes(hdr)) {
        obj[tripDataHeaders[i]] = parseFloat(s);
      } else if (hdr === "date") {
        obj[tripDataHeaders[i]] = new Date(s);
      } else {
        obj[tripDataHeaders[i]] = s;
      }
    }
    if (obj.activity.toLowerCase() === 'driving') {
      tripData.tripData.push(obj);
    } else if (obj.activity.toLowerCase() === 'diversion') {
      tripData.diversions.push(obj);
    }
  });
  for (const i in tripData.diversions) {
    const iInt = parseInt(i);
    const d = tripData.diversions[iInt];
    d.dataInd = iInt;
    let campgroundInd = 0;
    for (const td of tripData.tripData) {
      if (new Date(d.date) > new Date(td.date)) {
        campgroundInd += 1;
      } else {
        break;
      }
    }
    d.fromCampgroundInd = campgroundInd - 1;
    let leaveDate = new Date(d.date);
    leaveDate.setDate(leaveDate.getDate() + d.nights);
    d.leaveDate = leaveDate;
    while (campgroundInd < tripData.tripData.length - 1) {
      if (leaveDate > new Date(tripData.tripData[campgroundInd].date)) {
        campgroundInd += 1;
      } else {
        break;
      }
    }
    d.toCampgroundInd = campgroundInd - 1;
  }
  for (const i in tripData.tripData) {
    const iInt = parseInt(i);
    tripData.tripData[iInt].dataInd = iInt;
  }
  return tripData
};

const tData = getTripData();
const tripData = readable(tData.tripData);
const diversionData = readable(tData.diversions);

const getDateData = (d) => {
  let currentInd = -1;
  const dt = new Date(d);
  for (const td of get(tripData)) {
    if (td.date < dt) {
      currentInd += 1;
    }
  }
  if (
    currentInd > 0 &&
    get(tripData)[currentInd].date.toDateString() == dt.toDateString()
  ) {
    return [get(tripData)[currentInd - 1], get(tripData)[currentInd]];
  } else {
    return [get(tripData)[currentInd]];
  }
};

const tripWeatherData = writable([]);

const getWeatherData = async () => {
  const today = dayjs(new Date());
  let loopDay = dayjs(new Date());

  let allDateWeatherInfo = [];

  const getWeatherData = async (lat, lng, dt) => {
    dt = new Date(dt);
    let nowData = [];
    const latLngDtData = async (lat, lng, dt) => {
      const response = await fetch(
        `https://api.weather.gov/points/${lat},${lng}`
      );
      const myJson = await response.json();
      if (dt.toDateString() == new Date(today).toDateString()) {
        const hourlyResponse = await fetch(myJson.properties.forecastHourly);
        const hourlyJson = await hourlyResponse.json();
        const periods = hourlyJson.properties.periods;
        periods[0].name = "Now";
        nowData = [periods[0]];
      }
      const forecastResponse = await fetch(myJson.properties.forecast);
      const forecastJson = await forecastResponse.json();
      const periods = forecastJson.properties.periods;
      const filtered = periods.filter(
        (p) => new Date(p.startTime).toDateString() == dt.toDateString()
      );
      return nowData.concat(filtered);
    }
    try {
      return latLngDtData(lat, lng, dt);
    } catch {
      try {
        return latLngDtData(lat, lng, dt);
      } catch {
        try {
          return latLngDtData(lat, lng, dt);
        } catch {
          return [undefined];
        }
      }
    }
  };

  while (loopDay < today.add(7, "day")) {
    const allDateInfo = getDateData(loopDay);
    for (const dateInfo of allDateInfo) {
      dateInfo.actualDay = loopDay;
      let newWeatherData = await getWeatherData(
        dateInfo.lat,
        dateInfo.lng,
        loopDay
      );
      newWeatherData = newWeatherData.map((wd) => {
        wd.travelData = dateInfo;
        return wd;
      });
      allDateWeatherInfo = allDateWeatherInfo.concat(newWeatherData);
    }
    loopDay = loopDay.add(1, "day");
  }
  for (let i in allDateWeatherInfo) {
    i = parseInt(i);
    allDateWeatherInfo[i].isNewLocation = false;
    if (
      i === 0 ||
      allDateWeatherInfo[i].travelData.campground !==
        allDateWeatherInfo[i - 1].travelData.campground
    ) {
      allDateWeatherInfo[i].isNewLocation = true;
    }
  }
  tripWeatherData.set(allDateWeatherInfo);
};

getWeatherData();

const hourlyWeatherData = writable([]);

const getHourlyWeatherData = async () => {
  const today = dayjs(new Date());

  let allHourlyWeatherInfo = [];

  const getHourlyWeatherData = async (lat, lng) => {
    let nowData = [];
    const latLngDtData = async (lat, lng) => {
      const response = await fetch(
        `https://api.weather.gov/points/${lat},${lng}`
      );
      const myJson = await response.json();
      const hourlyResponse = await fetch(myJson.properties.forecastHourly);
      const hourlyJson = await hourlyResponse.json();
      const periods = hourlyJson.properties.periods;
      nowData = periods;
      return nowData;
    }
    try {
      return latLngDtData(lat, lng);
    } catch {
      try {
        return latLngDtData(lat, lng);
      } catch {
        try {
          return latLngDtData(lat, lng);
        } catch {
          return [undefined];
        }
      }
    }
  };

  const allDateInfo = getDateData(today);
  for (const dateInfo of allDateInfo) {
    dateInfo.actualDay = today;
    let newWeatherData = await getHourlyWeatherData(
      dateInfo.lat,
      dateInfo.lng
    );
    newWeatherData = newWeatherData.map((wd) => {
      wd.travelData = dateInfo;
      return wd;
    });
    allHourlyWeatherInfo = allHourlyWeatherInfo.concat(newWeatherData);
  }
  for (let i in allHourlyWeatherInfo) {
    i = parseInt(i);
    allHourlyWeatherInfo[i].isNewLocation = false;
    allHourlyWeatherInfo[i].isNewDay = false;
    if (
      i === 0 ||
      allHourlyWeatherInfo[i].travelData.campground !==
        allHourlyWeatherInfo[i - 1].travelData.campground
    ) {
      allHourlyWeatherInfo[i].isNewLocation = true;
    }
    if (i === 0 || new Date(allHourlyWeatherInfo[i].startTime).getDate() !== new Date(allHourlyWeatherInfo[i - 1].startTime).getDate()) {
      allHourlyWeatherInfo[i].isNewDay = true;
    }
  }
  hourlyWeatherData.set(allHourlyWeatherInfo);
};

getHourlyWeatherData();

export { tripData, diversionData, getDateData, tripWeatherData, hourlyWeatherData };
