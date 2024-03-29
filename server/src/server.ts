import express, { Application, ErrorRequestHandler, Express, NextFunction, Request, Response } from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import { sendErrorResponse, ServerErrorTypes } from './shared/errors/errors';
import * as path from 'path';
import { Routes } from './routes/routes';
import Logging from './logging/logging';
import { Config } from './config/config';
import fs from "fs";

export class Server {
    public readonly app: Express;

    private readonly server?: http.Server;

    public static bootstrap(): Server {
        return new Server();
    }

    constructor() {
        this.app = express();

        const port = process.env.PORT ? Number(process.env.PORT) : 3001;

        Logging.initialize();

        this.server = this.createServer(this.app, port);

        this.setupApp(this.app, port);
        this.setupRoutes(this.app);
    }

    private createServer(app: Application, port: number): http.Server {
        const server = http.createServer(app);
        server.listen(port);
        server.setTimeout(10 * 60 * 1000);
        server.on('error', (error) => this.onError(error, port));
        server.on('listening', () => this.onListening(port));
        return server;
    }

    private setupApp(app: Application, port: number): void {
        app.set('port', port);
        app.use(bodyParser.json({ limit: '10mb' }));
        app.use(this.addCORSHeaders);
        app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
        app.disable('x-powered-by');
    }

    private setupRoutes(app: Application): void {
        app.use(express.static(path.join(__dirname, '../public/assets/')));
        app.use(express.static(path.join(__dirname, '../')));
        app.use(express.Router());
        app.use('/', new Routes().router);
        // Serve all assets that don't start with /api via the public directory
        app.get(/^(?!\/api)(.*)$/, function (req, res) {
            const filePath = path.join(__dirname, '../public/', req.params[0]);
            // Check if the file exists
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    // File does not exist, serve index.html
                    res.sendFile(path.join(__dirname, '../public/', 'index.html'));
                } else {
                    // File exists, serve the requested file
                    res.sendFile(filePath);
                }
            });
        });
        // The following middleware is used to automatically respond with a 500 when one of the routes threw an error.
        // Rejected promises are converted into thrown errors by the asyncRouteHandler.
        // These 4 parameters are required for Express to identify this middleware as an error middleware.
        // eslint-disable-next-line no-unused-vars
        app.use(((error, req, res, _next) => {
            sendErrorResponse(res, 500, ServerErrorTypes.General, error);
        }) as ErrorRequestHandler);

        app.use((request: Request, response: Response) => {
            sendErrorResponse(
                response,
                404,
                ServerErrorTypes.NotFound,
                new Error(`Resource not found: ${request.method?.toUpperCase()} ${request.url}`),
            );
        });
    }

    private onError(error: NodeJS.ErrnoException, port: number): void {
        if (error.syscall !== 'listen') {
            throw error;
        }

        switch (error.code) {
            case 'EACCES':
                console.error(`Port ${port} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`Port ${port} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    private onListening(port: number): void {
        console.log(`Regeringsrobot listening on port ${port} in ${process.env.NODE_ENV || 'local'} mode!`);
    }

    private addCORSHeaders(request: Request, response: Response, next: NextFunction): void {
        const allowedOrigins = Config.getAllowedOrigins();
        const origin = request.get('origin');

        if (origin && allowedOrigins.indexOf(origin) > -1) {
            response.setHeader('Access-Control-Allow-Origin', origin);
        }

        response.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With,Authorization');
        response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
        response.setHeader('Access-Control-Allow-Credentials', 'true');

        // Intercept preflight OPTIONS
        if (request.method === 'OPTIONS') {
            response.sendStatus(200);
        } else {
            next();
        }
    }
}

Server.bootstrap();
