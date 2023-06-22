async function HTTP_POST(realUrl, body) {
  const headers = {};
  headers['content-type'] = 'application/json';

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


module.exports = HTTP_POST;

