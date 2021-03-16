import React from 'react';
import classes from '../../index.module.css';
import { drawTree,drawTreeNumber } from '../../../../modules/facetTree';
import { useEffect, useRef } from 'react';
import useCurrentSubjectDomainModel from '../../../../models/current-subject-domain';
import useConstructTypeModel from '../../../../models/construct-type';
import { useState } from 'react';
import YottaAPI from '../../../../apis/yotta-api';
import {ExclamationCircleOutlined,PlusOutlined} from '@ant-design/icons';
import { Card,Input,Modal, } from 'antd';
const topicsStyle = {
    width: '35%',
    height: '800px',
    overflow: 'auto',
    textAlign: 'center',
};
const treeStyle = {
    width: '50%',
    position: 'absolute',
    left: '40%',
    textAlign: 'center',
    top: '5px'
};

 

function Display() {
    
    
    const { currentSubjectDomain } = useCurrentSubjectDomainModel();
    const { constructType} = useConstructTypeModel();
    const [topics, settopics] = useState([]);
    const [topicsData,settopicsData] = useState();
    const [currentTopic, setcurrentTopic] = useState();
    const [treeData, settreeData] = useState();
    const textareaValueRef = useRef('');
   
    const [insertTopic1,setinsertTopic1] = useState();
    
    const [flag,setflag] = useState();
    const {confirm} = Modal;
    const {TextArea} = Input;
    console.log('hahahah',constructType);
    const onClickTopic = (topicName,e) => {
        setcurrentTopic(topicName);
    };
    function emptyChildren(dom) {
        const children = dom.childNodes;
        while (children.length > 0) {
            dom.removeChild(children[0]);
        }
    };
   const handleTextareaChange= (e)=>{
        textareaValueRef.current = e.target.value;
        // settextareaValue(e.target.value)
    }
    const onInsertTopic = () => {
        let currentTopic1 = '';    
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
                console.log('Topic1',Topic1);
                
            },
            onCancel() {
                
            }
        })
    }; 
    useEffect(()=>{
        async function insert(){
            await YottaAPI.insertTopic(currentSubjectDomain.domain,insertTopic1);
        }
        if(insertTopic1){
            insert(insertTopic1);
        }
    },[insertTopic1]) 
    const treeRef = useRef();
    useEffect(() => {   
        async function fetchTreeData(){
            const treeData = await YottaAPI.getCompleteTopicByTopicName(currentTopic);
            if(treeData){
                settreeData(treeData)
            }
        }
        fetchTreeData()
    }, [currentTopic]);
    // 画分面树
    useEffect(() => {
        if (treeRef && treeData) {
            drawTreeNumber(treeRef.current, treeData, d => { });
        }
    }, [treeData])
    // 获取一个课程下所有的主题数据
    useEffect(() => {
        async function fetchTopicsData() {
              const topicsData = await YottaAPI.getTopicsByDomainName(currentSubjectDomain.domain);
            settopicsData(topicsData);
            if(topicsData){
                setflag(topicsData.map((topic) => topic.assembleNumber));
                settopics(topicsData.map((topic) => topic.topicName));
            }
        }
        if (currentSubjectDomain.domain) {
            fetchTopicsData();
            setcurrentTopic('树状数组');
        }
    }, [insertTopic1])
    

   
   
    
    return (
        <>
            <Card className={classes.topicsStyle} extra={<PlusOutlined style={{top:'50px'}} onClick={onInsertTopic}/>} title="主题列表" style={topicsStyle}>
                {
                    topics.map(
                        (topicName, index) =>
                            (
                                <Card.Grid style={{ width: '100%', height: '80%',opacity:1}} onClick={onClickTopic.bind(null, topicName)} key={index}>{topicName}</Card.Grid>
                            )
                    )
                }
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

export default Display;
