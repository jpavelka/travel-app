<script>
  import { tripWeatherData } from "$lib/getTripData";
  import WeatherWarning from "../lib/WeatherWarning.svelte";
  import WeatherLine from "./WeatherLine.svelte";
  $: wait = true;
  setTimeout(() => {
    wait = false;
  }, 5000);
</script>

{#if $tripWeatherData.length === 0}
  {wait
    ? "Loading weather data..."
    : "Data load taking longer than usual, you may want to refresh the page."}
{:else}
  <WeatherWarning />
  {#each $tripWeatherData as weatherData}
    <WeatherLine {weatherData} />
  {/each}
{/if}
