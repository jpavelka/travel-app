<script>
  export let images;
  let imagesByLoc
  $: {
    imagesByLoc = [];
    for (const img of images) {
      if (imagesByLoc.length === 0 || img.locDesc !== imagesByLoc[imagesByLoc.length - 1].loc) {
        imagesByLoc.push({
          loc: img.locDesc,
          images: []
        })
      }
      imagesByLoc[imagesByLoc.length - 1].images.push(img)
    }
  }
</script>

<div class=container>
  {#each imagesByLoc as loc}
    <div class=loc>{loc.loc}</div>
    {#each loc.images as img}
      <div class=locImgContainer>
        <img style='max-height:350px;max-width:100%' src={img.src} />
        <div class=caption>{img.caption}</div>
      </div>
      {/each}
  {/each}
</div>

<style>
  .container {
    margin-bottom: 1rem;
  }
  .loc {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  .locImgContainer {
    margin-left: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 1.2rem;
  }
  .caption {
    margin-left: 0.25rem;
  }
</style>