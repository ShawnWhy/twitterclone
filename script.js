function formatDateForMySQL(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

$(document).ready(() => {
  console.log("ready");
  $.ajax({
    url: "/api/allposts",
    type: "GET",
  }).then(function (response, err) {
    //parses the string into an usable array,

    console.log(response);
    deployTweets(response);
  });

  fetch("/api/allposts", {
    method: "GET",
  })
    .then((res) => res.json())

    .then((data) => {
      console.log(data);
    });
});

function deployTweets(tweets) {
  for (var i = 0; i < tweets.length; i++) {
    let container = $("<div>");
    container.addClass("tweetContainer");
    // container.html(tweets[i].postbody)
    console.log(tweets[i]);
    container.attr("name", tweets[i].id);
    container.html(
      `<div class="user_name">${tweets[i].username}</div><div class="post_body">${tweets[i].postbody}</div><div class="post_date">${tweets[i].postdate}</div>`
    );
    $("body").append(container);
  }
}

function changeTweet(element) {
  var changeinputDiv = $("<div>");
  changeinputDiv.css("position", "absolute");
  var changeInput = $("<input>");
  var tweetText = $(element).html();
  console.log(tweetText);
  changeInput.addClass("changeInput");
  changeInput.val(tweetText);
  var submitButton = $("<button>");
  $(submitButton).html("submit");
  submitButton.addClass("submitButton");
  $(changeinputDiv).append(changeInput);
  $(changeinputDiv).append(submitButton);
  var container = $(element).parent();
  $(container).append(changeinputDiv);
}

function submitTweet(info) {
  $.ajax({
    url: "/api/post",
    type: "POST",
    data: info, // Use 'data' instead of 'body' to send the data
  })
    .then(function (response) {
      // Success callback
      console.log("Success:", response);
    })
    .catch(function (error) {
      // Error callback
      console.log("Error:", error);
    });
}

function updateTweet(info) {
  $.ajax({
    url: "/api/editPost/" + info.id,
    type: "POST",
    data: info.body,
  })
    .then(function (response) {
      // Success callback
      console.log("Success:", response);
      location.reload();
    })
    .catch(function (error) {
      // Error callback
      console.log("Error:", error);
    });
}

$(document).on("click", ".post_body", (e) => {
  e.stopPropagation();
  e.preventDefault();
  console.log("tweetcontainer click");
  changeTweet(e.target);
});

$(document).on("click", ".submitButton", (e) => {
  e.stopPropagation();
  e.preventDefault();

  var now = new Date();
  var formattedDate = formatDateForMySQL(now);
  console.log($(e.target).parent());
  var postid = $(e.target).parent().parent().attr("name");
  var newText = $(e.target).parent().parent().find(".changeInput").val();
  var newItem = {
    id: postid,
    body: {
      // date:formattedDate,
      text: newText,
    },
  };
  console.log(newItem);
  updateTweet(newItem);
});

$("#submission").on("submit", (e) => {
  if ($("#userid").val() && $("#tweetinput").val()) {
    console.log("there are inputs");
    var userid = $("#userid").val();
    var tweet = $("#tweetinput").val();
    console.log(userid);
    console.log(tweet);
    submitTweet({
      text: tweet,
      userid: userid,
    });
  }
});
