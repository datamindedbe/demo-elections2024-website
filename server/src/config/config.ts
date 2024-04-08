process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || __dirname;
import config from 'config';

export class Config {
    public static getAllowedOrigins(): string[] {
        return config.get('CORS.allowedOrigins') as string[];
    }

    public static getLoggingConfig(): LoggingConfig {
        return config.get('LOGGING') as LoggingConfig;
    }

    public static getDockerConfig(): DockerConfig {
        return config.get('DOCKER') as DockerConfig;
    }
}

export interface LoggingConfig {
    s3Bucket: string;
    s3BucketAuditLogs: string;
    s3LoggingEnabled: boolean;
}

export interface DockerConfig {
    isContainerized: boolean;
}
