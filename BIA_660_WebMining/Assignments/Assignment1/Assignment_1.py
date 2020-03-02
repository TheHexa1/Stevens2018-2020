#!/usr/bin/env python
# coding: utf-8

# # <center>Assignment 1</center>

# ## Q1. Define a function to analyze the frequency of words in a string ##
#  - Define a function named "**tokenize**" which does the following:
#      * has a string as an input 
#      * splits the string into a list of tokens by space. For example, "it's hello world!" will be split into two tokens ["it's", "hello","world!"]
#      * removes all spaces around each token (including tabs, newline characters ("\n"))
#      * if a token starts with or ends with a punctuation, remove the punctuation, e.g. "world<font color="red">!</font>" -> "world",  "<font color="red">'</font>hello<font color="red">'</font>"->"hello" (<font color="blue">hint, you can use *string.punctuation* to get a list of punctuations, where *string* is a module you can import</font>)
#      * removes empty tokens, i.e. *len*(token)==0
#      * converts all tokens into lower case
#      * returns all the tokens as a list output
#     

# ## Q2. Define a class to analyze a document ##
#  - Define a new class called "**Text_Analyzer**" which does the following :
#     - has two attributes: 
#         * **input_string**, which receives the string value passed by users when creating an object of this class.
#         * **token_count**, which is set to {} when an object of this class is created.
#         
#     - a function named "**analyze**" that does the following:
#       * calls the function "tokenize" to get a list of tokens. 
#       * creates a dictionary containing the count of every unique token, e.g. {'it': 5, 'hello':1,...}
#       * saves this dictionary to the token_count attribute
#     - a function named "**topN**" that returns the top N words by frequency
#       * has a integer parameter *N*  
#       * returns the top *N* words and their counts as a list of tuples, e.g. [("hello", 5), ("world", 4),...] (<font color="blue">hint: By default, a dictionary is sorted by key. However, you need to sort the token_count dictionary by value</font>)
#   
# - What kind of words usually have high frequency? Write your analysis.      

# ## Q3. (Bonus) Create Bigrams from a document ##
# 
# A bigram is any pair of consecutive tokens in a document. Phrases are usually bigrams. Let's design a function to find phrases.
#  - Create a new function called "**bigram**" which does the following :
#      * takes a **string** and an integer **N** as inputs
#      * calls the function "tokenize" to get a list of tokens for the input string
#      * slice the list to get any two consecutive tokens as a bigram. For example ["it's", "hello","world"] will generate two bigrams: [["it's", "hello"],["hello","world"]]
#      * count the frequency of each unique bigram
#      * return top N bigrams and their counts 
#  - Are you able to find good phrases from the top N bigrams? Write down your analysis in a document.

# ## Submission Guideline##
# - Following the solution template provided below. Use __main__ block to test your functions and class
# - Save your code into a python file (e.g. assign1.py) that can be run in a python 3 environment. In Jupyter Notebook, you can export notebook as .py file in menu "File->Download as".
# - Make sure you have all import statements. To test your code, open a command window in your current python working folder, type "python assign1.py" to see if it can run successfully.
# - For more details, check assignment submission guideline on Canvas

# In[12]:


# Structure of your solution to Assignment 1 

import csv
import re
import string

def tokenize(text):
    
    tokens=[]
    
    #checking boundary conditions
    if not text or type(text) is not str:
        return "Not a valid input!"
    
    tokens = re.split('[' + string.punctuation + '\n\t\s' + ']', text.strip().lower())
    
    return [x for x in tokens if len(x) > 0]

class Text_Analyzer(object):
    
    def __init__(self, text):
        
        # attributes initialization
        self.input_string = text
        self.token_count = {}
          
    def analyze(self):
        
        # create a list of tokens from given text
        tokens = tokenize(self.input_string)
        
        # create a dictionary containing the count of every unique token
        self.token_count = {x:tokens.count(x) for x in tokens}
        
    def topN(self, N):
        
        # sort dictionary in reverse order and take out top N elements
        self.token_count = dict(sorted(self.token_count.items(), key=lambda x: x[1], reverse=True)[:N])
        
        return [(w, c) for w,c in self.token_count.items()]

def bigram(doc, N):
    
    result=[]
    
    tokens = tokenize(doc)
    
    # creating list of tuples to make tuples as keys in dictionary, because dict keys should be immutable
    bigrams = [(tokens[s1], tokens[s1+1]) for s1 in range(len(tokens)) if s1!=len(tokens)-1]
    
    # create a dictionary containing the count of every unique token
    big_dict = {x:bigrams.count(x) for x in bigrams}
    
    # sort dictionary in reverse order and take out top N elements
    big_dict = dict(sorted(big_dict.items(), key=lambda x: x[1], reverse=True)[:N])
    
    result = [d for d in big_dict.items()]
    
    return result

# best practice to test your class
# if your script is exported as a module,
# the following part is ignored
# this is equivalent to main() in Java

if __name__ == "__main__":  
    
    # Test Question 1
    text=''' There was nothing so VERY remarkable in that; nor did Alice
think it so VERY much out of the way to hear the Rabbit say to
itself, `Oh dear!  Oh dear!  I shall be late!'  (when she thought
it over afterwards, it occurred to her that she ought to have
wondered at this, but at the time it all seemed quite natural);
but when the Rabbit actually TOOK A WATCH OUT OF ITS WAISTCOAT-
POCKET, and looked at it, and then hurried on, Alice started to
her feet, for it flashed across her mind that she had never
before seen a rabbit with either a waistcoat-pocket, or a watch to
take out of it, and burning with curiosity, she ran across the
field after it, and fortunately was just in time to see it pop
down a large rabbit-hole under the hedge.
'''   
    print("Test Q1:")
    print(tokenize(text))
    
    
    # Test Question 2
    print("\nTest Q2:")
    
    analyzer=Text_Analyzer(text)
    analyzer.analyze()
    print(analyzer.topN(5))
    
    #3 Test Question 3    
    print("\nTest Q3:")
    top_bigrams=bigram(text, 5)
    print(top_bigrams)
    
    


# In[ ]:




