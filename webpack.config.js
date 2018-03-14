module.exports = {
  entry: "./example/app.tsx",
  output: {
    filename: "./example/public/js/app/bundle.js",
  },
  devtool: "source-map",
  devServer: {
    port: 9000,
    open: true,
    openPage: "example/public/index.html"
  },
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "source-map-loader",
        enforce: "pre"
      },      
      { 
        test: /\.tsx?$/, 
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      },
      { 
        test: /\.(eot|svg|ttf|woff|woff2)$/, 
        use: "url-loader?name=[name].[ext]"
      }
    ]
  }
};