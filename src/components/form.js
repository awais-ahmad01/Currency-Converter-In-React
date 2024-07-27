import { useFormik } from "formik";
import * as Yup from 'yup';

// import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

// import { useDispatch } from "react-redux";

import { useEffect, useState } from "react";

import JSON from './db.json';


const Form = ()=>{


    const [conversion, setConversion] = useState("");

    const [submitAmount, setSubmitAmount] = useState("");

    const [list, setList] = useState(JSON);

    const [currencyList, setCurrencyList] = useState([]);

    // const [flagList, setFlagList] = useState([]);



    useEffect(()=>{

        // const newCurrencyList = [];

        // const fList = [];
        
        // for (const data in list) {
        //     newCurrencyList.push(data);

        //     fList.push(list[data]);
        // }

        const newCurrencyList = Object.keys(list);
        // const fList = Object.values(list);

        setCurrencyList(newCurrencyList);
        // setFlagList(fList)
    },[list])



    console.log(currencyList);

    // console.log(flagList)

    // const dispatch = useDispatch();
   
    const apiKey = "59c2cd42d5bda1c236a20d7e";

    const URL = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/`;

    const fetchData = async (from, to)=>{

            try{

                const response = await axios.get(`${URL}${from}/${to}`);

                // console.log(response);

                // const data = response.json();

                // return data;

                return response.data;

            }
            catch(error){
                throw error
            }

        
    }




    const formik = useFormik({
        initialValues:{amount:'', fromselect:'USD', toselect:'PKR' },
        validationSchema: Yup.object({
            amount: Yup.string()
            .required('Sorry, the amount is rquired!!!')
        }),
        onSubmit: async(values, {resetForm})=>{


            const data = await fetchData(values.fromselect, values.toselect)

            // console.log(data)


            setConversion(`${data.conversion_rate * values.amount}`);

            setSubmitAmount(values.amount);




            // .then((response)=>{
            //     const data = response.json();

            //     setConversion(`${data.conversion_rate * values.amount}`);

            // })
            // .catch((error)=>{
            //     throw error
            // })
        }
    })

    const msg = () => {
        return (
            <div className="msg-container">
                <p className="conversion-text">
                    {submitAmount} {formik.values.fromselect} = {conversion} {formik.values.toselect}
                </p>
            </div>
        );
    };


    const getFromFlag = ()=>{
        for(const data in list){
            if(data === formik.values.fromselect){
                return list[data]
            }
        }

        return null
    }

    const getToFlag = ()=>{
        for(const data in list){
            if(data === formik.values.toselect){
                return list[data]
            }
        }

        return null
    }
    



    return(
        <>

            <form onSubmit={formik.handleSubmit}>
                <div className="amount">
                <p>Enter Amount</p>
                <input type="text" name="amount" 
                    {...formik.getFieldProps('amount')}
                />
                {formik.errors.amount && formik.touched.amount?
                    <span>{formik.errors.amount}</span>
                    :null
                }
                </div>
                <div className="dropdown">
                <div className="from">
                    <p>From</p>
                    <div className="select-container">
                    <img className="from-img" src={`https://flagsapi.com/${getFromFlag()}/flat/64.png`}  alt=""/>
                    <select name="fromselect" className="select-from"              
                        {...formik.getFieldProps('fromselect')}
                        // value={formik.values.fromselect}
                        onChange={formik.handleChange}>
                        
                        {currencyList.map((currency, idx)=>(
                            <option key={idx} value={currency}>{currency}</option>
                        ))


                        }

                    </select>
                    </div>
                </div>
                <i className="fa-solid fa-arrow-right-arrow-left" id="arrow-icon"></i>
                <div className="to">
                    <p>To</p>
                    <div className="select-container">
                    <img className="to-img"  src={`https://flagsapi.com/${getToFlag()}/flat/64.png`} alt=""/>
                    <select name="toselect" className="select-to"
                         {...formik.getFieldProps('toselect')}
                        //  value={formik.values.toselect}
                         onChange={formik.handleChange}>
                        {currencyList.map((currency, idx)=>(
                            <option key={idx} value={currency}>{currency}</option>
                        ))
                        }
                    </select>
                    </div>
                </div>
                </div>
                {conversion ? msg():null}
                <button type="submit" className="btn">Get Exchange Rate</button>
            </form>
           
        </>
    )

}
export default Form;