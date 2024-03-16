<script>
  import dayjs from "dayjs";
  import { getDateData } from "$lib/getTripData";

  const getAllWeatherData = async () => {

    const today = dayjs(new Date());
    let loopDay = dayjs(new Date());

    let allDateInfo = [];

    const getWeatherData = async (lat, lng, dt) => {
      dt = new Date(dt);
      const response = await fetch(`https://api.weather.gov/points/${lat},${lng}`);
      const myJson = await response.json();
      const forecastResponse = await fetch(myJson.properties.forecast);
      const forecastJson = await forecastResponse.json();
      const periods = forecastJson.properties.periods;
      const filtered = periods.filter(p => new Date(p.startTime).toDateString() == dt.toDateString());
      return filtered
    }

    while (loopDay < today.add(7, "day")) {
      const dateInfo = getDateData(loopDay);
      dateInfo.actualDay = loopDay;
      let newWeatherData = await getWeatherData(dateInfo.lat, dateInfo.lng, loopDay);
      newWeatherData = newWeatherData.map(wd => {
        wd.travelData = dateInfo;
        return wd
      })
      allDateInfo = allDateInfo.concat(newWeatherData);
      loopDay = loopDay.add(1, "day");
    }
    return allDateInfo
}
</script>

{#await getAllWeatherData()}
  <p>loading</p>
{:then allWeatherData}
  {#each allWeatherData as weatherData}
    <div style='margin-top: 5pt; margin-bottom: 5pt'>{`${weatherData.name} (${weatherData.travelData.campground}): ${weatherData.detailedForecast}`}</div>
  {/each}
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
