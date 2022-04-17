const session = require('express-session');
const { games } = require('./rooms');

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
                    console.log(amoba)

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

module.exports = { checkFive };