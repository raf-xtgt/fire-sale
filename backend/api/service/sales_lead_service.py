from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.query import Query
import json
import random
from datetime import datetime
from config.appwrite_config import (
    client,
    databases,
    fireSaleDb,
    userProfileCollection,
    socialMediaCollection,
    communicationCollection,
    locationCollection,
    behaviorMetadataCollection
)



def search_social_media_by_keywords(keyword_list, size):
    matched_documents_user_id = []
    all_documents = []
    offset = 0
    while True:
        try:
            # Fetch all documents from the collection (you may want to use pagination for large datasets)
            result = databases.list_documents(
                database_id=fireSaleDb['$id'],
                collection_id=socialMediaCollection['$id'],
                queries=[
                        Query.limit(500),
                        Query.offset(0)
                    ]
            )

            if not result['documents']:
                break
                
            all_documents.extend(result['documents'])
            total_documents = result['total']
            offset += len(result['documents'])
            
            print(f"Fetched {len(all_documents)}/{total_documents} documents...")
            # Exit if we've got all documents
            if len(all_documents) >= total_documents:
                break
                
            if len(all_documents) >= 1000:
                break
    
        except Exception as e:
            print(f"Error fetching documents: {e}")

    # print(len(all_documents))
    for document in all_documents:
        # print(document)
        top_interests_data = json.loads(document.get('top_interests'))
        # print(top_interests_data)
        # top_interests_str =  document.get('top_interests', '{}')
        # print(top_interests_str)
        try:
            # top_interests_data = json.loads(top_interests_str)
            # print(top_interests_data)
            keywords = top_interests_data.get('keywords', [])
            # print(keywords)
            
            if any(
                any(kw.lower() in k.lower() for k in keywords)
                for kw in keyword_list
            ):
                matched_documents_user_id.append(document['user_id'])

    
        except json.JSONDecodeError:
            continue 
    
    return matched_documents_user_id




def get_user_from_id(userId):
    try:
        # Get a random document using cursor
        all_docs = databases.list_documents(
            database_id=fireSaleDb['$id'],
            collection_id=userProfileCollection['$id'],
            queries=[Query.equal('user_id', userId)]
        )['documents']
        
        if not all_docs:
            print("No documents found!")
            return None
            
        return all_docs[0]
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

def get_social_media_docs(userId):
    try:
        # Get a random document using cursor
        all_docs = databases.list_documents(
            database_id=fireSaleDb['$id'],
            collection_id=socialMediaCollection['$id'],
            queries=[Query.equal('user_id', userId)]
        )['documents']
        
        if not all_docs:
            print("No documents found!")
            return None

        # print(f"Found: {str(len(all_docs))} social media points")
        # random_doc = random.choice(all_docs)
        # print(json.dumps(random_doc, indent=2))
        # print("Social media data schema:")
        # print(random_doc)
        return all_docs
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

def get_communication_docs(userId):
    try:
        # Get a random document using cursor
        all_docs = databases.list_documents(
            database_id=fireSaleDb['$id'],
            collection_id=communicationCollection['$id'],
            queries=[Query.equal('user_id', userId)]
        )['documents']
        
        if not all_docs:
            print("No documents found!")
            return None

        # print(f"Found: {str(len(all_docs))} communication points")
        # random_doc = random.choice(all_docs)
        # print(json.dumps(random_doc, indent=2))
        # print("Communication data schema:")
        # print(random_doc)
        return all_docs
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

def get_behavioral_metadata_docs(userId):
    try:
        # Get a random document using cursor
        all_docs = databases.list_documents(
            database_id=fireSaleDb['$id'],
            collection_id=behaviorMetadataCollection['$id'],
            queries=[Query.equal('user_id', userId)]
        )['documents']
        
        if not all_docs:
            print("No documents found!")
            return None

        # print(f"Found: {str(len(all_docs))} behavioral metadata points")
        # random_doc = random.choice(all_docs)
        # print(json.dumps(random_doc, indent=2))
        # print("Behavioral metadata schema:")
        # print(random_doc)
        return all_docs
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return None
    