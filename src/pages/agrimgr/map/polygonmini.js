export default {
  add(pointA, pointB) {
    var x = pointA[0] + pointB[0]
    var y = pointA[1] + pointB[1]
    var result = [x, y]

    return result
  },
  sub(pointA, pointB) {
    var x = pointA[0] - pointB[0]
    var y = pointA[1] - pointB[1]
    var result = [x, y]

    return result
  },
  mul(pointA, pointB) {
    return pointA[0] * pointB[0] + pointA[1] * pointB[1]
  },
  mulNum(pointA, value) {
    var x = pointA[0] * value
    var y = pointA[1] * value
    var result = [x, y]

    return result
  },
  subMul(pointA, pointB) {
    return pointA[0] * pointB[1] - pointA[1] * pointB[0]
  },
  scalePolygon(pList, delta) {
    var dpList = []

    for (var i = 0; i < pList.length; i++) {
      
      var index = i === pList.length -1 ? 0 : i + 1,
        pointA = pList[index],
        pointB = pList[i],
        pointSub = this.sub(pointA, pointB)

      if (this.mul(pointSub, pointSub) === 0) {
        continue
      }
      dpList.push(pointSub)
    }

    var ndpList = []
    
    for (var i = 0; i < dpList.length; i++) {
      ndpList.push(this.mulNum(dpList[i], 1.0 / Math.sqrt(this.mul(dpList[i], dpList[i]))))
    }

    var newList = []

    for (var i = 0; i < ndpList.length; i++) {
      if (i === 0) {
        var startIndex = ndpList.length - 1

      } else {
        var startIndex = i -1
      }
      
      var endIndex = i
      var sina = this.subMul(ndpList[startIndex], ndpList[endIndex])

      if (sina == 0) {
        continue
      }
      var length = delta/sina,
        vector = this.sub(ndpList[endIndex], ndpList[startIndex]),
        point = this.add(pList[i], this.mulNum(vector, length))
      
      newList.push(point)

      
    }
    var firPoint = newList[0]
    newList.push(firPoint)

    return newList
  }
}