import cache from './cache.js'
import confUrl from 'config/env/config.env.js'

export default {
  
  dlPriceExcel: function(options) {
    var url = '?farm_product_id=' + options.fpId + '&market_id=' + options.marketId + 
              '&date_type=' + options.dateType + '&filename=' + options.fileName; 
    window.open(confUrl.phpUrl + 'market/export_price_info' + url);
  }
  
  ,downloadExcel: function(options) {
    var url = '?start=' + options.start + '&end=' + options.end + 
              '&index=' + options.index + '&area=' + options.area + '&filename=' + options.filename; 
    window.open(confUrl.phpUrl + 'analyze/exportExcel' + url);
  }
  ,newsCropList: function(){
    return cache.get.phpInCache('market/news_screening_list');
  }
  ,existMarketInProvince: function(dateType, cropId){
    return cache.get.apiInCache('market/is-exist/'+ dateType +'/'+ cropId +'/area-list');
  }
  ,cropSingleLine: function(options) {
    return cache.get.apiInCache('market/'+ options.fpId +'/select-market/'+ options.marketId + '/' + options.dateType +'/price');
  }
  ,sutResultInfo: function(options) {
    return cache.get.apiInCache('suitability/'+ options.code +'/'+ options.crop +'/result-info');
  }

  ,pointSutInfo: function(options) {
    return cache.get.apiInCache('suitability/'+ options.code +'/'+ options.crop +'/point/'+ options.lon +'/'+ options.lat +'/element-info');
  }

  ,marketPriceInfo: function(options,callback) {
    return cache.get.apiInCache('market/'+ options.areaId +'/all-markets/'+ options.cropId +'/price/compare/'+ options.dateType + '/' + options.pageIndex + '/' + options.pageCount);
  }

  ,lineAveragePrice: function(options) {
    return cache.get.apiInCache('market/'+ options.fpId +'/nationwide/'+ options.dateType +'/avg-price');
  }

  ,barAveragePrice: function(options) {
    return cache.get.apiInCache('market/'+ options.fpId +'/areas/'+ options.dateType +'/avg-price');
  }

  ,marketAreaPriv: function() {
    return cache.get.phpInCache('market/user_permissions_manager');
  }

  ,sonAreaInfo: function(options) {
    return cache.get.apiInCache('remote-sensing-object/area-crop-son/list/' + options.areaCode + '/' + options.cropId + '/' + options.source + '/' + options.startDate + '/' + options.endDate);
  }

  ,userOrigin: function() {
    return cache.get.phpInCache('market/market_info_area');
  }

  ,selfAreaInfo: function(options) {
    return cache.get.apiInCache('remote-sensing-object/area-crop-self/list/' + options.areaCode + '/' + options.cropId + '/' + options.startDate + '/' + options.endDate);
  }

  ,marketList: function(callback) {
    return cache.get.apiInCache('market/market-list/summary');
  }

  ,originArea: function(callback) {
    return cache.get.phpInCache('market/origin_area_list');
  }

  ,cropList: function(callback) {
    return cache.get.phpInCache('market/farm_product_list');
  }

  ,statistics: function(url) {
    return cache.get.apiInCache('modis-product/statistics/10/' + url);
  }

  ,homeReport: function() {
    return cache.get.phpInCache("home/getreport");
  }

  ,homeCarousel: function() {
    return cache.get.phpInCache("home/getcarousel");
  }

  ,dynamicDistribute: function(id) {
    return cache.get.apiInCache("distribute/dcp-info/batch?ids=" + id);
  }

  ,dynamicDistributeId: function(callback) {
    return cache.get.phpInCache("classification/get_user_moving_classification");
  }

  ,distributeList: function(callback) {
    return cache.get.phpInCache("classification/getUserClassificationResult");
  }

  ,distributeById: function(ids) {
    return cache.get.apiInCache('distribute/info/batch?ids=' + ids);
  }

  ,getLayerName: function (options) {
    return cache.get.apiInCache('atmos/' + options.areaCode + '/' + options.type + '/' + options.index + '/' + options.grade + '/' + options.date + '/' + options.date);
  }

  ,atmosRecent: function (options) {
    return cache.get.apiInCache('atmos/recent/' + options.areaCode + '/' + options.type + '/' + options.index + '/' + options.grade);
  }

  ,weatherFeature: function(options) {
    return cache.get.apiInCache('atmos/element/' + options.stationId + '/' + options.index + '/' + options.startDate + '/' + options.endDate);
  }

  ,weatherStations: function(showAll) {
    var show = showAll ? 0 :1;
    return cache.get.apiInCache('atmos/stations/' + show);
  }

  ,latestProduct: function(productType, code) {
    return cache.get.apiInCache('modis-product/grade/recent/10/' + productType + '/' + code);
  }

  ,existProduct: function(productType, code, startYear, endYear) {
    return cache.get.apiInCache('modis-product/grade/exist/10/' + productType + '/' + code + '/' + startYear + '/' + endYear);
  }

  // get average product data by API
  ,lineData: function(options) {
    return cache.get.apiInCache('modis-product/mean/10/' + options.url);
  }

  ,barData: function(options) {
    return cache.get.apiInCache('modis-product/grade/10/' + options.url);
  }
  
  ,areaBounds: function(code) {
    return cache.get.apiInCache("geoinfo/area/" + code);
  }

  ,cantonTree: function(){
    return cache.get.phpInCache("monitor/areaList");
  }

  ,productList: function() {
    return cache.get.phpInCache("monitor/product");
  }

  ,reportType: function(){
    return cache.get.phpInCache("report/specialList");
  }

  ,getToken: function(){
    return cache.get.phpInCache("user/get_new_child_token");
  }

  ,reportList: function(data){
    return cache.post.php("report/reportList", data);
  }


  // Post method
  ,avgPrice: function(data){
    return cache.post.api('market/farm-products/nationwide/special-time/avg-price/info', JSON.stringify(data));
  }
  ,marketNews: function(data){
    return cache.post.php('market/get_market_info_news', data);
  }
  ,getPartAreas: function(data) {
    return cache.post.api("geoinfo/arealist/all", JSON.stringify(data));
  }
  ,sectionRepor: function(data) {
    return cache.post.php("market/get_section_report", data);
  }

  ,login: function(data){
    return cache.post.php('user/login', data);
  }

  ,logout: function(){
    return cache.get.php('user/logout');
  }

  ,isLogin: function(){
    return cache.get.php('user/isLogin');
  }
  ,tdtPoi: function(options){
    var url = 'http://api.tianditu.com/apiserver/ajaxproxy?proxyReqUrl=http://map.tianditu.com/query.shtml?postStr={"lon":"'+
        options.lon +'","lat":"' + options.lat +
        '","appkey":"8a7b9aac0db21f9dd995e61a14685f05","ver":"1"}&type=geocode'
    return cache.get.tdt(url);
  }
  ,searchPois: function(field, boundsStr) {
    var url = 'http://api.tianditu.com/apiserver/ajaxproxy?proxyReqUrl=http://map.tianditu.com/query.shtml?postStr='
      +'{"keyWord":"'+ field 
      +'","level":"12","mapBound":"'+ boundsStr 
      +'","queryType":"10","start":"0","count":"10"}&type=query';
    return cache.get.tdt(url);
  }

  ,nearEnterprises: function (data) {
    return cache.post.api('company/region/position/info/batch', JSON.stringify(data)) 
  }

  ,monitorPoints: function (data) {
    return cache.post.api('soil/monitor/region/element/info/batch', JSON.stringify(data)) 
  }
  
}

