############### Final Exam_Q3_Kmeans ###########
#                                              #
# Name : Viveksinh Solanki                     #
# CWID : 10441787                              #
# Course: Knowledge Discovery and Data Mining  #
#                                              #
################################################

#clear all variables
rm(list=ls())

#Converted given data to csv
#filepath for datafile
filepath = 'E:/STEVENS/study/KDD/final_exam/q3_data.csv'

#load dataset
dsn<-read.csv(filepath)

#view dataset
View(dsn)
str(dsn)

#### K-Means clustering ####
#number of clusters
k<-2

#cluster
kmeans_2<- kmeans(dsn[,-1],k,nstart=10) 

#Confusion Matrix
table(kmeans_2$cluster, dsn[,1])

## Based on the final clusters ##
### a.	What are the members of each cluster? ###
# Ans:
# members of cluster1: b,c,d,f
# members of cluster2: a,e,g

### b.	What are the coordinates for the cluster centers? ###
# Ans:
# coordinates for cluster1 center: (4.25, 3.5, 4.25)
# coordinates for cluster2 center: (1.33, 1.33, 1.33)

