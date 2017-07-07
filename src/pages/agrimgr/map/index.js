import confUrl from 'config/env/config.env.js'
import configData from '../../../config/data.js'
export default {
  addVectorLayer(data_list, parent) {
    this.showClassify = true
    var opacity = parent.layerOpacity
    this.vectorLayer = this.getLayers(data_list, this.getNormalStyle(this.showClassify), opacity)
    this.parent = parent
    this.parent.map.addLayer(this.vectorLayer)

    this.drawInteraction = null;
    this.curLandFeature = null

    var popupContainer,
      landPopup

    // farm land click handler
    
    var _this = this,
      ovlId = ''

    this.landBlockHoverEvt = (event) => {
      if (event.dragging) {
        return;
      }
      _this.removeOverlay()

      var map = _this.parent.map
      var coordinates = event.coordinate

      var pixel =  map.getEventPixel(event.originalEvent);
      map.forEachFeatureAtPixel(pixel, (feature, layer) => {
        if (layer == _this.vectorLayer) {

          removeOverlay(ovlId)

          var object = feature.getProperties()
          var landType = object.land_type
          var objectId = object.land_object_id
          var tel = object.land_owner_tel
          var owner = object.land_owner
          var area = parseInt(object.land_area * 15 /10000)

          var cropHealthInfo = _this.parent.getCropHealthInfobyId(objectId)

          
          if (!landPopup) {
            popupContainer = document.createElement('div')
            landPopup = new ol.Overlay({
              element: popupContainer
            });
            _this.parent.map.addOverlay(landPopup);
          }

          addOverlay(cropHealthInfo, area, landType, coordinates, objectId, owner, tel)
          ovlId = objectId

        }
      })

    }

    function addOverlay(cropHealthInfo, area, landType, coordinates, id, owner, tel) {
      let popup = document.createElement('div')
      var html = `<h3 class="pop-type">
                    <i>#${id} </i>${landType}
                  </h3>
                  <p class="popup-area">
                    <i>种植面积：</i>${area} 亩
                  </p>
                  <p class="popup-crop">
                    <i>种植作物：</i>${cropHealthInfo.crop}
                  </p>
                  <p class="popup-healthy">
                    <i>健康状况：</i><em style="color:${cropHealthInfo.color}">${cropHealthInfo.healthy}</em>
                  </p>
                  <p class="popup-responsible" style="border-top:1px dashed #c9c9c9">
                    <i>负责人：</i><em>${owner}</em>
                  </p>
                  <p class="popup-responsible" style="">
                    <i>联系电话：</i><em>${tel}</em>
                  </p>`
      
      let closeBtn = document.createElement('span')
      closeBtn.innerHTML = '&times;'
      closeBtn.dataset.id = id

      let content = document.createElement('div')
      content.innerHTML = html

      popup.id = id
      popup.className = 'land-popup'
      // popup.appendChild(closeBtn)
      popup.appendChild(content)
      
      popupContainer.appendChild(popup)
      landPopup.setPosition(coordinates);

      // closeBtn.onclick = (event) => {
      //   removeOverlay(event.target.dataset.id)
      // }
    }
    function removeOverlay(id) {
      let popup = document.getElementById(id)
      if (id && popup) {
         
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

    this.landBlockClickEvt = (event) => {
      if (event.dragging) {
        return;
      }

      var map = _this.parent.map
      var coordinates = event.coordinate

      var pixel =  map.getEventPixel(event.originalEvent);
      map.forEachFeatureAtPixel(pixel, (feature, layer) => {
        if (layer == _this.vectorLayer) {
          var object = feature.getProperties()
          var objectId = object.land_object_id
          _this.parent.doClickEvent(objectId)
        }

      })
    }

    return this.vectorLayer
  },
  setCurrentYear(year) {
    this.currentYear = year
  },
  setObjectId(id) {
    this.objectId = id
  },
  getLayers(vector_datas, style, opacity) {
    var vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({ wrapX: false }),
      zIndex: 10,
      opacity: opacity/100
    });
    vectorLayer.id = "land_ownership_layer";

    var fs = this.getFilteredFeatures(vector_datas);

    vectorLayer.getSource().addFeatures(fs);
    vectorLayer.setStyle(style);

    return vectorLayer;
  },
  setSourceByFeilter(geomCollection, filterIds) {
    var features = this.getFilteredFeatures(geomCollection, filterIds)

    var source = new ol.source.Vector({ wrapX: false })
    source.addFeatures(features)

    this.vectorLayer.setSource(source)
  },
  getFilteredFeatures(geomCollection, filterIds) {
    var features = [];
    var gsForamt = new ol.format.GeoJSON();

    for (var i = 0; i < geomCollection.length; i++) {
      var geomItem = geomCollection[i]

      if (filterIds && filterIds.length > 0) {
        var item = null

        if (filterIds.includes(geomItem.land_object_id)) {
          item = this.getFeatureAttr(geomItem)
          features.push(item)
        }
          
      } else {
        item = this.getFeatureAttr(geomItem)
        features.push(item)
      }
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
    
    return fs;
  },
  getFeatureAttr(geomItem) {
    var cropId = this.getCropId(geomItem.land_crop),
      geom = JSON.parse(geomItem.geom),
      objectid = geomItem.land_object_id,
      landid = geomItem.land_id,
      landtype = geomItem.land_type,
      landtypeid = geomItem.land_type_id,
      landarea = geomItem.land_area,
      land_owner = geomItem.land_owner,
      land_owner_2 = geomItem.land_owner_2,
      land_owner_3 = geomItem.land_owner_3,
      land_state = geomItem.land_state,
      land_level = geomItem.land_level,
      land_owner_tel = geomItem.land_owner_tel;

    return {
        'type': 'Feature',
        'geometry': geom,
        'properties': {
          "land_object_id": objectid,
          "land_type": landtype,
          "land_type_id": landtypeid,
          "land_id": landid,
          "land_area": landarea,
          land_owner,
          land_owner_tel,
          land_owner_2,
          land_owner_3,
          land_state,
          land_level,
          cropId
        }
      }
  },
  getCropId(crop) {
    var id = ''
    for (var i = 0; i < crop.length; i++) {
      if (crop[i].year == this.currentYear) {
        id = crop[i].crop_id

        break
      }
    }
    return id
  },
  setNormalStyle(showClassify) {
    if (typeof showClassify === 'boolean') {
      this.showClassify = showClassify
    }
    
    var source = this.vectorLayer.getSource()
    source.forEachFeature((feature) => {
      var typeId = feature.get("land_object_id");

      if (this.objectId && this.objectId == typeId) {
        feature.setStyle(this.getHoverStyle())
        
      } else {
        feature.setStyle(this.getNormalStyle(this.showClassify))
      }
      
    })
  },
  getNormalStyle(showClassify) {
    // 0、全部；1、水田；2、耕地；3、园地；4、未知
    var landStyle = {
      "1": new ol.style.Style({
        stroke: new ol.style.Stroke({ color: ('#2e62f7') , width: 0 })
      }),
      "2": new ol.style.Style({
        stroke: new ol.style.Stroke({ color: ('#ff436e'), width: 0 })
      }),
      "3": new ol.style.Style({
        stroke: new ol.style.Stroke({ color: ('#028600'), width: 0 })
      }),
      "4": new ol.style.Style({
        stroke: new ol.style.Stroke({ color: ('#e0e0e0'), width: 0 })
      })
    };

    return (feature, resolution) => {
      var land_type_id = feature.get('land_type_id');
      var stokeStyle = landStyle[land_type_id.toString()];
      
      var cropId = feature.get('cropId');
      

      var markStyle = this.getMarkStyle(cropId)

      var style
      if (showClassify) {
        var fillStyle = this.getClassifyStyle(cropId);
        style = [stokeStyle, fillStyle].concat(markStyle)

      } else {
        style = [stokeStyle].concat(markStyle)
      }

      return style
    }
  },
  getClassifyStyle(cropId) {
    var colors = configData.agrimgrColor.crop
    var cropStyle = {
      "119": new ol.style.Style({ // malingshu
        fill: new ol.style.Fill({ color: colors["119"].lendBg})
      }),
      "140": new ol.style.Style({  //dadou
        fill: new ol.style.Fill({ color: colors["140"].lendBg})
      }),
      "135": new ol.style.Style({  //水稻
        fill: new ol.style.Fill({ color: colors["135"].lendBg})
      }),
      "134": new ol.style.Style({
        fill: new ol.style.Fill({ color: colors["134"].lendBg})
      })
    };
    
    return cropStyle[cropId.toString()]
  },
  getMarkStyle(cropId) {
    var style = []
    var zoom = this.parent.map.getView().getZoom()

    var cropInfo = configData.agrimgrColor.crop

    var fontSize = 12

    if (zoom <= 12) {
      style = []
    } else if (zoom <= 13) {
      style = [
        new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 0.5],
            src: 'data:image/svg+xml;utf8,' + cropInfo[cropId].svg.replace(/'/g, '"')
          }),
          geometry: function (feature) {
            var coordinate = feature.getGeometry().getInteriorPoints().getCoordinates()[0]
            var point = new ol.geom.Point(coordinate)
            return point
          }
        })
      ]

    } else if(zoom <= 14) {
      style = this.getCropIconStyle(fontSize, cropId, cropInfo)

    } else if (zoom > 14) {
      fontSize = 14
      style = this.getCropIconStyle(fontSize, cropId, cropInfo)
    }

    return style
  },
  getCropIconStyle(fontSize, cropId, cropInfo) {
    var style = [
      new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0, 0],
          src: 'data:image/svg+xml;utf8,' + cropInfo[cropId].svg.replace(/'/g, '"')
        }),
        text: new ol.style.Text({
          font: "bolder " + fontSize +'px Helvetica Neue 微软雅黑',
          text: cropInfo[cropId].name,
          fill: new ol.style.Fill({
            color: '#000'
          }),
          stroke: new ol.style.Stroke({color: "#fff", width: 1.5}),
          offsetX: -fontSize
        }),
        geometry: function (feature) {
          var coordinate = feature.getGeometry().getInteriorPoints().getCoordinates()[0]
          var point = new ol.geom.Point(coordinate)
          return point
        }
      })
    ]
    return style
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
    return (feature, resolution)=> {
      var white = [255, 255, 255, 1];
      var red = [255, 0, 0, 1];
      var blue = [0, 153, 255, 1];
      var width = 3;
      var style = [
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: white,
            width: width + 2
          }),
          zIndex: 10
        }),
        new ol.style.Style({
          stroke: new ol.style.Stroke({ color: blue, width: width }),
          zIndex: 10
        })
      ];


      if (this.showClassify) {
        var cropId = feature.get('cropId');
        var fillStyle = this.getClassifyStyle(cropId);
        style.unshift(fillStyle)
      } 

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
  getNDVIlayer(layerName, opacity) {
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
      zIndex: 9,
      opacity: opacity/100
    });

    return landsat_ndvi_layer;
  },
  getLayerBySld(layerName, sld, opacity) {
    var landsat_ndvi_layer = new ol.layer.Tile({
      extent: configData.NDVI.extent,
      source: new ol.source.TileWMS({
        url: confUrl.mapUrl,
        params: {
          'VERSION': '1.1.0',
          'LAYERS': "map:" + layerName,
          "tiled": true,
          SLD_BODY: sld
        }
      }),
      serverType: 'geoserver',
      zIndex: 9,
      opacity: opacity/100
    });

    return landsat_ndvi_layer;
  },
  getSldBody(layerName, index) {
    var sld = ''
    if (index === 1) {
      sld = `<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">
              <NamedLayer>
                <Name>map:${layerName}</Name>
                <UserStyle>
                  <Title>Dryness Products (Test)</Title>
                  <FeatureTypeStyle>
                    <Rule>
                      <RasterSymbolizer>
                        <ColorMap type="values">
                          <ColorMapEntry color="#000000" quantity="0" label="no-data" opacity="0" />
                          <ColorMapEntry color="#FCEAA9" quantity="1" label="very poor" opacity="1"/>
                          <ColorMapEntry color="#EFC635" quantity="2" label="poor" opacity="1"/>
                          <ColorMapEntry color="#FA7083" quantity="3" label="normal" opacity="1"/>
                          <ColorMapEntry color="#D9482B" quantity="4" label="good" opacity="1"/>
                          <ColorMapEntry color="#A33622" quantity="5" label="very good" opacity="1"/>
                        </ColorMap>
                      </RasterSymbolizer>
                    </Rule>
                  </FeatureTypeStyle>
                </UserStyle>
              </NamedLayer>
            </StyledLayerDescriptor>
`
    } else if (index === 2) {
      sld = `<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">
              <NamedLayer>
                <Name>map:${layerName}</Name>
                <UserStyle>
                  <Title>Plant Growth Products (Test)</Title>
                  <FeatureTypeStyle>
                    <Rule>
                      <RasterSymbolizer>
                        <ColorMap type="intervals">
                          <ColorMapEntry color="#82bd05" quantity="-0.005" label="low" opacity="1" />
                          <ColorMapEntry color="#01b8af" quantity="0.005" label="same" opacity="1"/>
                          <ColorMapEntry color="#e60000" quantity="99" label="high" opacity="1"/>
                        </ColorMap>
                      </RasterSymbolizer>
                    </Rule>
                  </FeatureTypeStyle>
                </UserStyle>
              </NamedLayer>
            </StyledLayerDescriptor>`
    }

    return sld
  },
  bindClickEvent() {
    this.parent.map.on('click', this.landBlockClickEvt)
  },
  unbindClickEvent() {
    this.parent.map.un('click', this.landBlockClickEvt)
  },
  bindHoverEvent() {
    this.parent.map.on('pointermove', this.landBlockHoverEvt)
  },
  unbindHoverEvent() {
    this.parent.map.un('pointermove', this.landBlockHoverEvt)
  },
  highLightById(objectId, zoomTo) {
    if (objectId) {
      var source = this.vectorLayer.getSource()
      var temId = this.objectId
      var setedCount = 0

      this.objectId = objectId

      source.forEachFeature((feature) => {
        var typeId = feature.get("land_object_id");
        
        if (objectId == typeId) {
          feature.setStyle(this.getHoverStyle())
          zoomTo && this.zoomToFeature(feature)
          setedCount ++
        } 
        if (temId == typeId) {
          feature.setStyle(this.getNormalStyle(this.showClassify))
          setedCount ++
        }
        if (setedCount === 2) {
          return true
        }
      })
    }
  },
  zoomToFeature(feature) {
    var zoomLevel = 14
    var extent = feature.getGeometry().getExtent()
    var center = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2]
    this.parent.map.getView().animate({zoom: zoomLevel, center: center, duration: 550, easing:  (t)=> Math.pow(t, 1.5)});
  },
  getClipFeature(vector_datas, filter_ids) {
    var gsForamt = new ol.format.GeoJSON();
    var features = [];

    var mygeom = {
        "type": "MultiPolygon",
        "coordinates": []
    }
    var len = vector_datas.length;
    for (var i = 0; i < len; i++) {
      var vector_data = vector_datas[i];
      if (filter_ids && filter_ids.length > 0) {

        if (filter_ids.indexOf(vector_data.land_object_id) >= 0) {
          var geom = JSON.parse(vector_data.geom);
          mygeom["coordinates"].push(geom["coordinates"][0])

        } else {
          continue
        }

      } else {
        var geom = JSON.parse(vector_data.geom);
        mygeom["coordinates"].push(geom["coordinates"][0])
      }
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
  }
}
