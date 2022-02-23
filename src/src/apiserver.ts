
const isDev = process.env.NODE_ENV === 'development';


export const API_SERVER = {
   api: isDev? 'http://localhost:8080': 'http://api.yoyogo.run:30980/sgr', 
   ws:  isDev? 'ws://localhost:8080'   : 'ws://api.yoyogo.run:30980/sgr'
}
