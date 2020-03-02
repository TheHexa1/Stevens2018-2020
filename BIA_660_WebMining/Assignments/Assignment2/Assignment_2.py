#!/usr/bin/env python
# coding: utf-8

# # <center>Assignment 2</center>

# ## Q1. Define a function to analyze a numpy array
#  - Assume we have an array (with shape (M,N)) which contains term frequency of each document, where each row is a document, each column is a word, and the corresponding value denotes the frequency of the word in the document. Define a function named "analyze_tf_idf" which:
#       * takes the **array**, and an integer **K** as the parameters.
#       * normalizes the frequency of each word as: word frequency divided by the length of the document. Save the result as an array named **tf** (i.e. term frequency)
#       * calculates the document frequency (**df**) of each word, e.g. how many documents contain a specific word
#       * calculates **tf_idf** array as: **tf / (log(df)+1)** (tf divided by log(df)). The reason is, if a word appears in most documents, it does not have the discriminative power and often is called a "stop" word. The inverse of df can downgrade the weight of such words.
#       * for each document, finds out the **indexes of words with top K largest values in the tf_idf array**, ($0<K<=N$). These indexes form an array, say **top_K**, with shape (M, K)
#       * returns the tf_idf array, and the top_K array.
#  - Note, for all the steps, ** do not use any loop**. Just use array functions and broadcasting for high performance computation.

# ## Q2. Define a function to analyze stackoverflow dataset using pandas
#  - Define a function named "analyze_data" to do the follows:
#    * Take a csv file path string as an input. Assume the csv file is in the format of the provided sample file (question.csv).
#    * Read the csv file as a dataframe with the first row as column names
#    * Find questions with top 3 viewcounts among those answered questions (i.e answercount>0). Print the title and viewcount columns of these questions.
#    * Find the top 5 users (i.e. quest_name) who asked the most questions.
#    * Create a new column called "first_tag" to store the very first tag in the "tags" column (hint: use "apply" function; tags are separted by ", ")
#    * Show the mean, min, and max viewcount values for each of these tags: "python", "pandas" and "dataframe"
#    * Create a cross tab with answercount as row indexes, first_tag as column names, and the count of samples as the value. For "python" question (i.e. first_tag="python"), how many questions were not answered (i.e., answercount=0), how many questions were answered once (i.e., answercount=1), and how many questions were anasered twice  (i.e., answercount=2)? Print these numbers.
#  - This function does not have any return. Just print out the result of each calculation step.

# ## Q3 (Bonus). Analyzed a collection of documents
#  - Define a function named "analyze_corpus" to do the follows:
#    * Similar to Q2, take a csv file path string as an input. Assume the csv file is in the format of the provided sample file (question.csv).
#    * Read the "title" column from the csv file and convert it to lower case
#    * Split each string in the "title" column by space to get tokens. Create an array where each row represents a title, each column denotes a unique token, and each value denotes the count of the token in the document
#    * Call your function in Q1 (i.e. analyze_tf_idf) to analyze this array
#    * Print out the top 5 words by tf-idf score for the first 20 questions. Do you think these top words allow you to find similar questions or differentiate a question from dissimilar ones? Write your analysis as a pdf file.
#    
# - This function does not have any return. Just print out the result if asked.
#    

# ## Submission Guideline##
# - Following the solution template provided below. Use __main__ block to test your functions
# - Save your code into a python file (e.g. assign2.py) that can be run in a python 3 environment. In Jupyter Notebook, you can export notebook as .py file in menu "File->Download as".
# - Make sure you have all import statements. To test your code, open a command window in your current python working folder, type "python assign2.py" to see if it can run successfully.
# - **Each homework assignment should be completed independently. Never ever copy others' work**

# In[3]:


# Structure of your solution to Assignment 1 
import pandas as pd
import numpy as np

def analyze_data(filepath):
    
    que_df = pd.read_csv(filepath, header=0)
    
    # questions with top 3 viewcounts among those answered questions
    print((que_df.sort_values(by="viewcount", ascending=False)[que_df.answercount>0])[['title','viewcount']].iloc[:3])
    print("")
    
    # top 5 users (i.e. quest_name) who asked the most questions
    print("Top 5 users, who asked the most questions:")
    print(que_df.quest_name.value_counts()[:5])
    print("")
    
    # first_tag column
    que_df['first_tag'] = que_df["tags"].apply(lambda x:x.split(",")[0])

    # from 'first_tag' column ######################
    # mean, max, min viewcount for python:
    print("Based on first_tag column:")
    print("For python:")
    print((que_df['viewcount'][que_df.first_tag == 'python']).agg([ np.min, np.mean, np.max]))    
    # mean, max, min viewcount for pandas:
    print("For pandas:")
    print((que_df['viewcount'][que_df.first_tag == 'pandas']).agg([ np.min, np.mean, np.max]))    
    # mean, max, min viewcount for dataframe:
    print("For dataframe:")
    print((que_df['viewcount'][que_df.first_tag == 'dataframe']).agg([ np.min, np.mean, np.max]))
    print("")
    
    # from 'tags' column ######################
    # mean, max, min viewcount for python:
    print("Based on tags column:")
    print("For python:")
    print((que_df['viewcount'][que_df.tags.apply(lambda x: 'python' in x)]).agg([ np.min, np.mean, np.max]))
    # mean, max, min viewcount for pandas:
    print("For pandas:")
    print((que_df['viewcount'][que_df.tags.apply(lambda x: 'pandas' in x)]).agg([ np.min, np.mean, np.max]))
    # mean, max, min viewcount for dataframe:
    print("For dataframe:")
    print((que_df['viewcount'][que_df.tags.apply(lambda x: 'dataframe' in x)]).agg([ np.min, np.mean, np.max]))
    print("")
    
    cr_tab = pd.crosstab(index=que_df.answercount, columns=[que_df.first_tag])
    print(cr_tab)
    print("")
    print("For python,")
    print("how many questions were not answered?: %d"%cr_tab['python'].loc[0])
    print("how many questions were answered once?: %d"%cr_tab['python'].loc[1])
    print("how many questions were anasered twice?: %d"%cr_tab['python'].loc[2])
    print("")    
    
def analyze_tf_idf(arr,K):
    
    doc_len = np.sum(arr, axis=1)[:,None]
    
    # term frequency
    tf = arr / doc_len
    
    # doc frequency
    df = np.sum(np.where(arr>0,1,0), axis=0)
    
    # tfidf
    tf_idf = tf / (np.log(df)+1)

    # boundary condition to make sure that K is in given range
    if (K <= 0 or K > arr.shape[1]):
        return tf_idf, "Please enter valid K value!" 
    
    # indices of words with top K largest values in the tf_idf array
    top_k = np.argsort(tf_idf, axis=1)[:,::-1][:,:K]
    
    return tf_idf, top_k


def analyze_corpus(filepath):
    
    que_df = pd.read_csv(filepath, header=0)
    
    # converting all documents into tokens for title column
    que_df.title = (que_df.title.apply(lambda x: x.lower().split(" ")))
    
    m = pd.DataFrame(que_df.title.apply(lambda x: np.unique(x, return_counts=True)[1]))
    
    # creating array with all 0's
    result = np.zeros((m.title.size, m.title.apply(lambda x: len(x)).max()))
    print(result.shape)
    
    # filling available values(unique token counts) in result array
    for i in range(m.title.size): 
        v = m.title[i]
        for j in range(len(v)):
            result[i,j] = v[j]
            
    # analyzing result array and creating tfidf matrix        
    tf_idf, indices = analyze_tf_idf(result, 5)
    
    # extracting top 5 words(if available) for first 20 questions 
    print("Top 5 words for first 20 questions:")
    for i in range(len(indices[:20])):
        print("q%d"%(i+1), end=":")
        for j in range(5):
            if j == len(que_df.title[i]):
                continue            
            print(que_df.title[i][indices[i][j]], end=',')
        print("")  


# best practice to test your class
# if your script is exported as a module,
# the following part is ignored
# this is equivalent to main() in Java

if __name__ == "__main__":  
    
    # Test Question 1
    arr=np.array([[0,1,0,2,0,1],[1,0,1,1,2,0],[0,0,2,0,0,1]])
    
    print("\nQ1")
    tf_idf, top_k=analyze_tf_idf(arr,3)
    print(top_k)
    
    print("\nQ2")
    analyze_data('question.csv')
    
    # test question 3
    print("\nQ3")
    analyze_corpus('question.csv')


# In[ ]:




