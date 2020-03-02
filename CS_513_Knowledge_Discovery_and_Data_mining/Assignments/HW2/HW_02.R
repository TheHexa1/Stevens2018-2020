############### HomeWork_02 ####################
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
breast_cancer_w<-read.csv(filepath, na.strings = "?")

########## Exploratory Data Analysis ##########
#Q1#
##### I.Summary #####
summary(breast_cancer_w)

##### II.Missing value identification #####

#number of missing values in dataset
sum(is.na(breast_cancer_w))

#columns with missing values
col_with_na <- colnames(breast_cancer_w)[ apply(breast_cancer_w, 2, anyNA) ]
col_with_na

#replacing missing column values with column mean
for(i in 1:ncol(breast_cancer_w)){
  breast_cancer_w[is.na(breast_cancer_w[,i]), i] <- 
    mean(breast_cancer_w[,i], na.rm = TRUE)
}

#frequency table of "Class" vs "F6"
table(breast_cancer_w[,'Class'],breast_cancer_w[,'F6'])

#scatter plot of F1 to F6
pairs(breast_cancer_w[,2:7])

#boxplot for F7 to F9
boxplot(breast_cancer_w[,8:10])

#histogram for F7 to F9
hist(breast_cancer_w[,'F7'])
hist(breast_cancer_w[,'F8'])
hist(breast_cancer_w[,'F9'])

#Q2#
#clear all variables
rm(list=ls())

#filepath for datafile
filepath = 'E://STEVENS/study/KDD/assignments/HW2/breast-cancer-wisconsin.data.csv'

#load dataset
breast_cancer_w<-read.csv(filepath, na.strings = '?')

#number of missing values before removing rows
sum(is.na(breast_cancer_w))

#remove rows with missing values
breast_cancer_w <- na.omit(breast_cancer_w)

#number of missing values after removing rows
sum(is.na(breast_cancer_w))
