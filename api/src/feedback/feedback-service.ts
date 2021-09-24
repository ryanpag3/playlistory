import { User } from '.prisma/client'
import axios from 'axios'
import logger from '../util/logger';

export const createBugReport = async (user: User, report: string) => {
    logger.debug(`creating bug report for user ${user.id}`);
    const title = `Playlistory Bug Report submitted by ${user.email}`;
    const body = report;
    const labels = ['bug'];
    return createGithubIssue(title, body, labels);
}

export const createFeedback = async (user: User, feedback: string) => {
    logger.debug(`creating feedback for user ${user.id}`);
    const title = `Playlistory Feedback submitted by ${user.email}`;
    const body = feedback;
    const labels = ['enhancement'];
    return createGithubIssue(title, body, labels);
}

const createGithubIssue = async (title: string, body: string, labels: string[]) => {
    if (!body || (!labels.includes('bug') && !labels.includes('enhancement')))
        throw new Error(`Invalid parameters provided for issue creation.`);

    return axios(`https://api.github.com/repos/${process.env.PLAYLISTORY_GITHUB_REPO}/issues`,
    {
        method: 'POST',
        auth: {
            username: process.env.PLAYLISTORY_GITHUB_USERNAME as any,
            password: process.env.PLAYLISTORY_GITHUB_TOKEN as any
        },
        headers: {
            'Accept':'application/vnd.github.v3+json'
        },
        data: {
            title,
            labels,
            body
        }
    });
}

export const getGithubIssue = async (issueNumber: number) => {
    return axios(`https://api.github.com/repos/${process.env.PLAYLISTORY_GITHUB_REPO}/issues/${issueNumber}}`,
    {
        method: 'GET',
        auth: {
            username: process.env.PLAYLISTORY_GITHUB_USERNAME as any,
            password: process.env.PLAYLISTORY_GITHUB_TOKEN as any
        },
        headers: {
            'Accept':'application/vnd.github.v3+json'
        }
    })
}