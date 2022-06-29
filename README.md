# React-TS-Passport
Aplicación creada con React, Typescript, Express, Node, Passport, MongoDB.

## Variables de entorno necesarias
- PART1STRING:USER:PASSWORD:PART2STRING:DB:PART3STRING === URL para conectarse a mongo
- FRONTEND === URL del FrontEnd

## Argumentos
-p, --port especifica el puerto que va a ser usado para hostear el servidor, por default es 8080. Para especificar este argumento recomiendo modificar el script "start" en package.json

-m, --mode especifica el modo en el que va a ser ejecutado el servidor, fork o cluster. Por defualt es fork.


## Ejecutando con NGINX

Para ejecutar los comandos nativos podemos usar los scrips guardados en package.json. 
- npm run nodemon (nodemon --exec ts-node src/index.ts -p 8080 -m cluster).
- npm run node (npx ts-node src/index.ts -p 8080 -m cluster)

Para ejecutar con forever y pm2 es necesario compilar de TS a JS. Por lo tanto, hay que ejecutar: npx tsc
Esto nos compilara el TypeScript en una carpeta "build".

Una vez tengamos la compilación podemos ejecutar lo siguiente:
- Forever
  - forever start build/index.js -p 8081
  - forever start build/index.js -p 8081 -m cluster
  
- PM2
  - pm2 start build/index.js --name --watch -- -p 8081
  - pm2 start build/index.js --name --watch -- -p 8081 -m cluster
  - pm2 start build/index.js --name --watch -i 0 -- -m cluster
  
  
## Configuración NGINX 

- 1  
  - node build/index.js 
  - node build/index.js -p 8081 -m cluster
   
- 2 (varios puertos)
  - node main.js
  - node build/index.js -p 8081 -m cluster
  - pm2 start build/index.js --name server8082 --watch -- 8082
  - pm2 start build/index.js --name server8083 --watch -- 8083   
  - pm2 start build/index.js --name server8084 --watch -- 8084  
  - pm2 start build/index.js --name server8085 --watch -- 8085 
  - pm2 start build/index.js --name servercluster --watch -i 0 
