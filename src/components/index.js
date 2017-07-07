import Vue from 'vue'
import config from 'config/env/config.env.js'
import configData from '../config/data.js'
import request from '../api/request.js'
import store from '../store'
window.vueBus = new Vue()

import header from './newheader'
import opacity from 'agrisz-opactl'
var opacityCtl = Vue.component(opacity().name, opacity().prop)

import echart from 'agrisz-echart'
var myechart = Vue.component(echart().name, echart().prop)

import popmsg from 'agrisz-popmsg'
import 'agrisz-popmsg/index.less'
var _popmsg = popmsg(store)
var mypopmsg = Vue.component(_popmsg.name, _popmsg.prop)

import weather from 'agrisz-weather'
import 'agrisz-weather/index.less'
var _weather = weather(request, vueBus)
var myweather = Vue.component(_weather.name, _weather.prop)

import map from 'agrisz-map'
import 'agrisz-map/index.less'
var _map = map(config, configData, request, vueBus, store)
var mymap = Vue.component(_map.name, _map.prop)

import button from 'agrisz-button'
import 'agrisz-button/index.less'
var mybutton = Vue.component(button().name, button().prop)

import dialog from 'agrisz-dialog'
import 'agrisz-dialog/index.less'
var mydialog = Vue.component(dialog().name, dialog().prop)

import searchpoi from 'agrisz-searchpoi'
import 'agrisz-searchpoi/index.less'
var _searchpoi = searchpoi(request)
var mysearchpoi = Vue.component(_searchpoi.name, _searchpoi.prop)

import photozoom from 'agrisz-photozoom'
import 'agrisz-photozoom/index.less'
var myphotozoom = Vue.component(photozoom().name, photozoom().prop)

export default {myechart, header, myweather, mymap, mybutton, mydialog, mysearchpoi,myphotozoom}
