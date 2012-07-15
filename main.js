(function() {
  "use strict";

  var WEB_GL_ENABLED = false;
  var stats, scene, renderer, composer;
  var camera, cameraControls;

  if(!init())	animate();

  // init the scene
  function init(){
    if(WEB_GL_ENABLED && Detector.webgl){
      renderer = new THREE.WebGLRenderer({
        antialias		: true,	// to get smoother output
        preserveDrawingBuffer	: true	// to allow screenshot
      });
      renderer.setClearColorHex(0xBBBBBB, 1);
    }
    else{
      renderer	= new THREE.CanvasRenderer();
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    // Set up stats
    stats = new Stats();
    stats.domElement.style.position	= 'absolute';
    stats.domElement.style.bottom	= '0px';
    document.body.appendChild(stats.domElement);

    // create a scene
    scene = new THREE.Scene();

    // put a camera in the scene
    var cameraH	= 3;
    var cameraW	= cameraH / window.innerHeight * window.innerWidth;
    //camera	= new THREE.OrthographicCamera(-cameraW/2, +cameraW/2, cameraH/2, -cameraH/2, 1, 10000);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 100;
    camera.position.x = -100;
    scene.add(camera);

    cameraControls	= new THREE.TrackballControls(camera)
      cameraControls.staticMoving = true;

    // Camera and movement object
    //cameraControls = new THREE.ButtControls(camera);
    /*
    cameraControls = new THREE.FirstPersonControls(camera);
cameraControls.movementSpeed = 1;
cameraControls.lookSpeed = 0.0005;
cameraControls.noFly = true;
cameraControls.lookVertical = false;
*/

    // Other setup
    /*
    THREEx.WindowResize.bind(renderer, camera);
    THREEx.Screenshot.bindKey(renderer);
    if(THREEx.FullScreen.available()){
      THREEx.FullScreen.bindKey();
      document.getElementById('inlineDoc').innerHTML	+= "- <i>f</i> for fullscreen";
    }
    */

    // Rendering stuff
    var PI2 = Math.PI * 2;

    (function() {
      var material = new THREE.ParticleCanvasMaterial({
        color: 0x000000,
        program: function (context) {
          context.beginPath();
          context.arc(0, 0, 1, 0, PI2, true);
          context.closePath();
          context.fill();
        }
      });

      var geometry = new THREE.Geometry();

      for (var i = 0; i < 100; i++) {

        particle = new THREE.Particle(material);
        particle.position.x = Math.random() * 2 - 1;
        particle.position.y = Math.random() * 2 - 1;
        particle.position.z = Math.random() * 2 - 1;
        particle.position.normalize();
        particle.position.multiplyScalar(Math.random() * 450);
        particle.scale.x = particle.scale.y = 1;
        scene.add(particle);

        geometry.vertices.push(particle.position);
      }
    });

    // "sun" - 0,0 marker
    (function() {
      var geometry= new THREE.SphereGeometry(1);
      var material= new THREE.MeshNormalMaterial();
      var mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // sun plane
      var plane = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), new THREE.MeshBasicMaterial({
        color: 0x0000ff
      }));
      plane.position.set(0,0,0);
      scene.add(plane);
    })();

    // Ellipses

    function addGeometry( points, color, x, y, z, rx, ry, rz, s ) {
      var line = new THREE.Line( points, new THREE.LineBasicMaterial( { color: color, linewidth: 2 } ) );
      line.position.set( x, y, z);
      line.rotation.set( rx, ry, rz );
      line.scale.set( s, s, s );
      scene.add( line );
    }

    // ellipse!
    (function() {
      //var shape = new THREE.Shape();
      //drawEllipse(shape, 0, 0, 100, 200);

      var ecurve = new THREE.EllipseCurve(0, 0, 50, 50, 0, 2 * Math.PI, true);

      var shape = new THREE.Shape();
      shape.fromPoints(ecurve.getPoints(100));

      var shapePoints = shape.createPointsGeometry();
      addGeometry(shapePoints, 0xffee00, 0,0,0, 0,0,0, 1);
    })();
  }

  // animation loop
  function animate() {
    // loop on request animation loop
    // - it has to be at the begining of the function
    // - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    requestAnimationFrame(animate);

    // do the render
    render();

    // update stats
    stats.update();
  }

  // render the scene
  function render() {
    // update camera controls
    cameraControls.update(1.5);
    // actually render the scene
    renderer.render(scene, camera);
  }
})();
