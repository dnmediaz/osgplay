app.controller("Displayfancycntr",["$scope","$http",function(e,n){e.foo=$stateParam.fancyType;var o=$(".even_odd_but"),t=$(".even_box");o.click(function(){var e=o.index(this);t.hide().eq(e).show()})}]);