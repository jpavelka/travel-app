<script>
  import { tripWeatherData } from "$lib/getTripData";
  import WeatherLine from "./WeatherLine.svelte";
</script>

{#each $tripWeatherData as weatherData}
  <WeatherLine {weatherData} />
{/each}
