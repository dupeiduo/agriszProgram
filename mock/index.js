
module.exports = {
    '/php/': {
        target: 'http://data.agrisz.com/php', 
        changeOrigin: true,
        pathRewrite: {
            '^/php' : '/'
        }
    },
    '/markerdata': function (req, res) {
        res.send({
          "status" : 0, 
          "data" :                              
          {
            "2016" : 
            {
              "01" :  
               [
                  {
                    "marker_id": "1", 
                    "title": "标题",  //标题名称
                    "color": "#666",  //颜色
                    "geom": `{"type":"Polygon","coordinates":[[[12458600.435890887,3817626.0590919717],[12158976.894854935,3376513.623677933],[12833129.862185825,3676137.164713884],[12458600.435890887,3817626.0590919717]]]}`,
                    "desc": "1感兴趣区域边界的geojson, 通过openlayer自带的方法 (new ol.format.GeoJSON()).writeGeometry(geometry) 生成的",   //描述
                    "status": 1 
                  },
                ],
              "02" :  
               [
                  {
                    "marker_id": "2", 
                    "title": "标题2",  //标题名称
                    "color": "#666",  //颜色
                    "geom": `{"type":"Polygon","coordinates":[[[12687325.877095498,3821746.880127755],[13019979.824192584,3870666.5782302683],[12843868.911023539,3596716.2688561967],[12687325.877095498,3821746.880127755]]]}`,
                    "desc": "2感兴趣区域边界的geojson, 通过openlayer自带的方法 (new ol.format.GeoJSON()).writeGeometry(geometry) 生成的",   //描述
                    "status": 1 
                  },
                ],
            },
          }
        })
    },
}
