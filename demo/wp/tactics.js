/**
 * Usage:
 *
 * new chess.FileTactics({
            renderTo:'chessContainer',
            pgn:'sample'
    })
 *
 * where "chessContainer" is id of an html element and "sample" is the name
 * of a pgn file inside the pgn folder(sample.pgn)
 * @type {Class}
 */

window.chess.isWordPress = true;

chess.WPTactics = new Class({
    Extends: Events,

    renderTo: undefined,
    pgn: undefined,

    controller: undefined,

    showLabels:undefined,

    module:undefined,

    boardSize:undefined,

    initialize: function (config) {



        this.renderTo = config.renderTo;

        var r = $(this.renderTo);
        var w = r.width();
        r.css('height', Math.round(w + 130));
        this.boardSize = w;

        this.pgn = config.pgn;
        this.board = config.board || {};
        this.arrow = config.arrow || {};
        this.arrowSolution = config.arrowSolution || {};
        this.hint = config.hint || {};

        if(config.docRoot){
            ludo.config.setDocumentRoot(config.docRoot);
        }


        this.module = String.uniqueID();

        this.showLabels = !ludo.isMobile;
        if (this.renderTo.substr && this.renderTo.substr(0, 1) != "#")this.renderTo = "#" + this.renderTo;
        $(document).ready(this.render.bind(this));
    },

    render: function () {

        new chess.view.Chess({
            renderTo: $(this.renderTo),
            layout: {
                type: 'fill',
                height: 'matchParent',
                width: 'matchParent'
            },
            children: [
                {
                    layout: {
                        type: 'linear', orientation: 'vertical'
                    },


                    children: [
                        {
                            height: 35,
                            module:this.module,
                            type: 'chess.view.metadata.Game',
                            tpl: '#{index} - {white}',
                            cls:'metadata',
                            css: {
                                'text-align': 'center',
                                'overflow-y': 'auto',
                                'font-size': '1.2em',
                                'font-weight': 'bold'
                            }
                        },

                        {
                            layout: {
                                type: 'linear',
                                orientation: 'horizontal'
                            },
                            css: {
                                'margin-top': 2
                            },

                            height: 30,
                            children: [
                                {
                                    weight: 1
                                },
                                {
                                    module:this.module,
                                    layout: {width: 80},
                                    type: 'chess.view.button.TacticHint',
                                    value: chess.getPhrase('Hint')
                                },
                                {
                                    module:this.module,
                                    layout: {width: 80},
                                    type: 'chess.view.button.TacticSolution',
                                    value: chess.getPhrase('Solution')
                                }, {
                                    module:this.module,
                                    layout: {width: 80},
                                    type: 'form.Button',
                                    value: chess.getPhrase('Next Game'),
                                    listeners: {
                                        click: function () {
                                            this.controller.loadNextGameFromFile();
                                        }.bind(this)
                                    }
                                },
                                {
                                    weight: 1
                                }
                            ]
                        },
                        Object.merge({
                            boardLayout:undefined,
                            id:'tactics_board',
                            type: 'chess.view.board.Board',
                            module:this.module,
                            overflow: 'hidden',
                            pieceLayout: 'svg3',
                            boardCss: {
                                border: 0
                            },
                            labels: !ludo.isMobile, // show labels for ranks, A-H, 1-8
                            labelPos:'outside', // show labels inside board, default is 'outside'
                            layout:{
                                height:this.boardSize,
                            },
                            plugins: [
                                Object.merge({
                                    type: 'chess.view.highlight.Arrow'
                                }, this.arrow),
                                Object.merge({
                                    type: 'chess.view.highlight.ArrowTactic'
                                }, this.arrowSolution),
                                Object.merge({
                                    type: 'chess.view.highlight.SquareTacticHint'
                                },this.hint)
                            ]
                        }, this.board),
                        {
                            height: 50,
                            module:this.module,
                            comments: false,
                            figurines:'svg_egg', // Figurines always starts with svg - it is the prefix of images inside the dhtmlchess/images folder
                            type: 'chess.view.notation.TacticPanel'
                        }
                    ]
                }
            ]
        });

        var storageKey = 'key_' + this.pgn + '_tactic2';

        this.controller = new chess.controller.TacticControllerGui({
            applyTo:[this.module],
            pgn: this.pgn,
            alwaysPlayStartingColor: true,
            autoMoveDelay: 400,
            gameEndHandler: function (controller) {
                controller.loadNextGameFromFile();
            },
            listeners: {
                'startOfGame': function () {
                    ludo.getLocalStorage().save(storageKey, this.controller.getCurrentModel().getGameIndex());
                }.bind(this)
            }
        });

        var index = ludo.getLocalStorage().get(storageKey);
        if (index != undefined) {
            this.controller.getCurrentModel().setGameIndex(index);
        } else {
            index = 0;
        }


        this.controller.loadGameFromFile(index);

    }

});