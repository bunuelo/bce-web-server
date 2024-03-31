<script lang="ts">
  import { onMount } from "svelte";
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
  import {
    BoxGeometry,
    DirectionalLight,
    HemisphereLight,
    //Mesh,
    //MeshStandardMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
  } from 'three';

  export let model_url = "";
  
  let outerWidth = 1024
  let innerWidth = 1024
  let outerHeight = 768
  let innerHeight = 768
  
  const scene = new Scene();

  const camera = new PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
  const camera_distance = 5;
  camera.rotation.x = -0.125 * Math.PI;
  camera.position.z =  camera_distance * Math.cos(camera.rotation.x);
  camera.position.y = -camera_distance * Math.sin(camera.rotation.x);
  
  const directionalLight = new DirectionalLight(0x9090aa);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);
  
  let renderer:WebGLRenderer;
  
  var model = null;
  var camera_angle = 0;
  
  const animate = () => {
    requestAnimationFrame(animate);
    camera_angle = (1.0 / 60) * 2 * Math.PI * (0.001 * Date.now());
    if (model != null) {
      model.rotation.y = camera_angle;
    }
    renderer.render(scene, camera);
  };

  const resize = () => {
    renderer.setSize(get_model_width(), get_model_height());
    camera.aspect = get_model_width() / get_model_height();
    camera.updateProjectionMatrix();
  };
  
  const createScene = (el:HTMLCanvasElement) => {
    renderer = new WebGLRenderer({ antialias: true, canvas: el });
    resize();
    animate();
  };
  
  const gltf_loader = new GLTFLoader();
  
  let three_canvas_element;

  var mouse_original_x = 0;
  var mouse_original_y = 0;
  
  function get_model_width() {
    return Math.round(innerWidth / 3);
  }
  
  function get_model_height() {
    return Math.round(get_model_width() * 9 / 16);
  }
  
  async function load_3d_model(model_url) {
    gltf_loader.load(model_url, function(gltf) {
      model = gltf.scene
      scene.add(model);
    });
  }
  
  onMount(async function() {
    createScene(three_canvas_element);
    await load_3d_model(model_url);
  });

  function handleMouseDown(e) {
    let x = e.offsetX;
    let y = e.offsetY;
    //console.log("handleMouseDown: (x,y) = (" + x + ", " + y + ")");
    mouse_original_x = x;
    mouse_original_y = y;
  }
  
  function handleMouseMove(e) {
    let x = e.offsetX;
    let y = e.offsetY;
    let dx = x - mouse_original_x;
    let dy = y - mouse_original_y;
    console.log("handleMouseMove: (dx,dy) = (" + dx + ", " + dy + ")");
  }
  
  function handleMouseUp(e) {
    e.preventDefault();
  }
  
</script>

<svelte:window bind:innerWidth bind:outerWidth bind:innerHeight bind:outerHeight />

<div
  on:mousedown={handleMouseDown}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}>
  <canvas bind:this={three_canvas_element} style="width: {get_model_width()}px; height: {get_model_height()}px;" />
</div>
