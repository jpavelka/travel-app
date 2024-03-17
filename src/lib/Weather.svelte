<script>
  import { tripWeatherData } from "$lib/getTripData";
  import WeatherLine from "./WeatherLine.svelte";
  $: wait = true;
  setTimeout(() => {
    wait = false;
  }, 2000);
</script>

{#if $tripWeatherData.length === 0}
  {wait
    ? "Loading weather data..."
    : "There was an issue loading weather data, please reload the page."}
{:else}
  {#each $tripWeatherData as weatherData}
    <WeatherLine {weatherData} />
  {/each}
{/if}
