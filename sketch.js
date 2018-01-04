var sub = 5, 
    now = 1,
    IdList, 
    up = 1, 
    down = 0, 
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
    for(var i = 0; i < width - 1; i++)
    {
        draw += "</td><td class='td'>";
    }
    draw += "</td></tr>";
    _temp = draw;
    for(var i = 0; i < height - 1; i++)
    {
        draw += _temp;
    }
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
    while(index % width != width - 1 && IdList[_temp] == IdList[_temp - width + 1])
    {
        up += 1;
        _temp -= (width - 1);
    }
    _temp = index;
    while(index % width != width - 1 && IdList[_temp] == IdList[_temp + width - 1])
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
    while(index % width != width - 1 && IdList[_temp] == IdList[_temp - width - 1])
    {
        up += 1;
        _temp -= (width + 1);
    }
    _temp = index;
    while(index % width != width - 1 && IdList[_temp] == IdList[_temp + width + 1])
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
}

function Reset()
{
    $(".table").css("display", "block");
    $(".winner").css("display", "none");
    $(".pause").css("display", "none");
    $(".table").html(DrawTable());
    for(var i = 0; i < IdList.length; i++)
    {
        IdList[i] = null;
    }
    gameOver = false;
    playing = true;
    timer = setTimer;
}

function ShowPlayer()
{  
    if(now == 1)
    {
        $(".showImg").attr("src", "theX.png");
        $(".showName").text(xName);
    }
    else 
    {
        $(".showImg").attr("src", "theY.png");
        $(".showName").text(oName);
    }
}
//#endregion

$(document).ready(function(){
    $(".table").html(DrawTable());

    //#region JS events
    $("table").on("click", ".td", function(){
        ShowPlayer();
        var index = $("td").index(this);
        timer = 20000;
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
    //#endregion
    setInterval(function(){
        Update();
        ShowPlayer();
        if(timer <= 0)
        {
            timer = setTimer;
            now = now == 1 ? 0 : 1;
        } 
        $(".showTimer").text("Time left: " + timer / 1000 + (timer % 1000 == 0 ? ".0" : ""));
        timer -= gameOver || !playing ? 0 : 100;
    }, 100)
});