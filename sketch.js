/* eslint-disable no-undef */
/*
    Coded by Nguyen Trung Long
    Last edit 07/01/2018
    Unminified
*/

const settings = {
  sub: 5, // How many times in a row to win
  width: 10, // currentSettings.width of table
  height: 10, // currentSettings.height of table
  setTimer: 20000, // Cool down each player's round in ms
  xName: 'X Player', // Name of 1 player (X player)
  oName: 'O Player', // Name of 0 player (O player)
  xSource: 'images/theX.png', // Image of X
  oSource: 'images/theY.png', // Image of O
  gameMode: 'hvh', // Game mode. hvh for 'human vs human', hva for 'human vs AI'
  difficulty: 'easy' // Difficulty in AI mode
}

let currentSettings = settings
let now = 1 // Current player 1 or 0;
let IdList // The table as a 2-d array
let up // check in check region
let down // check in check region
let _temp // Just a temporary variable
let gameOver = false // Is the game over or not
let playing = false // Is the game playing
let timer = currentSettings.setTimer // Cool down but it changes every second
let count = 0 // How many times played
let fightScore // Score to use in AI
let resistanceScore // Score to use in AI
let moved = false

const DrawTable = () => {
  let draw = '<tr><td class="td">'
  for (let i = 1; i < currentSettings.width; i++) draw += '</td><td class="td">'
  draw += '</td></tr>'
  _temp = draw
  for (let i = 1; i < currentSettings.height; i++) draw += _temp
  IdList = new Array(currentSettings.width * currentSettings.height)
  IdList.fill(null)
  return draw
}

const ResetDimension = () => {
  $('.td').css('width', 500 / (currentSettings.width >= currentSettings.height ? currentSettings.width : currentSettings.height) + 'px')
  $('.td').height($('.td').width())
  let tableHeight = ($('.td').height() + 2) * currentSettings.height
  $('.canvas').height(tableHeight)
  $('.canvas').css('margin-top', (-tableHeight - 10) + 'px')
}

// #region Game Feature

const CountVertically = (index, list) => {
  up = 1
  down = 0
  _temp = index
  while (_temp > currentSettings.width &&
    list[_temp - currentSettings.width] === list[_temp]) {
    up += 1
    _temp -= currentSettings.width
  }
  _temp = index
  while (_temp < currentSettings.width * (currentSettings.height - 1) &&
    list[_temp + currentSettings.width] === list[_temp]) {
    down += 1
    _temp += currentSettings.width
  }

  return up + down
}

const CountHorizontally = (index, list) => {
  up = 1
  down = 0
  _temp = index
  while (_temp > parseInt(index / 10) * 10 &&
    list[_temp - 1] === list[_temp]) {
    up += 1
    _temp -= 1
  }
  _temp = index
  while (_temp < (parseInt(index / 10) + 1) * 10 &&
    list[_temp + 1] === list[_temp]) {
    down += 1
    _temp += 1
  }

  return up + down
}

const CountCrosslyUp = (index, list) => {
  up = 1
  down = 0
  _temp = index
  while (index % currentSettings.width !== currentSettings.width &&
    list[_temp] === list[_temp - currentSettings.width + 1]) {
    up += 1
    _temp -= (currentSettings.width - 1)
  }
  _temp = index
  while (index % currentSettings.width !== currentSettings.width &&
    list[_temp] === list[_temp + currentSettings.width - 1]) {
    up += 1
    _temp += (currentSettings.width - 1)
  }

  return up + down
}

const CountCrosslyDown = (index, list) => {
  up = 1
  down = 0
  _temp = index
  while (index % currentSettings.width !== currentSettings.width &&
    list[_temp] === list[_temp - currentSettings.width - 1]) {
    up += 1
    _temp -= (currentSettings.width + 1)
  }
  _temp = index
  while (index % currentSettings.width !== currentSettings.width &&
    list[_temp] === list[_temp + currentSettings.width + 1]) {
    up += 1
    _temp += (currentSettings.width + 1)
  }

  return up + down
}

const IsEndVertically = index => {
  return CountVertically(index, IdList) >= currentSettings.sub
}

const IsEndHorizontally = index => {
  return CountHorizontally(index, IdList) >= currentSettings.sub
}

const IsEndCrosslyUp = index => {
  return CountCrosslyUp(index, IdList) >= currentSettings.sub
}

const IsEndCrosslyDown = index => {
  return CountCrosslyDown(index, IdList) >= currentSettings.sub
}

const IsDraw = () => IdList.filter(elem => elem == null).length === 0

const GetGameOverState = index => {
  if (IsEndVertically(index) ||
  IsEndHorizontally(index) ||
  IsEndCrosslyUp(index) ||
  IsEndCrosslyDown(index)) return 'win'
  else return 'draw'
}

const IsGameOver = index => IsEndVertically(index) || IsEndHorizontally(index) || IsEndCrosslyUp(index) || IsEndCrosslyDown(index) || IsDraw()

// #endregion

// #region AI

const AIConfig = () => {
  switch (currentSettings.sub) {
    case 5: {
      fightScore = [0, 2, 4, 8, 16]
      resistanceScore = [0, 1, 2, 8, 12]
      break
    }
    case 6: {
      fightScore = [0, 2, 4, 6, 8, 16, 32]
      resistanceScore = [0, 1, 2, 4, 16, 24]
      break
    }
    case 7: {
      fightScore = [0, 2, 4, 6, 8, 16, 32, 64]
      resistanceScore = [0, 1, 2, 4, 8, 32, 48]
      break
    }
    default: break
  }
}

const GoToNextStep = () => {
  AIConfig()
  let max = -Infinity // Store the maximum value in the list
  let maxIndex = 0 // Index of the max value
  let list = IdList
  for (let i = 0; i < list.length; i++) { // Start calculating and finding greatest value in the list
    if (list[i] != null) continue
    list[i] = (now === 1 ? 'X' : 'O')
    let thisValue = Math.max(fightScore[CountHorizontally(i, list) - 1],
      fightScore[CountVertically(i, list) - 1],
      fightScore[CountCrosslyUp(i, list) - 1],
      fightScore[CountCrosslyDown(i, list)] - 1)
    list[i] = (now === 1 ? 'O' : 'X')
    thisValue += Math.max(resistanceScore[CountHorizontally(i, list) - 1],
      resistanceScore[CountVertically(i, list) - 1],
      resistanceScore[CountCrosslyUp(i, list) - 1],
      resistanceScore[CountCrosslyDown(i, list) - 1])
    if (thisValue > max) {
      max = thisValue
      maxIndex = i
    }
    list[i] = null
  }
  $('.td').eq(maxIndex).attr('AI', 'true')
  $('.td').eq(maxIndex).click()
}
// #endregion

// #region Events

// Things to do after the game has overed
const GameOver = state => {
  $('.winner').css('visibility', 'visible') // Show winner screen
  gameOver = true
  count += 1
  $('.btn-pause').css('display', 'none') // Hide pause button
  if (state === 'win') {
    let winner = now === 1 ? currentSettings.oName : currentSettings.xName
    $('.winnerText').text('The winner is: ' + winner)
    $('.history-append').append('<tr><td class="center">' + count + '</td><td class="center">' + winner + '</td></tr>')
  } else {
    $('.winnerText').text('Draw!')
    $('.history-append').append('<tr><td class="center">' + count + '</td><td class="center">Draw</td></tr>')
  }
}

const UpdateEachRound = () => {
  $('.showName').text(now === 1 ? currentSettings.xName : currentSettings.oName)
  $('.showImg').attr('src', now === 1 ? currentSettings.xSource : currentSettings.oSource)
  $('.showName').text(now === 1 ? currentSettings.xName : currentSettings.oName)
  moved = false
}

const Reset = () => {
  $('.btn-pause').css('display', 'inline-block')
  $('.winner').css('visibility', 'hidden')
  $('.pause').css('visibility', 'hidden')
  $('.table').html(DrawTable())
  ResetDimension()
  for (let i = 0; i < IdList.length; i++) IdList[i] = null
  gameOver = false
  playing = true
  timer = currentSettings.setTimer
}
// #endregion

$(document).ready(function () {
  moved = true
  $('.table').html(DrawTable())
  ResetDimension()

  //  #region JS events
  $('table').on('click', '.td', function () {
    if ($(this).attr('id') === 'checked') return
    UpdateEachRound()
    let index = $('td').index(this)
    timer = currentSettings.setTimer
    if (now === 1 && $(this).attr('id') !== 'checked') {
      $(this).css('background-image', 'url(' + currentSettings.xSource + ')')
      now = 0
      $(this).attr('id', 'checked')
      IdList[index] = 'X'
    }
    if (now === 0 && $(this).attr('id') !== 'checked') {
      $(this).css('background-image', 'url(' + currentSettings.oSource + ')')
      now = 1
      $(this).attr('id', 'checked')
      IdList[index] = 'O'
    }
    if (IsGameOver(index)) GameOver(GetGameOverState(index))
    else {
      if ($(this).attr('AI') !== 'true') GoToNextStep()
      if (IsGameOver(index)) GameOver(GetGameOverState(index))
    }
  })
  $('.btn-reset').click(function () {
    Reset()
  })
  $('.btn-pause').click(function () {
    $('.pause').css('visibility', 'visible')
    playing = false
  })
  $('.btn-continue').click(function () {
    $('.pause').css('visibility', 'hidden')
    playing = true
  })
  $('.btn-new-start').click(function () {
    $('.container').css('display', 'flex')
    $('.start').css('display', 'none')
    playing = true
  })
  $('.btn-setting').click(function () {
    $('.container').css('display', 'none')
    $('.start').css('display', 'none')
    $('.settings').css('display', 'flex')
  })
  $('.btn-about').click(function () {
    $('.modal-about').show(400)
  })
  $('.close').click(function () {
    $('.modal-about').hide(400)
  })
  $('.btn-out-setting').click(function () {
    $('.settings').css('display', 'none')
  })
  $('#step').change(function () {
    $('.show-step').text($(this).val())
  })
  $('#set-width').change(function () {
    $('.show-width').text($(this).val())
  })
  $('#set-height').change(function () {
    $('.show-height').text($(this).val())
  })
  $('#set-timer').change(function () {
    $('.show-timer').text($(this).val())
  })
  $('#set-xName').change(function () {
    $('.show-xName').text($(this).val())
  })
  $('#set-oName').change(function () {
    $('.show-oName').text($(this).val())
  })
  $('.out-setting').click(function () {
    $('#set-width').val(currentSettings.width)
    $('#set-height').val(currentSettings.height)
    $('#step').val(currentSettings.sub)
    $('#set-xName').val(currentSettings.xName)
    $('#set-oName').val(currentSettings.oName)
    $('#set-timer').val(currentSettings.setTimer / 1000)
    $('.show-width').text(currentSettings.width)
    $('.show-height').text(currentSettings.height)
    $('.show-timer').text(currentSettings.setTimer / 1000)
    $('.show-xName').text(currentSettings.xName)
    $('.show-oName').text(currentSettings.oName)
    $('.show-step').text(currentSettings.sub)
    $('.settings').css('display', 'none')
    $('.start').css('display', 'flex')
  })
  $('.save-settings').click(function () {
    currentSettings.width = parseInt($('#set-width').val())
    currentSettings.height = parseInt($('#set-height').val())
    currentSettings.sub = parseInt($('#step').val())
    currentSettings.xName = $('#set-xName').val()
    currentSettings.oName = $('#set-oName').val()
    currentSettings.setTimer = parseInt($('#set-timer').val() * 1000)
    $('.settings').css('display', 'none')
    $('.container').css('display', 'flex')
    Reset()
  })
  // #endregion

  setInterval(function () {
    UpdateEachRound()
    if (timer <= 0) {
      timer = currentSettings.setTimer
      now = now === 1 ? 0 : 1
      if (!moved) GoToNextStep()
    }
    $('.timer').css('width', 100 - (timer / currentSettings.setTimer * 100) + '%')
    timer -= gameOver || !playing ? 0 : 100

    // If the pause button is shown, devide the currentSettings.width of each by 3, else by 2
    $('.btn-row-container .btn-feature').css('width', 100 / ($('.btn-pause').css('display') !== 'none' ? 3 : 2) + '%')
  }, 100)
})
