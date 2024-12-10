/* eslint-disable prettier/prettier */
module.exports = {
    apps: [
        {
            name: 'library-backend',
            script: './dist/main.js',
            instances: 1,
            exec_mode: 'cluster',
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
};
