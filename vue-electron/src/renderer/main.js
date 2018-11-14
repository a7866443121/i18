import Vue from 'vue'
import App from './App'
import axios from './api';
Vue.config.productionTip = false
Vue.prototype.$axios = axios;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

var webview = document.getElementById('webview');
console.log(webview)
var Menu = require('electron').remote.Menu;
function loadUrl(url) {
    return function () {
    	webview.style.cssText = "position: fixed; top: 0;left: 0;background-color: #fff; width:100%; height:100%;z-index: 99;";
      webview.src = url;
    }
}
webview.style.cssText = "position: fixed; top: 0;left: 0;background-color: #fff; width:0; height:0;z-index: -1;";
webview.addEventListener('dom-ready', () => {
  console.log('webiew dom-ready');
});
const template = [
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    label: 'View',
    submenu: [
      {
      	role: 'reload',
      	label:'重新载入',
      },
      {
      	role: 'forcereload',
      	label:'返回上级',
      },
      {
      	role: 'toggledevtools',
      	label:'调试工具',
      },
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'},     
    ]
  },
  {
    label: '加载网页',
    submenu: [
	    {
	      label: '校管家官网',
	      click: loadUrl('http://www.xiaogj.com/')
	    },
      {
          label: '优酷',
          click:loadUrl('http://www.youku.com')
      },
      {
          type: 'separator'
      },
      {
          label: '百度',
          click:loadUrl('http://www.baidu.com')
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://electron.atom.io') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  })

  // Edit menu
  template[1].submenu.push(
    {type: 'separator'},
    {
      label: 'Speech',
      submenu: [
        {role: 'startspeaking'},
        {role: 'stopspeaking'}
      ]
    }
  )

  // Window menu
  template[3].submenu = [
    {role: 'close'},
    {role: 'minimize'},
    {role: 'zoom'},
    {type: 'separator'},
    {role: 'front'}
  ]
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)