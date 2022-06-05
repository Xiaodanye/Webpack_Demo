import {createApp} from 'vue'
import App from './App.vue'

// Vue.config.productionTip = false
createApp(App).mount('#app')

// // 渐进式网络应用程序(progressive web application - PWA)
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/service-worker.js")
//       .then((registration) => {
//         console.log("SW registered: ", registration);
//       })
//       .catch((registrationError) => {
//         console.log("SW registration failed: ", registrationError);
//       });
//   });
// }