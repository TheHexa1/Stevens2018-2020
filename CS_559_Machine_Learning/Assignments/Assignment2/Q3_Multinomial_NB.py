#importing utils file
import __init__
from utils import *
import pandas as pd
import numpy as np
import nltk
from nltk.tokenize import RegexpTokenizer
from collections import Counter
from nltk.corpus import stopwords


filepath1 = 'pg1661.txt'
filepath2 = 'pg31100.txt'

#creating corpus from given files
def createCorpus():
	#file1
	f1=open(filepath1,'r')
	raw1 = f1.read()	

	f2=open(filepath2,'r')
	raw2 = f2.read()

	return raw1, raw2

# creating dataset
def createDatasets():
	
	raw1, raw2 = createCorpus()

	ls1 = raw1.split("\n\n")
	df1 = pd.DataFrame(np.array(ls1).reshape(len(ls1),1), columns=['docs'])
	df1['class'] = 1

	ls2 = raw2.split("\n\n")
	df2 = pd.DataFrame(np.array(ls2).reshape(len(ls2),1), columns=['docs'])
	df2['class'] = 2

	#combine both dataframes
	df = pd.concat([df1,df2])
	# df

	# some preprocessing to remove unnecessary rows
	df = df[df['docs'].map(len) > 5]
	# df.head()

	# creating training and testing dataset
	train = df.sample(frac=0.67,random_state=200)
	test = df.drop(train.index)
	# train.head()
	return train, test

#calculate prior probabilities for both classes
def get_priors(train):
	pr_c1 = ((train[train['class']==1].count()) / train.count())[0]
	pr_c2 = 1 - pr_c1

	pr_c = [pr_c1, pr_c2]

	return pr_c

#tokenize given text. If stopwords=True allow stopwords else remove stopwords  
def get_tokens(text, stopwords):
#   print(text)
  tokenizer = RegexpTokenizer(r'\w+')
  tokens = tokenizer.tokenize(text)

  if stopwords:
  	return tokens
  else:
  	return [word for word in tokens if word not in stopwords.words('english')] 

def get_word_probability_per_class(raw1, raw2):

	#dictionary of the form: {'word':count} for each class
	class_1_word_counts = dict(Counter(get_tokens(raw1,True)))
	class_2_word_counts = dict(Counter(get_tokens(raw2,True)))

	#count of total words in each class
	c1_count = len(class_1_word_counts)
	c2_count = len(class_2_word_counts)

	#count of total unique words in both classes combined
	unique_words_with_count = dict(Counter(set(get_tokens(raw1+raw2,True))))
	total_count = len(unique_words_with_count)
	# print(total_count)

	# word probability per class
	class_1_word_prob = {key:((value+0.001)/(c1_count+total_count+1)) for key,value in class_1_word_counts.items()} 
	class_2_word_prob = {key:((value+0.001)/(c2_count+total_count+1)) for key,value in class_2_word_counts.items()} 

	#encapsulating in single dictionary for faster access
	class_word_prob = {1:class_1_word_prob,2:class_2_word_prob}

	return class_word_prob
# print(class_word_prob[1]["the"])

# def get_word_counts(tokens):
#   return dict(Counter(tokens))

def analyze_tf_idf(arr):

	doc_len = np.sum(arr, axis=1)[:,None]

	# term frequency
	tf = arr / doc_len
	#     print(tf)

	# doc frequency
	df_ = np.sum(np.where(arr>0,1,0), axis=0)
	#     print(df_)

	# tfidf
	tf_idf = tf / (np.log(df_)+1)

	# boundary condition to make sure that K is in given range
	#     if (K <= 0 or K > arr.shape[1]):
	#         return tf_idf, "Please enter valid K value!" 

	# indices of words with top K largest values in the tf_idf array
	#     top_k = np.argsort(tf_idf, axis=1)[:,::-1][:,:K]

	return tf_idf
  
def analyze_corpus(df):
    
#     que_df = pd.read_csv(filepath, header=0)
    
#     # converting all documents into tokens for title column
#     que_df.title = (que_df.title.apply(lambda x: x.lower().split(" ")))
    
    df.docs = (df.docs.apply(lambda x: get_tokens(x,True)))
    # print(df.docs)
    m = pd.DataFrame(df.docs.apply(lambda x: np.unique(x, return_counts=True)[1]))
    
    # creating array with all 0's
    result = np.zeros((m.docs.size, m.docs.apply(lambda x: len(x)).max()))
#     print(m.reset_index().docs)
    
    docs = m.reset_index().docs
    docs.dropna(inplace=True)
#     print(docs)
    
    # filling available values(unique token counts) in result array
    for i in range(docs.size): 
        v = docs[i]
#         print(v)
        for j in range(len(v)):
            result[i,j] = v[j]
            
    # analyzing result array and creating tfidf matrix        
    return analyze_tf_idf(result)

def muiltinomial_nb(train, test):  
  
  predictions = []
  pr_c = get_priors(train)
  tf_idf = analyze_corpus(train)
  raw1, raw2 =  createCorpus()
  class_word_prob = get_word_probability_per_class(raw1, raw2)
#   doc_pr = {}   
  row_n = 0
#   print(train.docs)
  
  for doc in test.docs:
    col_n = 0
#     tokens = get_tokens(doc)
    result = {}
    for c in range(0,2):
      result[c+1] = 1
      for word in doc:         
        
#         print(tf_idf[row_n][col_n])
        
        try:
#           print(tf_idf[row_n][col_n])
          tf_idf_ = tf_idf[row_n][col_n]   #get_word_counts(tokens)[word] + 1
          result[c+1] += (tf_idf_) * np.log(class_word_prob[c+1][word])       
        except: 
          result[c+1] += 0
#           print("r")
      col_n += 1
    result[c+1] += np.log(pr_c[c])
    row_n += 1
#     doc_pr[row_n] = result
    
    #predict class with max probabilty for the given document 
    max_pr = max(result, key=result.get)
#     print(max_pr)
    predictions.append(max_pr)
    
  return predictions         

def evaluate_algorithm(train, test):
	scores = {}
	# accuracy_ls = []
	# precision_ls = []
	# recall_ls = []

	predicted = muiltinomial_nb(train, test)
	actual = test["class"].tolist() 

	tp, tn, fp, fn = get_values(actual, predicted)
	accuracy_ = accuracy(tp, tn, fp, fn)
	precision_ = precision(tp, tn, fp)
	recall_ = recall(tp, tn, fn)
	# accuracy_ls.append(accuracy)
	# precision_ls.append(precision)
	# recall_ls.append(recall)   

	scores["Accuracy"] = accuracy_
	scores["Precision"] = precision_
	scores["Recall"] = recall_
  
	return scores

#positive=1 , negative=2
def get_values(actual, predicted):
  tp = tn = fp = fn = p = 0
  # print((actual))
  # print((predicted))
  for a in actual:
    if a == 2 and predicted[p] == 2:
      tn += 1
    elif a == 1 and predicted[p] == 1:  
      tp += 1
    elif a == 1 and predicted[p] == 2:
      fn += 1
    elif a == 2 and predicted[p] == 1:
      fp += 1   
      
    p += 1
  
  return tp, tn, fp, fn

train, test = createDatasets()
results = evaluate_algorithm(train, test)
print("Scores: %s" % results)