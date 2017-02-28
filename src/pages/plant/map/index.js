export default {
  addPoint (lonlat, map, layer) {
    if (layer) {
      map.removeLayer(layer);
    }
    var feature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform(lonlat, 'EPSG:4326', 'EPSG:3857'))
    });

    var style = new ol.style.Style({
      image: new ol.style.Icon(({
        anchor: [0.5, 20],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: '/static/assets/img/' + 'planting/pl-position.png',
        imgSize: [30,30]
      }))
    });

    var source = new ol.source.Vector({
      features: [feature]
    });

    var point = new ol.layer.Vector({
      source: source,
      style: style
    });

    map.addLayer(point);
    point.setZIndex(10);
    
    return point
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
  }
}