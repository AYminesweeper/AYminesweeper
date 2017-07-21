var mapOptions = {
            zoom: 17,
            center: centerposition, // 中心は現在地の緯度・経度
            scrollwheel: false,
            draggable: false,
            mapTypeControl: false,
            rotateControl: true,
            zoomControl: false,
            streetViewControl: false,
            disableDoubleClickZoom: true,
            styles: [
            {
                "featureType": "water",
                "stylers": [
                    { "visibility": "on" },
                    { "hue": "#00ffff" },
                    { "saturation": -41 },
                    { "lightness": -50 }
                ]
            }, {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [
                    { "color": "#c5b1a3" },
                    { "saturation": -26 },
                    { "lightness": 57 }
                ]
            }, {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [
                    { "color": "#788d92" },
                    { "saturation": -55 }
                ]
            }, {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [
                    { "color": "#808080" }
                ]
            }, {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    { "color": "#808080" }
                ]
            }, {
                "elementType": "labels",
                "stylers": [
                    { "visibility": "off" }
                ]
            }, {
                "featureType": "administrative.province",
                "elementType": "geometry.stroke"
            }]

};