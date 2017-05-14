import confUrl from 'config/env/config.env.js'
import configData from '../../../config/data.js'
export default {
  addVectorLayer(data_list, parent) {

    this.vectorLayer = this.getLayers(data_list, this.getNormalStyle())
    this.parent = parent
    this.parent.map.addLayer(this.vectorLayer)

    this.drawInteraction = null;
    this.curLandFeature = null

    this.drawingLayer = this.getDrawingVectorLayer();
    this.parent.map.addLayer(this.drawingLayer);

    var popupContainer,
      landPopup

    // farm land click handler
    
    var _this = this,
      ovlId = ''

    this.clickHandler = (evt) => {
      _this.setNormalStyle()
      var coordinates = evt.mapBrowserEvent.coordinate
      if (evt.selected.length > 0) {
        removeOverlay(ovlId)
        
        var feature = evt.selected[0];
        var landArea = feature.get("land_area");
        var landType = feature.get("land_type");
        var objectId = feature.get("land_object_id");
        feature.setStyle(_this.getClickStyle());
        landArea = (Number(landArea) * 15 / 10000).toFixed(2) 
        
        _this.parent.$emit('selectLand', {objectId, landArea,landType})
        _this.curLandFeature = feature
        

        popupContainer = document.createElement('div')
        landPopup = new ol.Overlay({
          element: popupContainer
        });
        _this.parent.map.addOverlay(landPopup);
        addOverlay(landType, landArea, coordinates, objectId)
        ovlId = objectId
      }

      if (evt.deselected.length > 0) {
        var feature = evt.deselected[0];
        feature.setStyle(_this.getNormalStyle());
      }
    }

    function addOverlay(type, area, coordinates, id) {
      let popup = document.createElement('div')
      var html = `<h3 class="pop-type">
                    <i>地块类型：</i>${type}
                  </h3>
                  <h3 class="popup-area">
                    <i>面积：</i>${area} 亩
                  </h3>`
      
      let closeBtn = document.createElement('span')
      closeBtn.innerHTML = '&times;'
      closeBtn.dataset.id = id

      let content = document.createElement('div')
      content.innerHTML = html

      popup.id = id
      popup.className = 'land-popup'
      popup.appendChild(closeBtn)
      popup.appendChild(content)

      let height = document.body.clientHeight + 100
      popup.style.left = `-75px`
      popup.style.top = `-${height}px`
      popupContainer.appendChild(popup)
      landPopup.setPosition(coordinates);

      closeBtn.onclick = (event) => {
        removeOverlay(event.target.dataset.id)
      }
    }
    function removeOverlay(id) {
      let popup = document.getElementById(id)
      if (id && popup) {
        _this.setNormalStyle()
         
        popup.parentNode.removeChild(popup)
        _this.parent.$emit('unselectLand')
      }
    }

    this.removeOverlay = ()=> {
      var popParent = document.getElementsByClassName('land-popup')
      if (popParent && popParent.length > 0) {
        popParent[0].parentNode.removeChild(popParent[0])
      }
    }

    var helpTipEle,
      helpTip

    var measureTipEle,
      measureTip

    var listener, sketch

    this.pointerMoveHandler = (evt) => {
      if (evt.dragging) {
        return;
      }
      this.createHelpTip()

      if (sketch) {
        var geom = sketch.getGeometry();
        if (geom instanceof ol.geom.Polygon) {
          helpTipEle.innerHTML = '<span class="map-highlight-tip">单击</span>选择地点，<span class="map-highlight-tip">双击</span>双击结束'
        } else if (geom instanceof ol.geom.Point) {
          helpTipEle.innerHTML = '<span class="map-highlight-tip">单击</span>选择地点';
        } 
      } else if (_this.type === "point") {
        helpTipEle.innerHTML = '<span class="map-highlight-tip">单击</span>选择地点';
      } else if (_this.type ==="polygon") {
        helpTipEle.innerHTML = '<span class="map-highlight-tip">单击</span>选择起点';
      }

      helpTipEle.classList.remove('hidden');
      
      var coordinate = evt.coordinate ? evt.coordinate : evt.mapBrowserEvent.coordinate
      helpTip.setPosition(coordinate);
    }

    this.startDrawPoint = (evt) => {
      this.drawingLayer.getSource().clear();
      sketch = evt.feature
    }

    this.finishDrawPoint = (evt) => {
      
      var geometry = evt.feature.getGeometry();
      var coordinate = geometry.getCoordinates();

      sketch = null
      pointInFeature(this.vectorLayer.getSource(), coordinate)
      ol.Observable.unByKey(listener);
    }

    this.startDrawPolygon = (evt) => {
      this.createMeasureTip()
      this.drawingLayer.getSource().clear()
      sketch = evt.feature
      listener = evt.feature.getGeometry().on('change', function (evt) {
        var geom = evt.target
        var coordinate = geom.getInteriorPoint().getCoordinates()

        var output = '总面积' + formatArea(geom) + '亩';
        measureTipEle.innerHTML = output;
        measureTip.setPosition(coordinate)
      });
    }

    this.finishDrawPolygon = (evt) => {
      
      var geometry = evt.feature.getGeometry();
      var coordinate = geometry.getCoordinates()[0];

      var area = formatArea(geometry)
      this.parent.$emit('setPostData', {coordinate, area})
      
      sketch = null
      ol.Observable.unByKey(listener);
    }

    function pointInFeature(source, coordinate) {
      var exist = false
      source.forEachFeature((feature) => {
        var extent = feature.getGeometry().getExtent()
        var contian = ol.extent.containsCoordinate(extent, coordinate)
        if (contian) {
          var landType = feature.get("land_type");
          _this.parent.$emit('setPostData', {coordinate, landType})
          exist = true
          return
        }
      })

      !exist && _this.parent.$emit('setPostData', {coordinate, landType: '其他'})
    }

    function formatArea(polygon) {
      var area = polygon.getArea(),
        output = Math.round(polygon.getArea() * 100) / 100  // 平方米
      output = (output * 15 / 10000).toFixed(2)  //亩
      return output;
    };

    this.createHelpTip = ()=> {
      if (helpTipEle) {
        helpTipEle.parentNode.removeChild(helpTipEle);
      }
      var id = new Date().getTime()
      var tipInfo = this.createTooltip("hidden", [15, 0], "bottom-left", id, true)
      helpTip = tipInfo.tooltip
      helpTipEle = tipInfo.tooltipEle
    }

    this.createMeasureTip = ()=> {
      if (measureTipEle) {
        measureTipEle.parentNode.removeChild(measureTipEle);
      }
      var id = new Date().getTime()
      var tipInfo = this.createTooltip("tooltip-measure", [0, -15], "bottom-center", id)
      measureTip = tipInfo.tooltip
      measureTipEle = tipInfo.tooltipEle
    }

    this.removeAllTip = () => {
      this.parent.map.removeOverlay(helpTip)
      this.parent.map.removeOverlay(measureTip)
    }

    return this.vectorLayer
  },
  createTooltip(className, offset, position, id, useEvt) {
    var map = this.parent.map,
      tooltipEle = document.createElement('div'),
      tooltip = null

    tooltipEle.className = 'tooltip ' + className

    tooltip = new ol.Overlay({
      id: id,
      element: tooltipEle,
      offset: offset,
      positioning: position
    });

    map.addOverlay(tooltip);
    if (useEvt) {
      map.getViewport().addEventListener('mouseout', mouseOut);
    }
    
    function mouseOut () {
      tooltipEle.classList.add('hidden');
    }

    return {tooltip, tooltipEle}
  },
  getLayers(vector_datas, style) {
    var vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({ wrapX: false }),
      zIndex: 10
    });
    vectorLayer.id = "land_ownership_layer";

    var gsForamt = new ol.format.GeoJSON();
    var features = [];
    for (var i = 0; i < vector_datas.length; i++) {
      var vector_data = vector_datas[i],
        geom = JSON.parse(vector_data.geom),
        objectid = vector_data.land_object_id,
        landid = vector_data.land_id,
        landtype = vector_data.land_type,
        landtypeid = vector_data.land_type_id,
        landarea = vector_data.land_area;
      features.push({
        'type': 'Feature',
        'geometry': geom,
        'properties': {
          "land_object_id": objectid,
          "land_type": landtype,
          "land_type_id": landtypeid,
          "land_id": landid,
          "land_area": landarea
        }
      });
    }

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

    //转换成ol可识别的feature
    var fs = gsForamt.readFeatures(geojsonObject);
    vectorLayer.getSource().addFeatures(fs);
    vectorLayer.setStyle(style);

    return vectorLayer;
  },
  removeDrawInteraction(staySelected) {
    if (this.drawInteraction) {

      this.drawInteraction.un('select', this.clickHandler);
      this.drawInteraction.un('drawstart', this.startDrawPoint);
      this.drawInteraction.un('drawend', this.finishDrawPoint);
      this.drawInteraction.un('drawstart', this.startDrawPolygon);
      this.drawInteraction.un('drawend', this.finishDrawPolygon);

      this.parent.map.un('pointermove', this.pointerMoveHandler)

      this.parent.map.removeInteraction(this.drawInteraction);
      this.drawingLayer.getSource().clear();

      this.removeOverlay()
      this.removeAllTip()

      if (this.curLandFeature && !staySelected) {
        this.curLandFeature.setStyle(this.getNormalStyle());
      }
    }
  },
  addDrawInteraction(type) {
    if (this.type === "farmland" && type === "") {
      this.setNormalStyle()
    }

    this.type = type
    this.removeDrawInteraction()

    switch (type) {
      case "point":
        this.drawPoint()
        break;
      case "polygon":
        this.drawPolygon()
        break;
      case "farmland":
        this.drawFarmLand()
        break;
      default:
        this.drawFarmLand()
        break;
    }
  },
  drawPoint() {
    this.parent.map.on('pointermove', this.pointerMoveHandler)

    this.drawInteraction = new ol.interaction.Draw({
      source: this.drawingLayer.getSource(),
      type: "Point"
    })
    this.parent.map.addInteraction(this.drawInteraction);
    this.drawInteraction.on('drawstart', this.startDrawPoint);
    this.drawInteraction.on('drawend', this.finishDrawPoint);
  },
  drawPolygon() {
    this.parent.map.on('pointermove', this.pointerMoveHandler)

    this.drawInteraction = new ol.interaction.Draw({
      source: this.drawingLayer.getSource(),
      type: "Polygon"
    });
    this.parent.map.addInteraction(this.drawInteraction);
    this.drawInteraction.on('drawstart', this.startDrawPolygon);
    this.drawInteraction.on('drawend', this.finishDrawPolygon);
  },
  drawFarmLand() {
    this.drawInteraction = new ol.interaction.Select({
      layers: [this.vectorLayer],
      condition: ol.events.condition.singleClick
    });
    this.drawInteraction.on('select', this.clickHandler);
    this.parent.map.addInteraction(this.drawInteraction);
  },
  setPostData(geom) {
    switch(type) {
      case "point": 
        var postData = {
            "start_date": select_ndvi_start_date,
            "end_date": select_ndvi_end_date,
            "area_name": ndvi_select_area_name,
            "satellite_name": ndvi_select_satellite_name,
            "point": select_ndvi_value_point
        };
        getPointHistoryNDVIList(postData);
        break;
      case "polygon":
        var postData = {
            "start_date": select_ndvi_start_date,
            "end_date": select_ndvi_end_date,
            "area_name": ndvi_select_area_name,
            "satellite_name": ndvi_select_satellite_name,
            "polygon": select_ndvi_value_polygon
        };
        getPolygonHistoryNDVIList(postData);
        break;
      case "farmland":
        var postData = {
            "start_date": select_ndvi_start_date,
            "end_date": select_ndvi_end_date,
            "area_name": ndvi_select_area_name,
            "land_type": select_ndvi_land_type,
            "satellite_name": ndvi_select_satellite_name
        };
        getCertainFarmlandHistoryNDVIList(postData);
        break;
    }
  },
  getDrawingVectorLayer() {
    var vector = new ol.layer.Vector({
        source: new ol.source.Vector({wrapX: false}),
        zIndex: 12,
        style: new ol.style.Style({   // the color of drawed feature
            fill: new ol.style.Fill({color: 'rgba(255, 255, 255, 0.2)'}),
            stroke: new ol.style.Stroke({color: '#ffcc33', width: 2}),
            image: new ol.style.Icon({
              anchor: [0.5, 1],
              src: '/static/assets/img/map/altitude.png'
            })
        })
    });
    vector.id = "drawingVectorLayerId";
    return vector;
  },
  highLightFeature(type) {
    if (type !== 0) {
      var source = this.vectorLayer.getSource()
      source.forEachFeature((feature) => {
        var typeId = feature.get("land_type_id");
        if (type == typeId) {
          feature.setStyle(this.getHoverStyle())
        } else {
          feature.setStyle(this.getNormalStyle())
        }
      })
    } else {
      this.setNormalStyle()
    }
  },
  setNormalStyle(idList) {
    var source = this.vectorLayer.getSource()
    source.forEachFeature((feature) => {
      feature.setStyle(this.getNormalStyle(idList))
    })
  },
  getNormalStyle(idList) {
    idList = idList ? idList : []
    // 0、全部；1、水田；2、耕地；3、园地；4、未知
    var styles = {
      "1": new ol.style.Style({
        stroke: new ol.style.Stroke({ color: (idList.indexOf(1) >=0 ? 'rgba(255,0,0,0)' : '#2e62f7') , width: 1.5 })
      }),
      "2": new ol.style.Style({
        stroke: new ol.style.Stroke({ color: (idList.indexOf(2) >=0 ? 'rgba(255,0,0,0)' : '#ff436e'), width: 1.5 })
      }),
      "3": new ol.style.Style({
        stroke: new ol.style.Stroke({ color: (idList.indexOf(3) >=0 ? 'rgba(255,0,0,0)' : '#028600'), width: 1.5 })
      }),
      "4": new ol.style.Style({
        stroke: new ol.style.Stroke({ color: (idList.indexOf(4) >=0 ? 'rgba(255,0,0,0)' : '#e0e0e0'), width: 1.5 })
      })
    };
    return function(feature, resolution) {
      var land_type_id = feature.get('land_type_id');
      var style = styles[land_type_id.toString()];
      return [style];
    }
  },
  getHoverStyle() {
    var styles = {
      "1": new ol.style.Style({
          stroke: new ol.style.Stroke({color: '#2e62f7', width: 3.5})
      }),
      "2": new ol.style.Style({
          stroke: new ol.style.Stroke({color: '#2e62f7', width: 3.5})
      }),
      "3": new ol.style.Style({
          stroke: new ol.style.Stroke({color: '#2e62f7', width: 3.5})
      }),
      "4": new ol.style.Style({
          stroke: new ol.style.Stroke({color: '#2e62f7', width: 3.5})
      })
    };
    return function(feature, resolution) {
      var white = [255, 255, 255, 1];
      var blue = [0, 153, 255, 1];
      var width = 3;
      var style = [
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: white,
            width: width + 2
          })
        }),
        new ol.style.Style({
          stroke: new ol.style.Stroke({ color: blue, width: width })
        })
      ];
      return style;
    }
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
  getClickStyle() {
    return function(feature, resolution) {
      var white = [255, 255, 255, 1];
      var blue = [0, 153, 255, 1];
      var width = 3;
      var style = [
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: white,
            width: width + 2
          })
        }),
        new ol.style.Style({
          stroke: new ol.style.Stroke({ color: blue, width: width })
        })
      ];
      return style;
    }
  },
  getNDVIlayer(layerName) {
    var landsat_ndvi_layer = new ol.layer.Tile({
      extent: configData.NDVI.extent,
      source: new ol.source.TileWMS({
        url: confUrl.mapUrl,
        params: {
            'VERSION': '1.1.0',
            'LAYERS': "map:" + layerName,
            "tiled": true,
            "STYLES": 'map:ndvi',
            "serverType": 'geoserver',
            "format": "image/jpeg",

        }
      }),
      
      zIndex: 9
    });

    return landsat_ndvi_layer;
  },
  getSld() {
    var sld = `<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"><NamedLayer>
<Name>map:${layerName}</Name><UserStyle><FeatureTypeStyle><Rule><RasterSymbolizer><ColorMap type="intervals">
<ColorMapEntry color="#fdfaad" quantity="-1" label="-1" opacity="1" />
<ColorMapEntry color="#000000" quantity="0" label="0" opacity="0"/>
<ColorMapEntry color="#fdfaad" quantity="0.1" label="0.1" opacity="1"/>
<ColorMapEntry color="#e2da06" quantity="0.2" label="0.2" opacity="1"/>
<ColorMapEntry color="#d0e206" quantity="0.3" label="0.3" opacity="1"/>
<ColorMapEntry color="#c0e206" quantity="0.4" label="0.4" opacity="1"/> 
<ColorMapEntry color="#ace206" quantity="0.5" label="0.5" opacity="1"/>
<ColorMapEntry color="#9afb30" quantity="0.6" label="0.5" opacity="1"/>
<ColorMapEntry color="#63e206" quantity="0.7" label="0.7" opacity="1"/>
<ColorMapEntry color="#3ed01c" quantity="0.8" label="0.8" opacity="1"/>
<ColorMapEntry color="#14c235" quantity="0.9" label="0.9" opacity="1"/>
<ColorMapEntry color="#0e7d59" quantity="1" label="1" opacity="1"/></ColorMap></RasterSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>`
    return ''             
  },
  getVectorFeatures(vector_datas, land_type_id, filter_id) {
    var gsForamt = new ol.format.GeoJSON();
    var features = [];

    var mygeom = {
        "type": "MultiPolygon",
        "coordinates": []
    }
    var len = vector_datas.length;
    for (var i = 0; i < len; i++) {
        var vector_data = vector_datas[i];
        if (filter_id && filter_id.indexOf(vector_data.land_type_id) >= 0) {
          continue
        }
        if (land_type_id != 0 && land_type_id != vector_data.land_type_id) {
            continue;
        }
        var geom = JSON.parse(vector_data.geom);
        mygeom["coordinates"].push(geom["coordinates"][0])
    }
    features.push({'type': 'Feature', 'geometry': mygeom});

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

    //转换成ol可识别的feature
    var fs = gsForamt.readFeatures(geojsonObject);
    return fs;
  },
  clipLayer(curlayer, features, style) {
    curlayer.on('precompose', function(event) {
        var ctx = event.context;
        var vecCtx = event.vectorContext;
        ctx.save();
        var len = features.length;
        for (var i = 0; i < len; i++) {
            vecCtx.drawFeature(features[i], style);
        }
        ctx.clip();
    });
    curlayer.on('postcompose', function(event) {
        var ctx = event.context;
        ctx.restore();
    });
  },
  hideLayer(typeIds) {
    console.log(typeIds)
    this.setNormalStyle(typeIds)
  }
}
