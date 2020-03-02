import re
import pandas as pd
import spacy
import numpy as np
from scipy.spatial import distance
from sklearn.preprocessing import normalize


nlp = spacy.load('en')


#Q1
def extract(text):    
    result = None
    
    #pattern to be matched in regex function
    pattern = r'\s*(.*), (.*[^,]),? \(.*(\d{4}).*(\d{3},\d{3})'    
    result = re.findall(pattern, text)    
    return result

#Q2
def tokenize(doc, lemmatized=False, no_stopword=False):
    tokens =[]
    
    doc_ = nlp(doc)   
    
    for token in doc_:
        if no_stopword:
            if token.is_stop:
                continue

        if lemmatized:
            tokens.append(token.lemma_)
        else:
            tokens.append(token.text)    
    return tokens

def get_similarity(q1, q2, lemmatized=False, no_stopword=False):
    sim = []   
    
    #combine all questions
    total_q = q1 + q2
    
    #get combined tf-idf matrix
    tf_idf = tfidf(total_q, lemmatized, no_stopword)
    
    #we will get 1000x1000 similarity matrix with q1 and q2 list concated. 
    #hence, slicing from 500 to get pairwise similarity for each q1 and q2                                      
    pairwise_matrix = 1-distance.squareform(distance.pdist(tf_idf, 'cosine'))[:500,500:]
    
    sim = [pairwise_matrix[i][i] for i in range(500)]
    
    return sim

def predict(sim, ground_truth, threshold=0.5):
    predict = []
    recall = None
    
    for score in sim:
        if score > threshold:
            predict.append(1)
        else:
            predict.append(0)
            
    tp = getTruePositives(predict, ground_truth)      
    recall = tp/list(ground_truth).count(1)            
    return predict, recall

#get the token count for given document
def get_doc_tokens(doc, lemmatized, no_stopword):
    tokens=[token for token in tokenize(doc.lower(), lemmatized, no_stopword)]
    
    token_count={token:tokens.count(token) for token in set(tokens)}
    return token_count

#get tf-idf matrix
def tfidf(docs, lemmatized, no_stopword):
    # process all documents to get list of tokens
    docs_tokens={idx:get_doc_tokens(doc, lemmatized, no_stopword)              for idx,doc in enumerate(docs)}    

    # get document-term matrix
    dtm=pd.DataFrame.from_dict(docs_tokens, orient="index" )
    dtm=dtm.fillna(0)
      
    # get normalized term frequency (tf) matrix        
    tf=dtm.values
    doc_len=tf.sum(axis=1)
    tf=np.divide(tf.T, doc_len).T
    
    # get idf
    df=np.where(tf>0,1,0)
    smoothed_idf=np.log(np.divide(len(docs)+1, np.sum(df, axis=0)+1))+1        
    smoothed_tf_idf=normalize(tf*smoothed_idf)    
    return smoothed_tf_idf

#count number of true positives
def getTruePositives(predictions, ground_truth):    
    tp = 0
            
    for i in range(len(predictions)):
        if predictions[i] == 1 and ground_truth[i] == 1:
            tp += 1
            
    return tp

#Q3
def evaluate(sim, ground_truth, thresold=0.5):
    precision = None
    recall = None
    
    predictions, recall = predict(sim, ground_truth, thresold)    
    tp = getTruePositives(predictions, ground_truth)    
    precision = tp/predictions.count(1)        
    return precision, recall


if __name__ == "__main__":
    
    # Test Q1
    text='''Following is total compensation for other presidents at pr
    ivate colleges in Ohio in 2015:
    
    Grant Cornwell, College of Wooster (left in 2015): $911,651
    Marvin Krislov, Oberlin College (left in 2016): $829,913
    Mark Roosevelt, Antioch College, (left in 2015): $507,672
    Laurie Joyner, Wittenberg University (left in 2015): $463,504
    Richard Giese, University of Mount Union (left in 2015): $453,800'''
    
    print("##### Test Q1 #####\n")
    print(extract(text))
    
    data=pd.read_csv("quora_duplicate_question_500.csv",
    header=0)
    q1 = data["q1"].values.tolist()
    q2 = data["q2"].values.tolist()
    
    # Test Q2
    print("\n##### Test Q2 #####")
    print("\nlemmatized: No, no_stopword: No")    
    sim = get_similarity(q1,q2)
    pred, recall=predict(sim, data["is_duplicate"].values)    
    print(recall)

    print("\nlemmatized: Yes, no_stopword: No")    
    sim = get_similarity(q1,q2, True)
    pred, recall=predict(sim, data["is_duplicate"].values)    
    print(recall)

    print("\nlemmatized: No, no_stopword: Yes")    
    sim = get_similarity(q1,q2, False, True)
    pred, recall=predict(sim, data["is_duplicate"].values)    
    print(recall)

    print("\nlemmatized: Yes, no_stopword: Yes")    
    sim = get_similarity(q1,q2, True, True)
    pred, recall=predict(sim, data["is_duplicate"].values)
    print(recall)
    
    # Test Q3. Get similarity score, set threshold, and then
    print("\n##### Test Q3 #####\n")
    prec, rec = evaluate(sim, data["is_duplicate"].values, 0.5)    
    print("Precision:{}\nRecall:{}".format(prec,rec))




