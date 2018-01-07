/*
    Coded by Nguyen Trung Long
    Last edit 07/01/2018
    Unminified
*/


var sub = 5, 
    now = 1, 
    IdList, 
    up, 
    down, 
    width = 10, 
    height = 10, 
    _temp, 
    setTimer = 20000,
    timer = setTimer, 
    xName = "X Player", 
    oName = "O Player", 
    gameOver = false,
    playing = false,
    count = 0,
    xSource = "theX.png",
    oSource = "theY.png";

function DrawTable()
{
    var draw = "<tr><td class='td'>";
    for(var i = 1; i < width; i++) draw += "</td><td class='td'>";
    draw += "</td></tr>";
    _temp = draw;
    for(var i = 1; i < height; i++) draw += _temp;
    IdList = new Array(width * height);
    return draw;
}

//#region Check
function IsEndVertical(index)
{
    up = 1;
    down = 0;
    _temp = index;
    while(_temp > width && IdList[_temp - width] == IdList[_temp])
    {
        up += 1;
        _temp -= width;
    }
    _temp = index;
    while(_temp < width * height - 1 && IdList[_temp + width] == IdList[_temp])
    {
        down += 1;
        _temp += width;
    }
    if(up + down >= sub) return true;
    else return false;
}

function IsEndHorizontal(index)
{
    up = 1;
    down = 0;
    _temp = index;  //Reset variables 

    while(_temp > parseInt(index / 10) * 10 && IdList[_temp - 1] == IdList[_temp])
    {
        up += 1;
        _temp -= 1;
    }

    _temp = index;

    while(_temp < (parseInt(index / 10) + 1) * 10 && IdList[_temp + 1] == IdList[_temp])
    {
        down += 1;
        _temp += 1;
    }

    if(up + down >= sub) return true;
    else return false;
}

function IsEndRightUp(index)
{
    up = 1;
    down = 0;
    _temp = index;
    while(index % width != width && IdList[_temp] == IdList[_temp - width + 1])
    {
        up += 1;
        _temp -= (width - 1);
    }
    _temp = index;
    while(index % width != width && IdList[_temp] == IdList[_temp + width - 1])
    {
        up += 1;
        _temp += (width - 1);
    }

    if(up + down >= sub) return true;
    else return false;
}

function IsEndRightDown(index)
{
    up = 1;
    down = 0;
    _temp = index;
    while(index % width != width && IdList[_temp] == IdList[_temp - width - 1])
    {
        up += 1;
        _temp -= (width + 1);
    }
    _temp = index;
    while(index % width != width && IdList[_temp] == IdList[_temp + width + 1])
    {
        up += 1;
        _temp += (width + 1);
    }

    if(up + down >= sub) return true;
    else return false;
}

function IsGameOver(index)
{
    if(IsEndVertical(index)
    || IsEndHorizontal(index)
    || IsEndRightUp(index)
    || IsEndRightDown(index)) return true;
    else return false;
}
//#endregion

//#region Event 
function GameOver()
{
    gameOver = true;
    count += 1;
    var winner = now == 1 ? oName : xName;
    $(".winner").css("display", "flex");
    $(".winnerText").text("The winner is: " + winner);
    $(".table").css("display", "none");
    $(".history-append").append("<tr><td class='center'>" + count + "</td><td class='center'>" + winner + "</td></tr>");
}

function Update()
{
    $(".canvas").width($(".table").width());
    $(".canvas").height($(".table").height());
    $(".canvas").css("top", $(".table").css("top"));
    $(".showName").text(now == 1 ? xName : oName);
    $(".col-3").css({"display": $(window).width() <= 980 ? "none" : "block"});
    $(".td").css("width", 500 / (width >= height ? width : height) + "px");
    $(".td").css("height", 500 / (width >= height ? width : height) + "px");
    $(".showImg").attr("src", now == 1 ? xSource : oSource);
    $(".showName").text(now == 1 ? xName : oName);
}

function Reset()
{
    $(".table").css("display", "block");
    $(".winner").css("display", "none");
    $(".pause").css("display", "none");
    $(".table").html(DrawTable());
    for(var i = 0; i < IdList.length; i++)
        IdList[i] = null;
    gameOver = false;
    playing = true;
    timer = setTimer;
}
//#endregion

$(document).ready(function(){
    $(".table").html(DrawTable());

    //#region JS events
    $("table").on("click", ".td", function(){
        Update();
        var index = $("td").index(this);
        timer = setTimer;
        if(now == 1 && $(this).attr("id") != "checked")
        {
            $(this).css("background-image", "url(" + xSource + ")");
            now = 0;
            $(this).attr("id", "checked");
            IdList[index] = "X";
        }
        if(now == 0 && $(this).attr("id") != "checked")
        {
            $(this).css("background-image", "url(" + oSource + ")");
            now = 1;
            $(this).attr("id", "checked");
            IdList[index] = "O";
        }
        if(IsGameOver(index))
        {
            GameOver();
        }
    });
    $(".btn-reset").click(function(){
        Reset();
    });
    $(".btn-pause").click(function(){
        $(".pause").css("display", "flex");
        $(".table").css("display", "none");
        playing = false;
    });
    $(".btn-continue").click(function(){
        $(".pause").css("display", "none");
        $(".table").css("display", "block");
        playing = true;
    });
    $(".btn-new-start").click(function(){
        $(".container").css("display", "flex");
        $(".start").css("display", "none");
        playing = true;
    });
    $(".btn-setting").click(function(){
        $(".container").css("display", "none");
        $(".start").css("display", "none");
        $(".settings").css("display", "flex");
    });
    $(".btn-out-setting").click(function(){
        $(".settings").css("display", "none");
    });
    $("#step").change(function(){
        $(".show-step").text($(this).val());
    })
    $("#set-width").change(function(){
        $(".show-width").text($(this).val());
    });
    $("#set-height").change(function(){
        $(".show-height").text($(this).val());
    });
    $("#set-timer").change(function(){
        $(".show-timer").text($(this).val());
    });
    $("#set-xname").change(function(){
        $(".show-xname").text($(this).val());
    });
    $("#set-oname").change(function(){
        $(".show-oname").text($(this).val());
    });
    $(".out-setting").click(function(){
        $("#set-width").val(width);
        $("#set-height").val(height);
        $("#step").val(sub);
        $("#set-xname").val(xName);
        $("#set-oname").val(oName);
        $("#set-timer").val(setTimer / 1000);
        $(".show-width").text(width);
        $(".show-height").text(height);
        $(".show-timer").text(setTimer / 1000);
        $(".show-xname").text(xName);
        $(".show-oname").text(oName);
        $(".show-step").text(sub);
        $(".settings").css("display", "none");
        $(".start").css("display", "flex"); 
    });
    $(".new-game-fromstart").click(function(){
        width = $("#set-width").val();
        height = $("#set-height").val();
        sub = $("#step").val();
        xName = $("#set-xname").val();
        oName = $("#set-oname").val();
        setTimer = $("#set-timer").val() * 1000;
        $(".settings").css("display", "none");
        $(".container").css("display", "flex");
        Reset();
    });
    //#endregion
    setInterval(function(){
        Update();
        if(timer <= 0)
        {
            timer = setTimer;
            now = now == 1 ? 0 : 1;
        } 
        $(".showTimer").text("Time left: " + timer / 1000 + (timer % 1000 == 0 ? ".0" : ""));
        timer -= gameOver || !playing ? 0 : 100;
    }, 100)
});