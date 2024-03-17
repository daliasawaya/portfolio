function loadLeaderboard() {
    let req = new XMLHttpRequest();
    req.open('GET', '/tops', false);
    req.send(null);
    console.log(req.responseText);
    let leaderboard = JSON.parse(req.responseText);
    leadArr = [];
    for (let i in leaderboard) {
        leadArr.push([i, leaderboard[i]]);
    }
    console.log(leadArr);
    let container = document.getElementById('top-10')
    leadArr.sort(function(a, b) {return b[1] - a[1]}).splice(0, 10).forEach(function(item) {
        let newItem = document.createElement('li');
        newItem.innerHTML = item[0] + ': ' + item[1] + ' wins';
        container.appendChild(newItem);
    });
}