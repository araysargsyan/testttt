const {join} = require("path");

const nextConfig = {
  sassOptions: {
    includePaths: [join(__dirname, 'styles')],
  },
}

module.exports = nextConfig
