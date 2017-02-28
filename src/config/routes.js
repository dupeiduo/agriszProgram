import App from '../App'

export default [{
  path: '/',
  component: App,
  children: [
  {
    path: '/index', 
    component: resolve => require(['../pages/index/'], resolve)
  }, 
  {
    path: '/monitor', 
    component: resolve => require(['../pages/monitor/'], resolve)
  }, 
  {
    path: '/classify', 
    component: resolve => require(['../pages/classify/'], resolve)
  }, 
  {
    path: '/analyze', 
    component: resolve => require(['../pages/analyze/'], resolve)
  }, 
  {
    path: '/report', 
    component: resolve => require(['../pages/report/'], resolve)
  },
  {
    path: '/weather', 
    component: resolve => require(['../pages/weather/'], resolve)
  }, 
  {
    path: '/soil', 
    component: resolve => require(['../pages/soil/'], resolve)
  }, 
  {
    path: '/market', 
    component: resolve => require(['../pages/market/'], resolve)
  }, 
  {
    path: '/plant', 
    component: resolve => require(['../pages/plant/'], resolve)
  }, 
  {
    path: '/cropvaluate', 
    component: resolve => require(['../pages/cropvaluate/'], resolve)
  },
  {
    path: '/evaluation', 
    component: resolve => require(['../pages/evaluation/'], resolve)
  },
  {
    path: '/occupation', 
    component: resolve => require(['../pages/occupation/'], resolve)
  },
  {
    path: '/services', 
    component: resolve => require(['../pages/services/'], resolve)
  },
  {
    path: '*', 
    redirect: '/index'
  }]
}]