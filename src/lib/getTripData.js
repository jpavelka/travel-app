import { readable, writable, get } from "svelte/store";
import dayjs from "dayjs";

const getTripData = () => {
  const tripDataRaw = `
"Sunday, March 10, 2024"	Driving	211	Panhandle Lodging RV Park	"Canyon, TX"	3466	3	1	50A	Yes	Yes	Yes	34.9649238	-101.8832092	
"Wednesday, March 13, 2024"	Driving	214	Bottomless Lakes SP	"Roswell, NM"	3602	3	28	50A	No	No	Yes	33.3164453	-104.3308359	Bottomless Lakes Park Campground
"Saturday, March 16, 2024"	Driving	66	Brantley Lake SP	"Carlsbad, NM"	3313	3	24	50A	No	No	Yes	32.5640317	-104.3806931	limestone campground
"Tuesday, March 19, 2024"	Driving	221	Rio Grande Winery	"Las Cruces, NM"	3500	1	n/a	No	No	No	No	32.236348	-106.7590752	
"Wednesday, March 20, 2024"	Driving	10	Las Cruces KOA Journey	"Las Cruces, NM"	3500	1	52	50A	Yes	Yes	Yes	32.2924695	-106.8596845	
"Thursday, March 21, 2024"	Driving	197	Cattlerest Saloon	"Willcox, AZ"	4179	1	2	50A	DS	No	No	32.2365566	-109.8505589	
"Friday, March 22, 2024"	Driving	3	Grand Vista RV Park	"Willcox, AZ"	5397	2	TBD	50A	Yes	Yes	Yes	32.2620407	-109.8338428	
"Sunday, March 24, 2024"	Driving	85	Kartchner Caverns SP	"Benson, AZ"	4559	3	KTC-55	50A	No	Yes	Yes	31.836596	-110.3488848	
"Wednesday, March 27, 2024"	Driving	54	Catalina SP	"Tucson, AZ"	2654	9	CLT-B-25	50A	No	Yes	Yes	32.4265434	-110.9253819	catalina state park campground b
"Friday, April 05, 2024"	Driving	245	Pilot Knob RV Resort	"Winterhaven, CA"	272	2	TBD	50A	Yes	Yes	Yes	32.747145	-114.7636939	Encore
"Sunday, April 07, 2024"	Driving	141	1000 Trails Palm Springs	"Palm Desert, CA"	119	7	TBD	50A	Yes	Yes	Yes	33.7634686	-116.3109684	
"Sunday, April 14, 2024"	Driving	180	North Ranch RV Park	"Congress, AZ"	2801	2	TBD	50A	Yes	Yes	Yes	34.104932	-112.8309524	
"Tuesday, April 16, 2024"	Driving	93	Dead Horse Ranch SP	"Cottonwood, AZ"	3320	3	DHR-87	50A	No	Yes	Yes	34.7537237	-112.0215606	
"Friday, April 19, 2024"	Drivnig	129	Homolovi State Park	"Winslow, AZ"	4888	3	HLR-20	50A	No	No	Yes	35.0464771	-110.6527338	
"Monday, April 22, 2024"	Driving	148	Grand Canyon Trailer Village	"Grand Canyon, AZ"	7021	3	TBD	50A	Yes	Yes	Yes	36.0528892	-112.1150912	
"Thursday, April 25, 2024"	Driving	57	Navajo Land Hotel	"Tuba City, AZ"	4941	2	TBD	50A	Yes	No	No	36.1306034	-111.2420668	NavajoLand Tuba City R.V. Park
"Saturday, April 27, 2024"	Driving	82	Waheap RV Park Lower CG	"Page, AZ"	3732	3	TBD	50A	Yes	Yes	Yes	36.997326	-111.4990853	
"Tuesday, April 30, 2024"	Driving	151	Zion Canyon CG	"Springdale, UT"	3921	7	E36	50A	Yes	Yes	Yes	37.1929646	-112.9912374	
"Tuesday, May 07, 2024"	Driving	118	Dixie Forest RV Resort	"Panguitch, UT"	6633	7	38D	50A	Yes	Yes	Yes	37.8146135	-112.4346644	
"Tuesday, May 14, 2024"	Driving	256	Moab KOA	"Moab, UT"	4607	7	TBD	50A	Yes	Yes	Yes	38.523874	-109.4963551	
"Tuesday, May 21, 2024"	Driving	223	Vernal KOA	"Vernal, UT"	5318	3	TBD	50A	Yes	Yes	Yes	40.4694307	-109.5285888	
"Friday, May 24, 2024"	Driving	311	Gros Ventre CG	Grand Teton NP	6568	7	99	No	No	No	No	43.6159427	-110.6658657	gros ventre campground
"Friday, May 31, 2024"	Driving	98	Fishing Bridge RV	Yellowstone NP	7770	14	TBD	50A	Yes	Yes	Yes	44.5657137	-110.3660453	
"Friday, June 14, 2024"	Driving	162	Bridger Brewing	"Three Forks, MT"	4075	1	n/a	No	No	No	No	45.9202897	-111.5901746	
"Saturday, June 15, 2024"	Driving	239	Lewis & Clark RV Park	"Shelby, MT"	3314	1	TBD	50A	Yes	Yes	Yes	48.5240978	-111.8591962	
"Sunday, June 16, 2024"	Driving	195	George Lane Memorial Park	"High River, AB"	3402	2	TBD	30A	No	No	Yes	50.5784315	-113.8751605	
"Tuesday, June 18, 2024"	Driving	115	Tunnel Mountain Trailer Court	"Banff, AB"	4717	10	343/236/143	50A	Yes	???	Yes	51.190485	-115.5344935	
"Friday, June 28, 2024"	Driving	41	Lake Louise Tent Trailer CG	"Lake Louise, AB"	5118	4	132	30A	No	No	Yes	51.4176144	-116.1734193	soft sided
"Tuesday, July 02, 2024"	Driving	144	Whistler's Campground	"Jasper, AB"	3461	4	51O/51N/51D	50A	Yes	No	Yes	52.8504957	-118.0774499	
"Saturday, July 06, 2024"	Driving	257	Hawk Tail Brewery	"Rimbey, AB"	3051	1	n/a	No	No	No	No	52.6522102	-114.2424545	
"Sunday, July 07, 2024"	Driving	255	Lethbridge KOA	"Lethbridge, AB"	2715	1	TBD	50A	Yes	Yes	Yes	49.711501	-112.872927	
"Monday, July 08, 2024"	Driving	191	Big Sky Deli and Bakery	"Vaughn, MT"	3500	1	n/a	No	No	No	No	47.5536727	-111.5612945	
"Tuesday, July 09, 2024"	Driving	287	7th Ranch RV Camp	"Garryowen, MT"	3198	1	TBD	50A	Yes	No	No	45.4919436	-107.3776587	
"Wednesday, July 10, 2024"	Driving	215	Cedar Ridge RV Park	"Pine Haven, WY"	4242	2	TBD	50A	Yes	Yes	Yes	44.3578215	-104.8174857	
"Friday, July 12, 2024"	Driving	103	Buffalo Ridge Camp Resort	"Custer, SD"	5312	8	TBD	50A	Yes	Yes	Yes	43.7584652	-103.6128112	
"Saturday, July 20, 2024"	Driving	178	Papa Moon Winery & Cider House	"Scottsbluff, NE"	3888	1	n/a	Yes	No	No	No	41.8877158	-103.6176699
  `.split('\n').filter(s => s.trim() !== '')
  const tripDataHeaders = [
    "date",
    "activity",
    "miles",
    "campground",
    "city",
    "elevation",
    "nights",
    "site",
    "electric",
    "sewer",
    "laundry",
    "showers",
    "lat",
    "lng",
    "mapSearchExtra",
  ];
  return tripDataRaw.map((s, i) => {
    const arr = s.split("\t");
    let obj = Object({ dataInd: i });
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
    return obj;
  });
};

const tripData = readable(getTripData());

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
    try {
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
    } catch {
      return [];
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

export { tripData, getDateData, tripWeatherData };
