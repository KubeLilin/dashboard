## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm run start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```
export NODE_OPTIONS=--max_old_space_size=4096

## Docker 

docker build -f ./src/Dockerfile . -t yoyofx/kubelilin:v0.1


docker run -p 8092:8092 yoyofx/kubelilin:v0.1