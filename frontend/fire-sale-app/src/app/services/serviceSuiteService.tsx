import { client, account } from '../../../appwrite';
import { ID } from 'appwrite';
import { Databases } from 'appwrite';
import { v4 as uuidv4 } from 'uuid';
import { ServiceSuite } from '../models/serviceSuite';
import { Query } from 'appwrite';
import { EmailHistory } from '../models/emailHistory';
// Initialize the Appwrite Databases service
const databases = new Databases(client);

// Replace with your actual database ID and collection ID
const DATABASE_ID:any = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID:any = process.env.NEXT_PUBLIC_SERVICE_SUITE_COLLECTION;
const USER_PROFILE_COLLECTION_ID:any = process.env.NEXT_PUBLIC_USER_PROFILE_COLLECTION;
const EMAIL_HISTORY_COLLECTION_ID:any = process.env.NEXT_PUBLIC_EMAIL_HISTORY_COLLECTION;

export const serviceSuiteService = {
  async createServiceSuite(serviceSuiteData: ServiceSuite): Promise<any> {
    try {
      // Ensure user is authenticated
      const user = await account.get();
      if (!user) throw new Error('User not authenticated');

      // Add default status if not provided
      const suiteId:string = uuidv4()
      const completeServiceSuite = {
        ...serviceSuiteData,
        label: 'Active',
        name: serviceSuiteData.name,
        service_desc: serviceSuiteData.service_desc,
        suite_id: suiteId
      };
      console.log(completeServiceSuite)

      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        completeServiceSuite
      );

      return response;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  async listServices(): Promise<any> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID
      );
      return response.documents;
    } catch (error) {
      console.error('Error listing service:', error);
      throw error;
    }
  },

  async markAsActiveConsumer(userId: string, newLabel: string): Promise<any> {
    try {
      // First, query for documents with matching user_id
      const response = await databases.listDocuments(
        DATABASE_ID,
        USER_PROFILE_COLLECTION_ID,
        [
          Query.equal('user_id', userId)
        ]
      );

      if (response.documents.length === 0) {
        throw new Error('No service suite found for this user');
      }

      // Assuming we want to update the first matching document
      const documentId = response.documents[0].$id;

      const updatedDoc = await databases.updateDocument(
        DATABASE_ID,
        USER_PROFILE_COLLECTION_ID,
        documentId,
        {
          label: newLabel
        }
      );

      return updatedDoc;
    } catch (error) {
      console.error('Error updating service suite label:', error);
      throw error;
    }
  },

  async listActiveLeads(): Promise<any> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USER_PROFILE_COLLECTION_ID,
        [
          Query.equal('label', 'ACTIVE_SALES_LEAD')
        ]
      );
      return response.documents;
    } catch (error) {
      console.error('Error listing service:', error);
      throw error;
    }
  },

  async createEmailHistory(payload:EmailHistory): Promise<any> {
    try {
      // Ensure user is authenticated
      const user = await account.get();
      if (!user) throw new Error('User not authenticated');

      // Add default status if not provided
      const suiteId:string = uuidv4()
      const emailPayload = {
        ...payload,
        guid: suiteId
      };
      console.log(emailPayload)

      const response = await databases.createDocument(
        DATABASE_ID,
        EMAIL_HISTORY_COLLECTION_ID,
        ID.unique(),
        emailPayload
      );

      return response;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

};