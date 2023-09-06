# compass-echarts-server
Echarts server side render by node canvas, generate chart image by Echarts.
使用NodeJs服务器端渲染echarts图表，生成图片格式。

referenced from https://echarts.apache.org/en/tutorial.html#Server-side%20Rendering

forked from https://github.com/hellosean1025/node-echarts


### Install
OS | Command
----- | -----
OS X | `brew install pkg-config cairo pango libpng jpeg giflib`
Ubuntu | `sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++`
Fedora | `sudo yum install cairo cairo-devel cairomm-devel libjpeg-turbo-devel pango pango-devel pangomm pangomm-devel giflib-devel`
Solaris | `pkgin install cairo pango pkg-config xproto renderproto kbproto xextproto`
Windows | [Instructions on our wiki](https://github.com/Automattic/node-canvas/wiki/Installation---Windows)


### Usage
```javascript
var echarts = require('index.js');
var config = {
    width: 500, // Image width, type is number.
    height: 500, // Image height, type is number.
    option: {}, // Echarts configuration, type is Object.
    //If the path  is not set, return the Buffer of image.
    path:  '', // Path is filepath of the image which will be created.
    enableAutoDispose: true  //Enable auto-dispose echarts after the image is created.
    type: 'svg'|'other'
}

echarts(config)

```

### Config

|name|type|default|description|
|---|---|---|---|
|width|Number|500|Image width|
|height|Number|500|Image height|
|option|Object|{}|Echarts Options|
|path|String|-|Path is filepath of the image which will be created. If the path is empty, return buffer.|
|enableAutoDispose|Boolean|true|Enable auto-dispose echarts after the image is created.|
|type|svg/canvas|canvas|render type|


### Server
1. Request params：
```json
{
    "width": 800,
    "height": 500,
    "type":"svg",
    "option": {
    	"backgroundColor": "#fff",
        "xAxis": {
            "type": "category",
            "data": [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun"
            ]
        },
        "yAxis": {
            "type": "value"
        },
        "series": [
            {
                "data": [
                    820,
                    932,
                    901,
                    934,
                    1290,
                    1330,
                    1320
                ],
                "type": "line"
            }
        ]
    }
}
```
2. GET method access

Note: GET method is only suitable for small amount of parameter data, please use POST method when the parameter data is large.
```
http://localhost:8081/?config=%7B%22width%22%3A800%2C%22height%22%3A500%2C%22option%22%3A%7B%22backgroundColor%22%3A%22%23fff%22%2C%22xAxis%22%3A%7B%22type%22%3A%22category%22%2C%22data%22%3A%5B%22Mon%22%2C%22Tue%22%2C%22Wed%22%2C%22Thu%22%2C%22Fri%22%2C%22Sat%22%2C%22Sun%22%5D%7D%2C%22yAxis%22%3A%7B%22type%22%3A%22value%22%7D%2C%22series%22%3A%5B%7B%22data%22%3A%5B820%2C932%2C901%2C934%2C1290%2C1330%2C1320%5D%2C%22type%22%3A%22line%22%7D%5D%7D%7D
```

3. POST method access
```
curl -X POST \
  http://localhost:8081/ \
  -o echart-image.png \
  -d '{
    "width": 800,
    "height": 500,
    "type":"svg",
    "option": {
    	"backgroundColor": "#fff",
        "xAxis": {
            "type": "category",
            "data": [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun"
            ]
        },
        "yAxis": {
            "type": "value"
        },
        "series": [
            {
                "data": [
                    820,
                    932,
                    901,
                    934,
                    1290,
                    1330,
                    1320
                ],
                "type": "line"
            }
        ]
    }
}'
```
