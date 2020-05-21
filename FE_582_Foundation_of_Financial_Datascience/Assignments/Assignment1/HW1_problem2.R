#### Problem 2 #####
rm(list = ls())

setwd('E:/STEVENS/study/FE-582/assignments/asst1/HW1_S20')
getwd()

day1 <- data.frame(read.csv("nyt1.csv"))
day2 <- data.frame(read.csv("nyt2.csv"))
day3 <- data.frame(read.csv("nyt3.csv"))

day1$age_group <- cut(day1$Age, c(-Inf,0,19,29,39,49,59,69,Inf))
day2$age_group <- cut(day2$Age, c(-Inf,0,19,29,39,49,59,69,Inf))
day3$age_group <- cut(day3$Age, c(-Inf,0,19,29,39,49,59,69,Inf))

day1$ctr <- day1$Clicks / day1$Impressions
day2$ctr <- day2$Clicks / day2$Impressions
day3$ctr <- day3$Clicks / day3$Impressions

library(ggplot2)

ggplot(day1, aes(x=Impressions, color=age_group)) + geom_density() 
  + xlab("Impressions") + labs(color='Age') 

ggplot(day2, aes(x=Impressions, color=age_group)) + geom_density() 
+ xlab("Impressions") + labs(color='Age') 

ggplot(day3, aes(x=Impressions, color=age_group)) + geom_density() 
+ xlab("Impressions") + labs(color='Age') 

day1$click_group[day1$Clicks == 0] <- '0 clicks'
day1$click_group[day1$Clicks > 0] <- '> 0 clicks'

day2$click_group[day2$Clicks == 0] <- '0 clicks'
day2$click_group[day2$Clicks > 0] <- '> 0 clicks'

day3$click_group[day3$Clicks == 0] <- '0 clicks'
day3$click_group[day3$Clicks > 0] <- '> 0 clicks'

# comparison across age groups
ggplot(day1, aes(x=age_group, y=Impressions, fill=age_group)) +
  geom_boxplot() + xlab("Age Group")

ggplot(day2, aes(x=age_group, y=Impressions, fill=age_group)) +
  geom_boxplot() + xlab("Age Group")

ggplot(day3, aes(x=age_group, y=Impressions, fill=age_group)) +
  geom_boxplot() + xlab("Age Group")

# data transformation

to_category <- function(df){
  df$Gender[df$Gender == 1] <- 'Male'
  df$Gender[df$Gender == 0] <- 'Female'
  df$Signed_In[df$Signed_In == 1] <- 'logged_in'
  df$Signed_In[df$Signed_In == 0] <- 'not logged_in'
  return(df)
}

day1 <- to_category(day1)
day2 <- to_category(day2)
day3 <- to_category(day3)

## comparison across user segments:

# i) <20 years old males vs <20 years old females :
day1_subset1 <- subset(day1, Age<20)
day2_subset1 <- subset(day2, Age<20)
day3_subset1 <- subset(day3, Age<20)
#day1_subset1

ggplot(day1_subset1, aes(x=Gender, y=..count..)) +
  geom_bar(aes(fill=Gender)) +
  geom_text(stat='count', aes(label=..count..), vjust=1)+
  xlab('Gender')

ggplot(day2_subset1, aes(x=Gender, y=..count..)) +
  geom_bar(aes(fill=Gender)) +
  geom_text(stat='count', aes(label=..count..), vjust=1)+
  xlab('Gender')

ggplot(day3_subset1, aes(x=Gender, y=..count..)) +
  geom_bar(aes(fill=Gender)) +
  geom_text(stat='count', aes(label=..count..), vjust=1)+
  xlab('Gender')


# ii) logged in users vs not logged in users:
ggplot(day1, aes(x=Signed_In, y=..count..)) +
  geom_bar(aes(fill=Signed_In)) +
  geom_text(stat='count', aes(label=..count..), vjust=1)+
  xlab('Signed In status')

ggplot(day2, aes(x=Signed_In, y=..count..)) +
  geom_bar(aes(fill=Signed_In)) +
  geom_text(stat='count', aes(label=..count..), vjust=1)+
  xlab('Signed In status')

ggplot(day3, aes(x=Signed_In, y=..count..)) +
  geom_bar(aes(fill=Signed_In)) +
  geom_text(stat='count', aes(label=..count..), vjust=1)+
  xlab('Signed In status')


## Analysis across days

day1$day_id <- 'day1'
day2$day_id <- 'day2'
day3$day_id <- 'day3'
all_data <- rbind(day1, day2, day3)

# i) <20 years old males vs <20 years old females across days :

all_data_subset1 <- subset(all_data, Age<20)

ggplot(all_data_subset1, aes(x=day_id, y=..count..)) +
  geom_bar(aes(fill=Gender)) +
  geom_text(stat='count', aes(label=..count..), vjust=1)+
  xlab('days')

# ii) >50 years old males vs >50 years old females across days :

all_data_subset2 <- subset(all_data, Age>50)

ggplot(all_data_subset2, aes(x=day_id, y=..count..)) +
  geom_bar(aes(fill=Gender)) +
  geom_text(stat='count', aes(label=..count..), vjust=1)+
  xlab('days')

# iii) logged in users vs not logged in users across days:

ggplot(all_data, aes(x=day_id, y=..count..)) +
  geom_bar(aes(fill=Signed_In)) +
  geom_text(stat='count', aes(label=..count..), vjust=1)+
  xlab('days')

# iv) distribution of impressions across days and age groups

ggplot(subset(all_data, Impressions>0), aes(x=day_id, y=..count..)) +
  geom_bar(aes(fill=age_group)) +
  geom_text(stat='count', aes(label=..count..), vjust=1)+
  xlab('days')

# v) distribution of '> clicks' across days and age groups

ggplot(subset(all_data, Clicks>0), aes(x=day_id, y=..count..)) +
  geom_bar(aes(fill=age_group)) +
  geom_text(stat='count', aes(label=..count..), vjust=1)+
  xlab('days')

# vi) distribution of logged in users across days and across age groups

ggplot(subset(all_data, Signed_In=='logged_in'), aes(x=day_id, y=..count..)) +
  geom_bar(aes(fill=age_group)) +
  geom_text(stat='count', aes(label=..count..), vjust=1)+
  xlab('days')


