#### Problem 1 #####
rm(list = ls())

setwd('E:/STEVENS/study/FE-582/assignments/asst1/HW1_S20')
getwd()

library('xlsx')

library('gdata')

# Load datasets
bk <- read.xls("rollingsales_brooklyn.xls",perl = "C:\\Perl64\\bin\\perl.exe", pattern="BOROUGH")
bx <- read.xls("rollingsales_bronx.xls",perl = "C:\\Perl64\\bin\\perl.exe", pattern="BOROUGH")
manh <- read.xls("rollingsales_manhattan.xls",perl = "C:\\Perl64\\bin\\perl.exe", pattern="BOROUGH")
qn <- read.xls("rollingsales_queens.xls",perl = "C:\\Perl64\\bin\\perl.exe", pattern="BOROUGH")
si <- read.xls("rollingsales_statenisland.xls",perl = "C:\\Perl64\\bin\\perl.exe", pattern="BOROUGH")

# head(bk)
# head(bx)
# head(manh)
# head(qn)
# head(si)

# convert column names to lowercase
names(bk) <- tolower(names(bk))
# names(bk)
names(bx) <- tolower(names(bx))
# names(bx)
names(manh) <- tolower(names(manh))
# names(manh)
names(qn) <- tolower(names(qn))
# names(qn)
names(si) <- tolower(names(si))
# names(si)

# Format

# Brooklyn
bk$sale.price.n <- as.numeric(gsub("[^[:digit:]]","",bk$sale.price))
#bk$sale.price.n

bk$gross.sqft <- as.numeric(gsub("[^[:digit:]]","",bk$gross.square.feet))
# bk$gross.sqft

bk$land.sqft <- as.numeric(gsub("[^[:digit:]]","",bk$land.square.feet))
# bk$land.sqft

bk$sale.date <- as.Date(bk$sale.date)
# bk$sale.date

bk$year.built <- as.numeric(as.character(bk$year.built))
# bk$year.built

# Bronx
bx$sale.price.n <- as.numeric(gsub("[^[:digit:]]","",bx$sale.price))
#bx$sale.price.n

bx$gross.sqft <- as.numeric(gsub("[^[:digit:]]","",bx$gross.square.feet))
# bx$gross.sqft

bx$land.sqft <- as.numeric(gsub("[^[:digit:]]","",bx$land.square.feet))
# bx$land.sqft

bx$sale.date <- as.Date(bx$sale.date)
# bx$sale.date

bx$year.built <- as.numeric(as.character(bx$year.built))
# bx$year.built

# Manhattan
manh$sale.price.n <- as.numeric(gsub("[^[:digit:]]","",manh$sale.price))
#manh$sale.price.n

manh$gross.sqft <- as.numeric(gsub("[^[:digit:]]","",manh$gross.square.feet))
# manh$gross.sqft

manh$land.sqft <- as.numeric(gsub("[^[:digit:]]","",manh$land.square.feet))
# manh$land.sqft

manh$sale.date <- as.Date(manh$sale.date)
# manh$sale.date

manh$year.built <- as.numeric(as.character(manh$year.built))
# manh$year.built

# Queens
qn$sale.price.n <- as.numeric(gsub("[^[:digit:]]","",qn$sale.price))
#qn$sale.price.n

qn$gross.sqft <- as.numeric(gsub("[^[:digit:]]","",qn$gross.square.feet))
# qn$gross.sqft

qn$land.sqft <- as.numeric(gsub("[^[:digit:]]","",qn$land.square.feet))
# qn$land.sqft

qn$sale.date <- as.Date(qn$sale.date)
# qn$sale.date

qn$year.built <- as.numeric(as.character(qn$year.built))
# qn$year.built

# StatenIsland
si$sale.price.n <- as.numeric(gsub("[^[:digit:]]","",si$sale.price))
#si$sale.price.n

si$gross.sqft <- as.numeric(gsub("[^[:digit:]]","",si$gross.square.feet))
# si$gross.sqft

si$land.sqft <- as.numeric(gsub("[^[:digit:]]","",si$land.square.feet))
# si$land.sqft

si$sale.date <- as.Date(si$sale.date)
# si$sale.date

si$year.built <- as.numeric(as.character(si$year.built))
# si$year.built

# Clean: remove records which don't have sale price(=0$)
bk <- bk[bk$sale.price.n!=0,]
bx <- bx[bx$sale.price.n!=0,]
manh <- manh[manh$sale.price.n!=0,]
qn <- qn[qn$sale.price.n!=0,]
si <- si[si$sale.price.n!=0,]

# remove outliers
bk$sale.price.log <- log(bk$sale.price.n)
bk <- bk[bk$sale.price.log > 5, ]

bx$sale.price.log <- log(bx$sale.price.n)
bx <- bx[bx$sale.price.log > 5, ]

manh$sale.price.log <- log(manh$sale.price.n)
manh <- manh[manh$sale.price.log > 5, ]

qn$sale.price.log <- log(qn$sale.price.n)
qn <- qn[qn$sale.price.log > 5, ]

si$sale.price.log <- log(si$sale.price.n)
si <- si[si$sale.price.log > 5, ]


# Comparison across boroughs

## Family
homes_borough_1 <- bk[which(grepl("FAMILY",bk$building.class.category)),]
homes_borough_2 <- bx[which(grepl("FAMILY",bx$building.class.category)),]
homes_borough_3 <- manh[which(grepl("FAMILY",manh$building.class.category)),]
homes_borough_4 <- qn[which(grepl("FAMILY",qn$building.class.category)),]
homes_borough_5 <- si[which(grepl("FAMILY",si$building.class.category)),]

final_homes_table <- rbind(homes_borough_1, homes_borough_2, homes_borough_3, homes_borough_4, homes_borough_5)
#plot(log(final_homes_table$gross.sqft), log(final_homes_table$sale.price.n))

library("ggplot2")
ggplot(final_homes_table,aes(x=borough, y=sale.price.log, fill=borough, group=borough))+geom_boxplot()

## Condos
condos_borough_1 <- bk[which(grepl("CONDOS",bk$building.class.category)),]
condos_borough_2 <- bx[which(grepl("CONDOS",bx$building.class.category)),]
condos_borough_3 <- manh[which(grepl("CONDOS",manh$building.class.category)),]
condos_borough_4 <- qn[which(grepl("CONDOS",qn$building.class.category)),]
condos_borough_5 <- si[which(grepl("CONDOS",si$building.class.category)),]

final_condos_table <- rbind(condos_borough_1, condos_borough_2, condos_borough_3, condos_borough_4, condos_borough_5)
#plot(log(final_condos_table$gross.sqft), log(final_condos_table$sale.price.n))

ggplot(final_condos_table,aes(x=borough, y=sale.price.log, fill=borough, group=borough))+geom_boxplot()

## Coops
coops_borough_1 <- bk[which(grepl("COOPS",bk$building.class.category)),]
coops_borough_2 <- bx[which(grepl("COOPS",bx$building.class.category)),]
coops_borough_3 <- manh[which(grepl("COOPS",manh$building.class.category)),]
coops_borough_4 <- qn[which(grepl("COOPS",qn$building.class.category)),]
coops_borough_5 <- si[which(grepl("COOPS",si$building.class.category)),]

final_coops_table <- rbind(coops_borough_1, coops_borough_2, coops_borough_3, coops_borough_4, coops_borough_5)
#plot(log(final_coops_table$gross.sqft), log(final_coops_table$sale.price.n))

ggplot(final_coops_table,aes(x=borough, y=sale.price.log, fill=borough, group=borough))+geom_boxplot()

# Comparison across time
# convert date format to days and months 
days_month <- function(df){
  df$day <- format(df$sale.date, "%A")
  df$day <- factor(df$day, levels = c("Monday", 'Tuesday',
                                      "Wednesday", "Thursday", "Friday"))
  
  df$month <- format(df$sale.date, "%B")
  df$month <- factor(df$month, levels = c("January", "February", "March",
                                          "April", "May", "June", "July", "August",
                                          "September", "October", "November", 
                                          "December"))
  
  return(df)
}

final_homes_table_time_transformation <- days_month(final_homes_table)
final_condos_table_time_transformation <- days_month(final_condos_table)
final_coops_table_time_transformation <- days_month(final_coops_table)

ggplot(final_homes_table_time_transformation,aes(x=month, y=sale.price.log, 
                                                  fill=month, group=month, colour=month)) + geom_boxplot()

ggplot(final_condos_table_time_transformation,aes(x=month, y=sale.price.log, 
                                                  fill=month, group=month, colour=month)) + geom_boxplot()

ggplot(final_coops_table_time_transformation,aes(x=month, y=sale.price.log, 
                                                 fill=month, group=month, colour=month)) + geom_boxplot()

install.packages("doBy")
library("doBy")


siterange <- function(x){c(length(x),mean(x),median(x))}

# Summary statistics across boroughs

summaryBy(borough+sale.price+gross.sqft~building.class.category, data=final_homes_table, FUN=siterange)

summaryBy(borough+sale.price+gross.sqft~building.class.category, data=final_condos_table, FUN=siterange)

summaryBy(borough+sale.price+gross.sqft~building.class.category, data=final_coops_table, FUN=siterange)

# Summary statistics across time

summaryBy(sale.price+gross.sqft~month, data=final_homes_table_time_transformation, FUN=siterange)

summaryBy(sale.price+gross.sqft~month, data=final_condos_table_time_transformation, FUN=siterange)

summaryBy(sale.price+gross.sqft~month, data=final_coops_table_time_transformation, FUN=siterange)