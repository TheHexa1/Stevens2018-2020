############### HomeWork_07 ####################
#                                              #
# Name : Viveksinh Solanki                     #
# CWID : 10441787                              #
# Course: Knowledge Discovery and Data Mining  #
#                                              #
################################################

#clear all variables
rm(list=ls())

######## UTILITY FUNCTIONS ########

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
filepath = 'E:/STEVENS/study/KDD/assignments/HW7/IBM_Employee_Attrition_V2.csv'

#load dataset
ibm_attr_raw<-read.csv(filepath)
ibm_attr<-data.frame(lapply(na.omit(ibm_attr_raw), as.numeric))

#removing employeeID from feature set, as it won't affect final predictions
#Hence, final feature set has al features except 'employeeID'
ibm_attr<-ibm_attr[,-6]
View(ibm_attr)

idx<- seq (1,nrow(ibm_attr), by=5)
train<-ibm_attr[-idx,]
test<-ibm_attr[idx,]
str(ibm_attr)

library("neuralnet")

net_ibm <- neuralnet(Attrition~., train, hidden = 7, threshold = 0.01)

#Plot the neural nets
plot(net_ibm)

ann <- compute(net_ibm, test[,-2])
ann$net.result

# threshold = 1.5
ann_cat <- ifelse(ann$net.result <1.2,1,2)

#report scores
scores<-get_accu_n_err(test[,2], ann_cat)

#Confusion matrix
scores[1]

#accuracy
scores[2]

#error rate
scores[3]

