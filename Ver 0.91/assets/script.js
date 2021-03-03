
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
  	} else if (Choice == "Economy") {
    streamFile = "economy.json";
    var index = "1";
   	} else if (Choice == "Ticket-ETA") {
    streamFile = "ticket-eta.json";
    var index = "1";
    } else if (Choice == "Yes") {
		index = choiceYes;
		if (index == "0") {
		showChoice();
		}
    } else if (Choice == "No") {
		index = choiceNo;
		if (index == "0") {
		showChoice();
		}
    } else if (Choice == "Continue") {
		index = choiceContinue;
		if (index == "0") {
		showChoice();
		}
    } else { 
	}


  $.ajax({
    url: streamFile,
    dataType: "text",
    success: function(data) {
      // PARSE JSON FILE
      var story = $.parseJSON(data);
      for (var i = 0; i < story.length; i++ ) {
       if ( index === story[i].index) {
       var storyData = {
         storyindex     : (story[i].index),
         choiceYes      : (story[i].y),
         choiceNo       : (story[i].n),
         choiceContinue : (story[i].c),
         question       : (story[i].question),
         tagsPlus       : (story[i].addTags),
         tagsMinus      : (story[i].remTags),
         type           : (story[i].type),
         priority       : (story[i].priority),
         taskType       : (story[i].taskType),
         category       : (story[i].category),
         nextIndex      : (story[i].nextindex),
         link           : (story[i].link)
         }	
		globalThis.next           = storyData.nextIndex;
		globalThis.choiceYes      = storyData.choiceYes;
		globalThis.choiceNo       = storyData.choiceNo;
		globalThis.choiceContinue = storyData.choiceContinue;
		
		
		
		if (storyData.tagsPlus) {
			var tagList = storyData.tagsPlus.split(" ");
			addTags(tagList)
		}
		if (storyData.tagsMinus) {
			var tagList = storyData.tagsMinus.split(" ");
			removeTags(tagList)
		}
		if (storyData.type) {
		var Type = storyData.type
			client.set('ticket.type', Type)
		}
		if (storyData.priority) {
		var priority = storyData.priority;
		client.set('ticket.priority', priority)
		}
		if (storyData.taskType) {
		var taskType = storyData.taskType;
		client.set('ticket.customField:custom_field_360019693200', 1)
		}
		if (storyData.category) {
		var category = storyData.category;
		client.set('ticket.customField:custom_field_360019830039', category)
		}



		var data = {'Question': storyData.question};
  		var source = $("#activestream-template").html();
  		var template = Handlebars.compile(source);
  		var html = template(data);
  		$("#Route").html(html);


         }}

      }
     }) 
 
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

  function removeTags(Tag) {
	client.invoke("ticket.tags.remove", Tag);
}  

