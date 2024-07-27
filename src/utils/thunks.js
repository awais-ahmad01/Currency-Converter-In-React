
import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const apiKey = "59c2cd42d5bda1c236a20d7e";

const URL = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/EUR/GBP`;

const fetchData = createAsyncThunk(
    'Form/fetchData',
    async ()=>{

        try{

            const response = await axios.get(URL);

            return response;

        }
        catch(error){
            throw error
        }

    }
)