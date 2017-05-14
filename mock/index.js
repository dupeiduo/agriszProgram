
module.exports = {
    '/php/': {
        target: 'http://data.agrisz.com.cn/php', 
        changeOrigin: true,
        pathRewrite: {
            '^/php' : '/'
        }
    },
    '/realtime': function (req, res) {
        res.send({
            "status":"ok",
            "lang":"zh_CN",  //目前只支持简体中文（zh_CN、zh_SG）、繁体中文（zh_TW、zh_HK），英语（en_US、en_GB）在测试中
            "server_time":1443418222,
            "tzshift":28800, //时区的偏移秒数，如东八区就是 28800 秒，使用秒是为了支持像尼泊尔这样的差 5 小时 45 分钟的地区，它们有非整齐的偏移量
            "location":[
                25.1552, //纬度
                121.6544 //经度
            ],
            "unit":"metric", //目前只支持米制（metric）和科学计量法（SI），英制还有待开发
            "result":{
                "status":"ok",
                "temperature":28.0,  //温度
                "skycon":"CLEAR_DAY",  //天气概况
                "pm25": 11,       //pm25值   在新的api中增加的字段
                "cloudrate":0.51,  // 云量
                "humidity":0.92,  //相对湿度
                "precipitation":{  //降水
                     "nearest":{ //最近的降水带 //用户补充：nearest这段有时候没有
                         "status":"ok",
                         "distance":0.77, //距离
                         "intensity":0.3125 //角度
                     },
                    "local":{ //本地的降水
                        "status":"ok",
                        "intensity": 0, //降水强度
                        "datasource":"radar" //数据源
                    }
                },
                "wind":{ //风
                    "direction":25.33, //风向。单位是度。正北方向为0度，顺时针增加到360度。
                    "speed":83.3 //风速，米制下是公里每小时
                }
            }
        });
    },
    '/forecast': function (req, res) {
        res.send(
            {
                "status":"ok",
                "lang":"zh_CN", //目前只支持简体中文（zh_CN、zh_SG）、繁体中文（zh_TW、zh_HK），英语（en_US、en_GB）在测试中
                "server_time":1443418212,
                "tzshift":28800, //时区的偏移秒数，如东八区就是 28800 秒，使用秒是为了支持像尼泊尔这样的差 5 小时 45 分钟的地区，它们有非整齐的偏移量
                "location":[
                    25.1552, //纬度
                    121.6544 //经度
                ],
                "unit":"metric", //目前只支持米制（metric）和科学计量法（SI），英制还有待开发
                "result":{
                    "status":"ok",
                    "hourly":{ //小时级预报，涵盖从当前开始的未来 48 小时
                        "status":"ok",
                        "pm25":[ //pm25
                            {
                                "value":8.0,
                                "datetime":"2017-04-17 13:00"
                            },
                            {
                                "value":8.0,
                                "datetime":"2017-04-17 14:00"
                            },
                            {
                                "value":7.0,
                                "datetime":"2017-04-17 15:00"
                            },
                            {
                                "value":3.0,
                                "datetime":"2017-04-17 16:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-17 17:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-17 18:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-17 19:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-17 20:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-17 21:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-17 22:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-17 23:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 00:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 01:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 02:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 03:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 04:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 05:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 06:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 07:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 08:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 09:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 10:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 11:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 12:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 13:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 14:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 15:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 16:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 17:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 18:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 19:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 20:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 21:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 22:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-18 23:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-19 00:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-19 01:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-19 02:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-19 03:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-19 04:00"
                            },
                            {
                                "value":-0.0,
                                "datetime":"2017-04-19 05:00"
                            },
                            {
                                "value":3.0,
                                "datetime":"2017-04-19 06:00"
                            },
                            {
                                "value":8.0,
                                "datetime":"2017-04-19 07:00"
                            },
                            {
                                "value":14.0,
                                "datetime":"2017-04-19 08:00"
                            },
                            {
                                "value":19.0,
                                "datetime":"2017-04-19 09:00"
                            },
                            {
                                "value":24.0,
                                "datetime":"2017-04-19 10:00"
                            },
                            {
                                "value":29.0,
                                "datetime":"2017-04-19 11:00"
                            },
                            {
                                "value":33.0,
                                "datetime":"2017-04-19 12:00"
                            }
                        ],
                        //自然语言描述，目前支持简体、繁体中文，英语版待测试
                        "description":"\u66b4\u96e8\u6e10\u5927\uff0c\u4eca\u5929\u665a\u95f421\u70b9\u949f\u540e\u5927\u96e8\uff0c\u5176\u540e\u9634",
                        "skycon":[  // 天气概况
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-17 13:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-17 14:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-17 15:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-17 16:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-17 17:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-17 18:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-17 19:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-17 20:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-17 21:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-17 22:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-17 23:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-18 00:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-18 01:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-18 02:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-18 03:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-18 04:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-18 05:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-18 06:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-18 07:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-18 08:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-18 09:00"
                            },
                            {
                                "value":"RAIN",
                                "datetime":"2017-04-18 10:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-18 11:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-18 12:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-18 13:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-18 14:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-18 15:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-18 16:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-18 17:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-18 18:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-18 19:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-18 20:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-18 21:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-18 22:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-18 23:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-19 00:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-19 01:00"
                            },
                            {
                                "value":"PARTLY_CLOUDY_NIGHT",
                                "datetime":"2017-04-19 02:00"
                            },
                            {
                                "value":"PARTLY_CLOUDY_NIGHT",
                                "datetime":"2017-04-19 03:00"
                            },
                            {
                                "value":"PARTLY_CLOUDY_NIGHT",
                                "datetime":"2017-04-19 04:00"
                            },
                            {
                                "value":"PARTLY_CLOUDY_NIGHT",
                                "datetime":"2017-04-19 05:00"
                            },
                            {
                                "value":"PARTLY_CLOUDY_NIGHT",
                                "datetime":"2017-04-19 06:00"
                            },
                            {
                                "value":"PARTLY_CLOUDY_NIGHT",
                                "datetime":"2017-04-19 07:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-19 08:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-19 09:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-19 10:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-19 11:00"
                            },
                            {
                                "value":"CLOUDY",
                                "datetime":"2017-04-19 12:00"
                            }
                        ],
                        "cloudrate":[ // 云量
                            {
                                "value":1.0,
                                "datetime":"2017-04-17 13:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-17 14:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-17 15:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-17 16:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-17 17:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-17 18:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-17 19:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-17 20:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-17 21:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-17 22:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-17 23:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-18 00:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-18 01:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-18 02:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-18 03:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-18 04:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-18 05:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-18 06:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-18 07:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-18 08:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-18 09:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-18 10:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-18 11:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-18 12:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-18 13:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-18 14:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-18 15:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-18 16:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-18 17:00"
                            },
                            {
                                "value":1.0,
                                "datetime":"2017-04-18 18:00"
                            },
                            {
                                "value":0.99,
                                "datetime":"2017-04-18 19:00"
                            },
                            {
                                "value":0.98,
                                "datetime":"2017-04-18 20:00"
                            },
                            {
                                "value":0.98,
                                "datetime":"2017-04-18 21:00"
                            },
                            {
                                "value":0.97,
                                "datetime":"2017-04-18 22:00"
                            },
                            {
                                "value":0.95,
                                "datetime":"2017-04-18 23:00"
                            },
                            {
                                "value":0.93,
                                "datetime":"2017-04-19 00:00"
                            },
                            {
                                "value":0.9,
                                "datetime":"2017-04-19 01:00"
                            },
                            {
                                "value":0.89,
                                "datetime":"2017-04-19 02:00"
                            },
                            {
                                "value":0.89,
                                "datetime":"2017-04-19 03:00"
                            },
                            {
                                "value":0.89,
                                "datetime":"2017-04-19 04:00"
                            },
                            {
                                "value":0.91,
                                "datetime":"2017-04-19 05:00"
                            },
                            {
                                "value":0.92,
                                "datetime":"2017-04-19 06:00"
                            },
                            {
                                "value":0.93,
                                "datetime":"2017-04-19 07:00"
                            },
                            {
                                "value":0.94,
                                "datetime":"2017-04-19 08:00"
                            },
                            {
                                "value":0.96,
                                "datetime":"2017-04-19 09:00"
                            },
                            {
                                "value":0.97,
                                "datetime":"2017-04-19 10:00"
                            },
                            {
                                "value":0.98,
                                "datetime":"2017-04-19 11:00"
                            },
                            {
                                "value":0.99,
                                "datetime":"2017-04-19 12:00"
                            }
                        ],
                        "aqi":[ // AQI
                            {
                                "value":33.0,
                                "datetime":"2017-04-17 13:00"
                            },
                            {
                                "value":33.0,
                                "datetime":"2017-04-17 14:00"
                            },
                            {
                                "value":33.0,
                                "datetime":"2017-04-17 15:00"
                            },
                            {
                                "value":28.0,
                                "datetime":"2017-04-17 16:00"
                            },
                            {
                                "value":25.0,
                                "datetime":"2017-04-17 17:00"
                            },
                            {
                                "value":25.0,
                                "datetime":"2017-04-17 18:00"
                            },
                            {
                                "value":25.0,
                                "datetime":"2017-04-17 19:00"
                            },
                            {
                                "value":25.0,
                                "datetime":"2017-04-17 20:00"
                            },
                            {
                                "value":26.0,
                                "datetime":"2017-04-17 21:00"
                            },
                            {
                                "value":27.0,
                                "datetime":"2017-04-17 22:00"
                            },
                            {
                                "value":27.0,
                                "datetime":"2017-04-17 23:00"
                            },
                            {
                                "value":26.0,
                                "datetime":"2017-04-18 00:00"
                            },
                            {
                                "value":26.0,
                                "datetime":"2017-04-18 01:00"
                            },
                            {
                                "value":26.0,
                                "datetime":"2017-04-18 02:00"
                            },
                            {
                                "value":26.0,
                                "datetime":"2017-04-18 03:00"
                            },
                            {
                                "value":26.0,
                                "datetime":"2017-04-18 04:00"
                            },
                            {
                                "value":26.0,
                                "datetime":"2017-04-18 05:00"
                            },
                            {
                                "value":26.0,
                                "datetime":"2017-04-18 06:00"
                            },
                            {
                                "value":26.0,
                                "datetime":"2017-04-18 07:00"
                            },
                            {
                                "value":26.0,
                                "datetime":"2017-04-18 08:00"
                            },
                            {
                                "value":27.0,
                                "datetime":"2017-04-18 09:00"
                            },
                            {
                                "value":27.0,
                                "datetime":"2017-04-18 10:00"
                            },
                            {
                                "value":28.0,
                                "datetime":"2017-04-18 11:00"
                            },
                            {
                                "value":28.0,
                                "datetime":"2017-04-18 12:00"
                            },
                            {
                                "value":28.0,
                                "datetime":"2017-04-18 13:00"
                            },
                            {
                                "value":27.0,
                                "datetime":"2017-04-18 14:00"
                            },
                            {
                                "value":27.0,
                                "datetime":"2017-04-18 15:00"
                            },
                            {
                                "value":27.0,
                                "datetime":"2017-04-18 16:00"
                            },
                            {
                                "value":27.0,
                                "datetime":"2017-04-18 17:00"
                            },
                            {
                                "value":27.0,
                                "datetime":"2017-04-18 18:00"
                            },
                            {
                                "value":26.0,
                                "datetime":"2017-04-18 19:00"
                            },
                            {
                                "value":26.0,
                                "datetime":"2017-04-18 20:00"
                            },
                            {
                                "value":26.0,
                                "datetime":"2017-04-18 21:00"
                            },
                            {
                                "value":26.0,
                                "datetime":"2017-04-18 22:00"
                            },
                            {
                                "value":26.0,
                                "datetime":"2017-04-18 23:00"
                            },
                            {
                                "value":26.0,
                                "datetime":"2017-04-19 00:00"
                            },
                            {
                                "value":26.0,
                                "datetime":"2017-04-19 01:00"
                            },
                            {
                                "value":26.0,
                                "datetime":"2017-04-19 02:00"
                            },
                            {
                                "value":25.0,
                                "datetime":"2017-04-19 03:00"
                            },
                            {
                                "value":25.0,
                                "datetime":"2017-04-19 04:00"
                            },
                            {
                                "value":25.0,
                                "datetime":"2017-04-19 05:00"
                            },
                            {
                                "value":28.0,
                                "datetime":"2017-04-19 06:00"
                            },
                            {
                                "value":34.0,
                                "datetime":"2017-04-19 07:00"
                            },
                            {
                                "value":40.0,
                                "datetime":"2017-04-19 08:00"
                            },
                            {
                                "value":46.0,
                                "datetime":"2017-04-19 09:00"
                            },
                            {
                                "value":51.0,
                                "datetime":"2017-04-19 10:00"
                            },
                            {
                                "value":56.0,
                                "datetime":"2017-04-19 11:00"
                            },
                            {
                                "value":60.0,
                                "datetime":"2017-04-19 12:00"
                            }
                        ],
                        "humidity":[ // 相对湿度
                            {
                                "value":0.92,
                                "datetime":"2017-04-17 13:00"
                            },
                            {
                                "value":0.9,
                                "datetime":"2017-04-17 14:00"
                            },
                            {
                                "value":0.86,
                                "datetime":"2017-04-17 15:00"
                            },
                            {
                                "value":0.82,
                                "datetime":"2017-04-17 16:00"
                            },
                            {
                                "value":0.8,
                                "datetime":"2017-04-17 17:00"
                            },
                            {
                                "value":0.81,
                                "datetime":"2017-04-17 18:00"
                            },
                            {
                                "value":0.84,
                                "datetime":"2017-04-17 19:00"
                            },
                            {
                                "value":0.87,
                                "datetime":"2017-04-17 20:00"
                            },
                            {
                                "value":0.87,
                                "datetime":"2017-04-17 21:00"
                            },
                            {
                                "value":0.86,
                                "datetime":"2017-04-17 22:00"
                            },
                            {
                                "value":0.84,
                                "datetime":"2017-04-17 23:00"
                            },
                            {
                                "value":0.83,
                                "datetime":"2017-04-18 00:00"
                            },
                            {
                                "value":0.84,
                                "datetime":"2017-04-18 01:00"
                            },
                            {
                                "value":0.84,
                                "datetime":"2017-04-18 02:00"
                            },
                            {
                                "value":0.85,
                                "datetime":"2017-04-18 03:00"
                            },
                            {
                                "value":0.85,
                                "datetime":"2017-04-18 04:00"
                            },
                            {
                                "value":0.85,
                                "datetime":"2017-04-18 05:00"
                            },
                            {
                                "value":0.86,
                                "datetime":"2017-04-18 06:00"
                            },
                            {
                                "value":0.86,
                                "datetime":"2017-04-18 07:00"
                            },
                            {
                                "value":0.85,
                                "datetime":"2017-04-18 08:00"
                            },
                            {
                                "value":0.84,
                                "datetime":"2017-04-18 09:00"
                            },
                            {
                                "value":0.81,
                                "datetime":"2017-04-18 10:00"
                            },
                            {
                                "value":0.78,
                                "datetime":"2017-04-18 11:00"
                            },
                            {
                                "value":0.76,
                                "datetime":"2017-04-18 12:00"
                            },
                            {
                                "value":0.74,
                                "datetime":"2017-04-18 13:00"
                            },
                            {
                                "value":0.74,
                                "datetime":"2017-04-18 14:00"
                            },
                            {
                                "value":0.75,
                                "datetime":"2017-04-18 15:00"
                            },
                            {
                                "value":0.77,
                                "datetime":"2017-04-18 16:00"
                            },
                            {
                                "value":0.79,
                                "datetime":"2017-04-18 17:00"
                            },
                            {
                                "value":0.81,
                                "datetime":"2017-04-18 18:00"
                            },
                            {
                                "value":0.84,
                                "datetime":"2017-04-18 19:00"
                            },
                            {
                                "value":0.86,
                                "datetime":"2017-04-18 20:00"
                            },
                            {
                                "value":0.87,
                                "datetime":"2017-04-18 21:00"
                            },
                            {
                                "value":0.88,
                                "datetime":"2017-04-18 22:00"
                            },
                            {
                                "value":0.88,
                                "datetime":"2017-04-18 23:00"
                            },
                            {
                                "value":0.88,
                                "datetime":"2017-04-19 00:00"
                            },
                            {
                                "value":0.87,
                                "datetime":"2017-04-19 01:00"
                            },
                            {
                                "value":0.87,
                                "datetime":"2017-04-19 02:00"
                            },
                            {
                                "value":0.86,
                                "datetime":"2017-04-19 03:00"
                            },
                            {
                                "value":0.85,
                                "datetime":"2017-04-19 04:00"
                            },
                            {
                                "value":0.84,
                                "datetime":"2017-04-19 05:00"
                            },
                            {
                                "value":0.82,
                                "datetime":"2017-04-19 06:00"
                            },
                            {
                                "value":0.8,
                                "datetime":"2017-04-19 07:00"
                            },
                            {
                                "value":0.78,
                                "datetime":"2017-04-19 08:00"
                            },
                            {
                                "value":0.75,
                                "datetime":"2017-04-19 09:00"
                            },
                            {
                                "value":0.72,
                                "datetime":"2017-04-19 10:00"
                            },
                            {
                                "value":0.7,
                                "datetime":"2017-04-19 11:00"
                            },
                            {
                                "value":0.69,
                                "datetime":"2017-04-19 12:00"
                            }
                        ],
                        "precipitation":[ // 降雨强度   0.05 ~ 0.9 小雨 0.9 ~ 2.87 中雨 >2.87大雨
                            {
                                "value":0.5902,
                                "datetime":"2017-04-17 13:00"
                            },
                            {
                                "value":0.5811,
                                "datetime":"2017-04-17 14:00"
                            },
                            {
                                "value":6.3074,
                                "datetime":"2017-04-17 15:00"
                            },
                            {
                                "value":6.1533,
                                "datetime":"2017-04-17 16:00"
                            },
                            {
                                "value":6.516,
                                "datetime":"2017-04-17 17:00"
                            },
                            {
                                "value":7.7872,
                                "datetime":"2017-04-17 18:00"
                            },
                            {
                                "value":9.179,
                                "datetime":"2017-04-17 19:00"
                            },
                            {
                                "value":9.6091,
                                "datetime":"2017-04-17 20:00"
                            },
                            {
                                "value":8.3625,
                                "datetime":"2017-04-17 21:00"
                            },
                            {
                                "value":6.1934,
                                "datetime":"2017-04-17 22:00"
                            },
                            {
                                "value":4.2239,
                                "datetime":"2017-04-17 23:00"
                            },
                            {
                                "value":3.2836,
                                "datetime":"2017-04-18 00:00"
                            },
                            {
                                "value":3.034,
                                "datetime":"2017-04-18 01:00"
                            },
                            {
                                "value":2.8445,
                                "datetime":"2017-04-18 02:00"
                            },
                            {
                                "value":2.2507,
                                "datetime":"2017-04-18 03:00"
                            },
                            {
                                "value":1.4529,
                                "datetime":"2017-04-18 04:00"
                            },
                            {
                                "value":0.8175,
                                "datetime":"2017-04-18 05:00"
                            },
                            {
                                "value":0.6051,
                                "datetime":"2017-04-18 06:00"
                            },
                            {
                                "value":0.6534,
                                "datetime":"2017-04-18 07:00"
                            },
                            {
                                "value":0.6944,
                                "datetime":"2017-04-18 08:00"
                            },
                            {
                                "value":0.531,
                                "datetime":"2017-04-18 09:00"
                            },
                            {
                                "value":0.2498,
                                "datetime":"2017-04-18 10:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-18 11:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-18 12:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-18 13:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-18 14:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-18 15:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-18 16:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-18 17:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-18 18:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-18 19:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-18 20:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-18 21:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-18 22:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-18 23:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-19 00:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-19 01:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-19 02:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-19 03:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-19 04:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-19 05:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-19 06:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-19 07:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-19 08:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-19 09:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-19 10:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-19 11:00"
                            },
                            {
                                "value":0.0,
                                "datetime":"2017-04-19 12:00"
                            }
                        ],
                        "wind":[ // 风
                            {
                                "direction":23.09,
                                "speed":80.66,
                                "datetime":"2017-04-17 13:00"
                            },
                            {
                                "direction":29.65,
                                "speed":84.26,
                                "datetime":"2017-04-17 14:00"
                            },
                            {
                                "direction":45.83,
                                "speed":84.38,
                                "datetime":"2017-04-17 15:00"
                            },
                            {
                                "direction":65.63,
                                "speed":90.21,
                                "datetime":"2017-04-17 16:00"
                            },
                            {
                                "direction":79.94,
                                "speed":99.98,
                                "datetime":"2017-04-17 17:00"
                            },
                            {
                                "direction":86.6,
                                "speed":103.67,
                                "datetime":"2017-04-17 18:00"
                            },
                            {
                                "direction":89.83,
                                "speed":100.6,
                                "datetime":"2017-04-17 19:00"
                            },
                            {
                                "direction":93.26,
                                "speed":95.57,
                                "datetime":"2017-04-17 20:00"
                            },
                            {
                                "direction":99.25,
                                "speed":93.52,
                                "datetime":"2017-04-17 21:00"
                            },
                            {
                                "direction":106.71,
                                "speed":94.64,
                                "datetime":"2017-04-17 22:00"
                            },
                            {
                                "direction":113.91,
                                "speed":96.91,
                                "datetime":"2017-04-17 23:00"
                            },
                            {
                                "direction":120.02,
                                "speed":97.84,
                                "datetime":"2017-04-18 00:00"
                            },
                            {
                                "direction":124.93,
                                "speed":96.62,
                                "datetime":"2017-04-18 01:00"
                            },
                            {
                                "direction":128.49,
                                "speed":92.93,
                                "datetime":"2017-04-18 02:00"
                            },
                            {
                                "direction":130.57,
                                "speed":86.72,
                                "datetime":"2017-04-18 03:00"
                            },
                            {
                                "direction":131.69,
                                "speed":79.14,
                                "datetime":"2017-04-18 04:00"
                            },
                            {
                                "direction":132.56,
                                "speed":71.79,
                                "datetime":"2017-04-18 05:00"
                            },
                            {
                                "direction":133.92,
                                "speed":65.93,
                                "datetime":"2017-04-18 06:00"
                            },
                            {
                                "direction":135.82,
                                "speed":60.99,
                                "datetime":"2017-04-18 07:00"
                            },
                            {
                                "direction":138.14,
                                "speed":55.96,
                                "datetime":"2017-04-18 08:00"
                            },
                            {
                                "direction":140.84,
                                "speed":50.07,
                                "datetime":"2017-04-18 09:00"
                            },
                            {
                                "direction":143.67,
                                "speed":43.65,
                                "datetime":"2017-04-18 10:00"
                            },
                            {
                                "direction":145.99,
                                "speed":37.24,
                                "datetime":"2017-04-18 11:00"
                            },
                            {
                                "direction":146.87,
                                "speed":31.28,
                                "datetime":"2017-04-18 12:00"
                            },
                            {
                                "direction":146.18,
                                "speed":26.12,
                                "datetime":"2017-04-18 13:00"
                            },
                            {
                                "direction":144.51,
                                "speed":22.13,
                                "datetime":"2017-04-18 14:00"
                            },
                            {
                                "direction":143.11,
                                "speed":19.54,
                                "datetime":"2017-04-18 15:00"
                            },
                            {
                                "direction":142.53,
                                "speed":18.05,
                                "datetime":"2017-04-18 16:00"
                            },
                            {
                                "direction":142.87,
                                "speed":17.23,
                                "datetime":"2017-04-18 17:00"
                            },
                            {
                                "direction":143.91,
                                "speed":16.72,
                                "datetime":"2017-04-18 18:00"
                            },
                            {
                                "direction":145.01,
                                "speed":16.34,
                                "datetime":"2017-04-18 19:00"
                            },
                            {
                                "direction":145.36,
                                "speed":15.95,
                                "datetime":"2017-04-18 20:00"
                            },
                            {
                                "direction":144.5,
                                "speed":15.43,
                                "datetime":"2017-04-18 21:00"
                            },
                            {
                                "direction":143.4,
                                "speed":14.73,
                                "datetime":"2017-04-18 22:00"
                            },
                            {
                                "direction":143.63,
                                "speed":13.8,
                                "datetime":"2017-04-18 23:00"
                            },
                            {
                                "direction":146.65,
                                "speed":12.64,
                                "datetime":"2017-04-19 00:00"
                            },
                            {
                                "direction":151.88,
                                "speed":11.39,
                                "datetime":"2017-04-19 01:00"
                            },
                            {
                                "direction":157.62,
                                "speed":10.17,
                                "datetime":"2017-04-19 02:00"
                            },
                            {
                                "direction":161.93,
                                "speed":8.96,
                                "datetime":"2017-04-19 03:00"
                            },
                            {
                                "direction":165.03,
                                "speed":7.95,
                                "datetime":"2017-04-19 04:00"
                            },
                            {
                                "direction":167.9,
                                "speed":7.39,
                                "datetime":"2017-04-19 05:00"
                            },
                            {
                                "direction":171.13,
                                "speed":7.47,
                                "datetime":"2017-04-19 06:00"
                            },
                            {
                                "direction":173.88,
                                "speed":7.86,
                                "datetime":"2017-04-19 07:00"
                            },
                            {
                                "direction":175.68,
                                "speed":8.11,
                                "datetime":"2017-04-19 08:00"
                            },
                            {
                                "direction":176.8,
                                "speed":7.8,
                                "datetime":"2017-04-19 09:00"
                            },
                            {
                                "direction":178.65,
                                "speed":6.86,
                                "datetime":"2017-04-19 10:00"
                            },
                            {
                                "direction":184.3,
                                "speed":5.31,
                                "datetime":"2017-04-19 11:00"
                            },
                            {
                                "direction":202.11,
                                "speed":3.44,
                                "datetime":"2017-04-19 12:00"
                            }
                        ],
                        "temperature":[ // 温度
                            {
                                "value":35.11,
                                "datetime":"2017-04-17 13:00"
                            },
                            {
                                "value":30.32,
                                "datetime":"2017-04-17 14:00"
                            },
                            {
                                "value":30.33,
                                "datetime":"2017-04-17 15:00"
                            },
                            {
                                "value":25.3,
                                "datetime":"2017-04-17 16:00"
                            },
                            {
                                "value":25.5,
                                "datetime":"2017-04-17 17:00"
                            },
                            {
                                "value":25.19,
                                "datetime":"2017-04-17 18:00"
                            },
                            {
                                "value":24.9,
                                "datetime":"2017-04-17 19:00"
                            },
                            {
                                "value":23.28,
                                "datetime":"2017-04-17 20:00"
                            },
                            {
                                "value":22.59,
                                "datetime":"2017-04-17 21:00"
                            },
                            {
                                "value":21.54,
                                "datetime":"2017-04-17 22:00"
                            },
                            {
                                "value":20.74,
                                "datetime":"2017-04-17 23:00"
                            },
                            {
                                "value":19.21,
                                "datetime":"2017-04-18 00:00"
                            },
                            {
                                "value":25.69,
                                "datetime":"2017-04-18 01:00"
                            },
                            {
                                "value":25.59,
                                "datetime":"2017-04-18 02:00"
                            },
                            {
                                "value":25.93,
                                "datetime":"2017-04-18 03:00"
                            },
                            {
                                "value":26.08,
                                "datetime":"2017-04-18 04:00"
                            },
                            {
                                "value":26.31,
                                "datetime":"2017-04-18 05:00"
                            },
                            {
                                "value":26.35,
                                "datetime":"2017-04-18 06:00"
                            },
                            {
                                "value":26.39,
                                "datetime":"2017-04-18 07:00"
                            },
                            {
                                "value":26.18,
                                "datetime":"2017-04-18 08:00"
                            },
                            {
                                "value":26.67,
                                "datetime":"2017-04-18 09:00"
                            },
                            {
                                "value":27.25,
                                "datetime":"2017-04-18 10:00"
                            },
                            {
                                "value":27.5,
                                "datetime":"2017-04-18 11:00"
                            },
                            {
                                "value":27.59,
                                "datetime":"2017-04-18 12:00"
                            },
                            {
                                "value":27.53,
                                "datetime":"2017-04-18 13:00"
                            },
                            {
                                "value":27.38,
                                "datetime":"2017-04-18 14:00"
                            },
                            {
                                "value":27.35,
                                "datetime":"2017-04-18 15:00"
                            },
                            {
                                "value":27.17,
                                "datetime":"2017-04-18 16:00"
                            },
                            {
                                "value":26.87,
                                "datetime":"2017-04-18 17:00"
                            },
                            {
                                "value":26.51,
                                "datetime":"2017-04-18 18:00"
                            },
                            {
                                "value":26.18,
                                "datetime":"2017-04-18 19:00"
                            },
                            {
                                "value":25.93,
                                "datetime":"2017-04-18 20:00"
                            },
                            {
                                "value":25.75,
                                "datetime":"2017-04-18 21:00"
                            },
                            {
                                "value":25.68,
                                "datetime":"2017-04-18 22:00"
                            },
                            {
                                "value":25.73,
                                "datetime":"2017-04-18 23:00"
                            },
                            {
                                "value":25.77,
                                "datetime":"2017-04-19 00:00"
                            },
                            {
                                "value":25.69,
                                "datetime":"2017-04-19 01:00"
                            },
                            {
                                "value":25.53,
                                "datetime":"2017-04-19 02:00"
                            },
                            {
                                "value":25.35,
                                "datetime":"2017-04-19 03:00"
                            },
                            {
                                "value":25.23,
                                "datetime":"2017-04-19 04:00"
                            },
                            {
                                "value":25.23,
                                "datetime":"2017-04-19 05:00"
                            },
                            {
                                "value":25.39,
                                "datetime":"2017-04-19 06:00"
                            },
                            {
                                "value":25.68,
                                "datetime":"2017-04-19 07:00"
                            },
                            {
                                "value":26.23,
                                "datetime":"2017-04-19 08:00"
                            },
                            {
                                "value":26.7,
                                "datetime":"2017-04-19 09:00"
                            },
                            {
                                "value":27.11,
                                "datetime":"2017-04-19 10:00"
                            },
                            {
                                "value":27.25,
                                "datetime":"2017-04-19 11:00"
                            },
                            {
                                "value":27.23,
                                "datetime":"2017-04-19 12:00"
                            }
                        ]
                    },
                    "minutely":{ // 分钟级预报
                        "status":"ok",
                        "precipitation":[ // 降水强度  //未来一小时每分钟的降雨量，0.03-0.25是小雨，0.25-0.35是中雨, 0.35以上是大雨，根据不同地区情况可以有所调整。
                            0,
                            0,
                            0.3125,
                            0.3288,
                            0.3427,
                            0.3519,
                            0.3542,
                            0.3481,
                            0.3351,
                            0.3176,
                            0.2978,
                            0.278,
                            0.2604,
                            0.2469,
                            0.2371,
                            0.2302,
                            0.2254,
                            0.2218,
                            0.2188,
                            0.2154,
                            0.2119,
                            0.2082,
                            0.2046,
                            0.2011,
                            0.1979,
                            0.1951,
                            0.1928,
                            0.1908,
                            0.1893,
                            0.1882,
                            0.1875,
                            0.1872,
                            0.1873,
                            0.1874,
                            0.1876,
                            0.1877,
                            0.1875,
                            0.187,
                            0.1867,
                            0.187,
                            0.1886,
                            0.1921,
                            0.1979,
                            0.2064,
                            0.2166,
                            0.2273,
                            0.2372,
                            0.2452,
                            0.25,
                            0.2507,
                            0.248,
                            0.2425,
                            0.2352,
                            0.227,
                            0.2188,
                            0.2111,
                            0.2044,
                            0.1985,
                            0.1937,
                            0.19
                        ],
                        "datasource":"radar",
                        // 目前支持繁体、简体中文，英语版待测试
                        "description":"16\u5206\u949f\u540e\u96e8\u6e10\u5c0f\uff0c\u8f6c\u4e3a\u5c0f\u96e8"
                    },
                    "daily":{ // 天级别的预报，给出最近 5 天的预报
                        "status":"ok",
                        "astro":[ // 日出日落
                            {
                                "date":"2017-04-17",
                                "sunset":{
                                    "time":"17:44"
                                },
                                "sunrise":{
                                    "time":"05:44"
                                }
                            },
                            {
                                "date":"2017-04-18",
                                "sunset":{
                                    "time":"17:43"
                                },
                                "sunrise":{
                                    "time":"05:44"
                                }
                            },
                            {
                                "date":"2017-04-19",
                                "sunset":{
                                    "time":"17:42"
                                },
                                "sunrise":{
                                    "time":"05:44"
                                }
                            },
                            {
                                "date":"2017-04-20",
                                "sunset":{
                                    "time":"17:41"
                                },
                                "sunrise":{
                                    "time":"05:45"
                                }
                            },
                            {
                                "date":"2017-04-21",
                                "sunset":{
                                    "time":"17:40"
                                },
                                "sunrise":{
                                    "time":"05:45"
                                }
                            }
                        ],
                        "temperature":[ // 温度
                            {
                                "date":"2017-04-17",
                                "max":26.86,
                                "avg":25.39,
                                "min":14.97
                            },
                            {
                                "date":"2017-04-18",
                                "max":27.58,
                                "avg":26.5,
                                "min":15.59
                            },
                            {
                                "date":"2017-04-19",
                                "max":27.25,
                                "avg":26.22,
                                "min":15.21
                            },
                            {
                                "date":"2017-04-20",
                                "max":27.3,
                                "avg":26.27,
                                "min":15.42
                            },
                            {
                                "date":"2017-04-21",
                                "max":26.57,
                                "avg":23.06,
                                "min":11.77
                            }
                        ],
                        "pm25":[ // pm25
                            {
                                "date":"2017-04-17",
                                "max":13.0,
                                "avg":6.0,
                                "min":-0.0
                            },
                            {
                                "date":"2017-04-18",
                                "max":-0.0,
                                "avg":0.0,
                                "min":-0.0
                            },
                            {
                                "date":"2017-04-19",
                                "max":35.0,
                                "avg":20.0,
                                "min":-0.0
                            },
                            {
                                "date":"2017-04-20",
                                "max":15.0,
                                "avg":5.0,
                                "min":-0.0
                            },
                            {
                                "date":"2017-04-21",
                                "max":2.0,
                                "avg":0.0,
                                "min":-0.0
                            }
                        ],
                        "skycon":[ // 天气概况
                            {
                                "date":"2017-04-17",
                                "value":"RAIN"
                            },
                            {
                                "date":"2017-04-18",
                                "value":"RAIN"
                            },
                            {
                                "date":"2017-04-19",
                                "value":"CLOUDY"
                            },
                            {
                                "date":"2017-04-20",
                                "value":"RAIN"
                            },
                            {
                                "date":"2017-04-21",
                                "value":"RAIN"
                            }
                        ],
                        "cloudrate":[ // 云量
                            {
                                "date":"2017-04-17",
                                "max":1.0,
                                "avg":1.0,
                                "min":1.0
                            },
                            {
                                "date":"2017-04-18",
                                "max":1.0,
                                "avg":0.99,
                                "min":0.95
                            },
                            {
                                "date":"2017-04-19",
                                "max":1.0,
                                "avg":0.95,
                                "min":0.89
                            },
                            {
                                "date":"2017-04-20",
                                "max":0.99,
                                "avg":0.96,
                                "min":0.91
                            },
                            {
                                "date":"2017-04-21",
                                "max":1.0,
                                "avg":0.91,
                                "min":0.79
                            }
                        ],
                        "aqi":[ // AQI
                            {
                                "date":"2017-04-17",
                                "max":38.0,
                                "avg":32.0,
                                "min":26.0
                            },
                            {
                                "date":"2017-04-18",
                                "max":28.0,
                                "avg":26.0,
                                "min":25.0
                            },
                            {
                                "date":"2017-04-19",
                                "max":61.0,
                                "avg":47.0,
                                "min":27.0
                            },
                            {
                                "date":"2017-04-20",
                                "max":41.0,
                                "avg":30.0,
                                "min":24.0
                            },
                            {
                                "date":"2017-04-21",
                                "max":25.0,
                                "avg":24.0,
                                "min":22.0
                            }
                        ],
                        "precipitation":[ // 降水强度
                            {
                                "date":"2017-04-17",
                                "max":9.6091,
                                "avg":4.4194,
                                "min":1.4964
                            },
                            {
                                "date":"2017-04-18",
                                "max":3.2836,
                                "avg":0.684,
                                "min":0.0
                            },
                            {
                                "date":"2017-04-19",
                                "max":0.5972,
                                "avg":0.0541,
                                "min":0.0
                            },
                            {
                                "date":"2017-04-20",
                                "max":0.5944,
                                "avg":0.0967,
                                "min":0.0
                            },
                            {
                                "date":"2017-04-21",
                                "max":0.8844,
                                "avg":0.2504,
                                "min":0.0
                            }
                        ],
                        "wind":[ // 风
                            {
                                "date":"2017-04-17",
                                "max":{
                                    "direction":86.6,
                                    "speed":103.66
                                },
                                "avg":{
                                    "direction":56.13,
                                    "speed":55.22
                                },
                                "min":{
                                    "direction":11.12,
                                    "speed":35.05
                                }
                            },
                            {
                                "date":"2017-04-18",
                                "max":{
                                    "direction":120.02,
                                    "speed":97.84
                                },
                                "avg":{
                                    "direction":134.58,
                                    "speed":43.98
                                },
                                "min":{
                                    "direction":143.64,
                                    "speed":13.8
                                }
                            },
                            {
                                "date":"2017-04-19",
                                "max":{
                                    "direction":146.65,
                                    "speed":12.64
                                },
                                "avg":{
                                    "direction":171.3,
                                    "speed":5.09
                                },
                                "min":{
                                    "direction":19.89,
                                    "speed":1.0
                                }
                            },
                            {
                                "date":"2017-04-20",
                                "max":{
                                    "direction":251.76,
                                    "speed":9.14
                                },
                                "avg":{
                                    "direction":218.53,
                                    "speed":6.08
                                },
                                "min":{
                                    "direction":204.15,
                                    "speed":3.72
                                }
                            },
                            {
                                "date":"2017-04-21",
                                "max":{
                                    "direction":37.58,
                                    "speed":28.53
                                },
                                "avg":{
                                    "direction":54.28,
                                    "speed":16.31
                                },
                                "min":{
                                    "direction":257.06,
                                    "speed":6.61
                                }
                            }
                        ],
                        "humidity":[ // 相对湿度
                            {
                                "date":"2017-04-17",
                                "max":0.93,
                                "avg":0.89,
                                "min":0.8
                            },
                            {
                                "date":"2017-04-18",
                                "max":0.88,
                                "avg":0.82,
                                "min":0.74
                            },
                            {
                                "date":"2017-04-19",
                                "max":0.89,
                                "avg":0.79,
                                "min":0.69
                            },
                            {
                                "date":"2017-04-20",
                                "max":0.92,
                                "avg":0.84,
                                "min":0.76
                            },
                            {
                                "date":"2017-04-21",
                                "max":0.9,
                                "avg":0.84,
                                "min":0.78
                            }
                        ]
                    },
                    "alert": [
                        // {
                        //     status: "预警中",
                        //     code: "0903", //预警code字段，格式为AABB，AA取01-16，分别表示：台风、暴雨、暴雪、寒潮、大风、沙尘暴、高温、干旱、雷电、冰雹、霜冻、大雾、霾、道路结冰、森林火灾、雷雨大风，BB取01-04，分别表示：蓝色、黄色、橙色、红色。
                        //     description: "白沙县气象台2016年07月25日17时10分发布雷电橙色预警信号：我县中部地区已受雷电活动影响，出现雷电灾害事故的可能性比较大，请有关单位和人员做好防范工作。 ",
                        //     pubdate: "2016-07-25 17:10:00",
                        //     location: "海南省白沙县",
                        //     bound_coord: [116.39, 39.93, 116.1, 40.2], //预警的范围，实验中，不是所有的都有，经纬度表示
                        // }
                    ]
                }
            }
        )
    }
}
