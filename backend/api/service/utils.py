import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import string

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
