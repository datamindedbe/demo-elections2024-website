module.exports = {
    apps: [
        {
            name: 'regeringsrobot-api',
            script: 'dist/server.js',
            out_file: 'out.log',
            error_file: 'err.log',
            instance_var: 'api',
        },
    ],
};
