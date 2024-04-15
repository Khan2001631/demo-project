import {useEffect, useRef, useState } from "react";
import Card from "../../../components/common/card/card";
import UserCard from "../../../components/common/user-card/user-card";
import { useAskChatGPTMutation } from "../../../api-integration/secure/secure";
import { useDispatch } from "react-redux";
import { fullPageLoader, updateAlertMessage } from "../../../api-integration/commonSlice";
import { convertMarkdownToHtml} from '../../../util/util'
import { FaTelegram } from 'react-icons/fa'; 

type historyMessage = {
    role: 'user' | 'assistant';
    content: string;
};

const SimpleChat: React.FC = () => {
    const dispatch = useDispatch();
    const [question, setQuestion] = useState("");
    const [tempQuestion, setTempQuestion] = useState("");
    const [allMessages, setAllMessages] = useState<historyMessage[]>([]);
    const [userFirstPromptId, setUserFirstPromptId] = useState(0);
    const [contextHistory, setContextHistory] = useState<historyMessage[]>([]);
    const lastMessageRef = useRef<HTMLParagraphElement>(null);

    const [getAnswerAPI, { data: chatGPTData, isLoading: isChatGPTLoading, isSuccess: isChatGPTSuccess, isError: isChatGPTError, error: ChatGPTError }] =
    useAskChatGPTMutation();

    useEffect(() => {
        if(isChatGPTSuccess || isChatGPTError || ChatGPTError) {
            dispatch(fullPageLoader(false));
        }
        if(chatGPTData) {
            if(chatGPTData?.success == true){
                dispatch(fullPageLoader(false));
                dispatch(updateAlertMessage({ status: 'success', message: chatGPTData?.message }));
            }
            else{
                dispatch(fullPageLoader(false));
                dispatch(updateAlertMessage({ status: 'error', message: chatGPTData?.message }));
            }
        }
    },[isChatGPTSuccess, isChatGPTError,ChatGPTError])
    
    useEffect(() => {
        if(chatGPTData)
        {
            let airesponse = convertMarkdownToHtml(chatGPTData?.AIRESPONSE, 'stdText');
            let messagesToSend: historyMessage[] = [
                ...contextHistory,
                {
                    role: 'user',
                    content: tempQuestion
                },
                {
                    role: 'assistant',
                    content:chatGPTData?.AIRESPONSE
                }
            ]
            let messagesToStore: historyMessage[] = [
                ...allMessages,
                {
                    role: 'user',
                    content: tempQuestion
                },
                {
                    role:'assistant',
                    content:airesponse
                }
            ]
            setAllMessages(messagesToStore)
            setContextHistory(messagesToSend)
            if(userFirstPromptId === 0)
                setUserFirstPromptId(chatGPTData?.USERPROMPTID);
        }
    },[isChatGPTSuccess, chatGPTData])

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest"
            });
        }
    }, [allMessages]);

    const handleSubmit = () => {
        dispatch(fullPageLoader(true));
        getAnswerAPI({
            "userPrompt": question,
            "ManualEffort": 0, 
            "accountType": "user", 
            "userFirstPromptId":userFirstPromptId, 
            "contextHistory":contextHistory
        })   
        setTempQuestion(question)
        setQuestion("")
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <>
        <div className="container">
            <div className="row d-flex mb-4">
                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                    <div className="mb-3">
                        <UserCard/>
                    </div>
                </div>
                <div className="col-xl-9  col-lg-9 col-md-9 col-sm-12">
                    <Card id="modal" cardHeightClass={'h-100'}  like={false} share={false} help={true} helpTitle={"Simple Chat"} helpContent={"Simple Chat content coming soon..."} titleType={1} title={"Simple Chat"} Feedback={true} logo={true}>
                        <div className="overflow-auto scrollbar h-35vh" 
                        >
                            {
                            allMessages.length === 0 ? (
                                <div>
                                    <p className="fw-bold">Simple Chat</p>    
                                    <p className=""> What can I do for you?</p>
                                </div>
                            ):(   
                            <div className="overflow-auto scrollbar" >
                            {
                                allMessages.map((msg: historyMessage, index: number) => (
                                    <div key={index}>
                                        {msg.role === 'user' ? <p className="fw-bold">You</p>: <p className="fw-bold">Assistant</p>}
                                        {msg.role === 'user' ? <p className="" ref={index === allMessages.length - 1 ? lastMessageRef : null}>{msg.content}</p> : <p dangerouslySetInnerHTML={{ __html: msg.content }} ref={index === allMessages.length - 1 ? lastMessageRef : null}></p>}         
                                    </div> 
                                ))
                            }
                            </div>     
                            )}
                        </div>
                        <div className="modal-footer fixed-bottom position-relative w-100">
                            <input 
                                type="text" 
                                className="form-control"
                                placeholder="Send a message..."
                                maxLength={4000} 
                                value={question || ""} 
                                onChange={(e) => setQuestion(e.target.value)} 
                                onKeyDown={handleKeyDown}
                            />
                            <button type="submit" className="btn btn-rounded-pill  position-absolute" onClick={handleSubmit}><FaTelegram color="#0077B5" size="1rem"/></button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
        </>
    )
}

export default SimpleChat;