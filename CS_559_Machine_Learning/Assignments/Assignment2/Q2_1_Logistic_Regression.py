#importing utils file
import __init__
from utils import *
import pandas as pd
import numpy as np

filepath = "breast-cancer-wisconsin.data.txt"

def datasetPreprocessing():
	df_breast_cancer = pd.read_csv(filepath, header=None)
	df_breast_cancer.replace('?',np.nan, inplace=True)

	df_breast_cancer.isnull().any(axis=1)
	df_breast_cancer.dropna(axis=0, inplace=True)
	df_breast_cancer.reset_index(inplace=True)

	# X = df_breast_cancer[[1,2,3,4,5,6,7,8,9]]
	# y = df_breast_cancer[10]
	df_breast_cancer = df_breast_cancer[[1,2,3,4,5,6,7,8,9,10]]
	# print(df_breast_cancer)
	df_breast_cancer = df_breast_cancer.values.tolist()

	# string to float conversion of each values
	for i in range(len(df_breast_cancer[0])):
		str_to_float(df_breast_cancer, i)

	# normalize
	normalize_dataset(df_breast_cancer)

	return df_breast_cancer

def predict(data, coeffs):
	f = coeffs[0]
	for i in range(len(data)-1):
		f += coeffs[i + 1] * int(data[i])  
	#   print(f)
	return sigmoid(f)
 
# Stochastic Gradient Descent - finding coefficients
def SGD_coeffs(train, learning_rate, n_epoch):
	coef = [0.0 for i in range(len(train[0]))]
	for epoch in range(n_epoch):
		for data in train:
			f = predict(data, coef)
			loss = f - data[-1] 
			coef[0] = coef[0] - learning_rate * loss * f * (1.0 - f)
			for i in range(len(data)-1):
				coef[i + 1] = coef[i + 1] - learning_rate * loss * f * (1.0 - f) * int(data[i])
	return coef

# MiniBatch Gradient Descent - finding coefficients
def MBGD_coeffs(train, learning_rate, n_epoch):
	coef = [0.0 for i in range(len(train[0]))]
	for epoch in range(n_epoch):    
		np.random.shuffle(train)    
		batch = train[:32]   	
		for data in batch:
		  f = predict(data, coef)
		  loss = f - data[-1]
		  coef[0] = coef[0] - learning_rate * loss * f * (1.0 - f)
		  for i in range(len(data)-1):
		    coef[i + 1] = coef[i + 1] - learning_rate * loss * f * (1.0 - f) * int(data[i])   
	return coef
 
# Logistic Regression Classifier using MiniBatch Gradient Descent
def logistic_regression_mbgd(train, test, learning_rate, n_epoch):
  predictions = []
  coef = MBGD_coeffs(train, learning_rate, n_epoch)
  for data in test:
    f = predict(data, coef)
    f = round(f)
    predictions.append(f)
  return(predictions)

# Logistic Regression Classifier using Stochastic Gradient Descent
def logistic_regression_sgd(train, test, l_rate, n_epoch):
  predictions = list()
  coef = SGD_coeffs(train, l_rate, n_epoch)
  for data in test:
    f = predict(data, coef)
    f = round(f)
    predictions.append(f)
  return(predictions)

# Translating string column to float to avoid calculation errors
def str_to_float(dataset, column):
	for row in dataset:
		row[column] = float(row[column])

 
# Performing min-max normalization to restric all values to the range 0-1
def normalize_dataset(dataset):
	minmax = list()
	for i in range(len(dataset[0])):
		col_values = [row[i] for row in dataset]
		value_min = min(col_values)
		value_max = max(col_values)
		minmax.append([value_min, value_max])

	for row in dataset:
		for i in range(len(row)):
			row[i] = (row[i] - minmax[i][0]) / (minmax[i][1] - minmax[i][0])

# Split a dataset into k folds
def cross_validation(dataset, n_folds):
	dataset_split = list()
	dataset_copy = list(dataset)
	fold_size = int(len(dataset) / n_folds)
	for i in range(n_folds):
		fold = list()
		while len(fold) < fold_size:
			index = randrange(len(dataset_copy))
			fold.append(dataset_copy.pop(index))
		dataset_split.append(fold)
	return dataset_split

df = datasetPreprocessing()

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

results1 = evaluate_algorithm(df, logistic_regression_mbgd, 5, 0.1, 100)
print("MiniBatch GD:")
print("Scores: %s" % results1)

results2 = evaluate_algorithm(df, logistic_regression_sgd, 5, 0.1, 100)
print("SGD:")
print('Scores: %s' % results2)