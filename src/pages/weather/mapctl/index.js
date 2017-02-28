export default {
  renderStations(stations, parent) {
    var features = this.initFeatures(stations.data)
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
    clustersLayer.setZIndex(6);
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
          var length = feature.getProperties().features.length;
          if (length > 1) {
              map.getView().setCenter(map.getCoordinateFromPixel(pixel));
              map.getView().setZoom(map.getView().getZoom() + 1);
              return;
          } else {
            _self.stationId = feature.G.features[0].G.id;
            if (feature.G.features[0].G.name) {
              _self.currentStation = { hasName: true, name: feature.G.features[0].G.name };
            } else 
              _self.currentStation = { hasName: false, name: feature.G.features[0].G.id };
            parent.$emit('clickPoint', _self);
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
            var body = "站点编号: " + feature.G.features[0].G.id;
            if (feature.G.features[0].G.name) 
              var head = feature.G.features[0].G.name + "气象站";
            else
              var head = "气象站";

            var _point = map.getPixelFromCoordinate(feature.getGeometry().getCoordinates());
            var left = parseInt(_point[0]) - 90;
            var top = parseInt(_point[1]) - 15;
            
            parent.$emit('hoverPoint', {body, head, left, top});
            return;
          } 
        } 
      });

      var hit = map.hasFeatureAtPixel(pixel);
      if (hit) {
        map.getViewport().style.cursor = 'pointer';
      } else {
        map.getViewport().style.cursor = '-webkit-grab';
        parent.$emit('outPoint');
      }

    });
  }
}