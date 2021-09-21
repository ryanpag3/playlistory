import logger from '../util/logger';
import { createTestUser } from '../util/test-helper'
import * as FeedbackService from './feedback-service'

it('should create a bug report', async () => {
    const user = await createTestUser();
    const res = await FeedbackService.createBugReport(user, 'automated test report');
    const queried = await FeedbackService.getGithubIssue(res.data.number);
    expect(queried).not.toBeNull();
});

it('should create a feedback report', async () => {
    const user = await createTestUser();
    const res = await FeedbackService.createFeedback(user, 'automated test report');
    const queried = await FeedbackService.getGithubIssue(res.data.number);
    expect(queried).not.toBeNull();
});

it('should throw an exception when invalid user is provided', async () => {
    let thrown = false;
    try {
        // @ts-ignore
        await FeedbackService.createBugReport(undefined, 'test')
    } catch (e) {
        thrown = true;
    }
    expect(thrown).toBeTruthy();
});

it('should throw an exception when an invalid message body is provided', async () => {
    let thrown = false;
    try {
        const user = await createTestUser();
        // @ts-ignore
        await FeedbackService.createBugReport(user, undefined);
    } catch (e) {
        thrown = true;
    }
    expect(thrown).toBeTruthy();
});



