/**
 * Created with JetBrains WebStorm.
 * User: gs
 * Date: 30/06/13
 * Time: 16:00
 * To change this template use File | Settings | File Templates.
 */

//chat-server test suite

var chat = require('../../app/plugins/chat/chat');
var sinon = require('sinon');
describe('Chat', function(){
    describe('initialization', function(){
        it('should use its dependencies', function(){
           var imports = {};
            var messagesGetter = sinon.stub().returns({
                listen: function(){},
                broadcast: function(){}
            });
            imports.__defineGetter__('messages', messagesGetter);
            var options = {};
            var register = function(){};

            chat(options, imports, register);
            expect(messagesGetter.called).toBeTruthy();
        });
    });
});

//describe('Demo Test Suite', function(){
//    it("Should run...", function(){
//        expect(1+1).toEqual(2);
//    });
//
//    it("Should run async...", function(done){
//        setTimeout(function(){
//            expect('abc').toEqual('abc');
//            done();
//        },200);
//    });
//});
