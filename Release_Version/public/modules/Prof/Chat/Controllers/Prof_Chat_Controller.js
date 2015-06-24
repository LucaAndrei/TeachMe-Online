'use strict';
var prof_chat_controller = function($scope, $http, $state, $rootScope, $timeout, users, loginUserToChat) {
    if (loginUserToChat.data == "false") {
        $http.put('/api/users/loginToChat').success(function(data) {
            $("#loginMessage").fadeIn("slow");
            setTimeout(function() {
                $("#loginMessage").fadeOut("slow");
            }, 3000);
        })
    }

    $("#tabs").tabs();

    var users = [];
    $scope.userCredentials = userCredentials;
    $scope.users = users.data;

    var historyRequested = false;

    var mySocket = io.connect('http://localhost:3000');
    if (!mySocket.connected) {
        mySocket.connect();
        $rootScope.connectedToChat = true;
    }

    var tabs = $("#tabs").tabs();
    var ul = tabs.find("ul");
    var numeCurrentUser = userCredentials.nume + ' ' + userCredentials.prenume;

    $("#tabs").off('click', 'ul li');
    $("#tabs").off('click', '.chat-messages #showPrevious');
    if (!$(".chat-message-nin-chat").hasClass("hidden")) {
        $(".chat-message-nin-chat").addClass("hidden")
        $(".chat-message-nin-chat").removeClass("visible");
        $(".chat-message-nin-chat").empty();
    }

    $rootScope.disconnectSocket = function() {
        mySocket.disconnect();
    }

    if (mySocket !== 'undefined') {
        mySocket.off('output');
        mySocket.off('history');
        mySocket.off('offline');

        mySocket.emit('initLogin', {
            userId: userCredentials._id
        })

        mySocket.on('offline', function(data) {
            if (userCredentials._id != data[0].msgIDSender && userCredentials._id == data[0].msgIDReceiver) {
                if (!$('#tabs-' + data[0].msgIDSender).length) {
                    if (tabCount() == 0) {
                        createTabAndMakeItActive(data[0].msgIDSender, data[0].numeSender)
                    } else {
                        createTab(data[0].msgIDSender, data[0].numeSender)
                    }
                }
                if (data[0].msgIDSender != currentActiveTabId()) {
                    $("#tabs").find("ul >li a[href='#tabs-" + data[0].msgIDSender + "']").css("color", "#c9302c");
                }
                insertMessageInTab(data[0].numeSender, data[0].mesaj, data[0].sentAt, data[0].msgIDSender);
                markMessageSeen();
            }
        })

        mySocket.on('output', function(data) {
            if (data.length) {
                if (userCredentials._id != data[0].msgIDSender) {
                    if (userCredentials._id == data[0].msgIDReceiver) {
                        if (window.location.hash != "#/chat") {
                            outsideChatMessage(data[0].numeSender, data[0].mesaj, data[0].msgIDSender);
                        } else {
                            if (!$('#tabs-' + data[0].msgIDSender).length) {
                                if (tabCount() == 0) {
                                    createTabAndMakeItActive(data[0].msgIDSender, data[0].numeSender)
                                } else {
                                    createTab(data[0].msgIDSender, data[0].numeSender)
                                }
                            }
                            if (currentActiveTabId() != data[0].msgIDSender) {
                                $("#tabs").find("ul >li a[href='#tabs-" + data[0].msgIDSender + "']").css("color", "#c9302c");
                            }
                            insertMessageInTab(data[0].numeSender, data[0].mesaj, data[0].sentAt, data[0].msgIDSender);
                        }
                    }
                } else {
                    insertMessageInTab(data[0].numeSender, data[0].mesaj, data[0].sentAt, data[0].msgIDReceiver);
                    markMessageSeen()
                }
            }
        });

        mySocket.on('history', function(data) {
            if (data.clickedBy == userCredentials._id) {
                if (!historyRequested) {
                    if (data.mesaje.length) {
                        $("#tabs-" + currentActiveTabId()).empty();
                        for (var i = 0; i < data.mesaje.length; i++) {
                            insertMessageInTab(data.mesaje[i].numeSender, data.mesaje[i].mesaj,
                                data.mesaje[i].sentAt,
                                data.chatIDSender == userCredentials._id ? data.chatIDReceiver : data.chatIDSender);
                            historyRequested = true;
                        }
                        var d = $("#tabs-" + currentActiveTabId());
                        d.scrollTop(d.prop("scrollHeight"));
                    }
                }
            }
        })
    }

    //listen for keydown
    $('.chat-textarea').keydown(function(event) {
        if (event.which === 13 && event.shiftKey === false) {
            mySocket.emit('input', {
                numeSender: numeCurrentUser,
                mesaj: this.value,
                sentAt: "" + new Date().getTime(),
                chatIDReceiver: currentActiveTabId(),
                chatIDSender: userCredentials._id
            });
            $("#chat-texta").val("");
            event.preventDefault();

            var d = $("#tabs-" + currentActiveTabId());
            d.scrollTop(d.prop("scrollHeight"));
        }
    })

    $('.chat-textarea').focusin(function() {
        markMessageSeen()
    })

    $scope.startChatWithUser = function(user) {
        var chatTabTitle = user.nume + ' ' + user.prenume;

        if (!$('#tabs-' + user._id).length) {
            createTabAndMakeItActive(user._id, chatTabTitle)
        } else {
            var index = $('#tabs a[href="#tabs-' + user._id + '"]').parent().index();
            $("#tabs").tabs("option", "active", index);
        }

    }

    $("#tabs").on('click', '.chat-messages #showPrevious', function() {
        mySocket.emit('showHistory', {
            chatIDSender: userCredentials._id,
            chatIDReceiver: currentActiveTabId()
        });
    });

    $("#tabs").on('click', 'ul li', function() {
        for (var i = 0; i < tabCount(); i++) {
            if (i == currentActiveTab()) {
                $("#tabs").find("ul >li a[href='#tabs-" + currentActiveTabId() + "']").css("color", "#555555");
                $('.chat-textarea').focus();
            }
        }
    });

    function createTabAndMakeItActive(idReceiver, chatTabTitle) {

        $("<li><a href='#tabs-" + idReceiver + "'>" + chatTabTitle + "</a></li>").appendTo(ul);
        $("<div class='chat-messages' id='tabs-" + idReceiver + "' style='min-height:300px'><span style='cursor:pointer; text-align:center; margin-left:260px; font-size : 12px; color:#2c3e50' id='showPrevious'>ShowPrevious</span></div>").appendTo(tabs);
        tabs.tabs("refresh");
        $("#tabs").tabs("option", "active", tabCount() - 1);


        if ($(".chat-box").hasClass("hidden")) {
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

    function insertMessageInTab(numeSender, mesaj, dataMesaj, tabId) {
        $("#tabs-" + tabId).append("<div class='chat-message'><span class='hidden chat-date'>" + dataMesaj + "</span>" + numeSender + " : " + mesaj + "</div>")
    }

    function markMessageSeen() {
        $("#tabs-" + currentActiveTabId()).find(".chat-date").each(function() {
            if (!$(this).hasClass("seen")) {
                $(this).addClass("seen");
                mySocket.emit('seen', {
                    chatIDReceiver: currentActiveTabId(),
                    chatIDSender: userCredentials._id,
                    seenBy: userCredentials._id,
                    seen: $(this).text()
                })
            }
        })
    }

    function outsideChatMessage(numeSender, mesaj, idSender) {
        var posLeft = $(document).width() - 300;
        var posTop = $(document).height() - 500;
        var mesaj = "<div>" + numeSender + " : " + mesaj;
        if (!$(".chat-message-nin-chat").length) {
            $('body').append("<div class='chat-message chat-message-nin-chat visible' style='left:" + posLeft + "px; top:" + posTop + "px'></div>");
            $(".chat-message-nin-chat").on("click", function(event) {
                $state.go("account_prof.chat");
                createTabAndMakeItActive(idSender, numeSender)
            })
        } else {
            if ($(".chat-message-nin-chat").hasClass("hidden")) {
                $(".chat-message-nin-chat").removeClass("hidden");
                $(".chat-message-nin-chat").addClass("visible")
            }
        }
        $(".chat-message-nin-chat").append(mesaj);
    }

    function tabCount() {
        return $('#tabs >ul >li').size();
    }

    function currentActiveTab() {
        return $("#tabs").tabs("option", "active");
    }

    function currentActiveTabId() {
        return $("#tabs ul>li a").eq(currentActiveTab()).attr('href').split('-')[1];
    }
}