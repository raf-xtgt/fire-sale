import { Client, Account } from 'appwrite';

export const client = new Client();
const apiUrl = process.env.APPWRITE_API_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT;

client
    .setEndpoint(apiUrl)
    .setProject(projectId);

export const account = new Account(client);
export { ID } from 'appwrite';
