# import pandas as pd
import numpy as np
from random import randrange

#sigmoid
def sigmoid(a):
    e = np.exp(-a)
    return (1 / 1 + e)

# Split a dataset into k folds
def cross_validation(dataset, n_folds):
	dataset_split = []
	# dataset_copy = list(dataset)
	dataset_copy = dataset.copy()
	fold_size = int(dataset.shape[0] / n_folds)
	for i in range(n_folds):
		fold = []
		while len(fold) < fold_size:
			index = randrange(dataset_copy.shape[0])
			fold.append(dataset_copy.iloc[index])
			dataset_copy.drop(index=[index])
		dataset_split.append(fold)
	return dataset_split

# Evaluate an algorithm using a cross validation split
def evaluate_algorithm(dataset, algorithm, n_folds, *args):
	folds = cross_validation(dataset, n_folds)
	scores = {}
	accuracy_ls = []
	precision_ls = []
	recall_ls = []

	for fold in folds:

		train_set = list(folds)

		try:
		    train_set.remove(fold)
		except ValueError:
		    pass

		train_set = sum(train_set, [])
		test_set = []
		actual = []
		for row in fold:
		  row_copy = list(row)
		  test_set.append(row_copy)
		  actual.append(row_copy[-1])
		predicted = algorithm(train_set, test_set, *args)

		tp, tn, fp, fn = get_values(actual, predicted)
		accuracy_ = accuracy(tp, tn, fp, fn)
		precision_ = precision(tp, tn, fp)
		recall_ = recall(tp, tn, fn)
		accuracy_ls.append(accuracy_)
		precision_ls.append(precision_)
		recall_ls.append(recall_)   

	scores["Accuracy"] = accuracy_ls
	scores["Precision"] = precision_ls
	scores["Recall"] = recall_ls   
  
	return scores

  #positive:1.0 negative: 0.0 
def get_values(actual, predicted):
  tp = tn = fp = fn = p = 0
  # print((actual))
  # print((predicted))
  for a in actual:
    if a == 0.0 and predicted[p] == 0.0:
      tn += 1
    elif a == 1.0 and predicted[p] == 1.0:  
      tp += 1
    elif a == 1.0 and predicted[p] == 0.0:
      fn += 1
    elif a == 0.0 and predicted[p] == 1.0:
      fp += 1   
      
    p += 1
  
  return tp, tn, fp, fn

def precision(tp, tn, fp):
  return (tp / (tp+fp) if (tp+fp) else 1) * 100
  
  
def recall(tp, tn, fn):
  return (tp / (tp+fn) if (tp+fn) else 1) * 100
  
  
def accuracy(tp, tn, fp, fn):
  return ((tp+tn) /(tp+tn+fp+fn)) * 100