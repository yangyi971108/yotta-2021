import React from 'react';
import { drawTree,drawTreeNumber } from '../../../../../modules/facetTree';
import { useEffect, useRef } from 'react';
import useCurrentSubjectDomainModel from '../../../../../models/current-subject-domain';
import { useState } from 'react';
import YottaAPI from '../../../../../apis/yotta-api';
import {ExclamationCircleOutlined,PlusOutlined} from '@ant-design/icons';
import { Card,Input,Modal } from 'antd';
import {drawDyMap} from '../../../../../modules/topicDependenceVisualization_DY';
import {drawMap} from '../../../../../modules/topicDependenceVisualization';
const mapStyle = {
    width:'50%',
    position:'absolute',
    left:'0%',
    textAlign:'center',
    top:'5px',
};
const treeStyle = {
    width: '47%',
    position: 'absolute',
    right:'0%',
    top:'5px',
    height:'810px',
    overflow: 'auto',
};


const {TextArea} = Input;
const {confirm} = Modal;

function BatchConstruct() {
  
    const { currentSubjectDomain } = useCurrentSubjectDomainModel();
    const [topics,settopics] = useState([]);

    const [topicId,settopicId] = useState();
    const [topicList, settopicList] = useState([]);
   
    const [currentTopic, setcurrentTopic] = useState();
    const textareaValueRef = useRef('');
    const [insertTopic1,setinsertTopic1] = useState();
    const [learningPath,setlearningPath] = useState([]);
    const mapRef = useRef();
    const treeRef1 = useRef();
    const map1 = useRef();
    const topicList1 = useRef();

    const [mapdata,setmapdata] = useState();
    const handleTextareaChange= (e)=>{
        textareaValueRef.current = e.target.value;
    }
    
    function emptyChildren(dom) {
        const children = dom.childNodes;
        while (children.length > 0) {
            dom.removeChild(children[0]);
        }
    };

    const onInsertTopic = () => {
        confirm({
            title: '请输入主题名称',
            icon: <ExclamationCircleOutlined/>,
            content: <>
                <TextArea showCount maxLength={100} onChange={handleTextareaChange}/>
            </>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                const Topic1 = textareaValueRef.current;
                textareaValueRef.current = '';
                setinsertTopic1(Topic1); 
            },
            onCancel() {
                
            }
        })
    }; 
    // 插入主题
    useEffect(()=>{
        async function insert(){
            await YottaAPI.insertTopic(currentSubjectDomain.domain,insertTopic1);
        }
        if(insertTopic1){
            insert(insertTopic1);
        }
    },[insertTopic1]) 

    const treeRef = useRef();
    
    // 根据课程名获取主题列表
    useEffect(() => {
        async function fetchTopicsData() {
            const res = await YottaAPI.getDynamicTopics(currentSubjectDomain.subject,currentSubjectDomain.domain);
            const topicsData = res.data.data;
            if(topicsData){
                let topics = topicsData.map((topic) => topic.topicName);
                let topicsId = topicsData.map((topic) => topic.topicId);
                let map = new Map();
                for(let i=0;i<topics.length;i++){
                    map.set(topics[i],topicsId[i]);
                }
                map1.current = map;
                
                settopics(topics);
                settopicId(topicsId);
                
            }
        }
        if (currentSubjectDomain.domain) {
            fetchTopicsData();
        }
    }, [currentSubjectDomain.subject,currentSubjectDomain.domain])
   
   
    // 主题列表更新后，给初始主题名称赋值
    useEffect(()=>{
        setcurrentTopic(topics[0]);
    },[topics])




    useEffect(() => { 
        console.log('当前正在构建的主题名称',currentTopic); 
        if(currentTopic){ 
            // 动态获取数据，直至返回状态为200
            var myvar1 = setInterval(
            async function fetchTreeData() {
             if(currentSubjectDomain.domain && currentTopic) {
                const result = await YottaAPI.getDynamicMulti(currentSubjectDomain.domain,currentTopic);
                if(result){
                    const treeData = result.data;
                   
                    const currentIndex = map1.current.get(currentTopic);
                    if(result.code === 200 ){
                       emptyChildren(treeRef.current);
                       topicList.push(currentIndex);
                       settopicList(topicList);
                       topicList1.current = topicList;
                       console.log('topicList1.current',topicList1.current);
                       const index = topics.indexOf(currentTopic);
                       (index < topics.length) && (setcurrentTopic(topics[index+1])); 
                       clearInterval(myvar1);
                       if(mapdata){
                        emptyChildren(mapRef.current);
                        drawDyMap(mapdata,mapRef.current,treeRef1.current,currentSubjectDomain.domain,learningPath,()=>{}, ()=>{},topicList1.current);}
                    }
                    else{
                        if (treeRef && treeData) {
                            if(treeData.childrenNumber === 0){
                                emptyChildren(treeRef.current); 
                                console.log('该主题下暂无数据');    
                            }
                            else{
                                if(treeRef.current.childNodes.length === 0){
                                   
                                    drawTree(treeRef.current,treeData,d => { });
                                 }
                                 else if(treeRef.current.childNodes.length !== 0){
                                    setTimeout(()=>{
                                       
                                        drawTreeNumber(treeRef.current, treeData, d => { });
                                    },3000)
                                 }
                                 else{
                
                                 }
                            }
                        }
                    }  
                 }
                
             }
             else{
                 clearInterval(myvar1);
             }
           },10000)
        }
    },[currentTopic])

    // 获取一个课程下画认知关系图的数据
    useEffect(()=>{
        async function fetchDependencesMap(){
            await YottaAPI.getMap(currentSubjectDomain.domain).then(
                (res) => {
                    if(res.data&&mapRef){
                        console.log('res.data',res.data);
                        setmapdata(res.data);
                        drawDyMap(res.data,mapRef.current,treeRef1.current,currentSubjectDomain.domain,learningPath,()=>{}, ()=>{},[]);
                    }
                }
            )
        }
        fetchDependencesMap();
    },[currentSubjectDomain.domain]);
    return (
        <>
           <Card title="主题间认知路径图" style={mapStyle}>
                <div style={{ width: '100%', height: '700px' }} >
                  <svg ref={ref => mapRef.current = ref} id='map' style={{ width: '100%',height:'100%' }}></svg>
                           <svg ref={ref=>treeRef1.current = ref} id='tree' style={{position:'absolute',left:'0',marginLeft:30,
            visibility: 'hidden',
            top: 10,
            marginTop: 56}}></svg>
                </div>
            </Card>
            <Card title="主题分面树" style={treeStyle}>
                <Card.Grid style={{ width: '100%', height: '730px' }} >
                    <svg ref={ref => treeRef.current = ref} id='tree' style={{ width: '100%', height: '700px' }}>
                    </svg>
                </Card.Grid>
            </Card>


        </>
    );
}

export default BatchConstruct;
