
import axios from 'axios';

const BASE_URL = "http://localhost:8080";

class DTasgService {
    getSomething () {
        return axios.get(BASE_URL)
    }
}

export default new DTasgService()