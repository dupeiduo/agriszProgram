/**
 * default environment
 */
const DEFAULT_ENV = "local";

/**
 * Configurations here
 */
var CONFIG = {
    "local": {
        baseUrl: "http://www.hotload.com/",
        apiUrl: 'http://api.agrisz.com.cn/',
        mapUrl: "http://map.agrisz.com/geoserver/map/wms/",
        resourceUrl: 'http://dev-temp.oss-cn-beijing.aliyuncs.com' + 'test/rscloud-offline/user-content/',
        phpUrl: "http://www.hotload.com/php/",
        tileMapUrl: "http://user-content.oss-cn-beijing.aliyuncs.com/rscloud/rscloud-product-tiles/",
        maxMonitorZoom: 12,
        sharedAssetServer: "http://dev-temp.oss-cn-beijing.aliyuncs.com"
    },

    "vpc-test": {
        baseUrl: "http://data.agrisz.com.cn/",
        apiUrl: 'http://api.agrisz.com.cn/',
        mapUrl: "http://map.agrisz.com.cn/geoserver/map/wms/",
        resourceUrl: 'http://resource.agrisz.cn/test/rscloud-offline/user-content/',
        phpUrl: "http://data.agrisz.com.cn/php/",
        tileMapUrl: "http://user-content.oss-cn-beijing.aliyuncs.com/rscloud/rscloud-product-tiles",
        maxMonitorZoom: 12,
        sharedAssetServer: "http://dev-temp.oss-cn-beijing.aliyuncs.com"
    },
    
    "vpc-beta": {
        baseUrl: "http://data.agrisz.com/",
        apiUrl: 'http://api.agrisz.com/',
        mapUrl: "http://map.agrisz.com/geoserver/map/wms/",
        resourceUrl: 'http://resource.agrisz.cn/rscloud-beta/user-content/',
        phpUrl: "http://data.agrisz.com/php/",
        tileMapUrl: "http://user-content.oss-cn-beijing.aliyuncs.com/rscloud/rscloud-product-tiles",
        maxMonitorZoom: 12,
        sharedAssetServer: "http://resource.agrisz.cn"
    },

    "vpc-test-v2": {
        baseUrl: "http://datav2.agrisz.com.cn/",
        apiUrl: 'http://api.agrisz.com.cn/',
        mapUrl: "http://map.agrisz.com.cn/geoserver/map/wms/",
        resourceUrl: 'http://resource.agrisz.cn/test/rscloud-offline/user-content/',
        phpUrl: "http://datav2.agrisz.com.cn/php/",
        tileMapUrl: "http://user-content.oss-cn-beijing.aliyuncs.com/rscloud/rscloud-product-tiles",
        maxMonitorZoom: 12,
        sharedAssetServer: "http://dev-temp.oss-cn-beijing.aliyuncs.com"
    },

    "vpc-beta-v2": {
        baseUrl: "http://data.agrisz.com/",
        apiUrl: 'http://api.agrisz.com/',
        mapUrl: "http://map.agrisz.com/geoserver/map/wms/",
        resourceUrl: 'http://resource.agrisz.cn/rscloud-beta/user-content/',
        phpUrl: "http://data.agrisz.com/php/",
        tileMapUrl: "http://user-content.oss-cn-beijing.aliyuncs.com/rscloud/rscloud-product-tiles",
        maxMonitorZoom: 12,
        sharedAssetServer: "http://resource.agrisz.cn"
    },

    "vpc-formal-v2": {
        baseUrl: "http://datav2.agrisz.cn/",
        apiUrl: 'http://api.agrisz.cn/',
        mapUrl: "http://map.agrisz.com/geoserver/map/wms/",
        resourceUrl: 'http://resource.agrisz.cn/rscloud/user-content/',
        phpUrl: "http://datav2.agrisz.cn/php/",
        tileMapUrl: "http://user-content.oss-cn-beijing.aliyuncs.com/rscloud/rscloud-product-tiles",
        maxMonitorZoom: 12,
        sharedAssetServer: "http://resource.agrisz.cn"
    },

    "vpc-beta2": {
        baseUrl: "http://data.agrisz.com/",
        apiUrl: 'http://api.agrisz.com/',
        mapUrl: "http://map.agrisz.com/geoserver/map/wms/",
        resourceUrl: 'http://resource.agrisz.cn/test/rscloud-offline/user-content/',
        phpUrl: "http://data.agrisz.com/php/",
        tileMapUrl: "http://user-content.oss-cn-beijing.aliyuncs.com/rscloud/rscloud-product-tiles",
        maxMonitorZoom: 12,
        sharedAssetServer: "http://resource.agrisz.cn"
    },

    "offline-test": {
        baseUrl: "http://data.agrisz.cn/",
        apiUrl: 'http://api.agrisz.cn/',
        mapUrl: "http://map.agrisz.cn/geoserver/map/wms/",
        resourceUrl: 'http://resource.agrisz.cn/test/rscloud-offline/user-content/',
        phpUrl: "http://192.168.1.88:8002/php/",
        tileMapUrl: "http://user-content.oss-cn-beijing.aliyuncs.com/rscloud/rscloud-product-tiles",
        maxMonitorZoom: 12,
        sharedAssetServer: "http://resource.agrisz.cn"
    },


    // add other environments here...

};

function ensureLastSlash(url) {
    if (!url || !url.charAt) {
        return url;
    }

    if (url.charAt(url.length - 1) != '/') {
        url += '/';
    }

    return url;
}
    
function clearLastSlash(url) {
    if (!url || !url.charAt) {
        return url;
    }

    if (url.charAt(url.length - 1) == '/') {
        url = url.substring(0, url.length - 1);
    }

    return url;
}

function formatUrls(obj, withSlashs, noSlashs) {
    if(!obj) {
        return;
    }

    for(var k in obj) {
        var holder = obj[k];

        if(!holder) {
            continue;
        }

        // ensure slashs
        if(withSlashs && withSlashs.forEach) {
            withSlashs.forEach(keyName => {
                var url = holder[keyName];
                if(Object.prototype.toString.call(url) === '[object String]') {
                    holder[keyName] = ensureLastSlash(url);
                }
            })
        }

        // clear slashs
        if(noSlashs && noSlashs.forEach) {
            noSlashs.forEach(keyName => {
                var url = holder[keyName];
                if(Object.prototype.toString.call(url) === '[object String]') {
                    holder[keyName] = clearLastSlash(url);
                }
            })
        }
    }

    return obj;
}

module.exports = {
    CONFIG: formatUrls(
                    CONFIG, 
                    ['baseUrl', 'apiUrl', 'mapUrl', 'resourceUrl', 'phpUrl', 'tileMapUrl'],
                    []),
    DEFAULT_ENV: DEFAULT_ENV
};
