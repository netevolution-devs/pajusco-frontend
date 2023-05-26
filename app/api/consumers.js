import axios from "axios";

async function getAll(token, id) {
    const data = await axios.get(process.env.API_ENDPOINT + "/backoffice/clients/" + id + "/users",
        {
            headers: {
                "Accept": "application/json",
                "X-AUTH-TOKEN": token
            }
        });

    if (data.data.error) {
        return null;
    } else {
        return data?.data.data;
    }
}

async function modify(token, clientId, id, values) {
    values.authorized = values.authorized === "on" ? true : false;

    const data = await axios.put(process.env.API_ENDPOINT + "/backoffice/clients/" + clientId + "/users/" + id,
        {
            ...values,
        },
        {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-AUTH-TOKEN": token
            }
        });

    if (data.data.error) {
        return null;
    } else {
        return data?.data.data;
    }
}

export default { getAll, modify }