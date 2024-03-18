import { readable, writable, get } from "svelte/store";
import dayjs from "dayjs";

const getTripData = () => {
  const tripDataRaw = [
    "Sunday, March 10, 2024	Driving	211	Panhandle Lodging RV Park	Canyon, TX	3466	3	1	50A	Yes	Yes	Yes\t34.9649238\t-101.8832092",
    "Wednesday, March 13, 2024	Driving	214	Bottomless Lakes SP	Roswell, NM	3602	3	28	50A	No	No	Yes\t33.3164453\t-104.3308359\tBottomless Lakes Park Campground",
    "Saturday, March 16, 2024	Driving	66	Brantley Lake SP	Carlsbad, NM	3313	3	24	30A	No	No	Yes\t32.5640317\t-104.3806931\tlimestone campground",
    "Tuesday, March 19, 2024	Driving	221	Rio Grande Winery	Las Cruces, NM	3500	1	n/a	No	No	No	No\t32.236348\t-106.7590752",
    "Wednesday, March 20, 2024	Driving	10	Las Cruces KOA Journey	Las Cruces, NM	3500	1	TBD	50A	Yes	Yes	Yes\t32.2924695\t-106.8596845",
    "Thursday, March 21, 2024	Driving	197	Cattlerest Saloon	Wilcox, AZ	4179	1	n/a	50A	DS	No	No\t32.2365566\t-109.8505589",
    "Friday, March 22, 2024	Driving	39	Grand Vista RV Park	Wilcox, AZ	5397	2	TBD	50A	Yes	Yes	Yes\t32.2620407\t-109.8338428",
    "Sunday, March 24, 2024	Driving	85	Kartchner Caverns SP	Benson, AZ	4559	3	KTC-55	50A	No	Yes	Yes\t31.836596\t-110.3488848",
    "Wednesday, March 27, 2024	Driving	54	Catalina SP	Tuscon, AZ	2654	9	CLT-B-25	50A	No	Yes	Yes\t32.4265434\t-110.9253819\tcatalina state park campground b",
    "Friday, April 05, 2024	Driving	245	Pilot Knob RV Resort	Winterhaven, CA	272	2	TBD	50A	Yes	Yes	Yes\t32.747145\t-114.7636939\tEncore",
    "Sunday, April 07, 2024	Driving	141	1000 Trails Palm Springs	Palm Desert, CA	119	7	TBD	50A	Yes	Yes	Yes\t33.7634686\t-116.3109684",
    "Sunday, April 14, 2024	Driving	180	North Ranch RV Park	Congress, AZ	2801	2	TBD	50A	Yes	Yes	Yes\t34.104932\t-112.8309524",
    "Tuesday, April 16, 2024	Driving	93	Dead Horse Ranch SP	Cottonwood, AZ	3320	3	DHR-87	50A	No	Yes	Yes\t34.7537237\t-112.0215606",
    "Friday, April 19, 2024	Driving	129	Homolovi State Park	Winslow, AZ	4888	3	HLR-20	50A	No	No	Yes\t35.0464771\t-110.6527338",
    "Monday, April 22, 2024	Driving	148	Grand Canyon Trailer Village	Grand Canyon, AZ	7021	3	TBD	50A	Yes	Yes	Yes\t36.0528892\t-112.1150912",
    "Thursday, April 25, 2024	Driving	57	Navajo Land Hotel	Tuba City, AZ	4941	2	TBD	50A	Yes	No	No\t36.1306034\t-111.2420668\tNavajoLand Tuba City R.V. Park",
    "Saturday, April 27, 2024	Driving	82	Waheap RV Park Lower CG	Page, AZ	3732	3	TBD	50A	Yes	Yes	Yes\t36.997326\t-111.4990853",
    "Tuesday, May 07, 2024	Driving	118	Dixie Forest RV Resort	Panguitch, UT	6633	7	38D	50A	Yes	Yes	Yes\t37.8146135\t-112.4346644",
    "Tuesday, May 14, 2024	Driving	256	Moab KOA	Moab, UT	4607	7	TBD	50A	Yes	Yes	Yes\t38.523874\t-109.4963551",
    "Tuesday, May 21, 2024	Driving	223	Vernal KOA	Vernal, UT	5318	3	TBD	50A	Yes	Yes	Yes\t40.4694307\t-109.5285888",
    "Friday, May 24, 2024	Driving	311	Gros Ventre CG	Grand Teton NP	6568	7	99	No	No	No	No\t43.6159427\t-110.6658657\tgros ventre campground",
    "Friday, May 31, 2024	Driving	98	Fishing Bridge RV	Yellowstone NP	7770	14	TBD	50A	Yes	Yes	Yes\t44.5657137\t-110.3660453",
    "Friday, June 14, 2024	Driving	162	Bridger Brewing	Three Forks, MT	4075	1	n/a	No	No	No	No\t45.9202897\t-111.5901746",
    "Saturday, June 15, 2024	Driving	239	Lewis & Clark RV Park	Shelby, MT	3314	1	TBD	50A	Yes	Yes	Yes\t48.5240978\t-111.8591962",
    "Sunday, June 16, 2024	Driving	195	George Lane Memorial Park	High River, AB	3402	2	TBD	30A	No	No	Yes\t50.5784315\t-113.8751605",
    "Tuesday, June 18, 2024	Driving	115	Tunnel Mountain Trailer Court	Banff, AB	4717	10	343/236/143	50A	Yes	???	Yes\t51.190485\t-115.5344935",
    "Friday, June 28, 2024	Driving	41	Lake Louise Tent Trailer CG	Lake Louise, AB	5118	4	132	30A	No	No	Yes\t51.4176144\t-116.1734193\tsoft sided",
    "Tuesday, July 02, 2024	Driving	144	Whistler's Campground	Jasper, AB	3461	4	51O/51N/51D	50A	Yes	No	Yes\t52.8504957\t-118.0774499",
    "Saturday, July 06, 2024	Driving	257	Hawk Tail Brewery	Rimbey, AB	3051	1	n/a	No	No	No	No\t52.6522102\t-114.2424545",
    "Sunday, July 07, 2024	Driving	255	Lethbridge KOA	Lethbridge, AB	2715	1	TBD	50A	Yes	Yes	Yes\t49.711501\t-112.872927",
    "Monday, July 08, 2024	Driving	191	Big Sky Deli and Bakery	Vaughn, MT	3500	1	n/a	No	No	No	No\t47.5536727\t-111.5612945",
    "Tuesday, July 09, 2024	Driving	287	7th Ranch RV Camp	Garryowen, MT	3198	1	TBD	50A	Yes	No	No\t45.4919436\t-107.3776587",
    "Wednesday, July 10, 2024	Driving	215	Keyhole SP	Moorcroft, WY	4146	2	TBD	50A	No	No	Yes\t44.3644617\t-104.7657105\tTatanka Campground",
    "Friday, July 12, 2024	Driving	103	Buffalo Ridge Camp Resort	Custer, SD	5312	8	TBD	50A	Yes	Yes	Yes\t43.7584652\t-103.6128112",
    "Saturday, July 20, 2024	Driving	178	Papa Moon Winery & Cider House	Scottsbluff, NE		1	n/a	Yes	No	No	No\t41.8877158\t-103.6176699",
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
    "mapSearchExtra",
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
