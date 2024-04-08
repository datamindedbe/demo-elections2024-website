import axios, { AxiosRequestConfig } from 'axios';

export class Http {
    private baseUrl: string;

    public constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public async get<T>(
        path: string,
        parameters?: { [key: string]: string | number },
        queryParameters?: { [key: string]: string | number },
        headers?: { [key: string]: string | number },
    ): Promise<T> {
        const url = this.buildUrl(path, parameters);
        const requestHeaders = await this.buildHeaders(headers);
        const configuration: AxiosRequestConfig = {
            params: queryParameters,
            headers: requestHeaders,
        };

        const response = await axios.get<T>(url, configuration);

        return response.data;
    }

    public buildUrl(path: string, parameters?: { [key: string]: string | number }): string {
        const url = new URL(path, this.baseUrl).toString();

        if (parameters) {
            return Object.keys(parameters).reduce((url, parameterKey) => {
                return url.replace(parameterKey, parameters[parameterKey].toString());
            }, url);
        }

        return url;
    }

    public async buildHeaders(headers?: {
        [key: string]: string | number;
    }): Promise<{ [key: string]: string | number }> {
        return { ...headers };
    }
}
