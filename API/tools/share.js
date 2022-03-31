(function(exports){

    exports.test = function(){
         return 'This is a function from shared module';
    };
  
  }(typeof exports === 'undefined' ? this.share = {} : exports));