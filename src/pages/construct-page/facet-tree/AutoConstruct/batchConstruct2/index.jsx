import React from 'react';
import { drawTree,drawTreeNumber } from '../../../../../modules/facetTree';
import { useEffect, useRef } from 'react';
import useCurrentSubjectDomainModel from '../../../../../models/current-subject-domain';
import { useState } from 'react';
import YottaAPI from '../../../../../apis/yotta-api';
import { Card,Input,Modal } from 'antd';
import DyGephi from '../../../../../components/DyGephi';
import { Alert } from 'antd';
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

function BatchConstruct2() {
  
    const { currentSubjectDomain } = useCurrentSubjectDomainModel();
    const [topics,settopics] = useState([]);
    const [topicList, settopicList] = useState([]);
    const [currentTopic, setcurrentTopic] = useState();
    const textareaValueRef = useRef('');
    const [insertTopic1,setinsertTopic1] = useState();
    const [learningPath,setlearningPath] = useState([]);
    const [gephi,setGephi] = useState();
    const [treeflag,settreeflag] = useState(true);
    const handleTextareaChange= (e)=>{
        textareaValueRef.current = e.target.value;
    }
    
    function emptyChildren(dom) {
        const children = dom.childNodes;
        while (children.length > 0) {
            dom.removeChild(children[0]);
        }
    };
    
    
    const treeRef = useRef();
    
    // 根据课程名获取主题列表
    useEffect(() => {
        async function fetchTopicsData() {
            const res = await YottaAPI.getDynamicTopics(currentSubjectDomain.subject,currentSubjectDomain.domain);
            const topicsData = res.data.data;
            if(topicsData){
                let topics = topicsData.map((topic) => topic.topicName);
                settopics(topics);       
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
                    if(result.code === 200 ){
                       emptyChildren(treeRef.current);
                       topicList.push(currentTopic);
                       settopicList(topicList);
                      
                       console.log('topicList',topicList);
                     
                       const index = topics.indexOf(currentTopic);
                       (index < topics.length) && (setcurrentTopic(topics[index+1])); 
                       clearInterval(myvar1);
                     }
                    else{
                        if (treeRef && treeData) {
                            if(treeData.childrenNumber === 0){
                                emptyChildren(treeRef.current); 
                                settreeflag(false);
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
   
    // 获取一个课程下画力导向图的数据
    useEffect(()=>{
        async function fetchDependencesMap(){
            await YottaAPI.getDomainGraph(currentSubjectDomain.domain).then(
                (res) => {
            
                    if(res){
                       
                        setGephi(res);
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
                  {(gephi&&topicList)?<DyGephi domainName={currentSubjectDomain.domain} gephi={gephi} topicList={topicList}/>:
                  <div>该学科没有图谱</div>
                  }
                </div>
            </Card>
            <Card title="主题分面树" style={treeStyle}>
                <Card.Grid style={{ width: '100%', height: '730px' }} >
                    {
                        (!treeflag)?(
                            <div ref={ref => treeRef.current = ref}>
                            <Alert
                            message="Informational Notes"
                            description="该主题下暂无数据."
                            type="info"
                            showIcon
                          />
                          </div>
                            
                        ):(
                            <svg ref={ref => treeRef.current = ref} id='tree' style={{ width: '100%', height: '700px' }}>
                             </svg>
                        )
                    }
                </Card.Grid>
            </Card>


        </>
    );
}

export default BatchConstruct2;
