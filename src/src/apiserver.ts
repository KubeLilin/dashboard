
const isDev = process.env.NODE_ENV === 'development';


export const API_SERVER = {
   api: isDev? 'http://localhost:8080': 'https://apiserver.kubelilin.com', 
   ws:  isDev? 'ws://localhost:8080'   : 'wss://apiserver.kubelilin.com'
}
