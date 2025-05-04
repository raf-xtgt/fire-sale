import { client, account } from '../../../appwrite';
import { ID } from 'appwrite';
import { Databases } from 'appwrite';
import { v4 as uuidv4 } from 'uuid';
import { ServiceSuite } from '../models/serviceSuite';

// Initialize the Appwrite Databases service
const databases = new Databases(client);

// Replace with your actual database ID and collection ID
const DATABASE_ID:any = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID:any = process.env.NEXT_PUBLIC_SERVICE_SUITE_COLLECTION;


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
  }
};