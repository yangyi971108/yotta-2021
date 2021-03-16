import React from 'react';
import { useEffect, useRef } from 'react';
import {Select} from 'antd';
import BatchConstruct from '../AutoConstruct/batchConstruct';
import SingleConstruct from '../AutoConstruct/singleConstruct';
import { useState } from 'react';
import { SecurityScanTwoTone } from '@ant-design/icons';

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
           </Select>
           {
               type==="0"?(
                   <BatchConstruct/>
               ):
               (
                   <SingleConstruct/>
               )
           }
        </>
    );
}

export default AutoConstruct;
