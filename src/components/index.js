import Vue from 'vue'
import config from 'config/env/config.env.js'
import configData from '../config/data.js'
import request from '../api/request.js'

import header from './header'
import opacity from 'agrisz-opactl'
var opacityCtl = Vue.component(opacity().name, opacity().prop)

import echart from 'agrisz-echart'
var myechart = Vue.component(echart().name, echart().prop)

import popmsg from 'agrisz-popmsg'
import 'agrisz-popmsg/index.less'
var mypopmsg = Vue.component(popmsg().name, popmsg().prop)

import map from 'agrisz-map'
import 'agrisz-map/index.less'
var _map = map(config, configData)
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

export default {myechart, header, mymap, mybutton, mydialog, mysearchpoi}
