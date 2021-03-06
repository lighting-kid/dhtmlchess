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

chess.TacticsFromFile = new Class({
    Extends: Events,

    renderTo:undefined,
    pgn : undefined,

    controller:undefined,

    initialize:function(config){
        this.renderTo = config.renderTo;
        this.pgn = config.pgn;
        if(this.renderTo.substr(0,1) != "#")this.renderTo = "#" + this.renderTo;
        $(document).ready(this.render.bind(this));
    },

    render:function(){
        new ludo.View({
            renderTo:$(this.renderTo),
            elCss:{

                'background-color' : 'transparent'
            },
            layout:{
                type:'fill',
                height:'matchParent',
                width:'matchParent'
            },
            children:[
                {
                    weight:1,
                    layout:'rows',
                    elCss:{
                        'background-color' : 'transparent'
                    },

                    children:[
                        {
                            type:'chess.view.message.TacticsMessage',
                            height:25,
                            elCss:{
                                'background-color' : 'transparent'
                            }
                        },
                        {
                            type:'chess.view.board.Board',
                            overflow:'hidden',
                            chessSet:'alphapale',
                            boardCss:{
                                border:0
                            },
                            labels:true,
                            elCss:{
                                'background-color' : 'transparent'
                            },
                            weight:1,
                            addOns:[
                                {
                                    type:'chess.view.highlight.Arrow'
                                },
                                {
                                    type:'chess.view.highlight.ArrowTactic'
                                },
                                {
                                    type:'chess.view.highlight.SquareTacticHint'
                                }
                            ]
                        },
                        {
                            height:25,
                            type:'chess.view.metadata.Game',
                            tpl:'{white} vs {black}, {date}',
                            css:{
                                'text-align' : 'center',
                                'overflow-y':'auto',
                                'background-color':'transparent'
                            }
                        },
                        {
                            layout:{
                                type:'linear',
                                orientation:'horizontal'
                            },
                            css:{
                                'margin-top' : 2,
                                'backgrund-color' : 'transparent'
                            },
                            elCss:{
                                'background-color' : 'transparent'
                            },
                            height:30,
                            children:[
                                { weight:1,
                                    elCss:{
                                        'background-color' : 'transparent'
                                    } },
                                {
                                    layout:{ width: 80 },
                                    type:'chess.view.button.TacticHint',
                                    value:chess.__('Hint'),
                                    elCss:{
                                        'background-color' : 'transparent'
                                    }
                                },
                                {
                                    layout:{ width: 80 },
                                    type:'chess.view.button.TacticSolution',
                                    value:chess.__('Solution'),
                                    elCss:{
                                        'background-color' : 'transparent'
                                    }
                                },{
                                    layout:{ width: 80 },
                                    type:'form.Button',
                                    value:chess.__('Next Game'),
                                    elCss:{
                                        'background-color' : 'transparent'
                                    },
                                    listeners:{
                                        click : function(){
                                            this.controller.loadNextGameFromFile();
                                        }.bind(this)
                                    }
                                },
                                {
                                    weight:1,
                                    elCss:{
                                        'background-color' : 'transparent'
                                    }
                                }
                            ]
                        },
                        {
                            height:50,
                            comments:false,
                            type:'chess.view.notation.TacticPanel'
                        }
                    ]
                }
            ]
        });

        var storageKey = 'key_' + this.pgn + '_tactic';

        this.controller = new chess.controller.TacticControllerGui({
            pgn:this.pgn,
            alwaysPlayStartingColor:true,
            autoMoveDelay:400,
            gameEndHandler:function(controller){
                controller.loadNextGameFromFile();
            },
            listeners:{
                'startOfGame' : function(){
                    ludo.getLocalStorage().save(storageKey, this.controller.getCurrentModel().getGameIndex() );
                }.bind(this)
            }
        });

        var index = ludo.getLocalStorage().get(storageKey);
        if(index != undefined){
            this.controller.getCurrentModel().setGameIndex(index);
        }else{
            index = 0;
        }

     



        this.controller.loadGameFromFile(index);

    }

});