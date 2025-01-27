import axios from "axios";

const API_URL = "http://10.168.236.29:8000/api"

export const get_images = async () => {
     console.log("Getting images...")
     const response = await axios.get(`${API_URL}/images`)
     // console.log(response)
     return response.data
}

export const pull_image = async (image_name) => {
    const response = await axios.post(`${API_URL}/imagepull`, { image_name })
    return response.data
}

export const push_image = async (image_name) => {
    const response = await axios.post(`${API_URL}/imagepush`, { image_name })
    return response.data
}

export const operate_image = async(id, action) =>{
    console.log(id, action)
    const response = await axios.post(`${API_URL}/image/${action}?image_id=${id}`);
    return response.data
}

export const run_container = async (formData) => {
    // const form_data = JSON.stringify(formData, null, 2)
    const response = await axios.post(`${API_URL}/imagerun`, formData)
    // console.log(response)
    return response.data
}

export const get_containers = async () => {
    const response = await axios.get(`${API_URL}/containers`)
    // console.log(response)
    return response.data
}

export const operate_container = async(id, action) =>{
    const response = await axios.post(`${API_URL}/container/${action}?container_id=${id}`)
    return response.data
}

export const commit_container = async(id, tag) =>{
    const response = await axios.post(`${API_URL}/containercommit`, { container_id: id,tag: tag})
    return response.data
}