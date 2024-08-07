import { readable, writable, get } from "svelte/store";
import dayjs from "dayjs";

const getTripData = () => {
  let tripDataRaw = `
  date,activity,miles,campground,city,elevation,nights,site,electric,sewer,laundry,showers,lat,lng,timezone,mapSearchExtra,mapSearchReplace
"Sunday, March 10, 2024",Driving,211,Panhandle Lodging RV Park,"Canyon, TX",3466,3,1,50A,Yes,Yes,Yes,34.9649238,-101.8832092,CDT (GMT-5),,
,Cadillac Ranch,,,"Amarillo, TX",,,,,,,,35.1872366,-101.9870486,,,
,Palo Duro Canyon SP,,,,,,,,,,,34.9372503,-101.6589305,,,
,Texas Air & Space Museum,,,"Amarillo, TX",,,,,,,,35.2134157,-101.7140016,,,
"Wednesday, March 13, 2024",Driving,214,Bottomless Lakes SP,"Roswell, NM",3602,3,28,50A,No,No,Yes,33.3164453,-104.3308359,MDT (GMT-6),Bottomless Lakes Park Campground,
,Aliens!,,,"Roswell, NM",,,,,,,,33.3942655,-104.5230242,,,
"Saturday, March 16, 2024",Driving,66,Brantley Lake SP,"Carlsbad, NM",3313,3,24,50A,No,No,Yes,32.5640317,-104.3806931,MDT (GMT-6),limestone campground,
,Carlsbad Caverns National Park,,,,,,,,,,,32.137045,-104.5437529,,,
"Tuesday, March 19, 2024",Driving,221,Rio Grande Winery,"Las Cruces, NM",3500,1,n/a,No,No,No,No,32.236348,-106.7590752,MDT (GMT-6),,
,White Sands National Park,,,,,,,,,,,32.7872403,-106.3256816,,,
"Wednesday, March 20, 2024",Driving,10,Las Cruces KOA Journey,"Las Cruces, NM",3500,1,52,50A,Yes,Yes,Yes,32.2924695,-106.8596845,MDT (GMT-6),,
"Thursday, March 21, 2024",Driving,197,Cattlerest Saloon,"Willcox, AZ",4179,1,2,50A,DS,No,No,32.2365566,-109.8505589,MST (GMT-7),,
"Friday, March 22, 2024",Driving,3,Grand Vista RV Park,"Willcox, AZ",5397,2,TBD,50A,Yes,Yes,Yes,32.2620407,-109.8338428,MST (GMT-7),,
,Chiricahua National Monument,,,,,,,,,,,32.0121363,-109.3416105,,,
"Sunday, March 24, 2024",Driving,85,Kartchner Caverns SP,"Benson, AZ",4559,3,KTC-55,50A,No,Yes,Yes,31.836596,-110.3488848,MST (GMT-7),,
,OK Corral,,,"Tombstone, AZ",,,,,,,,31.7130202,-110.06762,,,
,"Bisbee, AZ",,,,,,,,,,,31.4481547,-109.9284084,,,
"Wednesday, March 27, 2024",Driving,54,Catalina SP,"Tucson, AZ",2654,9,CLT-B-25,50A,No,Yes,Yes,32.4265434,-110.9253819,MST (GMT-7),catalina state park campground b,
,U of A Baseball,,Hi Corbett Field,"Tucson, AZ",,,,,,,,32.2129525,-110.9197125,,,
,Titan Missle Museum,,,"Green Valley, AZ",,,,,,,,31.9027417,-110.9992833,,,
,Ballroom Dance,,Invictus Dancesport,"Tucson, AZ",,,,,,,,32.3067331,-111.0097629,,,
,West Coast Swing,,Dream Dance,"Tucson, AZ",,,,,,,,32.2873778,-110.9657056,,,
,Saguaro National Park,,,,,,,,,,,32.1830899,-110.6126823,,,
"Friday, April 05, 2024",Driving,245,Pilot Knob RV Resort,"Winterhaven, CA",272,2,TBD,50A,Yes,Yes,Yes,32.747145,-114.7636939,PDT (GMT-7),Encore,
"Sunday, April 07, 2024",Driving,141,1000 Trails Palm Springs,"Palm Desert, CA",119,7,TBD,50A,Yes,Yes,Yes,33.7634686,-116.3109684,PDT (GMT-7),,
,Palm Springs Village Fest,,,"Palm Springs, CA",,,,,,,,33.82492513,-116.5468082,,,
,Joshua Tree National Park,,,,,,,,,,,33.873415,-115.9009923,,,
,SoCal Lindberg Meetup,,Sylvan Park,"Redlands, CA",,,,,,,,34.0599329,-117.1680177,,,
"Sunday, April 14, 2024",Driving,180,North Ranch RV Park,"Congress, AZ",2801,2,TBD,30A,Yes,Yes,Yes,34.104932,-112.8309524,MST (GMT-7),,
"Tuesday, April 16, 2024",Driving,93,Dead Horse Ranch SP,"Cottonwood, AZ",3320,3,DHR-87,50A,No,Yes,Yes,34.7537237,-112.0215606,MST (GMT-7),,
,,,,"Jerome, AZ",,,,,,,,34.7489107,-112.1137716,,,
,Sedona Jeep Tour,,Safari Jeep Tours,"Sedona, AZ",,,,,,,,34.8712197,-111.7614806,,,
,Tuzigoot National Monument,,,,,,,,,,,34.768481,-112.0268701,,,
"Friday, April 19, 2024",Driving,129,Homolovi State Park,"Winslow, AZ",4888,3,HLR-20,50A,No,No,Yes,35.03009999,-110.6510889,MST (GMT-7),,
,La Posada Hotel,,,"Winslow, AZ",,,,,,,,35.0214483,-110.6950852,,,
,Standing on the Corner,,,"Winslow, AZ",,,,,,,,35.0234878,-110.6981315,,,
,Waltz Class/Social,,Jazzercise Flagstaff,"Flagstaff, AZ",,,,,,,,35.1970507,-111.6246951,,,
,Homolovi II Archaeological Site,,,,,,,,,,,35.0848197,-110.6427383,,,
,Walnut Canyon National Monument,,,,,,,,,,,35.1690189,-111.5043369,,,
,Arthur's house,,,"Flagstaff, AZ",,,,,,,,35.20500687,-111.6459523,,,
"Monday, April 22, 2024",Driving,148,Grand Canyon Trailer Village,"Grand Canyon, AZ",7021,3,TBD,50A,Yes,Yes,Yes,36.0528892,-112.1150912,MST (GMT-7),,
,Grand Canyon National Park,,,,,,,,,,,36.0591151,-112.1091934,,,
"Thursday, April 25, 2024",Driving,57,NavajoLand Hotel,"Tuba City, AZ",4941,2,TBD,50A,Yes,No,No,36.1306034,-111.2420668,MDT (GMT-6),NavajoLand Tuba City R.V. Park,
,Monument Valley Tour,,,,,,,,,,,36.9813728,-110.1123657,,,
,Navajo Code Talkers Museum,,,"Tuba City, AZ",,,,,,,,36.1302507,-111.2405677,,,
"Saturday, April 27, 2024",Driving,82,Wahweap RV Park Lower CG,"Page, AZ",3732,3,TBD,50A,Yes,Yes,Yes,36.997326,-111.4990853,MST (GMT-7),,
,Glen Canyon National Recreation Area,,,,,,,,,,,36.94305136,-111.4934369,,,
,Upper Antelope Canyon,,,,,,,,,,,36.8619103,-111.3743302,,,
,Lower Antelope Canyon,,,,,,,,,,,36.9031279,-111.4132505,,,
,Horseshoe Bend,,,,,,,,,,,36.8790612,-111.5103627,,,
"Tuesday, April 30, 2024",Driving,151,Zion Canyon CG,"Springdale, UT",3921,7,E36,50A,Yes,Yes,Yes,37.1929646,-112.9912374,MDT (GMT-6),,
,Zion National Park,,,,,,,,,,,37.2982022,-113.0263005,,,
,,,,"St. George, UT",,,,,,,,37.0965278,-113.5684164,,,
,,,,"Cedar City, UT",,,,,,,,37.6774769,-113.0618931,,,
"Tuesday, May 07, 2024",Driving,118,Dixie Forest RV Resort,"Panguitch, UT",6633,7,38D,50A,Yes,Yes,Yes,37.8146135,-112.4346644,MDT (GMT-6),,
,Bryce Canyon National Park,,,,,,,,,,,37.5930377,-112.1870895,,,
,Capitol Reef National Park,,,,,,,,,,,38.0877312,-111.1354983,,,
"Tuesday, May 14, 2024",Driving,256,Moab KOA,"Moab, UT",4607,7,TBD,50A,Yes,Yes,Yes,38.523874,-109.4963551,MDT (GMT-6),,
,Arches National Park,,,,,,,,,,,38.733081,-109.5925139,,,
,Canyonlands National Park,,,,,,,,,,,38.2135733,-109.9025345,,,
,Colorado National Monument,,Visitor's Center,"Grand Junction, CO",,,,,,,,39.1009158,-108.7345048,,,
"Tuesday, May 21, 2024",Driving,223,Vernal KOA,"Vernal, UT",5318,3,TBD,50A,Yes,Yes,Yes,40.4694307,-109.5285888,MDT (GMT-6),,
,Dinosaur National Monument,,,,,,,,,,,40.5130533,-108.9487453,,,
"Friday, May 24, 2024",Driving,311,Gros Ventre CG,Grand Teton NP,6568,7,99,No,No,No,No,43.6159427,-110.6658657,MDT (GMT-6),gros ventre campground,
,Grand Teton National Park,,,,,,,,,,,43.7904282,-110.6817627,,,
,,,,"Jackson, WY",,,,,,,,43.4799291,-110.7624282,,,
"Friday, May 31, 2024",Driving,98,Fishing Bridge RV,Yellowstone NP,7770,14,TBD,50A,Yes,Yes,Yes,44.5657137,-110.3660453,MDT (GMT-6),,
,Old Faithful,,,,,,,,,,,44.4604788,-110.8281377,,,
,Grand Canyon of the Yellowstone,,,,,,,,,,,44.719745,-110.4853201,,,
,West Thumb,,,,,,,,,,,44.4185508,-110.5729846,,,
,Grand Prismatic Spring,,,,,,,,,,,44.5250346,-110.8381793,,,
,Mammoth Hot Spring,,,,,,,,,,,44.9705623,-110.7033729,,,
,Lake Village,,,,,,,,,,,44.5497699,-110.4002611,,,
,Tower Fall,,,,,,,,,,,44.8938189,-110.3871663,,,
"Friday, June 14, 2024",Driving,162,Bridger Brewing,"Three Forks, MT",4075,1,n/a,No,No,No,No,45.9202897,-111.5901746,MDT (GMT-6),,
"Saturday, June 15, 2024",Driving,239,Lewis & Clark RV Park,"Shelby, MT",3314,1,TBD,50A,Yes,Yes,Yes,48.5240978,-111.8591962,MDT (GMT-6),Lewis & Clark RV Park LLC,
"Sunday, June 16, 2024",Driving,195,Lethbridge KOA (1),"Lethbridge, AB",2715,2,TBD,50A,Yes,Yes,Yes,49.711501,-112.872927,MDT (GMT-6),,
"Tuesday, June 18, 2024",Driving,115,Tunnel Mountain Trailer Court,"Banff, AB",4717,10,343/236/143,50A,Yes,???,Yes,51.190485,-115.5344935,MDT (GMT-6),,
,Banff Springs Hotel,,,,,,,,,,,51.164332,-115.56183,,,
,Cascade of Time Garden,,,,,,,,,,,51.171379,-115.5717517,,,
,Cave and Basin,,,,,,,,,,,51.1690712,-115.5915223,,,
,Johnston Canyon,,,,,,,,,,,51.2455293,-115.8398977,,,
"Friday, June 28, 2024",Driving,41,Lake Louise Tent Trailer CG,"Lake Louise, AB",5118,4,132,30A,No,No,Yes,51.4176144,-116.1734193,MDT (GMT-6),soft sided,
,Lake Louise,,,,,,,,,,,51.4124354,-116.2273869,,,
,Moraine Lake,,,,,,,,,,,51.3217416,-116.1860049,,,
,Peyto Lake,,,,,,,,,,,51.7255153,-116.5226977,,,
"Tuesday, July 02, 2024",Driving,144,Whistler's Campground,"Jasper, AB",3461,3,51O/51N/51D,50A,Yes,No,Yes,52.8504957,-118.0774499,MDT (GMT-6),,
,Maligne Canyon,,,,,,,,,,,52.9201888,-117.9984631,,,
,Icefields Parkway,,,,,,,,,,,52.2203483,-117.2242371,,,
,Beauty Creek,,,,,,,,,,,52.3332473,-117.3199854,,,
"Friday, July 05, 2024",Driving,144,Lake Louise Tent Trailer CG (2),"Lake Louise, AB",5118,1,126,50A,No,No,Yes,51.4176144,-116.1734193,MDT (GMT-6),soft sided,
"Saturday, July 06, 2024",Driving,255,Lethbridge KOA (2),"Lethbridge, AB",2715,2,TBD,50A,Yes,Yes,Yes,49.711501,-112.872927,MDT (GMT-6),,
"Monday, July 08, 2024",Driving,191,Great Falls KOA Holiday,"Great Falls, MT",3500,1,TBD,50A,Yes,Yes,Yes,47.4875491,-111.2216082,MDT (GMT-6),,
"Tuesday, July 09, 2024",Driving,287,7th Ranch RV Camp,"Garryowen, MT",3198,1,TBD,50A,Yes,No,No,45.4919436,-107.3776587,MDT (GMT-6),,
,Little Bighorn Battlefield National Monument,,,,,,,,,,,45.5703673,-107.4273966,,,
"Wednesday, July 10, 2024",Driving,215,Devils Tower / Black Hills KOA Journey,"Devils Tower, WY",3861,2,TBD,50A,Yes,Yes,Yes,44.5902221,-104.6985666,MDT (GMT-6),,
,Devils Tower National Monument,,,,,,,,,,,44.5902098,-104.7146168,,,
"Friday, July 12, 2024",Driving,103,Buffalo Ridge Camp Resort,"Custer, SD",5312,6,TBD,50A,Yes,Yes,Yes,43.7584652,-103.6128112,MDT (GMT-6),,
,Wind Cave National Park,,,,,,,,,,,43.5724388,-103.4415644,,,
,Crazy Horse Memorial,,,,,,,,,,,43.8366191,-103.6234038,,,
,Badlands National Park,,,,,,,,,,,43.8553804,-102.3396912,,,
,Mount Rushmore,,,,,,,,,,,43.8803357,-103.4537746,,,
"Thursday, July 18, 2024",Driving,261,Ogallala / Tri Trails KOA Journey,"Ogallala, NE",3245,1,TBD,Yes,Yes,Yes,Yes,41.1053163,-101.7142801,MDT (GMT-6),,
"Saturday, April 06, 2024",Diversion,162,Inn at the Park,"San Diego, CA",62,4,TBD,Yes,Yes,Yes,Yes,32.7385226,-117.1597926,PDT (GMT-7),,
,Maple Canyon,,,"San Diego, CA",,,,,,,,32.7349759,-117.1638457,,,
,San Diego Zoo,,,"San Diego, CA",,,,,,,,32.7360353,-117.1509849,,,
,Padres Game,,Petco Park,"San Diego, CA",,,,,,,,32.7075941,-117.1570422,,,
,San Diego Natural History Museum,,,"San Diego, CA",,,,,,,,32.7323223,-117.147364,,,
,Fleet Science Center ,,,"San Diego, CA",,,,,,,,32.7308009,-117.1469593,,,
,Waterfront Park,,,"San Diego, CA",,,,,,,,32.722281,-117.172761,,,
,Coronado Ferry Landing Park,,,"San Diego, CA",,,,,,,,32.698986,-117.1693818,,,
,Seal Point,,La Jolla,"San Diego, CA",,,,,,,,32.8469916,-117.2786487,,,
,First Saturday Swing,,Infinity Dance,"San Diego, CA",,,,,,,,32.8267967,-117.1608955,,,
"Monday, April 29, 2024",Diversion,274,Luxor Hotel & Casino,"Las Vegas, NV",2001,1,TBD,Yes,Yes,Yes,Yes,36.09551,-115.1760672,PDT (GMT-7),,
,Pick Up Nanny and Papa,,Harry Reid International Airport,"Las Vegas, NV",,,,,,,,36.0830907,-115.1482238,,,
"Sunday, May 5, 2024",Diversion,156,Paris Las Vegas,"Las Vegas, NV",2001,2,TBD,Yes,Yes,Yes,Yes,36.112462,-115.1707075,PDT (GMT-7),,
,Drop Off Nanny and Papa,,Harry Reid International Airport,"Las Vegas, NV",,,,,,,,36.086905,-115.136464,,,
"Sunday, May 5, 2024",Jersey Boys,,Orleans Showroom,"Las Vegas, NV",,,,,,,,36.1022222,-115.2011111,,,
"Friday, May 24, 2024",Diversion,210,Ogden AirBnB,"Ogden, UT",4300,2,n/a,Yes,Yes,Yes,Yes,41.2209588,-111.9739393,MDT (GMT-6),272 25th Street,
,Good place to live?,,"Park, library, Rancho Market nearby","Ogden, UT",,,,,,,,41.21936826,-111.9565973,,,
,Sugar House Park,,,"Salt Lake City, UT",,,,,,,,40.723877,-111.8493998,,,
,Golden Spike National Historical Park,,,,,,,,,,,41.6171911,-112.5507226,,,
,Loveland Living Planet Aquarium,,,"Draper, UT",,,,,,,,40.5320877,-111.8938258,,,
,Milonga ,,E. W. Garbett Center for Choral Studies,"Salt Lake City, UT",,,,,,,,40.7845429,-111.8964608,,,
"Saturday, June 15, 2024",Diversion,27,Tonya to Dance Camp,"Bozeman, MT",4473,0,n/a,Yes,Yes,Yes,Yes,45.7784043,-111.1612273,MDT (GMT-6),,Bozeman airport
"Friday, June 21, 2024",Diversion,90,Tonya Returns!,"Calgary, AB",3428,1,n/a,Yes,Yes,Yes,Yes,51.1325928,-114.0138904,MDT (GMT-6),,Calgary airport
"Friday, July 5, 2024",Diversion,226,Edmonton AirBnB,"Edmonton, AB",2116,2,n/a,Yes,Yes,Yes,Yes,53.5343546,-113.5794589,MDT (GMT-6),,
,West Edmonton Mall,,,"Edmonton, AB",,,,,,,,53.5230471,-113.6227415,,,
  `.split('\n').filter(s => s.trim() !== '');
  const tripDataHeaders = tripDataRaw[0].split(',').map(s => s.trim());
  tripDataRaw = tripDataRaw.slice(1);
  let lastType = undefined;
  const tripData = {
    tripData: [],
    diversions: [],
    pointsOfInterest: [],
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
      obj.images = [];
      if (hdr === 'imageSrcs') {
        let imgSrcs = arr.slice(i).filter(s => s.trim() !== '');
        let images = [];
        while (imgSrcs.length > 0) {
          images.push({
            src: imgSrcs[0],
            caption: imgSrcs[1]
          })
          imgSrcs = imgSrcs.slice(2);
        }
        obj.images = images;
        continue
      }
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
      obj.pointsOfInterest = [];
      obj.placeType = 'campground';
      tripData.tripData.push(obj);
      lastType = 'campground';
    } else if (obj.activity.toLowerCase() === 'diversion') {
      obj.pointsOfInterest = [];
      obj.placeType = 'diversion';
      tripData.diversions.push(obj);
      lastType = 'diversion';
    } else {
      obj.parentType = lastType;
      const k = lastType === 'campground' ? 'tripData' : 'diversions'
      const parent = tripData[k][tripData[k].length - 1]
      obj.parentName = parent.campground;
      obj.parentInd = tripData[k].length - 1;
      tripData.pointsOfInterest.push(obj);
      tripData[k][tripData[k].length - 1].pointsOfInterest.push(tripData.pointsOfInterest.length - 1);
      obj.desc = '';
      if (obj.activity !== '') {
        obj.desc = obj.activity;
        if (obj.campground !== '') {
          obj.desc += (
            ' (' + obj.campground + (
              obj.city === '' ? '' : (', ' + obj.city) 
            ) + ')'
          )
        } else if (obj.city !== '') {
          obj.desc += (' (' + obj.city + ')');
        }
      } else if (obj.campground !== '') {
        obj.desc = obj.campground;
        if (obj.city !== '') {
          obj.desc += (' (' + obj.city + ')');
        }
      } else {
        obj.desc = obj.city;
      }
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
      if (leaveDate >= new Date(tripData.tripData[campgroundInd].date)) {
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
    tripData.tripData[iInt].fromCampgroundInd = iInt - 1;
    tripData.tripData[iInt].toCampgroundInd = iInt + 1;
    const d = tripData.tripData[iInt];
    let leaveDate = new Date(d.date);
    leaveDate.setDate(leaveDate.getDate() + d.nights);
    tripData.tripData[iInt].leaveDate = leaveDate;
  }
  
  const allPlacesData = tripData.tripData.concat(tripData.diversions).sort((a, b) => {
    return a.date - b.date + (b.placeType === 'campground' ? 1 : 0) - (a.placeType === 'campground' ? 1 : 0)
  });
  let tdInd = 0;
  let dvInd = 0;
  for (const apd in allPlacesData) {
    if (allPlacesData[apd].placeType === 'campground') {
      tripData.tripData[tdInd].allPlacesInd = parseInt(apd);
      tdInd += 1;
    } else {
      tripData.diversions[dvInd].allPlacesInd = parseInt(apd);
      dvInd += 1;
    }
  }
  tripData.allPlacesData = allPlacesData;
  return tripData
};

const tData = getTripData();
const tripData = readable(tData.tripData);
const diversionData = readable(tData.diversions);
const pointOfInterestData = readable(tData.pointsOfInterest);
const allPlacesData = readable(tData.allPlacesData);

const getDateData = (d) => {
  let currentInd = -1;
  const dt = new Date(d);
  for (const td of get(tripData)) {
    if (td.date < dt) {
      currentInd += 1;
    }
  }
  let retData = [];
  if (
    currentInd > 0 &&
    get(tripData)[currentInd].date.toDateString() == dt.toDateString()
  ) {
    retData = [get(tripData)[currentInd - 1], get(tripData)[currentInd]];
  } else {
    retData = [get(tripData)[currentInd]];
  }
  retData = retData.filter(rd => {
    const ld = rd.leaveDate;
    return (dt.getTime() - 86400000) < ld.getTime()
  })
  return retData
};

const tripWeatherData = writable([]);
const hourlyWeatherData = writable([]);

const getWeatherData = async () => {
  const today = dayjs(new Date());
  let loopDay = dayjs(new Date());

  let allDateWeatherInfo = [];
  let allHourlyWeatherInfo = [];

  const getWeatherData = async (lat, lng, dt) => {
    dt = new Date(dt);
    let nowData = [];
    let nowHourlyData = [];
    const latLngDtData = async (lat, lng, dt) => {
      const response = await fetch(
        `https://api.weather.gov/points/${lat},${lng}`
      );
      const myJson = await response.json();
      if (myJson.properties === undefined) {
        return [[], []];
      }
      const hourlyResponse = await fetch(myJson.properties.forecastHourly);
      const hourlyJson = await hourlyResponse.json();
      const periods = (hourlyJson.properties || {periods: []}).periods;
      nowHourlyData = periods;
      if (dt.toDateString() == new Date(today).toDateString()) {
        periods[0].name = "Now";
        nowData = [periods[0]];
      }
      const forecastResponse = await fetch(myJson.properties.forecast);
      const forecastJson = await forecastResponse.json();
      const fcstPeriods = forecastJson.properties.periods;
      const filtered = fcstPeriods.filter(
        (p) => new Date(p.startTime).toDateString() == dt.toDateString()
      );
      nowData = nowData.concat(filtered);
      return [nowData, nowHourlyData];
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
          return [[undefined], [undefined]];
        }
      }
    }
  };

  let lastHourlyInd = -1;
  while (loopDay < today.add(7, "day")) {
    const allDateInfo = getDateData(loopDay);
    for (const dateInfo of allDateInfo) {
      dateInfo.actualDay = loopDay;
      let [newWeatherData, newHourlyWeatherData] = await getWeatherData(
        dateInfo.lat,
        dateInfo.lng,
        loopDay
      );
      newWeatherData = newWeatherData.map((wd) => {
        wd.travelData = dateInfo;
        return wd;
      });
      allDateWeatherInfo = allDateWeatherInfo.concat(newWeatherData);
      const hourlyInd = (dateInfo || {dataInd: lastHourlyInd}).dataInd;
      if (lastHourlyInd !== hourlyInd) {
        lastHourlyInd = dateInfo.dataInd;
        newHourlyWeatherData = newHourlyWeatherData.filter((wd) => {
          return dayjs(wd.startTime) < dayjs(dateInfo.date).add(dateInfo.nights, 'day').add(12, 'hour')
        }).filter((wd) => {
          return dayjs(wd.startTime) >= dayjs(dateInfo.date).add(12, 'hour')
        })
        newHourlyWeatherData = newHourlyWeatherData.map((wd) => {
          wd.travelData = dateInfo;
          return wd;
        });
        allHourlyWeatherInfo = allHourlyWeatherInfo.concat(newHourlyWeatherData);
      }
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

getWeatherData();

export { tripData, diversionData, pointOfInterestData, getDateData, tripWeatherData, hourlyWeatherData, allPlacesData };
