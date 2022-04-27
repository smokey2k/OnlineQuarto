// game list widget button colors
var buttonColors = ['red','green','blue','orange','purple','brown','gray','teal'];
function rndColor() { 
    let rnd = Math.floor(Math.random() * (7 - 0 + 1) + 0);
    return `button_${buttonColors[rnd]}`;
}

export const gameListDOM = document.querySelector('.games-list');

// update the game list widget
function updateGameList(gamesList,DOMelement) {
    if (userInfo.game != 'null') {
        return;
    }
    DOMelement.innerHTML = '';
    for (let i = 0; i < gamesList.length; i++) {
        const li = document.createElement('li');
        var form = document.createElement("form");
        form.setAttribute('id','join-game-form');
        form.setAttribute("method", "post");
        var submitButton = document.createElement("input");
        submitButton.setAttribute("type", "submit");
        submitButton.value = gamesList[i].split('-').pop();
        // randomize the game list widget button colors
        submitButton.classList.add("button","button_logout",rndColor());
        submitButton.setAttribute('id',`${gamesList[i]}`);
        form.appendChild(submitButton);
        li.appendChild(form);
        DOMelement.appendChild(li);
        
        // ajax function for joining to the game room
        $("#join-game-form").submit(function(e) {
            e.preventDefault();
            $.ajax({
                url: "/game",
                type: "POST",
                data: {'gameroom': `${gamesList[i]}`},
                success: function(data){
                    location.href = '/game';
                }
            });
        });
    }
}

export {updateGameList};