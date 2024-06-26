<script lang="ts">
  import { onMount } from "svelte";
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
  import {
    BoxGeometry,
    DirectionalLight,
    HemisphereLight,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Object3D
  } from 'three';

  export let model_url = "";
  
  let outerWidth = 1024
  let innerWidth = 1024
  let outerHeight = 768
  let innerHeight = 768
  
  const scene = new Scene();

  let camera_distance = 150;
  const camera = new PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
  camera.position.z = camera_distance;
  camera.position.y = 0;
  
  const directionalLight = new DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);
  
  let renderer:WebGLRenderer;
  
  var model = null;
  var last_animate_time = null;
  var camera_angle_x = 0;
  var camera_angle_y = 0;
  
  const gltf_loader = new GLTFLoader();
  
  let three_canvas_element;
  
  var mouse_mode = "";

  var previous_touch_x = 0;
  var previous_touch_y = 0;
			   
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
    renderer = new WebGLRenderer({
      antialias: true,
      canvas: el,
      alpha: true
    });
    resize();
    animate();
  };
  
  function get_model_width() {
    let max_width = Math.round(innerWidth - 50);
    let max_height = Math.round(innerHeight - 50);
    if (max_width * 9 / 16 < max_height) {
      return max_width;			   
    }
    return Math.round(max_height * 16 / 9);
  }
  
  function get_model_height() {
    return Math.round(get_model_width() * 9 / 16);
  }
  
  async function load_3d_model(model_url) {
    gltf_loader.load(model_url, function(gltf) {
      let m = new Object3D()
      m.add(gltf.scene)
      gltf.scene.rotation.x = 0.5 * Math.PI
      scene.add(m);
      model = m
    });
  }
  
  onMount(async function() {
    createScene(three_canvas_element);
    if (model_url != "") {
      await load_3d_model(model_url);
    }
  });
  
  function handleMouseDown(e) {
    mouse_mode = "down"
  }
  
  function handleMouseMove(e) {
    if (mouse_mode == "down") {
      let dx = e.movementX;
      let dy = e.movementY;
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
    e.preventDefault();
    mouse_mode = "up"
  }

  function handleTouchStart(e) {
    mouse_mode = "down"
    previous_touch_x = e.touches[0].screenX
    previous_touch_y = e.touches[0].screenY
  }

  function handleTouchMove(e) {
    if (mouse_mode == "down") {
      e.preventDefault();
      let x = e.touches[0].screenX;
      let y = e.touches[0].screenY;
      let dx = x - previous_touch_x;
      let dy = y - previous_touch_y;
      previous_touch_x = x;
      previous_touch_y = y;
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
