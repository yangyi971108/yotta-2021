import React from 'react';

import useConstructTypeModel from '../../../models/construct-type';
import constructType from '../../../models/construct-type';
import AutoConstruct from '../facet-tree/AutoConstruct';
import Display from '../facet-tree/Display';
function FacetTree() {
    
    
    const {constructType} = useConstructTypeModel();
    return (
        <>
          {
          constructType === 'auto'?
          (
              <AutoConstruct/>
          ):
          (
              <Display/>
          )  
          }

        </>
    );
}

export default FacetTree;
// import React from 'react';
// import classes from './index.module.css';
// import { drawTree,drawTreeNumber } from '../../../modules/facetTree';
// import { useEffect, useRef } from 'react';
// import useCurrentSubjectDomainModel from '../../../models/current-subject-domain';
// import useConstructTypeModel from '../../../models/construct-type';
// import { useState } from 'react';
// import YottaAPI from '../../../apis/yotta-api';
// import {ExclamationCircleOutlined,PlusOutlined} from '@ant-design/icons';
// import { Card,Input,Modal, } from 'antd';
// import axios from 'axios';
// const topicsStyle = {
//     width: '35%',
//     height: '800px',
//     overflow: 'auto',
//     textAlign: 'center',
// };
// const treeStyle = {
//     width: '50%',
//     position: 'absolute',
//     left: '40%',
//     textAlign: 'center',
//     top: '5px'
// };

 

// function FacetTree() {
    
    
//     // const { currentSubjectDomain } = useCurrentSubjectDomainModel();
//     const { constructType} = useConstructTypeModel();
//     const [topics, settopics] = useState([]);
//     const [topicsData,settopicsData] = useState();
//     const [currentTopic, setcurrentTopic] = useState();
//     const [treeData, settreeData] = useState();
//     const textareaValueRef = useRef('');
//     // const [textareaValue,settextareaValue] = useState();
//     const [insertTopic1,setinsertTopic1] = useState();
//     // const [topicmap,settopicmap] = useState();
//     const [flag,setflag] = useState();
//     const {confirm} = Modal;
//     const {TextArea} = Input;
//     console.log('hahahah',constructType);
//     const onClickTopic = (topicName,e) => {
//         emptyChildren(treeRef.current);
//         setcurrentTopic(topicName);
//         // 闪烁效果 
//         e.persist();
//         let my = setInterval(() => {
//             let opacity = e.target.style.opacity;
//             e.target.style.opacity = 1-(+opacity||0)
//             e.target.style.color = 'red';     
//         }, 500);
//         var myvar1 = setInterval(
//             async function fetchTreeData() {
//              console.log('currentTopic',topicName);
//              if(currentSubjectDomain.domain && topicName) {
//                  const result = await YottaAPI.getDynamicTreeData(currentSubjectDomain.domain,topicName);
//                  console.log('result.code',result.code);
//                  if(result.code == 200 ){
//                       console.log('myvar1',myvar1);
//                       console.log('my',my);
//                       clearInterval(myvar1);
//                       clearInterval(my)
//                  }  
//              }
//              else{
//                  clearInterval(myvar1);
//              }
             
//          },10000)
//     };
//     function emptyChildren(dom) {
//         const children = dom.childNodes;
//         while (children.length > 0) {
//             dom.removeChild(children[0]);
//         }
//     };
//    const handleTextareaChange= (e)=>{
//         textareaValueRef.current = e.target.value;
//         // settextareaValue(e.target.value)
//     }
//     const onInsertTopic = () => {
//         let currentTopic1 = '';    
//         confirm({
//             title: '请输入主题名称',
//             icon: <ExclamationCircleOutlined/>,
//             content: <>
//                 <TextArea showCount maxLength={100} onChange={handleTextareaChange}/>
//             </>,
//             okText: '确定',
//             cancelText: '取消',
//             onOk() {
//                 const Topic1 = textareaValueRef.current;
//                 textareaValueRef.current = '';
//                 setinsertTopic1(Topic1); 
//                 console.log('Topic1',Topic1);
                
//             },
//             onCancel() {
                
//             }
//         })
//     }; 
//     useEffect(()=>{
//         async function insert(){
//             await YottaAPI.insertTopic(currentSubjectDomain.domain,insertTopic1);
//         }
//         if(insertTopic1){
//             insert(insertTopic1);
//         }
//     },[insertTopic1]) 
//     const treeRef = useRef();
//     useEffect(() => {   
//         var myvar = setInterval(
//            async function fetchTreeData() {
//             // const treeData = await YottaAPI.getCompleteTopicByTopicName(currentTopic);
//             console.log('currentTopic',currentTopic);
//             if(currentSubjectDomain.domain && currentTopic){
//                 const result = await YottaAPI.getDynamicTreeData(currentSubjectDomain.domain,currentTopic);
//                 const treeData = result.data;
//                 console.log('result.code',result.code);
//                 if(result.code == 200){
//                      clearInterval(myvar);
//                 }
//                 settreeData(treeData);
//             }
//             else{
//                 clearInterval(myvar);
//             }  
//         },10000)
//     }, [currentTopic]);
//     // 画分面树
//     useEffect(() => {
//         if (treeRef && treeData) {
//             if(treeData.childrenNumber == 0){
//                 emptyChildren(treeRef.current); 
//                 console.log('该主题下暂无数据');    
//             }
//             else{
//                 if(treeRef.current.childNodes.length === 0 ){
//                     console.log('调用drawTree函数')
//                     drawTree(treeRef.current,treeData,d => { });
//                  }
//                  else{
//                     console.log('调用drawTreeNumber函数')
//                     drawTreeNumber(treeRef.current, treeData, d => { });
//                  }
//             }
//         }
//     }, [treeData])
//     // 获取一个课程下所有的主题数据
//     useEffect(() => {
//         async function fetchTopicsData() {
//             //  const topicsData = await YottaAPI.getTopicsByDomainName(currentSubjectDomain.domain);
//             const res = await YottaAPI.getDynamicTopics(currentSubjectDomain.subject,currentSubjectDomain.domain);
//             const topicsData = res.data.data;
//             settopicsData(topicsData);
//             if(topicsData){
//                 setflag(topicsData.map((topic) => topic.assembleNumber));
//                 settopics(topicsData.map((topic) => topic.topicName));
//             }
//         }
//         if (currentSubjectDomain.domain) {
//             fetchTopicsData();
//             // setcurrentTopic('树状数组');
//         }
//     }, [insertTopic1])
    
//     // function initialFlag(){
//     //     let topicsMap = new Map();
//     //     for (let index in topics){
//     //         if(flag[index]!==null){
//     //             topicsMap.set(topics[index],1);
//     //         }
//     //         else{
//     //             topicsMap.set(topics[index],-1);
//     //         }
            
//     //     }
//     //     return topicsMap;
//     //     console.log('topicsMap',topicsMap);   
//     // }
//     // initialFlag()
    
//     // useEffect(()=>{
//     //     // 对topicmap赋值,{topicName:flag},初始值flag为-1
//     //     // let m = new Map();
//     //     // topics.map((topicName,index)=>{
            
//     //     //      m.set(topicName,-1);
           
//     //     //     console.log('m',m)
//     //     // })
//     //     settopicmap(topicsMap);
//     // },[currentTopic])
//     return (
//         <>
//             <Card className={classes.topicsStyle} extra={<PlusOutlined style={{top:'50px'}} onClick={onInsertTopic}/>} title="主题列表" style={topicsStyle}>
//                 {
//                     topics.map(
//                         (topicName, index) =>
//                             (
//                                 <Card.Grid style={{ width: '100%', height: '80%',opacity:1}} onClick={onClickTopic.bind(null, topicName)} key={index}>{topicName}</Card.Grid>
//                             )
//                     )
//                 }
//             </Card>
//             <Card title="主题分面树" style={treeStyle}>
//                 <Card.Grid style={{ width: '100%', height: '730px' }} >
//                     <svg ref={ref => treeRef.current = ref} id='tree' style={{ width: '100%', height: '700px' }}>
//                     </svg>
//                 </Card.Grid>
//             </Card>


//         </>
//     );
// }

// export default FacetTree;
