$(document).ready(function () {
    $("#checkallroomtypes").click(function () {
        $('#tiposhabitacionasociados input:checkbox').each(function () {
            this.checked = 1;
        });
        return false;
    });
    $("#uncheckallroomtypes").click(function () {
        $('#tiposhabitacionasociados input:checkbox').each(function () {
            this.checked = 0;
        });
        return false;
    });
});


function checkHover() {
    var filter = $(this).attr('filter');
    $(this).addClass('checkHover');
    var clickedText = $(this).text();
    $(this).parent().parent().parent().find('div.input').each(function (i, el) {
        $(this).find('label > span').each(function (j, span) {
            if ($(span).attr('filter') == filter
                && $(span).text() == clickedText) {
                $(span).addClass('checkHover')
            }
        })
    })
}


function uncheckHover() {
    var filter = $(this).attr('filter');
    $(this).removeClass('checkHover')
    var clickedText = $(this).text();
    $(this).parent().parent().parent().find('div.input').each(function (i, el) {
        $(this).find('label > span').each(function (j, span) {
            if ($(span).attr('filter') == filter
                && $(span).text() == clickedText) {
                $(span).removeClass('checkHover')
            }
        })
    })
}

$(function(){

    debugger;
    $('.check').tooltip({title:'marcar todos'})

    $('.check').click(function(evt){
        evt.preventDefault();
        var filter = $(this).attr('filter');

        var checked = ($(this).parent().parent().find('input:checkbox').attr('checked') == undefined ? true : false);

        var clickedEl = $(this);
        var clickedText = $(this).text();

        $(this).parent().parent().parent().find('div.input').each(function(i, el){
            $(this).find('label > span').each(function(j, span){
                if($(span).attr('filter') == filter
                    && $(span).text() == clickedText) {
                    var isChecked=$(span).parent().parent().find('input:checkbox').prop('checked');
                    if(!isChecked){
                        $(span).parent().parent().find('input:checkbox').trigger("click");
                    }
                }
            })
        })
    })

    $('.check').hover(function(){
        var filter = $(this).attr('filter');
        $(this).addClass('checkHover')

        var clickedText = $(this).text();
        $(this).parent().parent().parent().find('div.input').each(function(i, el){
            $(this).find('label > span').each(function(j, span){
                if($(span).attr('filter') == filter
                    && $(span).text() == clickedText) {
                    $(span).addClass('checkHover')
                }
            })
        })
    }, function(){
        var filter = $(this).attr('filter');
        $(this).removeClass('checkHover')

        var clickedText = $(this).text();

        $(this).parent().parent().parent().find('div.input').each(function(i, el){
            $(this).find('label > span').each(function(j, span){
                if($(span).attr('filter') == filter
                    && $(span).text() == clickedText) {
                    $(span).removeClass('checkHover')
                }
            })
        })
    })
})
