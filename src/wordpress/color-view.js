/**
 * Created by alfmagne1 on 10/05/2017.
 */
chess.wordpress.ColorView = new Class({
    Extends: ludo.FramedView,
    colors: [],
    colorContainer:undefined,
    selectedColor:undefined,
    selectedEl:undefined,

    css:{
        padding:2
    },

    __construct: function (config) {
        this.parent(config);
        this.colors = config.colors;

    },

    __rendered: function () {
        this.parent();
        this.colorContainer = jQuery('<div class="wpc-color-container"></div>').appendTo(this.$b());
        this.renderColors();
    },

    renderColors: function () {
        jQuery.each(this.colors, function(i, color){
            this.colorContainer.append(this.getColorBox(color));
        }.bind(this));
    },


    resize: function (size) {
        this.parent(size);

    },

    getColorBox: function (color) {

        var el = jQuery('<div class="wpc-color-box"></div>');
        el.css('background-color', color);
        el.data('color', color);
        el.on('click', this.selectColor.bind(this));
        return el;

    },

    selectColor:function(e){
        var el = jQuery(e.target);
        var color = el.data('color');

        if(this.selectedEl){
            this.selectedEl.removeClass('wpc-color-box-selected');
        }

        if(color === this.selectedColor){
            this.selectedColor = undefined;
            this.fireEvent('deselect');
        }else{
            el.addClass('wpc-color-box-selected');
            this.selectedColor = color;
            this.fireEvent('select', color);
            this.selectedEl = el;
        }

    }
});