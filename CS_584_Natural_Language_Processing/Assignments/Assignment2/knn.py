import numpy as np
import operator
from numpy.linalg import norm

# cosine similairity distance
def calculate_cosine_distance(v, row):
	numerator = np.abs(np.dot(v, row))
	denominator = norm(v) * norm(row)
	return  (numerator / denominator)

# kNN
def kNN(v, X, k=3):
	""" Input Params:
	v : a vector
	X : a matrix
	k : an integer

	Output:
	indices: k indices of the matrix's rows that are closest to the vector
	"""   
	distances = []
	for row in range(X.shape[0]):
		distances.append((row, calculate_cosine_distance(v, X[row])))

	distances.sort(key=operator.itemgetter(1), reverse=True)
	nearest_indices = []
	for i in range(k):
		nearest_indices.append(distances[i][0])

	return nearest_indices
