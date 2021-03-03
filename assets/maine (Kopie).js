$(function() {
  var client = ZAFClient.init();
  client.invoke('resize', { width: '320', height: '180px' });
  client.get('ticket.requester.id').then(
  function(data) {
    var user_id = data['ticket.requester.id'];
    requestUserInfo(client, user_id);
  }
 )

});


function requestUserInfo(client, id) {
  var settings = {
    url: '/api/v2/users/' + id + '.json',
    type:'GET',
    dataType: 'json',
  };

  client.request(settings).then(
    function(data) {
      showInfo(data);
    },
    function(response) {
      showError(response);
    }
  );
}



function showError(response) {
  var error_data = {
    'status': response.status,
    'statusText': response.statusText
  };
  var source = $("#error-template").html();
  var template = Handlebars.compile(source);
  var html = template(error_data);
  $("#content").html(html);
}



function formatDate(date) {
  var cdate = new Date(date);
  var options = {
    year: "numeric",
    month: "short",
    day: "numeric"
  };
  date = cdate.toLocaleDateString("en-us", options);

  return date;
}

function  showInfo(data) {
  var requester_data = {
    'name': data.user.name,
    'tags': data.user.tags,
    'created_at': formatDate(data.user.created_at),
    'last_login_at': formatDate(data.user.last_login_at)
  };


  var source = $("#requester-template").html();
  var template = Handlebars.compile(source);
  var html = template(requester_data);
  $("#content").html(html);
  showChoice();
}

function showChoice() {
  var source = $("#choice-template").html();
  var template = Handlebars.compile(source);
  $("#Route").html(template);
 }

function showActive(Choice) {

  if (Choice == "BugReport") {
  showBugReport(Choice);
  } else {
  addTags(Choice);
  var data = {'Question': Choice};
  var source = $("#activestream-template").html();
  var template = Handlebars.compile(source);
  var html = template(data);
  $("#Route").html(html);
  }
}

function showBugReport(Choice) {
  addTags(Choice);
  client.invoke('resize', { width: '320', height: '4000px' });
  var source = $("#bugreport-template").html();
  var template = Handlebars.compile(source);
  $("#Route").html(template);
}

  function addTags(Tag) {
	client.invoke("ticket.tags.add", Tag);
}  

