<script lang="ts">
  import { onMount } from "svelte";
  
  // 61.7 average female.  64 average male. https://en.wikipedia.org/wiki/Pupillary_distance
  let ipd = 62;

  let bce_rest_api_message = "";
  let current_image_url = "";
  
  const apiURL = "http://64.23.144.229:8000";
  const apiHeaders = {
    "Access-Control-Allow-Origin": "*"

  }
  
  async function rest_api__root() {
    const response = await fetch(apiURL + "/");
    const response_json = await response.json();
    bce_rest_api_message = response_json.message
    return response_json;
  }
  
  async function rest_api__generate() {
    const response = await fetch(apiURL + "/generate");
    const response_json = await response.json();
    bce_rest_api_message = response_json.message
    current_image_url = bce_rest_api_message.image_url
    return response_json;
  }
  
  onMount(async function() {
    await rest_api__root()
  });

  async function onclickGenerate() {
    await rest_api__generate()
  }
</script>

<p>The BCE website is an example web-based client application that accesses the BCE REST API.</p>
<p>See the <a href="/docs">developer documentation on this server</a> for a developer reference.</p>
<p>See the <a href="http://64.23.144.229:8000/docs">BCE REST API OpenAPI documentation</a>.</p>

<table>
  <tr>
    <td>
      Interpupilary Distance:
      <input type="range" bind:value="{ipd}" min="50" max="80" style="width: 150px;" />
      <input type="number" bind:value="{ipd}" min="50" max="80" style="width: 50px;" />
      <input type="text" value="{ipd} mm" style="width: 50px;" disabled />
    </td>
  </tr>
  <tr>
    <td>
      <button on:click={onclickGenerate}>Generate!</button>
    </td>
  </tr>
  <tr>
    <td>
      <img src="{current_image_url}" style="width: 150px;" />
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>
      BCE REST API message
    </td>
  </tr>
  <tr>
    <td>
      {bce_rest_api_message}
    </td>
  </tr>
</table>

