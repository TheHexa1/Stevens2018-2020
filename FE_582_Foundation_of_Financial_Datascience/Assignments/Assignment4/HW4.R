# HomeWork-4
# Viveksinh Solanki

rm(list = ls())

setwd('E:/STEVENS/study/FE-582/assignments/asst4/')
getwd()

### Problem 1 ###

## a)
weekly_df <- read.csv('Weekly.csv')
View(weekly_df)

# plots
plot(weekly_df$Today)
boxplot(weekly_df$Today)

# From the plots, we can see that value for 'today' variable is lying between
# -5 and 5. From the scatter plot we can see that straight line can be fitted
# through whole dataset for 'today' as target variable

# summary stats
summary(weekly_df)

# From the summary stats, it is visible that except volume all other features
# have mean value ~0.15
# number of data points with 'Down' direction is 484
# number of data points with 'Up' direction is 605


## b) Logistic Regression
library(ISLR)

glm.fit=glm(weekly_df$Direction~Lag1+Lag2+Lag3+Lag4+Lag5+Volume,
            data=weekly_df,family=binomial)

summary(glm.fit)
confint(glm.fit)
confint.default(glm.fit)
exp(coef(glm.fit))

# From above results, predictor Lag2 seems statistically significant.

## c) 
glm.probs=predict(glm.fit, type="response")
glm.probs[1:5]
dim(weekly_df)
glm.pred=rep("Down",dim(weekly_df)[1])
glm.pred[glm.probs>0.5]="Up"
contrasts(weekly_df$Direction)

# Confusion matrix 
table(glm.pred,weekly_df$Direction)

# Overall fraction of correct predictions
mean(glm.pred == weekly_df$Direction)
#overall error rate
1-mean(glm.pred == weekly_df$Direction)

# Understanding confusion matrix and mistakes made by logistic regression
#error among direction 'Up'
48/(48+557)
#sensitivity (percentage of true 'Up' direction identified)
557/(48+557) ## (tp/tp+fn)
#specificity (percentage of true 'Down' direction that are correctly identified)
54/(54+430) ## (tn/tn+fp)

## d)

# split data into training and held out/testing sets
training=weekly_df[1:985,]
test=weekly_df[986:1089,]

glm.fit=glm(Direction~Lag2,data=training,family=binomial)
summary(glm.fit)

glm.probs=predict(glm.fit,newdata = test, type="response")
glm.pred=rep("Down",dim(test)[1])
glm.pred[glm.probs>0.5]="Up"
contrasts(test$Direction)

# Confusion matrix 
table(glm.pred,test$Direction)

# Overall fraction of correct predictions
logistic_acc <- mean(glm.pred == test$Direction)
logistic_acc

#overall error rate
1-mean(glm.pred == test$Direction)

## e) LDA
library(MASS)

lda.fit=lda(Direction~Lag2,data=training)
lda.fit

lda.pred=predict(lda.fit,test)
lda.class=lda.pred$class
contrasts(test$Direction)
# Confusion matrix 
table(lda.class ,test$Direction)
# Overall fraction of correct predictions
lda_acc <- mean(lda.class == test$Direction)
lda_acc

## f) QDA

qda.fit=qda(Direction~Lag2,data=training)
qda.fit

qda.pred=predict(qda.fit,test)
qda.class=qda.pred$class
contrasts(test$Direction)
# Confusion matrix 
table(qda.class ,test$Direction)
# Overall fraction of correct predictions
qda_acc <- mean(qda.class == test$Direction)
qda_acc

## g) KNN with k=1
test.x=cbind(test$Lag2)
training.x=cbind(training$Lag2)
library(class)
knn.pred=knn(training.x,test.x,training$Direction,k=1)

contrasts(test$Direction)
# Confusion matrix
table(knn.pred ,test$Direction)
# Overall fraction of correct predictions
knn_acc <- mean(knn.pred == test$Direction)
knn_acc

## h) Compare above results - Logistic regression and LDA provide best results
# Predictions
comparison=cbind(test,glm.pred,lda.class,qda.class,knn.pred)
head(comparison)

# Overall fraction of correct predictions
cbind(logistic_acc, lda_acc, qda_acc, knn_acc)

## i) Experiments with different predictors

#-- A) predictors: Lag2 + Volume
col_names <- c('Lag2', 'Volume', 'Direction')
a_subset <- weekly_df[col_names]
training=a_subset[1:985,]
test=a_subset[986:1089,]

#-- I) Logistic Regression
glm.fit=glm(Direction~Lag2+Volume, data=training,family=binomial)
summary(glm.fit)

glm.probs=predict(glm.fit,newdata = test, type="response")
glm.pred=rep('Down',dim(test)[1])
glm.pred[glm.probs>0.5]='Up'

# Confusion matrix 
table(glm.pred,test$Direction)

# Overall fraction of correct predictions
logistic_acc <- mean(glm.pred == test$Direction)
logistic_acc

#-- II) LDA
lda.fit=lda(Direction~Lag2+Volume,
            data=training)
lda.fit

lda.pred=predict(lda.fit,test)
lda.class=lda.pred$class
# Confusion matrix 
table(lda.class ,test$Direction)
# Overall fraction of correct predictions
lda_acc <- mean(lda.class == test$Direction)
lda_acc

#-- III) QDA
qda.fit=qda(Direction~Lag2+Volume,
            data=training)
qda.fit

qda.pred=predict(qda.fit,test)
qda.class=qda.pred$class
# Confusion matrix 
table(qda.class ,test$Direction)
# Overall fraction of correct predictions
qda_acc <- mean(qda.class == test$Direction)
qda_acc

#-- IV) KNN for k=1,2,3,5,7

test.x=cbind(test$Lag2, test$Volume)
training.x=cbind(training$Lag2, training$Volume)
library(class)

k_ls <- c(1,2,3,5,7)
k_acc <- c()
i=0

for(k in k_ls){
  knn.pred=knn(training.x,test.x,training$Direction,k=k)
  contrasts(test$Direction)
  # Confusion matrix
  table(knn.pred ,test$Direction)
  # Overall fraction of correct predictions
  knn_acc <- mean(knn.pred == test$Direction)
  k_acc <- c(k_acc,knn_acc)
  i=i+1
}

k_acc


#-- B) predictors: Lag1 + Lag3 + Lag4 + Lag5 + Volume
col_names <- c('Lag1', 'Lag3', 'Lag4', 'Lag5', 'Volume', 'Direction')
a_subset <- weekly_df[col_names]
training=a_subset[1:985,]
test=a_subset[986:1089,]

#-- I) Logistic Regression
glm.fit=glm(Direction~Lag1+Lag3+Lag4+Lag5+Volume, data=training,family=binomial)
summary(glm.fit)

glm.probs=predict(glm.fit,newdata = test, type="response")
glm.pred=rep('Down',dim(test)[1])
glm.pred[glm.probs>0.5]='Up'

# Confusion matrix 
table(glm.pred,test$Direction)

# Overall fraction of correct predictions
logistic_acc <- mean(glm.pred == test$Direction)
logistic_acc

#-- II) LDA
lda.fit=lda(Direction~Lag1+Lag3+Lag4+Lag5+Volume,
            data=training)
lda.fit

lda.pred=predict(lda.fit,test)
lda.class=lda.pred$class
# Confusion matrix 
table(lda.class ,test$Direction)
# Overall fraction of correct predictions
lda_acc <- mean(lda.class == test$Direction)
lda_acc

#-- III) QDA
qda.fit=qda(Direction~Lag1+Lag3+Lag4+Lag5+Volume,
            data=training)
qda.fit

qda.pred=predict(qda.fit,test)
qda.class=qda.pred$class
# Confusion matrix 
table(qda.class ,test$Direction)
# Overall fraction of correct predictions
qda_acc <- mean(qda.class == test$Direction)
qda_acc

#-- IV) KNN for k=1,2,3,5,7

test.x=cbind(test$Lag1, test$Lag3, test$Lag4, test$Lag5, test$Volume)
training.x=cbind(training$Lag1, training$Lag3, training$Lag4, training$Lag5,
                 training$Volume)
library(class)

k_ls <- c(1,2,3,5,7)
k_acc <- c()
i=0

for(k in k_ls){
  knn.pred=knn(training.x,test.x,training$Direction,k=k)
  contrasts(test$Direction)
  # Confusion matrix
  table(knn.pred ,test$Direction)
  # Overall fraction of correct predictions
  knn_acc <- mean(knn.pred == test$Direction)
  k_acc <- c(k_acc,knn_acc)
  i=i+1
}

k_acc

#Answer: 
#Best Variables: Lag1 + Lag3 + Lag4 + Lag5 + Volume
#Best Method: KNN with k=2
#Best confusion matrix:
#knn.pred Down Up
#Down   23 26
#Up     20 35

### Problem 2 ###

auto_df <- read.csv('Auto.csv')
View(auto_df)

## a)
mpg01 <- rep(0, dim(auto_df)[1])

# Median of mpg
med_mpg <- median(auto_df$mpg)
med_mpg
# mpg01 vector with 0's and 1's
mpg01[auto_df$mpg > med_mpg] = 1
mpg01

auto_df <- cbind(auto_df, mpg01)
head(auto_df)

## b) Explore relationship of mpg01 with other vars

library(car) 
## cylinders vs displacement w.r.t mpg01:
# We can see that mileage is higher for less number of cylinders and low displacement
# And mileage is lower for higher number of cylinders and higher displacement values
scatterplot(cylinders ~ displacement | mpg01, data=auto_df, 
            xlab="displacement", ylab="cylinders")

## horsepower vs weight w.r.t mpg01:
# From plot: mileage is higher for lower weight values and lower horsepower values
scatterplot(horsepower ~ weight | mpg01, data=auto_df, 
            xlab="weight", ylab="horsepower")

## weight vs acceleration w.r.t. mpg01:
# From plot: mileage is slightly skewed 
scatterplot(weight ~ acceleration | mpg01, data=auto_df, 
            xlab="acceleration", ylab="weight")

## year vs origin w.r.t mpg01:
# From plot: mileage doesn't seem to depend on year or origin, so we can ignore
# year and origin from predictors
scatterplot(year ~ origin | mpg01, data=auto_df, xlab="origin", ylab="year")

# From plot: Lower number cylinders give higher mileage 
boxplot(cylinders ~ mpg01, data=auto_df, xlab="mpg01", ylab="cylinders")

# From plot: Higher displacement implies lower mileage
boxplot(displacement ~ mpg01, data=auto_df, xlab="mpg01", ylab="displacement")

# From plot: Mileage is higher for horsepower less than 100
boxplot(horsepower ~ mpg01, data=auto_df, xlab="mpg01", ylab="horsepower")

# From plot: Mileage is higher for low weight vehicles
boxplot(weight ~ mpg01, data=auto_df, xlab="mpg01", ylab="weight")

# From plot: Mileage doesn't seem to depend much on acceleration
boxplot(acceleration ~ mpg01, data=auto_df, xlab="mpg01", ylab="acceleration")

# From plot, we can see that old cars had lower mileage than newer cars
boxplot(year ~ mpg01, data=auto_df, xlab="mpg01", ylab="year")

# From plot: Origin doesn't seem to affect mileage much, we can ignore this variable
# from predictors
boxplot(origin ~ mpg01, data=auto_df, xlab="mpg01", ylab="origin")

# From the above plots we can see that variables 'origin' and 'year' are not
# don't have relationship with target 'mpg01'. Hence, we can take rest of the 
# variables as predictors for this dataset

## c) Train test split

# Processing and Scaling
col_names <- c('cylinders', 'displacement', 'horsepower', 'weight', 
               'acceleration')
auto_df_subset <- auto_df[col_names]
#View(auto_df_subset)

# Normalized subset
auto_df_subset_scaled <- scale(auto_df_subset)
#View(auto_df_subset_scaled)

# add mpg01 col
auto_df_subset_scaled_final <- cbind(auto_df_subset_scaled, mpg01)
View(auto_df_subset_scaled_final)

# Split
split_size = round(dim(auto_df)[1] * 0.8)
split_size

training=data.frame(auto_df_subset_scaled_final[1:split_size,])
test=data.frame(auto_df_subset_scaled_final[315:392,])

View(training)
View(test)
dim(training)
dim(test)

## d) LDA

lda.fit=lda(mpg01~cylinders+displacement+horsepower+weight+acceleration,
            data=training)
lda.fit

lda.pred=predict(lda.fit,test)
lda.class=lda.pred$class
# Confusion matrix 
table(lda.class ,test$mpg01)
# Overall fraction of correct predictions
lda_acc <- mean(lda.class == test$mpg01)
lda_acc
# Test error for LDA
1-lda_acc

## e) QDA

qda.fit=qda(mpg01~cylinders+displacement+horsepower+weight+acceleration,
            data=training)
qda.fit

qda.pred=predict(qda.fit,test)
qda.class=qda.pred$class
# Confusion matrix 
table(qda.class ,test$mpg01)
# Overall fraction of correct predictions
qda_acc <- mean(qda.class == test$mpg01)
qda_acc
# Test error for QDA
1-qda_acc

## f) Logistic Regression

glm.fit=glm(mpg01~cylinders+displacement+horsepower+weight+acceleration,
            data=training,family=binomial)
summary(glm.fit)

glm.probs=predict(glm.fit,newdata = test, type="response")
glm.pred=rep(0,dim(test)[1])
glm.pred[glm.probs>0.5]=1

# Confusion matrix 
table(glm.pred,test$mpg01)

# Overall fraction of correct predictions
logistic_acc <- mean(glm.pred == test$mpg01)
logistic_acc

# test error rate
1-logistic_acc

## g) KNN with different k-values: 1, 2, 3, 5, 7
test.x=cbind(test$cylinders, test$displacement, test$horsepower,
             test$weight, test$acceleration)
training.x=cbind(training$cylinders, training$displacement, training$horsepower,
                 training$weight, training$acceleration)
library(class)

# i) k=1
knn.pred=knn(training.x,test.x,training$mpg01,k=1)

# Confusion matrix
table(knn.pred ,test$mpg01)
# Overall fraction of correct predictions
knn_acc <- mean(knn.pred == test$mpg01)
knn_acc

# Test error rate
k_1_error <- 1-knn_acc
k_1_error

# ii) k=2

knn.pred=knn(training.x,test.x,training$mpg01,k=2)

# Confusion matrix
table(knn.pred ,test$mpg01)
# Overall fraction of correct predictions
knn_acc <- mean(knn.pred == test$mpg01)
knn_acc

# Test error rate
k_2_error <- 1-knn_acc
k_2_error

# iii) k=3

knn.pred=knn(training.x,test.x,training$mpg01,k=3)

# Confusion matrix
table(knn.pred ,test$mpg01)
# Overall fraction of correct predictions
knn_acc <- mean(knn.pred == test$mpg01)
knn_acc

# Test error rate
k_3_error <- 1-knn_acc
k_3_error

# iv) k=5

knn.pred=knn(training.x,test.x,training$mpg01,k=5)

# Confusion matrix
table(knn.pred ,test$mpg01)
# Overall fraction of correct predictions
knn_acc <- mean(knn.pred == test$mpg01)
knn_acc

# Test error rate
k_5_error <- 1-knn_acc
k_5_error

# v) k=7

knn.pred=knn(training.x,test.x,training$mpg01,k=7)

# Confusion matrix
table(knn.pred ,test$mpg01)
# Overall fraction of correct predictions
knn_acc <- mean(knn.pred == test$mpg01)
knn_acc

# Test error rate
k_7_error <- 1-knn_acc
k_7_error

# *) comparing all k values
cbind(k_1_error, k_2_error, k_3_error, k_5_error, k_7_error)

# As we can see, k=2 gives the lowest error rate