var path = require('path')
var config = require(path.join('../', 'config/index'))
var utils = require('./utils')
var projectRoot = config.common.projectPath

var env = process.env.NODE_ENV
// check env & config/index.js to decide whether to enable CSS source maps for the
// various preprocessor loaders added to vue-loader at the end of this file
var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd

var componentsPath = path.join(projectRoot, 'src/components')

module.exports = {
  // entry: {
  //   app: './src/main.js'
  // },
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, path.join(projectRoot, 'node_modules'))],
    alias: {
        'vue$': 'vue/dist/vue.common.js',
        'src': path.resolve(__dirname, path.join(projectRoot, 'src')),
        'assets': path.resolve(__dirname, path.join(projectRoot, 'src/assets')),
        'components': path.resolve(__dirname, componentsPath),
        'static': path.resolve(__dirname, 'static/'),
        'pages': path.resolve(__dirname, path.join(projectRoot, 'src/pages')),
        'api': path.resolve(__dirname, path.join(projectRoot, 'src/api')),
        'config': path.resolve(__dirname, path.join(projectRoot, 'config')),
        'plugins': path.resolve(__dirname, path.join(projectRoot, 'src/plugins'))

    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  vue: {
    loaders: utils.cssLoaders({ sourceMap: useCssSourceMap }),
    postcss: [
      require('autoprefixer')({
        browsers: ['last 2 versions']
      })
    ]
  }
}
