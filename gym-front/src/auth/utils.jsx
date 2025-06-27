import { parseJwt } from '../utils/utils';
import axios from 'axios';

const getToken = async (url, form_data) => {
    const result = await axios.post(url, form_data);
    const decoded = parseJwt(result.data.access_token);
    return new Promise((resolve, error) => {
            if (result)
                resolve({ data: { token: result.data.access_token, user_id: decoded.user_id, expire: decoded.exp } });
            else
                error(new Error());
        }
    );
}

export { getToken };