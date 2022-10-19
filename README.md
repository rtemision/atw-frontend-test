# atw-frontend-test

[Terms of reference](TOR.ru.md)

## Nunjucks template syntax

If your use [VS Code](https://code.visualstudio.com/), you can install [Nunjucks for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ronnidc.nunjucks).

## Install

Switch node.js [version](.nvmrc) by [nvm](https://github.com/nvm-sh/nvm):
```bash
nvm use
```

Install dependencies
```bash
npm ci
```

## Usage

Start dev server
```bash
npm start
```

Build dist
```bash
npm run build
```

Run linter
```bash
npm run lint
```

## Some used techs
- [webpack](https://webpack.js.org/)
- [nunjucks](https://mozilla.github.io/nunjucks/)
- [scss](https://sass-lang.com/)
- [postcss](https://postcss.org/)
- [bem-tools-create](https://github.com/bem-tools/bem-tools-create)
