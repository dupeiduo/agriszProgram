import cache from './cache.js'
import confUrl from 'config/env/config.env.js'
import axios from "axios"
import requestLib from 'agrisz-lib-request'

var requestExport = requestLib(cache, confUrl)
export default requestExport

