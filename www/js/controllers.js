angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $window, $state, $timeout, $ionicHistory) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  /*  UNUSED LOGIN MODAL
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
  */
  $scope.goToMap = function() {
    $ionicHistory.nextViewOptions({
      disableBack: true
    })
    $state.go('app.map')
  }
  $scope.goToAccount = function() {
    $ionicHistory.nextViewOptions({
      disableBack: true
    })
    $state.go('app.account')
  }
})

.controller('RegistrationCtrl', function($scope, $state, $http, $window, $ionicHistory) {

  var user = $window.localStorage['user']
  if (user) {
    $state.go('app.map')
  }

  $scope.data = {}

  $scope.demofunc = function() {
     $http({
        method: 'GET',
        url: 'https://sliblra7eac59ae.hana.ondemand.com/parkmyride/region_master.xsodata/Regionlocation',
        headers: {
          'accept': 'application/json'
        }
      }).then(function (response) {
        console.log("yay!")
        console.log(response)
      })
  }

  $scope.register = function() {
    // validate input
    if ($scope.data.name == undefined) {
      alert('Please enter valid name.')
      return false
    }
    if ($scope.data.inumber == undefined) {
      alert('Please enter valid I-Number.')
      return false
    }
    var letters = /^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$/
    if($scope.data.carnumber == undefined || !($scope.data.carnumber.match(letters))) {
      alert('Please input a valid car number.')
      return false  
    }
    
    $window.localStorage['user'] = JSON.stringify({
      name: $scope.data.name,
      inumber: $scope.data.inumber,
      carnumber: $scope.data.carnumber
    })
    $state.go('app.map')
    location.reload()
    
    // $http.post('https://sliblra7eac59ae.hana.ondemand.com/parkmyride/user_data.xsodata/user',
    //   {
    //     'CARNUMBER': 'KA 53 MA 6240',
    //     'INUMBER': 'I123456',
    //     'NAME': 'SID'
    //   },
    //   {
    //     'accept': 'application/json',
    //     'Content-Type': 'application/json',
    //     'Cache-Control': 'no-cache'
    //   }).then(function (response) {
    //   console.log("yay!")
    //   $window.localStorage['user'] = JSON.stringify({
    //     name: $scope.data.name,
    //     inumber: $scope.data.inumber,
    //     carnumber: $scope.data.carnumber
    //   })
    //   $state.go('app.map')
    //   location.reload()
    // })
  }
})

.controller('AccountCtrl', function($scope, $state, $window) {
  var user = $window.localStorage['user']
  if (!(user)) {
    $state.go('register')
  }

  $scope.datum = JSON.parse(user)
  
  $scope.logout = function() {
    $window.localStorage['user'] = ''
    console.log("now user is")
    console.log($window.localStorage['user'])
    $state.go('register')
  }
})

.controller('MapCtrl', function($scope, $state, $http, $window, $interval, $ionicPopover) {

  var user = $window.localStorage['user']
  if (!(user)) {
    $state.go('register')
  }
  var currentZoom = 17

  var windowRatio = window.innerWidth/window.innerHeight
  console.log("ratio is "+window.innerWidth/window.innerHeight)

  var redCar = {
    path: 'M43.5895729,3.67674944 C42.7160052,2.02958899 37.9822388,1.66997028 35.814335,1.64667514 C34.7650831,1.63114505 33.5396617,1.73839975 32.0914806,1.7306347 C31.8036885,1.73014939 31.5100727,1.72966407 31.2106331,1.72917876 C31.1776317,1.66366118 31.104349,1.54087638 31.0155363,1.39188456 C30.8854718,1.17494857 30.7238618,0.905598529 30.6166071,0.694001016 C30.4108333,0.307204646 30.150219,0.198008682 29.8221458,0.15287435 C29.8197192,0.15287435 29.8172926,0.153359665 29.8153514,0.153844981 C29.8095276,0.149962457 29.8041891,0.146079934 29.7969094,0.145109303 C29.7212002,0.137829572 29.6721833,0.15287435 29.6435497,0.18975832 C29.6037538,0.241201752 29.6154014,0.316910954 29.6343287,0.392620155 C29.6484029,0.439695749 29.6949931,0.586746314 29.751775,0.761459856 C29.8464115,1.05895819 29.9774467,1.46662313 30.0017125,1.56271557 C30.0167572,1.62532126 30.033258,1.67967659 30.0560678,1.72723749 C21.4790888,1.72141371 9.3117465,1.8092558 7.47871025,1.93737906 C4.72066286,2.13587306 2.51441907,2.81046146 1.92524618,3.33169019 C1.32782292,3.85971334 0.408635563,6.22514058 0.408635563,10.2906277 C0.409120879,14.3561147 1.32830824,16.7210567 1.92524618,17.2427707 C2.51441907,17.7712792 4.72066286,18.4381025 7.47871025,18.6365965 C9.31223182,18.7710289 21.4800594,18.8535325 30.0565531,18.8477087 C30.0347139,18.8918724 30.0172426,18.9447718 30.0017125,19.01126 C29.9769614,19.1156028 29.8420437,19.53443 29.7430394,19.840664 C29.6906253,20.0032447 29.6474322,20.1367064 29.6338434,20.1828114 C29.6154014,20.2609472 29.6042392,20.3400536 29.6435497,20.390041 C29.6663595,20.41916 29.7027582,20.4332341 29.7512897,20.4332341 C29.7658492,20.4332341 29.7818646,20.4322635 29.7939975,20.4293516 L29.8172926,20.4293516 L29.8226311,20.4293516 C30.1511896,20.3842173 30.4122893,20.2740507 30.6170924,19.8804599 C30.7209499,19.679054 30.8743095,19.4203809 30.9990356,19.2141218 C31.0970693,19.0515412 31.176661,18.9185648 31.2120891,18.8452821 C31.510558,18.8447968 31.8051445,18.8443115 32.0919659,18.8438262 C33.540147,18.8438262 34.7655684,18.9438012 35.8148203,18.9355508 C37.9832095,18.9122557 42.7169758,18.5443866 43.5900582,16.9054765 C44.0423722,16.0547186 44.9081748,12.9831575 44.9081748,10.2867451 C44.9076895,7.59906847 44.0418869,4.52750733 43.5895729,3.67674944 L43.5895729,3.67674944 Z M21.8649145,2.48918267 C25.1126452,2.42026788 28.2380763,2.38920769 30.3758906,2.38920769 L30.0614063,2.81046146 C26.8597806,3.29335028 23.9255637,3.66849908 21.0529819,3.72236909 C21.2980662,3.27879082 21.6043002,2.81094677 21.8649145,2.48918267 L21.8649145,2.48918267 Z M4.30717414,15.159797 C3.8393301,15.159797 3.68645575,15.0069227 3.60201087,14.6152731 C3.31858668,13.274832 3.18803684,11.8805209 3.18803684,10.2877158 C3.18803684,8.70219036 3.31810136,7.30787923 3.60201087,5.96743811 C3.68645575,5.57675921 3.8393301,5.42388487 4.30717414,5.42388487 L7.95334871,5.42388487 C8.44303194,5.42388487 8.62793711,5.63790895 8.59736224,6.03635289 C8.47457744,7.49181377 8.43575221,8.70267568 8.43575221,10.2882011 C8.43575221,11.8814915 8.47457744,13.0923534 8.59736224,14.547329 C8.62793711,14.9452876 8.44351726,15.1607677 7.95334871,15.1607677 C6.53574244,15.159797 5.24140628,15.159797 4.30717414,15.159797 L4.30717414,15.159797 Z M11.5844785,17.0903817 L11.0326749,17.3349806 C10.7337206,17.4815459 10.5808463,17.4965907 10.2668472,17.4655305 C9.93731805,17.4281612 9.63836376,17.3888506 9.3398948,17.3349806 C9.25544992,17.3126561 8.99483555,17.2592714 8.67307144,17.1821063 C8.30520237,17.0981467 8.28967228,17.044762 8.68860153,17.0214669 C9.5544042,16.983127 10.4964014,16.9443017 11.5534183,16.9224625 C11.7989879,16.9219772 11.814518,16.9826417 11.5844785,17.0903817 L11.5844785,17.0903817 Z M11.5539036,3.6534543 C10.4964014,3.63064448 9.5544042,3.60006961 8.68908685,3.55396464 C8.29064291,3.53843455 8.30568769,3.47728481 8.67355676,3.39332525 C8.99532086,3.31664542 9.25593523,3.26277541 9.34038011,3.24773063 C9.63884908,3.19386062 9.93731805,3.14727034 10.2673325,3.11718079 C10.5808463,3.07884087 10.7342059,3.10213601 11.0331602,3.23948027 L11.5849638,3.48504986 C11.814518,3.60006961 11.7989879,3.66170466 11.5539036,3.6534543 L11.5539036,3.6534543 Z M20.0886602,2.51975754 C19.9124907,2.87986156 19.759131,3.30888037 19.6368316,3.73061945 C16.8792695,3.72333972 14.6807907,3.71508936 12.834651,3.69227953 L12.51774,3.23559774 L12.2445074,2.81094677 C14.4973415,2.68088225 17.2927582,2.58915764 20.0886602,2.51975754 L20.0886602,2.51975754 Z M12.4041762,17.7644848 L12.6909976,17.3194505 L12.9938344,16.890917 C14.8399742,16.8608275 17.0389382,16.8525771 19.7969856,16.8525771 C19.9192851,17.2665512 20.0726448,17.703335 20.2488143,18.055674 C17.452427,17.9940389 14.656525,17.894064 12.4041762,17.7644848 L12.4041762,17.7644848 Z M21.8649145,18.0930433 C21.6043002,17.7717645 21.2980662,17.3048911 21.0529819,16.8603422 C23.9255637,16.9137269 26.8597806,17.2815959 30.0614063,17.7639994 L30.3758906,18.1930182 C28.2385616,18.1852532 25.1126452,18.1624434 21.8649145,18.0930433 L21.8649145,18.0930433 Z M35.435789,16.7991924 C35.2042935,17.3034351 35.109657,17.4626186 34.6529752,17.4626186 C34.5030128,17.4626186 34.3151957,17.4451472 34.0788471,17.4189402 C33.1683954,17.3165386 32.0638176,17.153958 30.7840409,16.9661409 C29.9648285,16.8457827 29.1179531,16.721542 28.2254581,16.5987572 C27.6125048,16.5133417 27.3931422,16.2566098 27.4421591,15.684423 C27.6508447,13.8183853 27.7561581,12.0028204 27.7561581,10.2867451 C27.7561581,8.56678737 27.6503594,6.75364905 27.4426444,4.89828829 C27.3931422,4.31639513 27.6134754,4.0601486 28.2264287,3.98298345 C29.1053349,3.86165461 29.941048,3.73838449 30.7495835,3.61851159 C32.042949,3.42681201 33.1606304,3.26229009 34.0793324,3.16280044 C34.3282992,3.13513746 34.5122338,3.11815142 34.6607403,3.11815142 C35.1125689,3.11815142 35.2067201,3.27782018 35.435789,3.7825482 C36.272958,5.63742364 36.7573028,7.29623166 36.7573028,10.2867451 C36.7568175,13.2859943 36.2724727,14.944317 35.435789,16.7991924 L35.435789,16.7991924 Z M43.3580775,14.6696285 C43.0445637,15.6446271 42.7329912,16.3129064 42.378711,16.7705588 C42.0181217,17.2456826 41.7046079,17.3849681 41.2532646,17.4742661 C40.6893281,17.5839474 39.4517739,17.6130663 38.8097016,17.6130663 C38.7029322,17.6130663 38.6665335,17.5698733 38.6558566,17.5344453 C38.6291643,17.4490297 38.7208889,17.3364366 38.7956274,17.2830519 C39.0237257,17.1107649 39.5726174,16.5963306 39.9006906,16.2896113 C40.0195929,16.178474 40.1084056,16.0964557 40.1404364,16.0673368 C40.1676141,16.0421004 40.1909092,16.0129815 40.2156603,15.981436 C40.2908842,15.8892261 40.3758144,15.7839126 40.6136189,15.7072328 C41.8210836,15.3485847 42.738815,14.9414051 43.2047178,14.5575206 C43.2930452,14.4871499 43.3430327,14.4837527 43.3702104,14.5225779 C43.389623,14.5507262 43.3857405,14.5944046 43.3580775,14.6696285 L43.3580775,14.6696285 Z M43.3702104,6.05964803 C43.3595334,6.07469281 43.3425474,6.08342849 43.3236201,6.08342849 C43.2935305,6.08342849 43.2571319,6.06304524 43.2042325,6.01742559 C42.7393003,5.63499706 41.8225396,5.22781745 40.6228399,4.87111063 C40.376785,4.79685737 40.2913695,4.68960267 40.2161456,4.59496617 C40.1913945,4.56390598 40.1676141,4.53381643 40.1389805,4.50712408 C40.1088909,4.47994642 40.0273579,4.40423722 39.9181619,4.30135035 C39.6065895,4.01064643 39.0271229,3.46951977 38.7951421,3.29965938 C38.7208889,3.24627468 38.627223,3.13076962 38.6558566,3.04292753 C38.6675042,3.00604356 38.7039028,2.96187986 38.8097016,2.96187986 C39.6774455,2.96187986 40.7698905,3.00701419 41.2532646,3.10844511 C41.7046079,3.19822846 42.0166657,3.33557272 42.378711,3.80390207 C42.738815,4.27708458 43.0494169,4.94779046 43.3580775,5.91502405 C43.3852551,5.98830667 43.389623,6.03198506 43.3702104,6.05964803 L43.3702104,6.05964803 Z',
    fillColor: 'red',
    fillOpacity: 0.8,
    text: 'Parking Spot',
    scale: 1.1,
    rotation: 0
  }

  var greenCar = {
    path: 'm-12,1.95001l51,-1.95001l0,17l-51,0l0,-15.04999z',
    fillColor: 'green',
    fillOpacity: 0.8,
    text: 'Parking Spot',
    scale: 1.1,
    rotation: 0
  }

  var mapOptions = {
    zoom: 17,
    center: new google.maps.LatLng(12.979217, 77.715649),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    //disableDefaultUI: true
  }

  var masterRegionData = []
  var masterSensorData = []
  var realtimeRegionData = []
  var realtimeSensorData = []

  // draw ellipse around a marker
  function drawEllipse(map, lat, lng, firstradius, secondradius, color) {
    lat = Number(lat)
    lng = Number(lng)
    var center = new google.maps.LatLng(lat, lng)
    var center1 = new google.maps.LatLng(lat+0.1, lng)
    var center2 = new google.maps.LatLng(lat, lng+0.1)
    var latConv = google.maps.geometry.spherical.computeDistanceBetween(center,center1)*10
    var lngConv = google.maps.geometry.spherical.computeDistanceBetween(center,center2)*10
    var points = []
    var Angle
    for (var Angle = 0 ; Angle < 360 ; Angle++){
      var x = lat + ((firstradius*Math.cos(Angle*(Math.PI/180)))/latConv)
      var y = lng + ((secondradius*Math.sin(Angle*(Math.PI/180)))/lngConv)
      var point = new google.maps.LatLng(x,y)
      points.push(point)
    }
    var diamond = new google.maps.Polygon({
      paths: points,
      strokeColor: color,
      strokeOpacity: 0.9,
      strokeWeight: 1,
      fillColor: color,
      fillOpacity: 0.3,
      map: $scope.map
    })
    return diamond
  }

  $scope.hideLegend = function() {
    $scope.legendPopup.style.visibility = 'hidden'
  }

  $scope.showLegend = function() {
    $scope.legendPopup.style.visibility = 'visible'
  }
  
  $scope.legendPopup = document.getElementById('legendPopup')
  $scope.hideLegend()

  // zoom function when a region marker is clicked
  function smoothZoom (map, max, cnt) {
    if (cnt >= max) {
      return
    }
    else {
      z = google.maps.event.addListener($scope.map, 'zoom_changed', function(event) {
        google.maps.event.removeListener(z)
        smoothZoom($scope.map, max, cnt + 1)
      })
      setTimeout(function(){$scope.map.setZoom(cnt)}, 80)
    }
  }

  $scope.cancelZoomin = function() {
    // enable zooming / panning
    $scope.map.setOptions({draggable: true, zoomControl: true, scrollwheel: true, disableDoubleClickZoom: false})
    $scope.map.setZoom(17)
  }

  // initialize base google Map
  $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions)

  // set polygon around whole of SAP labs area
  var SAPLabs = [
    new google.maps.LatLng(12.981414, 77.715037),
    new google.maps.LatLng(12.981690, 77.716042),
    new google.maps.LatLng(12.981002, 77.716407),
    new google.maps.LatLng(12.980669, 77.717413),
    new google.maps.LatLng(12.980308, 77.717293),
    new google.maps.LatLng(12.980456, 77.716297),
    new google.maps.LatLng(12.977592, 77.716255),
    new google.maps.LatLng(12.977904, 77.714157),
    new google.maps.LatLng(12.981414, 77.715037)
  ]

  var SAPLabsArea = new google.maps.Polygon({
    paths: SAPLabs,
    strokeColor: '#663399',
    strokeOpacity: 0.4,
    strokeWeight: 1,
    fillColor: '#663399', // #D0D0D0 663399
    fillOpacity: 0.1
  })

  SAPLabsArea.setMap($scope.map)

  // initialize master Region Data  
  $http({
    method: 'GET',
    url: 'https://sliblra7eac59ae.hana.ondemand.com/parkmyride/region_master.xsodata/Regionlocation',
    headers: {
      'accept': 'application/json'
    }
  }).then(function (response) {
    var regionData = response.data.d.results
    
    regionData.forEach(function (region) {

      // store this newly created ellipse as a property in the region object
      // so that it can be accessed later
      region.ellipse1 = drawEllipse(
        $scope.map,
        region.LATITUDE, // latitude of center of ellipse
        region.LONGITUDE, // longitude of center of ellipse
        12, // radius 1 of ellipse
        17, // radius 2 of ellipse
        '#99C000' // color of ellipse
      )
      region.ellipse2 = drawEllipse(
        $scope.map,
        region.LATITUDE, // latitude of center of ellipse
        region.LONGITUDE, // longitude of center of ellipse
        18, // radius 1 of ellipse
        25, // radius 2 of ellipse
        '#99CC00' // color of ellipse
      )
      // initialize no of free slots as 0 initially
      region.freeslots = 0

      masterRegionData.push(region)
    })

    masterRegionData.forEach(function (region) {
      var center = new google.maps.LatLng(region.LATITUDE, region.LONGITUDE)

      var marker = new google.maps.Marker({  
        position: center,   
        animation: google.maps.Animation.DROP,
        map: $scope.map,
        icon: 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld='+region.freeslots+'|00CCFF|000000',
      })

      // store this newly created marker as a property in the region object
      // so that it can be accessed later
      region.marker = marker

      google.maps.event.addListener(marker, 'click', function(event) {
        $scope.map.panTo(marker.position)
        smoothZoom($scope.map, 21, $scope.map.getZoom())
      })
    })
  })
  

  // initialize master Sensor Data
  // masterSensorData = [
  //   {
  //     "sensorid": "6000",
  //     "lat": 12.979298,
  //     "long": 77.714530,
  //     "regionid": "1"
  //   },
  //   {
  //     "sensorid": "7000",
  //     "lat": 12.979266,
  //     "long": 77.714522,
  //     "regionid": "1"
  //   },
  //   {
  //     "sensorid": "8000",
  //     "lat": 12.979237,
  //     "long": 77.714516,
  //     "regionid": "1"
  //   },
  //   {
  //     "sensorid": "9000",
  //     "lat": 12.979205,
  //     "long": 77.714509,
  //     "regionid": "1"
  //   }
  // ]
  // masterSensorData.forEach(function (sensor) {
  //   // create a parking spot for each sensor
  //   // initially show all spots as filled'
  //   var marker1 = new google.maps.Marker({
  //     position: new google.maps.LatLng(sensor.lat, sensor.long),
  //     icon: redCar,
  //     clickable: true,
  //     textInfo: redCar.text,
  //     map: $scope.map
  //   })
    
  //   // store this newly created parking spot as a property in the sensor object
  //   // so that it can be accessed later
  //   sensor.marker = marker1

  //   google.maps.event.addListener(marker1, 'click', function(ev){
  //     var infoWindow= new google.maps.InfoWindow({
  //       content: this.textInfo
  //     })
  //     infoWindow.setPosition(this.position)
  //     infoWindow.open($scope.map)
  //   })
  //   sensor.marker.setMap(null)
  // })

  $http({
    method: 'GET',
    url: 'https://sliblra7eac59ae.hana.ondemand.com/parkmyride/sensor_master.xsodata/location',
    headers: {
      'accept': 'application/json'
    }
    // beforeSend: function (request) {
    //   request.setRequestHeader("Authorization", "Basic cDE5NDE0MTEyMjg6SU9UQGltczI=")
    // },
  }).then(function (response) {
    masterSensorData = response.data.d.results

    // set orientation of each sensor according to its nearest sensor
    for(var i = 0 ; i < masterSensorData.length ; i++) {
      var closestLat = -1, closestLong = -1, minDist = Number.MAX_VALUE
      
      // find nearest sensor
      for(var j = 0 ; j < masterSensorData.length ; j++) {
        if (i == j) continue
        var dist = Math.sqrt ((masterSensorData[i].LATITUDE - masterSensorData[j].LATITUDE)*(masterSensorData[i].LATITUDE - masterSensorData[j].LATITUDE) + 
                              (masterSensorData[i].LONGITUDE - masterSensorData[j].LONGITUDE)*(masterSensorData[i].LONGITUDE - masterSensorData[j].LONGITUDE))
        if (dist < minDist) {
          minDist = dist, closestLat = masterSensorData[j].LATITUDE, closestLong = masterSensorData[j].LONGITUDE
        }
      }

      if (minDist == Number.MAX_VALUE) {
        // if not found (only 1 sensor)
        masterSensorData[i].orientation = 0
      } else { 
      // get angle and set orientation 
        var angleInDegrees = Math.atan2(closestLong - masterSensorData[i].LONGITUDE, closestLat - masterSensorData[i].LATITUDE) * 180 / Math.PI
        if (angleInDegrees < 0) {
          // no negative angles
          angleInDegrees += 180
        }
        masterSensorData[i].orientation = angleInDegrees
      }
    }

    masterSensorData.forEach(function (sensor) {
      // create a parking spot for each sensor
      // initially show all spots as filled'
      var marker1 = new google.maps.Marker({
        position: new google.maps.LatLng(sensor.LATITUDE, sensor.LONGITUDE),
        icon: redCar,
        clickable: true,
        textInfo: redCar.text,
        map: $scope.map
      })
      
      // store this newly created parking spot as a property in the sensor object
      // so that it can be accessed later
      sensor.marker = marker1

      // google.maps.event.addListener(marker1, 'click', function(ev){
      //   var infoWindow = new google.maps.InfoWindow({
      //     content: this.textInfo
      //   })
      //   infoWindow.setPosition(this.position)
      //   infoWindow.open($scope.map)
      // })
      sensor.marker.setMap(null)
    })
  })

  // called when zoom level changes
  google.maps.event.addListener($scope.map, 'zoom_changed', function($event) {
    var newZoomLevel = $scope.map.getZoom()

    if(newZoomLevel >= 19 && currentZoom < 19) {
      currentZoom = newZoomLevel

      // remove the region markers and ellipses
      masterRegionData.forEach(function (region) {
        region.marker.setMap(null)
        region.ellipse1.setMap(null)
        region.ellipse2.setMap(null)
      })

      // add the sensor markers
      masterSensorData.forEach(function (sensor) {
        sensor.marker.setMap($scope.map)
      })

      // show the legend
      $scope.showLegend()

      // disable zooming / panning
      $scope.map.setOptions({draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true})
    }
    else if(newZoomLevel < 19 && currentZoom >= 19)
    {
      currentZoom = newZoomLevel

      // add back the region markers and ellipses
      masterRegionData.forEach(function (region) {
        region.marker.setMap($scope.map)
        region.ellipse1.setMap($scope.map)
        region.ellipse2.setMap($scope.map)
      })

      // remove the sensor markers
      masterSensorData.forEach(function (sensor) {
        if (typeof (sensor.marker.setMap) != 'undefined') {
          sensor.marker.setMap(null)
        }
      })

      // remove the legend
      $scope.hideLegend()
    }
  })

  // keep polling for sensor status and region free slots status
  // every 5 seconds
  var timer = $interval(function() {
    $http({
      method: 'GET',
      url: 'https://sliblra7eac59ae.hana.ondemand.com/parkmyride/sensordata.xsjs',
      dataType: 'application/json'
      // beforeSend: function (request) {
      //   request.setRequestHeader("Authorization", "Basic cDE5NDE0MTEyMjg6SU9UQGltczI=")
      // },
    }).then(function (response) {
      // for each corresponding sensor
      redCar.rotation = masterSensorData[0].orientation
      masterSensorData.forEach(function (sensor1) {
        response.data.value.forEach(function (sensor2) {
          if (sensor1.SENSOR_ID == sensor2.sensorid) {
            // change icon based on sensor status
            if (sensor2.status == 0) {
              greenCar.rotation = sensor1.orientation
              sensor1.marker.setIcon(greenCar)
            } else if (sensor2.status == 1) {
              redCar.rotation = sensor1.orientation
              sensor1.marker.setIcon(redCar)
            }
          }
        })
      })
    })

    $http({
      method: 'GET',
      url: 'https://sliblra7eac59ae.hana.ondemand.com/parkmyride/regiondata.xsjs',
      dataType: 'application/json'
      // beforeSend: function (request) {
      //   request.setRequestHeader("Authorization", "Basic cDE5NDE0MTEyMjg6SU9UQGltczI=")
      // },
    }).then(function (response) {
      // for each corresponding region
      masterRegionData.forEach(function (region1) {
        response.data.value.forEach(function (region2) {
          // update no of free slots
          if (region1.REGION_ID == region2.regionid) {
            region1.freeslots = region2.freeslots
            region1.marker.setIcon('https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld='+region1.freeslots+'|00CCFF|000000')
          }
        })
      })
    })
  },5000)
})
