############### Midterm submission #############
#                                              #
# Name : Viveksinh Solanki                     #
# CWID : 10441787                              #
# Course: Knowledge Discovery and Data Mining  #
#                                              #
################################################

#clear all variables
rm(list=ls())

############### Q4 ###############

#vector of given numbers
vect<-c(45, 48, 6, 42, 49, 63, 81, 56, 21, 75, 
        25, 48, 56, 24, 73, 82, NA, 80, 86, 88)

#is.vector(vect)

#summary(vect)
#max
vect_max<-max(vect, na.rm=TRUE)
vect_max
#min
vect_min<-min(vect, na.rm=TRUE)
vect_min
#median
vect_median<-median(vect, na.rm=TRUE)
vect_median
#mean
vect_mean<-mean(vect, na.rm=TRUE)
vect_mean
#std
vect_std<-sd(vect, na.rm=TRUE)
vect_std

#replacing missing value with the mean
vect[is.na(vect)]<-vect_mean
vect

#box plot
boxplot(vect)

######## UTILITY FUNCTIONS ########

filepath = 'E://STEVENS/study/KDD/Midterm/final submission/IBM_Employee_Attrition_v1.csv'

###  Load dataset ###
load_data<-function(filepath){
  data<-read.csv(filepath, na.strings = '?')
  return(data)
}

### Remove missing values ###
remove_na<-function(data){
  return(na.omit(data))
}

### split into train and test sets ###
train_test_split<-function(data, idx){
  return(list(data.frame(data[-idx,]), 
         data.frame(data[idx,])))
}

### Factorizing data ###
factorize<-function(data){
  #column names vector
  cols <- colnames(ibm_attrition)
  
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

############### Q5-KNN ###############

#install.packages("kknn")

library(kknn)

ibm_attrition<-load_data(filepath)

ibm_attrition<-remove_na(ibm_attrition)

#factorize dataset
ibm_attrition<-factorize(ibm_attrition)

#splitting data into train and test sets
idx<- seq(1, nrow(ibm_attrition), 3)
train_test<-train_test_split(ibm_attrition, idx)
#train_test[2]

#create classifier
cls_k3 <- kknn(formula=Attrition~., train_test[[1]], train_test[[2]], 
               k=3, kernel="rectangular")

#fitting classifier
preds <- fitted(cls_k3)

#actual class labels
actual <- train_test[[2]][['Attrition']]

#Report scores
scores<-get_accu_n_err(actual, preds)

#Confusion matrix
scores[1]

#accuracy
scores[2]

#error rate
scores[3]

############### Q6-Naive Bayes ###############

#install.packages('e1071',dependencies = TRUE)
library(class)
library(e1071)

ibm_attrition<-load_data(filepath)
#View(ibm_attrition)
ibm_attrition<-remove_na(ibm_attrition)

#factorize dataset
ibm_attrition<-factorize(ibm_attrition)

#splitting data into train and test sets
idx<- seq(1, nrow(ibm_attrition), 3)
train_test<-train_test_split(ibm_attrition, idx)
#train_test[[2]]

#Naive Bayes classifier
nbayes_clf<- naiveBayes(Attrition ~JobSatisfaction+Single+Gender
                        , data = train_test[[1]])

#fitting classifier
preds<-predict(nbayes_clf,train_test[2])

#actual class labels
actual <- train_test[[2]][['Attrition']]

### Report scores ###
scores<-get_accu_n_err(actual, preds)

#Confusion matrix
scores[1]

#accuracy
scores[2]

#error rate
scores[3]

