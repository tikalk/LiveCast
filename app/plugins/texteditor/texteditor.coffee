module.exports = (options, imports, register) ->
    msgs = imports.messages
    storage = imports.storage
    content = {}
        
    callback = (context, data, caller) ->
        if not caller.isOwner
            console.log "invalid caller for modifying 
                the texteditor for #{context}"
            return
        content[context] = data
        error_cb = (error, timestamp) ->
            console.log "error storing texteditor: #{error}" if error?
            msgs.broadcast 'texteditor', context, data, caller
        storage.add 'texteditor', context, data, error_cb
    
    msgs.listen 'texteditor', callback
