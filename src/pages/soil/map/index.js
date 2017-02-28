export default {
  addPoints(points, map) {

    var features = turnToFeaturs(points)
    var pointLayer = addPoints(features, map)

    return pointLayer

    function turnToFeaturs(data) {
      var len = data.length;
      if (len > 0) {
        var features = new Array(len);
        for (var i = 0; i < len; i++) {
          var coordinates = data[i].lonlat;
          features[i] = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform(coordinates, 'EPSG:4326',
              'EPSG:3857')),
            id: data[i].id,
            name: data[i].name,
            element: data[i].elements,
            outof: data[i].outof
          });
        }
        return features;
      }
    }

    function addPoints(features, map) {
      var source = new ol.source.Vector({
        features: features
      });

      var pointLayer = new ol.layer.Vector({
        source: source,
        style: function(feature) {
          return getStyle(feature.G.id, feature.G.outof);
        }
      });

      map.addLayer(pointLayer);
      pointLayer.setZIndex(10);
      return pointLayer
    }

    function getStyle(text, outof) {
      var img = "map-blue.png";
      if (outof == 1) {
        img = "map-red.png"
      }
      return new ol.style.Style({
        image: new ol.style.Icon(({
          src: '/static/assets/img/map/' + img
        })),
        text: new ol.style.Text({
          font: '18px serif',
          text: text.toString(),
          fill: new ol.style.Fill({
            color: '#fff'
          }),
          offsetX: -1,
          offsetY: -5
        })
      })
    }
  },
  mapEvents(parent) {
    var map = parent.map
    var pointLayer = parent.pointLayer
    map.on('click', function(event) {
      parent.$emit('showTip', {show: false})
      if (event.dragging) return;

      var pixel = map.getEventPixel(event.originalEvent);
      map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        if (layer == pointLayer) {
          var details = feature.G.element,
            outof = feature.G.outof,
            name = feature.G.name
          parent.$emit('featureInfo', {details, outof, name})
        }
      });
    });

    map.on('pointermove', function(event) {
      if (event.dragging) {
        parent.$emit('showTip', {show: false})
        return;
      }
      var pixel = map.getEventPixel(event.originalEvent);

      map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        if (layer == pointLayer && feature) {
          var _point = map.getPixelFromCoordinate(feature.getGeometry().getCoordinates());
          var left = parseInt(_point[0]) - 50,
            top = parseInt(_point[1]) + 15,
            id = feature.G.id,
            name = feature.G.name
          parent.$emit('showTip', {show: true, top, left, id, name})
        }
      });

      var hit = map.hasFeatureAtPixel(pixel);
      if (hit) {
        map.getViewport().style.cursor = 'pointer';
      } else {
        map.getViewport().style.cursor = '-webkit-grab';
        parent.$emit('showTip', {show: false})
      }

    });
  }
}