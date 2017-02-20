chess.WPTemplate = new Class({
    Extends: Events,
    renderTo:undefined,
    module:undefined,
    _ready : true,
    _loadCounter : 0,

    initialize:function(config){
        this.renderTo = jQuery(config.renderTo);
        this.module = String.uniqueID();

        chess.THEME_OVERRIDES = undefined;
        
        if (config.docRoot) {
            ludo.config.setDocumentRoot(config.docRoot);
        }


        if(config.theme){
            this._ready = false;
            jQuery('<link/>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: ludo.config.getDocumentRoot() + 'themes/' + config.theme + '.css',
                success:function(){
                    this.onload();
                }.bind(this)
            });


            jQuery.ajax({
                url: ludo.config.getDocumentRoot() + 'themes/' + config.theme + '.js',
                dataType: "script",
                success:function(){
                    this.onload();
                }.bind(this)
            });
        }
    },

    onload:function(){
        this._loadCounter++;
        if(!this._ready && this._loadCounter==2)this.render();
        this._ready = this._loadCounter == 2;

    },

    canRender:function(){
        return this._ready;
    }


});