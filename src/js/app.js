$(function(){

  var recognition = new webkitSpeechRecognition();
  recognition.lang = 'en';

  var question = {
    filename: "sample.json",
    baseDir: "data/",
    lists: [],
    state: null,
    answer: [],
    lastAnswerText: '',

    getUrl: function() {
      return question.baseDir + question.filename;
    },

    next: function() {
      if (question.state == null) {
        question.state = 0;
      } else {
        question.state++;
      }

      if (question.state >= question.lists.length) {
        // 最初の問題に戻る
        question.state = 0;
      }

      return question.lists[question.state];
    },

    render: function($dom) {
      var q = question.next();
      $dom.text(q.text);
    },

    answerCheck: function(text) {
      var bool = (question.lists[question.state].text == text);
      question.lastAnswerText = text;
      question.answer[question.state] = bool;
      return bool
    },

    answerList: function($dom) {
      var answerState = question.answer[question.state] ? '○' : '×';
      var html = '<tr>';
      html += '<td>' + question.lists[question.state].text + '</td>';
      html += '<td>' + question.lastAnswerText + '</td>';
      html += '<td>' + answerState + '</td>';
      html += '</tr>';
      $dom.append(html);
    }

  }


  // 音声入力時の処理
  recognition.addEventListener('result', function(event){
    var answer = event.results.item(0).item(0).transcript;
    $('#inputText').text(event.results.item(0).item(0).transcript);

    // 答え合わせ
    if (question.answerCheck(answer)) {
      $('#alert').html(
        '<div class="alert alert-success" role="alert">正解</div>'
      );
    } else {
      $('#alert').html(
        '<div class="alert alert-danger" role="alert">間違い</div>'
      );
    }

    // 正解リストの表示
    question.answerList($('#qlist'));

  });

  // 音声認識開始イベント
  recognition.addEventListener('start', function(event){
    $('#alert').html(
      '<div class="alert alert-warning" role="alert">入力してください</div>'
    );
  });

  // 音声認識終了イベント
  recognition.addEventListener('end', function(event){
    $('#inputBtn').removeClass('disabled');
  });

  // 音声入力検知
  recognition.addEventListener('soundstart', function(event){
    $('#alert').html(
      '<div class="alert alert-warning" role="alert">入力中です...</div>'
    );
  });

  recognition.addEventListener('soundend', function(event){
    $('#alert').html(' ');
  });

  // 音声入力エラー
  recognition.addEventListener('error', function(event){
    $('#alert').html(
      '<div class="alert alert-danger" role="alert">エラーです。再度回答するボタンを押してください</div>'
    );
  });

  // 開始ボタンのイベント処理
  $('#inputBtn').on('click',function(){
    // ボタンがすでに押されているか、問題が取得できてない場合
    if($('#inputBtn').hasClass('disabled')) {
      return
    }
    $('#inputBtn').addClass('disabled');
    recognition.start();
  });


  // 問題取得
  $.get(question.getUrl()).then(function(result){
    question.lists = result;
    question.render($('#question'));
    recognition.start();
  });

  // 次の問題
  $('#nextBtn').on('click',function(){
    $('#alert').html(' ');
    $('#inputText').html('');
    $('#inputBtn').addClass('disabled');
    question.render($('#question'));
    recognition.start();
  })



});
