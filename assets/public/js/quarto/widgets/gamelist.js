var buttonColors = ['red','green','blue','orange','purple','brown','gray','teal'];
function rndColor() { 
    let rnd = Math.floor(Math.random() * (7 - 0 + 1) + 0);
    return `button_${buttonColors[rnd]}`;
}

export const gameListDOM = document.querySelector('.games-list');

function updateGameList(games,DOMelement,socket) {
    DOMelement.innerHTML = '';
    for (let i = 0; i < games.length; i++) {
        const li = document.createElement('li');
        var form = document.createElement("form");
        form.setAttribute('id','join-game-form');
        form.setAttribute("method", "post");
        var submitButton = document.createElement("input");
        submitButton.setAttribute("type", "submit");
        submitButton.value = games[i].split('-').pop();
        submitButton.classList.add("button","button_logout",rndColor());
        submitButton.setAttribute('id',`${games[i]}`);
        form.appendChild(submitButton);
        li.appendChild(form);
        DOMelement.appendChild(li);
        
        $("#join-game-form").submit(function(e) {
            e.preventDefault();
            $.ajax({
                url: "/game",
                type: "POST",
                data: {'gameroom': `${games[i]}`},
                success: function(data){
                    //socket.emit('joinGame',`${games[i]}`);
                    location.href = '/game';
                }
            });
        });
    }
}

export {updateGameList};