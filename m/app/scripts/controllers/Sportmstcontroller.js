app.controller("Sportmstcontroller",["$scope","$http",function(e,t){t.get(BASE_URL+"Createmastercontroller/SportMst").success(function(t,r,s,o){e.Details=t,e.Details.lenght;var a=new Date;e.FromDate=a.getFullYear()+"-"+("0"+(a.getMonth()+1)).slice(-2)+"-"+("0"+a.getDate()).slice(-2),e.sport_id=t.id,e.sport_id="cr000"+t.id}).error(function(t,r,s,o){e.ResponseDetails="Data: "+t+"<br />status: "+r+"<br />headers: "+jsonFilter(s)+"<br />config: "+jsonFilter(o)}),e.submitForm=function(){var r={Sport_name:e.Sport_name};t({method:"POST",url:BASE_URL+"Createmastercontroller/SaveSportMaster/",data:r,headers:{"Content-Type":"application/x-www-form-urlencoded"}}).success(function(r){0==r.errors?(e.message=r.message,t.get(BASE_URL+"Createmastercontroller/SportMst").success(function(t,r,s,o){e.Details=t,e.Details.lenght;var a=new Date;e.FromDate=a.getFullYear()+"-"+("0"+(a.getMonth()+1)).slice(-2)+"-"+("0"+a.getDate()).slice(-2),e.sport_id=t.id,e.sport_id="cr000"+t.id}).error(function(t,r,s,o){e.ResponseDetails="Data: "+t+"<br />status: "+r+"<br />headers: "+jsonFilter(s)+"<br />config: "+jsonFilter(o)})):(e.message=r.message,t.get(BASE_URL+"Createmastercontroller/SportMst").success(function(t,r,s,o){e.Details=t,e.Details.lenght;var a=new Date;e.FromDate=a.getFullYear()+"-"+("0"+(a.getMonth()+1)).slice(-2)+"-"+("0"+a.getDate()).slice(-2),e.sport_id=t.id,e.sport_id="cr000"+t.id}).error(function(t,r,s,o){e.ResponseDetails="Data: "+t+"<br />status: "+r+"<br />headers: "+jsonFilter(s)+"<br />config: "+jsonFilter(o)}))})}}]);