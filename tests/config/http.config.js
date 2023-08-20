async function HTTP_GET(realUrl,token = undefined) {
  const headers = {};
  headers['content-type'] = 'application/json';
  if(token != undefined)
    headers['Authorization'] = `Bearer ${token}`;
  
  const response = fetch(realUrl, {
    method: 'GET',
    headers: headers,
  }).then((res) => {
    let bodyPromise;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.indexOf('application/json') >= 0) {
      bodyPromise = res.json();
    } else {
      bodyPromise = res.text();
    }

    return bodyPromise.then((body) => {
      return {
        status: res.status,
        body: body
      };
    });
  });

  return response;
}



async function HTTP_POST(realUrl, body, token = undefined) {
  const headers = {};
  headers['content-type'] = 'application/json';
  if(token != undefined)
    headers['Authorization'] = `Bearer ${token}`;
  
  const response = fetch(realUrl, {
    method: 'POST',
    headers: headers,
    // The body is provided as a String to fetch, but we want to send 
    // JSON so produce a JSON string of our payload
    body: JSON.stringify(body)
  }).then((res) => {
    let bodyPromise;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.indexOf('application/json') >= 0) {
      bodyPromise = res.json();
    } else {
      bodyPromise = res.text();
    }

    return bodyPromise.then((body) => {
      return {
        status: res.status,
        body: body
      };
    });
  });

  return response;
}


async function HTTP_PUT(realUrl, body, token = undefined) {
  const headers = {};
  headers['content-type'] = 'application/json';
  if(token != undefined)
    headers['Authorization'] = `Bearer ${token}`;
  
  const response = fetch(realUrl, {
    method: 'PUT',
    headers: headers,
    // The body is provided as a String to fetch, but we want to send 
    // JSON so produce a JSON string of our payload
    body: JSON.stringify(body)
  }).then((res) => {
    let bodyPromise;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.indexOf('application/json') >= 0) {
      bodyPromise = res.json();
    } else {
      bodyPromise = res.text();
    }

    return bodyPromise.then((body) => {
      return {
        status: res.status,
        body: body
      };
    });
  });

  return response;
}

async function HTTP_DELETE(realUrl, token = undefined) {
  const headers = {};
  headers['content-type'] = 'application/json';
  if(token != undefined)
    headers['Authorization'] = `Bearer ${token}`;
  
  const response = fetch(realUrl, {
    method: 'DELETE',
    headers: headers,
  }).then((res) => {
    let bodyPromise;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.indexOf('application/json') >= 0) {
      bodyPromise = res.json();
    } else {
      bodyPromise = res.text();
    }

    return bodyPromise.then((body) => {
      return {
        status: res.status,
        body: body
      };
    });
  });

  return response;
}

module.exports =  {
  HTTP_GET,
  HTTP_POST,
  HTTP_PUT,
  HTTP_DELETE
};

