
const isDev = process.env.NODE_ENV === 'development';


export const API_SERVER = {
   api: isDev? 'http://localhost:8080': 'http://kubelilin-api.yoyogo.run', 
   ws:  isDev? 'ws://localhost:8080'   : 'ws://kubelilin-api.yoyogo.run'
}
