
const isDev = process.env.NODE_ENV === 'development';


export const API_SERVER = {
   api: isDev? 'http://api.yoyogo.run:30980/sgr': 'http://api.yoyogo.run:30980/sgr', 
   ws:  isDev? 'ws://api.yoyogo.run:30980/sgr'   : 'ws://api.yoyogo.run:30980/sgr'
}
