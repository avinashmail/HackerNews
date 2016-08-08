
getTopNewsId(getNewTopNewsId);


 function getTopNewsId(getNewTopNewsId){

    var req_data={"txt":"Today is  a good day"};
 $.ajax({
       url : "https://community-hacker-news-v1.p.mashape.com/topstories.json?print=pretty",
       type : "GET",
       dataType: 'json',
 success : function(response) {
     var rep_data=JSON.stringify(response);
//         console.log(response);
        localStorage.setItem("top_news", rep_data);
        getNewTopNewsId(rep_data,allDetails);
 },

 error : function(xhr,errmsg,err) {
 console.log(xhr.status + ": " + xhr.responseText); s
 },
 beforeSend: function(xhr) {
    xhr.setRequestHeader("X-Mashape-Authorization", "x8pwLVT6ekmshzWAy8ZyJ9SJke2Kp1X9U4OjsnmNYCIlbasCw9"); // Enter here your Mashape key
    }
 });
 }


     function getNewTopNewsId(data,allDetails){
             var csrftoken = getCookie('csrftoken');
            $.ajax({
                  url : "/get_top_news_id/",
                  type : "POST",
                  dataType: 'json',
                  data: data,
            success : function(response) {
            console.log(response);
                var rep_data = response.new_news_id;
                 var i=0;
                for(i=0; i<rep_data.length; i++){
                     allDetails(rep_data[i],getSentiment);
                }

              if(i >= rep_data.length){
                   displayNews();
              }

            },

            error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
            },
            beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
            });
    }



    function allDetails(data,getSentiment){
            var d=data;
            $.ajax({
                url : "https://community-hacker-news-v1.p.mashape.com/item/"+d+".json?print=pretty",
                type : "GET",
                dataType: 'json',
                data: data,
                success : function(response) {
//                console.log(response);
                    var rep_data=JSON.stringify(response);
                       getSentiment(saveDetails,response);
                },

                error : function(xhr,errmsg,err) {
                console.log(xhr.status + ": " + xhr.responseText);
                },
                beforeSend: function(xhr) {
                   xhr.setRequestHeader("X-Mashape-Authorization", "x8pwLVT6ekmshzWAy8ZyJ9SJke2Kp1X9U4OjsnmNYCIlbasCw9"); // Enter here your Mashape key
                   }
                });
    }


function stripEndQuotes(s){
	var t=s.length;
	s=s.substring(1,t-1);
	return s;
}


function getSentiment(saveDetails,data){
        var title=data.title;
        title = stripEndQuotes(title);
        var req_data={"txt":title};
        $.ajax({
                url : "https://community-sentiment.p.mashape.com/text/",
                type : "POST",
                dataType: 'json',
                data: req_data,
                success : function(response) {
//                console.log(response);
                       var ret_json= {"news_id":data.id,"username":data.by,"title":data.title,"url":data.url,"score":data.score,
                       "description":data.type,"descendants":data.descendants,"confidence":response.result.confidence,
                       "sentiment":response.result.sentiment
                       }
                       saveDetails(encodeURIComponent(JSON.stringify(ret_json)));
                },

                error : function(xhr,errmsg,err) {
                console.log(xhr.status + ": " + xhr.responseText); s
                },
                beforeSend: function(xhr) {
                   xhr.setRequestHeader("X-Mashape-Authorization", "x8pwLVT6ekmshzWAy8ZyJ9SJke2Kp1X9U4OjsnmNYCIlbasCw9"); // Enter here your Mashape key
                   }
        });

}
 function saveDetails(data){
            var csrftoken = getCookie('csrftoken');
            $.ajax({
                  url : "/save_details/",
                  type : "POST",
                  dataType: 'json',
                  data: data,
            success : function(response) {
//               console.log(response);
            },

            error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
            },
            beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
            });
 }


 function displayNews(){
        var top_news=localStorage.getItem('top_news');
        var csrftoken = getCookie('csrftoken');
            $.ajax({
                  url : "/display_news/",
                  type : "POST",
                  dataType: 'json',
                  data: top_news,
            success : function(response) {
//                console.log(response);
                var tmp1=$('<tbody><tr><th>Index</th><th>Title</th><th>Sentiment</th></tr></tbody>');
                          $('#top_news_title').append(tmp1);
                for(var i=0; i<response.top_news_list.length; i++){
                    var title = response.top_news_list[i].title;
                    var sentiment = response.top_news_list[i].sentiment;
                    var url = response.top_news_list[i].url;
                    var tmp=$('<tbody><tr><td>'+(i+1)+'</td><td><a href="'+url+'" target="_blank">'+title+'</a></td><td>'+sentiment+'</td></tr> </tbody>');
                    $('#top_news_title').append(tmp);
                }


            },

            error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
            },
            beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
            });
 }


function search_query(){
   var search_text =  $("#search").val();
   var csrftoken = getCookie('csrftoken');
    if(typeof(search_text) == "undefined" || search_text==null ||search_text=="")
				  alert("Please Enter the Value");
    else{
       var data = {"search_text":search_text};
       data = JSON.stringify(data);
            $.ajax({
                  url : "/search_query/",
                  type : "POST",
                  dataType: 'json',
                  data: data,
            success : function(response) {
//               console.log(response);
                $("#top_news_title").empty();
                 var tmp1=$('<tbody><tr><th>Index</th><th>Title</th><th>Sentiment</th></tr></tbody>');
                          $('#top_news_title').append(tmp1);
                for(var i=0; i<response.search_list.length; i++){
                    var title = response.search_list[i].title;
                    var sentiment = response.search_list[i].sentiment;
                    var url = response.search_list[i].url;
                    var tmp=$('<tbody><tr><td>'+(i+1)+'</td><td><a href="'+url+'" target="_blank">'+title+'</a></td><td>'+sentiment+'</td></tr> </tbody>');
                    $('#top_news_title').append(tmp);
                }
            },

            error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
            },
            beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
            });
     }
}


function home(){
//    window.location = '/';
  $("#top_news_title").empty();
  displayNews();
}


    //For getting CSRF token
function getCookie(name) {
          var cookieValue = null;
          if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
          for (var i = 0; i < cookies.length; i++) {
               var cookie = jQuery.trim(cookies[i]);
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) == (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
             }
          }
      }
 return cookieValue;
}
