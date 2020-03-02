#!/usr/bin/env python

import numpy as np

def softmax(x):
    """Compute the softmax function for each row of the input x.

    Arguments:
    x -- A D dimensional vector or N x D dimensional numpy matrix.
    Return:
    x -- You are allowed to modify x in-place
    """
    c = -np.max(x, axis=x.ndim-1)
    n = np.exp(x+c)
    d = np.sum(n, axis=x.ndim-1)
    return (n/d)