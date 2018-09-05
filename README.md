# Amrita University Management system API 

[![Gopala Krishnan| Amrita](https://cldup.com/dTxpPi9lDf.thumb.png)](https://www.amrita.edu/)

AUMS-api is an API built to ease the developement process for native/web apps working on top of it. The author has built the API using Express and Node. The api is currently shifting from its developement phase to deployment, with features to be rolled out in the near future. The readme is the broad overlay of the following

  - Getting started with requests in A-api
  - Developement and Contribution

# Getting started with AUMS-api!

The api has been hosted on Heroku thanks to its 750 free hours of computation and its flawless working with simple applications. The following lines will focus on sending POST requests to the api for simple queries and a more detailed procedure on a select few. The API currently supports 7 POST requests with more scheduled for later. Down below we post a request to access student-grade records. 

 # Note
> The author recommends sending cookies from session in the post request for faster returns. All requests are maintained so as to return the session cache for every query along with the requested attributes.

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

Breaking down the POST methods we find that the required details are the attributes for creating new session and additional options if any. The highlighted part in the image ![ here ](https://imgur.com/a/nGAPGia) shows the parameters to consider when sending a particular request with reference to the grades request here. 

### Development

Want to **contribute**? Great!

 The Author maintains an active GitHub profile and is open to addictions to the code. Any idea or improvement in the code or associated working environment can be addressed in the issues session on GitHub. 

Do not hesistate to show what you have built using the API here. The author appreciates your time spent on the AUMS-api.

### Todos

 - Update method name: Registration
 - Additional POST requests.

License
----
MIT

