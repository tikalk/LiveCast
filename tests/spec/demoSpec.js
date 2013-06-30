describe('Demo Test Suite', function(){
   it("Should run...", function(){
       expect(1+1).toEqual(2);
   });

   it("Should run async...", function(done){
      setTimeout(function(){
          expect('abc').toEqual('abc');
          done();
      },200);
   });
});
