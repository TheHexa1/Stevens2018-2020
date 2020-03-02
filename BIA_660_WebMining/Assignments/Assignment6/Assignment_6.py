from sklearn.feature_extraction.text import CountVectorizer,TfidfVectorizer
from nltk.cluster import KMeansClusterer, cosine_distance
from sklearn.decomposition import LatentDirichletAllocation
import json
from nltk.corpus import stopwords
import pandas as pd
import nltk
from sklearn import metrics
import numpy as np
from numpy import arange
from sklearn.metrics import f1_score
from sklearn.preprocessing import MultiLabelBinarizer


### Helper methods ###
def load_json_file(filepath):
    with open(filepath) as f:
        return json.load(f)
    
def prepare_df(train_file, test_file):       
    
    train_df = pd.DataFrame(load_json_file(train_file), columns=['text'])
    
    test_df = pd.DataFrame(load_json_file(test_file), columns=['text', 'labels'])
    test_df['single_label'] = test_df['labels'].apply(lambda x: x[0])    
    
    return train_df, test_df    



def cluster_kmean(train_file, test_file):
    
    # dataset preparation
    train_df, test_df = prepare_df(train_file, test_file)    

    # parameters
    n_clusters = 3
    MIN_DF = 5
    STOP_WORDS = 'english'
    EPOCHS = 25

    tfidf_vect = TfidfVectorizer(stop_words=STOP_WORDS, min_df=MIN_DF) 
    tfidf= tfidf_vect.fit_transform(train_df['text'])

    cluster_clf = KMeansClusterer(n_clusters, cosine_distance, repeats=EPOCHS)
    clusters = cluster_clf.cluster(tfidf.toarray(), assign_clusters=True)

    test_tfidf = tfidf_vect.transform(test_df['text'])

    preds = [cluster_clf.classify(doc) for doc in test_tfidf.toarray()]

    test_df['cluster_id'] = preds

    # extract ground_truth labels for each cluter
    cluster_0 = test_df['single_label'][test_df.cluster_id==0]
    cluster_1 = test_df['single_label'][test_df.cluster_id==1]
    cluster_2 = test_df['single_label'][test_df.cluster_id==2]

    # cluster and ground_truth label mapping
    cluster_dict = {0: list(nltk.FreqDist(cluster_0).keys())[0],
                    1: list(nltk.FreqDist(cluster_1).keys())[0],
                    2: list(nltk.FreqDist(cluster_2).keys())[0]}

    # Map true label to cluster id
    preds_label = [cluster_dict[i] for i in preds]

    # confusion matrix/table
    confusion_df = pd.DataFrame(list(zip(test_df["single_label"].values, preds)), columns = ["actual class", "cluster"])    
    print(pd.crosstab(index=confusion_df.cluster, columns=confusion_df['actual class']))

    # cluster and topic assigned to it
    print('Cluster 0: Topic',cluster_dict[0])
    print('Cluster 1: Topic',cluster_dict[1])
    print('Cluster 2: Topic',cluster_dict[2])

    # evaluation metrics
    print(metrics.classification_report(test_df["single_label"], preds_label))



def cluster_lda(train_file, test_file):
    topic_assig = None
    labels = None
    
    # dataset preparation
    train_df, test_df = prepare_df(train_file, test_file)
    
    labels = test_df['labels']

    n_topics = 3
    MIN_DF = 5
    MAX_DF = 0.9
    STOP_WORDS = 'english'

    tf_vectorizer = CountVectorizer(max_df=MAX_DF, min_df=MIN_DF, stop_words=STOP_WORDS)

    tf = tf_vectorizer.fit_transform(train_df['text'])

    lda = LatentDirichletAllocation(n_components=n_topics, max_iter=25, verbose=1, evaluate_every=1, n_jobs=1,
                                    random_state=0).fit(tf)

    tf_test = tf_vectorizer.transform(test_df['text'])
    topic_assig=lda.transform(tf_test)
    
    preds = np.argmax(topic_assig, axis=1)

    test_df['cluster_id'] = preds

    # extract ground_truth labels for each cluter
    cluster_0 = test_df['single_label'][test_df.cluster_id==0]
    cluster_1 = test_df['single_label'][test_df.cluster_id==1]
    cluster_2 = test_df['single_label'][test_df.cluster_id==2]

    # cluster and ground_truth label mapping
    cluster_dict = {0: list(nltk.FreqDist(cluster_0).keys())[0],
                    1: list(nltk.FreqDist(cluster_1).keys())[0],
                    2: list(nltk.FreqDist(cluster_2).keys())[0]}

    # Map true label to cluster id
    preds_label = [cluster_dict[i] for i in preds]

    # confusion matrix/table
    confusion_df = pd.DataFrame(list(zip(test_df["single_label"].values, preds)), columns = ["actual class", "cluster"])    
    print(pd.crosstab(index=confusion_df.cluster, columns=confusion_df['actual class']))

    # cluster and topic assigned to it
    print('Cluster 0: Topic',cluster_dict[0])
    print('Cluster 1: Topic',cluster_dict[1])
    print('Cluster 2: Topic',cluster_dict[2])

    # evaluation metrics
    print(metrics.classification_report(test_df["single_label"], preds_label))
    
    return topic_assig, labels



def overlapping_cluster(topic_assign, labels):
    final_thresh, f1 = None, None
    
    df = pd.DataFrame(data=labels, columns=['labels'])
    df['combined_labels'] = df['labels'].apply(lambda x: "_".join(x))
    df['single_label'] = df['labels'].apply(lambda x: x[0])

    unique_labels = list(sorted(set(df['combined_labels'])))
    f1_score_l1 = [] #Travel&Transportation
    f1_score_l2 = [] #Disaster and Accident
    f1_score_l3 = [] #News and Economy
    f1_score_l4 = [] #Disaster and Accident_Travel & Transportation
    f1_score_l5 = [] #News and Economy_Travel & Transportation
    threshold = []
    prediction_df = pd.DataFrame(data=df['combined_labels'])

    for t in arange(0.05, 0.95, 0.05):
        preds = []
        preds_label = []
        threshold.append(t)
        for row in range(topic_assign.shape[0]):        
            labels_ = ""        
            for topic in range(3):
                if topic_assign[row][topic] > t:
                    labels_ += str(topic)            

            if labels_ == "":
                preds.append(df.at[row, 'topic_id'])
            else:
                preds.append(labels_)

        df['topic_id'] = preds

        topic_0 = []
        topic_01 = []
        topic_02 = []
        topic_1 = []
        topic_12 = []
        topic_2 = []

        for i, row in df['combined_labels'].items():
    
            if '0' in df['topic_id'][i]:    
                topic_0.append((row))
            if '1' in df['topic_id'][i]:
                topic_1.append(row)
            if '2' in df['topic_id'][i]:   
                topic_2.append((row))

        topic_dict = { 
                        '0': nltk.FreqDist(topic_0).most_common()[0][0],
                        '01': nltk.FreqDist(topic_1).most_common()[0][0]+'_'+
                                nltk.FreqDist(topic_0).most_common()[0][0],
                        '02': nltk.FreqDist(topic_2).most_common()[0][0]+'_'+
                                nltk.FreqDist(topic_0).most_common()[0][0],
                        '1':  nltk.FreqDist(topic_1).most_common()[0][0],
                        '12': nltk.FreqDist(topic_2).most_common()[0][0]+'_'+
                                nltk.FreqDist(topic_1).most_common()[0][0],
                        '2':  nltk.FreqDist(topic_2).most_common()[0][0],
                        '012': nltk.FreqDist(topic_0).most_common()[0][0]+'_'+
                                nltk.FreqDist(topic_1).most_common()[0][0]+'_'+
                                nltk.FreqDist(topic_2).most_common()[0][0]}
        
        for i in preds:
            preds_label.append(topic_dict[i])

        prediction_df[t] = preds_label
        scores = f1_score(df['combined_labels'], preds_label, unique_labels, average=None)
        
        f1_score_l2.append(scores[0]) #disaster
        f1_score_l3.append(scores[2]) #news
        f1_score_l1.append(scores[4]) #travel
        f1_score_l4.append(scores[1]) #disaster_and_travel
        f1_score_l5.append(scores[3]) #news_and_travel      
        

    print(unique_labels[0]+': ',threshold[np.argmax(f1_score_l2)])
    print(unique_labels[2]+': ',threshold[np.argmax(f1_score_l3)])
    print(unique_labels[4]+': ',threshold[np.argmax(f1_score_l1)])
    print("")
    print(unique_labels[0]+': ',max(f1_score_l2))
    print(unique_labels[2]+': ',max(f1_score_l3))
    print(unique_labels[4]+': ',max(f1_score_l1))
    

    # print("")
#     print("################# Uncomment to display multilabel classification #######################")
    # print(unique_labels[1]+': ',max(f1_score_l4))
    # print(unique_labels[3]+': ',max(f1_score_l5))
    # print("")
    # print(unique_labels[1]+': ',threshold[np.argmax(f1_score_l4)])
    # print(unique_labels[3]+': ',threshold[np.argmax(f1_score_l5)])

    # print(prediction_df[prediction_df['combined_labels']=='News and Economy_Travel & Transportation'])
    # print(prediction_df[prediction_df['combined_labels']=='Disaster and Accident_Travel & Transportation'])
    
    return final_thresh, f1


# In[23]:


if __name__ == "__main__":
    # Due to randomness, you won't get the exact result
    # as shown here, but your result should be close
    # if you tune the parameters carefully
    print('### Q1 ###')
    # Q1
    cluster_kmean('train_text.json', 'test_text.json')
    print("\n### Q2 ###")
    # Q2
    topic_assign, labels = cluster_lda('train_text.json', 'test_text.json')
    print("\n### Q3 ###")
    # Q2
    threshold, f1 = overlapping_cluster(topic_assign, labels)
#     print(threshold)
#     print(f1)






