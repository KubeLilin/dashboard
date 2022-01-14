
const isDev = process.env.NODE_ENV === 'development';


export const API_SERVER = {
   api: isDev? 'http://localhost:8080': 'http://sgr.yoyogo.run:30980/apiserver', 
   ws:  isDev? 'ws://localhost:8080'   : 'ws://sgr.yoyogo.run:30980/apiserver'
}
