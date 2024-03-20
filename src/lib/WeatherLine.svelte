<script>
  import dayjs from "dayjs";
  export let weatherData;
  const dayTime =
    weatherData.name === "Now"
      ? "Now"
      : weatherData.name === "Overnight"
        ? "Overnight"
        : dayjs(weatherData.startTime).format("ddd M/D") +
          ` (${weatherData.isDaytime ? "day" : "night"})`;
  const icons = {
    sunny: "https://img.icons8.com/?size=48&id=15352&format=png",
    cloudy: "https://img.icons8.com/?size=48&id=11871&format=png",
    partlyCloudy: "https://img.icons8.com/?size=48&id=15359&format=png",
    rain: "https://img.icons8.com/?size=48&id=18598&format=png",
    storm: "https://img.icons8.com/?size=48&id=tlNPUEnNhUe1&format=png",
    snow: "https://img.icons8.com/?size=48&id=15356&format=png",
    clearNight: "https://img.icons8.com/?size=48&id=13477&format=png",
    wind: "https://img.icons8.com/?size=48&id=pLiaaoa41R9n&format=png",
  };
  let iconSrc = weatherData.isDaytime ? icons.sunny : icons.clearNight;
  const shortFcst = weatherData.shortForecast;
  if (shortFcst.toLowerCase().includes("cloudy")) {
    if (weatherData.isDaytime && shortFcst.toLowerCase().includes("partly")) {
      iconSrc = icons.partlyCloudy;
    } else {
      iconSrc = icons.cloudy;
    }
  }
  const precipChance = weatherData.probabilityOfPrecipitation.value || 1;
  if (precipChance > 50) {
    iconSrc = icons.rain;
  }
  $: innerWidth = 0;
  const smallWidth = 700;
  $: showDtlFcst = false;
  const lineClickFunc = () => {
    showDtlFcst = !showDtlFcst;
  };
</script>

<svelte:window bind:innerWidth />
{#if weatherData.isNewLocation}
  <div class="loc">
    {weatherData.travelData.campground}
    <span style="font-size: 1.3rem">({weatherData.travelData.city})</span>
  </div>
{/if}
<div class="dayWeatherLine">
  <a role="div" class="weatherLine1" on:click={lineClickFunc}>
    <div
      style="flex-shrink: {innerWidth <= smallWidth ? 1 : 0}"
      class="dayTime"
    >
      {dayTime}
    </div>
    <img
      style="flex-shrink: {innerWidth <= smallWidth ? 1 : 0}"
      class="weatherIcon"
      src={iconSrc}
      alt="iconSrc"
    />
    <div class="vertLine"></div>
    <div style="flex-shrink: {innerWidth <= smallWidth ? 1 : 0}" class="temp">
      {weatherData.temperature}&deg;
    </div>
    <div class="vertLine"></div>
    <div style="flex-shrink: {innerWidth <= smallWidth ? 1 : 0}" class="precip">
      <img src={icons.rain} alt={"precip"} />
      {precipChance}%
    </div>
    <div class="vertLine"></div>
    <div style="flex-shrink: {innerWidth <= smallWidth ? 1 : 0}" class="wind">
      <img src={icons.wind} alt="wind" />
      {weatherData.windDirection}
      {weatherData.windSpeed.replace(" to ", "-")}
    </div>
    {#if innerWidth >= smallWidth}
      <div class="vertLine"></div>
      <div class="fcst">{shortFcst}</div>
    {/if}
  </a>
  <div class="dtlFcst" style={`display: ${showDtlFcst ? "block" : "none"}`}>
    {weatherData.detailedForecast !== "" ? weatherData.detailedForecast : shortFcst}
  </div>
</div>

<style>
  .loc {
    font-weight: bold;
    font-size: 1.5rem;
    margin-top: 0.5rem;
  }
  .vertLine {
    height: 100%;
    width: calc(var(--innerWidth) / 10);
    border-left: 1pt solid gray;
  }
  .dayWeatherLine {
    border: 1pt solid gray;
    padding: 3pt;
  }
  .weatherLine1 {
    display: flex;
    align-items: center;
    height: 50px;
  }
  .dayTime {
    width: 120px;
    font-size: 1.1rem;
    text-align: center;
  }
  .weatherIcon {
    height: 50px;
    width: 50px;
    padding: 0 4pt 0 0;
  }
  .temp {
    font-size: 1.5rem;
    width: 60px;
    text-align: center;
  }
  .precip {
    width: 70px;
    font-size: 1.2rem;
    padding: 0 4pt;
  }
  .precip > img {
    height: 20pt;
    width: 20pt;
  }
  .wind {
    font-size: 1.2rem;
    width: 100pt;
    padding: 0 4pt;
  }
  .wind > img {
    height: 20pt;
    width: 20pt;
  }
  .fcst {
    font-size: 1.1rem;
    padding: 0 5pt;
    overflow: hidden;
  }
  .dtlFcst {
    display: none;
    padding: 4pt;
    padding-left: 10pt;
    font-size: 1.1rem;
    border-top: 1pt solid #ddd;
    margin-top: 4pt;
  }
</style>
