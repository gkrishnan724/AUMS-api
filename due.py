from __future__ import print_function
import requests 
import json
import datetime
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
import datetime
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

#garbage call
SCOPES = ['https://www.googleapis.com/auth/calendar.events']
creds = None
# The file token.pickle stores the user's access and refresh tokens, and is
# created automatically when the authorization flow completes for the first
# time.
if os.path.exists('token.pickle'):
    with open('token.pickle', 'rb') as token:
        creds = pickle.load(token)
# If there are no (valid) credentials available, let the user log in.
if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    else:
        flow = InstalledAppFlow.from_client_secrets_file(
            'credentials.json', SCOPES)
        creds = flow.run_local_server()
    # Save the credentials for the next run
    with open('token.pickle', 'wb') as token:
        pickle.dump(creds, token)

service = build('calendar', 'v3', credentials=creds)
#end of garbage

now = datetime.datetime.now()
month=now.month
aums_months={"Jan":'01',"Feb":"02","Mar":'03',"Apr":'04',"May":'05',"Jun":'06',"Jul":'07',"Aug":'08',"Sep":'09',"Oct":'10',"Nov":'11',"Dec":'12'}
subs = ["15CSE312","15CSE311","15CSE386","15CSE313","15CSE358","15CSE341","15CSE385","15SSK331"]
sub_alias={"15CSE312":"Computer Networks","15CSE311": "Compiler Design","15CSE386":"Computer Networks Lab","15CSE313":"Software Engineering","15CSE358":"NLP","15CSE341":"Crypto","15CSE385":"Compiler Design Lab","15SSK331":"Soft Skills"}
resp=requests.post('http://aumshelper.herokuapp.com/api/aums/login',json={"username":"username here","password":"password here"})
data = resp.json()
cookie=data["cookies"]
assignments = []
for sub_code in subs:
    resp=requests.post('http://aumshelper.herokuapp.com/api/aums/assignments',json={"username":"username here","password":"password here","options":{"code":sub_code},"cookies":cookie})
    data = resp.json()
    cookie=data["cookies"]
    if len(data["data"]) > 0:
        for item in data["data"]:
            index=item['dueDate'].split(" ")
            index1=index[0]
            date_assign=index1
            if(int(aums_months[date_assign])==month):
                print("Month:"+str(index[0])+" "+"Subject_Code:"+str(sub_alias[sub_code])+" "+"Work:"+str(item['title'])+" "+"due on:"+str(index[0])+str(index[1]))
                print(index[1][:-1])
                event = {
                        'summary': str(sub_alias[sub_code]),
                        'description': 'Assignment:'+str(item['title']) ,
                        'start': {
                            'dateTime': '2019-'+aums_months[date_assign]+'-'+str(index[1][:-1])+'T09:00:00',
                            'timeZone': 'Asia/Kolkata',
                        },
                        'end': {
                            'dateTime': '2019-'+aums_months[date_assign]+'-'+str(index[1][:-1])+'T23:00:00',
                            'timeZone': 'Asia/Kolkata',
                        },
                }
                event = service.events().insert(calendarId='primary', body=event).execute()
                print ('Event created: %s' % (event.get('htmlLink')))




