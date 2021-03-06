export default {
  addPoint (lonlat, map, layer) {
    var source = this.getSource(lonlat)

    if (layer) {
      layer.setSource(source)

    } else {
      var style = new ol.style.Style({
        image: new ol.style.Icon(({
          anchor: [0.5, 1],
          src: '/static/assets/img/map/altitude.png'
        }))
      });

      layer = new ol.layer.Vector({
        source: source,
        style: style,
        zIndex: 10
      });

      map.addLayer(layer);
    }
    
    return layer
  },
  getSource(coordinate) {
    var feature = new ol.Feature({
      geometry: new ol.geom.Point(coordinate)
    });


    var source = new ol.source.Vector({
      features: [feature]
    });

    return source
  },
  getSld(layerName, legend) {
    let self = this, _sld = "";

    for (let i = 0; i < legend.length; i++) {
      _sld += '<ColorMapEntry color="'+ legend[i].color +
              '" quantity="'+ legend[i].value +
              '" label="'+ legend[i].name +
              '" opacity="1" />';
    } 
    
    _sld = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">' +
            '<NamedLayer>' +
            '<Name>' + layerName + '</Name>' +
            '<UserStyle>' +
            '<Title>SLD Cook Book: Discrete colors</Title>' +
            '<FeatureTypeStyle>' +
            '<Rule>' +
            '<RasterSymbolizer>' +
            '<ColorMap type="values">' +
              '<ColorMapEntry color="#000000" quantity="0" label="no-data" opacity="0" />' +
              _sld +
            '</ColorMap>' +
            '</RasterSymbolizer>' +
            '</Rule>' +
            '</FeatureTypeStyle>' +
            '</UserStyle>' +
            '</NamedLayer>' +
            '</StyledLayerDescriptor>';
    return _sld;       
  },
  getLonlat(coordinate) {
    var lonlat = ol.coordinate.toStringHDMS(ol.proj.transform(
      coordinate, 'EPSG:3857', 'EPSG:4326'));
    if (lonlat.indexOf('N') > 0) {
      var lat = '北纬 ' + lonlat.split('N')[0]
      if (lonlat.indexOf('E') > 0) {
        var lon = '东经 ' + lonlat.split('N')[1].split('E')[0]
      } else {
        var lon = '西经 ' + lonlat.split('N')[1].split('W')[0]
      }
    } else if (lonlat.indexOf('S') > 0) {
      var lat =  '南纬 ' + lonlat.split('S')[0]
      if (lonlat.indexOf('E') > 0) {
        var lon = '东经 ' + lonlat.split('S')[1].split('E')[0]
      } else {
        var lon = '西经 ' + lonlat.split('S')[1].split('W')[0]
      }
    }
    return lon +'  '+ lat
  },
  getClipFeature(geom) {
    var gsForamt = new ol.format.GeoJSON();
    var features = [{'type': 'Feature', 'geometry': geom}];

    var geojsonObject = {
      'type': 'FeatureCollection',
      'crs': {
          'type': 'name',
          'properties': {
              'name': 'EPSG:3857'
          }
      },
      'features': features
    };

    var fs = gsForamt.readFeatures(geojsonObject);
    return fs;
  },
  getClipStyle() {
    var style = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(255, 0, 0, 0)',
            width: 1
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255, 0, 0, 0)'
        })
    })
    return style;
  },
  clipLayer(curlayer, features) {
    curlayer.on('precompose', (event)=> {
        var ctx = event.context;
        var vecCtx = event.vectorContext;
        ctx.save();
        var len = features.length;
        for (var i = 0; i < len; i++) {
            vecCtx.drawFeature(features[i], this.getClipStyle());
        }
        ctx.clip();
    });
    curlayer.on('postcompose', function(event) {
        var ctx = event.context;
        ctx.restore();
    });
  }
}