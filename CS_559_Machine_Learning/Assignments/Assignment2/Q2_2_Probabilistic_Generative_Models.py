#importing utils file
import __init__
from utils import *
# from utils import sigmoid
# from utils import get_values
# from u
import pandas as pd
import numpy as np
from random import randrange

#datafile is expected be in same directory as this python file
filepath = "breast-cancer-wisconsin.data.txt"

#this function will only work for given breast-cancer-wisconsin.data dataset
def datasetPreprocessing():

	df_breast_cancer = pd.read_csv(filepath, header=None)
	df_breast_cancer.replace('?',np.nan, inplace=True)

	df_breast_cancer.isnull().any(axis=1)
	df_breast_cancer.dropna(axis=0, inplace=True)
	df_breast_cancer.reset_index(inplace=True)

	X = df_breast_cancer[[1,2,3,4,5,6,7,8,9,10]]
	X[X[10] == 4][[1,2,3,4,5,6,7,8,9]]

	X[10] = X[10].apply(lambda x: np.where(x == 2, 0, 1))
	return X
	# X.head()
	# X = X.values
	# list(X.values)  

def calculate_coeffs(X):
  
    N, M = X.shape
    K = 2

    prior_prs = np.zeros([K, 1])
    sample_means = np.zeros([K, M-1])
    covariance_sigma = np.zeros([M-1, M-1])      

    for k in range(K):
        X_class = X[X[10] == k][[1,2,3,4,5,6,7,8,9]]        
#         print(X_class)
        x_class = X_class.values.astype(float)
#         print(x_class)
        len_x_class = float(len(x_class))
        prior_prs[k] = len_x_class / N
#         print(prior_prs[k])
        sample_means[k] = np.mean(x_class, axis=0)
#         print(sample_means[k])        
        sample_means_diff = (x_class - sample_means[k]).T.dot(x_class - sample_means[k])
#         print(sample_means_diff)
        covariance_sigma += prior_prs[k] * ((sample_means_diff)/len_x_class)
#         print(covariance_sigma)
    covariance_sigma_inv = np.asarray(np.linalg.pinv(covariance_sigma))
#     print(covariance_sigma_inv)

#     for k in range(K):
    w = (covariance_sigma_inv.dot(sample_means[0]-sample_means[1]))
    
#     print(np.log(prior_prs[0]/prior_prs[1]))

    w_0 = (-1.0 / 2) * (sample_means[0].T.dot(covariance_sigma_inv.dot(sample_means[0])) -  
                        sample_means[1].T.dot(covariance_sigma_inv.dot(sample_means[1]))) + np.log(prior_prs[0]/prior_prs[1])   
    
    return w, w_0
  
def predict(data, w, w_0):
  
  # w, w_0 = coeff
  # X_ = X[[1,2,3,4,5,6,7,8,9]].astype(float)
  X_ = data[[1,2,3,4,5,6,7,8,9]].astype(float)
  # print(w[:, None].shape)
  # print(X_.T.shape)
  decision_boundary = X_.dot(w.reshape(9,1)) + w_0 #.dot(X_)
  return sigmoid(decision_boundary)

def probabilistic_generative_model(train, test):
	
	# print(pd.DataFrame(train, columns=[1,2,3,4,5,6,7,8,9,10]))

	# df1 = pd.DataFrame(train[0])[[1,2,3,4,5,6,7,8,9,10]]
	# df2 = pd.DataFrame(train[1])[[1,2,3,4,5,6,7,8,9,10]]
	# df2 = pd.DataFrame(train[2])[[1,2,3,4,5,6,7,8,9,10]]
	# df2 = pd.DataFrame(train[3])[[1,2,3,4,5,6,7,8,9,10]]

	# ls = []
	# for i in range(len(train)):
		# ls.append(pd.DataFrame(train[i], columns=[1,2,3,4,5,6,7,8,9,10]))

	# print(ls)
	df_train = pd.DataFrame(train, columns=[1,2,3,4,5,6,7,8,9,10])
	df_test = pd.DataFrame(test, columns=[1,2,3,4,5,6,7,8,9,10])
	# print(df)

	# X["predictions"] = predict().apply(lambda x: np.log(x))
	predictions = []

	w, w_0 = calculate_coeffs(df_train)

	# for data in test:
	f = predict(df_test, w, w_0).apply(lambda x: np.log(x))

	#taking 0.5 as decision boundary
	f = f.apply(lambda x: np.where(round(x) > 0.5, 1, 0))
	predictions = f[0].tolist()

	return predictions

# # Split a dataset into k folds
# def cross_validation(dataset, n_folds):
# 	dataset_split = []
# 	# dataset_copy = list(dataset)
# 	dataset_copy = dataset.copy()
# 	fold_size = int(dataset.shape[0] / n_folds)
# 	for i in range(n_folds):
# 		fold = []
# 		while len(fold) < fold_size:
# 			index = randrange(dataset_copy.shape[0])
# 			fold.append(dataset_copy.iloc[index])
# 			dataset_copy.drop(index=[index])
# 		dataset_split.append(fold)
# 	return dataset_split

# # Evaluate an algorithm using a cross validation split
# def evaluate_algorithm(dataset, n_folds, *args):
# 	folds = cross_validation(dataset, n_folds)
# 	scores = {}
# 	accuracy_ls = []
# 	precision_ls = []
# 	recall_ls = []

# 	for fold in folds:

# 		train_set = list(folds)

# 		try:
# 		    train_set.remove(fold)
# 		except ValueError:
# 		    pass

# 		train_set = sum(train_set, [])
# 		test_set = []
# 		actual = []
# 		for row in fold:
# 		  row_copy = list(row)
# 		  test_set.append(row_copy)
# 		  actual.append(row_copy[-1])
# 		predicted = probabilistic_generative_model(train_set, test_set)

# 		tp, tn, fp, fn = get_values(actual, predicted)
# 		accuracy_ = accuracy(tp, tn, fp, fn)
# 		precision_ = precision(tp, tn, fp)
# 		recall_ = recall(tp, tn, fn)
# 		accuracy_ls.append(accuracy_)
# 		precision_ls.append(precision_)
# 		recall_ls.append(recall_)   

# 	scores["Accuracy"] = accuracy_ls
# 	scores["Precision"] = precision_ls
# 	scores["Recall"] = recall_ls   
  
# 	return scores

#Results:
X = datasetPreprocessing()
scores = evaluate_algorithm(X, probabilistic_generative_model, 5)
print("Scores: %s" % scores)
