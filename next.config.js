const { join } = require('path');


const nextConfig = {
    reactStrictMode: false,
    sassOptions: { includePaths: [ join(__dirname, 'styles') ], },
};

module.exports = nextConfig;
