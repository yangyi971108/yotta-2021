import React from 'react';
import { drawTree,drawTreeNumber } from '../../../../../modules/facetTree';
import { useEffect, useRef } from 'react';
import useCurrentSubjectDomainModel from '../../../../../models/current-subject-domain';
import { useState } from 'react';
import YottaAPI from '../../../../../apis/yotta-api';
import {ExclamationCircleOutlined,PlusOutlined} from '@ant-design/icons';
import { Card,Input,Modal, Select } from 'antd';
import {Menu,Dropdown,Button} from 'antd';
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

const {TextArea} = Input;
const {confirm} = Modal;

function BatchConstruct() {
   // console.log('程序处于批量更新页面')
    const { currentSubjectDomain } = useCurrentSubjectDomainModel();
    const [topics, settopics] = useState([]);
    const [topicsData,settopicsData] = useState();
    const [currentTopic, setcurrentTopic] = useState();
    const [treeData, settreeData] = useState();
    const textareaValueRef = useRef('');
    const [insertTopic1,setinsertTopic1] = useState();
    const [i,seti] = useState(0);
    // 将请求的状态码设置为全局状态
    const statusCode = useRef();
    // 设置一个全局的resultTree状态
    const resultTree = useRef();
    useEffect(() => { // 就这样改得了
        console.log(document.querySelector(`#topicitem-${topics[0]}`));
    }, [topics])
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
                console.log('Topic1',Topic1);
                
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
    
    useEffect(()=>{
        setcurrentTopic(topics[0]);
    },[topics])

    // useEffect(()=>{
    //     emptyChildren(treeRef.current) 
    //     setcurrentTopic(topics[i])
    // },[i])

    useEffect(() => {  
        // const topicNode1 = document.getElementById('topicitem-耦合 (概率)');
        // const topicNode2 = document.querySelector('#topicitem-重尾分布');
        // console.log('topicNode111111111',topicNode1);
        // console.log('topicNode222222222',topicNode2);
        // const topicNode = document.querySelector(`#topicitem-${currentTopic}`); // 然后改它的css
        const topicNode = document.getElementById(`topicitem-${currentTopic}`);
        console.log('topicNode',topicNode)
        if(topicNode){
            console.log("style",topicNode.style)
            let my = setInterval(() => {
               let opacity = topicNode.style.opacity;
               topicNode.style.opacity = 1-(+opacity||0)
               topicNode.style.color = 'red';     
            }, 500);
            var myvar1 = setInterval(
            async function fetchTreeData() {
             if(currentSubjectDomain.domain && currentTopic) {
                //  const result = await YottaAPI.getDynamicTreeData(currentSubjectDomain.domain,currentTopic,true);
                const result = await YottaAPI.getDynamicMulti(currentSubjectDomain.domain,currentTopic);
                resultTree.current = result;
                //  const result = resultTree.current;
                //  console.log('resulttttttt',result);
                 if(result){
                    console.log('result.code',result.code);
                    if(result.code == 200 ){
                       emptyChildren(treeRef.current)
                       topicNode.style.opacity = 1
                       topicNode.style.color = 'green'
                         clearInterval(myvar1);
                         clearInterval(my)
                    }  
                 }
             }
             else{
                 clearInterval(myvar1);
             }
           },10000)
        }
        
       
        var myvar = setInterval(
                    async function fetchTreeData() {
                     if(currentSubjectDomain.domain && currentTopic ){
                        //  const result = await YottaAPI.getDynamicTreeData(currentSubjectDomain.domain,currentTopic,true);
                        //  const result = await YottaAPI.getDynamicMulti(currentSubjectDomain.domain,currentTopic); 
                        // resultTree.current = result;
                        // console.log(resultTree.current)
                        
                         const result = resultTree.current;
                         if(result){
                            const treeData = result.data;
                            console.log('result.code',result.code);
                            statusCode.current = result.code
                            console.log('statusCode',statusCode.current);
                            const topicNode = document.getElementById(`topicitem-${currentTopic}`);
                            if(result.code === 200 && topicNode.style.color== 'green'){
                               clearInterval(myvar);
                               //   let j = i+1; 
                               //   seti(j);
                               emptyChildren(treeRef.current);
                               const index = topics.indexOf(currentTopic);
                               (index < topics.length) && (setcurrentTopic(topics[index+1])); 
                               
                            }
                            settreeData(treeData);
                         }
                         
                     }
                     else{
                         clearInterval(myvar);  
                     }  
        },10000)
    }, [currentTopic]);

    // 画分面树
    useEffect(() => {
        if (treeRef && treeData) {
            if(treeData.childrenNumber == 0){
                emptyChildren(treeRef.current); 
                console.log('该主题下暂无数据');    
            }
            else{
                if(treeRef.current.childNodes.length === 0 && statusCode.current !== 200){
                    console.log('调用drawTree函数')
                    drawTree(treeRef.current,treeData,d => { });
                 }
                 else if(treeRef.current.childNodes.length !== 0){
                    console.log('调用drawTreeNumber函数')
                    drawTreeNumber(treeRef.current, treeData, d => { });
                    if(statusCode.current === 200){
                        console.log('laaaaaaaaaaaaaaaaaa')
                       // emptyChildren(treeRef.current)
                    }
                 }
                 else{

                 }
            }
        }
    }, [treeData])
 
    // 获取一个课程下所有的主题数据
    useEffect(() => {
        async function fetchTopicsData() {
            const res = await YottaAPI.getDynamicTopics(currentSubjectDomain.subject,currentSubjectDomain.domain);
            const topicsData = res.data.data;
            settopicsData(topicsData);
            if(topicsData){
                let topics = topicsData.map((topic) => topic.topicName);
                console.log('qianqianqian',topics)
                topics = topics.filter((topic)=>topic!='B+树')
                console.log('houhouhou',topics)
                settopics(topics)
               // settopics(topicsData.map((topic) => topic.topicName));
            }
        }
        if (currentSubjectDomain.domain) {
            fetchTopicsData();
        }
    }, [insertTopic1])
    
   
    return (
        <>
            <Card  extra={<PlusOutlined style={{top:'50px'}} onClick={onInsertTopic}/>} title="主题列表" style={topicsStyle}>
                {
                    topics.map(
                        (topicName, index) =>
                            (
                                <Card.Grid style={{ width: '100%', height: '80%',opacity:1}} id={`topicitem-${topicName}`} key={index}>{topicName}</Card.Grid>
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

export default BatchConstruct;
