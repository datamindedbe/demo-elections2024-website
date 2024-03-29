import { Response } from 'express';

export function sendResponse(response: Response, body: unknown, status = 200): void {
    response.status(status);
    response.json(body);
}
