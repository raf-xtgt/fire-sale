# config/appwrite_config.py
import os
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.id import ID
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Appwrite client
client = Client()
client.set_endpoint(os.getenv('APPWRITE_API_ENDPOINT'))
client.set_project(os.getenv('APPWRITE_PROJECT'))
client.set_key(os.getenv('APPWRITE_API_KEY'))

# Initialize Databases service
databases = Databases(client)
database_name = 'fire-sale-db'

# Initialize database and collections
fireSaleDb = None
userProfileCollection = None
socialMediaCollection = None
communicationCollection = None
locationCollection = None
behaviorMetadataCollection = None
serviceSuiteCollection = None

def initialize_database():
    global fireSaleDb
    
    try:
        # Try to get the database to see if it exists
        database_list = databases.list()
        existing_db = next((db for db in database_list['databases'] if db['name'] == database_name), None)
        
        if existing_db:
            fireSaleDb = existing_db
            print(f"Database '{database_name}' already exists with ID: {existing_db['$id']}")
        else:
            # Create the database if it doesn't exist
            fireSaleDb = databases.create(
                database_id=ID.unique(),
                name=database_name
            )
            print(f"Created new database '{database_name}' with ID: {fireSaleDb['$id']}")
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise

def prepare_user_profile_collection():
  global userProfileCollection
  try:
    collections = databases.list_collections(database_id=fireSaleDb['$id'])
    for collection in collections['collections']:
        if collection['name'] == 'user-profile':
            userProfileCollection = collection
            print("User profile collection already exists")
            return
  except Exception as e:
    print(f"Error checking for existing collection: {e}")
      
    
  userProfileCollection = databases.create_collection(
    database_id=fireSaleDb['$id'],
    collection_id=ID.unique(),
    name='user-profile'
  )

  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=userProfileCollection['$id'],
    key='user_id',
    size=255,
    required=True
  )

  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=userProfileCollection['$id'],
    key='name',
    size=255,
    required=False
  )

  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=userProfileCollection['$id'],
    key='email',
    size=255,
    required=False
  )
    
  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=userProfileCollection['$id'],
    key='label',
    size=255,
    required=True
  )
    
  databases.create_integer_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=userProfileCollection['$id'],
    key='age',
    required=False,
    min=18,
    max=150
  )
    
  databases.create_datetime_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=userProfileCollection['$id'],
    key='signup_date',
    required=True
  )

  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=userProfileCollection['$id'],
    key='consumer_type',
    size=100,
    required=False
  )
  
  print("User profile collection created successfully !")

def prepare_social_media_collection():
    global socialMediaCollection

    try:
        collections = databases.list_collections(database_id=fireSaleDb['$id'])
        for collection in collections['collections']:
            if collection['name'] == 'social-media':
                socialMediaCollection = collection
                print("Social media collection already exists")
                return
    except Exception as e:
        print(f"Error checking for existing collection: {e}")
    
    # If collection doesn't exist, create it
    socialMediaCollection = databases.create_collection(
        database_id=fireSaleDb['$id'],
        collection_id=ID.unique(),
        name='social-media'
    )

    # Create all the attributes
    databases.create_string_attribute(
        database_id=fireSaleDb['$id'],
        collection_id=socialMediaCollection['$id'],
        key='guid',
        size=255,
        required=True
    )
        
    databases.create_string_attribute(
        database_id=fireSaleDb['$id'],
        collection_id=socialMediaCollection['$id'],
        key='user_id',
        size=255,
        required=False
    )

    databases.create_string_attribute(
        database_id=fireSaleDb['$id'],
        collection_id=socialMediaCollection['$id'],
        key='platform',
        size=255,
        required=False
    )

    databases.create_integer_attribute(
        database_id=fireSaleDb['$id'],
        collection_id=socialMediaCollection['$id'],
        key='post_count',
        required=False,
        min=0
    )  

    databases.create_integer_attribute(
        database_id=fireSaleDb['$id'],
        collection_id=socialMediaCollection['$id'],
        key='like_count',
        required=False,
        min=0
    )  

    databases.create_string_attribute(
        database_id=fireSaleDb['$id'],
        collection_id=socialMediaCollection['$id'],
        key='groups',
        required=False, 
        size=131072
    )    
        
    databases.create_integer_attribute(
        database_id=fireSaleDb['$id'],
        collection_id=socialMediaCollection['$id'],
        key='follower_count',
        required=False,
        min=0
    ) 
        
    databases.create_string_attribute(
        database_id=fireSaleDb['$id'],
        collection_id=socialMediaCollection['$id'],
        key='top_interests',
        required=False, 
        size=131072
    )  
        
    databases.create_datetime_attribute(
        database_id=fireSaleDb['$id'],
        collection_id=socialMediaCollection['$id'],
        key='last_active',
        required=True
    )
    
    print("Created new social media collection")


def prepare_communication_collection():
  global communicationCollection
  try:
    collections = databases.list_collections(database_id=fireSaleDb['$id'])
    for collection in collections['collections']:
        if collection['name'] == 'communication':
            communicationCollection = collection
            print("Communication collection already exists")
            return
  except Exception as e:
    print(f"Error checking for existing collection: {e}")
    

  communicationCollection = databases.create_collection(
    database_id=fireSaleDb['$id'],
    collection_id=ID.unique(),
    name='communication'
  )

  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=communicationCollection['$id'],
    key='guid',
    size=255,
    required=True
  )
    
  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=communicationCollection['$id'],
    key='user_id',
    size=255,
    required=False
  )

  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=communicationCollection['$id'],
    key='medium',
    size=255,
    required=False
  )
    
  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=communicationCollection['$id'],
    key='contacted_user_id',
    size=255,
    required=False
  )

  databases.create_integer_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=communicationCollection['$id'],
    key='interaction_count',
    required=False,
    min=0
  )  

  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=communicationCollection['$id'],
    key='topics',
    required=False, 
    size=131072
  )    
    
  databases.create_datetime_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=communicationCollection['$id'],
    key='last_contact_date',
    required=False
  )
  print("Communication collection created successfully !")


def prepare_location_collection():
  global locationCollection
  try:
    collections = databases.list_collections(database_id=fireSaleDb['$id'])
    for collection in collections['collections']:
        if collection['name'] == 'location':
            locationCollection = collection
            print("Location collection already exists")
            return
  except Exception as e:
    print(f"Error checking for existing collection: {e}")

    
  locationCollection = databases.create_collection(
    database_id=fireSaleDb['$id'],
    collection_id=ID.unique(),
    name='location'
  )

  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=locationCollection['$id'],
    key='guid',
    size=255,
    required=True
  )
    
  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=locationCollection['$id'],
    key='user_id',
    size=255,
    required=False
  )

  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=locationCollection['$id'],
    key='location_name',
    size=255,
    required=False
  )
    
  databases.create_float_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=locationCollection['$id'],
    key='latitude',
    required=False
  )
    
  databases.create_float_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=locationCollection['$id'],
    key='longitude',
    required=False
  )
   
  databases.create_datetime_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=locationCollection['$id'],
    key='check_in_time',
    required=False
  )
    
  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=locationCollection['$id'],
    key='companions',
    required=False, 
    size=131072
  )
  print("Location collection created successfully !")



def prepare_behavior_metadata_collection():
  global behaviorMetadataCollection
  try:
    collections = databases.list_collections(database_id=fireSaleDb['$id'])
    for collection in collections['collections']:
        if collection['name'] == 'behavioral-metadata':
            behaviorMetadataCollection = collection
            print("Behavioral metadata collection already exists")
            return
  except Exception as e:
    print(f"Error checking for existing collection: {e}")

  behaviorMetadataCollection = databases.create_collection(
    database_id=fireSaleDb['$id'],
    collection_id=ID.unique(),
    name='behavioral-metadata'
  )

  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=behaviorMetadataCollection['$id'],
    key='guid',
    size=255,
    required=True
  )
    
  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=behaviorMetadataCollection['$id'],
    key='user_id',
    size=255,
    required=False
  )

  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=behaviorMetadataCollection['$id'],
    key='device_type',
    size=255,
    required=False
  )

  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=behaviorMetadataCollection['$id'],
    key='active_hours',
    size=255,
    required=False
  )
      
  databases.create_float_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=behaviorMetadataCollection['$id'],
    key='average_daily_screen_time',
    required=False
  )

  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=behaviorMetadataCollection['$id'],
    key='preferred_app_categories',
    required=False, 
    size=131072
  )
  print("Behavioral metadata collection created successfully !")


def prepare_service_suite_collection():
  global serviceSuiteCollection
  try:
    collections = databases.list_collections(database_id=fireSaleDb['$id'])
    for collection in collections['collections']:
        if collection['name'] == 'service-suite':
            serviceSuiteCollection = collection
            print("Service suite collection already exists")
            return
  except Exception as e:
    print(f"Error checking for existing collection: {e}")
      
    
  serviceSuiteCollection = databases.create_collection(
    database_id=fireSaleDb['$id'],
    collection_id=ID.unique(),
    name='service-suite'
  )

  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=serviceSuiteCollection['$id'],
    key='suite_id',
    size=255,
    required=True
  )

  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=serviceSuiteCollection['$id'],
    key='name',
    size=255,
    required=False
  )

  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=serviceSuiteCollection['$id'],
    key='service-desc',
    size=5000,
    required=False
  )

   
  databases.create_string_attribute(
    database_id=fireSaleDb['$id'],
    collection_id=serviceSuiteCollection['$id'],
    key='label',
    size=255,
    required=True
  )
   
  print("Service suite collection created successfully !")

def initialize_appwrite():
    """Initialize all Appwrite resources"""
    initialize_database()
    prepare_user_profile_collection()
    prepare_social_media_collection()
    prepare_communication_collection()
    prepare_location_collection()
    prepare_behavior_metadata_collection()
    prepare_service_suite_collection()

# Initialize everything when this module is imported
initialize_appwrite()