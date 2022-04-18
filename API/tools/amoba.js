const session = require('express-session');
const db = require('../model/model-mysql');
const { games,getGamePlayers } = require('./rooms');

function checkFive(row, col, user,session)
{   
    var game = games.findIndex(game => game.gamename === `${session.game}`);
    var table = games[game].table;
     let win = false;
    let amoba =[];
 
    // vízszintes ellenőrzés
    let count = 0;
    for(let i=col-4; i<=col+4;i++)
    {
        if (i<0 || i>14)
        {
            count = 0;
        }
        else
        {
            if (table[row][i] == user)
            {
                count++;
                if (count == 5)
                {
                    for(let k=i-4; k<=i; k++)
                    {
                        amoba.push({'x':k, 'y':row, 'u': user });
                    }
                    //console.log(amoba)

                    win = true;
                    return win;
                }
            }
            else
            {
                count = 0;
            }
        }
    }

   // függőleges ellenőrzés
   count = 0;
   for(let i=row-4; i<=row+4;i++)
   {
       if (i<0 || i>14)
       {
           count = 0;
           amoba = [];
       }
       else
       {
            if (table[i][col] == user)
            {
                count++;
                amoba.push({x:row, y:i, u: user });
                if (count == 5)
                {
                    win = true;
                    return win;
                }
            }
            else
            {
                count = 0;
                amoba = [];
            }
        }
   }

    // átlós ellenőrzés 1
    count = 0;
    let j = row-4;
    for(let i=col-4; i<=col+4;i++)
    {
        if (i<0 || i>14 || j<0 || j>14)
        {
            count = 0;
            amoba = [];
        }
        else
        {
            if (table[j][i] == user)
            {
                count++;
                amoba.push({x:row, y:i, u: user });
                if (count == 5)
                {
                    win = true;
                    return win;
                }
            }
            else
            {
                count = 0;
                amoba = [];
            } 
        }
        j++;
    }

    // átlós ellenőrzés 2
    count = 0;
    j = row+4;
    for(let i=col-4; i<=col+4;i++)
    {
        if (i<0 || i>14 || j<0 || j>14)
        {
            count = 0;
            amoba = [];
        }
        else
        {
            if (table[j][i] == user)
            {
                count++;
                amoba.push({x:row, y:i, u: user });
                if (count == 5)
                {
                    win = true;
                    return win;
                }
            }
            else
            {
                count = 0;
                amoba = [];
            } 
        }
        j--;
    }
    return win;
}


function proccesWin(userIndex,session,type) {
    var game = games.findIndex(game => game.gamename === `${session.game}`);
    let score;
    let results = {
        nogame: false,
        status: 0,
        winner: {},
        loser: {}
    }
    let playerCount = getGamePlayers(session.game,session).length;
    if (playerCount < 2 && type == 1) {
        results.nogame = true;
        db.query(` UPDATE rooms SET game='null' WHERE userID=${games[game].users[0].id};`, (err)=>{
            if (err) throw err;
        });
    } else {
        games[game].gameState = false;
        if (type == 0) {
            score = 20;
            results.status = 0;
           if (userIndex == 0) {
                results.winner = games[game].users[0];
                results.loser = games[game].users[1];
            } else {
                results.winner = games[game].users[1];
                results.loser = games[game].users[0]; 
            }    
        } else {
            score = 5;
            results.status = 1;
            if (userIndex == 0) {
                results.winner = games[game].users[1];
                results.loser = games[game].users[0];
            } else {
                results.winner = games[game].users[0];
                results.loser = games[game].users[1]; 
            }
        }
        var queries = [
            `UPDATE users SET score = score + ${score}, playedGames = playedGames + 1 WHERE id=${results.winner.id};`,
            `UPDATE users SET playedGames = playedGames + 1 WHERE id=${results.loser.id};`,
            `UPDATE rooms SET game='null' WHERE userID=${results.winner.id};`,
            `UPDATE rooms SET game='null' WHERE userID=${results.loser.id};`
        ]
        for (let i = 0; i < queries.length; i++) {
            db.query(queries[i], (err)=>{
                if (err) throw err;
            });
        }
    }
    return results;
}

module.exports = { checkFive, proccesWin };