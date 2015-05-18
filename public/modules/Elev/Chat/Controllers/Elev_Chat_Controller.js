'use strict';
var elev_chat_controller = function($scope, $http, $state, $rootScope, $timeout, promise, loginUserToChat) {
    console.log("elev_chat_controller.js : ", userCredentials);
    console.log("loginUserToChat : " + loginUserToChat.data)
    if(loginUserToChat.data == "false"){
        $http.put('/api/users/loginToChat').success(function(data){
            console.log("logged in ?",data)
            $("#loginMessage").fadeIn( "slow" );
            setTimeout(function(){
                $("#loginMessage").fadeOut( "slow" );
            },3000);
        })
    }
    $("#tabs").tabs();


    var users = [];
    $scope.userCredentials = userCredentials;
    $scope.users = promise.data;

    var historyRequested = false;

    var mySocket = io.connect('http://localhost:3000');
    console.log("mySocket", mySocket)
    if(!mySocket.connected){
        mySocket.connect();
    }

    var tabs = $("#tabs").tabs();
    var ul = tabs.find("ul");
    var numeCurrentUser = userCredentials.nume + ' ' + userCredentials.prenume;

    //console.log(">>>>>>>>>>>>>>>>>>>>> : ",currentActiveTabId())

    $("#tabs").off('click','ul li');
    $("#tabs").off('click','.chat-messages #showPrevious');
    if(!$(".chat-message-nin-chat").hasClass("hidden")){
        $(".chat-message-nin-chat").addClass("hidden")
        $(".chat-message-nin-chat").removeClass("visible");
        $(".chat-message-nin-chat").empty();
    }

    $rootScope.disconnectSocket = function() {
        console.log("ELEV disconnect socket")
        mySocket.disconnect();
    }


    if (mySocket !== 'undefined') {
        console.log('OK!');
        mySocket.off('output');
        mySocket.off('history');
        mySocket.off('offline');

        mySocket.emit('initLogin', {
            userId : userCredentials._id
        })

        mySocket.on('offline', function(data){
            console.log("message offline ",data)
            if(userCredentials._id != data[0].msgIDSender && userCredentials._id == data[0].msgIDReceiver){
                console.log(data[0].msgIDSender)
                if(!$('#tabs-'+data[0].msgIDSender).length){
                    console.log("nu exista,creaza")
                    if(tabCount() == 0){
                        createTabAndMakeItActive(data[0].msgIDSender, data[0].numeSender)
                    } else {
                        createTab(data[0].msgIDSender, data[0].numeSender)
                        console.log("message received. a tab is already active. create one and do not make it active")
                    }
                }
                if(data[0].msgIDSender != currentActiveTabId()){
                    $("#tabs").find("ul >li a[href='#tabs-" + data[0].msgIDSender + "']").css("color","#c9302c");
                }
                insertMessageInTab(data[0].numeSender, data[0].mesaj, data[0].sentAt, data[0].msgIDSender);
                markMessageSeen();
            }
        })

        mySocket.on('output', function(data) {
            console.log("output ",data);// test if we will get object
            if (data.length) {
                if(userCredentials._id != data[0].msgIDSender){
                    console.log("MESAJUL ASTA VINE DE LA ALTCINEVA");
                    if(userCredentials._id == data[0].msgIDReceiver){
                        console.log("MESAJUL ASTA ESTE PENTRU MINE");
                        if(window.location.hash != "#/chat"){
                            console.log("NU MA AFLU PE PAGINA DE CHAT. AFISEAZA POPUP")
                            outsideChatMessage(data[0].numeSender, data[0].mesaj, data[0].msgIDSender);
                        } else {
                            console.log("MA AFLU PE PAGINA DE CHAT.");
                            if(!$('#tabs-'+data[0].msgIDSender).length){
                                console.log("nu exista,creaza")
                                if(tabCount() == 0){
                                    createTabAndMakeItActive(data[0].msgIDSender, data[0].numeSender)
                                } else {
                                    createTab(data[0].msgIDSender, data[0].numeSender)
                                }
                            }
                            if(currentActiveTabId() != data[0].msgIDSender){
                                $("#tabs").find("ul >li a[href='#tabs-" + data[0].msgIDSender + "']").css("color","#c9302c");
                            }
                            insertMessageInTab(data[0].numeSender, data[0].mesaj, data[0].sentAt, data[0].msgIDSender);
                        }
                    } else {
                        console.log("DAR NU E PENTRU MINE. E PENTRU ALTCINEVA : " + data[0].chatIDReceiver);
                    }
                } else {
                    console.log("MESAJUL ASTA L-AM TRIMIS EU");
                    insertMessageInTab(data[0].numeSender, data[0].mesaj, data[0].sentAt, data[0].msgIDReceiver);
                    markMessageSeen()
                }
            }
        });

        mySocket.on('history', function(data){
            if(!historyRequested){
                if(data.mesaje.length){
                    $("#tabs-"+currentActiveTabId()).empty();
                    for(var i = 0; i<data.mesaje.length ; i++){
                        insertMessageInTab(data.mesaje[i].numeSender, data.mesaje[i].mesaj,
                            data.mesaje[i].sentAt,
                            data.chatIDSender == userCredentials._id ? data.chatIDReceiver : data.chatIDSender);
                        historyRequested = true;
                    }
                    var d = $("#tabs-"+currentActiveTabId());
                    d.scrollTop(d.prop("scrollHeight"));
                }
            }
        })

    } else {
        console.log("SOCKET IS UNDEFINED");
    }

    //listen for keydown
    $('.chat-textarea').keydown(function(event) {
        if (event.which === 13 && event.shiftKey === false) {
            mySocket.emit('input', {
                numeSender:numeCurrentUser,
                mesaj:this.value,
                sentAt : "" + new Date().getTime(),
                chatIDReceiver : currentActiveTabId(),
                chatIDSender : userCredentials._id
            });
            $("#chat-texta").val("");
            event.preventDefault();

            var d = $("#tabs-"+currentActiveTabId());
            d.scrollTop(d.prop("scrollHeight"));
        }
    })

    $('.chat-textarea').focusin(function() {
        markMessageSeen()
    })

    $scope.startChatWithUser = function(user) {
        console.log("startChatWithUser", user);
        var chatTabTitle = user.nume + ' ' + user.prenume;

        if(!$('#tabs-'+user._id).length){
            console.log("nu exista,creaza")
            createTabAndMakeItActive(user._id, chatTabTitle)
        } else {
           console.log("Tab already exists...");
           var index = $('#tabs a[href="#tabs-'+ user._id + '"]').parent().index();
           $("#tabs").tabs("option", "active", index);
        }

    }

    $("#tabs").on('click','.chat-messages #showPrevious',function(){
        mySocket.emit('showHistory',{chatIDSender : userCredentials._id, chatIDReceiver : currentActiveTabId()});
    });

    $("#tabs").on('click','ul li',function(){
        console.log("clicked on li")
        for(var i = 0; i < tabCount() ; i++){
            if(i == currentActiveTab()) {
                $("#tabs").find("ul >li a[href='#tabs-" + currentActiveTabId() + "']").css("color","#555555");
                $('.chat-textarea').focus();
            }
        }
    });

    function createTabAndMakeItActive(idReceiver, chatTabTitle){

        $("<li><a href='#tabs-" + idReceiver + "'>" + chatTabTitle + "</a></li>").appendTo(ul);
        $("<div class='chat-messages' id='tabs-" + idReceiver + "' style='min-height:300px'><span style='cursor:pointer; text-align:center; margin-left:260px; font-size : 12px; color:#2c3e50' id='showPrevious'>ShowPrevious</span></div>").appendTo(tabs);
        tabs.tabs("refresh");
        $("#tabs").tabs("option", "active", tabCount() - 1);


        if($(".chat-box").hasClass("hidden")) {
            console.log("has class hidden");
            $(".chat-box").removeClass("hidden");
            $(".chat-box").addClass("visibile");
            $(".chat-textarea").focus();
        }
    }

    function createTab(idReceiver, chatTabTitle) {
        $("<li><a href='#tabs-" + idReceiver + "'>" + chatTabTitle + "</a></li>").appendTo(ul);
        $("<div class='chat-messages' id='tabs-" + idReceiver + "' style='min-height:300px'><span style='cursor:pointer; text-align:center; margin-left:260px; font-size : 12px; color:#2c3e50' id='showPrevious'>ShowPrevious</span></div>").appendTo(tabs);
        tabs.tabs("refresh");
    }

    function insertMessageInTab(numeSender, mesaj, dataMesaj, tabId){
        $("#tabs-"+tabId).append("<div class='chat-message'><span class='hidden chat-date'>" + dataMesaj + "</span>" + numeSender + " : " + mesaj + "</div>")
    }

    function markMessageSeen(){
        console.log("markMessageSeen currentActiveTabId() : " + currentActiveTabId());
        $("#tabs-"+currentActiveTabId()).find(".chat-date").each(function(){
            if(!$(this).hasClass("seen")){
                console.log("doesn't have class seen. set class seen and mark it seen")
                $(this).addClass("seen");
                mySocket.emit('seen', {
                    chatIDReceiver : currentActiveTabId(),
                    chatIDSender : userCredentials._id,
                    seenBy : userCredentials._id,
                    seen : $(this).text()
                })
            }
        })
    }

    function outsideChatMessage(numeSender, mesaj, idSender){
        var posLeft = $(document).width() - 300;
        var posTop = $(document).height() - 500;
        var mesaj = "<div>" + numeSender + " : " + mesaj;
        if(!$(".chat-message-nin-chat").length){
            $('body').append("<div class='chat-message chat-message-nin-chat visible' style='left:" + posLeft + "px; top:" + posTop +"px'></div>");
            $(".chat-message-nin-chat").on("click",function(event){
                $state.go("account_elev.chat");
                createTabAndMakeItActive(idSender, numeSender)
            })
        } else {
            console.log("exists")
            if($(".chat-message-nin-chat").hasClass("hidden")){
                console.log("it is hidden")
                $(".chat-message-nin-chat").removeClass("hidden");
                $(".chat-message-nin-chat").addClass("visible")
            }
        }
        $(".chat-message-nin-chat").append(mesaj);
    }

    function tabCount(){
        return $('#tabs >ul >li').size();
    }

    function currentActiveTab() {
        //console.log("active tab : " + $("#tabs").tabs("option", "active"))
        return $("#tabs").tabs("option", "active");
    }

    function currentActiveTabId() {
        return $("#tabs ul>li a").eq(currentActiveTab()).attr('href').split('-')[1];
    }
}