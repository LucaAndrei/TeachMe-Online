'use strict';
var elev_chat_controller = function($scope, $http, $state, $rootScope, $timeout, promise) {
    console.log("elev_chat_controller.js : ", userCredentials);

    $("#tabs").tabs();


    var users = [];
    $scope.userCredentials = userCredentials;
    $scope.users = promise.data;

    var historyRequested = false;

    var mySocket = io.connect('http://localhost:3000');
    console.log("mySocket", mySocket)


    if (mySocket !== 'undefined') {
        console.log('OK!');

        //Listen for output
        //listen for new emitted messages
        mySocket.off('output');
        mySocket.off('history');
        mySocket.on('output', function(data) {
            console.log("output ",data);// test if we will get object
            if (data.length) {
                if(userCredentials._id != data[0].idSender){
                    console.log("MESAJUL ASTA VINE DE LA ALTCINEVA");
                    if(userCredentials._id == data[0].idReceiver){
                        console.log("MESAJUL ASTA ESTE PENTRU MINE");
                        if(!$('#tabs-'+data[0].idSender).length){
                            console.log("nu exista,creaza")

                            createTabAndMakeItActive(data[0].idSender, data[0].numeSender)

                            insertMessageInTab(data[0].numeSender, data[0].mesaj);
                        } else {
                            console.log("tabul deja exista.");
                            insertMessageInTab(data[0].numeSender, data[0].mesaj);
                        }
                    } else {
                        console.log("DAR NU E PENTRU MINE. E PENTRU ALTCINEVA : " + data[0].idReceiver);
                    }
                } else {
                    console.log("MESAJUL ASTA L-AM TRIMIS EU");
                    insertMessageInTab(data[0].numeSender, data[0].mesaj);
                }
            }
        });

        mySocket.on('history', function(data){
            console.log("show history");
            if(!historyRequested){
                console.log("history was not requested or nothing was received")
                if(data.length){
                    for(var i = 0; i<data.length ; i++){
                        insertMessageInTab(data[i].numeSender, data[i].mesaj);
                        historyRequested = true;
                    }
                }
            } else {
                console.log("history was requested already.")
            }
        })


        //listen for keydown
        $('.chat-textarea').keydown(function(event) {
            var self= this;
            if (event.which === 13 && event.shiftKey === false) {
            	var numeCurrentUser = userCredentials.nume + ' ' + userCredentials.prenume;
            	var currentActiveTab = $("#tabs").tabs("option", "active");
            	var mesaj = self.value;
            	var senderId = userCredentials._id;
            	var receiverId = $("#tabs ul>li a").eq(currentActiveTab).attr('href').split('-')[1];

            	console.log("receiverId : " + receiverId);

                mySocket.emit('input', {
					numeSender:numeCurrentUser,
					mesaj:self.value,
					idReceiver : receiverId,
					idSender : senderId
				});
                $("#chat-texta").val("");
                event.preventDefault();

                var d = $("#tabs-"+receiverId);
                d.scrollTop(d.prop("scrollHeight"));

                /*$("#tabs-"+receiverId).scrollTop($("#tabs-"+receiverId)[0].scrollHeight);
                console.log($("#tabs-"+receiverId).scrollTop())*/


            }
        })
    } else {
        console.log("SOCKET IS UNDEFINED");
    }

    $scope.startChatWithUser = function(user) {
        console.log("startChatWithUser", user);
        var chatTabTitle = user.nume + ' ' + user.prenume;

        if(!$('#tabs-'+user._id).length){
            console.log("nu exista,creaza")
            createTabAndMakeItActive(user._id, chatTabTitle)
        } else {
           console.log("Tab already exists...");
           var currentActiveTab = $("#tabs").tabs("option", "active");
           var index = $('#tabs a[href="#tabs-'+ user._id + '"]').parent().index();
           $("#tabs").tabs("option", "active", index);
        }
    }

     $("#tabs").on('click','.chat-messages #showPrevious',function(){
        var currentActiveTab = $("#tabs").tabs("option", "active");
        var receiverId = $("#tabs ul>li a").eq(currentActiveTab).attr('href').split('-')[1];
        mySocket.emit('showHistory',{idSender : userCredentials._id, idReceiver : receiverId});
    });

    function createTabAndMakeItActive(idReceiver, chatTabTitle){
        var tabs = $("#tabs").tabs();
        var ul = tabs.find("ul");
        $("<li><a href='#tabs-" + idReceiver + "'>" + chatTabTitle + "</a></li>").appendTo(ul);
        $("<div class='chat-messages' id='tabs-" + idReceiver + "' style='min-height:300px'><span style='cursor:pointer; text-align:center; margin-left:260px; font-size : 12px; color:#2c3e50' id='showPrevious'>ShowPrevious</span></div>").appendTo(tabs);
        tabs.tabs("refresh");
        var tabCount = $('#tabs >ul >li').size();
        $("#tabs").tabs("option", "active", tabCount - 1);
    }

    function insertMessageInTab(numeSender, mesaj){
        var currentActiveTab = $("#tabs").tabs("option", "active");
        var currentActiveTabID = $("#tabs ul>li a").eq(currentActiveTab).attr('href');
        console.log("currentActiveTabID",currentActiveTabID);
        $(""+currentActiveTabID).append("<div class='chat-message'>" + numeSender + " : " + mesaj + "</div>")
    }
}