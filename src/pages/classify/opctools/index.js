export default {
  createModel: function (dates) {
    var len = dates.length;
    var timeLen = dates[len - 1].getTime() - dates[0].getTime();

    var model = {
      "timestamps": dates,
      "layers": [],
      "head": 0,
      "timeLen": timeLen,
      "timeCount": len
    };

    this.resetModel(model);

    return model;
  }

  ,resetModel: function (data) {
    data.head = 0;
    data.layers = [];
    for(var i = 0; i < data.timestamps.length; i++) {
      data.layers.push(0);
    }
    data.layers[data.head] = 1;
  }

  ,hasDataAt: function (data, index) {
    return index >= 0 && index < data.timestamps.length;
  }

  ,getTimeStampAt: function (data, index) {
    return data.timestamps[index].getTime();
  }

  ,setLayerOpacityAt: function (data, index, value) {
    data.layers[index] = value;
  }

  ,setHead: function (data, newHead) {
    if(newHead < 0) {
      newHead = 0;
    }

    if(newHead > 1) {
      newHead = 1;
    }

    data.head = newHead;

    return data.timestamps[0].getTime() + newHead * data.timeLen;
  }

  ,refreshModel: function (data, newHead, calculator) {
    var _calOpacityMethod = calculator ? calculator : this._linearMethod;

    var timeEscaped = this.setHead(data, newHead);

    var i = 0;
    for(; i < data.timeCount; i++) {
      var timestamp = this.getTimeStampAt(data, i);

      if(timeEscaped <= timestamp) {
        if(this.hasDataAt(data, i - 1)) {
          var prevTimestamp = this.getTimeStampAt(data, i - 1);

          if(timeEscaped > prevTimestamp) {
            var percent = (timeEscaped - prevTimestamp) / (timestamp - prevTimestamp);
            var opacity = _calOpacityMethod(percent);
            this.setLayerOpacityAt(data, i, opacity);

          } else {
            this.setLayerOpacityAt(data, i, 0);
            break;
          }
        }

        else {
          this.setLayerOpacityAt(data, i, 1);
        }

      } else {
        if(this.hasDataAt(data, i + 1)) {
          var nextTimestamp = this.getTimeStampAt(data, i + 1);

          if(timeEscaped > nextTimestamp) {
            this.setLayerOpacityAt(data, i, 0);

          } else {
            var percent = (timeEscaped - timestamp) / (nextTimestamp - timestamp);
            var opacity = _calOpacityMethod(1 - percent);
            this.setLayerOpacityAt(data, i, opacity);
          }
        }

        else {
          this.setLayerOpacityAt(data, i, 1);
        }
      }
    }

    for(; i < data.timeCount; i++) {
      this.setLayerOpacityAt(data, i, 0);
    }
  }

  ,_linearMethod: function (percent) {
    return percent;
  }

  ,suLiner: function (x) {
    var E = 0.6;
    if(x<=0.5) {
      return (1+E) * x;
    }
    else {
      return x - E * x + E;
    }
  }
} 
  