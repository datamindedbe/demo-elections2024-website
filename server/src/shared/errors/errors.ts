import { Response } from 'express';
import { GeneratorsUtil } from '../../util/generators.util';
import { ServerError } from '../../types/server-error';
import * as winston from 'winston';
import { MAIN_LOGGER_ID } from '../../logging/logging';
import { sendResponse } from '../../util/response.util';

const logger = winston.loggers.get(MAIN_LOGGER_ID);

export enum ServerErrorTypes {
    General = 'Something went wrong.',
    Unauthorized = 'User is not authorized.',
    Forbidden = 'User is not allowed to execute this request.',
    NotFound = 'Resource was not found.',
    Conflict = 'Conflict.',
    BadRequest = 'Bad Request.',
}

export class ErrorWrapper implements ServerError {
    public type: string;
    public message: ServerErrorTypes;
    public correlationID: string;

    constructor(error: ServerErrorTypes, correlationId: string) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.type = Object.keys(ServerErrorTypes).find((e) => ServerErrorTypes[e] === error);
        this.message = error;
        this.correlationID = correlationId;
    }

    public toString(): string {
        return `Type: ${this.type} - Error: ${this.message} - Correlation ID: ${this.correlationID}`;
    }
}

export function sendErrorResponse(
    response: Response,
    status: number,
    simpleError: ServerErrorTypes,
    fullError: unknown = null,
): void {
    const correlationId = GeneratorsUtil.generateUUID();
    const wrappedError = new ErrorWrapper(simpleError, correlationId);

    if (fullError instanceof Error) {
        logger.error(wrappedError.toString(), fullError);
    } else if (fullError) {
        logger.error(`${wrappedError.toString()} ||| ${JSON.stringify(fullError)}`);
    } else {
        logger.error(`${wrappedError.toString()} ||| ${correlationId}`);
    }

    sendResponse(response, new ErrorWrapper(simpleError, correlationId), status);
}
