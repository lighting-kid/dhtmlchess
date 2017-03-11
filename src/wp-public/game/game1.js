window.chess.isWordPress = true;
chess.WPGame1 = new Class({
    Extends: chess.WPGameTemplate,
    boardSize:undefined,

    initialize: function (config) {
        this.parent(config);
        var w = this.renderTo.width();
        this.renderTo.css('height', Math.ceil(w - 200 + 45 + 35 + this.wpm_h));
        this.renderTo.css('position', 'relative');
        this.boardSize = w - 200;

        this.bs = this.boardSize > 400 ? this.boardSize : w;
        if(this.canRender()){
            this.render();
        }
    },

    render: function () {
        new chess.view.Chess({
            renderTo: jQuery(this.renderTo),
            cls:this.th,
            layout: {
                type: 'linear', orientation: 'vertical',
                height: 'matchParent',
                width: 'matchParent'
            },
            children: [
                {
                    layout: {
                        height: 35,
                        width: ludo.isMobile ? 'matchParent' : this.boardSize
                    },
                    module: this.module,
                    type: 'chess.view.metadata.Game',
                    tpl: this.heading_tpl || '{white} - {black}',
                    cls: 'metadata',
                    css: {
                        'text-align': 'center',
                        'overflow-y': 'auto',
                        'font-weight': 'bold'
                    }
                },

                {
                    layout: {
                        type: 'linear', orientation: 'horizontal',
                        height: this.boardSize
                    },

                    children: [
                        Object.merge({
                            boardLayout: undefined,
                            id: 'tactics_board',
                            type: 'chess.view.board.Board',
                            module: this.module,
                            overflow: 'hidden',
                            pieceLayout: 'svg3',
                            boardCss: {
                                border: 0
                            },
                            labels: !ludo.isMobile, // show labels for ranks, A-H, 1-8
                            labelPos: 'outside', // show labels inside board, default is 'outside'
                            layout: {
                                weight: 1,
                                height: 'wrap'
                            },
                            plugins: [
                                Object.merge({
                                    type: 'chess.view.highlight.Arrow'
                                }, this.arrow)
                            ]
                        }, this.board),
                        {
                            id: this.module + '-panel',
                            name: "notation-panel",
                            type: 'chess.view.notation.Table',
                            layout: {
                                width: 200
                            },
                            elCss: {
                                'margin-left': '2px'
                            },
                            module: this.module
                        }
                    ]
                },
                {
                    css:{
                        'margin-top' : 5
                    },
                    type: 'chess.view.buttonbar.Bar',
                    layout: {
                        height: 45,
                        width: this.bs
                    },
                    module: this.module
                },
                {
                    type:'chess.WPComMessage'
                }
            ]
        });

        this.controller = new chess.controller.Controller({
            applyTo: [this.module]
        });

        this.loadGame();

    }

});