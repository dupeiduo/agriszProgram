var spawn = require('child_process').spawn;

var len = process.argv.length - 4
var sumComponent = 0

if (checkParams(process.argv)) {
  create(process.argv)
}

function checkParams(argv) {
  if (argv.length < 5) {
    console.log(`请输入三个参数，参数为以空格分割的字符串
      第一个是组件根目录，如：“/Users/dupeiduo/Desktop/Program/VueComponents/tags
      第二个是项目根目录，如：“/Users/dupeiduo/Desktop/Program/OSS/truck/vue-webpack”
      第三个是组件信息，如：agrisz-map^1.0.0 agrisz-echart^1.0.0`)
    return false
  }
  return true
}

function create(argv) {
  for (var i = 4; i < argv.length; i++) {
    var name = argv[i].split('^')[0]
    var version = argv[i].split('^')[1]
    createLink(argv, name, version)
  }
}

function createLink(argv, name, version) {
  var componentPath = `${argv[2]}/${name}/${version}`
  var npm = spawn('npm', ['link'], {cwd: componentPath})
  npm.stdout.on('data', (data) => {
    console.log(`${name} 软链接成功！`)
  })
  npm.stderr.on('data', (data) => {
    console.error(`${name}软链接${data}`)
  })
  npm.on('exit', (code, signal) => {
    sumComponent++
    if (sumComponent === len) {
      link(argv)
    }
  })
}

function link(argv) {
  for (var i = 4; i < argv.length; i++) {
    var name = argv[i].split('^')[0]
    linkToProgram(argv, name)
  }
}

function linkToProgram(argv, name) {
  var programPath = `${argv[3]}`
  var npm = spawn('npm', ["link", name], {cwd: programPath})
  npm.stdout.on('data', (data) => {
    console.log(`${name} 链接成功！`)
  })
  npm.stderr.on('data', (data) => {
    console.error(`${name} 链接: ${data}`)
  })
}

// node initlink.js /Users/dupeiduo/Desktop/Program/VueComponents/trunck /Users/dupeiduo/Desktop/Program/OSS/truck/vue-webpack agrisz-map^1.0.0 agrisz-echart^1.0.0 