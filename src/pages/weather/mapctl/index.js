export default {
  addAtmosOverlay(coordinate, map) {
    var popup = document.getElementById('atmostPop')
    popup.style.display = 'block'
    var position = ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:3857')
    if (!this.overlay) {
      this.overlay = new ol.Overlay({
        element: popup
      });
      map.addOverlay(this.overlay);
    }
    
    this.overlay.setPosition(position);
    
    map.renderSync()

    return this.overlay
  },
  addPointByLonlat(coordinate, map) {
    var feature = new ol.Feature({
      geometry: new ol.geom.Point(coordinate)
    });

    var source = new ol.source.Vector({
      features: [feature]
    });

    var style = [
      new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: '/static/assets/img/map/altitude.png'
          }),
        })
    ];
  
    var _altitudeLayer = new ol.layer.Vector({
      source: source,
      style: style
    });

    map.addLayer(_altitudeLayer);
    _altitudeLayer.setZIndex(10)

    return _altitudeLayer
  },
  renderStations(stations, parent) {
    var features = this.initFeatures(stations)
    var layer = this.addPoints(features, parent.map)
    this.bindEvents(parent, layer);
  },
  initFeatures(data) {
    var len = data.length;
    var features = new Array(len);
    if (len > 0) {
      for (var i = 0; i < len; i++) {
        var coordinates = [data[i].loc.lon, data[i].loc.lat];
        features[i] = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.transform(coordinates, 'EPSG:4326',
                      'EPSG:3857')),
          id: data[i].id,
          name: data[i].name
        });
      }
      return features
    }
  },
  addPoints: function(features, map) {
    var singlePointStyle = function() {
      var style = new ol.style.Style({
        image: new ol.style.Icon(({
          anchor: [0.5, 36],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: '/static/assets/img/' + 'marker/marker.png'
        }))
      });
      return style;
    }

    var multifyPointStyle = function(size) {
      var _url, _offsetX, _fontSize;
      if (size < 10 && size > 1) {
        _url = 'marker/marker10.png';
        _offsetX = -4;
        _fontSize = '18px';
      } else if (size <= 50 && size >= 10) {
        _url = 'marker/marker50.png';
        _offsetX = -5;
        _fontSize = '16px';
      } else if (size > 50) {
        _url = 'marker/marker100.png';
        _offsetX = -6;
        _fontSize = '14px';
      }
      var style = new ol.style.Style({
        image: new ol.style.Icon(({
          src: '/static/assets/img/' + _url
        })),
        text: new ol.style.Text({
          font: _fontSize +' serif',
          text: size.toString(),
          fill: new ol.style.Fill({
            color: '#ef7e0e'
          }),
          offsetX: _offsetX,
          offsetY: -5
        })
      });
      return style;
    }

    var source = new ol.source.Vector({
      features: features
    });

    var clusterSource = new ol.source.Cluster({
      distance: 100,
      source: source
    });

    var styleCache = {};

    var clustersLayer = new ol.layer.Vector({
      source: clusterSource,
      style: function(feature) {
        var size = feature.get('features').length;
        var style = styleCache[size];
        if (!style) {
          if (size == 1) {
            style = singlePointStyle();
          } else {
            style = multifyPointStyle(size);
          }
          styleCache[size] = style;
        }
        return style;
      }
    });
    map.addLayer(clustersLayer);
    clustersLayer.setZIndex(10);
    return clustersLayer
  },
  bindEvents: function (parent, clustersLayer) {
    var _self = {},
      map = parent.map
    map.on('click', function(event) {
      parent.$emit('outPoint');
      if (event.dragging) return;
      var pixel = map.getEventPixel(event.originalEvent);

      map.forEachFeatureAtPixel(pixel, function (feature, layer) {
        if (layer == clustersLayer) {
          parent.$emit("clickAtmosPoint")
          var length = feature.getProperties().features.length;
          if (length > 1) {
              map.getView().setCenter(map.getCoordinateFromPixel(pixel));
              map.getView().setZoom(map.getView().getZoom() + 1);
              return true;

          } else {
            var _feature = feature.getProperties().features[0].getProperties()
            _self.stationId = _feature.id;
            if (_feature.name) {
              _self.currentStation = { hasName: true, name: _feature.name };

            } else {
              _self.currentStation = { hasName: false, name: _feature.id };
            }
            parent.$emit('clickPoint', _self);
            return true;
          }
        }
      }); 
    });

    map.on('pointermove', function(event) {
      if (event.dragging) {
        parent.$emit('outPoint');
        return;
      }
      var pixel = map.getEventPixel(event.originalEvent);

      map.forEachFeatureAtPixel(pixel, function (feature, layer) {
        if (layer == clustersLayer && feature) {
          var length = feature.getProperties().features.length;
          if (length == 1) {
            var _feature = feature.getProperties().features[0].getProperties()
            var body = "站点编号: " + _feature.id;
            if (_feature.name) 
              var head = _feature.name + "气象站";
            else
              var head = "气象站";

            var _point = map.getPixelFromCoordinate(feature.getGeometry().getCoordinates());
            var left = parseInt(_point[0]) - 90;
            var top = parseInt(_point[1]) - 90;
            
            parent.$emit('hoverPoint', {body, head, left, top});
            return true;
          } 
        } 
      });

      var hit = map.hasFeatureAtPixel(pixel);
      if (hit) {
        map.getViewport().style.cursor = 'pointer';
      } else {
        map.getViewport().style.cursor = 'default';
        parent.$emit('outPoint');
      }

    });
  }
}