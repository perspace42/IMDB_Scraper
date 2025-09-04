'''
Author: Scott Field
Date: 09/01/2025
Purpose:
Using selenium scrape data from a given movie/tv show title
then output that data to the user
'''
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By


#Get Brave Browser Location
options = Options()
options.binary_location = "/usr/bin/brave-browser"

#Use Chrome Driver For Brave Browser
driver = webdriver.Chrome(options=options)
#Get Website
driver.get("https://www.imdb.com/")
driver.implicitly_wait(0.5)

#Get Search Elements From Website
searchText = driver.find_element(
    By.ID,"suggestion-search"
)
searchSubmitBtn = driver.find_element(
    By.ID,"suggestion-search-button"
)

#Submit Search
name = input("Please Enter a Title To Search For\n:")
searchText.send_keys(name)
searchSubmitBtn.click()

#Find Box
resultsBox = driver.find_element(
    By.CSS_SELECTOR, "section[data-testid='find-results-section-title']"
)
#Grab List of Titles From Box
titlesList = resultsBox.find_element(
    By.CSS_SELECTOR,"ul[role='presentation']"
)
#Grab Text from titlesList
titles = titlesList.find_elements(
    By.TAG_NAME,"li"
)
#Grab Links from titlesList
links = titlesList.find_elements(
    By.TAG_NAME,"a"
)
#The number of Links is the number of titles
numTitles = len(links)

inner = 0
for index in range(1,numTitles+1,1):
    print(f"{index:}\
    \tTITLE  :\t{titles[inner].text}\
    \tRELEASE:\t{titles[inner+1].text}\
    \tCREATOR:\t{titles[inner+2].text}\
    ")
    inner+=3

#User Enters Selected Title Index
selection = input("Please Enter The Series Index\n:")
#Page Then Changes To That Selection
links[int(selection)].click()

input("Select Any Key to Exit")
#Close
driver.quit()
