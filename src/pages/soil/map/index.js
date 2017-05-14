export default {
  addEntFeature(souPoint, entPoint, overlayInfo, map, entLayer, id) {
    this.entLayer = entLayer ? entLayer : null
    id = id ? id : new Date().getTime()
    if (this.entLayer) {
      let source = this.entLayer.getSource()
      var _feature = source.getFeatureById(id)
      if (!_feature) {
        let features = this.getEntFetatures(souPoint, entPoint, id)
        this.entLayer = this.addFeatures(features, this.entLayer, map)

        this.addOverlay(overlayInfo, id, entPoint, map)
      }
    } else {
      let features = this.getEntFetatures(souPoint, entPoint, id)
      this.entLayer = this.addFeatures(features, this.entLayer, map)

      this.addOverlay(overlayInfo, id, entPoint, map)
    }

    return this.entLayer
  },
  getEntFetatures(souPoint, entPoint, id) {
    let pFeature = new ol.Feature({
      geometry: new ol.geom.Point(entPoint),
      id: id
    })
    pFeature.setId(id)

    let lFeature = new ol.Feature({
      geometry: new ol.geom.LineString([souPoint, entPoint]),
      id: id
    })

    return [pFeature, lFeature]
  },
  addFeatures(features, entLayer, map) {
    if (!entLayer) {
      var source = new ol.source.Vector({
        features: features
      })

      entLayer = new ol.layer.Vector({
        source: source,
        style: function(feature) {
          var geom = feature.getGeometry()
          if (geom instanceof ol.geom.Point) {
            return pointStyle()
          } else if (geom instanceof ol.geom.LineString) {
            return lineStyle()
          }
        }
      })
      entLayer.setZIndex(10)
      map.addLayer(entLayer)
    } else {
      var source = entLayer.getSource()
      source.addFeatures(features)
      entLayer.setSource(source)
    }
    
    return entLayer

    function pointStyle() {
      var style = new ol.style.Style({
        image: new ol.style.Icon(({
          src: '/static/assets/img/map/enter.png'
        }))
      })

      return style
    }

    function lineStyle() {
      var style = new ol.style.Style({
         stroke: new ol.style.Stroke({
          color: '#ffcc33',
          width: 2
        })
      })

      return style
    }
  },
  addOverlay(overlay, id, entPoint, map) {
    let popup = document.createElement('div')

    let closeBtn = document.createElement('span')
    closeBtn.innerHTML = '&times;'
    closeBtn.dataset.id = id

    let title = document.createElement('h3')
    title.innerHTML = overlay.name
    title.className = 'ent-popup-h3'

    let address = document.createElement('p')
    address.className = 'ent-popup-p'
    address.innerHTML = overlay.address

    popup.id = id
    popup.className = 'ent-popup'
    popup.appendChild(closeBtn)
    popup.appendChild(title)
    popup.appendChild(address)

    document.body.appendChild(popup)

    let height = document.body.clientHeight + 130
    popup.style.left = `-116px`
    popup.style.top = `-${height}px`

    let pop = new ol.Overlay({
      element: popup,
      insertFirst: false
    });
    map.addOverlay(pop);
    pop.setPosition(entPoint)
    $clamp(address, {
      clamp: 2
    })

    closeBtn.onclick = (event) => {
      this.removeFeature(event.target.dataset.id)
    }
  },
  removeFeature(id) {
    let source = this.entLayer.getSource()

    source.forEachFeature((feature) => {
      if (feature.get('id') == id) {
        source.removeFeature(feature)
      }
    })

    let popups = document.getElementsByClassName('ent-popup') 
    for (let i = 0; i < popups.length; i++) {
      if (popups[i].id == id) {
        popups[i].parentNode.removeChild(popups[i])
      }
    }
  },
  removeAllEntLayer() {
    if (this.entLayer) {
      let source = this.entLayer.getSource()
      source.forEachFeature((feature) => {
        source.removeFeature(feature)
      })

      let popups = document.getElementsByClassName('ent-popup') 
      
      for (let i = 0; i < popups.length; i++) {
        popups[i].parentNode.removeChild(popups[i])
        i--
      }
    }
  },
  addPoints(points, map, outof) {

    var getStyle = (text, outof, zoomLevel) => {
      var img = this.getImg(outof, zoomLevel)
      return this.getIconStyle(img)
    }

    var features = turnToFeaturs(points, outof)
    var pointLayer = addPoints(features, map)

    return pointLayer

    function turnToFeaturs(data, outof) {
      let _data = data
      _data.sort(sortByoutof)
      var len = _data.length;
      if (len > 0) {
        var features = new Array(len);
        for (var i = 0; i < len; i++) {
          var coordinates = _data[i].lonlat;
          coordinates = ol.proj.transform(coordinates, 'EPSG:4326', 'EPSG:3857')
          features[i] = new ol.Feature({
            geometry: new ol.geom.Point(coordinates),
            id: _data[i].id,
            name: _data[i].name,
            station: _data[i].station,
            outof: (typeof outof === "boolean") ? outof : _data[i].outof,
            maxValue: Number(_data[i].maxValue).toFixed(0),
            coordinates: coordinates
          });
        }
        _data = null
        return features;
      }
    }

    function sortByoutof(obj1, obj2) {
      return obj1.outof - obj2.outof
    }

    function addPoints(features, map) {
      var source = new ol.source.Vector({
        features: features
      });

      let pointLayer = new ol.layer.Vector({
        source: source,
        style: function(feature) {
          return getStyle(feature.getProperties().maxValue, 
              feature.getProperties().outof, 
              map.getView().getZoom());
        }
      });

      map.addLayer(pointLayer);
      pointLayer.setZIndex(10);
      return pointLayer
    }
  },
  getIconStyle(img) {
    this.iconCache = this.iconCache ? this.iconCache : {}
    var imgObject = null
    if (this.iconCache.img) {
      imgObject = this.iconCache[img] 
    } else {
      imgObject = this.iconCache[img] = new ol.style.Style({
        image: new ol.style.Icon(({
          src: '/static/assets/img/map/' + img
        }))
      });
    }
    return imgObject
  },
  getImg (outof, zoomLevel) {
    var img = 'map-red.png'

    if (zoomLevel >= 8) {
      img = outof == 1 ? 'map-red.png' : 'map-blue.png'
    } else if (zoomLevel >= 7) {
      img = outof == 1 ? 'mon7-red.png' : 'mon7-blue.png'
    } else if (zoomLevel >= 6) {
      img = outof == 1 ? 'mon7-red.png' : 'mon-blue.png'
    } else {
      img = outof == 1 ? 'mon6-red.png' : 'mon6-blue.png'
    }
    return img
  },
  mapEvents(parent, unbind) {
    let map = parent.map,
      pointLayer = parent.pointLayer,
      beginPoi = [],
      curZoomLevel = 4
  
    var clickListener = (event) => {
      var pixel =  map.getEventPixel(event.originalEvent);
      map.forEachFeatureAtPixel(pixel, (feature, layer) => {
        if (layer == pointLayer) {
          var _point = map.getPixelFromCoordinate(feature.getGeometry().getCoordinates());
          
          var position = this.getPositionInfo(_point, map)
          if (position.doPan) {
            this.panToPoint(position.point, map)
          }
          
          _point = position.position
          var left = parseInt(_point[0]) - 50,
            top = parseInt(_point[1]) - 50,
            station = feature.getProperties().station,
            outof = feature.getProperties().outof,
            name = feature.getProperties().name,
            id = feature.getProperties().id,
            coordinates = feature.getProperties().coordinates
          
          setTimeout( () => {
            parent.$emit('featureInfo', {station, outof, name, id, left, top, coordinates})
          }, 10)
        }
      });
    }

    var dragListener = (event) => {
      if (event.dragging) {
        var pixel =  map.getEventPixel(event.originalEvent),
          left = beginPoi[0] - pixel[0],
          top = beginPoi[1] - pixel[1]
        parent.$emit('dragPoint', {left, top})
        beginPoi = pixel
      }
    }

    var downListener = (event) => {
      beginPoi =  map.getEventPixel(event.originalEvent)
    }

    var moveListener = (event) => {
      if (event.dragging) {
        return;
      }
      var pixel = map.getEventPixel(event.originalEvent);
      var hit = map.hasFeatureAtPixel(pixel);
      map.getViewport().style.cursor = hit ? 'pointer' : '';
    }

    var resetIcon = (zoomLevel, layer) => {
      if (layer !== pointLayer) {
        return
      }

      layer.getSource().forEachFeature((feature) => {
        let img = this.getImg(feature.getProperties().outof, zoomLevel),
          iconStyle = this.getIconStyle(img)
        feature.setStyle(iconStyle)
      })
    }

    var changeIcon = (zoomLevel) => {
      var result = true
      if (curZoomLevel >= 8 && zoomLevel >= 8) {
        result = false
      } else if (zoomLevel < 6 && curZoomLevel <= 6) {
        result = false
      } 
      return result
    }

    var resolutListener = (event) => {
      var zoomLevel = map.getView().getZoom()
      if (!changeIcon(zoomLevel)) {
        return
      }

      curZoomLevel = zoomLevel
      let _layer = pointLayer
      resetIcon(zoomLevel, _layer)
      _layer = null
    }

    if (unbind) {
      map.un('click', clickListener);
      map.un('pointerdrag', dragListener);
      map.un('pointerdown', downListener);
      map.un('pointermove', moveListener)
      // map.getView().un('change:resolution', resolutListener)
    }

    map.on('click', clickListener);
    map.on('pointerdrag', dragListener);
    map.on('pointerdown', downListener);
    map.on('pointermove', moveListener)
    // map.getView().on('change:resolution', resolutListener)

  },
  getPositionInfo(position, map) {
    var center = ol.proj.transform(map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326'),
      left = position[0],
      top = position[1],
      width = document.body.clientWidth,
      doPan = false

    var point = map.getPixelFromCoordinate(map.getView().getCenter())
    if (top < 180) {
      point[1] = point[1] - (180 - top)
      position[1] = position[1] + (180 - top)
      doPan = true
    }

    if (left > (width - 150)) {
      point[0] = point[0] + (left - (width - 150))
      position[0] = position[0] - (left - (width - 150))
      doPan = true
    } else if (left < 500 ) {
      point[0] = point[0] - (500 - left)
      position[0] = position[0] + (500 - left)
      doPan = true
    }

    point = map.getCoordinateFromPixel(point)
    return { point, position, doPan}
  },
  panToPoint(point, map) {
    var view = map.getView()
    view.setCenter(point)
  }
}