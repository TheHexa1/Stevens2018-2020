#importing utils file
import __init__
import utils
import pandas as pd
import numpy as np

#datafile is expected be in same directory as this python file
filepath = "iris.data.txt"

#this function will only work for given iris dataset
def createDatasets():
	df = pd.read_csv(filepath, header=None)
	# df = pd.read_csv("iris.data.txt", names=['sepal length','sepal width','petal length','petal width','class'])
	# print(df.head())

	#descritizing class labels-> Iris-setosa:1, Iris-versicolor:2, Iris-virginica:3 
	df.iloc[:,-1] = df.iloc[:,-1].apply(lambda x: 1 if x == 'Iris-setosa' else x)
	df.iloc[:,-1] = df.iloc[:,-1].apply(lambda x: 2 if x == 'Iris-versicolor' else x)
	df.iloc[:,-1] = df.iloc[:,-1].apply(lambda x: 3 if x == 'Iris-virginica' else x)

	# df['class']
	# df.corr()
	# X = df[['sepal length','sepal width','petal length','petal width']]
	# y = df['class']

	#features
	X = df.iloc[:,0:4].values
	#labels
	y = df.iloc[:,-1].values

	return X, y

def get_within_class_scatter_matrix(X, y, m1, m2, c1, c2):
	# Within class scatter matrices 
	# we have 4 features in our dataset, hence dimension for scatter matrices will be 4x4
	Sw = np.zeros((4,4))

	# s1 - within class scatter matrix for class c1
	s1 = np.zeros((4,4))
	for data in X[y==c1]:
		# reshape to column vectors with same dimension for dot product
		data = data.reshape(4,1)
		m1 = m1.reshape(4,1) 

		s1 += (data-m1).dot((data-m1).T)

	# s2 - within class scatter matrix for class c2
	s2 = np.zeros((4,4))
	for data in X[y==c2]:
		# make column vectors
		data = data.reshape(4,1)
		m2 = m2.reshape(4,1) 

		s2 += (data-m2).dot((data-m2).T)

	Sw = s1 + s2

	return Sw

def get_between_class_scatter_matrix(X, y, m1, m2, c1, c2):
	# Between class scatter matrix 
	Sb = np.zeros((4,4))

	# total mean 
	M = np.mean(X, axis=0)

	# reshape to column vectors
	M = M.reshape(4,1)
	m1 = m1.reshape(4,1)
	m2 = m2.reshape(4,1)

	n1 = X[y==c1,:].shape[0]
	n2 = X[y==c2,:].shape[0]

	sb1 = n1 * (m1 - M).dot((m1 - M).T)
	sb2 = n2 * (m2 - M).dot((m2 - M).T)

	Sb = sb1 + sb2

	return  Sb

#Using Fisher's Linear Discriminant
def LDA(c1,c2):  

	X, y = createDatasets()

	# mean vectors for class c1 and c2
	m1 = np.mean(X[y==c1], axis=0)
	m2 = np.mean(X[y==c2], axis=0)  

	Sw = get_within_class_scatter_matrix(X, y, m1, m2, c1, c2)
	Sb = get_between_class_scatter_matrix(X, y, m1, m2, c1, c2)

	# Solving the generalized eigenvalue problem
	eigen_values, eigen_vectors = np.linalg.eig(np.linalg.inv(Sw).dot(Sb))

	# sorting pairs:(eigenvalue, eigenvector) to get the top largest eigen values
	eigen_val_vec = sorted([(np.abs(eigen_values[v]), eigen_vectors[:,v]) for v in range(len(eigen_values))], key=lambda i: i[0], reverse=True)

	# Solving for W from eigen pairs
	# As we can see top 2 eigen values retain most of the details, hence we can convert from 4D to 2D subspace
	W = np.hstack((eigen_val_vec[0][1].reshape(4,1), eigen_val_vec[1][1].reshape(4,1)))
	#   print('W:\n', W)

	lda = X.dot(W)

	return lda


  
print("For classes 1 and 2:")
print(LDA(1,2))
print("")
print("For classes 2 and 3:")
print(LDA(2,3))
print("")
print("For classes 1 and 3:")
print(LDA(1,3))
print("")