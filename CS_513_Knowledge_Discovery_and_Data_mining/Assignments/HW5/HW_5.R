############### HomeWork_05 ####################
#                                              #
# Name : Viveksinh Solanki                     #
# CWID : 10441787                              #
# Course: Knowledge Discovery and Data Mining  #
#                                              #
################################################

#clear all variables
rm(list=ls())

######## UTILITY FUNCTIONS ########

### Factorizing data ###
factorize<-function(data){
  #column names vector
  cols <- colnames(data)
  
  #convert data points to factor
  data[cols] <- lapply(data[cols], factor)
  
  return(data)
}

### Get accuracy and error rate ###
get_accu_n_err<-function(actual, predicted){
  
  #confusion matrix
  cm = as.matrix(table(Actual = actual, Predicted = predicted))
  
  #accuracy
  accu_<-sum(diag(cm))/length(actual)
  
  #Error rate
  err_<-(1 - accu_)
  
  return(list(cm, accu_, err_))
}

#filepath for datafile
filepath = 'E://STEVENS/study/KDD/assignments/HW5/breast-cancer-wisconsin.data.csv'

#load dataset
breast_cancer_w<-read.csv(filepath)

#factorize
breast_cancer_w<-factorize(breast_cancer_w[,2:11])
str(breast_cancer_w)
View(breast_cancer_w)

library(rpart)
library(rpart.plot) 
library(rattle)       
library(RColorBrewer) 

set.seed(111)

#View(breast_cancer_w)

#splitting in train and test
index<-sort(sample(nrow(breast_cancer_w),round(0.3*nrow(breast_cancer_w))))
train<-breast_cancer_w[-index,]
test<-breast_cancer_w[index,]

dev.off()

#plot CART
CART_class<-rpart(Class~., data=train)
rpart.plot(CART_class)

#classification
CART_cls<-predict(CART_class, test, type='class')

#report scores
scores<-get_accu_n_err(test[,10], CART_cls)

#Confusion matrix
scores[1]

#accuracy
scores[2]

#error rate
scores[3]


