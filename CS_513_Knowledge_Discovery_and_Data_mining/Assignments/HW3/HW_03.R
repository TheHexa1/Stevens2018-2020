############### HomeWork_03 ####################
#                                              #
# Name : Viveksinh Solanki                     #
# CWID : 10441787                              #
# Course: Knowledge Discovery and Data Mining  #
#                                              #
################################################

#clear all variables
rm(list=ls())

#filepath for datafile
filepath = 'E://STEVENS/study/KDD/assignments/HW2/breast-cancer-wisconsin.data.csv'

#load dataset
breast_cancer_w<-read.csv(filepath, na.strings = '?')

##### Check for Missing values #####

#number of missing values before removing rows
sum(is.na(breast_cancer_w))

#remove rows with missing values
breast_cancer_w <- na.omit(breast_cancer_w)

#number of missing values after removing rows
sum(is.na(breast_cancer_w))

#excluding 'sample code number' from features
breast_cancer_w <- breast_cancer_w[,2:11]

#column names vector
cols <- colnames(breast_cancer_w)
cols

#convert data points to factor
breast_cancer_w[cols] <- lapply(breast_cancer_w[cols], factor)
str(breast_cancer_w)

### KNN ###
#install.packages("kknn")

library(kknn)

#splitting data into train and test sets
idx<- sort(sample(nrow(breast_cancer_w), as.integer(.70*nrow(breast_cancer_w))))
train <- data.frame(breast_cancer_w[idx,])
test <- data.frame(breast_cancer_w[-idx,])

#create classifier
cls_k5 <- kknn(formula=Class~., train, test, k=5, kernel="rectangular")

#fitting classifier
fit <- fitted(cls_k5)

#Check accuracy

#actual class labels
cl <- test[['Class']]

#confusion matrix
cm = as.matrix(table(Actual = cl, Predicted = fit))
cm

#accuracy
accuracy<-sum(diag(cm))/length(cl)
accuracy
