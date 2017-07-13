    function initMap(callback) {
        // 緯度・経度を変数に格納
        //var mapLatLng = new google.maps.LatLng(36.109651, 140.101704);
        var centerposition = new google.maps.LatLng(36.110732, 140.100619);

        // マップオプションを変数に格納
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
                "elementType": "labels.text.fill",
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

        // マップオブジェクト作成
        map = new google.maps.Map(
            document.getElementById("map"), // マップを表示する要素
            mapOptions // マップオプション
        );
        startWatchPosition();

        var length = cell * 2 + 2;
        var points1 = new Array(length);
        var points1_lat = new Array(points1.length);
        points1_lat[0] = high;
        var points1_lng = new Array(points1.length);
        var n = low;
        for (var i = 1; i < points1.length; i += 2) {
            points1_lat[i] = n;
            points1_lat[i + 1] = n;
            if (n == high) {
                n = low;
            } else {
                n = high;
            }
        }

        var space1 = (right - left) / cell;
        var n = left;
        for (var i = 0; i < points1.length; i += 2) {
            points1_lng[i] = n;
            points1_lng[i + 1] = n;
            n += space1;
        }

        for (i = 0; i < points1.length; i++) {
            var lat = points1_lat[i];
            var lng = points1_lng[i];
            points1[i] = new google.maps.LatLng(lat, lng);
        }

        var points2 = new Array(length);
        var points2_lat = new Array(length);
        var points2_lng = new Array(length);
        points2_lng[0] = left;

        var m = right;
        for (var i = 1; i < length; i += 2) {
            points2_lng[i] = m;
            points2_lng[i + 1] = m;
            if (m == left) {
                m = right;
            } else {
                m = left
            }
        }

        var space2 = (high - low) / cell;
        var m = high;
        for (var i = 0; i < length; i += 2) {
            points2_lat[i] = m;
            points2_lat[i + 1] = m;
            m -= space2;
        }

        for (var i = 0; i < length; i++) {
            points2[i] = new google.maps.LatLng(points2_lat[i], points2_lng[i]);
        }

        var PolylineOptions1 = {
            map: map,
            path: points1,
            strokeWeight: 5,
            strokeColor: "#0000ff",
            strokeOpacity: "0.5"
        };

        var PolylineOptions2 = {
            map: map,
            path: points2,
            strokeWeight: 5,
            strokeColor: "#0000ff",
            strokeOpacity: "0.5"
        };


        var poly1 = new google.maps.Polyline(PolylineOptions1);
        poly1.setMap(map);

        var poly2 = new google.maps.Polyline(PolylineOptions2);
        poly2.setMap(map);

        if (callback) {
            callback();
        }
    }
