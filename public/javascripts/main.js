jQuery(document).ready(function($) {
    //cache some jQuery objects
    var modalTrigger = $('.cd-modal-trigger'),
        buttonTrigger = $('.cd-btn'),
        transitionLayer = $('.cd-transition-layer'),
        transitionBackground = transitionLayer.children(),
        modalWindow = $('.cd-modal');

    var frameProportion = 1.78, //png frame aspect ratio
        frames = transitionLayer.data('frame'), //number of png frames
        resize = false;

    //set transitionBackground dimentions
    setLayerDimensions();
    $(window).on('resize', function() {
        if (!resize) {
            resize = true;
            (!window.requestAnimationFrame) ? setTimeout(setLayerDimensions, 300): window.requestAnimationFrame(setLayerDimensions);
        }
    });

    //open modal window
    modalTrigger.on('click', function(event) {
        event.preventDefault();
        var modalId = $(event.target).attr('href');
        console.log(modalId);
        transitionLayer.addClass('visible opening');
        var delay = ($('.no-cssanimations').length > 0) ? 0 : 800;
        setTimeout(function() {
            modalWindow.filter(modalId).addClass('visible');
            transitionLayer.removeClass('opening');
        }, delay);
    });

    buttonTrigger.on('click', function(event) {
        event.preventDefault();
        var href = $(event.target).attr('href');
        var delay = 500;

        if (href === "defender" && def_exist) {
            return false;
        }
        if (href === "insert" && players.length >= player_limit) {
            return false;
        }

        $('#sound-file').get(0).play();
        if (href) {
            setTimeout(function() {
                location.href = href;
            }, delay);
        }
    });

    //close modal window
    modalWindow.on('click', '.modal-close', function(event) {
        event.preventDefault();
        transitionLayer.addClass('closing');
        modalWindow.removeClass('visible');
        transitionBackground.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function() {
            transitionLayer.removeClass('closing opening visible');
            transitionBackground.off('webkitAnimationEnd oanimationend msAnimationEnd animationend');
        });
    });

    window.onload = function() {
        receive();
        //        is_def_exist();
        setInterval(receive.bind(this), 5000);
        //        setInterval(is_def_exist.bind(this), 5000);
    }

    function setLayerDimensions() {
        var windowWidth = $(window).width(),
            windowHeight = $(window).height(),
            layerHeight, layerWidth;

        if (windowWidth / windowHeight > frameProportion) {
            layerWidth = windowWidth;
            layerHeight = layerWidth / frameProportion;
        } else {
            layerHeight = windowHeight * 1.2;
            layerWidth = layerHeight * frameProportion;
        }

        transitionBackground.css({
            'width': layerWidth * frames + 'px',
            'height': layerHeight + 'px',
        });

        resize = false;
    }

    var players = [];
    var player_limit = 10;
    var def_exist = false;

    function receive() {
        var hostUrl = '/receive';
        $.ajax({
            url: hostUrl,
            type: "post",
            dataType: "json",
            success: function(res) {
                console.log(res);
                setPlayers(res)
            },
            error: function(res) {
                console.log("ERROR");
            }
        });
    }

    function setPlayers(data) {
        for (var i = 0; i < data.length; i++) {
            var name = data[i].name;

            if (players.indexOf(name) == -1) {
                // nameがplayersに存在しない場合
                players.push(name);
            }
        }

        is_def_exist();
    }

    function is_def_exist() {
        var hostUrl = '/is_def_exist';
        $.ajax({
            url: hostUrl,
            type: "post",
            dataType: "json",
            success: function(res) {
                console.log(res);
                def_exist = res.def_exist;
                invalidate_button();
                display();
            },
            error: function(res) {
                console.log("ERROR");
            }
        });
    }

    function invalidate_button() {
        console.log("def_exist: " + def_exist);
        if (def_exist) {
            $(".defender").css({
                "background": "#BDBDBD",
            });
        }
        console.log("players.length:" + players.length);
        if (players.length >= player_limit) {
            $(".attacker").css({
                "background": "#BDBDBD",
            });
        }
    }

    function display() {

        var dom1 = '<p>player number<br>' + players.length + '/10</p>';
        $(".mode .attacker_space").empty();
        $(".mode .attacker_space").append(dom1);

        if (def_exist) {
            var dom2 = '<p>player number<br>1/1</p>';
        } else {

            var dom2 = '<p>player number<br>0/1</p>';
        }
        $(".mode .defender_space").empty();
        $(".mode .defender_space").append(dom2);
    }
});