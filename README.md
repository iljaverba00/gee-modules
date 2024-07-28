# gee-mobile module

### 1. Build

`node update.js`

### 2. Publish to GitLab package registry

`npm publish`

### 3. For start dev mode 
`npm run dev`


### Script for fast update gee-modules in application
` cd ../gee_modules/gee-business ;  npm run build ; npm pack ; cd ../../application ; npm r @gee/business ; npm i file:../gee_modules/gee-business/gee-business-0.0.5.tgz`

