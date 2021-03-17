import React from 'react';
import {Select} from 'antd';
import BatchConstruct from '../AutoConstruct/batchConstruct';
import SingleConstruct from '../AutoConstruct/singleConstruct';
import BatchConstruct2 from './batchConstruct2';
import { useState } from 'react';

const {Option} = Select;

 

function AutoConstruct() {
    
   const [type,settype] = useState();
   
   const handleType = (value)=>{
       console.log('value',value);
       settype(value);
   }
    
    
    return (
        <>
           
           <Select defaultValue="单个更新" style={{width:120,position:'absolute',left:'20px',top:'18px',zIndex:1}} onChange={handleType}>
               <Option value="0">批量更新</Option>
               <Option value="1">单个更新</Option>
               <Option value="2">批量更新2</Option>
           </Select>
           {
               type==="2"?(
                   <BatchConstruct2/>
               ):
               (
                   type==="0"?(
                    <BatchConstruct/>
                   ):
                   (
                       <SingleConstruct/>
                   )
               )
           }
        </>
    );
}

export default AutoConstruct;
