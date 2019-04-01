export function addUser(userInfo) {
  return fetch(`https://${document.location.hostname}:8443/server/adduser`, {
    method: 'POST',
    body: JSON.stringify(userInfo),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export default addUser;
