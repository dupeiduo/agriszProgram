import {formatData} from 'plugins/utils.js'
import {dateUtil} from 'plugins/utils.js'
import configData from '../config/data.js'

import modelLib from 'agrisz-lib-model'

var modelExport = modelLib(formatData, dateUtil, configData)
export default modelExport