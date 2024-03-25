<script>
  // 61.7 average female.  64 average male. https://en.wikipedia.org/wiki/Pupillary_distance
  let ipd = 62;
</script>

<h1>BCE</h1>
<p>The BCE website is an example web-based client application that accesses the BCE REST API.</p>
<p>See the <a href="/docs">developer documentation on this server</a> for a developer reference.</p>
<p>See the <a href="http://64.23.144.229:8000/docs">BCE REST API OpenAPI documentation</a>.</p>

<p>
  Interpupilary Distance:
  <input type="range" bind:value="{ipd}" min="50" max="80" width="50px"/>
  <input type="number" bind:value="{ipd}" min="50" max="80" width="50px" />
  <input type="text" value="{ipd} mm" width="50px" disabled />
</p>
