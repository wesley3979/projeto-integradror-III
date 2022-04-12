export const auth = (token) => {
  return{
    headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    }

  }
}