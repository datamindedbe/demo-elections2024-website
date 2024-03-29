export const runtimeConfig = () => {
    const isLocalMode = import.meta.env.MODE === 'local-dev';
    const isDevMode = import.meta.env.MODE === 'development';
    const isProdMode = import.meta.env.MODE === 'production';

    const getBaseApiUrl = () => {
        if (isLocalMode) {
            return 'http://localhost:3001';
        } else if (isDevMode) {
            return 'https://dev.regeringsrobot.be';
        } else if (isProdMode) {
            return 'https://prd.regeringsrobot.be.dev.regeringsrobot.be'
        }
        throw 'Environment not set';
    };

    const getChatbotUrl = () => {
        return 'https://l9zclxjcv7.execute-api.eu-central-1.amazonaws.com/dev/';
    };

    return {
        getBaseApiUrl,
        getChatbotUrl,
    };
};
