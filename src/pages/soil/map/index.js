export default {
  DETAULT_ZOOM: 4,
  setDetaultZoom(map) {
    map.getView().setZoom(this.DETAULT_ZOOM)
    map.renderSync()
  },
  showBarLayer() {
    this.badLayer.setVisible(false)
    this.goodLayer.setVisible(false)
    var charts = document.getElementsByClassName('map-chart')
    for (var i = 0; i < charts.length; i++) {
      charts[i].style.display = "block"
    }
  },
  showElementLayer() {
    this.badLayer.setVisible(true)
    this.goodLayer.setVisible(true)

    var charts = document.getElementsByClassName('map-chart')
    for (var i = 0; i < charts.length; i++) {
      charts[i].style.display = "none"
    }
  },
  addBarTomap(bars, map) {
    for (var i = 0; i < bars.length; i++) {

      var position = ol.proj.transform(bars[i].position, 'EPSG:4326', 'EPSG:3857')
      var popup = new ol.Overlay({
        element: document.getElementById(bars[i].code)
      });
      popup.setPosition(position);
      map.addOverlay(popup);
    }
    this.setDetaultZoom(map)
  },
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
  removeLayer(map) {
    if (this.badLayer) {
      map.removeLayer(this.badLayer)
      this.badLayer = null
    }
    if (this.goodLayer) {
      map.removeLayer(this.goodLayer)
      this.goodLayer = null
    }
  },
  addPoints(points, map, outof) {
    this.removeLayer(map)
    var features = this.getFeaturs(points, outof)

    this.goodLayer = addClusterLayer(features.goodFs, map)
    this.badLayer = addBadLayer(features.badFs, map)

    if (map.getView().getZoom() <= 5) {
      this.badLayer.setVisible(false)
      this.goodLayer.setVisible(false)
    }

    return this.badLayer

    function addBadLayer(features, map) {
      var source = new ol.source.Vector({
        features: features
      });

      let pointLayer = new ol.layer.Vector({
        source: source,
        style: function(feature) {
          return getBadStyle(feature.getProperties().index, 
              feature.getProperties().outof,
              feature.getProperties().element);
        }
      });

      map.addLayer(pointLayer);
      pointLayer.setZIndex(10);

      return pointLayer
    }

    function getBadStyle(index, outof, element) {
      var style = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          src: '/static/assets/img/map/soil-bad.png',
          imgSize: [22, 22]
        }),
        text: new ol.style.Text({
          font: 14 + ' Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,微软雅黑,Arial,sans-serif',
          text: element.toString().substr(0,1),
          fill: new ol.style.Fill({
            color: '#fff'
          }),
          offsetX: -1
        }),
        zIndex: index + 1
      })

      return style
    }

    function addClusterLayer(features, map) {
      var source = new ol.source.Vector({
        features: features
      });

      var clusterSource = new ol.source.Cluster({
        distance: 100,
        source: source
      });

      var clustersLayer = new ol.layer.Vector({
        source: clusterSource,
        style: function(feature) {
          var size = feature.get('features').length;
          var style
          if (size == 1) {
            style = singlePointStyle();
          } else {
            style = multifyPointStyle(size);
          }

          return style;
        }
      });
      map.addLayer(clustersLayer);
      clustersLayer.setZIndex(10);
      return clustersLayer
    }

    function singlePointStyle() {
      var style = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          src: '/static/assets/img/map/soil-good.png',
          imgSize: [22, 22]
        }),
        zIndex: 1
      });

      return style
    }

    function multifyPointStyle(size) {
      var icon = ''
      var imgSize = []
      if (size <= 9 ) {
        icon = 'soil-good-small.png'
        imgSize = [38, 38]

      } else if (size >= 10 && size < 99) {
        icon = 'soil-good-normal.png'
        imgSize = [47, 47]

      } else if (size >= 100) {
        icon = 'soil-good-large.png'
        imgSize = [59, 59]

      } 
      var style = new ol.style.Style({
        image: new ol.style.Icon(({
          anchor: [0.5, 0.5],
          src: '/static/assets/img/map/' + icon,
          imgSize: imgSize
        })),
        text: new ol.style.Text({
          font: 16 + ' Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,微软雅黑,Arial,sans-serif',
          text: size.toString(),
          fill: new ol.style.Fill({
            color: '#fff'
          }),
          offsetX: -1
        }),
        zIndex: 1
      });
      return style;
    }
  },
  getFeaturs(data, outof) {
    let _data = data

    var goodFs = []
    var badFs = []

    var len = _data.length;
    if (len > 0) {
      for (var i = 0; i < len; i++) {
        var coordinates = _data[i].lonlat;
        coordinates = ol.proj.transform(coordinates, 'EPSG:4326', 'EPSG:3857')
        var item = new ol.Feature({
          geometry: new ol.geom.Point(coordinates),
          id: _data[i].id,
          name: _data[i].name,
          station: _data[i].station,
          outof: (typeof outof === "boolean") ? outof : _data[i].outof,
          maxValue: Number(_data[i].maxValue).toFixed(0),
          coordinates: coordinates,
          index: i,
          element: _data[i].element
        });

        if (_data[i].outof === 0) {
          goodFs.push(item)

        } else {
          badFs.push(item)
        }
      }
      _data = null
      
      return {goodFs, badFs};
    }
  },
  mapEvents(parent) {
    let map = parent.map 
    
    if (!this.clickListener) {
      this.initEventHandlers(parent)
    }
    
    map.on('click', this.clickListener);
    map.on('pointerdrag', this.dragListener);
    map.on('pointerdown', this.downListener);
    map.on('pointermove', this.moveListener)
    map.getView().on('change:resolution', this.zoomListener)
  },
  mapUnbindEvents(parent) {
    let map = parent.map 
    
    map.un('click', this.clickListener);
    map.un('pointerdrag', this.dragListener);
    map.un('pointerdown', this.downListener);
    map.un('pointermove', this.moveListener)
  },
  initEventHandlers(parent) {
    let map = parent.map,
      pointLayer = parent.pointLayer,
      goodLayer = this.goodLayer,
      beginPoi = [],
      curZoomLevel = 4

    this.clickListener = (event) => {
      var pixel =  map.getEventPixel(event.originalEvent);
      map.forEachFeatureAtPixel(pixel, (feature, layer) => {
        if (layer == pointLayer) {
          var _point = map.getPixelFromCoordinate(feature.getGeometry().getCoordinates());
          
          this.featureClick(parent, _point, feature, map)
          
          return true

        } else if (layer == goodLayer) {
          var length = feature.getProperties().features.length;
          
          if (length > 1) {
            map.getView().setCenter(map.getCoordinateFromPixel(pixel));
            map.getView().setZoom(map.getView().getZoom() + 1);
            return true;

          } else {
            var _point = map.getPixelFromCoordinate(feature.getGeometry().getCoordinates());
            
            var _feature = feature.getProperties().features[0]
            
            this.featureClick(parent, _point, _feature, map)
            return true
          }
        }
      });
    }

    this.dragListener = (event) => {
      if (event.dragging) {
        var pixel =  map.getEventPixel(event.originalEvent),
          left = beginPoi[0] - pixel[0],
          top = beginPoi[1] - pixel[1]
        parent.$emit('dragPoint', {left, top})
        beginPoi = pixel
      }
    }

    this.downListener = (event) => {
      beginPoi =  map.getEventPixel(event.originalEvent)
    }

    this.moveListener = (event) => {
      if (event.dragging) {
        return;
      }
      var pixel = map.getEventPixel(event.originalEvent);
      var hit = map.hasFeatureAtPixel(pixel);
      map.getViewport().style.cursor = hit ? 'pointer' : '';
    }

    this.zoomListener = (event) => {
      var zoomLevel = map.getView().getZoom()

      if (zoomLevel <= this.DETAULT_ZOOM) {
        this.setDetaultZoom(map)
        this.showBarLayer()

      } else {
        this.showElementLayer()
      }
    }
  },
  featureClick(parent, _point, feature, map) {
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