import { FastifyReply, FastifyRequest } from 'fastify';
import * as FeedbackService from './feedback-service';
import logger from '../util/logger';

export const createBugReport = async (request: FastifyRequest, reply: FastifyReply) => {
    // @ts-ignore
    const { report }: { report: string; } = request.body;
    try {
        // @ts-ignore
        await FeedbackService.createBugReport(request.user, report);
        reply.send(200);
    } catch (e) {
        logger.error(`Error occured while creating bug report`, e);
        reply.send(500);
    }
}

export const createFeedback = async (request: FastifyRequest, reply: FastifyReply) => {
    // @ts-ignore
    const { feedback }: { feedback: string; } = request.body;
    try {
        // @ts-ignore
        await FeedbackService.createFeedback(request.user, feedback);
        reply.send(200);
    } catch (e) {
        logger.error(`Error occured while creating feedback.`, e);
        reply.send(500);
    }
}