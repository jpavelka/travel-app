import { readable, writable, get } from "svelte/store";
import dayjs from "dayjs";

const getTripData = () => {
  const tripDataRaw = [
    "Sunday, March 10, 2024	Driving	211	Panhandle Lodging RV Park	Canyon, TX	3466	3	1	50A	Yes	Yes	Yes\t34.9799445\t-101.8827267",
    "Wednesday, March 13, 2024	Driving	214	Bottomless Lakes SP	Roswell, NM	3602	3	28	50A	No	No	Yes\t33.3321276\t-104.35128",
    "Saturday, March 16, 2024	Driving	66	Brantley Lake SP	Carlsbad, NM	3313	3	24	30A	No	No	Yes\t32.5789248\t-104.3974824",
    "Tuesday, March 19, 2024	Driving	221	Rio Grande Winery	Las Cruces, NM	3500	1	n/a	No	No	No	No\t32.2356231\t-106.7615582",
    "Wednesday, March 20, 2024	Driving	10	Las Cruces KOA Journey	Las Cruces, NM	3500	1	TBD	50A	Yes	Yes	Yes\t32.2924695\t-106.8596845",
    "Thursday, March 21, 2024	Driving	197	Cattlerest Saloon	Wilcox, AZ	4179	1	n/a	50A	DS	No	No\t32.2365611\t-109.8531338",
    "Friday, March 22, 2024	Driving	39	Grand Vista RV Park	Wilcox, AZ	5397	2	TBD	50A	Yes	Yes	Yes\t32.2620452\t-109.8364177",
    "Sunday, March 24, 2024	Driving	85	Kartchner Caverns SP	Benson, AZ	4559	3	KTC-55	50A	No	Yes	Yes\t31.8334381\t-110.3524898",
    "Wednesday, March 27, 2024	Driving	54	Catalina SP	Tuscon, AZ	2654	9	CLT-B-25	50A	No	Yes	Yes\t32.4259029\t-110.9243749",
    "Friday, April 05, 2024	Driving	245	Pilot Knob RV Resort	Winterhaven, CA	272	2	TBD	50A	Yes	Yes	Yes\t32.7470616\t-114.7640884",
    "Sunday, April 07, 2024	Driving	141	1000 Trails Palm Springs	Palm Desert, CA	119	7	TBD	50A	Yes	Yes	Yes\t33.763473\t-116.3135433",
    "Sunday, April 14, 2024	Driving	180	North Ranch RV Park	Congress, AZ	2801	2	TBD	50A	Yes	Yes	Yes\t34.1049364\t-112.8335273",
    "Tuesday, April 16, 2024	Driving	93	Dead Horse Ranch SP	Cottonwood, AZ	3320	3	DHR-87	50A	No	Yes	Yes\t34.7553238\t-112.0205606",
    "Friday, April 19, 2024	Drivnig	129	Homolovi State Park	Winslow, AZ	4888	3	HLR-20	50A	No	No	Yes\t35.0317106\t-110.6553066",
    "Monday, April 22, 2024	Driving	148	Grand Canyon Trailer Village	Grand Canyon, AZ	7021	3	TBD	50A	Yes	Yes	Yes\t36.0529723\t-112.1248903",
    "Thursday, April 25, 2024	Driving	57	Navajo Land Hotel	Tuba City, AZ	4941	2	TBD	50A	Yes	No	No\t36.1308734\t-111.242468",
    "Saturday, April 27, 2024	Driving	82	Waheap RV Park Lower CG	Page, AZ	3732	3	TBD	50A	Yes	Yes	Yes\t36.9973303\t-111.5016602",
    "Tuesday, May 07, 2024	Driving	118	Dixie Forest RV Resort	Panguitch, UT	6633	7	38D	50A	Yes	Yes	Yes\t37.8146177\t-112.4372393",
    "Tuesday, May 14, 2024	Driving	256	Moab KOA	Moab, UT	4607	7	TBD	50A	Yes	Yes	Yes\t38.5238782\t-109.49893",
    "Tuesday, May 21, 2024	Driving	223	Vernal KOA	Vernal, UT	5318	3	TBD	50A	Yes	Yes	Yes\t40.4694348\t-109.5311637",
    "Friday, May 24, 2024	Driving	311	Gros Ventre CG	Grand Teton NP	6568	7	99	No	No	No	No\t43.6159466\t-110.6684406",
    "Friday, May 31, 2024	Driving	98	Fishing Bridge RV	Yellowstone NP	7770	14	TBD	50A	Yes	Yes	Yes\t44.5657175\t-110.3686202",
    "Friday, June 14, 2024	Driving	162	Bridger Brewing	Three Forks, MT	4075	1	n/a	No	No	No	No\t45.9202934\t-111.5927495",
    "Saturday, June 15, 2024	Driving	239	Lewis & Clark RV Park	Shelby, MT	3314	1	TBD	50A	Yes	Yes	Yes\t48.5241013\t-111.8617711",
    "Sunday, June 16, 2024	Driving	195	George Lane Memorial Park	High River, AB	3402	2	TBD	30A	No	No	Yes\t50.5784349\t-113.8777354",
    "Tuesday, June 18, 2024	Driving	115	Tunnel Mountain Trailer Court	Banff, AB	4717	10	343/236/143	50A	Yes	???	Yes\t51.1904883\t-115.5370684",
    "Friday, June 28, 2024	Driving	41	Lake Louise Tent Trailer CG	Lake Louise, AB	5118	4	132	30A	No	No	Yes\t51.4176161\t-116.22704",
    "Tuesday, July 02, 2024	Driving	144	Whistler's Campground	Jasper, AB	3461	4	51O/51N/51D	50A	Yes	No	Yes\t52.8504989\t-118.0800248",
    "Saturday, July 06, 2024	Driving	257	Hawk Tail Brewery	Rimbey, AB	3051	1	n/a	No	No	No	No\t52.6522134\t-114.2450294",
    "Sunday, July 07, 2024	Driving	255	Bridgeview RV Resort	Lethbridge, AB	2715	1	TBD	50A	Yes	Yes	Yes\t49.7114887\t-112.8765985",
    "Monday, July 08, 2024	Driving	191	Big Sky Deli and Bakery	Vaughn, MT	3500	1	n/a	No	No	No	No\t47.5536763\t-111.5638694",
    "Tuesday, July 09, 2024	Driving	287	7th Ranch RV Camp	Garryowen, MT	3198	1	TBD	50A	Yes	No	No\t45.4919473\t-107.3802336",
    "Wednesday, July 10, 2024	Driving	215	Keyhole SP	Moorcroft, WY	4146	2	TBD	50A	No	No	Yes\t44.3608972\t-104.7678565",
    "Friday, July 12, 2024	Driving	103	Buffalo Ridge Camp Resort	Custer, SD	5312	8	TBD	50A	Yes	Yes	Yes\t43.758469\t-103.6153861",
    "Saturday, July 20, 2024	Driving	178	Papa Moon Winery & Cider House	Scottsbluff, NE		1	n/a	Yes	No	No	No\t41.8877198\t-103.6202448",
  ];
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
  ];
  return tripDataRaw.map((s, i) => {
    const arr = s.split("\t");
    let obj = Object({ dataInd: i });
    for (const i in arr) {
      const hdr = tripDataHeaders[i];
      if (["miles", "elevation", "lat", "lng", "nights"].includes(hdr)) {
        obj[tripDataHeaders[i]] = parseFloat(arr[i]);
      } else if (hdr === "date") {
        obj[tripDataHeaders[i]] = new Date(arr[i]);
      } else {
        obj[tripDataHeaders[i]] = arr[i];
      }
    }
    return obj;
  });
};

const tripData = readable(getTripData());

const getDateData = (d) => {
  d = d || new Date(new Date().toDateString());
  let currentInd = -1;
  const today = new Date(d);
  for (const d of get(tripData)) {
    if (d.date < today) {
      currentInd += 1;
    }
  }
  return get(tripData)[currentInd];
};

const tripWeatherData = writable([]);

const getWeatherData = async () => {
  const today = dayjs(new Date());
  let loopDay = dayjs(new Date());

  let allDateInfo = [];

  const getWeatherData = async (lat, lng, dt) => {
    dt = new Date(dt);
    const response = await fetch(
      `https://api.weather.gov/points/${lat},${lng}`
    );
    const myJson = await response.json();
    const forecastResponse = await fetch(myJson.properties.forecast);
    const forecastJson = await forecastResponse.json();
    const periods = forecastJson.properties.periods;
    const filtered = periods.filter(
      (p) => new Date(p.startTime).toDateString() == dt.toDateString()
    );
    return filtered;
  };

  while (loopDay < today.add(7, "day")) {
    const dateInfo = getDateData(loopDay);
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
    allDateInfo = allDateInfo.concat(newWeatherData);
    loopDay = loopDay.add(1, "day");
  }
  for (let i in allDateInfo) {
    i = parseInt(i);
    allDateInfo[i].isNewLocation = false;
    if (
      i === 0 ||
      allDateInfo[i].travelData.campground !==
        allDateInfo[i - 1].travelData.campground
    ) {
      allDateInfo[i].isNewLocation = true;
    }
  }
  tripWeatherData.set(allDateInfo);
};

getWeatherData();

export { tripData, getDateData, tripWeatherData };
