## TypeScript-Vue-Eslint-Starter
> webpack4
> typescript
> eslint
> vue

No babel, Only typescript.

### start
```shell
npm i
npm run dev -s
npm run build-test
```

### 项目规范
- 1. 文件全小写, 多个单词之间用-连接
- 2. html (class, id) 全小写, 多个单词之间用-连接
- 3. vue 相关规范参照 https://youzan.github.io/vant/#/zh-CN/style-guide
- 4. 禁止使用style scoped
- 5. 项目中直接使用设计图标注的px, 插件会自动转rem. 如果不需要转rem的在后面加上注释 /* no */
- 6. 禁止到处使用any, 需要标注typescript具体数据类型
- 7. 使用vue event bus注册的$on必须在组件销毁时$off注销
- 8. mixins模块只能使用 destroy 钩子, vue单文件组件只能使用 beforeDestroy 钩子. 以避免 extends 继承出错
- 9. 开发时使用 ```npm run dev -s``` 启动项目, 以此命令启动时之后生成中文翻译项目, 以提高编译效率.
- 10. 自定义全局组件，开头统一用 zb-xxx
- 10. 选中样式统一用 xxx--active
- 11. vue class 属性书写顺序 props -> data -> getter -> store -> watch -> methods -> hooks

### 推荐vscode插件
  - Auto Close Tag
  - Beautify
  - ESlint
  - Path Autocomplete
  - Sass
  - Prettier - Code formatter
  - Vetur
  - vs-wp-i18n-convert: 格式化 ```__('')``` 多语言vscode插件 vs-wp-i18n-convert 选择要格式化的文案, 按下ctrl + shift + w 或者鼠标右键选中```__(```

### css icon 只能定义上下左右 颜色会自动继承父级的color 默认样式 class="zb-icon icon-xxx" 大小固定不能改变
- 下拉箭头 <icon-arrow /> 默认方向朝下 改变方向加属性 <icon-arrow direction = "up right down left" />

### icon 默认 24x24像素 默认样式 class="zb-icon icon-xxx" 修改大小定义width 修改颜色定义fill: #f00
- 菜单(三条杠) <icon-menu />
- 更多(三个点) <icon-more />
- 返回 <icon-return />
- 搜索 <icon-search />
- 关闭 <icon-close />
- 错误 <icon-error />
- 警告 <icon-warn />
- 成功 <icon-success />
- 暂无记录 <icon-nodata />

### 全部定义组件规范
- 开头全部用 zb-xxx

### 选中class规范
- xxx--active


推荐vscode用户自动定义设置
```json
    "editor.formatOnPaste": true,
    "window.zoomLevel": 0,
    "git.autofetch": true,
    "workbench.startupEditor": "newUntitledFile",
    "emmet.triggerExpansionOnTab": true,
    "editor.scrollBeyondLastLine": true,
    "editor.detectIndentation": false,
    "eslint.autoFixOnSave": true,
    "eslint.validate": [
      "javascript",
      "vue",
      {
        "language": "vue",
        "autoFix": true
      }
    ],
    "prettier.eslintIntegration": true,
    "prettier.semi": true,
    "prettier.singleQuote": true,
    "javascript.format.insertSpaceBeforeFunctionParenthesis": true,
    "vetur.format.defaultFormatter.js": "vscode-typescript",
    "javascript.updateImportsOnFileMove.enabled": "never",
    "[javascript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "editor.wordWrapColumn": 70,
    "editor.tabSize": 2,
    "vetur.trace.server": "off",
    "vetur.format.defaultFormatterOptions": {
      "prettier": {
        "semi": true,
        "singleQuote": true
      },
      "prettyhtml": {
        "printWidth": 100,
        "singleQuote": false,
        "wrapAttributes": false,
        "sortAttributes": true,
        "tabWidth": 2
      }
    },

    "emmet.syntaxProfiles": {
      "vue-html": "html",
      "vue": "html"
    },
    "explorer.confirmDelete": true,
    "files.exclude": {
      "**/.git": true,
      "**/.svn": true,
      "**/.hg": true,
      "**/CVS": true,
      "**/.DS_Store": true,
      "**/tmp": true
    },
    "files.watcherExclude": {},
    "path-autocomplete.pathMappings": {
      "@": "${folder}/src",
      "@comps": "${folder}/src/components",
      "@css": "${folder}/src/assets/css",
      "@img": "${folder}/src/assets/img",
      "@fetch": "${folder}/src/config/fetch.js"
    },
    "javascript.preferences.quoteStyle": "single",
    "path-autocomplete.extensionOnImport": true,
    "extensions.autoUpdate": false,
    "editor.snippetSuggestions": "top",
    "emmet.showSuggestionsAsSnippets": true,
    "editor.tabCompletion": "on",
    "[json]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "svn.path": "/usr/local/bin/svn",
    "[typescript]": {
      "editor.defaultFormatter": "vscode.typescript-language-features"
    },
    "vetur.format.defaultFormatter.ts": "vscode-typescript",
    "html.format.endWithNewline": true,
    "html.format.indentHandlebars": true,
    "svn.enableProposedApi": "none",
    "prettier.bracketSpacing": false,
    "prettier.jsxBracketSameLine": true,
    "prettier.printWidth": 120,
    "files.trimTrailingWhitespace": true,
    "git.enableSmartCommit": true

```
