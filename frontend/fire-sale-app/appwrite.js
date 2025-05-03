import { Client, Account } from 'appwrite';

export const client = new Client();
const apiUrl = process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;

client
    .setEndpoint(apiUrl)
    .setProject(projectId);

export const account = new Account(client);
export { ID } from 'appwrite';
