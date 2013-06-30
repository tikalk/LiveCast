module.exports = (options, imports, register) ->
    msgs = imports.messages
    content = {}
    callback = (context, data, caller) ->
        if not caller.isOwner
            console.log "invalid caller for modifying 
                the texteditor for #{context}"
            return
        content[context] = data
        msgs.broadcast 'texteditor', context, data, caller
    
    msgs.listen 'texteditor', callback
