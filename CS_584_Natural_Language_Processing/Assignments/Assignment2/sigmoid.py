#!/usr/bin/env python

import numpy as np

def sigmoid(x):
    """Compute the softmax function for each row of the input x.

    Arguments:
    x -- A D dimensional vector or N x D dimensional numpy matrix.
    Return:
    x -- You are allowed to modify x in-place
    """
    z = np.exp(-x)
    return (1. / 1 + z)