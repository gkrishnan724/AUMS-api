# Amrita University Management system API 

[![Gopala Krishnan| Amrita](https://cldup.com/dTxpPi9lDf.thumb.png)](https://www.amrita.edu/)

AUMS-api is an API built to ease the developement process for native/web apps working on top of it. The author has built the API using Express and Node. The api is currently shifting from its developement phase to deployment, with features to be rolled out in the near future. The readme is the broad overlay of the following

  - Getting started with requests in AUMS-api
  - Developement and Contribution

# Getting started with AUMS-api!

The api has been hosted on Heroku thanks to its 750 free hours of computation and its flawless working with simple applications. You can find the same here
```sh
https://aumshelper.herokuapp.com/api/aums
```
The following lines will focus on sending POST requests to the api for simple queries and a more detailed table on the request parameters and JSON return object. The API currently supports 7 POST requests with more scheduled for later. Down below we post a request to access student-grade records. 

 # Note
> The author recommends sending cookies from session in the post request for faster returns. All requests are maintained so as to return the session cookies for every query along with the requested attributes.

We send the appropriate request from heroku as follows:
```sh
{
	"username":"am.en.u4cse16***",
	"password":"Your Password here",
	"options":{ 
		"sem": "4"
	}
}
```
adding you session cookies is again recommend for the same reasons as mentioned above.
```sh
"cookies": "CASTGC=TGT-75012-BHU7QUgO0DuL4abaTQJRk2cZrgLyfwcpGmq6IbI4vG13Ifrjqo-aumstest; JSESSIONID=97A5899AAC176AB3D9D888D6A636D989; JSESSIONID1=243cd650-19e0-4299-a758-2bf17421b6b2.localhost",
```
Heading over to **api/routes/aums-route.js** we see all the POST requests defined with associated definitions in **/modules**. Now we shall learn how to send appropriate options and request keywords for a particular POST request.

Breaking down the POST methods we find that the required details are the attributes for creating new session and additional options if any. The highlighted part in the image ![ here ](https://i.imgur.com/OLVjY9d.png)
shows the parameters to consider when sending a particular request with reference to the grades request here. Down below we walkthrough all seven API calls and what it returns.

**1) login**
```sh
#route : aumshelper.herokuapp.com/api/aums/login
#request params: {
	"username":"am.en.u4cse16***",
	"password":"Your_password_here"
}
#return:{
    "cookies": "CASTGC=TGT-75251-evfkoiQJfODjJP6ZsGA6QetdaemdKcZEBVvgKdfH2LYgLSoUKU-aumstest; JSESSIONID=112033054E47DFE48DF14937F60DB5AC; JSESSIONID1=7876e2c7-0348-49c0-8564-23cc526a83cf.localhost",
    "URLS": [
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/29265",
            "code": "CIR_Com_OT"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/26474",
            "code": "15ENG230"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/25110",
            "code": "15AVP201"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/27634",
            "code": "15AVP211"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/23289",
            "code": "15CHY100"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/23302",
            "code": "15CHY181"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/21919",
            "code": "15CSE100"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/23292",
            "code": "15CSE102"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/23295",
            "code": "15CSE111"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/23308",
            "code": "15CSE180"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/25089",
            "code": "15CSE201"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/25092",
            "code": "15CSE202"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/27612",
            "code": "15CSE211"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/27616",
            "code": "15CSE212"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/27619",
            "code": "15CSE213"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/25101",
            "code": "15CSE281"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/25104",
            "code": "15CSE282"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/27625",
            "code": "15CSE285"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/27628",
            "code": "15CSE286"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/29699",
            "code": "15CSE301"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/29703",
            "code": "15CSE302"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/29707",
            "code": "15CSE303"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/29555",
            "code": "15CSE379"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/29719",
            "code": "15CSE381"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/21936",
            "code": "15CUL101"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/23311",
            "code": "15CUL111"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/25095",
            "code": "15ECE202"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/25107",
            "code": "15ECE281"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/23298",
            "code": "15EEE111"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/23305",
            "code": "15EEE180"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/21913",
            "code": "15ENG111"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/29711",
            "code": "15ENV300"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/21916",
            "code": "15MAT111"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/23286",
            "code": "15MAT121"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/25098",
            "code": "15MAT201"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/27622",
            "code": "15MAT213"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/29715",
            "code": "15MAT301"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/21929",
            "code": "15MEC100"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/21927",
            "code": "15MEC180"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/21922",
            "code": "15PHY100"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/21925",
            "code": "15PHY181"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/27631",
            "code": "15SSK221"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/29723",
            "code": "15SSK321"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/25661",
            "code": "SS1"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/27703",
            "code": "15JAP230"
        },
        {
            "url": "https://aums-apps-6.amrita.edu:8443/portal/site/19652",
            "code": "15CUL101"
              }
    ]
}
```
*Note:* All requests return cookies value, use these return values on further requests, the cookie as a parameter helps directly access the POST call in the route instead of logging in and then accessing it, saving considerable time.

**2)Grades**
```sh
#route: aumshelper.herokuapp.com/api/aums/grades
#request params: {
	"username":"am.en.u4cse16***",
	"password":"Your_passwd_here",
	"options":{
		"sem":"4"
	}
}
#return:{
    "cookies": "CASTGC=TGT-75256-TpCgz9kFZcy6zopz09EB04e25uhgwUB7HhSqKGS9fkkcpVkHXM-aumstest; JSESSIONID=B0EF62FDD1B818C319E01E9D0FD3DBD2; JSESSIONID1=0a6e4e97-a0fc-4a55-bfe1-99407999832e.localhost",
    "data": {
        "SGPA": "9.12",
        "grades": [
            {
                "code": "15JAP230",
                "name": "Proficiency in Japanese Language(Lower)",
                "type": "Regular",
                "grade": "B+"
            },
            {
                "code": "15CSE211",
                "name": "Design and Analysis of Algorithms",
                "type": "Regular",
                "grade": "A+"
            },
            {
                "code": "15CSE212",
                "name": "Introduction to Embedded Systems",
                "type": "Regular",
                "grade": "O"
            },
            {
                "code": "15CSE213",
                "name": "Operating Systems",
                "type": "Regular",
                "grade": "A"
            },
            {
                "code": "15CSE285",
                "name": "Embedded Systems Lab.",
                "type": "Regular",
                "grade": "O"
            },
            {
                "code": "15CSE286",
                "name": "Operating Systems Lab.",
                "type": "Regular",
                "grade": "A+"
            },
            {
                "code": "15MAT213",
                "name": "Probability and Random Processes",
                "type": "Regular",
                "grade": "A"
            },
            {
                "code": "15SSK221",
                "name": "Soft Skills I",
                "type": "Regular",
                "grade": "B+"
            }
        ]
    }
}
```
**3) Attendance**
```sh
#route: aumshelper.herokuapp.com/api/aums/attendance
#request params: {
	"username":"am.en.u4cse16***",
	"password":"Your_passwd_here",
	"options":{
		"sem":"4"
	}
}
#return: {
    "cookies": "CASTGC=TGT-75261-7tebOVCNSauGbed7WSbNY67sWYb9fA6rgMAmPxbGRbmNHByvHq-aumstest; JSESSIONID=9FF6AFB611FF5CB67DB5CA8D4E6DE5B3; JSESSIONID1=bef50520-874a-47ee-8eec-5cb5447df21b.localhost",
    "data": [
        {
            "code": "15CSE211",
            "name": "Design and Analysis of Algorithms",
            "type": "Theory",
            "classes": "53",
            "attended": "41.0",
            "percentage": "77.36"
        },
        {
            "code": "15CSE212",
            "name": "Introduction to Embedded Systems",
            "type": "Theory",
            "classes": "45",
            "attended": "36.0",
            "percentage": "80.0"
        },
        {
            "code": "15CSE213",
            "name": "Operating Systems",
            "type": "Theory",
            "classes": "52",
            "attended": "43.0",
            "percentage": "82.69"
        },
        {
            "code": "15CSE285",
            "name": "Embedded Systems Lab.",
            "type": "Theory",
            "classes": "24",
            "attended": "22.0",
            "percentage": "91.67"
        },
        {
            "code": "15JAP230",
            "name": "Proficiency in Japanese Language(Lower)",
            "type": "Theory",
            "classes": "18",
            "attended": "14.0",
            "percentage": "77.78"
        },
        {
            "code": "15MAT213",
            "name": "Probability and Random Processes",
            "type": "Theory",
            "classes": "58",
            "attended": "45.0",
            "percentage": "77.59"
        },
        {
            "code": "15SSK221",
            "name": "Soft Skills I",
            "type": "Theory",
            "classes": "37",
            "attended": "29.0",
            "percentage": "78.38"
        }
    ]
}
```
**4) Marks**
```sh
#route: aumshelper.herokuapp.com/api/aums/marks
#request params: {
	"username":"am.en.u4cse16***",
	"password":"******",
	"options":{
		"sem":"4"
	}
}
#return: {
    "cookies": "CASTGC=TGT-75262-1Fu4H0MuGYmEXbdSQiL7K1bcQ97IHfQduyQ7sUSgZRi31jpDOx-aumstest; JSESSIONID=ABDFB9D9DE823F23CEA2784022D20870; JSESSIONID1=76bd1dab-d85e-48fa-88fa-1a6142b95331.localhost",
    "data": [
        {
            "code": "15JAP230",
            "Periodical exam II": "42.0"
        },
        {
            "code": "15MAT213",
            "Assignment": "18.5",
            "Periodical Exam I": "33.0",
            "Periodical exam II": "42.0"
        },
        {
            "code": "15SSK221",
            "Class Participation": "26.0",
            "Periodical Exam I": "19.0"
        },
        {
            "code": "15CSE286",
            "Periodical Exam I": "15.0",
            "Periodical exam II": "20.0"
        },
        {
            "code": "15CSE285"
        },
        {
            "code": "15CSE213",
            "Assignment": "14.0",
            "Periodical Exam I": "37.0"
        },
        {
            "code": "15CSE212",
            "Periodical Exam I": "35.0",
            "Periodical exam II": "44.0"
        },
        {
            "code": "15CSE211",
            "Periodical Exam I": "45.5",
            "Periodical exam II": "45.0",
            "Total Internal": "19.0"
        },
        {
            "code": "15AVP211"
        }
    ]
}
```
**5) Assignment**
```sh
#route: aumshelper.herokuapp.com/api/aums/assignments
#request params:{
	"username":"am.en.u4cse16***",
	"password":"Your_passwd_here",
	"options":{
		"sem":"4"
	}
}

```
**6) Registration**
```sh
#route: aumshelper.herokuapp.com/api/aums/registration
#request params: {
	"username":"am.en.u4cse16***",
	"password":"Your_passwd_here",
	"options":{
		"sem":"4"
	}
}
#return: {
    "cookies": "CASTGC=TGT-75269-poIvvMwt3yUaOlhdf2IEpWvCFXqSMRMTNYOUhoLeId2UbxBewr-aumstest; JSESSIONID=E031733525B7F9F458BA58461F267D57; JSESSIONID1=7296dc80-b1fe-4df5-b5cb-030128628988.localhost",
    "data": [
        {
            "code": "15AVP211:Amrita Values Programme II",
            "studentEndorsement": "Y",
            "departmentEndorsement": "Y",
            "financialEndorsement": "Y",
            "registrarEndorsement": "Y"
        },
        {
            "code": "15CSE211:Design and Analysis of Algorithms",
            "studentEndorsement": "Y",
            "departmentEndorsement": "Y",
            "financialEndorsement": "Y",
            "registrarEndorsement": "Y"
        },
        {
            "code": "15CSE212:Introduction to Embedded Systems",
            "studentEndorsement": "Y",
            "departmentEndorsement": "Y",
            "financialEndorsement": "Y",
            "registrarEndorsement": "Y"
        },
        {
            "code": "15CSE213:Operating Systems",
            "studentEndorsement": "Y",
            "departmentEndorsement": "Y",
            "financialEndorsement": "Y",
            "registrarEndorsement": "Y"
        },
        {
            "code": "15CSE285:Embedded Systems Lab.",
            "studentEndorsement": "Y",
            "departmentEndorsement": "Y",
            "financialEndorsement": "Y",
            "registrarEndorsement": "Y"
        },
        {
            "code": "15CSE286:Operating Systems Lab.",
            "studentEndorsement": "Y",
            "departmentEndorsement": "Y",
            "financialEndorsement": "Y",
            "registrarEndorsement": "Y"
        },
        {
            "code": "15MAT213:Probability and Random Processes",
            "studentEndorsement": "Y",
            "departmentEndorsement": "Y",
            "financialEndorsement": "Y",
            "registrarEndorsement": "Y"
        },
        {
            "code": "15SSK221:Soft Skills I",
            "studentEndorsement": "Y",
            "departmentEndorsement": "Y",
            "financialEndorsement": "Y",
            "registrarEndorsement": "Y"
        },
        {
            "code": "15JAP230:Proficiency in Japanese Language(Lower)",
            "studentEndorsement": "N",
            "departmentEndorsement": "N",
            "financialEndorsement": "Y",
            "registrarEndorsement": "Y"
        }
    ]
}
```
**7) Dues**
```sh
#route: aumshelper.herokuapp.com/api/aums/dues
#request params: {
	"username":"am.en.u4cse16***",
	"password":"Your_passwd_here"
}
#return:{
    "cookies": "CASTGC=TGT-75275-Uk2uv7EBzmCikdfBGfULikmcsnfKdglilDpoYs7ofLSFVMmoB3-aumstest; JSESSIONID=D15920C586EFD79D1E299082C99752DF; JSESSIONID1=71233c5d-d89a-4a91-b0bb-f3be5deeb60f.localhost",
    "data": [
        {
            "author": "sojab",
            "code": "ASAS, Amritapuri  , CHE",
            "remarks": "chemistry lab common fine",
            "date": "15/05/2017",
            "fine": "20.0",
            "paid": "0.0"
        },
        {
            "author": "sumeshkp",
            "code": "ASE, Amritapuri  , HOSTEL",
            "remarks": "unauthorized absent",
            "date": "27/04/2018",
            "fine": "100.0",
            "paid": "0.0"
        }
    ]
}
   
```
### Development

Want to **contribute**? Great!

 The Author maintains an active GitHub profile and is open to additions to the code. Any idea or improvement in the code or associated working environment can be addressed in the issues session on GitHub. 

Do not hesistate to show what you have built using the API here. The author appreciates your time spent on the AUMS-api.

### Todos

 - Update method name: Registration
 - Additional POST requests.

License
----
MIT
