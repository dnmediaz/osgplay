app.controller("Listmarkettypecntr",["$scope","$http","$timeout","$stateParams",function(t,e,r,n){e.get(BASE_URL+"Lstmarkettypecntr/getAllMarketType/").success(function(e,r,n,s){t.marketType=e,t.currentPage=1,t.entryLimit=100,t.filteredItems=t.marketType.lstMrktType.length,t.totalItems=t.marketType.lstMrktType.length}),t.setPage=function(e){t.currentPage=e},t.filter=function(){r(function(){t.filteredItems=t.filtered.length},10)},t.sort_by=function(e){t.predicate=e,t.reverse=!t.reverse},t.getStatus=function(r,n){if(1==n)var s=confirm("Are you sure want to Deactivate this MarketType ?");else var s=confirm("Are you sure want to Activate this MarketType ?");s&&e.get(BASE_URL+"Lstmarkettypecntr/getAllMarketType/"+r+"/"+n+"/").success(function(e,r,n,s){t.users=e}).error(function(e,r,n,s){t.ResponseDetails="Data: "+e+"<br />status: "+r+"<br />headers: "+jsonFilter(n)+"<br />config: "+jsonFilter(s)})},t.deleteMarketType=function(r){e.get(BASE_URL+"Lstmarkettypecntr/deleteMarketType/"+r).success(function(r,n,s,a){e.get(BASE_URL+"Lstmarkettypecntr/getAllMarketType/").success(function(e,r,n,s){t.marketType=e,t.currentPage=1,t.entryLimit=100,t.filteredItems=t.marketType.lstMrktType.length,t.totalItems=t.marketType.lstMrktType.length})})}}]),app.filter("startFrom",function(){return function(t,e){return t?(e=+e,t.slice(e)):[]}});