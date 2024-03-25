<script>
  import { onMount } from "svelte";
  
  // 61.7 average female.  64 average male. https://en.wikipedia.org/wiki/Pupillary_distance
  let ipd = 62;

  let hello_response = "none";

  const apiURL = "http://64.23.144.229:8000/";
  onMount(async function() {
    const response = await fetch(apiURL);
    hello_response = await response.json();
  });
  
</script>

<h1>BCE</h1>
<p>The BCE website is an example web-based client application that accesses the BCE REST API.</p>
<p>See the <a href="/docs">developer documentation on this server</a> for a developer reference.</p>
<p>See the <a href="http://64.23.144.229:8000/docs">BCE REST API OpenAPI documentation</a>.</p>

<p>
  Interpupilary Distance:
  <input type="range" bind:value="{ipd}" min="50" max="80" style="width: 150px;" />
  <input type="number" bind:value="{ipd}" min="50" max="80" style="width: 50px;" />
  <input type="text" value="{ipd} mm" style="width: 50px;" disabled />
</p>

<table>
  <tr>
    <td>
      BCE REST API message
    </td>
  </tr>
  <tr>
    <td>
      {hello_response.message}
    </td>
  </tr>
</table>
  
