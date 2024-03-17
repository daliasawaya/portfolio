function login() {
    let req = new XMLHttpRequest();
    req.open('POST', '/login', false);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({username: document.getElementById('username').value}));
    console.log(req.responseText);
    let resp = JSON.parse(req.responseText);
    if (resp.type == 'error') {
        document.getElementById('server-resp').innerHTML = 'Server: ' + resp.message;
    }else 
    location.replace('/');
}