import { SecureStore } from 'expo';
const TOKEN_KEY="authToken"
const extractAuthToken = async () => {
    const token=  await SecureStore.getItemAsync(TOKEN_KEY);
    return token;
}

const saveAuthToken = async (token)=> {
    console.log("SAVING TOKEN");
    await SecureStore.setItemAsync(TOKEN_KEY,token);
} 


export {extractAuthToken,saveAuthToken};