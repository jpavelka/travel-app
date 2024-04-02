<script>
  import { tripWeatherData, hourlyWeatherData } from "$lib/getTripData";
  import WeatherWarning from "../lib/WeatherWarning.svelte";
  import WeatherLine from "./WeatherLine.svelte";
  $: wait = true;
  setTimeout(() => {
    wait = false;
  }, 5000);
  $: showHourly = (localStorage.getItem("forecastType") || "hourly") === "hourly";
  $: dispWeatherData = showHourly ? $hourlyWeatherData.slice(0, 24) : $tripWeatherData;
</script>

{#if dispWeatherData.length === 0}
  {wait
    ? "Loading weather data..."
    : "Data load taking longer than usual, you may want to refresh the page."}
{:else}
  <WeatherWarning />
  <a style="color:blue;cursor:pointer" on:click={() => {
    showHourly = !showHourly;
    localStorage.setItem('forecastType', showHourly ? 'hourly' : 'daily');
  }}>Switch to {showHourly ? 'daily' : 'hourly'}</a>
  {#each dispWeatherData as weatherData}
    <WeatherLine {weatherData} {showHourly} />
  {/each}
{/if}
