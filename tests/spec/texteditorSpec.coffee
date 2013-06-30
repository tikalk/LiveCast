describe 'Text Editor Test Suite', ->
    texteditor = require '../../app/plugins/texteditor'
    options = null
    register = null
    expected = {}
    imports = 
        messages: 
            broadcast: (type, context, data, caller) ->
                expect(type).toBe 'texteditor'
                expect(context).toBe expected.context
                expect(data).toBe expected.data
            listen: (type, callback) ->
                expect(type).toBe('texteditor')
                expected.context = 'testcontext'
                admincaller = isOwner: yes
                expected.data = 'test data'
                callback expected.context, expected.data, admincaller
        storage:
            add: (type, context, data, cb) ->
                expect(type).toBe 'texteditor'
                expect(data).toBe expected.data
                cb null, parseInt(new Date().getTime() / 1000)
        register: null
        
    it "should have a texteditor", -> 
        texteditor options, imports, register
