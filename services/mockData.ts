import { Category, Wallpaper } from '../types';

const AVIATOR_3D_CODE = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><style>body,html{margin:0;padding:0;width:100%;height:100%;background:#f7d9aa;overflow:hidden}#world{position:absolute;width:100%;height:100%;overflow:hidden;z-index:1}canvas{position:absolute;top:0;left:0;width:100vw!important;height:100vh!important;z-index:99!important;display:block}</style><script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r75/three.min.js"><\/script></head><body><div id="world"></div><script>var Colors={red:0xf25346,yellow:0xedeb27,white:0xd8d0d1,brown:0x59332e,pink:0xF5986E,brownDark:0x23190f,blue:0x68c3c0,green:0x458248,purple:0x551A8B,lightgreen:0x629265};var scene,camera,fieldOfView,aspectRatio,nearPlane,farPlane,HEIGHT,WIDTH,renderer,container;var isPlaying=true;function createScene(){HEIGHT=window.innerHeight||1000;WIDTH=window.innerWidth||500;scene=new THREE.Scene();scene.fog=new THREE.Fog(0xf7d9aa,100,950);aspectRatio=WIDTH/HEIGHT;fieldOfView=60;nearPlane=1;farPlane=10000;camera=new THREE.PerspectiveCamera(fieldOfView,aspectRatio,nearPlane,farPlane);camera.position.x=0;camera.position.y=150;camera.position.z=100;renderer=new THREE.WebGLRenderer({alpha:true,antialias:false,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setSize(WIDTH,HEIGHT);renderer.shadowMap.enabled=true;container=document.getElementById("world");container.appendChild(renderer.domElement);window.addEventListener("resize",handleWindowResize,false)}function handleWindowResize(){HEIGHT=window.innerHeight;WIDTH=window.innerWidth;renderer.setSize(WIDTH,HEIGHT);camera.aspect=WIDTH/HEIGHT;camera.updateProjectionMatrix()}var hemisphereLight,shadowLight;function createLights(){hemisphereLight=new THREE.HemisphereLight(0xaaaaaa,0x000000,.9);shadowLight=new THREE.DirectionalLight(0xffffff,.9);shadowLight.position.set(0,350,350);shadowLight.castShadow=true;shadowLight.shadow.camera.left=-650;shadowLight.shadow.camera.right=650;shadowLight.shadow.camera.top=650;shadowLight.shadow.camera.bottom=-650;shadowLight.shadow.camera.near=1;shadowLight.shadow.camera.far=1000;shadowLight.shadow.mapSize.width=1024;shadowLight.shadow.mapSize.height=1024;scene.add(hemisphereLight);scene.add(shadowLight)}var Land=function(){var geom=new THREE.CylinderGeometry(600,600,1700,40,10);geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));var mat=new THREE.MeshPhongMaterial({color:Colors.lightgreen,shading:THREE.FlatShading});this.mesh=new THREE.Mesh(geom,mat);this.mesh.receiveShadow=true};var Orbit=function(){this.mesh=new THREE.Object3D()};var Sun=function(){this.mesh=new THREE.Object3D();var sunGeom=new THREE.SphereGeometry(400,20,10);var sunMat=new THREE.MeshPhongMaterial({color:Colors.yellow,shading:THREE.FlatShading});var sun=new THREE.Mesh(sunGeom,sunMat);sun.castShadow=false;sun.receiveShadow=false;this.mesh.add(sun)};var Cloud=function(){this.mesh=new THREE.Object3D();var geom=new THREE.DodecahedronGeometry(20,0);var mat=new THREE.MeshPhongMaterial({color:Colors.white});var nBlocs=3+Math.floor(Math.random()*3);for(var i=0;i<nBlocs;i++){var m=new THREE.Mesh(geom,mat);m.position.x=i*15;m.position.y=Math.random()*10;m.position.z=Math.random()*10;m.rotation.z=Math.random()*Math.PI*2;m.rotation.y=Math.random()*Math.PI*2;var s=.1+Math.random()*.9;m.scale.set(s,s,s);this.mesh.add(m)}};var Sky=function(){this.mesh=new THREE.Object3D();this.nClouds=25;var stepAngle=Math.PI*2/this.nClouds;for(var i=0;i<this.nClouds;i++){var c=new Cloud();var a=stepAngle*i;var h=800+Math.random()*200;c.mesh.position.y=Math.sin(a)*h;c.mesh.position.x=Math.cos(a)*h;c.mesh.rotation.z=a+Math.PI/2;c.mesh.position.z=-400-Math.random()*400;var s=1+Math.random()*2;c.mesh.scale.set(s,s,s);this.mesh.add(c.mesh)}};var Tree=function(){this.mesh=new THREE.Object3D();var matTreeLeaves=new THREE.MeshPhongMaterial({color:Colors.green,shading:THREE.FlatShading});var geonTreeBase=new THREE.BoxGeometry(10,20,10);var matTreeBase=new THREE.MeshBasicMaterial({color:Colors.brown});var treeBase=new THREE.Mesh(geonTreeBase,matTreeBase);treeBase.castShadow=true;treeBase.receiveShadow=true;this.mesh.add(treeBase);var geomTreeLeaves1=new THREE.CylinderGeometry(1,36,36,4);var treeLeaves1=new THREE.Mesh(geomTreeLeaves1,matTreeLeaves);treeLeaves1.castShadow=true;treeLeaves1.receiveShadow=true;treeLeaves1.position.y=20;this.mesh.add(treeLeaves1);var geomTreeLeaves2=new THREE.CylinderGeometry(1,27,27,4);var treeLeaves2=new THREE.Mesh(geomTreeLeaves2,matTreeLeaves);treeLeaves2.castShadow=true;treeLeaves2.receiveShadow=true;treeLeaves2.position.y=40;this.mesh.add(treeLeaves2);var geomTreeLeaves3=new THREE.CylinderGeometry(1,18,18,4);var treeLeaves3=new THREE.Mesh(geomTreeLeaves3,matTreeLeaves);treeLeaves3.castShadow=true;treeLeaves3.receiveShadow=true;treeLeaves3.position.y=55;this.mesh.add(treeLeaves3)};var petalColors=[Colors.red,Colors.yellow,Colors.blue];var Flower=function(){this.mesh=new THREE.Object3D();var geomStem=new THREE.BoxGeometry(5,50,5,1,1,1);var matStem=new THREE.MeshPhongMaterial({color:Colors.green,shading:THREE.FlatShading});var stem=new THREE.Mesh(geomStem,matStem);stem.castShadow=false;stem.receiveShadow=true;this.mesh.add(stem);var geomPetalCore=new THREE.BoxGeometry(10,10,10,1,1,1);var matPetalCore=new THREE.MeshPhongMaterial({color:Colors.yellow,shading:THREE.FlatShading});var petalCore=new THREE.Mesh(geomPetalCore,matPetalCore);petalCore.castShadow=false;petalCore.receiveShadow=true;var petalColor=petalColors[Math.floor(Math.random()*3)];var geomPetal=new THREE.BoxGeometry(15,20,5,1,1,1);var matPetal=new THREE.MeshBasicMaterial({color:petalColor});geomPetal.vertices[5].y-=4;geomPetal.vertices[4].y-=4;geomPetal.vertices[7].y+=4;geomPetal.vertices[6].y+=4;geomPetal.translate(12.5,0,3);var petals=[];for(var i=0;i<4;i++){petals[i]=new THREE.Mesh(geomPetal,matPetal);petals[i].rotation.z=i*Math.PI/2;petals[i].castShadow=true;petals[i].receiveShadow=true}petalCore.add(petals[0],petals[1],petals[2],petals[3]);petalCore.position.y=25;petalCore.position.z=3;this.mesh.add(petalCore)};var Forest=function(){this.mesh=new THREE.Object3D();this.nTrees=60;var stepAngle=Math.PI*2/this.nTrees;for(var i=0;i<this.nTrees;i++){var t=new Tree();var a=stepAngle*i;var h=605;t.mesh.position.y=Math.sin(a)*h;t.mesh.position.x=Math.cos(a)*h;t.mesh.rotation.z=a+(Math.PI/2)*3;t.mesh.position.z=0-Math.random()*600;var s=.3+Math.random()*.75;t.mesh.scale.set(s,s,s);this.mesh.add(t.mesh)}this.nFlowers=60;var stepAngle=Math.PI*2/this.nFlowers;for(var i=0;i<this.nFlowers;i++){var f=new Flower();var a=stepAngle*i;var h=605;f.mesh.position.y=Math.sin(a)*h;f.mesh.position.x=Math.cos(a)*h;f.mesh.rotation.z=a+(Math.PI/2)*3;f.mesh.position.z=0-Math.random()*600;var s=.1+Math.random()*.3;f.mesh.scale.set(s,s,s);this.mesh.add(f.mesh)}};var AirPlane=function(){this.mesh=new THREE.Object3D();var geomCockpit=new THREE.BoxGeometry(80,50,50,1,1,1);var matCockpit=new THREE.MeshPhongMaterial({color:Colors.red,shading:THREE.FlatShading});geomCockpit.vertices[4].y-=10;geomCockpit.vertices[4].z+=20;geomCockpit.vertices[5].y-=10;geomCockpit.vertices[5].z-=20;geomCockpit.vertices[6].y+=30;geomCockpit.vertices[6].z+=20;geomCockpit.vertices[7].y+=30;geomCockpit.vertices[7].z-=20;var cockpit=new THREE.Mesh(geomCockpit,matCockpit);cockpit.castShadow=true;cockpit.receiveShadow=true;this.mesh.add(cockpit);var geomEngine=new THREE.BoxGeometry(20,50,50,1,1,1);var matEngine=new THREE.MeshPhongMaterial({color:Colors.white,shading:THREE.FlatShading});var engine=new THREE.Mesh(geomEngine,matEngine);engine.position.x=40;engine.castShadow=true;engine.receiveShadow=true;this.mesh.add(engine);var geomTailPlane=new THREE.BoxGeometry(15,20,5,1,1,1);var matTailPlane=new THREE.MeshPhongMaterial({color:Colors.red,shading:THREE.FlatShading});var tailPlane=new THREE.Mesh(geomTailPlane,matTailPlane);tailPlane.position.set(-35,25,0);tailPlane.castShadow=true;tailPlane.receiveShadow=true;this.mesh.add(tailPlane);var geomSideWing=new THREE.BoxGeometry(40,4,150,1,1,1);var matSideWing=new THREE.MeshPhongMaterial({color:Colors.red,shading:THREE.FlatShading});var sideWingTop=new THREE.Mesh(geomSideWing,matSideWing);var sideWingBottom=new THREE.Mesh(geomSideWing,matSideWing);sideWingTop.castShadow=true;sideWingTop.receiveShadow=true;sideWingBottom.castShadow=true;sideWingBottom.receiveShadow=true;sideWingTop.position.set(20,12,0);sideWingBottom.position.set(20,-3,0);this.mesh.add(sideWingTop);this.mesh.add(sideWingBottom);var geomWindshield=new THREE.BoxGeometry(3,15,20,1,1,1);var matWindshield=new THREE.MeshPhongMaterial({color:Colors.white,transparent:true,opacity:.3,shading:THREE.FlatShading});var windshield=new THREE.Mesh(geomWindshield,matWindshield);windshield.position.set(5,27,0);windshield.castShadow=true;windshield.receiveShadow=true;this.mesh.add(windshield);var geomPropeller=new THREE.BoxGeometry(20,10,10,1,1,1);geomPropeller.vertices[4].y-=5;geomPropeller.vertices[4].z+=5;geomPropeller.vertices[5].y-=5;geomPropeller.vertices[5].z-=5;geomPropeller.vertices[6].y+=5;geomPropeller.vertices[6].z+=5;geomPropeller.vertices[7].y+=5;geomPropeller.vertices[7].z-=5;var matPropeller=new THREE.MeshPhongMaterial({color:Colors.brown,shading:THREE.FlatShading});this.propeller=new THREE.Mesh(geomPropeller,matPropeller);this.propeller.castShadow=true;this.propeller.receiveShadow=true;var geomBlade1=new THREE.BoxGeometry(1,100,10,1,1,1);var geomBlade2=new THREE.BoxGeometry(1,10,100,1,1,1);var matBlade=new THREE.MeshPhongMaterial({color:Colors.brownDark,shading:THREE.FlatShading});var blade1=new THREE.Mesh(geomBlade1,matBlade);blade1.position.set(8,0,0);blade1.castShadow=true;blade1.receiveShadow=true;var blade2=new THREE.Mesh(geomBlade2,matBlade);blade2.position.set(8,0,0);blade2.castShadow=true;blade2.receiveShadow=true;this.propeller.add(blade1,blade2);this.propeller.position.set(50,0,0);this.mesh.add(this.propeller);var wheelProtecGeom=new THREE.BoxGeometry(30,15,10,1,1,1);var wheelProtecMat=new THREE.MeshPhongMaterial({color:Colors.white,shading:THREE.FlatShading});var wheelProtecR=new THREE.Mesh(wheelProtecGeom,wheelProtecMat);wheelProtecR.position.set(25,-20,25);this.mesh.add(wheelProtecR);var wheelTireGeom=new THREE.BoxGeometry(24,24,4);var wheelTireMat=new THREE.MeshPhongMaterial({color:Colors.brownDark,shading:THREE.FlatShading});var wheelTireR=new THREE.Mesh(wheelTireGeom,wheelTireMat);wheelTireR.position.set(25,-28,25);var wheelAxisGeom=new THREE.BoxGeometry(10,10,6);var wheelAxisMat=new THREE.MeshPhongMaterial({color:Colors.brown,shading:THREE.FlatShading});var wheelAxis=new THREE.Mesh(wheelAxisGeom,wheelAxisMat);wheelTireR.add(wheelAxis);this.mesh.add(wheelTireR);var wheelProtecL=wheelProtecR.clone();wheelProtecL.position.z=-wheelProtecR.position.z;this.mesh.add(wheelProtecL);var wheelTireL=wheelTireR.clone();wheelTireL.position.z=-wheelTireR.position.z;this.mesh.add(wheelTireL);var wheelTireB=wheelTireR.clone();wheelTireB.scale.set(.5,.5,.5);wheelTireB.position.set(-35,-5,0);this.mesh.add(wheelTireB);var suspensionGeom=new THREE.BoxGeometry(4,20,4);suspensionGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,10,0));var suspensionMat=new THREE.MeshPhongMaterial({color:Colors.red,shading:THREE.FlatShading});var suspension=new THREE.Mesh(suspensionGeom,suspensionMat);suspension.position.set(-35,-5,0);suspension.rotation.z=-.3;this.mesh.add(suspension)};var sky,forest,land,orbit,airplane,sun;var mousePos={x:0,y:0};var offSet=-600;function createSky(){sky=new Sky();sky.mesh.position.y=offSet;scene.add(sky.mesh)}function createLand(){land=new Land();land.mesh.position.y=offSet;scene.add(land.mesh)}function createOrbit(){orbit=new Orbit();orbit.mesh.position.y=offSet;orbit.mesh.rotation.z=-Math.PI/6;scene.add(orbit.mesh)}function createForest(){forest=new Forest();forest.mesh.position.y=offSet;scene.add(forest.mesh)}function createSun(){sun=new Sun();sun.mesh.scale.set(1,1,.3);sun.mesh.position.set(0,-30,-850);scene.add(sun.mesh)}function createPlane(){airplane=new AirPlane();airplane.mesh.scale.set(.35,.35,.35);airplane.mesh.position.set(-40,110,-250);scene.add(airplane.mesh)}function updatePlane(){var targetY=normalize(mousePos.y,-.75,.75,50,190);var targetX=normalize(mousePos.x,-.75,.75,-100,-20);airplane.mesh.position.y+=(targetY-airplane.mesh.position.y)*0.01;airplane.mesh.position.x+=(targetX-airplane.mesh.position.x)*0.01;airplane.mesh.rotation.z=(targetY-airplane.mesh.position.y)*0.003;airplane.mesh.rotation.x=(airplane.mesh.position.y-targetY)*0.0015;airplane.mesh.rotation.y=(airplane.mesh.position.x-targetX)*0.0015;airplane.propeller.rotation.x+=0.03}function normalize(v,vmin,vmax,tmin,tmax){var nv=Math.max(Math.min(v,vmax),vmin);var dv=vmax-vmin;var pc=(nv-vmin)/dv;var dt=tmax-tmin;return tmin+(pc*dt)}function loop(){if(!isPlaying)return;land.mesh.rotation.z+=.0004;orbit.mesh.rotation.z+=.0001;sky.mesh.rotation.z+=.0002;forest.mesh.rotation.z+=.0004;updatePlane();renderer.render(scene,camera);requestAnimationFrame(loop)}function handlePointerMove(event){var clientX=event.touches?event.touches[0].clientX:event.clientX;var clientY=event.touches?event.touches[0].clientY:event.clientY;var tx=-1+(clientX/WIDTH)*2;var ty=1-(clientY/HEIGHT)*2;mousePos={x:tx,y:ty}}function init(){createScene();createLights();createPlane();createOrbit();createSun();createLand();createForest();createSky();document.addEventListener("mousemove",handlePointerMove,false);document.addEventListener("touchmove",handlePointerMove,{passive:true});document.addEventListener("touchstart",handlePointerMove,{passive:true});window.addEventListener("pauseWallpaper",()=>isPlaying=false);window.addEventListener("playWallpaper",()=>{if(!isPlaying){isPlaying=true;loop()}});loop()}window.addEventListener("load",()=>{setTimeout(init,500);},false);<\/script></body></html>`;

export const LION_3D_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <style>
    body, html {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, #74676c 0%, #ebe5e7 40%, #ebe5e7 60%, #74676c 100%);
      overflow: hidden;
      touch-action: none; /* REQUIRED FOR MOBILE DRAGGING */
    }
    #world {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 1;
    }
    canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 99 !important;
      display: block;
    }
  </style>
  <script src="./three.min.js"><\/script>
</head>
<body>
  <div id="world"></div>
  <script>
    var scene, camera, controls, fieldOfView, aspectRatio, nearPlane, farPlane, shadowLight, backLight, light, renderer, container;
    var clock = new THREE.Clock();
    var time = 0;
    var deltaTime = 0;
    var floor, lion, fan, isBlowing = false;
    var HEIGHT, WIDTH, windowHalfX, windowHalfY, mousePos = {x:0,y:0}, dist = 0;
    var isPlaying = true;

    function init(){
      scene = new THREE.Scene();
      
      // FIXED: Fallbacks ensure it gets a dimension even in strict WebViews
      HEIGHT = window.innerHeight || document.documentElement.clientHeight || window.screen.height;
      WIDTH = window.innerWidth || document.documentElement.clientWidth || window.screen.width;
      aspectRatio = WIDTH / HEIGHT;
      fieldOfView = 60;
      nearPlane = 1;
      farPlane = 2000; 
      camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
      camera.position.z = 1100;  
      camera.position.y = -50;
      camera.lookAt(new THREE.Vector3(0,0,0));    
      renderer = new THREE.WebGLRenderer({alpha: true, antialias: false, powerPreference: "high-performance"});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(WIDTH, HEIGHT);
      renderer.shadowMap.enabled = false;
      container = document.getElementById('world');
      container.appendChild(renderer.domElement);
      windowHalfX = WIDTH / 2;
      windowHalfY = HEIGHT / 2;
      
      window.addEventListener('resize', onWindowResize, false);
      document.addEventListener('mousemove', handleMouseMove, false);
      document.addEventListener('mousedown', handleMouseDown, false);
      document.addEventListener('mouseup', handleMouseUp, false);
      document.addEventListener('touchstart', handleTouchStart, {passive: false});
      document.addEventListener('touchend', handleTouchEnd, false);
      document.addEventListener('touchmove', handleTouchMove, {passive: false});

      window.addEventListener("pauseWallpaper", () => isPlaying = false);
      window.addEventListener("playWallpaper", () => {
        if(!isPlaying){ isPlaying = true; clock.getDelta(); loop(); }
      });
    }

    function onWindowResize() {
      HEIGHT = window.innerHeight;
      WIDTH = window.innerWidth;
      windowHalfX = WIDTH / 2;
      windowHalfY = HEIGHT / 2;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    }

    function handleMouseMove(event) {
      mousePos = {x:event.clientX, y:event.clientY};
    }
    function handleMouseDown(event) {
      isBlowing = true;
    }
    function handleMouseUp(event) {
      isBlowing = false;
    }
    function handleTouchStart(event) {
      if (event.touches.length > 0) {
        mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
        isBlowing = true;
      }
    }
    function handleTouchEnd(event) {
      isBlowing = false;
    }
    function handleTouchMove(event) {
      if (event.touches.length > 0) {
        mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
        isBlowing = true;
      }
    }

    function createLights() {
      light = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)
      shadowLight = new THREE.DirectionalLight(0xffffff, .8);
      shadowLight.position.set(200, 200, 200);
      shadowLight.castShadow = false;
      backLight = new THREE.DirectionalLight(0xffffff, .4);
      backLight.position.set(-100, 200, 50);
      backLight.castShadow = false;
      scene.add(backLight);
      scene.add(light);
      scene.add(shadowLight);
    }

    function createFloor(){ 
      floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000,500), new THREE.MeshBasicMaterial({color: 0xebe5e7}));
      floor.rotation.x = -Math.PI/2;
      floor.position.y = -100;
      floor.receiveShadow = false;
      scene.add(floor);
    }

    function createLion(){
      lion = new Lion();
      scene.add(lion.threegroup);
    }

    function createFan(){
      fan = new Fan();
      fan.threegroup.position.z = 350;
      scene.add(fan.threegroup);
    }

    Fan = function(){
      this.isBlowing = false;
      this.speed = 0;
      this.acc =0;
      this.redMat = new THREE.MeshLambertMaterial ({color: 0xad3525, shading:THREE.FlatShading});
      this.greyMat = new THREE.MeshLambertMaterial ({color: 0x653f4c, shading:THREE.FlatShading});
      this.yellowMat = new THREE.MeshLambertMaterial ({color: 0xfdd276, shading:THREE.FlatShading});
      var coreGeom = new THREE.BoxGeometry(10,10,20);
      var sphereGeom = new THREE.BoxGeometry(10, 10, 3);
      var propGeom = new THREE.BoxGeometry(10,30,2);
      propGeom.applyMatrix( new THREE.Matrix4().makeTranslation( 0,25,0) );
      this.core = new THREE.Mesh(coreGeom,this.greyMat);
      var prop1 = new THREE.Mesh(propGeom, this.redMat);
      prop1.position.z = 15;
      var prop2 = prop1.clone();
      prop2.rotation.z = Math.PI/2;
      var prop3 = prop1.clone();
      prop3.rotation.z = Math.PI;
      var prop4 = prop1.clone();
      prop4.rotation.z = -Math.PI/2;
      this.sphere = new THREE.Mesh(sphereGeom, this.yellowMat);
      this.sphere.position.z = 15;
      this.propeller = new THREE.Group();
      this.propeller.add(prop1);
      this.propeller.add(prop2);
      this.propeller.add(prop3);
      this.propeller.add(prop4);
      this.threegroup = new THREE.Group();
      this.threegroup.add(this.core);
      this.threegroup.add(this.propeller);
      this.threegroup.add(this.sphere);
    }

    Fan.prototype.update = function(xTarget, yTarget, deltaTime){
      this.threegroup.lookAt(new THREE.Vector3(0,80,60));
      this.tPosX = rule3(xTarget, -200, 200, -250, 250);
      this.tPosY = rule3(yTarget, -200, 200, 250, -250);
      this.threegroup.position.x += (this.tPosX - this.threegroup.position.x) * deltaTime * 4;
      this.threegroup.position.y += (this.tPosY - this.threegroup.position.y) * deltaTime * 4;
      this.targetSpeed = (this.isBlowing) ? 15 * deltaTime: 5 * deltaTime;
      if (this.isBlowing && this.speed < this.targetSpeed){
        this.acc += .01 * deltaTime;
        this.speed += this.acc;
      }else if (!this.isBlowing){
        this.acc = 0;
        this.speed *= Math.pow(.4, deltaTime);
      }
      this.propeller.rotation.z += this.speed ; 
    }

    Lion = function(){
      this.windTime = 0;
      this.bodyInitPositions = [];
      this.maneParts = [];
      this.threegroup = new THREE.Group();
      this.yellowMat = new THREE.MeshLambertMaterial ({color: 0xe3802e, shading:THREE.FlatShading}); // Orange cat color
      this.redMat = new THREE.MeshLambertMaterial ({color: 0xad3525, shading:THREE.FlatShading});
      this.pinkMat = new THREE.MeshLambertMaterial ({color: 0xe55d2b, shading:THREE.FlatShading});
      this.whiteMat = new THREE.MeshLambertMaterial ({color: 0xffffff, shading:THREE.FlatShading});
      this.purpleMat = new THREE.MeshLambertMaterial ({color: 0x451954, shading:THREE.FlatShading});
      this.greyMat = new THREE.MeshLambertMaterial ({color: 0x653f4c, shading:THREE.FlatShading});
      this.blackMat = new THREE.MeshLambertMaterial ({color: 0x302925, shading:THREE.FlatShading});
      var bodyGeom = new THREE.CylinderGeometry(20,80, 140, 16);
      var maneGeom = new THREE.BoxGeometry(40,40,15);
      var faceGeom = new THREE.SphereGeometry(40, 16, 16);
      faceGeom.applyMatrix( new THREE.Matrix4().makeScale( 0.9, 0.75, 0.8 ) );
      var spotGeom = new THREE.BoxGeometry(0,0,0); // Hide spots
      var mustacheGeom = new THREE.BoxGeometry(50, 1, 1);
      mustacheGeom.applyMatrix( new THREE.Matrix4().makeTranslation( 25, 0, 0 ) );
      var earGeom = new THREE.CylinderGeometry(0, 15, 30, 8, 1);
      var noseGeom = new THREE.SphereGeometry(8, 8, 8);
      noseGeom.applyMatrix( new THREE.Matrix4().makeScale( 1, 0.6, 0.5 ) );
      var eyeGeom = new THREE.SphereGeometry(12, 12, 12);
      eyeGeom.applyMatrix( new THREE.Matrix4().makeScale( 0.4, 1, 1 ) );
      var irisGeom = new THREE.SphereGeometry(6, 8, 8);
      irisGeom.applyMatrix( new THREE.Matrix4().makeScale( 0.4, 1.2, 0.3 ) );
      var mouthGeom = new THREE.BoxGeometry(20,20,10);
      var smileGeom = new THREE.TorusGeometry( 8, 3, 2, 10, Math.PI );
      var lipsGeom = new THREE.BoxGeometry(20,10,20);
      var kneeGeom = new THREE.SphereGeometry(40, 12, 12);
      kneeGeom.applyMatrix( new THREE.Matrix4().makeScale( 0.3, 1, 1 ) );
      kneeGeom.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 50, 0 ) );
      var footGeom = new THREE.SphereGeometry(15, 12, 12);
      footGeom.applyMatrix( new THREE.Matrix4().makeScale( 1.3, 0.6, 0.6 ) );
      this.body = new THREE.Mesh(bodyGeom, this.yellowMat);
      this.body.position.z = -60;
      this.body.position.y = -30;
      this.bodyVertices = [];
      for (var i=0; i<this.body.geometry.vertices.length; i++){
        var tv = this.body.geometry.vertices[i];
        if (tv.y > 60) {
          this.bodyVertices.push(i);
        }
      }
      
      for (var i=0;i<this.bodyVertices.length; i++){
        var tv = this.body.geometry.vertices[this.bodyVertices[i]];
        tv.z =70;
        this.bodyInitPositions.push({x:tv.x, y:tv.y, z:tv.z});
      }
      this.leftKnee = new THREE.Mesh(kneeGeom, this.yellowMat);
      this.leftKnee.position.x = 65;
      this.leftKnee.position.z = -20;
      this.leftKnee.position.y = -110;
      this.leftKnee.rotation.z = -.3;
      this.rightKnee = new THREE.Mesh(kneeGeom, this.yellowMat);
      this.rightKnee.position.x = -65;
      this.rightKnee.position.z = -20;
      this.rightKnee.position.y = -110;
      this.rightKnee.rotation.z = .3;
      this.backLeftFoot = new THREE.Mesh(footGeom, this.yellowMat);
      this.backLeftFoot.position.z = 30;
      this.backLeftFoot.position.x = 75;
      this.backLeftFoot.position.y = -90;
      this.backRightFoot = new THREE.Mesh(footGeom, this.yellowMat);
      this.backRightFoot.position.z = 30;
      this.backRightFoot.position.x = -75;
      this.backRightFoot.position.y = -90;
      this.frontRightFoot = new THREE.Mesh(footGeom, this.yellowMat);
      this.frontRightFoot.position.z = 40;
      this.frontRightFoot.position.x = -22;
      this.frontRightFoot.position.y = -90;
      this.frontLeftFoot = new THREE.Mesh(footGeom, this.yellowMat);
      this.frontLeftFoot.position.z = 40;
      this.frontLeftFoot.position.x = 22;
      this.frontLeftFoot.position.y = -90;
      this.mane = new THREE.Group();
      for (var j=0; j<4; j++){
        for (var k=0; k<4; k++){
          var manePart = new THREE.Mesh(maneGeom, this.redMat);
          manePart.position.x = (j*40)-60;
          manePart.position.y = (k*40)-60;
          var amp;
          var zOffset;
          var periodOffset = Math.random()*Math.PI*2;     
          if ((j==0 && k==0) || (j==0 && k==3) || (j==3 && k==0) || (j==3 && k==3)){
            amp = -10-Math.floor(Math.random()*5);
            zOffset = -5;
          }else if (j==0 || k ==0 || j==3 || k==3){
            amp = -5-Math.floor(Math.random()*5);
            zOffset = 0;
          }else{
            amp = 0;
            zOffset = 0;
          }
          this.maneParts.push({mesh:manePart, amp:amp, zOffset:zOffset, periodOffset:periodOffset, xInit:manePart.position.x, yInit:manePart.position.y});
          this.mane.add(manePart);
        }
      }
      this.mane.position.y = -10;
      this.mane.position.z = 80;
      this.face = new THREE.Mesh(faceGeom, this.yellowMat);
      this.face.position.z = 135;
      this.mustaches = [];
      this.mustache1 = new THREE.Mesh(mustacheGeom, this.greyMat);
      this.mustache1.position.x = 30;
      this.mustache1.position.y = -5;
      this.mustache1.position.z = 175; 
      this.mustache2 = this.mustache1.clone();
      this.mustache2.position.x = 35;
      this.mustache2.position.y = -12;
      this.mustache3 = this.mustache1.clone();
      this.mustache3.position.y = -19;
      this.mustache3.position.x = 30;  
      this.mustache4 = this.mustache1.clone();
      this.mustache4.rotation.z = Math.PI;
      this.mustache4.position.x = -30;
      this.mustache5 = new THREE.Mesh(mustacheGeom, this.blackMat);
      this.mustache5 = this.mustache2.clone();
      this.mustache5.rotation.z = Math.PI;
      this.mustache5.position.x = -35;
      this.mustache6 = new THREE.Mesh(mustacheGeom, this.blackMat);
      this.mustache6 = this.mustache3.clone();
      this.mustache6.rotation.z = Math.PI;
      this.mustache6.position.x = -30;
      this.mustaches.push(this.mustache1);
      this.mustaches.push(this.mustache2);
      this.mustaches.push(this.mustache3);
      this.mustaches.push(this.mustache4);
      this.mustaches.push(this.mustache5);
      this.mustaches.push(this.mustache6);
      this.spot1 = new THREE.Mesh(spotGeom, this.redMat);
      this.spot1.position.x = 39;
      this.spot1.position.z = 150;
      this.spot2 = this.spot1.clone();
      this.spot2.position.z = 160;
      this.spot2.position.y = -10;
      this.spot3 = this.spot1.clone();
      this.spot3.position.z = 140;
      this.spot3.position.y = -15;
      this.spot4 = this.spot1.clone();
      this.spot4.position.z = 150;
      this.spot4.position.y = -20;
      this.spot5 = this.spot1.clone();
      this.spot5.position.x = -39;
      this.spot6 = this.spot2.clone();
      this.spot6.position.x = -39;
      this.spot7 = this.spot3.clone();
      this.spot7.position.x = -39;
      this.spot8 = this.spot4.clone();
      this.spot8.position.x = -39;
      this.leftEye = new THREE.Mesh(eyeGeom, this.whiteMat);
      this.leftEye.position.x = 25;
      this.leftEye.position.z = 120;
      this.leftEye.position.y = 15;
      this.rightEye = new THREE.Mesh(eyeGeom, this.whiteMat);
      this.rightEye.position.x = -25;
      this.rightEye.position.z = 120;
      this.rightEye.position.y = 15;
      this.leftIris = new THREE.Mesh(irisGeom, this.purpleMat);
      this.leftIris.position.x = 27;
      this.leftIris.position.z = 120;
      this.leftIris.position.y = 15;
      this.rightIris = new THREE.Mesh(irisGeom, this.purpleMat);
      this.rightIris.position.x = -27;
      this.rightIris.position.z = 120;
      this.rightIris.position.y = 15;
      this.mouth = new THREE.Mesh(mouthGeom, this.blackMat);
      this.mouth.position.z = 171;
      this.mouth.position.y = -20;
      this.mouth.scale.set(.5,.5,1);
      this.smile = new THREE.Mesh(smileGeom, this.greyMat);
      this.smile.position.z = 173;  
      this.smile.position.y = -5;
      this.smile.rotation.z = -Math.PI;
      this.lips = new THREE.Mesh(lipsGeom, this.yellowMat);
      this.lips.position.z = 165;
      this.lips.position.y = -35;
      this.rightEar = new THREE.Mesh(earGeom, this.yellowMat);
      this.rightEar.position.x = -35;
      this.rightEar.position.y = 35;
      this.rightEar.position.z = 105;
      this.rightEar.rotation.z = -0.15;
      this.leftEar = new THREE.Mesh(earGeom, this.yellowMat);
      this.leftEar.position.x = 35;
      this.leftEar.position.y = 35;
      this.leftEar.position.z = 105;
      this.leftEar.rotation.z = 0.15;
      this.nose = new THREE.Mesh(noseGeom, this.pinkMat);
      this.nose.position.z = 170;
      this.nose.position.y = 15;
      this.head = new THREE.Group();
      this.head.add(this.face);
      // this.head.add(this.mane); // Cats don't have manes
      this.head.add(this.rightEar);
      this.head.add(this.leftEar);
      this.head.add(this.nose);
      this.head.add(this.leftEye);
      this.head.add(this.rightEye);
      this.head.add(this.leftIris);
      this.head.add(this.rightIris);
      this.head.add(this.mouth);
      this.head.add(this.smile);
      this.head.add(this.lips);
      this.head.add(this.spot1);
      this.head.add(this.spot2);
      this.head.add(this.spot3);
      this.head.add(this.spot4);
      this.head.add(this.spot5);
      this.head.add(this.spot6);
      this.head.add(this.spot7);
      this.head.add(this.spot8);
      this.head.add(this.mustache1);
      this.head.add(this.mustache2);
      this.head.add(this.mustache3);
      this.head.add(this.mustache4);
      this.head.add(this.mustache5);
      this.head.add(this.mustache6);
      this.head.position.y = 60;
      this.threegroup.add(this.body);
      this.threegroup.add(this.head);
      this.threegroup.add(this.leftKnee);
      this.threegroup.add(this.rightKnee);
      this.threegroup.add(this.backLeftFoot);
      this.threegroup.add(this.backRightFoot);
      this.threegroup.add(this.frontRightFoot);
      this.threegroup.add(this.frontLeftFoot);
      this.threegroup.traverse( function ( object ) {
        if ( object instanceof THREE.Mesh ) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
    }

    Lion.prototype.updateBody = function(speed){
      this.head.rotation.y += (this.tHeagRotY - this.head.rotation.y) / speed;
      this.head.rotation.x += (this.tHeadRotX - this.head.rotation.x) / speed;
      this.head.position.x += (this.tHeadPosX-this.head.position.x) / speed; 
      this.head.position.y += (this.tHeadPosY-this.head.position.y) / speed; 
      this.head.position.z += (this.tHeadPosZ-this.head.position.z) / speed; 
      this.leftEye.scale.y += (this.tEyeScale - this.leftEye.scale.y) / (speed*2);
      this.rightEye.scale.y = this.leftEye.scale.y;
      this.leftIris.scale.y += (this.tIrisYScale - this.leftIris.scale.y) / (speed*2);
      this.rightIris.scale.y = this.leftIris.scale.y;
      this.leftIris.scale.z += (this.tIrisZScale - this.leftIris.scale.z) / (speed*2);
      this.rightIris.scale.z = this.leftIris.scale.z;
      this.leftIris.position.y += (this.tIrisPosY - this.leftIris.position.y) / speed;
      this.rightIris.position.y = this.leftIris.position.y;
      this.leftIris.position.z += (this.tLeftIrisPosZ - this.leftIris.position.z) / speed;
      this.rightIris.position.z += (this.tRightIrisPosZ - this.rightIris.position.z) / speed;
      this.rightKnee.rotation.z += (this.tRightKneeRotZ - this.rightKnee.rotation.z) / speed;
      this.leftKnee.rotation.z += (this.tLeftKneeRotZ - this.leftKnee.rotation.z) / speed;
      this.lips.position.x += (this.tLipsPosX - this.lips.position.x) / speed;
      this.lips.position.y += (this.tLipsPosY - this.lips.position.y) / speed;
      this.smile.position.x += (this.tSmilePosX - this.smile.position.x) / speed;
      this.mouth.position.z += (this.tMouthPosZ - this.mouth.position.z) / speed;
      this.smile.position.z += (this.tSmilePosZ - this.smile.position.z) / speed;
      this.smile.position.y += (this.tSmilePosY - this.smile.position.y) / speed;
      this.smile.rotation.z += (this.tSmileRotZ - this.smile.rotation.z) / speed;
    }

    Lion.prototype.look = function(xTarget, yTarget){
      this.tHeagRotY = rule3(xTarget, -200, 200, -Math.PI/8, Math.PI/8);
      this.tHeadRotX = rule3(yTarget, -200, 200, -Math.PI/16, Math.PI/16);
      this.tHeadPosX = rule3(xTarget, -200, 200, 30, -30);
      this.tHeadPosY = rule3(yTarget, -140, 260, 50, 70);
      this.tHeadPosZ = 0;
      this.tEyeScale = 1;
      this.tIrisYScale = 1;
      this.tIrisZScale = 1;
      this.tIrisPosY = rule3(yTarget, -200,200, 35,15);
      this.tLeftIrisPosZ = rule3(xTarget, -200, 200, 130, 110);
      this.tRightIrisPosZ = rule3(xTarget, -200, 200, 110, 130);
      this.tLipsPosX = 0;
      this.tLipsPosY = -45;
      this.tSmilePosX = 0;
      this.tMouthPosZ = 174;
      this.tSmilePosZ = 173;
      this.tSmilePosY = -15;
      this.tSmileRotZ = -Math.PI;
      this.tRightKneeRotZ = rule3(xTarget, -200, 200, .3-Math.PI/8, .3+Math.PI/8);
      this.tLeftKneeRotZ = rule3(xTarget, -200, 200, -.3-Math.PI/8, -.3+Math.PI/8)
      this.updateBody(5);
      this.mane.rotation.y = 0;
      this.mane.rotation.x = 0;
      for (var i=0; i<this.maneParts.length; i++){
        var m = this.maneParts[i].mesh;
        m.position.z = 0;
        m.rotation.y = 0;
      }
      for (var i=0; i<this.mustaches.length; i++){
        var m = this.mustaches[i];
        m.rotation.y = 0;
      }
      for (var i=0; i<this.bodyVertices.length; i++){
         var tvInit = this.bodyInitPositions[i];
          var tv = this.body.geometry.vertices[this.bodyVertices[i]];
          tv.x = tvInit.x + this.head.position.x;
      }
      this.body.geometry.verticesNeedUpdate = true;
    }

    Lion.prototype.cool = function(xTarget, yTarget, deltaTime){
      this.tHeagRotY = rule3(xTarget, -200, 200, Math.PI/4, -Math.PI/4);
      this.tHeadRotX = rule3(yTarget, -200,200, Math.PI/4, -Math.PI/4);
      this.tHeadPosX = rule3(xTarget, -200, 200, -70,70);
      this.tHeadPosY = rule3(yTarget, -140, 260, 100, 20);
      this.tHeadPosZ = 100;
      this.tEyeScale = 0.1;
      this.tIrisYScale = 0.1;
      this.tIrisZScale = 3;
      this.tIrisPosY = 20;
      this.tLeftIrisPosZ = 120;
      this.tRightIrisPosZ = 120;
      this.tLipsPosX = rule3(xTarget, -200, 200, -15,15);
      this.tLipsPosY = rule3(yTarget, -200, 200, -45,-40);
      this.tMouthPosZ = 168;
      this.tSmilePosX = rule3(xTarget, -200, 200, -15,15); 
      this.tSmilePosY = rule3(yTarget, -200, 200, -20,-8); 
      this.tSmilePosZ = 176;
      this.tSmileRotZ = rule3(xTarget, -200, 200, -Math.PI-.3, -Math.PI+.3);
      this.tRightKneeRotZ = rule3(xTarget, -200, 200, .3+Math.PI/8, .3-Math.PI/8);
      this.tLeftKneeRotZ = rule3(xTarget, -200, 200, -.3+Math.PI/8, -.3-Math.PI/8);
      this.updateBody(10);
      this.mane.rotation.y = -.8*this.head.rotation.y;
      this.mane.rotation.x = -.8*this.head.rotation.x;
      var dt = 20000 / (xTarget*xTarget+yTarget*yTarget);
      dt = Math.max(Math.min(dt,1), .5);
      this.windTime += dt * deltaTime * 40;
      for (var i=0; i<this.maneParts.length; i++){
        var m = this.maneParts[i].mesh;
        var amp = this.maneParts[i].amp;
        var zOffset = this.maneParts[i].zOffset;
        var periodOffset = this.maneParts[i].periodOffset;
        m.position.z = zOffset + Math.sin(this.windTime+periodOffset)*amp*dt*2;   
      }
      this.leftEar.rotation.x = Math.cos(this.windTime)*Math.PI/16*dt; 
      this.rightEar.rotation.x = -Math.cos(this.windTime)*Math.PI/16*dt; 
      for (var i=0; i<this.mustaches.length; i++){
        var m = this.mustaches[i];
        var amp = (i<3) ? -Math.PI/8 : Math.PI/8;
        m.rotation.y = amp + Math.cos(this.windTime + i)*dt*amp;   
      };
      for (var i=0; i<this.bodyVertices.length; i++){
         var tvInit = this.bodyInitPositions[i];
          var tv = this.body.geometry.vertices[this.bodyVertices[i]];
          tv.x = tvInit.x + this.head.position.x;
      }
      this.body.geometry.verticesNeedUpdate = true;
    }

    function loop(){
      if(!isPlaying) {
        requestAnimationFrame(loop);
        return;
      }
      deltaTime = clock.getDelta();
      time += deltaTime;
      render();
      var xTarget = (mousePos.x-windowHalfX);
      var yTarget= (mousePos.y-windowHalfY);
      
      // Always look at the pointer direction, don't blow or cool
      lion.look(xTarget, yTarget);
      
      requestAnimationFrame(loop);
    }

    function render(){
      renderer.render(scene, camera);
    }

    function checkReady() {
      if (window.innerWidth === 0 || window.innerHeight === 0) {
        requestAnimationFrame(checkReady);
      } else {
        init();
        createLights();
        createFloor();
        createLion();
        // createFan(); disabled by request
        loop();
      }
    }
    
    // Bypass Android WebView window.onload bug securely
    checkReady();

    function rule3(v,vmin,vmax,tmin, tmax){
      var nv = Math.max(Math.min(v,vmax), vmin);
      var dv = vmax-vmin;
      var pc = (nv-vmin)/dv;
      var dt = tmax-tmin;
      var tv = tmin + (pc*dt);
      return tv;
    }
  <\/script>
</body>
</html>`;

export const RUNNER_3D_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <link href="https://fonts.googleapis.com/css?family=Voltaire" rel="stylesheet">
  <style>
    body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: linear-gradient(#5a768c, #dbe6e6); touch-action: none; }
    #world { position: absolute; width: 100%; height: 100%; background: transparent; overflow: hidden; z-index: 1; }
    canvas { position: absolute; top: 0; left: 0; width: 100vw !important; height: 100vh !important; z-index: 99 !important; display: block; }
    
    #gameoverInstructions {
      position: absolute; font-family: 'Voltaire', sans-serif; font-weight: bold; text-transform: uppercase;
      font-size: 80px; text-align: center; color: #ffc5a2; opacity: 0; left: 50%; top: 50%;
      width: 100%; transform: translate(-50%, -100%); user-select: none; transition: all 500ms ease-in-out; z-index: 100;
    }
    #gameoverInstructions.show { opacity: 1; transform: translate(-50%, -50%); transition: all 500ms ease-in-out; }
    
    #dist { position: absolute; left: 50%; top: 50px; transform: translate(-50%, 0%); user-select: none; z-index: 100; }
    .label { position: relative; font-family: 'Voltaire', sans-serif; text-transform: uppercase; color: #ffa873; font-size: 12px; letter-spacing: 2px; text-align: center; margin-bottom: 5px; }
    #distValue { position: relative; text-transform: uppercase; color: #dc5f45; font-size: 40px; font-family: 'Voltaire'; text-align: center; }
    
    #instructions { position: absolute; width: 100%; bottom: 0; margin: auto; margin-bottom: 50px; font-family: 'Voltaire', sans-serif; color: #dc5f45; font-size: 16px; letter-spacing: 1px; text-transform: uppercase; text-align: center; user-select: none; z-index: 100;}
    .lightInstructions { color: #5f9042; }
  </style>
  <script src="./three.min.js"><\/script>
  <script src="./TweenMax.min.js"><\/script>
</head>
<body>
  <div id="world"></div>

  <script>
    //THREEJS RELATED VARIABLES
    var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, gobalLight, shadowLight, backLight, renderer, container, controls, clock;
    var delta = 0, floorRadius = 200, speed = 6, distance = 0, level = 1, levelInterval, levelUpdateFreq = 3000;
    var initSpeed = 5, maxSpeed = 48, monsterPos = .65, monsterPosTarget = .65, floorRotation = 0;
    var collisionObstacle = 10, collisionBonus = 20, gameStatus = "play";
    var cameraPosGame = 160, cameraPosGameOver = 260, monsterAcceleration = 0.004;
    var malusClearColor = 0xb44b39, malusClearAlpha = 0;
    
    var fieldGameOver, fieldDistance;
    var HEIGHT, WIDTH, windowHalfX, windowHalfY, mousePos = { x: 0, y: 0 };
    var hero;
    var isPlaying = true; // For battery optimization

    // Materials
    var blackMat = new THREE.MeshPhongMaterial({ color: 0x100707, shading:THREE.FlatShading });
    var brownMat = new THREE.MeshPhongMaterial({ color: 0xb44b39, shininess:0, shading:THREE.FlatShading });
    var greenMat = new THREE.MeshPhongMaterial({ color: 0x7abf8e, shininess:0, shading:THREE.FlatShading });
    var pinkMat = new THREE.MeshPhongMaterial({ color: 0xdc5f45, shininess:0, shading:THREE.FlatShading });
    var lightBrownMat = new THREE.MeshPhongMaterial({ color: 0xe07a57, shading:THREE.FlatShading });
    var whiteMat = new THREE.MeshPhongMaterial({ color: 0xa49789,  shading:THREE.FlatShading });
    var skinMat = new THREE.MeshPhongMaterial({ color: 0xff9ea5, shading:THREE.FlatShading });

    var PI = Math.PI;

    //INIT THREE JS, SCREEN AND MOUSE EVENTS
    function initScreenAnd3D() {
      HEIGHT = window.innerHeight;
      WIDTH = window.innerWidth;
      windowHalfX = WIDTH / 2;
      windowHalfY = HEIGHT / 2;

      scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xd6eae6, 160,350);
      
      aspectRatio = WIDTH / HEIGHT;
      
      // THE MOBILE ZOOM TRICK: Wide FOV on mobile, standard 50 on desktop.
      fieldOfView = (WIDTH < 600) ? 90 : 50; 
      
      nearPlane = 1;
      farPlane = 2000;
      camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
      camera.position.x = 0;
      camera.position.z = cameraPosGame;
      camera.position.y = 30;
      camera.lookAt(new THREE.Vector3(0, 30, 0));

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio); 
      renderer.setClearColor( malusClearColor, malusClearAlpha);
      renderer.setSize(WIDTH, HEIGHT);
      renderer.shadowMap.enabled = true;

      container = document.getElementById('world');
      container.appendChild(renderer.domElement);

      window.addEventListener('resize', handleWindowResize, false);
      document.addEventListener('mousedown', handleMouseDown, false);
      document.addEventListener("touchstart", handleMouseDown, {passive: true});

      window.addEventListener("pauseWallpaper", () => isPlaying = false);
      window.addEventListener("playWallpaper", () => { if(!isPlaying){ isPlaying = true; clock.getDelta(); loop(); }});

      clock = new THREE.Clock();
    }

    function handleWindowResize() {
      HEIGHT = window.innerHeight; WIDTH = window.innerWidth;
      windowHalfX = WIDTH / 2; windowHalfY = HEIGHT / 2;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    }

    function handleMouseDown(event){
      if (gameStatus == "play") hero.jump();
      else if (gameStatus == "readyToReplay"){ replay(); }
    }

    function createLights() {
      globalLight = new THREE.AmbientLight(0xffffff, .9);
      shadowLight = new THREE.DirectionalLight(0xffffff, 1);
      shadowLight.position.set(-30, 40, 20);
      shadowLight.castShadow = true;
      shadowLight.shadow.camera.left = -400;
      shadowLight.shadow.camera.right = 400;
      shadowLight.shadow.camera.top = 400;
      shadowLight.shadow.camera.bottom = -400;
      shadowLight.shadow.camera.near = 1;
      shadowLight.shadow.camera.far = 2000;
      shadowLight.shadow.mapSize.width = shadowLight.shadow.mapSize.height = 2048;
      scene.add(globalLight);
      scene.add(shadowLight);
    }

    function createFloor() {
      floorShadow = new THREE.Mesh(new THREE.SphereGeometry(floorRadius, 50, 50), new THREE.MeshPhongMaterial({
        color: 0x7abf8e, specular:0x000000, shininess:1, transparent:true, opacity:.5
      }));
      floorShadow.receiveShadow = true;
      floorGrass = new THREE.Mesh(new THREE.SphereGeometry(floorRadius-.5, 50, 50), new THREE.MeshBasicMaterial({ color: 0x7abf8e }));
      floorGrass.receiveShadow = false;
      floor = new THREE.Group();
      floor.position.y = -floorRadius;
      floor.add(floorShadow);
      floor.add(floorGrass);
      scene.add(floor);
    }

    Hero = function() {
      this.status = "running";
      this.runningCycle = 0;
      this.mesh = new THREE.Group();
      this.body = new THREE.Group();
      this.mesh.add(this.body);
      
      var torsoGeom = new THREE.CubeGeometry(7, 7, 10, 1);
      this.torso = new THREE.Mesh(torsoGeom, brownMat);
      this.torso.position.z = 0; this.torso.position.y = 7; this.torso.castShadow = true;
      this.body.add(this.torso);
      
      var pantsGeom = new THREE.CubeGeometry(9, 9, 5, 1);
      this.pants = new THREE.Mesh(pantsGeom, whiteMat);
      this.pants.position.z = -3; this.pants.position.y = 0; this.pants.castShadow = true;
      this.torso.add(this.pants);
      
      var tailGeom = new THREE.CubeGeometry(3, 3, 3, 1);
      tailGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,-2));
      this.tail = new THREE.Mesh(tailGeom, lightBrownMat);
      this.tail.position.z = -4; this.tail.position.y = 5; this.tail.castShadow = true;
      this.torso.add(this.tail);
      
      this.torso.rotation.x = -Math.PI/8;
      
      var headGeom = new THREE.CubeGeometry(10, 10, 13, 1);
      headGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,7.5));
      this.head = new THREE.Mesh(headGeom, brownMat);
      this.head.position.z = 2; this.head.position.y = 11; this.head.castShadow = true;
      this.body.add(this.head);
      
      var cheekGeom = new THREE.CubeGeometry(1, 4, 4, 1);
      this.cheekR = new THREE.Mesh(cheekGeom, pinkMat);
      this.cheekR.position.x = -5; this.cheekR.position.z = 7; this.cheekR.position.y = -2.5; this.cheekR.castShadow = true;
      this.head.add(this.cheekR);
      
      this.cheekL = this.cheekR.clone();
      this.cheekL.position.x = - this.cheekR.position.x;
      this.head.add(this.cheekL);
      
      var noseGeom = new THREE.CubeGeometry(6, 6, 3, 1);
      this.nose = new THREE.Mesh(noseGeom, lightBrownMat);
      this.nose.position.z = 13.5; this.nose.position.y = 2.6; this.nose.castShadow = true;
      this.head.add(this.nose);
      
      var mouthGeom = new THREE.CubeGeometry(4, 2, 4, 1);
      mouthGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,3));
      mouthGeom.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/12));
      this.mouth = new THREE.Mesh(mouthGeom, brownMat);
      this.mouth.position.z = 8; this.mouth.position.y = -4; this.mouth.castShadow = true;
      this.head.add(this.mouth);
      
      var pawFGeom = new THREE.CubeGeometry(3,3,3, 1);
      this.pawFR = new THREE.Mesh(pawFGeom, lightBrownMat);
      this.pawFR.position.x = -2; this.pawFR.position.z = 6; this.pawFR.position.y = 1.5; this.pawFR.castShadow = true;
      this.body.add(this.pawFR);
      
      this.pawFL = this.pawFR.clone();
      this.pawFL.position.x = - this.pawFR.position.x; this.pawFL.castShadow = true;
      this.body.add(this.pawFL);
      
      var pawBGeom = new THREE.CubeGeometry(3,3,6, 1);
      this.pawBL = new THREE.Mesh(pawBGeom, lightBrownMat);
      this.pawBL.position.y = 1.5; this.pawBL.position.z = 0; this.pawBL.position.x = 5; this.pawBL.castShadow = true;
      this.body.add(this.pawBL);
      
      this.pawBR = this.pawBL.clone();
      this.pawBR.position.x = - this.pawBL.position.x; this.pawBR.castShadow = true;
      this.body.add(this.pawBR);
      
      var earGeom = new THREE.CubeGeometry(7, 18, 2, 1);
      earGeom.vertices[6].x+=2; earGeom.vertices[6].z+=.5;
      earGeom.vertices[7].x+=2; earGeom.vertices[7].z-=.5;
      earGeom.vertices[2].x-=2; earGeom.vertices[2].z-=.5;
      earGeom.vertices[3].x-=2; earGeom.vertices[3].z+=.5;
      earGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,9,0));
      
      this.earL = new THREE.Mesh(earGeom, brownMat);
      this.earL.position.x = 2; this.earL.position.z = 2.5; this.earL.position.y = 5; this.earL.rotation.z = -Math.PI/12; this.earL.castShadow = true;
      this.head.add(this.earL);
      
      this.earR = this.earL.clone();
      this.earR.position.x = -this.earL.position.x; this.earR.rotation.z = -this.earL.rotation.z; this.earR.castShadow = true;
      this.head.add(this.earR);
      
      var eyeGeom = new THREE.CubeGeometry(2,4,4);
      this.eyeL = new THREE.Mesh(eyeGeom, whiteMat);
      this.eyeL.position.x = 5; this.eyeL.position.z = 5.5; this.eyeL.position.y = 2.9; this.eyeL.castShadow = true;
      this.head.add(this.eyeL);
      
      var irisGeom = new THREE.CubeGeometry(.6,2,2);
      this.iris = new THREE.Mesh(irisGeom, blackMat);
      this.iris.position.x = 1.2; this.iris.position.y = 1; this.iris.position.z = 1;
      this.eyeL.add(this.iris);
      
      this.eyeR = this.eyeL.clone();
      this.eyeR.children[0].position.x = -this.iris.position.x;
      
      
      this.eyeR.position.x = -this.eyeL.position.x;
      this.head.add(this.eyeR);

      this.body.traverse(function(object) {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
    }

    BonusParticles = function(){
      this.mesh = new THREE.Group();
      var bigParticleGeom = new THREE.CubeGeometry(10,10,10,1);
      var smallParticleGeom = new THREE.CubeGeometry(5,5,5,1);
      this.parts = [];
      for (var i=0; i<10; i++){
        var partPink = new THREE.Mesh(bigParticleGeom, pinkMat);
        var partGreen = new THREE.Mesh(smallParticleGeom, greenMat);
        partGreen.scale.set(.5,.5,.5);
        this.parts.push(partPink);
        this.parts.push(partGreen);
        this.mesh.add(partPink);
        this.mesh.add(partGreen);
      }
    }

    BonusParticles.prototype.explose = function(){
      var _this = this;
      var explosionSpeed = .5;
      for(var i=0; i<this.parts.length; i++){
        var tx = -50 + Math.random()*100;
        var ty = -50 + Math.random()*100;
        var tz = -50 + Math.random()*100;
        var p = this.parts[i];
        p.position.set(0,0,0);
        p.scale.set(1,1,1);
        p.visible = true;
        var s = explosionSpeed + Math.random()*.5;
        TweenMax.to(p.position, s,{x:tx, y:ty, z:tz, ease:Power4.easeOut});
        TweenMax.to(p.scale, s,{x:.01, y:.01, z:.01, ease:Power4.easeOut, onComplete:removeParticle, onCompleteParams:[p]});
      }
    }

    function removeParticle(p){
      p.visible = false;
    }

    Hero.prototype.run = function(){
      this.status = "running";
      
      var s = Math.min(speed,maxSpeed);
      
      this.runningCycle += delta * s * .7;
      this.runningCycle = this.runningCycle % (Math.PI*2);
      var t = this.runningCycle;
      
      var amp = 4;
      var disp = .2;
      
      // BODY
      
      this.body.position.y = 6+ Math.sin(t - Math.PI/2)*amp;
      this.body.rotation.x = .2 + Math.sin(t - Math.PI/2)*amp*.1;
      
      this.torso.rotation.x =  Math.sin(t - Math.PI/2)*amp*.1;
      this.torso.position.y =  7 + Math.sin(t - Math.PI/2)*amp*.5;
      
      // MOUTH
      this.mouth.rotation.x = Math.PI/16 + Math.cos(t)*amp*.05;
      
      // HEAD
      this.head.position.z = 2 + Math.sin(t - Math.PI/2)*amp*.5;
      this.head.position.y = 8 + Math.cos(t - Math.PI/2)*amp*.7;
      this.head.rotation.x = -.2 + Math.sin(t + Math.PI)*amp*.1;
      
      // EARS
      this.earL.rotation.x = Math.cos(-Math.PI/2 + t)*(amp*.2);
      this.earR.rotation.x = Math.cos(-Math.PI/2 + .2 + t)*(amp*.3);
      
      // EYES
      this.eyeR.scale.y = this.eyeL.scale.y = .7 +  Math.abs(Math.cos(-Math.PI/4 + t*.5))*.6;
      
      // TAIL
      this.tail.rotation.x = Math.cos(Math.PI/2 + t)*amp*.3;
      
      // FRONT RIGHT PAW
      this.pawFR.position.y = 1.5 + Math.sin(t)*amp;
      this.pawFR.rotation.x = Math.cos(t ) * Math.PI/4;
      
      
      this.pawFR.position.z = 6 - Math.cos(t)*amp*2;
      
      // FRONT LEFT PAW
      
      this.pawFL.position.y = 1.5 + Math.sin(disp + t)*amp;
      this.pawFL.rotation.x = Math.cos( t ) * Math.PI/4;
      
      
      this.pawFL.position.z = 6 - Math.cos(disp+t)*amp*2;
      
      // BACK RIGHT PAW
      this.pawBR.position.y = 1.5 + Math.sin(Math.PI + t)*amp;
      this.pawBR.rotation.x = Math.cos(t + Math.PI*1.5) * Math.PI/3;
      
      
      this.pawBR.position.z = - Math.cos(Math.PI + t)*amp;
      
      // BACK LEFT PAW
      this.pawBL.position.y = 1.5 + Math.sin(Math.PI + t)*amp;
      this.pawBL.rotation.x = Math.cos(t + Math.PI *1.5) * Math.PI/3;
      
      
      this.pawBL.position.z = - Math.cos(Math.PI + t)*amp;
      
      
    }

    Hero.prototype.jump = function(){
      if (this.status == "jumping") return;
      this.status = "jumping";
      var _this = this;
      var totalSpeed = 10 / speed;
      var jumpHeight = 45;
      
      TweenMax.to(this.earL.rotation, totalSpeed, {x:"+=.3", ease:Back.easeOut});
      TweenMax.to(this.earR.rotation, totalSpeed, {x:"-=.3", ease:Back.easeOut});
      
      TweenMax.to(this.pawFL.rotation, totalSpeed, {x:"+=.7", ease:Back.easeOut});
      TweenMax.to(this.pawFR.rotation, totalSpeed, {x:"-=.7", ease:Back.easeOut});
      TweenMax.to(this.pawBL.rotation, totalSpeed, {x:"+=.7", ease:Back.easeOut});
      TweenMax.to(this.pawBR.rotation, totalSpeed, {x:"-=.7", ease:Back.easeOut});
      
      TweenMax.to(this.tail.rotation, totalSpeed, {x:"+=1", ease:Back.easeOut});
      
      TweenMax.to(this.mouth.rotation, totalSpeed, {x:.5, ease:Back.easeOut});
      
      TweenMax.to(this.mesh.position, totalSpeed/2, {y:jumpHeight, ease:Power2.easeOut});
      TweenMax.to(this.mesh.position, totalSpeed/2, {y:0, ease:Power4.easeIn, delay:totalSpeed/2, onComplete: function(){
        //t = 0;
        _this.status="running";
      }});
      
    }


    Monster = function(){
      
      this.runningCycle = 0;
      
      this.mesh = new THREE.Group();
      this.body = new THREE.Group();
      
      var torsoGeom = new THREE.CubeGeometry(15,15,20, 1);
      this.torso = new THREE.Mesh(torsoGeom, blackMat);
      
      var headGeom = new THREE.CubeGeometry(20,20,40, 1);
      headGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,20));
      this.head = new THREE.Mesh(headGeom, blackMat);
      this.head.position.z = 12;
      this.head.position.y = 2;
      
      var mouthGeom = new THREE.CubeGeometry(10,4,20, 1);
      mouthGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,-2,10));
      this.mouth = new THREE.Mesh(mouthGeom, blackMat);
      this.mouth.position.y = -8;
      this.mouth.rotation.x = .4;
      this.mouth.position.z = 4;
      
      this.heroHolder = new THREE.Group();
      this.heroHolder.position.z = 20;
      this.mouth.add(this.heroHolder);
      
      var toothGeom = new THREE.CubeGeometry(2,2,1,1);
      
      toothGeom.vertices[1].x-=1;
      toothGeom.vertices[4].x+=1;
      toothGeom.vertices[5].x+=1;
      toothGeom.vertices[0].x-=1;
      
      for(var i=0; i<3; i++){
        var toothf = new THREE.Mesh(toothGeom, whiteMat);
        toothf.position.x = -2.8 + i*2.5;
        toothf.position.y = 1;
        toothf.position.z = 19;
        
        var toothl = new THREE.Mesh(toothGeom, whiteMat);
        toothl.rotation.y = Math.PI/2;
        toothl.position.z = 12 + i*2.5;
        toothl.position.y = 1;
        toothl.position.x = 4;
        
        var toothr = toothl.clone();
        toothl.position.x = -4;
        
        this.mouth.add(toothf);
        this.mouth.add(toothl);
        this.mouth.add(toothr);
      }
      
      var tongueGeometry = new THREE.CubeGeometry(6,1,14);
      tongueGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,7));
      
      this.tongue = new THREE.Mesh(tongueGeometry, pinkMat);
      this.tongue.position.z = 2;
      this.tongue.rotation.x = -.2;
      this.mouth.add(this.tongue);
      
      var noseGeom = new THREE.CubeGeometry(4,4,4, 1);
      this.nose = new THREE.Mesh(noseGeom, pinkMat);
      this.nose.position.z = 39.5;
      this.nose.position.y = 9;
      this.head.add(this.nose);
      
      this.head.add(this.mouth);
      
      var eyeGeom = new THREE.CubeGeometry(2,3,3);
      
      this.eyeL = new THREE.Mesh(eyeGeom, whiteMat);
      this.eyeL.position.x = 10;
      this.eyeL.position.z = 5;
      this.eyeL.position.y = 5;
      this.eyeL.castShadow = true;
      this.head.add(this.eyeL);
      
      var irisGeom = new THREE.CubeGeometry(.6,1,1);
      
      this.iris = new THREE.Mesh(irisGeom, blackMat);
      this.iris.position.x = 1.2;
      this.iris.position.y = -1;
      this.iris.position.z = 1;
      this.eyeL.add(this.iris);
      
      this.eyeR = this.eyeL.clone();
      this.eyeR.children[0].position.x = -this.iris.position.x;
      this.eyeR.position.x = -this.eyeL.position.x;
      this.head.add(this.eyeR);
      
      
      var earGeom = new THREE.CubeGeometry(8, 6, 2, 1);
      earGeom.vertices[1].x-=4;
      earGeom.vertices[4].x+=4;
      earGeom.vertices[5].x+=4;
      earGeom.vertices[5].z-=2;
      earGeom.vertices[0].x-=4;
      earGeom.vertices[0].z-=2;

      
      earGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,3,0));
      
      this.earL = new THREE.Mesh(earGeom, blackMat);
      this.earL.position.x = 6;
      this.earL.position.z = 1;
      this.earL.position.y = 10;
      this.earL.castShadow = true;
      this.head.add(this.earL);
      
      this.earR = this.earL.clone();
      this.earR.position.x = -this.earL.position.x;
      this.earR.rotation.z = -this.earL.rotation.z;
      this.head.add(this.earR);
      
      var tailGeom = new THREE.CylinderGeometry(5,2, 20, 4, 1);
      tailGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,10,0));
      tailGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
      tailGeom.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI/4));
      
      this.tail = new THREE.Mesh(tailGeom, blackMat);
      this.tail.position.z = -10;
      this.tail.position.y = 4;
      this.torso.add(this.tail);
      
      
      var pawGeom = new THREE.CylinderGeometry(1.5,0,10);
      pawGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,-5,0));
      this.pawFL = new THREE.Mesh(pawGeom, blackMat);
      this.pawFL.position.y = -7.5;
      this.pawFL.position.z = 8.5;
      this.pawFL.position.x = 5.5;
      this.torso.add(this.pawFL);
      
      this.pawFR = this.pawFL.clone();
      this.pawFR.position.x = - this.pawFL.position.x;
      this.torso.add(this.pawFR);
      
      this.pawBR = this.pawFR.clone();
      this.pawBR.position.z = - this.pawFL.position.z;
      this.torso.add(this.pawBR);
      
      this.pawBL = this.pawBR.clone();
      this.pawBL.position.x = this.pawFL.position.x;
      this.torso.add(this.pawBL);
      
      this.mesh.add(this.body);
      this.torso.add(this.head);
      this.body.add(this.torso);
      
      this.torso.castShadow = true;
      this.head.castShadow = true;
      this.pawFL.castShadow = true;
      this.pawFR.castShadow = true;
      this.pawBL.castShadow = true;
      this.pawBR.castShadow = true;
      
      this.body.rotation.y = Math.PI/2;
    }

    Monster.prototype.run = function(){
      var s = Math.min(speed,maxSpeed);
      this.runningCycle += delta * s * .7;
      this.runningCycle = this.runningCycle % (Math.PI*2);
      var t = this.runningCycle;
      
      this.pawFR.rotation.x = Math.sin(t)*Math.PI/4;
      this.pawFR.position.y = -5.5 - Math.sin(t);
      this.pawFR.position.z = 7.5 + Math.cos(t);
      
      this.pawFL.rotation.x = Math.sin(t+.4)*Math.PI/4;
      this.pawFL.position.y = -5.5 - Math.sin(t+.4);
      this.pawFL.position.z = 7.5 + Math.cos(t+.4);
      
      this.pawBL.rotation.x = Math.sin(t+2)*Math.PI/4;
      this.pawBL.position.y = -5.5 - Math.sin(t+3.8);
      this.pawBL.position.z = -7.5 + Math.cos(t+3.8);
      
      this.pawBR.rotation.x = Math.sin(t+2.4)*Math.PI/4;
      this.pawBR.position.y = -5.5 - Math.sin(t+3.4);
      this.pawBR.position.z = -7.5 + Math.cos(t+3.4);
      
      this.torso.rotation.x = Math.sin(t)*Math.PI/8;
      this.torso.position.y = 3-Math.sin(t+Math.PI/2)*3;
      
      //this.head.position.y = 5-Math.sin(t+Math.PI/2)*2;
      this.head.rotation.x = -.1+Math.sin(-t-1)*.4;
      this.mouth.rotation.x = .2 + Math.sin(t+Math.PI+.3)*.4;
      
      this.tail.rotation.x = .2 + Math.sin(t-Math.PI/2);
      
      this.eyeR.scale.y = .5 + Math.sin(t+Math.PI)*.5;
    }

    Hero.prototype.nod = function(){
      var _this = this;
      var sp = .5 + Math.random();
      
      // HEAD
      var tHeadRotY = -Math.PI/6 + Math.random()* Math.PI/3;
      TweenMax.to(this.head.rotation, sp, {y:tHeadRotY, ease:Power4.easeInOut, onComplete:function(){_this.nod()}});
      
      // EARS
      var tEarLRotX =  Math.PI/4 + Math.random()* Math.PI/6;
      var tEarRRotX =  Math.PI/4 + Math.random()* Math.PI/6;
      
      TweenMax.to(this.earL.rotation, sp, {x:tEarLRotX, ease:Power4.easeInOut});
      TweenMax.to(this.earR.rotation, sp, {x:tEarRRotX, ease:Power4.easeInOut});
      
      
      // PAWS BACK LEFT
      
      var tPawBLRot = Math.random()*Math.PI/2;
      var tPawBLY = -4 + Math.random()*8;
      
      TweenMax.to(this.pawBL.rotation, sp/2, {x:tPawBLRot, ease:Power1.easeInOut, yoyo:true, repeat:2});
      TweenMax.to(this.pawBL.position, sp/2, {y:tPawBLY, ease:Power1.easeInOut, yoyo:true, repeat:2});
      
      
      // PAWS BACK RIGHT
      
      var tPawBRRot = Math.random()*Math.PI/2;
      var tPawBRY = -4 + Math.random()*8;
      TweenMax.to(this.pawBR.rotation, sp/2, {x:tPawBRRot, ease:Power1.easeInOut, yoyo:true, repeat:2});
      TweenMax.to(this.pawBR.position, sp/2, {y:tPawBRY, ease:Power1.easeInOut, yoyo:true, repeat:2});
      
      // PAWS FRONT LEFT
      
      var tPawFLRot = Math.random()*Math.PI/2;
      var tPawFLY = -4 + Math.random()*8;
      
      TweenMax.to(this.pawFL.rotation, sp/2, {x:tPawFLRot, ease:Power1.easeInOut, yoyo:true, repeat:2});
      
      TweenMax.to(this.pawFL.position, sp/2, {y:tPawFLY, ease:Power1.easeInOut, yoyo:true, repeat:2});
      
      // PAWS FRONT RIGHT
      
      var tPawFRRot = Math.random()*Math.PI/2;
      var tPawFRY = -4 + Math.random()*8;
      
      TweenMax.to(this.pawFR.rotation, sp/2, {x:tPawFRRot, ease:Power1.easeInOut, yoyo:true, repeat:2});
      
      TweenMax.to(this.pawFR.position, sp/2, {y:tPawFRY, ease:Power1.easeInOut, yoyo:true, repeat:2});
      
      // MOUTH
      var tMouthRot = Math.random()*Math.PI/8;
      TweenMax.to(this.mouth.rotation, sp, {x:tMouthRot, ease:Power1.easeInOut});
      // IRIS
      var tIrisY = -1 + Math.random()*2;
      var tIrisZ = -1 + Math.random()*2;
      var iris1 = this.iris;
      var iris2 = this.eyeR.children[0];
      TweenMax.to([iris1.position, iris2.position], sp, {y:tIrisY, z:tIrisZ, ease:Power1.easeInOut});
      
      //EYES
      if (Math.random()>.2) TweenMax.to([this.eyeR.scale, this.eyeL.scale], sp/8, {y:0, ease:Power1.easeInOut, yoyo:true, repeat:1});
      
    }

    Hero.prototype.hang = function(){
      var _this = this;
      var sp = 1;
      var ease = Power4.easeOut;
      
      TweenMax.killTweensOf(this.eyeL.scale);
      TweenMax.killTweensOf(this.eyeR.scale);
      
      this.body.rotation.x = 0;
      this.torso.rotation.x = 0;
      this.body.position.y = 0;
      this.torso.position.y = 7;
      
      TweenMax.to(this.mesh.rotation, sp, {y:0, ease:ease});
      TweenMax.to(this.mesh.position, sp, {y:-7, z:6, ease:ease});
      TweenMax.to(this.head.rotation, sp, {x:Math.PI/6, ease:ease, onComplete:function(){_this.nod();}});
      
      TweenMax.to(this.earL.rotation, sp, {x:Math.PI/3, ease:ease});
      TweenMax.to(this.earR.rotation, sp, {x:Math.PI/3, ease:ease});
      
      TweenMax.to(this.pawFL.position, sp, {y:-1, z:3, ease:ease});
      TweenMax.to(this.pawFR.position, sp, {y:-1, z:3, ease:ease});
      TweenMax.to(this.pawBL.position, sp, {y:-2, z:-3, ease:ease});
      TweenMax.to(this.pawBR.position, sp, {y:-2, z:-3, ease:ease});
      
      TweenMax.to(this.eyeL.scale, sp, {y:1, ease:ease});
      TweenMax.to(this.eyeR.scale, sp, {y:1, ease:ease});
    }

    Monster.prototype.nod = function(){
      var _this = this;
      var sp = 1 + Math.random()*2;
      
      // HEAD
      var tHeadRotY = -Math.PI/3 + Math.random()*.5;
      var tHeadRotX = Math.PI/3 - .2 +  Math.random()*.4;
      TweenMax.to(this.head.rotation, sp, {x:tHeadRotX, y:tHeadRotY, ease:Power4.easeInOut, onComplete:function(){_this.nod()}});
      
      // TAIL
      
      var tTailRotY = -Math.PI/4;
      TweenMax.to(this.tail.rotation, sp/8, {y:tTailRotY, ease:Power1.easeInOut, yoyo:true, repeat:8});
      
      // EYES
      
      TweenMax.to([this.eyeR.scale, this.eyeL.scale], sp/20, {y:0, ease:Power1.easeInOut, yoyo:true, repeat:1});
    }

    Monster.prototype.sit = function(){
      var sp = 1.2;
      var ease = Power4.easeOut;
      var _this = this;
      TweenMax.to(this.torso.rotation, sp, {x:-1.3, ease:ease});
      TweenMax.to(this.torso.position, sp, {y:-5, ease:ease, onComplete:function(){
        _this.nod();
        gameStatus = "readyToReplay";
      }});
      
      TweenMax.to(this.head.rotation, sp, {x:Math.PI/3, y :-Math.PI/3, ease:ease});
      TweenMax.to(this.tail.rotation, sp, {x:2, y:Math.PI/4, ease:ease});
      TweenMax.to(this.pawBL.rotation, sp, {x:-.1, ease:ease});
      TweenMax.to(this.pawBR.rotation, sp, {x:-.1, ease:ease});
      TweenMax.to(this.pawFL.rotation, sp, {x:1, ease:ease});
      TweenMax.to(this.pawFR.rotation, sp, {x:1, ease:ease});
      TweenMax.to(this.mouth.rotation, sp, {x:.3, ease:ease});
      TweenMax.to(this.eyeL.scale, sp, {y:1, ease:ease});
      TweenMax.to(this.eyeR.scale, sp, {y:1, ease:ease});
      
      //TweenMax.to(this.body.rotation, sp, {y:Math.PI/4});
      
    }


    Carrot = function() {
      this.angle = 0;
      this.mesh = new THREE.Group();
      
      var bodyGeom = new THREE.CylinderGeometry(5,3, 10, 4,1);
      bodyGeom.vertices[8].y+=2;
      bodyGeom.vertices[9].y-=3;
      
      this.body = new THREE.Mesh(bodyGeom, pinkMat);
      
      var leafGeom = new THREE.CubeGeometry(5,10,1,1);
      leafGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,5,0));
      leafGeom.vertices[2].x-=1;
      leafGeom.vertices[3].x-=1;
      leafGeom.vertices[6].x+=1;
      leafGeom.vertices[7].x+=1;
      
      this.leaf1 = new THREE.Mesh(leafGeom,greenMat);
      this.leaf1.position.y = 7;
      this.leaf1.rotation.z = .3;
      this.leaf1.rotation.x = .2;
      
      this.leaf2 = this.leaf1.clone();
      this.leaf2.scale.set(1,1.3,1);
      this.leaf2.position.y = 7;
      this.leaf2.rotation.z = -.3;
      this.leaf2.rotation.x = -.2;
      
      this.mesh.add(this.body);
      this.mesh.add(this.leaf1);
      this.mesh.add(this.leaf2);

      this.body.traverse(function(object) {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
    }

    Hedgehog = function() {
      this.angle = 0;
      this.status="ready";
      this.mesh = new THREE.Group();
      var bodyGeom = new THREE.CubeGeometry(6,6,6,1);
      this.body = new THREE.Mesh(bodyGeom, blackMat);
      
      var headGeom = new THREE.CubeGeometry(5,5,7,1);
      this.head= new THREE.Mesh(headGeom, lightBrownMat);
      this.head.position.z = 6;
      this.head.position.y = -.5;
      
      var noseGeom = new THREE.CubeGeometry(1.5,1.5,1.5,1);
      this.nose = new THREE.Mesh(noseGeom, blackMat);
      this.nose.position.z = 4;
      this.nose.position.y = 2;
      
      var eyeGeom = new THREE.CubeGeometry(1,3,3);
      
      this.eyeL = new THREE.Mesh(eyeGeom, whiteMat);
      this.eyeL.position.x = 2.2;
      this.eyeL.position.z = -.5;
      this.eyeL.position.y = .8;
      this.eyeL.castShadow = true;
      this.head.add(this.eyeL);
      
      var irisGeom = new THREE.CubeGeometry(.5,1,1);
      
      this.iris = new THREE.Mesh(irisGeom, blackMat);
      this.iris.position.x = .5;
      this.iris.position.y = .8;
      this.iris.position.z = .8;
      this.eyeL.add(this.iris);
      
      this.eyeR = this.eyeL.clone();
      this.eyeR.children[0].position.x = -this.iris.position.x;
      this.eyeR.position.x = -this.eyeL.position.x;
      
      var spikeGeom = new THREE.CubeGeometry(.5,2,.5,1);
      spikeGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,1,0));
      
      for (var i=0; i<9; i++){ 
        var row = (i%3);
        var col = Math.floor(i/3);
        var sb = new THREE.Mesh(spikeGeom, blackMat);
        sb.rotation.x =-Math.PI/2 + (Math.PI/12*row) -.5 +  Math.random();
        sb.position.z = -3;
        sb.position.y = -2 + row*2;
        sb.position.x = -2 + col*2; 
        this.body.add(sb); 
        var st = new THREE.Mesh(spikeGeom, blackMat);
        st.position.y = 3;
        st.position.x = -2 + row*2;
        st.position.z = -2 + col*2;
        st.rotation.z = Math.PI/6 - (Math.PI/6*row) -.5 +  Math.random();
        this.body.add(st);
        
        var sr = new THREE.Mesh(spikeGeom, blackMat);
        sr.position.x = 3;
        sr.position.y = -2 + row*2;
        sr.position.z = -2 + col*2;
        sr.rotation.z = -Math.PI/2 + (Math.PI/12*row) -.5 +  Math.random();
        this.body.add(sr);
        
        var sl = new THREE.Mesh(spikeGeom, blackMat);
        sl.position.x = -3;
        sl.position.y = -2 + row*2;
        sl.position.z = -2 + col*2;
        sl.rotation.z = Math.PI/2  - (Math.PI/12*row) -.5 +  Math.random();;
        this.body.add(sl); 
      }

      this.head.add(this.eyeR);
      var earGeom = new THREE.CubeGeometry(2, 2, .5, 1);
      this.earL = new THREE.Mesh(earGeom, lightBrownMat);
      this.earL.position.x = 2.5;
      this.earL.position.z = -2.5;
      this.earL.position.y = 2.5;
      this.earL.rotation.z = -Math.PI/12;
      this.earL.castShadow = true;
      this.head.add(this.earL);
      
      this.earR = this.earL.clone();
      this.earR.position.x = -this.earL.position.x;
      this.earR.rotation.z = -this.earL.rotation.z;
      this.earR.castShadow = true;
      this.head.add(this.earR);
      
      var mouthGeom = new THREE.CubeGeometry( 1, 1,.5, 1);
      this.mouth = new THREE.Mesh(mouthGeom, blackMat);
      this.mouth.position.z = 3.5;
      this.mouth.position.y = -1.5;
      this.head.add(this.mouth);
      
      
      this.mesh.add(this.body);
      this.body.add(this.head);
      this.head.add(this.nose);

      this.mesh.traverse(function(object) {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
    }

    Hedgehog.prototype.nod = function(){
      var _this = this;
      var speed = .1 + Math.random()*.5;
      var angle = -Math.PI/4 + Math.random()*Math.PI/2;
      TweenMax.to(this.head.rotation, speed, {y:angle, onComplete:function(){
        _this.nod();
      }});
    }


    function createHero() {
      hero = new Hero();
      hero.mesh.rotation.y = Math.PI/2;
      scene.add(hero.mesh);
      hero.nod();
    }

    function createMonster() {
      
      monster = new Monster();
      monster.mesh.position.z = 20;
      //monster.mesh.scale.set(1.2,1.2,1.2);
      scene.add(monster.mesh);
      updateMonsterPosition();
      
    }

    function updateMonsterPosition(){
      monster.run();
      monsterPosTarget -= delta*monsterAcceleration;
      monsterPos += (monsterPosTarget-monsterPos) *delta;
      if (monsterPos < .56){
        gameOver();
      }
      
      var angle = Math.PI*monsterPos;
      monster.mesh.position.y = - floorRadius + Math.sin(angle)*(floorRadius + 12);
      monster.mesh.position.x = Math.cos(angle)*(floorRadius+15);
      monster.mesh.rotation.z = -Math.PI/2 + angle;
    }

    function gameOver(){
      fieldGameOver.className = "show";
      gameStatus = "gameOver";
      monster.sit();
      hero.hang();
      monster.heroHolder.add(hero.mesh);
      TweenMax.to(this, 1, {speed:0});
      TweenMax.to(camera.position, 3, {z:cameraPosGameOver, y: 60, x:-30});
      carrot.mesh.visible = false;
      obstacle.mesh.visible = false;
      clearInterval(levelInterval);
    }

    function replay(){
      
      gameStatus = "preparingToReplay"
      
      fieldGameOver.className = "";
      
      TweenMax.killTweensOf(monster.pawFL.position);
      TweenMax.killTweensOf(monster.pawFR.position);
      TweenMax.killTweensOf(monster.pawBL.position);
      TweenMax.killTweensOf(monster.pawBR.position);
      
      TweenMax.killTweensOf(monster.pawFL.rotation);
      TweenMax.killTweensOf(monster.pawFR.rotation);
      TweenMax.killTweensOf(monster.pawBL.rotation);
      TweenMax.killTweensOf(monster.pawBR.rotation);
      
      TweenMax.killTweensOf(monster.tail.rotation);
      TweenMax.killTweensOf(monster.head.rotation);
      TweenMax.killTweensOf(monster.eyeL.scale);
      TweenMax.killTweensOf(monster.eyeR.scale);
      
      //TweenMax.killTweensOf(hero.head.rotation);
      
      monster.tail.rotation.y = 0;
        
      TweenMax.to(camera.position, 3, {z:cameraPosGame, x:0, y:30, ease:Power4.easeInOut});
      TweenMax.to(monster.torso.rotation,2, {x:0, ease:Power4.easeInOut});
      TweenMax.to(monster.torso.position,2, {y:0, ease:Power4.easeInOut});
      TweenMax.to(monster.pawFL.rotation,2, {x:0, ease:Power4.easeInOut});
      TweenMax.to(monster.pawFR.rotation,2, {x:0, ease:Power4.easeInOut});
      TweenMax.to(monster.mouth.rotation,2, {x:.5, ease:Power4.easeInOut});
      
      
      TweenMax.to(monster.head.rotation,2, {y:0, x:-.3, ease:Power4.easeInOut});
      
      TweenMax.to(hero.mesh.position, 2, { x:20, ease:Power4.easeInOut});
      TweenMax.to(hero.head.rotation, 2, { x:0, y:0, ease:Power4.easeInOut});
      TweenMax.to(monster.mouth.rotation, 2, {x:.2, ease:Power4.easeInOut});
      TweenMax.to(monster.mouth.rotation, 1, {x:.4, ease:Power4.easeIn, delay: 1, onComplete:function(){
        
        resetGame();
      }});
      
    }

    Tree = function(){
      this.mesh = new THREE.Object3D();
      this.trunc = new Trunc();
      this.mesh.add(this.trunc.mesh);
    }


    Trunc = function(){
      var truncHeight = 20 + Math.random()*30;
      var geom = new THREE.CylinderGeometry(2, 3, truncHeight, 5);
      geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, truncHeight/2, 0));
      
      this.mesh = new THREE.Mesh(geom, brownMat);
      this.mesh.castShadow = true;
      
      var greenerMat = new THREE.MeshPhongMaterial({ color: 0x4caf50, shininess:0, shading:THREE.FlatShading });
      var isPine = Math.random() > 0.5;
      
      if (isPine) {
        var leaves = new THREE.Mesh(new THREE.CylinderGeometry(0, 15, 30, 5), greenerMat);
        leaves.position.y = truncHeight + 5;
        leaves.castShadow = true;
        this.mesh.add(leaves);
        
        var leavesTop = new THREE.Mesh(new THREE.CylinderGeometry(0, 10, 20, 5), greenerMat);
        leavesTop.position.y = truncHeight + 20;
        leavesTop.castShadow = true;
        this.mesh.add(leavesTop);
      } else {
        var leaves = new THREE.Mesh(new THREE.SphereGeometry(16, 6, 6), greenerMat);
        leaves.position.y = truncHeight + 5;
        leaves.castShadow = true;
        this.mesh.add(leaves);
        
        var fluff2 = new THREE.Mesh(new THREE.SphereGeometry(10, 5, 5), greenerMat);
        fluff2.position.set(8, truncHeight+2, 0);
        fluff2.castShadow = true;
        this.mesh.add(fluff2);
        
        var fluff3 = new THREE.Mesh(new THREE.SphereGeometry(10, 5, 5), greenerMat);
        fluff3.position.set(-8, truncHeight+2, 0);
        fluff3.castShadow = true;
        this.mesh.add(fluff3);
      }
    }

    var firs = new THREE.Group();

    function createFirs(){
      
      var nTrees = 100;
       for(var i=0; i< nTrees; i++){
        var phi = i*(Math.PI*2)/nTrees;
        var theta = Math.PI/2;
        theta += .25 + Math.random()*.3; 
       
        var fir = new Tree();
        fir.mesh.position.x = Math.sin(theta)*Math.cos(phi)*floorRadius;
        fir.mesh.position.y = Math.sin(theta)*Math.sin(phi)*(floorRadius-10);
        fir.mesh.position.z = Math.cos(theta)*floorRadius; 
         
        var vec = fir.mesh.position.clone();
        var axis = new THREE.Vector3(0,1,0);
        fir.mesh.quaternion.setFromUnitVectors(axis, vec.clone().normalize());
        floor.add(fir.mesh); 
      }
    }

    function createCarrot(){
      carrot = new Carrot();
      scene.add(carrot.mesh);
    }

    function updateCarrotPosition(){
      carrot.mesh.rotation.y += delta * 6;
      carrot.mesh.rotation.z = Math.PI/2 - (floorRotation+carrot.angle);
      carrot.mesh.position.y = -floorRadius + Math.sin(floorRotation+carrot.angle) * (floorRadius+50);
      carrot.mesh.position.x = Math.cos(floorRotation+carrot.angle) * (floorRadius+50);
      
    }

    function updateObstaclePosition(){
      if (obstacle.status=="flying")return;
      
      // TODO fix this,
      if (floorRotation+obstacle.angle > 2.5 ){
        obstacle.angle = -floorRotation + Math.random()*.3;
        obstacle.body.rotation.y = Math.random() * Math.PI*2;
      }
      
      obstacle.mesh.rotation.z = floorRotation + obstacle.angle - Math.PI/2;
      obstacle.mesh.position.y = -floorRadius + Math.sin(floorRotation+obstacle.angle) * (floorRadius+3);
      obstacle.mesh.position.x = Math.cos(floorRotation+obstacle.angle) * (floorRadius+3);
      
    }

    function updateFloorRotation(){
      floorRotation += delta*.03 * speed;
      floorRotation = floorRotation%(Math.PI*2);
      floor.rotation.z = floorRotation;
    }

    function createObstacle(){
      obstacle = new Hedgehog();
      obstacle.body.rotation.y = -Math.PI/2;
      obstacle.mesh.scale.set(1.1,1.1,1.1);
      obstacle.mesh.position.y = floorRadius+4;
      obstacle.nod();
      scene.add(obstacle.mesh);
    }

    function createBonusParticles(){
      bonusParticles = new BonusParticles();
      bonusParticles.mesh.visible = false;
      scene.add(bonusParticles.mesh);
      
    }



    function checkCollision(){
      var db = hero.mesh.position.clone().sub(carrot.mesh.position.clone());
      var dm = hero.mesh.position.clone().sub(obstacle.mesh.position.clone());
      
      if(db.length() < collisionBonus){
        getBonus();
      }
      
      if(dm.length() < collisionObstacle && obstacle.status != "flying"){
        getMalus();
      }
    }

    function getBonus(){
      bonusParticles.mesh.position.copy(carrot.mesh.position);
      bonusParticles.mesh.visible = true;
      bonusParticles.explose();
      carrot.angle += Math.PI/2;
      //speed*=.95;
      monsterPosTarget += .025;
      
    }

    function getMalus(){
      obstacle.status="flying";
      var tx = (Math.random()>.5)? -20-Math.random()*10 : 20+Math.random()*5;
      TweenMax.to(obstacle.mesh.position, 4, {x:tx, y:Math.random()*50, z:350, ease:Power4.easeOut});
      TweenMax.to(obstacle.mesh.rotation, 4, {x:Math.PI*3, z:Math.PI*3, y:Math.PI*6, ease:Power4.easeOut, onComplete:function(){
        obstacle.status = "ready";
        obstacle.body.rotation.y = Math.random() * Math.PI*2;
        obstacle.angle = -floorRotation - Math.random()*.4;
        
        obstacle.angle = obstacle.angle%(Math.PI*2);
        obstacle.mesh.rotation.x = 0;
        obstacle.mesh.rotation.y = 0;
        obstacle.mesh.rotation.z = 0;
        obstacle.mesh.position.z = 0;
        
      }});
      //
      monsterPosTarget -= .04;
      TweenMax.from(window, .5, {malusClearAlpha:.5, onUpdate:function(){
        renderer.setClearColor(malusClearColor, malusClearAlpha );
      }})
    }

    function updateDistance(){
      distance += delta*speed;
      var d = distance/2;
      fieldDistance.innerHTML = Math.floor(d);
    }

    function updateLevel(){
      if (speed >= maxSpeed) return;
      level++;
      speed += 2; 
    }

    function loop(){
      if(!isPlaying) { requestAnimationFrame(loop); return; } // Pause loop to save battery
      delta = clock.getDelta();
      updateFloorRotation();
      
      if (gameStatus == "play"){
        
        if (hero.status == "running"){
          hero.run();
        }
        updateCarrotPosition();
        updateObstaclePosition();
        checkCollision();
      }
      
      render();  
      requestAnimationFrame(loop);
    }

    function render(){
      renderer.render(scene, camera);
    }

    function init(event){
      initScreenAnd3D();
      createLights();
      createFloor();
      createHero();
      createFirs();
      createCarrot();
      createBonusParticles();
      createObstacle();
      resetGame();
      loop();
      
      //setInterval(hero.blink.bind(hero), 3000);
    }

    function resetGame(){
      scene.add(hero.mesh);
      hero.mesh.rotation.y = Math.PI/2;
      hero.mesh.position.y = 0;
      hero.mesh.position.z = 0;
      hero.mesh.position.x = 0;

      monsterPos = .56;
      monsterPosTarget = .65;
      speed = initSpeed;
      level = 0;
      distance = 0;
      carrot.mesh.visible = true;
      obstacle.mesh.visible = true;
      gameStatus = "play";
      hero.status = "running";
      hero.nod();
    }

    function initUI(){
      fieldDistance = document.getElementById("distValue");
      fieldGameOver = document.getElementById("gameoverInstructions");
      
    }

    // Load instantly (bypassing window.onload bug in Android)
    function checkReady() {
      if (window.innerWidth === 0 || window.innerHeight === 0) {
        requestAnimationFrame(checkReady);
      } else {
        init();
      }
    }
    checkReady();

  <\/script>
</body>
</html>`;

export const FISH_3D_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <style>
    body, html { 
      margin: 0; padding: 0; width: 100%; height: 100%; 
      overflow: hidden; touch-action: none; 
      background: linear-gradient(#8ee4ae, #e9eba3); 
    }
    #world { position: absolute; width: 100%; height: 100%; overflow: hidden; z-index: 1; }
    canvas { position: absolute; top: 0; left: 0; width: 100vw !important; height: 100vh !important; z-index: 99 !important; display: block; }
  </style>
  <script src="./three.min.js"><\/script>
</head>
<body>
  <div id="world"></div>

  <script>
    var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, shadowLight, light, renderer, container;
    var HEIGHT, WIDTH, windowHalfX, windowHalfY, xLimit, yLimit;
    
    // FISH BODY PARTS
    var fish, bodyFish, tailFish, topFish, sideRightFish, sideLeftFish, rightIris, leftIris, rightEye, leftEye, lipsFish, tooth1, tooth2, tooth3, tooth4, tooth5;

    // FISH SPEED & COLORS
    var fishFastColor = {r:255, g:0, b:224}; 
    var fishSlowColor = {r:0, g:207, b:255}; 
    var angleFin = 0; 
    var colors = ['#dff69e', '#00ceff', '#002bca', '#ff00e0', '#3f159f', '#71b583', '#00a2ff'];

    // PARTICLES
    var flyingParticles = []; 
    var waitingParticles = [];
    var maxParticlesZ = 600; 

    // PHYSICS & MISC
    var speed = {x:0, y:0};
    var smoothing = 10;
    var mousePos = {x:0, y:0};
    var halfPI = Math.PI/2;
    var isPlaying = true;
    var particleInterval;

    function init(){
      scene = new THREE.Scene();
      HEIGHT = window.innerHeight || window.screen.height;
      WIDTH = window.innerWidth || window.screen.width;
      aspectRatio = WIDTH / HEIGHT;
      
      // MOBILE ZOOM TRICK
      fieldOfView = (WIDTH < 600) ? 100 : 60; 
      
      nearPlane = 1; 
      farPlane = 2000; 
      camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
      camera.position.z = 1000;  
      
      renderer = new THREE.WebGLRenderer({alpha: true, antialias: false, powerPreference: "high-performance"});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(WIDTH, HEIGHT);
      container = document.getElementById('world');
      container.appendChild(renderer.domElement);
       
      var ang = (fieldOfView/2)* Math.PI / 180; 
      yLimit = (camera.position.z + maxParticlesZ) * Math.tan(ang); 
      xLimit = yLimit * camera.aspect;
       
      windowHalfX = WIDTH / 2;
      windowHalfY = HEIGHT / 2;
      
      window.addEventListener('resize', onWindowResize, false);
      document.addEventListener('mousemove', handleMouseMove, false);
      document.addEventListener('touchstart', handleTouchStart, {passive: false});
      document.addEventListener('touchend', handleTouchEnd, false);
      document.addEventListener('touchmove', handleTouchMove, {passive: false});

      // Battery Optimization
      window.addEventListener("pauseWallpaper", () => {
        isPlaying = false;
        clearInterval(particleInterval);
      });
      window.addEventListener("playWallpaper", () => { 
        if(!isPlaying){ 
          isPlaying = true; 
          particleInterval = setInterval(flyParticle, 70);
          loop(); 
        }
      });
    }

    function onWindowResize() {
      HEIGHT = window.innerHeight; WIDTH = window.innerWidth;
      windowHalfX = WIDTH / 2; windowHalfY = HEIGHT / 2;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix(); 
      var ang = (fieldOfView/2)* Math.PI / 180; 
      yLimit = (camera.position.z + maxParticlesZ) * Math.tan(ang); // Fixed author typo here
      xLimit = yLimit * camera.aspect;
    }

    function handleMouseMove(event) {
      mousePos = {x:event.clientX, y:event.clientY};
      updateSpeed();
    }

    function handleTouchStart(event) {
      if (event.touches.length > 0) {
        mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
        updateSpeed();
      }
    }

    function handleTouchEnd(event) {
        mousePos = {x:windowHalfX, y:windowHalfY}; // Reset to center when released
        updateSpeed();
    }

    function handleTouchMove(event) {
      if (event.touches.length > 0) {
        mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
        updateSpeed();
      }
    }

    function updateSpeed(){
      speed.x = (mousePos.x / WIDTH)*100;
      speed.y = (mousePos.y-windowHalfY) / 10;
    }

    function loop() {
      if(!isPlaying) { requestAnimationFrame(loop); return; }

      fish.rotation.z += ((-speed.y/50)-fish.rotation.z)/smoothing;
      fish.rotation.x += ((-speed.y/50)-fish.rotation.x)/smoothing;
      fish.rotation.y += ((-speed.y/50)-fish.rotation.y)/smoothing;
      
      fish.position.x += (((mousePos.x - windowHalfX)) - fish.position.x) / smoothing;
      fish.position.y += ((-speed.y*10)-fish.position.y)/smoothing;
      
      rightEye.rotation.z = leftEye.rotation.z = -speed.y/150;
      rightIris.position.x = leftIris.position.y = -10 - speed.y/2;
      
      rightEye.scale.set(1,1-(speed.x/150),1);
      leftEye.scale.set(1,1-(speed.x/150),1);
      
      var s2 = speed.x/100; 
      var s3 = speed.x/300; 
      
      angleFin += s2;
      var backTailCycle = Math.cos(angleFin); 
      var sideFinsCycle = Math.sin(angleFin/5);
      
      tailFish.rotation.y = backTailCycle*.5;
      topFish.rotation.x = sideFinsCycle*.5;
      sideRightFish.rotation.x = halfPI + sideFinsCycle*.2;
      sideLeftFish.rotation.x = halfPI + sideFinsCycle*.2;
      
      // Removed dynamic color shifting so bird stays visibly distinct
      
      fish.scale.set(1+s3,1-s3,1-s3);
      
      for (var i=0; i<flyingParticles.length; i++){
        var particle = flyingParticles[i];
        particle.rotation.y += (1/particle.scale.x) *.05;
        particle.rotation.x += (1/particle.scale.x) *.05;
        particle.rotation.z += (1/particle.scale.x) *.05;
        particle.position.x += -10 -(1/particle.scale.x) * speed.x *.2;
        particle.position.y += (1/particle.scale.x) * speed.y *.2;
        if (particle.position.x < -xLimit - 80){ 
          scene.remove(particle);
          waitingParticles.push(flyingParticles.splice(i,1)[0]); 
          i--;
        }
      }
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }

    function createLight() {
      light = new THREE.HemisphereLight(0xffffff, 0xffffff, .3)
      scene.add(light);
      shadowLight = new THREE.DirectionalLight(0xffffff, .8);
      shadowLight.position.set(1, 1, 1);
      scene.add(shadowLight);
    }

    function createFish(){
      fish = new THREE.Group();
      
      var bodyMat = new THREE.MeshLambertMaterial({ color: 0xcc0000 , shading: THREE.FlatShading });
      var bodyGeom = new THREE.SphereGeometry(60, 24, 24);
      bodyFish = new THREE.Mesh(bodyGeom, bodyMat);
      
      var bellyMat = new THREE.MeshLambertMaterial({ color: 0xeadbba , shading: THREE.FlatShading });
      var bellyGeom = new THREE.SphereGeometry(45, 16, 16);
      bellyGeom.applyMatrix( new THREE.Matrix4().makeScale( 1, 0.4, 1 ) );
      tooth3 = new THREE.Mesh(bellyGeom, bellyMat); // Using tooth3 for belly
      tooth3.position.y = -35;
      tooth3.position.x = 20;

      var tuftGeom = new THREE.BoxGeometry(10, 30, 10);
      tailFish = new THREE.Mesh(tuftGeom, bodyMat);
      tailFish.position.x = -65;
      tailFish.rotation.z = -halfPI/2;
      
      topFish = new THREE.Mesh(tuftGeom, bodyMat);
      topFish.position.y = 65;
      topFish.rotation.z = halfPI/6;
      
      sideRightFish = new THREE.Mesh(tuftGeom, bodyMat);
      sideRightFish.position.z = -60;
      sideRightFish.rotation.x = halfPI;
      
      sideLeftFish = new THREE.Mesh(tuftGeom, bodyMat);
      sideLeftFish.position.z = 60;
      sideLeftFish.rotation.x = halfPI;
      
      var beakMat = new THREE.MeshLambertMaterial({ color: 0xffcc00 , shading: THREE.FlatShading });
      var beakGeom = new THREE.CylinderGeometry(0, 15, 40, 4, 1);
      beakGeom.applyMatrix( new THREE.Matrix4().makeRotationZ(-halfPI) );
      lipsFish = new THREE.Mesh(beakGeom, beakMat);
      lipsFish.position.x = 65;
      lipsFish.position.y = -5;
      
      var eyeMat = new THREE.MeshLambertMaterial({ color: 0xffffff, shading: THREE.FlatShading });
      var eyeGeom = new THREE.SphereGeometry(20, 16, 16);
      eyeGeom.applyMatrix( new THREE.Matrix4().makeScale( 0.5, 1, 1 ) ); 
      
      rightEye = new THREE.Mesh(eyeGeom,eyeMat );
      rightEye.position.z = -18;
      rightEye.position.x = 45;
      rightEye.position.y = 15;
      
      leftEye = new THREE.Mesh(eyeGeom,eyeMat );
      leftEye.position.z = 18;
      leftEye.position.x = 45;
      leftEye.position.y = 15;
      
      var irisMat = new THREE.MeshLambertMaterial({ color: 0x111111, shading: THREE.FlatShading });
      var irisGeom = new THREE.SphereGeometry(5, 8, 8);
      
      rightIris = new THREE.Mesh(irisGeom,irisMat );
      rightIris.position.z = -22;
      rightIris.position.x = 55;
      rightIris.position.y = 15;
      
      leftIris = new THREE.Mesh(irisGeom,irisMat );
      leftIris.position.z = 22;
      leftIris.position.x = 55;
      leftIris.position.y = 15;
      
      var browMat = new THREE.MeshLambertMaterial({ color: 0x111111, shading: THREE.FlatShading });
      var browGeom = new THREE.BoxGeometry(15, 8, 35);
      
      // We map eyebrows to tooth1 and tooth2 to re-use globals
      tooth1 = new THREE.Mesh(browGeom, browMat);
      tooth1.position.set(45, 33, -20);
      tooth1.rotation.set(-0.2, 0, 0.4);
      
      tooth2 = new THREE.Mesh(browGeom, browMat);
      tooth2.position.set(45, 33, 20);
      tooth2.rotation.set(0.2, 0, 0.4);
      
      fish.add(bodyFish);
      fish.add(tooth3); // Belly
      fish.add(tailFish);
      fish.add(topFish);
      fish.add(sideRightFish);
      fish.add(sideLeftFish);
      fish.add(lipsFish);
      fish.add(rightEye);
      fish.add(leftEye);
      fish.add(rightIris);
      fish.add(leftIris);
      fish.add(tooth1); // Right Brow
      fish.add(tooth2); // Left Brow
      
      fish.rotation.y = -Math.PI/4;
      scene.add(fish);
    }

    function createParticle(){
      var particle, geometryCore, ray, w,h,d, sh, sv;
      var rnd = Math.random();
      
      if (rnd<.33){
        w = 10 + Math.random()*30; h = 10 + Math.random()*30; d = 10 + Math.random()*30;
        geometryCore = new THREE.BoxGeometry(w,h,d);
      }
      else if (rnd<.66){
        ray = 10 + Math.random()*20;
        geometryCore = new THREE.TetrahedronGeometry(ray);
      }
      else{
        ray = 5+Math.random()*30; sh = 2 + Math.floor(Math.random()*2); sv = 2 + Math.floor(Math.random()*2);
        geometryCore = new THREE.SphereGeometry(ray, sh, sv);
      }
      
      var materialCore = new THREE.MeshLambertMaterial({ color: getRandomColor(), shading: THREE.FlatShading });
      particle = new THREE.Mesh(geometryCore, materialCore);
      return particle;
    }

    function getParticle(){
      if (waitingParticles.length) { return waitingParticles.pop(); }
      else { return createParticle(); }
    }

    function flyParticle(){
      var particle = getParticle();
      particle.position.x = xLimit;
      particle.position.y = -yLimit + Math.random()*yLimit*2;
      particle.position.z = Math.random()*maxParticlesZ;
      var s = .1 + Math.random();
      particle.scale.set(s,s,s);
      flyingParticles.push(particle);
      scene.add(particle);
    }

    function getRandomColor(){
      var hex = colors[Math.floor(Math.random()*colors.length)];
      return new THREE.Color(hex);
    }


    // Load instantly (bypassing window.onload bug in Android)
    function checkReady() {
      if (window.innerWidth === 0 || window.innerHeight === 0) {
        requestAnimationFrame(checkReady);
      } else {
        init();
        createLight();
        createFish();
        createParticle();
        loop();
        particleInterval = setInterval(flyParticle, 70); 
      }
    }
    checkReady();

  <\/script>
</body>
</html>`;

export const DRAGON_3D_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <style>
    body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #652e37; touch-action: none; }
    #world { position: absolute; width: 100%; height: 100%; overflow: hidden; z-index: 1; }
    canvas { position: absolute; top: 0; left: 0; width: 100vw !important; height: 100vh !important; z-index: 99 !important; display: block; }
    
    #instructions {
      position: absolute; width: 100%; top: 50%; margin-top: 150px; font-family: system-ui, sans-serif;
      color: #fdde8c; font-size: 1.1em; text-transform: uppercase; text-align: center;
      line-height: 1.5; user-select: none; z-index: 100; pointer-events: none;
    }
    .lightInstructions { color: #f89a78; font-size: 0.8em; font-weight: bold; }

    #power {
      position: absolute; width: 100%; top: 50%; margin-top: -220px; font-family: system-ui, sans-serif;
      color: #481f26; font-size: 4em; font-weight: 800; text-transform: uppercase; text-align: center;
      line-height: 1.5; user-select: none; z-index: 100; pointer-events: none;
    }
  </style>
  <script src="./three.min.js"><\/script>
  <script src="./TweenMax.min.js"><\/script>
</head>
<body>
  <div id="world"></div>
  <div id="instructions">Hold to build a sneeze<br/><span class="lightInstructions">- Swipe to rotate -</span></div>
  <div id="power">00</div>

  <script>
    // --- MAIN ENGINE ---
    var scene, camera, renderer, container, clock;
    var env, floor, dragon, sneezingRate = 0, fireRate = 0, maxSneezingRate = 8, sneezeDelay = 500, awaitingSmokeParticles = [], timeSmoke = 0, timeFire = 0, globalSpeedRate = 1, sneezeTimeout, powerField;
    var HEIGHT, WIDTH, isPlaying = true;
    
    // --- NATIVE TOUCH SWIPE ENGINE ---
    var isDragging = false, prevMouseX = 0, targetRotation = Math.PI/6;

    function init() {
      powerField = document.getElementById('power');
      scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x652e37, 350, 500);

      HEIGHT = window.innerHeight || window.screen.height;
      WIDTH = window.innerWidth || window.screen.width;
      
      // MOBILE ZOOM TRICK: Wide FOV and pulled back camera
      var fieldOfView = (WIDTH < 600) ? 80 : 60;
      var camZ = (WIDTH < 600) ? 400 : 300;
      
      camera = new THREE.PerspectiveCamera(fieldOfView, WIDTH/HEIGHT, 1, 2000);
      camera.position.set(-250, 100, camZ);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(WIDTH, HEIGHT);
      renderer.shadowMap.enabled = true;
      
      container = document.getElementById('world');
      container.appendChild(renderer.domElement);

      window.addEventListener('resize', onWindowResize, false);
      
      // TOUCH & MOUSE SWIPE LISTENERS
      document.addEventListener('mousedown', (e) => { isDragging = true; prevMouseX = e.clientX; });
      document.addEventListener('mousemove', (e) => { if(isDragging) { targetRotation += (e.clientX - prevMouseX) * 0.01; prevMouseX = e.clientX; }});
      document.addEventListener('mouseup', handleInteractionEnd, false);
      
      document.addEventListener('touchstart', (e) => { if(e.touches.length > 0) { isDragging = true; prevMouseX = e.touches[0].pageX; }}, {passive: true});
      document.addEventListener('touchmove', (e) => { if(isDragging && e.touches.length > 0) { targetRotation += (e.touches[0].pageX - prevMouseX) * 0.01; prevMouseX = e.touches[0].pageX; }}, {passive: true});
      document.addEventListener('touchend', handleInteractionEnd, false);

      // BATTERY OPTIMIZATION
      window.addEventListener("pauseWallpaper", () => isPlaying = false);
      window.addEventListener("playWallpaper", () => { if(!isPlaying){ isPlaying = true; clock.getDelta(); loop(); }});

      clock = new THREE.Clock();
    }

    function onWindowResize() {
      HEIGHT = window.innerHeight; WIDTH = window.innerWidth;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    }

    function handleInteractionEnd() {
      isDragging = false;
      if (sneezeTimeout) clearTimeout(sneezeTimeout);
      sneezingRate += (maxSneezingRate - sneezingRate) / 10;
      powerField.innerHTML = parseInt(sneezingRate*100/maxSneezingRate);
      dragon.prepareToSneeze(sneezingRate);
      sneezeTimeout = setTimeout(sneeze, sneezeDelay*globalSpeedRate);
      dragon.isSneezing = true;
    }

    function sneeze() {
      dragon.sneeze(sneezingRate);
      sneezingRate = 0;
      powerField.innerHTML = "00";
    }

    function createLights() {
      var light = new THREE.HemisphereLight(0xffffff, 0xb3858c, .8);
      var shadowLight = new THREE.DirectionalLight(0xffffff, .8);
      shadowLight.position.set(-100, 100, 50);
      shadowLight.castShadow = true;
      var backLight = new THREE.DirectionalLight(0xffffff, .4);
      backLight.position.set(200, 100, 100);
      backLight.castShadow = true;
      scene.add(backLight);
      scene.add(light);
      scene.add(shadowLight);
    }

    function makeCube(mat, w, h, d, posX, posY, posZ, rotX, rotY, rotZ) {
      var geom = new THREE.BoxGeometry(w, h, d);
      var mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(posX, posY, posZ);
      mesh.rotation.set(rotX, rotY, rotZ);
      return mesh;
    }

    function createFloor() {
      env = new THREE.Group();
      floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshBasicMaterial({ color: 0X652e37 }));
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -36;
      floor.receiveShadow = true;
      env.add(floor);
      scene.add(env);
    }

    Dragon = function() {
      this.tailAmplitude = 3; this.tailAngle = 0; this.tailSpeed = .07;
      this.wingAmplitude = Math.PI / 8; this.wingAngle = 0; this.wingSpeed = 0.1;
      this.isSneezing = false;
      this.threegroup = new THREE.Group(); 

      var greenMat = new THREE.MeshLambertMaterial({ color: 0x5da683, shading: THREE.FlatShading });
      var lightGreenMat = new THREE.MeshLambertMaterial({ color: 0x95c088, shading: THREE.FlatShading });
      var yellowMat = new THREE.MeshLambertMaterial({ color: 0xfdde8c, shading: THREE.FlatShading });
      var redMat = new THREE.MeshLambertMaterial({ color: 0xcb3e4c, shading: THREE.FlatShading });
      var whiteMat = new THREE.MeshLambertMaterial({ color: 0xfaf3d7, shading: THREE.FlatShading });
      var brownMat = new THREE.MeshLambertMaterial({ color: 0x874a5c, shading: THREE.FlatShading });
      var blackMat = new THREE.MeshLambertMaterial({ color: 0x403133, shading: THREE.FlatShading });

      this.body = new THREE.Group();
      this.belly = makeCube(greenMat, 30, 30, 40, 0, 0, 0, 0, 0, Math.PI / 4);

      this.wingL = makeCube(yellowMat, 5, 30, 20, 15, 15, 0, -Math.PI / 4, 0, -Math.PI / 4);
      this.wingL.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 15, 10));
      this.wingR = this.wingL.clone();
      this.wingR.position.x = -this.wingL.position.x;
      this.wingR.rotation.z = -this.wingL.rotation.z;

      var pikeBodyGeom = new THREE.CylinderGeometry(0, 10, 10, 4, 1);
      this.pikeBody1 = new THREE.Mesh(pikeBodyGeom, greenMat);
      this.pikeBody1.scale.set(.2, 1, 1);
      this.pikeBody1.position.set(0, 26, 10);
      this.pikeBody2 = this.pikeBody1.clone(); this.pikeBody2.position.z = 0;
      this.pikeBody3 = this.pikeBody1.clone(); this.pikeBody3.position.z = -10;

      this.tail = new THREE.Group();
      this.tail.position.set(0, 10, -20);
      var tailMat = new THREE.LineBasicMaterial({ color: 0x5da683, linewidth: 5 });
      var tailGeom = new THREE.Geometry();
      tailGeom.vertices.push( new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 5, -10), new THREE.Vector3(0, -5, -20), new THREE.Vector3(0, 0, -30) );
      this.tailLine = new THREE.Line(tailGeom, tailMat);

      var pikeGeom = new THREE.CylinderGeometry(0, 10, 10, 4, 1);
      pikeGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
      this.tailPike = new THREE.Mesh(pikeGeom, yellowMat);
      this.tailPike.scale.set(.2, 1, 1);
      this.tailPike.position.set(0, 0, -35);

      this.tail.add(this.tailLine); this.tail.add(this.tailPike);

      this.body.add(this.belly); this.body.add(this.wingL); this.body.add(this.wingR);
      this.body.add(this.tail); this.body.add(this.pikeBody1); this.body.add(this.pikeBody2); this.body.add(this.pikeBody3);

      this.head = new THREE.Group();
      this.face = makeCube(greenMat, 60, 50, 80, 0, 25, 40, 0, 0, 0);
      
      var hornGeom = new THREE.CylinderGeometry(0, 6, 10, 4, 1);
      this.hornL = new THREE.Mesh(hornGeom, yellowMat);
      this.hornL.position.set(10, 55, 10);
      this.hornR = this.hornL.clone(); this.hornR.position.x = -10;

      this.earL = makeCube(greenMat, 5, 10, 20, 32, 42, 2, 0, 0, 0);
      this.earL.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 5, -10));
      this.earL.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 4));
      this.earL.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI / 4));
      this.earR = makeCube(greenMat, 5, 10, 20, -32, 42, 2, 0, 0, 0);
      this.earR.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 5, -10));
      this.earR.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 4));
      this.earR.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI / 4));

      this.mouth = new THREE.Group();
      this.mouth.position.set(0, 3, 50);
      this.jaw = makeCube(greenMat, 30, 10, 30, 0, -5, 15, 0, 0, 0);
      this.tongue = makeCube(redMat, 20, 10, 20, 0, -3, 15, 0, 0, 0);
      this.mouth.add(this.jaw); this.mouth.add(this.tongue);
      
      var smileGeom = new THREE.TorusGeometry( 6, 2, 2, 10, Math.PI );
      this.smile = new THREE.Mesh(smileGeom, blackMat);
      this.smile.position.set(0, 5, 82);
      this.smile.rotation.z = -Math.PI;
      
      this.cheekL = makeCube(lightGreenMat, 4, 20, 20, 30, 18, 55, 0, 0, 0);
      this.cheekR = this.cheekL.clone(); this.cheekR.position.x = -this.cheekL.position.x;
      
      this.eyeL = makeCube(whiteMat, 10, 22, 22, 27, 34, 18, 0, 0, 0);
      this.eyeR = this.eyeL.clone(); this.eyeR.position.x = -27;
      this.irisL = makeCube(brownMat, 10, 12, 12, 28, 30, 24, 0, 0, 0);
      this.irisR = this.irisL.clone(); this.irisR.position.x = -this.irisL.position.x;
      this.noseL = makeCube(blackMat, 5, 5, 8, 5, 40, 77, 0, 0, 0);
      this.noseR = this.noseL.clone(); this.noseR.position.x = -this.noseL.position.x;

      this.head.position.z = 30;
      this.head.add(this.face); this.head.add(this.hornL); this.head.add(this.hornR);
      this.head.add(this.earL); this.head.add(this.earR); this.head.add(this.mouth);
      this.head.add(this.eyeL); this.head.add(this.eyeR); this.head.add(this.irisL);
      this.head.add(this.irisR); this.head.add(this.noseL); this.head.add(this.noseR);
      this.head.add(this.cheekL); this.head.add(this.cheekR); this.head.add(this.smile);
      
      this.legFL = makeCube(greenMat, 20, 10, 20, 20, -30, 15, 0, 0, 0);
      this.legFR = this.legFL.clone(); this.legFR.position.x = -30;
      this.legBL = this.legFL.clone(); this.legBL.position.z = -15;
      this.legBR = this.legBL.clone(); this.legBR.position.x = -30;

      this.threegroup.add(this.body); this.threegroup.add(this.head);
      this.threegroup.add(this.legFL); this.threegroup.add(this.legFR);
      this.threegroup.add(this.legBL); this.threegroup.add(this.legBR);

      this.threegroup.traverse(function(object) {
        if (object instanceof THREE.Mesh) { object.castShadow = true; object.receiveShadow = true; }
      });
    }

    Dragon.prototype.update = function() {
      this.tailAngle += this.tailSpeed/globalSpeedRate;
      this.wingAngle += this.wingSpeed/globalSpeedRate;
      for (var i = 0; i < this.tailLine.geometry.vertices.length; i++) {
        var v = this.tailLine.geometry.vertices[i];
        v.y = Math.sin(this.tailAngle - (Math.PI / 3) * i) * this.tailAmplitude * i * i;
        v.x = Math.cos(this.tailAngle / 2 + (Math.PI / 10) * i) * this.tailAmplitude * i * i;
        if (i == this.tailLine.geometry.vertices.length - 1) {
          this.tailPike.position.set(v.x, v.y, this.tailPike.position.z);
          this.tailPike.rotation.x = (v.y / 30);
        }
      }
      this.tailLine.geometry.verticesNeedUpdate = true;
      this.wingL.rotation.z = -Math.PI / 4 + Math.cos(this.wingAngle) * this.wingAmplitude;
      this.wingR.rotation.z = Math.PI / 4 - Math.cos(this.wingAngle) * this.wingAmplitude;
    }

    Dragon.prototype.prepareToSneeze = function(s) {
      var _this = this; var speed = .7*globalSpeedRate;
      TweenLite.to(this.head.rotation, speed, { x: -s * .12, ease: Back.easeOut });
      TweenLite.to(this.head.position, speed, { z: 30 - s * 2.2, y: s * 2.2, ease: Back.easeOut });
      TweenLite.to(this.mouth.rotation, speed, { x: s * .18, ease: Back.easeOut });
      TweenLite.to(this.smile.position, speed/2, { z:75, y:10, ease: Back.easeOut });
      TweenLite.to(this.smile.scale, speed/2, { x:0, y:0, ease: Back.easeOut });
      TweenMax.to(this.noseL.scale, speed, { x: 1 + s * .1, y: 1 + s * .1, ease: Back.easeOut });
      TweenMax.to(this.noseR.scale, speed, { x: 1 + s * .1, y: 1 + s * .1, ease: Back.easeOut });
      TweenMax.to(this.eyeL.scale, speed, { y: 1 + s * .01, ease: Back.easeOut });
      TweenMax.to(this.eyeR.scale, speed, { y: 1 + s * .01, ease: Back.easeOut });
      TweenMax.to(this.irisL.scale, speed, { y: 1 + s * .05, z: 1 + s * .05, ease: Back.easeOut });
      TweenMax.to(this.irisR.scale, speed, { y: 1 + s * .05, z: 1 + s * .05, ease: Back.easeOut });
      TweenMax.to(this.irisL.position, speed, { y: 30 + s * .8, z: 24 - s * .4, ease: Back.easeOut });
      TweenMax.to(this.irisR.position, speed, { y: 30 + s * .8, z: 24 - s * .4, ease: Back.easeOut });
      TweenMax.to(this.earL.rotation, speed, { x: -s * .1, y: -s * .1, ease: Back.easeOut });
      TweenMax.to(this.earR.rotation, speed, { x: -s * .1, y: s * .1, ease: Back.easeOut });
      TweenMax.to(this.wingL.rotation, speed, { z: -Math.PI / 4 - s * .1, ease: Back.easeOut });
      TweenMax.to(this.wingR.rotation, speed, { z: Math.PI / 4 + s * .1, ease: Back.easeOut });
      TweenMax.to(this.body.rotation, speed, { x: -s * .05, ease: Back.easeOut });
      TweenMax.to(this.body.scale, speed, { y: 1 + s * .01, ease: Back.easeOut });
      TweenMax.to(this.body.position, speed, { z: -s * 2, ease: Back.easeOut });
      TweenMax.to(this.tail.rotation, speed, { x: s * 0.1, ease: Back.easeOut });
    }

    Dragon.prototype.sneeze = function(s) {
      var _this = this; var sneezeEffect = 1 - (s / maxSneezingRate); var speed = .1*globalSpeedRate;
      timeFire = Math.round(s * 10);
      TweenLite.to(this.head.rotation, speed, { x: s * .05, ease: Back.easeOut });
      TweenLite.to(this.head.position, speed, { z: 30 + s * 2.4, y: -s * .4, ease: Back.easeOut });
      TweenLite.to(this.mouth.rotation, speed, { x: 0, ease: Strong.easeOut });
      TweenLite.to(this.smile.position, speed*2, { z:82, y:5, ease: Strong.easeIn });
      TweenLite.to(this.smile.scale, speed*2, { x:1, y:1, ease: Strong.easeIn });
      TweenMax.to(this.noseL.scale, speed, { y: sneezeEffect, ease: Strong.easeOut });
      TweenMax.to(this.noseR.scale, speed, { y: sneezeEffect, ease: Strong.easeOut });
      TweenMax.to(this.noseL.position, speed, { y: 40, ease: Strong.easeOut });
      TweenMax.to(this.noseR.position, speed, { y: 40, ease: Strong.easeOut });
      TweenMax.to(this.irisL.scale, speed, { y: sneezeEffect/2, z: 1, ease: Strong.easeOut });
      TweenMax.to(this.irisR.scale, speed, { y: sneezeEffect/2, z: 1, ease: Strong.easeOut });
      TweenMax.to(this.eyeL.scale, speed, { y: sneezeEffect/2, ease: Back.easeOut });
      TweenMax.to(this.eyeR.scale, speed, { y: sneezeEffect/2, ease: Back.easeOut });
      TweenMax.to(this.wingL.rotation, speed, { z: -Math.PI / 4 + s * .15, ease: Back.easeOut });
      TweenMax.to(this.wingR.rotation, speed, { z: Math.PI / 4 - s * .15, ease: Back.easeOut });
      TweenMax.to(this.body.rotation, speed, { x: s * 0.02, ease: Back.easeOut });
      TweenMax.to(this.body.scale, speed, { y: 1 - s * .03, ease: Back.easeOut });
      TweenMax.to(this.body.position, speed, { z: s * 2, ease: Back.easeOut });
      TweenMax.to(this.irisL.position, speed*7, { y: 35, ease: Back.easeOut });
      TweenMax.to(this.irisR.position, speed*7, { y: 35, ease: Back.easeOut });
      TweenMax.to(this.earR.rotation, speed*3, { x: s * .20, y: s * .20, ease: Back.easeOut });
      TweenMax.to(this.earL.rotation, speed*3, { x: s * .20, y: -s * .20, ease: Back.easeOut,
        onComplete: function() { _this.backToNormal(s); fireRate = s; }
      });
      TweenMax.to(this.tail.rotation, speed*3, { x: -s * 0.1, ease: Back.easeOut });
    }

    Dragon.prototype.backToNormal = function(s) {
      var _this = this; var speed = 1*globalSpeedRate;
      TweenLite.to(this.head.rotation, speed, { x: 0, ease: Strong.easeInOut });
      TweenLite.to(this.head.position, speed, { z: 30, y: 0, ease: Back.easeOut });
      TweenMax.to(this.noseL.scale, speed, { x: 1, y: 1, ease: Strong.easeInOut });
      TweenMax.to(this.noseR.scale, speed, { x: 1, y: 1, ease: Strong.easeInOut });
      TweenMax.to(this.noseL.position, speed, { y: 40, ease: Strong.easeInOut });
      TweenMax.to(this.noseR.position, speed, { y: 40, ease: Strong.easeInOut });
      TweenMax.to(this.irisL.scale, speed, { y: 1, z: 1, ease: Back.easeOut });
      TweenMax.to(this.irisR.scale, speed, { y: 1, z: 1, ease: Back.easeOut });
      TweenMax.to(this.irisL.position, speed*.7, { y: 30, ease: Back.easeOut });
      TweenMax.to(this.irisR.position, speed*.7, { y: 30, ease: Back.easeOut });
      TweenMax.to(this.eyeL.scale, speed, { y: 1, ease: Strong.easeOut });
      TweenMax.to(this.eyeR.scale, speed, { y: 1, ease: Strong.easeOut });
      TweenMax.to(this.body.rotation, speed, { x: 0, ease: Back.easeOut });
      TweenMax.to(this.body.scale, speed, { y: 1, ease: Back.easeOut });
      TweenMax.to(this.body.position, speed, { z: 0, ease: Back.easeOut });
      TweenMax.to(this.wingL.rotation, speed*1.3, { z: -Math.PI / 4, ease: Back.easeInOut });
      TweenMax.to(this.wingR.rotation, speed*1.3, { z: Math.PI / 4, ease: Back.easeInOut });
      TweenMax.to(this.earL.rotation, speed*1.3, { x: 0, y: 0, ease: Back.easeInOut });
      TweenMax.to(this.earR.rotation, speed*1.3, { x: 0, y: 0, ease: Back.easeInOut, onComplete: function() { _this.isSneezing = false; timeSmoke = Math.round(s * 5); } });
      TweenMax.to(this.tail.rotation, speed*1.3, { x: 0, ease: Back.easeOut });
    }

    function createDragon() { dragon = new Dragon(); scene.add(dragon.threegroup); }

    SmokeParticle = function() {
      this.color = { r: 0, g: 0, b: 0 };
      var particleMat = new THREE.MeshLambertMaterial({ transparent: true, opacity: .5, shading: THREE.FlatShading });
      this.mesh = makeCube(particleMat, 4, 4, 4, 0, 0, 0, 0, 0, 0);
      awaitingSmokeParticles.push(this);
    }
    SmokeParticle.prototype.initialize = function() {
      this.mesh.rotation.set(0,0,0); this.mesh.position.set(0,0,0); this.mesh.scale.set(1,1,1);
      this.mesh.material.opacity = .5; awaitingSmokeParticles.push(this);
    }
    SmokeParticle.prototype.updateColor = function() { this.mesh.material.color.setRGB(this.color.r, this.color.g, this.color.b); }
    SmokeParticle.prototype.fly = function() {
      var _this = this; var speed = 10*globalSpeedRate; var ease = Strong.easeOut;
      var initX = this.mesh.position.x; var initY = this.mesh.position.y; var initZ = this.mesh.position.z;
      
      var bezier = { type: "cubic", values: [
        { x: initX, y: initY, z: initZ }, { x: initX + 30 - Math.random() * 10, y: initY + 20 + Math.random() * 2, z: initZ + 20 },
        { x: initX + 10 + Math.random() * 20, y: initY + 40 + Math.random() * 5, z: initZ - 30 }, { x: initX + 50 - Math.random() * 20, y: initY + 70 + Math.random() * 10, z: initZ + 20 }
      ]};
      TweenMax.to(this.mesh.position, speed, { bezier: bezier, ease: ease });
      TweenMax.to(this.mesh.rotation, speed, { x: Math.random() * Math.PI * 3, y: Math.random() * Math.PI * 3, ease: ease });
      TweenMax.to(this.mesh.scale, speed, { x: 5 + Math.random() * 5, y: 5 + Math.random() * 5, z: 5 + Math.random() * 5, ease: ease });
      TweenMax.to(this.mesh.material, speed, { opacity: 0, ease: ease, onComplete: function() { _this.initialize(); } });
    }
    SmokeParticle.prototype.fire = function(f) {
      var _this = this; var speed = 1*globalSpeedRate; var ease = Strong.easeOut;
      var initX = this.mesh.position.x; var initY = this.mesh.position.y; var initZ = this.mesh.position.z;

      TweenMax.to(this.mesh.position, speed, { x: 0, y: initY-2*f, z: Math.max(initZ+15*f, initZ+40), ease: ease });
      TweenMax.to(this.mesh.rotation, speed, { x: Math.random() * Math.PI * 3, y: Math.random() * Math.PI * 3, ease: ease });
      
      var bezierScale = [
        { x:1, y:1, z:1 }, { x:f/maxSneezingRate+Math.random()*.3, y:f/maxSneezingRate+Math.random()*.3, z:f*2/maxSneezingRate+Math.random()*.3 },
        { x:f/maxSneezingRate+Math.random()*.5, y:f/maxSneezingRate+Math.random()*.5, z:f*2/maxSneezingRate+Math.random()*.5 },
        { x:f*2/maxSneezingRate+Math.random()*.5, y:f*2/maxSneezingRate+Math.random()*.5, z:f*4/maxSneezingRate+Math.random()*.5 },
        { x:f*2+Math.random()*5, y:f*2+Math.random()*5, z:f*2+Math.random()*5 }
      ];
      TweenMax.to(this.mesh.scale, speed * 2, { bezier:bezierScale, ease: ease, onComplete: function() { _this.initialize(); } });
      TweenMax.to(this.mesh.material, speed, { opacity: 0, ease: ease });
      
      var bezierColor = [
        { r: 255 / 255, g: 205 / 255, b: 74 / 255 }, { r: 255 / 255, g: 205 / 255, b: 74 / 255 }, { r: 255 / 255, g: 205 / 255, b: 74 / 255 },
        { r: 247 / 255, g: 34 / 255, b: 50 / 255 }, { r: 0 / 255, g: 0 / 255, b: 0 / 255 }
      ];
      TweenMax.to(this.color, speed, { bezier: bezierColor, ease: Strong.easeOut, onUpdate: function() { _this.updateColor(); } });
    }

    function getSmokeParticle() { return awaitingSmokeParticles.length ? awaitingSmokeParticles.pop() : new SmokeParticle(); }

    function loop() {
      if(!isPlaying) { requestAnimationFrame(loop); return; }
      var dt = clock.getDelta();
      // Native smooth rotation
      dragon.threegroup.rotation.y += (targetRotation - dragon.threegroup.rotation.y) * 0.1;

      if (!dragon.isSneezing) dragon.update();

      if (timeSmoke > 0) {
        var noseTarget = (Math.random() > .5) ? dragon.noseL : dragon.noseR;
        var p = getSmokeParticle();
        var pos = noseTarget.localToWorld(new THREE.Vector3(0, 0, 2));
        p.mesh.position.set(pos.x, pos.y, pos.z);
        p.mesh.material.color.setHex(0x555555); p.mesh.material.opacity = .2;
        scene.add(p.mesh); p.fly();
        timeSmoke--;
      }

      if (timeFire > 0) {
        var noseTarget = (Math.random() > .5) ? dragon.noseL : dragon.noseR;
        var f = getSmokeParticle();
        var posF = noseTarget.localToWorld(new THREE.Vector3(0, 0, 2));
        f.mesh.position.set(posF.x, posF.y, posF.z);
        f.color = { r: 255 / 255, g: 205 / 255, b: 74 / 255 };
        f.mesh.material.color.setRGB(f.color.r, f.color.g, f.color.b);
        f.mesh.material.opacity = 1;
        scene.add(f.mesh); f.fire(fireRate);
        timeFire--;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }

    setTimeout(() => {
      init(); createLights(); createFloor(); createDragon(); loop();
    }, 100);

  <\/script>
</body>
</html>`;

export const BIRDS_3D_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <style>
    body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #e0dacd; touch-action: none; }
    #world { position: absolute; width: 100%; height: 100%; overflow: hidden; z-index: 1; }
    canvas { position: absolute; top: 0; left: 0; width: 100vw !important; height: 100vh !important; z-index: 99 !important; display: block; }
    
    #instructions {
      position: absolute; width: 100%; top: 50%; margin-top: 150px; font-family: system-ui, sans-serif;
      color: #b75505; font-size: 1.1em; text-transform: uppercase; text-align: center;
      line-height: 1.5; user-select: none; z-index: 100; pointer-events: none;
    }

  </style>
  <script src="./three.min.js"><\/script>
  <script src="./TweenMax.min.js"><\/script>
</head>
<body>
  <div id="world"></div>
  <div id="instructions">What you doing here ?/></div>

  <script>
    //THREEJS RELATED VARIABLES
    var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, shadowLight, backLight, light, renderer, container;
    var clock = new THREE.Clock();

    //SCENE
    var floor, bird1, bird2, bird3;
    var HEIGHT, WIDTH, windowHalfX, windowHalfY, mousePos = {x:0,y:0};
    var isPlaying = true; // Battery optimization

    //INIT THREE JS, SCREEN AND MOUSE EVENTS
    function init(){
      scene = new THREE.Scene();
      HEIGHT = window.innerHeight || window.screen.height;
      WIDTH = window.innerWidth || window.screen.width;
      aspectRatio = WIDTH / HEIGHT;
      
      // MOBILE ZOOM: Wider lens on mobile so all 3 birds fit
      fieldOfView = (WIDTH < 600) ? 90 : 60; 
      
      nearPlane = 1;
      farPlane = 2000; 
      camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
      
      // Adjust camera distance depending on screen size
      camera.position.z = (WIDTH < 600) ? 1200 : 1000;  
      camera.position.y = 300;
      camera.lookAt(new THREE.Vector3(0,0,0));    
      
      renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); 
      renderer.setSize(WIDTH, HEIGHT);
      renderer.shadowMap.enabled = true;
      
      container = document.getElementById('world');
      container.appendChild(renderer.domElement);

      windowHalfX = WIDTH / 2;
      windowHalfY = HEIGHT / 2;
        
      window.addEventListener('resize', onWindowResize, false);
      document.addEventListener('mousemove', handleMouseMove, false);
      document.addEventListener('touchstart', handleTouchStart, {passive: true});
      document.addEventListener('touchend', handleTouchEnd, false);
      document.addEventListener('touchmove', handleTouchMove, {passive: true});

      // Battery Optimization
      window.addEventListener("pauseWallpaper", () => isPlaying = false);
      window.addEventListener("playWallpaper", () => { if(!isPlaying){ isPlaying = true; clock.getDelta(); loop(); }});
    }

    function onWindowResize() {
      HEIGHT = window.innerHeight;
      WIDTH = window.innerWidth;
      windowHalfX = WIDTH / 2;
      windowHalfY = HEIGHT / 2;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    }

    function handleMouseMove(event) {
      mousePos = {x:event.clientX, y:event.clientY};
    }
    function handleTouchStart(event) {
      if (event.touches.length > 0) { mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY}; }
    }
    function handleTouchEnd(event) {
      mousePos = {x:windowHalfX, y:windowHalfY};
    }
    function handleTouchMove(event) {
      if (event.touches.length > 0) { mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY}; }
    }

    function createLights() {
      light = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)
      shadowLight = new THREE.DirectionalLight(0xffffff, .8);
      shadowLight.position.set(200, 200, 200);
      shadowLight.castShadow = true;
      backLight = new THREE.DirectionalLight(0xffffff, .4);
      backLight.position.set(-100, 200, 50);
      backLight.castShadow = true;
      scene.add(backLight);
      scene.add(light);
      scene.add(shadowLight);
    }

    //BIRD
    Bird = function(){
      this.rSegments = 4;
      this.hSegments = 3;
      this.cylRay = 120;
      this.bodyBirdInitPositions = [];
      this.vAngle = this.hAngle = 0;
      this.normalSkin = {r:255/255, g:222/255, b:121/255};
      this.shySkin = {r:255/255, g:157/255, b:101/255};
      this.color = {r:this.normalSkin.r, g:this.normalSkin.g, b:this.normalSkin.b};
      this.side = "left";
      
      this.shyAngles = {h:0, v:0};
      this.behaviourInterval;
      this.intervalRunning = false;
      
      this.threegroup = new THREE.Group();
      
      this.yellowMat = new THREE.MeshLambertMaterial ({ color: 0xffde79, shading:THREE.FlatShading });
      this.whiteMat = new THREE.MeshLambertMaterial ({ color: 0xffffff, shading: THREE.FlatShading });
      this.blackMat = new THREE.MeshLambertMaterial ({ color: 0x000000, shading: THREE.FlatShading });
      this.orangeMat = new THREE.MeshLambertMaterial ({ color: 0xff5535, shading: THREE.FlatShading });
      
      this.wingLeftGroup = new THREE.Group();
      this.wingRightGroup = new THREE.Group();
     
      var wingGeom = new THREE.BoxGeometry(60,60, 5);
      var wingLeft = new THREE.Mesh(wingGeom, this.yellowMat);
      this.wingLeftGroup.add(wingLeft);
      this.wingLeftGroup.position.x = 70;
      this.wingLeftGroup.position.z = 0;
      this.wingLeftGroup.rotation.y = Math.PI/2;
      wingLeft.rotation.x = -Math.PI/4;
      
      var wingRight = new THREE.Mesh(wingGeom, this.yellowMat);
      this.wingRightGroup.add(wingRight);
      this.wingRightGroup.position.x = -70;
      this.wingRightGroup.position.z = 0;
      this.wingRightGroup.rotation.y = -Math.PI/2;
      wingRight.rotation.x = -Math.PI/4;
      
      var bodyGeom = new THREE.CylinderGeometry(40, 70, 200, this.rSegments, this.hSegments);
      this.bodyBird = new THREE.Mesh(bodyGeom, this.yellowMat);
      this.bodyBird.position.y = 70;
      
      this.bodyVerticesLength = (this.rSegments+1)*(this.hSegments);
      for (var i=0;i<this.bodyVerticesLength; i++){
        var tv = this.bodyBird.geometry.vertices[i];
        this.bodyBirdInitPositions.push({x:tv.x, y:tv.y, z:tv.z});
      }
      
      this.threegroup.add(this.bodyBird);
      this.threegroup.add(this.wingLeftGroup);
      this.threegroup.add(this.wingRightGroup);
      
      this.face = new THREE.Group();
      var eyeGeom = new THREE.BoxGeometry(60,60,10);
      var irisGeom = new THREE.BoxGeometry(10,10,10);
      
      this.leftEye = new THREE.Mesh(eyeGeom, this.whiteMat);
      this.leftEye.position.set(-30, 120, 35);
      this.leftEye.rotation.y = -Math.PI/4;
      
      this.leftIris = new THREE.Mesh(irisGeom, this.blackMat);
      this.leftIris.position.set(-30, 120, 40);
      this.leftIris.rotation.y = -Math.PI/4;
      
      this.rightEye = new THREE.Mesh(eyeGeom, this.whiteMat);
      this.rightEye.position.set(30, 120, 35);
      this.rightEye.rotation.y = Math.PI/4;
      
      this.rightIris = new THREE.Mesh(irisGeom, this.blackMat);
      this.rightIris.position.set(30, 120, 40);
      this.rightIris.rotation.y = Math.PI/4;
      
      var beakGeom = new THREE.CylinderGeometry(0,20,20, 4,1);
      this.beak = new THREE.Mesh(beakGeom, this.orangeMat);
      this.beak.position.set(0, 70, 65);
      this.beak.rotation.x = Math.PI/2;
      
      this.face.add(this.rightEye); this.face.add(this.rightIris);
      this.face.add(this.leftEye); this.face.add(this.leftIris);
      this.face.add(this.beak);
      
      var featherGeom = new THREE.BoxGeometry(10,20,5);
      this.feather1 = new THREE.Mesh(featherGeom, this.yellowMat);
      this.feather1.position.set(0, 185, 55);
      this.feather1.rotation.x = Math.PI/4;
      this.feather1.scale.set(1.5,1.5,1);
      
      this.feather2 = new THREE.Mesh(featherGeom, this.yellowMat);
      this.feather2.position.set(20, 180, 50);
      this.feather2.rotation.set(Math.PI/4, 0, -Math.PI/8);
        
      this.feather3 = new THREE.Mesh(featherGeom, this.yellowMat);
      this.feather3.position.set(-20, 180, 50);
      this.feather3.rotation.set(Math.PI/4, 0, Math.PI/8);
      
      this.face.add(this.feather1); this.face.add(this.feather2); this.face.add(this.feather3);
      this.threegroup.add(this.face);
      
      this.threegroup.traverse( function ( object ) {
        if ( object instanceof THREE.Mesh ) { object.castShadow = true; object.receiveShadow = true; }
      } );
    }

    Bird.prototype.look = function(hAngle,vAngle){
      this.hAngle = hAngle;
      this.vAngle = vAngle;
      
      this.leftIris.position.y = 120 - this.vAngle*30;
      this.leftIris.position.x = -30 + this.hAngle*10;
      this.leftIris.position.z = 40 + this.hAngle*10;
      
      this.rightIris.position.y = 120 - this.vAngle*30;
      this.rightIris.position.x = 30 + this.hAngle*10;
      this.rightIris.position.z = 40 - this.hAngle*10;
      
      this.leftEye.position.y = this.rightEye.position.y = 120 - this.vAngle*10;
      
      this.beak.position.y = 70 - this.vAngle*20;
      this.beak.rotation.x = Math.PI/2 + this.vAngle/3;
      
      this.feather1.rotation.x = (Math.PI/4) + (this.vAngle/2);
      this.feather1.position.y = 185 - this.vAngle*10;
      this.feather1.position.z = 55 + this.vAngle*10;
      
      this.feather2.rotation.x = (Math.PI/4) + (this.vAngle/2);
      this.feather2.position.y = 180 - this.vAngle*10;
      this.feather2.position.z = 50 + this.vAngle*10;
      
      this.feather3.rotation.x = (Math.PI/4) + (this.vAngle/2);
      this.feather3.position.y = 180 - this.vAngle*10;
      this.feather3.position.z = 50 + this.vAngle*10;
      
      for (var i=0;i<this.bodyVerticesLength; i++){
        var line = Math.floor(i/(this.rSegments+1));
        var tv = this.bodyBird.geometry.vertices[i];
        var tvInitPos = this.bodyBirdInitPositions[i];
        var a;
        if (line >= this.hSegments-1){ a = 0; }
        else { a = this.hAngle/(line+1); }
        var tx = tvInitPos.x*Math.cos(a) + tvInitPos.z*Math.sin(a);
        var tz = -tvInitPos.x*Math.sin(a) + tvInitPos.z*Math.cos(a);
        tv.x = tx; tv.z = tz;
      }
      this.face.rotation.y = this.hAngle;
      this.bodyBird.geometry.verticesNeedUpdate = true;
    }

    Bird.prototype.lookAway = function(fastMove){
      var speed = fastMove? .4 : 2;
      var ease = fastMove? Strong.easeOut : Strong.easeInOut;
      var delay = fastMove? .2 : 0;
      var col = fastMove? this.shySkin : this.normalSkin;
      var tv = (-1 + Math.random()*2) * Math.PI/3;
      var beakScaleX = .75 + Math.random()*.25;
      var beakScaleZ = .5 + Math.random()*.5;
      
      var th = (this.side == "right") ? (-1 + Math.random()) * Math.PI/4 : Math.random() * Math.PI/4;  
      
      TweenMax.killTweensOf(this.shyAngles);
      TweenMax.to(this.shyAngles, speed, {v:tv, h:th, ease:ease, delay:delay});
      TweenMax.to(this.color, speed, {r:col.r, g:col.g, b:col.b, ease:ease, delay:delay});
      TweenMax.to(this.beak.scale, speed, {z:beakScaleZ, x:beakScaleX, ease:ease, delay:delay});
    }

    Bird.prototype.stare = function(){
      var col = this.normalSkin;
      var th = (this.side == "right") ? Math.PI/3 : -Math.PI/3;  
      TweenMax.to(this.shyAngles, 2, {v:-.5, h:th, ease:Strong.easeInOut});
      TweenMax.to(this.color, 2, {r:col.r, g:col.g, b:col.b, ease:Strong.easeInOut});
      TweenMax.to(this.beak.scale, 2, {z:.8, x:1.5, ease:Strong.easeInOut});
    }

    function createFloor(){ 
      floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000,1000), new THREE.MeshBasicMaterial({color: 0xe0dacd}));
      floor.rotation.x = -Math.PI/2;
      floor.position.y = -33;
      floor.receiveShadow = true;
      scene.add(floor);
    }

    function createBirds(){
      bird1 = new Bird();
      bird1.threegroup.position.x = 0;
      scene.add(bird1.threegroup);
      
      bird2 = new Bird();
      bird2.threegroup.position.x = -250;
      bird2.side = "right";
      bird2.threegroup.scale.set(.8,.8,.8);
      bird2.threegroup.position.y = -8;
      scene.add(bird2.threegroup);
      
      bird3 = new Bird();
      bird3.threegroup.position.x = 250;
      bird3.side = "left";
      bird3.threegroup.scale.set(.8,.8,.8);
      bird3.threegroup.position.y = -8;
      scene.add(bird3.threegroup);
    }

    function loop(){
      if(!isPlaying) { requestAnimationFrame(loop); return; } // Save Battery
      
      var dt = clock.getDelta();

      var tempHA = (mousePos.x-windowHalfX)/200;
      var tempVA = (mousePos.y - windowHalfY)/200;
      var userHAngle = Math.min(Math.max(tempHA, -Math.PI/3), Math.PI/3);
      var userVAngle = Math.min(Math.max(tempVA, -Math.PI/3), Math.PI/3);
      bird1.look(userHAngle,userVAngle);
      
      if (bird1.hAngle < -Math.PI/5 && !bird2.intervalRunning){
          bird2.lookAway(true);
          bird2.intervalRunning = true;
          bird2.behaviourInterval = setInterval(function(){
            bird2.lookAway(false);
          }, 1500);
      }else if (bird1.hAngle > 0 && bird2.intervalRunning){
        bird2.stare();
        clearInterval(bird2.behaviourInterval);
        bird2.intervalRunning = false;
      }else if (bird1.hAngle > Math.PI/5 && !bird3.intervalRunning){
        bird3.lookAway(true);
        bird3.intervalRunning = true;
        bird3.behaviourInterval = setInterval(function(){
          bird3.lookAway(false);
        }, 1500);
      }else if (bird1.hAngle < 0 && bird3.intervalRunning){
        bird3.stare();
        clearInterval(bird3.behaviourInterval);
        bird3.intervalRunning = false;
      }
      
      bird2.look(bird2.shyAngles.h, bird2.shyAngles.v);
      bird2.bodyBird.material.color.setRGB(bird2.color.r,bird2.color.g,bird2.color.b);
      
      bird3.look(bird3.shyAngles.h, bird3.shyAngles.v);
      bird3.bodyBird.material.color.setRGB(bird3.color.r,bird3.color.g,bird3.color.b);
      
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }

    // Load instantly (bypassing window.onload bug in Android)
    setTimeout(() => {
      init();
      createLights();
      createFloor();
      createBirds();
      loop();
    }, 100);

  <\/script>
</body>
</html>`;

// export const GHIBLI_LANDSCAPE_CODE = `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
//   <style>
//     body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #64b5f6; touch-action: none; }
//     canvas { display: block; position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1; }
//     #overlay { 
//       position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2; 
//       opacity: 0.1; 
//       background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3F%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E"); 
//     }
//   </style>
// </head>
// <body>
//   <canvas id="canvas"></canvas>
//   <div id="overlay"></div>

//   <script>
//     const canvas = document.getElementById('canvas');
//     const ctx = canvas.getContext('2d', { alpha: false });
//     let width, height, dpr;
//     let isPlaying = true;
//     let globalTime = 0;
//     let lastDraw = performance.now();

//     let mtns = [], grass = [], clouds = [];

//     let flowers = [];
//     let mist = [];

//     function generateScene() {
//       // Mountains
//       mtns = [
//         { y: 0.48, amp: 45, freq: 0.003, col: '#a2c2e8' },
//         { y: 0.55, amp: 35, freq: 0.005, col: '#85b3e2' },
//         { y: 0.62, amp: 30, freq: 0.007, col: '#629edb' },
//         { y: 0.70, amp: 35, freq: 0.004, col: '#458bd4' }
//       ];

//       // Towering Ghibli Clouds (3-Layer logic)
//       clouds = Array.from({length: 4}).map(() => {
//         const rBase = 50 + Math.random() * 50;
//         return {
//           x: Math.random() * width,
//           y: height * 0.1 + Math.random() * height * 0.3,
//           sp: 0.015 + Math.random() * 0.03,
//           puffs: Array.from({length: 15}).map(() => ({
//             ox: (Math.random() - 0.5) * rBase * 2.2,
//             oy: (Math.random() - 0.5) * rBase * 1.2,
//             r: rBase * (0.5 + Math.random() * 0.8)
//           }))
//         };
//       });

//       // Ultra Dense Mist / Fog Patches (25 patches)
//       mist = Array.from({length: 25}).map(() => ({
//         x: Math.random() * width,
//         y: height * 0.76 + Math.random() * height * 0.24,
//         r: 150 + Math.random() * 200,
//         sp: 8 + Math.random() * 15
//       }));

//       // 1200 Dense Grass Blades
//       grass = Array.from({length: 1200}).map(() => ({
//         x: Math.random() * (width + 60) - 30,
//         y: height * 0.77 + Math.random() * height * 0.23,
//         h: 20 + Math.random() * 38,
//         w: 0.8 + Math.random() * 1.6,
//         off: Math.random() * 10,
//         col: ['#2e7d32', '#388e3c', '#1b5e20', '#689f38', '#e6ee9c'][Math.floor(Math.random()*5)]
//       })).sort((a,b) => a.y - b.y);

//       // Wildflowers
//       flowers = Array.from({length: 50}).map(() => ({
//         x: Math.random() * width,
//         y: height * 0.82 + Math.random() * height * 0.18,
//         r: 1.5 + Math.random() * 2,
//         col: ['#fff', '#fbdf11', '#ff5252', '#ba68c8'][Math.floor(Math.random()*4)]
//       }));
//     }
//     function resize() {
//       width = window.innerWidth;
//       height = window.innerHeight;
//       dpr = window.devicePixelRatio || 1;
//       canvas.width = width * dpr;
//       canvas.height = height * dpr;
//       ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
//       generateScene();
//     }

//     function drawSunMoon() {
//       const hours = new Date().getHours() + new Date().getMinutes()/60;
//       const isDay = hours >= 6 && hours <= 18;
//       const prog = isDay ? (hours - 6) / 12 : (hours < 6 ? (hours + 6) / 12 : (hours - 18) / 12);

//       const x = (prog * (width + 100)) - 50;
//       const y = height * 0.45 - Math.sin(prog * Math.PI) * (height * 0.3);

//       ctx.save();
//       ctx.translate(x, y);
//       if (isDay) {
//         const g = ctx.createRadialGradient(0,0,0, 0,0,30);
//         g.addColorStop(0, '#fff'); g.addColorStop(0.4, '#fffde7'); g.addColorStop(1, 'rgba(255,255,255,0)');
//         ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0,0,30,0,7); ctx.fill();
//       } else {
//         ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(0,0,20,0,7); ctx.fill();
//         ctx.globalCompositeOperation = 'destination-out';
//         ctx.beginPath(); ctx.arc(10,-5,18,0,7); ctx.fill();
//         ctx.globalCompositeOperation = 'source-over';
//       }
//       ctx.restore();
//     }

//     function drawSky() {
//       const g = ctx.createLinearGradient(0, 0, 0, height * 0.7);
//       const d = new Date();
//       const hours = d.getHours() + d.getMinutes()/60;
//       const colors = (hours >= 6 && hours <= 18) 
//         ? ['#2196f3', '#90caf9', '#e3f2fd']
//         : ['#0d1b2a', '#1b263b', '#415a77'];
//       g.addColorStop(0, colors[0]); g.addColorStop(0.5, colors[1]); g.addColorStop(1, colors[2]);
//       ctx.fillStyle = g;
//       ctx.fillRect(0, 0, width, height);
//     }

//     function drawClouds(dt, start = 0, end = clouds.length) {
//       clouds.slice(start, end).forEach(c => {
//         c.x += c.sp * dt * 40;
//         if (c.x > width + 250) c.x = -250;

//         ctx.save();
//         ctx.translate(c.x, c.y);

//         // Pass 1: Shadow (Bottom Layer)
//         ctx.fillStyle = 'rgba(180, 200, 220, 0.65)';
//         c.puffs.forEach(p => {
//           ctx.beginPath(); ctx.arc(p.ox, p.oy + 12, p.r, 0, 7); ctx.fill();
//         });

//         // Pass 2: Main Body (Middle Layer)
//         ctx.fillStyle = 'rgba(250, 252, 255, 0.95)';
//         c.puffs.forEach(p => {
//           ctx.beginPath(); ctx.arc(p.ox, p.oy, p.r, 0, 7); ctx.fill();
//         });

//         // Pass 3: Highlight (Top Layer)
//         ctx.fillStyle = '#ffffff';
//         c.puffs.forEach(p => {
//           ctx.beginPath(); ctx.arc(p.ox, p.oy - 8, p.r * 0.8, 0, 7); ctx.fill();
//         });

//         ctx.restore();
//       });
//     }

//     function drawMountains() {
//       mtns.forEach(m => {
//         ctx.beginPath();
//         ctx.moveTo(0, height);
//         for (let x = 0; x <= width + 20; x += 15) {
//           let y = height * m.y + Math.sin(x * m.freq) * m.amp;
//           ctx.lineTo(x, y);
//         }
//         ctx.lineTo(width, height);
//         const grad = ctx.createLinearGradient(0, height * m.y - m.amp, 0, height);
//         grad.addColorStop(0, m.col);
//         grad.addColorStop(1, '#bbdefb');
//         ctx.fillStyle = grad;
//         ctx.fill();
//       });
//     }

//     function drawMeadow() {
//       // 1. Multi-tone base
//       const g = ctx.createLinearGradient(0, height * 0.75, 0, height);
//       g.addColorStop(0, '#cddc39'); g.addColorStop(0.3, '#9ccc65'); g.addColorStop(1, '#689f38');
//       ctx.fillStyle = g;
//       ctx.beginPath();
//       ctx.moveTo(0, height);
//       for(let x=-20; x<=width+40; x+=20) {
//         let y = height * 0.82 + Math.sin(x * 0.005) * 15;
//         ctx.lineTo(x, y);
//       }
//       ctx.lineTo(width, height);
//       ctx.fill();

//       // 2. Bushes (Volume)
//       for(let x=0; x<width; x+=100) {
//         ctx.fillStyle = 'rgba(27, 94, 32, 0.3)';
//         ctx.beginPath();
//         ctx.arc(x + Math.sin(x)*40, height * 0.9 + Math.cos(x)*10, 40 + Math.sin(x)*20, 0, 7);
//         ctx.fill();
//       }

//       // 3. Dense Grass Lower Half (1200 blades)
//       const wind = Math.sin(globalTime * 0.8) * 4;
//       ctx.lineCap = 'round';
//       grass.slice(0, 600).forEach(g => {
//         const lean = Math.sin(globalTime * 1.0 + g.off) * 3 + wind;
//         ctx.strokeStyle = g.col; ctx.lineWidth = g.w; ctx.beginPath();
//         ctx.moveTo(g.x, g.y); ctx.quadraticCurveTo(g.x + lean * 0.4, g.y - g.h * 0.5, g.x + lean, g.y - g.h); ctx.stroke();
//       });

//       // 4. Drifting Mist (Between Grass Layers)
//       mist.forEach(m => {
//         m.x = (m.x + m.sp * 0.016) % (width + 400);
//         const gx = m.x - 200;
//         const grad = ctx.createRadialGradient(gx, m.y, 0, gx, m.y, m.r);
//         grad.addColorStop(0, 'rgba(255,255,255,0.18)');
//         grad.addColorStop(1, 'rgba(255,255,255,0)');
//         ctx.fillStyle = grad;
//         ctx.beginPath(); ctx.arc(gx, m.y, m.r, 0, 7); ctx.fill();
//       });

//       // 5. Upper Half of Grass & Flowers
//       grass.slice(600).forEach(g => {
//         const lean = Math.sin(globalTime * 1.0 + g.off) * 3 + wind;
//         ctx.strokeStyle = g.col; ctx.lineWidth = g.w; ctx.beginPath();
//         ctx.moveTo(g.x, g.y); ctx.quadraticCurveTo(g.x + lean * 0.4, g.y - g.h * 0.5, g.x + lean, g.y - g.h); ctx.stroke();
//       });

//       flowers.forEach(f => {
//         ctx.fillStyle = f.col;
//         ctx.beginPath();
//         ctx.arc(f.x + wind * 0.2, f.y, f.r, 0, 7);
//         ctx.fill();
//       });
//     }

//     function loop(now) {
//       if(!isPlaying) { requestAnimationFrame(loop); return; }
//       const dt = (now - lastDraw) / 1000;
//       lastDraw = now;
//       globalTime += dt;
//       ctx.clearRect(0,0,width,height);

//       // 1. Sky & Background Clouds
//       drawSky();
//       drawClouds(dt, 0, 2); 

//       // 2. Sun/Moon
//       drawSunMoon();

//       // 3. Foreground Clouds
//       drawClouds(dt, 2, 4);

//       // 4. Landscape & Meadow
//       drawMountains();
//       drawMeadow();
//       requestAnimationFrame(loop);
//     }

//     window.addEventListener("pauseWallpaper", () => isPlaying = false);
//     window.addEventListener("playWallpaper", () => {
//       if(!isPlaying) { isPlaying = true; lastDraw = performance.now(); loop(performance.now()); }
//     });

//     resize();
//     window.addEventListener('resize', resize);
//     requestAnimationFrame(loop);

//   <\/script>
// </body>
// </html>`;

export const GHIBLI_LANDSCAPE_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <style>
    body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #020818; touch-action: none; }
    canvas { display: block; position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1; }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>

  <script>
    // ── NATIVE CANVAS 2D ENGINE (Real-Time + Ultra-Battery Optimized) ──
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    let width, height;
    let isPlaying = true;
    
    // BATTERY FIX: Cap at 24 FPS for cinematic feel & low battery drain
    const TARGET_FPS = 24;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;
    
    let timeOfDay = 12; 
    let weather = 'clear'; // 'clear', 'rain', 'snow', 'thunder'
    let season = 'spring'; 

    // --- SVG PATHS PORTED FROM REACT NATIVE ---
    const paths = {
      cloud: new Path2D("M150,70c0-16.5-13.5-30-30-30c-2.2,0-4.3,0.3-6.4,0.8C106.8,24.8,91.9,15,75,15c-19.1,0-35,12.5-40,30c-13.8,0-25,11.2-25,25s11.2,25,25,25h90C138.8,95,150,83.8,150,70z"),
      hillBack: new Path2D("M0,50 Q30,15 100,60 V100 H0 Z"),
      hillMid: new Path2D("M-10,75 Q40,30 110,80 V100 H-10 Z"),
      hillFront: new Path2D("M0,90 Q35,70 70,85 T110,95 V100 H0 Z"),
      treeBot: new Path2D("M27.82,52.35l-15.39,-0.14c-1.8,3.95 -7.28,10.91 -10.7,16.43 1.92,-1.18 11.93,-1.98 14.9,-7.2l-1.6,7.42c2.56,2 5.94,1.77 7.14,0.76 -0.37,-5.85 -1,-7.85 -1,-7.85 1.58,1.36 10.9,4.89 16.29,6.77 -1.15,-1.72 -7.92,-12.9 -9.64,-16.18Z"),
      treeMid: new Path2D("M11.03,51.5c-1.09,0.72 -9.26,6.33 -11.03,6.99 0.41,-1.39 9.12,-16.96 11.09,-19.56l15.81,-0.53c3.3,8.34 11.05,17.89 11.18,18.3 -0.38,-0.07 -7.56,-3.2 -10.26,-3.76 0,0 2.21,7.28 0.79,8.18 -1.13,0.72 -8.06,-5.83 -11.25,-7.65 -0.69,-0.39 -13.77,8.92 -13.25,7.5 1.58,-4.29 6.91,-9.47 6.91,-9.47Z"),
      treeTop: new Path2D("M26.89,38.39c2.3,1.44 4.36,2.87 6.67,3.97 -0.23,-1.39 -5.48,-10.85 -9.46,-19.1H15.05C9.96,32.78 1.66,44.45 1.57,44.86c0.46,1.74 5.76,-3.25 9.37,-5.64 0,0 1.54,13.16 3.43,11.61 7.14,-5.88 12.53,-12.43 12.53,-12.43Z"),
      treePeak: new Path2D("M24.45,24.59c1.51,0.97 6.99,8.21 5,-0.73 -1.82,-6.57 -3.74,-11.32 -8.55,-23.86 -0.28,1.18 -1.85,6.16 -5.33,13.91 -10.12,20.33 -3.31,11.98 0.74,9.51 3.55,11.13 2.78,15.26 8.15,1.17Z")
    };

    // --- COLOR INTERPOLATION ---
    function hexToRgb(hex) {
      let r = 0, g = 0, b = 0;
      if (hex.length == 4) { r = parseInt(hex[1]+hex[1],16); g = parseInt(hex[2]+hex[2],16); b = parseInt(hex[3]+hex[3],16); }
      else if (hex.length == 7) { r = parseInt(hex.substring(1,3),16); g = parseInt(hex.substring(3,5),16); b = parseInt(hex.substring(5,7),16); }
      return [r, g, b];
    }

    function lerpColor(color1, color2, t) {
      const c1 = hexToRgb(color1), c2 = hexToRgb(color2);
      const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
      const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
      const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
      return \`rgb(\${r},\${g},\${b})\`;
    }

    function interpolate(val, xArr, yArr) {
      if (val <= xArr[0]) return yArr[0];
      if (val >= xArr[xArr.length - 1]) return yArr[yArr.length - 1];
      for (let i = 0; i < xArr.length - 1; i++) {
        if (val >= xArr[i] && val <= xArr[i + 1]) {
          let t = (val - xArr[i]) / (xArr[i + 1] - xArr[i]);
          return lerpColor(yArr[i], yArr[i + 1], t);
        }
      }
      return yArr[0];
    }
    
    function interpolateNum(val, xArr, yArr) {
        if (val <= xArr[0]) return yArr[0];
        if (val >= xArr[xArr.length - 1]) return yArr[yArr.length - 1];
        for (let i = 0; i < xArr.length - 1; i++) {
            if (val >= xArr[i] && val <= xArr[i + 1]) {
            let t = (val - xArr[i]) / (xArr[i + 1] - xArr[i]);
            return yArr[i] + (yArr[i+1] - yArr[i]) * t;
            }
        }
        return yArr[0];
    }

    // --- TIMELINES ---
    const TIMES = [0, 5, 5.5, 6.5, 8, 12, 16, 17.5, 18.5, 19, 24];
    const SKY_ZENITH =  ['#17193a', '#17193a', '#2a3a5c', '#75bec3', '#5a97d8', '#6fa6fa', '#5a97d8', '#75bec3', '#2a3a5c', '#17193a', '#17193a'];
    const SKY_MID =     ['#303668', '#303668', '#4a5a8a', '#ffbbd5', '#90b8e8', '#b1d1f4', '#90b8e8', '#ffe3ae', '#4a5a8a', '#303668', '#303668'];
    const SKY_HORIZON = ['#38477a', '#38477a', '#6a5a8a', '#ffd6b9', '#c8ddf4', '#e6e6e6', '#c8ddf4', '#ffc5ab', '#6a5a8a', '#38477a', '#38477a'];
    const SKY_GROUND =  ['#252c56', '#252c56', '#4a3a6a', '#d4a88a', '#a8c8e8', '#d0dff0', '#a8c8e8', '#c48878', '#4a3a6a', '#252c56', '#252c56'];
    
    const SEASONS = {
        spring: { hill: ['#2c3e50', '#5a7e3a', '#5a7e3a', '#3e4b25', '#2c3e50'], treeBg: ['#1B2735', '#2c3e50', '#1B2735'], treeMid: ['#0e141a', '#1a252f', '#0e141a'], treeFore: ['#0e141a', '#2d5a27', '#0e141a'] },
        summer: { hill: ['#062a1a', '#0a5d38', '#10b981', '#059669', '#062a1a'], treeBg: ['#062a1a', '#064e3b', '#062a1a'], treeMid: ['#043020', '#064e3b', '#043020'], treeFore: ['#043020', '#10b981', '#043020'] },
        autumn: { hill: ['#0e141a', '#a0744d', '#a0744d', '#713f37', '#0e141a'], treeBg: ['#1B2735', '#422419', '#1B2735'], treeMid: ['#1B2735', '#5e311a', '#1B2735'], treeFore: ['#1B2735', '#834c24', '#1B2735'] },
        winter: { hill: ['#1B2735', '#406983', '#406983', '#242949', '#1B2735'], treeBg: ['#1B2735', '#1B2735', '#1B2735'], treeMid: ['#1B2735', '#2c3e50', '#1B2735'], treeFore: ['#1B2735', '#2c3e50', '#1B2735'] },
    };

    const WATER_DEEP = ['#0B1026', '#1f71d5', '#5fa8ff', '#1B2735', '#0B1026'];
    const WATER_SHAL = ['#1a252f', '#75bec3', '#80f9ff', '#2c3e50', '#1a252f'];

    // --- ENTITIES ---
    let stars = [], clouds = [], treesBg = [], treesMid = [], treesFore = [], animeParticles = [], lightningPath = "";
    let thunderFlash = 0, windAnim = 0, globalTime = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      generateScene();
    }

    function generateScene() {
      stars = Array.from({length: 120}).map(() => ({
        x: Math.random() * width, y: Math.random() * height * 0.55,
        r: 0.5 + Math.random() * 1.2, baseOp: 0.5 + Math.random() * 0.5, phase: Math.random() * Math.PI * 2
      }));

      clouds = [
        { size: 120, y: 50, speed: 0.08, x: Math.random() * width, flip: 1 },
        { size: 160, y: 130, speed: 0.12, x: Math.random() * width, flip: -1 },
        { size: 90, y: 90, speed: 0.05, x: Math.random() * width, flip: 1 },
        { size: 140, y: 180, speed: 0.15, x: Math.random() * width, flip: -1 },
      ];

      animeParticles = Array.from({length: 25}).map(() => ({
        x: Math.random() * width, y: Math.random() * height * 1.5,
        size: Math.random() * 1.5 + 0.8, phase: Math.random() * Math.PI * 2, speed: 0.5 + Math.random() * 0.5
      }));

      const genTrees = (minW, maxW, minH, maxH, baseBot, windStr) => {
        let arr = [], curX = -10;
        while(curX < width + 20) {
          let w = minW + Math.random() * (maxW - minW);
          let h = minH + Math.random() * (maxH - minH);
          let bot = baseBot + (Math.random() * 20 - 10);
          arr.push({ w, h, x: curX, y: height - bot, phase: Math.random(), windStr });
          curX += w + (w * 0.2 + Math.random() * (w * 1.5));
        }
        return arr;
      };
      treesBg = genTrees(20, 30, 35, 50, height * 0.35, 0.4);
      treesMid = genTrees(35, 50, 65, 90, height * 0.25, 0.7);
      treesFore = genTrees(60, 90, 100, 150, height * 0.10, 1.0);
    }

    // --- DRAWING FUNCTIONS ---
    function drawSky() {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, interpolate(timeOfDay, TIMES, SKY_ZENITH));
      grad.addColorStop(0.38, interpolate(timeOfDay, TIMES, SKY_MID));
      grad.addColorStop(0.75, interpolate(timeOfDay, TIMES, SKY_HORIZON));
      grad.addColorStop(1, interpolate(timeOfDay, TIMES, SKY_GROUND));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      let glowOp = 0;
      if (timeOfDay >= 5.5 && timeOfDay <= 7.5) glowOp = 0.35 * (1 - Math.abs(timeOfDay - 6.5) / 1);
      if (timeOfDay >= 16.5 && timeOfDay <= 19) glowOp = 0.4 * (1 - Math.abs(timeOfDay - 17.8) / 1.2);
      if (glowOp > 0) {
        const rad = ctx.createRadialGradient(width/2, height*0.85, 0, width/2, height*0.85, height*0.5);
        rad.addColorStop(0, \`rgba(255, 110, 64, \${glowOp.toFixed(2)})\`);
        rad.addColorStop(1, 'rgba(255, 110, 64, 0)');
        ctx.fillStyle = rad;
        ctx.fillRect(0, height*0.4, width, height*0.5);
      }

      let starOp = 0;
      if (timeOfDay <= 5) starOp = 0.8;
      else if (timeOfDay <= 6) starOp = 0.8 * (1 - (timeOfDay - 5));
      else if (timeOfDay >= 19) starOp = 0.8 * Math.min(1, (timeOfDay - 19));
      else if (timeOfDay >= 18) starOp = 0.8 * Math.max(0, (timeOfDay - 18));
      
      if (starOp > 0) {
        ctx.fillStyle = '#ffffff';
        stars.forEach(s => {
          ctx.globalAlpha = starOp * (s.baseOp + Math.sin(globalTime * 2 + s.phase) * 0.3);
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
        });
        ctx.globalAlpha = 1;
      }
    }

    function drawSunMoon() {
      const sunProg = interpolateNum(timeOfDay, [6, 18], [0, 1]);
      if (sunProg > 0 && sunProg < 1) {
        const sx = -20 + sunProg * (width + 40);
        const sy = height * 0.45 - Math.sin(sunProg * Math.PI) * (height * 0.35);
        const sScale = 0.55 + (0.5 - Math.abs(sunProg - 0.5)) * 0.8;
        
        ctx.save(); ctx.translate(sx, sy); ctx.scale(sScale, sScale);
        
        let sunsetOp = interpolateNum(timeOfDay, [4.5, 6, 7.5, 16.5, 18, 19.5], [0, 1, 0, 0, 1, 0]);
        if(sunsetOp > 0) {
          let sg = ctx.createRadialGradient(0,0,0, 0,0,45);
          sg.addColorStop(0, \`rgba(255,255,255,\${sunsetOp})\`); sg.addColorStop(0.3, \`rgba(255,237,213,\${0.8*sunsetOp})\`);
          sg.addColorStop(0.6, \`rgba(253,186,116,\${0.3*sunsetOp})\`); sg.addColorStop(1, \`rgba(253,186,116,0)\`);
          ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(0,0,45,0,Math.PI*2); ctx.fill();
        }
        
        let noonOp = interpolateNum(timeOfDay, [6, 7.5, 16.5, 18], [0, 1, 1, 0]);
        if(noonOp > 0) {
          let ng = ctx.createRadialGradient(0,0,0, 0,0,35);
          ng.addColorStop(0, \`rgba(255,255,255,\${noonOp})\`); ng.addColorStop(0.4, \`rgba(254,240,138,\${0.4*noonOp})\`);
          ng.addColorStop(1, \`rgba(254,240,138,0)\`);
          ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(0,0,35,0,Math.PI*2); ctx.fill();
        }
        
        ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.arc(0,0,16,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0,0,12,0,Math.PI*2); ctx.fill();
        ctx.restore();
      }

      let moonProg = 0;
      if (timeOfDay >= 18) moonProg = interpolateNum(timeOfDay, [18, 24], [0, 0.5]);
      else if (timeOfDay < 6) moonProg = interpolateNum(timeOfDay, [0, 6], [0.5, 1]);
      
      if (timeOfDay >= 17.5 || timeOfDay <= 6.5) {
        const mx = -20 + moonProg * (width + 40);
        const my = height * 0.45 - Math.sin(moonProg * Math.PI) * (height * 0.35);
        
        ctx.save(); ctx.translate(mx, my); ctx.scale(0.8, 0.8);
        
        let boost = interpolateNum(timeOfDay, [0,6,12,18,24], [1,0.15,0,0.15,1]);
        let pulse = 0.7 + Math.sin(globalTime * 2) * 0.15;
        let mr = 25 + (25 * boost);
        
        let mg = ctx.createRadialGradient(0,0,0, 0,0,mr);
        mg.addColorStop(0.2, \`rgba(255,255,255,\${0.8*pulse*boost})\`); mg.addColorStop(0.5, \`rgba(191,219,254,\${0.25*pulse*boost})\`);
        mg.addColorStop(1, \`rgba(255,255,255,0)\`);
        ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(0,0,mr,0,Math.PI*2); ctx.fill();
        
        ctx.rotate(-18 * Math.PI / 180);
        ctx.fillStyle = "#F8FAFC"; ctx.beginPath(); ctx.arc(0,0,25,0,Math.PI*2); ctx.fill();
        
        ctx.fillStyle = "rgba(203,213,225,0.3)"; ctx.beginPath(); ctx.arc(-5,-10,4.5,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = "rgba(203,213,225,0.15)"; ctx.beginPath(); ctx.arc(10,5,7,0,Math.PI*2); ctx.fill();
        ctx.restore();
      }
    }

    function drawClouds(dt) {
      ctx.fillStyle = '#f8fafc';
      clouds.forEach(c => {
        c.x -= c.speed * dt * 30;
        if (c.x < -c.size*2) c.x = width + c.size;
        
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.translate(c.x, c.y);
        ctx.scale(c.flip * (c.size/160), c.size/160);
        
        ctx.save(); ctx.translate(0, 6); ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fill(paths.cloud); ctx.restore();
        ctx.fillStyle = '#f8fafc'; ctx.fill(paths.cloud);
        ctx.save(); ctx.translate(-4, -4); ctx.scale(0.96, 0.96); ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fill(paths.cloud); ctx.restore();
        
        ctx.restore();
      });
    }

    function drawLandscape() {
      const s = SEASONS[season];
      const mtnColor = interpolate(timeOfDay, [0,6,12,18,24], s.hill);
      
      const drawHill = (path, tY, op, gradColors, stroke) => {
        ctx.save();
        ctx.translate(0, height * 0.65 + tY); 
        ctx.scale(width * 1.5 / 100, height * 0.35 / 100);
        
        ctx.globalAlpha = op;
        ctx.fillStyle = mtnColor; ctx.fill(path);
        if (stroke) { ctx.lineWidth = 1; ctx.strokeStyle = stroke; ctx.stroke(path); }
        
        let grad = ctx.createLinearGradient(0,0,0,100);
        grad.addColorStop(0, gradColors[0]); grad.addColorStop(1, gradColors[1]);
        ctx.fillStyle = grad; ctx.fill(path);
        ctx.restore();
      };

      drawHill(paths.hillBack, 0, 0.4, ['rgba(255,255,255,0.2)', 'rgba(0,0,0,0.1)']);
      
      let fogOp = (weather === 'fog' || weather === 'haze') ? 0.85 : 0;
      if (fogOp > 0) {
        let fg = ctx.createLinearGradient(0, height*0.65, 0, height);
        fg.addColorStop(0.3, \`rgba(226,232,240,0)\`); fg.addColorStop(1, \`rgba(226,232,240,\${fogOp})\`);
        ctx.fillStyle = fg; ctx.fillRect(0, height*0.65, width, height*0.35);
      }

      drawHill(paths.hillMid, 10, 0.7, ['rgba(255,255,255,0.1)', 'rgba(0,0,0,0.3)'], 'rgba(255,255,255,0.2)');
      drawHill(paths.hillFront, 20, 1, ['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)'], 'rgba(255,255,255,0.3)');
    }

    function drawTrees() {
      const s = SEASONS[season];
      const colBg = interpolate(timeOfDay, [0,12,24], s.treeBg);
      const colMid = interpolate(timeOfDay, [0,12,24], s.treeMid);
      const colFore = interpolate(timeOfDay, [0,12,24], s.treeFore);

      const renderLayer = (trees, color) => {
        trees.forEach(t => {
          ctx.save();
          let phased = windAnim * Math.cos(t.phase * Math.PI * 2);
          let deg = phased * t.windStr * 6;
          let tx = phased * t.windStr * (t.w * 0.05);
          
          ctx.translate(t.x + tx, t.y);
          ctx.rotate(deg * Math.PI / 180);
          ctx.translate(0, -t.h); 
          ctx.scale(t.w / 38.08, t.h / 70.37); 

          ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(19, 66, 15, 3.5, 0, 0, Math.PI*2); ctx.fill();
          
          ctx.fillStyle = color; ctx.fill(paths.treeBot); ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fill(paths.treeBot);
          ctx.fillStyle = color; ctx.fill(paths.treeMid); ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fill(paths.treeMid);
          ctx.fillStyle = color; ctx.fill(paths.treeTop); ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fill(paths.treeTop);
          ctx.fillStyle = color; ctx.fill(paths.treePeak); ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fill(paths.treePeak);
          
          ctx.restore();
        });
      };

      renderLayer(treesBg, colBg);
      renderLayer(treesMid, colMid);
      renderLayer(treesFore, colFore);
    }

    function drawWater() {
      const startY = height * 0.90;
      const hours = new Date().getHours() + new Date().getMinutes()/60;
      const isNight = hours < 6 || hours > 19;
      
      const deepCol = interpolate(timeOfDay, [0,6,12,18,24], WATER_DEEP);
      const shalCol = interpolate(timeOfDay, [0,6,12,18,24], WATER_SHAL);
      
      // 1. Deep Base
      ctx.fillStyle = deepCol;
      ctx.fillRect(0, startY, width, height - startY);

      // 2. Sun/Moon Path Reflection
      const sunProg = interpolateNum(timeOfDay, [6, 18], [0, 1]);
      const moonProg = (timeOfDay >= 18) ? interpolateNum(timeOfDay, [18, 24], [0, 0.5]) : interpolateNum(timeOfDay, [0, 6], [0.5, 1]);
      const activeX = (sunProg > 0 && sunProg < 1) ? (-20 + sunProg * (width + 40)) : (-20 + moonProg * (width + 40));
      
      const pathGrad = ctx.createLinearGradient(activeX - 60, 0, activeX + 60, 0);
      const pCol = isNight ? 'rgba(191,219,254,0.35)' : 'rgba(255,251,235,0.45)';
      pathGrad.addColorStop(0, 'rgba(0,0,0,0)'); pathGrad.addColorStop(0.5, pCol); pathGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = pathGrad;
      ctx.fillRect(activeX - 80, startY, 160, height - startY);

      // 3. Painterly Waves (The 'Ponyo' Style)
      const drawGhibliWave = (yOff, amp, freq, speed, phase, col, isTop) => {
        ctx.save();
        ctx.translate(0, startY + yOff);
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(0, 100); ctx.lineTo(0, 0);
        let shift = -(globalTime * speed) % (width * 2);
        for(let x=0; x<=width+10; x+=4) {
          let tx = x - shift;
          let y = Math.sin((tx / width) * Math.PI * freq + phase) * amp;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, 100); ctx.fill();
        
        if (isTop) {
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.globalAlpha = 0.5;
          ctx.stroke();
        }
        ctx.restore();
      };

      drawGhibliWave(2, 6, 4, 6, 0, shalCol, false);
      drawGhibliWave(15, 8, 3, 10, Math.PI, shalCol, false);
      drawGhibliWave(30, 10, 2, 16, Math.PI/2, shalCol, true);

      // 4. Horizontal Glimmer Ripples
      ctx.save();
      ctx.lineWidth = 1.5;
      for(let i=0; i<8; i++) {
        let y = startY + 10 + (i * 8);
        let op = 0.1 + (i * 0.05);
        ctx.strokeStyle = \`rgba(255,255,255,\${op})\`;
        ctx.beginPath();
        for(let x=0; x<width; x+=60) {
          let gx = x + Math.sin(globalTime * 0.4 + i) * 60;
          let gw = 30 + Math.sin(globalTime * 0.3 + i) * 20;
          ctx.moveTo(gx, y); ctx.lineTo(gx + gw, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawWeather() {
      if (weather === 'thunder' || weather === 'storm') {
        if (thunderFlash > 0) {
          ctx.fillStyle = \`rgba(203, 213, 225, \${thunderFlash * 0.3})\`;
          ctx.fillRect(0,0,width,height);
          
          if (lightningPath) {
            ctx.lineJoin = 'round';
            const p = new Path2D(lightningPath);
            ctx.strokeStyle = \`rgba(167, 139, 250, \${thunderFlash * 0.8})\`;
            ctx.lineWidth = 20; ctx.stroke(p);
            ctx.strokeStyle = \`rgba(255, 255, 255, \${thunderFlash})\`;
            ctx.lineWidth = 4; ctx.stroke(p);
          }
        }
      }

      if (weather === 'rain' || weather === 'thunder' || weather === 'storm') {
        ctx.lineCap = 'round';
        const drawR = (count, len, slant, speed, col, wid) => {
          ctx.strokeStyle = col; ctx.lineWidth = wid; ctx.beginPath();
          for(let i=0; i<count; i++) {
            let x = (i * (width*1.5)/count) - width*0.2;
            let y = -height + ((globalTime * speed + i*100) % (height*2));
            ctx.moveTo(x, y); ctx.lineTo(x + slant, y + len);
          }
          ctx.stroke();
        };
        drawR(40, 20, -10, 600, 'rgba(186, 212, 255, 0.2)', 1); 
        drawR(20, 45, -15, 900, 'rgba(219, 234, 254, 0.4)', 1.8);
        drawR(10, 80, -25, 1250, 'rgba(255, 255, 255, 0.6)', 3);
      }

      if (weather === 'snow') {
        ctx.lineCap = 'round';
        const drawS = (count, speed, sway, col, wid) => {
          ctx.strokeStyle = col; ctx.lineWidth = wid; ctx.beginPath();
          let swayX = Math.sin(globalTime * sway) * (wid * 3);
          for(let i=0; i<count; i++) {
            let x = (i * width/count) + swayX;
            let y = -height + ((globalTime * speed + i*200) % (height*2));
            ctx.moveTo(x, y); ctx.lineTo(x, y+0.1); 
          }
          ctx.stroke();
        };
        drawS(70, 75, 2, 'rgba(255, 255, 255, 0.4)', 3); 
        drawS(40, 150, 1.5, 'rgba(255, 255, 255, 0.8)', 6);
      }
    }

    function drawAnimeParticles() {
      animeParticles.forEach(p => {
        let y = -((globalTime * 50 * p.speed) % (height * 1.5)) + height * 1.5; 
        let x = p.x + Math.sin(globalTime * 2) * 15;
        let op = 0.4 + Math.abs(Math.sin(globalTime * 5 + p.phase)) * 0.6;
        
        ctx.globalAlpha = op * 0.25;
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(x + Math.sin(p.phase)*10, y, p.size*3.5, 0, Math.PI*2); ctx.fill();
        
        ctx.globalAlpha = op * 0.9;
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x + Math.sin(p.phase)*10, y, p.size, 0, Math.PI*2); ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    // --- GAME LOOP ---
    let lastDrawTime = Date.now();
    let lastLogicTime = Date.now();
    
    function loop() {
      if(!isPlaying) { requestAnimationFrame(loop); return; }
      
      const now = Date.now();
      const elapsedDraw = now - lastDrawTime;
      
      if (elapsedDraw < FRAME_INTERVAL) {
        requestAnimationFrame(loop);
        return;
      }
      
      const dt = (now - lastLogicTime) / 1000;
      lastLogicTime = now;
      lastDrawTime = now - (elapsedDraw % FRAME_INTERVAL);

      globalTime += dt * 0.5; 

      // ── HARDWIRED REAL-TIME SYNC ──
      const d = new Date();
      timeOfDay = d.getHours() + (d.getMinutes() / 60) + (d.getSeconds() / 3600);

      if (Math.random() < 0.01) windAnim = Math.min(1, windAnim + 0.1);
      else windAnim = Math.max(0, windAnim - 0.02);

      ctx.clearRect(0, 0, width, height);

      drawSky();
      drawSunMoon();
      drawClouds(dt);
      drawLandscape();
      drawTrees();
      drawWater();

      let nightOp = interpolateNum(timeOfDay, [0,6,12,18,24], [0.65, 0.1, 0, 0.1, 0.65]);
      if (nightOp > 0) {
        ctx.fillStyle = \`rgba(2, 8, 24, \${nightOp})\`;
        ctx.fillRect(0,0,width,height);
      }

      drawWeather();
      drawAnimeParticles();

      requestAnimationFrame(loop);
    }

    setInterval(() => {
      if (weather === 'thunder' || weather === 'storm') {
        let curX = Math.random() * width, curY = 0;
        let d = \`M\${curX},0\`;
        for(let i=0; i<10; i++){
          curX += (Math.random() - 0.5) * 120; curY += height/10 + (Math.random()*20);
          d += \` L\${curX},\${curY}\`;
        }
        lightningPath = d;
        thunderFlash = 1;
        setTimeout(()=> thunderFlash = 0, 40);
        setTimeout(()=> thunderFlash = 0.6, 140);
        setTimeout(()=> thunderFlash = 0, 180);
      }
    }, 4500);

    window.addEventListener("pauseWallpaper", () => isPlaying = false);
    window.addEventListener("playWallpaper", () => {
      if(!isPlaying) {
        isPlaying = true;
        lastLogicTime = Date.now();
        lastDrawTime = Date.now();
        loop();
      }
    });

    setTimeout(() => {
      resize();
      window.addEventListener('resize', resize);
      loop();
    }, 100);

  <\/script>
</body>
</html>`;



export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'live',
    name: { en: 'Interactive', hi: 'इंटरएक्टिव', ja: 'インタラクティブ', fr: 'Interactif' },
    title: 'Live & Interactive',
    image: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=2000',
    count: '5 New',
    type: 'live'
  },
  {
    id: 'abstract',
    name: { en: 'Abstract Elements', hi: 'एब्सट्रैक्ट', ja: '抽象', fr: 'Abstrait' },
    title: 'Abstract Elements',
    image: require('../assets/images/categories/category-1.webp'),
    count: '120+',
    type: 'image'
  },
  {
    id: 'nature',
    name: { en: 'Minimal Nature', hi: 'प्रकृति', ja: '自然', fr: 'Nature' },
    title: 'Minimal Nature',
    image: require('../assets/images/categories/category-2.webp'),
    count: '85+',
    type: 'image'
  },
  {
    id: 'urban',
    name: { en: 'Urban Geometry', hi: 'शहरी', ja: '都市', fr: 'Urbain' },
    title: 'Urban Geometry',
    image: require('../assets/images/categories/category-3.webp'),
    count: '98+',
    type: 'image'
  },
  {
    id: 'chill_nature_live',
    name: { en: 'chill nature live', hi: 'चिल नेचर लाइव', ja: 'チル ネイチャー ライブ', fr: 'Nature détente en direct' },
    title: 'chill nature live',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=2000',
    count: '1 New',
    type: 'live'
  },
];

export const SATURN_3D_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <style>
    body, html {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(#2a3340, #172533);
      overflow: hidden;
      touch-action: none; /* Prevents native mobile scrolling */
    }
    #world {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 1;
    }
    canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 99 !important;
      display: block;
    }
  </style>
  
  <script src="./three.min.js"><\/script>
  
</head>
<body>
  <div id="world"></div>

  <script>
    // --- SCENE PARAMETERS (Hardcoded, GUI removed) ---
    var parameters = {
      minRadius : 30,
      maxRadius : 50,
      minSpeed: .015,
      maxSpeed: .025,
      particles: 300,
      minSize: .1,
      maxSize: 2,
    };

    var Colors = {
      green : 0x8fc999,
      blue : 0x5fc4d0,
      orange : 0xee5624,
      yellow : 0xfaff70,
    };
    var colorsLength = Object.keys(Colors).length;

    function getMat(color){
      return new THREE.MeshLambertMaterial({
        color: color,
        shading: THREE.FlatShading
      });
    }

    function getRandomColor(){
      var colIndx = Math.floor(Math.random()*colorsLength);
      var colorStr = Object.keys(Colors)[colIndx];
      return Colors[colorStr];
    }

    var scene, renderer, camera, saturn, light;
    var WIDTH, HEIGHT;
    var isPlaying = true; // Battery optimization

    function initWorld(){
      scene = new THREE.Scene();
      
      HEIGHT = window.innerHeight || window.screen.height;
      WIDTH = window.innerWidth || window.screen.width;
      
      camera = new THREE.PerspectiveCamera(75, WIDTH/HEIGHT, .1, 2000);
      
      // MOBILE ZOOM TRICK: Pull camera back on narrow screens
      camera.position.z = (WIDTH < 600) ? 180 : 100;
      camera.position.y = 20; // Lift camera slightly for better angle
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      
      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(WIDTH, HEIGHT);
      renderer.shadowMap.enabled = true;
      
      var container = document.getElementById('world');
      container.appendChild(renderer.domElement);  
      
      // LIGHTS
      var ambientLight = new THREE.AmbientLight(0x663344, 2);
      scene.add(ambientLight);
      
      light = new THREE.DirectionalLight(0xffffff, 1.5);
      light.position.set(200, 100, 200);
      light.castShadow = true;
      light.shadow.camera.left = -400;
      light.shadow.camera.right = 400;
      light.shadow.camera.top = 400;
      light.shadow.camera.bottom = -400;
      light.shadow.camera.near = 1;
      light.shadow.camera.far = 1000;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      scene.add(light);
      
      // EVENTS
      window.addEventListener('resize', handleWindowResize, false);
      window.addEventListener("pauseWallpaper", () => isPlaying = false);
      window.addEventListener("playWallpaper", () => {
        if(!isPlaying){ isPlaying = true; loop(); }
      });

      // CREATE SATURN
      saturn = new Saturn();
      saturn.mesh.rotation.x = .2;
      saturn.mesh.rotation.z = .2;
      scene.add(saturn.mesh);
    }

    var Saturn = function(){
      var geomPlanet = new THREE.TetrahedronGeometry(20, 2);
      
      var noise = 5;
      for(var i=0; i<geomPlanet.vertices.length; i++){
        var v = geomPlanet.vertices[i];
        v.x += -noise/2 + Math.random()*noise;
        v.y += -noise/2 + Math.random()*noise;
        v.z += -noise/2 + Math.random()*noise;
      }

      var matPlanet = getMat(Colors.orange);
      this.planet = new THREE.Mesh(geomPlanet, matPlanet);

      this.ring = new THREE.Mesh();
      this.nParticles = 0;

      this.updateParticlesCount();
      
      this.mesh = new THREE.Object3D();
      this.mesh.add(this.planet);
      this.mesh.add(this.ring);

      this.planet.castShadow = true;
      this.planet.receiveShadow = true;

      this.updateParticlesRotation();
    }

    Saturn.prototype.updateParticlesCount = function(){
      if (this.nParticles < parameters.particles){
        for (var i=this.nParticles; i< parameters.particles; i++){
          var p = new Particle();
          p.mesh.rotation.x = Math.random()*Math.PI;
          p.mesh.rotation.y = Math.random()*Math.PI;
          p.mesh.position.y = -2 + Math.random()*4;
          this.ring.add(p.mesh);
        }
      } else {
        while(this.nParticles > parameters.particles){
          var m = this.ring.children[this.nParticles-1];
          this.ring.remove(m);
          m.userData.po = null;
          this.nParticles--;
        }
      }
      this.nParticles = parameters.particles;
      this.angleStep = Math.PI*2/this.nParticles;
      this.updateParticlesDefiniton();
    }

    Saturn.prototype.updateParticlesDefiniton = function(){
      for(var i=0; i<this.nParticles; i++){
        var m = this.ring.children[i];
        var s = parameters.minSize + Math.random()*(parameters.maxSize - parameters.minSize);
        m.scale.set(s,s,s);
        
        m.userData.distance = parameters.minRadius +  Math.random()*(parameters.maxRadius-parameters.minRadius);
        m.userData.angle = this.angleStep*i;
        m.userData.angularSpeed = rule3(m.userData.distance, parameters.minRadius, parameters.maxRadius, parameters.minSpeed, parameters.maxSpeed);
      }
    }

    var Particle = function(){
      var s = 1;
      var geom, random = Math.random();

      if (random < .25) { geom = new THREE.BoxGeometry(s,s,s); }
      else if (random < .5) { geom = new THREE.CylinderGeometry(0,s,s*2, 4, 1); }
      else if (random < .75) { geom = new THREE.TetrahedronGeometry(s,2); }
      else { geom = new THREE.BoxGeometry(s/6,s,s); }
      
      var color = getRandomColor();
      var mat = getMat(color);

      this.mesh = new THREE.Mesh(geom, mat);
      this.mesh.receiveShadow = true;
      this.mesh.castShadow = true;
      this.mesh.userData.po = this;
    }

    Saturn.prototype.updateParticlesRotation = function(){
      for(var i=0; i<this.nParticles; i++){
        var m = this.ring.children[i];
        m.userData.angle += m.userData.angularSpeed;

        var posX = Math.cos(m.userData.angle)*m.userData.distance;
        var posZ = Math.sin(m.userData.angle)*m.userData.distance;
        m.position.x = posX;
        m.position.z = posZ;

        m.rotation.x += Math.random()*.05;
        m.rotation.y += Math.random()*.05;
        m.rotation.z += Math.random()*.05;
      }
    }

    function loop(){
      if(!isPlaying) { requestAnimationFrame(loop); return; } // Save battery

      // Auto-rotation for wallpaper
      saturn.planet.rotation.y -= .002;
      saturn.mesh.rotation.y -= .001; // Slowly rotate the entire ring system
      saturn.mesh.rotation.x = Math.sin(Date.now() * 0.0003) * 0.15; // Gentle floating effect
      
      saturn.updateParticlesRotation();
      
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }

    function handleWindowResize() {
      HEIGHT = window.innerHeight;
      WIDTH = window.innerWidth;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    }

    function rule3(v,vmin,vmax,tmin, tmax){
      var nv = Math.max(Math.min(v,vmax), vmin);
      var dv = vmax-vmin;
      var pc = (nv-vmin)/dv;
      var dt = tmax-tmin;
      return tmin + (pc*dt);
    }

    // Load instantly (bypassing window.onload bug in Android)
    setTimeout(() => {
      initWorld();
      loop();
    }, 100);

  <\/script>
</body>
</html>`;


export const ROCKET_SVG_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <style>
    body, html {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background-color: #22222A;
      overflow: hidden;
      touch-action: none; /* CRITICAL: Prevents native scrolling while dragging */
    }
    svg {
      position: absolute;
      margin: auto;
      height: 100%;
      width: 100%;
      top: 0; bottom: 0; left: 0; right: 0;
      overflow: visible;
    }
    #instructions {
      display: none;
    }
  </style>
</head>
<body>
  <svg id="illu" viewBox="0 0 1200 1200">
    <defs>
      <g id="star">
        <rect x="9" y="0" fill="#FFE498" width="2" height="20" />
        <rect x="0" y="9" fill="#FFE498" width="20" height="2" />
      </g>
    </defs>
    <g id="stars"></g>
    <g id="moon">
      <circle fill="#ECDFBB" cx="600" cy="600" r="135" />
      <path fill="#F1DEA3" d="M487.3,621.6c0-74.2,60.1-134.3,134.3-134.3c32.7,0,62.7,11.7,86,31.1C683,486,643.9,465,600,465c-74.6,0-135,60.4-135,135c0,43.9,21,83,53.5,107.6C499,684.3,487.3,654.3,487.3,621.6z" />
      <ellipse transform="matrix(0.8563 -0.5164 0.5164 0.8563 -187.6616 353.484)" fill="#F1DEA3" cx="541.5" cy="514" rx="24.7" ry="16.1" />
      <ellipse transform="matrix(-0.4752 -0.8799 0.8799 -0.4752 528.5117 1400.9026)" fill="#F1DEA3" cx="682" cy="542.8" rx="37.7" ry="25.1" />
      <ellipse transform="matrix(-0.4752 -0.8799 0.8799 -0.4752 496.7872 1306.4282)" fill="#F1DEA3" cx="638" cy="505.1" rx="11.8" ry="11.4" />
      <ellipse transform="matrix(0.8862 0.4632 -0.4632 0.8862 340.2807 -211.1433)" fill="#F1DEA3" cx="600" cy="587.2" rx="35.3" ry="40.3" />
      <path fill="#F1DEA3" d="M474.2,550.9c-5.9,15.2-9.2,31.8-9.2,49.1c0,29.6,9.5,56.9,25.7,79.2c24-11.5,38.8-39.7,34.6-70.2C521.1,579,499.8,556.1,474.2,550.9z" />
      <ellipse fill="#F1DEAE" cx="600" cy="701.3" rx="38" ry="23.6" />
      <ellipse transform="matrix(0.945 0.327 -0.327 0.945 235.2577 -199.3432)" fill="#F1DEA3" cx="710.5" cy="600" rx="11" ry="14.9" />
      <path fill="#C3BA95" d="M599.5,683.8c-0.8,0-1.5-0.7-1.5-1.5v-69.9c0-15-12.2-27.2-27.2-27.2c-15,0-27.2,12.2-27.2,27.2c0,0.8-0.7,1.5-1.5,1.5c-0.8,0-1.5-0.7-1.5-1.5c0-16.7,13.6-30.2,30.2-30.2c16.7,0,30.2,13.6,30.2,30.2v69.9C601,683.1,600.3,683.8,599.5,683.8z" />
      <path fill="#C3BA95" d="M570.5,653.3c-11.8,0-21.4-9.6-21.4-21.4c0-0.8,0.7-1.5,1.5-1.5c0.8,0,1.5,0.7,1.5,1.5c0,10.1,8.2,18.3,18.3,18.3c10.1,0,18.3-8.2,18.3-18.3c0-0.8,0.7-1.5,1.5-1.5c0.8,0,1.5,0.7,1.5,1.5C591.8,643.7,582.3,653.3,570.5,653.3z" />
      <path fill="#C3BA95" d="M638.2,653.3c-11.8,0-21.4-9.6-21.4-21.4c0-0.8,0.7-1.5,1.5-1.5c0.8,0,1.5,0.7,1.5,1.5c0,10.1,8.2,18.3,18.3,18.3c10.1,0,18.3-8.2,18.3-18.3c0-0.8,0.7-1.5,1.5-1.5c0.8,0,1.5,0.7,1.5,1.5C659.6,643.7,650,653.3,638.2,653.3z" />
      <path fill="#C3BA95" d="M601.3,731.3c-9.2,0-16.7-7.5-16.7-16.7c0-0.7,0.5-1.2,1.2-1.2c0.7,0,1.2,0.5,1.2,1.2c0,7.9,6.4,14.3,14.3,14.3c7.9,0,14.3-6.4,14.3-14.3c0-0.7,0.5-1.2,1.2-1.2c0.7,0,1.2,0.5,1.2,1.2C618,723.8,610.5,731.3,601.3,731.3z" />
      <path fill="#C3BA95" d="M599.4,704.5c-31.8,0-60.6-16.2-77.2-43.4c-0.7-1.1-0.3-2.5,0.8-3.2c1.1-0.7,2.5-0.3,3.2,0.8c15.7,25.8,43.1,41.2,73.3,41.2c30.4,0,58.9-16.4,74.2-42.7c0.6-1.1,2-1.5,3.1-0.8c1.1,0.6,1.5,2,0.8,3.1C661.4,687.3,631.4,704.5,599.4,704.5z" />
      <path fill="#C3BA95" d="M685.3,660.9c-3,0-5.9-0.8-8.5-2.3c-3.9-2.3-6.8-6-7.9-10.3c-1.2-4.4-0.6-9,1.7-12.9c0.6-1.1,2-1.5,3.1-0.8c1.1,0.6,1.5,2,0.8,3.1c-1.7,2.9-2.1,6.2-1.2,9.5c0.9,3.2,2.9,5.9,5.8,7.6c2.9,1.7,6.2,2.1,9.5,1.2c3.2-0.9,5.9-2.9,7.6-5.8c0.6-1.1,2-1.5,3.1-0.8c1.1,0.6,1.5,2,0.8,3.1c-2.3,3.9-6,6.8-10.3,7.9C688.3,660.7,686.8,660.9,685.3,660.9z" />
      <path fill="#C3BA95" d="M514,661.8c-1.5,0-3-0.2-4.4-0.6c-4.4-1.2-8.1-4-10.3-7.9c-0.6-1.1-0.3-2.5,0.8-3.1c1.1-0.6,2.5-0.3,3.1,0.8c1.7,2.9,4.3,4.9,7.6,5.8c3.2,0.9,6.6,0.4,9.5-1.2c2.9-1.7,4.9-4.3,5.8-7.6c0.9-3.2,0.4-6.6-1.2-9.5c-0.6-1.1-0.3-2.5,0.8-3.1c1.1-0.6,2.5-0.3,3.1,0.8c2.3,3.9,2.9,8.5,1.7,12.9c-1.2,4.4-4,8.1-7.9,10.3C519.9,661,517,661.8,514,661.8z" />
    </g>
    <g id="rocket">
      <g id="fire">
        <path id="red_fire" fill="#EB6736" d="M921,714.8c0-18.3,14.8-33.1,33.1-33.1c18.3,0,33.1,14.8,33.1,33.1c0,18.3-33.1,59.2-33.1,59.2S921,733.1,921,714.8" />
        <path id="yellow_fire" fill="#ECA643" d="M954.8,690.9c-9.4,0-16.9,7.6-16.9,17c0,9.4,17,44.5,17,44.5s16.9-35.2,16.9-44.6C971.7,698.4,964.1,690.9,954.8,690.9" />
      </g>
      <g id="cosmonaut">
        <rect x="929.7" y="608.4" transform="matrix(-1 2.445246e-04 -2.445246e-04 -1 1911.4962 1241.0038)" fill="#059F9F" width="51.9" height="24.5" />
        <circle fill="#F2F2F2" cx="936.6" cy="613.6" r="2.6" />
        <circle fill="#FF662C" cx="943.1" cy="613.6" r="2.6" />
        <circle fill="#F5B547" cx="949.6" cy="613.6" r="2.6" />
        <path fill="#059F9F" d="M985.5,598c0,1.9-1.6,3.5-3.5,3.5l-50.2,0c-1.9,0-3.5-1.6-3.5-3.5l0-46.8c0-1.9,1.6-3.5,3.5-3.5l50.2,0c1.9,0,3.5,1.6,3.5,3.5L985.5,598z" />
        <path fill="#D8D1C3" d="M981.4,579.2c0,2.1-1.7,3.7-3.7,3.7l-41.5,0c-2,0-3.7-1.7-3.7-3.7l0-19.8c0-2,1.7-3.7,3.7-3.7l41.5,0c2,0,3.7,1.7,3.7,3.7L981.4,579.2z" />
        <path fill="#79552D" d="M977.7,555.7l-41.5,0c-2,0-3.7,1.7-3.7,3.7l0,8.7c3.8,2.7,8.4,4.3,13.4,4.3c10.4,0,19.1-6.8,22-16.2c0.9,6.8,6.5,12.1,13.4,12.5l0-9.3C981.4,557.4,979.8,555.7,977.7,555.7" />
        <path fill="#79552D" d="M967.3,558.8c0,3.8-2,7.2-5.1,9c5.3-0.6,9.4-5,9.4-10.4c0-0.5-0.1-1-0.1-1.6l-4.6,0C967.1,556.7,967.3,557.7,967.3,558.8" />
        <path fill="#79552D" d="M970.2,579.4c-0.6,0-1-0.4-1-1c0-1.5-1.2-2.7-2.7-2.7c-1.5,0-2.7,1.2-2.7,2.7c0,0.6-0.4,1-1,1c-0.6,0-1-0.4-1-1c0-2.6,2.1-4.7,4.7-4.7c2.6,0,4.7,2.1,4.7,4.7C971.2,578.9,970.7,579.4,970.2,579.4z" />
        <path fill="#79552D" d="M951.2,579.4c-0.6,0-1-0.4-1-1c0-1.5-1.2-2.7-2.7-2.7c-1.5,0-2.7,1.2-2.7,2.7c0,0.6-0.4,1-1,1c-0.6,0-1-0.4-1-1c0-2.6,2.1-4.7,4.7-4.7c2.6,0,4.7,2.1,4.7,4.7C952.2,578.9,951.8,579.4,951.2,579.4z" />
        <circle fill="#F5B547" cx="978.5" cy="593.1" r="2" />
        <circle fill="#FF662C" cx="972" cy="593.1" r="2" />
        <path fill="#5B5757" d="M985.5,564.4l0,10.1c8.4,1.9,14.7,9.4,14.7,18.4c0,10.4-8.4,18.8-18.8,18.8c-10.4,0-18.8-8.4-18.8-18.8c0-2.8-2.2-5-5-5c-2.8,0-5,2.2-5,5c0,15.9,12.9,28.8,28.8,28.8c15.9,0,28.8-12.9,28.8-28.8C1010.2,578.4,999.5,566.4,985.5,564.4z" />
        <path opacity="0.3" fill="#F2F2F2" d="M945,555.8l-12.5,19.4l0,4.1c0,2.1,1.7,3.7,3.7,3.7l7,0l17.5-27.2L945,555.8z" />
      </g>
      <g id="cabin">
        <path fill="#0E9E9F" d="M855.9,722c-16-43-5.9-87.3,21.3-120.3l24.8,66.5c-17.5,6.5-26.2,26.4-19.7,43.9L855.9,722z" />
        <path fill="#0E9E9F" d="M1054.6,721.9c16-43,5.8-87.3-21.5-120.3l-24.7,66.6c17.5,6.5,26.3,26.4,19.8,43.9L1054.6,721.9z" />
        <rect x="896.4" y="552" transform="matrix(0.7067 -0.7075 0.7075 0.7067 -122.3782 822.5777)" opacity="0.2" fill="#FFFFFF" width="69" height="13.8" />
        <rect x="899.7" y="567.4" transform="matrix(0.7067 -0.7075 0.7075 0.7067 -126.8512 833.3998)" opacity="0.2" fill="#FFFFFF" width="84" height="4.5" />
        <path fill="#0A7370" d="M955.5,430.6c-52.1,30.2-87.1,86.5-87,150.9c0,32.5,8.9,62.9,24.4,88.9l125.5-0.1c15.5-26,24.3-56.4,24.3-88.9C1042.6,517,1007.5,460.7,955.5,430.6z M955.6,625.4c-26.2,0-47.5-21.2-47.5-47.5c0-26.2,21.2-47.5,47.5-47.5c26.2,0,47.5,21.2,47.5,47.5C1003.1,604.1,981.8,625.4,955.6,625.4z" />
        <path fill="#0E9E9F" d="M959.1,426c-2.2,1.3-4.3,2.6-6.4,3.9l0.1,96.3c2.1-0.3,4.3-0.4,6.4-0.4c26.2,0,47.5,21.2,47.5,47.5c0,8.9-2.5,17.3-6.7,24.4l45.1,0c0.8-6.8,1.2-13.8,1.2-20.8C1046.3,512.3,1011.2,456.1,959.1,426z" />
        <path fill="#2B2A2A" d="M955.5,520.8c-32.5,0-58.9,26.4-58.8,58.9c0,32.5,26.4,58.9,58.9,58.8c32.5,0,58.9-26.4,58.8-58.9C1014.4,547.2,988,520.8,955.5,520.8z M955.6,620.5c-22.5,0-40.8-18.2-40.8-40.7c0-22.5,18.2-40.8,40.7-40.8c22.5,0,40.8,18.2,40.8,40.7C996.3,602.2,978.1,620.5,955.6,620.5z" />
        <g>
          <path fill="#FFFFFF" d="M905.3,591.7c-0.4,0-0.8-0.2-1-0.5l-17.2-21.3c-0.5-0.6-0.4-1.4,0.2-1.8c0.6-0.5,1.4-0.4,1.8,0.2l17.2,21.3c0.5,0.6,0.4,1.4-0.2,1.8C905.9,591.6,905.6,591.7,905.3,591.7" />
          <path fill="#FFFFFF" d="M887.5,591.7c-0.3,0-0.6-0.1-0.9-0.3c-0.5-0.5-0.6-1.3-0.1-1.8l18.4-21.3c0.5-0.5,1.3-0.6,1.8-0.1c0.5,0.5,0.6,1.3,0.1,1.8l-18.4,21.3C888.2,591.5,887.8,591.7,887.5,591.7" />
        </g>
        <circle fill="#2B2A2A" cx="959.9" cy="442.8" r="4.5" />
        <circle fill="#2B2A2A" cx="959.9" cy="475.5" r="4.5" />
        <circle fill="#2B2A2A" cx="959.9" cy="508.1" r="4.5" />
        <circle fill="#2B2A2A" cx="1039" cy="590.9" r="3.7" />
        <rect x="1009.4" y="558.8" fill="#2B2A2A" width="12.7" height="43" />
        <rect x="934.3" y="670.4" fill="#2B2A2A" width="42.6" height="4.4" />
        <circle fill="#2B2A2A" cx="1044.4" cy="704.2" r="4.5" />
        <circle fill="#2B2A2A" cx="867" cy="709" r="4.5" />
      </g>
    </g>
  </svg>
  <div id="instructions">Throw the rocket</div>

  <script>
    // --- CUSTOM MICRO-PHYSICS & ANIMATION ENGINE ---
    // Replaces 150kb of GSAP, Draggable, and ThrowProps
    let rocket, fire, yellowFire, stars, smoke;
    let isPlaying = true;
    let autoRotate = true;
    let rocketRotation = 0;
    let rotationVelocity = 0.2; // Slow orbit speed
    let t = 0;

    // Battery Optimization
    window.addEventListener("pauseWallpaper", () => isPlaying = false);
    window.addEventListener("playWallpaper", () => {
      if(!isPlaying){ isPlaying = true; loop(); }
    });

    function updateRocketTransform() {
      // Orbit around the Moon (600, 600).
      // Translate(477.5, 310) scale(0.5) keeps the scaled rocket perfectly relative to its original coordinate base.
      rocket.setAttribute("transform", \`rotate(\${rocketRotation}, 600, 600) translate(477.5, 310) scale(0.5)\`);
    }

    // --- PARTICLE SYSTEM ---
    class Particle {
      constructor(isStar = true) {
        this.isStar = isStar;
        const xmlns = "http://www.w3.org/2000/svg";
        this.el = document.createElementNS(xmlns,"use");
        this.el.setAttribute('href', '#star');
        stars.appendChild(this.el);
        this.reset();
      }

      reset() {
        this.time = 0;
        this.active = true;
        if (this.isStar) {
          const ray = 200 + Math.random() * 200;
          const angle = Math.random() * Math.PI * 2;
          this.x = 600 + Math.cos(angle) * ray;
          this.y = 600 + Math.sin(angle) * ray;
          this.life = 60; // frames
        } else {
          this.x = 955;
          this.y = 730;
          this.life = 30; // frames
          this.scale = 2.5;
        }
        this.updateDOM();
      }

      update() {
        if (!this.active) return;
        this.time++;
        const progress = this.time / this.life;

        if (this.isStar) {
          // Fade in then out, scale up then down
          const opacity = progress < 0.5 ? progress * 2 : 2 - (progress * 2);
          const scale = progress < 0.5 ? progress * 2 : 2 - (progress * 2);
          this.el.setAttribute("transform", \`translate(\${this.x}, \${this.y}) scale(\${scale})\`);
          this.el.setAttribute("opacity", opacity);
        } else {
          // Smoke flies down and scales down
          this.y += 5 + Math.random() * 2;
          this.x += -2 + Math.random() * 4;
          this.scale = Math.max(0, 2.5 * (1 - progress));
          const opacity = 1 - progress;
          this.el.setAttribute("transform", \`translate(\${this.x}, \${this.y}) scale(\${this.scale})\`);
          this.el.setAttribute("opacity", opacity);
          this.el.setAttribute("fill", progress > 0.5 ? "#000000" : "#EA4E39");
        }

        if (this.time >= this.life) {
          this.active = false;
          this.el.setAttribute("opacity", 0);
        }
      }

      updateDOM() {
        if(this.isStar) {
          this.el.setAttribute("transform", \`translate(\${this.x}, \${this.y}) scale(0)\`);
          this.el.setAttribute("opacity", 0);
        }
      }
    }

    const starParticles = [];

    function spawnParticle(isStar) {
      if (!isStar) return;
      const deadParticle = starParticles.find(p => !p.active);
      if (deadParticle) deadParticle.reset();
    }

    // --- MAIN LOOP ---
    function loop() {
      if (!isPlaying) { requestAnimationFrame(loop); return; }
      t++;

      // Spawn Stars
      if (t % 20 === 0) spawnParticle(true);
      
      // Update all particles
      starParticles.forEach(p => p.update());

      // Fire Animation
      const absoluteSpeed = Math.abs(rotationVelocity);
      const fireScaleY = Math.min(1.5, 0.8 + Math.random() * 0.3 + absoluteSpeed / 20);
      const fireScaleX = Math.max(0.4, Math.min(1, 1 - absoluteSpeed / 50));
      const yellowScale = 0.8 + Math.random() * 0.3;
      
      fire.setAttribute("transform", \`translate(950, 680) scale(\${fireScaleX}, \${fireScaleY}) translate(-950, -680)\`);
      yellowFire.setAttribute("transform", \`translate(950, 680) scale(\${yellowScale}) rotate(\${-20 + yellowScale * 20}) translate(-950, -680)\`);

      // Orbit Physics
      rocketRotation -= rotationVelocity;
      updateRocketTransform();

      requestAnimationFrame(loop);
    }

    setTimeout(() => {
      rocket = document.getElementById("rocket"); 
      fire = document.getElementById("fire");
      yellowFire = document.getElementById("yellow_fire"); 
      stars = document.getElementById("stars");

      // Pre-scale the rocket so it fits nicely on screen
      rocket.setAttribute("transform", "translate(200, 0) scale(0.5)");

      // Initialize stars
      for (let i = 0; i < 10; i++) {
        starParticles.push(new Particle());
      }

      updateRocketTransform();
      loop();
    }, 100);

  <\/script>
</body>
</html>`;


export const PRISM_SHADER_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html {
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        overflow: hidden;
        background: #000;
        touch-action: none; /* CRITICAL: Prevents native scrolling while dragging */
        width: 100%;
        height: 100%;
    }
    canvas {
        display: block;
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>

  <script id="vertexShader" type="x-shader/x-vertex">
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
  </script>

  <script id="fragmentShader" type="x-shader/x-fragment">
    precision highp float;
    
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    
    #define PI 3.14159265359
    #define TAU 6.28318530718
    #define MAX_STEPS 48
    #define MAX_DIST 40.0
    #define SURF_DIST 0.0015
    
    float hash(float n) {
        return fract(sin(n) * 43758.5453);
    }
    
    mat2 rot(float a) {
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }
    
    float sdOctahedron(vec3 p, float s) {
        p = abs(p);
        float m = p.x + p.y + p.z - s;
        vec3 q;
        if(3.0 * p.x < m) q = p.xyz;
        else if(3.0 * p.y < m) q = p.yzx;
        else if(3.0 * p.z < m) q = p.zxy;
        else return m * 0.57735;
        
        float k = clamp(0.5 * (q.z - q.y + s), 0.0, s);
        return length(vec3(q.x, q.y - s + k, q.z - k));
    }

    float sdTriPrism(vec3 p, vec2 h) {
        vec3 q = abs(p);
        return max(q.z - h.y, max(q.x * 0.866025 + p.y * 0.5, -p.y) - h.x * 0.5);
    }
    
    float smin(float a, float b, float k) {
        float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
        return mix(b, a, h) - k * h * (1.0 - h);
    }

    float smax(float a, float b, float k) {
        return -smin(-a, -b, k);
    }
    
    float map(vec3 p) {
        vec2 m = (uMouse - 0.5) * 2.5;
        p.xy += m * 0.4;
        
        float t1 = uTime * 0.12;
        float t2 = uTime * 0.08;
        p.xz *= rot(t1);
        p.xy *= rot(t2);
        
        vec3 p1 = p;
        p1.yz *= rot(uTime * 0.15);
        
        // Simplified distortion: sum instead of product
        float core_distort = (sin(p1.x * 3.0 + uTime) + sin(p1.y * 3.0 + uTime) + sin(p1.z * 3.0 + uTime)) * 0.03;
        float core = sdOctahedron(p1, 1.6) + core_distort;
        
        vec3 p2 = p1;
        p2.xy *= rot(0.785 + uTime * 0.2);
        float prism = sdTriPrism(p2, vec2(1.4, 2.0));
        core = smax(core, -prism, 0.2);
        
        float d = core;
        float k_blend = 0.2 + 0.15 * (0.5 + 0.5 * sin(uTime * 1.5));
        
        // Reduced satellites from 4 to 3 for better performance
        for(int i = 0; i < 3; i++) {
            float fi = float(i);
            float angle = fi * 2.094 + uTime * 0.3; // 2.094 = TAU/3
            float radius = 3.0 + 0.3 * sin(uTime * 0.4 + fi);
            
            vec3 pos = vec3(cos(angle) * radius, sin(angle * 0.7), sin(angle) * radius);
            vec3 po = p - pos;
            po.xy *= rot(uTime * 0.5 + fi);
            
            float sat_distort = (sin(po.x * 5.0 + fi) + sin(po.y * 5.0 + fi)) * 0.02;
            float satellite = sdOctahedron(po, 0.4) + sat_distort;
            d = smin(d, satellite, k_blend);
        }
        return d;
    }
    
    // Optimized 4-tap normal calculation (tetrahedron)
    vec3 getNormal(vec3 p) {
        const float e = 0.002;
        const vec2 k = vec2(1,-1);
        return normalize( k.xyy*map(p + k.xyy*e) + 
                          k.yyx*map(p + k.yyx*e) + 
                          k.yxy*map(p + k.yxy*e) + 
                          k.xxx*map(p + k.xxx*e) );
    }
    
    float raymarch(vec3 ro, vec3 rd, int steps) {
        float t = 0.0;
        for(int i = 0; i < 100; i++) {
            if (i >= steps) break;
            float d = map(ro + rd * t);
            if(abs(d) < SURF_DIST || t > MAX_DIST) break;
            t += d * 0.8; // Step size slightly increased
        }
        return t;
    }
    
    vec3 getBackground(vec3 rd) {
        vec3 p = rd * 100.0;
        float h = hash(dot(p, vec3(12.98, 78.23, 54.53)));
        float stars = (h > 0.99) ? pow(h - 0.99, 8.0) * 100.0 : 0.0;
        
        vec3 nebula = vec3(0.0);
        // Simplified nebula
        nebula += vec3(0.3, 0.15, 0.5) * pow(max(0.0, sin(rd.x * 2.0 + uTime * 0.1)), 4.0) * 0.15;
        nebula += vec3(0.15, 0.3, 0.6) * pow(max(0.0, sin(rd.y * 2.5 + uTime * 0.05)), 4.0) * 0.15;
        return stars + nebula;
    }
    
    void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
        vec2 m = (uMouse - 0.5) * 0.5;
        vec3 ro = vec3(m.x * 2.0, m.y * 2.0, 5.5);
        vec3 rd = normalize(vec3(uv, -1.0));
        
        rd.xy *= rot(m.x * 0.2);
        rd.yz *= rot(m.y * 0.2);
        
        float t = raymarch(ro, rd, MAX_STEPS);
        vec3 color = vec3(0.0);
        
        if(t < MAX_DIST) {
            vec3 p = ro + rd * t;
            vec3 normal = getNormal(p);
            vec3 viewDir = normalize(ro - p);
            float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
            
            // Refraction optimization: much fewer steps
            vec3 refractDir = refract(rd, normal, 0.66); // 1.0/1.5
            if(length(refractDir) > 0.0) {
                float t2 = raymarch(p - normal * 0.02, refractDir, 16); // 16 steps only
                if(t2 < MAX_DIST) {
                    vec3 p2 = p - normal * 0.02 + refractDir * t2;
                    vec3 normal2 = getNormal(p2);
                    
                    vec3 r = refract(refractDir, -normal2, 0.77); 
                    vec3 g = refract(refractDir, -normal2, 0.66);
                    vec3 b = refract(refractDir, -normal2, 0.58);
                    
                    color = vec3(getBackground(r).x, getBackground(g).y, getBackground(b).z);
                    color = pow(color, vec3(0.75)) * 4.0;
                } else {
                    color = getBackground(refractDir) * 2.0;
                }
            }
            
            vec3 lightDir = normalize(vec3(1.0, 1.0, -1.0));
            float spec = pow(max(dot(normal, normalize(lightDir + viewDir)), 0.0), 128.0);
            color += spec * 3.0;
            
            vec3 fresnelColor = vec3(0.5) + vec3(0.5) * sin(fresnel * TAU + uTime + vec3(0.0, 2.09, 4.18));
            color += fresnel * fresnelColor * 1.2;
            
            color += pow(1.0 - abs(dot(viewDir, normal)), 4.0) * vec3(0.6, 0.7, 1.0) * 0.6;
            color += pow(max(dot(-normal, lightDir), 0.0), 2.0) * vec3(1.0, 0.6, 0.8) * 0.4;
            
        } else {
            color = getBackground(rd);
        }
        
        color *= smoothstep(0.3, 1.0, 1.0 - length(uv) * 0.4);
        color = pow(color * 1.1, vec3(0.85));
        
        gl_FragColor = vec4(color, 1.0);
    }
  <\/script>

  <script>
    let isPlaying = true;
    
    function initWebGL() {
        const canvas = document.getElementById('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        function createShader(gl, type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }
        
        function createProgram(gl, vertexShader, fragmentShader) {
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error('Program link error:', gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
                return null;
            }
            return program;
        }
        
        const vertexShaderSource = document.getElementById('vertexShader').textContent;
        const fragmentShaderSource = document.getElementById('fragmentShader').textContent;
        
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        const program = createProgram(gl, vertexShader, fragmentShader);
        
        const uTime = gl.getUniformLocation(program, 'uTime');
        const uResolution = gl.getUniformLocation(program, 'uResolution');
        const uMouse = gl.getUniformLocation(program, 'uMouse');
        
        const positions = new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
             1,  1,
        ]);
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        
        const mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
        
        // Touch & Mouse handling
        function updateMouse(clientX, clientY) {
            mouse.targetX = clientX / canvas.width;
            mouse.targetY = 1.0 - clientY / canvas.height;
        }
        canvas.addEventListener('mousemove', (e) => updateMouse(e.clientX, e.clientY));
        canvas.addEventListener('touchstart', (e) => { if(e.touches.length > 0) updateMouse(e.touches[0].clientX, e.touches[0].clientY); }, {passive: true});
        canvas.addEventListener('touchmove', (e) => { if(e.touches.length > 0) updateMouse(e.touches[0].clientX, e.touches[0].clientY); }, {passive: true});

        // BATTERY OPTIMIZATION (Prevent jumping time when paused)
        let lastTime = Date.now();
        let accumulatedTime = 0;

        window.addEventListener("pauseWallpaper", () => isPlaying = false);
        window.addEventListener("playWallpaper", () => { 
            if(!isPlaying){ 
                isPlaying = true; 
                lastTime = Date.now(); // Reset clock delta so animation doesn't jump
            }
        });

        function render() {
            if(!isPlaying) {
                requestAnimationFrame(render);
                return;
            }

            const now = Date.now();
            accumulatedTime += (now - lastTime) * 0.001;
            lastTime = now;
            
            mouse.x += (mouse.targetX - mouse.x) * 0.05;
            mouse.y += (mouse.targetY - mouse.y) * 0.05;
            
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(program);
            
            gl.uniform1f(uTime, accumulatedTime);
            gl.uniform2f(uResolution, canvas.width, canvas.height);
            gl.uniform2f(uMouse, mouse.x, mouse.y);
            
            const positionLocation = gl.getAttribLocation(program, 'position');
            gl.enableVertexAttribArray(positionLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            
            requestAnimationFrame(render);
        }
        render();
    }

    // Bypass Android WebView dimension bugs by delaying init slightly
    setTimeout(initWebGL, 100);
  <\/script>
</body>
</html>`;

export const CYBER_CORE_3D_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <style>
    body {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #010102;
        user-select: none;
        font-family: sans-serif;
        touch-action: none; /* CRITICAL: Prevents native scrolling */
    }
    canvas {
        display: block;
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }
    #instructions {
        position: absolute;
        width: 100%;
        bottom: 40px;
        text-align: center;
        color: rgba(255,255,255,0.5);
        font-size: 0.9rem;
        letter-spacing: 2px;
        text-transform: uppercase;
        z-index: 10;
        pointer-events: none;
    }
  </style>

  <script src="./three.min.js"><\/script>

</head>
<body>
  <canvas id="canvas"></canvas>
  <div id="instructions">Tap to shift spectrum</div>

  <script>
    const themes = [
        {
            core: [new THREE.Color(0.1, 0.0, 0.0), new THREE.Color(0.9, 0.05, 0.0), new THREE.Color(1.0, 0.4, 0.0), new THREE.Color(1.0, 0.9, 0.2)],
            vein: { surface: new THREE.Color(0.0, 0.8, 1.0), coreA: new THREE.Color(0.8, 0.1, 0.0), coreB: new THREE.Color(1.0, 0.6, 0.0) },
            boundary: new THREE.Color(0.0, 1.5, 3.0),
            volcano: new THREE.Color(0xff5500),
            dust: new THREE.Color(0x223355),
            bg: new THREE.Color(0x010102)
        },
        {
            core: [new THREE.Color(0.05, 0.0, 0.1), new THREE.Color(0.5, 0.0, 0.5), new THREE.Color(1.0, 0.0, 0.8), new THREE.Color(1.0, 0.5, 1.0)],
            vein: { surface: new THREE.Color(0.2, 1.0, 0.2), coreA: new THREE.Color(0.8, 0.0, 0.8), coreB: new THREE.Color(0.0, 0.8, 1.0) },
            boundary: new THREE.Color(2.0, 0.0, 1.5), 
            volcano: new THREE.Color(0x00ff00), 
            dust: new THREE.Color(0x2a0044),
            bg: new THREE.Color(0x020005)
        },
        {
            core: [new THREE.Color(0.05, 0.02, 0.0), new THREE.Color(0.8, 0.4, 0.0), new THREE.Color(1.0, 0.8, 0.2), new THREE.Color(1.5, 1.5, 1.5)],
            vein: { surface: new THREE.Color(0.0, 0.3, 2.0), coreA: new THREE.Color(1.0, 0.8, 0.0), coreB: new THREE.Color(1.0, 0.3, 0.0) },
            boundary: new THREE.Color(1.5, 1.5, 2.5), 
            volcano: new THREE.Color(0xffffff),
            dust: new THREE.Color(0x443311),
            bg: new THREE.Color(0x000103)
        }
    ];
    
    let activeTheme = 0;
    let isPlaying = true; // Battery optimization
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;
    let isDragging = false;
    let previousX = 0;
    let previousY = 0;

    const snoise3GLSL = \`
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
            const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 = v - i + dot(i, C.xxx) ;
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy; 
            vec3 x3 = x0 - D.yyy;      
            i = mod289(i);
            vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
            float n_ = 0.142857142857; 
            vec3  ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );    
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
        }
    \`;

    function init() {
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(themes[0].bg.getHex(), 0.012);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        // Zoom out slightly on mobile screens
        camera.position.set(0, 0, (window.innerWidth < 600) ? 35 : 25);

        const canvas = document.getElementById('canvas');
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

        const mainGroup = new THREE.Group();
        scene.add(mainGroup);

        const CORE_RADIUS = 2.2;
        const OUTER_RADIUS = 10.0;
        const NUM_VEINS = 1000; 
        const POINTS_PER_VEIN = 40;

        const uniforms = {
            time: { value: 0 },
            cDark: { value: themes[0].core[0].clone() },
            cRed: { value: themes[0].core[1].clone() },
            cOrange: { value: themes[0].core[2].clone() },
            cYellow: { value: themes[0].core[3].clone() },
            cSurface: { value: themes[0].vein.surface.clone() },
            cCoreA: { value: themes[0].vein.coreA.clone() },
            cCoreB: { value: themes[0].vein.coreB.clone() },
            boundaryColor: { value: themes[0].boundary.clone() }
        };

        // 1. AMBIENT DUST
        const dustGeo = new THREE.BufferGeometry();
        const dustPositions = [];
        for(let i = 0; i < 1500; i++) {
            dustPositions.push((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
        }
        dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3));
        const dustMat = new THREE.PointsMaterial({
            color: themes[0].dust.clone(), size: 0.2,
            transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending
        });
        const dustMesh = new THREE.Points(dustGeo, dustMat);
        scene.add(dustMesh);

        // 2. GLOWING CORE
        const coreGeo = new THREE.SphereGeometry(CORE_RADIUS, 64, 64);
        const coreMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: \`
                uniform float time;
                varying vec3 vPosition;
                varying vec3 vNormal;
                \${snoise3GLSL}
                void main() {
                    vPosition = position;
                    vNormal = normal;
                    float displacement = snoise(position * 1.8 + time * 0.4) * 0.15;
                    vec3 newPosition = position + normal * displacement;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            \`,
            fragmentShader: \`
                uniform float time;
                uniform vec3 cDark;
                uniform vec3 cRed;
                uniform vec3 cOrange;
                uniform vec3 cYellow;
                varying vec3 vPosition;
                varying vec3 vNormal;
                \${snoise3GLSL}
                void main() {
                    float n1 = snoise(vPosition * 1.5 - time * 0.5);
                    float n2 = snoise(vPosition * 4.0 + time * 0.3);
                    float noiseVal = n1 * 0.6 + n2 * 0.4;
                    vec3 color;
                    if (noiseVal < -0.1) {
                        color = mix(cDark, cRed, smoothstep(-0.5, -0.1, noiseVal));
                    } else if (noiseVal < 0.3) {
                        color = mix(cRed, cOrange, smoothstep(-0.1, 0.3, noiseVal));
                    } else {
                        color = mix(cOrange, cYellow, smoothstep(0.3, 0.8, noiseVal));
                    }
                    float fresnel = dot(vNormal, vec3(0.0, 0.0, 1.0));
                    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
                    color += cOrange * pow(fresnel, 2.0) * 0.8;
                    color *= 1.8; // Boost brightness since we removed Bloom Pass
                    gl_FragColor = vec4(color, 1.0);
                }
            \`
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        mainGroup.add(coreMesh);

        // HELPER
        function getPointOnSphere(radius) {
            const u = Math.random(), v = Math.random();
            const theta = 2 * Math.PI * u, phi = Math.acos(2 * v - 1);
            return new THREE.Vector3(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
        }

        // 3. ENERGY VEINS
        const veinPositions = [], veinProgress = [], veinOffsets = [], veinRands = [];
        for (let i = 0; i < NUM_VEINS; i++) {
            const start = getPointOnSphere(OUTER_RADIUS);
            const end = start.clone().normalize().multiplyScalar(CORE_RADIUS * 0.85); 
            const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
            mid.normalize().multiplyScalar(OUTER_RADIUS * 0.55);
            
            const tangent = new THREE.Vector3().crossVectors(start, new THREE.Vector3(0,1,0)).normalize();
            const bitangent = new THREE.Vector3().crossVectors(start, tangent).normalize();
            mid.add(tangent.multiplyScalar((Math.random() - 0.5) * 6));
            mid.add(bitangent.multiplyScalar((Math.random() - 0.5) * 6));

            const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
            const points = curve.getPoints(POINTS_PER_VEIN);
            const offset = Math.random(), randSeed = Math.random();

            for (let j = 0; j < POINTS_PER_VEIN; j++) {
                veinPositions.push(points[j].x, points[j].y, points[j].z);
                veinPositions.push(points[j+1].x, points[j+1].y, points[j+1].z);
                veinProgress.push(j / POINTS_PER_VEIN, (j + 1) / POINTS_PER_VEIN);
                veinOffsets.push(offset, offset);
                veinRands.push(randSeed, randSeed);
            }
        }
        const veinGeo = new THREE.BufferGeometry();
        veinGeo.setAttribute('position', new THREE.Float32BufferAttribute(veinPositions, 3));
        veinGeo.setAttribute('progress', new THREE.Float32BufferAttribute(veinProgress, 1));
        veinGeo.setAttribute('offset', new THREE.Float32BufferAttribute(veinOffsets, 1));
        veinGeo.setAttribute('randomSeed', new THREE.Float32BufferAttribute(veinRands, 1));

        const veinMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: \`
                attribute float progress;
                attribute float offset;
                attribute float randomSeed;
                varying float vProgress;
                varying float vOffset;
                varying float vRandom;
                void main() {
                    vProgress = progress;
                    vOffset = offset;
                    vRandom = randomSeed;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            \`,
            fragmentShader: \`
                uniform float time;
                uniform vec3 cSurface;
                uniform vec3 cCoreA;
                uniform vec3 cCoreB;
                varying float vProgress;
                varying float vOffset;
                varying float vRandom;
                void main() {
                    vec3 targetCoreColor = mix(cCoreA, cCoreB, vRandom);
                    vec3 color = mix(cSurface, targetCoreColor, pow(vProgress, 1.5));
                    float speed = 0.3;
                    float phase = vProgress - time * speed + vOffset * 10.0;
                    float flow = fract(phase);
                    float pulse = exp(-flow * 10.0);
                    vec3 pulseGlow = color * pulse * 12.0; 
                    color += pulseGlow;
                    float alpha = (0.02 + pulse * 0.9) * smoothstep(0.0, 0.05, vProgress) * smoothstep(1.0, 0.8, vProgress);
                    gl_FragColor = vec4(color, alpha);
                }
            \`,
            transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
        });
        const veinMesh = new THREE.LineSegments(veinGeo, veinMat);
        mainGroup.add(veinMesh);

        // 4. PROCEDURAL PLANETARY SHELL (Replaces offline image)
        const earthGlobeGeo = new THREE.SphereGeometry(OUTER_RADIUS * 0.995, 128, 128);
        const earthGlobeMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: \`
                varying vec3 vPosition;
                varying vec3 vNormal;
                void main() {
                    vPosition = position;
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            \`,
            fragmentShader: \`
                uniform float time;
                uniform vec3 boundaryColor;
                varying vec3 vPosition;
                varying vec3 vNormal;
                \${snoise3GLSL}

                void main() {
                    // Procedural continental edges using 3D noise
                    float n = snoise(vPosition * 0.3 + time * 0.05);
                    float edge = 1.0 - smoothstep(0.0, 0.03, abs(n));
                    
                    vec3 color = boundaryColor * edge * 3.0;
                    float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
                    color += boundaryColor * fresnel * 0.8;
                    float alpha = edge * 0.8 + fresnel * 0.3;
                    
                    gl_FragColor = vec4(color, alpha);
                }
            \`,
            transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
        });
        const earthGlobeMesh = new THREE.Mesh(earthGlobeGeo, earthGlobeMat);
        mainGroup.add(earthGlobeMesh);

        // 5. VOLCANO / SHELL PARTICLES
        const volcanoPoints = [];
        for (let i = 0; i < 150; i++) volcanoPoints.push(getPointOnSphere(OUTER_RADIUS));
        const volcanoGeo = new THREE.BufferGeometry().setFromPoints(volcanoPoints);
        const volcanoMat = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: themes[0].volcano.clone() },
                size: { value: 7.0 * window.devicePixelRatio },
                time: uniforms.time
            },
            vertexShader: \`
                uniform float size;
                void main() {
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (20.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            \`,
            fragmentShader: \`
                uniform vec3 color;
                uniform float time;
                void main() {
                    vec2 pt = gl_PointCoord - vec2(0.5);
                    if(abs(pt.x) > 0.35 || abs(pt.y) > 0.35) discard;
                    float throb = sin(time * 3.0 + gl_FragCoord.x) * 0.5 + 0.5;
                    gl_FragColor = vec4(color * (1.5 + throb), 0.9);
                }
            \`,
            transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
        });
        const volcanoMesh = new THREE.Points(volcanoGeo, volcanoMat);
        mainGroup.add(volcanoMesh);

        // --- TOUCH & INTERACTION ENGINE ---
        document.addEventListener('pointerdown', (e) => {
            isDragging = true;
            previousX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
            previousY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
            
            // Cycle Themes on Tap
            activeTheme = (activeTheme + 1) % themes.length;
        });
        document.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            let clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
            let clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
            let deltaX = clientX - previousX;
            let deltaY = clientY - previousY;
            targetRotationY += deltaX * 0.005;
            targetRotationX += deltaY * 0.005;
            previousX = clientX;
            previousY = clientY;
        });
        document.addEventListener('pointerup', () => isDragging = false);

        // BATTERY OPTIMIZATION
        window.addEventListener("pauseWallpaper", () => isPlaying = false);
        window.addEventListener("playWallpaper", () => {
            if(!isPlaying){ isPlaying = true; clock.getDelta(); animate(); }
        });

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        const clock = new THREE.Clock();
        const LERP_SPEED = 0.05;

        function animate() {
            if(!isPlaying) { requestAnimationFrame(animate); return; }

            const delta = clock.getDelta();
            const elapsedTime = clock.getElapsedTime();

            uniforms.time.value = elapsedTime;

            // Transition Theme Colors
            const tgt = themes[activeTheme];
            uniforms.cDark.value.lerp(tgt.core[0], LERP_SPEED);
            uniforms.cRed.value.lerp(tgt.core[1], LERP_SPEED);
            uniforms.cOrange.value.lerp(tgt.core[2], LERP_SPEED);
            uniforms.cYellow.value.lerp(tgt.core[3], LERP_SPEED);
            uniforms.cSurface.value.lerp(tgt.vein.surface, LERP_SPEED);
            uniforms.cCoreA.value.lerp(tgt.vein.coreA, LERP_SPEED);
            uniforms.cCoreB.value.lerp(tgt.vein.coreB, LERP_SPEED);
            uniforms.boundaryColor.value.lerp(tgt.boundary, LERP_SPEED);
            volcanoMat.uniforms.color.value.lerp(tgt.volcano, LERP_SPEED);
            dustMat.color.lerp(tgt.dust, LERP_SPEED);
            scene.fog.color.lerp(tgt.bg, LERP_SPEED);
            renderer.setClearColor(scene.fog.color); 

            // Handle Camera/Rotation Physics
            dustMesh.rotation.y += 0.02 * delta;
            
            // Auto spin + Drag spin
            targetRotationY += 0.1 * delta;
            currentRotationX += (targetRotationX - currentRotationX) * 0.1;
            currentRotationY += (targetRotationY - currentRotationY) * 0.1;
            
            // Limit vertical rotation so user can't flip it upside down
            currentRotationX = Math.max(-Math.PI/2.5, Math.min(Math.PI/2.5, currentRotationX));
            targetRotationX = Math.max(-Math.PI/2.5, Math.min(Math.PI/2.5, targetRotationX));

            mainGroup.rotation.x = currentRotationX;
            mainGroup.rotation.y = currentRotationY;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }

        renderer.setClearColor(scene.fog.color);
        animate();
    }

    // Bypass Android WebView sizing bug
    setTimeout(init, 100);
  <\/script>
</body>
</html>`;

export const MOCK_WALLPAPERS: Wallpaper[] = [

  {
    _id: 'html_fish',
    url: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=1080', // Replace with a nice cartoon sky image
    thumbnail: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=400',
    author: 'Toss Studio',
    type: 'interactive',
    category: { id: 'live', name: { en: 'Interactive' } },
    indexCode: FISH_3D_CODE
  },
  {
    _id: 'html_aviator',
    url: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=1080', // Replace with a nice cartoon sky image
    thumbnail: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=400',
    author: 'Toss Studio',
    type: 'interactive',
    category: { id: 'live', name: { en: 'Interactive' } },
    indexCode: AVIATOR_3D_CODE
  },
  {
    _id: 'html_runner',
    url: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=1080', // Replace with a nice cartoon sky image
    thumbnail: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=400',
    author: 'Toss Studio',
    type: 'interactive',
    category: { id: 'live', name: { en: 'Interactive' } },
    indexCode: RUNNER_3D_CODE
  },
  {
    _id: 'html_chillLion',
    url: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=1080', // Replace with a nice cartoon sky image
    thumbnail: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=400',
    author: 'Toss Studio',
    type: 'interactive',
    category: { id: 'live', name: { en: 'Interactive' } },
    indexCode: LION_3D_CODE
  },
  {
    _id: 'html_birds',
    url: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=1080', // Replace with a nice cartoon sky image
    thumbnail: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=400',
    author: 'Toss Studio',
    type: 'interactive',
    category: { id: 'live', name: { en: 'Interactive' } },
    indexCode: BIRDS_3D_CODE
  },
  {
    _id: 'html_saturn',
    url: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=1080', // Replace with a nice cartoon sky image
    thumbnail: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=400',
    author: 'Toss Studio',
    type: 'interactive',
    category: { id: 'live', name: { en: 'Interactive' } },
    indexCode: SATURN_3D_CODE
  },
  {
    _id: 'html_rocket_moon',
    url: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=1080', // Replace with a nice cartoon sky image
    thumbnail: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=400',
    author: 'Toss Studio',
    type: 'interactive',
    category: { id: 'live', name: { en: 'Interactive' } },
    indexCode: ROCKET_SVG_CODE
  },
  {
    _id: 'html_dragon',
    url: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=1080', // Replace with a nice cartoon sky image
    thumbnail: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=400',
    author: 'Toss Studio',
    type: 'interactive',
    category: { id: 'live', name: { en: 'Interactive' } },
    indexCode: DRAGON_3D_CODE
  },
  {
    _id: 'html_prism',
    url: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=1080', // Replace with a nice cartoon sky image
    thumbnail: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=400',
    author: 'Toss Studio',
    type: 'interactive',
    category: { id: 'live', name: { en: 'Interactive' } },
    indexCode: PRISM_SHADER_CODE
  },
  {
    _id: 'html_cyber_core',
    url: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=1080', // Replace with a nice cartoon sky image
    thumbnail: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=400',
    author: 'Toss Studio',
    type: 'interactive',
    category: { id: 'live', name: { en: 'Interactive' } },
    indexCode: CYBER_CORE_3D_CODE
  },
  {
    _id: 'html_ghibli_landscape',
    url: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=1080', // Replace with a nice cartoon sky image
    thumbnail: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=400',
    author: 'Toss Studio',
    type: 'interactive',
    category: { id: 'chill_nature_live', name: { en: 'chill nature live' } },
    indexCode: GHIBLI_LANDSCAPE_CODE
  },
  {
    _id: 'abstract_1',
    url: 'https://picsum.photos/seed/abs1/1080/2400',
    thumbnail: 'https://picsum.photos/seed/abs1/400/800',
    author: 'Abstract Artist',
    type: 'image',
    category: { id: 'abstract', name: { en: 'Abstract' } },
    indexCode: null
  },
  {
    _id: 'abstract_2',
    url: 'https://picsum.photos/seed/abs2/1080/2400',
    thumbnail: 'https://picsum.photos/seed/abs2/400/800',
    author: 'Digital Guru',
    type: 'image',
    category: { id: 'abstract', name: { en: 'Abstract' } },
    indexCode: null
  },
  {
    _id: 'nature_1',
    url: 'https://picsum.photos/seed/nat1/1080/2400',
    thumbnail: 'https://picsum.photos/seed/nat1/400/800',
    author: 'Nature Lover',
    type: 'image',
    category: { id: 'nature', name: { en: 'Nature' } },
    indexCode: null
  },
  {
    _id: 'nature_2',
    url: 'https://picsum.photos/seed/nat2/1080/2400',
    thumbnail: 'https://picsum.photos/seed/nat2/400/800',
    author: 'Eco Warrior',
    type: 'image',
    category: { id: 'nature', name: { en: 'Nature' } },
    indexCode: null
  },
  {
    _id: 'urban_1',
    url: 'https://picsum.photos/seed/urb1/1080/2400',
    thumbnail: 'https://picsum.photos/seed/urb1/400/800',
    author: 'City Slicker',
    type: 'image',
    category: { id: 'urban', name: { en: 'Urban' } },
    indexCode: null
  },
  {
    _id: 'urban_2',
    url: 'https://picsum.photos/seed/urb2/1080/2400',
    thumbnail: 'https://picsum.photos/seed/urb2/400/800',
    author: 'Modernist',
    type: 'image',
    category: { id: 'urban', name: { en: 'Urban' } },
    indexCode: null
  },
];

export const CATEGORIES = MOCK_CATEGORIES;
export const MOCK_IMAGES = MOCK_WALLPAPERS.map(w => ({ id: w._id, url: w.url, author: w.author }));
