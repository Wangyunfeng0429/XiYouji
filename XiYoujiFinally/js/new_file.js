require([
	"esri/Map",
	"esri/views/SceneView",
	"esri/views/MapView",
	"esri/core/watchUtils",
	"esri/layers/CSVLayer",
	"esri/Graphic",
	"esri/popup/content/support/ImageMediaInfoValue",
	"esri/popup/content/ImageMediaInfo",
	"esri/popup/content/MediaContent",
	"esri/PopupTemplate"
], function(Map, SceneView, MapView, watchUtils, CSVLayer, Graphic,ImageMediaInfoValue,ImageMediaInfo,MediaContent,PopupTemplate) {
	// Create a Map with a basemap, to be used with in the main view
	var url = "https://wangyunfeng0429.github.io/popularity/hospital3.csv";
	var imiv = new ImageMediaInfoValue({
		sourceURL: "{pictureURL}"
	});	
	var imi = new ImageMediaInfo({
		title: "<b>{stationPast}</b>",
		caption: "{event}",
		value: imiv
	});	
	var mc = new MediaContent({
		mediaInfos: imi,		
	});
	var pt = new PopupTemplate({
		title:"{characters}",
	});
	pt.content = [mc];
	
	const renderer1 = {
		type: "simple", // autocasts as new SimpleRenderer()
		symbol: {
			// symbol type required for rendering point geometries
			type: "point-3d", // autocasts as new PointSymbol3D()
			symbolLayers: [{
				// renders points as volumetric objects
				type: "object", // autocasts as new ObjectSymbol3DLayer()
				resource: {
					primitive: "cone"
				}, // renders points as cones
				width: 30000,
				 material: {
	                color: "red"
	                     }
			}]
		},
		};
		const objectSymbol = {
			type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
			style: "circle",
			color: "yellow",
			
			size: "10px", // pixels
			outline: { // autocasts as new SimpleLineSymbol()
				color: "red",
				width: 1 // points
			}
		};
		var objectSymbolRenderer = {
			type: "simple", // autocasts as new SimpleRenderer()
			symbol: objectSymbol
		};	
	
	 var csvLayer1 = new CSVLayer({
		url: url,
		copyright: "xiyouji",
		renderer: renderer1,
		popupTemplate: pt
	}); 
	 var csvLayer2 = new CSVLayer({
		url: url,
		copyright: "xiyouji",
		//renderer: objectSymbolRenderer,
		//popupTemplate: pt
	}); 
	 var csvLayer3 = new CSVLayer({
		url: url,
		copyright: "xiyouji",
		renderer: objectSymbolRenderer,
		popupTemplate: pt
	}); 
	
	var mainMap = new Map({
		basemap: "hybrid",
		ground: "world-elevation"
	});
	mainMap.add(csvLayer1);

	// Create another Map, to be used in the overview "view"
	var overviewMap = new Map({
		basemap: "topo"
	});
	overviewMap.add(csvLayer2);
	
	var map2 = new Map({
		basemap:"streets",
		});
	map2.add(csvLayer3);

	// Create the SceneView
	var mainView = new SceneView({
		container: "viewDiv",
		map: mainMap,
		center: [90, 36],
		scale: 30000000,
	});

	// Create the MapView for overview map
	var mapView = new MapView({
		container: "overviewDiv",
		map: overviewMap,
		constraints: {
			rotationEnabled: false
		}
	});
	// Remove the default widgets
	mapView.ui.components = [];
	
	var view2 = new MapView({
		container:"viewDiv2",
		map:map2,
		center: mainView.center,
		scale: mainView.scale *
			2 *
			Math.max(
				mainView.width / mapView.width,
				mainView.height / mapView.height
			)
	}); 

	var extentDiv = document.getElementById("extentDiv");

	mapView.when(function() {
		// Update the overview extent whenever the MapView or SceneView extent changes
		mainView.watch("extent", updateOverviewExtent);
		mapView.watch("extent", updateOverviewExtent);

		// Update the minimap overview when the main view becomes stationary
		watchUtils.when(mainView, "stationary", updateOverview);

		function updateOverview() {
			
			mapView.goTo({
				center: mainView.center,
				scale: mainView.scale *
					2 *
					Math.max(
						mainView.width / mapView.width,
						mainView.height / mapView.height
					)
			});
		}

		function updateOverviewExtent() {
			var extent = mainView.extent;
		} 
	});
	
	var polyline = {
		type: "polyline", // autocasts as new Polyline()
		paths: [
			[108.93, 34.27],
			[107.38745, 34.35454],
			[105.88965, 34.57024],
			[105.38965, 34.57024],
			[104.61093, 35.57934],
			[104.11093, 35.57934],
			[103.81093, 35.57934],
			[103.71878, 36.10396],
			[103.21878, 36.10396],
			[102.81878, 36.10396],
			[102.64198, 37.92818],
			[102.34198, 37.92818],
			[102.19409, 38.52014],
			[101.89409, 38.52014],
			[100.47801, 38.92967],
			[99.97801, 38.92967],
			[98.29011, 39.77201],
			[94.66197, 40.14219],
			[94.16197, 40.14219],
			[93.86197, 40.14219],
			[93.51465, 42.82699],
			[93.11465, 42.82699],
			[89.189537, 42.951221],
			[88.31104, 43.36378],
			[86.57425, 42.0591],
			[82.96212, 41.71741],
			[75.98976, 39.47042],
			[74.3456, 42.5216],
			[72.1721, 44.0908],
			[69.1032, 41.1803],
			[69.0813, 34.3205],
			[71.4053, 29.235],
			[74.2112, 31.3318],
			[77.1045, 28.3638],
			[77.5959, 27.1041],
			[82.5732, 25.1924],
			[83.9136, 26.0514],
			[84.5912, 24.4145],
			[85.2732, 25.0727]
		]
	};
	var lineSymbol1 = {
		type: "simple-line", // autocasts as SimpleLineSymbol()
		color: "#B87070",
		width: 3,
		cap: "square",
		join: "round"
	};
	var lineSymbol2 = {
		type: "simple-line", // autocasts as SimpleLineSymbol()
		color: "#FF8040",
		width: 3,
		cap: "square",
		join: "round"
	};
	
	var polylineGraphic1 = new Graphic({
		geometry: polyline,
		symbol: lineSymbol1
	});
	var polylineGraphic2 = new Graphic({
		geometry: polyline,
		symbol: lineSymbol2
	});
	var polylineGraphic3 = new Graphic({
		geometry: polyline,
		symbol: lineSymbol1
	});
	
	mapView.graphics.add(polylineGraphic1);
	mainView.graphics.add(polylineGraphic2);
	view2.graphics.add(polylineGraphic3);
	
	//加坐标显示
	var coordsWidget = document.createElement("div");
	coordsWidget.id = "coordsWidget";
	coordsWidget.className = "esri-widget esri-component";
	mainView.ui.add(coordsWidget);
	
	function showCoordinates(pt) {
	  var coords = "Lat/Lon " + pt.latitude.toFixed(3) + " " + pt.longitude.toFixed(3) +
	      " | Scale 1:" + Math.round(mainView.scale * 1) / 1 +
	      " | Zoom " + mainView.zoom;
	  coordsWidget.innerHTML = coords;
	}
	//*** 监测鼠标移动情况 ***//
	mainView.watch(["stationary"], function() {
	  showCoordinates(mainView.center);
	});
	
	mainView.on(["pointer-move"], function(evt) {
	  showCoordinates(mainView.toMap({ x: evt.x, y: evt.y }));
	});
	
	/***********地图联动***************/
	    var MapsMove = document.getElementById("MapsMove");
	    MapsMove.addEventListener("change", function () {
	       if(MapsMove.checked == true){
	           document.getElementById("viewDiv").style.width = "50%";
		  	    document.getElementById("viewDiv2").style.width = "50%";
	           
	           watchUtils.whenTrue(mainView, "stationary", function() {
		            if (mainView.extent) { 
				       view2.extent = mainView.extent;
					 } 
		        });
	     
	           watchUtils.whenTrue(view2, "stationary", function() {	            
		            if(MapsMove.checked == true){
					        if (view2.extent) { 
				          mainView.extent = view2.extent;
					  }
					}
		        });
	         	}
	           else{
	               document.getElementById("viewDiv").style.width = "100%";
		  	        document.getElementById("viewDiv2").style.width = "0%";
	         	}
	       });
   
});
