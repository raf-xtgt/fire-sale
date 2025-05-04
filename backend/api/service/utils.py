import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import string
import requests

# Download NLTK resources (run once)
import nltk
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

def extract_keywords(query, custom_stopwords=None, min_word_length=2):
    """
    Extract meaningful keywords from a search query while preserving user intent.
    
    Args:
        query (str): The search query string
        custom_stopwords (list): Additional stopwords to filter out
        min_word_length (int): Minimum length for words to be considered
        
    Returns:
        list: A list of extracted keywords
    """
    # Initialize lemmatizer
    lemmatizer = WordNetLemmatizer()
    
    # Standard stopwords
    stop_words = set(stopwords.words('english'))
    
    # Add custom stopwords if provided
    if custom_stopwords:
        stop_words.update(custom_stopwords)
    
    # Remove punctuation (except apostrophes for contractions/possessives)
    query = re.sub(r'[^\w\s\']', ' ', query)
    
    # Tokenize the query
    words = word_tokenize(query.lower())
    
    # Filter and process words
    keywords = []
    for word in words:
        # Skip stopwords, short words, and numbers
        if (word not in stop_words and 
            len(word) >= min_word_length and 
            not word.isdigit() and
            word not in string.punctuation):
            
            # Lemmatize the word (reduce to base form)
            lemma = lemmatizer.lemmatize(word)
            keywords.append(lemma)
    
    return keywords

def convert_to_serializable(obj):
    if isinstance(obj, (list, tuple)):
        return [convert_to_serializable(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: convert_to_serializable(value) for key, value in obj.items()}
    elif hasattr(obj, '__dict__'):
        return convert_to_serializable(obj.__dict__)
    elif isinstance(obj, (str, int, float, bool)) or obj is None:
        return obj
    else:
        return str(obj)  # Fallback to string representation

def getResponse(body, url, accessToken):
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer "+accessToken
    }

    response = requests.post(
        url,
        headers=headers,
        json=body
    )

    if response.status_code != 200:
        raise Exception("Non-200 response: " + str(response.text))

    data = response.json()
    return data