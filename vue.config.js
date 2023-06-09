module.exports = {
  outputDir: 'dist', // build输出目录
  assetsDir: 'assets', // 静态资源目录（js, css, img）
  lintOnSave: false, // 是否开启eslint
  devServer: { // 解决403跨域问题
    open: true, // 是否自动弹出浏览器页面
    host: 'localhost', // 放到nginx上后这个配置就没用了
    port: '8080',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8081', // API服务器的地址
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}
