import axios from "axios";

axios.defaults.withCredentials = true; // Include cookies in requests

export default axios;