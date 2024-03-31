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
  camera.position.z = 5;
  camera.position.y = 0;
  
  const directionalLight = new DirectionalLight(0x9090aa);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);
  
  let renderer:WebGLRenderer;
  
  var model = null;
  var last_animate_time = null;
  var camera_angle_x = 0.125 * Math.PI;
  var camera_angle_y = 0;
  
  const gltf_loader = new GLTFLoader();
  
  let three_canvas_element;
  
  var mouse_mode = "";
  var mouse_original_x = 0;
  var mouse_original_y = 0;

  const animate = () => {
    requestAnimationFrame(animate);
    if (last_animate_time != null) {
      camera_angle_y += (1.0 / 60) * 2 * Math.PI * ((0.001 * Date.now()) - last_animate_time);
    }
    if (model != null) {
      model.rotation.x = camera_angle_x;
      model.rotation.y = camera_angle_y;
    }
    last_animate_time = 0.001 * Date.now();
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
    mouse_mode = "down"
    let x = e.offsetX;
    let y = e.offsetY;
    //console.log("handleMouseDown: (x,y) = (" + x + ", " + y + ")");
    mouse_original_x = x;
    mouse_original_y = y;
  }
  
  function handleMouseMove(e) {
    if (mouse_mode == "down") {
      let dx = e.movementX;
      let dy = e.movementY;
      //console.log("handleMouseMove: (dx,dy) = (" + dx + ", " + dy + ")");
      camera_angle_x += (0.01) * dy;
      camera_angle_y += (0.01) * dx;
      if (camera_angle_x > 0.25 * Math.PI) {
        camera_angle_x = 0.25 * Math.PI;
      }
      if (camera_angle_x < -0.25 * Math.PI) {
        camera_angle_x = -0.25 * Math.PI;
      }
    }
  }
  
  function handleMouseUp(e) {
    mouse_mode = "up"
    e.preventDefault();
  }

  var touch_start_x = 0;
  var touch_start_y = 0;
			   
  function handleTouchStart(e) {
    mouse_mode = "down"
    console.log("handleTouchStart: here.");
    touch_start_x = e.touches[0].screenX
    touch_start_y = e.touches[0].screenY
  }

  function handleTouchMove(e) {
    console.log("handleTouchMove: here.");
    if (mouse_mode == "down") {
      
      let dx = e.touches[0].screenX - touch_start_x;
      let dy = e.touches[0].screenY - touch_start_y;
      //console.log("handleTouchMove: (dx,dy) = (" + dx + ", " + dy + ")");
      camera_angle_x += (0.01) * dy;
      camera_angle_y += (0.01) * dx;
      if (camera_angle_x > 0.25 * Math.PI) {
        camera_angle_x = 0.25 * Math.PI;
      }
      if (camera_angle_x < -0.25 * Math.PI) {
        camera_angle_x = -0.25 * Math.PI;
      }
    }
  }

  function handleTouchEnd(e) {
    mouse_mode = "up"
    console.log("handleTouchEnd: here.");
  }

</script>

<svelte:window bind:innerWidth bind:outerWidth bind:innerHeight bind:outerHeight />

<div
  on:mousedown={handleMouseDown}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  on:touchstart={handleTouchStart}
  on:touchmove={handleTouchMove}
  on:touchend={handleTouchEnd}>
  <canvas bind:this={three_canvas_element} style="width: {get_model_width()}px; height: {get_model_height()}px;" />
</div>
