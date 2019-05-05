const rp = require('request');
const cheerio = require('cheerio');
const Promise = require('bluebird');
const BASE_URL = process.env.BASE_URL || "https://aums-apps-5.amrita.edu:8443";
let login_url =  BASE_URL + '/cas/login?service='+encodeURIComponent(BASE_URL)+'%2Faums%2FJsp%2FCore_Common%2Findex.jsp'

let url_list = {
    HomePage:BASE_URL+'/aums/Jsp' + '/DefineComponent/StaffHomePage.jsp?action=UMS-EVAL_CLASSHEADER_SCREEN_LINK',
    registrationStatus:BASE_URL+'/aums/Jsp' + '/Student/StudentRegistrationStatus.jsp?action=UMS-SRM_INIT_STUDENT_REGISTRATION_STATUS&isMenu=true',
    viewMarks:BASE_URL+'/aums/Jsp'+'/Marks/ViewPublishedMark.jsp?action=UMS-EVAL_STUDMARKVIEW_INIT_SCREEN&isMenu=true',
    viewGrades:BASE_URL+'/aums/Jsp'+'/StudentGrade/StudentPerformanceWithSurvey.jsp?action=UMS-EVAL_STUDPERFORMSURVEY_INIT_SCREEN&isMenu=true',
    viewAttendance:BASE_URL+'/aums/Jsp'+'/Attendance/AttendanceReportStudent.jsp?action=UMS-ATD_INIT_ATDREPORTSTUD_SCREEN&isMenu=true',
    viewFee:BASE_URL+'/aums/Jsp'+'/Finance/StudentFeeDetails.jsp?action=UMS-FINANCE_FEEDET_INIT_SCREEN&isMenu=true',
    viewDues:BASE_URL+'/aums/Jsp'+'/NoDues/ViewDues.jsp?action=UMS-NODUES_INIT_VIEW_DUES&isMenu=true',
    navUrl: BASE_URL + '/aums/Jsp' + '/DefineComponent/ClassHeader.jsp?action=UMS-EVAL_CLASSHEADER_SCREEN_INIT'

}



/* Session Constructor */

function Session(username,password,sessionCookies,subUrls){
    this.username = username;
    this.password = password;
    this.cookieJar = rp.jar();
    var self = this;
    this.sessionCookies = sessionCookies;
    if(sessionCookies){
        let cookieList = sessionCookies.split(';')
        cookieList.forEach(function(cookie){
            self.cookieJar.setCookie(rp.cookie(cookie),BASE_URL);
        });
    }
    this.request = rp.defaults({
        followAllRedirects:true,
        headers:{
            'Connection': 'keep-alive',  
            'Accept-Encoding': 'gzip, deflate', 
            'Accept': '*/*', 
            'User-Agent': 'requests'
        },
        jar:this.cookieJar
    });
    this.urls = [];
    if(subUrls){
        this.urls = subUrls;
    }
    this.homeUrl =  BASE_URL + '/portal/site/~'+self.username;
}


Session.prototype.login = Promise.coroutine(function *(username,password){
    var self = this;
    if(!self.sessionCookies){
        var request = self.request;
        var post = function(url,form){
            return new Promise(function(resolve,reject){
                request.post({url:url,form:form},function(err,response,body){
                    console.log(err);
                    if (err) reject({error:500,message:"Internal server error"});
                    console.log(response);
                    if(!body){
                        reject({message:"Internal server error"});
                    }
                    console.log(body);
                    let $ = cheerio.load(body,{lowerCaseTags:true});
                    if($('input[name="lt"]').val()){
                        reject({error:401,message:"Incorrect Credentials"});
                    }
                    else{
                        var user = $('td[class="style3"]').html()
                        var name = user.substr(0,user.indexOf('('));
                        self.loggedIn = true;
                        self.homeUrl = BASE_URL + '/portal/site/~'+self.username
                        resolve(name);
                    }
                })
            });
        };

        yield new Promise(function(resolve,reject){
            request({url:login_url},function(err,response,body){
                if (err) reject({error:500,message:"Internal server error"});
                if(!body){
                    reject({message:"Internal server error"});
                }
                let $ = cheerio.load(body,{lowerCaseTags:true});
                self.lt = $('input[name="lt"]').val();
                self._eventId = $('input[name="_eventId"]').val();
                self.submit = $('input[name="submit"]').val();
                self.login_url = BASE_URL + $('#fm1').attr('action');
                console.log(self.login_url);
                
                resolve();
            });
        });

        let formData = {
            username:username,
            password:password,
            lt:self.lt,
            _eventId:self._eventId,
            submit:self.submit
        }
        console.log(formData);
        self.name = yield post(self.login_url,formData);
        console.log(self.name);
        yield self.getAllUrls();
    }
    
    
    self.sessionCookies = self.cookieJar.getCookieString(login_url);
    return self.name;

});


Session.prototype.getAnnouncements = Promise.coroutine(function *(){
    var self = this;
    var request = self.request;
    yield self.login(self.username,self.password);
    var url = self.homeUrl;
    let data = yield new Promise(function(resolve,reject){
        request(url,function(err,response,body){
            if (err) reject({error:500,message:"Internal server error"});
            if(!body){
                reject({message:"Internal server error"});
            }
            let $ = cheerio.load(body,{lowerCaseAttributeNames:true,lowerCaseTags:true});
            if($('input[name="lt"]').val()){
                self.sessionCookies = undefined;
                
                self.request = 
                resolve(-1);
                return;
            }
            let announceUrl = $('.icon-sakai-announcements').attr('href');
            request(announceUrl,function(err,response,body){
                if(err) reject({error:500,message:"Internal server error"});
                let $ = cheerio.load(body,{lowerCaseAttributeNames:true,lowerCaseTags:true});
                var newurl = $('iframe').attr('src');
                let formData = {
                    eventSubmit_doChange_pagesize:'changepagesize',
                    selectPagesize:'200'
                }
                request.post({uri:newurl,form:formData},function(err,response,body){
                    
                    let $ = cheerio.load(body,{lowerCaseAttributeNames:true,lowerCaseTags:true});
                    let data = [];
                    $('tr').each(function(i,elem){
                        if(i > 0){
                            let obj = {};
                            let $select = cheerio.load($(this).html())
                            obj.title = $select('a').text().trim();
                            obj.link = $select('a').attr('href');
                            obj.author = $(this).find('td[headers="author"]').text().trim()
                            var course =  $(this).find('td[headers="channel"]').text().trim();
                            obj.code = course.substr(course.lastIndexOf('.')+1);
                            obj.date = $(this).find('td[headers="date"]').text().trim()
                            
                            data.push(obj);
                        }
                    });
                    resolve(data);
                });
                
                
            });
        });

    });

    if(data == -1){
        data = yield self.getAnnouncements();
    }

    return data;
    
});

Session.prototype.getGrades = Promise.coroutine(function *(sem){
    var self = this;
    var url = url_list.viewGrades;
    var request = self.request;
    self.name = yield self.login(self.username,self.password);

    let data = yield new Promise(function(resolve,reject){
        request(url,function(err,response,body){
            let $ = cheerio.load(body,{lowerCaseTags:true});
            if($('input[name="lt"]').val()){
                self.sessionCookies = undefined;
                resolve(-1);
                return;
            }
            let formData = {};
            formData.Page_refIndex_hidden = $('input[name="Page_refIndex_hidden"]').val();
            formData.htmlPageTopContainer_hiddentblGrades = $('input[name="htmlPageTopContainer_hiddentblGrades"]').val();
            formData.htmlPageTopContainer_status = $('input[name="htmlPageTopContainer_status"]').val();
            formData.htmlPageTopContainer_action = "UMS-EVAL_STUDPERFORMSURVEY_CHANGESEM_SCREEN";
            formData.htmlPageTopContainer_notify = $('input[name="htmlPageTopContainer_notify"]').val();
            let select = $('select[name="htmlPageTopContainer_selectStep"]').children();
            select.each(function(i,elem){
                if($(this).text() == sem){
                    formData.htmlPageTopContainer_selectStep = $(this).val();
                    return;
                }
            });
            for(var key in formData){
                if(formData.hasOwnProperty(key)){
                   if(!formData[key]){
                       formData[key] = '';
                   }
                }
            }

            request.post({uri:url,form:formData},function(err,response,body){
                let $ = cheerio.load(body,{lowerCaseAttributeNames:true,lowerCaseTags:true});
                let table;
                $('tr[align="right"]').each(function(i,elem){
                    if(i == 1){
                      table =  $(this).html();
                      return;
                    }
                });
                $ = cheerio.load(table);
                let data = {
                    SGPA:'',
                    grades:[]
                };
                $('tbody').children().each(function(i,elem){
                    let obj = {};
                    if(i > 0){
                        let $select = cheerio.load($(this).html());
                        if($select('span:nth-child(1)').text() != 'SGPA'){
                            obj.code = $select('span:nth-child(2)').text();
                            obj.name = $select('span:nth-child(3)').text();
                            obj.type = $select('span:nth-child(5)').text();
                            obj.grade = $select('span:nth-child(6)').text();
                            data.grades.push(obj);
                        }else{
                            data.SGPA = $select('span:nth-child(2)').text();
                        }
                    }
                });
                resolve(data);
            });


        });
    });

    if(data == -1){
        data = yield self.getGrades(sem);
    }

    return data;
    
});



Session.prototype.getAttendance = Promise.coroutine(function *(sem,type){
    
    if(type){
        var type = type.toLowerCase();
        if(type.includes("lab") || type.includes("practical")){
            type = 2;
        }
        else{
            type = 1;
        }
    }
    else{
        type = 1;
    }
    var self = this;
    var url = url_list.viewAttendance;
    var request = self.request;
    self.name = yield self.login(self.username,self.password);

    let data = yield new Promise(function(resolve,reject){
        request(url,function(err,response,body){
            if(err) reject({error:500,message:"Internal server error"});
            let $  = cheerio.load(body,{lowerCaseTags:true});
            if($('input[name="lt"]').val()){
                self.sessionCookies = undefined;
                resolve(-1);
                return;
            }
            let formData = {};
            formData.Page_refIndex_hidden = $('input[name="Page_refIndex_hidden"]').val();
            formData.htmlPageTopContainer_txtrollnumber = $('input[name="htmlPageTopContainer_txtrollnumber"]').val();
            formData.htmlPageTopContainer_hiddentSummary = $('input[name="htmlPageTopContainer_hiddentSummary"]').val();
            formData.htmlPageTopContainer_status = $('input[name="htmlPageTopContainer_status"]').val();
            formData.htmlPageTopContainer_action = 'UMS-ATD_SHOW_ATDSUMMARY_SCREEN';
            formData.htmlPageTopContainer_notify = $('input[name="htmlPageTopContainer_notify"]').val();
            formData.htmlPageTopContainer_hidrollNo = $('input[name="htmlPageTopContainer_hidrollNo"]').val();
            let semselect = $('select[name="htmlPageTopContainer_selectSem"]').children();
            formData.htmlPageTopContainer_selectType = '' + type;
            formData.htmlPageTopContainer_selectCourse = '0';

            semselect.each(function(i,elem){
                if ($(this).text() == sem){
                    formData.htmlPageTopContainer_selectSem = $(this).val();
                    return;
                }
            });


            for(var key in formData){
                if(formData.hasOwnProperty(key)){
                   if(!formData[key]){
                       formData[key] = '';
                   }
                }
            }
            
            
            
            request.post({uri:url,form:formData},function(err,response,body){
                let data = [];
                if (err) reject({error:500,message:"Internal server error"});
                let $ = cheerio.load(body,{lowerCaseTags:true});
                let table = $('tr[align="right"]').first().children().first().html();
                $ = cheerio.load(table);
                $('tbody').children().each(function(i,elem){
                    let obj = {};
                    if(i > 0){
                        let $select = cheerio.load($(this).html());
                        
                        if($select('span:nth-child(1)').text().trim() != ''){
                            obj.code = $select('span:nth-child(1)').text();
                            obj.name = $select('span:nth-child(2)').text();
                            obj.type = $select('span:nth-child(3)').text();
                            obj.classes = $select('span:nth-child(6)').text();
                            obj.attended = $select('span:nth-child(7)').text();
                            obj.percentage = $select('span:nth-child(8)').text();
                            data.push(obj);
                        }
                    }   
                    
                });

                resolve(data);
            });
        });
    });

    if(data == -1){
        data = yield self.getAttendance(sem,type);
    }
    return data;    
});

Session.prototype.getAssignment = Promise.coroutine(function *(courseCode){
    var self = this;
    var request = self.request;
    yield self.getAllUrls();
    self.name = yield self.login(self.username,self.password);
    var obj  = self.urls.find(function(obj){
        return obj.code ==  courseCode;
    });
    
    let data = yield new Promise(function(resolve,reject){
        if(!obj){
            reject({error:404,message:"Invalid subject code"});
        }
        let url = obj.url;
        request(url,function(err,response,body){
            if(err) reject({error:500,message:"Internal server error"});
            let $ = cheerio.load(body,{lowerCaseAttributeNames:true,lowerCaseTags:true});
            if($('input[name="lt"]').val()){
                self.sessionCookies = undefined;
                resolve(-1);
                return;
            }
            var assignmentUrl = $('.icon-sakai-assignment-grades').attr('href');

            request(assignmentUrl,function(err,response,body){
                if(err) reject({error:500,message:"Internal server error"});
                let $ = cheerio.load(body,{lowerCaseAttributeNames:true,lowerCaseTags:true});

                var newurl = $('iframe').attr('src');

                request(newurl,function(err,response,body){
                    if(err) reject({error:500,message:"Internal server error"});
                    let $ = cheerio.load(body,{lowerCaseAttributeNames:true,lowerCaseTags:true});
                    let data = [];
                    $('tr').each(function(i,elem){
                        if(i > 0){
                            let obj = {};
                            let $select = cheerio.load($(this).html())
                            obj.title = $select('a').text().trim();
                            obj.link = $select('a').attr('href');
                            obj.openDate = $(this).find('td[headers="openDate"]').text().trim()
                            obj.dueDate = $(this).find('td[headers="dueDate"]').text().trim()
                            data.push(obj);
                        }
                    });
                    resolve(data);

                });
            });
        });
    });
    if(data == -1){
        data = yield self.getAssignment(courseCode);
    }
    return data;
});


Session.prototype.getAllUrls = Promise.coroutine(function *(){
    var self = this;
    var request = self.request;
    var url = self.homeUrl;
    if(self.urls.length == 0){
        yield new Promise(function(resolve,reject){
            request(url,function(err,response,body){
                if(err) reject({error:500,message:"Internal server error"});
                let $ = cheerio.load(body,{lowerCaseAttributeNames:true,lowerCaseTags:true});
                var $comments = $("*").contents().filter(function () {
                    return this.nodeType === 8;
                });
                var comment;
                $comments.each(function(){
                    if(this.data.includes('<div class="siteNavWrap workspace">')){
                        comment = this.data;
                        return;
                    }
                });

                let $urls = cheerio.load(comment,{lowerCaseAttributeNames:true,lowerCaseTags:true});
                
                $urls('#siteLinkList').children().each(function(i,elem){
                    let obj = {};
                    obj.url = $(this).find('a').attr('href');
                    var course = $(this).find('a').attr('title');
                    if(course){
                        obj.code = course.substr(course.lastIndexOf('.')+1);
                        self.urls.push(obj);
                    }
                });

                $urls('select').children().each(function(i,elem){
                    let obj = {};
                    obj.url = $(this).attr('value')
                    var course = $(this).attr('title')
                    if(course){
                        obj.code = course.substr(course.lastIndexOf('.')+1);
                        self.urls.push(obj);
                    }
                });
                resolve();     
        
            });
        });
    }
});


Session.prototype.getMarks = Promise.coroutine(function *(sem){
    var self = this;
    var url = url_list.viewMarks;
    var request = self.request;
    self.name = yield self.login(self.username,self.password);
    let data = yield new Promise(function(resolve,reject){
        request(url,function(err,response,body){
            if(err) reject({error:500,message:"Internal server error"});
            let $ = cheerio.load(body,{lowerCaseTags:true,lowerCaseAttributeNames:true});
            if($('input[name="lt"]').val()){
                self.sessionCookies = undefined;
                resolve(-1);
                return;
            }
            let formData = {};
            formData.Page_refIndex_hidden = $('input[name="Page_refIndex_hidden"]').val();
            formData.htmlPageTopContainer_status = $('input[name="htmlPageTopContainer_status"]').val();
            formData.htmlPageTopContainer_action = 'UMS-EVAL_STUDMARKVIEW_SELSEM_SCREEN';
            formData.htmlPageTopContainer_notify = $('input[name="htmlPageTopContainer_notify"]').val();
            let select = $('select[name="htmlPageTopContainer_selectStep"]').children();

            select.each(function(i,elem){
                if($(this).text() == sem){
                    formData.htmlPageTopContainer_selectStep = $(this).val();
                    return;
                }
            });

            for(var key in formData){
                if(formData.hasOwnProperty(key)){
                   if(!formData[key]){
                       formData[key] = '';
                   }
                }
            }

            request.post({uri:url,form:formData},function(err,response,body){
                if(err) reject({error:500,message:"Internal server error"});

                let $ = cheerio.load(body,{lowerCaseAttributeNames:true,lowerCaseTags:true});
                let table; 
                $('tr[align="right"]').each(function(i,elem){
                    if(i == 1){
                      table =  $(this).html();
                      return;
                    }
                });
                $ = cheerio.load(table);
                let data = [];
                $('tbody').children().each(function(i,elem){
                    let $select = cheerio.load($(this).html())
                    if(i == 0){
                        $(this).children().each(function(i,elem){
                            if(i > 2){
                                data.push({code:$(this).text().trim()});
                            }
                        });
                    }else{
                        var elem = this;
                        var key = $select('span:nth-child(1)').text();
                        data.forEach(function(obj,i){
                            var val = i+4;
                            var value = $select('span:nth-child('+val+')').text().trim();
                            if( value != '' && value != 'NP'){
                                obj[key] = value;
                            }
                        });
                        
                        
                    }
                });
                resolve(data);
            });

        });
    })

    if(data == -1){
        data = yield self.getMarks(sem);
    }

    return data;
});


Session.prototype.showRegistrationStatus = Promise.coroutine(function *(sem){
    var self = this;
    var url = url_list.registrationStatus;
    var request = self.request;

    self.name = yield self.login(self.username,self.password);
    let data = yield new Promise(function(resolve,reject){
        request(url,function(err,response,body){
            if(err) reject({error:500,message:"Internal server error"});
            let $ = cheerio.load(body,{lowerCaseAttributeNames:true,lowerCaseTags:true});
            if($('input[name="lt"]').val()){
                self.sessionCookies = undefined;
                resolve(-1);
                return;
            }
            let formData = {};
            formData.Page_refIndex_hidden = $('input[name="Page_refIndex_hidden"]').val();
            formData.htmlPageTopContainer_status = $('input[name="htmlPageTopContainer_status"]').val();
            formData.htmlPageTopContainer_action = 'UMS-SRM_SHOW_REGISTRATION_STATUS';
            formData.htmlPageTopContainer_notify = $('input[name="htmlPageTopContainer_notify"]').val();
            formData.htmlPageTopContainer_selectRegType = "Regular";
            let select = $('select[name="htmlPageTopContainer_selectStep"]').children();
            select.each(function(i,elem){
                if($(this).text() == sem){
                    formData.htmlPageTopContainer_selectStep = $(this).val();
                    return;
                }
            });

            for(var key in formData){
                if(formData.hasOwnProperty(key)){
                   if(!formData[key]){
                       formData[key] = '';
                   }
                }
            }
            request.post({uri:url,form:formData},function(err,response,body){
                if (err) reject({error:500,message:"Internal server error"});
                let $ = cheerio.load(body,{lowerCaseAttributeNames:true,lowerCaseTags:true});
                let table; 
                $('tr[align="right"]').each(function(i,elem){
                    if(i == 1){
                      table =  $(this).html();
                      return;
                    }
                });
                $ = cheerio.load(table);
                let data = [];
                $('tbody').children().each(function(i,elem){
                    if(i > 0){
                        obj = {};
                        let $select = cheerio.load($(this).html());
                        obj.code = $select('span:nth-child(1)').text();
                        obj.studentEndorsement = $select('span:nth-child(2)').text();
                        obj.departmentEndorsement = $select('span:nth-child(3)').text();
                        obj.financialEndorsement = $select('span:nth-child(4)').text();
                        obj.registrarEndorsement = $select('span:nth-child(5)').text();
                        data.push(obj);
                    }
                });

                resolve(data);

            });

            
        });
    });
    if(data == -1){
        data = yield self.showRegistrationStatus(sem);
    }
    return data;
});

Session.prototype.getAllDues = Promise.coroutine(function *(){
    var self = this;
    var request = self.request;
    var url  = url_list.viewDues;
    self.name = yield self.login(self.username,self.password);
    let data = yield new Promise(function(resolve,reject){
        request(url,function(err,response,body){
            if(err) reject({error:500,message:"Internal server error"});
            let $ = cheerio.load(body,{lowerCaseAttributeNames:true,lowerCaseTags:true});
            if($('input[name="lt"]').val()){
                self.sessionCookies = undefined;
                resolve(-1);
                return;
            }
            var table = $('table[align="Left"]');
            var tbody;
            table.children().each(function(i,elem){
                if(i == 1){
                    tbody = $(this)
                    return;
                }
            });
            let data = [];
            tbody.children().each(function(i,elem){

                let $select =  cheerio.load($(this).html());
                let obj = {};
                obj.author = $select('span:nth-child(2)').text();
                obj.code = $select('span:nth-child(3)').text();
                obj.remarks = $select('input[type="HIDDEN"]').val();
                $select('span').each(function(i,elem){
                    if ($select(this).attr('id').includes('IncdntDte')){
                        obj.date = $(this).text();
                    }
                    if($select(this).attr('id').includes('Fine_')){
                        obj.fine = $(this).text();
                    }
                    if($select(this).attr('id').includes('Fineamt_')){
                        obj.paid = $(this).text();
                    }
                });
                data.push(obj);

            });

            resolve(data);



        });
    });
    if(data == -1){
      data = yield self.getAllDues();
    }
    return data;
});

Session.prototype.checkFeedback = Promise.coroutine(function *(){
    var self = this;
    var request = self.request;
    self.name = yield self.login(self.username,self.password);

    var url  = self.homeUrl;

    let data = new Promise(function(resolve,reject){
        request(url,function(err,response,body){
            if(err) reject({error:500,message:"Internal server error"});
            let $ = cheerio.load(body,{lowerCaseAttributeNames:true,lowerCaseTags:true});
            if($('input[name="lt"]').val()){
                self.sessionCookies = undefined;
                resolve(-1);
                return;
            }
            let evalUrl =  $('.icon-sakai-rsf-evaluation').attr('href');

            request(evalUrl,function(err,response,body){
                if(err) reject({error:500,message:"Internal server error"});
                let $ = cheerio.load(body,{lowerCaseAttributeNames:true,lowerCaseTags:true});

                let newurl = $('iframe').attr('src');

                request(newurl,function(err,response,body){
                    if(err) reject({error:500,message:"Internal server error"});
                    let $ = cheerio.load(body,{lowerCaseAttributeNames:true,lowerCaseTags:true});
                    let data = [];
                    $('tr').each(function(i,elem){
                        if(i > 0){
                            let $select = cheerio.load($(this).html());
                            if($select('span:nth-child(2)').text() != 'Completed'){
                                let obj = {};
                                obj.title = $select('span:nth-child(1)').text();
                                obj.startDate = $select('span:nth-child(3)').text();
                                obj.endDate = $select('span:nth-child(4)').text();
                                data.push(obj);
                            }
                        }
                    });

                    resolve(data);


                });
            });

        });
    });

    if(data == -1){
        data = yield self.checkFeedback();
    }

    return data;
});






module.exports = Session;