############### HomeWork_08 ####################
#                                              #
# Name : Viveksinh Solanki                     #
# CWID : 10441787                              #
# Course: Knowledge Discovery and Data Mining  #
#                                              #
################################################

#clear all variables
rm(list=ls())

#min-max normalization
mmnorm2<-function(x)
{
  z<-((x-min(x))/(max(x)-min(x)))
  return(z)
}

#filepath for datafile
filepath = 'E:/STEVENS/study/KDD/assignments/HW7/IBM_Employee_Attrition_V2.csv'

#load dataset
ibm_attr_raw<-read.csv(filepath)

#drop useless features
ibm_attr_raw<-ibm_attr_raw[,c(2,5,8,13)]

ibm_attr<-data.frame(lapply(na.omit(ibm_attr_raw), as.numeric))

#normalizing
for( i in colnames(ibm_attr) )
  ibm_attr[i] = mmnorm2(ibm_attr[i])

View(ibm_attr)
str(ibm_attr)

ibm_attr_dist<-dist(ibm_attr[,-1])

#### Hierarchical clustering ####
hclust_result<-hclust(ibm_attr_dist) 

#plot hierarchy
plot(hclust_result)

#Cutting the tree at 2nd level
hclust_2<-cutree(hclust_result,2) 

#plot clusteres
plot(hclust_2)

#Confusion matrix
table(hclust_2,ibm_attr_raw[,1]) 

#### K-Means clustering ####
#number of clusters
k<-2

#classifier
kmeans_2<- kmeans(ibm_attr[,-1],k,nstart=10) 

#Confusion Matrix
table(kmeans_2$cluster,ibm_attr_raw[,1])

