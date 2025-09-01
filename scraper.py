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
search = driver.findElement(By.ID,"suggestion-search")
