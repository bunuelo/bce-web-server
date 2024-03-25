<script>
  let ipd = 1;
</script>

<h1>BCE</h1>
<p>The BCE website is an example web-based client application that accesses the BCE REST API.</p>
<p>See the <a href="/docs">developer documentation on this server</a> for a developer reference.</p>
<p>See the <a href="http://64.23.144.229:8000/docs">BCE REST API OpenAPI documentation</a>.</p>

<p>
  Interpupilary Distance in mm:
  <input type="range" bind:value="{ipd}" min="50" max="80" />
  <input type="number" bind:value="{ipd}" min="50" max="80" />
  <input type="text" bind:value="{ipd} mm" disabled />
</p>
