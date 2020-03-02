############### HomeWork_06 ####################
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
filepath = 'E://STEVENS/study/KDD/assignments/HW6/breast-cancer-wisconsin.data.csv'

#load dataset
breast_cancer_w<-read.csv(filepath)

#factorize
breast_cancer_w<-factorize(breast_cancer_w[,2:11])
str(breast_cancer_w)

library('C50') 

set.seed(111)

#View(breast_cancer_w)

#splitting in train and test
index<-sort(sample(nrow(breast_cancer_w),round(0.3*nrow(breast_cancer_w))))
train<-breast_cancer_w[-index,]
test<-breast_cancer_w[index,]

dev.off()

#plot C5.0
c50_class<-C5.0(Class~.,data=train)
plot(c50_class)

#summary of generated decision tree
summary(c50_class)

#classification
c50_cls<-predict(c50_class, test, type='class')

#report scores
scores<-get_accu_n_err(test[,10], c50_cls)

#Confusion matrix
scores[1]

#accuracy
scores[2]

#error rate
scores[3]


