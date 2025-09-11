class Series:
    def __init__(self):
        self.title = None #Always contained in <a> text
        self.dateStr = None #Always in 2nd presentation line 1st <li>
        self.epsTypeStr = None #If 2nd presentation line contains exactly 2 <li>
        self.actStr = None #If 3rd presentation line contains 1<li>
        self.text = None #Contained in next page
