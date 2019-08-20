const fs = require('fs');
const path = require('path');
const packageInfo = require('../package.json');

// We need compile additional content for zoe user
function finalizeCompile() {
  if (fs.existsSync(path.join(__dirname, '../lib'))) {
    // Build package.json version to lib/version/index.js
    // prevent json-loader needing in user-side
    const versionFilePath = path.join(process.cwd(), 'lib', 'version', 'index.js');
    const versionFileContent = fs.readFileSync(versionFilePath).toString();
    fs.writeFileSync(
      versionFilePath,
      versionFileContent.replace(
        /require\(('|")\.\.\/\.\.\/package\.json('|")\)/,
        `{ version: '${packageInfo.version}' }`,
      ),
    );
    // eslint-disable-next-line
    console.log('Wrote version into lib/version/index.js');

    // Build package.json version to lib/version/index.d.ts
    // prevent https://github.com/ant-design/ant-design/issues/4935
    const versionDefPath = path.join(process.cwd(), 'lib', 'version', 'index.d.ts');
    fs.writeFileSync(
      versionDefPath,
      `declare var _default: "${packageInfo.version}";\nexport default _default;\n`,
    );
    // eslint-disable-next-line
    console.log('Wrote version into lib/version/index.d.ts');

    // Build a entry less file to dist/zoe.less
    const componentsPath = path.join(process.cwd(), 'components');
    let componentsLessContent = '';
    // Build components in one file: lib/style/components.less
    // 读取所有component的index.less 生成 @import *.less 写入 components.less
    fs.readdir(componentsPath, (err, files) => {
      files.forEach(file => {
        if (fs.existsSync(path.join(componentsPath, file, 'style', 'index.less'))) {
          componentsLessContent += `@import "../${path.join(file, 'style', 'index.less')}";\n`;
        }
      });
      fs.writeFileSync(
        path.join(process.cwd(), 'lib', 'style', 'components.less'),
        componentsLessContent,
      );
    });
  }
}

function finalizeDist() {
  // 是否存在dist目录
  if (fs.existsSync(path.join(__dirname, '../dist'))) {
    // Build less entry file: dist/zoe.less
    // 将所有的less文件在zoe.less 中@import 进来
    fs.writeFileSync(
      path.join(process.cwd(), 'dist', 'zoe.less'),
      '@import "../lib/style/index.less";\n@import "../lib/style/components.less";',
    );

    // eslint-disable-next-line
    console.log('Built a entry less file to dist/zoe.less');
  }
}

module.exports = {
  compile: {
    finalize: finalizeCompile,
  },
  dist: {
    finalize: finalizeDist,
  },
};
