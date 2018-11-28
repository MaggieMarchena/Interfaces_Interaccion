/*jshint esversion: 6 */

let tabTopPlayers = document.getElementById('tab-top-players');
let tabComments = document.getElementById('tab-comments');
let contentTopPlayers = document.getElementById('content-top-players');
let contentComments = document.getElementById('content-comments');

tabTopPlayers.addEventListener('click', function(e){
  e.preventDefault();
  tabComments.classList.remove('active');
  tabComments.classList.add('inactive');
  tabTopPlayers.classList.remove('inactive');
  tabTopPlayers.classList.add('active');

  contentTopPlayers.classList.remove('inactive');
  contentTopPlayers.classList.add('active');
  contentComments.classList.remove('active');
  contentComments.classList.add('inactive');
});

tabComments.addEventListener('click', function(e){
  e.preventDefault();
  tabTopPlayers.classList.remove('active');
  tabTopPlayers.classList.add('inactive');
  tabComments.classList.remove('inactive');
  tabComments.classList.add('active');

  contentTopPlayers.classList.remove('active');
  contentTopPlayers.classList.add('inactive');
  contentComments.classList.remove('inactive');
  contentComments.classList.add('active');
});

fetch('https://jsonplaceholder.typicode.com/comments')
  .then(response => response.json())
  .then(function(json) {
    document.getElementById('comment-name-1').innerHTML = json[0].name;
    document.getElementById('comment-name-2').innerHTML = json[1].name;
    document.getElementById('comment-name-3').innerHTML = json[2].name;

    let text1 = json[0].body.slice(0, 50) + "...";
    let text2 = json[1].body.slice(0, 50) + "...";
    let text3 = json[2].body.slice(0, 50) + "...";
    document.getElementById('comment-text-1').innerHTML = text1;
    document.getElementById('comment-text-2').innerHTML = text2;
    document.getElementById('comment-text-3').innerHTML = text3;
  });
